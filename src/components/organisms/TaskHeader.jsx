import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressRing from '@/components/atoms/ProgressRing';

const TaskHeader = ({
  todaysTasksCount,
  dailyProgress,
  onAddTaskClick
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Your Tasks</h1>
            <p className="text-gray-500 mt-1">
              {todaysTasksCount > 0 && `${todaysTasksCount} due today`}
            </p>
          </div>
          {todaysTasksCount > 0 && (
            <ProgressRing progress={dailyProgress} size={60} />
          )}
        </div>

        <Button
          motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
          onClick={onAddTaskClick}
          className="bg-primary text-white hover:brightness-110 flex items-center space-x-2 shadow-lg"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Task</span>
        </Button>
      </div>
    </div>
  );
};

export default TaskHeader;