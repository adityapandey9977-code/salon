import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  CheckCircle2,
  Globe,
  Pencil,
  Plus,
  ShieldCheck,
  Sliders,
  Sparkles,
  Users,
  Zap,
  Handshake,
} from 'lucide-react';
import React, { useState } from 'react';
import { ManageRolloutModal } from '../components/ManageRolloutModal';
import { SubscriptionPlanModal } from '../components/SubscriptionPlanModal';
import { type SubscriptionPlan, useSuperAdminStore } from '../context/SuperAdminContext';

export function SubscriptionPlansPage() {
  const { subscriptionPlans, tenants } = useSuperAdminStore();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [rolloutPlan, setRolloutPlan] = useState<SubscriptionPlan | null>(null);

  // Extended Entitlement Bullet Lists (+100px expanded height)
  const getTierDetails = (index: number) => {
    switch (index) {
      case 0:
        return {
          tagline: 'Ideal for independent salons, single spas, and boutique studios',
          maxBranches: '2 Branches',
          maxStaff: '10 Staff Seats',
          hasCustomApi: 'Basic Webhook APIs',
          hasWhiteLabel: 'Standard Salon Domain',
          featuresList: [
            'Conflict-free diary & GST POS invoicing',
            'WhatsApp booking links & SMS reminders',
            'Basic stocktake & consumable inventory recipes',
            'Stylist daily target & tip performance tracker',
            'Standard 9am-9pm email operator support',
          ],
        };
      case 1:
        return {
          tagline: 'For growing salon chains, multi-branch brands, and wellness centers',
          maxBranches: '10 Branches',
          maxStaff: '50 Staff Seats',
          hasCustomApi: 'Full REST API Access',
          hasWhiteLabel: 'Custom CNAME Domain',
          featuresList: [
            'Multi-branch central client history & shared wallet',
            'Formula intelligence [P-02] & allergy safety flags [P-01]',
            'Local-language WhatsApp booking assistant [P-06]',
            'Service recipe BOM inventory & stock variance alerts',
            'Custom commission rules & tiered staff incentives',
            'Priority 24/7 technical operator support',
          ],
        };
      default:
        return {
          tagline: 'For nationwide salon chains, franchise networks, and enterprise brands',
          maxBranches: 'Unlimited Branches',
          maxStaff: 'Unlimited Staff Seats',
          hasCustomApi: 'Custom ERP Sync',
          hasWhiteLabel: 'Full White-Label Branding',
          featuresList: [
            'Franchise royalty settlement & compliance panel',
            'Resource-aware smart slot suggestions [P-03]',
            'Package liability & breakage forecasting [P-04]',
            'Custom ERP (Tally/Zoho) & dedicated API sync',
            'Dedicated SLA uptime guarantee (99.99%)',
            'Dedicated Account Manager & onboarding',
          ],
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-semibold tracking-tight">
              Subscription Plan Tiers & Entitlements
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#5A2EA6]/20">
              {subscriptionPlans.length} Managed Tiers
            </span>
          </div>
          <p className="text-[13px] text-muted mt-1">
            Configure platform subscription pricing, feature entitlements, capacity quotas, and
            rollout strategies.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPlan(null);
            setIsPlanModalOpen(true);
          }}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Subscription Plan</span>
        </Button>
      </div>

      {/* Subscription Cards Grid (+100px Height) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {subscriptionPlans.map((plan, i) => {
          const tierMeta = getTierDetails(i);
          const isEnterprise = plan.themeVariant === 'enterprise' || (!plan.themeVariant && i === 2);
          const isPopular = plan.themeVariant === 'popular' || (!plan.themeVariant && i === 1);
          const tierBadge = plan.tierBadge || (isPopular ? '★ Most Popular' : 'Subscription Tier');
          const tagline = plan.tagline || tierMeta.tagline;
          const branchesQuota = plan.branchesQuota || tierMeta.maxBranches;
          const staffQuota = plan.staffQuota || tierMeta.maxStaff;
          const apiQuota = plan.apiQuota || tierMeta.hasCustomApi;
          const domainQuota = plan.domainQuota || tierMeta.hasWhiteLabel;
          const featuresList = plan.entitlements && plan.entitlements.length > 0 ? plan.entitlements : tierMeta.featuresList;
          const billingCycle = plan.billingCycle || 'per branch / month';
          const rolloutPct = plan.rolloutPercentage ?? (i === 0 ? 100 : i === 1 ? 85 : 45);

          return (
            <div
              key={plan.id}
              className={cn(
                'premium-branch-card rounded-[26px] overflow-hidden bg-transparent flex flex-col justify-between transition-all duration-300 hover:shadow-lg border min-h-[460px]',
                isPopular
                  ? 'border-[#7C3AED]/40 ring-1 ring-[#7C3AED]/20 shadow-xs'
                  : isEnterprise
                    ? 'border-[#3B2647]/50 shadow-xs'
                    : 'border-[#5A2EA6]/15 shadow-xs',
              )}
            >
              {/* Dynamic Header */}
              <div
                className={cn(
                  'px-6 py-4.5 relative min-h-[82px] flex items-center justify-between z-10',
                  isEnterprise
                    ? 'bg-gradient-to-r from-[#241535] via-[#3B2647] to-[#5A2EA6]'
                    : isPopular
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
                      isEnterprise ? 'text-white/70' : 'text-soft',
                    )}
                  >
                    {tierBadge}
                  </span>
                  <strong
                    className={cn(
                      'text-lg font-serif font-bold tracking-tight block',
                      isEnterprise ? 'text-white' : 'text-ink',
                    )}
                  >
                    {plan.name}
                  </strong>
                </div>

                <div className="text-right z-10">
                  <div
                    className={cn(
                      'font-serif font-bold text-2xl tracking-tight',
                      isEnterprise ? 'text-white' : 'text-[#5A2EA6]',
                    )}
                  >
                    {plan.price}
                  </div>
                  <span
                    className={cn(
                      'text-[9.5px] font-medium block mt-0.5',
                      isEnterprise ? 'text-white/70' : 'text-muted',
                    )}
                  >
                    {billingCycle}
                  </span>
                </div>
              </div>

              {/* Content Body (+100px padded height) */}
              <div className="p-5 bg-white flex-1 flex flex-col justify-between text-[12px] text-muted space-y-5">
                <div className="space-y-4">
                  {/* Tagline */}
                  <p className="text-[11.5px] text-ink font-medium leading-relaxed bg-[#FCFAFF] border border-[#5A2EA6]/10 p-2.5 rounded-xl">
                    {tagline}
                  </p>

                  {/* Capacity Quota Chips */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white border border-[#5A2EA6]/10 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      <div>
                        <span className="text-[9px] text-soft block uppercase font-bold">Branches</span>
                        <strong className="text-ink font-semibold">{branchesQuota}</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#5A2EA6]/10 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#EC4899] shrink-0" />
                      <div>
                        <span className="text-[9px] text-soft block uppercase font-bold">Staff Seats</span>
                        <strong className="text-ink font-semibold">{staffQuota}</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#5A2EA6]/10 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="overflow-hidden">
                        <span className="text-[9px] text-soft block uppercase font-bold">APIs</span>
                        <strong className="text-ink font-semibold truncate block">{apiQuota}</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#5A2EA6]/10 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="overflow-hidden">
                        <span className="text-[9px] text-soft block uppercase font-bold">Domain</span>
                        <strong className="text-ink font-semibold truncate block">{domainQuota}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Franchise Network Entitlement Badge */}
                  {plan.hasFranchise && (
                    <div className="p-2.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/20 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Handshake className="w-3.5 h-3.5 text-[#5A2EA6]" />
                        <span className="text-[9px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                          Franchise Network
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-ink bg-white px-2 py-0.5 rounded-md border border-[#5A2EA6]/15 shadow-2xs">
                        {plan.franchiseQuota || 'Unlimited Franchises'}
                      </span>
                    </div>
                  )}

                  {/* Entitlements Checklist */}
                  <div>
                    <h4 className="font-bold text-ink text-[12px] mb-2.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#7C3AED]" /> Included Entitlements:
                    </h4>
                    <ul className="space-y-2 text-[11.5px]">
                      {featuresList.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[#4a3b50] leading-snug">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rollout Telemetry Card */}
                  <div className="p-3 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted font-medium">Active Subscribers:</span>
                      <div className="text-right">
                        <strong className="text-ink font-bold text-sm block">
                          {(() => {
                            const mappedCount = tenants.filter(
                              (t) =>
                                t.activePlans?.toLowerCase() === plan.name.toLowerCase() ||
                                (plan.name.toLowerCase().includes('enterprise') &&
                                  t.activePlans?.toLowerCase().includes('enterprise')) ||
                                (plan.name.toLowerCase().includes('premium') &&
                                  t.activePlans?.toLowerCase().includes('premium')) ||
                                (plan.name.toLowerCase().includes('starter') &&
                                  (t.activePlans?.toLowerCase().includes('starter') ||
                                    t.activePlans?.toLowerCase().includes('standard'))),
                            ).length;
                            return mappedCount > 0 ? `${mappedCount} Mapped (${plan.activeSubscribers})` : plan.activeSubscribers;
                          })()}
                        </strong>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-[#5A2EA6]/10">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-[#5A2EA6] font-semibold">Rollout Adoption:</span>
                        <strong className="text-[#5A2EA6] font-mono font-bold">
                          {rolloutPct}%
                        </strong>
                      </div>
                      <div className="w-full bg-[#5A2EA6]/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] transition-all duration-500"
                          style={{ width: `${rolloutPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3.5 border-t border-[#5A2EA6]/10 flex gap-2.5">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPlan(plan);
                      setIsPlanModalOpen(true);
                    }}
                    className="flex-1 h-[36px] rounded-xl text-xs font-bold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Details
                  </Button>
                  <Button
                    onClick={() => setRolloutPlan(plan)}
                    className="flex-1 h-[36px] rounded-xl text-xs font-bold premium-btn-primary flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Manage Rollout
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <SubscriptionPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setEditingPlan(null);
        }}
        editPlan={editingPlan}
      />

      <ManageRolloutModal
        isOpen={!!rolloutPlan}
        onClose={() => setRolloutPlan(null)}
        plan={rolloutPlan}
      />
    </div>
  );
}
