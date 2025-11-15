import React from "react";
import { clsx } from "clsx";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", size = "md", className }) => {
  const variants = {
    success: "bg-success-100 text-success-700 border-success-200",
    warning: "bg-warning-100 text-warning-700 border-warning-200",
    danger: "bg-danger-100 text-danger-700 border-danger-200",
    info: "bg-primary-100 text-primary-700 border-primary-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-semibold rounded-full border",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
