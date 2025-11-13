import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="h-16 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gradient-to-r from-primary-100 to-primary-50 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/2 mb-3 animate-pulse" />
            <div className="h-8 bg-gradient-to-r from-primary-100 to-primary-50 rounded w-3/4 animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <svg
          className="animate-spin h-12 w-12 text-primary-600 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;