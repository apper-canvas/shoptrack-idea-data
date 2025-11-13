import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-primary-200"
        >
          <span className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            404
          </span>
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-slate-600">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")} variant="primary">
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Go Home
          </Button>
          <Button onClick={() => navigate(-1)} variant="secondary">
            <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;