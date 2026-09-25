import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Filter,
  PieChart as PieChartIcon,
  RotateCcw,
  Search,
  ShieldCheck,
  TrendingDown,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { DialogModal } from '../../../../shared/components/DialogModal';

export interface RefundRecord {
  id: string;
  txnId: string;
  client: string;
  clientPhone: string;
  branch: string;
  branchId: string;
  originalAmount: string;
  refundAmount: string;
  rawRefund: number;
  reason: string;
  refundType: 'Full Refund' | 'Partial Refund' | 'Credit Note' | 'Wallet Credit';
  requestedBy: string;
  approvedBy: string;
  date: string;
  status: 'Requested' | 'Pending Approval' | 'Approved' | 'Processed' | 'Rejected' | 'Cancelled';
  notes: string;
}

export const initialRefunds: RefundRecord[] = [
  {
    id: 'REF-2026-081',
    txnId: 'TXN-9085',
    client: 'Kavita Saxena',
    clientPhone: '+91 94250 88991',
    branch: 'Gwalior City Centre',
    branchId: 'BR-05',
    originalAmount: '₹3,717',
    refundAmount: '₹3,717',
    rawRefund: 3717,
    reason: 'Stylist emergency unavailability & rescheduling declined',
    refundType: 'Full Refund',
    requestedBy: 'Gwalior Receptionist',
    approvedBy: 'Ananya Shah (Brand Owner)',
    date: '18 Aug 2026, 14:10',
    status: 'Approved',
    notes: 'Approved under client satisfaction priority charter.',
  },
  {
    id: 'REF-2026-080',
    txnId: 'TXN-9071',
    client: 'Siddharth Nair',
    clientPhone: '+91 98263 11882',
    branch: 'Indore Central (Flagship)',
    branchId: 'BR-01',
    originalAmount: '₹8,500',
    refundAmount: '₹2,500',
    rawRefund: 2500,
    reason: 'Keratin treatment duration exceeded 3 hours; partial compensation',
    refundType: 'Partial Refund',
    requestedBy: 'Manager Indore',
    approvedBy: 'Pending Director Review',
    date: '18 Aug 2026, 11:30',
    status: 'Pending Approval',
    notes: 'Client satisfied with hair result but requested discount for wait time.',
  },
  {
    id: 'REF-2026-079',
    txnId: 'TXN-9062',
    client: 'Sneha Patel',
    clientPhone: '+91 99810 33445',
    branch: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    originalAmount: '₹2,500',
    refundAmount: '₹2,500',
    rawRefund: 2500,
    reason: 'Product return (Unopened sealed Olaplex Nº.3)',
    refundType: 'Credit Note',
    requestedBy: 'Vijay Nagar Floor',
    approvedBy: 'Automated POS Rule',
    date: '17 Aug 2026, 17:15',
    status: 'Processed',
    notes: 'Store credit code #CRN-INT-0045 issued.',
  },
  {
    id: 'REF-2026-078',
    txnId: 'TXN-9055',
    client: 'Priyanka Chopra',
    clientPhone: '+91 98931 55667',
    branch: 'Bhopal Arera Colony',
    branchId: 'BR-03',
    originalAmount: '₹4,200',
    refundAmount: '₹4,200',
    rawRefund: 4200,
    reason: 'Client allergic reaction caution during test patch before service',
    refundType: 'Wallet Credit',
    requestedBy: 'Therapist Bhopal',
    approvedBy: 'Bhopal Branch Manager',
    date: '16 Aug 2026, 16:45',
    status: 'Processed',
    notes: 'Safe protocol followed. 100% credited to guest wallet.',
  },
  {
    id: 'REF-2026-077',
    txnId: 'TXN-9041',
    client: 'Meera Rajput',
    clientPhone: '+91 98272 99001',
    branch: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    originalAmount: '₹12,000',
    refundAmount: '₹6,000',
    rawRefund: 6000,
    reason: 'Requested refund for unused package sessions after 11 months',
    refundType: 'Full Refund',
    requestedBy: 'Ujjain Front Desk',
    approvedBy: 'Rejected by HQ Policy',
    date: '15 Aug 2026, 12:10',
    status: 'Rejected',
    notes: 'Package terms state 6-month validity clause; extended by 30 days instead.',
  },
];

