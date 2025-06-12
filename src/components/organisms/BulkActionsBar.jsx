import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const BulkActionsBar = ({
  selectedCount,
  onSelectAll,
  onBulkComplete,
  onBulkDelete,
  onClear
}) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-primary text-white rounded-lg p-4 mb-6 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
            </span>

            <Button
              motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
              onClick={onSelectAll}
              className="text-white/80 hover:text-white text-sm !p-0 !bg-transparent"
            >
              Select All
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
              onClick={onBulkComplete}
              className="bg-white/20 hover:bg-white/30 flex items-center space-x-1"
            >
              <ApperIcon name="Check" className="w-4 h-4" />
              <span className="text-sm">Complete</span>
            </Button>

            <Button
              motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
              onClick={onBulkDelete}
              className="bg-error/80 hover:bg-error flex items-center space-x-1"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              <span className="text-sm">Delete</span>
            </Button>

            <Button
              motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
              onClick={onClear}
              className="text-white/60 hover:text-white ml-2 !p-0 !bg-transparent"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionsBar;