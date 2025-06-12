import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const TaskFilters = ({
  searchQuery,
  setSearchQuery,
  activeFilters,
  setActiveFilters,
  categories,
  clearFilters,
  showClearButton
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={activeFilters.category}
          onChange={(e) => setActiveFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>

        <Select
          value={activeFilters.priority}
          onChange={(e) => setActiveFilters(prev => ({ ...prev, priority: e.target.value }))}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <Select
          value={activeFilters.status}
          onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>

        {showClearButton && (
          <Button
            motionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800 !p-0 !bg-transparent"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;