import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Header = ({ viewMode, setViewMode, cartItemCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewModeToggle = () => {
    const newMode = viewMode === "manager" ? "customer" : "manager";
    setViewMode(newMode);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navItems = viewMode === "manager" 
    ? [
        { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
        { label: "Products", path: "/products", icon: "Package" },
        { label: "Orders", path: "/orders", icon: "ShoppingBag" },
      ]
    : [
        { label: "Shop", path: "/", icon: "Store" },
        { label: "Products", path: "/products", icon: "Package" },
        { label: "Cart", path: "/cart", icon: "ShoppingCart", badge: cartItemCount },
      ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <ApperIcon name="Package" className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              ShopTrack Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 text-slate-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <Badge variant="primary" className="animate-pulse">
                    {item.badge}
                  </Badge>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* View Mode Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleViewModeToggle}
              variant="secondary"
              size="sm"
              className="hidden md:flex"
            >
              <ApperIcon 
                name={viewMode === "manager" ? "User" : "Settings"} 
                className="w-4 h-4 mr-2" 
              />
              {viewMode === "manager" ? "Customer View" : "Manager View"}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">{item.label}</span>
                  {item.badge > 0 && (
                    <Badge variant="primary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              <div className="pt-2">
                <Button
                  onClick={handleViewModeToggle}
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                >
                  <ApperIcon 
                    name={viewMode === "manager" ? "User" : "Settings"} 
                    className="w-4 h-4 mr-2" 
                  />
                  {viewMode === "manager" ? "Customer View" : "Manager View"}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;