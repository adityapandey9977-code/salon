import { cn } from '@salon-spa-saas/ui';
import {
  Activity,
  Award,
  CalendarClock,
  ChevronRight,
  Clock,
  Percent,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { staffApi } from '@/shared/api';
import { AllStaffTab } from './AllStaffTab';
import { AttendanceLeaveTab } from './AttendanceLeaveTab';
import { ProductivityUtilisationTab } from './ProductivityUtilisationTab';
import { ShiftsRosterTab } from './ShiftsRosterTab';
import { StaffCommissionTab } from './StaffCommissionTab';
import { StaffPerformanceTab } from './StaffPerformanceTab';
import { StaffProfilePage, masterStaffRecords } from './StaffProfilePage';
import { StaffTargetsTab } from './StaffTargetsTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

export type StaffTabType =
  | 'all'
  | 'performance'
  | 'roster'
  | 'attendance'
  | 'targets'
  | 'commission'
  | 'productivity';

interface TabItem {
  id: StaffTabType;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface StaffMasterPageProps {
  roleTitle?: string;
  parentSection?: string;
  defaultBranch?: string;
  branchId?: string;
  lockBranch?: boolean;
  initialTab?: StaffTabType;
}

export function StaffMasterPage({
  roleTitle = 'Brand Owner',
  parentSection = 'Business',
  defaultBranch = 'All',
  branchId,
  lockBranch = false,
  initialTab = 'all',
}: StaffMasterPageProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [liveStaffCount, setLiveStaffCount] = useState(0);

  useEffect(() => {
    staffApi
      .list()
      .then((list) => {
        if (Array.isArray(list)) {
          setLiveStaffCount(list.length);
        }
      })
      .catch(() => {});
  }, []);

  const activeTabParam = (searchParams.get('tab') as StaffTabType) || initialTab;
  const staffIdParam = searchParams.get('staffId');

  // When a staff detail view is active, render StaffProfilePage
  if (staffIdParam) {
    return (
      <div className="animate-in fade-in duration-200">
        <StaffProfilePage
          onBack={() => {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete('staffId');
            setSearchParams(nextParams);
          }}
        />
      </div>
    );
  }

  const tabs: TabItem[] = [
    {
      id: 'all',
      label: 'All Staff',
      count: liveStaffCount || masterStaffRecords.length,
      icon: Users,
      description: 'Central staff directory & profiles',
    },

    {
      id: 'performance',
      label: 'Staff Performance',
      icon: TrendingUp,
      description: 'Revenue & leaderboard analytics',
    },
    {
      id: 'roster',
      label: 'Shifts & Roster',
      icon: CalendarClock,
      description: 'Weekly scheduling & floor shifts',
    },
    {
      id: 'attendance',
      label: 'Attendance & Leave',
      icon: Clock,
      description: 'Biometric punches & leave requests',
    },
    {
      id: 'targets',
      label: 'Targets',
      icon: Target,
      description: 'Service & retail quotas',
    },
    {
      id: 'commission',
      label: 'Commission',
      icon: Percent,
      description: 'Incentives, splits & approvals',
    },
    {
      id: 'productivity',
      label: 'Productivity & Utilisation',
      icon: Activity,
      description: 'Chair occupancy & floor efficiency',
    },
  ];

  const handleTabChange = (tabId: StaffTabType) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Breadcrumb & Page Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-soft mb-1 font-medium">
            <span className="text-[#5A2EA6] font-bold">{roleTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-ink font-semibold">{parentSection}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-[#5A2EA6] capitalize font-bold">
              {tabs.find((t) => t.id === activeTabParam)?.label}
            </span>
          </div>

          <h1 className="font-serif text-[26px] font-bold text-ink tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#5A2EA6]" />
            <span>Staff &amp; Human Capital Management</span>
          </h1>
          <p className="text-xs text-muted mt-0.5 max-w-2xl">
            {lockBranch
              ? `Operational management of ${defaultBranch} stylists, certified skill hierarchies, weekly shifts, biometric attendance, quota targets, multi-tier commission splits, and floor productivity telemetry.`
              : 'Brand-wide staff operations, certified skill hierarchies, weekly shifts, biometric attendance, quota targets, multi-tier commission splits, and floor productivity telemetry.'}
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center font-bold text-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">Total Staff</span>
              <strong className="text-xs font-bold text-ink">
                {masterStaffRecords.length} Specialists
              </strong>
            </div>
          </div>

          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center font-bold text-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Avg Utilisation
              </span>
              <strong className="text-xs font-bold text-ink">84.2% Occupancy</strong>
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
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap group shrink-0',
                isActive
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink hover:bg-purple-50/50',
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-lg grid place-items-center transition-colors',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-50 text-[#5A2EA6] group-hover:bg-purple-100',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.2 rounded-md ml-1',
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
        {activeTabParam === 'all' && (
          <AllStaffTab defaultBranch={defaultBranch} branchId={branchId} lockBranch={lockBranch} />
        )}
        {activeTabParam === 'performance' && (
          <StaffPerformanceTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
        )}
        {activeTabParam === 'roster' && (
          <ShiftsRosterTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
        )}
        {activeTabParam === 'attendance' && (
          <AttendanceLeaveTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
        )}
        {activeTabParam === 'targets' && (
          <StaffTargetsTab defaultBranch={defaultBranch} lockBranch={lockBranch} />
        )}
        {activeTabParam === 'commission' && <StaffCommissionTab />}
        {activeTabParam === 'productivity' && <ProductivityUtilisationTab />}
      </div>
    </div>
  );
}

export default StaffMasterPage;
