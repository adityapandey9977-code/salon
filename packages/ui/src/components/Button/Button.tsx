import React from 'react';
import { cn } from '../../utils';

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'icon'
  | 'text-action'
  | 'timeline-footer'
  | 'sidebar-nav';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isActive?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isActive = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-inherit cursor-pointer',
          {
            // Primary (e.g. New Appointment)
            'bg-gradient-to-r from-[#1b1224] via-[#2a173d] to-[#1b1224] text-[#e6c594] px-5 py-[11px] rounded-[14px] font-bold text-[13px] flex items-center gap-2 shadow-[0_4px_16px_rgba(27,18,36,0.25)] whitespace-nowrap hover:brightness-110 transition':
              variant === 'primary',

            // Outline (e.g. Date button)
            'border border-slate-200 bg-white rounded-lg px-[13px] py-[7px] text-[#1e1428] text-[12px] font-medium flex items-center gap-[6px] hover:bg-slate-50 transition shadow-xs':
              variant === 'outline',

            // Icon (e.g. Bell)
            'border border-slate-200 bg-white rounded-lg w-[36px] h-[36px] grid place-items-center text-slate-700 hover:bg-slate-50 transition shadow-xs relative':
              variant === 'icon',

            // Text Action (e.g. Panel header action, notice action)
            'border border-purple-100 bg-purple-50/80 text-[#8b5cf6] text-[11px] font-semibold px-3 py-[6px] rounded-[8px] tracking-[0.3px] whitespace-nowrap hover:bg-purple-100/80 transition':
              variant === 'text-action',

            // Timeline footer
            'border-0 bg-transparent w-full pt-[14px] pb-1 px-0 text-[#8b5cf6] font-semibold text-[12px] text-left flex items-center gap-[7px] border-t border-slate-100 mt-1':
              variant === 'timeline-footer',

            // Sidebar nav (keep hover/transition here if we want, or just hover)
            'flex items-center gap-[11px] w-full border-0 bg-transparent text-[#d8b4fe]/80 text-left px-[10px] py-[9px] rounded-[12px] text-[13px] font-medium my-[1px] hover:bg-white/10 hover:text-white transition-all':
              variant === 'sidebar-nav',

            // Sidebar nav active state
            'bg-gradient-to-r from-[#c084fc]/30 to-[#dfa0a0]/20 text-white font-semibold hover:text-white relative before:absolute before:left-[-10px] before:top-[8px] before:bottom-[8px] before:w-[4px] before:rounded-full before:bg-[#e6c594]':
              variant === 'sidebar-nav' && isActive,
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
