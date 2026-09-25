import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Filter,
  Percent,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { UniversalExportModal } from './UniversalExportModal';

export function ClientRetentionAnalyticsTab() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('Current Quarter');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 7 Client Retention KPIs (Section 5 PRD)
  const clientKpis = [
    {
      title: 'Total Active Clients',
      value: '14,200',
      sub: '+17.4% vs Prev Qtr',
      isPos: true,
      icon: Users,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'New First-Time Clients',
      value: '3,840',
      sub: '27.0% Acquisition',
      isPos: true,
      icon: UserPlus,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Returning Repeat Clients',
      value: '10,360',
      sub: '73.0% Retention',
      isPos: true,
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Rebooking Conversion',
      value: '76.8%',
      sub: 'Target: 70.0%',
      isPos: true,
      icon: Percent,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Inactive Cohort (>60d)',
      value: '1,240',
      sub: 'Win-back Queue',
      isPos: false,
      icon: UserX,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Avg Visit Frequency',
      value: 'Every 24 Days',
      sub: 'High Repeat Rhythm',
      isPos: true,
      icon: Clock,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Client Lifetime Value',
      value: '₹14,500',
      sub: 'Annualised LTV',
      isPos: true,
      icon: DollarSign,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
    },
  ];

  // Client Cohort Segments (Section 5 PRD)
  const clientSegments = [
    {
      segment: 'Loyal Champions (5+ Visits / Year)',
      clients: 4280,
      visits: 21400,
      frequency: 'Every 18 Days',
      revenue: '₹62,40,000',
      rebookingRate: '92.4%',
      badge: 'bg-purple-50 text-[#5A2EA6] border-purple-200',
    },
    {
      segment: 'Active Regulars (2-4 Visits)',
      clients: 6080,
      visits: 18240,
      frequency: 'Every 26 Days',
      revenue: '₹48,20,000',
      rebookingRate: '81.0%',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      segment: 'New First-Time Clients',
      clients: 3840,
      visits: 3840,
      frequency: 'Single Visit (Onboarding)',
      revenue: '₹22,80,000',
      rebookingRate: '68.5%',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      segment: 'Dormant / Inactive (60 - 90 Days)',
      clients: 1240,
      visits: 1240,
      frequency: 'Lapsed >60 Days',
      revenue: '₹6,40,000',
      rebookingRate: '34.2%',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      segment: 'At Churn Risk (>90 Days Inactive)',
      clients: 620,
      visits: 620,
      frequency: 'Lapsed >90 Days',
      revenue: '₹3,00,000',
      rebookingRate: '14.0%',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
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

      {/* Export Modal */}
      <UniversalExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Client Retention & Cohort Analytics"
        defaultCategory="Client Retention"
        availableColumns={[
          'Client Segment',
          'Active Client Count',
          'Total Visits Recorded',
          'Average Visit Frequency',
          'Gross Revenue Generated (₹)',
          'Rebooking Conversion (%)',
        ]}
        onExportComplete={(fmt, title) =>
          showToast(`Successfully exported ${title} in ${fmt} format.`)
        }
      />

      {/* 1. Global Filter Bar & Export Actions */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Branch Scope */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Salon Outlets (6 Branches)</option>
              <option value="indore-vn">Indore - Vijay Nagar Flagship</option>
              <option value="indore-pal">Indore - Palasia Premium</option>
              <option value="bhopal-arera">Bhopal - Arera Colony</option>
              <option value="ujjain-free">Ujjain - Freeganj Studio</option>
              <option value="gwalior-cc">Gwalior - City Centre</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="Current Quarter">Current Quarter (Q2 FY26-27)</option>
              <option value="Current Month">Current Month (Aug 2026)</option>
              <option value="Financial YTD">Financial YTD (FY26-27)</option>
            </select>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsExportOpen(true)}
          className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Export Client Cohorts</span>
        </Button>
      </div>

      {/* 2. 7 KPI Metric Cards Grid (Section 5 PRD) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {clientKpis.map((kpi, idx) => {
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

      {/* 3. Client Cohort Segments Table (Section 5 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Client Retention Cohorts &amp; Churn Risk Matrix
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                PRD Retention Measures
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              New vs repeat, rebooking conversion, inactive cohorts, frequency, value, and churn
              risk
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">14,200 Total Clients</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Client Segment Cohort</th>
                <th className="p-3.5 text-center">Active Clients</th>
                <th className="p-3.5 text-center">Total Visits</th>
                <th className="p-3.5 text-center">Visit Frequency</th>
                <th className="p-3.5 text-right">Revenue Generated</th>
                <th className="p-3.5 pr-5 text-right">Rebooking Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {clientSegments.map((cs, idx) => (
                <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border mr-2',
                        cs.badge,
                      )}
                    >
                      {cs.segment.split(' (')[0]}
                    </span>
                    <span className="text-slate-700 font-medium text-xs">{cs.segment}</span>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                    {cs.clients.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap text-slate-800">
                    {cs.visits.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-mono text-slate-900 font-semibold">
                    {cs.frequency}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-extrabold text-[#5A2EA6] text-sm">
                    {cs.revenue}
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap font-bold text-emerald-700">
                    {cs.rebookingRate}
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
