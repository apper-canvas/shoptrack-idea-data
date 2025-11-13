import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Package",
  title = "No items found", 
  message = "Get started by adding your first item",
  actionLabel,
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[50vh] flex items-center justify-center p-8"
    >
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-50 to-primary-100"
        >
          <ApperIcon name={icon} className="w-12 h-12 text-primary-500" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="text-slate-600">{message}</p>
        </div>

        {actionLabel && onAction && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;