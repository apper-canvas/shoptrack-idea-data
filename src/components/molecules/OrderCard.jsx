import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const OrderCard = ({ order, onViewDetails, onUpdateStatus }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "processing":
        return <Badge variant="info">Processing</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">Order #{order.Id}</h3>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-slate-600">
            <ApperIcon name="Calendar" className="w-4 h-4 inline mr-1" />
            {format(new Date(order.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            ${order.totalAmount.toFixed(2)}
          </p>
          <p className="text-sm text-slate-600">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onViewDetails(order)} variant="secondary" size="sm">
          <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
          View Details
        </Button>
        {order.status === "pending" && onUpdateStatus && (
          <Button 
            onClick={() => onUpdateStatus(order.Id, "processing")} 
            variant="primary" 
            size="sm"
          >
            <ApperIcon name="Play" className="w-4 h-4 mr-2" />
            Process
          </Button>
        )}
        {order.status === "processing" && onUpdateStatus && (
          <Button 
            onClick={() => onUpdateStatus(order.Id, "completed")} 
            variant="success" 
            size="sm"
          >
            <ApperIcon name="Check" className="w-4 h-4 mr-2" />
            Complete
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default OrderCard;