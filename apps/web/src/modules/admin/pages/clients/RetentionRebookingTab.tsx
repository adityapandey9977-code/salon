import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { customersApi } from '@/shared/api';
import { tokenStorage } from '@/shared/api/client';
import { masterBranches } from '../locations/AllBranchesTab';
import { mapApiCustomerToFullRecord } from './AllClientsTab';
import { initialClients } from './clientsData';
import { ClientProfileDossierModal, type FullClientRecord } from './ClientProfileDossierModal';
import { ClientProfilePage } from './ClientProfilePage';

export interface RebookingItem {
  id: string;
  clientName: string;
  clientId: string;
  mobile: string;
  lastService: string;
  lastVisitDate: string;
  recommendedDate: string;
  preferredBranch: string;
  preferredStaff: string;
  status: 'Due' | 'Contacted' | 'Booked' | 'Completed' | 'Declined';
  notes?: string;
}

export const initialRebookings: RebookingItem[] = [
  {
    id: 'RBK-01',
    clientName: 'Akanksha Sharma',
    clientId: 'CL-10492',
    mobile: '+91 98260 11420',
    lastService: '7-Step Medical Hydra-Facial Rejuvenation',
    lastVisitDate: '12 Aug 2026',
    recommendedDate: '09 Sep 2026 (In 3 Weeks)',
    preferredBranch: 'Atelier Indrapuri Flagship',
    preferredStaff: 'Ananya Deshmukh',
    status: 'Due',
    notes: 'Package session 5 of 6 due for seasonal skin hydration.',
  },
  {
    id: 'RBK-02',
    clientName: 'Devendra Singhania',
    clientId: 'CL-10493',
    mobile: '+91 99770 44550',
    lastService: 'Executive Hot Towel Beard Sculpt & Scalp Polish',
    lastVisitDate: '10 Aug 2026',
    recommendedDate: '24 Aug 2026 (In 1 Week)',
    preferredBranch: 'Atelier Indrapuri Flagship',
    preferredStaff: 'Sameer Sheikh',
    status: 'Contacted',
    notes: 'WhatsApp reminder sent for bi-weekly beard trim.',
  },
  {
    id: 'RBK-03',
    clientName: 'Meera Kulkarni',
    clientId: 'CL-10494',
    mobile: '+91 91234 88770',
    lastService: 'Balayage Highlight & Tone',
    lastVisitDate: '04 Aug 2026',
    recommendedDate: '01 Sep 2026 (In 2 Weeks)',
    preferredBranch: 'Atelier Koregaon Park Grand',
    preferredStaff: 'Rohit Verma',
    status: 'Booked',
    notes: 'Confirmed 01 Sep 03:00 PM slot for toner gloss refresh.',
  },
  {
    id: 'RBK-04',
    clientName: 'Tanvi Rao',
    clientId: 'CL-10495',
    mobile: '+91 98980 33220',
    lastService: 'Sculpted Gel Extensions & Ombre Art',
    lastVisitDate: '15 Jul 2026',
    recommendedDate: '05 Aug 2026 (Overdue)',
    preferredBranch: 'Atelier Whitefield Studio',
    preferredStaff: 'Kavita Iyer',
    status: 'Due',
    notes: 'Nail infill growth cycle overdue by 12 days.',
  },
  {
    id: 'RBK-05',
    clientName: 'Vikram Rathore',
    clientId: 'CL-10496',
    mobile: '+91 97840 99880',
    lastService: 'Swedish Aromatherapy Deep Tissue Massage',
    lastVisitDate: '18 Apr 2026',
    recommendedDate: '18 May 2026 (Overdue)',
    preferredBranch: 'Atelier Jaipur Royal Spa',
    preferredStaff: 'Manish Rawat',
    status: 'Declined',
    notes: 'Client travelling abroad till October.',
  },
];

