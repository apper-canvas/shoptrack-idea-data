import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import CartSidebar from "@/components/organisms/CartSidebar";
import productService from "@/services/api/productService";

const Layout = () => {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "customer";
  });
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.Id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.Id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.Id, quantity, priceAtAdd: product.price }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Outlet context={{ viewMode, cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart, products, setCartOpen }} />
      </main>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        products={products}
      />
    </div>
  );
};

export default Layout;