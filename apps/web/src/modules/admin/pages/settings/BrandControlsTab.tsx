import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Crown,
  Home,
  Info,
  Megaphone,
  Package,
  ShieldCheck,
  Sliders,
  Sparkles,
  Store,
  ToggleLeft,
  ToggleRight,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface FeatureControl {
  id: string;
  name: string;
  category: string;
  description: string;
  scope: 'Brand-wide' | 'Branch-specific';
  applicableBranches: string;
  status: 'Enabled' | 'Disabled';
  lastUpdated: string;
  updatedBy: string;
  icon: React.ComponentType<{ className?: string }>;
}

const initialFeatureControls: FeatureControl[] = [
  {
    id: 'CTRL-001',
    name: 'Online & Concierge Appointment Booking Engine',
    category: 'Operations',
    description:
      'Enables mobile app, web widget, and call center appointment scheduling with real-time stylist slot allocation.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    status: 'Enabled',
    lastUpdated: '10 Aug 2026',
    updatedBy: 'Ananya Shah',
    icon: Calendar,
  },
  {
    id: 'CTRL-002',
    name: 'Walk-in Fast Track & Express Queue',
    category: 'Operations',
    description:
      'Instant front-desk queueing for unscheduled walk-in clients with live SMS wait time estimation.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    status: 'Enabled',
    lastUpdated: '10 Aug 2026',
    updatedBy: 'Ananya Shah',
    icon: UserCheck,
  },
  {
    id: 'CTRL-003',
    name: 'Prepaid Treatment Packages & Bundles',
    category: 'Commercial',
    description:
      'Multi-session advance packages (e.g. 5 Hair Spas, Bridal combos) with automated session deduction ledger.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    status: 'Enabled',
    lastUpdated: '15 Jul 2026',
    updatedBy: 'Rahul Sharma',
    icon: Award,
  },
  {
    id: 'CTRL-004',
    name: 'VIP Club Memberships & Subscriptions',
    category: 'Commercial',
    description:
      'Tiered annual club memberships providing percentage service discounts, priority slots, and free add-on perks.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    status: 'Enabled',
    lastUpdated: '15 Jul 2026',
    updatedBy: 'Rahul Sharma',
    icon: Crown,
  },
  {
    id: 'CTRL-005',
    name: 'Client Loyalty Points & Cashback Engine',
    category: 'Marketing',
    description: 'Reward points earned per ₹100 spent, redeemable during POS invoice checkout.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    status: 'Enabled',
    lastUpdated: '01 Aug 2026',
    updatedBy: 'Ananya Shah',
    icon: Sparkles,
  },
  {
    id: 'CTRL-006',
    name: 'Centralized Inventory & Stock Procurement',
    category: 'Inventory',
    description:
      'Storekeeper purchase orders, chemical recipe dispensing tracking, wastage logs, and multi-branch stock transfers.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    status: 'Enabled',
    lastUpdated: '20 Jul 2026',
    updatedBy: 'Amit Deshmukh',
    icon: Package,
  },
  {
    id: 'CTRL-007',
    name: 'Multi-Channel Marketing & SMS/WhatsApp Broadcasts',
    category: 'Marketing',
    description:
      'Promotional discount campaigns, festival vouchers, and automated dormant client winback sequences.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    status: 'Enabled',
    lastUpdated: '05 Aug 2026',
    updatedBy: 'Ananya Shah',
    icon: Megaphone,
  },
  {
    id: 'CTRL-008',
    name: 'Franchise Partner Governance & Royalty Statements',
    category: 'Franchise',
    description:
      'Licensed FOFO/FOCO partner management, statutory compliance checklists, and 10% gross turnover royalty accruals.',
    scope: 'Brand-wide',
    applicableBranches: 'FOFO & FOCO Outlets Only',
    status: 'Enabled',
    lastUpdated: '01 Aug 2026',
    updatedBy: 'Rahul Sharma',
    icon: Building2,
  },
  {
    id: 'CTRL-009',
    name: 'Home & Bridal On-Demand Concierge Services',
    category: 'Services',
    description:
      'Enables doorstep bridal makeover visits and on-demand stylist dispatch with GPS attendance check-in.',
    scope: 'Branch-specific',
    applicableBranches: 'Vijay Nagar Flagship, Arera Colony Lounge',
    status: 'Disabled',
    lastUpdated: '01 Aug 2026',
    updatedBy: 'Amit Deshmukh',
    icon: Home,
  },
];

