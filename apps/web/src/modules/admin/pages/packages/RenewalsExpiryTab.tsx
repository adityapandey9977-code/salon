import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Download,
  Filter,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';

export interface ExpiringPackageItem {
  id: string;
  clientName: string;
  clientMobile: string;
  packageName: string;
  branch: string;
  expiryDate: string;
  daysRemaining: number;
  sessionsRemaining: number;
  remainingValue: number;
  status: 'Expiring in 7 Days' | 'Expiring in 15 Days' | 'Expiring in 30 Days' | 'Expired';
}

export interface ExpiringMembershipItem {
  id: string;
  clientName: string;
  clientMobile: string;
  membershipName: string;
  tier: string;
  branch: string;
  expiryDate: string;
  daysRemaining: number;
  renewalDiscountAvailable: number;
  status:
    | 'Renewal Due (7d)'
    | 'Renewal Due (15d)'
    | 'Renewal Due (30d)'
    | 'Expired (In Grace Period)';
}

export const initialExpiringPackages: ExpiringPackageItem[] = [
  {
    id: 'EXP-PKG-01',
    clientName: 'Pooja Kashyap',
    clientMobile: '+91 98980 22110',
    packageName: 'Clinical Skin Renewal Trio',
    branch: 'Atelier Whitefield Studio',
    expiryDate: '25 Aug 2026',
    daysRemaining: 7,
    sessionsRemaining: 1,
    remainingValue: 3500,
    status: 'Expiring in 7 Days',
  },
  {
    id: 'EXP-PKG-02',
    clientName: 'Ritika Sen',
    clientMobile: '+91 98200 77112',
    packageName: 'Royal Bridal Radiance Cure',
    branch: 'Atelier Indrapuri Flagship',
    expiryDate: '30 Aug 2026',
    daysRemaining: 12,
    sessionsRemaining: 2,
    remainingValue: 7000,
    status: 'Expiring in 15 Days',
  },
  {
    id: 'EXP-PKG-03',
    clientName: 'Vikram Seth',
    clientMobile: '+91 98450 33221',
    packageName: 'Gentlemen’s Executive Grooming Pass',
    branch: 'Atelier Koregaon Park Grand',
    expiryDate: '12 Sep 2026',
    daysRemaining: 25,
    sessionsRemaining: 3,
    remainingValue: 4500,
    status: 'Expiring in 30 Days',
  },
];

export const initialExpiringMemberships: ExpiringMembershipItem[] = [
  {
    id: 'EXP-MEM-01',
    clientName: 'Devendra Singhania',
    clientMobile: '+91 98110 33440',
    membershipName: 'Royal Black VIP Circle',
    tier: 'Royal Black Tier',
    branch: 'Atelier Indrapuri Flagship',
    expiryDate: '24 Aug 2026',
    daysRemaining: 6,
    renewalDiscountAvailable: 10,
    status: 'Renewal Due (7d)',
  },
  {
    id: 'EXP-MEM-02',
    clientName: 'Meera Nambiar',
    clientMobile: '+91 98450 77881',
    membershipName: 'Atelier Platinum Privilege',
    tier: 'Platinum Tier',
    branch: 'Atelier Koregaon Park Grand',
    expiryDate: '02 Sep 2026',
    daysRemaining: 15,
    renewalDiscountAvailable: 10,
    status: 'Renewal Due (15d)',
  },
  {
    id: 'EXP-MEM-03',
    clientName: 'Sanjay Malhotra',
    clientMobile: '+91 97840 55660',
    membershipName: 'Atelier Gold Elite',
    tier: 'Gold Tier',
    branch: 'Atelier Jaipur Royal Spa',
    expiryDate: '18 Sep 2026',
    daysRemaining: 31,
    renewalDiscountAvailable: 5,
    status: 'Renewal Due (30d)',
  },
];

