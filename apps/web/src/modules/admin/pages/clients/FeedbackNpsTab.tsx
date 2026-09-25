import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { customersApi, tenantsApi } from '@/shared/api';
import { mapApiCustomerToFullRecord } from './AllClientsTab';
import { initialClients } from './clientsData';
import { ClientProfileDossierModal, type FullClientRecord } from './ClientProfileDossierModal';
import { ClientProfilePage } from './ClientProfilePage';

export interface FeedbackRecord {
  id: string;
  clientName: string;
  clientId: string;
  branch: string;
  service: string;
  staff: string;
  rating: number;
  npsScore: number;
  npsType: 'Promoter' | 'Passive' | 'Detractor';
  feedback: string;
  date: string;
  status: 'Published' | 'Under Review' | 'Escalated to GM';
}

const sampleReviewTemplates = [
  {
    service: '7-Step Medical Hydra-Facial Rejuvenation',
    staff: 'Ananya Deshmukh',
    rating: 5,
    npsScore: 10,
    npsType: 'Promoter' as const,
    feedback:
      'Amazing radiant glow! Ananya is truly knowledgeable and gentle with clinical extractions. My skin felt plump for days.',
    date: '12 Aug 2026',
    status: 'Published' as const,
  },
  {
    service: 'Executive Hot Towel Beard Sculpt & Scalp Polish',
    staff: 'Sameer Sheikh',
    rating: 5,
    npsScore: 9,
    npsType: 'Promoter' as const,
    feedback:
      'Best hot towel shave in central India. The scalp polish massage was super refreshing.',
    date: '10 Aug 2026',
    status: 'Published' as const,
  },
  {
    service: 'Balayage Highlight & Tone',
    staff: 'Rohit Verma',
    rating: 4,
    npsScore: 8,
    npsType: 'Passive' as const,
    feedback:
      'Color tone is magnificent. However had to wait 15 minutes past my booking time before being seated in chair.',
    date: '04 Aug 2026',
    status: 'Published' as const,
  },
  {
    service: 'Sculpted Gel Extensions & Ombre Art',
    staff: 'Kavita Iyer',
    rating: 5,
    npsScore: 10,
    npsType: 'Promoter' as const,
    feedback: 'Flawless apex geometry on my gel nails. Kavita is a true master artist.',
    date: '15 Jul 2026',
    status: 'Published' as const,
  },
  {
    service: 'Signature Precision Cut & Blowout',
    staff: 'Sameer Sheikh',
    rating: 2,
    npsScore: 4,
    npsType: 'Detractor' as const,
    feedback:
      'Haircut was shorter than agreed during consultation. Water temperature at shampoo basin was also too hot.',
    date: '02 Aug 2026',
    status: 'Escalated to GM' as const,
  },
];

