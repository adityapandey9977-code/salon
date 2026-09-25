import { cn } from '@salon-spa-saas/ui';
import {
  Activity,
  BarChart3,
  Calendar,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useSearchParams } from 'react-router';
import { AppointmentCalendarTab } from '../../admin/pages/operations/AppointmentCalendarTab';
import { AppointmentsTab } from '../../admin/pages/operations/AppointmentsTab';
import { AvailabilityTab } from '../../admin/pages/operations/AvailabilityTab';
import { HomeServiceTab } from '../../admin/pages/operations/HomeServiceTab';
import { OperationsOverviewTab } from '../../admin/pages/operations/OperationsOverviewTab';
import { ServiceDeliveryTab } from '../../admin/pages/operations/ServiceDeliveryTab';
import { WalkinsQueueTab } from '../../admin/pages/operations/WalkinsQueueTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';
import { tokenStorage } from '@/shared/api/client';

export type OperationsTabType =
  | 'calendar'
  | 'appointments'
  | 'queue'
  | 'availability'
  | 'delivery'
  | 'homeservice'
  | 'overview';

interface TabItem {
  id: OperationsTabType;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function AppointmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as OperationsTabType) || 'calendar';

  const franchiseId =
    tokenStorage.getFranchiseId() ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('digiflex_franchise_id') : null) ||
    undefined;

  const tabs: TabItem[] = [
    {
      id: 'calendar',
      label: 'Appointment Calendar',
      icon: Calendar,
      description: 'Master booking schedule & chair allocation',
    },
    {
      id: 'appointments',
      label: 'Appointments',
      count: 310,
      icon: CalendarDays,
      description: 'Omni-channel booking ledger & deposits',
    },
    {
      id: 'queue',
      label: 'Walk-ins & Queue',
      count: 6,
      icon: Users,
      description: 'Live floor queue pacing & wait times',
    },
    {
      id: 'availability',
      label: 'Availability',
      icon: Clock,
      description: 'Staff & resource capacity matrix',
    },
    {
      id: 'delivery',
      label: 'Service Delivery',
      icon: Scissors,
      description: 'Live checklists, timer & consent safety',
    },
    {
      id: 'homeservice',
      label: 'Home Service',
      count: 2,
      icon: Car,
      description: 'Doorstep appointments, routes & OTP',
    },
    {
      id: 'overview',
      label: 'Operations Analytics',
      icon: BarChart3,
      description: 'Occupancy & multi-branch comparison',
    },
  ];

  const handleTabChange = (tabId: OperationsTabType) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Breadcrumb & Page Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-soft mb-1 font-medium">
            <span className="text-[#5A2EA6] font-bold">Franchise Network</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-ink font-semibold">Operations &amp; Staff</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-[#5A2EA6] capitalize font-bold">
              {tabs.find((t) => t.id === activeTabParam)?.label}
            </span>
          </div>

          <h1 className="font-serif text-[26px] font-bold text-ink tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-[#5A2EA6]" />
            <span>Operations &amp; Floor Execution Management</span>
          </h1>
          <p className="text-xs text-muted mt-0.5 max-w-2xl">
            Centralized monitoring of multi-branch bookings, chair occupancy, walk-in queue pacing,
            resource availability, live service delivery checklists, and home salon dispatch.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center font-bold text-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Today's Bookings
              </span>
              <strong className="text-xs font-bold text-ink">48 Appointments</strong>
            </div>
          </div>

          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center font-bold text-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Occupancy Rate
              </span>
              <strong className="text-xs font-bold text-ink">86.4% Active</strong>
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
        {activeTabParam === 'calendar' && <AppointmentCalendarTab franchiseId={franchiseId} />}
        {activeTabParam === 'appointments' && <AppointmentsTab />}
        {activeTabParam === 'queue' && <WalkinsQueueTab />}
        {activeTabParam === 'availability' && <AvailabilityTab />}
        {activeTabParam === 'delivery' && <ServiceDeliveryTab />}
        {activeTabParam === 'homeservice' && <HomeServiceTab />}
        {activeTabParam === 'overview' && <OperationsOverviewTab />}
      </div>
    </div>
  );
}

export default AppointmentsPage;
