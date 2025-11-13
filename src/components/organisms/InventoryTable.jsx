import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const InventoryTable = ({ products, onUpdateQuantity, onDeleteProduct, onEditProduct }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (product) => {
    setEditingId(product.Id);
    setEditValue(product.quantity.toString());
  };

  const handleSaveEdit = async (productId) => {
    const newQuantity = parseInt(editValue);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    try {
      await onUpdateQuantity(productId, newQuantity);
      setEditingId(null);
      toast.success("Quantity updated successfully");
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const getStockStatus = (product) => {
    if (product.quantity === 0) {
      return <Badge variant="danger">Out of Stock</Badge>;
    }
    if (product.quantity <= product.lowStockThreshold) {
      return <Badge variant="warning">Low Stock</Badge>;
    }
    return <Badge variant="success">In Stock</Badge>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product, index) => (
              <motion.tr
                key={product.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-600 line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700">{product.sku}</td>
                <td className="px-6 py-4">
                  <Badge variant="primary">{product.category}</Badge>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {editingId === product.Id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 text-center"
                        min="0"
                      />
                      <Button
                        onClick={() => handleSaveEdit(product.Id)}
                        variant="success"
                        size="sm"
                      >
                        <ApperIcon name="Check" className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="ghost"
                        size="sm"
                      >
                        <ApperIcon name="X" className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold">{product.quantity}</span>
                      <Button
                        onClick={() => handleStartEdit(product)}
                        variant="ghost"
                        size="sm"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">{getStockStatus(product)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => onEditProduct(product)}
                      variant="ghost"
                      size="sm"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDeleteProduct(product.Id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;