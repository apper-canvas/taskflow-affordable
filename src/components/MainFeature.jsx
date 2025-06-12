import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import TaskModal from './TaskModal';

const MainFeature = ({ tasks, onCreateTask, categories }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateTask = (taskData) => {
    onCreateTask(taskData);
    setShowModal(false);
  };

  const todaysTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

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
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-center p-6 bg-surface-50 rounded-lg"
        >
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Clock" className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{todaysTasks.length}</div>
          <div className="text-sm text-gray-600">Pending Tasks</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-center p-6 bg-surface-50 rounded-lg"
        >
          <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{completedTasks.length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-center p-6 bg-surface-50 rounded-lg"
        >
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Target" className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </motion.div>
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="px-8 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all shadow-lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5 inline mr-2" />
          Create New Task
        </motion.button>
      </div>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTask}
          categories={categories}
        />
      )}
    </div>
  );
};

export default MainFeature;