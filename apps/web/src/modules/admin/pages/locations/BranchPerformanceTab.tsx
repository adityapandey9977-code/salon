import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Filter,
  MapPin,
  Percent,
  RefreshCw,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useAdminContext } from '../../context/AdminContext';
import { tenantsApi } from '@/shared/api/tenants.api';
import { masterBranches } from './AllBranchesTab';

interface BranchPerformanceTabProps {
  defaultBranchName?: string;
}

export function BranchPerformanceTab({ defaultBranchName }: BranchPerformanceTabProps) {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const [liveBranches, setLiveBranches] = useState<any[]>([]);

  useEffect(() => {
    tenantsApi.listBranches().then((branches) => {
      if (Array.isArray(branches) && branches.length > 0) {
        setLiveBranches(branches);
      }
    }).catch(() => {});
  }, []);

  const branchList = useMemo(() => {
    if (liveBranches.length > 0) return liveBranches;
    return salon?.branches && salon.branches.length > 0 ? salon.branches : masterBranches;
  }, [liveBranches, salon?.branches]);

  const [selectedBranchName, setSelectedBranchName] = useState<string>(() => {
    return defaultBranchName || (branchList[0]?.name || '');
  });

  const [dateRange, setDateRange] = useState<string>('This Month');
  const [comparePeriod, setComparePeriod] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const activeBranch = useMemo(() => {
    return branchList.find((b) => b.name === selectedBranchName) || branchList[0] || masterBranches[0];
  }, [selectedBranchName, branchList]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast(`Performance data refreshed for ${activeBranch.name}.`);
    }, 500);
  };

  const handleExport = () => {
    toast(`Exported branch performance metrics report for ${activeBranch.name}.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters Header Bar */}
      <div className="bg-white p-4.5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Branch Performance Analytics
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Deep dive into unit revenue, chair occupancy, stylist utilization, and booking velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Branch Selector */}
          <div className="relative">
            <select
              value={selectedBranchName}
              onChange={(e) => setSelectedBranchName(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6] appearance-none cursor-pointer shadow-xs"
            >
              {branchList.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-[#5A2EA6] absolute left-3 top-3.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6] appearance-none cursor-pointer shadow-xs"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
              <option value="Custom">Custom Range</option>
            </select>
            <CalendarDays className="w-3.5 h-3.5 text-[#5A2EA6] absolute left-3 top-3.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          {/* Compare Toggle */}
          <button
            onClick={() => setComparePeriod(!comparePeriod)}
            className={cn(
              'h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer select-none',
              comparePeriod
                ? 'bg-purple-50 text-[#5A2EA6] border-[#5A2EA6]/40 shadow-xs'
                : 'bg-[#FCFAFF] text-muted border-slate-200 hover:text-ink',
            )}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Compare Period</span>
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                comparePeriod ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300',
              )}
            />
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 w-10 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-[#5A2EA6] hover:bg-[#5A2EA6]/10 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* 8 Unit Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Revenue */}
        <div className="premium-stat-card p-4.5 rounded-[22px]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Branch Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[24px] font-bold font-serif text-ink tracking-tight">
            ₹{(activeBranch.revenue / 100000).toFixed(2)}L
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+16.4%</span>
            {comparePeriod && (
              <span className="text-muted font-normal text-[10px]">vs ₹8.09L prev</span>
            )}
          </div>
        </div>

        {/* 2. Total Appointments */}
        <div className="premium-stat-card p-4.5 rounded-[22px]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] grid place-items-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[24px] font-bold font-serif text-ink tracking-tight">
            {activeBranch.appointments}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.8% volume</span>
          </div>
        </div>

        {/* 3. Completed Appointments */}
        <div className="premium-stat-card p-4.5 rounded-[22px]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Completed Visits
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[24px] font-bold font-serif text-ink tracking-tight">
            {Math.round(activeBranch.appointments * 0.91)}
          </div>
          <div className="text-[10.5px] text-emerald-700 font-bold mt-1">91.2% Completion Rate</div>
        </div>

        {/* 4. Occupancy Rate */}
        <div className="premium-stat-card p-4.5 rounded-[22px]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Chair Occupancy
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 grid place-items-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[24px] font-bold font-serif text-ink tracking-tight">
            {activeBranch.occupancy}%
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#5A2EA6] h-full rounded-full"
                style={{ width: `${activeBranch.occupancy}%` }}
              />
            </div>
            <span className="text-[10px] text-muted font-bold">Peak: 96%</span>
          </div>
        </div>

        {/* 5. Cancellation Rate */}
        <div className="premium-stat-card p-4.5 rounded-[22px]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Cancellation Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 grid place-items-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[24px] font-bold font-serif text-ink tracking-tight">4.2%</div>
          <div className="text-[10.5px] text-soft mt-1">20 cancellations (8 rescheduled)</div>
        </div>

        {/* 6. No-Show Rate */}
        <div className="premium-stat-card p-4.5 rounded-[22px]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              No-Show Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-700 grid place-items-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[24px] font-bold font-serif text-ink tracking-tight">2.8%</div>
          <div className="text-[10.5px] text-emerald-700 font-bold mt-1">
            Below 3.5% group target
          </div>
        </div>

        {/* 7. New Clients */}
        <div className="premium-stat-card p-4.5 rounded-[22px]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              New Clients
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 grid place-items-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[24px] font-bold font-serif text-ink tracking-tight">184</div>
          <div className="text-[10.5px] text-indigo-700 font-bold mt-1">
            +22.4% new client surge
          </div>
        </div>

        {/* 8. Returning Clients */}
        <div className="premium-stat-card p-4.5 rounded-[22px]">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Returning Clients
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 grid place-items-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[24px] font-bold font-serif text-ink tracking-tight">642</div>
          <div className="text-[10.5px] text-purple-700 font-bold mt-1">
            77.7% Loyalty retention
          </div>
        </div>
      </div>

      {/* Visual Charts: Revenue & Occupancy Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Trend Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                Daily Revenue Velocity ({activeBranch.name})
              </h3>
              <p className="text-[11px] text-muted">Daily collection pacing vs target threshold</p>
            </div>
            <span className="text-[11px] font-bold text-[#5A2EA6]">Target: ₹32,000 / Day</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 px-2 pt-4 border-b border-slate-100 pb-2">
            {[
              { day: 'Mon', val: 32, label: '₹32,400' },
              { day: 'Tue', val: 28, label: '₹28,100' },
              { day: 'Wed', val: 36, label: '₹36,500' },
              { day: 'Thu', val: 34, label: '₹34,200' },
              { day: 'Fri', val: 48, label: '₹48,900' },
              { day: 'Sat', val: 62, label: '₹62,400' },
              { day: 'Sun', val: 58, label: '₹58,100' },
            ].map((item, idx) => (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-16 bg-slate-900 text-white text-[10px] font-bold p-1.5 rounded-lg pointer-events-none z-20 whitespace-nowrap">
                  {item.label}
                </div>
                <div
                  className={cn(
                    'w-full max-w-[42px] rounded-t-xl transition-all duration-300 group-hover:scale-105 shadow-xs',
                    idx >= 4
                      ? 'bg-gradient-to-t from-[#5A2EA6] to-[#8B6FD8]'
                      : 'bg-gradient-to-t from-[#5A2EA6]/75 to-[#8B6FD8]/75',
                  )}
                  style={{ height: `${(item.val / 65) * 100}%` }}
                />
                <span className="text-[10px] font-bold text-soft group-hover:text-[#5A2EA6]">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>Weekend Surge: +54% revenue velocity over weekdays</span>
            <span className="font-bold text-emerald-600">
              On-Track to exceed monthly target (+14%)
            </span>
          </div>
        </div>

        {/* Right: Hourly Occupancy & Staff Utilisation Matrix */}
        <div className="lg:col-span-5 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3.5">
              <div>
                <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                  Hourly Chair Utilisation
                </h3>
                <p className="text-[11px] text-muted">Peak booking windows across salon chairs</p>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                18 Active Chairs
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { slot: '10:00 AM - 01:00 PM (Morning Slot)', pct: 72, label: 'Optimal' },
                { slot: '01:00 PM - 04:00 PM (Afternoon Dip)', pct: 58, label: 'Promotion Window' },
                { slot: '04:00 PM - 07:00 PM (Evening Peak)', pct: 96, label: 'Near Capacity' },
                { slot: '07:00 PM - 09:00 PM (Night Rush)', pct: 88, label: 'High Demand' },
              ].map((slot) => (
                <div key={slot.slot} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-ink">{slot.slot}</span>
                    <span className="font-bold text-[#5A2EA6]">{slot.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        slot.pct >= 90
                          ? 'bg-rose-500'
                          : slot.pct >= 70
                            ? 'bg-[#5A2EA6]'
                            : 'bg-amber-500',
                      )}
                      style={{ width: `${slot.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-muted">Managed by {activeBranch.manager}</span>
            <span className="font-bold text-[#5A2EA6]">Client CSAT: 4.9 ★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
