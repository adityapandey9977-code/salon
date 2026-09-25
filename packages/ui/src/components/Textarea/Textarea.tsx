import React from 'react';
import { cn } from '../../utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      maxLength,
      showCount = false,
      value,
      disabled,
      id,
      rows = 3,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 select-none"
            >
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-[10px] font-medium text-slate-400">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          value={value}
          disabled={disabled}
          className={cn(
            'w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-[#5A2EA6]/20 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#5A2EA6] focus:ring-2 focus:ring-[#5A2EA6]/10 outline-none transition-all resize-y shadow-xs disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
            className,
          )}
          {...props}
        />

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
Textarea.displayName = 'Textarea';
