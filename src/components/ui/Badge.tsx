import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  label: string | number;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  className,
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full";
  
  const variantStyles = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    success: "bg-success-light text-success dark:bg-green-800 dark:text-green-100",
    error: "bg-error-light text-error dark:bg-red-800 dark:text-red-100",
    warning: "bg-warning-light text-warning dark:bg-yellow-800 dark:text-yellow-100",
    info: "bg-info-light text-info dark:bg-indigo-800 dark:text-indigo-100",
  };
  
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };
  
  return (
    <span
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {label}
    </span>
  );
};