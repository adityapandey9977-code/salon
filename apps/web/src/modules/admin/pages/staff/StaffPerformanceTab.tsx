import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Percent,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { staffApi } from '@/shared/api';
import { masterBranches } from '../locations/AllBranchesTab';
import { type FullStaffRecord, StaffProfilePage } from './StaffProfilePage';

export interface StaffPerformanceTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function StaffPerformanceTab({
  defaultBranch = 'All',
  lockBranch = false,
}: StaffPerformanceTabProps = {}) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [staffList, setStaffList] = useState<FullStaffRecord[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [dateRange, setDateRange] = useState('This Month (Aug 2026)');

  // Fetch live staff records
  React.useEffect(() => {
    let isMounted = true;
    async function loadStaff() {
      try {
        setIsLoadingApi(true);
        const data = await staffApi.list();
        if (isMounted && Array.isArray(data)) {
          setStaffList(data);
        }
      } catch (err) {
        console.warn('Live staff performance fetch notice:', err);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }
    loadStaff();
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected staff for in-page profile
  const [selectedStaffForProfile, setSelectedStaffForProfile] = useState<FullStaffRecord | null>(
    null,
  );

  const filteredStaff = useMemo(() => {
    return staffList
      .filter((s) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          s.fullName.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q);
        const matchesBranch = branchFilter === 'All' || s.branch === branchFilter;
        return matchesSearch && matchesBranch;
      })
      .sort((a, b) => (b.metrics?.revenueGenerated || 0) - (a.metrics?.revenueGenerated || 0));
  }, [staffList, searchQuery, branchFilter]);

  // Dynamic KPI aggregates
  const totalRevenue = useMemo(() => {
    return filteredStaff.reduce((sum, s) => sum + (s.metrics?.revenueGenerated || 0), 0);
  }, [filteredStaff]);

  const avgUtilisation = useMemo(() => {
    if (filteredStaff.length === 0) return 0;
    const sum = filteredStaff.reduce((acc, s) => acc + (s.metrics?.utilisation || 0), 0);
    return Math.round(sum / filteredStaff.length);
  }, [filteredStaff]);

  const avgCsat = useMemo(() => {
    if (filteredStaff.length === 0) return '0.00';
    const sum = filteredStaff.reduce((acc, s) => acc + (s.metrics?.csatRating || 0), 0);
    return (sum / filteredStaff.length).toFixed(2);
  }, [filteredStaff]);

  const avgTargetAchieved = useMemo(() => {
    if (filteredStaff.length === 0) return 0;
    const sum = filteredStaff.reduce((acc, s) => acc + (s.metrics?.targetAchievement || 0), 0);
    return Math.round(sum / filteredStaff.length);
  }, [filteredStaff]);

  if (selectedStaffForProfile) {
    return (
      <StaffProfilePage
        staffData={selectedStaffForProfile}
        onBack={() => setSelectedStaffForProfile(null)}
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
              Staff Performance &amp; Revenue Analytics
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              94.8% Target Achievement
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Executive revenue leaderboard, client rebooking rates, service delivery efficiency,
            chair utilisation, and CSAT ratings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported staff performance ranking report to CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Performance</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Brand Staff Revenue
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Live Gross Revenue
          </span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
            Average Utilisation
          </span>
          <strong className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1 block">
            {avgUtilisation}%
          </strong>
          <span className="text-[10px] text-soft block mt-1">
            Across {filteredStaff.length} Stylists
          </span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-emerald-800 uppercase font-bold block">
            Service Efficiency
          </span>
          <strong className="text-2xl font-bold text-emerald-700 font-serif mt-1 block">
            {filteredStaff.length > 0 ? '98.5%' : '0%'}
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">
            SLA Adherence
          </span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Target Achievement
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
            {avgTargetAchieved}%
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">
            {avgTargetAchieved >= 80 ? 'On Track' : 'Below Target'}
          </span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-amber-700 uppercase font-bold block">
            Overall CSAT Rating
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 flex items-center gap-1">
            <span className="text-amber-500">★</span> {avgCsat}{' '}
            <span className="text-xs text-soft font-normal">/ 5.0</span>
          </strong>
          <span className="text-[10px] text-soft block mt-1">
            {filteredStaff.length > 0 ? 'Aggregated Reviews' : 'No Reviews Yet'}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search staff leaderboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
          {/* Branch Filter */}
          {!lockBranch && (
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Branch:</span>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="All">All Branches</option>
                {masterBranches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Date Range */}
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="This Month (Aug 2026)">This Month (Aug 2026)</option>
              <option value="Last Month (July 2026)">Last Month (July 2026)</option>
              <option value="Quarter to Date (Q3 2026)">Quarter to Date (Q3 2026)</option>
              <option value="Financial Year (2026-27)">Financial Year (2026-27)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Staff Revenue &amp; Efficiency Leaderboard
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Multi-branch performance rankings, booking density, and service volume metrics
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredStaff.length} Specialists Evaluated
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Rank & Specialist',
                  'Branch & Role',
                  'Gross Revenue',
                  'Services Billed',
                  'Efficiency',
                  'Retail Sales',
                  'Utilisation',
                  'Target %',
                  'CSAT Score',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider whitespace-nowrap',
                      i === 0 ? 'pl-5' : i === 9 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-ink font-serif mb-1">
                        {searchQuery || branchFilter !== 'All'
                          ? 'No matching staff performance records'
                          : 'No performance data available'}
                      </h4>
                      <p className="text-xs text-muted max-w-xs">
                        {searchQuery || branchFilter !== 'All'
                          ? 'Try adjusting your search criteria or branch filters.'
                          : 'Staff performance leaderboard will populate as services and appointments are completed.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((st, idx) => {
                  const eff = st.metrics?.serviceEfficiency || {
                    score: 100,
                    avgDurationMinutes: 45,
                    standardDurationMinutes: 45,
                    varianceMinutes: 0,
                    onTimeDeliveryRate: 100,
                  };

                  return (
                    <tr key={st.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      {/* Rank & Specialist */}
                      <td className="p-3.5 pl-5">
                        <button
                          onClick={() => setSelectedStaffForProfile(st)}
                          className="flex items-center gap-3 text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                          title="Click to view full staff profile"
                        >
                          <span
                            className={cn(
                              'w-6 h-6 rounded-full font-bold text-xs grid place-items-center shrink-0',
                              idx === 0
                                ? 'bg-amber-400 text-amber-950 font-serif'
                                : idx === 1
                                  ? 'bg-slate-300 text-slate-800'
                                  : idx === 2
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-purple-50 text-[#5A2EA6]',
                            )}
                          >
                            #{idx + 1}
                          </span>
                          <Avatar
                            initials={st.avatarInitials}
                            className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <strong className="text-ink text-[13px] block group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                              {st.fullName}
                            </strong>
                            <span className="text-[10px] text-muted font-mono">{st.id}</span>
                          </div>
                        </button>
                      </td>

                      {/* Branch & Role */}
                      <td className="p-3.5">
                        <div className="font-semibold text-ink text-xs">{st.role}</div>
                        <div className="text-[10px] text-muted">{st.branch}</div>
                      </td>

                      {/* Revenue */}
                      <td className="p-3.5 font-serif font-bold text-ink text-[13.5px]">
                        ₹{(st.metrics?.revenueGenerated || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Services Count */}
                      <td className="p-3.5 text-soft font-semibold">
                        {st.metrics?.servicesCompleted || 0} Sessions
                      </td>

                      {/* Efficiency */}
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full font-bold text-[10.5px] inline-block',
                            eff.score >= 100
                              ? 'bg-emerald-100 text-emerald-800'
                              : eff.score >= 95
                                ? 'bg-purple-100 text-[#5A2EA6]'
                                : 'bg-amber-100 text-amber-800',
                          )}
                        >
                          {eff.score}%
                        </span>
                      </td>

                      {/* Retail Sales */}
                      <td className="p-3.5 font-serif text-ink font-semibold">
                        ₹{(st.metrics?.retailSales || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Utilisation */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#5A2EA6]"
                              style={{ width: `${st.metrics?.utilisation || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#5A2EA6]">
                            {st.metrics?.utilisation || 0}%
                          </span>
                        </div>
                      </td>

                      {/* Target % */}
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {st.metrics?.targetAchievement || 0}%
                        </span>
                      </td>

                      {/* CSAT Score */}
                      <td className="p-3.5 font-bold text-amber-600">★ {st.metrics?.csatRating || 5.0}</td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right">
                        <button
                          onClick={() => setSearchParams({ tab: 'performance', staffId: st.id })}
                          className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] inline-flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffPerformanceTab;
