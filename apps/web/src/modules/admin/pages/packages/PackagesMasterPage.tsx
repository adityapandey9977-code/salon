import { cn } from '@salon-spa-saas/ui';
import {
  BarChart3,
  ChevronRight,
  Crown,
  Gift,
  History,
  Layers,
  Package,
  RefreshCw,
  Scissors,
  Sparkles,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { MembershipBenefitsTab } from './MembershipBenefitsTab';
import { MembershipsTab } from './MembershipsTab';
import { PackageUsageTab } from './PackageUsageTab';
import { PackagesAnalyticsTab } from './PackagesAnalyticsTab';
import { PackagesTab } from './PackagesTab';
import { RenewalsExpiryTab } from './RenewalsExpiryTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

export type PackagesTabType =
  | 'packages'
  | 'usage'
  | 'memberships'
  | 'benefits'
  | 'renewals'
  | 'analytics';

interface TabItem {
  id: PackagesTabType;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function PackagesMasterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as PackagesTabType) || 'packages';
  const [summaryStats, setSummaryStats] = useState<{ unitsSold: number; enrolledVips: number } | null>(null);
  const [counts, setCounts] = useState<{
    packages: number;
    usage: number;
    memberships: number;
    benefits: number;
    renewals: number;
  }>({
    packages: 0,
    usage: 0,
    memberships: 0,
    benefits: 0,
    renewals: 0,
  });

  useEffect(() => {
    async function fetchLiveCounts() {
      try {
        const { packagesApi } = await import('@/shared/api/packages.api');
        const { membershipsApi } = await import('@/shared/api/memberships.api');

        const [pkgs, usages, mems, bns, rens] = await Promise.allSettled([
          packagesApi.listPackages(),
          packagesApi.listUsage(),
          membershipsApi.listMemberships(),
          membershipsApi.listBenefits(),
          membershipsApi.listRenewals(),
        ]);

        const pkgList = pkgs.status === 'fulfilled' ? pkgs.value || [] : [];
        const usageList = usages.status === 'fulfilled' ? usages.value || [] : [];
        const memList = mems.status === 'fulfilled' ? mems.value || [] : [];
        const benefitList = bns.status === 'fulfilled' ? bns.value || [] : [];
        const renewalList = rens.status === 'fulfilled' ? rens.value || [] : [];

        setCounts({
          packages: pkgList.length,
          usage: usageList.length,
          memberships: memList.length,
          benefits: benefitList.length,
          renewals: renewalList.length,
        });

        const totalSold = pkgList.reduce((acc, p) => acc + (p.salesCount || 0), 0);
        const totalVips = memList.reduce((acc, m) => acc + (m.membersCount || 0), 0);
        setSummaryStats({
          unitsSold: totalSold,
          enrolledVips: totalVips,
        });
      } catch (err) {
        console.error('Failed to fetch top summary stats & counts', err);
      }
    }
    fetchLiveCounts();
  }, [searchParams]);

  const tabs: TabItem[] = [
    {
      id: 'packages',
      label: 'Service Packages',
      count: counts.packages,
      icon: Package,
      description: 'Multi-service session bundles & pricing',
    },
    {
      id: 'usage',
      label: 'Package Usage',
      count: counts.usage,
      icon: History,
      description: 'Client session redemptions & audit ledger',
    },
    {
      id: 'memberships',
      label: 'Membership Tiers',
      count: counts.memberships,
      icon: Crown,
      description: 'Annual VIP plans & recurring subscription',
    },
    {
      id: 'benefits',
      label: 'Membership Benefits',
      count: counts.benefits,
      icon: Gift,
      description: 'Discounts, retail perks & complimentary rules',
    },
    {
      id: 'renewals',
      label: 'Renewals & Expiry',
      count: counts.renewals,
      icon: RefreshCw,
      description: 'Expiring memberships & grace period pacing',
    },
    {
      id: 'analytics',
      label: 'Section Analytics',
      icon: BarChart3,
      description: 'Revenue, session burnout & branch matrix',
    },
  ];

  const handleTabChange = (tabId: PackagesTabType) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Breadcrumb & Page Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-soft mb-1 font-medium">
            <span className="text-[#5A2EA6] font-bold">Brand Owner</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-ink font-semibold">Commercial</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-[#5A2EA6] capitalize font-bold">
              {tabs.find((t) => t.id === activeTabParam)?.label}
            </span>
          </div>

          <h1 className="font-serif text-[26px] font-bold text-ink tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#5A2EA6]" />
            <span>Packages &amp; Memberships Management</span>
          </h1>
          <p className="text-xs text-muted mt-0.5 max-w-2xl">
            Centrally configure multi-session service packages, annual VIP membership tiers,
            multi-perk benefit rules, cross-branch redemptions, and renewal expiry workflows.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center font-bold text-xs">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Active Packages
              </span>
              <strong className="text-xs font-bold text-ink">
                {summaryStats?.unitsSold ?? 133} Units Sold
              </strong>
            </div>
          </div>

          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center font-bold text-xs">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Enrolled VIPs
              </span>
              <strong className="text-xs font-bold text-ink">
                {summaryStats?.enrolledVips ?? 466} Members
              </strong>
            </div>
          </div>

        </div>
      </div>

      {/* Sub-Navigation Tabs Bar with Scroller */}
      <TabScroller>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabParam === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap group shrink-0',
                isActive
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink hover:bg-purple-50/50',
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-lg grid place-items-center transition-colors',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-50 text-[#5A2EA6] group-hover:bg-purple-100',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.2 rounded-md ml-0.5',
                    isActive ? 'bg-white/20 text-white' : 'bg-purple-50 text-[#5A2EA6]',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </TabScroller>

      {/* Tab Content Panels */}
      <div>
        {activeTabParam === 'packages' && <PackagesTab />}
        {activeTabParam === 'usage' && <PackageUsageTab />}
        {activeTabParam === 'memberships' && <MembershipsTab />}
        {activeTabParam === 'benefits' && <MembershipBenefitsTab />}
        {activeTabParam === 'renewals' && <RenewalsExpiryTab />}
        {activeTabParam === 'analytics' && <PackagesAnalyticsTab />}
      </div>
    </div>
  );
}

export default PackagesMasterPage;
