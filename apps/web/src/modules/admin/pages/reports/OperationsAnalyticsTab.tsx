import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertOctagon,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Globe,
  Percent,
  PhoneCall,
  Smartphone,
  Store,
  TrendingUp,
  UserCheck,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { UniversalExportModal } from './UniversalExportModal';

export interface OperationsAnalyticsTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function OperationsAnalyticsTab({
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
}: OperationsAnalyticsTabProps = {}) {
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedDateRange, setSelectedDateRange] = useState('Current Quarter');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 7 Operations Appointment KPIs (Section 2 PRD)
  const opKpis = [
    {
      title: 'Total Bookings',
      value: lockBranch ? '2,640' : '9,840',
      sub: lockBranch ? `Assigned to ${defaultBranch}` : '+16.9% vs Prev Qtr',
      isPos: true,
      icon: Calendar,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Completed Visits',
      value: lockBranch ? '2,320' : '8,420',
      sub: '87.8% Fulfillment',
      isPos: true,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Cancellations',
      value: lockBranch ? '90' : '420',
      sub: '3.4% Attrition Rate',
      isPos: false,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      title: 'No-Shows',
      value: lockBranch ? '40' : '180',
      sub: '1.5% Lost Slots',
      isPos: false,
      icon: AlertOctagon,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Walk-in Clients',
      value: lockBranch ? '190' : '820',
      sub: '7.2% Instant Footfall',
      isPos: true,
      icon: UserCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Waitlist Demand',
      value: lockBranch ? '45' : '160',
      sub: 'Peak Slot Buffer',
      isPos: true,
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Chair Occupancy',
      value: lockBranch ? '88.4%' : '84.5%',
      sub: 'Target: 80.0%',
      isPos: true,
      icon: Percent,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ];

  // Branch Operations Comparison (Section 2 PRD)
  const branchOperations = [
    {
      branch: 'Indore - Vijay Nagar Flagship',
      bookings: 2640,
      completed: 2320,
      cancelled: 90,
      noShows: 40,
      occupancy: '88.4%',
      walkins: 190,
    },
    {
      branch: 'Bhopal - Arera Colony Lounge',
      bookings: 1980,
      completed: 1710,
      cancelled: 80,
      noShows: 35,
      occupancy: '84.2%',
      walkins: 155,
    },
    {
      branch: 'Indore - Palasia Premium Studio',
      bookings: 1840,
      completed: 1600,
      cancelled: 75,
      noShows: 30,
      occupancy: '85.6%',
      walkins: 135,
    },
    {
      branch: 'Ujjain - Freeganj Main Studio',
      bookings: 1520,
      completed: 1290,
      cancelled: 85,
      noShows: 45,
      occupancy: '81.8%',
      walkins: 190,
    },
    {
      branch: 'Gwalior - City Centre Hub',
      bookings: 1260,
      completed: 1040,
      cancelled: 65,
      noShows: 25,
      occupancy: '79.2%',
      walkins: 110,
    },
    {
      branch: 'Jabalpur - Civil Lines Lounge',
      bookings: 600,
      completed: 460,
      cancelled: 25,
      noShows: 5,
      occupancy: '76.0%',
      walkins: 40,
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
        reportTitle="Operations & Appointment Analytics"
        defaultCategory="Operations"
        availableColumns={[
          'Branch Location',
          'Total Bookings',
          'Completed Visits',
          'Cancelled Bookings',
          'No-Show Count',
          'Walk-in Clients',
          'Chair Occupancy (%)',
          'Fulfillment Rate (%)',
        ]}
        onExportComplete={(fmt, title) =>
          showToast(`Successfully exported ${title} in ${fmt} format.`)
        }
      />

      {/* 1. Global Filter Bar & Export Actions */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Branch Scope */}
          {!lockBranch && (
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
          )}

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
          <span>Export Operations Data</span>
        </Button>
      </div>

      {/* 2. 7 KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {opKpis.map((kpi, idx) => {
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
                  <span className="text-[9px] font-bold text-soft uppercase tracking-wider">
                    Metrics
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

      {/* 3. Charts & Booking Source Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chair Occupancy & Fulfullment Timeline */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-ink text-base">
                Weekly Slot Utilization &amp; Chair Occupancy
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                Benchmarked against maximum theoretical workstation capacity
              </p>
            </div>
            <span className="text-xs font-bold text-[#5A2EA6]">84.5% Network Average</span>
          </div>

          {/* Occupancy Pacing Bars */}
          <div className="space-y-3 pt-1 text-xs">
            {[
              { day: 'Monday (Midday Lull)', rate: '68.4%', slots: '164 / 240', pct: 68 },
              {
                day: 'Tuesday - Wednesday (Standard Routine)',
                rate: '76.2%',
                slots: '183 / 240',
                pct: 76,
              },
              {
                day: 'Thursday - Friday (Pre-weekend Surge)',
                rate: '88.5%',
                slots: '212 / 240',
                pct: 88,
              },
              {
                day: 'Saturday - Sunday (Peak Rush & Bridal)',
                rate: '96.2%',
                slots: '231 / 240',
                pct: 96,
              },
            ].map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-ink">{d.day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted font-mono">{d.slots} Slots</span>
                    <strong className="font-bold text-[#5A2EA6]">{d.rate}</strong>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full bg-[#5A2EA6] rounded-full"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Channel Distribution */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-ink text-base">Booking Inflow Channels</h3>
              <p className="text-[11px] text-muted mt-0.5">
                Distribution of origin sources for 9,840 appointments
              </p>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-ink">
                    <Smartphone className="w-3.5 h-3.5 text-[#5A2EA6]" />
                    <span>  Mobile App</span>
                  </span>
                  <strong className="text-[#5A2EA6]">4,720 (48.0%)</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                  <div className="h-full bg-[#5A2EA6]" style={{ width: '48%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-ink">
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Center Concierge</span>
                  </span>
                  <strong className="text-blue-700">2,165 (22.0%)</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-ink">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Walk-in Visitors</span>
                  </span>
                  <strong className="text-emerald-700">1,770 (18.0%)</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-ink">
                    <Globe className="w-3.5 h-3.5 text-amber-600" />
                    <span>Brand Website Widget</span>
                  </span>
                  <strong className="text-amber-700">1,185 (12.0%)</strong>
                </div>
                <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
                  <div className="h-full bg-amber-600" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-muted text-center font-medium">
            4.3% Cancellation Rate · 1.8% No-Show Loss
          </div>
        </div>
      </div>

      {/* 4. Branch / Floor Suite Operations Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                {lockBranch
                  ? `${defaultBranch} · Floor Zones & Station Fulfillment`
                  : 'Branch Operational Fulfillment Comparison'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {lockBranch ? 'Zone Benchmarking' : 'Operations Benchmarking'}
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              {lockBranch
                ? `Station-wise completed rituals, cancelled bookings, walk-ins, and chair occupancy for ${defaultBranch}`
                : 'Comparative bookings, completed rituals, cancelled slots, no-show loss, and workstation occupancy'}
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            {lockBranch ? '5 Salon Floor Zones' : '6 Active Salons'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">{lockBranch ? 'Floor Suite / Zone' : 'Salon Outlet'}</th>
                <th className="p-3.5 text-center">Total Bookings</th>
                <th className="p-3.5 text-center">Completed Visits</th>
                <th className="p-3.5 text-center">Cancelled</th>
                <th className="p-3.5 text-center">No-Shows</th>
                <th className="p-3.5 text-center">Walk-ins</th>
                <th className="p-3.5 pr-5 text-right">Chair Occupancy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {(lockBranch
                ? [
                  {
                    branch: 'Hair Care & Precision Styling Studio',
                    bookings: 1240,
                    completed: 1110,
                    cancelled: 38,
                    noShows: 18,
                    occupancy: '92.4%',
                    walkins: 95,
                  },
                  {
                    branch: 'Clinical Aesthetics & Skin Laser Suite',
                    bookings: 620,
                    completed: 560,
                    cancelled: 22,
                    noShows: 10,
                    occupancy: '89.6%',
                    walkins: 32,
                  },
                  {
                    branch: 'Spa Sanctuary & Holistic Therapy',
                    bookings: 410,
                    completed: 365,
                    cancelled: 16,
                    noShows: 6,
                    occupancy: '86.2%',
                    walkins: 18,
                  },
                  {
                    branch: 'Nail Bar & Express Pedicure Lounge',
                    bookings: 250,
                    completed: 215,
                    cancelled: 11,
                    noShows: 4,
                    occupancy: '82.5%',
                    walkins: 45,
                  },
                  {
                    branch: 'Bridal & VIP Transformation Suite',
                    bookings: 120,
                    completed: 110,
                    cancelled: 3,
                    noShows: 2,
                    occupancy: '96.0%',
                    walkins: 0,
                  },
                ]
                : branchOperations
              ).map((bo, idx) => (
                <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink text-xs">
                    {bo.branch}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                    {bo.bookings.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-emerald-700">
                    {bo.completed.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap text-rose-700 font-semibold">
                    {bo.cancelled} ({((bo.cancelled / bo.bookings) * 100).toFixed(1)}%)
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap text-amber-700 font-semibold">
                    {bo.noShows}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap text-blue-700 font-medium">
                    {bo.walkins}
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap font-serif font-extrabold text-[#5A2EA6] text-sm">
                    {bo.occupancy}
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
