import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Layers,
  RotateCcw,
  Search,
} from 'lucide-react';
import React, { useState } from 'react';
import { DialogModal } from '../../../../shared/components/DialogModal';

export interface SettlementRecord {
  id: string;
  branch: string;
  branchId: string;
  city: string;
  period: string;
  grossRev: string;
  rawGross: number;
  collections: string;
  rawCollections: number;
  refunds: string;
  expenses: string;
  netAmount: string;
  settlementAmount: string;
  rawSettlement: number;
  status: 'Pending' | 'Processing' | 'Settled' | 'On Hold' | 'Disputed';
  lastSettlementDate: string;
  reference: string;
  revenueStreams: {
    services: string;
    retail: string;
    packages: string;
    memberships: string;
    other: string;
  };
  adjustments: {
    discounts: string;
    refunds: string;
    credits: string;
    other: string;
  };
  collectionsMix: {
    upi: string;
    cards: string;
    cash: string;
    paymentLink: string;
    other: string;
  };
  auditTrail: Array<{
    step: string;
    time: string;
    actor: string;
  }>;
}

export const initialSettlements: SettlementRecord[] = [
  {
    id: 'SET-2026-081',
    branch: 'Indore Central (Flagship)',
    branchId: 'BR-01',
    city: 'Indore',
    period: '01 Aug - 15 Aug 2026 (Fortnight 1)',
    grossRev: '₹15,30,000',
    rawGross: 1530000,
    collections: '₹14,90,000',
    rawCollections: 1490000,
    refunds: '₹32,000',
    expenses: '₹1,05,000 (Local Petty/Laundry)',
    netAmount: '₹13,93,000',
    settlementAmount: '₹13,53,000',
    rawSettlement: 1353000,
    status: 'Settled',
    lastSettlementDate: '16 Aug 2026, 11:30 AM',
    reference: 'NEFT-HQ-IND-881204',
    revenueStreams: {
      services: '₹9,80,000',
      retail: '₹2,50,000',
      packages: '₹1,80,000',
      memberships: '₹1,20,000',
      other: '₹0',
    },
    adjustments: {
      discounts: '₹1,05,000',
      refunds: '₹32,000',
      credits: '₹0',
      other: '₹0',
    },
    collectionsMix: {
      upi: '₹7,15,200 (48%)',
      cards: '₹4,02,300 (27%)',
      cash: '₹1,93,700 (13%)',
      paymentLink: '₹89,400 (6%)',
      other: '₹89,400 (6%)',
    },
    auditTrail: [
      { step: 'Fortnight Register Frozen', time: '15 Aug 23:59', actor: 'Automated HQ Cron' },
      {
        step: 'Branch Reconciliation Verified',
        time: '16 Aug 10:15',
        actor: 'Store Manager Indore',
      },
      {
        step: 'Brand Owner Settlement Authorized',
        time: '16 Aug 11:00',
        actor: 'Ananya Shah (HQ)',
      },
      { step: 'Bank Payout Dispatched', time: '16 Aug 11:30', actor: 'Finance Panel Gateway' },
    ],
  },
  {
    id: 'SET-2026-082',
    branch: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    city: 'Indore',
    period: '01 Aug - 15 Aug 2026 (Fortnight 1)',
    grossRev: '₹11,80,000',
    rawGross: 1180000,
    collections: '₹11,40,000',
    rawCollections: 1140000,
    refunds: '₹28,000',
    expenses: '₹80,000 (Consumables Outflow)',
    netAmount: '₹10,72,000',
    settlementAmount: '₹10,32,000',
    rawSettlement: 1032000,
    status: 'Settled',
    lastSettlementDate: '16 Aug 2026, 12:00 PM',
    reference: 'NEFT-HQ-VJY-881205',
    revenueStreams: {
      services: '₹7,60,000',
      retail: '₹1,85,000',
      packages: '₹1,40,000',
      memberships: '₹95,000',
      other: '₹0',
    },
    adjustments: {
      discounts: '₹80,000',
      refunds: '₹28,000',
      credits: '₹0',
      other: '₹0',
    },
    collectionsMix: {
      upi: '₹5,47,200 (48%)',
      cards: '₹3,07,800 (27%)',
      cash: '₹1,48,200 (13%)',
      paymentLink: '₹68,400 (6%)',
      other: '₹68,400 (6%)',
    },
    auditTrail: [
      { step: 'Register Closed', time: '15 Aug 23:59', actor: 'Automated HQ Cron' },
      { step: 'Manager Verified', time: '16 Aug 11:30', actor: 'Branch Manager Vijay Nagar' },
      { step: 'Settlement Dispatched', time: '16 Aug 12:00', actor: 'Finance Panel Gateway' },
    ],
  },
  {
    id: 'SET-2026-083',
    branch: 'Bhopal Arera Colony',
    branchId: 'BR-03',
    city: 'Bhopal',
    period: '01 Aug - 15 Aug 2026 (Fortnight 1)',
    grossRev: '₹9,84,500',
    rawGross: 984500,
    collections: '₹9,50,000',
    rawCollections: 950000,
    refunds: '₹26,000',
    expenses: '₹72,000',
    netAmount: '₹8,86,500',
    settlementAmount: '₹8,52,000',
    rawSettlement: 852000,
    status: 'Processing',
    lastSettlementDate: 'Pending Dispatch',
    reference: 'SET-REQ-BHP-083',
    revenueStreams: {
      services: '₹6,40,000',
      retail: '₹1,42,500',
      packages: '₹1,20,000',
      memberships: '₹82,000',
      other: '₹0',
    },
    adjustments: {
      discounts: '₹72,000',
      refunds: '₹26,000',
      credits: '₹0',
      other: '₹0',
    },
    collectionsMix: {
      upi: '₹4,56,000',
      cards: '₹2,56,500',
      cash: '₹1,23,500',
      paymentLink: '₹57,000',
      other: '₹57,000',
    },
    auditTrail: [
      { step: 'Period Closed', time: '15 Aug 23:59', actor: 'Automated HQ Cron' },
      { step: 'Reconciliation Underway', time: '17 Aug 14:20', actor: 'Bhopal Branch Cashier' },
    ],
  },
  {
    id: 'SET-2026-084',
    branch: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    city: 'Ujjain',
    period: '01 Aug - 15 Aug 2026 (Fortnight 1)',
    grossRev: '₹6,88,000',
    rawGross: 688000,
    collections: '₹6,65,000',
    rawCollections: 665000,
    refunds: '₹20,000',
    expenses: '₹48,000',
    netAmount: '₹6,20,000',
    settlementAmount: '₹5,97,000',
    rawSettlement: 597000,
    status: 'Pending',
    lastSettlementDate: 'Awaiting Sign-off',
    reference: 'SET-REQ-UJJ-084',
    revenueStreams: {
      services: '₹4,60,000',
      retail: '₹95,000',
      packages: '₹82,000',
      memberships: '₹51,000',
      other: '₹0',
    },
    adjustments: {
      discounts: '₹48,000',
      refunds: '₹20,000',
      credits: '₹0',
      other: '₹0',
    },
    collectionsMix: {
      upi: '₹3,19,200',
      cards: '₹1,79,550',
      cash: '₹86,450',
      paymentLink: '₹39,900',
      other: '₹39,900',
    },
    auditTrail: [
      { step: 'Period Frozen', time: '15 Aug 23:59', actor: 'Automated HQ Cron' },
      { step: 'Awaiting Manager Sign-off', time: '18 Aug 09:00', actor: 'System Notice' },
    ],
  },
  {
    id: 'SET-2026-085',
    branch: 'Gwalior City Centre',
    branchId: 'BR-05',
    city: 'Gwalior',
    period: '01 Aug - 15 Aug 2026 (Fortnight 1)',
    grossRev: '₹4,67,500',
    rawGross: 467500,
    collections: '₹4,35,000',
    rawCollections: 435000,
    refunds: '₹14,000',
    expenses: '₹35,000',
    netAmount: '₹4,18,500',
    settlementAmount: '₹3,86,000',
    rawSettlement: 386000,
    status: 'On Hold',
    lastSettlementDate: 'Flagged for Audit',
    reference: 'SET-HOLD-GWL-085',
    revenueStreams: {
      services: '₹3,12,500',
      retail: '₹55,000',
      packages: '₹60,000',
      memberships: '₹40,000',
      other: '₹0',
    },
    adjustments: {
      discounts: '₹35,000',
      refunds: '₹14,000',
      credits: '₹0',
      other: '₹0',
    },
    collectionsMix: {
      upi: '₹2,08,800',
      cards: '₹1,17,450',
      cash: '₹56,550',
      paymentLink: '₹26,100',
      other: '₹26,100',
    },
    auditTrail: [
      { step: 'Period Frozen', time: '15 Aug 23:59', actor: 'Automated HQ Cron' },
      {
        step: 'Held for Cashier Discrepancy (₹32,500)',
        time: '17 Aug 16:30',
        actor: 'HQ Audit Team',
      },
    ],
  },
];

