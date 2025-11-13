import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ProductGrid = ({ products, onAddToCart, onViewDetails, isManager = false }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const uniqueCategories = ["All", ...new Set(products.map(p => p.category))];
    setCategories(uniqueCategories);
  }, [products]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search products by name, SKU, or description..."
              onSearch={setSearchTerm}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="sm"
            >
              <ApperIcon name="Grid3x3" className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "primary" : "ghost"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Showing <span className="font-semibold">{filteredProducts.length}</span> product
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Products Grid/List */}
      <motion.div
        layout
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.Id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
              isManager={isManager}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductGrid;