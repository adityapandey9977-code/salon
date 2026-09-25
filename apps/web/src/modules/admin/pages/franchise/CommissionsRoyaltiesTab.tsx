import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Filter,
  Percent,
  Search,
  Sparkles,
  Store,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface CommissionRecord {
  id: string;
  partnerName: string;
  partnerCode: string;
  locationName: string;
  locationCode: string;
  period: string;
  grossRevenue: string;
  grossServicesGMV: string;
  retailSalesGMV: string;
  royaltyRate: string;
  royaltyAmount: string;
  marketingFund: string;
  adjustments: string;
  finalSettlementAmount: string;
  status: 'Calculated' | 'Pending' | 'Approved' | 'Settled' | 'Outstanding';
  dueDate: string;
  financeRef: string;
}

const mockCommissions: CommissionRecord[] = [
  {
    id: 'ROY-2026-081',
    partnerName: 'Apex Wellness & Spa LLP',
    partnerCode: 'FP-IND-01',
    locationName: 'Indore Vijay Nagar Flagship',
    locationCode: 'LOC-FR-01',
    period: 'July 2026',
    grossRevenue: '₹14,20,000',
    grossServicesGMV: '₹12,40,000',
    retailSalesGMV: '₹1,80,000',
    royaltyRate: '10% Services + 5% Retail',
    royaltyAmount: '₹1,33,000',
    marketingFund: '₹24,800 (2%)',
    adjustments: '₹0 (Zero Deduction)',
    finalSettlementAmount: '₹1,57,800',
    status: 'Settled',
    dueDate: '07 Aug 2026',
    financeRef: 'FIN-TX-2026-9041',
  },
  {
    id: 'ROY-2026-082',
    partnerName: 'Radiance Salon Ventures',
    partnerCode: 'FP-BHP-02',
    locationName: 'Bhopal Arera Colony Lounge',
    locationCode: 'LOC-FR-04',
    period: 'July 2026',
    grossRevenue: '₹12,10,000',
    grossServicesGMV: '₹11,00,000',
    retailSalesGMV: '₹1,10,000',
    royaltyRate: '10% Flat Turnover',
    royaltyAmount: '₹1,21,000',
    marketingFund: '₹24,200 (2%)',
    adjustments: '₹0',
    finalSettlementAmount: '₹1,45,200',
    status: 'Outstanding',
    dueDate: '10 Aug 2026',
    financeRef: 'FIN-TX-2026-9088',
  },
  {
    id: 'ROY-2026-083',
    partnerName: 'Mahakal Beauty Partners',
    partnerCode: 'FP-UJJ-03',
    locationName: 'Ujjain Freeganj Main Studio',
    locationCode: 'LOC-FR-06',
    period: 'July 2026',
    grossRevenue: '₹9,40,000',
    grossServicesGMV: '₹8,60,000',
    retailSalesGMV: '₹80,000',
    royaltyRate: '8.5% Gross Services',
    royaltyAmount: '₹73,100',
    marketingFund: '₹14,100 (1.5%)',
    adjustments: '-₹3,000 (Bridal Kit Rebate)',
    finalSettlementAmount: '₹84,200',
    status: 'Settled',
    dueDate: '10 Aug 2026',
    financeRef: 'FIN-TX-2026-9112',
  },
  {
    id: 'ROY-2026-084',
    partnerName: 'Gwalior Royal Spa Co.',
    partnerCode: 'FP-GWL-04',
    locationName: 'Gwalior City Centre Hub',
    locationCode: 'LOC-FR-08',
    period: 'July 2026',
    grossRevenue: '₹8,10,000',
    grossServicesGMV: '₹7,40,000',
    retailSalesGMV: '₹70,000',
    royaltyRate: '10% Flat Turnover',
    royaltyAmount: '₹81,000',
    marketingFund: '₹12,150 (1.5%)',
    adjustments: '₹0',
    finalSettlementAmount: '₹93,150',
    status: 'Approved',
    dueDate: '15 Aug 2026',
    financeRef: 'FIN-TX-2026-9140',
  },
  {
    id: 'ROY-2026-085',
    partnerName: 'Apex Wellness & Spa LLP',
    partnerCode: 'FP-IND-01',
    locationName: 'Indore Palasia Premium Outlet',
    locationCode: 'LOC-FR-02',
    period: 'July 2026',
    grossRevenue: '₹6,80,000',
    grossServicesGMV: '₹6,00,000',
    retailSalesGMV: '₹80,000',
    royaltyRate: '10% Services + 5% Retail',
    royaltyAmount: '₹64,000',
    marketingFund: '₹13,600 (2%)',
    adjustments: '₹0',
    finalSettlementAmount: '₹77,600',
    status: 'Settled',
    dueDate: '07 Aug 2026',
    financeRef: 'FIN-TX-2026-9165',
  },
];

export function CommissionsRoyaltiesTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('July 2026');
  const [selectedCommission, setSelectedCommission] = useState<CommissionRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (selectedCommission) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCommission]);

  // 5 KPI Cards (Section 10 PRD)
  const kpis = [
    {
      title: 'Franchise Turnover',
      value: '₹86,50,000',
      sub: 'Quarterly Network GMV',
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Brand Royalty Accrued',
      value: '₹8,65,000',
      sub: 'Calculated at 10% Rate',
      icon: Award,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Pending Approval',
      value: '₹1,20,000',
      sub: 'Auditing Reconciliation',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Collected & Settled',
      value: '₹6,85,000',
      sub: 'Cleared in Banking Ledger',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Outstanding Due',
      value: '₹60,000',
      sub: '1 Overdue Settlement',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  const getStatusBadge = (st: CommissionRecord['status']) => {
    switch (st) {
      case 'Settled':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Approved':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Outstanding':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Calculated':
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredCommissions = mockCommissions.filter((c) => {
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (selectedPartner !== 'all' && c.partnerCode !== selectedPartner) return false;
    if (searchTerm) {
      const match =
        `${c.id} ${c.partnerName} ${c.partnerCode} ${c.locationName} ${c.period}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Filter Bar & Action Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voucher ID, partner, branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Partner */}
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Franchise Partners</option>
            <option value="FP-IND-01">Apex Wellness &amp; Spa LLP</option>
            <option value="FP-BHP-02">Radiance Salon Ventures</option>
            <option value="FP-UJJ-03">Mahakal Beauty Partners</option>
            <option value="FP-GWL-04">Gwalior Royal Spa Co.</option>
          </select>

          {/* Period */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="July 2026">July 2026 Billing Period</option>
            <option value="June 2026">June 2026 Billing Period</option>
            <option value="May 2026">May 2026 Billing Period</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Settlement States</option>
            <option value="Settled">Settled / Cleared</option>
            <option value="Approved">Approved for Payout</option>
            <option value="Pending">Pending Audit</option>
            <option value="Outstanding">Overdue Settlement</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting Royalty & Commission Settlement Ledger (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Royalties</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              window.location.href = '/finance?tab=transactions';
            }}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <span>Finance Panel</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#5A2EA6]" />
          </Button>
        </div>
      </div>

      {/* 2. 5 KPI Cards Grid (Section 10 PRD) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={cn('w-7 h-7 rounded-lg grid place-items-center', kpi.bg, kpi.color)}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider">
                    Ledger View
                  </span>
                </div>
                <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                  {kpi.title}
                </span>
                <strong className="text-lg font-serif font-bold text-ink mt-0.5 block truncate">
                  {kpi.value}
                </strong>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-muted truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Section 10 PRD: COMMISSIONS & ROYALTIES MASTER LEDGER */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Franchise Royalty &amp; Fee Ledger
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                Monitoring Ledger
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Territory partner billing periods, gross turnover calculations, applicable royalty
              models, and settlement vouchers
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            Showing {filteredCommissions.length} settlement vouchers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Voucher ID &amp; Period</th>
                <th className="p-3.5">Franchise Partner</th>
                <th className="p-3.5">Branch Location</th>
                <th className="p-3.5 text-right">Gross GMV</th>
                <th className="p-3.5">Contract Royalty Rate</th>
                <th className="p-3.5 text-right">Brand Royalty (₹)</th>
                <th className="p-3.5 text-right">Net Payable Fee</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredCommissions.map((c) => (
                <tr key={c.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Voucher & Period */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block font-mono text-xs">{c.id}</strong>
                    <span className="text-[10px] text-muted">{c.period}</span>
                  </td>

                  {/* Partner */}
                  <td className="p-3.5 whitespace-nowrap">
                    <strong className="font-bold text-slate-900 block">{c.partnerName}</strong>
                    <span className="text-[10px] text-muted font-mono">{c.partnerCode}</span>
                  </td>

                  {/* Location */}
                  <td className="p-3.5 whitespace-nowrap text-slate-800">
                    <span>{c.locationName}</span>
                    <span className="text-[10px] text-muted block font-mono">{c.locationCode}</span>
                  </td>

                  {/* Gross GMV */}
                  <td className="p-3.5 text-right font-serif font-extrabold text-slate-900 text-sm whitespace-nowrap">
                    {c.grossRevenue}
                  </td>

                  {/* Royalty Rate */}
                  <td className="p-3.5 text-slate-800 text-[11px]">{c.royaltyRate}</td>

                  {/* Royalty Amount */}
                  <td className="p-3.5 text-right font-serif font-bold text-[#5A2EA6] whitespace-nowrap">
                    {c.royaltyAmount}
                  </td>

                  {/* Net Payable Fee */}
                  <td className="p-3.5 text-right font-serif font-extrabold text-indigo-700 whitespace-nowrap">
                    {c.finalSettlementAmount}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(c.status),
                      )}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCommission(c)}
                      className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 inline-flex"
                    >
                      <Eye className="w-3 h-3 text-[#5A2EA6]" />
                      <span>Calculation Dossier</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Section 11 PRD: COMMISSION / ROYALTY DETAILS DOSSIER MODAL */}
      {selectedCommission &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedCommission(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Royalty Calculation Breakdown
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">
                      {selectedCommission.id}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(selectedCommission.status),
                      )}
                    >
                      {selectedCommission.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedCommission.period} Settlement
                  </h3>
                  <p className="text-xs text-muted">
                    Partner: {selectedCommission.partnerName} · Outlet:{' '}
                    {selectedCommission.locationName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCommission(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Financial Computation Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
                  <strong className="text-ink font-bold block mb-1">
                    Contractual Royalty Math Computation
                  </strong>
                  <div className="flex justify-between">
                    <span className="text-soft">Gross Services Revenue:</span>
                    <span className="font-bold">{selectedCommission.grossServicesGMV}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft">Retail Product Sales Revenue:</span>
                    <span className="font-bold">{selectedCommission.retailSalesGMV}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-soft">Total Customer Turnover (GMV):</span>
                    <span className="font-extrabold text-ink">
                      {selectedCommission.grossRevenue}
                    </span>
                  </div>
                  <div className="flex justify-between text-purple-700">
                    <span className="font-semibold">
                      Base Brand Royalty ({selectedCommission.royaltyRate}):
                    </span>
                    <span className="font-extrabold">{selectedCommission.royaltyAmount}</span>
                  </div>
                  <div className="flex justify-between text-indigo-700">
                    <span className="font-semibold">National Marketing Fund Contribution:</span>
                    <span className="font-bold">{selectedCommission.marketingFund}</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span className="font-semibold">Authorised Commercial Adjustments:</span>
                    <span className="font-bold">{selectedCommission.adjustments}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-300 flex justify-between text-sm">
                    <strong className="text-ink">Net Brand Accrual Amount:</strong>
                    <strong className="text-[#5A2EA6] font-extrabold">
                      {selectedCommission.finalSettlementAmount}
                    </strong>
                  </div>
                </div>

                {/* Audit & Finance References */}
                <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Finance Posting Voucher
                    </span>
                    <strong className="text-slate-900 font-mono font-bold text-sm mt-0.5">
                      {selectedCommission.financeRef}
                    </strong>
                    <span className="text-[10px] text-muted block mt-1">
                      Cross-referenced in Finance Panel Ledger
                    </span>
                  </div>

                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Settlement Due Date
                    </span>
                    <strong className="text-ink font-bold text-sm mt-0.5">
                      {selectedCommission.dueDate}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                      Status: {selectedCommission.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/finance?tab=transactions';
                  }}
                  className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <span>View Settlement in Finance Panel</span>
                  <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
                </Button>

                <Button
                  onClick={() => setSelectedCommission(null)}
                  className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                >
                  Close Dossier
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