export function BranchSettlementTab() {
  const { toast } = useToast();
  const [settlements, setSettlements] = useState<SettlementRecord[]>(initialSettlements);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSettlement, setActiveSettlement] = useState<SettlementRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filtering
  const filtered = settlements.filter((s) => {
    const matchesSearch =
      s.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || s.branchId === selectedBranch;
    const matchesStatus =
      selectedStatus === 'all' || s.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleOpenDetail = (record: SettlementRecord) => {
    setActiveSettlement(record);
    setIsDetailOpen(true);
  };

  const getStatusBadge = (status: SettlementRecord['status']) => {
    switch (status) {
      case 'Settled':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'On Hold':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Disputed':
        return 'bg-red-100 text-red-800 border-red-300';
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
              placeholder="Search Branch, Settlement ID, Ref..."
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
            <option value="all">All Branches</option>
            <option value="BR-01">Indore Central</option>
            <option value="BR-02">Vijay Nagar Boutique</option>
            <option value="BR-03">Bhopal Arera Colony</option>
            <option value="BR-04">Ujjain Mahakal Road</option>
            <option value="BR-05">Gwalior City Centre</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Settlement Statuses</option>
            <option value="settled">Settled</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="on hold">On Hold</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast('Exporting Branch Settlement Schedule (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Settlements</span>
          </Button>
        </div>
      </div>

      {/* 2. Multi-Branch Settlement Monitoring Table (Section 13) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Multi-Location Branch Settlement Ledger
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {filtered.length} Branches Managed
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Fortnightly inter-branch revenue pooling, deductions, realized collections, and payout
              settlement dispatch
            </p>
          </div>

          <div className="text-xs text-soft font-semibold">
            <span>Cycle: 01 - 15 Aug 2026</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Branch & Settlement ID</th>
                <th className="p-3.5">Period</th>
                <th className="p-3.5 text-right">Gross Rev</th>
                <th className="p-3.5 text-right">Collections</th>
                <th className="p-3.5 text-right">Refunds</th>
                <th className="p-3.5 text-right">Net Amount</th>
                <th className="p-3.5 text-right">Settlement Due</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Last Settlement</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Branch & ID */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{s.branch}</strong>
                    <span className="text-[10px] text-[#5A2EA6]">
                      {s.id} · {s.city}
                    </span>
                  </td>

                  {/* Period */}
                  <td className="p-3.5 text-slate-600 font-semibold whitespace-nowrap">
                    {s.period}
                  </td>

                  {/* Financials */}
                  <td className="p-3.5 text-right font-bold text-ink whitespace-nowrap">
                    {s.grossRev}
                  </td>
                  <td className="p-3.5 text-right text-emerald-700 font-bold whitespace-nowrap">
                    {s.collections}
                  </td>
                  <td className="p-3.5 text-right text-red-700 font-semibold whitespace-nowrap">
                    -{s.refunds}
                  </td>
                  <td className="p-3.5 text-right text-slate-900 font-bold whitespace-nowrap">
                    {s.netAmount}
                  </td>

                  {/* Settlement Amount */}
                  <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                    {s.settlementAmount}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        getStatusBadge(s.status),
                      )}
                    >
                      {s.status}
                    </span>
                  </td>

                  {/* Last Settlement Date */}
                  <td className="p-3.5 text-[11px] text-soft whitespace-nowrap">
                    {s.lastSettlementDate}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenDetail(s)}
                      className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-[#5A2EA6]" />
                      <span>Inspect</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Branch Settlement Details Modal (Section 14) */}
      {activeSettlement && (
        <DialogModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Settlement Dossier · ${activeSettlement.branch}`}
          description="Consolidated calculation formula, revenue streams & audit timeline"
        >
          <div className="space-y-4 text-xs">
            {/* Header Tag */}
            <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#5A2EA6]/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  {activeSettlement.period}
                </span>
                <strong className="text-sm font-serif font-bold text-ink">
                  {activeSettlement.branch} ({activeSettlement.branchId})
                </strong>
              </div>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-[10px] font-bold border',
                  getStatusBadge(activeSettlement.status),
                )}
              >
                {activeSettlement.status}
              </span>
            </div>

            {/* Revenue Streams Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-ink font-serif block pb-1 border-b border-slate-200">
                  Gross Revenue Inflow
                </span>
                <div className="flex justify-between text-slate-700">
                  <span>Services:</span>
                  <span className="font-semibold">{activeSettlement.revenueStreams.services}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Retail Products:</span>
                  <span className="font-semibold">{activeSettlement.revenueStreams.retail}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Packages:</span>
                  <span className="font-semibold">{activeSettlement.revenueStreams.packages}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Memberships:</span>
                  <span className="font-semibold">
                    {activeSettlement.revenueStreams.memberships}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-ink font-serif block pb-1 border-b border-slate-200">
                  Adjustments &amp; Deductions
                </span>
                <div className="flex justify-between text-rose-600">
                  <span>Discounts Given:</span>
                  <span className="font-semibold">-{activeSettlement.adjustments.discounts}</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>Refunds &amp; Chargebacks:</span>
                  <span className="font-semibold">-{activeSettlement.adjustments.refunds}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Store Credits Issued:</span>
                  <span className="font-semibold">₹0</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Local Petty Expenses:</span>
                  <span className="font-semibold">-{activeSettlement.expenses}</span>
                </div>
              </div>
            </div>

            {/* Settlement Formula Calculation Summary (Section 14) */}
            <div className="p-3.5 rounded-xl border border-[#5A2EA6]/20 bg-white space-y-2">
              <span className="font-serif font-bold text-ink block pb-1 border-b border-slate-100">
                Settlement Formula Reconciliation
              </span>

              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Gross Revenue:</span>
                  <span className="font-bold">{activeSettlement.grossRev}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Less Total Adjustments:</span>
                  <span className="font-bold">-(Discounts + Refunds + Expenses)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-slate-900">
                  <span>= Net Realized Revenue:</span>
                  <span>{activeSettlement.netAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-100 text-sm">
                  <span>Net Settlement Due to Branch:</span>
                  <span className="font-serif text-[#5A2EA6] text-base">
                    {activeSettlement.settlementAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-ink font-serif block text-xs">
                Settlement Approval Lineage
              </span>
              <div className="space-y-1.5 border-l-2 border-[#5A2EA6]/20 pl-3 ml-1">
                {activeSettlement.auditTrail.map((step, idx) => (
                  <div key={idx} className="relative text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-[#5A2EA6] absolute -left-[17px] top-1" />
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-ink">{step.step}</strong>
                      <span className="text-[10px] text-muted">{step.time}</span>
                    </div>
                    <span className="text-soft block text-[10px]">
                      Actor: <i>{step.actor}</i>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-line gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast(`Opening reconciliation workspace for ${activeSettlement.branchId}...`);
                  window.location.href = `/finance?tab=settlements&branch=${activeSettlement.branchId}`;
                }}
                className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/40 text-[#5A2EA6] hover:bg-purple-50 flex items-center gap-1.5"
              >
                <span>Open in Finance Panel</span>
                <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
              </Button>

              <Button
                onClick={() => setIsDetailOpen(false)}
                className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogModal>
      )}
    </div>
  );
}
