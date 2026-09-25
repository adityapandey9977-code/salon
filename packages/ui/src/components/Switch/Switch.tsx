import type React from 'react';
import { cn } from '../../utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'purple' | 'emerald' | 'indigo';
  className?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  size = 'md',
  colorScheme = 'purple',
  className,
  id,
}) => {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const sizeClasses = {
    sm: { track: 'w-7 h-4', thumb: 'w-3 h-3', translate: 'translate-x-3' },
    md: { track: 'w-10 h-6', thumb: 'w-4 h-4', translate: 'translate-x-4' },
    lg: { track: 'w-12 h-7', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  };

  const colorClasses = {
    purple: 'bg-[#5A2EA6]',
    emerald: 'bg-emerald-600',
    indigo: 'bg-indigo-600',
  };

  const handleToggle = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={cn(
        'flex items-start gap-3 select-none cursor-pointer group text-left',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={switchId}
        disabled={disabled}
        className={cn(
          'relative inline-flex shrink-0 p-1 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5A2EA6]/50 shadow-xs',
          sizeClasses[size].track,
          checked ? colorClasses[colorScheme] : 'bg-slate-200',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-md transform ring-0 transition duration-200 ease-in-out',
            sizeClasses[size].thumb,
            checked ? sizeClasses[size].translate : 'translate-x-0',
          )}
        />
      </button>

      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <span className="block text-xs font-bold text-slate-800 group-hover:text-slate-900">
              {label}
            </span>
          )}
          {description && (
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};
