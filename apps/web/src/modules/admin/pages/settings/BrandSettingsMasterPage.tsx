import { cn } from '@salon-spa-saas/ui';
import {
  Building2,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  History,
  MapPin,
  ShieldCheck,
  Sliders,
  Sparkles,
  ToggleLeft,
  UserCheck,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { AuditHistoryTab } from './AuditHistoryTab';
import { BrandControlsTab } from './BrandControlsTab';
import { BrandProfileTab } from './BrandProfileTab';
import { LocationsDefaultsTab } from './LocationsDefaultsTab';
import { OwnerProfileSecurityTab } from './OwnerProfileSecurityTab';
import { PoliciesTab } from './PoliciesTab';
import { PricingTaxTab } from './PricingTaxTab';
import { RolesPermissionsTab } from './RolesPermissionsTab';
import { WorkingHoursHolidaysTab } from './WorkingHoursHolidaysTab';
import { rolesApi } from '@/shared/api/roles.api';
import { filterSalonRoles } from '@/shared/utils/roleUtils';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

export type BrandSettingsTabType =
  | 'profile'
  | 'locations'
  | 'pricing'
  | 'policies'
  | 'hours'
  | 'roles'
  | 'controls'
  | 'audit'
  | 'owner-profile';

interface TabItem {
  id: BrandSettingsTabType;
  label: string;
  count?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function BrandSettingsMasterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as BrandSettingsTabType) || 'profile';
  const [rolesCount, setRolesCount] = useState<number | null>(null);

  useEffect(() => {
    rolesApi.list({ scope: 'TENANT', showOnFrontend: true, panel: 'ADMIN' })
      .then((roles) => {
        if (Array.isArray(roles)) {
          const salonRoles = filterSalonRoles(roles);
          setRolesCount(salonRoles.length);
        }
      })
      .catch((err) => {
        console.warn('[BrandSettingsMasterPage] Could not load roles count:', err);
      });
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'profile',
      label: 'Brand Profile',
      icon: Building2,
      description:
        'Corporate brand information, legal entities, identity tokens, and tax registrations',
    },
    {
      id: 'locations',
      label: 'Locations & Defaults',
      icon: MapPin,
      description:
        'Time zones, default currencies, date formats, and location-level configuration scope',
    },
    {
      id: 'pricing',
      label: 'Pricing & Tax',
      icon: DollarSign,
      description:
        'Pricing architecture, GST 18% slab rules, SAC codes, and cashier discount thresholds',
    },
    {
      id: 'policies',
      label: 'Policies',
      icon: FileText,
      description:
        'Business rules for pricing, refunds, package validities, memberships, consent, and no-shows',
    },
    {
      id: 'hours',
      label: 'Working Hours & Holidays',
      icon: Clock,
      description:
        '7-day operating shift windows, midday break intervals, and brand holiday closures',
    },
    // {
    //   id: 'roles',
    //   label: 'Roles & Permissions',
    //   count: rolesCount !== null ? `${rolesCount} Roles` : undefined,
    //   icon: ShieldCheck,
    //   description: 'Granular Role-Based Access Control matrix across configured roles and modules',
    // },
    {
      id: 'controls',
      label: 'Brand Controls',
      icon: Sliders,
      description: 'Centralized feature availability and non-destructive workflow toggles',
    },
    {
      id: 'audit',
      label: 'Change History',
      icon: History,
      description:
        'Immutable configuration audit trail of material pricing, policy, and permission changes',
    },
    {
      id: 'owner-profile',
      label: 'Owner Profile & Password',
      icon: UserCheck,
      description:
        'Executive credentials, direct contact details, root password rotation, 2FA, and authorized device sessions',
    },
  ];

  const handleTabChange = (tabId: BrandSettingsTabType) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabId);
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
              <span className="inline-flex items-center rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-[#E5D4FF] border border-purple-400/30">
                Enterprise Settings Center
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Brand Settings &amp; Governance
            </h1>
            <p className="text-sm text-purple-100/80 max-w-2xl">
              Centralized brand defaults, pricing models, operating policies, working hours,
              role-based access permissions, and feature controls across all network branches.
            </p>
          </div>

          {/* Quick Metrics Pill Box */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
            <div className="text-right px-2">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">
                Tenant Code
              </span>
              <strong className="text-sm font-mono font-bold text-white">DGFX-IND-HQ</strong>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-right px-2">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">
                Network Salons
              </span>
              <strong className="text-lg font-serif font-bold text-emerald-300">6 Outlets</strong>
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
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0',
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
          <span>Brand Settings</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <strong className="text-ink font-bold">{currentTabObj.label}</strong>
          <span className="text-muted hidden sm:inline">· {currentTabObj.description}</span>
        </div>
      </div>

      {/* Tab Content Rendering */}
      <div className="animate-in fade-in duration-150">
        {activeTabParam === 'profile' && <BrandProfileTab />}
        {activeTabParam === 'locations' && <LocationsDefaultsTab />}
        {activeTabParam === 'pricing' && <PricingTaxTab />}
        {activeTabParam === 'policies' && <PoliciesTab />}
        {activeTabParam === 'hours' && <WorkingHoursHolidaysTab />}
        {/* {activeTabParam === 'roles' && <RolesPermissionsTab />} */}
        {activeTabParam === 'controls' && <BrandControlsTab />}
        {activeTabParam === 'audit' && <AuditHistoryTab />}
        {activeTabParam === 'owner-profile' && <OwnerProfileSecurityTab />}
      </div>
    </div>
  );
}
