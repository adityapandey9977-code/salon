import { useToast } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  FileType,
  Filter,
  Globe,
  Layers,
  MapPin,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function PayrollExportPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedEmployee, setSelectedEmployee] = useState('All Staff Members');

  // ALL 4 PRD REQUIRED EXPORT FORMAT CARDS: Excel, CSV, PDF, Bank Format
  const exportFormatCards = [
    {
      format: 'Excel Format (.XLSX)',
      type: 'Excel',
      desc: 'Complete workbook with earnings, deductions, PF/ESI formulas & TDS tables',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      fileExt: 'Payroll_Register_Aug2026.xlsx',
      btnText: 'Export Excel (.XLSX)',
      badge: 'Formula Enabled',
    },
    {
      format: 'CSV Format (.CSV)',
      type: 'CSV',
      desc: 'Universal tabular CSV register for Tally, Zoho Books, and SAP ERP import',
      icon: <FileCode className="w-5 h-5 text-[#5A2EA6]" />,
      fileExt: 'Payroll_Register_Aug2026.csv',
      btnText: 'Export Tabular CSV',
      badge: 'Universal ERP',
    },
    {
      format: 'PDF Format (.PDF)',
      type: 'PDF',
      desc: 'Official tax register, consolidated salary report & employee payslips',
      icon: <FileText className="w-5 h-5 text-rose-600" />,
      fileExt: 'Payroll_Tax_Report_Aug2026.pdf',
      btnText: 'Export Executive PDF',
      badge: 'Audit Grade',
    },
    {
      format: 'Corporate Bank Direct Deposit',
      type: 'Bank Format',
      desc: 'HDFC / ICICI / Kotak CMS NEFT/RTGS batch file with IFSC & Account numbers',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
      fileExt: 'CMS_Corporate_Payroll_Batch.csv',
      btnText: 'Export Bank Batch File',
      badge: 'Direct Deposit',
    },
  ];

  // EXPORT HISTORY AUDIT LEDGER
  const [exportHistory] = useState([
    {
      id: 'EXP-8801',
      format: 'HDFC CMS NEFT Direct Batch',
      month: 'August 2026',
      branch: 'Bandra West Flagship (Mumbai)',
      department: 'Hair Care & Coloring',
      date: '2026-08-01 09:15 AM',
      records: '22 Staff',
      status: 'Generated',
      file: 'HDFC_CMS_BOM_Aug2026.csv',
    },
    {
      id: 'EXP-8750',
      format: 'Excel Master Workbook (.XLSX)',
      month: 'August 2026',
      branch: 'All Branches (Consolidated)',
      department: 'All Departments',
      date: '2026-08-01 09:30 AM',
      records: '64 Staff',
      status: 'Generated',
      file: 'Payroll_Register_Chain_Aug2026.xlsx',
    },
    {
      id: 'EXP-8710',
      format: 'Tabular CSV (.CSV)',
      month: 'July 2026',
      branch: 'South Extension II (Delhi NCR)',
      department: 'Skin & Aesthetics',
      date: '2026-07-01 10:00 AM',
      records: '18 Staff',
      status: 'Exported',
      file: 'Payroll_DEL_July2026.csv',
    },
    {
      id: 'EXP-8600',
      format: 'Official Tax PDF (.PDF)',
      month: 'June 2026',
      branch: 'All Branches (Consolidated)',
      department: 'All Departments',
      date: '2026-06-30 05:00 PM',
      records: '64 Staff',
      status: 'Exported',
      file: 'Form16_Tax_Register_Q1.pdf',
    },
  ]);

  const handleTriggerExport = (formatName: string, fileName: string) => {
    toast(
      `Payroll Export Triggered: [${formatName}] exported for ${selectedBranch.shortName} (${selectedMonth}). File: ${fileName}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Payroll Export &amp; Corporate Banking Batch
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Payroll Export' : `${selectedBranch.shortName} Payroll`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Export monthly payroll batches in Excel (.XLSX), CSV, audit PDF, and HDFC/ICICI CMS
            Corporate Bank direct deposit formats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() =>
              handleTriggerExport('All Consolidated Formats', 'Payroll_Master_Archive.zip')
            }
            className="flex items-center gap-1.5 px-4 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export All Formats (.ZIP)
          </button>
        </div>
      </div>

      {/* 4 FILTERS BAR: Branch, Month, Department, Employee */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-ink uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-purple-600" /> Payroll Export Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-soft uppercase mb-1">
              Branch Scope
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-soft uppercase mb-1">
              Payroll Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
            >
              <option value="August 2026">August 2026 (Active Run)</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-soft uppercase mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
            >
              <option value="All Departments">All Departments</option>
              <option value="Hair Care & Coloring">Hair Care &amp; Coloring</option>
              <option value="Skin & Aesthetics">Skin &amp; Aesthetics</option>
              <option value="Hair Spa & Therapy">Hair Spa &amp; Therapy</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-soft uppercase mb-1">
              Employee Scope
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
            >
              <option value="All Staff Members">
                All Staff Members ({selectedBranch.activeStaffCount} Staff)
              </option>
              <option value="Senior Staff">Senior Stylists &amp; Aestheticians</option>
              <option value="Junior Staff">Assistants &amp; Front Desk</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 EXPORT FORMAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {exportFormatCards.map((c, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="p-2 bg-paper rounded-xl border border-line">{c.icon}</div>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                  {c.badge}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-ink">{c.format}</h4>
                <p className="text-xs text-soft mt-1 leading-relaxed">{c.desc}</p>
              </div>
            </div>

            <button
              onClick={() => handleTriggerExport(c.format, c.fileExt)}
              className="w-full py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              {c.btnText}
            </button>
          </div>
        ))}
      </div>

      {/* EXPORT HISTORY AUDIT TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden p-5 space-y-3">
        <h3 className="font-bold text-sm text-ink">Recent Payroll Export Audit Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-2.5">Export ID &amp; Date</th>
                <th className="p-2.5">Format &amp; Gateway</th>
                <th className="p-2.5">Branch Location</th>
                <th className="p-2.5">Month</th>
                <th className="p-2.5">Staff Count</th>
                <th className="p-2.5">File Name</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {exportHistory.map((h) => (
                <tr key={h.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-2.5 font-bold text-purple-700">
                    <div>{h.id}</div>
                    <div className="text-[10px] text-muted">{h.date}</div>
                  </td>
                  <td className="p-2.5 font-bold text-ink">{h.format}</td>
                  <td className="p-2.5 text-soft">{h.branch}</td>
                  <td className="p-2.5 font-semibold text-ink">{h.month}</td>
                  <td className="p-2.5 text-soft">{h.records}</td>
                  <td className="p-2.5 font-mono text-purple-900">{h.file}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
