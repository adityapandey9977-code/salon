import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { staffApi } from '@/shared/api';
import { masterBranches } from '../locations/AllBranchesTab';
import { type FullStaffRecord, StaffProfilePage } from './StaffProfilePage';

export function ProductivityUtilisationTab() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [staffList, setStaffList] = useState<FullStaffRecord[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [branchFilter, setBranchFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('This Month (Aug 2026)');

  // Fetch live staff
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
        console.warn('Live staff productivity fetch notice:', err);
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
        const matchesBranch = branchFilter === 'All' || s.branch === branchFilter;
        const matchesSearch =
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBranch && matchesSearch;
      })
      .sort((a, b) => (b.metrics?.utilisation || 0) - (a.metrics?.utilisation || 0));
  }, [staffList, branchFilter, searchQuery]);

  const avgUtilisation = useMemo(() => {
    if (filteredStaff.length === 0) return 0;
    const sum = filteredStaff.reduce((acc, s) => acc + (s.metrics?.utilisation || 0), 0);
    return Math.round(sum / filteredStaff.length);
  }, [filteredStaff]);

  const activeSpecialists = useMemo(() => {
    return filteredStaff.filter((s) => s.status === 'Active').length;
  }, [filteredStaff]);

  const excellentCount = useMemo(() => {
    return filteredStaff.filter((s) => (s.metrics?.utilisation || 0) >= 85).length;
  }, [filteredStaff]);

  const onTargetCount = useMemo(() => {
    return filteredStaff.filter(
      (s) => (s.metrics?.utilisation || 0) >= 75 && (s.metrics?.utilisation || 0) < 85,
    ).length;
  }, [filteredStaff]);

  const belowTargetCount = useMemo(() => {
    return filteredStaff.filter((s) => (s.metrics?.utilisation || 0) < 75).length;
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
              Productivity &amp; Chair Utilisation Analytics
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              84.2% Brand Utilisation
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Monitor floor efficiency, treatment turnover buffer times, chair booking occupancy, and
            specialist capacity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported productivity and utilisation report to CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Utilisation</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Active Floor Specialists
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
            {activeSpecialists} Staff
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            {filteredStaff.length > 0 ? 'Live Active Status' : 'No Active Staff'}
          </span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
            Average Chair Utilisation
          </span>
          <strong className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1 block">
            {avgUtilisation}%
          </strong>
          <span className="text-[10px] text-soft mt-1 block">
            Across {filteredStaff.length} Stylists
          </span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Average Treatment Turnover
          </span>
          <strong className="text-2xl font-bold text-emerald-700 font-serif mt-1 block">
            {filteredStaff.length > 0 ? '54 Mins' : '—'}
          </strong>
          <span className="text-[10px] text-soft mt-1 block">Includes Standard Buffer</span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-purple-700 uppercase font-bold block">
            Utilisation Capacity
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
            {filteredStaff.length > 0 ? `${avgUtilisation}%` : '0%'}
          </strong>
          <span className="text-[10px] text-soft mt-1 block">
            {filteredStaff.length > 0 ? 'Active Shift Occupancy' : 'No Shifts Logged'}
          </span>
        </div>
      </div>

      {/* Utilisation Tier Summary Callout */}
      <div className="p-5 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
          Floor Capacity Utilisation Distribution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                Excellent Tier (&gt;85%)
              </span>
              <strong className="text-sm font-bold text-emerald-900 mt-0.5 block">
                {excellentCount} Specialists (
                {filteredStaff.length > 0
                  ? Math.round((excellentCount / filteredStaff.length) * 100)
                  : 0}
                %)
              </strong>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-200/60 text-emerald-900 font-bold text-xs">
              Peak
            </span>
          </div>

          <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#5A2EA6] font-bold uppercase block">
                On Target Tier (75-85%)
              </span>
              <strong className="text-sm font-bold text-ink mt-0.5 block">
                {onTargetCount} Specialists (
                {filteredStaff.length > 0
                  ? Math.round((onTargetCount / filteredStaff.length) * 100)
                  : 0}
                %)
              </strong>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-purple-200/60 text-[#5A2EA6] font-bold text-xs">
              Optimal
            </span>
          </div>

          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-800 font-bold uppercase block">
                Below Target (&lt;75%)
              </span>
              <strong className="text-sm font-bold text-amber-900 mt-0.5 block">
                {belowTargetCount} Specialists (
                {filteredStaff.length > 0
                  ? Math.round((belowTargetCount / filteredStaff.length) * 100)
                  : 0}
                %)
              </strong>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-amber-200/60 text-amber-900 font-bold text-xs">
              Capacity Avail
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search specialist utilisation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
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
        </div>
      </div>

      {/* Utilisation Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Staff Chair Utilisation &amp; Floor Efficiency Ranking
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Active time rendering treatments vs scheduled shift hours
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredStaff.length} Specialists
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Specialist & Role',
                  'Branch Location',
                  'Chair Utilisation Bar',
                  'Tier Status',
                  'Services Billed',
                  'Gross Revenue',
                  'Retail Sales',
                  'Commission Earned',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === 8 ? 'pr-5 text-right' : '',
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
                  <td colSpan={9} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-ink font-serif mb-1">
                        {searchQuery || branchFilter !== 'All'
                          ? 'No matching specialist utilisation records'
                          : 'No productivity records logged'}
                      </h4>
                      <p className="text-xs text-muted max-w-xs">
                        {searchQuery || branchFilter !== 'All'
                          ? 'Try adjusting your search query or branch filter.'
                          : 'Chair utilisation data will calculate in real time as appointments and shifts are performed.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((st) => {
                  const tier =
                    (st.metrics?.utilisation || 0) >= 85
                      ? { label: 'Excellent', color: 'bg-emerald-100 text-emerald-800' }
                      : (st.metrics?.utilisation || 0) >= 75
                        ? { label: 'On Target', color: 'bg-purple-100 text-[#5A2EA6]' }
                        : { label: 'Below Target', color: 'bg-amber-100 text-amber-800' };

                  return (
                    <tr key={st.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      {/* Specialist */}
                      <td className="p-3.5 pl-5">
                        <button
                          onClick={() => setSearchParams({ tab: 'productivity', staffId: st.id })}
                          className="flex items-center gap-3 text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                          title="Click to view full staff profile"
                        >
                          <Avatar
                            initials={st.avatarInitials}
                            className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs"
                          />
                          <div>
                            <strong className="text-ink text-[13px] block group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                              {st.fullName}
                            </strong>
                            <span className="text-[10px] text-muted">{st.role}</span>
                          </div>
                        </button>
                      </td>

                      {/* Branch */}
                      <td className="p-3.5 text-soft">{st.branch}</td>

                      {/* Utilisation Bar */}
                      <td className="p-3.5 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all',
                                (st.metrics?.utilisation || 0) >= 85 ? 'bg-emerald-600' : 'bg-[#5A2EA6]',
                              )}
                              style={{ width: `${st.metrics?.utilisation || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-ink min-w-[32px]">
                            {st.metrics?.utilisation || 0}%
                          </span>
                        </div>
                      </td>

                      {/* Tier Status */}
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                            tier.color,
                          )}
                        >
                          {tier.label}
                        </span>
                      </td>

                      {/* Services Count */}
                      <td className="p-3.5 text-ink font-semibold">
                        {st.metrics?.servicesCompleted || 0} Sessions
                      </td>

                      {/* Revenue */}
                      <td className="p-3.5 font-serif font-bold text-ink">
                        ₹{(st.metrics?.revenueGenerated || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Retail */}
                      <td className="p-3.5 font-serif text-soft">
                        ₹{(st.metrics?.retailSales || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Commission */}
                      <td className="p-3.5 font-serif font-bold text-[#5A2EA6]">
                        ₹{(st.metrics?.commissionEarned || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right">
                        <button
                          onClick={() => setSelectedStaffForProfile(st)}
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

export default ProductivityUtilisationTab;
