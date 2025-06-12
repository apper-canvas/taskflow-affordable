import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskOverview = ({
  pendingTasksCount,
  completedTasksCount,
  completionRate,
  onCreateTaskClick,
}) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          Task Overview
        </h2>
        <p className="text-gray-600">
          Stay on top of your daily productivity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          iconName="Clock"
          iconBgColor="bg-primary"
          value={pendingTasksCount}
          label="Pending Tasks"
        />

        <StatCard
          iconName="CheckCircle"
          iconBgColor="bg-success"
          value={completedTasksCount}
          label="Completed"
        />

        <StatCard
          iconName="Target"
          iconBgColor="bg-accent"
          value={`${completionRate}%`}
          label="Completion Rate"
        />
      </div>

      <div className="text-center">
        <Button
          motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
          onClick={onCreateTaskClick}
          className="px-8 py-3 bg-primary text-white hover:brightness-110 shadow-lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5 inline mr-2" />
          Create New Task
        </Button>
      </div>
    </div>
  );
};

export default TaskOverview;