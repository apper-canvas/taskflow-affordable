import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ iconName, iconBgColor, value, label }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="text-center p-6 bg-surface-50 rounded-lg"
    >
      <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
        <ApperIcon name={iconName} className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  );
};

export default StatCard;