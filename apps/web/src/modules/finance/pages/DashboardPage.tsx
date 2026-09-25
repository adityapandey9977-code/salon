import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Coins,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Globe,
  Landmark,
  Lock,
  MapPin,
  PieChart,
  Plus,
  Receipt,
  RotateCcw,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [activeTab, setActiveTab] = useState<'overview' | 'multiBranchMatrix' | 'reconciliation'>(
    'overview',
  );

  // Automatically reset tab to overview if branch is selected
  useEffect(() => {
    if (!isAllBranches && activeTab === 'multiBranchMatrix') {
      setActiveTab('overview');
    }
  }, [isAllBranches, activeTab]);

  // MODAL STATE FOR ALL 5 QUICK ACTION BUTTONS
  const [activeModal, setActiveModal] = useState<
    | 'create-receipt'
    | 'approve-refund'
    | 'generate-payroll'
    | 'export-payroll'
    | 'view-profitability'
    | null
  >(null);

  // FORM STATES (Pre-bound to active branch)
  const [receiptForm, setReceiptForm] = useState({
    clientName: '',
    outletBranch: selectedBranch.name,
    paymentChannel: 'UPI (GPay Dynamic QR)',
    serviceAmount: '',
  });

  const [refundForm, setRefundForm] = useState({
    refundRef: 'REF-401',
    clientName: 'Ananya Roy',
    amount: '1500',
    refundMethod: 'Digital Salon Wallet Credit',
  });

  const [payrollForm, setPayrollForm] = useState({
    period: 'August 2026',
    branch: selectedBranch.name,
    totalAmount: '2480000',
  });

  const [exportForm, setExportForm] = useState({
    format: 'HDFC Corporate Direct Deposit (.CSV)',
  });

  // Keep modal forms in sync when branch changes
  useEffect(() => {
    setReceiptForm((prev) => ({ ...prev, outletBranch: selectedBranch.name }));
    setPayrollForm((prev) => ({ ...prev, branch: selectedBranch.name }));
  }, [selectedBranch]);

  // DYNAMIC 8 KPI CARDS BOUND TO MULTI-BRANCH CONTEXT
  const kpiCards = [
    {
      label: isAllBranches ? "Today's Chain Revenue" : `${selectedBranch.shortName} Revenue`,
      value: selectedBranch.todayRevenue,
      pct: '↑ 18.2% vs yesterday',
      stroke: '#10b981',
      sparkPath: 'M0 18 Q 15 10, 30 14 T 60 4',
      highlight: 'bg-emerald-50 text-emerald-800',
    },
    {
      label: "Today's Receipts",
      value: `${selectedBranch.todayReceiptsCount} Invoices`,
      pct: '100% GST SAC 999721 Compliant',
      stroke: '#5A2EA6',
      sparkPath: 'M0 20 Q 15 15, 30 18 T 60 8',
      highlight: 'bg-purple-50 text-purple-800',
    },
    {
      label: "Today's Refunds",
      value: selectedBranch.todayRefunds,
      pct: selectedBranch.todayRefunds === '₹0' ? 'Zero Void Losses' : '1 Authorized Refund',
      stroke: '#ef4444',
      sparkPath: 'M0 10 Q 15 16, 30 12 T 60 20',
      highlight: 'bg-rose-50 text-rose-800',
    },
    {
      label: 'Pending Settlements',
      value: selectedBranch.pendingSettlements,
      pct: 'Razorpay & PineLabs POS Batch',
      stroke: '#f59e0b',
      sparkPath: 'M0 22 Q 15 16, 30 18 T 60 10',
      highlight: 'bg-amber-50 text-amber-800',
    },
    {
      label: 'Monthly Payroll Pool',
      value: selectedBranch.monthlyPayrollTotal,
      pct: `${selectedBranch.activeStaffCount} Staff (PF/ESI/TDS ready)`,
      stroke: '#3b82f6',
      sparkPath: 'M0 12 Q 15 14, 30 10 T 60 4',
      highlight: 'bg-blue-50 text-blue-800',
    },
    {
      label: 'Stylist Commissions',
      value: selectedBranch.commissionsEarned,
      pct: 'Tiered Graduated Slabs (5-15%)',
      stroke: '#10b981',
      sparkPath: 'M0 18 Q 15 12, 30 15 T 60 6',
      highlight: 'bg-emerald-50 text-emerald-800',
    },
    {
      label: 'Gross Profit Margin',
      value: selectedBranch.grossProfitMargin,
      pct: 'Healthy EBITDA Band (>30%)',
      stroke: '#10b981',
      sparkPath: 'M0 16 Q 15 10, 30 14 T 60 2',
      highlight: 'bg-purple-50 text-purple-900',
    },
    {
      label: 'Net GST Liability',
      value: selectedBranch.netGstPayable,
      pct: 'GSTR-3B Output vs Input Offset',
      stroke: '#6366f1',
      sparkPath: 'M0 8 Q 15 14, 30 10 T 60 18',
      highlight: 'bg-indigo-50 text-indigo-800',
    },
  ];

  // EXECUTIVE QUICK LINKS GRID
  const quickLinks = [
    {
      title: 'Sales Receipts & GST',
      path: '/receipts',
      icon: <Receipt className="w-5 h-5 text-purple-600" />,
      desc: 'B2C Invoices & SAC 999721 (18% GST)',
      badge: `${selectedBranch.todayReceiptsCount} Today`,
    },
    {
      title: 'Refund Authorizations',
      path: '/refunds',
      icon: <RotateCcw className="w-5 h-5 text-rose-600" />,
      desc: 'Digital Wallet Credits & Reversals',
      badge: selectedBranch.todayRefunds,
    },
    {
      title: 'Drawer & Settlements',
      path: '/settlements',
      icon: <Landmark className="w-5 h-5 text-amber-600" />,
      desc: 'Cash Float, Z-Report & POS Payouts',
      badge: selectedBranch.pendingSettlements,
    },
    {
      title: 'Stylist Commissions',
      path: '/commissions',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      desc: 'Tiered Slabs, Retail % & Tip Pass-through',
      badge: selectedBranch.commissionsEarned,
    },
    {
      title: 'Monthly Payroll Run',
      path: '/payroll',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      desc: 'PF (12%), ESI, PT & Salary Slips',
      badge: `${selectedBranch.activeStaffCount} Staff`,
    },
    {
      title: 'Unit P&L Profitability',
      path: '/profitability',
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      desc: 'EBITDA Margins, COGS & Chair Economics',
      badge: selectedBranch.grossProfitMargin,
    },
    {
      title: 'Payroll ERP & Bank Export',
      path: '/payroll-export',
      icon: <FileSpreadsheet className="w-5 h-5 text-blue-600" />,
      desc: 'HDFC/ICICI CMS NEFT Batch & Tally XML',
      badge: '4 Formats',
    },
    {
      title: 'Statutory Reports',
      path: '/reports',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      desc: 'GSTR-1, GSTR-3B & Balance Sheet',
      badge: 'Audit Ready',
    },
  ];

  // RECENT TRANSACTIONS LEDGER WITH BRANCH TAGGING
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 'RCP-8801',
      client: 'Aakanksha Sharma',
      amount: '₹4,200',
      mode: 'UPI (GPay QR)',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      status: 'Completed',
      date: '2026-08-07 11:20 AM',
    },
    {
      id: 'REF-402',
      client: 'Ananya Roy',
      amount: '₹1,500',
      mode: 'Wallet Refund',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      status: 'Approved',
      date: '2026-08-07 10:45 AM',
    },
    {
      id: 'STL-992',
      client: 'Razorpay POS Gateway',
      amount: '₹3,45,000',
      mode: 'Bank Direct Credit',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      status: 'Settled',
      date: '2026-08-06 06:00 PM',
    },
    {
      id: 'PAY-801',
      client: 'Vikram Kulkarni (Senior Colorist)',
      amount: '₹55,000',
      mode: 'HDFC Direct Deposit',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      status: 'Disbursed',
      date: '2026-08-01 09:00 AM',
    },
    {
      id: 'RCP-8799',
      client: 'Meenakshi Sundaram',
      amount: '₹2,500',
      mode: 'Prepaid Wallet',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      status: 'Completed',
      date: '2026-08-06 05:40 PM',
    },
    {
      id: 'PAY-803',
      client: 'Kavita Sundaram (Hair Specialist)',
      amount: '₹40,000',
      mode: 'Kotak Direct Deposit',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      status: 'Disbursed',
      date: '2026-08-01 09:00 AM',
    },
    {
      id: 'RCP-8750',
      client: 'Rajesh Kumar',
      amount: '₹1,200',
      mode: 'Cash Register',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      status: 'Completed',
      date: '2026-08-06 02:30 PM',
    },
    {
      id: 'PAY-804',
      client: 'Suresh Varma (Stylist)',
      amount: '₹45,000',
      mode: 'SBI Direct Transfer',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      status: 'Disbursed',
      date: '2026-08-01 09:00 AM',
    },
  ]);

  const handleCreateReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptForm.clientName || !receiptForm.serviceAmount) return;

    const newId = `RCP-${Math.floor(8800 + Math.random() * 99)}`;
    const amt = Number(receiptForm.serviceAmount);

    setRecentTransactions([
      {
        id: newId,
        client: receiptForm.clientName,
        amount: `₹${amt.toLocaleString('en-IN')}`,
        mode: receiptForm.paymentChannel,
        branch: receiptForm.outletBranch,
        branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
        status: 'Completed',
        date: new Date().toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          month: 'short',
          day: 'numeric',
        }),
      },
      ...recentTransactions,
    ]);

    setActiveModal(null);
    setReceiptForm({
      clientName: '',
      outletBranch: selectedBranch.name,
      paymentChannel: 'UPI (GPay Dynamic QR)',
      serviceAmount: '',
    });
    toast(
      `Sales Receipt Issued: [${newId}] generated for ${receiptForm.clientName} at ${selectedBranch.shortName}.`,
    );
  };

  const handleApproveRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    toast(
      `Refund Authorized: Refund ${refundForm.refundRef} (${refundForm.clientName}) approved & credited via ${refundForm.refundMethod}.`,
    );
  };

  const handleGeneratePayrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    toast(
      `Payroll Generated: ${payrollForm.period} monthly payroll batch (₹24,80,000) generated for ${selectedBranch.activeStaffCount} employees at ${selectedBranch.shortName}.`,
    );
  };

  // Strictly filter recent transactions by selected branch
  const filteredRecentTransactions = recentTransactions.filter(
    (tx) => isAllBranches || tx.branchId === selectedBranchId,
  );

  // Available tabs: Multi-Branch Matrix only shows when isAllBranches is true!
  const availableTabs = [
    { id: 'overview', label: 'Financial Overview & KPIs' },
    ...(isAllBranches
      ? [{ id: 'multiBranchMatrix', label: 'Multi-Branch Revenue & Cash Matrix' }]
      : []),
    {
      id: 'reconciliation',
      label: isAllBranches
        ? 'Daily Register & Gateway Settlements'
        : `${selectedBranch.shortName} Register & Drawer Settlements`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Finance &amp; Accounts Command Center
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Consolidated Enterprise Ledger' : `${selectedBranch.shortName}`}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Coins className="w-3 h-3 text-emerald-700" /> GST SAC 999721 Active
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Real-time financial performance, daily register drawer balances, GST tax compliance, tiered stylist commissions, and statutory payroll across the entire salon network.'
              : `Viewing real-time financial ledger, daily cash drawer floats, receipts, and payroll specifically for ${selectedBranch.name}.`}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveModal('create-receipt')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" /> Issue Sales Receipt
          </button>

          <button
            onClick={() => setActiveModal('approve-refund')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-line hover:bg-paper text-ink rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" /> Authorize Refund
          </button>

          <button
            onClick={() => setActiveModal('generate-payroll')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-line hover:bg-paper text-ink rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" /> Generate Payroll
          </button>

          <button
            onClick={() =>
              toast(`Export Financial Summary: Ledger exported for ${selectedBranch.shortName}.`)
            }
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export Summary
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB SWITCHER (Multi-Branch Matrix only shows when isAllBranches is true) */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* 8 DYNAMIC KPI METRIC CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {kpiCards.map((kpi, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-line shadow-xs space-y-1.5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9.5px] font-bold text-soft uppercase tracking-wider block truncate">
                    {kpi.label}
                  </span>
                  <div className="text-base font-bold text-ink tracking-tight mt-0.5 truncate">
                    {kpi.value}
                  </div>
                </div>
                <div className="pt-1 border-t border-line/40">
                  <span className="text-[9px] font-semibold text-soft block truncate">
                    {kpi.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* EXECUTIVE QUICK MODULE LINKS GRID */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                Financial Operations &amp; Statutory Sub-Modules
              </span>
              <span className="text-[11px] text-soft">
                Showing operational modules for {selectedBranch.shortName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickLinks.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="bg-white p-4 rounded-2xl border border-line shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-purple-50 rounded-xl text-purple-900 group-hover:scale-105 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100/70 text-purple-900 px-2 py-0.5 rounded-full border border-purple-200/50">
                        {item.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink group-hover:text-[#5A2EA6] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-soft mt-0.5 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10.5px] font-bold text-[#5A2EA6] pt-2 border-t border-line/40">
                    <span>Launch Desk</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT TRANSACTIONS & CASH LEDGER (Strictly filtered by selected branch) */}
          <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden space-y-3 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
              <div>
                <h3 className="font-bold text-sm text-ink">
                  Recent Sales Receipts &amp; Payout Journals{' '}
                  {isAllBranches ? '(All Branches)' : `(${selectedBranch.shortName})`}
                </h3>
                <p className="text-xs text-soft">
                  {isAllBranches
                    ? 'Live financial postings across all network billing channels'
                    : `Live postings strictly recorded at ${selectedBranch.name}`}
                </p>
              </div>
              <button
                onClick={() => navigate('/receipts')}
                className="text-xs font-bold text-[#5A2EA6] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer self-start sm:self-auto"
              >
                View Full Receipts Ledger <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                    <th className="p-2.5">Transaction Ref &amp; Date</th>
                    <th className="p-2.5">Client / Payee</th>
                    <th className="p-2.5">Branch Location</th>
                    <th className="p-2.5">Payment Tender</th>
                    <th className="p-2.5">Amount (₹)</th>
                    <th className="p-2.5">Posting Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {filteredRecentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-2.5 font-bold text-purple-700">
                        <div>{tx.id}</div>
                        <div className="text-[10px] text-muted">{tx.date}</div>
                      </td>
                      <td className="p-2.5 font-bold text-ink">{tx.client}</td>
                      <td className="p-2.5 text-soft font-medium flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                        {tx.branch}
                      </td>
                      <td className="p-2.5 font-semibold text-ink">{tx.mode}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{tx.amount}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: MULTI-BRANCH REVENUE & CASH HEALTH MATRIX (ONLY ACCESSIBLE WHEN isAllBranches IS TRUE) */}
      {isAllBranches && activeTab === 'multiBranchMatrix' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-ink">
              Multi-Branch Financial Performance &amp; Cash Health Matrix
            </h3>
            <p className="text-xs text-soft mt-0.5">
              Side-by-side comparative ledger comparing all 5 salon outlets and central depot across
              collections, drawer cash, EBITDA %, payroll, and lead accountants.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-3">Branch &amp; Code</th>
                  <th className="p-3">Location &amp; GSTIN</th>
                  <th className="p-3">Today's Revenue</th>
                  <th className="p-3">Receipts Count</th>
                  <th className="p-3">Cash In Drawer</th>
                  <th className="p-3">Gross Margin</th>
                  <th className="p-3">Payroll &amp; Staff</th>
                  <th className="p-3">GST Liability</th>
                  <th className="p-3 text-right">Accounting Desk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {branches
                  .filter((b) => b.id !== 'all')
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-ink">{b.name}</div>
                        <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                          {b.code}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-ink">
                          {b.city}, {b.state}
                        </div>
                        <div className="text-[9.5px] font-mono text-muted">{b.gstin}</div>
                      </td>
                      <td className="p-3 font-bold text-emerald-700 text-sm">{b.todayRevenue}</td>
                      <td className="p-3 font-semibold text-ink">
                        {b.todayReceiptsCount} Invoices
                      </td>
                      <td className="p-3 font-bold text-purple-900">{b.cashInDrawer}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {b.grossProfitMargin}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-ink">{b.monthlyPayrollTotal}</div>
                        <div className="text-[10px] text-soft">
                          {b.activeStaffCount} Active Staff
                        </div>
                      </td>
                      <td className="p-3 font-bold text-indigo-700">{b.netGstPayable}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedBranchId(b.id);
                            toast(
                              `Accounting Scope Switched: Viewing financial ledger for ${b.shortName}.`,
                            );
                          }}
                          className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-bold border border-purple-200 cursor-pointer transition-colors"
                        >
                          Select Scope
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DAILY REGISTER & SETTLEMENTS */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-bold text-base text-ink">
                {isAllBranches
                  ? 'Daily Cash Drawer & POS Batch Reconciliation (All Outlets)'
                  : `${selectedBranch.shortName} Daily Cash Drawer & Settlements`}
              </h3>
              <p className="text-xs text-soft">
                {isAllBranches
                  ? 'Network-wide shift opening float, cash drops, petty cash vouchers, and POS gateway settlements'
                  : `Cash float, drops, and settlements registered specifically at ${selectedBranch.name}`}
              </p>
            </div>
            <button
              onClick={() => navigate('/settlements')}
              className="px-4 py-2 bg-[#5A2EA6] text-white text-xs font-bold rounded-xl border-0 cursor-pointer shadow-xs"
            >
              Open Full Settlements Desk
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-800">
                1. Physical Cash in Drawer
              </span>
              <div className="text-2xl font-bold text-emerald-900">
                {selectedBranch.cashInDrawer}
              </div>
              <p className="text-[11px] text-emerald-700">
                Opening float ₹5,000 + collections at {selectedBranch.shortName}
              </p>
            </div>

            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-purple-800">
                2. Gateway Settled (T+1)
              </span>
              <div className="text-2xl font-bold text-purple-900">
                {selectedBranch.pendingSettlements}
              </div>
              <p className="text-[11px] text-purple-700">
                Net after 1.5% MDR &amp; GST gateway fees
              </p>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-indigo-800">
                3. Net GST Accrued
              </span>
              <div className="text-2xl font-bold text-indigo-900">
                {selectedBranch.netGstPayable}
              </div>
              <p className="text-[11px] text-indigo-700">
                Output tax collected minus supplier ITC at {selectedBranch.shortName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE RECEIPT MODAL */}
      {activeModal === 'create-receipt' &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Issue Sales Receipt &amp; Tax Invoice
                  </h3>
                  <p className="text-xs text-soft">
                    Generate customer receipt with SAC 999721 GST tax breakdown
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReceiptSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aakanksha Sharma"
                      value={receiptForm.clientName}
                      onChange={(e) =>
                        setReceiptForm({ ...receiptForm, clientName: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Salon Branch Outlet *
                    </label>
                    {isAllBranches ? (
                      <select
                        value={receiptForm.outletBranch}
                        onChange={(e) =>
                          setReceiptForm({ ...receiptForm, outletBranch: e.target.value })
                        }
                        className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                      >
                        {branches
                          .filter((b) => b.id !== 'all')
                          .map((b) => (
                            <option key={b.id} value={b.name}>
                              {b.name} ({b.city})
                            </option>
                          ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        disabled
                        value={selectedBranch.name}
                        className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-semibold text-ink"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Total Bill Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4200"
                      value={receiptForm.serviceAmount}
                      onChange={(e) =>
                        setReceiptForm({ ...receiptForm, serviceAmount: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-purple-300 rounded-xl font-bold text-purple-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Payment Tender Channel *
                    </label>
                    <select
                      value={receiptForm.paymentChannel}
                      onChange={(e) =>
                        setReceiptForm({ ...receiptForm, paymentChannel: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      <option value="UPI (GPay Dynamic QR)">UPI (GPay / PhonePe QR)</option>
                      <option value="HDFC Credit Card POS">Credit / Debit Card POS</option>
                      <option value="Cash Collections">Physical Cash Collections</option>
                      <option value="Digital Wallet Pass">Salon Prepaid Wallet</option>
                      <option value="Gift Card Redemption">Gift Card Voucher</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    GST Tax Calculation (18% Included)
                  </span>
                  <p className="text-[11px] text-purple-800">
                    SAC 999721: CGST 9% + SGST 9% will be automatically itemized on the printable
                    PDF invoice.
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Issue Receipt &amp; Post Ledger
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* APPROVE REFUND MODAL */}
      {activeModal === 'approve-refund' &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Authorize Refund / Credit Note
                  </h3>
                  <p className="text-xs text-soft">
                    Manager approval for client refund reversal at {selectedBranch.shortName}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApproveRefundSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Refund Reference
                    </label>
                    <input
                      type="text"
                      disabled
                      value={refundForm.refundRef}
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-mono font-bold text-purple-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={refundForm.clientName}
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Refund Method *
                  </label>
                  <select
                    value={refundForm.refundMethod}
                    onChange={(e) => setRefundForm({ ...refundForm, refundMethod: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    <option value="Digital Salon Wallet Credit">
                      Digital Salon Wallet Credit (Instant)
                    </option>
                    <option value="Original Payment Gateway Reversal">
                      Original Payment Method (Razorpay / POS)
                    </option>
                    <option value="Cash Return Voucher">Cash Return Voucher</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Approve Refund (₹1,500)
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* GENERATE PAYROLL MODAL */}
      {activeModal === 'generate-payroll' &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Generate Monthly Payroll Run
                  </h3>
                  <p className="text-xs text-soft">
                    Execute salary batch with PF, ESI, TDS &amp; stylist commissions
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGeneratePayrollSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Pay Period
                    </label>
                    <input
                      type="text"
                      disabled
                      value={payrollForm.period}
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-bold text-purple-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Branch Scope
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedBranch.name}
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Estimated Payout
                  </span>
                  <div className="text-xl font-bold text-emerald-900">
                    {selectedBranch.monthlyPayrollTotal}
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    {selectedBranch.activeStaffCount} active staff accounts synchronized at{' '}
                    {selectedBranch.shortName}.
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Confirm &amp; Generate Batch
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
