import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
  outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400',
  success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm leading-4',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  fullWidth,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`;

  return (
    <button
      className={classes}
      disabled={isLoading || props.disabled}
      onClick={onClick}
      {...props}
    >
      {isLoading && <span className="loader" />}
      {icon && <span className="icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;