export function RefundsCreditsTab() {
  const { toast } = useToast();
  const [refunds, setRefunds] = useState<RefundRecord[]>(initialRefunds);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalRefund, setActiveModalRefund] = useState<RefundRecord | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // Refund Analytics KPIs (Section 10)
  const analyticsKpis = [
    {
      title: 'Total Refunds Count',
      value: '18 Requests',
      sub: 'Across 5 branches',
      change: '-4.2%',
    },
    { title: 'Total Refund Amount', value: '₹1,20,000', sub: '₹48.5L gross rev', change: '-8.1%' },
    { title: 'Global Refund Rate', value: '2.47%', sub: 'Target < 3.00%', isGood: true },
    {
      title: 'Store Credit Notes',
      value: '₹48,500',
      sub: '40.4% retained in-ecosystem',
      isGood: true,
    },
    {
      title: 'Wallet Credits',
      value: '₹32,000',
      sub: '26.6% client loyalty retention',
      isGood: true,
    },
  ];

  // Branch Refund Rate Comparison (Section 10)
  const branchRefundRates = [
    { branch: 'Indore Central', count: 5, amount: '₹32,000', rate: '2.09%', highRisk: false },
    { branch: 'Vijay Nagar Boutique', count: 4, amount: '₹28,000', rate: '2.37%', highRisk: false },
    { branch: 'Bhopal Arera Colony', count: 4, amount: '₹26,000', rate: '2.64%', highRisk: false },
    { branch: 'Ujjain Mahakal Road', count: 3, amount: '₹20,000', rate: '2.90%', highRisk: false },
    { branch: 'Gwalior City Centre', count: 2, amount: '₹14,000', rate: '2.99%', highRisk: true }, // Near 3% threshold
  ];

  // Reasons Breakdown
  const refundReasons = [
    { reason: 'Service Quality / Preference', count: 7, pct: '38.8%' },
    { reason: 'Scheduling / Stylist Emergency', count: 4, pct: '22.2%' },
    { reason: 'Product Return (Unopened)', count: 4, pct: '22.2%' },
    { reason: 'Patch-Test Allergy Caution', count: 2, pct: '11.1%' },
    { reason: 'Duplicate Booking Charge', count: 1, pct: '5.5%' },
  ];

  // Filtering
  const filtered = refunds.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.txnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || r.branchId === selectedBranch;
    const matchesType =
      selectedType === 'all' || r.refundType.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus =
      selectedStatus === 'all' || r.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesBranch && matchesType && matchesStatus;
  });

  const handleOpenActionModal = (refund: RefundRecord) => {
    setActiveModalRefund(refund);
    setIsApprovalModalOpen(true);
  };

  const handleApproveRefund = () => {
    if (!activeModalRefund) return;
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === activeModalRefund.id
          ? { ...r, status: 'Approved', approvedBy: 'Ananya Shah (Brand Owner)' }
          : r,
      ),
    );
    toast(
      `Refund ${activeModalRefund.id} of ${activeModalRefund.refundAmount} approved successfully.`,
    );
    setIsApprovalModalOpen(false);
  };

  const handleRejectRefund = () => {
    if (!activeModalRefund) return;
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === activeModalRefund.id
          ? { ...r, status: 'Rejected', approvedBy: 'Rejected by HQ' }
          : r,
      ),
    );
    toast(`Refund request ${activeModalRefund.id} rejected.`);
    setIsApprovalModalOpen(false);
  };

  const getStatusBadge = (status: RefundRecord['status']) => {
    switch (status) {
      case 'Approved':
      case 'Processed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Approval':
      case 'Requested':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search Refund ID, Client, Reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 pl-8 text-xs text-ink outline-none focus:border-[#5A2EA6]"
            />
            <Search className="w-3.5 h-3.5 text-soft absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Branches (5)</option>
            <option value="BR-01">Indore Central</option>
            <option value="BR-02">Vijay Nagar Boutique</option>
            <option value="BR-03">Bhopal Arera Colony</option>
            <option value="BR-04">Ujjain Mahakal Road</option>
            <option value="BR-05">Gwalior City Centre</option>
          </select>

          {/* Refund Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Refund Types</option>
            <option value="full refund">Full Refund</option>
            <option value="partial refund">Partial Refund</option>
            <option value="credit note">Credit Note</option>
            <option value="wallet credit">Wallet Credit</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="processed">Processed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast('Exporting Refund Audit Register (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Refunds</span>
          </Button>
        </div>
      </div>

      {/* 2. Refund Analytics KPIs (Section 10) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {analyticsKpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                {kpi.title}
              </span>
              <strong className="text-lg font-serif font-bold text-ink mt-1 block">
                {kpi.value}
              </strong>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-muted">{kpi.sub}</span>
              {kpi.change && <span className="font-bold text-emerald-600">{kpi.change}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Refund Intelligence & High Risk Rate Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Branch Rate Breakdown Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-ink text-base">
                  Branch Refund Rate Matrix
                </h3>
                <p className="text-[11px] text-muted">
                  Benchmark threshold is &lt; 3.00% of gross revenue
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Brand Avg: 2.47%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase whitespace-nowrap">
                  <th className="p-2.5 pl-3">Branch Location</th>
                  <th className="p-2.5 text-center">Refund Count</th>
                  <th className="p-2.5 text-right">Refund Amount</th>
                  <th className="p-2.5 text-right">Refund Rate</th>
                  <th className="p-2.5 pr-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branchRefundRates.map((br, bIdx) => (
                  <tr key={bIdx} className="hover:bg-slate-50">
                    <td className="p-2.5 pl-3 font-bold text-ink whitespace-nowrap">{br.branch}</td>
                    <td className="p-2.5 text-center text-slate-600 whitespace-nowrap">
                      {br.count}
                    </td>
                    <td className="p-2.5 text-right font-semibold text-slate-800 whitespace-nowrap">
                      {br.amount}
                    </td>
                    <td className="p-2.5 text-right font-bold whitespace-nowrap">
                      <span
                        className={
                          br.highRisk ? 'text-amber-700 font-extrabold' : 'text-emerald-700'
                        }
                      >
                        {br.rate}
                      </span>
                    </td>
                    <td className="p-2.5 pr-3 text-right whitespace-nowrap">
                      {br.highRisk ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                          <AlertTriangle className="w-2.5 h-2.5" /> High Risk Notice
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 whitespace-nowrap">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reasons Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                <PieChartIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-ink text-base">
                  Refund Reasons Categorization
                </h3>
                <p className="text-[11px] text-muted">Systemic driver analysis</p>
              </div>
            </div>

            <div className="space-y-2">
              {refundReasons.map((rr, rIdx) => (
                <div
                  key={rIdx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs"
                >
                  <span className="font-semibold text-slate-800">{rr.reason}</span>
                  <div className="text-right whitespace-nowrap">
                    <strong className="text-ink font-bold">{rr.count} requests</strong>
                    <span className="text-[10px] text-soft ml-1.5">({rr.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-soft flex items-center justify-between">
            <span>
              Customer Retention Guard: <strong>67% in Credits</strong>
            </span>
            <span className="text-[#5A2EA6] font-bold">Policy Active</span>
          </div>
        </div>
      </div>

      {/* 4. Refunds & Credits Monitoring Table (Section 9) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Refunds & Credit Notes Ledger
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                {filtered.length} Requests
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Maker-checker oversight for full/partial reversals, store vouchers, and wallet credits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-soft">RBAC Protected</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Refund ID & Date</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Original / Refund</th>
                <th className="p-3.5">Refund Type</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Requested / Approved By</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Oversight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* ID & Date */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{r.id}</strong>
                    <span className="text-[10px] text-[#5A2EA6]">
                      {r.txnId} · {r.date}
                    </span>
                  </td>

                  {/* Branch */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block text-xs">{r.branch}</span>
                    <span className="text-[10px] text-soft">{r.branchId}</span>
                  </td>

                  {/* Client */}
                  <td className="p-3.5 whitespace-nowrap">
                    <strong className="font-bold text-ink block">{r.client}</strong>
                    <span className="text-[10px] text-muted">{r.clientPhone}</span>
                  </td>

                  {/* Amount */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="text-slate-400 line-through block text-[10px]">
                      {r.originalAmount}
                    </span>
                    <strong className="font-bold text-red-700 text-xs block">
                      {r.refundAmount}
                    </strong>
                  </td>

                  {/* Type */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-100 whitespace-nowrap shadow-3xs">
                      {r.refundType}
                    </span>
                  </td>

                  {/* Reason */}
                  <td className="p-3.5 max-w-[220px]">
                    <span className="font-medium text-slate-800 block truncate" title={r.reason}>
                      {r.reason}
                    </span>
                  </td>

                  {/* Users */}
                  <td className="p-3.5 text-[11px] whitespace-nowrap">
                    <span className="text-soft block">
                      Req: <b>{r.requestedBy}</b>
                    </span>
                    <span className="text-indigo-700 font-semibold block">
                      Appr: <b>{r.approvedBy}</b>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        getStatusBadge(r.status),
                      )}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenActionModal(r)}
                      className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                    >
                      {r.status === 'Pending Approval' ? 'Review & Approve' : 'Inspect'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Refund Review & Approval Modal */}
      {activeModalRefund && (
        <DialogModal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          title={`Refund Oversight · ${activeModalRefund.id}`}
          description="Review policy justification and maker-checker validation"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#5A2EA6]/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Refund Target Amount
                </span>
                <strong className="text-base font-serif font-bold text-red-700">
                  {activeModalRefund.refundAmount}
                </strong>
              </div>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-[10px] font-bold border',
                  getStatusBadge(activeModalRefund.status),
                )}
              >
                {activeModalRefund.status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-soft">Original TXN:</span>
                <span className="font-mono font-bold text-ink">{activeModalRefund.txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Client:</span>
                <span className="font-bold text-ink">
                  {activeModalRefund.client} ({activeModalRefund.clientPhone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Branch:</span>
                <span className="font-bold text-slate-800">{activeModalRefund.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Refund Mode:</span>
                <span className="font-bold text-[#5A2EA6]">{activeModalRefund.refundType}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-soft block text-[10px] uppercase font-bold">
                  Stated Reason:
                </span>
                <p className="text-ink font-medium mt-0.5">{activeModalRefund.reason}</p>
              </div>
              <div>
                <span className="text-soft block text-[10px] uppercase font-bold">
                  Internal Audit Notes:
                </span>
                <p className="text-slate-600 italic mt-0.5">{activeModalRefund.notes}</p>
              </div>
            </div>

            {/* Actions for Brand Owner */}
            <div className="flex items-center justify-between pt-3 border-t border-line gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast(`Opening transaction ${activeModalRefund.txnId} in Finance Panel...`);
                  window.location.href = `/finance?tab=refunds&id=${activeModalRefund.id}`;
                }}
                className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/40 text-[#5A2EA6] hover:bg-purple-50 flex items-center gap-1.5"
              >
                <span>Open in Finance</span>
                <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
              </Button>

              <div className="flex items-center gap-2">
                {activeModalRefund.status === 'Pending Approval' ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRejectRefund}
                      className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      Reject Request
                    </Button>
                    <Button
                      onClick={handleApproveRefund}
                      className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                    >
                      Approve Refund
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsApprovalModalOpen(false)}
                    className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogModal>
      )}
    </div>
  );
}
