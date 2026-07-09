import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  leftIcon,
  ...props
}) => {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-colors flex items-center justify-center',
        {
          'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
          'border border-light-gray text-dark hover:bg-light-hover': variant === 'outline',
          'text-dark-gray hover:bg-light-hover': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};
