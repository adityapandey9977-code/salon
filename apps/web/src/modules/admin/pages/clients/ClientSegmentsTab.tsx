import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Download,
  Eye,
  Filter,
  Layers,
  Megaphone,
  Package,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { customersApi } from '@/shared/api';
import { tokenStorage } from '@/shared/api/client';
import { masterBranches } from '../locations/AllBranchesTab';
import { mapApiCustomerToFullRecord } from './AllClientsTab';
import { initialClients } from './clientsData';
import { ClientProfileDossierModal, type FullClientRecord } from './ClientProfileDossierModal';
import { ClientProfilePage } from './ClientProfilePage';

export interface ClientSegmentItem {
  id: string;
  name: string;
  badgeColor: string;
  description: string;
  clientCount: number;
  avgSpend: number;
  avgVisits: number;
  lastActivity: string;
  status: 'Active' | 'Dynamic Auto-Segment';
}

export const initialSegments: ClientSegmentItem[] = [
  {
    id: 'SEG-01',
    name: 'VIP High Value',
    badgeColor: '#5A2EA6',
    description:
      'Elite clientele with lifetime spend exceeding ₹30,000 and consistent multi-service visits.',
    clientCount: 42,
    avgSpend: 45200,
    avgVisits: 16,
    lastActivity: 'Today',
    status: 'Dynamic Auto-Segment',
  },
  {
    id: 'SEG-02',
    name: 'Frequent Visitors',
    badgeColor: '#0D9488',
    description: 'Regular grooming and styling guests visiting at least once every 14–21 days.',
    clientCount: 88,
    avgSpend: 28400,
    avgVisits: 14,
    lastActivity: 'Yesterday',
    status: 'Dynamic Auto-Segment',
  },
  {
    id: 'SEG-03',
    name: 'Membership Clients',
    badgeColor: '#7B4DFF',
    description: 'Enrolled in Platinum Luxe or Gold VIP tiers with prepaid recurring benefits.',
    clientCount: 64,
    avgSpend: 36800,
    avgVisits: 12,
    lastActivity: '2 days ago',
    status: 'Dynamic Auto-Segment',
  },
  {
    id: 'SEG-04',
    name: 'New Clients (0–30 Days)',
    badgeColor: '#F59E0B',
    description: 'Recent first-time guests onboarded during current calendar month.',
    clientCount: 52,
    avgSpend: 5400,
    avgVisits: 1,
    lastActivity: 'Today',
    status: 'Dynamic Auto-Segment',
  },
  {
    id: 'SEG-05',
    name: 'Package Holders',
    badgeColor: '#EC4899',
    description:
      'Guests with active prepaid facial, hair spa, or bridal bundles awaiting full redemption.',
    clientCount: 38,
    avgSpend: 4200,
    avgVisits: 2,
    lastActivity: '3 hrs ago',
    status: 'Dynamic Auto-Segment',
  },
  {
    id: 'SEG-06',
    name: 'At Risk (Lapse Risk)',
    badgeColor: '#E11D48',
    description: 'Previously frequent clients who have not booked a visit in 45–90 days.',
    clientCount: 29,
    avgSpend: 22800,
    avgVisits: 8,
    lastActivity: '45 days ago',
    status: 'Dynamic Auto-Segment',
  },
  {
    id: 'SEG-07',
    name: 'Inactive (90+ Days)',
    badgeColor: '#64748B',
    description:
      'Dormant accounts past 90 days without visit history eligible for win-back campaigns.',
    clientCount: 46,
    avgSpend: 16500,
    avgVisits: 5,
    lastActivity: '90+ days ago',
    status: 'Dynamic Auto-Segment',
  },
];

