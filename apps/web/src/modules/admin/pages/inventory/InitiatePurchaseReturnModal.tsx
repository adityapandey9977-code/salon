import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowDownLeft,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileText,
  Layers,
  Package,
  RotateCcw,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';
import type { PurchaseReturn, Supplier } from './ProcurementTab';

export interface InitiatePurchaseReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchaseReturn: PurchaseReturn) => void;
  suppliers: Supplier[];
}

const COMMON_RETURN_REASONS = [
  'Damaged in Transit / Leaking Packaging',
  'Near Expiry Spoilage (< 30 Days)',
  'Expired Stock Received',
  'Incorrect Batch / Formulation Spec',
  'Product Quality / Chemical Inconsistency',
  'Excess Supply / Order Cancellation',
];

const PRESET_PRODUCTS = [
  { name: "L'Oréal Majirel Colour Tube - 6.13", defaultUnit: 'Tubes', defaultCost: 340 },
  { name: "L'Oréal Absolut Repair Shampoo (500ml)", defaultUnit: 'Bottles', defaultCost: 850 },
  { name: 'Moroccanoil Treatment Original (100ml)', defaultUnit: 'Bottles', defaultCost: 2200 },
  { name: 'O3+ Seaweed Facial Kit Pods', defaultUnit: 'Pods', defaultCost: 950 },
  { name: "L'Oréal Oxydant Developer 20 Vol 1000ml", defaultUnit: 'Bottles', defaultCost: 450 },
  { name: 'Organic Argan Hair Mask (500ml)', defaultUnit: 'Tubs', defaultCost: 1100 },
];

