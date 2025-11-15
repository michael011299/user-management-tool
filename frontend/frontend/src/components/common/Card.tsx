import React from "react";
import { clsx } from "clsx";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, title, subtitle, action }) => {
  return (
    <div className={clsx("card", className)}>
      {(title || subtitle || action) && (
        <div className='flex items-start justify-between mb-4'>
          <div>
            {title && <h3 className='text-xl font-bold text-gray-800'>{title}</h3>}
            {subtitle && <p className='text-sm text-gray-600 mt-1'>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
