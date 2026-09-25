import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Layers,
  Receipt,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { DialogModal } from '../../../../shared/components/DialogModal';

export interface TransactionRecord {
  id: string;
  ref: string;
  date: string;
  branch: string;
  branchId: string;
  client: string;
  clientPhone: string;
  type:
    | 'Service'
    | 'Retail'
    | 'Package'
    | 'Membership'
    | 'Gift Card'
    | 'Wallet'
    | 'Deposit'
    | 'Refund'
    | 'Credit Note';
  amount: string;
  rawAmount: number;
  isCredit: boolean;
  paymentMethod: string;
  gatewayRef: string;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded' | 'Partially Refunded' | 'Cancelled';
  source: string;
  sourceId: string;
  breakdown: {
    subtotal: string;
    discount: string;
    tax: string;
    total: string;
    paid: string;
    refund: string;
    balance: string;
  };
  auditTimeline: Array<{
    event: string;
    timestamp: string;
    user: string;
    note: string;
  }>;
}

export const initialTransactions: TransactionRecord[] = [
  {
    id: 'TXN-9088',
    ref: 'INV-2026-8821',
    date: '18 Aug 2026, 17:30',
    branch: 'Indore Central (Flagship)',
    branchId: 'BR-01',
    client: 'Ananya Deshmukh',
    clientPhone: '+91 98260 11223',
    type: 'Service',
    amount: '+₹9,027',
    rawAmount: 9027,
    isCredit: true,
    paymentMethod: 'UPI (PhonePe / GPay)',
    gatewayRef: 'UPI-IND-883921004',
    status: 'Successful',
    source: 'Appointment #APT-4402',
    sourceId: 'APT-4402',
    breakdown: {
      subtotal: '₹8,500',
      discount: '₹850 (VIP 10%)',
      tax: '₹1,377 (18% GST)',
      total: '₹9,027',
      paid: '₹9,027',
      refund: '₹0',
      balance: '₹0',
    },
    auditTimeline: [
      {
        event: 'Appointment Checked-in',
        timestamp: '18 Aug 15:30',
        user: 'Front Desk Indore',
        note: 'Service started on Chair #2',
      },
      {
        event: 'POS Invoice Generated',
        timestamp: '18 Aug 17:28',
        user: 'Front Desk Indore',
        note: 'Applied VIP 10% auto-perk',
      },
      {
        event: 'UPI QR Scanned & Paid',
        timestamp: '18 Aug 17:30',
        user: 'System / PhonePe',
        note: 'Settlement token #883921004',
      },
    ],
  },
  {
    id: 'TXN-9087',
    ref: 'INV-2026-8820',
    date: '18 Aug 2026, 16:45',
    branch: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    client: 'Pooja Varma',
    clientPhone: '+91 97550 44332',
    type: 'Package',
    amount: '+₹25,488',
    rawAmount: 25488,
    isCredit: true,
    paymentMethod: 'Credit Card (HDFC Terminal)',
    gatewayRef: 'POS-HDFC-992144',
    status: 'Successful',
    source: 'Package Sale (Bridal Glow 6x)',
    sourceId: 'PKG-BRIDAL-06',
    breakdown: {
      subtotal: '₹24,000',
      discount: '₹2,400 (Early Bird)',
      tax: '₹3,888 (18% GST)',
      total: '₹25,488',
      paid: '₹25,488',
      refund: '₹0',
      balance: '₹0',
    },
    auditTimeline: [
      {
        event: 'Package Selected',
        timestamp: '18 Aug 16:40',
        user: 'Reception Vijay Nagar',
        note: 'Terms accepted by guest',
      },
      {
        event: 'POS Terminal Swiped',
        timestamp: '18 Aug 16:44',
        user: 'Reception Vijay Nagar',
        note: 'Card ending 4821 approved',
      },
      {
        event: 'Session Ledger Provisioned',
        timestamp: '18 Aug 16:45',
        user: 'System Ledger',
        note: '6 Sessions added to client wallet',
      },
    ],
  },
  {
    id: 'TXN-9086',
    ref: 'INV-2026-8819',
    date: '18 Aug 2026, 15:20',
    branch: 'Bhopal Arera Colony',
    branchId: 'BR-03',
    client: 'Rohan Malhotra',
    clientPhone: '+91 98930 77112',
    type: 'Retail',
    amount: '+₹8,071',
    rawAmount: 8071,
    isCredit: true,
    paymentMethod: 'Debit Card (ICICI POS)',
    gatewayRef: 'POS-ICICI-339912',
    status: 'Successful',
    source: 'Retail Sale (Kérastase Trio)',
    sourceId: 'RET-SALE-109',
    breakdown: {
      subtotal: '₹7,200',
      discount: '₹360 (5% Retail Promo)',
      tax: '₹1,231 (18% GST)',
      total: '₹8,071',
      paid: '₹8,071',
      refund: '₹0',
      balance: '₹0',
    },
    auditTimeline: [
      {
        event: 'Retail Barcodes Scanned',
        timestamp: '18 Aug 15:18',
        user: 'Bhopal Store Desk',
        note: '3 SKUs verified',
      },
      {
        event: 'Payment Captured',
        timestamp: '18 Aug 15:20',
        user: 'Bhopal Store Desk',
        note: 'Slip printed #8819',
      },
    ],
  },
  {
    id: 'TXN-9085',
    ref: 'REF-2026-0412',
    date: '18 Aug 2026, 14:10',
    branch: 'Gwalior City Centre',
    branchId: 'BR-05',
    client: 'Kavita Saxena',
    clientPhone: '+91 94250 88991',
    type: 'Refund',
    amount: '-₹3,717',
    rawAmount: 3717,
    isCredit: false,
    paymentMethod: 'UPI Reversal (Cashfree)',
    gatewayRef: 'REV-CF-449102',
    status: 'Refunded',
    source: 'Service Cancellation #APT-4389',
    sourceId: 'APT-4389',
    breakdown: {
      subtotal: '₹3,500',
      discount: '₹350',
      tax: '₹567',
      total: '₹3,717',
      paid: '₹3,717',
      refund: '₹3,717 (Full Refund)',
      balance: '₹0',
    },
    auditTimeline: [
      {
        event: 'Refund Requested',
        timestamp: '18 Aug 13:45',
        user: 'Gwalior Reception',
        note: 'Reason: Stylist sudden medical emergency',
      },
      {
        event: 'Brand Owner Approved',
        timestamp: '18 Aug 14:02',
        user: 'Ananya Shah (HQ)',
        note: 'Approved under client satisfaction SLA',
      },
      {
        event: 'Gateway Reversal Executed',
        timestamp: '18 Aug 14:10',
        user: 'System Finance',
        note: 'Sent back to UPI VPA',
      },
    ],
  },
  {
    id: 'TXN-9084',
    ref: 'INV-2026-8815',
    date: '18 Aug 2026, 12:00',
    branch: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    client: 'Vikramaditya Rao',
    clientPhone: '+91 98270 55441',
    type: 'Membership',
    amount: '+₹18,000',
    rawAmount: 18000,
    isCredit: true,
    paymentMethod: 'Bank Transfer (NEFT)',
    gatewayRef: 'NEFT-HDFC-991823',
    status: 'Pending',
    source: 'Annual Elite Club Membership',
    sourceId: 'MEM-ELITE-01',
    breakdown: {
      subtotal: '₹18,000',
      discount: '₹0',
      tax: '₹3,240',
      total: '₹21,240',
      paid: '₹0',
      refund: '₹0',
      balance: '₹21,240',
    },
    auditTimeline: [
      {
        event: 'Proforma Invoice Sent',
        timestamp: '18 Aug 11:30',
        user: 'Ujjain Manager',
        note: 'Corporate guest invoice created',
      },
      {
        event: 'Awaiting Bank Clearance',
        timestamp: '18 Aug 12:00',
        user: 'System Ledger',
        note: 'UTR verification pending',
      },
    ],
  },
  {
    id: 'TXN-9083',
    ref: 'INV-2026-8812',
    date: '17 Aug 2026, 19:40',
    branch: 'Indore Central (Flagship)',
    branchId: 'BR-01',
    client: 'Sunita Mehra',
    clientPhone: '+91 98261 99002',
    type: 'Wallet',
    amount: '+₹10,000',
    rawAmount: 10000,
    isCredit: true,
    paymentMethod: 'UPI (Google Pay)',
    gatewayRef: 'UPI-IND-77182991',
    status: 'Successful',
    source: 'Prepaid Wallet Recharge',
    sourceId: 'WAL-TOPUP-55',
    breakdown: {
      subtotal: '₹10,000',
      discount: '₹0 (Bonus ₹1,000 credited)',
      tax: '₹0 (Advance deposit)',
      total: '₹10,000',
      paid: '₹10,000',
      refund: '₹0',
      balance: '₹0',
    },
    auditTimeline: [
      {
        event: 'Wallet Top-up Initiated',
        timestamp: '17 Aug 19:38',
        user: 'Indore Reception',
        note: 'Client opted for ₹10k promo slab',
      },
      {
        event: 'Payment Successful',
        timestamp: '17 Aug 19:40',
        user: 'System Gateway',
        note: 'Wallet ledger updated to ₹11,000',
      },
    ],
  },
  {
    id: 'TXN-9082',
    ref: 'CRN-2026-0045',
    date: '17 Aug 2026, 17:15',
    branch: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    client: 'Sneha Patel',
    clientPhone: '+91 99810 33445',
    type: 'Credit Note',
    amount: '-₹2,500',
    rawAmount: 2500,
    isCredit: false,
    paymentMethod: 'Store Credit Issued',
    gatewayRef: 'CRN-INT-0045',
    status: 'Successful',
    source: 'Product Exchange Return',
    sourceId: 'EXCH-RET-09',
    breakdown: {
      subtotal: '₹2,500',
      discount: '₹0',
      tax: '₹0',
      total: '₹2,500',
      paid: '₹2,500',
      refund: '₹2,500 (Credit Note)',
      balance: '₹0',
    },
    auditTimeline: [
      {
        event: 'Unopened Item Returned',
        timestamp: '17 Aug 17:00',
        user: 'Storekeeper Vijay Nagar',
        note: 'Seals verified intact',
      },
      {
        event: 'Credit Note Issued',
        timestamp: '17 Aug 17:15',
        user: 'Vijay Nagar Manager',
        note: 'Valid for 180 days across all branches',
      },
    ],
  },
];

