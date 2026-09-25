import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowRight,
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  Truck,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NewTransferRequestModal } from './NewTransferRequestModal';

export interface StockTransfer {
  id: string;
  sourceBranch: string;
  sourceBranchId: string;
  destinationBranch: string;
  destinationBranchId: string;
  totalItems: number;
  totalQuantity: number;
  requestedDate: string;
  dispatchedDate?: string;
  receivedDate?: string;
  requestedBy: string;
  approvedBy?: string;
  status:
    | 'Draft'
    | 'Requested'
    | 'Approved'
    | 'Dispatched'
    | 'In Transit'
    | 'Received'
    | 'Rejected'
    | 'Cancelled';
  purpose: string;
  items: {
    productName: string;
    sku: string;
    batchNumber: string;
    quantity: number;
    unit: string;
    sourceAvailableQty: number;
    destinationCurrentQty: number;
  }[];
  movementSteps: {
    step: 'Requested' | 'Approved' | 'Dispatched' | 'In Transit' | 'Received';
    date: string;
    user: string;
    isCompleted: boolean;
  }[];
  auditLogs: {
    timestamp: string;
    user: string;
    action: string;
    comment: string;
  }[];
}

const mockTransfers: StockTransfer[] = [
  {
    id: 'TR-2026-042',
    sourceBranch: 'Indore Central Flagship',
    sourceBranchId: 'BR-01',
    destinationBranch: 'Vijay Nagar Boutique',
    destinationBranchId: 'BR-02',
    totalItems: 2,
    totalQuantity: 24,
    requestedDate: '16 Aug 2026',
    dispatchedDate: '17 Aug 2026',
    requestedBy: 'Kunal Sen (Floor Mgr)',
    approvedBy: 'Aditya Pandey (Brand Owner)',
    status: 'In Transit',
    purpose: 'Urgent stock balancing for weekend bridal bookings',
    items: [
      {
        productName: "L'Oréal Majirel Colour Tube - 6.13",
        sku: 'SKU-MAJ-613',
        batchNumber: 'LOT-MAJ-992',
        quantity: 18,
        unit: 'Tubes',
        sourceAvailableQty: 65,
        destinationCurrentQty: 4,
      },
      {
        productName: "L'Oréal Oxydant Developer 20 Vol",
        sku: 'SKU-LOR-DEV20',
        batchNumber: 'LOT-DEV-201',
        quantity: 6,
        unit: 'Bottles',
        sourceAvailableQty: 32,
        destinationCurrentQty: 2,
      },
    ],
    movementSteps: [
      { step: 'Requested', date: '16 Aug, 11:30 AM', user: 'Kunal Sen', isCompleted: true },
      { step: 'Approved', date: '16 Aug, 03:00 PM', user: 'Aditya Pandey', isCompleted: true },
      { step: 'Dispatched', date: '17 Aug, 09:45 AM', user: 'Sunil Rao', isCompleted: true },
      {
        step: 'In Transit',
        date: '17 Aug, 10:15 AM',
        user: 'Salon Logistics Van',
        isCompleted: true,
      },
      { step: 'Received', date: 'Pending Arrival', user: 'Vijay Nagar Store', isCompleted: false },
    ],
    auditLogs: [
      {
        timestamp: '16 Aug, 11:30 AM',
        user: 'Kunal Sen',
        action: 'Transfer Request Created',
        comment: 'Requested stock for high bridal footfall.',
      },
      {
        timestamp: '16 Aug, 03:00 PM',
        user: 'Aditya Pandey',
        action: 'Head Office Authorized',
        comment: 'Approved full quantity request.',
      },
      {
        timestamp: '17 Aug, 09:45 AM',
        user: 'Sunil Rao',
        action: 'Items Picked & Dispatched',
        comment: 'Box seal #LOR-881 verified.',
      },
    ],
  },
  {
    id: 'TR-2026-041',
    sourceBranch: 'Indore Central Flagship',
    sourceBranchId: 'BR-01',
    destinationBranch: 'Bhopal Arera Colony',
    destinationBranchId: 'BR-03',
    totalItems: 1,
    totalQuantity: 6,
    requestedDate: '14 Aug 2026',
    dispatchedDate: '15 Aug 2026',
    receivedDate: '17 Aug 2026',
    requestedBy: 'Kavita Nair (Branch Manager)',
    approvedBy: 'Aditya Pandey (Brand Owner)',
    status: 'Received',
    purpose: 'Pre-expiry mitigation transfer for high-volume esthetics usage',
    items: [
      {
        productName: 'O3+ Seaweed Facial Kit (Single Use)',
        sku: 'SKU-O3-SEA01',
        batchNumber: 'LOT-O3-8812',
        quantity: 6,
        unit: 'Kits',
        sourceAvailableQty: 24,
        destinationCurrentQty: 5,
      },
    ],
    movementSteps: [
      { step: 'Requested', date: '14 Aug, 02:00 PM', user: 'Kavita Nair', isCompleted: true },
      { step: 'Approved', date: '14 Aug, 04:30 PM', user: 'Aditya Pandey', isCompleted: true },
      { step: 'Dispatched', date: '15 Aug, 10:00 AM', user: 'Sunil Rao', isCompleted: true },
      {
        step: 'In Transit',
        date: '16 Aug, 08:00 AM',
        user: 'Intercity Courier',
        isCompleted: true,
      },
      { step: 'Received', date: '17 Aug, 01:20 PM', user: 'Kavita Nair', isCompleted: true },
    ],
    auditLogs: [
      {
        timestamp: '14 Aug, 02:00 PM',
        user: 'Kavita Nair',
        action: 'Request Logged',
        comment: 'Bhopal skincare client rush.',
      },
      {
        timestamp: '17 Aug, 01:20 PM',
        user: 'Kavita Nair',
        action: 'Inward Count Reconciled',
        comment: '6 kits accepted with zero damage.',
      },
    ],
  },
  {
    id: 'TR-2026-043',
    sourceBranch: 'Vijay Nagar Boutique',
    sourceBranchId: 'BR-02',
    destinationBranch: 'Ujjain Mahakal Road',
    destinationBranchId: 'BR-04',
    totalItems: 2,
    totalQuantity: 12,
    requestedDate: '18 Aug 2026',
    requestedBy: 'Pooja Verma (Storekeeper)',
    status: 'Requested',
    purpose: 'Emergency hair smoothing stock support',
    items: [
      {
        productName: 'Keratin Complex Smoothing Infusion (60ml)',
        sku: 'SKU-KER-SMOOTH',
        batchNumber: 'LOT-KER-441',
        quantity: 8,
        unit: 'Bottles',
        sourceAvailableQty: 18,
        destinationCurrentQty: 1,
      },
      {
        productName: 'Clarifying Pre-Treatment Shampoo',
        sku: 'SKU-KER-SHM01',
        batchNumber: 'LOT-KER-110',
        quantity: 4,
        unit: 'Bottles',
        sourceAvailableQty: 12,
        destinationCurrentQty: 0,
      },
    ],
    movementSteps: [
      { step: 'Requested', date: '18 Aug, 09:30 AM', user: 'Pooja Verma', isCompleted: true },
      {
        step: 'Approved',
        date: 'Pending HO Authorization',
        user: 'Aditya Pandey',
        isCompleted: false,
      },
      { step: 'Dispatched', date: 'Pending', user: 'Vijay Nagar Store', isCompleted: false },
      { step: 'In Transit', date: 'Pending', user: 'Logistics', isCompleted: false },
      { step: 'Received', date: 'Pending', user: 'Ujjain Store', isCompleted: false },
    ],
    auditLogs: [
      {
        timestamp: '18 Aug, 09:30 AM',
        user: 'Pooja Verma',
        action: 'Transfer Request Submitted',
        comment: 'Awaiting Head Office authorization.',
      },
    ],
  },
];

