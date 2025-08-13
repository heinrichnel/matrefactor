import React, { useState, useEffect, forwardRef, useRef } from "react";
import { format, isValid, parse } from "date-fns";

interface DatePickerProps {
  id?: string;
  name?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  showClearButton?: boolean;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((
  {
    id,
    name,
    value,
    onChange,
    label,
    placeholder = "DD/MM/YYYY",
    disabled = false,
    className = "",
    error,
    required = false,
    format: dateFormat = "dd/MM/yyyy",
    minDate,
    maxDate,
    showClearButton = true,
  },
  ref
) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize input value from date prop
  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, dateFormat));
    } else {
      setInputValue("");
    }
  }, [value, dateFormat]);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse the input as a date
    if (newValue) {
      const parsedDate = parse(newValue, dateFormat, new Date());
      if (isValid(parsedDate)) {
        if (
          (!minDate || parsedDate >= minDate) &&
          (!maxDate || parsedDate <= maxDate)
        ) {
          onChange?.(parsedDate);
        }
      } else {
        onChange?.(null);
      }
    } else {
      onChange?.(null);
    }
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    onChange?.(null);
  };

  const generateCalendar = () => {
    // In a real implementation, this would generate a calendar UI
    // For now, this is a placeholder
    return (
      <div className="p-4 bg-white text-gray-700">
        Calendar implementation will go here
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            ${error ? "border-red-500" : "border-gray-300"}
            ${disabled ? "bg-gray-100 text-gray-500" : "bg-white text-gray-900"}
          `}
          aria-invalid={error ? "true" : "false"}
        />

        {showClearButton && inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear date"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <button
          type="button"
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${disabled ? "" : "hover:text-gray-600"}`}
          disabled={disabled}
          onClick={handleInputClick}
          aria-label="Toggle calendar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            ref={calendarRef}
            className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
          >
            {generateCalendar()}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

DatePicker.displayName = "DatePicker";

export default DatePicker;
