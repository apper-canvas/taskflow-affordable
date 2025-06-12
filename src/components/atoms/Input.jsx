const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${className}`}
      {...props}
    />
  );
};

export default Input;