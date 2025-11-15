import React from "react";
import { clsx } from "clsx";

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = "info",
  size = "md",
  showLabel = false,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const variants = {
    success: "bg-success-500",
    warning: "bg-warning-500",
    danger: "bg-danger-500",
    info: "bg-primary-500",
  };

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-4",
  };

  return (
    <div className={className}>
      <div className={clsx("bg-gray-200 rounded-full overflow-hidden", sizes[size])}>
        <div
          className={clsx("h-full transition-all duration-300", variants[variant])}
          style={{ width: `${percentage}%` }}
          role='progressbar'
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <p className='text-xs text-gray-600 mt-1'>
          {value} / {max} ({Math.round(percentage)}%)
        </p>
      )}
    </div>
  );
};
