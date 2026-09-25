import { DialogModal } from '@/shared/components/DialogModal';
import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Info,
  Lock,
  PackageCheck,
  Plus,
  Printer,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export interface ReportItem {
  id: string;
  name: string;
  category:
    | 'EOD Closure'
    | 'Revenue & POS'
    | 'Staff & Payroll'
    | 'Consumables & Wastage'
    | 'Audit & Logs';
  size: string;
  date: string;
  author: string;
  branch: string;
  shift: string;
  status: 'Audited & Locked' | 'Pending Review' | 'Draft';
  totals: {
    expectedCash: number;
    actualCash: number;
    cashVariance: number;
    upiAmount: number;
    cardAmount: number;
    homeServiceAmount?: number;
    travelReimbursements?: number;
    totalTips: number;
    totalNetRevenue: number;
    posRefNo: string;
  };
  notes?: string;
  wastageAlerts?: number;
}

export const initialReports: ReportItem[] = [
  {
    id: 'RPT-2026-0831-EOD',
    name: 'Daily Operations & Cashier Closure (Aug 31)',
    category: 'EOD Closure',
    size: '450 KB',
    date: 'Aug 31, 2026',
    author: 'Priya Sharma',
    branch: 'Atelier Indrapuri Flagship',
    shift: 'Full Day',
    status: 'Audited & Locked',
    totals: {
      expectedCash: 16850,
      actualCash: 16850,
      cashVariance: 0,
      upiAmount: 9400,
      cardAmount: 6200,
      homeServiceAmount: 4500,
      travelReimbursements: 300,
      totalTips: 1850,
      totalNetRevenue: 38450,
      posRefNo: 'SETTLE-HDFC-99420',
    },
    notes:
      'All cash drawer notes & doorstep visit surcharges tallied with zero variance. 1 Home visit completed.',
    wastageAlerts: 0,
  },
  {
    id: 'RPT-2026-0830-EOD',
    name: 'Daily Operations & Cashier Closure (Aug 30)',
    category: 'EOD Closure',
    size: '480 KB',
    date: 'Aug 30, 2026',
    author: 'Priya Sharma',
    branch: 'Atelier Indrapuri Flagship',
    shift: 'Full Day',
    status: 'Audited & Locked',
    totals: {
      expectedCash: 14200,
      actualCash: 14000,
      cashVariance: -200,
      upiAmount: 8100,
      cardAmount: 5400,
      totalTips: 1300,
      totalNetRevenue: 28800,
      posRefNo: 'SETTLE-HDFC-99310',
    },
    notes: 'Shortfall of ₹200 investigated: client cash round-off approved by manager.',
    wastageAlerts: 1,
  },
  {
    id: 'RPT-2026-0828-PAY',
    name: 'Weekly Stylist Hours, Utilization & Commissions',
    category: 'Staff & Payroll',
    size: '1.2 MB',
    date: 'Aug 28, 2026',
    author: 'Priya Sharma',
    branch: 'Atelier Indrapuri Flagship',
    shift: 'Weekly Compilation',
    status: 'Audited & Locked',
    totals: {
      expectedCash: 0,
      actualCash: 0,
      cashVariance: 0,
      upiAmount: 0,
      cardAmount: 0,
      totalTips: 7200,
      totalNetRevenue: 156000,
      posRefNo: 'N/A',
    },
    notes: 'Commission tier threshold achieved for 6 senior specialists.',
    wastageAlerts: 0,
  },
  {
    id: 'RPT-2026-0825-INV',
    name: 'Consumable Recipe BOM & Spill Audit (Aug End-Month)',
    category: 'Consumables & Wastage',
    size: '640 KB',
    date: 'Aug 25, 2026',
    author: 'Priya Sharma',
    branch: 'Atelier Indrapuri Flagship',
    shift: 'Stocktake Audit',
    status: 'Audited & Locked',
    totals: {
      expectedCash: 0,
      actualCash: 0,
      cashVariance: 0,
      upiAmount: 0,
      cardAmount: 0,
      totalTips: 0,
      totalNetRevenue: 0,
      posRefNo: 'N/A',
    },
    notes: 'Hair color matrix developer variance within 2.0% tolerance threshold.',
    wastageAlerts: 1,
  },
];

