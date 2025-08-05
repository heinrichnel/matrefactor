import React from 'react';

interface InputProps {
  label: React.ReactNode;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string | false;
  onBlur?: () => void;
  step?: string;
  min?: string;
  disabled?: boolean;
  className?: string;
  name?: string; // <--- Added the 'name' prop here
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  error,
  onBlur,
  step,
  min,
  disabled,
  className = '',
  name // <--- Destructured the 'name' prop here
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e)}
      placeholder={placeholder}
      required={required}
      onBlur={onBlur}
      step={step}
      min={min}
      disabled={disabled}
      name={name} // <--- Passed the 'name' prop to the input element
      className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

interface SelectOption {
  value: string;
  label: React.ReactNode;
}

interface SelectProps {
  label: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string | false;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  name?: string; // <--- Added the 'name' prop here
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options = [],
  required,
  error,
  onBlur,
  disabled,
  className = '',
  name // <--- Destructured the 'name' prop here
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e)}
      required={required}
      onBlur={onBlur}
      disabled={disabled}
      name={name} // <--- Passed the 'name' prop to the select element
      className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    >
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>{option.label}</option>
      ))}
    </select>
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string | false;
  disabled?: boolean;
  className?: string;
  name?: string; // <--- Added the 'name' prop here
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
  error,
  disabled,
  className = '',
  name // <--- Destructured the 'name' prop here
}) => (
  <div className="flex flex-col">
    {label && (
      <label className="mb-1 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      name={name} // <--- Passed the 'name' prop to the textarea element
      className={`border rounded p-2 focus:ring ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

export { TextArea as Textarea };

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: FileList | null) => void;
  error?: string | false;
  className?: string;
  name?: string; // <--- Added the 'name' prop here
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple,
  onFileSelect,
  error,
  className = '',
  name // <--- Destructured the 'name' prop here
}) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1 font-medium">{label}</label>}
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={(e) => onFileSelect(e.target.files)}
      name={name} // <--- Passed the 'name' prop to the input element
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0 file:text-sm file:font-medium
        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
        file:cursor-pointer cursor-pointer"
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

// Default export optional
export default {
  Input,
  Select,
  TextArea,
  FileUpload
};
