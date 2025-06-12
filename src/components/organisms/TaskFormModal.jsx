import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const TaskFormModal = ({ onClose, onSubmit, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0]?.name || 'Work', // Default to first category or 'Work'
    priority: 'medium',
    dueDate: ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const getPriorityButtonClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high text-white';
      case 'medium': return 'priority-medium text-white';
      case 'low': return 'priority-low text-white';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-gray-900">
                Create New Task
              </h2>
              <Button
                motionProps={{ whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 } }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors !p-0 !bg-transparent"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Task Title *"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
                placeholder="Enter task title..."
              />

              <FormField
                label="Description"
                id="description"
                as="textarea"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                placeholder="Add description (optional)..."
              />

              <FormField
                label="Category"
                id="category"
                as="select"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorityOptions.map(({ value, label }) => (
                    <Button
                      key={value}
                      type="button"
                      motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
                      onClick={() => handleChange('priority', value)}
                      className={`px-3 py-2 text-sm font-medium ${
                        formData.priority === value
                          ? getPriorityButtonClass(value)
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <FormField
                label="Due Date"
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
                  type="submit"
                  className="flex-1 bg-primary text-white hover:brightness-110"
                >
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskFormModal;