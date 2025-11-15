import React from "react";
import { clsx } from "clsx";
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";

export interface AlertProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info";
  title?: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, variant = "info", title, onClose, className }) => {
  const variants = {
    success: {
      container: "bg-success-50 border-success-500 text-success-800",
      icon: <FiCheckCircle className='w-5 h-5 text-success-500' />,
      title: "text-success-800",
    },
    warning: {
      container: "bg-warning-50 border-warning-500 text-warning-800",
      icon: <FiAlertCircle className='w-5 h-5 text-warning-500' />,
      title: "text-warning-800",
    },
    danger: {
      container: "bg-danger-50 border-danger-500 text-danger-800",
      icon: <FiXCircle className='w-5 h-5 text-danger-500' />,
      title: "text-danger-800",
    },
    info: {
      container: "bg-primary-50 border-primary-500 text-primary-800",
      icon: <FiInfo className='w-5 h-5 text-primary-500' />,
      title: "text-primary-800",
    },
  };

  const config = variants[variant];

  return (
    <div className={clsx("border-l-4 p-4 rounded-lg", config.container, className)} role='alert'>
      <div className='flex items-start'>
        <div className='flex-shrink-0'>{config.icon}</div>
        <div className='ml-3 flex-1'>
          {title && <h3 className={clsx("font-semibold", config.title)}>{title}</h3>}
          <div className={title ? "mt-2" : ""}>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className='ml-3 inline-flex flex-shrink-0 focus:outline-none'
            aria-label='Close alert'
          >
            <FiXCircle className='w-5 h-5' />
          </button>
        )}
      </div>
    </div>
  );
};
