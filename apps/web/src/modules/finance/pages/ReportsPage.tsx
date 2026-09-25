import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  Landmark,
  MapPin,
  PieChart,
  Receipt,
  RotateCcw,
  Search,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function ReportsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportModal, setSelectedReportModal] = useState<any>(null);

  // ALL 8 EXACT PRD REQUIRED FINANCIAL REPORTS
  const reportsList = [
    {
      id: 'REP-01',
      title: 'Customer Sales Receipts & GST Tax Ledger',
      category: 'Finance Receipts',
      desc: 'Incoming customer sales payments, invoice mappings, SAC 999721 & HSN 3305 GST taxes, and payment channels.',
      icon: <Receipt className="w-5 h-5 text-[#5A2EA6]" />,
      period: 'Monthly / Quarterly',
      file: 'Receipt_Ledger_Report_Aug2026.pdf',
      summaryMetric: isAllBranches
        ? '₹68,40,000 Total Receipts (1,240 Invoices)'
        : `${selectedBranch.shortName}: ${selectedBranch.todayRevenue} (48 Invoices)`,
    },
    {
      id: 'REP-02',
      title: 'Customer Refund & Void Audit Report',
      category: 'Finance Refunds',
      desc: 'Returned payments, complaint refunds, duplicate billing credits, and cashier approval signatures.',
      icon: <RotateCcw className="w-5 h-5 text-rose-600" />,
      period: 'Monthly / Quarterly',
      file: 'Refund_Audit_Report_Aug2026.pdf',
      summaryMetric: `${selectedBranch.todayRefunds} Total Refunds (0.02% Return Rate)`,
    },
    {
      id: 'REP-03',
      title: 'Daily Register & Settlement Ledger',
      category: 'Cash Flow & Closing',
      desc: 'Daily closing cash drawer balances across cash, card, UPI, wallet, and bank payouts with Z-Reports.',
      icon: <Landmark className="w-5 h-5 text-[#5A2EA6]" />,
      period: 'Daily / Monthly',
      file: 'Daily_Settlement_Ledger_Aug2026.pdf',
      summaryMetric: `${selectedBranch.pendingSettlements} Gateway Settled (Zero Discrepancy)`,
    },
    {
      id: 'REP-04',
      title: 'Stylist Commission & Performance Incentive Report',
      category: 'Staff Incentives',
      desc: 'Staff tiered incentive payout logs (5-15%), retail commissions, and backbar chemical deductions.',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      period: 'Monthly Payroll Cycle',
      file: 'Staff_Commission_Report_Aug2026.pdf',
      summaryMetric: `${selectedBranch.commissionsEarned} Total Incentives Disbursed`,
    },
    {
      id: 'REP-05',
      title: 'Statutory Payroll & Deduction Register (PF/ESI/TDS)',
      category: 'HR & Payroll',
      desc: 'Monthly employee salary processing register, 10 breakdown components (Basic, HRA, PF 12%, ESI, PT, TDS).',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      period: 'Monthly Payroll Cycle',
      file: 'Consolidated_Payroll_Report_Aug2026.pdf',
      summaryMetric: `${selectedBranch.monthlyPayrollTotal} Payroll Disbursed (${selectedBranch.activeStaffCount} Staff)`,
    },
    {
      id: 'REP-06',
      title: 'Executive P&L Net Operating Profit Report',
      category: 'Executive P&L',
      desc: 'Consolidated P&L net operating profit analysis, EBITDA margins, and regional benchmarks.',
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      period: 'Monthly / FY26',
      file: 'Executive_Profit_Report_Aug2026.pdf',
      summaryMetric: `${selectedBranch.grossProfitMargin} Gross EBITDA Margin`,
    },
    {
      id: 'REP-07',
      title: 'Salon Operational Expenses & Backbar COGS Report',
      category: 'Cost Accounting',
      desc: 'Operational overhead analysis, salon products inventory COGS, rent, utilities, and petty cash.',
      icon: <PieChart className="w-5 h-5 text-amber-600" />,
      period: 'Monthly / Quarterly',
      file: 'Expense_COGS_Report_Aug2026.pdf',
      summaryMetric: isAllBranches
        ? '₹39,80,000 Total OpEx (58.1% Expense Ratio)'
        : '₹28,400 Total OpEx',
    },
    {
      id: 'REP-08',
      title: 'Multi-Branch Comparative Financial Benchmark',
      category: 'Multi-Branch',
      desc: 'Comparative financial balance and revenue run-rate across Mumbai, Delhi, Bangalore, and Hyderabad.',
      icon: <Building2 className="w-5 h-5 text-blue-600" />,
      period: 'Monthly / Annual',
      file: 'Branch_Financial_Report_Aug2026.pdf',
      summaryMetric: '5 Operational Outlets + Central Depot',
    },
  ];

  const filteredReports = reportsList.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Statutory Financial &amp; Audit Reports
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Consolidated Reports' : `${selectedBranch.shortName} Reports`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Download audit-ready statutory reports: GSTR-1, GSTR-3B tax ledgers, P&amp;L
            profitability statements, stylist commissions, and payroll registers.
          </p>
        </div>

        <button
          onClick={() =>
            toast(`Export All Reports: Generated zip archive for ${selectedBranch.shortName}.`)
          }
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" /> Download All Reports (ZIP)
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search financial reports by title, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* 8 REPORT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredReports.map((r) => (
          <div
            key={r.id}
            className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  {r.id}
                </span>
                <div className="p-1.5 bg-paper rounded-xl">{r.icon}</div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-ink">{r.title}</h4>
                <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mt-0.5">
                  {r.category}
                </span>
                <p className="text-xs text-soft mt-1 leading-relaxed">{r.desc}</p>
              </div>

              <div className="p-2.5 bg-pine/5 rounded-xl border border-line text-[11px] font-semibold text-purple-900">
                {r.summaryMetric}
              </div>
            </div>

            <button
              onClick={() =>
                toast(`Export Report: Generated ${r.title} (${selectedBranch.shortName}) CSV.`)
              }
              className="w-full py-2 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              Download Report (CSV)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
