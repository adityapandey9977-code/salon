import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Award,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Percent,
  Search,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { DialogModal } from '../../../../shared/components/DialogModal';

export interface CommissionRecord {
  id: string;
  staffName: string;
  empId: string;
  role: string;
  branch: string;
  branchId: string;
  period: string;
  serviceRev: string;
  rawService: number;
  retailRev: string;
  rawRetail: number;
  targetAchievement: string;
  targetPct: number;
  baseCommission: string;
  tierIncentive: string;
  assistantSplit: string;
  tips: string;
  adjustments: string;
  finalCommission: string;
  rawFinal: number;
  status: 'Calculated' | 'Pending Approval' | 'Approved' | 'Exported' | 'Paid';
}

export const initialCommissions: CommissionRecord[] = [
  {
    id: 'COM-2026-0801',
    staffName: 'Vikram Joshi',
    empId: 'EMP-IND-01',
    role: 'Master Creative Director',
    branch: 'Indore Central (Flagship)',
    branchId: 'BR-01',
    period: 'Aug 2026 (1-18 Aug)',
    serviceRev: '₹3,45,000',
    rawService: 345000,
    retailRev: '₹62,000',
    rawRetail: 62000,
    targetAchievement: '115% of ₹3.5L Target',
    targetPct: 115,
    baseCommission: '₹34,500 (10% Service)',
    tierIncentive: '₹6,900 (+2% Milestone)',
    assistantSplit: '-₹3,450 (10% to Jr. Stylist)',
    tips: '₹4,800',
    adjustments: '₹0',
    finalCommission: '₹42,750',
    rawFinal: 42750,
    status: 'Pending Approval',
  },
  {
    id: 'COM-2026-0802',
    staffName: 'Pooja Bhatt',
    empId: 'EMP-VJY-04',
    role: 'Senior Aesthetician',
    branch: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    period: 'Aug 2026 (1-18 Aug)',
    serviceRev: '₹2,80,000',
    rawService: 280000,
    retailRev: '₹45,000',
    rawRetail: 45000,
    targetAchievement: '102% of ₹2.7L Target',
    targetPct: 102,
    baseCommission: '₹28,000 (10% Service)',
    tierIncentive: '₹2,800 (+1% Bonus)',
    assistantSplit: '₹0',
    tips: '₹3,200',
    adjustments: '₹0',
    finalCommission: '₹34,000',
    rawFinal: 34000,
    status: 'Approved',
  },
  {
    id: 'COM-2026-0803',
    staffName: 'Sunil Verma',
    empId: 'EMP-BHP-02',
    role: 'Senior Hair Stylist',
    branch: 'Bhopal Arera Colony',
    branchId: 'BR-03',
    period: 'Aug 2026 (1-18 Aug)',
    serviceRev: '₹2,10,000',
    rawService: 210000,
    retailRev: '₹30,000',
    rawRetail: 30000,
    targetAchievement: '88% of ₹2.4L Target',
    targetPct: 88,
    baseCommission: '₹16,800 (8% Service)',
    tierIncentive: '₹0',
    assistantSplit: '₹0',
    tips: '₹2,100',
    adjustments: '₹0',
    finalCommission: '₹18,900',
    rawFinal: 18900,
    status: 'Calculated',
  },
  {
    id: 'COM-2026-0804',
    staffName: 'Meera Sharma',
    empId: 'EMP-UJJ-03',
    role: 'Lead Spa Therapist',
    branch: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    period: 'Aug 2026 (1-18 Aug)',
    serviceRev: '₹1,95,000',
    rawService: 195000,
    retailRev: '₹18,000',
    rawRetail: 18000,
    targetAchievement: '95% of ₹2.0L Target',
    targetPct: 95,
    baseCommission: '₹17,550 (9% Service)',
    tierIncentive: '₹0',
    assistantSplit: '₹0',
    tips: '₹2,800',
    adjustments: '₹0',
    finalCommission: '₹20,350',
    rawFinal: 20350,
    status: 'Approved',
  },
  {
    id: 'COM-2026-0805',
    staffName: 'Kunal Deshmukh',
    empId: 'EMP-GWL-01',
    role: 'Stylist & Colorist',
    branch: 'Gwalior City Centre',
    branchId: 'BR-05',
    period: 'Aug 2026 (1-18 Aug)',
    serviceRev: '₹1,50,000',
    rawService: 150000,
    retailRev: '₹12,000',
    rawRetail: 12000,
    targetAchievement: '90% of ₹1.6L Target',
    targetPct: 90,
    baseCommission: '₹12,000 (8% Service)',
    tierIncentive: '₹0',
    assistantSplit: '₹0',
    tips: '₹1,500',
    adjustments: '₹0',
    finalCommission: '₹13,500',
    rawFinal: 13500,
    status: 'Paid',
  },
];

