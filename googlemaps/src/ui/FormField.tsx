import React from 'react';
import { twMerge } from 'tailwind-merge';

type BaseFormFieldProps = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  errorClassName?: string;
};

type InputFieldProps = BaseFormFieldProps & {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time' | 'datetime-local';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number | string;
  max?: number | string;
};

type SelectFieldProps = BaseFormFieldProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
};

type TextAreaFieldProps = BaseFormFieldProps & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
};

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  min,
  max,
  className,
  labelClassName,
  inputWrapperClassName,
  errorClassName,
}) => {
  return (
    <div className={twMerge("mb-4", className)}>
      <label
        htmlFor={id}
        className={twMerge("block text-sm font-medium text-gray-700 mb-1", labelClassName)}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={twMerge("relative", inputWrapperClassName)}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={twMerge(
            "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
            error ? "border-red-300" : "border-gray-300",
            disabled ? "bg-gray-100 text-gray-500" : "bg-white"
          )}
        />
      </div>
      {error && <p className={twMerge("mt-1 text-sm text-red-600", errorClassName)}>{error}</p>}
    </div>
  );
};

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
  disabled,
  className,
  labelClassName,
  inputWrapperClassName,
  errorClassName,
}) => {
  return (
    <div className={twMerge("mb-4", className)}>
      <label
        htmlFor={id}
        className={twMerge("block text-sm font-medium text-gray-700 mb-1", labelClassName)}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={twMerge("relative", inputWrapperClassName)}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={twMerge(
            "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
            error ? "border-red-300" : "border-gray-300",
            disabled ? "bg-gray-100 text-gray-500" : "bg-white"
          )}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className={twMerge("mt-1 text-sm text-red-600", errorClassName)}>{error}</p>}
    </div>
  );
};

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  rows = 4,
  className,
  labelClassName,
  inputWrapperClassName,
  errorClassName,
}) => {
  return (
    <div className={twMerge("mb-4", className)}>
      <label
        htmlFor={id}
        className={twMerge("block text-sm font-medium text-gray-700 mb-1", labelClassName)}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={twMerge("relative", inputWrapperClassName)}>
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={twMerge(
            "w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500",
            error ? "border-red-300" : "border-gray-300",
            disabled ? "bg-gray-100 text-gray-500" : "bg-white"
          )}
        />
      </div>
      {error && <p className={twMerge("mt-1 text-sm text-red-600", errorClassName)}>{error}</p>}
    </div>
  );
};

export const CheckboxField: React.FC<Omit<BaseFormFieldProps, 'required'> & {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  id,
  label,
  checked,
  onChange,
  error,
  disabled,
  className,
  labelClassName,
  errorClassName,
}) => {
  return (
    <div className={twMerge("mb-4 flex items-start", className)}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={twMerge(
            "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded",
            disabled && "bg-gray-100"
          )}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={id}
          className={twMerge("font-medium text-gray-700", labelClassName, disabled && "text-gray-500")}
        >
          {label}
        </label>
        {error && <p className={twMerge("mt-1 text-sm text-red-600", errorClassName)}>{error}</p>}
      </div>
    </div>
  );
};
