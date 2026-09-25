import React, { useState, useEffect } from 'react';
import { BaseModal } from './BaseModal';
import { useSuperAdminStore, SubscriptionPlan } from '../context/SuperAdminContext';
import { Button, cn } from '@salon-spa-saas/ui';
import {
  ShieldCheck,
  Building2,
  Users,
  Globe,
  Zap,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Tag,
  Star,
  Layers,
  DollarSign,
  Crown,
  Eye,
  Sliders,
  Check,
  Handshake,
} from 'lucide-react';

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editPlan?: SubscriptionPlan | null;
}

const COMMON_ENTITLEMENT_SUGGESTIONS = [
  'Conflict-free diary & GST POS invoicing',
  'WhatsApp booking links & SMS reminders',
  'Basic stocktake & consumable inventory recipes',
  'Stylist daily target & tip performance tracker',
  'Standard 9am-9pm email operator support',
  'Multi-branch central client history & shared wallet',
  'Formula intelligence [P-02] & allergy safety flags [P-01]',
  'Local-language WhatsApp booking assistant [P-06]',
  'Service recipe BOM inventory & stock variance alerts',
  'Custom commission rules & tiered staff incentives',
  'Priority 24/7 technical operator support',
  'Franchise royalty settlement & compliance panel',
  'Resource-aware smart slot suggestions [P-03]',
  'Package liability & breakage forecasting [P-04]',
  'Custom ERP (Tally/Zoho) & dedicated API sync',
  'Dedicated SLA uptime guarantee (99.99%)',
  'Dedicated Account Manager & onboarding',
];

