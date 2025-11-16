import React, { forwardRef } from "react";
import { clsx } from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {label}
            {props.required && <span className='text-danger-500 ml-1'>*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            "input-field",
            error && "border-danger-500 focus:ring-danger-500 focus:border-danger-500",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className='mt-1 text-sm text-danger-500'>{error}</p>}
        {helperText && !error && <p className='mt-1 text-xs text-gray-500'>{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
