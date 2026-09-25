import React from 'react';
import { cn } from '../../utils';

export type BadgeVariant = 'confirmed' | 'arrived' | 'in-service';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'confirmed', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold text-[10px] uppercase tracking-[0.6px] px-[9px] py-[3px] rounded-full whitespace-nowrap',
          {
            'bg-[#e4f0e9] text-[#23694d]': variant === 'confirmed',
            'bg-[#fef3d4] text-[#8a6012]': variant === 'arrived',
            'bg-clay-s text-[#a04028] gap-[5px]': variant === 'in-service',
          },
          className,
        )}
        {...props}
      >
        {variant === 'in-service' && (
          <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse shrink-0" />
        )}
        {children}
      </span>
    );
  },
);
Badge.displayName = 'Badge';
