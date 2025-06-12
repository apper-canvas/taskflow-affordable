import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import { motion } from 'framer-motion';

const FormField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  options, // For select
  rows,    // For textarea
  as = 'input', // 'input', 'select', 'textarea'
  className = '',
  labelClassName = '',
  inputClassName = '',
  ...props
}) => {
  const renderField = () => {
    switch (as) {
      case 'select':
        return (
          <Select
            id={id}
            value={value}
            onChange={onChange}
            className={inputClassName}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={inputClassName}
            {...props}
          />
        );
      case 'input':
      default:
        return (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputClassName} ${error ? 'border-error focus:ring-error focus:border-error' : 'border-gray-300'}`}
            {...props}
          />
        );
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}>
          {label}
        </label>
      )}
      {renderField()}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-error text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FormField;