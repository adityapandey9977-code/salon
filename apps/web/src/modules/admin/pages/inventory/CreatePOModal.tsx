import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  Info,
  Layers,
  Package,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';
import type { PurchaseOrder, Supplier } from './ProcurementTab';

export interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (po: PurchaseOrder) => void;
  suppliers: Supplier[];
  defaultSupplierId?: string;
}

interface POLineItemInput {
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitCost: number;
  taxPct: number;
}

const COMMON_ORDER_SKUS = [
  {
    name: "L'Oréal Absolut Repair Shampoo (500ml)",
    sku: 'SKU-LOR-SHP-500',
    unitCost: 850,
    unit: 'Bottle',
  },
  {
    name: "L'Oréal Majirel Colour Tube - 6.13",
    sku: 'SKU-LOR-MAJ-613',
    unitCost: 340,
    unit: 'Tube',
  },
  {
    name: "L'Oréal Oxydant Developer 20 Vol 1000ml",
    sku: 'SKU-LOR-OXY-20V',
    unitCost: 450,
    unit: 'Bottle',
  },
  { name: 'O3+ Seaweed Facial Kit Pods', sku: 'SKU-O3-FAC-SW', unitCost: 950, unit: 'Pod' },
  {
    name: 'Moroccanoil Treatment Original (100ml)',
    sku: 'SKU-MOR-TRT-100',
    unitCost: 2200,
    unit: 'Bottle',
  },
  { name: 'Organic Argan Hair Mask (500ml)', sku: 'SKU-ARG-MSK-500', unitCost: 1100, unit: 'Tub' },
  {
    name: 'Kashmir Lavender Massage Oil (1L)',
    sku: 'SKU-LAV-OIL-1L',
    unitCost: 1400,
    unit: 'Bottle',
  },
];

