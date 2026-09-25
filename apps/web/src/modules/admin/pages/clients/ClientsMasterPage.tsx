import { cn } from '@salon-spa-saas/ui';
import {
  CalendarClock,
  ChevronRight,
  Clock,
  Crown,
  Layers,
  LifeBuoy,
  Star,
  UserCheck,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { customersApi } from '@/shared/api';
import { AllClientsTab, mapApiCustomerToFullRecord } from './AllClientsTab';
import { ClientProfilePage } from './ClientProfilePage';
import { ClientSegmentsTab, initialSegments } from './ClientSegmentsTab';
import { FeedbackNpsTab, initialFeedbackList } from './FeedbackNpsTab';
import { InactiveClientsTab, initialInactiveClients } from './InactiveClientsTab';
import { RetentionRebookingTab, initialRebookings } from './RetentionRebookingTab';
import { ServiceTicketsTab, initialTickets } from './ServiceTicketsTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

export type ClientsTabType = 'all' | 'segments' | 'retention' | 'inactive' | 'feedback' | 'tickets';

interface TabItem {
  id: ClientsTabType;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface ClientsMasterPageProps {
  roleTitle?: string;
  parentSection?: string;
  defaultBranch?: string;
  lockBranch?: boolean;
  branchId?: string;
  franchiseId?: string;
  hasFranchise?: boolean;
  initialTab?: ClientsTabType;
}

export function ClientsMasterPage({
  roleTitle = 'Brand Owner',
  parentSection = 'Business',
  defaultBranch = 'All',
  lockBranch = false,
  branchId,
  franchiseId,
  hasFranchise = false,
  initialTab = 'all',
}: ClientsMasterPageProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as ClientsTabType) || initialTab;
  const clientIdParam = searchParams.get('clientId');
  const [liveClientCount, setLiveClientCount] = useState<number | null>(null);
  const [inactiveCount, setInactiveCount] = useState<number>(4);
  const [retentionCount, setRetentionCount] = useState<number>(5);
  const [feedbackCount, setFeedbackCount] = useState<number>(5);
  const [ticketsCount, setTicketsCount] = useState<number>(3);
  const [activeClient, setActiveClient] = useState<any | null>(null);
  const [loadingActiveClient, setLoadingActiveClient] = useState(false);

  useEffect(() => {
    let isMounted = true;
    customersApi
      .list({
        branchId: branchId || undefined,
        franchiseId: franchiseId || undefined,
        hasFranchise: hasFranchise ? true : undefined,
        limit: 100,
      })
      .then((res) => {
        if (isMounted && Array.isArray(res)) {
          setLiveClientCount(res.length);
          if (res.length > 0) {
            const dormantOrZero = res.filter(
              (c) => (c.totalVisits ?? 0) === 0 || c.status === 'INACTIVE' || c.status === 'DORMANT',
            ).length;
            setInactiveCount(dormantOrZero || res.length);
            setRetentionCount(res.length >= 5 ? res.length : 5);
            setFeedbackCount(res.length >= 5 ? res.length : 5);
            setTicketsCount(Math.min(res.length, 3) || 3);
          }
        }
      })
      .catch((err) => {
        console.warn('ClientsMasterPage total count fetch error:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [branchId, franchiseId, hasFranchise]);

  // Dynamically fetch client details when clientIdParam is present
  useEffect(() => {
    let isMounted = true;
    if (!clientIdParam) {
      setActiveClient(null);
      return;
    }
    setLoadingActiveClient(true);
    customersApi
      .getById(clientIdParam)
      .then((res) => {
        if (isMounted && res) {
          setActiveClient(mapApiCustomerToFullRecord(res, [], []));
        }
      })
      .catch(() => {
        if (isMounted) setActiveClient(null);
      })
      .finally(() => {
        if (isMounted) setLoadingActiveClient(false);
      });
    return () => {
      isMounted = false;
    };
  }, [clientIdParam]);

  // When a client detail view is active, hide the main page header and tabs completely
  if (clientIdParam) {
    if (loadingActiveClient) {
      return (
        <div className="p-8 text-center text-sm text-slate-500">
          Loading client profile...
        </div>
      );
    }
    if (activeClient) {
      return (
        <div className="animate-in fade-in duration-200">
          <ClientProfilePage
            clientData={activeClient}
            onBack={() => {
              const nextParams = new URLSearchParams(searchParams);
              nextParams.delete('clientId');
              setSearchParams(nextParams);
            }}
            onUpdateClient={(updated) => {
              setActiveClient(updated);
            }}
          />
        </div>
      );
    }
  }

  const tabs: TabItem[] = [
    {
      id: 'all',
      label: 'All Clients',
      count: liveClientCount !== null ? liveClientCount : 0,
      icon: Users,
      description: 'Consolidated CRM master dossier',
    },
    {
      id: 'segments',
      label: 'Client Segments',
      count: initialSegments.length,
      icon: Layers,
      description: 'Dynamic behavioural cohorts',
    },
    {
      id: 'retention',
      label: 'Retention & Rebooking',
      count: retentionCount,
      icon: CalendarClock,
      description: 'Automated recurrence cycles',
    },
    {
      id: 'inactive',
      label: 'Inactive Clients',
      count: inactiveCount,
      icon: Clock,
      description: '30-180+ day dormancy recovery',
    },
    {
      id: 'feedback',
      label: 'Feedback & NPS',
      count: feedbackCount,
      icon: Star,
      description: 'CSAT ratings & sentiment scores',
    },
    {
      id: 'tickets',
      label: 'Service Tickets',
      count: ticketsCount,
      icon: LifeBuoy,
      description: 'Support SLAs & quality incidents',
    },
  ];

  const handleTabChange = (tabId: ClientsTabType) => {
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
            <span>Central Client CRM &amp; Guest Experience</span>
          </h1>
          <p className="text-xs text-muted mt-0.5 max-w-2xl">
            {lockBranch
              ? `Unified client CRM for ${defaultBranch} providing 360-degree client dossiers, household groupings, predictive rebooking cycles, win-back recovery, and NPS telemetry.`
              : hasFranchise || franchiseId
                ? 'Unified franchise CRM providing 360-degree client dossiers, household groupings, predictive rebooking cycles, win-back recovery, and NPS telemetry.'
                : 'Unified brand-wide CRM providing 360-degree client dossiers, household groupings, predictive rebooking cycles, win-back recovery, and NPS telemetry.'}
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Total Clients
              </span>
              <strong className="text-xs font-bold text-ink">
                {liveClientCount !== null ? liveClientCount : 0} Profiles
              </strong>
            </div>
          </div>

          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center font-bold text-xs">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">Brand NPS</span>
              <strong className="text-xs font-bold text-ink">+74 Score</strong>
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
          <AllClientsTab
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
            branchId={branchId}
            franchiseId={franchiseId}
            hasFranchise={hasFranchise}
          />
        )}
        {activeTabParam === 'segments' && (
          <ClientSegmentsTab
            branchId={branchId}
            franchiseId={franchiseId}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
          />
        )}
        {activeTabParam === 'retention' && (
          <RetentionRebookingTab
            branchId={branchId}
            franchiseId={franchiseId}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
          />
        )}
        {activeTabParam === 'inactive' && (
          <InactiveClientsTab
            branchId={branchId}
            franchiseId={franchiseId}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
          />
        )}
        {activeTabParam === 'feedback' && (
          <FeedbackNpsTab
            branchId={branchId}
            franchiseId={franchiseId}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
          />
        )}
        {activeTabParam === 'tickets' && (
          <ServiceTicketsTab
            branchId={branchId}
            franchiseId={franchiseId}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
          />
        )}
      </div>
    </div>
  );
}

export default ClientsMasterPage;
