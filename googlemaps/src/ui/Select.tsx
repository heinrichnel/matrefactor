import React, { forwardRef, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    options,
    label,
    error,
    fullWidth = false,
    size = 'md',
    helperText,
    className = '',
    containerClassName = '',
    labelClassName = '',
    id: externalId,
    disabled,
    required,
    ...props
  }, ref) => {
    const internalId = useId();
    const id = externalId || `select-${internalId}`;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const sizeClasses = {
      sm: 'py-1 px-2 text-sm',
      md: 'py-2 px-3',
      lg: 'py-3 px-4 text-lg',
    };

    return (
      <div className={`${containerClassName} ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={id}
            className={`block mb-1 font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'} ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          className={`
            block border rounded-md shadow-sm
            ${sizeClasses[size]}
            ${fullWidth ? 'w-full' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' :
              'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          disabled={disabled}
          required={required}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-1 text-sm text-red-600" id={errorId}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500" id={helperId}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
