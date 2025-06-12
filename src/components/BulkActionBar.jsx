import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const BulkActionBar = ({ 
  selectedCount, 
  onSelectAll, 
  onBulkComplete, 
  onBulkDelete, 
  onClear 
}) => {
  return (
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
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelectAll}
          className="text-white/80 hover:text-white transition-colors text-sm"
        >
          Select All
        </motion.button>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBulkComplete}
          className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-all flex items-center space-x-1"
        >
          <ApperIcon name="Check" className="w-4 h-4" />
          <span className="text-sm">Complete</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBulkDelete}
          className="px-3 py-1 bg-error/80 hover:bg-error rounded-lg transition-all flex items-center space-x-1"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
          <span className="text-sm">Delete</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          className="text-white/60 hover:text-white transition-colors ml-2"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BulkActionBar;