import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Building2,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Coins,
  DollarSign,
  Download,
  ExternalLink,
  Layers,
  Percent,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { staffApi } from '@/shared/api';
import { type FullStaffRecord, masterStaffRecords } from './StaffProfilePage';

export interface CommissionRuleItem {
  id: string;
  name: string;
  targetType: 'Service Category' | 'Retail Products' | 'Staff Role';
  targetEntity: string;
  commissionType: 'Percentage' | 'Fixed Amount';
  value: string;
  effectiveFrom: string;
  status: 'Active' | 'Draft';
}

export const initialCommissionRules: CommissionRuleItem[] = [
  {
    id: 'RUL-01',
    name: 'Master Aesthetician Clinical Facial Rule',
    targetType: 'Service Category',
    targetEntity: 'Medical Hydra-Facial & Peels',
    commissionType: 'Percentage',
    value: '12%',
    effectiveFrom: '01 Jan 2026',
    status: 'Active',
  },
  {
    id: 'RUL-02',
    name: 'Hair Color & Balayage Specialist Rule',
    targetType: 'Service Category',
    targetEntity: 'Balayage & Hair Color',
    commissionType: 'Percentage',
    value: '10%',
    effectiveFrom: '01 Jan 2026',
    status: 'Active',
  },
  {
    id: 'RUL-03',
    name: 'Retail Hair Care Product Sales Incentive',
    targetType: 'Retail Products',
    targetEntity: 'Kérastase & Olaplex Retail',
    commissionType: 'Percentage',
    value: '15%',
    effectiveFrom: '01 Jan 2026',
    status: 'Active',
  },
  {
    id: 'RUL-04',
    name: 'Nail Extension Flat Reward',
    targetType: 'Service Category',
    targetEntity: 'Sculpted Gel Extensions',
    commissionType: 'Fixed Amount',
    value: '₹350 / Session',
    effectiveFrom: '01 Feb 2026',
    status: 'Active',
  },
];

export interface TieredIncentiveItem {
  id: string;
  name: string;
  metric: string;
  tierRange: string;
  rewardRate: string;
  status: 'Active' | 'Configured';
}

export const initialTieredIncentives: TieredIncentiveItem[] = [
  {
    id: 'TIER-01',
    name: 'Base Revenue Tier',
    metric: 'Monthly Revenue',
    tierRange: '₹0 – ₹1,00,000',
    rewardRate: '2% Additional Bonus',
    status: 'Active',
  },
  {
    id: 'TIER-02',
    name: 'Performance Growth Tier',
    metric: 'Monthly Revenue',
    tierRange: '₹1,00,001 – ₹2,00,000',
    rewardRate: '4% Additional Bonus',
    status: 'Active',
  },
  {
    id: 'TIER-03',
    name: 'Elite Revenue Superstar Tier',
    metric: 'Monthly Revenue',
    tierRange: '₹2,00,001+',
    rewardRate: '6% Additional Bonus',
    status: 'Active',
  },
];

export interface AssistantSplitItem {
  id: string;
  service: string;
  primaryRole: string;
  primarySplit: number;
  assistantRole: string;
  assistantSplit: number;
  effectiveDate: string;
  status: 'Active';
}

export const initialAssistantSplits: AssistantSplitItem[] = [
  {
    id: 'SPL-01',
    service: 'Full Head Balayage & Keratin Infusion',
    primaryRole: 'Hair Art Director',
    primarySplit: 70,
    assistantRole: 'Junior Styling Assistant',
    assistantSplit: 30,
    effectiveDate: '01 Jan 2026',
    status: 'Active',
  },
  {
    id: 'SPL-02',
    service: '7-Step Medical Hydra-Facial Rejuvenation',
    primaryRole: 'Senior Aesthetician',
    primarySplit: 75,
    assistantRole: 'Clinical Room Attendant',
    assistantSplit: 25,
    effectiveDate: '01 Jan 2026',
    status: 'Active',
  },
];

export interface TipRecordItem {
  id: string;
  date: string;
  appointmentId: string;
  clientName: string;
  service: string;
  totalTip: number;
  primaryStaff: string;
  assistant: string;
  allocation: string;
  status: 'Distributed' | 'Pending';
}

