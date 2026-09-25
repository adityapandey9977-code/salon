import { Check, ChevronDown, X } from 'lucide-react';
import React, { useState } from 'react';
import { useClickOutside } from '../../hooks';
import { cn } from '../../utils';

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  options?: Option[];
  selectSize?: 'sm' | 'md' | 'lg';
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      options,
      selectSize = 'md',
      disabled,
      children,
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeClasses = {
      sm: 'h-8 text-xs pl-2.5 pr-7 rounded-lg',
      md: 'h-10 text-xs pl-3.5 pr-9 rounded-xl',
      lg: 'h-12 text-sm pl-4 pr-10 rounded-2xl',
    };

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none font-medium border border-[#5A2EA6]/20 bg-white text-slate-900 focus:border-[#5A2EA6] focus:ring-2 focus:ring-[#5A2EA6]/10 outline-none transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[selectSize],
              leftIcon && (selectSize === 'sm' ? 'pl-8' : selectSize === 'lg' ? 'pl-11' : 'pl-9'),
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
              className,
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error ? (
          <p className="text-[11px] font-semibold text-rose-600 animate-in fade-in duration-200">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = 'Select';

export interface MultiSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  error,
  helperText,
  placeholder = 'Select items...',
  options,
  value = [],
  onChange,
  disabled,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const removeValue = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  const selectedOptions = options.filter((o) => value.includes(o.value));

  return (
    <div ref={containerRef} className={cn('w-full space-y-1.5 text-left relative', className)}>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 select-none">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'min-h-[40px] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 bg-white cursor-pointer flex flex-wrap items-center gap-1.5 transition shadow-xs focus-within:border-[#5A2EA6] focus-within:ring-2 focus-within:ring-[#5A2EA6]/10',
          disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
          error && 'border-rose-500',
        )}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-xs text-slate-400 font-medium">{placeholder}</span>
        ) : (
          selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6] px-2 py-0.5 rounded-md border border-[#5A2EA6]/20"
            >
              {opt.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => removeValue(opt.value, e)}
                  className="hover:text-rose-600 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))
        )}

        <div className="ml-auto pl-2 text-slate-400 pointer-events-none">
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition select-none font-medium',
                  isSelected
                    ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                    : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#5A2EA6]" />}
              </div>
            );
          })}
        </div>
      )}

      {error ? (
        <p className="text-[11px] font-semibold text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
