import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Filter,
  Gift,
  Megaphone,
  MessageSquare,
  Phone,
  Search,
  Sparkles,
  TrendingDown,
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

export interface InactiveClientRecord {
  id: string;
  clientName: string;
  clientId: string;
  mobile: string;
  email: string;
  lastVisit: string;
  daysInactive: number;
  totalVisits: number;
  lifetimeValue: number;
  preferredService: string;
  preferredBranch: string;
  recoveryStatus: 'Uncontacted' | 'Win-Back Offer Sent' | 'Re-Engaged' | 'Lapsed Dormant';
}

export const initialInactiveClients: InactiveClientRecord[] = [
  {
    id: 'INACT-01',
    clientName: 'Vikram Rathore',
    clientId: 'CL-10496',
    mobile: '+91 97840 99880',
    email: 'vikram.rathore@jaipur-heritage.in',
    lastVisit: '18 Apr 2026',
    daysInactive: 121,
    totalVisits: 8,
    lifetimeValue: 28900,
    preferredService: 'Swedish Aromatherapy & Hot Stone Massage',
    preferredBranch: 'Atelier Jaipur Royal Spa',
    recoveryStatus: 'Uncontacted',
  },
  {
    id: 'INACT-02',
    clientName: 'Sanjay Deshpande',
    clientId: 'CL-10450',
    mobile: '+91 98220 33441',
    email: 'sanjay.d@puneconsult.in',
    lastVisit: '22 Feb 2026',
    daysInactive: 176,
    totalVisits: 6,
    lifetimeValue: 18400,
    preferredService: 'Signature Haircut & Keratin Treatment',
    preferredBranch: 'Atelier Koregaon Park Grand',
    recoveryStatus: 'Win-Back Offer Sent',
  },
  {
    id: 'INACT-03',
    clientName: 'Poonam Varma',
    clientId: 'CL-10432',
    mobile: '+91 99880 77665',
    email: 'poonam.varma@bhopal.com',
    lastVisit: '10 Jan 2026',
    daysInactive: 219,
    totalVisits: 11,
    lifetimeValue: 34500,
    preferredService: 'Radiance Vitamin C Facial',
    preferredBranch: 'Atelier Indrapuri Flagship',
    recoveryStatus: 'Lapsed Dormant',
  },
  {
    id: 'INACT-04',
    clientName: 'Neha Aggarwal',
    clientId: 'CL-10481',
    mobile: '+91 98110 55443',
    email: 'neha.aggarwal@gmail.com',
    lastVisit: '15 Jun 2026',
    daysInactive: 63,
    totalVisits: 4,
    lifetimeValue: 9800,
    preferredService: 'Gel Manicure & Pedicure Spa',
    preferredBranch: 'Atelier Whitefield Studio',
    recoveryStatus: 'Re-Engaged',
  },
];

