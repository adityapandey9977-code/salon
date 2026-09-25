import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  FileCheck,
  Filter,
  ShieldAlert,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

interface FranchiseOverviewTabProps {
  onNavigateTab?: (tab: string, filter?: string) => void;
  partnersCount?: number;
  locationsCount?: number;
}

export function FranchiseOverviewTab({
  onNavigateTab,
  partnersCount,
  locationsCount,
}: FranchiseOverviewTabProps) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('This Quarter');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 8 Core KPI Cards (Section 1 PRD)
  const kpis = [
    {
      title: 'Total Partners',
      value: partnersCount !== undefined && partnersCount > 0 ? String(partnersCount) : '12',
      sub: 'Registered Entities',
      change: '+2 this year',
      isPositive: true,
      icon: Users,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Active Partners',
      value: partnersCount !== undefined && partnersCount > 0 ? String(partnersCount) : '10',
      sub: '83.3% Active Operational',
      change: 'Stable',
      isPositive: true,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Franchise Outlets',
      value: locationsCount !== undefined && locationsCount > 0 ? String(locationsCount) : '18',
      sub: 'Across Territory Network',
      change: '+4 YoY',
      isPositive: true,
      icon: Store,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Pending Approvals',
      value: '2',
      sub: 'Onboarding / Site Review',
      change: 'Action Needed',
      isPositive: false,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Active Agreements',
      value: '16',
      sub: 'Contract Compliance',
      change: '100% Bound',
      isPositive: true,
      icon: FileCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Expiring Soon',
      value: '3',
      sub: 'Within Next 90 Days',
      change: 'Renewal Due',
      isPositive: false,
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      title: 'Franchise Turnover',
      value: '₹86,50,000',
      sub: 'Network Gross GMV',
      change: '+21.4% YoY',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Royalty Accrued',
      value: '₹8,65,000',
      sub: 'Brand Fee (10% Flat Rate)',
      change: '+18.5% YoY',
      isPositive: true,
      icon: Award,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
  ];

  // Top Franchise Partner Ranking
  const topPartners = [
    {
      name: 'Apex Wellness & Spa LLP',
      code: 'FP-IND-01',
      outlets: 3,
      gmv: '₹24,80,000',
      royalty: '₹2,48,000',
      compliance: 98,
      status: 'Active',
    },
    {
      name: 'Radiance Salon Ventures',
      code: 'FP-BHP-02',
      outlets: 2,
      gmv: '₹18,50,000',
      royalty: '₹1,85,000',
      compliance: 95,
      status: 'Active',
    },
    {
      name: 'Mahakal Beauty Partners',
      code: 'FP-UJJ-03',
      outlets: 2,
      gmv: '₹14,20,000',
      royalty: '₹1,42,000',
      compliance: 92,
      status: 'Active',
    },
    {
      name: 'Gwalior Royal Spa Co.',
      code: 'FP-GWL-04',
      outlets: 2,
      gmv: '₹12,40,000',
      royalty: '₹1,24,000',
      compliance: 89,
      status: 'Active',
    },
    {
      name: 'Jabalpur Luxe Salons',
      code: 'FP-JBL-05',
      outlets: 1,
      gmv: '₹9,60,000',
      royalty: '₹96,000',
      compliance: 94,
      status: 'Active',
    },
  ];

  // Franchise Location Performance Matrix
  const locationPerformance = [
    {
      city: 'Indore - Vijay Nagar FOFO',
      partner: 'Apex Wellness LLP',
      appointments: 1240,
      avgTicket: '₹2,000',
      gmv: '₹24.8L',
      growth: '+18.2%',
    },
    {
      city: 'Bhopal - Arera Colony FOFO',
      partner: 'Radiance Salon Ventures',
      appointments: 920,
      avgTicket: '₹2,010',
      gmv: '₹18.5L',
      growth: '+14.5%',
    },
    {
      city: 'Ujjain - Freeganj FOCO',
      partner: 'Mahakal Beauty Partners',
      appointments: 840,
      avgTicket: '₹1,690',
      gmv: '₹14.2L',
      growth: '+22.0%',
    },
    {
      city: 'Gwalior - City Centre FOFO',
      partner: 'Gwalior Royal Spa Co.',
      appointments: 710,
      avgTicket: '₹1,746',
      gmv: '₹12.4L',
      growth: '+11.8%',
    },
    {
      city: 'Jabalpur - Civil Lines FOFO',
      partner: 'Jabalpur Luxe Salons',
      appointments: 580,
      avgTicket: '₹1,655',
      gmv: '₹9.6L',
      growth: '+9.4%',
    },
  ];

  // Franchise Alerts (Section 14 PRD)
  const alerts = [
    {
      id: 'ALT-01',
      type: 'Agreement Expiring',
      partner: 'Gwalior Royal Spa Co.',
      location: 'City Centre Outlet 1',
      date: 'Due in 24 Days (11 Sep 2026)',
      severity: 'High',
      status: 'Open Action',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      actionTab: 'agreements',
    },
    {
      id: 'ALT-02',
      type: 'Pending Partner Approval',
      partner: 'Zenith Esthetics Pvt Ltd',
      location: 'Raipur Shankar Nagar (Proposed)',
      date: 'Submitted 3 Days Ago',
      severity: 'Medium',
      status: 'Under Review',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      actionTab: 'partners',
    },
    {
      id: 'ALT-03',
      type: 'Compliance Audit Expiring',
      partner: 'Mahakal Beauty Partners',
      location: 'Ujjain Freeganj Branch',
      date: 'Fire NOC Expiry (28 Aug 2026)',
      severity: 'High',
      status: 'Document Due',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      actionTab: 'agreements',
    },
    {
      id: 'ALT-04',
      type: 'Outstanding Royalty Settlement',
      partner: 'Radiance Salon Ventures',
      location: 'Bhopal Arera Outlet',
      date: '₹60,000 Pending for July 2026',
      severity: 'Critical',
      status: 'Pending Clearing',
      badgeColor: 'bg-purple-50 text-[#5A2EA6] border-purple-200',
      actionTab: 'royalties',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Filter Bar & Action Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Region / Location */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Franchise Regions (6 Cities)</option>
              <option value="Indore Region">Indore &amp; Malwa Region</option>
              <option value="Bhopal Region">Bhopal &amp; Central MP</option>
              <option value="Gwalior-Chambal">Gwalior &amp; Chambal</option>
              <option value="Mahakoshal">Jabalpur &amp; Mahakoshal</option>
            </select>
          </div>

          {/* Franchise Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Operational Statuses</option>
              <option value="Active">Active Partners</option>
              <option value="Pending">Pending Onboarding</option>
              <option value="Suspended">Suspended Operations</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="This Quarter">Current Quarter (Q2 FY26-27)</option>
              <option value="This Month">Current Month (Aug 2026)</option>
              <option value="Last Month">Last Month (Jul 2026)</option>
              <option value="Financial YTD">Financial YTD (FY26-27)</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting Franchise Network Executive Dossier (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Executive Summary</span>
          </Button>
        </div>
      </div>

      {/* 2. 8 KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpis.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={cn('w-6 h-6 rounded-lg grid place-items-center', kpi.bg, kpi.color)}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-extrabold px-1.5 py-0.5 rounded-full',
                      kpi.isPositive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700',
                    )}
                  >
                    {kpi.change}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-soft uppercase tracking-wider block">
                  {kpi.title}
                </span>
                <strong className="text-base font-serif font-bold text-ink mt-0.5 block truncate">
                  {kpi.value}
                </strong>
              </div>
              <div className="mt-1.5 pt-1 border-t border-slate-100 text-[9px] text-muted truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Franchise Alerts Callout Section (Section 14 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-4">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#5A2EA6]" />
            <h3 className="font-serif font-bold text-ink text-sm">
              Franchise Governance &amp; Compliance Alerts
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
              {alerts.length} Pending Attention
            </span>
          </div>
          <span className="text-[11px] text-soft font-semibold">
            Live Brand Owner Escalation Desk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {alerts.map((al) => (
            <div
              key={al.id}
              className="p-3 rounded-xl border border-slate-100 bg-[#FCFAFF] space-y-2 flex flex-col justify-between hover:border-[#5A2EA6]/30 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'text-[9px] font-bold px-2 py-0.5 rounded-full border',
                      al.badgeColor,
                    )}
                  >
                    {al.severity} Severity
                  </span>
                  <span className="text-[10px] font-mono text-muted">{al.id}</span>
                </div>
                <strong className="text-xs font-bold text-ink block">{al.type}</strong>
                <p className="text-[11px] text-slate-700 font-medium mt-0.5">{al.partner}</p>
                <span className="text-[10px] text-muted block">{al.location}</span>
                <span className="text-[10px] font-semibold text-rose-700 block mt-1">
                  {al.date}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-soft">{al.status}</span>
                <button
                  onClick={() => onNavigateTab && onNavigateTab(al.actionTab)}
                  className="text-[10px] font-bold text-[#5A2EA6] hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-0 p-0"
                >
                  <span>Resolve</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Charts & Analytics Row (Section 12 PRD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Franchise Partners by Turnover */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-ink text-base">
                Top Franchise Partners by Revenue
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                Ranked by gross customer turnover and 10% royalty generation
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigateTab && onNavigateTab('partners')}
              className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
            >
              <span>View All {partnersCount || 12} Partners</span>
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          <div className="space-y-3">
            {topPartners.map((tp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 bg-[#FCFAFF] flex flex-wrap items-center justify-between gap-3 hover:border-[#5A2EA6]/30 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5A2EA6] text-xs font-bold grid place-items-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-ink block">{tp.name}</strong>
                    <span className="text-[10px] text-muted font-mono">
                      {tp.code} · {tp.outlets} Operational Outlets
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-right">
                  <div>
                    <span className="text-[10px] text-soft block">Gross Turnover</span>
                    <strong className="font-serif font-bold text-ink">{tp.gmv}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-soft block">Brand Royalty (10%)</span>
                    <strong className="font-serif font-bold text-[#5A2EA6]">{tp.royalty}</strong>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-soft block">Audit Compliance</span>
                    <span className="font-bold text-emerald-700 text-[11px]">
                      {tp.compliance}% Score
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Growth & Regional Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-ink text-base">
                Regional Revenue Distribution
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                Network GMV split across territorial clusters
              </p>
            </div>
            <span className="text-xs font-bold text-[#5A2EA6]">₹86.5L Total</span>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-3 pt-1 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-ink">Indore Metropolitan Hub (6 Outlets)</span>
                <span className="font-extrabold text-[#5A2EA6]">₹38,20,000 (44.2%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-purple-100 overflow-hidden">
                <div className="h-full bg-[#5A2EA6] rounded-full" style={{ width: '44.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-ink">Bhopal &amp; Central MP (4 Outlets)</span>
                <span className="font-extrabold text-blue-700">₹22,10,000 (25.5%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-blue-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '25.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-ink">Ujjain Spiritual Circuit (3 Outlets)</span>
                <span className="font-extrabold text-amber-700">₹14,20,000 (16.4%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-amber-100 overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: '16.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-ink">
                  Gwalior &amp; Chambal Cluster (3 Outlets)
                </span>
                <span className="font-extrabold text-teal-700">₹12,00,000 (13.9%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-teal-100 overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '13.9%' }} />
              </div>
            </div>
          </div>

          {/* Quick Handoff Card */}
          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs flex items-center justify-between mt-4">
            <div>
              <strong className="text-ink font-bold block">Finance Panel Settlement Link</strong>
              <p className="text-[11px] text-muted">
                Detailed partner banking, GST tax filings &amp; ledger vouchers
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = '/finance?tab=transactions';
              }}
              className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 shrink-0"
            >
              <span>Finance Panel</span>
              <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Franchise Location Performance Comparison Matrix (Section 12 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Franchise Location Operational Performance Matrix
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                Outlet Benchmarking
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Comparative footfall velocity, average ticket size, gross turnover, and YoY growth
              pacing across key franchise branches
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">Sorted by GMV Turnover</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Franchise Outlet &amp; Model</th>
                <th className="p-3.5">Franchise Partner Entity</th>
                <th className="p-3.5 text-center">Quarterly Footfall</th>
                <th className="p-3.5 text-center">Avg Ticket Value</th>
                <th className="p-3.5 text-right">Gross GMV Turnover</th>
                <th className="p-3.5 text-center">YoY Growth Pace</th>
                <th className="p-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {locationPerformance.map((lp, idx) => (
                <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink">{lp.city}</td>
                  <td className="p-3.5 whitespace-nowrap text-slate-800 font-semibold">
                    {lp.partner}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap text-slate-900 font-bold">
                    {lp.appointments.toLocaleString()} visits
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-mono text-slate-800">
                    {lp.avgTicket}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-bold text-[#5A2EA6] text-sm">
                    {lp.gmv}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <TrendingUp className="w-3 h-3" />
                      <span>{lp.growth}</span>
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => onNavigateTab && onNavigateTab('locations')}
                      className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                    >
                      Inspect Outlet
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
