import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[50vh] flex items-center justify-center p-8"
    >
      <div className="text-center space-y-6 max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100"
        >
          <ApperIcon name="AlertCircle" className="w-10 h-10 text-red-500" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900">Oops!</h3>
          <p className="text-slate-600">{message}</p>
        </div>

        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorView;