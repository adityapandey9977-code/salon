import { cn } from '@salon-spa-saas/ui';
import {
  Award,
  Building2,
  ChevronRight,
  FileCheck,
  FileSpreadsheet,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { AgreementsComplianceTab } from './AgreementsComplianceTab';
import { CommissionsRoyaltiesTab } from './CommissionsRoyaltiesTab';
import { FranchiseLocationsTab } from './FranchiseLocationsTab';
import { FranchiseOverviewTab } from './FranchiseOverviewTab';
import { FranchisePartnersTab } from './FranchisePartnersTab';
import { FranchiseReportsTab } from './FranchiseReportsTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';
import { tenantsApi } from '@/shared/api/tenants.api';
import { tokenStorage } from '@/shared/api/client';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '@/shared/context/AuthContext';

export type FranchiseTabType =
  | 'overview'
  | 'partners'
  | 'locations'
  | 'agreements'
  | 'royalties'
  | 'reports';

interface TabItem {
  id: FranchiseTabType;
  label: string;
  count?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function FranchiseMasterPage() {
  const { salon } = useAdmin();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as FranchiseTabType) || 'overview';

  const [partnersCount, setPartnersCount] = useState<number>(0);
  const [locationsCount, setLocationsCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const activeTenantId = salon?.id || user?.tenantId || tokenStorage.getTenantId();
        const [partnersRes, branchesRes] = await Promise.allSettled([
          tenantsApi.listFranchises(false, activeTenantId || undefined),
          tenantsApi.listBranches(activeTenantId || undefined),
        ]);

        const partners =
          partnersRes.status === 'fulfilled' && Array.isArray(partnersRes.value)
            ? partnersRes.value
            : [];
        const branches =
          branchesRes.status === 'fulfilled' && Array.isArray(branchesRes.value)
            ? branchesRes.value
            : [];

        // Count partners strictly associated with this tenant
        const tenantPartners = partners.filter((p: any) => {
          if (!activeTenantId) return false;
          const pTenantId = p.tenantId || p.tenant?.id;
          return pTenantId === activeTenantId;
        });

        // Filter branches strictly associated with this tenant
        const tenantBranches = branches.filter((b: any) => {
          if (!activeTenantId) return false;
          return !b.tenantId || b.tenantId === activeTenantId;
        });

        // Count franchise locations for this tenant's franchise partners
        const franchisePartnerIds = new Set(tenantPartners.map((p: any) => p.id));
        const franchiseBranchKeys = new Set<string>();
        tenantPartners.forEach((p: any) => {
          if (Array.isArray(p.branches)) {
            p.branches.forEach((b: any) => {
              if (b?.id) franchiseBranchKeys.add(b.id);
            });
          }
        });
        tenantBranches.forEach((b: any) => {
          const isFr = Boolean(
            b.isFranchiseOwned ||
            (b.franchiseId && franchisePartnerIds.has(b.franchiseId)) ||
            (b.franchisePartnerId && franchisePartnerIds.has(b.franchisePartnerId)),
          );
          if (isFr && b.id) {
            franchiseBranchKeys.add(b.id);
          }
        });

        if (isMounted) {
          setPartnersCount(tenantPartners.length);
          setLocationsCount(franchiseBranchKeys.size);
        }
      } catch (err) {
        console.warn('Error fetching initial franchise counts:', err);
      }
    };

    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, [salon?.id, user?.tenantId]);

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Franchise Overview',
      icon: Building2,
      description: 'Centralized franchise performance, network expansion, and compliance health',
    },
    {
      id: 'partners',
      label: 'Franchise Partners',
      count: `${partnersCount} ${partnersCount === 1 ? 'Partner' : 'Partners'}`,
      icon: Users,
      description:
        'Partner entity register, leadership contacts, outlet custody, and commercial terms',
    },
    {
      id: 'locations',
      label: 'Franchise Locations',
      count: `${locationsCount} ${locationsCount === 1 ? 'Outlet' : 'Outlets'}`,
      icon: Store,
      description:
        'Franchise outlet directory, branch managers, customer footfall, and GMV revenue',
    },
    {
      id: 'agreements',
      label: 'Agreements & Compliance',
      count: '16 Active',
      icon: FileCheck,
      description:
        'Contractual terms, legal tenures, renewal checkpoints, and statutory audit compliance',
    },
    {
      id: 'royalties',
      label: 'Commissions & Royalties',
      count: '₹8.65L Fee',
      icon: Award,
      description: 'Brand fee computations, 10% royalty accrual, and settlement monitoring ledger',
    },
    {
      id: 'reports',
      label: 'Franchise Reports',
      icon: FileSpreadsheet,
      description:
        'Multi-category franchise intelligence with multi-format CSV, Excel, and PDF exports',
    },
  ];

  const handleTabChange = (tabId: FranchiseTabType, filter?: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabId);
    if (filter) {
      nextParams.set('filter', filter);
    } else {
      nextParams.delete('filter');
    }
    setSearchParams(nextParams);
  };

  const currentTabObj = tabs.find((t) => t.id === activeTabParam) || tabs[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Brand Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2D1552] via-[#45207A] to-[#5A2EA6] p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 h-48 w-48 rounded-full bg-[#E5D4FF]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-0.5 text-xs font-semibold text-[#E5D4FF] border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                Brand Owner / Head Office
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                {locationsCount} Franchise {locationsCount === 1 ? 'Outlet' : 'Outlets'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Franchise &amp; Partner Network
            </h1>
            <p className="text-sm text-purple-100/80 max-w-2xl">
              Centralized brand governance over franchise partners, territory outlets, statutory
              compliance agreements, and royalty fee accruals across all cities.
            </p>
          </div>

          {/* Quick Metrics Pill Box */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
            <div className="text-right px-2">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">
                Network GMV
              </span>
              <strong className="text-lg font-serif font-bold text-white">₹86.5L</strong>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-right px-2">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">
                Brand Royalty
              </span>
              <strong className="text-lg font-serif font-bold text-amber-300">₹8.65L</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar with Scroller */}
      <TabScroller>
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTabParam === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0',
                isActive
                  ? 'bg-[#5A2EA6] text-white shadow-sm ring-1 ring-[#5A2EA6]'
                  : 'text-slate-700 hover:bg-[#5A2EA6]/5 hover:text-[#5A2EA6]',
              )}
            >
              <IconComp className={cn('w-4 h-4', isActive ? 'text-white' : 'text-[#5A2EA6]')} />
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-extrabold',
                    isActive ? 'bg-white/20 text-white' : 'bg-[#5A2EA6]/10 text-[#5A2EA6]',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </TabScroller>

      {/* Tab Header Description */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs text-soft font-semibold">
          <span>Franchise</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <strong className="text-ink font-bold">{currentTabObj.label}</strong>
          <span className="text-muted hidden sm:inline">· {currentTabObj.description}</span>
        </div>
      </div>

      {/* Tab Content Rendering */}
      <div className="animate-in fade-in duration-150">
        {activeTabParam === 'overview' && (
          <FranchiseOverviewTab
            onNavigateTab={(tab, filter) => handleTabChange(tab as FranchiseTabType, filter)}
            partnersCount={partnersCount}
            locationsCount={locationsCount}
          />
        )}
        {activeTabParam === 'partners' && (
          <FranchisePartnersTab onCountChange={(cnt) => setPartnersCount(cnt)} />
        )}
        {activeTabParam === 'locations' && (
          <FranchiseLocationsTab onCountChange={(cnt) => setLocationsCount(cnt)} />
        )}
        {activeTabParam === 'agreements' && <AgreementsComplianceTab />}
        {activeTabParam === 'royalties' && <CommissionsRoyaltiesTab />}
        {activeTabParam === 'reports' && <FranchiseReportsTab />}
      </div>
    </div>
  );
}
