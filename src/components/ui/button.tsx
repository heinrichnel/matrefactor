import { cn } from "@/utils/cn";
import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500":
              variant === "default",
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500":
              variant === "destructive",
            "border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-gray-500":
              variant === "outline",
            "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500":
              variant === "secondary",
            "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500":
              variant === "ghost",
            "text-blue-600 hover:underline": variant === "link",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 px-3 text-sm": size === "sm",
            "h-12 px-6 text-lg": size === "lg",
            "h-9 w-9 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Default handler for when onClick is not provided
const ButtonWithHandler = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }
  };

  return <Button {...props} onClick={handleClick} ref={ref} />;
});

ButtonWithHandler.displayName = "ButtonWithHandler";

export { Button, ButtonWithHandler as DefaultButton };