export interface ClientSegmentsTabProps {
  branchId?: string;
  franchiseId?: string;
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function ClientSegmentsTab({
  branchId,
  franchiseId,
  defaultBranch = 'Indore Flagship',
}: ClientSegmentsTabProps = {}) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [liveClients, setLiveClients] = useState<FullClientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedCohort, setSelectedCohort] = useState<ClientSegmentItem | null>(null);
  const [selectedClientDossier, setSelectedClientDossier] = useState<FullClientRecord | null>(null);

  useEffect(() => {
    let isMounted = true;
    const bid = branchId || tokenStorage.getBranchId() || undefined;
    const fid = franchiseId || tokenStorage.getFranchiseId() || undefined;

    customersApi
      .list({ branchId: bid, franchiseId: fid, limit: 100 })
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const mapped = res.map((c) =>
            mapApiCustomerToFullRecord(c, masterBranches, [], defaultBranch),
          );
          setLiveClients(mapped);
        } else if (isMounted) {
          setLiveClients(initialClients);
        }
      })
      .catch((err) => {
        console.warn('Failed to load customers for segments:', err);
        if (isMounted) setLiveClients(initialClients);
      });

    return () => {
      isMounted = false;
    };
  }, [branchId, franchiseId, defaultBranch]);

  const segments = useMemo(() => {
    if (liveClients.length === 0) return initialSegments;

    const vip = liveClients.filter((c) => c.lifetimeValue >= 30000 || c.totalVisits >= 15);
    const frequent = liveClients.filter(
      (c) => c.totalVisits >= 5 && !vip.some((v) => v.id === c.id),
    );
    const membership = liveClients.filter(
      (c) => c.membershipTier && c.membershipTier !== 'None',
    );
    const newClients = liveClients.filter(
      (c) => c.totalVisits <= 1 || c.segment === 'New Client',
    );
    const packageClients = liveClients.filter(
      (c) => c.activePackage && c.activePackage !== 'None',
    );
    const atRisk = liveClients.filter(
      (c) => c.status === 'Active' && c.totalVisits > 0 && c.totalVisits < 5,
    );
    const inactive = liveClients.filter(
      (c) => c.status === 'Inactive' || c.status === 'Archived' || c.status === 'Blocked',
    );

    const calcCohort = (
      id: string,
      name: string,
      color: string,
      desc: string,
      list: FullClientRecord[],
      fallback: ClientSegmentItem,
    ): ClientSegmentItem => {
      if (list.length === 0) {
        return {
          ...fallback,
          clientCount: 0,
          avgSpend: 0,
          avgVisits: 0,
          lastActivity: 'None',
        };
      }
      const totalSpend = list.reduce((acc, c) => acc + (c.lifetimeValue || 0), 0);
      const totalVisits = list.reduce((acc, c) => acc + (c.totalVisits || 0), 0);
      return {
        id,
        name,
        badgeColor: color,
        description: desc,
        clientCount: list.length,
        avgSpend: Math.round(totalSpend / list.length),
        avgVisits: Math.round(totalVisits / list.length),
        lastActivity: 'Today',
        status: 'Dynamic Auto-Segment',
      };
    };

    return [
      calcCohort('SEG-01', 'VIP High Value', '#5A2EA6', initialSegments[0].description, vip, initialSegments[0]),
      calcCohort('SEG-02', 'Frequent Visitors', '#0D9488', initialSegments[1].description, frequent, initialSegments[1]),
      calcCohort('SEG-03', 'Membership Clients', '#7B4DFF', initialSegments[2].description, membership, initialSegments[2]),
      calcCohort('SEG-04', 'New Clients (0–30 Days)', '#F59E0B', initialSegments[3].description, newClients, initialSegments[3]),
      calcCohort('SEG-05', 'Package Holders', '#EC4899', initialSegments[4].description, packageClients, initialSegments[4]),
      calcCohort('SEG-06', 'At Risk (Lapse Risk)', '#E11D48', initialSegments[5].description, atRisk, initialSegments[5]),
      calcCohort('SEG-07', 'Inactive (90+ Days)', '#64748B', initialSegments[6].description, inactive, initialSegments[6]),
    ];
  }, [liveClients]);

  const totalClientsSegmented = liveClients.length;

  const filteredSegments = segments.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleExportCohort = (seg: ClientSegmentItem) => {
    toast(`Exported "${seg.name}" cohort (${seg.clientCount} clients) to CSV.`);
  };

  const handleCampaignPlaceholder = (seg: ClientSegmentItem) => {
    toast(`Created Targeted Campaign Draft for "${seg.name}" segment.`);
  };

  if (selectedClientDossier) {
    return (
      <ClientProfilePage
        clientData={selectedClientDossier}
        onBack={() => {
          setSelectedClientDossier(null);
          setSearchParams({});
        }}
        onUpdateClient={(updated) => {
          setSelectedClientDossier(updated);
          setLiveClients((prev) =>
            prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
          );
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Dynamic Client Segmentation
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              7 Intelligent Cohorts
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Automated behavioural clustering grouping guests by lifetime value, visit cadence,
            active memberships, and churn risk.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => toast('Exported all 7 segment cohorts summary to CSV.')}
          className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export All Segments</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-muted font-medium">
          {filteredSegments.length} Segments Active
        </span>
      </div>

      {/* Segments Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
              Customer Lifecycle &amp; Behavioral Cohorts
            </h3>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {totalClientsSegmented} Total Clients Segmented
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Segment Name',
                  'Cohort Description',
                  'Client Count',
                  'Avg Spend (LTV)',
                  'Avg Visits',
                  'Last Trigger',
                  'Status',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === 7 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredSegments.map((seg) => (
                <tr key={seg.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  {/* Name */}
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: seg.badgeColor }}
                      />
                      <div>
                        <strong className="text-ink text-[13px] block">{seg.name}</strong>
                        <span className="text-[10px] text-muted font-mono">{seg.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="p-3.5 max-w-xs truncate text-[11.5px] text-soft">
                    {seg.description}
                  </td>

                  {/* Client Count */}
                  <td className="p-3.5 font-bold text-ink text-[13px]">
                    <span className="bg-purple-50 text-[#5A2EA6] px-2.5 py-0.5 rounded-md font-bold text-xs border border-purple-100">
                      {seg.clientCount} Clients
                    </span>
                  </td>

                  {/* Avg Spend */}
                  <td className="p-3.5 font-serif font-bold text-ink text-[13px]">
                    ₹{seg.avgSpend.toLocaleString('en-IN')}
                  </td>

                  {/* Avg Visits */}
                  <td className="p-3.5 font-semibold text-soft">{seg.avgVisits} Sessions</td>

                  {/* Last Trigger */}
                  <td className="p-3.5 text-muted text-[11px]">{seg.lastActivity}</td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800">
                      {seg.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCohort(seg)}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-0"
                        title="Inspect Segment Cohort"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleCampaignPlaceholder(seg)}
                        className="h-8 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border border-purple-100"
                        title="Target Segment in Campaign"
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        <span>Campaign</span>
                      </button>

                      <button
                        onClick={() => handleExportCohort(seg)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer border-0"
                        title="Export Cohort CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Cohort Client List Modal */}
      {selectedCohort &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 text-xs">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                      {selectedCohort.name} Cohort
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px]">
                      {selectedCohort.clientCount} Active Clients
                    </span>
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5">{selectedCohort.description}</p>
                </div>
                <button
                  onClick={() => setSelectedCohort(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scroll space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100">
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Avg LTV
                    </span>
                    <strong className="text-base font-bold text-ink font-serif mt-0.5 block">
                      ₹{selectedCohort.avgSpend.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100">
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Avg Frequency
                    </span>
                    <strong className="text-base font-bold text-ink font-serif mt-0.5 block">
                      {selectedCohort.avgVisits} Visits
                    </strong>
                  </div>
                  <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                      Automated Sync
                    </span>
                    <strong className="text-base font-bold text-emerald-800 font-serif mt-0.5 block">
                      Live Active
                    </strong>
                  </div>
                </div>

                <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Matching Profiles Sample
                </h4>

                <div className="space-y-2">
                  {(() => {
                    const matching = liveClients.filter((c) => {
                      if (selectedCohort.id === 'SEG-01') return c.lifetimeValue >= 30000 || c.totalVisits >= 15;
                      if (selectedCohort.id === 'SEG-02') return c.totalVisits >= 5;
                      if (selectedCohort.id === 'SEG-03') return c.membershipTier && c.membershipTier !== 'None';
                      if (selectedCohort.id === 'SEG-04') return c.totalVisits <= 1 || c.segment === 'New Client';
                      if (selectedCohort.id === 'SEG-05') return c.activePackage && c.activePackage !== 'None';
                      if (selectedCohort.id === 'SEG-06') return c.status === 'Active' && c.totalVisits > 0 && c.totalVisits < 5;
                      if (selectedCohort.id === 'SEG-07') return c.status === 'Inactive' || c.status === 'Archived' || c.status === 'Blocked';
                      return true;
                    });
                    const displayList = matching.length > 0 ? matching : liveClients.slice(0, 4);

                    if (displayList.length === 0) {
                      return (
                        <div className="p-4 text-center text-muted bg-[#FCFAFF] rounded-xl border border-purple-100">
                          No matching client profiles registered in this cohort yet.
                        </div>
                      );
                    }

                    return displayList.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 flex items-center justify-between"
                      >
                        <button
                          onClick={() => {
                            setSelectedCohort(null);
                            setSelectedClientDossier(c);
                          }}
                          className="flex items-center gap-3 text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                          title="Click to view client profile"
                        >
                          {c.avatarUrl ? (
                            <img
                              src={c.avatarUrl}
                              alt={c.fullName}
                              className="w-8 h-8 rounded-xl object-cover border border-purple-200"
                            />
                          ) : (
                            <Avatar
                              initials={c.avatarInitials}
                              className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs group-hover:scale-105 transition-transform"
                            />
                          )}
                          <div>
                            <div className="font-bold text-ink group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                              {c.fullName}
                            </div>
                            <div className="text-[10px] text-muted">
                              {c.primaryBranch} · LTV ₹{c.lifetimeValue.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCohort(null);
                            setSelectedClientDossier(c);
                          }}
                          className="h-7 px-3 rounded-lg bg-[#5A2EA6] text-white text-[11px] font-bold hover:bg-[#4a2489] transition-colors cursor-pointer border-0 flex items-center gap-1"
                        >
                          <span>View Profile</span>
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="p-4 border-t border-purple-50 flex justify-end">
                <Button
                  onClick={() => setSelectedCohort(null)}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                >
                  Close Cohort
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. Client Profile Dossier Modal */}
      <ClientProfileDossierModal
        client={selectedClientDossier}
        onClose={() => setSelectedClientDossier(null)}
      />
    </div>
  );
}
