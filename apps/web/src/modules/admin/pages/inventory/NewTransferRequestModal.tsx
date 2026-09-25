import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowRight,
  ArrowRightLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Info,
  Layers,
  Package,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';
import type { StockTransfer } from './TransfersTab';

export interface NewTransferRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transfer: StockTransfer) => void;
}

interface TransferLineItemInput {
  productName: string;
  sku: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  sourceAvailableQty: number;
  destinationCurrentQty: number;
}

const COMMON_TRANSFER_SKUS = [
  {
    name: "L'Oréal Majirel Colour Tube - 6.13",
    sku: 'SKU-MAJ-613',
    batch: 'LOT-MAJ-992',
    unit: 'Tubes',
    defaultSourceQty: 65,
    defaultDestQty: 4,
  },
  {
    name: "L'Oréal Oxydant Developer 20 Vol",
    sku: 'SKU-LOR-DEV20',
    batch: 'LOT-DEV-201',
    unit: 'Bottles',
    defaultSourceQty: 32,
    defaultDestQty: 2,
  },
  {
    name: 'O3+ Seaweed Facial Kit (Single Use)',
    sku: 'SKU-O3-SEA01',
    batch: 'LOT-O3-8812',
    unit: 'Kits',
    defaultSourceQty: 24,
    defaultDestQty: 5,
  },
  {
    name: 'Keratin Complex Smoothing Infusion (60ml)',
    sku: 'SKU-KER-SMOOTH',
    batch: 'LOT-KER-441',
    unit: 'Bottles',
    defaultSourceQty: 18,
    defaultDestQty: 1,
  },
  {
    name: 'Clarifying Pre-Treatment Shampoo',
    sku: 'SKU-KER-SHM01',
    batch: 'LOT-KER-110',
    unit: 'Bottles',
    defaultSourceQty: 12,
    defaultDestQty: 0,
  },
  {
    name: 'Moroccanoil Treatment Original (100ml)',
    sku: 'SKU-MOR-100',
    batch: 'LOT-MOR-502',
    unit: 'Bottles',
    defaultSourceQty: 20,
    defaultDestQty: 3,
  },
  {
    name: 'Kashmir Lavender Massage Oil (1L)',
    sku: 'SKU-LAV-OIL-1L',
    batch: 'LOT-LAV-091',
    unit: 'Bottles',
    defaultSourceQty: 15,
    defaultDestQty: 2,
  },
];

const TRANSFER_PURPOSES = [
  'Weekend Rush / Urgent Stock Balancing',
  'Pre-Expiry Stock Mitigation (Transfer to High-Velocity Outlet)',
  'Bridal & VIP Event Reservation Prep',
  'Emergency Out-of-Stock Backup Support',
  'New Branch Inward Stock Seeding',
];

const LOGISTICS_CARRIERS = [
  'Internal Salon Logistics Van',
  'Express Inter-City Logistics (BlueDart / Delhivery)',
  'Manager Hand-Carry Transit',
  'Local Express Porter / Courier',
];

