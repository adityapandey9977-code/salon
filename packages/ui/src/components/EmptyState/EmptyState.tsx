import { Inbox } from 'lucide-react';
import type React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="w-8 h-8 text-slate-400" />,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  compact = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full bg-white rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center text-center shadow-xs',
        compact ? 'p-6 py-8 space-y-2.5' : 'p-8 py-14 space-y-3.5',
        className,
      )}
    >
      <div
        className={cn(
          'rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-2xs',
          compact ? 'w-12 h-12' : 'w-16 h-16',
        )}
      >
        {icon}
      </div>

      <div className="space-y-1 max-w-sm">
        <h3
          className={cn(
            'font-serif font-bold text-slate-900 tracking-tight',
            compact ? 'text-sm' : 'text-base',
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="pt-1">
          <Button
            variant="primary"
            onClick={onAction}
            className="text-xs px-4 py-2.5 rounded-xl shadow-xs"
          >
            {actionIcon}
            <span>{actionLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
