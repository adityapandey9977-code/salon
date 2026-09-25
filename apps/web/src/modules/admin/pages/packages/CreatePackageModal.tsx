import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Layers,
  Package,
  Plus,
  Scissors,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { masterServices } from '../catalogue/ServicesTab';
import { masterBranches } from '../locations/AllBranchesTab';

export interface PackageServiceItem {
  serviceName: string;
  category: string;
  sessions: number;
  individualPrice: number;
}

export interface FullPackageRecord {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  services: PackageServiceItem[];
  totalIndividualValue: number;
  sellingPrice: number;
  savingsAmount: number;
  savingsPercentage: number;
  validityMonths: number;
  branchAvailability: string[]; // 'All' or specific branch names
  totalSold: number;
  activeCount: number;
  redeemedCount: number;
  status: 'Active' | 'Draft' | 'Inactive' | 'Expired';
  isTransferable: boolean;
  isRefundable: boolean;
  allowPartialRedemption: boolean;
}

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pkg: FullPackageRecord) => void;
  editData?: FullPackageRecord | null;
}

export function CreatePackageModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: CreatePackageModalProps) {
  const { toast } = useToast();

  const [name, setName] = useState(editData?.name || '');
  const [code, setCode] = useState(editData?.code || `PKG-${Date.now().toString(36).toUpperCase()}`);
  const [category, setCategory] = useState(editData?.category || 'Facial & Skin Aesthetics');
  const [description, setDescription] = useState(
    editData?.description ||
      'Complete bridal rejuvenation package with clinical Hydra-Facial and hair therapy.',
  );
  const [validityMonths, setValidityMonths] = useState(editData?.validityMonths || 6);
  const [status, setStatus] = useState<FullPackageRecord['status']>(editData?.status || 'Active');

  const [isTransferable, setIsTransferable] = useState(editData?.isTransferable ?? true);
  const [isRefundable, setIsRefundable] = useState(editData?.isRefundable ?? false);
  const [allowPartialRedemption, setAllowPartialRedemption] = useState(
    editData?.allowPartialRedemption ?? true,
  );

  // Multi-service items
  const [services, setServices] = useState<PackageServiceItem[]>(
    editData?.services || [
      {
        serviceName: '7-Step Medical Hydra-Facial',
        category: 'Facial & Skin Aesthetics',
        sessions: 3,
        individualPrice: 4500,
      },
      {
        serviceName: 'Signature Hair Spa & Blowout',
        category: 'Hair Art & Color',
        sessions: 2,
        individualPrice: 2800,
      },
      {
        serviceName: 'Aromatherapy Back De-stress Massage',
        category: 'Spa & Wellness',
        sessions: 1,
        individualPrice: 2200,
      },
    ],
  );

  const [selectedServiceId, setSelectedServiceId] = useState(masterServices[0]?.id || 'custom');
  const [newServiceName, setNewServiceName] = useState(
    masterServices[0]?.name || '7-Step Medical Hydra-Facial Rejuvenation',
  );
  const [newServiceCategory, setNewServiceCategory] = useState(
    masterServices[0]?.category || 'Skin & Organic Therapy',
  );
  const [newSessions, setNewSessions] = useState(1);
  const [newPrice, setNewPrice] = useState(masterServices[0]?.price || 3800);

  const handleServiceSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedServiceId(val);
    if (val === 'custom') {
      setNewServiceName('');
      setNewServiceCategory('Facial & Skin Aesthetics');
      setNewPrice(2500);
    } else {
      const found = masterServices.find((s) => s.id === val);
      if (found) {
        setNewServiceName(found.name);
        setNewServiceCategory(found.category);
        setNewPrice(found.price);
      }
    }
  };

  // Pricing
  const totalIndividualValue = services.reduce((acc, s) => acc + s.sessions * s.individualPrice, 0);
  const [sellingPrice, setSellingPrice] = useState(editData?.sellingPrice || 14999);

  const savingsAmount = Math.max(0, totalIndividualValue - sellingPrice);
  const savingsPercentage =
    totalIndividualValue > 0 ? Math.round((savingsAmount / totalIndividualValue) * 100) : 0;

  // Branch Availability
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    editData?.branchAvailability || ['All'],
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setCode(editData.code || `PKG-${Date.now().toString(36).toUpperCase()}`);
      setCategory(editData.category || 'Facial & Skin Aesthetics');
      setDescription(editData.description || '');
      setValidityMonths(editData.validityMonths || 6);
      setStatus(editData.status || 'Active');
      setIsTransferable(editData.isTransferable ?? true);
      setIsRefundable(editData.isRefundable ?? false);
      setAllowPartialRedemption(editData.allowPartialRedemption ?? true);
      setServices(editData.services && editData.services.length > 0 ? editData.services : [
        {
          serviceName: '7-Step Medical Hydra-Facial',
          category: 'Facial & Skin Aesthetics',
          sessions: 3,
          individualPrice: 4500,
        },
      ]);
      setSellingPrice(editData.sellingPrice || 14999);
      setSelectedBranches(editData.branchAvailability || ['All']);
    } else if (isOpen) {
      setName('');
      setCode(`PKG-${Date.now().toString(36).toUpperCase()}`);
      setCategory('Facial & Skin Aesthetics');
      setDescription('Complete bridal rejuvenation package with clinical Hydra-Facial and hair therapy.');
      setValidityMonths(6);
      setStatus('Active');
      setIsTransferable(true);
      setIsRefundable(false);
      setAllowPartialRedemption(true);
      setServices([
        {
          serviceName: '7-Step Medical Hydra-Facial',
          category: 'Facial & Skin Aesthetics',
          sessions: 3,
          individualPrice: 4500,
        },
        {
          serviceName: 'Signature Hair Spa & Blowout',
          category: 'Hair Art & Color',
          sessions: 2,
          individualPrice: 2800,
        },
        {
          serviceName: 'Aromatherapy Back De-stress Massage',
          category: 'Spa & Wellness',
          sessions: 1,
          individualPrice: 2200,
        },
      ]);
      setSellingPrice(14999);
      setSelectedBranches(['All']);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleAddServiceItem = () => {
    if (!newServiceName) {
      toast('Please select or specify a service name.');
      return;
    }
    setServices([
      ...services,
      {
        serviceName: newServiceName,
        category: newServiceCategory,
        sessions: Math.max(1, Number(newSessions) || 1),
        individualPrice: Number(newPrice) || 0,
      },
    ]);
    // Reset sessions
    setNewSessions(1);
    toast(`Added "${newServiceName}" (${newSessions} sessions) to package structure.`);
  };

  const handleRemoveServiceItem = (idx: number) => {
    setServices(services.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!name || services.length === 0) {
      toast('Please provide a package name and at least one service protocol.');
      return;
    }

    try {
      setSubmitting(true);
      const { packagesApi } = await import('@/shared/api/packages.api');

      const payload = {
        code: editData ? code : (code ? `${code}-${Date.now().toString(36).substring(3, 7).toUpperCase()}` : `PKG-${Date.now().toString(36).toUpperCase()}`),
        name,
        description,
        price: Number(sellingPrice),
        validityDays: Number(validityMonths) * 30 || 365,
        isShared: selectedBranches.includes('All') || selectedBranches.length > 1,
        isActive: status === 'Active',
        includedServicesText: services.map((s) => `${s.serviceName} (${s.sessions}s)`).join(', '),
        items: [],
      };

      let res: any;
      if (editData?.id && !editData.id.startsWith('PKG-00')) {
        res = await packagesApi.updatePackage(editData.id, payload);
      } else {
        res = await packagesApi.createPackage(payload);
      }

      const created: FullPackageRecord = {
        id: res.id || editData?.id || `PKG-00${Math.floor(100 + Math.random() * 900)}`,
        name: res.name || name,
        code: res.code || code,
        category,
        description: res.description || description,
        services,
        totalIndividualValue,
        sellingPrice: res.price || Number(sellingPrice),
        savingsAmount,
        savingsPercentage,
        validityMonths: Number(validityMonths),
        branchAvailability: selectedBranches,
        totalSold: res.salesCount || 0,
        activeCount: 0,
        redeemedCount: 0,
        status: res.isActive ? 'Active' : 'Inactive',
        isTransferable,
        isRefundable,
        allowPartialRedemption,
      };

      onSuccess(created);
      onClose();
      toast(`Service Package "${created.name}" ${editData ? 'updated' : 'created'} successfully.`);
    } catch (err: any) {
      console.error('Failed to save package via API', err);
      toast(err?.response?.data?.message || 'Failed to save package via API.');

      const fallback: FullPackageRecord = {
        id: editData?.id || `PKG-00${Math.floor(100 + Math.random() * 900)}`,
        name,
        code,
        category,
        description,
        services,
        totalIndividualValue,
        sellingPrice: Number(sellingPrice),
        savingsAmount,
        savingsPercentage,
        validityMonths: Number(validityMonths),
        branchAvailability: selectedBranches,
        totalSold: editData?.totalSold || 0,
        activeCount: editData?.activeCount || 0,
        redeemedCount: editData?.redeemedCount || 0,
        status,
        isTransferable,
        isRefundable,
        allowPartialRedemption,
      };
      onSuccess(fallback);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };


  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 text-xs">
        {/* Header Bar */}
        <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
              {editData ? 'Edit Service Package' : 'Create Multi-Service Package'}
            </h3>
            <p className="text-[11.5px] text-muted mt-0.5">
              Bundle services, session counts, promotional savings rates, validity windows, and
              branch redemption rules.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto custom-scroll flex-1 space-y-5"
        >
          {/* 1. Basic Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
              Basic Package Information
            </h4>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Bridal Radiance Cure"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Package Code (Auto-generated)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  readOnly
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-gray-100 text-xs font-semibold text-slate-500 font-mono focus:outline-none cursor-not-allowed opacity-80"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Facial & Skin Aesthetics">Facial & Skin Aesthetics</option>
                  <option value="Hair Art & Transformation">Hair Art & Transformation</option>
                  <option value="Bridal & Event Special">Bridal & Event Special</option>
                  <option value="Spa, Holistic & Wellness">Spa, Holistic & Wellness</option>
                  <option value="Men's Executive Grooming">Men's Executive Grooming</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Validity Duration
                </label>
                <select
                  value={validityMonths}
                  onChange={(e) => setValidityMonths(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  <option value={3}>3 Months Validity</option>
                  <option value={6}>6 Months Validity</option>
                  <option value={12}>12 Months Validity (Annual)</option>
                  <option value={24}>24 Months Validity</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                Description &amp; Highlights
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>
          </div>

          {/* 2. Package Services Multi-Session Configuration */}
          <div className="space-y-3 pt-3 border-t border-purple-50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
                Services &amp; Session Allocations ({services.length} Protocols)
              </h4>
              <span className="text-xs text-soft font-semibold">
                Total Nominal Value:{' '}
                <strong className="text-ink">
                  ₹{totalIndividualValue.toLocaleString('en-IN')}
                </strong>
              </span>
            </div>

            {/* Existing Services List */}
            <div className="space-y-2">
              {services.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-purple-100 text-[#5A2EA6] font-bold text-xs grid place-items-center">
                      {idx + 1}
                    </span>
                    <div>
                      <strong className="text-ink text-xs block">{s.serviceName}</strong>
                      <span className="text-[10px] text-muted">
                        {s.category} · {s.sessions} Sessions @ ₹{s.individualPrice}/session
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className="text-ink font-serif text-xs">
                      ₹{(s.sessions * s.individualPrice).toLocaleString('en-IN')}
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleRemoveServiceItem(idx)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer border-0 bg-transparent p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Service Dropdown Row */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-dashed border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                  + Add Service Protocol to Package Bundle
                </span>
                <span className="text-[10px] font-medium text-muted">
                  Select from active salon catalogue or define custom protocol
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                {/* Service Dropdown */}
                <div
                  className={cn(selectedServiceId === 'custom' ? 'sm:col-span-5' : 'sm:col-span-6')}
                >
                  <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                    Select Catalog Service *
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={handleServiceSelectChange}
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] shadow-2xs"
                  >
                    <optgroup label="Salon Catalogue Services">
                      {masterServices.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} (₹{srv.price.toLocaleString('en-IN')} · {srv.category})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other">
                      <option value="custom">+ Custom / Non-Catalogue Service...</option>
                    </optgroup>
                  </select>
                </div>

                {/* If Custom, show custom service name input */}
                {selectedServiceId === 'custom' && (
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                      Custom Service Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter custom service name..."
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                )}

                {/* Sessions Count */}
                <div
                  className={cn(selectedServiceId === 'custom' ? 'sm:col-span-2' : 'sm:col-span-2')}
                >
                  <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                    Sessions *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newSessions}
                    onChange={(e) => setNewSessions(Math.max(1, Number(e.target.value)))}
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink text-center focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* Unit Price */}
                <div
                  className={cn(selectedServiceId === 'custom' ? 'sm:col-span-2' : 'sm:col-span-2')}
                >
                  <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                    Price/Session (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* Add Button */}
                <div
                  className={cn(
                    selectedServiceId === 'custom'
                      ? 'sm:col-span-12 flex justify-end'
                      : 'sm:col-span-2',
                  )}
                >
                  <button
                    type="button"
                    onClick={handleAddServiceItem}
                    className="w-full h-10 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Pricing & Savings Calculations */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-3">
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Package Commercial Pricing &amp; Savings Rate
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">
                  Total Nominal Value
                </span>
                <strong className="text-ink font-serif text-base block">
                  ₹{totalIndividualValue.toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Package Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg border border-purple-200 bg-white font-serif font-bold text-sm text-ink focus:outline-none"
                />
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">
                  Client Savings
                </span>
                <strong className="text-emerald-700 font-serif text-base block">
                  ₹{savingsAmount.toLocaleString('en-IN')} ({savingsPercentage}%)
                </strong>
              </div>
            </div>
          </div>

          {/* 4. Branch Availability */}
          <div className="space-y-2 pt-2 border-t border-purple-50">
            <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
              Redemption Branch Eligibility
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2.5 bg-[#FCFAFF] rounded-xl border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBranches.includes('All')}
                  onChange={(e) => setSelectedBranches(e.target.checked ? ['All'] : [])}
                  className="rounded text-[#5A2EA6]"
                />
                <span className="font-bold text-ink text-xs">All Brand Branches</span>
              </label>
              {masterBranches.map((b) => (
                <label
                  key={b.id}
                  className="flex items-center gap-2 p-2.5 bg-[#FCFAFF] rounded-xl border border-purple-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes('All') || selectedBranches.includes(b.name)}
                    onChange={() => {}}
                    disabled={selectedBranches.includes('All')}
                    className="rounded text-[#5A2EA6]"
                  />
                  <span className="text-ink text-xs truncate">{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Package Policy Rules */}
          <div className="space-y-2 pt-2 border-t border-purple-50">
            <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
              Package Operational Rules &amp; Policies
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTransferable}
                  onChange={(e) => setIsTransferable(e.target.checked)}
                  className="rounded text-[#5A2EA6]"
                />
                <span className="font-semibold text-ink">Family Transferable</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowPartialRedemption}
                  onChange={(e) => setAllowPartialRedemption(e.target.checked)}
                  className="rounded text-[#5A2EA6]"
                />
                <span className="font-semibold text-ink">Partial Redemption</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRefundable}
                  onChange={(e) => setIsRefundable(e.target.checked)}
                  className="rounded text-[#5A2EA6]"
                />
                <span className="font-semibold text-ink">Pro-rata Refundable</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white shadow-md transition-all cursor-pointer border-0"
            >
              {editData ? 'Update Package' : 'Publish Service Package'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default CreatePackageModal;
