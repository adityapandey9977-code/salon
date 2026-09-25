import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Columns,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface UniversalExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  defaultCategory?: string;
  availableColumns?: string[];
  onExportComplete?: (format: string, reportName: string) => void;
}

export function UniversalExportModal({
  isOpen,
  onClose,
  reportTitle,
  defaultCategory = 'Executive',
  availableColumns = [
    'Date / Period',
    'Branch Outlet',
    'Gross Revenue (₹)',
    'Net Revenue (₹)',
    'Appointments Count',
    'New Clients',
    'Returning Clients',
    'Staff Utilisation (%)',
    'Average Ticket (₹)',
  ],
  onExportComplete,
}: UniversalExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedDateRange, setSelectedDateRange] = useState('Current Quarter (Q2 FY26-27)');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(availableColumns);
  const [includeSummaryMetrics, setIncludeSummaryMetrics] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleColumn = (col: string) => {
    if (selectedColumns.includes(col)) {
      if (selectedColumns.length > 1) {
        setSelectedColumns(selectedColumns.filter((c) => c !== col));
      }
    } else {
      setSelectedColumns([...selectedColumns, col]);
    }
  };

  const handleExecuteExport = () => {
    if (onExportComplete) {
      onExportComplete(selectedFormat.toUpperCase(), reportTitle);
    }
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                Export Engine
              </span>
              <span className="text-xs font-semibold text-soft">{defaultCategory} Analytics</span>
            </div>
            <h3 className="font-serif font-bold text-ink text-xl mt-1">Export {reportTitle}</h3>
            <p className="text-xs text-muted">
              Generate multi-branch compliance reports with custom column parameters
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 1. File Format Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
              1. Choose Export Document Format
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  id: 'csv',
                  name: 'CSV File (.csv)',
                  desc: 'Raw tabular data for spreadsheets',
                  icon: Download,
                },
                {
                  id: 'excel',
                  name: 'Excel Sheet (.xlsx)',
                  desc: 'Pre-formatted styled workbook',
                  icon: FileSpreadsheet,
                },
                {
                  id: 'pdf',
                  name: 'PDF Dossier (.pdf)',
                  desc: 'Print-ready executive summary',
                  icon: Printer,
                },
              ].map((fmt) => {
                const IconComp = fmt.icon;
                const isSelected = selectedFormat === fmt.id;
                return (
                  <div
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id as any)}
                    className={cn(
                      'p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-between',
                      isSelected
                        ? 'bg-[#F8F5FF] border-[#5A2EA6] ring-1 ring-[#5A2EA6] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-[#5A2EA6]/40 hover:bg-slate-50/50',
                    )}
                  >
                    <IconComp
                      className={cn(
                        'w-5 h-5 mb-1',
                        isSelected ? 'text-[#5A2EA6]' : 'text-slate-600',
                      )}
                    />
                    <strong className="text-xs font-bold text-ink block">{fmt.name}</strong>
                    <span className="text-[9px] text-muted block mt-0.5 leading-tight">
                      {fmt.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Filter Parameters */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
            <div>
              <label className="text-soft font-bold block mb-1">Time Horizon</label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
              >
                <option value="Current Quarter (Q2 FY26-27)">Current Quarter (Q2 FY26-27)</option>
                <option value="Current Month (Aug 2026)">Current Month (Aug 2026)</option>
                <option value="Last Month (Jul 2026)">Last Month (Jul 2026)</option>
                <option value="Financial YTD (FY26-27)">Financial YTD (FY26-27)</option>
                <option value="Last 12 Months">Last 12 Rolling Months</option>
              </select>
            </div>

            <div>
              <label className="text-soft font-bold block mb-1">Branch Scope</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
              >
                <option value="all">All Network Branches (6 Salons)</option>
                <option value="Indore Vijay Nagar">Indore - Vijay Nagar Flagship</option>
                <option value="Indore Palasia">Indore - Palasia Premium</option>
                <option value="Bhopal Arera">Bhopal - Arera Colony</option>
                <option value="Ujjain Freeganj">Ujjain - Freeganj Studio</option>
                <option value="Gwalior City Centre">Gwalior - City Centre</option>
              </select>
            </div>
          </div>

          {/* 3. Column Selection Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                2. Select Export Columns ({selectedColumns.length} Selected)
              </label>
              <button
                type="button"
                onClick={() => setSelectedColumns(availableColumns)}
                className="text-[10px] font-bold text-[#5A2EA6] hover:underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Select All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {availableColumns.map((col) => {
                const isChecked = selectedColumns.includes(col);
                return (
                  <div
                    key={col}
                    onClick={() => toggleColumn(col)}
                    className={cn(
                      'p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition select-none',
                      isChecked
                        ? 'bg-purple-50/50 border-purple-200 text-ink'
                        : 'bg-slate-50/40 border-slate-200 text-muted',
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-md grid place-items-center shrink-0 text-white text-[10px] font-bold',
                        isChecked ? 'bg-[#5A2EA6]' : 'bg-slate-300',
                      )}
                    >
                      {isChecked && '✓'}
                    </div>
                    <span className="text-[11px] font-semibold truncate">{col}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">
              Include Executive KPI Summary Callout Box
            </span>
            <input
              type="checkbox"
              checked={includeSummaryMetrics}
              onChange={(e) => setIncludeSummaryMetrics(e.target.checked)}
              className="accent-[#5A2EA6] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
          >
            Cancel
          </Button>

          <Button
            onClick={handleExecuteExport}
            className="h-[36px] px-5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {selectedFormat.toUpperCase()}</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