export interface RetentionRebookingTabProps {
  branchId?: string;
  franchiseId?: string;
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function RetentionRebookingTab({
  branchId,
  franchiseId,
  defaultBranch = 'Indore Flagship',
}: RetentionRebookingTabProps = {}) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [liveClients, setLiveClients] = useState<FullClientRecord[]>([]);
  const [rebookings, setRebookings] = useState<RebookingItem[]>(initialRebookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [actionItem, setActionItem] = useState<RebookingItem | null>(null);
  const [actionStatus, setActionStatus] = useState<RebookingItem['status']>('Contacted');
  const [actionNotes, setActionNotes] = useState('');
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

          // Generate dynamic rebooking queue items from the real clients
          const dynamicList: RebookingItem[] = mapped.map((c, idx) => {
            const cycleStatuses: RebookingItem['status'][] = ['Due', 'Contacted', 'Booked', 'Completed', 'Declined'];
            const recommendedList = [
              '24 Aug 2026 (In 1 Week)',
              '01 Sep 2026 (In 2 Weeks)',
              '09 Sep 2026 (In 3 Weeks)',
              '15 Sep 2026 (In 4 Weeks)',
              'Overdue',
            ];
            return {
              id: `RBK-${c.id.slice(0, 8)}`,
              clientName: c.fullName,
              clientId: c.id,
              mobile: c.mobile,
              lastService: c.preferredServices || 'Signature Precision Cut & Styling',
              lastVisitDate: c.lastVisit || 'Just Registered',
              recommendedDate: recommendedList[idx % recommendedList.length],
              preferredBranch: c.primaryBranch || defaultBranch,
              preferredStaff: c.preferredStaff || 'Assigned Specialist',
              status: cycleStatuses[idx % cycleStatuses.length],
              notes: `Treatment recurrence cycle managed for ${c.fullName}`,
            };
          });
          setRebookings(dynamicList);
        }
      })
      .catch((err) => {
        console.warn('Failed to load customers for retention:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [branchId, franchiseId, defaultBranch]);

  const repeatGuestsCount = liveClients.filter((c) => c.totalVisits > 1).length;
  const repeatClientRatio = liveClients.length > 0
    ? Math.round((repeatGuestsCount / liveClients.length) * 100)
    : 76.8;
  const rebookingsDueCount = rebookings.filter((r) => r.status === 'Due').length;

  const filteredRebookings = rebookings.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.clientName.toLowerCase().includes(q) ||
      r.lastService.toLowerCase().includes(q) ||
      r.preferredStaff.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenActionModal = (item: RebookingItem) => {
    setActionItem(item);
    setActionStatus(item.status);
    setActionNotes(item.notes || '');
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

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionItem) return;

    setRebookings((prev) =>
      prev.map((r) =>
        r.id === actionItem.id ? { ...r, status: actionStatus, notes: actionNotes } : r,
      ),
    );
    setActionItem(null);
    toast(`Rebooking status for ${actionItem.clientName} updated to "${actionStatus}".`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Client Retention &amp; Automated Rebooking Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              84.2% Rebooking Rate
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Predictive treatment recurrence cycles identifying when clients are due for color
            touch-ups, nail infills, and facial maintenance.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => toast('Exported rebooking action queue to CSV.')}
          className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
        >
          <CalendarClock className="w-4 h-4" />
          <span>Export Queue</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Brand Rebooking Rate
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">84.2%</strong>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +3.4% vs Last Month
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
            Repeat Client Ratio
          </span>
          <strong className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1 block">
            {repeatClientRatio}%
          </strong>
          <span className="text-[10px] text-soft block mt-1">{repeatGuestsCount} Recurring Guests</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            New Client 60d Return
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">62.5%</strong>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">
            Healthy Conversion
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-amber-700 uppercase font-bold block">
            Rebookings Due This Week
          </span>
          <strong className="text-2xl font-bold text-amber-900 font-serif mt-1 block">
            {rebookingsDueCount} Clients
          </strong>
          <span className="text-[10px] text-soft block mt-1">Automated Outreach Queued</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by client, service, stylist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Status:</span>
          {(['All', 'Due', 'Contacted', 'Booked', 'Completed', 'Declined'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border',
                statusFilter === st
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                  : 'bg-[#FCFAFF] text-soft hover:bg-[#5A2EA6]/10 border-[#5A2EA6]/20',
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Rebooking Queue Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Predictive Rebooking Queue
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Targeted timing reminders based on service growth and chemical refresh intervals
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredRebookings.length} Action Items
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Client & Contact',
                  'Last Service Rendered',
                  'Last Visit',
                  'Recommended Cycle',
                  'Preferred Branch & Staff',
                  'Rebooking Status',
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
              {filteredRebookings.map((rbk) => (
                <tr key={rbk.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  {/* Client */}
                  <td className="p-3.5 pl-5">
                    <button
                      onClick={() => {
                        setSearchParams({ tab: 'retention', clientId: rbk.clientId });
                      }}
                      className="text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                      title="Click to view client profile"
                    >
                      <strong className="text-ink text-[13px] block group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                        {rbk.clientName}
                      </strong>
                      <span className="text-[10px] text-muted font-mono">
                        {rbk.mobile} · {rbk.clientId}
                      </span>
                    </button>
                  </td>

                  {/* Last Service */}
                  <td className="p-3.5">
                    <div className="font-semibold text-ink text-xs">{rbk.lastService}</div>
                    {rbk.notes && (
                      <div className="text-[10px] text-muted italic truncate max-w-xs">
                        {rbk.notes}
                      </div>
                    )}
                  </td>

                  {/* Last Visit */}
                  <td className="p-3.5 text-soft">{rbk.lastVisitDate}</td>

                  {/* Recommended Date */}
                  <td className="p-3.5 font-bold text-[#5A2EA6]">{rbk.recommendedDate}</td>

                  {/* Branch & Staff */}
                  <td className="p-3.5">
                    <div className="text-ink font-semibold text-xs">{rbk.preferredStaff}</div>
                    <div className="text-[10px] text-muted">{rbk.preferredBranch}</div>
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        rbk.status === 'Due'
                          ? 'bg-amber-100 text-amber-800'
                          : rbk.status === 'Booked'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rbk.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : rbk.status === 'Completed'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-rose-100 text-rose-800',
                      )}
                    >
                      {rbk.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenActionModal(rbk)}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-0 shadow-2xs"
                        title="Update Rebooking Status"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Action</span>
                      </button>

                      <button
                        onClick={() => {
                          setSearchParams({ tab: 'retention', clientId: rbk.clientId });
                        }}
                        className="w-8 h-8 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                        title="View Profile Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
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

      {/* 1. Update Rebooking Action Modal */}
      {actionItem &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Rebooking Outreach: {actionItem.clientName}
                  </h3>
                  <p className="text-[11px] text-muted font-mono">
                    {actionItem.mobile} · {actionItem.preferredBranch}
                  </p>
                </div>
                <button
                  onClick={() => setActionItem(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAction} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Update Outreach Status
                  </label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value as RebookingItem['status'])}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Due">Due (Pending Outreach)</option>
                    <option value="Contacted">Contacted (Message / Call Completed)</option>
                    <option value="Booked">Booked (Appointment Scheduled)</option>
                    <option value="Completed">Completed (Visit Concluded)</option>
                    <option value="Declined">Declined (Client Postponed / Not Interested)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Outreach Remarks / Communication Notes
                  </label>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Record client response, scheduled appointment date, or postponement reason..."
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setActionItem(null)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Save Outreach State
                  </Button>
                </div>
              </form>
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