export function CreatePOModal({
  isOpen,
  onClose,
  onSave,
  suppliers,
  defaultSupplierId,
}: CreatePOModalProps) {
  const [supplierId, setSupplierId] = useState(defaultSupplierId || suppliers[0]?.id || '');
  const [branchId, setBranchId] = useState('BR-01');
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('Urgent stock replenishment for weekend salon traffic.');

  // Line items
  const [items, setItems] = useState<POLineItemInput[]>([
    {
      productName: "L'Oréal Absolut Repair Shampoo (500ml)",
      sku: 'SKU-LOR-SHP-500',
      quantity: 24,
      unit: 'Bottle',
      unitCost: 850,
      taxPct: 18,
    },
    {
      productName: "L'Oréal Majirel Colour Tube - 6.13",
      sku: 'SKU-LOR-MAJ-613',
      quantity: 30,
      unit: 'Tube',
      unitCost: 340,
      taxPct: 18,
    },
  ]);

  // Quick add line item state
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('10');
  const [newItemCost, setNewItemCost] = useState('500');
  const [newItemUnit, setNewItemUnit] = useState('Bottle');

  const selectedSupplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];
  const selectedBranch = masterBranches.find((b) => b.id === branchId) || masterBranches[0];

  const handleSelectPredefinedSku = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const skuObj = COMMON_ORDER_SKUS.find((s) => s.sku === e.target.value);
    if (skuObj) {
      setNewItemName(skuObj.name);
      setNewItemCost(skuObj.unitCost.toString());
      setNewItemUnit(skuObj.unit);
    }
  };

  const handleAddLineItem = () => {
    if (!newItemName.trim() || !newItemQty || isNaN(Number(newItemQty))) {
      alert('Please enter a valid product name and quantity.');
      return;
    }

    const matchedSku =
      COMMON_ORDER_SKUS.find((s) => s.name === newItemName.trim())?.sku ||
      `SKU-${newItemName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newItem: POLineItemInput = {
      productName: newItemName.trim(),
      sku: matchedSku,
      quantity: Number.parseInt(newItemQty, 10) || 1,
      unit: newItemUnit,
      unitCost: Number.parseFloat(newItemCost) || 100,
      taxPct: 18,
    };

    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemQty('10');
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const subtotalNumber = items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
  const taxNumber = subtotalNumber * 0.18;
  const totalValueNumber = subtotalNumber + taxNumber;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) {
      alert('Please select a supplier.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one line item to the Purchase Order.');
      return;
    }

    const poNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const expDateStr = new Date(expectedDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newPO: PurchaseOrder = {
      id: `PO-${Date.now().toString().slice(-4)}`,
      poNumber,
      supplierName: selectedSupplier.name,
      supplierCode: selectedSupplier.code,
      branchName: selectedBranch.name,
      branchId: selectedBranch.id,
      orderDate: todayStr,
      expectedDate: expDateStr,
      totalItems: items.length,
      subtotal: `₹${subtotalNumber.toLocaleString('en-IN')}`,
      discount: '₹0',
      tax: `₹${taxNumber.toLocaleString('en-IN')}`,
      totalValue: `₹${totalValueNumber.toLocaleString('en-IN')}`,
      status: 'Pending Approval',
      createdBy: 'Head Office Admin',
      receivingProgress: {
        orderedQty: items.reduce((acc, it) => acc + it.quantity, 0),
        receivedQty: 0,
        pendingQty: items.reduce((acc, it) => acc + it.quantity, 0),
      },
      items: items.map((it) => ({
        productName: it.productName,
        sku: it.sku,
        quantity: it.quantity,
        unit: it.unit,
        unitCost: `₹${it.unitCost}`,
        taxPct: `${it.taxPct}%`,
        totalAmount: `₹${(it.quantity * it.unitCost * 1.18).toLocaleString('en-IN')}`,
        receivedQty: 0,
      })),
      timeline: [
        {
          stage: 'PO Draft Created',
          timestamp: 'Just Now',
          user: 'Head Office Admin',
          isDone: true,
        },
        {
          stage: 'Pending Head Office Approval',
          timestamp: 'In Review',
          user: 'Head Office Admin',
          isDone: false,
        },
        {
          stage: 'Vendor Dispatch & In-Transit',
          timestamp: 'Pending',
          user: selectedSupplier.name,
          isDone: false,
        },
        {
          stage: 'Branch GRN Receiving & Inspection',
          timestamp: 'Pending',
          user: selectedBranch.name,
          isDone: false,
        },
      ],
    };

    onSave(newPO);
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                  PROCUREMENT ORDER WORKFLOW
                </span>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                  Maker-Checker Enabled
                </span>
              </div>
              <h2 className="font-serif font-bold text-ink text-lg sm:text-xl leading-tight mt-0.5">
                Generate Multi-Branch Purchase Order (PO)
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
          {/* Order Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100">
            <div className="sm:col-span-5">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Select Approved Vendor *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) · {s.paymentTerms.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Destination Salon Branch *
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {masterBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Expected Delivery Date *
              </label>
              <input
                type="date"
                required
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>
          </div>

          {/* Quick Add Product Item */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
              Add Line Items to Replenishment PO
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Select Preset SKU or Type Name
                </label>
                <input
                  type="text"
                  list="orderPresetSkuList"
                  placeholder="e.g. L'Oréal Absolut Repair..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                />
                <datalist id="orderPresetSkuList">
                  {COMMON_ORDER_SKUS.map((s, i) => (
                    <option key={i} value={s.name} />
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Order Qty *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="10"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  UOM Unit
                </label>
                <select
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="w-full h-9 px-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Bottle">Bottle</option>
                  <option value="Tube">Tube</option>
                  <option value="Tub">Tub</option>
                  <option value="Pod">Pod</option>
                  <option value="Sachet">Sachet</option>
                  <option value="pcs">pcs</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Cost Price (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="850"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddLineItem}
                  className="w-full h-9 px-3 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center justify-center gap-1 cursor-pointer border-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-soft uppercase tracking-wider">
                Purchase Order Line Items ({items.length} SKUs)
              </span>
              <span className="text-[10.5px] font-semibold text-muted">18% GST auto-computed</span>
            </div>

            <div className="rounded-2xl border border-purple-100 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-3 pl-4">Product Name &amp; SKU</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Unit Cost</th>
                    <th className="p-3 text-right">GST (18%)</th>
                    <th className="p-3 text-right">Total (Incl GST)</th>
                    <th className="p-3 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {items.map((it, idx) => {
                    const lineSubtotal = it.quantity * it.unitCost;
                    const lineTax = lineSubtotal * 0.18;
                    const lineTotal = lineSubtotal + lineTax;
                    return (
                      <tr key={idx} className="hover:bg-purple-50/20">
                        <td className="p-3 pl-4">
                          <strong className="font-bold text-ink block">{it.productName}</strong>
                          <span className="text-[10px] font-mono text-soft">{it.sku}</span>
                        </td>
                        <td className="p-3 text-center font-bold text-[#5A2EA6] bg-purple-50/30">
                          {it.quantity} {it.unit}
                        </td>
                        <td className="p-3 text-right font-semibold text-slate-700">
                          ₹{it.unitCost}
                        </td>
                        <td className="p-3 text-right font-medium text-slate-500">
                          ₹{lineTax.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-bold text-ink">
                          ₹{lineTotal.toLocaleString('en-IN')}
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Card */}
            <div className="p-4 bg-[#FAF7FF] rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-soft block">
                  Selected Vendor Billing Terms
                </span>
                <strong className="text-ink text-xs block">{selectedSupplier.name}</strong>
                <span className="text-[11px] text-purple-900 font-medium">
                  {selectedSupplier.paymentTerms}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] text-muted block uppercase font-bold">Subtotal</span>
                  <strong className="text-slate-800 text-sm font-semibold">
                    ₹{subtotalNumber.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted block uppercase font-bold">
                    GST (18%)
                  </span>
                  <strong className="text-slate-800 text-sm font-semibold">
                    ₹{taxNumber.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="text-right pl-3 border-l border-purple-200">
                  <span className="text-[10px] text-[#5A2EA6] block uppercase font-extrabold">
                    Total PO Value
                  </span>
                  <strong className="text-xl font-serif font-bold text-[#5A2EA6]">
                    ₹{totalValueNumber.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <span className="text-xs text-muted font-medium">
            PO will require Head Office Director approval before vendor dispatch.
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
              <span>Submit Purchase Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
