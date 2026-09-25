import { Download, Filter, X } from 'lucide-react';
import type React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { SearchInput } from '../Input';

export interface FilterToolbarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  onExport?: () => void;
  exportLabel?: string;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  className?: string;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters,
  actions,
  onExport,
  exportLabel = 'Export',
  activeFilterCount = 0,
  onClearFilters,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-left',
        className,
      )}
    >
      <div className="flex items-center gap-2.5 flex-1 flex-wrap">
        {onSearchChange && (
          <div className="w-full sm:w-64">
            <SearchInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange('')}
              inputSize="sm"
            />
          </div>
        )}

        {filters && <div className="flex items-center gap-2 flex-wrap">{filters}</div>}

        {activeFilterCount > 0 && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="h-8 px-2.5 text-[11px] font-bold text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters ({activeFilterCount})</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 justify-end">
        {actions}

        {onExport && (
          <Button
            variant="outline"
            onClick={onExport}
            className="h-8 px-3 text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exportLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