export function InitiatePurchaseReturnModal({
  isOpen,
  onClose,
  onSave,
  suppliers,
}: InitiatePurchaseReturnModalProps) {
  const [supplierName, setSupplierName] = useState(
    suppliers[0]?.name || "L'Oréal India Distribution Hub",
  );
  const [branchName, setBranchName] = useState(
    masterBranches[0]?.name || 'Atelier Indrapuri Flagship',
  );
  const [productName, setProductName] = useState(PRESET_PRODUCTS[0].name);
  const [quantity, setQuantity] = useState('6');
  const [unit, setUnit] = useState('Tubes');
  const [unitCost, setUnitCost] = useState('340');
  const [batchNumber, setBatchNumber] = useState('LOT-2026-891');
  const [reason, setReason] = useState(COMMON_RETURN_REASONS[0]);
  const [customNotes, setCustomNotes] = useState('');
  const [settlementMode, setSettlementMode] = useState<
    'Credit Note' | 'Bank Refund' | 'Replacement'
  >('Credit Note');
  const [debitNoteRef, setDebitNoteRef] = useState(`DN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [deductStockImmediately, setDeductStockImmediately] = useState(true);

  const handleProductSelect = (pName: string) => {
    setProductName(pName);
    const found = PRESET_PRODUCTS.find((p) => p.name === pName);
    if (found) {
      setUnit(found.defaultUnit);
      setUnitCost(found.defaultCost.toString());
    }
  };

  const qtyNum = Number.parseFloat(quantity) || 0;
  const costNum = Number.parseFloat(unitCost) || 0;
  const subtotal = qtyNum * costNum;
  const gstAmount = subtotal * 0.18;
  const totalDebitAmount = subtotal + gstAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || qtyNum <= 0) {
      alert('Please enter a valid product name and return quantity.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const formattedAmount = `₹${Math.round(totalDebitAmount).toLocaleString('en-IN')}`;

    const newReturn: PurchaseReturn = {
      id: `RET-PUR-${Math.floor(100 + Math.random() * 900)}`,
      supplierName,
      branchName,
      productName: productName.trim(),
      quantity: qtyNum,
      unit,
      reason: customNotes.trim() ? `${reason} (${customNotes.trim()})` : reason,
      amount: formattedAmount,
      returnDate: todayStr,
      status: 'Processed',
      creditNoteRef: debitNoteRef.trim() || `CN-${supplierName.slice(0, 3).toUpperCase()}-2026-901`,
    };

    onSave(newReturn);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#2D1552]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#5A2EA6]/25 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#5A2EA6]/15 flex items-start justify-between gap-4 bg-gradient-to-r from-[#FAF7FF] via-[#F5EFFF] to-[#FAF7FF] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A2EA6] text-white flex items-center justify-center shadow-md shadow-[#5A2EA6]/20 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                PURCHASE RETURN &amp; DEBIT NOTE
              </span>
              <h2 className="font-serif font-bold text-ink text-lg sm:text-xl leading-tight mt-0.5">
                Initiate Vendor Return &amp; Debit Note
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
          {/* 1. Origin & Supplier Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100">
            <div className="sm:col-span-6">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Target Vendor / Supplier *
              </label>
              <select
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Returning Salon Branch *
              </label>
              <select
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {masterBranches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Returned Product & Batch Details */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-[11px] font-bold text-ink uppercase tracking-wider">
                Product SKU &amp; Batch Identification
              </span>
              <span className="text-[10px] text-muted">FIFO Valuation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Product Item Name *
                </label>
                <input
                  type="text"
                  list="returnPresetList"
                  required
                  placeholder="e.g. L'Oréal Majirel Colour Tube..."
                  value={productName}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
                <datalist id="returnPresetList">
                  {PRESET_PRODUCTS.map((p, i) => (
                    <option key={i} value={p.name} />
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-6">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Manufacturing / Lot Batch No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LOT-LOR-2601"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Return Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="6"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Packaging Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Tubes">Tubes</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Tubs">Tubs</option>
                  <option value="Pods">Pods</option>
                  <option value="pcs">pcs</option>
                  <option value="Sachet">Sachet</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Unit Purchase Cost (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="340"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>
          </div>

          {/* 3. Reason for Return */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
              Reason for Return &amp; Defect Classification
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_RETURN_REASONS.map((r) => {
                const isSelected = reason === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={cn(
                      'p-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border cursor-pointer',
                      isSelected
                        ? 'bg-[#F8F5FF] text-[#5A2EA6] border-[#5A2EA6]/40 shadow-2xs font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200',
                    )}
                  >
                    <span className="truncate pr-1">{r}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                Defect Notes &amp; Inspector Comments
              </label>
              <textarea
                rows={2}
                placeholder="Provide batch details, damage condition, or transport carrier reference..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>
          </div>

          {/* 4. Debit Note & Settlement Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-6">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Settlement Preference
              </label>
              <select
                value={settlementMode}
                onChange={(e) => setSettlementMode(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="Credit Note">Vendor Credit Note (Deduct from next invoice)</option>
                <option value="Bank Refund">Direct Bank Refund / Account Credit</option>
                <option value="Replacement">Free Replacement Batch Dispatch</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Debit Note / Credit Reference Code
              </label>
              <input
                type="text"
                required
                placeholder="DN-2026-0881"
                value={debitNoteRef}
                onChange={(e) => setDebitNoteRef(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>

            <div className="sm:col-span-12">
              <label className="flex items-center gap-2 p-3 bg-purple-50/50 rounded-xl border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deductStockImmediately}
                  onChange={(e) => setDeductStockImmediately(e.target.checked)}
                  className="rounded text-[#5A2EA6] focus:ring-[#5A2EA6] w-4 h-4"
                />
                <span className="text-xs font-semibold text-ink">
                  Immediately debit and remove {qtyNum} {unit} from {branchName} physical stock
                  ledger
                </span>
              </label>
            </div>
          </div>

          {/* 5. Financial Debit Summary */}
          <div className="p-4 bg-[#FAF7FF] rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-soft block">
                Financial Reversal Posting
              </span>
              <strong className="text-ink text-xs block">{supplierName}</strong>
              <span className="text-[11px] text-purple-900 font-medium">
                {settlementMode} linked to Finance Ledger
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] text-muted block uppercase font-bold">Base Cost</span>
                <strong className="text-slate-800 text-sm font-semibold">
                  ₹{subtotal.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted block uppercase font-bold">GST (18%)</span>
                <strong className="text-slate-800 text-sm font-semibold">
                  ₹{gstAmount.toFixed(2)}
                </strong>
              </div>
              <div className="text-right pl-3 border-l border-purple-200">
                <span className="text-[10px] text-[#5A2EA6] block uppercase font-extrabold">
                  Debit Note Amount
                </span>
                <strong className="text-xl font-serif font-bold text-[#5A2EA6]">
                  ₹{Math.round(totalDebitAmount).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <span className="text-xs text-muted font-medium">
            Debit Note will automatically sync with the Finance Accounts Payable desk.
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
              <span>Issue Debit Note &amp; Process Return</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
