import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import TaskModal from '../components/TaskModal';
import BulkActionBar from '../components/BulkActionBar';
import ProgressRing from '../components/ProgressRing';
import { taskService, categoryService } from '../services';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'all'
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksResult);
      setCategories(categoriesResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully');
      setShowTaskModal(false);
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      if (!task.completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleBulkComplete = async () => {
    try {
      const updates = selectedTasks.map(taskId => {
        const task = tasks.find(t => t.id === taskId);
        return taskService.update(taskId, {
          completed: true,
          completedAt: new Date().toISOString()
        });
      });
      
      await Promise.all(updates);
      
      setTasks(prev => prev.map(task => 
        selectedTasks.includes(task.id) 
          ? { ...task, completed: true, completedAt: new Date().toISOString() }
          : task
      ));
      
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks completed! 🎉`);
    } catch (err) {
      toast.error('Failed to complete tasks');
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deletions = selectedTasks.map(taskId => taskService.delete(taskId));
      await Promise.all(deletions);
      
      setTasks(prev => prev.filter(t => !selectedTasks.includes(t.id)));
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks deleted`);
    } catch (err) {
      toast.error('Failed to delete tasks');
    }
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    const visibleTaskIds = filteredTasks.map(t => t.id);
    setSelectedTasks(prev => 
      prev.length === visibleTaskIds.length ? [] : visibleTaskIds
    );
  };

  const clearFilters = () => {
    setActiveFilters({
      category: 'all',
      priority: 'all',
      status: 'all'
    });
    setSearchQuery('');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeFilters.category === 'all' || task.category === activeFilters.category;
    const matchesPriority = activeFilters.priority === 'all' || task.priority === activeFilters.priority;
    const matchesStatus = activeFilters.status === 'all' || 
                         (activeFilters.status === 'completed' && task.completed) ||
                         (activeFilters.status === 'pending' && !task.completed);

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const todaysTasks = tasks.filter(task => !task.completed && task.dueDate && isToday(parseISO(task.dueDate)));
  const completedToday = tasks.filter(task => task.completed && task.completedAt && isToday(parseISO(task.completedAt)));
  const dailyProgress = todaysTasks.length === 0 ? 0 : Math.round((completedToday.length / (todaysTasks.length + completedToday.length)) * 100);

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = parseISO(dateString);
    
    if (isToday(date)) return { text: 'Today', color: 'text-primary' };
    if (isTomorrow(date)) return { text: 'Tomorrow', color: 'text-blue-600' };
    if (isPast(date)) return { text: 'Overdue', color: 'text-error' };
    
    return { text: format(date, 'MMM d'), color: 'text-gray-600' };
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high text-white';
      case 'medium': return 'priority-medium text-white';
      case 'low': return 'priority-low text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#6B7280';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-card"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-12"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  if (filteredTasks.length === 0 && tasks.length === 0) {
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
          <ApperIcon name="CheckSquare" className="w-20 h-20 text-primary mx-auto opacity-50" />
        </motion.div>
        <h3 className="mt-6 text-xl font-heading font-semibold text-gray-900">Ready to get organized?</h3>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          Start by creating your first task. Break down your goals into manageable steps and track your progress.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTaskModal(true)}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all shadow-lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5 inline mr-2" />
          Create Your First Task
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">Your Tasks</h1>
              <p className="text-gray-500 mt-1">
                {todaysTasks.length > 0 && `${todaysTasks.length} due today`}
              </p>
            </div>
            {todaysTasks.length > 0 && (
              <ProgressRing progress={dailyProgress} size={60} />
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all flex items-center space-x-2 shadow-lg"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Task</span>
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={activeFilters.category}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={activeFilters.priority}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={activeFilters.status}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            
            {(activeFilters.category !== 'all' || activeFilters.priority !== 'all' || activeFilters.status !== 'all' || searchQuery) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedTasks.length > 0 && (
          <BulkActionBar
            selectedCount={selectedTasks.length}
            onSelectAll={handleSelectAll}
            onBulkComplete={handleBulkComplete}
            onBulkDelete={handleBulkDelete}
            onClear={() => setSelectedTasks([])}
          />
        )}
      </AnimatePresence>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="mt-4 px-4 py-2 text-primary hover:text-primary/80 transition-colors"
          >
            Clear filters
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => {
            const dueDate = formatDueDate(task.dueDate);
            const isSelected = selectedTasks.includes(task.id);
            
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
                onClick={() => handleSelectTask(task.id)}
              >
                <div className="flex items-start space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(task.id);
                    }}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
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
                  </motion.button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-medium text-gray-900 break-words ${
                        task.completed ? 'line-through text-gray-500' : ''
                      }`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectTask(task.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          className="text-gray-400 hover:text-error transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
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
          })}
        </div>
      )}

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <TaskModal
            onClose={() => setShowTaskModal(false)}
            onSubmit={handleCreateTask}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;