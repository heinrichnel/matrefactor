import { useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
}

export const Select = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  className = "",
}: SelectProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        className={`block text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"}`}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "bg-gray-100 text-gray-500" : "bg-white text-gray-900"
        } ${isFocused ? "border-blue-500" : "border-gray-300"}`}
      >
        <option value="">-- Select --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