export function RenewalsExpiryTab() {
  const { toast } = useToast();
  const [activeSubView, setActiveSubView] = useState<'memberships' | 'packages'>('memberships');
  const [branchFilter, setBranchFilter] = useState('All');
  const [expiryPeriodFilter, setExpiryPeriodFilter] = useState('All');
  const [expiringMemberships, setExpiringMemberships] = useState<ExpiringMembershipItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Renewal Modal State
  const [selectedForRenewal, setSelectedForRenewal] = useState<ExpiringMembershipItem | null>(null);

  React.useEffect(() => {
    async function loadRenewals() {
      try {
        setLoading(true);
        const { membershipsApi } = await import('@/shared/api/memberships.api');
        const liveRenewals = await membershipsApi.listRenewals();
        if (liveRenewals && liveRenewals.length > 0) {
          const mapped: ExpiringMembershipItem[] = liveRenewals.map((r, idx) => ({
            id: r.id || `EXP-MEM-${idx + 1}`,
            clientName: r.clientName || `VIP Member ${idx + 1}`,
            clientMobile: `+91 98000 ${idx + 1000}`,
            membershipName: r.tierName || 'Annual VIP Plan',
            tier: r.tierName?.includes('Royal') ? 'Royal Black Tier' : 'Platinum Tier',
            branch: 'Main Salon HQ',
            expiryDate: new Date(r.expiresAt || Date.now()).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            daysRemaining: r.daysRemaining ?? 14,
            renewalDiscountAvailable: 10,
            status: r.daysRemaining < 10 ? 'Renewal Due (7d)' : 'Renewal Due (15d)',
          }));
          setExpiringMemberships(mapped);
        } else {
          setExpiringMemberships([]);
        }
      } catch (err) {
        console.error('Failed to load renewals from API', err);
      } finally {
        setLoading(false);
      }
    }
    loadRenewals();
  }, []);



  const kpis = [
    { label: 'Active Memberships', value: '466 VIPs', change: '84% Retention', color: 'text-ink' },
    {
      label: 'Expiring in 30 Days',
      value: '63 Due',
      change: 'Requires Follow-up',
      color: 'text-amber-700',
    },
    {
      label: 'Expired (In Grace Period)',
      value: '18 Plans',
      change: '15d Grace Window',
      color: 'text-rose-700',
    },
    {
      label: 'Renewal Due Queue',
      value: '45 Guests',
      change: 'Auto-Notified via WhatsApp',
      color: 'text-[#5A2EA6]',
    },
    {
      label: 'Annual Renewal Rate',
      value: '84.2%',
      change: '+3.1% vs Last Quarter',
      color: 'text-emerald-700',
    },
  ];

  const handleConfirmRenewal = () => {
    if (!selectedForRenewal) return;
    toast(
      `Membership "${selectedForRenewal.membershipName}" renewed for ${selectedForRenewal.clientName} with 12 months extended validity.`,
    );
    setSelectedForRenewal(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Renewals &amp; Expiry Monitoring Command
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              63 Renewals Pacing
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Real-time tracking of approaching package expiry deadlines, membership renewal due
            dates, and grace period safeguard workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported renewal & expiry ledger to CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* 5 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs space-y-1"
          >
            <span className="text-[10px] text-muted uppercase font-bold block">{kpi.label}</span>
            <strong className={cn('text-xl font-bold font-serif block', kpi.color)}>
              {kpi.value}
            </strong>
            <span className="text-[10px] text-soft block">{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Expiry Warning Callout */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <span>
          <strong>Automated Loyalty Safeguard:</strong> Clients approaching expiration within 15
          days automatically receive reminder WhatsApp concierge links offering a 10% on-time
          renewal incentive waiver.
        </span>
      </div>

      {/* Switcher & Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Toggle between Expiring Memberships and Expiring Packages */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FCFAFF] rounded-xl border border-purple-100">
          <button
            onClick={() => setActiveSubView('memberships')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
              activeSubView === 'memberships'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            Expiring Memberships ({initialExpiringMemberships.length})
          </button>
          <button
            onClick={() => setActiveSubView('packages')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
              activeSubView === 'packages'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            Expiring Packages ({initialExpiringPackages.length})
          </button>
        </div>

        {/* Branch & Expiry Filter */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Branch:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Branches</option>
              {masterBranches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 1. EXPIRING MEMBERSHIPS TABLE */}
      {activeSubView === 'memberships' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Memberships Approaching Annual Expiration &amp; Renewal
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {initialExpiringMemberships.length} Renewal Opportunities
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'VIP Client & Contact',
                    'Current Membership Plan',
                    'Branch Hub',
                    'Expiration Date',
                    'Pacing State',
                    'Renewal Concession',
                    'Actions',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === 6 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {initialExpiringMemberships.map((m) => (
                  <tr key={m.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <strong className="text-ink text-xs block">{m.clientName}</strong>
                      <span className="text-[10px] text-muted">{m.clientMobile}</span>
                    </td>

                    <td className="p-3.5">
                      <strong className="text-ink text-xs block">{m.membershipName}</strong>
                      <span className="text-[10px] text-[#5A2EA6] font-bold">{m.tier}</span>
                    </td>

                    <td className="p-3.5 text-soft">{m.branch}</td>

                    <td className="p-3.5">
                      <strong className="text-ink text-xs block">{m.expiryDate}</strong>
                      <span className="text-[10px] text-amber-700 font-bold">
                        {m.daysRemaining} Days Left
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        {m.status}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-emerald-700">
                      {m.renewalDiscountAvailable}% Loyalty Discount
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <Button
                        onClick={() => setSelectedForRenewal(m)}
                        className="h-8 px-3 rounded-lg bg-[#5A2EA6] hover:bg-[#4a2489] text-white text-xs font-bold inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Renew VIP</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. EXPIRING PACKAGES TABLE */}
      {activeSubView === 'packages' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Service Packages Approaching Expiration with Unused Sessions
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {initialExpiringPackages.length} Expiring Bundles
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Client & Contact',
                    'Service Package',
                    'Branch Hub',
                    'Expiration Date',
                    'Unused Sessions',
                    'Outstanding Value',
                    'Actions',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === 6 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {initialExpiringPackages.map((p) => (
                  <tr key={p.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <strong className="text-ink text-xs block">{p.clientName}</strong>
                      <span className="text-[10px] text-muted">{p.clientMobile}</span>
                    </td>

                    <td className="p-3.5 font-semibold text-ink text-xs">{p.packageName}</td>
                    <td className="p-3.5 text-soft">{p.branch}</td>

                    <td className="p-3.5">
                      <strong className="text-ink text-xs block">{p.expiryDate}</strong>
                      <span className="text-[10px] text-rose-700 font-bold">
                        {p.daysRemaining} Days Left
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-[#5A2EA6]">
                      {p.sessionsRemaining} Sessions Left
                    </td>

                    <td className="p-3.5 font-serif font-bold text-ink">
                      ₹{p.remainingValue.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <button
                        onClick={() =>
                          toast(`Sent grace-period extension voucher for ${p.clientName}.`)
                        }
                        className="h-8 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] text-xs font-bold cursor-pointer border-0"
                      >
                        Extend 30d
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Renewal Confirmation Modal */}
      {selectedForRenewal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100 w-full max-w-md p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <h3 className="font-serif text-[18px] text-ink font-bold">
                  Annual Membership Renewal
                </h3>
                <button
                  onClick={() => setSelectedForRenewal(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-[#FAF7FF] rounded-2xl border border-purple-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Client:</span>
                  <strong className="text-ink">{selectedForRenewal.clientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Membership Plan:</span>
                  <strong className="text-[#5A2EA6]">{selectedForRenewal.membershipName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tier:</span>
                  <strong className="text-ink">{selectedForRenewal.tier}</strong>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-1.5">
                <div className="flex justify-between text-muted">
                  <span>Standard Annual Rate:</span>
                  <span>₹29,999</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>On-Time Renewal Loyalty Concession (10%):</span>
                  <span>- ₹3,000</span>
                </div>
                <div className="flex justify-between text-ink font-bold pt-2 border-t border-purple-100 text-sm">
                  <span>Final Renewal Payable:</span>
                  <strong className="font-serif text-base text-[#5A2EA6]">₹26,999</strong>
                </div>
                <span className="text-[10px] text-soft block text-center pt-1">
                  New Validity: 24 Aug 2026 → 24 Aug 2027 (12 Months Extended)
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setSelectedForRenewal(null)}
                  className="h-9 px-4 rounded-xl text-soft hover:bg-slate-100 cursor-pointer border border-slate-200 bg-white font-semibold"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleConfirmRenewal}
                  className="h-9 px-5 rounded-xl bg-[#5A2EA6] text-white font-bold"
                >
                  Confirm &amp; Extend
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default RenewalsExpiryTab;
