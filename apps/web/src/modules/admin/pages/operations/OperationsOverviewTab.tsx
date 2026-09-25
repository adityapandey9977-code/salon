import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Phone,
  PieChart,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { masterBranches } from '../locations/AllBranchesTab';
import { useOperationsData, type OperationsData } from './useOperationsData';

export interface OperationsOverviewTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
  operationsData?: OperationsData;
}

export function OperationsOverviewTab({
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
  operationsData,
}: OperationsOverviewTabProps = {}) {
  const fallbackOps = useOperationsData({ defaultBranch, lockBranch });
  const ops = operationsData || fallbackOps;
  const { toast } = useToast();
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [dateRange, setDateRange] = useState('Current Period');

  const branchesList = ops.branchesList.length > 0 ? ops.branchesList : masterBranches;
  const totalBookings = ops.appointments.length;
  const confirmedCount = ops.appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Booked',
  ).length;
  const waitingCount = ops.appointments.filter((a) => a.status === 'Checked-in').length;
  const inServiceCount = ops.appointments.filter((a) => a.status === 'In Service').length;
  const completedCount = ops.appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = ops.appointments.filter(
    (a) => a.status === 'Cancelled' || a.status === 'No-show',
  ).length;
  const walkinsCount = ops.walkins.length;
  const occupancyRate = ops.occupancyRate;

  const kpis = [
    {
      label: 'Total Appointments',
      value: `${totalBookings} ${totalBookings === 1 ? 'Booking' : 'Bookings'}`,
      change: 'Active Tenant Ledger',
      color: 'text-ink',
    },
    {
      label: 'Confirmed & Scheduled',
      value: `${confirmedCount} Slots`,
      change: `${totalBookings > 0 ? Math.round((confirmedCount / totalBookings) * 100) : 0}% Advance Notice`,
      color: 'text-emerald-700',
    },
    {
      label: 'Checked-in & Waiting',
      value: `${waitingCount} Guests`,
      change: 'Floor Reception Paced',
      color: 'text-blue-700',
    },
    {
      label: 'Currently in Service',
      value: `${inServiceCount} Stations`,
      change: `${occupancyRate}% Chair Utilisation`,
      color: 'text-[#5A2EA6]',
    },
    {
      label: 'Completed Deliveries',
      value: `${completedCount} Sessions`,
      change: '100% Quality Checked',
      color: 'text-emerald-800',
    },
    {
      label: 'Cancellations / No-shows',
      value: `${cancelledCount} Slots`,
      change: 'Safeguarded Retention',
      color: 'text-rose-700',
    },
    {
      label: 'Floor Walk-ins Handled',
      value: `${walkinsCount} Walk-ins`,
      change: '100% Paced',
      color: 'text-amber-800',
    },
    {
      label: 'Overall Chair Occupancy',
      value: `${occupancyRate}%`,
      change: 'Realtime Floor Efficiency',
      color: 'text-[#5A2EA6]',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              {lockBranch
                ? `${defaultBranch} · Operations Analytics`
                : 'Operational Performance & Floor Analytics'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {occupancyRate}% Chair Occupancy
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            {lockBranch
              ? `Real-time booking volume, chair occupancy, cancellation telemetry, and floor productivity for ${defaultBranch}.`
              : 'Multi-branch booking volume, cancellation telemetry, channel breakdown, and floor productivity index.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported operations dashboard analytics to PDF & CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics</span>
          </Button>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs space-y-1"
          >
            <span className="text-[10px] text-muted uppercase font-bold block">{kpi.label}</span>
            <strong className={cn('text-2xl font-bold font-serif block', kpi.color)}>
              {kpi.value}
            </strong>
            <span className="text-[10px] text-soft block">{kpi.change}</span>
          </div>
        ))}
      </div>


      {/* Channel Breakdown & Branch Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Booking Channels Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-purple-50">
            <h3 className="font-bold text-ink text-sm">Booking Source Channels</h3>
            <span className="text-xs text-[#5A2EA6] font-bold">{totalBookings} Total</span>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Online Booking Widget',
                count: ops.appointments.filter((a) => a.bookingSource === 'Online').length,
                color: 'bg-[#5A2EA6]',
              },
              {
                label: 'WhatsApp Concierge Link',
                count: ops.appointments.filter((a) => a.bookingSource === 'WhatsApp').length,
                color: 'bg-emerald-600',
              },
              {
                label: 'Call Centre Reservations',
                count: ops.appointments.filter((a) => a.bookingSource === 'Call Centre').length,
                color: 'bg-blue-600',
              },
              {
                label: 'Floor Walk-ins Registered',
                count: ops.appointments.filter((a) => a.bookingSource === 'Walk-in').length,
                color: 'bg-amber-500',
              },
              {
                label: 'Direct & Customer App',
                count: ops.appointments.filter(
                  (a) =>
                    a.bookingSource !== 'Online' &&
                    a.bookingSource !== 'WhatsApp' &&
                    a.bookingSource !== 'Call Centre' &&
                    a.bookingSource !== 'Walk-in',
                ).length,
                color: 'bg-purple-400',
              },
            ].map((src) => {
              const pct = totalBookings > 0 ? Math.round((src.count / totalBookings) * 100) : 0;
              return (
                <div key={src.label} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-ink">{src.label}</span>
                    <strong className="text-[#5A2EA6]">{pct}%</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn('h-full', src.color)} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted">{src.count} Bookings</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Comparison / Suite Performance (8 cols) */}
        <div className="lg:col-span-8 premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                {lockBranch
                  ? `${defaultBranch} · Suite & Station Utilisation`
                  : 'Multi-Branch Floor Operations Comparison'}
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                Live Operations Telemetry
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    lockBranch ? 'Treatment Suite / Station' : 'Branch Location',
                    'Appointments',
                    'Occupancy Rate',
                    'Avg Service Time',
                    'Cancellation %',
                    'Walk-in Ratio',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === 5 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {branchesList.map((br) => {
                  const brBookings = ops.appointments.filter(
                    (a) => a.branch === br.name || a.branchId === br.id,
                  );
                  const brWalkins = brBookings.filter((a) => a.bookingSource === 'Walk-in');
                  const brCancelled = brBookings.filter((a) => a.status === 'Cancelled');
                  const brOccupancy =
                    brBookings.length > 0
                      ? Math.min(100, Math.round((brBookings.length / 8) * 100))
                      : 0;
                  const canRate =
                    brBookings.length > 0
                      ? ((brCancelled.length / brBookings.length) * 100).toFixed(1)
                      : '0.0';
                  const walkRate =
                    brBookings.length > 0
                      ? Math.round((brWalkins.length / brBookings.length) * 100)
                      : 0;

                  return (
                    <tr
                      key={br.id}
                      className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                    >
                      <td className="p-3.5 pl-5">
                        <strong className="text-ink text-xs block">{br.name}</strong>
                        <span className="text-[10px] text-muted">{(br as any).city || 'Active Branch'}</span>
                      </td>
                      <td className="p-3.5 font-bold text-ink">{brBookings.length} Bookings</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {brOccupancy}%
                        </span>
                      </td>
                      <td className="p-3.5 text-soft">50 mins</td>
                      <td className="p-3.5 text-rose-700 font-semibold">{canRate}%</td>
                      <td className="p-3.5 pr-5 text-right font-bold text-[#5A2EA6]">
                        {walkRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default OperationsOverviewTab;