export function CommissionsTab() {
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<CommissionRecord[]>(initialCommissions);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCommission, setActiveCommission] = useState<CommissionRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 5 KPI Cards (Section 11)
  const kpis = [
    {
      title: 'Total Commission Pool',
      value: '₹4,12,500',
      sub: '8.5% effective rate',
      change: '+11.2%',
    },
    { title: 'Pending Approval', value: '₹1,22,400', sub: '8 Stylists pending', isPending: true },
    { title: 'Approved Payouts', value: '₹2,35,100', sub: 'Ready for batch export', isGood: true },
    { title: 'Paid / Settled', value: '₹55,000', sub: 'Current pay cycle', isGood: true },
    { title: 'Average Commission Rate', value: '9.2%', sub: 'Target 8.0 - 10.5%', isGood: true },
  ];

  // Filtering
  const filtered = commissions.filter((c) => {
    const matchesSearch =
      c.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || c.branchId === selectedBranch;
    const matchesStatus =
      selectedStatus === 'all' || c.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleOpenBreakdown = (record: CommissionRecord) => {
    setActiveCommission(record);
    setIsDetailOpen(true);
  };

  const handleApproveCommission = () => {
    if (!activeCommission) return;
    setCommissions((prev) =>
      prev.map((c) => (c.id === activeCommission.id ? { ...c, status: 'Approved' } : c)),
    );
    toast(`Commission for ${activeCommission.staffName} approved.`);
    setIsDetailOpen(false);
  };

  const getStatusBadge = (status: CommissionRecord['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Approved':
      case 'Exported':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Approval':
      case 'Calculated':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search Staff Name, EMP ID, Role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 pl-8 text-xs text-ink outline-none focus:border-[#5A2EA6]"
            />
            <Search className="w-3.5 h-3.5 text-soft absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Branches</option>
            <option value="BR-01">Indore Central</option>
            <option value="BR-02">Vijay Nagar Boutique</option>
            <option value="BR-03">Bhopal Arera Colony</option>
            <option value="BR-04">Ujjain Mahakal Road</option>
            <option value="BR-05">Gwalior City Centre</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Commission Statuses</option>
            <option value="calculated">Calculated</option>
            <option value="pending approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast('Exporting Commission Summary Schedule (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Commissions</span>
          </Button>
        </div>
      </div>

      {/* 2. 5 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                {kpi.title}
              </span>
              <strong className="text-lg font-serif font-bold text-ink mt-1 block">
                {kpi.value}
              </strong>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-muted">{kpi.sub}</span>
              {kpi.change && <span className="font-bold text-emerald-600">{kpi.change}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Commission Overview Table (Section 11) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Staff Commission & Incentive Register
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {filtered.length} Professionals
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Brand-wide staff performance tracking, tier milestones, assistant splits, and gratuity
              distribution
            </p>
          </div>

          <div className="text-xs text-soft">
            <span>Cycle: 01 Aug - 18 Aug 2026</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Staff Member & ID</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5 text-right">Service Rev</th>
                <th className="p-3.5 text-right">Retail Rev</th>
                <th className="p-3.5 text-center">Target Perf</th>
                <th className="p-3.5 text-right">Base Comm</th>
                <th className="p-3.5 text-right">Tips</th>
                <th className="p-3.5 text-right">Final Payout</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Staff */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{c.staffName}</strong>
                    <span className="text-[10px] text-soft">
                      {c.empId} · {c.role}
                    </span>
                  </td>

                  {/* Branch */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 block text-xs">{c.branch}</span>
                    <span className="text-[10px] text-soft">{c.branchId}</span>
                  </td>

                  {/* Revenue */}
                  <td className="p-3.5 text-right font-bold text-ink whitespace-nowrap">
                    {c.serviceRev}
                  </td>
                  <td className="p-3.5 text-right text-soft whitespace-nowrap">{c.retailRev}</td>

                  {/* Target Achievement */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        c.targetPct >= 100
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200',
                      )}
                    >
                      {c.targetPct}% Target
                    </span>
                  </td>

                  {/* Base & Tips */}
                  <td className="p-3.5 text-right font-semibold text-slate-800 whitespace-nowrap">
                    {c.baseCommission}
                  </td>
                  <td className="p-3.5 text-right text-emerald-700 font-semibold whitespace-nowrap">
                    {c.tips}
                  </td>

                  {/* Final Payout */}
                  <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                    {c.finalCommission}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        getStatusBadge(c.status),
                      )}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenBreakdown(c)}
                      className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-[#5A2EA6]" />
                      <span>Inspect</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Commission Calculation Breakdown Modal (Section 12) */}
      {activeCommission && (
        <DialogModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Commission Dossier · ${activeCommission.staffName}`}
          description="Detailed formula breakdown and entitlement audit"
        >
          <div className="space-y-4 text-xs">
            {/* Header Tag */}
            <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#5A2EA6]/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  {activeCommission.role}
                </span>
                <strong className="text-sm font-serif font-bold text-ink">
                  {activeCommission.staffName} ({activeCommission.empId})
                </strong>
              </div>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-[10px] font-bold border',
                  getStatusBadge(activeCommission.status),
                )}
              >
                {activeCommission.status}
              </span>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Service Billing
                </span>
                <strong className="text-xs font-bold text-ink mt-0.5 block">
                  {activeCommission.serviceRev}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Retail Sales
                </span>
                <strong className="text-xs font-bold text-ink mt-0.5 block">
                  {activeCommission.retailRev}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Target Realization
                </span>
                <strong className="text-xs font-bold text-emerald-700 mt-0.5 block">
                  {activeCommission.targetAchievement}
                </strong>
              </div>
            </div>

            {/* Step-by-Step Calculation Breakdown (Section 12) */}
            <div className="p-3.5 rounded-xl border border-[#5A2EA6]/20 bg-white space-y-2">
              <span className="font-serif font-bold text-ink block pb-1 border-b border-slate-100">
                Formula Calculation Breakdown
              </span>

              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-soft">1. Base Commission:</span>
                  <span className="font-bold text-ink">{activeCommission.baseCommission}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>2. Tier Milestone Incentive:</span>
                  <span className="font-bold">+{activeCommission.tierIncentive}</span>
                </div>
                {activeCommission.assistantSplit !== '₹0' && (
                  <div className="flex justify-between text-rose-600">
                    <span>3. Assistant / Team Split:</span>
                    <span className="font-bold">{activeCommission.assistantSplit}</span>
                  </div>
                )}
                <div className="flex justify-between text-indigo-700">
                  <span>4. Gratuity / Direct Tips:</span>
                  <span className="font-bold">+{activeCommission.tips}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>5. Special Adjustments:</span>
                  <span>{activeCommission.adjustments}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-200 font-extrabold text-sm text-ink">
                  <span className="font-serif">Final Net Commission Payout:</span>
                  <span className="font-serif text-[#5A2EA6] text-base">
                    {activeCommission.finalCommission}
                  </span>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="p-2.5 bg-purple-50/40 rounded-xl text-[11px] text-soft">
              Detailed bank batch payroll generation and TDS tax deductions are processed in the{' '}
              <strong>Finance Panel</strong>.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-line gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast(`Opening payroll workspace for ${activeCommission.empId}...`);
                  window.location.href = `/finance?tab=payroll&emp=${activeCommission.empId}`;
                }}
                className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/40 text-[#5A2EA6] hover:bg-purple-50 flex items-center gap-1.5"
              >
                <span>View Payroll in Finance</span>
                <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
              </Button>

              <div className="flex items-center gap-2">
                {activeCommission.status === 'Pending Approval' ? (
                  <Button
                    onClick={handleApproveCommission}
                    className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    Approve Commission
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsDetailOpen(false)}
                    className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogModal>
      )}
    </div>
  );
}
