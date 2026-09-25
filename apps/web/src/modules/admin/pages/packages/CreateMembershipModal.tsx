import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Crown,
  DollarSign,
  Gift,
  Layers,
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
import { masterBranches } from '../locations/AllBranchesTab';

export interface MembershipBenefitItem {
  name: string;
  type:
    | 'Percentage Discount'
    | 'Fixed Discount'
    | 'Complimentary Service'
    | 'Special Price'
    | 'Priority Access';
  value: string;
  applicableScope: string;
  usageLimit: string;
}

export interface FullMembershipRecord {
  id: string;
  name: string;
  code: string;
  tier: 'Silver Tier' | 'Gold Tier' | 'Platinum Tier' | 'Royal Black Tier';
  description: string;
  price: number;
  durationMonths: number;
  renewalRule: 'Auto-Renew with Discount' | 'Manual Renewal Required' | 'Grace Period (15 Days)';
  branchAvailability: string[];
  benefits: MembershipBenefitItem[];
  activeMembers: number;
  expiringMembers: number;
  renewedCount: number;
  status: 'Active' | 'Draft' | 'Inactive' | 'Expired';
}

interface CreateMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mem: FullMembershipRecord) => void;
  editData?: FullMembershipRecord | null;
}

export function CreateMembershipModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: CreateMembershipModalProps) {
  const { toast } = useToast();

  const [name, setName] = useState(editData?.name || '');
  const [code, setCode] = useState(editData?.code || 'MEM-ROYAL-01');
  const [tier, setTier] = useState<FullMembershipRecord['tier']>(
    editData?.tier || 'Royal Black Tier',
  );
  const [description, setDescription] = useState(
    editData?.description ||
      'Exclusive bespoke concierge membership with VIP treatment suites, high-percentage service discounts, and complimentary spa sessions.',
  );
  const [price, setPrice] = useState(editData?.price || 29999);
  const [durationMonths, setDurationMonths] = useState(editData?.durationMonths || 12);
  const [renewalRule, setRenewalRule] = useState<FullMembershipRecord['renewalRule']>(
    editData?.renewalRule || 'Grace Period (15 Days)',
  );
  const [status, setStatus] = useState<FullMembershipRecord['status']>(
    editData?.status || 'Active',
  );
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    editData?.branchAvailability || ['All'],
  );

  // Benefits
  const [benefits, setBenefits] = useState<MembershipBenefitItem[]>(
    editData?.benefits || [
      {
        name: '20% Service Discount',
        type: 'Percentage Discount',
        value: '20% Off',
        applicableScope: 'All Hair, Skin & Spa Treatments',
        usageLimit: 'Unlimited',
      },
      {
        name: '15% Retail Product Discount',
        type: 'Percentage Discount',
        value: '15% Off',
        applicableScope: 'All Luxury Retail Care Brands',
        usageLimit: 'Unlimited',
      },
      {
        name: '2 Complimentary Spa Rituals',
        type: 'Complimentary Service',
        value: '2 Sessions (₹8,400 Val)',
        applicableScope: 'Royal Balinese Massage',
        usageLimit: '2 Per Year',
      },
      {
        name: 'VIP Suite & Priority Booking',
        type: 'Priority Access',
        value: 'Instant Access',
        applicableScope: 'All Flagship Lounges',
        usageLimit: 'Unlimited',
      },
    ],
  );

  const [newBenefitName, setNewBenefitName] = useState('');
  const [newBenefitType, setNewBenefitType] =
    useState<MembershipBenefitItem['type']>('Percentage Discount');
  const [newBenefitValue, setNewBenefitValue] = useState('10% Off');
  const [newBenefitScope, setNewBenefitScope] = useState('All Services');
  const [newBenefitLimit, setNewBenefitLimit] = useState('Unlimited');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setCode(editData.code || 'MEM-ROYAL-01');
      setTier(editData.tier || 'Royal Black Tier');
      setDescription(editData.description || '');
      setPrice(editData.price || 29999);
      setDurationMonths(editData.durationMonths || 12);
      setRenewalRule(editData.renewalRule || 'Grace Period (15 Days)');
      setStatus(editData.status || 'Active');
      setSelectedBranches(editData.branchAvailability || ['All']);
      setBenefits(editData.benefits || []);
    } else if (isOpen) {
      setName('');
      setCode(`MEM-VIP-0${Math.floor(1 + Math.random() * 9)}`);
      setTier('Royal Black Tier');
      setDescription(
        'Exclusive bespoke concierge membership with VIP treatment suites, high-percentage service discounts, and complimentary spa sessions.',
      );
      setPrice(29999);
      setDurationMonths(12);
      setRenewalRule('Grace Period (15 Days)');
      setStatus('Active');
      setSelectedBranches(['All']);
      setBenefits([
        {
          name: '20% Service Discount',
          type: 'Percentage Discount',
          value: '20% Off',
          applicableScope: 'All Hair, Skin & Spa Treatments',
          usageLimit: 'Unlimited',
        },
      ]);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleAddBenefit = () => {
    if (!newBenefitName) return;
    setBenefits([
      ...benefits,
      {
        name: newBenefitName,
        type: newBenefitType,
        value: newBenefitValue,
        applicableScope: newBenefitScope,
        usageLimit: newBenefitLimit,
      },
    ]);
    setNewBenefitName('');
    toast(`Added benefit "${newBenefitName}" to membership.`);
  };

  const handleRemoveBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!name || benefits.length === 0) {
      toast('Please provide a membership name and at least one benefit rule.');
      return;
    }

    try {
      setSubmitting(true);
      const { membershipsApi } = await import('@/shared/api/memberships.api');

      const payload = {
        name,
        description,
        price: Number(price),
        billingPeriod: Number(durationMonths) === 1 ? 'MONTHLY' : 'ANNUAL',
        discountPercentage: 15,
        perksText: benefits.map((b) => `${b.name} (${b.value})`).join(', '),
        isActive: status === 'Active',
      };

      let res: any;
      if (editData?.id && !editData.id.startsWith('MEM-00')) {
        res = await membershipsApi.updateMembership(editData.id, payload);
      } else {
        res = await membershipsApi.createMembership(payload);
      }

      const created: FullMembershipRecord = {
        id: res.id || editData?.id || `MEM-00${Math.floor(100 + Math.random() * 900)}`,
        name: res.name || name,
        code: editData?.code || `MEM-VIP-0${Math.floor(1 + Math.random() * 9)}`,
        tier,
        description: res.description || description,
        price: res.price || Number(price),
        durationMonths: Number(durationMonths),
        renewalRule,
        branchAvailability: selectedBranches,
        benefits,
        activeMembers: res.membersCount || editData?.activeMembers || 0,
        expiringMembers: editData?.expiringMembers || 0,
        renewedCount: editData?.renewedCount || 0,
        status: res.isActive ? 'Active' : 'Inactive',
      };

      onSuccess(created);
      onClose();
      toast(`Membership Tier "${created.name}" ${editData?.id ? 'updated' : 'created'} successfully.`);
    } catch (err: any) {
      console.error('Failed to create membership via API', err);
      toast(err?.response?.data?.message || 'Failed to save membership plan.');
      const fallback: FullMembershipRecord = {
        id: editData?.id || `MEM-00${Math.floor(100 + Math.random() * 900)}`,
        name,
        code,
        tier,
        description,
        price: Number(price),
        durationMonths: Number(durationMonths),
        renewalRule,
        branchAvailability: selectedBranches,
        benefits,
        activeMembers: editData?.activeMembers || 0,
        expiringMembers: editData?.expiringMembers || 0,
        renewedCount: editData?.renewedCount || 0,
        status,
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
              {editData ? 'Edit Membership Tier' : 'Configure Membership Plan'}
            </h3>
            <p className="text-[11.5px] text-muted mt-0.5">
              Define membership tiers, annual subscription fees, multi-perk benefits, and renewal
              terms.
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
          {/* 1. Basic Plan Data */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
              Membership Definition
            </h4>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Membership Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Black VIP Club"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Membership Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Silver Tier">Silver Tier</option>
                  <option value="Gold Tier">Gold Tier</option>
                  <option value="Platinum Tier">Platinum Tier</option>
                  <option value="Royal Black Tier">Royal Black Tier</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Annual Fee (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink font-serif focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Validity Duration
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Renewal Terms
                </label>
                <select
                  value={renewalRule}
                  onChange={(e) => setRenewalRule(e.target.value as any)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Grace Period (15 Days)">Grace Period (15 Days)</option>
                  <option value="Auto-Renew with Discount">Auto-Renew with 10% Off</option>
                  <option value="Manual Renewal Required">Manual Renewal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                Tier Description &amp; Privileges
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>
          </div>

          {/* 2. Membership Benefits Configuration */}
          <div className="space-y-3 pt-3 border-t border-purple-50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
                Configured Tier Privileges &amp; Benefits ({benefits.length})
              </h4>
            </div>

            {/* Benefit List */}
            <div className="space-y-2">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-purple-100 text-[#5A2EA6] font-bold text-xs grid place-items-center">
                      {idx + 1}
                    </span>
                    <div>
                      <strong className="text-ink text-xs block">{b.name}</strong>
                      <span className="text-[10px] text-muted">
                        {b.applicableScope} · {b.usageLimit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {b.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer border-0 bg-transparent p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Benefit Form */}
            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-dashed border-purple-200 space-y-2">
              <span className="text-[11px] font-bold text-purple-900 block">
                + Add Benefit Privilege
              </span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Benefit Title (e.g. 15% Retail Off)"
                  value={newBenefitName}
                  onChange={(e) => setNewBenefitName(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs text-ink"
                />
                <select
                  value={newBenefitType}
                  onChange={(e) => setNewBenefitType(e.target.value as any)}
                  className="h-9 px-2.5 rounded-lg border border-purple-100 bg-white text-xs text-ink"
                >
                  <option value="Percentage Discount">Percentage Discount</option>
                  <option value="Fixed Discount">Fixed Discount</option>
                  <option value="Complimentary Service">Complimentary Service</option>
                  <option value="Special Price">Special Price</option>
                  <option value="Priority Access">Priority Access</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Value (e.g. 15%)"
                    value={newBenefitValue}
                    onChange={(e) => setNewBenefitValue(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs text-ink flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddBenefit}
                    className="h-9 px-3 rounded-lg bg-[#5A2EA6] text-white text-xs font-bold"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Branch Availability */}
          <div className="space-y-2 pt-2 border-t border-purple-50">
            <h4 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
              Branch Privilege Eligibility
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

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
            >
              {editData ? 'Update Tier' : 'Launch Membership Tier'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default CreateMembershipModal;
