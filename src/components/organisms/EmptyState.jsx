import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({
  iconName,
  iconColor,
  title,
  description,
  buttonText,
  onButtonClick
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={iconName} className={`w-20 h-20 ${iconColor} mx-auto opacity-50`} />
      </motion.div>
      <h3 className="mt-6 text-xl font-heading font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500 max-w-md mx-auto">
        {description}
      </p>
      {buttonText && onButtonClick && (
        <Button
          motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
          onClick={onButtonClick}
          className="mt-6 bg-primary text-white hover:brightness-110 shadow-lg px-6 py-3"
        >
          <ApperIcon name="Plus" className="w-5 h-5 inline mr-2" />
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;