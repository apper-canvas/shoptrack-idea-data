import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ProductCard = ({ product, onAddToCart, onViewDetails, isManager = false }) => {
  const getStockBadge = () => {
    if (product.quantity === 0) {
      return <Badge variant="danger">Out of Stock</Badge>;
    }
    if (product.quantity <= product.lowStockThreshold) {
      return <Badge variant="warning">Low Stock ({product.quantity})</Badge>;
    }
    return <Badge variant="success">In Stock ({product.quantity})</Badge>;
  };

  const handleAddToCart = () => {
    if (product.quantity === 0) {
      toast.error("This product is out of stock");
      return;
    }
    onAddToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          {getStockBadge()}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 mb-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">SKU: {product.sku}</span>
            <Badge variant="primary">{product.category}</Badge>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          
          <div className="flex gap-2">
            {!isManager && (
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="sm"
                disabled={product.quantity === 0}
              >
                <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-1" />
                Add
              </Button>
            )}
            <Button
              onClick={() => onViewDetails(product)}
              variant="ghost"
              size="sm"
            >
              <ApperIcon name="Eye" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;