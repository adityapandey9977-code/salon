import { cn } from '@salon-spa-saas/ui';
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronRight,
  DollarSign,
  FileSpreadsheet,
  Lock,
  Megaphone,
  Package,
  Receipt,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { Suspense } from 'react';
import { useSearchParams } from 'react-router';

import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

// Lazy load analytics tabs so only the active report tab is loaded on demand
const ClientRetentionAnalyticsTab = React.lazy(() =>
  import('./ClientRetentionAnalyticsTab').then((m) => ({ default: m.ClientRetentionAnalyticsTab })),
);
const CustomReportsTab = React.lazy(() =>
  import('./CustomReportsTab').then((m) => ({ default: m.CustomReportsTab })),
);
const EodShiftClosuresTab = React.lazy(() =>
  import('./EodShiftClosuresTab').then((m) => ({ default: m.EodShiftClosuresTab })),
);
const ExecutiveOverviewTab = React.lazy(() =>
  import('./ExecutiveOverviewTab').then((m) => ({ default: m.ExecutiveOverviewTab })),
);
const FranchiseAnalyticsTab = React.lazy(() =>
  import('./FranchiseAnalyticsTab').then((m) => ({ default: m.FranchiseAnalyticsTab })),
);
const InventoryAnalyticsTab = React.lazy(() =>
  import('./InventoryAnalyticsTab').then((m) => ({ default: m.InventoryAnalyticsTab })),
);
const MarketingAnalyticsTab = React.lazy(() =>
  import('./MarketingAnalyticsTab').then((m) => ({ default: m.MarketingAnalyticsTab })),
);
const OperationsAnalyticsTab = React.lazy(() =>
  import('./OperationsAnalyticsTab').then((m) => ({ default: m.OperationsAnalyticsTab })),
);
const RevenueAnalyticsTab = React.lazy(() =>
  import('./RevenueAnalyticsTab').then((m) => ({ default: m.RevenueAnalyticsTab })),
);
const StaffPerformanceAnalyticsTab = React.lazy(() =>
  import('./StaffPerformanceAnalyticsTab').then((m) => ({ default: m.StaffPerformanceAnalyticsTab })),
);

const TabSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-14 bg-white rounded-2xl border border-[#5A2EA6]/10 p-4" />
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-20 bg-white rounded-2xl border border-[#5A2EA6]/10 p-3" />
      ))}
    </div>
    <div className="h-72 bg-white rounded-2xl border border-[#5A2EA6]/10" />
  </div>
);

export type ReportsTabType =
  | 'overview'
  | 'operations'
  | 'revenue'
  | 'staff'
  | 'clients'
  | 'inventory'
  | 'marketing'
  | 'franchise'
  | 'eod'
  | 'custom';

interface TabItem {
  id: ReportsTabType;
  label: string;
  count?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface ReportsMasterPageProps {
  roleTitle?: string;
  parentSection?: string;
  defaultBranch?: string;
  lockBranch?: boolean;
  initialTab?: ReportsTabType;
}

export function ReportsMasterPage({
  roleTitle = 'Brand Owner',
  parentSection = 'Business',
  defaultBranch = 'All',
  lockBranch = false,
  initialTab = 'overview',
}: ReportsMasterPageProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as ReportsTabType) || initialTab;

