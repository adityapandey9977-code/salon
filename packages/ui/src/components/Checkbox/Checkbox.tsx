import { Check, Minus } from 'lucide-react';
import React from 'react';
import { cn } from '../../utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  description?: string;
  indeterminate?: boolean;
  error?: string;
  checkboxSize?: 'sm' | 'md' | 'lg';
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      checked,
      indeterminate,
      onChange,
      disabled,
      error,
      checkboxSize = 'md',
      id,
      ...props
    },
    ref,
  ) => {
    const checkboxId =
      id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeClasses = {
      sm: 'w-3.5 h-3.5 rounded',
      md: 'w-4.5 h-4.5 rounded-md',
      lg: 'w-5 h-5 rounded-lg',
    };

    const iconSizes = {
      sm: 'w-2.5 h-2.5',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none group text-left',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex items-center justify-center border transition-all duration-150 shadow-xs',
              sizeClasses[checkboxSize],
              checked || indeterminate
                ? 'bg-[#5A2EA6] border-[#5A2EA6] text-white'
                : 'bg-white border-slate-300 group-hover:border-[#5A2EA6]/50',
              error && 'border-rose-500',
            )}
          >
            {indeterminate ? (
              <Minus className={cn('stroke-[3]', iconSizes[checkboxSize])} />
            ) : checked ? (
              <Check className={cn('stroke-[3]', iconSizes[checkboxSize])} />
            ) : null}
          </div>
        </div>

        {(label || description) && (
          <div className="space-y-0.5">
            {label && (
              <span className="block text-xs font-bold text-slate-800 group-hover:text-slate-900">
                {label}
              </span>
            )}
            {description && (
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                {description}
              </p>
            )}
            {error && <p className="text-[11px] font-semibold text-rose-600">{error}</p>}
          </div>
        )}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