export const initialTipsData: TipRecordItem[] = [];

export interface CommissionApprovalItem {
  id: string;
  staffName: string;
  period: string;
  grossSales: number;
  commission: number;
  adjustments: number;
  finalPayout: number;
  submittedDate: string;
  approvedBy: string;
  status: 'Approved' | 'Pending Approval' | 'Draft';
}

export const initialApprovals: CommissionApprovalItem[] = [];

export function StaffCommissionTab() {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<
    'rules' | 'tiers' | 'splits' | 'tips' | 'approvals'
  >('rules');

  const [rules, setRules] = useState<CommissionRuleItem[]>(initialCommissionRules);
  const [tiers, setTiers] = useState<TieredIncentiveItem[]>(initialTieredIncentives);
  const [splits, setSplits] = useState<AssistantSplitItem[]>(initialAssistantSplits);
  const [tips, setTips] = useState<TipRecordItem[]>(initialTipsData);
  const [approvals, setApprovals] = useState<CommissionApprovalItem[]>(initialApprovals);
  const [liveStaff, setLiveStaff] = useState<FullStaffRecord[]>([]);

  // Fetch live staff
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const staff = await staffApi.list();
        if (isMounted && Array.isArray(staff)) {
          setLiveStaff(staff);
        }
      } catch (err) {
        console.warn('Live staff commission fetch notice:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals state
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [isAddCommissionOpen, setIsAddCommissionOpen] = useState(false);
  const [isAddTierOpen, setIsAddTierOpen] = useState(false);
  const [isAddSplitOpen, setIsAddSplitOpen] = useState(false);
  const [isAddTipOpen, setIsAddTipOpen] = useState(false);

  // 1. Commission Rule Form State
  const [newRule, setNewRule] = useState({
    name: '',
    targetType: 'Service Category' as CommissionRuleItem['targetType'],
    targetEntity: 'Facial & Aesthetic Treatments',
    commissionType: 'Percentage' as CommissionRuleItem['commissionType'],
    value: '10%',
  });

  // 2. Add Staff Commission Form State
  const [newCommissionData, setNewCommissionData] = useState({
    staffName: '',
    period: 'August 2026',
    grossSales: 280000,
    serviceCommissionRate: 12,
    retailSales: 45000,
    retailCommissionRate: 15,
    adjustments: 1500,
    notes: 'Exceeded service milestone target with 90% customer satisfaction.',
    status: 'Pending Approval' as CommissionApprovalItem['status'],
  });

  // 3. Tiered Incentive Form State
  const [newTier, setNewTier] = useState({
    name: '',
    metric: 'Monthly Gross Billing',
    tierRange: '₹3,00,001+',
    rewardRate: '8% Additional Bonus',
  });

  // 4. Assistant Split Form State
  const [newSplit, setNewSplit] = useState({
    service: '',
    primaryRole: 'Senior Aesthetician',
    primarySplit: 70,
    assistantRole: 'Clinical Room Attendant',
    assistantSplit: 30,
  });

  // 5. Tip Distribution Form State
  const [newTip, setNewTip] = useState({
    clientName: '',
    service: 'Signature Cut & Styling',
    totalTip: 500,
    primaryStaff: masterStaffRecords[0]?.fullName || 'Ananya Deshmukh',
    primaryAmount: 375,
    assistant: 'Pooja Kashyap',
    assistantAmount: 125,
    allocation: '75% / 25% Auto-Split',
  });

  // Live Computed Total Commission Payout
  const computedServiceComm = Math.round(
    (Number(newCommissionData.grossSales || 0) *
      Number(newCommissionData.serviceCommissionRate || 0)) /
      100,
  );
  const computedRetailComm = Math.round(
    (Number(newCommissionData.retailSales || 0) *
      Number(newCommissionData.retailCommissionRate || 0)) /
      100,
  );
  const computedTotalPayout =
    computedServiceComm + computedRetailComm + Number(newCommissionData.adjustments || 0);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name) return;

    const created: CommissionRuleItem = {
      id: `RUL-0${rules.length + 1}`,
      name: newRule.name,
      targetType: newRule.targetType,
      targetEntity: newRule.targetEntity,
      commissionType: newRule.commissionType,
      value: newRule.value,
      effectiveFrom: 'Today',
      status: 'Active',
    };

    setRules([created, ...rules]);
    setIsAddRuleOpen(false);
    toast(`Commission rule "${created.name}" created successfully.`);
  };

  const handleRecordStaffCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const createdPayout: CommissionApprovalItem = {
      id: `APR-0${approvals.length + 1}`,
      staffName: newCommissionData.staffName,
      period: newCommissionData.period,
      grossSales: Number(newCommissionData.grossSales),
      commission: computedServiceComm + computedRetailComm,
      adjustments: Number(newCommissionData.adjustments || 0),
      finalPayout: computedTotalPayout,
      submittedDate: 'Today',
      approvedBy: newCommissionData.status === 'Approved' ? 'Finance Director' : 'Pending Review',
      status: newCommissionData.status,
    };

    setApprovals([createdPayout, ...approvals]);
    setIsAddCommissionOpen(false);
    toast(
      `Commission of ₹${computedTotalPayout.toLocaleString('en-IN')} recorded for ${createdPayout.staffName} (${createdPayout.period})!`,
    );
  };

  const handleCreateTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTier.name) return;
    const created: TieredIncentiveItem = {
      id: `TIER-0${tiers.length + 1}`,
      name: newTier.name,
      metric: newTier.metric,
      tierRange: newTier.tierRange,
      rewardRate: newTier.rewardRate,
      status: 'Active',
    };
    setTiers([...tiers, created]);
    setIsAddTierOpen(false);
    toast(`Revenue Tier "${created.name}" added successfully.`);
  };

  const handleCreateSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSplit.service) return;
    const created: AssistantSplitItem = {
      id: `SPL-0${splits.length + 1}`,
      service: newSplit.service,
      primaryRole: newSplit.primaryRole,
      primarySplit: Number(newSplit.primarySplit),
      assistantRole: newSplit.assistantRole,
      assistantSplit: Number(newSplit.assistantSplit),
      effectiveDate: 'Today',
      status: 'Active',
    };
    setSplits([...splits, created]);
    setIsAddSplitOpen(false);
    toast(`Team split formula for "${created.service}" added.`);
  };

  const handleCreateTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTip.clientName) return;
    const created: TipRecordItem = {
      id: `TIP-${900 + tips.length + 1}`,
      date: 'Today',
      appointmentId: `APT-${880 + tips.length}`,
      clientName: newTip.clientName,
      service: newTip.service,
      totalTip: Number(newTip.totalTip),
      primaryStaff: `${newTip.primaryStaff} (₹${newTip.primaryAmount})`,
      assistant: newTip.assistant ? `${newTip.assistant} (₹${newTip.assistantAmount})` : '—',
      allocation: newTip.allocation,
      status: 'Distributed',
    };
    setTips([created, ...tips]);
    setIsAddTipOpen(false);
    toast(`Guest tip of ₹${created.totalTip} logged and credited to ${newTip.primaryStaff}.`);
  };

  const handleApproveCommission = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'Approved', approvedBy: 'Brand Owner (Current)' } : a,
      ),
    );
    toast(`Commission payout for #${id} approved for payroll release!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Staff Commission, Incentives &amp; Tips Allocation
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Automated Payroll Payout Engine
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Configure service commissions, retail product bonuses, revenue tier escalators,
            team/assistant splits, and tip distribution.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported commission rules and approval summaries to CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Commission</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              toast('Redirecting to Finance & Payroll Processing...');
              window.location.href = '/admin/finance/commissions';
            }}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#5A2EA6]" />
            <span>Process Payroll in Finance</span>
          </Button>

          <button
            type="button"
            onClick={() => setIsAddCommissionOpen(true)}
            className="h-10 px-4.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white flex items-center gap-2 shadow-md cursor-pointer border-0 transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>Record Staff Commission</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher Bar */}
      <div className="bg-white p-1.5 rounded-[22px] border border-[#5A2EA6]/15 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'rules', label: 'Commission Rules', count: rules.length },
          { id: 'tiers', label: 'Tiered Revenue Incentives', count: tiers.length },
          { id: 'splits', label: 'Assistant / Team Splits', count: splits.length },
          { id: 'tips', label: 'Tips Allocation Ledger', count: tips.length },
          {
            id: 'approvals',
            label: 'Commission Approvals',
            count: approvals.filter((a) => a.status === 'Pending Approval').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={cn(
              'px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap flex items-center gap-2',
              activeSubTab === tab.id
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink hover:bg-purple-50/50',
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'px-1.5 py-0.2 rounded-md text-[10px] font-bold',
                activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-purple-50 text-[#5A2EA6]',
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 1. COMMISSION RULES */}
      {activeSubTab === 'rules' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Active Service &amp; Retail Commission Formulas
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Universal formulas and category percentages calculated on completed invoices
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRuleOpen(true)}
                  className="h-8 px-3.5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shadow-sm cursor-pointer border-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Rule
                </button>
                <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {rules.length} Rules Enforced
                </span>
              </div>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Rule Name & ID',
                    'Applies To',
                    'Target Scope',
                    'Type',
                    'Commission Rate',
                    'Effective From',
                    'Status',
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
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <strong className="text-ink text-[13px] block">{rule.name}</strong>
                      <span className="text-[10px] text-muted font-mono">{rule.id}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-[#5A2EA6] font-bold text-[10px] border border-purple-100">
                        {rule.targetType}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-ink text-xs">{rule.targetEntity}</td>
                    <td className="p-3.5 text-soft">{rule.commissionType}</td>
                    <td className="p-3.5 font-bold text-[#5A2EA6] text-sm">{rule.value}</td>
                    <td className="p-3.5 text-muted text-xs">{rule.effectiveFrom}</td>
                    <td className="p-3.5 pr-5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9.5px]">
                        {rule.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TIERED INCENTIVES */}
      {activeSubTab === 'tiers' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-3 text-xs text-purple-900 leading-relaxed font-medium">
            <span>
              Tiered incentives automatically escalate the specialist's bonus rate once their
              monthly gross billing crosses higher revenue thresholds.
            </span>
            <button
              type="button"
              onClick={() => setIsAddTierOpen(true)}
              className="h-8 px-3.5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shrink-0 cursor-pointer border-0 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier, idx) => (
              <div
                key={tier.id}
                className="p-5 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px]">
                    Tier Level {idx + 1}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">Active</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink">{tier.name}</h3>
                  <span className="text-xs text-muted font-medium">{tier.metric}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7FF] border border-purple-100 space-y-1">
                  <span className="text-[10px] text-muted uppercase font-bold block">
                    Revenue Threshold
                  </span>
                  <strong className="text-sm font-bold text-ink block">{tier.tierRange}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] text-white">
                  <span className="text-[10px] text-white/80 uppercase font-bold block">
                    Reward Escalator
                  </span>
                  <strong className="text-base font-bold font-serif">{tier.rewardRate}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ASSISTANT SPLITS */}
      {activeSubTab === 'splits' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-3 text-xs text-purple-900 leading-relaxed font-medium">
            <span>
              When high-touch chemical or bridal services require multiple staff on floor,
              commission is automatically split between Primary Specialist and Room Assistant.
            </span>
            <button
              type="button"
              onClick={() => setIsAddSplitOpen(true)}
              className="h-8 px-3.5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shrink-0 cursor-pointer border-0 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Split Formula
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {splits.map((spl) => (
              <div
                key={spl.id}
                className="p-5 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-purple-50">
                  <div>
                    <h3 className="font-bold text-ink text-sm">{spl.service}</h3>
                    <span className="text-[10px] text-muted font-mono">
                      {spl.id} · Effective {spl.effectiveDate}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active Formula
                  </span>
                </div>

                {/* Visual Split Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#5A2EA6]">
                      {spl.primaryRole}: {spl.primarySplit}%
                    </span>
                    <span className="text-emerald-700">
                      {spl.assistantRole}: {spl.assistantSplit}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#5A2EA6]"
                      style={{ width: `${spl.primarySplit}%` }}
                    />
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${spl.assistantSplit}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-50 text-[11.5px] text-muted">
                  Example: On a ₹5,000 treatment session, ₹
                  {((5000 * spl.primarySplit) / 100).toLocaleString('en-IN')} is credited to{' '}
                  {spl.primaryRole} and ₹
                  {((5000 * spl.assistantSplit) / 100).toLocaleString('en-IN')} to{' '}
                  {spl.assistantRole}.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TIPS ALLOCATION */}
      {activeSubTab === 'tips' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Guest Tips Collected &amp; Distributed
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  100% Transparent Gratuity Routing with digital guest tip ledger
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTipOpen(true)}
                  className="h-8 px-3.5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shadow-sm cursor-pointer border-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Tip
                </button>
                <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {tips.length} Tips Distributed
                </span>
              </div>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Date & Apt ID',
                    'Client Name',
                    'Treatment Protocol',
                    'Total Tip',
                    'Primary Staff',
                    'Assistant',
                    'Allocation Rule',
                    'Status',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === 7 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {tips.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                          <Coins className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-ink font-serif mb-1">
                          No tip distributions recorded
                        </h4>
                        <p className="text-xs text-muted mb-4 text-center max-w-xs">
                          Direct gratuity and automated assistant splits will be tracked here.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsAddTipOpen(true)}
                          className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-2 shadow-xs cursor-pointer border-0"
                        >
                          <Plus className="w-4 h-4" /> Add Tip Entry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tips.map((tip) => (
                    <tr key={tip.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      <td className="p-3.5 pl-5">
                        <strong className="text-ink text-xs block">{tip.appointmentId}</strong>
                        <span className="text-[10px] text-muted">{tip.date}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-ink">{tip.clientName}</td>
                      <td className="p-3.5 text-soft">{tip.service}</td>
                      <td className="p-3.5 font-bold text-emerald-700 font-serif">₹{tip.totalTip}</td>
                      <td className="p-3.5 text-ink font-medium">{tip.primaryStaff}</td>
                      <td className="p-3.5 text-muted">{tip.assistant}</td>
                      <td className="p-3.5 text-xs text-soft">{tip.allocation}</td>
                      <td className="p-3.5 pr-5 text-right">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9.5px]">
                          {tip.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. COMMISSION APPROVALS */}
      {activeSubTab === 'approvals' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Monthly Staff Commission Approval &amp; Payroll Release
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Monthly staff commission payouts, retail commissions, and bonuses for payroll
                  release
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCommissionOpen(true)}
                  className="h-8 px-3.5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shadow-sm cursor-pointer border-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Commission
                </button>
                <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {approvals.length} Records
                </span>
              </div>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Specialist',
                    'Pay Period',
                    'Gross Sales Billed',
                    'Calculated Commission',
                    'Adjustments / Bonus',
                    'Final Payout',
                    'Approved By',
                    'Status',
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
                {approvals.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                          <Wallet className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-ink font-serif mb-1">
                          No commission payouts pending approval
                        </h4>
                        <p className="text-xs text-muted mb-4 text-center max-w-xs">
                          Calculate and approve monthly service commissions for payroll dispatch.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsAddCommissionOpen(true)}
                          className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-2 shadow-xs cursor-pointer border-0"
                        >
                          <Plus className="w-4 h-4" /> Record New Commission
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  approvals.map((apr) => (
                    <tr key={apr.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      <td className="p-3.5 pl-5">
                        <strong className="text-ink font-bold text-xs block">{apr.staffName}</strong>
                        <span className="text-[10px] text-muted font-mono">{apr.id}</span>
                      </td>
                      <td className="p-3.5 text-soft">{apr.period}</td>
                      <td className="p-3.5 font-serif text-ink">
                        ₹{apr.grossSales.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 font-serif text-ink font-semibold">
                        ₹{apr.commission.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 font-serif text-emerald-700 font-semibold">
                        {apr.adjustments > 0 ? `+₹${apr.adjustments.toLocaleString('en-IN')}` : '₹0'}
                      </td>
                      <td className="p-3.5 font-serif font-bold text-[#5A2EA6] text-sm">
                        ₹{apr.finalPayout.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-muted text-xs">{apr.approvedBy}</td>
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                            apr.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800',
                          )}
                        >
                          {apr.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        {apr.status === 'Pending Approval' ? (
                          <button
                            onClick={() => handleApproveCommission(apr.id)}
                            className="h-7 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer border-0 shadow-2xs"
                          >
                            <Check className="w-3 h-3" /> Approve Payout
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700">✓ Settled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Add / Record Staff Commission Payout Modal */}
      {isAddCommissionOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 text-xs">
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                      Record Staff Commission Payout
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
                      Payroll Module
                    </span>
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Calculate and log service commissions, retail sales incentives, and
                    discretionary performance bonuses.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddCommissionOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleRecordStaffCommission}
                className="p-6 space-y-4 overflow-y-auto custom-scroll"
              >
                {/* Staff Member & Pay Period */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Staff Specialist *
                    </label>
                    <select
                      value={newCommissionData.staffName}
                      onChange={(e) =>
                        setNewCommissionData({ ...newCommissionData, staffName: e.target.value })
                      }
                      className="w-full h-11 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      {masterStaffRecords.map((s) => (
                        <option key={s.id} value={s.fullName}>
                          {s.fullName} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Settlement Pay Period *
                    </label>
                    <select
                      value={newCommissionData.period}
                      onChange={(e) =>
                        setNewCommissionData({ ...newCommissionData, period: e.target.value })
                      }
                      className="w-full h-11 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="August 2026">August 2026 (Current Cycle)</option>
                      <option value="July 2026">July 2026 (Prior Cycle)</option>
                      <option value="September 2026">September 2026 (Upcoming)</option>
                    </select>
                  </div>
                </div>

                {/* Service Commission Calculation Card */}
                <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#5A2EA6]" /> Service &amp; Treatment
                      Revenue
                    </span>
                    <span className="text-[11px] font-bold text-[#5A2EA6]">
                      Calculated: ₹{computedServiceComm.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Gross Service Sales (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newCommissionData.grossSales}
                        onChange={(e) =>
                          setNewCommissionData({
                            ...newCommissionData,
                            grossSales: Number(e.target.value),
                          })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Service Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newCommissionData.serviceCommissionRate}
                        onChange={(e) =>
                          setNewCommissionData({
                            ...newCommissionData,
                            serviceCommissionRate: Number(e.target.value),
                          })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Retail Commission & Adjustments Card */}
                <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" /> Retail Product Commission
                      &amp; Bonuses
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      Calculated: ₹{computedRetailComm.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Retail Sales (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newCommissionData.retailSales}
                        onChange={(e) =>
                          setNewCommissionData({
                            ...newCommissionData,
                            retailSales: Number(e.target.value),
                          })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Retail Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newCommissionData.retailCommissionRate}
                        onChange={(e) =>
                          setNewCommissionData({
                            ...newCommissionData,
                            retailCommissionRate: Number(e.target.value),
                          })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Bonus / Adjustments (₹)
                      </label>
                      <input
                        type="number"
                        value={newCommissionData.adjustments}
                        onChange={(e) =>
                          setNewCommissionData({
                            ...newCommissionData,
                            adjustments: Number(e.target.value),
                          })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Summary Highlight Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#5A2EA6] to-[#7B4DFF] text-white flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10.5px] text-white/80 font-bold uppercase tracking-wider block">
                      Net Calculated Commission Payout
                    </span>
                    <div className="text-[11px] text-white/90 mt-0.5 flex items-center gap-2">
                      <span>Service: ₹{computedServiceComm.toLocaleString('en-IN')}</span>
                      <span>·</span>
                      <span>Retail: ₹{computedRetailComm.toLocaleString('en-IN')}</span>
                      <span>·</span>
                      <span>
                        Bonus: ₹
                        {(Number(newCommissionData.adjustments) || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <strong className="text-2xl font-bold font-serif">
                    ₹{computedTotalPayout.toLocaleString('en-IN')}
                  </strong>
                </div>

                {/* Status and Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Approval Workflow Status
                    </label>
                    <select
                      value={newCommissionData.status}
                      onChange={(e) =>
                        setNewCommissionData({
                          ...newCommissionData,
                          status: e.target.value as CommissionApprovalItem['status'],
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Pending Approval">Pending Approval (Manager Review)</option>
                      <option value="Approved">Direct Approved (Release to Payroll)</option>
                      <option value="Draft">Draft Memo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Justification / Audit Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Month-end performance incentive"
                      value={newCommissionData.notes}
                      onChange={(e) =>
                        setNewCommissionData({ ...newCommissionData, notes: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddCommissionOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Record &amp; Issue Commission</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. Add Commission Rule Modal */}
      {isAddRuleOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Create Commission Rule
                  </h3>
                  <p className="text-[11px] text-muted">
                    Configure percentage or flat payout formulas
                  </p>
                </div>
                <button
                  onClick={() => setIsAddRuleOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Balayage Color Commission"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Target Category
                    </label>
                    <select
                      value={newRule.targetType}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          targetType: e.target.value as CommissionRuleItem['targetType'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Service Category">Service Category</option>
                      <option value="Retail Products">Retail Products</option>
                      <option value="Staff Role">Staff Role</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Commission Type
                    </label>
                    <select
                      value={newRule.commissionType}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          commissionType: e.target.value as CommissionRuleItem['commissionType'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed Amount">Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Commission Value *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12% or ₹400"
                    value={newRule.value}
                    onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddRuleOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white shadow-md transition-all cursor-pointer border-0"
                  >
                    Save Commission Rule
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Add Tiered Incentive Modal */}
      {isAddTierOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Add Revenue Tier Incentive
                  </h3>
                  <p className="text-[11px] text-muted">
                    Configure milestone escalators for high performers
                  </p>
                </div>
                <button
                  onClick={() => setIsAddTierOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTier} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Tier Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diamond Level Accelerator"
                    value={newTier.name}
                    onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Revenue Threshold Range *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹3,00,001+"
                    value={newTier.tierRange}
                    onChange={(e) => setNewTier({ ...newTier, tierRange: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Reward Escalator *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8% Additional Bonus"
                    value={newTier.rewardRate}
                    onChange={(e) => setNewTier({ ...newTier, rewardRate: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddTierOpen(false)}
                    className="h-9 px-4 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white shadow-md transition-all cursor-pointer border-0"
                  >
                    Save Tier
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Add Assistant Split Modal */}
      {isAddSplitOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Add Assistant / Team Split
                  </h3>
                  <p className="text-[11px] text-muted">
                    Configure multi-staff service payout sharing
                  </p>
                </div>
                <button
                  onClick={() => setIsAddSplitOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSplit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Service Protocol Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bridal HD Airbrush Makeover"
                    value={newSplit.service}
                    onChange={(e) => setNewSplit({ ...newSplit, service: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                      Primary Role Split (%)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={newSplit.primarySplit}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewSplit({ ...newSplit, primarySplit: val, assistantSplit: 100 - val });
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                      Assistant Split (%)
                    </label>
                    <input
                      type="number"
                      disabled
                      value={newSplit.assistantSplit}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-100 text-xs font-semibold text-muted"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddSplitOpen(false)}
                    className="h-9 px-4 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white shadow-md transition-all cursor-pointer border-0"
                  >
                    Save Split Formula
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 5. Record Tip Allocation Modal */}
      {isAddTipOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Record Guest Tip / Gratuity
                  </h3>
                  <p className="text-[11px] text-muted">
                    Log guest tip distribution to specialist ledger
                  </p>
                </div>
                <button
                  onClick={() => setIsAddTipOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTip} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Guest / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Merchant"
                    value={newTip.clientName}
                    onChange={(e) => setNewTip({ ...newTip, clientName: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                      Primary Specialist
                    </label>
                    <select
                      value={newTip.primaryStaff}
                      onChange={(e) => setNewTip({ ...newTip, primaryStaff: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      {masterStaffRecords.map((s) => (
                        <option key={s.id} value={s.fullName}>
                          {s.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                      Total Tip Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newTip.totalTip}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewTip({
                          ...newTip,
                          totalTip: val,
                          primaryAmount: Math.round(val * 0.75),
                          assistantAmount: Math.round(val * 0.25),
                        });
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddTipOpen(false)}
                    className="h-9 px-4 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white shadow-md transition-all cursor-pointer border-0"
                  >
                    Log Tip Distribution
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default StaffCommissionTab;
