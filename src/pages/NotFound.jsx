import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="FileQuestion" className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/tasks')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all shadow-lg"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 inline mr-2" />
          Back to Tasks
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;