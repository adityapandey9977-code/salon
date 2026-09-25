import type React from 'react';
import { cn } from '../../utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface RadioGroupProps {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  direction?: 'horizontal' | 'vertical';
  variant?: 'simple' | 'card';
  className?: string;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  direction = 'vertical',
  variant = 'simple',
  className,
  disabled,
}) => {
  const radioGroupName = name || 'radio-group-' + Math.random().toString(36).substring(2, 9);

  return (
    <div
      role="radiogroup"
      className={cn(
        'flex gap-2.5',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;

        if (variant === 'card') {
          return (
            <div
              key={option.value}
              onClick={() => !isDisabled && onChange(option.value)}
              className={cn(
                'p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 text-left shadow-xs',
                isSelected
                  ? 'border-[#5A2EA6] bg-[#5A2EA6]/5 ring-1 ring-[#5A2EA6]'
                  : 'border-slate-200 bg-white hover:border-slate-300',
                isDisabled && 'opacity-50 cursor-not-allowed bg-slate-50',
              )}
            >
              <div className="flex items-start gap-3">
                {option.icon && (
                  <div
                    className={cn(
                      'p-2 rounded-xl text-lg',
                      isSelected ? 'bg-[#5A2EA6]/10 text-[#5A2EA6]' : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {option.icon}
                  </div>
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{option.label}</span>
                    {option.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  'w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition',
                  isSelected ? 'border-[#5A2EA6]' : 'border-slate-300',
                )}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-[#5A2EA6]" />}
              </div>
            </div>
          );
        }

        return (
          <label
            key={option.value}
            className={cn(
              'inline-flex items-start gap-2.5 cursor-pointer select-none group text-left',
              isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            )}
          >
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input
                type="radio"
                name={radioGroupName}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                disabled={isDisabled}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-4.5 h-4.5 rounded-full border-2 transition-all flex items-center justify-center shadow-xs',
                  isSelected
                    ? 'border-[#5A2EA6]'
                    : 'border-slate-300 group-hover:border-[#5A2EA6]/50 bg-white',
                )}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-[#5A2EA6]" />}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="block text-xs font-bold text-slate-800 group-hover:text-slate-900">
                {option.label}
              </span>
              {option.description && (
                <p className="text-[11px] text-slate-500 font-medium">{option.description}</p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};
