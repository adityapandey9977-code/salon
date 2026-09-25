import type React from 'react';
import { cn } from '../../utils';

export type StatusType =
  | 'confirmed'
  | 'arrived'
  | 'in-service'
  | 'completed'
  | 'cancelled'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive'
  | 'overdue'
  | 'critical'
  | 'warning'
  | 'success'
  | 'info'
  | 'vip'
  | 'draft'
  | string;

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  label?: React.ReactNode;
  showDot?: boolean;
  pulseDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showDot = true,
  pulseDot,
  size = 'md',
  className,
  ...props
}) => {
  const normalized = String(status)
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

  const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    confirmed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    arrived: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    'in-service': {
      bg: 'bg-purple-50',
      text: 'text-[#5A2EA6]',
      border: 'border-[#5A2EA6]/25',
      dot: 'bg-[#5A2EA6]',
    },
    completed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    cancelled: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    approved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    rejected: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    inactive: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
    critical: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    overdue: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    info: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      dot: 'bg-sky-500',
    },
    vip: {
      bg: 'bg-gradient-to-r from-amber-50 to-amber-100/60',
      text: 'text-amber-900 font-black',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
    },
    draft: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
  };

  const style = statusStyles[normalized] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-[9.5px] px-2 py-0.5 gap-1',
    md: 'text-[10.5px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2',
  };

  const isPulsing = pulseDot ?? (normalized === 'in-service' || normalized === 'pending');

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-full border whitespace-nowrap select-none',
        style.bg,
        style.text,
        style.border,
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            style.dot,
            isPulsing && 'animate-pulse',
          )}
        />
      )}
      <span>{label || status}</span>
    </span>
  );
};