export function TransactionsTab() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filtering
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gatewayRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || t.branchId === selectedBranch;
    const matchesType =
      selectedType === 'all' || t.type.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus =
      selectedStatus === 'all' || t.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesBranch && matchesType && matchesStatus;
  });

  const handleOpenDetail = (txn: TransactionRecord) => {
    setSelectedTxn(txn);
    setIsDetailOpen(true);
  };

  const handleDeepLinkToFinance = (txnId: string) => {
    toast(`Redirecting to Finance Panel detail view for transaction ${txnId}...`);
    window.location.href = `/finance?tab=transactions&ref=${txnId}`;
  };

  const getStatusBadge = (status: TransactionRecord['status']) => {
    switch (status) {
      case 'Successful':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Refunded':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Partially Refunded':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
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
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search TXN ID, Invoice, Client, Gateway Ref..."
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

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Transaction Types</option>
            <option value="service">Service</option>
            <option value="retail">Retail</option>
            <option value="package">Package</option>
            <option value="membership">Membership</option>
            <option value="gift card">Gift Card</option>
            <option value="wallet">Wallet</option>
            <option value="deposit">Deposit</option>
            <option value="refund">Refund</option>
            <option value="credit note">Credit Note</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="partially refunded">Partially Refunded</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast('Downloading Transaction Audit Log (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Transactions</span>
          </Button>
        </div>
      </div>

      {/* 2. Notice Banner: Separation of Concerns */}
      <div className="bg-gradient-to-r from-purple-50 via-[#F8F5FF] to-indigo-50 border border-[#5A2EA6]/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#5A2EA6] text-white grid place-items-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-ink font-bold block">
              Brand Owner Financial Monitoring Mode
            </strong>
            <span className="text-soft text-[11px]">
              This view provides real-time auditability across all branch billing streams without
              exposing sensitive payment credentials. Detailed reconciliation and payout postings
              remain managed inside the Finance Panel.
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = '/finance';
          }}
          className="h-[32px] px-3 rounded-xl text-[11px] font-bold border-[#5A2EA6]/40 text-[#5A2EA6] bg-white hover:bg-purple-50 shrink-0 flex items-center gap-1"
        >
          <span>Open Finance Panel</span>
          <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
        </Button>
      </div>

      {/* 3. Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Transactions Master Ledger
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {filtered.length} Entries
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Immutable log of client billing, retail checks, package sales, refunds, and voucher
              redemptions
            </p>
          </div>

          <div className="text-xs text-soft">
            <span>Live Sync Active</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Transaction ID & Ref</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5">Payment Method & Ref</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* ID & Ref */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{t.id}</strong>
                    <span className="text-[10px] text-[#5A2EA6] font-semibold">{t.ref}</span>
                  </td>

                  {/* Date */}
                  <td className="p-3.5 text-slate-600 font-semibold whitespace-nowrap">{t.date}</td>

                  {/* Branch */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                      {t.branch}
                    </span>
                    <span className="text-[10px] text-soft">{t.branchId}</span>
                  </td>

                  {/* Client */}
                  <td className="p-3.5 whitespace-nowrap">
                    <strong className="font-bold text-ink block">{t.client}</strong>
                    <span className="text-[10px] text-muted">{t.clientPhone}</span>
                  </td>

                  {/* Type */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-100 whitespace-nowrap shadow-3xs">
                      {t.type}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="p-3.5 text-right font-extrabold whitespace-nowrap">
                    <span className={t.isCredit ? 'text-emerald-700' : 'text-rose-700'}>
                      {t.amount}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 block text-xs">
                      {t.paymentMethod}
                    </span>
                    <span className="text-[10px] text-muted font-mono">{t.gatewayRef}</span>
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        getStatusBadge(t.status),
                      )}
                    >
                      {t.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenDetail(t)}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-[#5A2EA6]" />
                        <span>Inspect</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Read-Oriented Transaction Detail Modal (Section 8) */}
      {selectedTxn && (
        <DialogModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Transaction Dossier · ${selectedTxn.id}`}
          description="Read-oriented financial inspection & immutable audit history"
        >
          <div className="space-y-4 text-xs">
            {/* Header Tag Bar */}
            <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#5A2EA6]/15 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink text-sm font-serif">{selectedTxn.ref}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5A2EA6] text-white">
                  {selectedTxn.type}
                </span>
              </div>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap inline-flex items-center',
                  getStatusBadge(selectedTxn.status),
                )}
              >
                {selectedTxn.status}
              </span>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Branch Location
                </span>
                <strong className="text-ink text-xs font-bold block mt-0.5">
                  {selectedTxn.branch}
                </strong>
                <span className="text-[10px] text-soft">{selectedTxn.branchId}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Guest Client
                </span>
                <strong className="text-ink text-xs font-bold block mt-0.5">
                  {selectedTxn.client}
                </strong>
                <span className="text-[10px] text-soft">{selectedTxn.clientPhone}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Transaction Date
                </span>
                <span className="text-slate-800 font-bold block mt-0.5">{selectedTxn.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Source Association
                </span>
                <span className="text-[#5A2EA6] font-bold block mt-0.5">{selectedTxn.source}</span>
              </div>
            </div>

            {/* Financial Amount Breakdown (Section 8) */}
            <div className="p-3.5 rounded-xl border border-[#5A2EA6]/20 bg-white space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-line/40 font-bold text-ink">
                <span className="font-serif">Amount Breakdown</span>
                <span className="text-[10px] text-muted">Statutory GST 18% Calculated</span>
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-soft">Subtotal:</span>
                  <span className="font-semibold">{selectedTxn.breakdown.subtotal}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Discount Applied:</span>
                  <span className="font-semibold">-{selectedTxn.breakdown.discount}</span>
                </div>
                <div className="flex justify-between text-indigo-700">
                  <span>Tax (CGST 9% + SGST 9%):</span>
                  <span className="font-semibold">{selectedTxn.breakdown.tax}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-ink text-sm">
                  <span>Total Bill:</span>
                  <span className="font-serif text-[#5A2EA6]">{selectedTxn.breakdown.total}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Paid Amount:</span>
                  <span>{selectedTxn.breakdown.paid}</span>
                </div>
                {selectedTxn.breakdown.refund !== '₹0' && (
                  <div className="flex justify-between text-red-700 font-bold">
                    <span>Refund Issued:</span>
                    <span>-{selectedTxn.breakdown.refund}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                  <span>Balance Due:</span>
                  <span className="font-bold">{selectedTxn.breakdown.balance}</span>
                </div>
              </div>
            </div>

            {/* Payment Gateway Information (Safe - No sensitive PAN/CVV) */}
            <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted font-bold text-[10px] uppercase">Gateway Channel:</span>
                <span className="font-bold text-ink">{selectedTxn.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted font-bold text-[10px] uppercase">Bank Reference:</span>
                <span className="font-mono text-slate-800 font-bold">{selectedTxn.gatewayRef}</span>
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-ink font-serif block text-xs">
                Audit Lifecycle Trail
              </span>
              <div className="space-y-2 border-l-2 border-[#5A2EA6]/20 pl-3 ml-1">
                {selectedTxn.auditTimeline.map((step, sIdx) => (
                  <div key={sIdx} className="relative text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-[#5A2EA6] absolute -left-[17px] top-1" />
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-ink">{step.event}</strong>
                      <span className="text-[10px] text-muted">{step.timestamp}</span>
                    </div>
                    <span className="text-soft block text-[10px]">
                      {step.note} · <i>{step.user}</i>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-line/50 gap-2">
              <Button
                variant="outline"
                onClick={() => handleDeepLinkToFinance(selectedTxn.id)}
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
