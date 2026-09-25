import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Layers,
  Play,
  Plus,
  Save,
  Sliders,
  Sparkles,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { UniversalExportModal } from './UniversalExportModal';

interface SavedReportItem {
  id: string;
  name: string;
  module: 'Revenue' | 'Operations' | 'Staff' | 'Clients' | 'Inventory' | 'Marketing' | 'Franchise';
  createdBy: string;
  lastUpdated: string;
  dateRange: string;
  status: 'Saved' | 'Scheduled' | 'Generated' | 'Draft';
  columns: string[];
}

const initialSavedReports: SavedReportItem[] = [
  {
    id: 'SAV-001',
    name: 'Executive Monthly GMV & Tax Breakdown',
    module: 'Revenue',
    createdBy: 'Rahul Sharma (CFO)',
    lastUpdated: '16 Aug 2026',
    dateRange: 'Monthly Rolling',
    status: 'Scheduled',
    columns: ['Branch', 'Services GMV', 'Retail GMV', 'Discounts', 'GST Tax', 'Net Revenue'],
  },
  {
    id: 'SAV-002',
    name: 'Stylist Utilisation & Commission Payout Ledger',
    module: 'Staff',
    createdBy: 'Priya Patel (HR)',
    lastUpdated: '12 Aug 2026',
    dateRange: 'Quarterly',
    status: 'Generated',
    columns: [
      'Staff Name',
      'Branch',
      'Completed Visits',
      'Utilisation %',
      'CSAT Rating',
      'Commission',
    ],
  },
  {
    id: 'SAV-003',
    name: 'Chemical Consumption & Recipe Wastage Discrepancy',
    module: 'Inventory',
    createdBy: 'Amit Deshmukh',
    lastUpdated: '08 Aug 2026',
    dateRange: 'Monthly',
    status: 'Saved',
    columns: [
      'Product Name',
      'SKU',
      'Standard Recipe',
      'Actual Dispensed',
      'Variance %',
      'Cost Impact',
    ],
  },
  {
    id: 'SAV-004',
    name: 'Franchise Territory Royalty Accrual Scorecard',
    module: 'Franchise',
    createdBy: 'Brand Owner Executive',
    lastUpdated: '01 Aug 2026',
    dateRange: 'Quarterly',
    status: 'Scheduled',
    columns: ['Partner Name', 'Region', 'Outlets', 'Gross GMV', 'Royalty 10%', 'Compliance Score'],
  },
];