export interface InactiveClientsTabProps {
  branchId?: string;
  franchiseId?: string;
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function InactiveClientsTab({
  branchId,
  franchiseId,
  defaultBranch = 'Indore Flagship',
}: InactiveClientsTabProps = {}) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [liveClients, setLiveClients] = useState<FullClientRecord[]>([]);
  const [inactiveList, setInactiveList] = useState<InactiveClientRecord[]>(initialInactiveClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [cohortFilter, setCohortFilter] = useState<'All' | '30+' | '60+' | '90+' | '180+'>('All');

  // Modals state
  const [winBackModalClient, setWinBackModalClient] = useState<InactiveClientRecord | null>(null);
  const [offerType, setOfferType] = useState('20% VIP Re-engagement Voucher');
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

          const dynamicInactive: InactiveClientRecord[] = mapped.map((c) => {
            const lastDate = c.lastVisit && c.lastVisit !== 'Just Registered'
              ? new Date(c.lastVisit)
              : new Date();
            const daysInactive = Math.max(0, Math.floor((Date.now() - lastDate.getTime()) / 86400000));
            const recoveryStatus =
              daysInactive >= 180
                ? 'Lapsed Dormant'
                : daysInactive >= 90
                  ? 'Win-Back Offer Sent'
                  : daysInactive >= 30
                    ? 'Uncontacted'
                    : 'Re-Engaged';

            return {
              id: `INACT-${c.id.slice(0, 8)}`,
              clientName: c.fullName,
              clientId: c.id,
              mobile: c.mobile,
              email: c.email,
              lastVisit: c.lastVisit,
              daysInactive,
              totalVisits: c.totalVisits,
              lifetimeValue: c.lifetimeValue,
              preferredService: c.preferredServices || 'Signature Precision Treatment',
              preferredBranch: c.primaryBranch || defaultBranch,
              recoveryStatus: recoveryStatus as any,
            };
          });
          setInactiveList(dynamicInactive);
        }
      })
      .catch((err) => {
        console.warn('Failed to load customers for inactive list:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [branchId, franchiseId, defaultBranch]);

  const filteredInactive = inactiveList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.clientName.toLowerCase().includes(q) ||
      item.preferredService.toLowerCase().includes(q) ||
      item.preferredBranch.toLowerCase().includes(q);

    let matchesCohort = true;
    if (cohortFilter === '30+') matchesCohort = item.daysInactive >= 30 && item.daysInactive < 60;
    if (cohortFilter === '60+') matchesCohort = item.daysInactive >= 60 && item.daysInactive < 90;
    if (cohortFilter === '90+') matchesCohort = item.daysInactive >= 90 && item.daysInactive < 180;
    if (cohortFilter === '180+') matchesCohort = item.daysInactive >= 180;

    return matchesSearch && matchesCohort;
  });

  const handleSendWinBack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!winBackModalClient) return;

    setInactiveList((prev) =>
      prev.map((c) =>
        c.id === winBackModalClient.id ? { ...c, recoveryStatus: 'Win-Back Offer Sent' } : c,
      ),
    );
    setWinBackModalClient(null);
    toast(`Win-back incentive "${offerType}" sent to ${winBackModalClient.clientName}!`);
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
              Inactive Client Recovery &amp; Win-Back Workflows
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              Dormancy Recovery
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Identify guests with no recent visits across 30, 60, 90, and 180+ day cohorts and deploy
            personalized win-back voucher incentives.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => toast('Exported inactive client cohorts to CSV.')}
          className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Inactive Cohorts</span>
        </Button>
      </div>

      {/* Cohort Pill Switcher Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search inactive clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
          <Clock className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Inactivity Window:</span>
          {(['All', '30+', '60+', '90+', '180+'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setCohortFilter(ch)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border',
                cohortFilter === ch
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                  : 'bg-[#FCFAFF] text-soft hover:bg-[#5A2EA6]/10 border-[#5A2EA6]/20',
              )}
            >
              {ch === 'All' ? 'All Inactive' : `${ch} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Inactive Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Dormant &amp; Lapsed Customer Recovery Roster
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Past high-value visitors eligible for customized reactivation promotions
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredInactive.length} Inactive Clients
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Client Name',
                  'Last Visit Date',
                  'Days Inactive',
                  'Past Visits',
                  'Lifetime Value',
                  'Preferred Treatment & Branch',
                  'Recovery Status',
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
              {filteredInactive.map((c) => (
                <tr key={c.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  <td className="p-3.5 pl-5">
                    <button
                      onClick={() => {
                        setSearchParams({ tab: 'inactive', clientId: c.clientId });
                      }}
                      className="text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                      title="Click to view client profile"
                    >
                      <strong className="text-ink text-[13px] block group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                        {c.clientName}
                      </strong>
                      <span className="text-[10px] text-muted font-mono">{c.mobile}</span>
                    </button>
                  </td>

                  <td className="p-3.5 text-soft font-semibold">{c.lastVisit}</td>

                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                        c.daysInactive >= 180
                          ? 'bg-rose-100 text-rose-800'
                          : c.daysInactive >= 90
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800',
                      )}
                    >
                      {c.daysInactive} Days Dormant
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-ink">{c.totalVisits} Visits</td>

                  <td className="p-3.5 font-serif font-bold text-ink text-[13px]">
                    ₹{c.lifetimeValue.toLocaleString('en-IN')}
                  </td>

                  <td className="p-3.5">
                    <div className="text-ink font-semibold text-xs truncate max-w-xs">
                      {c.preferredService}
                    </div>
                    <div className="text-[10px] text-muted">{c.preferredBranch}</div>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        c.recoveryStatus === 'Re-Engaged'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.recoveryStatus === 'Win-Back Offer Sent'
                            ? 'bg-blue-100 text-blue-800'
                            : c.recoveryStatus === 'Uncontacted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      {c.recoveryStatus}
                    </span>
                  </td>

                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setWinBackModalClient(c)}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-0 shadow-2xs"
                        title="Send Win-Back Voucher"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Win-Back</span>
                      </button>

                      <button
                        onClick={() => {
                          setSearchParams({ tab: 'inactive', clientId: c.clientId });
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

      {/* 1. Win-Back Campaign Modal */}
      {winBackModalClient &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Deploy Win-Back Offer
                  </h3>
                  <p className="text-[11px] text-muted">
                    Reactivating {winBackModalClient.clientName} ({winBackModalClient.daysInactive}{' '}
                    days dormant)
                  </p>
                </div>
                <button
                  onClick={() => setWinBackModalClient(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendWinBack} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Client previously favored "{winBackModalClient.preferredService}" at{' '}
                  {winBackModalClient.preferredBranch}.
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Select Reactivation Incentive
                  </label>
                  <select
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="20% VIP Re-engagement Voucher">
                      20% VIP Re-engagement Voucher
                    </option>
                    <option value="₹500 Welcome Back Wallet Credit">
                      ₹500 Welcome Back Wallet Credit
                    </option>
                    <option value="Complimentary Scalp Detox Infusion">
                      Complimentary Scalp Detox Infusion
                    </option>
                    <option value="Free Blowout with Facial Booking">
                      Free Blowout with Facial Booking
                    </option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setWinBackModalClient(null)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Send Win-Back Voucher
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
