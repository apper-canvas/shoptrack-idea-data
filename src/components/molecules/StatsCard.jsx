import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ title, value, icon, trend, gradient = "from-primary-500 to-primary-600" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <ApperIcon 
                name={trend.isPositive ? "TrendingUp" : "TrendingDown"} 
                className={`w-4 h-4 mr-1 ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
              />
              <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;