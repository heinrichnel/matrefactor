import React from "react";
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariant = NonNullable<typeof buttonVariants>;
export type ButtonSize = NonNullable<typeof buttonVariants>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "default";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
  outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-400",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400",
  success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
  default: "bg-gray-900 text-white hover:bg-gray-800",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm leading-4",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-2 text-base",
};

export const Button = ({
  variant = "primary",
  size = "md",
  icon,
  isLoading,
  fullWidth,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 btn-hover-effect";
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""}`;

  return (
    <button className={classes} disabled={isLoading || props.disabled} onClick={onClick} {...props}>
      {isLoading && <span className="loader" />}
      {icon && <span className="icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
