import { CalendarDays, Check, ChevronDown } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useClickOutside } from '../../hooks';
import { cn } from '../../utils';

export type DateRangePreset =
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | 'This Month'
  | 'Last Month'
  | 'This Quarter'
  | 'This Year'
  | 'Custom Range';

export interface DateRangeValue {
  preset: DateRangePreset;
  startDate?: string;
  endDate?: string;
}

export interface DateRangePickerProps {
  value: DateRangePreset | DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
  presets?: DateRangePreset[];
  disabled?: boolean;
}

const DEFAULT_PRESETS: DateRangePreset[] = [
  'Today',
  'Yesterday',
  'This Week',
  'This Month',
  'Last Month',
  'This Quarter',
  'This Year',
  'Custom Range',
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className,
  presets = DEFAULT_PRESETS,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const currentPreset = typeof value === 'string' ? value : value.preset;
  const currentStartDate = typeof value === 'object' ? value.startDate || '' : '';
  const currentEndDate = typeof value === 'object' ? value.endDate || '' : '';

  const [customStart, setCustomStart] = useState(currentStartDate);
  const [customEnd, setCustomEnd] = useState(currentEndDate);

  const handleSelectPreset = (preset: DateRangePreset) => {
    if (preset === 'Custom Range') {
      onChange({ preset, startDate: customStart, endDate: customEnd });
    } else {
      onChange({ preset });
      setIsOpen(false);
    }
  };

  const handleApplyCustom = () => {
    onChange({ preset: 'Custom Range', startDate: customStart, endDate: customEnd });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'h-10 pl-3 pr-8 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-xs font-bold text-slate-800 hover:border-[#5A2EA6] flex items-center gap-2 cursor-pointer shadow-xs transition select-none disabled:opacity-50 disabled:cursor-not-allowed',
          isOpen && 'border-[#5A2EA6] ring-2 ring-[#5A2EA6]/10',
        )}
      >
        <CalendarDays className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />
        <span className="truncate">
          {currentPreset === 'Custom Range' && currentStartDate && currentEndDate
            ? `${currentStartDate} - ${currentEndDate}`
            : currentPreset}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-slate-400 absolute right-2.5 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 py-1">
            Date Range
          </div>

          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {presets.map((preset) => {
              const isSelected = currentPreset === preset;
              return (
                <div
                  key={preset}
                  onClick={() => handleSelectPreset(preset)}
                  className={cn(
                    'flex items-center justify-between px-3 py-1.5 text-xs rounded-xl cursor-pointer transition select-none font-medium',
                    isSelected
                      ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                >
                  <span>{preset}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#5A2EA6]" />}
                </div>
              );
            })}
          </div>

          {currentPreset === 'Custom Range' && (
            <div className="pt-2 border-t border-slate-100 space-y-2 px-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Start</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">End</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 font-medium"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="w-full py-1.5 text-xs font-bold bg-[#5A2EA6] text-white rounded-xl hover:bg-purple-800 transition"
              >
                Apply Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