  // Base tabs for Admin
  const adminTabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: BarChart3,
      description:
        'High-level multi-branch business velocity, revenue pacing, and executive health',
    },
    {
      id: 'operations',
      label: 'Operations',
      count: '9.8K Bookings',
      icon: Calendar,
      description: 'Appointment volumes, completions, cancellations, no-shows, and chair occupancy',
    },
    {
      id: 'revenue',
      label: 'Revenue',
      count: '₹1.42 Cr GMV',
      icon: DollarSign,
      description: 'Services, retail sales, packages, memberships, tax, discounts, and net revenue',
    },
    {
      id: 'staff',
      label: 'Staff Performance',
      count: '84.5% Util',
      icon: Scissors,
      description:
        'Stylist utilisation, services done, retail upsell, rebooking rates, and commissions',
    },
    {
      id: 'clients',
      label: 'Client & Retention',
      count: '73% Repeat',
      icon: Users,
      description: 'New vs repeat cohorts, visit frequency, lifetime value, and churn risk',
    },
    {
      id: 'inventory',
      label: 'Inventory',
      count: '₹28.4L Stock',
      icon: Package,
      description: 'Stockholding value, usage, wastage discrepancies, and recipe vs actual yield',
    },
    {
      id: 'marketing',
      label: 'Marketing',
      count: '7.2x ROI',
      icon: Megaphone,
      description: 'Audience reach, campaign bookings, attendance, revenue, and coupon redemptions',
    },
    {
      id: 'franchise',
      label: 'Franchise',
      count: '18 Outlets',
      icon: Building2,
      description: 'Licensed partner scorecard, gross turnover, royalty fees, and compliance',
    },
    {
      id: 'eod',
      label: 'EOD Shift Closures',
      count: 'Audit Logs',
      icon: Receipt,
      description: 'Cashier drawer count, physical float reconciliation, and immutable day ledgers',
    },
    {
      id: 'custom',
      label: 'Custom Reports',
      icon: FileSpreadsheet,
      description: 'Dynamic report builder with custom dimensions, measures, and saved queries',
    },
  ];

  // Branch Manager tabs: Excludes Franchise (HQ-only) and prioritizes EOD Shift Closures
  const branchManagerTabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: BarChart3,
      description: `Velocity, revenue pacing, and operational health for ${defaultBranch}`,
    },
    {
      id: 'operations',
      label: 'Operations & Floor',
      count: '1.8K Bookings',
      icon: Calendar,
      description: 'Appointment volumes, completions, cancellations, no-shows, and chair occupancy',
    },
    {
      id: 'revenue',
      label: 'Revenue & POS',
      count: '₹38.45L GMV',
      icon: DollarSign,
      description: 'Services, retail sales, packages, memberships, tax, discounts, and net revenue',
    },
    {
      id: 'staff',
      label: 'Staff Performance',
      count: '86.4% Util',
      icon: Scissors,
      description:
        'Stylist utilisation, services done, retail upsell, rebooking rates, and commissions',
    },
    {
      id: 'clients',
      label: 'Client & Retention',
      count: '78% Repeat',
      icon: Users,
      description: 'New vs repeat cohorts, visit frequency, lifetime value, and churn risk',
    },
    {
      id: 'inventory',
      label: 'Inventory & Dispensary',
      count: '₹6.8L Stock',
      icon: Package,
      description: 'Stockholding value, usage, wastage discrepancies, and recipe vs actual yield',
    },
    {
      id: 'marketing',
      label: 'Marketing',
      count: '8.4x ROI',
      icon: Megaphone,
      description: 'Audience reach, campaign bookings, attendance, revenue, and coupon redemptions',
    },
    {
      id: 'eod',
      label: 'EOD Shift Closures',
      count: 'Verified',
      icon: Receipt,
      description: 'Cashier drawer count, physical float reconciliation, and immutable day ledgers',
    },
    {
      id: 'custom',
      label: 'Custom Reports',
      icon: FileSpreadsheet,
      description: 'Dynamic report builder with custom dimensions, measures, and saved queries',
    },
  ];

  const tabs = lockBranch ? branchManagerTabs : adminTabs;

  const handleTabChange = (tabId: ReportsTabType) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabId);
    setSearchParams(nextParams);
  };

  const currentTabObj = tabs.find((t) => t.id === activeTabParam) || tabs[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16 animate-in fade-in duration-300">
      {/* Brand Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2D1552] via-[#45207A] to-[#5A2EA6] p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 h-48 w-48 rounded-full bg-[#E5D4FF]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-0.5 text-xs font-semibold text-[#E5D4FF] border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                {lockBranch ? `Branch Manager · ${defaultBranch}` : 'Brand Owner / Head Office'}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                {lockBranch ? 'Live Outlet Analytics' : 'Live Multi-Branch Analytics'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Reports &amp; Business Intelligence
            </h1>
            <p className="text-sm text-purple-100/80 max-w-2xl">
              {lockBranch
                ? `Operational intelligence for ${defaultBranch} across floor appointments, revenue streams, stylist productivity, client retention, inventory, and cashier shift reconciliation.`
                : 'Cross-module executive intelligence across operations, revenue streams, staff productivity, client retention, inventory, marketing campaigns, and franchise scorecards.'}
            </p>
          </div>

          {/* Quick Metrics Pill Box */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
            <div className="text-right px-2">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">
                {lockBranch ? 'Outlet GMV' : 'Network GMV'}
              </span>
              <strong className="text-lg font-serif font-bold text-white">
                {lockBranch ? '₹38.45L' : '₹1.42 Cr'}
              </strong>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-right px-2">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">
                Completed
              </span>
              <strong className="text-lg font-serif font-bold text-emerald-300">
                {lockBranch ? '1,840 Visits' : '8,420 Visits'}
              </strong>
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
          <span className="text-[#5A2EA6] font-bold">{roleTitle}</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <span className="text-ink font-semibold">{parentSection}</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <strong className="text-ink font-bold">{currentTabObj.label}</strong>
          <span className="text-muted hidden sm:inline">· {currentTabObj.description}</span>
        </div>
      </div>

      {/* Tab Content Rendering */}
      <div className="animate-in fade-in duration-150">
        <Suspense fallback={<TabSkeleton />}>
          {activeTabParam === 'overview' && (
            <ExecutiveOverviewTab
              onNavigateTab={(tab) => handleTabChange(tab as ReportsTabType)}
              defaultBranch={defaultBranch}
              lockBranch={lockBranch}
            />
          )}
          {activeTabParam === 'operations' && (
            <OperationsAnalyticsTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
          )}
          {activeTabParam === 'revenue' && (
            <RevenueAnalyticsTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
          )}
          {activeTabParam === 'staff' && (
            <StaffPerformanceAnalyticsTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
          )}
          {activeTabParam === 'clients' && <ClientRetentionAnalyticsTab />}
          {activeTabParam === 'inventory' && (
            <InventoryAnalyticsTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
          )}
          {activeTabParam === 'marketing' && <MarketingAnalyticsTab />}
          {activeTabParam === 'franchise' && !lockBranch && <FranchiseAnalyticsTab />}
          {activeTabParam === 'eod' && (
            <EodShiftClosuresTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
          )}
          {activeTabParam === 'custom' && <CustomReportsTab />}
        </Suspense>
      </div>
    </div>
  );
}

export default ReportsMasterPage;