export function BrandControlsTab() {
  const [controls, setControls] = useState<FeatureControl[]>(initialFeatureControls);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFeature = (id: string) => {
    setControls(
      controls.map((c) => {
        if (c.id === id) {
          const next = c.status === 'Enabled' ? 'Disabled' : 'Enabled';
          showToast(
            `Feature "${c.name}" ${next.toLowerCase()}. Historical data is preserved safely.`,
          );
          return {
            ...c,
            status: next,
            lastUpdated: 'Just now',
            updatedBy: 'Ananya Shah (You)',
          };
        }
        return c;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Explanatory Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#5A2EA6]" />
              <h2 className="font-serif font-bold text-ink text-lg">
                Centralized Brand Feature Controls &amp; Workflow Toggles
              </h2>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Enable or soft-disable specific business modules and specialized workflows across the
              brand network
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
            {controls.filter((c) => c.status === 'Enabled').length} / {controls.length} Active
            Workflows
          </span>
        </div>

        {/* PRD Rule 9 Callout: Non-destructive workflow hiding */}
        <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5 text-xs text-purple-900">
          <Info className="w-4 h-4 text-[#5A2EA6] shrink-0 mt-0.5" />
          <div>
            <strong>Non-Destructive Workflow Governance:</strong> When a module or feature is
            disabled (e.g. Home Services), the UI hides navigation and forms across the tenant
            without purging historical database records, preserving complete audit integrity.
          </div>
        </div>
      </div>

      {/* Brand Controls Ledger (Section 9 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <h3 className="font-serif font-bold text-ink text-base">
              Module &amp; Workflow Configuration Ledger
            </h3>
            <p className="text-[11px] text-muted mt-0.5">
              Multi-branch scope, feature descriptions, operational status, and audit timestamps
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#5A2EA6]/5">
          {controls.map((ctrl) => {
            const IconComp = ctrl.icon;
            const isEnabled = ctrl.status === 'Enabled';
            return (
              <div
                key={ctrl.id}
                className={cn(
                  'p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors',
                  isEnabled ? 'hover:bg-[#5A2EA6]/3' : 'bg-slate-50/50 opacity-75',
                )}
              >
                <div className="flex items-start gap-3.5 max-w-2xl">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-2xl grid place-items-center shrink-0 shadow-xs',
                      isEnabled
                        ? 'bg-[#F8F5FF] text-[#5A2EA6] border border-[#5A2EA6]/20'
                        : 'bg-slate-200 text-slate-500',
                    )}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-xs font-bold text-ink">{ctrl.name}</strong>
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-200">
                        {ctrl.category}
                      </span>
                      <span
                        className={cn(
                          'px-2 py-0.2 rounded-full text-[9px] font-bold border',
                          ctrl.scope === 'Brand-wide'
                            ? 'bg-purple-50 text-[#5A2EA6] border-purple-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200',
                        )}
                      >
                        {ctrl.scope}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted leading-relaxed">{ctrl.description}</p>

                    <div className="flex items-center gap-3 text-[10px] text-soft pt-1">
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3 text-muted" />
                        <span>
                          Applicable: <strong>{ctrl.applicableBranches}</strong>
                        </span>
                      </span>
                      <span>·</span>
                      <span>
                        Revised by <strong>{ctrl.updatedBy}</strong> ({ctrl.lastUpdated})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border',
                      isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300',
                    )}
                  >
                    ● {ctrl.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleFeature(ctrl.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer select-none',
                      isEnabled
                        ? 'bg-[#5A2EA6] text-white shadow-xs hover:bg-[#482287]'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100',
                    )}
                  >
                    {isEnabled ? 'Disable Module' : 'Enable Module'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
