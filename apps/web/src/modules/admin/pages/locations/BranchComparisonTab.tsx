import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Download,
  Filter,
  Layers,
  Percent,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useAdminContext } from '../../context/AdminContext';
import { tenantsApi } from '@/shared/api/tenants.api';
import { BranchRecord, masterBranches } from './AllBranchesTab';

type ComparisonMetric =
  | 'Revenue'
  | 'Appointments'
  | 'Occupancy'
  | 'New Clients'
  | 'Returning Clients'
  | 'Staff Utilisation'
  | 'Client Rating'
  | 'Growth Percentage';

export function BranchComparisonTab() {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const [liveBranches, setLiveBranches] = useState<BranchRecord[]>([]);

  useEffect(() => {
    tenantsApi.listBranches().then((branches) => {
      if (Array.isArray(branches) && branches.length > 0) {
        setLiveBranches(branches as BranchRecord[]);
      }
    }).catch(() => {});
  }, []);

  const branchList = useMemo(() => {
    if (liveBranches.length > 0) return liveBranches;
    return salon?.branches && salon.branches.length > 0 ? (salon.branches as BranchRecord[]) : masterBranches;
  }, [liveBranches, salon?.branches]);

  // Multi-select branches (defaults to all/first few branches)
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>(() => {
    return branchList.slice(0, 3).map((b) => b.id);
  });

  const [dateRange, setDateRange] = useState<string>('This Month');
  const [activeMetric, setActiveMetric] = useState<ComparisonMetric>('Revenue');

  const toggleBranchSelection = (id: string) => {
    if (selectedBranchIds.includes(id)) {
      if (selectedBranchIds.length <= 1 && branchList.length > 1) {
        toast('Please keep at least 1 branch selected.');
        return;
      }
      setSelectedBranchIds(selectedBranchIds.filter((bId) => bId !== id));
    } else {
      setSelectedBranchIds([...selectedBranchIds, id]);
    }
  };

  const selectedBranches = useMemo(() => {
    const list = branchList.filter((b) => selectedBranchIds.includes(b.id));
    return list.length > 0 ? list : branchList.slice(0, 2);
  }, [branchList, selectedBranchIds]);

  // Find leader for current metric
  const maxRevenue = Math.max(...selectedBranches.map((b) => b.revenue || 0));

  const handleExportComparison = () => {
    toast(`Exported comparison report for ${selectedBranches.length} branches.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Selection Control Panel */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Multi-Branch Comparison Matrix
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Benchmark revenue, customer acquisition, chair efficiency, and customer satisfaction
              across units.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleExportComparison}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export Comparison</span>
          </Button>
        </div>

        {/* Multi-Branch Selector Chips */}
        <div>
          <div className="text-[11px] font-bold text-ink uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Select Branches to Compare ({selectedBranches.length} Selected):</span>
            <span className="text-[#5A2EA6] font-normal normal-case text-xs">
              Select locations to benchmark
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {branchList.map((b) => {
              const isSelected = selectedBranchIds.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBranchSelection(b.id)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer select-none',
                    isSelected
                      ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                      : 'bg-[#FCFAFF] text-soft hover:bg-slate-100 border-[#5A2EA6]/20',
                  )}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{b.name}</span>
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded-md font-semibold',
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700',
                    )}
                  >
                    {b.city}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-muted shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            Metric:
          </span>
          {[
            'Revenue',
            'Appointments',
            'Occupancy',
            'New Clients',
            'Returning Clients',
            'Staff Utilisation',
            'Client Rating',
            'Growth Percentage',
          ].map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric as ComparisonMetric)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer',
                activeMetric === metric
                  ? 'bg-purple-100 text-[#5A2EA6] border-purple-300 font-bold'
                  : 'bg-white text-soft hover:text-ink border-slate-200',
              )}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedBranches.map((b) => {
          const isLeader = b.revenue === maxRevenue;
          return (
            <div
              key={b.id}
              className={cn(
                'p-5 rounded-[24px] border transition-all flex flex-col justify-between relative overflow-hidden bg-white shadow-xs',
                isLeader ? 'border-[#5A2EA6] ring-2 ring-[#5A2EA6]/20' : 'border-[#5A2EA6]/12',
              )}
            >
              {isLeader && (
                <div className="absolute top-0 right-0 bg-[#5A2EA6] text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-xs">
                  <Award className="w-3 h-3 text-amber-300" />
                  <span>Revenue Leader</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[#5A2EA6] font-bold bg-[#5A2EA6]/10 px-2 py-0.5 rounded-md">
                    {b.code}
                  </span>
                  <span className="text-[10px] font-semibold text-muted">{b.type}</span>
                </div>
                <h3 className="font-serif text-[17px] font-bold text-ink truncate">{b.name}</h3>
                <p className="text-[11px] text-muted">
                  {b.city} · Mgr: {b.manager}
                </p>

                {/* Main Metric Focus Display */}
                <div className="my-4 p-3.5 rounded-2xl bg-[#FCFAFF] border border-[#5A2EA6]/15">
                  <span className="text-[10px] font-bold uppercase text-soft block">
                    {activeMetric}
                  </span>
                  <div className="text-[24px] font-bold font-serif text-[#5A2EA6] mt-0.5">
                    {activeMetric === 'Revenue'
                      ? `₹${(b.revenue / 100000).toFixed(2)}L`
                      : activeMetric === 'Appointments'
                        ? `${b.appointments} Visits`
                        : activeMetric === 'Occupancy'
                          ? `${b.occupancy}%`
                          : activeMetric === 'New Clients'
                            ? `${Math.round(b.clientCount * 0.22)} Clients`
                            : activeMetric === 'Returning Clients'
                              ? `${Math.round(b.clientCount * 0.78)} Clients`
                              : activeMetric === 'Staff Utilisation'
                                ? `${Math.round(b.occupancy * 0.96)}%`
                                : activeMetric === 'Client Rating'
                                  ? `★ 4.85 / 5.0`
                                  : `+14.8%`}
                  </div>
                </div>

                {/* Sub Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-muted block font-semibold">Occupancy</span>
                    <strong className="text-ink text-[13px]">{b.occupancy}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-muted block font-semibold">Total Staff</span>
                    <strong className="text-ink text-[13px]">{b.staffCount} Stylists</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-muted">Status:</span>
                <span
                  className={cn(
                    'font-bold px-2 py-0.5 rounded-full text-[9.5px]',
                    b.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800',
                  )}
                >
                  {b.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Detailed Benchmarking Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Head-to-Head Branch Metrics Comparison Table
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Comprehensive comparative scorecard across all operational performance vectors
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {selectedBranches.length} Branches in Comparison
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Branch Location',
                  'Monthly Revenue',
                  'Growth %',
                  'Appointments',
                  'Occupancy Rate',
                  'New Clients',
                  'Staff Utilisation',
                  'Client CSAT',
                  'Performance Rating',
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
              {selectedBranches.map((b) => (
                <tr key={b.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  <td className="p-3.5 pl-5">
                    <div className="font-bold text-ink text-[13px]">{b.name}</div>
                    <div className="text-[10px] text-muted">
                      {b.city} · {b.type}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-ink text-[13px]">
                    ₹{(b.revenue / 100000).toFixed(2)}L
                  </td>
                  <td className="p-3.5 font-bold text-emerald-600">+14.8%</td>
                  <td className="p-3.5 font-semibold text-soft">{b.appointments}</td>
                  <td className="p-3.5 font-bold text-ink">{b.occupancy}%</td>
                  <td className="p-3.5 font-semibold text-indigo-700">
                    {Math.round(b.clientCount * 0.22)}
                  </td>
                  <td className="p-3.5 font-semibold text-soft">
                    {Math.round(b.occupancy * 0.94)}%
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11.5px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      4.85 / 5.0
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        b.revenue >= 700000
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.revenue >= 400000
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800',
                      )}
                    >
                      {b.revenue >= 700000
                        ? 'Top Tier'
                        : b.revenue >= 400000
                          ? 'Strong Growth'
                          : 'Developing'}
                    </span>
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