export const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({
  isOpen,
  onClose,
  editPlan,
}) => {
  const { addSubscriptionPlan, updateSubscriptionPlan } = useSuperAdminStore();
  const [activeTab, setActiveTab] = useState<'identity' | 'quotas' | 'entitlements' | 'telemetry'>('identity');

  const [formData, setFormData] = useState({
    name: editPlan?.name || '',
    numericPrice: editPlan?.numericPrice || 4500,
    billingCycle: editPlan?.billingCycle || 'per branch / month',
    tierBadge: editPlan?.tierBadge || 'Subscription Tier',
    tagline: editPlan?.tagline || 'For growing salon chains and wellness brands',
    isBranchesUnlimited: editPlan?.branchesQuota?.toLowerCase().includes('unlimited') || (editPlan?.maxBranches ?? 0) >= 999,
    branchesCount: editPlan?.maxBranches && editPlan.maxBranches < 999 ? editPlan.maxBranches : 5,
    isStaffUnlimited: editPlan?.staffQuota?.toLowerCase().includes('unlimited') || (editPlan?.maxStaff ?? 0) >= 999,
    staffCount: editPlan?.maxStaff && editPlan.maxStaff < 999 ? editPlan.maxStaff : 20,
    isApiCapability: editPlan?.hasCustomApi || (!!editPlan?.apiQuota && !editPlan.apiQuota.toLowerCase().includes('no api') && !editPlan.apiQuota.toLowerCase().includes('disabled')),
    apiQuota: editPlan?.apiQuota || (editPlan?.hasCustomApi ? 'Full REST API Access' : 'Basic Webhook APIs'),
    isDomainBranding: editPlan?.hasWhiteLabel || (!!editPlan?.domainQuota && (editPlan.domainQuota.toLowerCase().includes('custom') || editPlan.domainQuota.toLowerCase().includes('white'))),
    domainQuota: editPlan?.domainQuota || (editPlan?.hasWhiteLabel ? 'Custom CNAME Domain' : 'Standard Salon Domain'),
    themeVariant: editPlan?.themeVariant || 'popular',
    hasFranchise: editPlan?.hasFranchise ?? false,
    isFranchiseUnlimited: editPlan?.franchiseQuota?.toLowerCase().includes('unlimited') ?? false,
    franchiseCount: editPlan?.maxFranchises && editPlan.maxFranchises < 999 ? editPlan.maxFranchises : 5,
    entitlements: editPlan?.entitlements || [
      'Conflict-free diary & GST POS invoicing',
      'WhatsApp booking links & SMS reminders',
      'Basic stocktake & consumable inventory recipes',
      'Stylist daily target & tip performance tracker',
      'Standard 9am-9pm email operator support',
    ],
    activeSubscribers: editPlan?.activeSubscribers || '0 Tenants',
    rolloutPercentage: editPlan?.rolloutPercentage ?? 100,
    rolloutStrategy: editPlan?.rolloutStrategy || 'Immediate GA',
  });

  const [newEntitlementText, setNewEntitlementText] = useState('');

  useEffect(() => {
    if (editPlan) {
      const isBranchesUnlim = editPlan.branchesQuota?.toLowerCase().includes('unlimited') || editPlan.maxBranches >= 999;
      const isStaffUnlim = editPlan.staffQuota?.toLowerCase().includes('unlimited') || editPlan.maxStaff >= 999;
      const isFranchiseUnlim = editPlan.franchiseQuota?.toLowerCase().includes('unlimited') ?? false;

      const hasApi = editPlan.hasCustomApi || (!!editPlan.apiQuota && !editPlan.apiQuota.toLowerCase().includes('no api') && !editPlan.apiQuota.toLowerCase().includes('disabled'));
      const hasDomain = editPlan.hasWhiteLabel || (!!editPlan.domainQuota && (editPlan.domainQuota.toLowerCase().includes('custom') || editPlan.domainQuota.toLowerCase().includes('white') || editPlan.domainQuota.toLowerCase().includes('cname')));

      setFormData({
        name: editPlan.name,
        numericPrice: editPlan.numericPrice,
        billingCycle: editPlan.billingCycle || 'per branch / month',
        tierBadge: editPlan.tierBadge || 'Subscription Tier',
        tagline: editPlan.tagline || '',
        isBranchesUnlimited: isBranchesUnlim,
        branchesCount: editPlan.maxBranches < 999 ? editPlan.maxBranches : 10,
        isStaffUnlimited: isStaffUnlim,
        staffCount: editPlan.maxStaff < 999 ? editPlan.maxStaff : 50,
        isApiCapability: hasApi,
        apiQuota: editPlan.apiQuota || (hasApi ? 'Full REST API Access' : 'Basic Webhook APIs'),
        isDomainBranding: hasDomain,
        domainQuota: editPlan.domainQuota || (hasDomain ? 'Custom CNAME Domain' : 'Standard Salon Domain'),
        themeVariant: editPlan.themeVariant || (editPlan.id === 'plan-3' ? 'enterprise' : editPlan.id === 'plan-2' ? 'popular' : 'light'),
        hasFranchise: editPlan.hasFranchise ?? (editPlan.id === 'plan-3'),
        isFranchiseUnlimited: isFranchiseUnlim,
        franchiseCount: editPlan.maxFranchises && editPlan.maxFranchises < 999 ? editPlan.maxFranchises : 5,
        entitlements: editPlan.entitlements && editPlan.entitlements.length > 0
          ? editPlan.entitlements
          : [
            'Conflict-free diary & GST POS invoicing',
            'WhatsApp booking links & SMS reminders',
            'Basic stocktake & consumable inventory recipes',
          ],
        activeSubscribers: editPlan.activeSubscribers || '0 Tenants',
        rolloutPercentage: editPlan.rolloutPercentage ?? 100,
        rolloutStrategy: editPlan.rolloutStrategy || 'Immediate GA',
      });
    } else {
      setFormData({
        name: '',
        numericPrice: 4500,
        billingCycle: 'per branch / month',
        tierBadge: 'Subscription Tier',
        tagline: 'Ideal for independent salons, single spas, and boutique studios',
        isBranchesUnlimited: false,
        branchesCount: 3,
        isStaffUnlimited: false,
        staffCount: 15,
        isApiCapability: true,
        apiQuota: 'Basic Webhook APIs',
        isDomainBranding: false,
        domainQuota: 'Standard Salon Domain',
        themeVariant: 'popular',
        hasFranchise: false,
        isFranchiseUnlimited: false,
        franchiseCount: 5,
        entitlements: [
          'Conflict-free diary & GST POS invoicing',
          'WhatsApp booking links & SMS reminders',
          'Basic stocktake & consumable inventory recipes',
          'Stylist daily target & tip performance tracker',
          'Standard 9am-9pm email operator support',
        ],
        activeSubscribers: '0 Tenants',
        rolloutPercentage: 100,
        rolloutStrategy: 'Immediate GA',
      });
    }
    setActiveTab('identity');
    setNewEntitlementText('');
  }, [editPlan, isOpen]);

  const handleAddEntitlement = (textToAdd?: string) => {
    const text = (textToAdd || newEntitlementText).trim();
    if (!text) return;
    if (!formData.entitlements.includes(text)) {
      setFormData((prev) => ({
        ...prev,
        entitlements: [...prev.entitlements, text],
      }));
    }
    if (!textToAdd) setNewEntitlementText('');
  };

  const handleRemoveEntitlement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      entitlements: prev.entitlements.filter((_, i) => i !== index),
    }));
  };

  const computedBranchesQuota = formData.isBranchesUnlimited
    ? 'Unlimited Branches'
    : `${formData.branchesCount} ${formData.branchesCount === 1 ? 'Branch' : 'Branches'}`;

  const computedStaffQuota = formData.isStaffUnlimited
    ? 'Unlimited Staff Seats'
    : `${formData.staffCount} Staff Seats`;

  const computedFranchiseQuota = formData.hasFranchise
    ? formData.isFranchiseUnlimited
      ? 'Unlimited Franchises'
      : `${formData.franchiseCount} ${formData.franchiseCount === 1 ? 'Franchise' : 'Franchises'} Allowed`
    : 'COCO Only (No Franchises)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const apiQuotaFinal = formData.isApiCapability ? (formData.apiQuota || 'Basic Webhook APIs') : 'No External API Access';
    const domainQuotaFinal = formData.isDomainBranding ? (formData.domainQuota || 'Custom CNAME Domain') : 'Standard Salon Domain';

    const submissionPayload: Partial<SubscriptionPlan> = {
      name: formData.name,
      numericPrice: formData.numericPrice,
      price: `₹${formData.numericPrice.toLocaleString('en-IN')} /mo`,
      billingCycle: formData.billingCycle,
      tierBadge: formData.tierBadge,
      tagline: formData.tagline,
      branchesQuota: computedBranchesQuota,
      maxBranches: formData.isBranchesUnlimited ? 999 : formData.branchesCount,
      staffQuota: computedStaffQuota,
      maxStaff: formData.isStaffUnlimited ? 999 : formData.staffCount,
      apiQuota: apiQuotaFinal,
      hasCustomApi: formData.isApiCapability && (apiQuotaFinal.toLowerCase().includes('rest') || apiQuotaFinal.toLowerCase().includes('sync') || apiQuotaFinal.toLowerCase().includes('dedicated')),
      domainQuota: domainQuotaFinal,
      hasWhiteLabel: formData.isDomainBranding && (domainQuotaFinal.toLowerCase().includes('cname') || domainQuotaFinal.toLowerCase().includes('white-label') || domainQuotaFinal.toLowerCase().includes('custom')),
      themeVariant: formData.themeVariant,
      hasFranchise: formData.hasFranchise,
      franchiseQuota: computedFranchiseQuota,
      maxFranchises: formData.hasFranchise ? (formData.isFranchiseUnlimited ? 999 : formData.franchiseCount) : 0,
      entitlements: formData.entitlements,
      features: formData.entitlements.join(', '),
      activeSubscribers: formData.activeSubscribers,
      rolloutPercentage: formData.rolloutPercentage,
      rolloutStrategy: `${formData.rolloutStrategy} (${formData.rolloutPercentage}%)`,
    };

    if (editPlan) {
      updateSubscriptionPlan(editPlan.id, submissionPayload);
    } else {
      addSubscriptionPlan(submissionPayload);
    }

    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editPlan ? `Edit Subscription Tier: ${editPlan.name}` : 'Create Subscription Plan Tier'}
      subtitle="Configure platform subscription pricing, feature entitlements, capacity quotas, and rollout strategies"
      icon={<ShieldCheck className="w-5 h-5" />}
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#5A2EA6]/15 pb-2 gap-2 sm:gap-4 overflow-x-auto custom-scroll">
            {[
              { id: 'identity', label: '1. Tier & Pricing', icon: Tag },
              { id: 'quotas', label: '2. Capacity Quotas', icon: Layers },
              { id: 'entitlements', label: '3. Entitlements', icon: ShieldCheck },
              { id: 'telemetry', label: '4. Rollout', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-1.5 sm:gap-2 pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer bg-transparent border-0 shrink-0',
                    isActive
                      ? 'border-[#5A2EA6] text-[#5A2EA6]'
                      : 'border-transparent text-muted hover:text-ink',
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* TAB 1: TIER & PRICING */}
            {activeTab === 'identity' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Plan Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                      Subscription Plan Tier Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Starter Tier Plan, Premium Tier Plan, Enterprise Tier Plan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  {/* Tier Badge / Tag */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                      Tier Header Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SUBSCRIPTION TIER or ★ MOST POPULAR"
                      value={formData.tierBadge}
                      onChange={(e) => setFormData({ ...formData, tierBadge: e.target.value })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                    {/* Badge Quick Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['SUBSCRIPTION TIER', '★ MOST POPULAR', 'ENTERPRISE TIER', 'RECOMMENDED'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, tierBadge: b })}
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer border',
                            formData.tierBadge === b
                              ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                              : 'bg-white text-muted border-[#5A2EA6]/20 hover:bg-[#5A2EA6]/5',
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Price */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                      Monthly Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted font-bold text-xs">₹</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="100"
                        placeholder="2500"
                        value={formData.numericPrice}
                        onChange={(e) => setFormData({ ...formData, numericPrice: Number(e.target.value) })}
                        className="w-full h-[40px] pl-7 pr-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-bold text-[#5A2EA6] focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                    {/* Price Quick Presets */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[2500, 6500, 12500, 19999].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({ ...formData, numericPrice: val })}
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer border',
                            formData.numericPrice === val
                              ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                              : 'bg-white text-muted border-[#5A2EA6]/20 hover:bg-[#5A2EA6]/5',
                          )}
                        >
                          ₹{val.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Billing Cadence Subtitle Dropdown */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5 flex items-center justify-between">
                      <span>Billing Cycle Subtitle *</span>
                      <span className="text-[10px] text-muted font-normal">Select cadence dropdown</span>
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                    >
                      <option value="per branch / month">per branch / month (Standard Monthly Per Branch)</option>
                      <option value="per salon / month">per salon / month (Flat Salon Monthly)</option>
                      <option value="flat monthly billing">flat monthly billing (Fixed Single Monthly)</option>
                      <option value="billed annually">billed annually (Annual Pre-Paid Plan)</option>
                      <option value="per branch / quarterly">per branch / quarterly (Quarterly Cadence)</option>
                      <option value="per franchise / month">per franchise / month (Franchise Network Monthly)</option>
                      <option value="custom enterprise billing">custom enterprise billing (Enterprise SLA)</option>
                    </select>
                  </div>

                  {/* Tagline / Value Proposition */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                      Tier Tagline / Target Audience *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Ideal for independent salons, single spas, and boutique studios"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  {/* Card Visual Style / Theme */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-2">
                      Card Visual Theme
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'light', label: 'Classic Light', desc: 'Soft grey-violet gradient' },
                        { id: 'popular', label: 'Most Popular', desc: 'Vibrant purple & ring glow' },
                        { id: 'enterprise', label: 'Enterprise Dark', desc: 'Obsidian luxury black/purple' },
                      ].map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, themeVariant: th.id as any })}
                          className={cn(
                            'p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between',
                            formData.themeVariant === th.id
                              ? 'border-[#5A2EA6] bg-[#5A2EA6]/10 ring-2 ring-[#5A2EA6]/30'
                              : 'border-[#5A2EA6]/15 bg-white hover:bg-[#FAF8FD]',
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink">{th.label}</span>
                            {formData.themeVariant === th.id && (
                              <Check className="w-3.5 h-3.5 text-[#5A2EA6]" />
                            )}
                          </div>
                          <span className="text-[10px] text-muted mt-1 leading-tight">{th.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CAPACITY QUOTAS (The 4 Quota Badges) */}
            {activeTab === 'quotas' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/15 text-xs text-[#4a3b50] leading-relaxed">
                  Configure the <strong>4 core capacity quotas</strong> displayed on each subscriber plan card: Authorized Branches, Staff Seats, API Integration tier, and Custom Domain entitlement.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Branches Quota */}
                  <div className="p-4 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-[#7C3AED]" /> Branches Quota
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isBranchesUnlimited}
                          onChange={(e) => setFormData({ ...formData, isBranchesUnlimited: e.target.checked })}
                          className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                        />
                        Unlimited
                      </label>
                    </div>

                    {!formData.isBranchesUnlimited ? (
                      <div>
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={formData.branchesCount}
                          onChange={(e) => setFormData({ ...formData, branchesCount: Number(e.target.value) })}
                          className="w-full h-[38px] px-3 rounded-lg border border-[#5A2EA6]/20 bg-white text-xs font-bold text-ink"
                        />
                        <div className="flex gap-2 mt-2">
                          {[1, 2, 5, 10, 25].map((cnt) => (
                            <button
                              key={cnt}
                              type="button"
                              onClick={() => setFormData({ ...formData, branchesCount: cnt })}
                              className="text-[10.5px] px-2 py-0.5 rounded border border-[#5A2EA6]/20 bg-white hover:bg-[#5A2EA6]/10 text-muted"
                            >
                              {cnt} Br
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unlimited Branch Network
                      </div>
                    )}
                    <span className="text-[10.5px] text-muted block">
                      Card will display: <strong>{computedBranchesQuota}</strong>
                    </span>
                  </div>

                  {/* Staff Seats Quota */}
                  <div className="p-4 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#EC4899]" /> Staff Seats Quota
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isStaffUnlimited}
                          onChange={(e) => setFormData({ ...formData, isStaffUnlimited: e.target.checked })}
                          className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                        />
                        Unlimited
                      </label>
                    </div>

                    {!formData.isStaffUnlimited ? (
                      <div>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={formData.staffCount}
                          onChange={(e) => setFormData({ ...formData, staffCount: Number(e.target.value) })}
                          className="w-full h-[38px] px-3 rounded-lg border border-[#5A2EA6]/20 bg-white text-xs font-bold text-ink"
                        />
                        <div className="flex gap-2 mt-2">
                          {[5, 10, 20, 50, 100].map((cnt) => (
                            <button
                              key={cnt}
                              type="button"
                              onClick={() => setFormData({ ...formData, staffCount: cnt })}
                              className="text-[10.5px] px-2 py-0.5 rounded border border-[#5A2EA6]/20 bg-white hover:bg-[#5A2EA6]/10 text-muted"
                            >
                              {cnt} Seats
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unlimited Staff Accounts
                      </div>
                    )}
                    <span className="text-[10.5px] text-muted block">
                      Card will display: <strong>{computedStaffQuota}</strong>
                    </span>
                  </div>

                  {/* APIs Capability Box */}
                  <div className="p-4 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-blue-600" /> is APIs Capability Box
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isApiCapability}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              isApiCapability: isChecked,
                              apiQuota: isChecked
                                ? (prev.apiQuota === 'No External API Access' ? 'Basic Webhook APIs' : prev.apiQuota)
                                : 'No External API Access',
                            }));
                          }}
                          className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                        />
                        <span>Enabled</span>
                      </label>
                    </div>

                    {formData.isApiCapability ? (
                      <div className="space-y-2.5 animate-in fade-in duration-150">
                        <div>
                          <label className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-1">
                            API Capability Tier
                          </label>
                          <select
                            value={formData.apiQuota}
                            onChange={(e) => setFormData({ ...formData, apiQuota: e.target.value })}
                            className="w-full h-[38px] px-3 rounded-lg border border-[#5A2EA6]/20 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                          >
                            <option value="Basic Webhook APIs">Basic Webhook APIs (Webhooks & Event Triggers)</option>
                            <option value="Full REST API Access">Full REST API Access (Public CRUD & Endpoints)</option>
                            <option value="Custom ERP & Accounting Sync">Custom ERP & Accounting Sync (Tally, Zoho Books, SAP)</option>
                            <option value="Dedicated Enterprise API Keys">Dedicated Enterprise API Keys (5,000 req/min Rate Limit)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-1">
                            Card Display Summary Label
                          </label>
                          <input
                            type="text"
                            value={formData.apiQuota}
                            onChange={(e) => setFormData({ ...formData, apiQuota: e.target.value })}
                            className="w-full h-[34px] px-3 rounded-lg border border-[#5A2EA6]/20 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                        No External API Access (Disabled for this Tier)
                      </div>
                    )}

                    <span className="text-[10.5px] text-muted block">
                      Card will display: <strong>{formData.isApiCapability ? formData.apiQuota : 'No External API Access'}</strong>
                    </span>
                  </div>

                  {/* Domain & Branding Box */}
                  <div className="p-4 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-emerald-600" /> is Domain & Branding Box
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isDomainBranding}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              isDomainBranding: isChecked,
                              domainQuota: isChecked
                                ? (prev.domainQuota === 'Standard Salon Domain' ? 'Custom CNAME Domain' : prev.domainQuota)
                                : 'Standard Salon Domain',
                            }));
                          }}
                          className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                        />
                        <span>Enabled</span>
                      </label>
                    </div>

                    {formData.isDomainBranding ? (
                      <div className="space-y-2.5 animate-in fade-in duration-150">
                        <div>
                          <label className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-1">
                            Domain & Branding Tier
                          </label>
                          <select
                            value={formData.domainQuota}
                            onChange={(e) => setFormData({ ...formData, domainQuota: e.target.value })}
                            className="w-full h-[38px] px-3 rounded-lg border border-[#5A2EA6]/20 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                          >
                            <option value="Custom CNAME Domain">Custom CNAME Domain (booking.yourbrand.com)</option>
                            <option value="Full White-Label Branding">Full White-Label Branding (Remove SaaS Badges)</option>
                            <option value="Custom CNAME & Full White-Label">Custom CNAME & Full White-Label (Dedicated Branding)</option>
                            <option value="Dedicated SSL & Custom Domain">Dedicated SSL & Custom Domain (Enterprise DNS Routing)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-1">
                            Card Display Summary Label
                          </label>
                          <input
                            type="text"
                            value={formData.domainQuota}
                            onChange={(e) => setFormData({ ...formData, domainQuota: e.target.value })}
                            className="w-full h-[34px] px-3 rounded-lg border border-[#5A2EA6]/20 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                        Standard Salon Subdomain (brand.digiflexsalon.com)
                      </div>
                    )}

                    <span className="text-[10.5px] text-muted block">
                      Card will display: <strong>{formData.isDomainBranding ? formData.domainQuota : 'Standard Salon Domain'}</strong>
                    </span>
                  </div>
                </div>

                {/* Franchise Network & Partner Portal Section (Approach A) */}
                <div
                  className={cn(
                    'p-4 rounded-xl border transition-all space-y-3 mt-4',
                    formData.hasFranchise
                      ? 'bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-purple-50/70 border-[#5A2EA6]/30 shadow-xs'
                      : 'bg-[#FCFAFF] border-[#5A2EA6]/15',
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 mt-0.5',
                          formData.hasFranchise ? 'bg-[#5A2EA6] text-white' : 'bg-[#5A2EA6]/10 text-[#5A2EA6]',
                        )}
                      >
                        <Handshake className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-xs font-bold text-ink">Franchise Network & Partner Portal (`/franchise`)</strong>
                          <span
                            className={cn(
                              'text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border',
                              formData.hasFranchise
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200',
                            )}
                          >
                            {formData.hasFranchise ? 'Enabled on Tier' : 'Disabled (COCO Only)'}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                          When enabled, tenant brand owners can create legal franchise partners (FOFO/FOCO), assign franchise branches, automate royalty calculations, and provision partner logins.
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer shrink-0 self-start sm:self-center bg-white px-3 py-1.5 rounded-lg border border-[#5A2EA6]/20 shadow-2xs hover:bg-[#5A2EA6]/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.hasFranchise}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setFormData((prev) => {
                            const nextEntitlements =
                              isChecked &&
                                !prev.entitlements.includes('Franchise royalty settlement & compliance panel')
                                ? [...prev.entitlements, 'Franchise royalty settlement & compliance panel']
                                : prev.entitlements;
                            return {
                              ...prev,
                              hasFranchise: isChecked,
                              entitlements: nextEntitlements,
                            };
                          });
                        }}
                        className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                      />
                      <span>Enable Franchise Service</span>
                    </label>
                  </div>

                  {formData.hasFranchise ? (
                    <div className="pt-3 border-t border-[#5A2EA6]/15 space-y-3 animate-in fade-in duration-200">
                      <div className="p-3 bg-white rounded-xl border border-[#5A2EA6]/20 space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                            <span>Select Number of Franchises Allowed:</span>
                            <span className="text-[10px] text-muted font-normal">(Max legal franchise outlets allowed for this tier)</span>
                          </label>

                          <div className="flex items-center gap-2">
                            {!formData.isFranchiseUnlimited ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min="1"
                                  max="1000"
                                  value={formData.franchiseCount}
                                  onChange={(e) =>
                                    setFormData({ ...formData, franchiseCount: Math.max(1, Number(e.target.value)) })
                                  }
                                  className="w-[85px] h-[36px] px-3 rounded-lg border border-[#5A2EA6]/30 bg-[#FCFAFF] text-xs font-bold text-ink text-center focus:outline-none focus:border-[#5A2EA6]"
                                />
                                <span className="text-xs font-semibold text-muted">Franchises</span>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-lg">
                                Unlimited Active
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Selection Presets */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-soft uppercase tracking-wider">Quick Presets:</span>
                          {[1, 3, 5, 10, 20, 50].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  franchiseCount: num,
                                  isFranchiseUnlimited: false,
                                })
                              }
                              className={cn(
                                'text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all border cursor-pointer',
                                !formData.isFranchiseUnlimited && formData.franchiseCount === num
                                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                                  : 'bg-white text-muted border-[#5A2EA6]/20 hover:bg-[#5A2EA6]/5 hover:text-ink',
                              )}
                            >
                              {num} {num === 1 ? 'Franchise' : 'Franchises'}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                isFranchiseUnlimited: true,
                              })
                            }
                            className={cn(
                              'text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all border cursor-pointer',
                              formData.isFranchiseUnlimited
                                ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                                : 'bg-white text-muted border-[#5A2EA6]/20 hover:bg-[#5A2EA6]/5 hover:text-ink',
                            )}
                          >
                            Unlimited
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] bg-white/80 p-2.5 rounded-lg border border-[#5A2EA6]/10">
                        <span className="text-muted">
                          Quota badge display: <strong className="text-ink font-bold">{computedFranchiseQuota}</strong>
                        </span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          Auto-included "Franchise royalty settlement & compliance panel"
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-[#5A2EA6]/10 text-[11px] text-muted flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      Tenants on this tier operate strictly in <strong>Company-Owned Company-Operated (COCO)</strong> mode. Franchise partner creation and `/franchise` logins will be restricted.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: FEATURE ENTITLEMENTS CHECKLIST */}
            {activeTab === 'entitlements' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft">
                      Included Entitlements Checklist ({formData.entitlements.length})
                    </label>
                    <p className="text-[11px] text-muted">Each item is rendered with a green checkmark bullet on the plan card.</p>
                  </div>
                </div>

                {/* Add Custom Entitlement Field */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a new feature entitlement (e.g., Priority 24/7 technical operator support)..."
                    value={newEntitlementText}
                    onChange={(e) => setNewEntitlementText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEntitlement();
                      }
                    }}
                    className="flex-1 h-[38px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddEntitlement()}
                    className="h-[38px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>

                {/* Active Entitlements List */}
                <div className="max-h-[220px] overflow-y-auto custom-scroll space-y-1.5 p-3 rounded-xl bg-[#FCFAFF] border border-[#5A2EA6]/15">
                  {formData.entitlements.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted">
                      No entitlements added yet. Select from the quick suggestions below or type your own.
                    </div>
                  ) : (
                    formData.entitlements.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#5A2EA6]/10 text-xs font-medium text-ink hover:border-[#5A2EA6]/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEntitlement(idx)}
                          className="w-6 h-6 rounded flex items-center justify-center text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Add Suggestions from PRD */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-soft mb-2">
                    Quick-Add From Catalog:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto custom-scroll p-2 rounded-xl bg-slate-50 border border-slate-200">
                    {COMMON_ENTITLEMENT_SUGGESTIONS.map((item, idx) => {
                      const isAdded = formData.entitlements.includes(item);
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddEntitlement(item)}
                          className={cn(
                            'text-[10px] px-2 py-1 rounded-md font-medium transition-all text-left flex items-center gap-1 border',
                            isAdded
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 opacity-60 cursor-default'
                              : 'bg-white text-ink border-slate-200 hover:border-[#5A2EA6] hover:bg-[#5A2EA6]/5 cursor-pointer',
                          )}
                        >
                          {isAdded ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Plus className="w-2.5 h-2.5 text-muted" />}
                          <span className="truncate max-w-[240px]">{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SUBSCRIBERS & ROLLOUT TELEMETRY */}
            {activeTab === 'telemetry' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                      Active Subscribers Display Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 45 Tenants, 68 Tenants, or 0 Tenants"
                      value={formData.activeSubscribers}
                      onChange={(e) => setFormData({ ...formData, activeSubscribers: e.target.value })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                      Rollout Deployment Strategy
                    </label>
                    <select
                      value={formData.rolloutStrategy}
                      onChange={(e) => setFormData({ ...formData, rolloutStrategy: e.target.value })}
                      className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Immediate GA">Immediate GA (100% Platform Access)</option>
                      <option value="Staged Rollout">Staged Rollout (Canary / Phased)</option>
                      <option value="Private Beta">Private Beta (Invited Tenants Only)</option>
                      <option value="Grandfathered Only">Grandfathered (Existing Tenants Only)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 p-4 rounded-xl bg-[#FCFAFF] border border-[#5A2EA6]/15 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-ink">
                      <span>Rollout Adoption Target:</span>
                      <span className="text-[#5A2EA6] font-mono text-sm">{formData.rolloutPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.rolloutPercentage}
                      onChange={(e) => setFormData({ ...formData, rolloutPercentage: Number(e.target.value) })}
                      className="w-full accent-[#5A2EA6] cursor-pointer"
                    />
                    <div className="w-full bg-[#5A2EA6]/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] transition-all duration-300"
                        style={{ width: `${formData.rolloutPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#5A2EA6]/15">
              <div className="flex gap-2">
                {activeTab !== 'identity' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (activeTab === 'telemetry') setActiveTab('entitlements');
                      else if (activeTab === 'entitlements') setActiveTab('quotas');
                      else if (activeTab === 'quotas') setActiveTab('identity');
                    }}
                    className="h-[38px] px-3.5 rounded-xl text-xs font-semibold"
                  >
                    Back
                  </Button>
                )}
                {activeTab !== 'telemetry' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (activeTab === 'identity') setActiveTab('quotas');
                      else if (activeTab === 'quotas') setActiveTab('entitlements');
                      else if (activeTab === 'entitlements') setActiveTab('telemetry');
                    }}
                    className="h-[38px] px-3.5 rounded-xl text-xs font-semibold text-[#5A2EA6] border-[#5A2EA6]/20"
                  >
                    Next Tab →
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="h-[38px] px-4 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary shadow-xs"
                >
                  {editPlan ? 'Save Plan Details' : 'Publish Plan Tier'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Interactive Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sticky top-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#5A2EA6] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Live Subscriber Card Preview
            </span>
            <span className="text-[10px] text-muted bg-[#5A2EA6]/5 px-2 py-0.5 rounded-full border border-[#5A2EA6]/10">
              Matches UI Theme
            </span>
          </div>

          {/* Rendered Preview Card */}
          <div
            className={cn(
              'premium-branch-card rounded-[26px] overflow-hidden bg-transparent flex flex-col justify-between transition-all duration-300 border shadow-md',
              formData.themeVariant === 'popular'
                ? 'border-[#7C3AED]/40 ring-1 ring-[#7C3AED]/20'
                : formData.themeVariant === 'enterprise'
                  ? 'border-[#3B2647]/50'
                  : 'border-[#5A2EA6]/15',
            )}
          >
            {/* Card Header */}
            <div
              className={cn(
                'px-6 py-4.5 relative min-h-[82px] flex items-center justify-between z-10 transition-colors',
                formData.themeVariant === 'enterprise'
                  ? 'bg-gradient-to-r from-[#241535] via-[#3B2647] to-[#5A2EA6]'
                  : formData.themeVariant === 'popular'
                    ? 'bg-gradient-to-r from-[#E5DAFF] via-[#D5C7FF] to-[#C7B5FF]'
                    : 'bg-gradient-to-r from-[#F0EDF6] to-[#E5E0EE]',
              )}
            >
              <div className="premium-card-header-glow" />
              <div className="header-shine" />

              <div className="z-10">
                <span
                  className={cn(
                    'text-[9px] font-bold uppercase tracking-wider block mb-0.5',
                    formData.themeVariant === 'enterprise' ? 'text-white/70' : 'text-soft',
                  )}
                >
                  {formData.tierBadge || 'SUBSCRIPTION TIER'}
                </span>
                <strong
                  className={cn(
                    'text-base font-serif font-bold tracking-tight block',
                    formData.themeVariant === 'enterprise' ? 'text-white' : 'text-ink',
                  )}
                >
                  {formData.name || 'Untitled Tier Plan'}
                </strong>
              </div>

              <div className="text-right z-10">
                <div
                  className={cn(
                    'font-serif font-bold text-xl tracking-tight',
                    formData.themeVariant === 'enterprise' ? 'text-white' : 'text-[#5A2EA6]',
                  )}
                >
                  ₹{formData.numericPrice.toLocaleString('en-IN')} /mo
                </div>
                <span
                  className={cn(
                    'text-[9px] font-medium block mt-0.5',
                    formData.themeVariant === 'enterprise' ? 'text-white/70' : 'text-muted',
                  )}
                >
                  {formData.billingCycle || 'per branch / month'}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4.5 bg-white flex-1 flex flex-col justify-between text-[11.5px] text-muted space-y-4">
              <div className="space-y-3.5">
                {/* Tagline */}
                <p className="text-[11px] text-ink font-medium leading-relaxed bg-[#FCFAFF] border border-[#5A2EA6]/10 p-2.5 rounded-xl">
                  {formData.tagline || 'No tagline configured yet.'}
                </p>

                {/* 4 Quota Badges */}
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="p-2 rounded-xl bg-white border border-[#5A2EA6]/10 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                    <div>
                      <span className="text-[8.5px] text-soft block uppercase font-bold">Branches</span>
                      <strong className="text-ink font-semibold">{computedBranchesQuota}</strong>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-[#5A2EA6]/10 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#EC4899] shrink-0" />
                    <div>
                      <span className="text-[8.5px] text-soft block uppercase font-bold">Staff Seats</span>
                      <strong className="text-ink font-semibold">{computedStaffQuota}</strong>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-[#5A2EA6]/10 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[8.5px] text-soft block uppercase font-bold">APIs</span>
                      <strong className="text-ink font-semibold truncate block">{formData.apiQuota}</strong>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-[#5A2EA6]/10 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[8.5px] text-soft block uppercase font-bold">Domain</span>
                      <strong className="text-ink font-semibold truncate block">{formData.domainQuota}</strong>
                    </div>
                  </div>
                </div>

                {/* Franchise Network Indicator in Card Preview */}
                {formData.hasFranchise && (
                  <div className="p-2 rounded-xl bg-purple-50/90 border border-[#5A2EA6]/20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Handshake className="w-3.5 h-3.5 text-[#5A2EA6]" />
                      <span className="text-[8.5px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                        Franchise Network
                      </span>
                    </div>
                    <span className="text-[9.5px] font-bold text-ink bg-white px-2 py-0.5 rounded-md border border-[#5A2EA6]/15 shadow-2xs">
                      {computedFranchiseQuota}
                    </span>
                  </div>
                )}

                {/* Entitlements Checklist */}
                <div>
                  <h4 className="font-bold text-ink text-[11.5px] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" /> Included Entitlements:
                  </h4>
                  <ul className="space-y-1.5 text-[11px] max-h-[160px] overflow-y-auto custom-scroll pr-1">
                    {formData.entitlements.slice(0, 7).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[#4a3b50] leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{feat}</span>
                      </li>
                    ))}
                    {formData.entitlements.length > 7 && (
                      <li className="text-[10px] text-[#5A2EA6] font-semibold pl-5">
                        +{formData.entitlements.length - 7} more entitlements included...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Telemetry Bar */}
                <div className="p-2.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-muted font-medium">Active Subscribers:</span>
                    <strong className="text-ink font-bold">{formData.activeSubscribers}</strong>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-[#5A2EA6]/10">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#5A2EA6] font-semibold">Rollout Adoption:</span>
                      <strong className="text-[#5A2EA6] font-mono font-bold">{formData.rolloutPercentage}%</strong>
                    </div>
                    <div className="w-full bg-[#5A2EA6]/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899]"
                        style={{ width: `${formData.rolloutPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Action Buttons */}
              <div className="pt-2 border-t border-[#5A2EA6]/10 flex gap-2 opacity-80 pointer-events-none">
                <Button
                  variant="outline"
                  className="flex-1 h-[32px] rounded-lg text-[11px] font-bold border-[#5A2EA6]/20 text-[#5A2EA6]"
                >
                  Edit Details
                </Button>
                <Button
                  className="flex-1 h-[32px] rounded-lg text-[11px] font-bold premium-btn-primary"
                >
                  Manage Rollout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