export function TransfersTab() {
  const [transfersList, setTransfersList] = useState<StockTransfer[]>(mockTransfers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveTransfer = (newTransfer: StockTransfer) => {
    setTransfersList([newTransfer, ...transfersList]);
    showToast(
      `Transfer ${newTransfer.id} requested (${newTransfer.totalQuantity} units from ${newTransfer.sourceBranch} to ${newTransfer.destinationBranch}).`,
    );
  };

  useEffect(() => {
    if (selectedTransfer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTransfer]);

  const getStatusBadge = (st: StockTransfer['status']) => {
    switch (st) {
      case 'Received':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Transit':
      case 'Dispatched':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Requested':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Approved':
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredTransfers = transfersList.filter((t) => {
    if (selectedSource !== 'all' && t.sourceBranchId !== selectedSource) return false;
    if (selectedDestination !== 'all' && t.destinationBranchId !== selectedDestination)
      return false;
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    if (searchTerm) {
      const match =
        `${t.id} ${t.sourceBranch} ${t.destinationBranch} ${t.requestedBy}`.toLowerCase();
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

      {/* 1. Header Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Transfer ID, branch, operator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Source Branch */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Source Branches</option>
            <option value="BR-01">Indore Central Flagship</option>
            <option value="BR-02">Vijay Nagar Boutique</option>
            <option value="BR-03">Bhopal Arera Colony</option>
          </select>

          {/* Destination Branch */}
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Destination Branches</option>
            <option value="BR-02">Vijay Nagar Boutique</option>
            <option value="BR-03">Bhopal Arera Colony</option>
            <option value="BR-04">Ujjain Mahakal Road</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Transfer Statuses</option>
            <option value="Requested">Requested (Awaiting Sign-off)</option>
            <option value="Approved">Approved</option>
            <option value="In Transit">In Transit</option>
            <option value="Received">Received</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting stock transfer logs (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Transfers</span>
          </Button>

          <Button
            onClick={() => setIsNewTransferOpen(true)}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Transfer Request</span>
          </Button>
        </div>
      </div>

      {/* 2. Section 16: Transfers Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Multi-Branch Stock Transfer Ledger
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                {filteredTransfers.length} Transfers
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Inter-branch replenishment and pre-expiry stock transfers with chain-of-custody
              tracking
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsNewTransferOpen(true)}
              className="h-[32px] px-3.5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Transfer Request</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Transfer ID &amp; Date</th>
                <th className="p-3.5">Source Branch (Origin)</th>
                <th className="p-3.5">Destination Branch</th>
                <th className="p-3.5 text-center">Items / Quantity</th>
                <th className="p-3.5">Dispatched Date</th>
                <th className="p-3.5">Received Date</th>
                <th className="p-3.5">Requested By</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Oversight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredTransfers.map((t) => (
                <tr key={t.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* ID */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{t.id}</strong>
                    <span className="text-[10px] text-muted">Req: {t.requestedDate}</span>
                  </td>

                  {/* Source */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block text-xs">{t.sourceBranch}</span>
                    <span className="text-[10px] text-soft">{t.sourceBranchId}</span>
                  </td>

                  {/* Destination */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-indigo-900 block text-xs">
                      {t.destinationBranch}
                    </span>
                    <span className="text-[10px] text-soft">{t.destinationBranchId}</span>
                  </td>

                  {/* Items */}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                    {t.totalItems} SKUs ({t.totalQuantity} pcs)
                  </td>

                  {/* Dispatched */}
                  <td className="p-3.5 whitespace-nowrap text-slate-700">
                    {t.dispatchedDate || '—'}
                  </td>

                  {/* Received */}
                  <td className="p-3.5 whitespace-nowrap text-slate-700">
                    {t.receivedDate || '—'}
                  </td>

                  {/* Requested By */}
                  <td className="p-3.5 whitespace-nowrap text-slate-700">
                    <span className="font-medium text-slate-900 block">{t.requestedBy}</span>
                    {t.approvedBy && (
                      <span className="text-[10px] text-[#5A2EA6]">Appr: {t.approvedBy}</span>
                    )}
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
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTransfer(t)}
                      className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 inline-flex"
                    >
                      <Eye className="w-3 h-3 text-[#5A2EA6]" />
                      <span>{t.status === 'Requested' ? 'Review & Authorize' : 'Inspect'}</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Section 17: TRANSFER DETAILS MODAL */}
      {selectedTransfer &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedTransfer(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Stock Transfer Protocol
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(selectedTransfer.status),
                      )}
                    >
                      {selectedTransfer.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedTransfer.id}
                  </h3>
                  <p className="text-xs text-muted">
                    From <strong>{selectedTransfer.sourceBranch}</strong> &rarr; To{' '}
                    <strong>{selectedTransfer.destinationBranch}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTransfer(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Step Movement Lifecycle */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-3">
                    Chain-of-Custody Progression
                  </span>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {selectedTransfer.movementSteps.map((stp, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <div
                          className={cn(
                            'h-2 rounded-full mb-1.5 transition-all',
                            stp.isCompleted ? 'bg-[#5A2EA6]' : 'bg-purple-200/60',
                          )}
                        />
                        <strong
                          className={cn(
                            'block font-bold text-[11px]',
                            stp.isCompleted ? 'text-ink' : 'text-muted',
                          )}
                        >
                          {stp.step}
                        </strong>
                        <span className="text-[9px] text-soft block leading-tight">{stp.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transfer Items Table */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    Transferred Stock Items
                  </span>
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5 pl-3">Product Name</th>
                          <th className="p-2.5">SKU &amp; Batch</th>
                          <th className="p-2.5 text-center">Transfer Qty</th>
                          <th className="p-2.5 text-center">Source Avail.</th>
                          <th className="p-2.5 pr-3 text-center">Dest. On-Hand</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {selectedTransfer.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 pl-3 font-bold text-ink">{it.productName}</td>
                            <td className="p-2.5 font-mono text-muted">
                              {it.sku} · {it.batchNumber}
                            </td>
                            <td className="p-2.5 text-center font-bold text-[#5A2EA6] bg-purple-50/30">
                              {it.quantity} {it.unit}
                            </td>
                            <td className="p-2.5 text-center text-emerald-700 font-bold">
                              {it.sourceAvailableQty} {it.unit}
                            </td>
                            <td className="p-2.5 pr-3 text-center text-slate-800">
                              {it.destinationCurrentQty} {it.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Purpose & Audit History */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <strong className="text-ink font-bold block mb-1">
                      Transfer Purpose / Justification
                    </strong>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {selectedTransfer.purpose}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <strong className="text-ink font-bold block mb-1.5">Audit Trail Journal</strong>
                    <div className="space-y-1.5 text-[11px]">
                      {selectedTransfer.auditLogs.map((log, lIdx) => (
                        <div key={lIdx} className="border-b border-slate-200/50 pb-1 last:border-0">
                          <span className="font-bold text-slate-900">{log.action}</span>
                          <span className="text-[10px] text-muted block">
                            {log.timestamp} by {log.user}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <span className="text-xs text-soft font-semibold">Protected Chain-of-Custody</span>
                <div className="flex items-center gap-2">
                  {selectedTransfer.status === 'Requested' ? (
                    <Button
                      onClick={() => {
                        selectedTransfer.status = 'Approved';
                        showToast(
                          `Transfer ${selectedTransfer.id} has been authorized for dispatch.`,
                        );
                        setSelectedTransfer(null);
                      }}
                      className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                    >
                      Authorize Inter-Branch Dispatch
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSelectedTransfer(null)}
                      className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                    >
                      Close Inspection
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Section 17: NEW TRANSFER REQUEST MODAL */}
      <NewTransferRequestModal
        isOpen={isNewTransferOpen}
        onClose={() => setIsNewTransferOpen(false)}
        onSave={handleSaveTransfer}
      />
    </div>
  );
}