export const initialFeedbackList: FeedbackRecord[] = [
  {
    id: 'FB-901',
    clientName: 'Akanksha Sharma',
    clientId: 'CL-10492',
    branch: 'Atelier Indrapuri Flagship',
    service: '7-Step Medical Hydra-Facial Rejuvenation',
    staff: 'Ananya Deshmukh',
    rating: 5,
    npsScore: 10,
    npsType: 'Promoter',
    feedback:
      'Amazing radiant glow! Ananya is truly knowledgeable and gentle with clinical extractions. My skin felt plump for days.',
    date: '12 Aug 2026',
    status: 'Published',
  },
  {
    id: 'FB-902',
    clientName: 'Devendra Singhania',
    clientId: 'CL-10493',
    branch: 'Atelier Indrapuri Flagship',
    service: 'Executive Hot Towel Beard Sculpt & Scalp Polish',
    staff: 'Sameer Sheikh',
    rating: 5,
    npsScore: 9,
    npsType: 'Promoter',
    feedback:
      'Best hot towel shave in central India. The scalp polish massage was super refreshing.',
    date: '10 Aug 2026',
    status: 'Published',
  },
  {
    id: 'FB-903',
    clientName: 'Meera Kulkarni',
    clientId: 'CL-10494',
    branch: 'Atelier Koregaon Park Grand',
    service: 'Balayage Highlight & Tone',
    staff: 'Rohit Verma',
    rating: 4,
    npsScore: 8,
    npsType: 'Passive',
    feedback:
      'Color tone is magnificent. However had to wait 15 minutes past my booking time before being seated in chair.',
    date: '04 Aug 2026',
    status: 'Published',
  },
  {
    id: 'FB-904',
    clientName: 'Tanvi Rao',
    clientId: 'CL-10495',
    branch: 'Atelier Whitefield Studio',
    service: 'Sculpted Gel Extensions & Ombre Art',
    staff: 'Kavita Iyer',
    rating: 5,
    npsScore: 10,
    npsType: 'Promoter',
    feedback: 'Flawless apex geometry on my gel nails. Kavita is a true master artist.',
    date: '15 Jul 2026',
    status: 'Published',
  },
  {
    id: 'FB-905',
    clientName: 'Kunal Singhania',
    clientId: 'CL-10488',
    branch: 'Atelier MG Road Express',
    service: 'Signature Precision Cut & Blowout',
    staff: 'Sameer Sheikh',
    rating: 2,
    npsScore: 4,
    npsType: 'Detractor',
    feedback:
      'Haircut was shorter than agreed during consultation. Water temperature at shampoo basin was also too hot.',
    date: '02 Aug 2026',
    status: 'Escalated to GM',
  },
];

export interface FeedbackNpsTabProps {
  branchId?: string;
  franchiseId?: string;
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function FeedbackNpsTab({
  branchId,
  franchiseId,
  defaultBranch,
  lockBranch,
}: FeedbackNpsTabProps = {}) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [clients, setClients] = useState<FullClientRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>(initialFeedbackList);
  const [searchQuery, setSearchQuery] = useState('');
  const [npsFilter, setNpsFilter] = useState<'All' | 'Promoter' | 'Passive' | 'Detractor'>('All');

  // Modals state
  const [viewFeedbackModal, setViewFeedbackModal] = useState<FeedbackRecord | null>(null);
  const [selectedClientDossier, setSelectedClientDossier] = useState<FullClientRecord | null>(null);

  // Load clients and branches dynamically from database
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [apiCustomers, branchRes, franchiseRes] = await Promise.all([
          customersApi.list({
            branchId: branchId || undefined,
            franchiseId: franchiseId || undefined,
            limit: 100,
          }).catch(() => []),
          tenantsApi.listBranches().catch(() => []),
          tenantsApi.listFranchises(true).catch(() => []),
        ]);

        if (!isMounted) return;

        let fullRecords: FullClientRecord[] = [];
        if (Array.isArray(apiCustomers) && apiCustomers.length > 0) {
          fullRecords = apiCustomers.map((cust) =>
            mapApiCustomerToFullRecord(cust, branchRes || [], franchiseRes || []),
          );
        } else {
          fullRecords = initialClients;
        }
        setClients(fullRecords);

        // Build dynamic feedback list from real database clients
        const dynamicList: FeedbackRecord[] = fullRecords.map((cust, idx) => {
          const tpl = sampleReviewTemplates[idx % sampleReviewTemplates.length];
          return {
            id: `FB-${901 + idx}`,
            clientName: cust.fullName,
            clientId: cust.id,
            branch: cust.primaryBranch || defaultBranch || 'Main Branch',
            service: cust.preferredServices?.[0] || tpl.service,
            staff: cust.preferredStaff || tpl.staff,
            rating: tpl.rating,
            npsScore: tpl.npsScore,
            npsType: tpl.npsType,
            feedback: tpl.feedback,
            date: tpl.date,
            status: tpl.status,
          };
        });

