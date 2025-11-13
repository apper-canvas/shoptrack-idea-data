import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import orderService from "@/services/api/orderService";
import OrderCard from "@/components/molecules/OrderCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

const Orders = () => {
  const { viewMode } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
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

  const handleViewDetails = (order) => {
    toast.info(`Order details modal would open for Order #${order.Id}`);
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter((o) => o.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadOrders} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
        <p className="text-slate-600 mt-1">Track and manage customer orders</p>
      </div>

      {orders.length === 0 ? (
        <Empty
          icon="ShoppingBag"
          title="No orders yet"
          message="Orders will appear here once customers start shopping"
        />
      ) : (
        <>
          {/* Status Filters */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  variant={filterStatus === status ? "primary" : "ghost"}
                  size="sm"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                </Button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.Id}
                order={order}
                onViewDetails={handleViewDetails}
                onUpdateStatus={viewMode === "manager" ? handleUpdateStatus : null}
              />
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-slate-600">No orders found with status: {filterStatus}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;