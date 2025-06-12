import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <Button
        motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
        onClick={onRetry}
        className="bg-primary text-white hover:brightness-110"
      >
        Try Again
      </Button>
    </motion.div>
  );
};

export default ErrorState;