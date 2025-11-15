import React, { forwardRef } from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {label}
            {props.required && <span className='text-danger-500 ml-1'>*</span>}
          </label>
        )}
        <div className='relative'>
          {icon && <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>{icon}</div>}
          <input
            ref={ref}
            className={clsx(
              "input-field",
              icon && "pl-10",
              error && "border-danger-500 focus:ring-danger-500 focus:border-danger-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className='mt-1 text-sm text-danger-500'>{error}</p>}
        {helperText && !error && <p className='mt-1 text-xs text-gray-500'>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
