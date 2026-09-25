import { cn } from '@salon-spa-saas/ui';
import {
  BarChart3,
  Building2,
  Calendar,
  Clock,
  Layers,
  MapPin,
  Sparkles,
  Store,
  TrendingUp,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { AllBranchesTab } from '../../admin/pages/locations/AllBranchesTab';
import { BranchComparisonTab } from '../../admin/pages/locations/BranchComparisonTab';
import { BranchPerformanceTab } from '../../admin/pages/locations/BranchPerformanceTab';
import { HolidaysTab } from '../../admin/pages/locations/HolidaysTab';
import { WorkingHoursTab } from '../../admin/pages/locations/WorkingHoursTab';

export type LocationsTabType = 'all' | 'performance' | 'comparison' | 'working-hours' | 'holidays';

export function MyLocationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as LocationsTabType) || 'all';
  const branchParam = searchParams.get('branch') || '';

  const [activeTab, setActiveTab] = useState<LocationsTabType>(initialTab);
  const [targetBranchName, setTargetBranchName] = useState<string>(branchParam);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as LocationsTabType;
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: LocationsTabType, branchName?: string) => {
    setActiveTab(tab);
    if (branchName) {
      setTargetBranchName(branchName);
      setSearchParams({ tab, branch: branchName });
    } else {
      setSearchParams({ tab });
    }
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-12">
      {/* Top Section Header & Sub-Navigation Nested Menu */}
      <div className="bg-white/95 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[11px] font-bold tracking-wide uppercase mb-1.5 border border-[#5A2EA6]/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>Franchise Network Locations</span>
            </div>
            <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
              Franchise Outlets &amp; Locations Master Desk
            </h1>
            <p className="text-[13px] text-muted mt-0.5">
              Comprehensive control plane for franchise outlet performance, comparative
              benchmarking, working envelopes, and holiday schedules.
            </p>
          </div>
        </div>

        {/* Nested Sub-Menu Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'all' as const, label: 'All Branches', icon: Store },
            { id: 'performance' as const, label: 'Branch Performance', icon: TrendingUp },
            { id: 'comparison' as const, label: 'Branch Comparison', icon: BarChart3 },
            { id: 'working-hours' as const, label: 'Working Hours', icon: Clock },
            { id: 'holidays' as const, label: 'Holidays', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none whitespace-nowrap',
                  isActive
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                    : 'bg-[#FCFAFF] text-soft hover:text-ink hover:bg-slate-100 border-[#5A2EA6]/15',
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-View */}
      {activeTab === 'all' && (
        <AllBranchesTab
          isFranchisePortal={true}
          onNavigateToPerformance={(branchName) => handleTabChange('performance', branchName)}
          onNavigateToWorkingHours={(branchName) => handleTabChange('working-hours', branchName)}
        />
      )}

      {activeTab === 'performance' && <BranchPerformanceTab defaultBranchName={targetBranchName} />}

      {activeTab === 'comparison' && <BranchComparisonTab />}

      {activeTab === 'working-hours' && <WorkingHoursTab defaultBranchName={targetBranchName} />}

      {activeTab === 'holidays' && <HolidaysTab />}
    </div>
  );
}

export default MyLocationsPage;
