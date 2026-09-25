import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  Gift,
  Globe,
  Landmark,
  Lock,
  MapPin,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  Sparkles,
  Unlock,
  Wallet,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function SettlementsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [activeTab, setActiveTab] = useState<'register' | 'gateways' | 'pettyCash'>('register');
  const [searchQuery, setSearchQuery] = useState('');
  const [isZReportModalOpen, setIsZReportModalOpen] = useState(false);
  const [isPettyCashModalOpen, setIsPettyCashModalOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);

  // FORM FOR DAILY Z-REPORT CLOSING
  const [zReportForm, setZReportForm] = useState({
    branch: selectedBranch.name,
    openingFloat: 5000,
    systemExpectedCash: 45200,
    physicalCashCount: 45200,
    cashDrops: 20000,
    varianceReason: 'Zero Discrepancy (Perfect Balance)',
    closedBy: `${selectedBranch.leadAccountant} (Cashier)`,
  });

  // FORM FOR PETTY CASH EXPENSE VOUCHER
  const [pettyCashForm, setPettyCashForm] = useState({
    voucherNo: `PETTY-${Math.floor(700 + Math.random() * 90)}`,
    branch: selectedBranch.name,
    expenseHead: 'Salon Laundry & Towel Sanitation',
    amount: 650,
    paidTo: 'Sparkle Fresh Drycleaners',
    authorizedBy: `${selectedBranch.leadAccountant}`,
    remarks: 'Emergency dry-cleaning for 40 spa towels',
  });

  useEffect(() => {
    setZReportForm((prev) => ({
      ...prev,
      branch: selectedBranch.name,
      closedBy: `${selectedBranch.leadAccountant} (Cashier)`,
    }));
    setPettyCashForm((prev) => ({
      ...prev,
      branch: selectedBranch.name,
      authorizedBy: `${selectedBranch.leadAccountant}`,
    }));
  }, [selectedBranch]);

  // DAILY CLOSING COLLECTION CHANNEL METRICS
  const collectionMetrics = [
    {
      channel: 'Cash Drawer',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      amount: selectedBranch.cashInDrawer,
      pct: 'Shift Cash + Float',
    },
    {
      channel: 'Card POS Swipes',
      icon: <CreditCard className="w-5 h-5 text-purple-600" />,
      amount: isAllBranches ? '₹1,28,400.00' : '₹42,000.00',
      pct: 'PineLabs POS Terminal',
    },
    {
      channel: 'UPI (Dynamic QR)',
      icon: <QrCode className="w-5 h-5 text-[#5A2EA6]" />,
      amount: isAllBranches ? '₹1,85,600.00' : '₹64,200.00',
      pct: 'Paytm / GPay QR',
    },
    {
      channel: 'Prepaid Wallet',
      icon: <Wallet className="w-5 h-5 text-amber-600" />,
      amount: isAllBranches ? '₹32,000.00' : '₹12,400.00',
      pct: 'Client Wallet Draw',
    },
    {
      channel: 'Gift Vouchers',
      icon: <Gift className="w-5 h-5 text-indigo-600" />,
      amount: isAllBranches ? '₹18,500.00' : '₹6,000.00',
      pct: 'Voucher Redemptions',
    },
    {
      channel: 'Web App Booking',
      icon: <Globe className="w-5 h-5 text-blue-600" />,
      amount: isAllBranches ? '₹96,100.00' : '₹28,500.00',
      pct: 'Online Gateway Booking',
    },
  ];

  // ALL 9 EXACT SETTLEMENT LOGS
  const [settlements, setSettlements] = useState([
    {
      settlementNo: 'STL-9901',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      date: '2026-08-07',
      cash: '₹45,200.00',
      card: '₹1,28,400.00',
      upi: '₹1,85,600.00',
      wallet: '₹32,000.00',
      difference: '₹0.00 (Balanced)',
      diffNum: 0,
      status: 'Balanced',
      giftCard: '₹18,500.00',
      onlinePayment: '₹96,100.00',
      totalGross: '₹5,05,800.00',
      closedBy: 'Vikram Kulkarni (Head Cashier)',
    },
    {
      settlementNo: 'STL-9880',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      date: '2026-08-06',
      cash: '₹32,100.00',
      card: '₹98,500.00',
      upi: '₹1,42,000.00',
      wallet: '₹22,400.00',
      difference: '-₹200.00 (Minor Shortage)',
      diffNum: -200,
      status: 'Discrepancy Logged',
      giftCard: '₹12,000.00',
      onlinePayment: '₹64,000.00',
      totalGross: '₹3,71,000.00',
      closedBy: 'Pooja Kashyap (Cashier)',
    },
    {
      settlementNo: 'STL-9820',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      date: '2026-08-05',
      cash: '₹28,400.00',
      card: '₹84,000.00',
      upi: '₹1,15,000.00',
      wallet: '₹18,000.00',
      difference: '₹0.00 (Balanced)',
      diffNum: 0,
      status: 'Balanced',
      giftCard: '₹8,500.00',
      onlinePayment: '₹45,000.00',
      totalGross: '₹2,98,900.00',
      closedBy: 'Kavita Sundaram (Cashier)',
    },
    {
      settlementNo: 'STL-9790',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      date: '2026-08-04',
      cash: '₹24,000.00',
      card: '₹65,000.00',
      upi: '₹80,000.00',
      wallet: '₹14,000.00',
      difference: '₹0.00 (Balanced)',
      diffNum: 0,
      status: 'Balanced',
      giftCard: '₹5,000.00',
      onlinePayment: '₹32,000.00',
      totalGross: '₹2,20,000.00',
      closedBy: 'Suresh Varma (Cashier)',
    },
  ]);

  // PETTY CASH VOUCHERS LIST (Branch-tagged)
  const [pettyCashLogs, setPettyCashLogs] = useState([
    {
      id: 'PETTY-701',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      expenseHead: 'Salon Laundry & Towels',
      amount: '₹650.00',
      paidTo: 'Sparkle Drycleaners',
      authorizedBy: 'Vikram Kulkarni',
      date: '2026-08-07',
    },
    {
      id: 'PETTY-702',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      expenseHead: 'Client Beverage & Refreshments',
      amount: '₹420.00',
      paidTo: 'Nirula Milk & Tea',
      authorizedBy: 'Pooja Kashyap',
      date: '2026-08-06',
    },
    {
      id: 'PETTY-703',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      expenseHead: 'Cleaning Supplies & Disinfectant',
      amount: '₹350.00',
      paidTo: 'Local Chemist Store',
      authorizedBy: 'Kavita Sundaram',
      date: '2026-08-05',
    },
    {
      id: 'PETTY-704',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      expenseHead: 'Emergency Stationery & Printing',
      amount: '₹280.00',
      paidTo: 'Quick Print Hub',
      authorizedBy: 'Suresh Varma',
      date: '2026-08-04',
    },
  ]);

  // GATEWAY SETTLEMENT BATCHES LIST (Branch-tagged)
  const [gatewayBatches] = useState([
    {
      batchId: 'PG-BAT-8801',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      gateway: 'Razorpay UPI & Cards',
      grossAmount: '₹3,45,000.00',
      mdrFee: '₹5,175.00 (1.5%)',
      gstOnMdr: '₹931.50 (18%)',
      netSettled: '₹3,38,893.50',
      utr: 'UTR-HDFC-9948102381',
      status: 'Settled to Bank',
      date: '2026-08-07',
    },
    {
      batchId: 'PG-BAT-8802',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      gateway: 'PineLabs POS Terminal',
      grossAmount: '₹2,10,000.00',
      mdrFee: '₹3,150.00 (1.5%)',
      gstOnMdr: '₹567.00 (18%)',
      netSettled: '₹2,06,283.00',
      utr: 'UTR-ICIC-8819203492',
      status: 'Settled to Bank',
      date: '2026-08-06',
    },
    {
      batchId: 'PG-BAT-8803',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      gateway: 'Paytm Dynamic QR',
      grossAmount: '₹1,25,000.00',
      mdrFee: '₹0.00 (Zero MDR UPI)',
      gstOnMdr: '₹0.00',
      netSettled: '₹1,25,000.00',
      utr: 'UTR-PAYT-7718293810',
      status: 'Settled to Bank',
      date: '2026-08-05',
    },
    {
      batchId: 'PG-BAT-8804',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      gateway: 'PineLabs POS Terminal',
      grossAmount: '₹95,000.00',
      mdrFee: '₹1,425.00 (1.5%)',
      gstOnMdr: '₹256.50 (18%)',
      netSettled: '₹93,318.50',
      utr: 'UTR-SBIN-5519203810',
      status: 'Settled to Bank',
      date: '2026-08-04',
    },
  ]);

  const handleSaveZReport = (e: React.FormEvent) => {
    e.preventDefault();
    const diff = zReportForm.physicalCashCount - zReportForm.systemExpectedCash;

    const newSettlement = {
      settlementNo: `STL-${Math.floor(9900 + Math.random() * 99)}`,
      branch: zReportForm.branch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      date: new Date().toISOString().split('T')[0],
      cash: `₹${zReportForm.physicalCashCount.toLocaleString('en-IN')}.00`,
      card: '₹1,28,400.00',
      upi: '₹1,85,600.00',
      wallet: '₹32,000.00',
      difference:
        diff === 0
          ? '₹0.00 (Balanced)'
          : `${diff > 0 ? '+' : ''}₹${diff}.00 (${diff > 0 ? 'Overage' : 'Shortage'})`,
      diffNum: diff,
      status: diff === 0 ? 'Balanced' : 'Discrepancy Logged',
      giftCard: '₹18,500.00',
      onlinePayment: '₹96,100.00',
      totalGross: `₹${(zReportForm.physicalCashCount + 442100).toLocaleString('en-IN')}.00`,
      closedBy: zReportForm.closedBy,
    };

    setSettlements([newSettlement, ...settlements]);
    setIsZReportModalOpen(false);
    toast(
      `Z-Report Closeout Executed: ${newSettlement.settlementNo} signed off for ${newSettlement.branch}. Register locked.`,
    );
  };

  const handleSavePettyCash = (e: React.FormEvent) => {
    e.preventDefault();
    const newVoucher = {
      id: pettyCashForm.voucherNo,
      branch: pettyCashForm.branch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      expenseHead: pettyCashForm.expenseHead,
      amount: `₹${pettyCashForm.amount.toLocaleString('en-IN')}.00`,
      paidTo: pettyCashForm.paidTo,
      authorizedBy: pettyCashForm.authorizedBy,
      date: new Date().toISOString().split('T')[0],
    };

    setPettyCashLogs([newVoucher, ...pettyCashLogs]);
    setIsPettyCashModalOpen(false);
    toast(
      `Petty Cash Voucher Created: ${newVoucher.id} (${newVoucher.amount}) logged under ${newVoucher.expenseHead}.`,
    );
  };

  // Strictly filter settlements by selected branch
  const filteredSettlements = settlements.filter((s) => {
    const matchesBranch = isAllBranches || s.branchId === selectedBranchId;
    const matchesSearch =
      s.settlementNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.closedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  // Strictly filter gateway batches by selected branch
  const filteredGatewayBatches = gatewayBatches.filter(
    (b) => isAllBranches || b.branchId === selectedBranchId,
  );

  // Strictly filter petty cash logs by selected branch
  const filteredPettyCashLogs = pettyCashLogs.filter(
    (p) => isAllBranches || p.branchId === selectedBranchId,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Daily Register Closeout &amp; Gateway Settlements
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Cash Drawers' : `${selectedBranch.shortName} Register`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Reconcile physical cash drawer floats, EOD Z-Reports, petty cash payouts, and Razorpay/PineLabs POS merchant bank settlements across all branches.'
              : `Reconcile physical cash drawer float, EOD Z-Report, and petty cash expenses specifically for ${selectedBranch.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPettyCashModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
          >
            <Coins className="w-3.5 h-3.5" /> Log Petty Cash
          </button>

          <button
            onClick={() => setIsZReportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
          >
            <Lock className="w-3.5 h-3.5" /> Execute EOD Z-Report
          </button>

          <button
            onClick={() =>
              toast(
                `Export Settlements: Payout records for ${selectedBranch.shortName} exported to CSV.`,
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export Ledger
          </button>
        </div>
      </div>

      {/* 6 COLLECTION CHANNEL METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {collectionMetrics.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-3.5 rounded-2xl border border-line shadow-xs space-y-1.5 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center">
              <div className="p-1.5 bg-paper rounded-xl border border-line">{item.icon}</div>
              <span className="text-[9.5px] font-bold text-soft uppercase">{item.channel}</span>
            </div>
            <div>
              <div className="text-base font-bold text-ink tracking-tight">{item.amount}</div>
              <span className="text-[9px] text-muted block truncate">{item.pct}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SUB-TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          {
            id: 'register',
            label: isAllBranches
              ? 'EOD Z-Report Register Settlements'
              : `${selectedBranch.shortName} Z-Reports`,
            count: filteredSettlements.length,
          },
          {
            id: 'gateways',
            label: isAllBranches
              ? 'Payment Gateway Bank Settlements (MDR Reconciled)'
              : `${selectedBranch.shortName} Gateway Settlements`,
            count: filteredGatewayBatches.length,
          },
          {
            id: 'pettyCash',
            label: isAllBranches
              ? 'Branch Petty Cash Expense Vouchers'
              : `${selectedBranch.shortName} Petty Cash`,
            count: filteredPettyCashLogs.length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {tab.label}{' '}
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: EOD Z-REPORT SETTLEMENTS */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder={`Search settlements by number or cashier name at ${selectedBranch.shortName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                    <th className="p-3">Settlement No &amp; Date</th>
                    <th className="p-3">Salon Branch</th>
                    <th className="p-3">Cash Drawer</th>
                    <th className="p-3">Card POS</th>
                    <th className="p-3">UPI QR</th>
                    <th className="p-3">Wallet</th>
                    <th className="p-3">Variance (Overage/Shortage)</th>
                    <th className="p-3">Total Gross</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {filteredSettlements.map((stl) => (
                    <tr key={stl.settlementNo} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-3 font-bold text-purple-700">
                        <div>{stl.settlementNo}</div>
                        <div className="text-[10px] text-muted">{stl.date}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-ink flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                          {stl.branch}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-purple-900">{stl.cash}</td>
                      <td className="p-3 font-semibold text-ink">{stl.card}</td>
                      <td className="p-3 font-semibold text-ink">{stl.upi}</td>
                      <td className="p-3 font-semibold text-ink">{stl.wallet}</td>
                      <td className="p-3 font-bold">
                        <span className={stl.diffNum === 0 ? 'text-emerald-700' : 'text-rose-600'}>
                          {stl.difference}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-700">{stl.totalGross}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            stl.status === 'Balanced'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {stl.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedSettlement(stl)}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-bold border border-purple-200 cursor-pointer"
                        >
                          Z-Report Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GATEWAY BATCH SETTLEMENTS */}
      {activeTab === 'gateways' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="p-4 border-b border-line">
            <h3 className="font-bold text-sm text-ink">
              {isAllBranches
                ? 'Payment Gateway Batches & MDR Fee Deductions'
                : `${selectedBranch.shortName} Payment Gateway Batches & MDR Deductions`}
            </h3>
            <p className="text-xs text-soft">
              Reconcile Gross Client Charges vs Net Bank Settlements (deducting 1.5% MDR + 18% GST)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-3">Batch ID &amp; Date</th>
                  <th className="p-3">Salon Branch</th>
                  <th className="p-3">Payment Aggregator</th>
                  <th className="p-3">Gross Client Volume</th>
                  <th className="p-3">MDR Fee (1.5%)</th>
                  <th className="p-3">GST on MDR (18%)</th>
                  <th className="p-3">Net Bank Payout</th>
                  <th className="p-3">Bank UTR Reference</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {filteredGatewayBatches.map((b) => (
                  <tr key={b.batchId} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-3 font-bold text-purple-700">
                      <div>{b.batchId}</div>
                      <div className="text-[10px] text-muted">{b.date}</div>
                    </td>
                    <td className="p-3 font-semibold text-ink">{b.branch}</td>
                    <td className="p-3 font-bold text-ink">{b.gateway}</td>
                    <td className="p-3 font-bold text-ink">{b.grossAmount}</td>
                    <td className="p-3 text-rose-600 font-semibold">-{b.mdrFee}</td>
                    <td className="p-3 text-rose-600 font-semibold">-{b.gstOnMdr}</td>
                    <td className="p-3 font-bold text-emerald-700 text-sm">{b.netSettled}</td>
                    <td className="p-3 font-mono text-[10.5px] text-soft">{b.utr}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PETTY CASH LOGS */}
      {activeTab === 'pettyCash' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="p-4 border-b border-line flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-ink">
                {isAllBranches
                  ? 'Branch Petty Cash Outflow Vouchers'
                  : `${selectedBranch.shortName} Petty Cash Vouchers`}
              </h3>
              <p className="text-xs text-soft">
                Floor expenses authorized by storekeepers and branch accountants
              </p>
            </div>
            <button
              onClick={() => setIsPettyCashModalOpen(true)}
              className="px-3 py-1.5 bg-[#5A2EA6] text-white text-xs font-bold rounded-xl border-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" /> New Voucher
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-3">Voucher # &amp; Date</th>
                  <th className="p-3">Branch Location</th>
                  <th className="p-3">Expense Head</th>
                  <th className="p-3">Paid To (Vendor)</th>
                  <th className="p-3">Amount (₹)</th>
                  <th className="p-3">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {filteredPettyCashLogs.map((p) => (
                  <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-3 font-bold text-amber-800">
                      <div>{p.id}</div>
                      <div className="text-[10px] text-muted">{p.date}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-ink flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                        {p.branch}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-ink">{p.expenseHead}</td>
                    <td className="p-3 text-soft font-semibold">{p.paidTo}</td>
                    <td className="p-3 font-bold text-rose-700">{p.amount}</td>
                    <td className="p-3 text-soft">{p.authorizedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EOD Z-REPORT MODAL */}
      {isZReportModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Execute End-of-Day (Z-Report) Closeout
                  </h3>
                  <p className="text-xs text-soft">
                    Reconcile physical cash drawer with system expected collections at{' '}
                    {selectedBranch.shortName}
                  </p>
                </div>
                <button
                  onClick={() => setIsZReportModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveZReport} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Target Branch *
                    </label>
                    {isAllBranches ? (
                      <select
                        value={zReportForm.branch}
                        onChange={(e) => setZReportForm({ ...zReportForm, branch: e.target.value })}
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

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Opening Cash Float (₹)
                    </label>
                    <input
                      type="number"
                      value={zReportForm.openingFloat}
                      onChange={(e) =>
                        setZReportForm({ ...zReportForm, openingFloat: Number(e.target.value) })
                      }
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-bold text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      System Expected Cash (₹)
                    </label>
                    <input
                      type="number"
                      disabled
                      value={zReportForm.systemExpectedCash}
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-bold text-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                      Physical Cash Hand Count (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={zReportForm.physicalCashCount}
                      onChange={(e) =>
                        setZReportForm({
                          ...zReportForm,
                          physicalCashCount: Number(e.target.value),
                        })
                      }
                      className="w-full p-2.5 bg-white border border-purple-400 rounded-xl font-bold text-purple-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Variance Explanation / Remarks
                  </label>
                  <input
                    type="text"
                    value={zReportForm.varianceReason}
                    onChange={(e) =>
                      setZReportForm({ ...zReportForm, varianceReason: e.target.value })
                    }
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsZReportModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Sign-Off Z-Report &amp; Lock Drawer
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* PETTY CASH MODAL */}
      {isPettyCashModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Issue Petty Cash Voucher
                  </h3>
                  <p className="text-xs text-soft">
                    Record minor floor expense from cash drawer at {selectedBranch.shortName}
                  </p>
                </div>
                <button
                  onClick={() => setIsPettyCashModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePettyCash} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Voucher Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value={pettyCashForm.voucherNo}
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-mono font-bold text-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Branch *
                    </label>
                    {isAllBranches ? (
                      <select
                        value={pettyCashForm.branch}
                        onChange={(e) =>
                          setPettyCashForm({ ...pettyCashForm, branch: e.target.value })
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

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Expense Head *
                  </label>
                  <select
                    value={pettyCashForm.expenseHead}
                    onChange={(e) =>
                      setPettyCashForm({ ...pettyCashForm, expenseHead: e.target.value })
                    }
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    <option value="Salon Laundry & Towel Sanitation">
                      Salon Laundry &amp; Towel Sanitation
                    </option>
                    <option value="Client Beverages & Refreshments">
                      Client Beverages &amp; Refreshments
                    </option>
                    <option value="Cleaning & Sanitation Supplies">
                      Cleaning &amp; Sanitation Supplies
                    </option>
                    <option value="Emergency Stationery & Printing">
                      Emergency Stationery &amp; Printing
                    </option>
                    <option value="Local Store Logistics & Transport">
                      Local Store Logistics &amp; Transport
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={pettyCashForm.amount}
                      onChange={(e) =>
                        setPettyCashForm({ ...pettyCashForm, amount: Number(e.target.value) })
                      }
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-bold text-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Paid To (Vendor) *
                    </label>
                    <input
                      type="text"
                      required
                      value={pettyCashForm.paidTo}
                      onChange={(e) =>
                        setPettyCashForm({ ...pettyCashForm, paidTo: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsPettyCashModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Authorize Voucher
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* DETAIL MODAL */}
      {selectedSettlement &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Z-Report Shift Summary
                  </h3>
                  <p className="text-xs text-soft font-mono">
                    {selectedSettlement.settlementNo} • {selectedSettlement.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSettlement(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-pine/5 rounded-2xl border border-line">
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase">Branch</span>
                    <div className="font-bold text-purple-950">{selectedSettlement.branch}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase">Closed By</span>
                    <div className="font-bold text-ink">{selectedSettlement.closedBy}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-soft font-medium">Cash in Drawer:</span>
                    <span className="font-bold text-purple-900">{selectedSettlement.cash}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-soft font-medium">Card POS Swipes:</span>
                    <span className="font-bold text-ink">{selectedSettlement.card}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-soft font-medium">UPI QR Collections:</span>
                    <span className="font-bold text-ink">{selectedSettlement.upi}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-soft font-medium">Wallet &amp; Gift Cards:</span>
                    <span className="font-bold text-ink">
                      {selectedSettlement.wallet} + {selectedSettlement.giftCard}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-line font-bold text-sm">
                    <span>Gross Shift Total:</span>
                    <span className="text-emerald-700 text-base">
                      {selectedSettlement.totalGross}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setSelectedSettlement(null)}
                  className="px-5 py-2 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
