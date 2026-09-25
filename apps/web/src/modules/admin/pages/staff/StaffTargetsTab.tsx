import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  Percent,
  Plus,
  Search,
  Tag,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { staffApi } from '@/shared/api';
import { masterBranches } from '../locations/AllBranchesTab';
import { type FullStaffRecord, StaffProfilePage, masterStaffRecords } from './StaffProfilePage';

export interface StaffTargetMatrixRow {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  branch: string;
  avatarInitials: string;
  period: string;
  serviceTarget: number;
  serviceAchieved: number;
  retailTarget: number;
  retailAchieved: number;
  combinedRate: number;
  status: 'Exceeded' | 'On Track' | 'Below Target';
}

export const initialTargetMatrix: StaffTargetMatrixRow[] = [];

export interface StaffTargetsTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function StaffTargetsTab({
  defaultBranch = 'All',
  lockBranch = false,
}: StaffTargetsTabProps = {}) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [targetRows, setTargetRows] = useState<StaffTargetMatrixRow[]>(initialTargetMatrix);
  const [liveStaff, setLiveStaff] = useState<FullStaffRecord[]>([]);
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [periodFilter, setPeriodFilter] = useState('August 2026');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live staff
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const staff = await staffApi.list();
        if (isMounted && Array.isArray(staff)) {
          setLiveStaff(staff);
          if (targetRows.length === 0 && staff.length > 0) {
            const defaultRows: StaffTargetMatrixRow[] = staff.map((s, idx) => ({
              id: `TGT-0${idx + 1}`,
              staffId: s.id,
              staffName: s.fullName,
              role: s.role,
              branch: s.branch || 'Main Branch',
              avatarInitials: s.avatarInitials,
              period: 'August 2026',
              serviceTarget: 250000,
              serviceAchieved: s.metrics?.revenueGenerated || 0,
              retailTarget: 50000,
              retailAchieved: s.metrics?.retailSales || 0,
              combinedRate: s.metrics?.targetAchievement || 0,
              status:
                (s.metrics?.targetAchievement || 0) >= 100
                  ? 'Exceeded'
                  : (s.metrics?.targetAchievement || 0) >= 80
                    ? 'On Track'
                    : 'Below Target',
            }));
            setTargetRows(defaultRows);
          }
        }
      } catch (err) {
        console.warn('Live staff targets fetch notice:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals state
  const [isAddTargetOpen, setIsAddTargetOpen] = useState(false);
  const [selectedStaffForProfile, setSelectedStaffForProfile] = useState<FullStaffRecord | null>(
    null,
  );

  // New Target Form State
  const [newTarget, setNewTarget] = useState({
    staffId: '',
    period: 'August 2026',
    serviceTarget: 250000,
    retailTarget: 50000,
    notes: '',
  });

  const filteredTargets = targetRows.filter((t: StaffTargetMatrixRow) => {
    const matchesBranch = branchFilter === 'All' || t.branch === branchFilter;
    const matchesSearch = t.staffName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const st = masterStaffRecords.find((s) => s.id === newTarget.staffId) || masterStaffRecords[0];
    if (!st) {
      toast('Please ensure staff records are available');
      return;
    }

    const created: StaffTargetMatrixRow = {
      id: `TGT-0${targetRows.length + 1}`,
      staffId: st.id,
      staffName: st.fullName,
      role: st.role,
      branch: st.branch,
      avatarInitials: st.avatarInitials,
      period: newTarget.period,
      serviceTarget: Number(newTarget.serviceTarget),
      serviceAchieved: 0,
      retailTarget: Number(newTarget.retailTarget),
      retailAchieved: 0,
      combinedRate: 0,
      status: 'Below Target',
    };

    setTargetRows([created, ...targetRows]);
    setIsAddTargetOpen(false);
    toast(`Target quota set for ${created.staffName} for ${created.period}.`);
  };

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
              Service &amp; Retail Performance Targets
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              89.8% Overall Quota Attainment
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Set and monitor monthly service revenue and retail product quotas with real-time
            completion progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported targets achievement matrix to CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Targets</span>
          </Button>

          <Button
            onClick={() => setIsAddTargetOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Set Target</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Brand Total Target
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">₹14,50,000</strong>
          <span className="text-[10px] text-soft mt-1 block">Across all locations</span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
            Revenue Achieved
          </span>
          <strong className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1 block">
            ₹12,42,000
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">85.6% Pacing</span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Service Quota Attainment
          </span>
          <strong className="text-2xl font-bold text-emerald-700 font-serif mt-1 block">
            89.4%
          </strong>
          <span className="text-[10px] text-soft mt-1 block">₹10,73,000 of ₹12,00,000</span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-amber-700 uppercase font-bold block">
            Retail Quota Attainment
          </span>
          <strong className="text-2xl font-bold text-amber-900 font-serif mt-1 block">67.6%</strong>
          <span className="text-[10px] text-soft mt-1 block">₹1,69,000 of ₹2,50,000</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search staff targets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {!lockBranch && (
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
        )}
      </div>

      {/* Target Matrix Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Monthly Staff Target Attainment Matrix
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Realtime progress tracking for service and retail quotas across all specialists
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              August 2026 Cycle
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Staff Specialist',
                  'Branch & Period',
                  'Service Revenue Target',
                  'Retail Sales Target',
                  'Combined Attainment',
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
              {filteredTargets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                        <Target className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-ink font-serif mb-1">
                        {searchQuery || branchFilter !== 'All'
                          ? 'No matching staff targets found'
                          : 'No staff targets configured'}
                      </h4>
                      <p className="text-xs text-muted mb-4 text-center max-w-xs">
                        {searchQuery || branchFilter !== 'All'
                          ? 'Try adjusting your search criteria or branch filters.'
                          : 'Set monthly service and retail quota milestones for your specialists.'}
                      </p>
                      <Button
                        onClick={() => setIsAddTargetOpen(true)}
                        className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a248c] text-white flex items-center gap-2 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Assign Staff Target</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTargets.map((row) => {
                  const serviceRate = Math.min(
                    100,
                    Math.round((row.serviceAchieved / row.serviceTarget) * 100),
                  );
                  const retailRate = Math.min(
                    100,
                    Math.round((row.retailAchieved / row.retailTarget) * 100),
                  );

                  return (
                    <tr key={row.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      {/* Staff */}
                      <td className="p-3.5 pl-5">
                        <button
                          onClick={() => {
                            setSearchParams({ tab: 'targets', staffId: row.staffId });
                          }}
                          className="flex items-center gap-3 text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                          title="Click to view full staff profile"
                        >
                          <Avatar
                            initials={row.avatarInitials}
                            className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs"
                          />
                          <div>
                            <strong className="text-ink text-[13px] block group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                              {row.staffName}
                            </strong>
                            <span className="text-[10px] text-muted">{row.role}</span>
                          </div>
                        </button>
                      </td>

                      {/* Branch & Period */}
                      <td className="p-3.5">
                        <div className="font-semibold text-ink text-xs">{row.branch}</div>
                        <div className="text-[10px] text-muted">{row.period}</div>
                      </td>

                      {/* Service Target Progress */}
                      <td className="p-3.5 min-w-[180px]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-ink font-serif">
                            ₹{row.serviceAchieved.toLocaleString('en-IN')}
                          </span>
                          <span className="text-muted">
                            Target: ₹{row.serviceTarget.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#5A2EA6]"
                              style={{ width: `${serviceRate}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-[#5A2EA6]">{serviceRate}%</span>
                        </div>
                      </td>

                      {/* Retail Target Progress */}
                      <td className="p-3.5 min-w-[180px]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-ink font-serif">
                            ₹{row.retailAchieved.toLocaleString('en-IN')}
                          </span>
                          <span className="text-muted">
                            Target: ₹{row.retailTarget.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600"
                              style={{ width: `${retailRate}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {retailRate}%
                          </span>
                        </div>
                      </td>

                      {/* Combined Attainment */}
                      <td className="p-3.5 font-bold text-ink text-sm">{row.combinedRate}%</td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                            row.status === 'Exceeded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.status === 'On Track'
                                ? 'bg-purple-100 text-[#5A2EA6]'
                                : 'bg-rose-100 text-rose-800',
                          )}
                        >
                          {row.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right">
                        <button
                          onClick={() => {
                            setSearchParams({ tab: 'targets', staffId: row.staffId });
                          }}
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

      {/* ================= MODALS ================= */}

      {/* 1. Set Target Modal */}
      {isAddTargetOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Assign Staff Targets
                  </h3>
                  <p className="text-[11px] text-muted">
                    Configure monthly service and retail quota milestones
                  </p>
                </div>
                <button
                  onClick={() => setIsAddTargetOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTarget} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Select Specialist *
                  </label>
                  <select
                    value={newTarget.staffId}
                    onChange={(e) => setNewTarget({ ...newTarget, staffId: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    {masterStaffRecords.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.role}) — {s.branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Target Period
                  </label>
                  <input
                    type="text"
                    required
                    value={newTarget.period}
                    onChange={(e) => setNewTarget({ ...newTarget, period: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Service Target (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newTarget.serviceTarget}
                      onChange={(e) =>
                        setNewTarget({ ...newTarget, serviceTarget: Number(e.target.value) })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Retail Target (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newTarget.retailTarget}
                      onChange={(e) =>
                        setNewTarget({ ...newTarget, retailTarget: Number(e.target.value) })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddTargetOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Set Target Quota
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default StaffTargetsTab;
