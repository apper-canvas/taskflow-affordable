import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';

const TaskCard = ({
  task,
  isSelected,
  onToggleComplete,
  onDelete,
  onSelect,
  formatDueDate,
  getPriorityStyles,
  getCategoryColor,
  index,
}) => {
  const dueDate = formatDueDate(task.dueDate);

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      className={`bg-white rounded-xl p-6 shadow-card transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''
      } ${task.completed ? 'opacity-75' : ''}`}
      onClick={() => onSelect(task.id)}
    >
      <div className="flex items-start space-x-4">
        <Button
          motionProps={{ whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 } }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            task.completed
              ? 'bg-success border-success text-white'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" className="w-3 h-3" />
            </motion.div>
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-medium text-gray-900 break-words ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>

            <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
              <Checkbox
                checked={isSelected}
                onChange={() => onSelect(task.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                motionProps={{ whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 } }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="text-gray-400 hover:text-error !p-0 !bg-transparent"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {task.description && (
            <p className={`text-sm text-gray-600 mb-3 break-words ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getCategoryColor(task.category) }}
            >
              {task.category}
            </span>

            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyles(task.priority)}`}>
              {task.priority}
            </span>

            {dueDate && (
              <span className={`text-xs font-medium ${dueDate.color}`}>
                {dueDate.text}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;