export function CustomReportsTab() {
  const [activeSubView, setActiveSubView] = useState<'builder' | 'saved'>('builder');
  const [savedReports, setSavedReports] = useState<SavedReportItem[]>(initialSavedReports);

  // Builder State (Section 11 PRD)
  const [selectedModule, setSelectedModule] = useState('Revenue');
  const [selectedDimension, setSelectedDimension] = useState('Branch');
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([
    'Gross Revenue',
    'Net Revenue',
    'Appointments',
  ]);
  const [reportTitle, setReportTitle] = useState('Custom Revenue Performance Matrix');
  const [builderDateRange, setBuilderDateRange] = useState('Current Quarter');
  const [builderBranch, setBuilderBranch] = useState('all');

  // Modal State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const availableMeasuresByModule: Record<string, string[]> = {
    Revenue: [
      'Gross Revenue',
      'Service Revenue',
      'Retail Sales',
      'Packages',
      'Memberships',
      'Discounts',
      'Refunds',
      'Net Revenue',
    ],
    Operations: [
      'Total Bookings',
      'Completed Visits',
      'Cancellations',
      'No-Shows',
      'Walk-ins',
      'Chair Occupancy %',
    ],
    Staff: [
      'Staff Utilisation %',
      'Completed Services',
      'Retail Upsell',
      'Rebooking Rate',
      'CSAT Rating',
      'Commission Accrued',
    ],
    Clients: [
      'Total Clients',
      'New Inflow',
      'Returning Clients',
      'Visit Frequency',
      'Client LTV',
      'Churn Risk',
    ],
    Inventory: [
      'Stock Valuation',
      'Consumption',
      'Wastage Discrepancy',
      'Expiring Value',
      'Stock Ageing Turns',
    ],
    Marketing: [
      'Audience Delivered',
      'Direct Bookings',
      'Attended Visits',
      'Revenue Generated',
      'Coupon Usage',
      'ROI Multiplier',
    ],
    Franchise: [
      'Outlets Count',
      'Franchise Turnover',
      'Workstation Utilisation',
      'Royalty Accrual',
      'Compliance Score',
    ],
  };

  const toggleMeasure = (m: string) => {
    if (selectedMeasures.includes(m)) {
      if (selectedMeasures.length > 1) {
        setSelectedMeasures(selectedMeasures.filter((item) => item !== m));
      }
    } else {
      setSelectedMeasures([...selectedMeasures, m]);
    }
  };

  const handleSaveReport = () => {
    const newReport: SavedReportItem = {
      id: `SAV-${Math.floor(100 + Math.random() * 900)}`,
      name: reportTitle || 'Untitled Custom Report',
      module: selectedModule as any,
      createdBy: 'Brand Owner Executive',
      lastUpdated: 'Just now',
      dateRange: builderDateRange,
      status: 'Saved',
      columns: [selectedDimension, ...selectedMeasures],
    };
    setSavedReports([newReport, ...savedReports]);
    showToast(`Custom report "${newReport.name}" saved to Saved Reports library.`);
    setActiveSubView('saved');
  };

  const handleDeleteSaved = (id: string) => {
    setSavedReports(savedReports.filter((r) => r.id !== id));
    showToast('Report template removed from library.');
  };

  const handleDuplicate = (r: SavedReportItem) => {
    const dup: SavedReportItem = {
      ...r,
      id: `SAV-${Math.floor(100 + Math.random() * 900)}`,
      name: `${r.name} (Copy)`,
      lastUpdated: 'Just now',
      status: 'Draft',
    };
    setSavedReports([dup, ...savedReports]);
    showToast(`Duplicated "${r.name}".`);
  };

  const getStatusBadge = (st: SavedReportItem['status']) => {
    switch (st) {
      case 'Scheduled':
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
      case 'Generated':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Saved':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Mock builder preview data
  const previewRows = [
    {
      [selectedDimension]: 'Indore - Vijay Nagar Flagship',
      'Gross Revenue': '₹38,50,000',
      'Net Revenue': '₹36,00,000',
      Appointments: '2,640',
      'Service Revenue': '₹26,80,000',
      'Staff Utilisation %': '88.4%',
      'Completed Visits': '2,320',
    },
    {
      [selectedDimension]: 'Bhopal - Arera Colony Lounge',
      'Gross Revenue': '₹28,40,000',
      'Net Revenue': '₹26,45,000',
      Appointments: '1,980',
      'Service Revenue': '₹19,80,000',
      'Staff Utilisation %': '84.2%',
      'Completed Visits': '1,710',
    },
    {
      [selectedDimension]: 'Indore - Palasia Premium Studio',
      'Gross Revenue': '₹26,80,000',
      'Net Revenue': '₹25,00,000',
      Appointments: '1,840',
      'Service Revenue': '₹18,40,000',
      'Staff Utilisation %': '85.6%',
      'Completed Visits': '1,600',
    },
    {
      [selectedDimension]: 'Ujjain - Freeganj Main Studio',
      'Gross Revenue': '₹21,20,000',
      'Net Revenue': '₹19,75,000',
      Appointments: '1,520',
      'Service Revenue': '₹15,20,000',
      'Staff Utilisation %': '81.8%',
      'Completed Visits': '1,290',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Export Modal */}
      <UniversalExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle={reportTitle}
        defaultCategory={selectedModule}
        availableColumns={[selectedDimension, ...selectedMeasures]}
        onExportComplete={(fmt, title) =>
          showToast(`Successfully exported ${title} in ${fmt} format.`)
        }
      />

      {/* 1. Sub-View Toggle */}
      <div className="flex items-center gap-2 border-b border-[#5A2EA6]/10 pb-3">
        <button
          onClick={() => setActiveSubView('builder')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer',
            activeSubView === 'builder'
              ? 'bg-[#5A2EA6] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-[#5A2EA6]/5 border border-slate-200',
          )}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Custom Report Builder</span>
        </button>

        <button
          onClick={() => setActiveSubView('saved')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer',
            activeSubView === 'saved'
              ? 'bg-[#5A2EA6] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-[#5A2EA6]/5 border border-slate-200',
          )}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Saved Reports Library</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px]',
              activeSubView === 'saved' ? 'bg-white/20' : 'bg-slate-100',
            )}
          >
            {savedReports.length}
          </span>
        </button>
      </div>

      {activeSubView === 'builder' ? (
        /* 2. Section 11 PRD: LIGHTWEIGHT REPORT BUILDER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Builder Configuration Panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                Builder Controls
              </span>
              <h3 className="font-serif font-bold text-ink text-base mt-1">
                Configure Report Dimensions
              </h3>
              <p className="text-[11px] text-muted">
                Select domain module, primary grouping dimension, and analytical measures
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                Report Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
              />
            </div>

            {/* 1. Module Selector */}
            <div>
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                1. Domain Module
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  'Revenue',
                  'Operations',
                  'Staff',
                  'Clients',
                  'Inventory',
                  'Marketing',
                  'Franchise',
                ].map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => {
                      setSelectedModule(mod);
                      setSelectedMeasures(availableMeasuresByModule[mod].slice(0, 3));
                    }}
                    className={cn(
                      'p-2 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer select-none',
                      selectedModule === mod
                        ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                        : 'bg-[#F8F5FF] border-[#5A2EA6]/15 text-slate-700 hover:bg-[#5A2EA6]/10',
                    )}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dimensions Selector */}
            <div>
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                2. Grouping Dimension
              </label>
              <select
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-ink outline-none cursor-pointer"
              >
                <option value="Branch">Branch Outlet Location</option>
                <option value="Date / Month">Date / Monthly Calendar</option>
                <option value="Category">Service Ritual Category</option>
                <option value="Staff Stylist">Staff Stylist Leader</option>
                <option value="Channel">Acquisition Channel</option>
              </select>
            </div>

            {/* 3. Measures Checklist */}
            <div>
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                3. Calculated Measures ({selectedMeasures.length} Selected)
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                {(availableMeasuresByModule[selectedModule] || []).map((ms) => {
                  const isChecked = selectedMeasures.includes(ms);
                  return (
                    <div
                      key={ms}
                      onClick={() => toggleMeasure(ms)}
                      className={cn(
                        'p-2 rounded-xl border flex items-center gap-1.5 cursor-pointer transition select-none',
                        isChecked
                          ? 'bg-purple-50/70 border-purple-200 text-ink'
                          : 'bg-slate-50 border-slate-200 text-muted',
                      )}
                    >
                      <div
                        className={cn(
                          'w-3.5 h-3.5 rounded-md grid place-items-center shrink-0 text-white text-[9px] font-bold',
                          isChecked ? 'bg-[#5A2EA6]' : 'bg-slate-300',
                        )}
                      >
                        {isChecked && '✓'}
                      </div>
                      <span className="text-[11px] font-semibold truncate">{ms}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                onClick={handleSaveReport}
                className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm flex-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Library</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsExportOpen(true)}
                className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Live Table Preview Canvas */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-[#5A2EA6]/10 flex items-center justify-between bg-[#FCFAFF]">
                <div>
                  <h4 className="font-serif font-bold text-ink text-base">Live Preview Canvas</h4>
                  <p className="text-[11px] text-muted">
                    Previewing dynamic compilation based on active builder criteria
                  </p>
                </div>
                <span className="text-xs font-bold text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {selectedModule} · By {selectedDimension}
                </span>
              </div>

              <div className="overflow-x-auto p-4">
                <table className="w-full text-left text-xs border-collapse rounded-xl overflow-hidden border border-slate-100">
                  <thead>
                    <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                      <th className="p-3 pl-4">{selectedDimension}</th>
                      {selectedMeasures.map((m, idx) => (
                        <th key={idx} className="p-3 text-right">
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {previewRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 transition">
                        <td className="p-3 pl-4 whitespace-nowrap font-bold text-ink">
                          {row[selectedDimension]}
                        </td>
                        {selectedMeasures.map((m, mIdx) => (
                          <td
                            key={mIdx}
                            className="p-3 text-right whitespace-nowrap font-mono text-slate-800"
                          >
                            {row[m] || '₹14.2L'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-muted flex items-center justify-between">
              <span>Parameters valid · Ready for automated scheduling</span>
              <span className="font-semibold text-slate-700">4 Sample Dimension Rows Shown</span>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Section 12 PRD: SAVED REPORTS INTERFACE */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Saved Custom Reports Repository
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                  Report Library
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Saved query templates, automated distribution schedules, and multi-format download
                actions
              </p>
            </div>
            <Button
              onClick={() => setActiveSubView('builder')}
              className="h-[32px] px-3 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Custom Query</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Saved Report Model</th>
                  <th className="p-3.5">Domain Module</th>
                  <th className="p-3.5">Created By</th>
                  <th className="p-3.5">Time Horizon</th>
                  <th className="p-3.5">Last Run</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {savedReports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{r.name}</strong>
                      <span className="text-[10px] text-muted">{r.columns.join(' · ')}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-200">
                        {r.module}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-800">{r.createdBy}</td>
                    <td className="p-3.5 whitespace-nowrap text-muted text-[11px]">
                      {r.dateRange}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-800 text-[11px] font-medium">
                      {r.lastUpdated}
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                          getStatusBadge(r.status),
                        )}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReportTitle(r.name);
                            setIsExportOpen(true);
                          }}
                          className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-[#5A2EA6]" />
                          <span>Export</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleDuplicate(r)}
                          className="h-[28px] px-2 rounded-lg text-[10px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handleDeleteSaved(r.id)}
                          className="h-[28px] px-2 rounded-lg text-[10px] font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
