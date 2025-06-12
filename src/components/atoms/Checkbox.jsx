const Checkbox = ({ className = '', ...props }) => {
  return (
    <input
      type="checkbox"
      className={`rounded border-gray-300 text-primary focus:ring-primary ${className}`}
      {...props}
    />
  );
};

export default Checkbox;