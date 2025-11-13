import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import ProductGrid from "@/components/organisms/ProductGrid";
import InventoryTable from "@/components/organisms/InventoryTable";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Products = () => {
  const { viewMode, addToCart, setCartOpen } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setCartOpen(true);
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewDetails = (product) => {
    toast.info(`Product details modal would open for: ${product.name}`);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const updated = await productService.updateQuantity(productId, newQuantity);
      setProducts((prev) =>
        prev.map((p) => (p.Id === productId ? updated : p))
      );
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await productService.delete(productId);
      setProducts((prev) => prev.filter((p) => p.Id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleEditProduct = (product) => {
    toast.info(`Edit modal would open for: ${product.name}`);
  };

  if (loading) return <Loading type={viewMode === "manager" ? "table" : "grid"} />;
  if (error) return <ErrorView message={error} onRetry={loadProducts} />;
  if (products.length === 0) {
    return (
      <Empty
        icon="Package"
        title="No products available"
        message="Start by adding your first product to the inventory"
        actionLabel={viewMode === "manager" ? "Add Product" : null}
        onAction={viewMode === "manager" ? () => toast.info("Add product modal would open") : null}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {viewMode === "manager" ? "Inventory Management" : "Browse Products"}
          </h1>
          <p className="text-slate-600 mt-1">
            {viewMode === "manager"
              ? "Manage your product inventory and stock levels"
              : "Discover amazing products and add them to your cart"}
          </p>
        </div>
        {viewMode === "manager" && (
          <Button onClick={() => toast.info("Add product modal would open")} variant="primary">
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {viewMode === "manager" ? (
        <InventoryTable
          products={products}
          onUpdateQuantity={handleUpdateQuantity}
          onDeleteProduct={handleDeleteProduct}
          onEditProduct={handleEditProduct}
        />
      ) : (
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          isManager={false}
        />
      )}
    </div>
  );
};

export default Products;