export function NewTransferRequestModal({ isOpen, onClose, onSave }: NewTransferRequestModalProps) {
  const [sourceBranchId, setSourceBranchId] = useState(masterBranches[0]?.id || 'BR-01');
  const [destinationBranchId, setDestinationBranchId] = useState(masterBranches[1]?.id || 'BR-02');
  const [purpose, setPurpose] = useState(TRANSFER_PURPOSES[0]);
  const [carrier, setCarrier] = useState(LOGISTICS_CARRIERS[0]);
  const [sealNumber, setSealNumber] = useState(`SEAL-TR-${Math.floor(100 + Math.random() * 900)}`);
  const [requestedBy, setRequestedBy] = useState('Head Office Store Manager');
  const [notes, setNotes] = useState('Authorized inter-branch inventory transfer.');

  // Line items
  const [items, setItems] = useState<TransferLineItemInput[]>([
    {
      productName: "L'Oréal Majirel Colour Tube - 6.13",
      sku: 'SKU-MAJ-613',
      batchNumber: 'LOT-MAJ-992',
      quantity: 12,
      unit: 'Tubes',
      sourceAvailableQty: 65,
      destinationCurrentQty: 4,
    },
  ]);

  // Quick Add Item Form
  const [selectedSkuPreset, setSelectedSkuPreset] = useState(COMMON_TRANSFER_SKUS[1].name);
  const [itemQty, setItemQty] = useState('6');

  const sourceBranch = masterBranches.find((b) => b.id === sourceBranchId) || masterBranches[0];
  const destinationBranch =
    masterBranches.find((b) => b.id === destinationBranchId) || masterBranches[1];

  const handleAddItem = () => {
    const skuPreset =
      COMMON_TRANSFER_SKUS.find((s) => s.name === selectedSkuPreset) || COMMON_TRANSFER_SKUS[0];
    const qty = Number.parseInt(itemQty, 10) || 1;

    if (qty <= 0) {
      alert('Please enter a valid transfer quantity.');
      return;
    }

    if (qty > skuPreset.defaultSourceQty) {
      alert(
        `Cannot transfer ${qty} units. Only ${skuPreset.defaultSourceQty} units available at source branch.`,
      );
      return;
    }

    const newItem: TransferLineItemInput = {
      productName: skuPreset.name,
      sku: skuPreset.sku,
      batchNumber: skuPreset.batch,
      quantity: qty,
      unit: skuPreset.unit,
      sourceAvailableQty: skuPreset.defaultSourceQty,
      destinationCurrentQty: skuPreset.defaultDestQty,
    };

    setItems([...items, newItem]);
    setItemQty('6');
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const totalQuantity = items.reduce((acc, it) => acc + it.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (sourceBranchId === destinationBranchId) {
      alert('Source branch (Origin) and Destination branch cannot be the same.');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one stock item to transfer.');
      return;
    }

    const transferId = `TR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newTransfer: StockTransfer = {
      id: transferId,
      sourceBranch: sourceBranch.name,
      sourceBranchId: sourceBranch.id,
      destinationBranch: destinationBranch.name,
      destinationBranchId: destinationBranch.id,
      totalItems: items.length,
      totalQuantity,
      requestedDate: todayStr,
      requestedBy,
      approvedBy: 'Pending HO Authorization',
      status: 'Requested',
      purpose: notes.trim() ? `${purpose} · ${notes.trim()}` : purpose,
      items: items.map((it) => ({
        productName: it.productName,
        sku: it.sku,
        batchNumber: it.batchNumber,
        quantity: it.quantity,
        unit: it.unit,
        sourceAvailableQty: it.sourceAvailableQty,
        destinationCurrentQty: it.destinationCurrentQty,
      })),
      movementSteps: [
        { step: 'Requested', date: `${todayStr}, Just Now`, user: requestedBy, isCompleted: true },
        {
          step: 'Approved',
          date: 'Pending HO Authorization',
          user: 'Head Office',
          isCompleted: false,
        },
        {
          step: 'Dispatched',
          date: 'Pending',
          user: `${sourceBranch.name} Store`,
          isCompleted: false,
        },
        { step: 'In Transit', date: 'Pending', user: carrier, isCompleted: false },
        {
          step: 'Received',
          date: 'Pending',
          user: `${destinationBranch.name} Store`,
          isCompleted: false,
        },
      ],
      auditLogs: [
        {
          timestamp: `${todayStr}, Just Now`,
          user: requestedBy,
          action: 'Transfer Request Created',
          comment: `Initiated transfer of ${totalQuantity} units across ${items.length} SKUs via ${carrier}. Box Seal: ${sealNumber}`,
        },
      ],
    };

    onSave(newTransfer);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#2D1552]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#5A2EA6]/25 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#5A2EA6]/15 flex items-start justify-between gap-4 bg-gradient-to-r from-[#FAF7FF] via-[#F5EFFF] to-[#FAF7FF] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A2EA6] text-white flex items-center justify-center shadow-md shadow-[#5A2EA6]/20 shrink-0">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                INTER-BRANCH LOGISTICS &amp; TRANSFERS
              </span>
              <h2 className="font-serif font-bold text-ink text-lg sm:text-xl leading-tight mt-0.5">
                Create Stock Transfer Request
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 grid place-items-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Branch Routing Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100 items-center">
            <div className="sm:col-span-5">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Source Branch (Dispatch Origin) *
              </label>
              <select
                value={sourceBranchId}
                onChange={(e) => setSourceBranchId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {masterBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 text-center flex flex-col items-center justify-center pt-3 sm:pt-0">
              <div className="w-8 h-8 rounded-full bg-[#5A2EA6] text-white flex items-center justify-center shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-soft mt-1">Inter-Branch</span>
            </div>

            <div className="sm:col-span-5">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Destination Branch (Receiving Target) *
              </label>
              <select
                value={destinationBranchId}
                onChange={(e) => setDestinationBranchId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {masterBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            {sourceBranchId === destinationBranchId && (
              <div className="sm:col-span-12 p-2 bg-rose-50 rounded-xl border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Error: Source branch and destination branch must be different outlets.</span>
              </div>
            )}
          </div>

          {/* 2. Transfer Purpose & Carrier */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-6">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Transfer Purpose / Business Justification *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {TRANSFER_PURPOSES.map((p, i) => (
                  <option key={i} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Logistics Carrier Mode *
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {LOGISTICS_CARRIERS.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Packaging Box Seal #
              </label>
              <input
                type="text"
                value={sealNumber}
                onChange={(e) => setSealNumber(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>
          </div>

          {/* 3. Add Line Items Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
              Add Inventory SKUs to Transfer Order
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-7">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Select SKU &amp; Batch
                </label>
                <select
                  value={selectedSkuPreset}
                  onChange={(e) => setSelectedSkuPreset(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                >
                  {COMMON_TRANSFER_SKUS.map((s, i) => (
                    <option key={i} value={s.name}>
                      {s.name} ({s.sku}) · Available: {s.defaultSourceQty} {s.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Transfer Qty
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="6"
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full h-9 px-3 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center justify-center gap-1 cursor-pointer border-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Configured Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-soft uppercase tracking-wider">
                Transfer Manifest ({items.length} SKUs · {totalQuantity} Total Units)
              </span>
              <span className="text-[10.5px] font-semibold text-[#5A2EA6]">
                Chain of Custody Enforced
              </span>
            </div>

            <div className="rounded-2xl border border-purple-100 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-3 pl-4">Product Name &amp; SKU</th>
                    <th className="p-3">Batch Number</th>
                    <th className="p-3 text-center">Transfer Qty</th>
                    <th className="p-3 text-center">Source Avail.</th>
                    <th className="p-3 text-center">Target Stock</th>
                    <th className="p-3 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/20">
                      <td className="p-3 pl-4">
                        <strong className="font-bold text-ink block">{it.productName}</strong>
                        <span className="text-[10px] font-mono text-soft">{it.sku}</span>
                      </td>
                      <td className="p-3 font-mono text-xs font-semibold text-slate-700">
                        {it.batchNumber}
                      </td>
                      <td className="p-3 text-center font-bold text-[#5A2EA6] bg-purple-50/40">
                        {it.quantity} {it.unit}
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-700">
                        {it.sourceAvailableQty} {it.unit}
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-500">
                        {it.destinationCurrentQty} {it.unit}
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="w-6 h-6 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 grid place-items-center cursor-pointer border-0 bg-transparent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">
                Origin: <strong>{sourceBranch.name}</strong> ➔ Target:{' '}
                <strong>{destinationBranch.name}</strong>
              </span>
              <span className="font-bold text-[#5A2EA6]">
                Total: {totalQuantity} Units Scheduled
              </span>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <span className="text-xs text-muted font-medium">
            Requires Head Office Brand Owner / Inventory Director sign-off prior to dispatch.
          </span>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>

            <button
              type="button"
              onClick={handleSubmit}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md shadow-[#5A2EA6]/25 transition-all flex items-center gap-2 cursor-pointer border-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Submit Transfer Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
