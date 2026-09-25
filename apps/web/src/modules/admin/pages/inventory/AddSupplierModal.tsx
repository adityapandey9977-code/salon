import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Tag,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';
import type { Supplier } from './ProcurementTab';

export interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  initialSupplier?: Supplier | null;
}

const STANDARD_PAYMENT_TERMS = [
  'Net 30 Days (Direct Bank Transfer)',
  'Net 15 Days (Advance 20%)',
  'Net 45 Days (Credit Line)',
  '100% Advance Payment on Dispatch',
  '50% Advance + 50% on Delivery (COD)',
  'Immediate Bank Transfer upon GRN Verification',
];

export function AddSupplierModal({
  isOpen,
  onClose,
  onSave,
  initialSupplier,
}: AddSupplierModalProps) {
  const isEditMode = Boolean(initialSupplier);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [paymentTerms, setPaymentTerms] = useState(STANDARD_PAYMENT_TERMS[0]);
  const [status, setStatus] = useState<'Active' | 'Under Review' | 'Inactive'>('Active');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [creditLimit, setCreditLimit] = useState('500000');
  const [leadTimeDays, setLeadTimeDays] = useState('3');

  useEffect(() => {
    if (initialSupplier) {
      setName(initialSupplier.name);
      setCode(initialSupplier.code);
      setContactPerson(initialSupplier.contactPerson);
      setPhone(initialSupplier.phone);
      setEmail(initialSupplier.email);
      setAddress(initialSupplier.address);
      setGstin(initialSupplier.gstin);
      setPaymentTerms(initialSupplier.paymentTerms);
      setStatus(initialSupplier.status);
      setSelectedBranches(initialSupplier.branchesServed || []);
    } else {
      setName('');
      setCode(`SUP-${Math.floor(100 + Math.random() * 900)}`);
      setContactPerson('');
      setPhone('+91 ');
      setEmail('');
      setAddress('');
      setGstin('23AABC');
      setPaymentTerms(STANDARD_PAYMENT_TERMS[0]);
      setStatus('Active');
      setSelectedBranches(masterBranches.map((b) => b.name));
    }
  }, [initialSupplier, isOpen]);

  const handleAutoGenerateCode = () => {
    const prefix =
      name
        .replace(/[^a-zA-Z]/g, '')
        .slice(0, 3)
        .toUpperCase() || 'SUP';
    const rand = Math.floor(10 + Math.random() * 90);
    setCode(`SUP-${prefix}-${rand}`);
  };

  const handleToggleBranch = (bName: string) => {
    setSelectedBranches((prev) =>
      prev.includes(bName) ? prev.filter((b) => b !== bName) : [...prev, bName],
    );
  };

  const handleSelectAllBranches = () => {
    if (selectedBranches.length === masterBranches.length) {
      setSelectedBranches([]);
    } else {
      setSelectedBranches(masterBranches.map((b) => b.name));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactPerson.trim() || !phone.trim() || !email.trim()) {
      alert('Please fill all mandatory supplier contact and legal fields.');
      return;
    }

    const effectiveSupplier: Supplier = {
      id: initialSupplier?.id || `SUP-${Date.now().toString().slice(-4)}`,
      code: code.trim() || `SUP-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim() || 'Warehouse Address, Industrial Area, MP',
      gstin: gstin.toUpperCase().trim() || '23AABCL1234F1ZX',
      categories: initialSupplier?.categories || ['All Products & Consumables'],
      branchesServed:
        selectedBranches.length > 0 ? selectedBranches : masterBranches.map((b) => b.name),
      activePOs: initialSupplier?.activePOs || 0,
      totalPurchaseValue: initialSupplier?.totalPurchaseValue || '₹0',
      lastPurchaseDate: initialSupplier?.lastPurchaseDate || 'Just Added',
      paymentTerms,
      status,
    };

    onSave(effectiveSupplier);
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
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                PROCUREMENT &amp; VENDOR MASTER
              </span>
              <h2 className="font-serif font-bold text-ink text-lg sm:text-xl leading-tight mt-0.5">
                {isEditMode
                  ? `Edit Vendor: ${initialSupplier?.name}`
                  : 'Register New Vendor / Supplier'}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Legal Entity & Tax Identity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  1
                </span>
                <span>Vendor Legal Entity &amp; GST Identification</span>
              </h3>
              <span className="text-[10.5px] text-muted font-medium">B2B Compliance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              <div className="sm:col-span-8">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Vendor / Supplier Business Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. L’Oréal India Distribution Hub Private Limited"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                    Vendor Code *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateCode}
                    className="text-[9.5px] font-bold text-[#5A2EA6] hover:underline flex items-center gap-0.5 cursor-pointer border-0 bg-transparent"
                  >
                    <Zap className="w-2.5 h-2.5 text-[#5A2EA6]" />
                    <span>Auto-Gen</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUP-LOR-01"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  GSTIN (Indian GST Number) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  placeholder="23AABCL1234F1ZX"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Vendor Partner Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Supplier['status'])}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Active">Active (Approved for PO Generation)</option>
                  <option value="Under Review">Under Review (Pending Documentation)</option>
                  <option value="Inactive">Inactive (Suspended)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Key Account Contact */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  2
                </span>
                <span>Contact Representative &amp; Order Desk</span>
              </h3>
              <span className="text-[10.5px] text-muted font-medium">
                Communication Coordinates
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Key Contact Person / Account Mgr *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Joshi (National KAM)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Primary Phone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98260 11450"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Official PO Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="b2b.orders@supplier.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-12">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Warehouse / Registered Dispatch Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Plot 44, Industrial Area, Sector 3, Pithampur, MP - 454775"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>
          </div>

          {/* 3. Commercial Terms & Credit Line */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  3
                </span>
                <span>Commercial Terms &amp; Settlement Rules</span>
              </h3>
              <span className="text-[10.5px] text-[#5A2EA6] font-bold">Finance Linked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              <div className="sm:col-span-6">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Payment Terms Slab *
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  {STANDARD_PAYMENT_TERMS.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Approved Credit Limit (₹)
                </label>
                <input
                  type="number"
                  placeholder="500000"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Lead Time (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="3"
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>
          </div>

          {/* 4. Serviced Branches */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 text-[#5A2EA6] text-[11px] grid place-items-center font-extrabold">
                  4
                </span>
                <span>
                  Serviced Salon Branches ({selectedBranches.length} of {masterBranches.length}{' '}
                  Selected)
                </span>
              </h3>
              <button
                type="button"
                onClick={handleSelectAllBranches}
                className="text-[10.5px] font-bold text-[#5A2EA6] hover:underline cursor-pointer border-0 bg-transparent"
              >
                {selectedBranches.length === masterBranches.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {masterBranches.map((b) => {
                const isSelected = selectedBranches.includes(b.name);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleToggleBranch(b.name)}
                    className={cn(
                      'p-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border cursor-pointer',
                      isSelected
                        ? 'bg-[#F8F5FF] text-[#5A2EA6] border-[#5A2EA6]/40 shadow-2xs font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-purple-200',
                    )}
                  >
                    <div className="truncate pr-1">
                      <strong className="block truncate text-xs">{b.name}</strong>
                      <span className="text-[10px] text-muted block">{b.city}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <span className="text-xs text-muted font-medium">
            Authorized Vendor Record for Multi-Branch Procurement
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
              <span>{isEditMode ? 'Update Vendor Profile' : 'Save & Register Vendor'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
