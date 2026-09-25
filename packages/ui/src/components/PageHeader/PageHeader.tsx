import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { cn } from '../../utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  pillBadge?: {
    icon?: React.ReactNode;
    text: string;
  };
  title: string;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  onBack?: () => void;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  pillBadge,
  title,
  description,
  breadcrumbs,
  actions,
  onBack,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs text-left',
        className,
      )}
    >
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={b.label}>
                {idx > 0 && <span>/</span>}
                {b.onClick || b.href ? (
                  <button
                    type="button"
                    onClick={b.onClick}
                    className="hover:text-[#5A2EA6] transition cursor-pointer font-semibold"
                  >
                    {b.label}
                  </button>
                ) : (
                  <span
                    className={idx === breadcrumbs.length - 1 ? 'text-slate-700 font-bold' : ''}
                  >
                    {b.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {pillBadge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10.5px] font-bold tracking-wider uppercase mb-1 border border-[#5A2EA6]/20 select-none">
            {pillBadge.icon}
            <span>{pillBadge.text}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer shrink-0"
              aria-label="Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <h1 className="font-serif text-[26px] sm:text-[28px] text-slate-900 font-semibold tracking-tight">
            {title}
          </h1>
        </div>

        {description && (
          <p className="text-[12.5px] text-slate-500 font-medium leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center justify-start lg:justify-end gap-2.5 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
