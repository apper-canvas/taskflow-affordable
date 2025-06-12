import { motion } from 'framer-motion';

const LoadingState = ({ count = 5 }) => {
  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingState;