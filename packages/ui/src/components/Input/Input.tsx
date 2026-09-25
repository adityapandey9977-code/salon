import { Eye, EyeOff, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flush';
  onClear?: () => void;
  showClear?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      variant = 'default',
      disabled,
      value,
      onChange,
      onClear,
      showClear = false,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeClasses = {
      sm: 'h-8 text-xs px-2.5 rounded-lg',
      md: 'h-10 text-xs px-3.5 rounded-xl',
      lg: 'h-12 text-sm px-4 rounded-2xl',
    };

    const variantClasses = {
      default:
        'border border-[#5A2EA6]/20 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#5A2EA6] focus:ring-2 focus:ring-[#5A2EA6]/10 shadow-xs',
      filled:
        'border border-transparent bg-slate-100/80 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#5A2EA6] focus:ring-2 focus:ring-[#5A2EA6]/10',
      flush:
        'border-0 border-b border-slate-200 bg-transparent rounded-none px-0 focus:border-[#5A2EA6] focus:ring-0',
    };

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
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

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={cn(
              'w-full font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[inputSize],
              variantClasses[variant],
              leftIcon && (inputSize === 'sm' ? 'pl-8' : inputSize === 'lg' ? 'pl-11' : 'pl-9'),
              (rightIcon || (showClear && value)) &&
                (inputSize === 'sm' ? 'pr-8' : inputSize === 'lg' ? 'pr-11' : 'pr-9'),
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
              className,
            )}
            {...props}
          />

          {showClear && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              tabIndex={-1}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {rightIcon && !showClear && (
            <div className="absolute right-3 flex items-center pointer-events-none text-slate-400">
              {rightIcon}
            </div>
          )}
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
Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Search...', value, onChange, onClear, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        showClear
        value={value}
        onChange={onChange}
        onClear={onClear}
        {...props}
      />
    );
  },
);
SearchInput.displayName = 'SearchInput';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pointer-events-auto p-1 text-slate-400 hover:text-[#5A2EA6] transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...props}
        />
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