export interface EodShiftClosuresTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function EodShiftClosuresTab({
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
}: EodShiftClosuresTabProps = {}) {
  const { toast } = useToast();

  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Modals state
  const [isEodModalOpen, setIsEodModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // EOD Form Dynamic State
  const [reportTypeScope, setReportTypeScope] = useState<ReportItem['category']>('EOD Closure');
  const [eodBranch, setEodBranch] = useState(defaultBranch);
  const [eodShift, setEodShift] = useState('Full Day (09:00 AM - 09:00 PM)');
  const [eodDate, setEodDate] = useState(new Date().toISOString().split('T')[0]);
  const [openingFloat, setOpeningFloat] = useState<number>(2000);
  const [expectedCash, setExpectedCash] = useState<number>(16850);
  const [actualCash, setActualCash] = useState<number>(16850);
  const [upiAmount, setUpiAmount] = useState<number>(9400);
  const [cardAmount, setCardAmount] = useState<number>(6200);
  const [homeServiceAmount, setHomeServiceAmount] = useState<number>(4500);
  const [travelReimbursements, setTravelReimbursements] = useState<number>(300);
  const [totalTips, setTotalTips] = useState<number>(1850);
  const [posRefNo, setPosRefNo] = useState<string>(
    'SETTLE-HDFC-' + Math.floor(10000 + Math.random() * 90000),
  );
  const [managerRemarks, setManagerRemarks] = useState('');
  const [compilerName, setCompilerName] = useState('Priya Sharma (Branch Manager)');
  const [lockLedger, setLockLedger] = useState(true);
  const [wastageAlertsCount, setWastageAlertsCount] = useState<number>(0);

  // Real-time computed states
  const cashVariance = Number((actualCash - expectedCash).toFixed(2));
  const totalNetRevenue =
    actualCash + upiAmount + cardAmount + homeServiceAmount - travelReimbursements;

  // Filtered reports
  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExportCsv = () => {
    const headers = [
      'Report ID',
      'Name',
      'Category',
      'Branch',
      'Date',
      'Shift',
      'Net Revenue',
      'Actual Cash',
      'Variance',
      'Status',
    ];
    const rows = filteredReports.map((r) => [
      r.id,
      `"${r.name}"`,
      r.category,
      `"${r.branch}"`,
      r.date,
      r.shift,
      r.totals.totalNetRevenue,
      r.totals.actualCash,
      r.totals.cashVariance,
      r.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EOD_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('✅ EOD Register exported to CSV successfully.');
  };

  const handleCreateEOD = (e: React.FormEvent) => {
    e.preventDefault();

    const d = new Date(eodDate);
    const formattedDate = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    let titlePrefix = 'Daily Operations & Cashier Closure';
    if (reportTypeScope === 'Revenue & POS') titlePrefix = 'POS Settlement & Batch Reconciliation';
    if (reportTypeScope === 'Staff & Payroll')
      titlePrefix = 'Staff Floor Hours & Commissions Summary';
    if (reportTypeScope === 'Consumables & Wastage')
      titlePrefix = 'Dispensary Consumable & Wastage Tally';
    if (reportTypeScope === 'Audit & Logs') titlePrefix = 'Branch Security & Audit Log Register';

    const newReport: ReportItem = {
      id: `RPT-2026-${String(Math.floor(1000 + Math.random() * 9000))}-EOD`,
      name: `${titlePrefix} (${formattedDate})`,
      category: reportTypeScope,
      size: '520 KB',
      date: formattedDate,
      author: compilerName,
      branch: eodBranch,
      shift: eodShift.split(' ')[0],
      status: lockLedger ? 'Audited & Locked' : 'Pending Review',
      totals: {
        expectedCash,
        actualCash,
        cashVariance,
        upiAmount,
        cardAmount,
        homeServiceAmount,
        travelReimbursements,
        totalTips,
        totalNetRevenue,
        posRefNo,
      },
      notes: managerRemarks,
      wastageAlerts: wastageAlertsCount,
    };

    setReports([newReport, ...reports]);
    setIsEodModalOpen(false);
    setSelectedReport(newReport);
    toast(
      `✅ ${titlePrefix} successfully generated & ledger ${lockLedger ? 'locked' : 'compiled'}!`,
    );
  };

  const latestEod = reports.find((r) => r.category === 'EOD Closure');
  const todayTotalRevenue = latestEod ? latestEod.totals.totalNetRevenue : 38450;
  const todayCashVariance = latestEod ? latestEod.totals.cashVariance : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header ── */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Cashier Shift Closure &amp; EOD Register
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Shift #01 Verified
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Compile daily cashier shift closures, reconcile cash drawer float, verify POS EDC
            batches, and lock day transactions for {defaultBranch}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={handleExportCsv}
            variant="outline"
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#5A2EA6]" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={() => setIsEodModalOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Generate End-of-Day</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Metrics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#5A2EA6]/15 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-soft uppercase tracking-wider mb-1">
              Today's Net Revenue
            </p>
            <h3 className="text-2xl font-serif font-bold text-ink tracking-tight">
              ₹{todayTotalRevenue.toLocaleString('en-IN')}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
              <TrendingUp className="w-3 h-3" /> Reconciled with POS
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#5A2EA6]/15 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-soft uppercase tracking-wider mb-1">
              Cash Register Tally
            </p>
            <h3 className="text-2xl font-serif font-bold text-ink tracking-tight">
              ₹{(latestEod?.totals.actualCash || 16850).toLocaleString('en-IN')}
            </h3>
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[10px] font-bold mt-1',
                todayCashVariance === 0 ? 'text-emerald-600' : 'text-amber-600',
              )}
            >
              {todayCashVariance === 0 ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> Zero Discrepancy Match
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" /> Discrepancy: ₹{todayCashVariance}
                </>
              )}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#5A2EA6]/15 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-soft uppercase tracking-wider mb-1">
              Staff Gratuity / Tips
            </p>
            <h3 className="text-2xl font-serif font-bold text-ink tracking-tight">
              ₹{(latestEod?.totals.totalTips || 1850).toLocaleString('en-IN')}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5A2EA6] mt-1">
              <User className="w-3 h-3" /> Allocated across 8 Stylists
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#5A2EA6]/15 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-soft uppercase tracking-wider mb-1">
              Ledger Audit State
            </p>
            <h3 className="text-lg font-serif font-bold text-emerald-700 tracking-tight flex items-center gap-1.5 mt-1">
              <Lock className="w-4 h-4 text-emerald-600" /> Locked &amp; Audited
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted mt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Backdated edits disabled
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Category Filters & Search Bar ── */}
      <div className="bg-white border border-[#5A2EA6]/10 rounded-[20px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { label: 'All Audits', val: 'All' },
            { label: 'EOD Closure', val: 'EOD Closure' },
            { label: 'Revenue & POS', val: 'Revenue & POS' },
            { label: 'Staff & Payroll', val: 'Staff & Payroll' },
            { label: 'Consumables & Wastage', val: 'Consumables & Wastage' },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setActiveCategory(tab.val)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border',
                activeCategory === tab.val
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                  : 'bg-[#FCFAFF] text-soft border-purple-100 hover:text-ink hover:bg-purple-50/50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report archive by title, ID..."
            className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl py-2 pl-9 pr-4 text-xs text-ink font-semibold outline-none focus:border-[#5A2EA6] transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-soft" />
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between shadow-sm">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex items-center justify-between">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Local Branch Audits Registry
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Daily cashier closures, settlement registers, and immutable audit logs
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredReports.length} Archives
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                <th className="p-3.5 pl-5 font-bold text-[9.5px] uppercase tracking-wider">
                  Report &amp; Scope
                </th>
                <th className="p-3.5 font-bold text-[9.5px] uppercase tracking-wider">
                  Date &amp; Shift
                </th>
                <th className="p-3.5 font-bold text-[9.5px] uppercase tracking-wider">
                  Compiled By
                </th>
                <th className="p-3.5 font-bold text-[9.5px] uppercase tracking-wider">
                  Cash Tally / Variance
                </th>
                <th className="p-3.5 font-bold text-[9.5px] uppercase tracking-wider">
                  Total Net Revenue
                </th>
                <th className="p-3.5 font-bold text-[9.5px] uppercase tracking-wider">
                  Audit State
                </th>
                <th className="p-3.5 pr-5 font-bold text-[9.5px] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs text-ink block font-bold">{report.name}</strong>
                        <span className="text-[10px] text-soft flex items-center gap-1.5">
                          <span>{report.id}</span>
                          <span>·</span>
                          <span className="text-[#5A2EA6] font-semibold">{report.category}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-xs font-semibold text-ink">{report.date}</div>
                    <span className="text-[10px] text-soft">{report.shift}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="text-xs font-semibold text-ink">{report.author}</div>
                    <span className="text-[10px] text-soft">{report.branch}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="text-xs font-bold text-ink">
                      ₹{report.totals.actualCash.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-bold',
                        report.totals.cashVariance === 0 ? 'text-emerald-700' : 'text-rose-700',
                      )}
                    >
                      {report.totals.cashVariance === 0
                        ? '0.00 Variance'
                        : `₹${report.totals.cashVariance} Discrepancy`}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <strong className="text-xs font-bold text-emerald-800">
                      ₹{report.totals.totalNetRevenue.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[10px] text-soft block">
                      POS: {report.totals.posRefNo}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                      <ShieldCheck className="w-3 h-3" />
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedReport(report)}
                      className="h-8 px-3 rounded-lg text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> View Dossier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal 1: Generate EOD Shift Closure Modal ── */}
      <DialogModal
        isOpen={isEodModalOpen}
        onClose={() => setIsEodModalOpen(false)}
        title="Generate Cashier Shift Closure & Audit Ledger"
      >
        <form onSubmit={handleCreateEOD} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Report Category</label>
              <select
                value={reportTypeScope}
                onChange={(e) => setReportTypeScope(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl border border-purple-200 bg-[#FCFAFF] text-xs font-semibold text-ink"
              >
                <option value="EOD Closure">EOD Shift Closure</option>
                <option value="Revenue & POS">Revenue & POS Settlement</option>
                <option value="Staff & Payroll">Staff Hours & Commissions</option>
                <option value="Consumables & Wastage">Consumables & Dispensary</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Closing Date</label>
              <input
                type="date"
                value={eodDate}
                onChange={(e) => setEodDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-purple-200 bg-[#FCFAFF] text-xs font-semibold text-ink"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Shift Period</label>
              <select
                value={eodShift}
                onChange={(e) => setEodShift(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-purple-200 bg-[#FCFAFF] text-xs font-semibold text-ink"
              >
                <option value="Full Day (09:00 AM - 09:00 PM)">Full Day (09:00 - 21:00)</option>
                <option value="Morning Shift (09:00 AM - 03:00 PM)">
                  Morning Shift (09:00 - 15:00)
                </option>
                <option value="Evening Shift (03:00 PM - 09:00 PM)">
                  Evening Shift (15:00 - 21:00)
                </option>
              </select>
            </div>
          </div>

          <div className="bg-[#FAF7FF] p-4 rounded-2xl border border-purple-100 space-y-3">
            <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
              Cash Drawer Physical Count &amp; Reconciliation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted block mb-0.5">
                  Opening Float (₹)
                </label>
                <input
                  type="number"
                  value={openingFloat}
                  onChange={(e) => setOpeningFloat(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-lg border border-purple-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted block mb-0.5">
                  Expected Cash (₹)
                </label>
                <input
                  type="number"
                  value={expectedCash}
                  onChange={(e) => setExpectedCash(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-lg border border-purple-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted block mb-0.5">
                  Actual Cash Counted (₹)
                </label>
                <input
                  type="number"
                  value={actualCash}
                  onChange={(e) => setActualCash(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-lg border border-purple-200 bg-white text-xs font-bold text-[#5A2EA6]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted block mb-0.5">
                  Cash Variance (₹)
                </label>
                <div
                  className={cn(
                    'h-8 px-2.5 rounded-lg border flex items-center font-bold text-xs',
                    cashVariance === 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200',
                  )}
                >
                  {cashVariance === 0 ? '₹0 (Perfect Match)' : `₹${cashVariance}`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-purple-100">
              <div>
                <label className="text-[11px] font-bold text-muted block mb-0.5">
                  UPI Digital (₹)
                </label>
                <input
                  type="number"
                  value={upiAmount}
                  onChange={(e) => setUpiAmount(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-lg border border-purple-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted block mb-0.5">
                  EDC Card (₹)
                </label>
                <input
                  type="number"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-lg border border-purple-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted block mb-0.5">
                  Staff Tips (₹)
                </label>
                <input
                  type="number"
                  value={totalTips}
                  onChange={(e) => setTotalTips(Number(e.target.value))}
                  className="w-full h-8 px-2.5 rounded-lg border border-purple-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted block mb-0.5">
                  Computed Total Net (₹)
                </label>
                <div className="h-8 px-2.5 rounded-lg bg-[#5A2EA6] text-white flex items-center font-bold text-xs">
                  ₹{totalNetRevenue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Manager Handover Remarks &amp; Audit Notes
            </label>
            <textarea
              rows={2}
              value={managerRemarks}
              onChange={(e) => setManagerRemarks(e.target.value)}
              placeholder="Record any shift discrepancies, client refunds, or consumable exceptions..."
              className="w-full p-2.5 rounded-xl border border-purple-200 bg-[#FCFAFF] text-xs font-medium text-ink"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lockLedger}
                onChange={(e) => setLockLedger(e.target.checked)}
                className="w-4 h-4 text-[#5A2EA6] rounded accent-[#5A2EA6]"
              />
              <span className="text-xs font-bold text-ink">
                Sign &amp; Lock Ledger (Immutable Audit)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEodModalOpen(false)}
                className="h-9 px-4 rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 rounded-xl text-xs font-bold premium-btn-primary"
              >
                Compile &amp; Sign EOD
              </Button>
            </div>
          </div>
        </form>
      </DialogModal>

      {/* ── Modal 2: View Dossier Detail ── */}
      {selectedReport && (
        <DialogModal
          isOpen={true}
          onClose={() => setSelectedReport(null)}
          title={`Audit Dossier · ${selectedReport.id}`}
        >
          <div className="space-y-4 pt-2">
            <div className="bg-[#FAF7FF] p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-ink">{selectedReport.name}</h3>
                <p className="text-xs text-soft">
                  {selectedReport.branch} · {selectedReport.shift} · {selectedReport.date}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {selectedReport.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-muted block uppercase font-bold">
                  Actual Cash Count
                </span>
                <strong className="text-sm font-bold text-ink">
                  ₹{selectedReport.totals.actualCash.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-muted block uppercase font-bold">
                  UPI / Cards
                </span>
                <strong className="text-sm font-bold text-ink">
                  ₹
                  {(
                    selectedReport.totals.upiAmount + selectedReport.totals.cardAmount
                  ).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-muted block uppercase font-bold">
                  Total Net Revenue
                </span>
                <strong className="text-sm font-bold text-emerald-700">
                  ₹{selectedReport.totals.totalNetRevenue.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            {selectedReport.notes && (
              <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 text-xs">
                <span className="text-[10px] text-muted block uppercase font-bold mb-1">
                  Audit Notes:
                </span>
                <p className="text-ink font-medium">{selectedReport.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setSelectedReport(null)}
                className="h-9 px-4 rounded-xl text-xs font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogModal>
      )}
    </div>
  );
}

export default EodShiftClosuresTab;
