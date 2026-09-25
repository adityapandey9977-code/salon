import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { cn } from '../../utils';
import { Checkbox } from '../Checkbox';
import { Skeleton } from '../Skeleton';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor?: (row: T, index: number) => string;
  searchKey?: keyof T | ((row: T) => string);
  searchPlaceholder?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  showSearch?: boolean;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data = [],
  columns = [],
  keyExtractor = (row, idx) => row.id || String(idx),
  searchKey,
  searchPlaceholder = 'Search records...',
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  showPagination = true,
  showSearch = true,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  isLoading = false,
  emptyState,
  headerActions,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 1. Filter Data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || !searchKey) return data;

    return data.filter((item) => {
      let valueToSearch = '';
      if (typeof searchKey === 'function') {
        valueToSearch = searchKey(item);
      } else {
        valueToSearch = String(item[searchKey] || '');
      }
      return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // 2. Sort Data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortColumn, sortDirection]);

  // 3. Paginate Data
  const totalPages = Math.ceil(sortedData.length / currentPageSize) || 1;
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const start = (currentPage - 1) * currentPageSize;
    return sortedData.slice(start, start + currentPageSize);
  }, [sortedData, currentPage, currentPageSize, showPagination]);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAllCurrentPage = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      const newSelected = Array.from(new Set([...selectedRows, ...paginatedData]));
      onSelectionChange(newSelected);
    } else {
      const currentPageIds = new Set(paginatedData.map((row, idx) => keyExtractor(row, idx)));
      const newSelected = selectedRows.filter(
        (row, idx) => !currentPageIds.has(keyExtractor(row, idx)),
      );
      onSelectionChange(newSelected);
    }
  };

  const handleSelectRow = (row: T, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectionChange) return;

    const rowId = keyExtractor(row, 0);
    const isSelected = selectedRows.some((r, idx) => keyExtractor(r, idx) === rowId);

    if (isSelected) {
      onSelectionChange(selectedRows.filter((r, idx) => keyExtractor(r, idx) !== rowId));
    } else {
      onSelectionChange([...selectedRows, row]);
    }
  };

  const isAllCurrentPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row, idx) =>
      selectedRows.some((r, rIdx) => keyExtractor(r, rIdx) === keyExtractor(row, idx)),
    );

  const startRecord = (currentPage - 1) * currentPageSize + 1;
  const endRecord = Math.min(currentPage * currentPageSize, sortedData.length);

  return (
    <div className={cn('w-full space-y-3.5', className)}>
      {/* Top Search & Actions Bar */}
      {(showSearch || headerActions) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {showSearch ? (
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 pl-9 pr-4 text-xs font-medium rounded-xl border border-[#5A2EA6]/20 bg-white placeholder:text-slate-400 focus:border-[#5A2EA6] focus:ring-2 focus:ring-[#5A2EA6]/10 outline-none transition shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          ) : (
            <div />
          )}

          {headerActions && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-b from-slate-50 to-[#FCFAFF] border-b border-slate-200/80 text-slate-700">
                {selectable && (
                  <th className="w-12 px-4 py-3.5 text-center">
                    <Checkbox
                      checked={isAllCurrentPageSelected}
                      onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
                    />
                  </th>
                )}

                {columns.map((col) => {
                  const isSorted = sortColumn === col.key;
                  return (
                    <th
                      key={col.key}
                      style={{ width: col.width }}
                      className={cn(
                        'px-4 py-3.5 font-bold uppercase tracking-wider text-[10.5px] text-slate-600 select-none whitespace-nowrap',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        col.sortable && 'cursor-pointer hover:text-[#5A2EA6] transition',
                        col.headerClassName,
                      )}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5',
                          col.align === 'center' && 'justify-center',
                          col.align === 'right' && 'justify-end',
                        )}
                      >
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {isSorted ? (
                              sortDirection === 'asc' ? (
                                <ArrowUp className="w-3.5 h-3.5 text-[#5A2EA6]" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-[#5A2EA6]" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {isLoading ? (
                Array.from({ length: currentPageSize > 5 ? 5 : currentPageSize }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    {selectable && (
                      <td className="px-4 py-3.5 text-center">
                        <Skeleton className="w-4 h-4 mx-auto rounded" />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3.5">
                        <Skeleton className="h-4 w-3/4 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    {emptyState || (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">
                          No matching records found
                        </p>
                        <p className="text-xs text-slate-400">
                          Try adjusting your search query or filters.
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIdx) => {
                  const rowId = keyExtractor(row, rowIdx);
                  const isSelected = selectedRows.some((r, idx) => keyExtractor(r, idx) === rowId);

                  return (
                    <tr
                      key={rowId}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        'transition-colors duration-150',
                        onRowClick && 'cursor-pointer hover:bg-[#5A2EA6]/3',
                        isSelected ? 'bg-[#5A2EA6]/8' : 'hover:bg-slate-50/70',
                      )}
                    >
                      {selectable && (
                        <td
                          className="px-4 py-3.5 text-center"
                          onClick={(e) => handleSelectRow(row, e)}
                        >
                          <Checkbox checked={isSelected} onChange={() => {}} />
                        </td>
                      )}

                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            'px-4 py-3.5',
                            col.align === 'center' && 'text-center',
                            col.align === 'right' && 'text-right',
                            col.cellClassName,
                          )}
                        >
                          {col.render ? col.render(row, rowIdx) : (row[col.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {showPagination && sortedData.length > 0 && (
          <div className="px-5 py-3.5 bg-gradient-to-b from-white to-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={currentPageSize}
                onChange={(e) => {
                  setCurrentPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 px-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="hidden sm:inline">·</span>
              <span>
                Showing <strong className="text-slate-800 font-bold">{startRecord}</strong> to{' '}
                <strong className="text-slate-800 font-bold">{endRecord}</strong> of{' '}
                <strong className="text-slate-800 font-bold">{sortedData.length}</strong> entries
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="px-2 text-xs font-bold text-slate-800">
                {currentPage} / {totalPages}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
