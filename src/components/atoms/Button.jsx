import { motion } from 'framer-motion';

const Button = ({ children, className = '', motionProps = {}, ...props }) => {
  return (
    <motion.button
      className={`px-4 py-2 rounded-lg transition-all ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;