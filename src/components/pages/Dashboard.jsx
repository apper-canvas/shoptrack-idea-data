import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import orderService from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatsCard from "@/components/molecules/StatsCard";
import OrderCard from "@/components/molecules/OrderCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const Dashboard = () => {
  const { viewMode } = useOutletContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, ordersData] = await Promise.all([
        productService.getAll(),
        orderService.getRecentOrders(5),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (viewMode === "customer") {
      navigate("/products");
    }
  }, [viewMode, navigate]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.Id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  const stats = {
    totalProducts: products.length,
    lowStockCount: products.filter((p) => p.quantity <= p.lowStockThreshold).length,
    outOfStockCount: products.filter((p) => p.quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    processingOrders: orders.filter((o) => o.status === "processing").length,
  };

  const lowStockProducts = products.filter((p) => p.quantity <= p.lowStockThreshold && p.quantity > 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
            <p className="text-primary-100">Welcome back! Here's what's happening with your inventory.</p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="LayoutDashboard" className="w-16 h-16 opacity-20" />
          </div>
        </div>
      </motion.div>

      {/* Alert Banner */}
      {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 rounded-lg p-6 shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-200 rounded-lg">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">Inventory Alert</h3>
              <p className="text-amber-700">
                {stats.outOfStockCount > 0 && (
                  <span className="font-medium">{stats.outOfStockCount} product{stats.outOfStockCount !== 1 ? "s" : ""} out of stock. </span>
                )}
                {stats.lowStockCount > 0 && (
                  <span className="font-medium">{stats.lowStockCount} product{stats.lowStockCount !== 1 ? "s" : ""} running low. </span>
                )}
                Review inventory levels to avoid stockouts.
              </p>
            </div>
            <Button onClick={() => navigate("/products")} variant="secondary" size="sm">
              View Inventory
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon="Package"
          gradient="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon="AlertCircle"
          gradient="from-amber-500 to-amber-600"
        />
        <StatsCard
          title="Out of Stock"
          value={stats.outOfStockCount}
          icon="XCircle"
          gradient="from-red-500 to-red-600"
        />
        <StatsCard
          title="Inventory Value"
          value={`$${stats.totalValue.toFixed(0)}`}
          icon="DollarSign"
          gradient="from-green-500 to-green-600"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon="Clock"
          gradient="from-purple-500 to-purple-600"
        />
        <StatsCard
          title="Processing Orders"
          value={stats.processingOrders}
          icon="Loader"
          gradient="from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Low Stock Products */}
      {lowStockProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Low Stock Products</h2>
            <Button onClick={() => navigate("/products")} variant="ghost">
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">SKU</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {lowStockProducts.map((product) => (
                    <tr key={product.Id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="font-medium text-slate-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{product.sku}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-amber-600">{product.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">{product.lowStockThreshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Recent Orders</h2>
            <Button onClick={() => navigate("/orders")} variant="ghost">
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.Id}
                order={order}
                onViewDetails={() => navigate(`/orders`)}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;