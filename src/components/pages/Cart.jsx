import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import orderService from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, products, updateCartQuantity, removeFromCart, clearCart } = useOutletContext();

  const getProductDetails = (productId) => {
    return products.find((p) => p.Id === productId);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = getProductDetails(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cartItems,
        totalAmount: total,
      };
      
      const newOrder = await orderService.create(orderData);
      toast.success(`Order #${newOrder.Id} placed successfully!`);
      clearCart();
      navigate("/orders");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <Empty
        icon="ShoppingCart"
        title="Your cart is empty"
        message="Add some products to get started with your order"
        actionLabel="Browse Products"
        onAction={() => navigate("/products")}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        <p className="text-slate-600 mt-1">Review your items and proceed to checkout</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = getProductDetails(item.productId);
            if (!product) return null;

            return (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-6">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-lg font-bold text-primary-600">
                        ${product.price.toFixed(2)}
                      </span>
                      
                      <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                        <Button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
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
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          variant="ghost"
                          size="sm"
                          disabled={item.quantity >= product.quantity}
                        >
                          <ApperIcon name="Plus" className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        onClick={() => removeFromCart(item.productId)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                      ${(product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (10%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-2xl bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleCheckout} variant="primary" className="w-full py-3 mb-3">
              <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
              Place Order
            </Button>

            <Button onClick={() => navigate("/products")} variant="secondary" className="w-full">
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>

            <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="flex items-start gap-3">
                <ApperIcon name="Shield" className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-semibold mb-1">Secure Checkout</p>
                  <p>Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;