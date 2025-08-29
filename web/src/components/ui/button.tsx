import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer border  hover:bg-sky-100 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary-600 hover:bg-sky-100 shadow-elegant active:scale-[0.98]',
        secondary:
          'bg-secondary-100  hover:bg-sky-100 text-secondary-600 shadow-elegant active:scale-[0.98]',
        ghost:
          'text-secondary-700 hover:bg-secondary-500 hover:text-secondary-900',
        outline: 'bg-white text-secondary-900 shadow-elegant ',
        accent:
          'bg-accent-500 text-accent-950 shadow-elegant hover:shadow-elegant-lg active:scale-[0.98]',
        destructive:
          'bg-red-600 text-white shadow-elegant hover:bg-red-700 hover:shadow-elegant-lg active:scale-[0.98]',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 py-1 text-xs',
        lg: 'h-13 px-8 py-3 text-base',
        xl: 'h-16 px-12 py-4 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
