import type React from 'react';
import { cn } from '../../utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> & {
  Text: typeof SkeletonText;
  Circle: typeof SkeletonCircle;
  Card: typeof SkeletonCard;
  Table: typeof SkeletonTable;
} = ({ className, variant = 'pulse', ...props }) => {
  return (
    <div
      className={cn(
        'bg-slate-200/80 rounded-xl',
        variant === 'pulse'
          ? 'animate-pulse'
          : 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent',
        className,
      )}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3.5 rounded-md', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
};

export const SkeletonCircle: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return <Skeleton className={cn('rounded-full shrink-0', sizeClasses[size], className)} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'p-5 bg-white rounded-3xl border border-slate-200/80 space-y-3.5 shadow-xs',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-1/3 rounded-lg" />
        <SkeletonCircle size="sm" />
      </div>
      <Skeleton className="h-8 w-1/2 rounded-xl" />
      <Skeleton className="h-3 w-2/3 rounded-md" />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 5,
  cols = 4,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs',
        className,
      )}
    >
      <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 rounded-md" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="h-14 flex items-center px-6 gap-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-3.5 flex-1 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

Skeleton.Text = SkeletonText;
Skeleton.Circle = SkeletonCircle;
Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;
