const Select = ({ className = '', ...props }) => {
  return (
    <select
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none ${className}`}
      {...props}
    />
  );
};

export default Select;