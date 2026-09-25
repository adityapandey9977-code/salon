import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Globe,
  Layers,
  Mail,
  MapPin,
  Network,
  Phone,
  Radio,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { type Tenant, useSuperAdminStore } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface ProvisionTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTenant?: Tenant | null;
}

export const ProvisionTenantModal: React.FC<ProvisionTenantModalProps> = ({
  isOpen,
  onClose,
  editTenant,
}) => {
  const { addTenant, updateTenant, subscriptionPlans, addInvoice } = useSuperAdminStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'basic' | 'owner' | 'whitelabel'>('basic');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDnsTesting, setIsDnsTesting] = useState(false);
  const [dnsVerified, setDnsVerified] = useState(false);

  const [formData, setFormData] = useState({
    name: editTenant?.name || '',
    slug: editTenant?.slug || '',
    city: editTenant?.city || 'Bhopal',
    region: editTenant?.region || 'Central India',
    selectedPlan: editTenant?.activePlans || 'Enterprise Tier Plan',
    ownerName: editTenant?.ownerName || '',
    ownerEmail: editTenant?.ownerEmail || '',
    ownerPhone: editTenant?.ownerPhone || '',
    branchesCount: editTenant?.branchesCount ?? 1,
    customDomain: editTenant?.customDomain || '',
    primaryColor: editTenant?.primaryColor || '#7C3AED',
    enableCustomDomain: !!editTenant?.customDomain,
    enableWhiteLabelEmail: true,
  });

  // Lookup the currently selected plan object
  const selectedPlanObj = useMemo(() => {
    return (
      subscriptionPlans.find(
        (p) =>
          p.name.toLowerCase() === formData.selectedPlan.toLowerCase() ||
          p.id === formData.selectedPlan,
      ) ||
      subscriptionPlans.find((p) => p.name.includes('Enterprise')) ||
      subscriptionPlans[0]
    );
  }, [subscriptionPlans, formData.selectedPlan]);

  // Check if selected plan includes Custom Domain / White-Label entitlement
  const planHasCustomDomain = useMemo(() => {
    if (!selectedPlanObj) return false;
    const domainQuotaLower = (selectedPlanObj.domainQuota || '').toLowerCase();
    const planNameLower = selectedPlanObj.name.toLowerCase();
    const featuresLower = (selectedPlanObj.features || '').toLowerCase();

    return (
      selectedPlanObj.hasWhiteLabel === true ||
      domainQuotaLower.includes('cname') ||
      domainQuotaLower.includes('custom') ||
      domainQuotaLower.includes('white-label') ||
      domainQuotaLower.includes('white label') ||
      planNameLower.includes('enterprise') ||
      planNameLower.includes('premium') ||
      featuresLower.includes('white-label') ||
      featuresLower.includes('cname')
    );
  }, [selectedPlanObj]);

  useEffect(() => {
    if (editTenant) {
      setFormData({
        name: editTenant.name,
        slug: editTenant.slug,
        city: editTenant.city,
        region: editTenant.region,
        selectedPlan: editTenant.activePlans || 'Enterprise Tier Plan',
        ownerName: editTenant.ownerName,
        ownerEmail: editTenant.ownerEmail,
        ownerPhone: editTenant.ownerPhone,
        branchesCount: editTenant.branchesCount ?? 1,
        customDomain: editTenant.customDomain || '',
        primaryColor: editTenant.primaryColor || '#7C3AED',
        enableCustomDomain: !!editTenant.customDomain,
        enableWhiteLabelEmail: true,
      });
      setDnsVerified(!!editTenant.customDomain);
    } else {
      setFormData({
        name: '',
        slug: '',
        city: 'Bhopal',
        region: 'Central India',
        selectedPlan: 'Enterprise Tier Plan',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        branchesCount: 1,
        customDomain: '',
        primaryColor: '#7C3AED',
        enableCustomDomain: true,
        enableWhiteLabelEmail: true,
      });
      setDnsVerified(false);
    }
    setActiveTab('basic');
  }, [editTenant, isOpen]);

  // If active tab was 'whitelabel' but selected plan does not support custom domain, fallback to 'owner'
  useEffect(() => {
    if (!planHasCustomDomain && activeTab === 'whitelabel') {
      setActiveTab('owner');
    }
  }, [planHasCustomDomain, activeTab]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestDnsProxy = () => {
    setIsDnsTesting(true);
    setTimeout(() => {
      setIsDnsTesting(false);
      setDnsVerified(true);
      toast('DNS record resolution and reverse proxy routing verified successfully!');
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.ownerName || !formData.ownerEmail) {
      toast('Please fill in required brand name and owner contact details.');
      return;
    }

    const finalCustomDomain =
      planHasCustomDomain && formData.customDomain?.trim()
        ? formData.customDomain
          .trim()
          .toLowerCase()
          .replace(/^https?:\/\//, '')
          .replace(/\/$/, '')
        : undefined;

    const planPrice = selectedPlanObj?.numericPrice || 4500;
    const planName = selectedPlanObj?.name || formData.selectedPlan;

    if (editTenant) {
      updateTenant(editTenant.id, {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        city: formData.city,
        region: formData.region,
        activePlans: planName,
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        contactEmail: formData.ownerEmail,
        contactPhone: formData.ownerPhone,
        branchesCount: Number(formData.branchesCount) || 1,
        customDomain: finalCustomDomain,
        primaryColor: formData.primaryColor || '#7C3AED',
      });
      toast(`Tenant "${formData.name}" updated successfully.`);
    } else {
      // 1. Provision New Tenant
      addTenant({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        city: formData.city,
        region: formData.region,
        activePlans: planName,
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        contactEmail: formData.ownerEmail,
        contactPhone: formData.ownerPhone,
        branchesCount: 1,
        branchesList: [`${formData.name} - Flagship Branch`],
        customDomain: finalCustomDomain,
        primaryColor: formData.primaryColor || '#7C3AED',
        status: 'Active',
        revenue: `₹${(planPrice / 100000).toFixed(1)}L /mo`,
      });

      // 2. Auto-Generate Bill & Paid Payment Record for Plan Purchase
      const currentYear = new Date().getFullYear();
      const invoiceNumber = `INV-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
      addInvoice({
        invoiceId: invoiceNumber,
        salon: formData.name,
        numericAmount: planPrice,
        amount: `₹${planPrice.toLocaleString('en-IN')}`,
        status: 'Paid',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        billingPeriod: `${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} (${planName})`,
      });

      toast(
        `Successfully registered "${formData.name}" on ${planName}! Invoice ${invoiceNumber} created & marked as Paid.`,
      );
    }

    onClose();
    setActiveTab('basic');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editTenant ? `Edit Tenant: ${editTenant.name}` : 'Provision New Tenant Account'}
      subtitle={
        planHasCustomDomain
          ? 'Configure tenant instance, credentials, subscription tier & custom domain CNAME proxy'
          : 'Configure tenant database instance, master owner credentials & subscription plan tier'
      }
      icon={<Sparkles className="w-5 h-5" />}
      maxWidth="xl"
    >
      {/* Navigation Tabs (Dynamically displays Tab 3 only when plan includes Custom Domain) */}
      <div className="flex border-b border-[#5A2EA6]/10 mb-6 pb-2 gap-3 sm:gap-4 overflow-x-auto custom-scroll">
        {[
          { id: 'basic', label: '1. Tenant Details', icon: Building2 },
          { id: 'owner', label: '2. Tenant Owner & Plan', icon: UserCheck },
          ...(planHasCustomDomain
            ? [{ id: 'whitelabel', label: '3. White Labeling & CNAME', icon: Globe }]
            : []),
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
        {/* TAB 1: BASIC TENANT DETAILS */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Salon / Tenant Brand Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Blush & Bloom Salon Group"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                    })
                  }
                  className="w-full h-[40px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
                <Building2 className="w-4 h-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Tenant Slug Identifier
              </label>
              <input
                type="text"
                readOnly
                placeholder="blush-bloom-salon-group"
                value={formData.slug}
                className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/10 bg-slate-50 text-xs font-mono text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Headquarters City Location *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Bhopal"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-[40px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
                <MapPin className="w-4 h-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Operating Region Territory
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
              >
                <option value="Central India">Central India</option>
                <option value="West India">West India</option>
                <option value="North India">North India</option>
                <option value="South India">South India</option>
                <option value="International">International</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 2: OWNER & PLAN SELECTION */}
        {activeTab === 'owner' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
              <h4 className="text-xs font-bold text-ink flex items-center gap-1.5 mb-1">
                <UserCheck className="w-4 h-4 text-[#5A2EA6]" /> Tenant Owner & Master Admin
              </h4>
              <p className="text-[11px] text-muted">
                The master tenant owner account will have complete administrative control over salon branches, staff rosters, and financial reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                  Tenant Owner Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full h-[40px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <UserCheck className="w-4 h-4 text-muted absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                  Owner Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="owner@brand.com"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    className="w-full h-[40px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                  Owner Direct Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    className="w-full h-[40px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <Phone className="w-4 h-4 text-muted absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-soft">
                  Select Subscription Plan Tier *
                </label>
                <span className="text-[10.5px] text-muted">
                  Auto-generates subscription bill & payment on registration
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {subscriptionPlans.map((plan) => {
                  const isSelected =
                    formData.selectedPlan.toLowerCase() === plan.name.toLowerCase() ||
                    formData.selectedPlan === plan.id;

                  const hasDomainEntitlement = Boolean(
                    plan.hasWhiteLabel ||
                    plan.domainQuota?.toLowerCase().includes('cname') ||
                    plan.domainQuota?.toLowerCase().includes('custom') ||
                    plan.domainQuota?.toLowerCase().includes('white-label') ||
                    plan.domainQuota?.toLowerCase().includes('white label') ||
                    plan.name.toLowerCase().includes('enterprise') ||
                    plan.name.toLowerCase().includes('premium'),
                  );

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setFormData({ ...formData, selectedPlan: plan.name })}
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between',
                        isSelected
                          ? 'border-[#5A2EA6] bg-[#F8F5FF] shadow-sm ring-2 ring-[#5A2EA6]/20'
                          : 'border-[#5A2EA6]/15 bg-white hover:border-[#5A2EA6]/40',
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <strong className="block text-xs font-serif font-bold text-ink truncate">
                            {plan.name}
                          </strong>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#5A2EA6] text-white flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <span className="text-[13px] font-bold text-[#5A2EA6] block">
                          {plan.price}
                        </span>
                        <p className="text-[10px] text-muted mt-1.5 line-clamp-2 leading-relaxed">
                          {plan.features}
                        </p>
                      </div>

                      {/* Custom Domain & White-Label Indicator Badge */}
                      <div className="mt-3 pt-2.5 border-t border-[#5A2EA6]/10 flex items-center justify-between text-[10px]">
                        {hasDomainEntitlement ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-emerald-600" /> CNAME & White-Label
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            Standard Subdomain
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Automatic Workflow Explanation Callout */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-muted flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink font-semibold block">
                    {planHasCustomDomain
                      ? 'Custom Domain Entitlement Active for Selected Plan'
                      : 'Standard Salon Subdomain Selected'}
                  </strong>
                  <span>
                    {planHasCustomDomain
                      ? 'The selected plan tier includes full White Labeling & Custom CNAME. Proceed to Step 3 to configure brand domain, server DNS records, and reverse proxy routing.'
                      : 'This plan uses standard DigiFlex subdomains. You can immediately provision the salon, and an initial paid invoice will be generated.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WHITE LABELING & CNAME PROXY CONFIGURATION */}
        {activeTab === 'whitelabel' && planHasCustomDomain && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Custom Domain Input */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#F8F5FF] to-[#F3EEFE] border border-[#5A2EA6]/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#5A2EA6]" /> Custom White-Label Domain (CNAME Binding)
                  </h4>
                  <p className="text-[11px] text-muted mt-0.5">
                    Map the tenant brand domain (e.g. <code>app.blushbloom.in</code> or <code>booking.salondomain.com</code>)
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Included in {selectedPlanObj?.name}
                </span>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-soft mb-1">
                  Custom Domain Hostname *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="booking.yourbrand.com"
                    value={formData.customDomain}
                    onChange={(e) => {
                      setFormData({ ...formData, customDomain: e.target.value });
                      setDnsVerified(false);
                    }}
                    className="flex-1 h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/30 bg-white text-xs font-mono text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestDnsProxy}
                    disabled={isDnsTesting || !formData.customDomain}
                    className="h-[40px] px-3.5 rounded-xl text-xs font-semibold shrink-0 border-[#5A2EA6]/20 text-[#5A2EA6]"
                  >
                    {isDnsTesting ? 'Verifying...' : dnsVerified ? '✓ Verified' : 'Verify DNS Proxy'}
                  </Button>
                </div>
                <span className="text-[10px] text-muted block mt-1">
                  Enter your fully qualified domain name without <code>https://</code>
                </span>
              </div>
            </div>

            {/* DNS Records & Server IP Provider Guide */}
            <div className="p-4 rounded-xl bg-white border border-[#5A2EA6]/20 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#5A2EA6]" />
                  <span className="text-xs font-bold text-ink">DNS Server Configuration & IP Routing</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Global Anycast Edge Network
                </span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                Add one of the following DNS records in your domain registrar (GoDaddy, Namecheap, Cloudflare, AWS Route53) to point traffic to the   SaaS proxy:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Option 1: CNAME Record */}
                <div className="p-3 rounded-xl bg-[#FCFAFF] border border-[#5A2EA6]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-ink uppercase tracking-wider">
                      Option A: CNAME Record (Subdomains)
                    </span>
                    <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Recommended
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-muted">Type:</span>
                      <strong className="font-mono text-ink">CNAME</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-muted">Host / Name:</span>
                      <strong className="font-mono text-ink">booking (or app)</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted">Target / Value:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-[#5A2EA6] text-[10.5px]">cname.digiflexsalon.com</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy('cname.digiflexsalon.com', 'cname')}
                          className="p-1 text-muted hover:text-[#5A2EA6] transition-colors cursor-pointer"
                          title="Copy CNAME target"
                        >
                          {copiedField === 'cname' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 2: Server IP (A Record) */}
                <div className="p-3 rounded-xl bg-[#FCFAFF] border border-[#5A2EA6]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-ink uppercase tracking-wider">
                      Option B: Server IP (A Record)
                    </span>
                    <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Apex / Root
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-muted">Type:</span>
                      <strong className="font-mono text-ink">A Record</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-muted">Host / Name:</span>
                      <strong className="font-mono text-ink">@ (Root Domain)</strong>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted">Server IP Address:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-emerald-700 font-bold">76.76.21.21</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy('76.76.21.21', 'ip')}
                          className="p-1 text-muted hover:text-emerald-700 transition-colors cursor-pointer"
                          title="Copy Server IP"
                        >
                          {copiedField === 'ip' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reverse Proxy Telemetry & Upstream Routing */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Edge Reverse Proxy Gateway Routing</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
                  HTTP/2 + TLS 1.3 Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase">Incoming Domain:</span>
                  <span className="text-purple-300 font-bold">
                    https://{formData.customDomain || 'booking.salondomain.com'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase">Proxy Upstream Target:</span>
                  <span className="text-emerald-300 font-bold">
                    https://app.digiflexsalon.com/tenant/{formData.slug || 'brand-slug'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10.5px] text-slate-300 pt-1">
                <span>SSL Certificate: <strong>Auto-Issued Let's Encrypt Wildcard</strong></span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Zero-Touch Auto Renewal (90 Days)
                </span>
              </div>
            </div>

            {/* Brand Accent Color & White-Label Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                  Primary Brand Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-line cursor-pointer p-1 shrink-0"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-mono text-ink flex-1"
                  />
                </div>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-ink cursor-pointer bg-[#FCFAFF] p-2.5 rounded-xl border border-[#5A2EA6]/15 w-full hover:bg-[#5A2EA6]/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.enableWhiteLabelEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, enableWhiteLabelEmail: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                  />
                  <span>White-Labeled Email & SMS Headers</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#5A2EA6]/10">
          <div>
            {activeTab !== 'basic' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (activeTab === 'whitelabel') setActiveTab('owner');
                  else if (activeTab === 'owner') setActiveTab('basic');
                }}
                className="h-[38px] px-4 rounded-xl text-xs font-semibold"
              >
                Back
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

            {/* TAB 1: Go to Tab 2 */}
            {activeTab === 'basic' && (
              <Button
                type="button"
                onClick={() => setActiveTab('owner')}
                className="h-[38px] px-4 rounded-xl text-xs font-semibold premium-btn-primary"
              >
                Next Step: Plan & Owner →
              </Button>
            )}

            {/* TAB 2: If plan has custom domain, go to Tab 3; otherwise Submit & Register directly */}
            {activeTab === 'owner' && (
              <>
                {planHasCustomDomain ? (
                  <Button
                    type="button"
                    onClick={() => setActiveTab('whitelabel')}
                    className="h-[38px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-1.5"
                  >
                    <span>Next: White Labeling & CNAME</span>
                    <span>→</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary shadow-xs"
                  >
                    {editTenant ? 'Save Tenant Changes' : 'Register & Provision Tenant'}
                  </Button>
                )}
              </>
            )}

            {/* TAB 3: Submit and Register with Custom Domain & Proxy */}
            {activeTab === 'whitelabel' && (
              <Button
                type="submit"
                className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{editTenant ? 'Save White-Label Tenant' : 'Register & Provision Tenant'}</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </BaseModal>
  );
};