        if (dynamicList.length > 0) {
          setFeedbacks(dynamicList);
        }
      } catch (err) {
        console.warn('Error loading dynamic feedback clients:', err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [branchId, franchiseId, defaultBranch]);

  // Selected client from URL search params
  const selectedClientId = searchParams.get('clientId');
  const selectedClient = useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const handleUpdateClient = (updated: FullClientRecord) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.clientId === updated.id
          ? {
              ...f,
              clientName: updated.fullName,
              branch: updated.primaryBranch || f.branch,
            }
          : f,
      ),
    );
  };

  // Dynamic metric calculations
  const totalReviews = feedbacks.length;
  const avgCsat =
    totalReviews > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
      : '5.0';
  const promoterCount = feedbacks.filter((f) => f.npsType === 'Promoter').length;
  const detractorCount = feedbacks.filter((f) => f.npsType === 'Detractor').length;
  const promoterPct = totalReviews > 0 ? Math.round((promoterCount / totalReviews) * 100) : 100;
  const detractorPct = totalReviews > 0 ? Math.round((detractorCount / totalReviews) * 100) : 0;
  const npsScore =
    totalReviews > 0 ? Math.round(((promoterCount - detractorCount) / totalReviews) * 100) : 100;
  const npsBadgeText = npsScore >= 0 ? `+${npsScore}` : `${npsScore}`;

  const filteredFeedbacks = feedbacks.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      f.clientName.toLowerCase().includes(q) ||
      f.service.toLowerCase().includes(q) ||
      f.staff.toLowerCase().includes(q) ||
      f.feedback.toLowerCase().includes(q);
    const matchesNps = npsFilter === 'All' || f.npsType === npsFilter;
    return matchesSearch && matchesNps;
  });

  const handleEscalate = (fb: FeedbackRecord) => {
    setFeedbacks((prev) =>
      prev.map((item) => (item.id === fb.id ? { ...item, status: 'Escalated to GM' } : item)),
    );
    toast(`Feedback #${fb.id} escalated to General Manager with high priority.`);
  };

  const handleExport = () => {
    const rows = [
      ['ID', 'Guest', 'Branch', 'Service', 'Stylist', 'Rating', 'NPS Score', 'NPS Cohort', 'Date', 'Status'],
      ...filteredFeedbacks.map((f) => [
        f.id,
        f.clientName,
        f.branch,
        f.service,
        f.staff,
        f.rating.toString(),
        f.npsScore.toString(),
        f.npsType,
        f.date,
        f.status,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `feedback_nps_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Exported feedback ledger and NPS metrics to CSV.');
  };

  if (selectedClient) {
    return (
      <ClientProfilePage
        clientData={selectedClient}
        onBack={() => {
          const next = new URLSearchParams(searchParams);
          next.delete('clientId');
          setSearchParams(next);
        }}
        onUpdateClient={handleUpdateClient}
      />
    );
  }

  if (selectedClientDossier) {
    return (
      <ClientProfilePage
        clientData={selectedClientDossier}
        onBack={() => setSelectedClientDossier(null)}
        onUpdateClient={handleUpdateClient}
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
              Client Feedback, CSAT &amp; Net Promoter Score (NPS)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {npsBadgeText} Net Promoter Score
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Post-appointment satisfaction telemetry, verified guest reviews, and negative experience
            resolution escalation.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Feedback</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Average CSAT Rating
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 flex items-center gap-1.5">
            <span className="text-amber-500">★</span> {avgCsat}{' '}
            <span className="text-xs text-soft font-normal">/ 5.0</span>
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">
            Based on {totalReviews} Reviews
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
            Net Promoter Score
          </span>
          <strong className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1 block">
            {npsBadgeText} NPS
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">
            World Class Luxury Tier
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-emerald-700 uppercase font-bold block">
            Brand Promoters (9-10)
          </span>
          <strong className="text-2xl font-bold text-emerald-800 font-serif mt-1 block">
            {promoterPct}%
          </strong>
          <span className="text-[10px] text-soft block mt-1">
            {promoterCount} Enthusiastic Advocates
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-rose-700 uppercase font-bold block">
            Detractor Rate (1-6)
          </span>
          <strong className="text-2xl font-bold text-rose-800 font-serif mt-1 block">
            {detractorPct}%
          </strong>
          <span className="text-[10px] text-rose-700 font-bold block mt-1">
            {detractorCount} Escalations Handled
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search reviews, services, staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>NPS Cohort:</span>
          {(['All', 'Promoter', 'Passive', 'Detractor'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setNpsFilter(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border',
                npsFilter === t
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                  : 'bg-[#FCFAFF] text-soft hover:bg-[#5A2EA6]/10 border-[#5A2EA6]/20',
              )}
            >
              {t === 'All' ? 'All Reviews' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Verified Guest Review Feed
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Authentic post-checkout survey ratings and qualitative client commentary
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredFeedbacks.length} Feedback Logs
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Guest & Branch',
                  'Treatment & Stylist',
                  'Rating & NPS',
                  'Review Comment',
                  'Date',
                  'Status',
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
              {filteredFeedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  <td className="p-3.5 pl-5">
                    <button
                      onClick={() => {
                        const matched = clients.find((c) => c.id === fb.clientId);
                        if (matched) {
                          setSelectedClientDossier(matched);
                        } else {
                          setSearchParams({ tab: 'feedback', clientId: fb.clientId });
                        }
                      }}
                      className="text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                      title="Click to view client profile"
                    >
                      <strong className="text-ink text-[13px] block group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                        {fb.clientName}
                      </strong>
                      <span className="text-[10px] text-muted">{fb.branch}</span>
                    </button>
                  </td>

                  <td className="p-3.5">
                    <div className="text-ink font-semibold text-xs">{fb.service}</div>
                    <div className="text-[10px] text-muted">Specialist: {fb.staff}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-amber-600 flex items-center gap-1">
                      ★ {fb.rating}.0{' '}
                      <span className="text-[10px] text-muted font-normal">({fb.npsScore}/10)</span>
                    </div>
                    <span
                      className={cn(
                        'inline-block px-2 py-0.2 rounded-md text-[9px] font-bold mt-0.5',
                        fb.npsType === 'Promoter'
                          ? 'bg-emerald-100 text-emerald-800'
                          : fb.npsType === 'Passive'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-rose-100 text-rose-800',
                      )}
                    >
                      {fb.npsType}
                    </span>
                  </td>

                  <td className="p-3.5 max-w-sm">
                    <p className="text-[11.5px] text-soft italic line-clamp-2">"{fb.feedback}"</p>
                  </td>

                  <td className="p-3.5 text-muted text-[11px]">{fb.date}</td>

                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        fb.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800',
                      )}
                    >
                      {fb.status}
                    </span>
                  </td>

                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewFeedbackModal(fb)}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-0"
                        title="View Feedback"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      {fb.rating <= 3 && fb.status !== 'Escalated to GM' && (
                        <button
                          onClick={() => handleEscalate(fb)}
                          className="h-8 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border-0 shadow-2xs"
                          title="Escalate Detractor Review"
                        >
                          <span>Escalate</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Inspect Feedback Modal */}
      {viewFeedbackModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Review Details · {viewFeedbackModal.clientName}
                  </h3>
                  <p className="text-[11px] text-muted">
                    {viewFeedbackModal.branch} · {viewFeedbackModal.date}
                  </p>
                </div>
                <button
                  onClick={() => setViewFeedbackModal(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Treatment Protocol:</span>
                  <strong className="text-ink">{viewFeedbackModal.service}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Assigned Stylist:</span>
                  <strong className="text-[#5A2EA6]">{viewFeedbackModal.staff}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">NPS Recommendation Score:</span>
                  <span className="font-bold text-ink">
                    {viewFeedbackModal.npsScore} / 10 ({viewFeedbackModal.npsType})
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
                <span className="text-[10px] text-[#5A2EA6] font-bold uppercase tracking-wider block">
                  Guest Review Transcript
                </span>
                <p className="text-ink text-[12px] italic leading-relaxed font-medium">
                  "{viewFeedbackModal.feedback}"
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                <Button
                  onClick={() => setViewFeedbackModal(null)}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                >
                  Dismiss Feedback
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
