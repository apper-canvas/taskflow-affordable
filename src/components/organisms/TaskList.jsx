import { motion } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskList = ({
  tasks,
  selectedTasks,
  onToggleComplete,
  onDeleteTask,
  onSelectTask,
  clearFilters,
  formatDueDate,
  getPriorityStyles,
  getCategoryColor,
}) => {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        <Button
          motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
          onClick={clearFilters}
          className="mt-4 text-primary hover:text-primary/80 !bg-transparent"
        >
          Clear filters
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          isSelected={selectedTasks.includes(task.id)}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTask}
          onSelect={onSelectTask}
          formatDueDate={formatDueDate}
          getPriorityStyles={getPriorityStyles}
          getCategoryColor={getCategoryColor}
          index={index}
        />
      ))}
    </div>
  );
};

export default TaskList;