'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border p-4 pr-6 shadow-elegant transition-all animate-slide-up',
  {
    variants: {
      variant: {
        default: 'border-secondary-200 bg-white text-secondary-900',
        destructive: 'border-red-200 bg-red-50 text-red-900',
        success: 'border-green-200 bg-green-50 text-green-900',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
        info: 'border-blue-200 bg-blue-50 text-blue-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  onClose?: () => void;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { className, variant, onClose, title, description, action, ...props },
    ref,
  ) => {
    const Icon = {
      default: Info,
      success: CheckCircle,
      warning: AlertTriangle,
      destructive: AlertCircle,
      info: Info,
    }[variant || 'default'];

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            {title && <div className="text-sm font-semibold">{title}</div>}
            {description && (
              <div className="text-sm opacity-90">{description}</div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {action}
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
);
Toast.displayName = 'Toast';

export { Toast, toastVariants };
