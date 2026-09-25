import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import type React from 'react';
import { cn } from '../../utils';

export interface MetricTrend {
  value: string | number;
  isPositive?: boolean | null;
  label?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: MetricTrend;
  comparison?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  variant?: 'default' | 'purple' | 'emerald' | 'rose' | 'amber' | 'sky';
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  comparison,
  subtitle,
  badge,
  variant = 'default',
  onClick,
  className,
}) => {
  const iconVariants = {
    default: 'bg-slate-100 text-slate-700',
    purple: 'bg-[#5A2EA6]/10 text-[#5A2EA6]',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    rose: 'bg-rose-500/10 text-rose-600',
    amber: 'bg-amber-500/10 text-amber-600',
    sky: 'bg-sky-500/10 text-sky-600',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4.5 rounded-[22px] bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between transition-all duration-200 text-left',
        onClick && 'cursor-pointer hover:shadow-md hover:border-[#5A2EA6]/30',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </span>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {icon && (
          <div
            className={cn(
              'w-8 h-8 rounded-xl grid place-items-center shrink-0 shadow-2xs',
              iconVariants[variant],
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-[24px] font-bold font-serif text-slate-900 tracking-tight">
          {value}
        </div>

        {(trend || comparison || subtitle) && (
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-semibold pt-0.5">
            {trend && (
              <div
                className={cn(
                  'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold',
                  trend.isPositive === true
                    ? 'bg-emerald-50 text-emerald-700'
                    : trend.isPositive === false
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-slate-100 text-slate-600',
                )}
              >
                {trend.isPositive === true ? (
                  <TrendingUp className="w-3 h-3" />
                ) : trend.isPositive === false ? (
                  <TrendingDown className="w-3 h-3" />
                ) : (
                  <Minus className="w-3 h-3" />
                )}
                <span>{trend.value}</span>
              </div>
            )}

            {comparison && (
              <span className="text-slate-400 font-normal text-[10.5px] truncate">
                {comparison}
              </span>
            )}

            {subtitle && (
              <span className="text-slate-500 font-medium text-[10.5px] truncate">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
