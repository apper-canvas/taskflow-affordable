import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { AnimatePresence } from 'framer-motion';

import TaskFormModal from '@/components/organisms/TaskFormModal';
import BulkActionsBar from '@/components/organisms/BulkActionsBar';
import TaskList from '@/components/organisms/TaskList';
import TaskFilters from '@/components/organisms/TaskFilters';
import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import TaskHeader from '@/components/organisms/TaskHeader';
import { taskService, categoryService } from '@/services';

const HomePage = () => {
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

  const showClearFiltersButton = activeFilters.category !== 'all' || activeFilters.priority !== 'all' || activeFilters.status !== 'all' || searchQuery;
  const allTasksEmpty = tasks.length === 0;
  const filteredTasksEmpty = filteredTasks.length === 0;

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (allTasksEmpty) {
    return (
      <EmptyState
        iconName="CheckSquare"
        iconColor="text-primary"
        title="Ready to get organized?"
        description="Start by creating your first task. Break down your goals into manageable steps and track your progress."
        buttonText="Create Your First Task"
        onButtonClick={() => setShowTaskModal(true)}
      />
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <TaskHeader
        todaysTasksCount={todaysTasks.length}
        dailyProgress={dailyProgress}
        onAddTaskClick={() => setShowTaskModal(true)}
      />

      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        categories={categories}
        clearFilters={clearFilters}
        showClearButton={showClearFiltersButton}
      />

      <BulkActionsBar
        selectedCount={selectedTasks.length}
        onSelectAll={handleSelectAll}
        onBulkComplete={handleBulkComplete}
        onBulkDelete={handleBulkDelete}
        onClear={() => setSelectedTasks([])}
      />

      {filteredTasksEmpty ? (
        <TaskList
          tasks={[]} // Pass empty to render the "No tasks found" state
          clearFilters={clearFilters}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          selectedTasks={selectedTasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onSelectTask={handleSelectTask}
          formatDueDate={formatDueDate}
          getPriorityStyles={getPriorityStyles}
          getCategoryColor={getCategoryColor}
        />
      )}

      {showTaskModal && (
        <TaskFormModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          categories={categories}
        />
      )}
    </div>
  );
};

export default HomePage;