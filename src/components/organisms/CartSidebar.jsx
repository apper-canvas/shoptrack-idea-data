import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, products }) => {
  const navigate = useNavigate();

  const getProductDetails = (productId) => {
    return products.find((p) => p.Id === productId);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = getProductDetails(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Shopping Cart</h2>
                <Badge variant="primary">{cartItems.length}</Badge>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="ShoppingCart" className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Your cart is empty</p>
                  <Button onClick={onClose} variant="primary" className="mt-4">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const product = getProductDetails(item.productId);
                  if (!product) return null;

                  return (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="bg-slate-50 rounded-lg p-4"
                    >
                      <div className="flex gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-2">
                            ${product.price.toFixed(2)} each
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                              variant="ghost"
                              size="sm"
                              disabled={item.quantity <= 1}
                            >
                              <ApperIcon name="Minus" className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                              variant="ghost"
                              size="sm"
                              disabled={item.quantity >= product.quantity}
                            >
                              <ApperIcon name="Plus" className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => onRemoveItem(item.productId)}
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">
                            ${(product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-200 p-6 space-y-4 bg-gradient-to-t from-slate-50 to-white">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <Button onClick={handleCheckout} variant="primary" className="w-full py-3">
                  <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;