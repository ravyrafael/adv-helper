import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showPercentage?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value = 0, max = 100, showPercentage = false, ...props },
    ref,
  ) => {
    const percentage = Math.round((value / max) * 100);

    return (
      <div ref={ref} className={cn('relative w-full', className)} {...props}>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-200">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && (
          <span className="absolute -top-6 right-0 text-xs font-medium text-secondary-600">
            {percentage}%
          </span>
        )}
      </div>
    );
  },
);
Progress.displayName = 'Progress';

export { Progress };
