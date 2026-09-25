import { Button, cn } from '@salon-spa-saas/ui';
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Layers,
  Percent,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface LoyaltyMember {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  branchName: string;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond Elite';
  pointsBalance: number;
  pointsEarned: number;
  pointsRedeemed: number;
  joinedDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lifetimeSpend: string;
  activityHistory: {
    date: string;
    activity: string;
    pointsDelta: number;
    referenceBill: string;
    balance: number;
  }[];
}

export interface LoyaltyTier {
  id: string;
  tierName: string;
  badgeColor: string;
  qualificationCriteria: string;
  pointsMultiplier: string;
  benefits: string[];
  membersCount: number;
  revenueContribution: string;
  status: 'Active' | 'Under Review';
}

const mockLoyaltyTiers: LoyaltyTier[] = [
  {
    id: 'TIER-01',
    tierName: 'Silver Entry Tier',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    qualificationCriteria: 'Enrolled on 1st visit / Any initial purchase',
    pointsMultiplier: '1 Point per ₹100 Spent',
    benefits: ['5% Birthday Service Discount', 'Standard Points Accrual', 'Digital Loyalty Card'],
    membersCount: 2450,
    revenueContribution: '₹4,80,000',
    status: 'Active',
  },
  {
    id: 'TIER-02',
    tierName: 'Gold Preferred Tier',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
    qualificationCriteria: '₹15,000 Annual Spend OR 6 Salon Visits',
    pointsMultiplier: '1.5x Points Multiplier',
    benefits: [
      '10% Birthday Discount',
      'Priority Weekend Booking',
      'Complimentary Scalp Consultation',
    ],
    membersCount: 1680,
    revenueContribution: '₹6,90,000',
    status: 'Active',
  },
  {
    id: 'TIER-03',
    tierName: 'Platinum VIP Tier',
    badgeColor: 'bg-purple-50 text-[#5A2EA6] border-purple-300',
    qualificationCriteria: '₹35,000 Annual Spend OR 12 Salon Visits',
    pointsMultiplier: '2.0x Points Multiplier',
    benefits: [
      '15% Birthday Discount',
      'Complimentary Backwash Spa Upgrade',
      'Free Blowdry with Colour',
    ],
    membersCount: 780,
    revenueContribution: '₹4,90,000',
    status: 'Active',
  },
  {
    id: 'TIER-04',
    tierName: 'Diamond Elite Circle',
    badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-300',
    qualificationCriteria: '₹60,000+ Annual Spend / Head Office Invite',
    pointsMultiplier: '3.0x Points Multiplier',
    benefits: [
      '20% Year-Round Retail Discount',
      'Dedicated Master Stylist Booking',
      'Complimentary Luxury Beverages & Valet',
    ],
    membersCount: 210,
    revenueContribution: '₹1,80,000',
    status: 'Active',
  },
];

const mockLoyaltyMembers: LoyaltyMember[] = [
  {
    id: 'MEM-001',
    clientId: 'CL-8840',
    clientName: 'Sunita Mehra',
    clientPhone: '+91 98260 11450',
    branchName: 'Indore Central Flagship',
    tier: 'Diamond Elite',
    pointsBalance: 4250,
    pointsEarned: 8900,
    pointsRedeemed: 4650,
    joinedDate: '14 Jan 2024',
    status: 'Active',
    lifetimeSpend: '₹84,500',
    activityHistory: [
      {
        date: '16 Aug 2026',
        activity: 'Points Earned on Global Hair Colouring',
        pointsDelta: +450,
        referenceBill: 'INV-2026-0792',
        balance: 4250,
      },
      {
        date: '10 Aug 2026',
        activity: 'Points Redeemed on O3+ Facial',
        pointsDelta: -800,
        referenceBill: 'INV-2026-0710',
        balance: 3800,
      },
      {
        date: '25 Jul 2026',
        activity: 'Birthday Month Platinum Bonus',
        pointsDelta: +500,
        referenceBill: 'SYS-PROMO-BDAY',
        balance: 4600,
      },
      {
        date: '12 Jul 2026',
        activity: 'Points Earned on Keratin Treatment',
        pointsDelta: +600,
        referenceBill: 'INV-2026-0618',
        balance: 4100,
      },
    ],
  },
  {
    id: 'MEM-002',
    clientId: 'CL-8841',
    clientName: 'Dr. Rohit Agrawal',
    clientPhone: '+91 98930 22780',
    branchName: 'Vijay Nagar Boutique',
    tier: 'Platinum',
    pointsBalance: 2400,
    pointsEarned: 5600,
    pointsRedeemed: 3200,
    joinedDate: '08 Mar 2024',
    status: 'Active',
    lifetimeSpend: '₹42,000',
    activityHistory: [
      {
        date: '15 Aug 2026',
        activity: 'Points Earned on Moroccan Oil Spa',
        pointsDelta: +280,
        referenceBill: 'INV-2026-0814',
        balance: 2400,
      },
      {
        date: '02 Aug 2026',
        activity: 'Points Redeemed on Retail Shampoo',
        pointsDelta: -400,
        referenceBill: 'INV-2026-0740',
        balance: 2120,
      },
    ],
  },
  {
    id: 'MEM-003',
    clientId: 'CL-8842',
    clientName: 'Ananya Deshmukh',
    clientPhone: '+91 98110 99820',
    branchName: 'Bhopal Arera Colony',
    tier: 'Gold',
    pointsBalance: 1280,
    pointsEarned: 3100,
    pointsRedeemed: 1820,
    joinedDate: '19 Jun 2024',
    status: 'Active',
    lifetimeSpend: '₹24,800',
    activityHistory: [
      {
        date: '14 Aug 2026',
        activity: 'Points Earned on Hydra-Infusion Facial',
        pointsDelta: +210,
        referenceBill: 'INV-2026-0801',
        balance: 1280,
      },
    ],
  },
  {
    id: 'MEM-004',
    clientId: 'CL-8843',
    clientName: 'Kavita Saxena',
    clientPhone: '+91 98270 44321',
    branchName: 'Indore Central Flagship',
    tier: 'Silver',
    pointsBalance: 450,
    pointsEarned: 850,
    pointsRedeemed: 400,
    joinedDate: '04 Jul 2026',
    status: 'Active',
    lifetimeSpend: '₹8,500',
    activityHistory: [
      {
        date: '12 Aug 2026',
        activity: 'Points Earned on Haircut & Blowdry',
        pointsDelta: +85,
        referenceBill: 'INV-2026-0780',
        balance: 450,
      },
    ],
  },
  {
    id: 'MEM-005',
    clientId: 'CL-8844',
    clientName: 'Vikramaditya Rao',
    clientPhone: '+91 98261 55660',
    branchName: 'Ujjain Mahakal Road',
    tier: 'Silver',
    pointsBalance: 120,
    pointsEarned: 120,
    pointsRedeemed: 0,
    joinedDate: '01 Aug 2026',
    status: 'Inactive',
    lifetimeSpend: '₹1,200',
    activityHistory: [
      {
        date: '01 Aug 2026',
        activity: 'Welcome Enrollment Points',
        pointsDelta: +120,
        referenceBill: 'INV-2026-0701',
        balance: 120,
      },
    ],
  },
];

export function LoyaltyTab() {
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'tiers'>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Selected Member Modal
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);

  // 5 KPI Cards
  const kpis = [
    {
      title: 'Total Loyalty Members',
      value: '5,120',
      sub: 'Enrolled Clients',
      change: '+320 this mo',
      isPositive: true,
      icon: Award,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Active Members',
      value: '4,680',
      sub: '91.4% Retention Rate',
      change: '+4.2% QoQ',
      isPositive: true,
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Points Issued (YTD)',
      value: '12.4L Pts',
      sub: 'Reward Currency',
      change: '+18.4% YoY',
      isPositive: true,
      icon: Sparkles,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Points Redeemed',
      value: '8.9L Pts',
      sub: '71.7% Burn Velocity',
      change: 'Healthy Burn',
      isPositive: true,
      icon: CheckCircle2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Loyalty Revenue',
      value: '₹18,40,000',
      sub: '64.5% of Total Rev',
      change: 'High LTV Share',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ];

  const getTierBadge = (t: LoyaltyMember['tier']) => {
    switch (t) {
      case 'Diamond Elite':
        return 'bg-indigo-50 text-indigo-900 border-indigo-300';
      case 'Platinum':
        return 'bg-purple-50 text-[#5A2EA6] border-purple-300';
      case 'Gold':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const filteredMembers = mockLoyaltyMembers.filter((m) => {
    if (selectedTier !== 'all' && m.tier !== selectedTier) return false;
    if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
    if (selectedBranch !== 'all' && !m.branchName.includes(selectedBranch)) return false;
    if (searchTerm) {
      const match =
        `${m.clientName} ${m.clientId} ${m.clientPhone} ${m.tier} ${m.branchName}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Sub-Tab Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#F8F5FF] p-1 rounded-xl border border-[#5A2EA6]/20">
          <button
            onClick={() => setActiveSubTab('members')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'members'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Loyalty Members Directory</span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {mockLoyaltyMembers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('tiers')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'tiers'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Loyalty Tiers Configuration</span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {mockLoyaltyTiers.length} Tiers
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast(`Exporting ${activeSubTab} dossier (CSV)...`)}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Loyalty Logs</span>
          </Button>
        </div>
      </div>

      {/* 2. 5 Loyalty KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={cn('w-7 h-7 rounded-xl grid place-items-center', kpi.bg, kpi.color)}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600">{kpi.change}</span>
                </div>
                <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                  {kpi.title}
                </span>
                <strong className="text-lg font-serif font-bold text-ink mt-0.5 block">
                  {kpi.value}
                </strong>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-muted">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Filter Bar (Members Tab) */}
      {activeSubTab === 'members' && (
        <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search member name, ID, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
              />
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Home Branches</option>
              <option value="Indore Central">Indore Central Flagship</option>
              <option value="Vijay Nagar">Vijay Nagar Boutique</option>
              <option value="Bhopal">Bhopal Arera Colony</option>
              <option value="Ujjain">Ujjain Mahakal Road</option>
            </select>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Loyalty Tiers</option>
              <option value="Diamond Elite">Diamond Elite</option>
              <option value="Platinum">Platinum VIP</option>
              <option value="Gold">Gold Preferred</option>
              <option value="Silver">Silver Entry</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Member Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <span className="text-xs text-soft font-semibold">
            Showing {filteredMembers.length} enrolled members
          </span>
        </div>
      )}

      {/* 4. SUB-VIEWS */}
      {activeSubTab === 'members' && (
        /* SECTION 8 & 10 PRD: LOYALTY MEMBERS TABLE */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Loyalty Program Member Register
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Brand Loyalty Engine
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Centralized brand-wide loyalty points balances, earning velocity, and redemptions
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">
              Point Conversion: 1 Pt = ₹1.00 Value
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Client &amp; ID</th>
                  <th className="p-3.5">Home Branch</th>
                  <th className="p-3.5 text-center">Loyalty Tier</th>
                  <th className="p-3.5 text-center">Points Balance</th>
                  <th className="p-3.5 text-center">Points Earned (Life)</th>
                  <th className="p-3.5 text-center">Points Redeemed</th>
                  <th className="p-3.5 text-right">Lifetime Spend</th>
                  <th className="p-3.5">Joined Date</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    {/* Client & ID */}
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{m.clientName}</strong>
                      <span className="text-[10px] text-muted font-mono">
                        {m.clientId} · {m.clientPhone}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                      {m.branchName}
                    </td>

                    {/* Tier */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          getTierBadge(m.tier),
                        )}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{m.tier}</span>
                      </span>
                    </td>

                    {/* Points Balance */}
                    <td className="p-3.5 text-center whitespace-nowrap font-extrabold text-[#5A2EA6] bg-purple-50/20 text-sm">
                      {m.pointsBalance.toLocaleString()} pts
                    </td>

                    {/* Earned */}
                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-emerald-700">
                      +{m.pointsEarned.toLocaleString()}
                    </td>

                    {/* Redeemed */}
                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-rose-700">
                      -{m.pointsRedeemed.toLocaleString()}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="p-3.5 text-right font-extrabold font-serif text-slate-900 whitespace-nowrap">
                      {m.lifetimeSpend}
                    </td>

                    {/* Joined */}
                    <td className="p-3.5 whitespace-nowrap text-slate-700">{m.joinedDate}</td>

                    {/* Status */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          m.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200',
                        )}
                      >
                        {m.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedMember(m)}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-[#5A2EA6]" />
                          <span>Loyalty Ledger</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'tiers' && (
        /* SECTION 9 PRD: LOYALTY TIERS CONFIGURATION */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#5A2EA6]" />
                  <h3 className="font-serif font-bold text-ink text-base">
                    Brand Loyalty Tier Structures &amp; Multipliers
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                    Tier Governance
                  </span>
                </div>
                <p className="text-[11px] text-muted mt-0.5">
                  Qualification criteria, earning multipliers, and customer privilege matrices
                  across 4 loyalty brackets
                </p>
              </div>
              <span className="text-xs text-soft font-semibold">Head Office Configured</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                    <th className="p-3.5 pl-5">Loyalty Tier Name</th>
                    <th className="p-3.5">Qualification Criteria</th>
                    <th className="p-3.5 text-center">Earning Multiplier</th>
                    <th className="p-3.5">Tier Privileges &amp; Benefits</th>
                    <th className="p-3.5 text-center">Enrolled Members</th>
                    <th className="p-3.5 text-right">Revenue Contribution</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                  {mockLoyaltyTiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                      {/* Name */}
                      <td className="p-3.5 pl-5 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border',
                            tier.badgeColor,
                          )}
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>{tier.tierName}</span>
                        </span>
                      </td>

                      {/* Criteria */}
                      <td className="p-3.5 whitespace-nowrap text-slate-900 font-semibold">
                        {tier.qualificationCriteria}
                      </td>

                      {/* Multiplier */}
                      <td className="p-3.5 text-center whitespace-nowrap font-extrabold text-[#5A2EA6] bg-purple-50/20">
                        {tier.pointsMultiplier}
                      </td>

                      {/* Benefits */}
                      <td className="p-3.5 max-w-[280px]">
                        <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                          {tier.benefits.map((b, bIdx) => (
                            <li key={bIdx} className="truncate" title={b}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Member Count */}
                      <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink text-sm">
                        {tier.membersCount.toLocaleString()} Members
                      </td>

                      {/* Revenue */}
                      <td className="p-3.5 text-right font-extrabold font-serif text-[#5A2EA6] text-sm whitespace-nowrap">
                        {tier.revenueContribution}
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {tier.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          onClick={() =>
                            showToast(`Opening tier configuration rule for ${tier.tierName}...`)
                          }
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                        >
                          Configure
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Section 10 PRD: LOYALTY MEMBER DETAILS MODAL */}
      {selectedMember &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Loyalty Member Dossier
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getTierBadge(selectedMember.tier),
                      )}
                    >
                      {selectedMember.tier}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedMember.clientName}
                  </h3>
                  <p className="text-xs text-muted">
                    ID: {selectedMember.clientId} · Phone: {selectedMember.clientPhone} · Home
                    Branch: {selectedMember.branchName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Member Metric Cards */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Current Points Balance
                    </span>
                    <strong className="text-lg font-serif font-bold text-[#5A2EA6]">
                      {selectedMember.pointsBalance.toLocaleString()} Pts
                    </strong>
                    <span className="text-[10px] text-purple-700 block mt-0.5">
                      Worth ₹{selectedMember.pointsBalance} Value
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Lifetime Points Earned
                    </span>
                    <strong className="text-lg font-serif font-bold text-emerald-700">
                      +{selectedMember.pointsEarned.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">
                      From {selectedMember.lifetimeSpend} Spend
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Total Redeemed
                    </span>
                    <strong className="text-lg font-serif font-bold text-rose-700">
                      -{selectedMember.pointsRedeemed.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-rose-600 block mt-0.5">Burn Rate: 52.2%</span>
                  </div>
                </div>

                {/* Activity Timeline / Ledger */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    Points Transaction History &amp; Redemption Ledger
                  </span>
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5 pl-3">Date &amp; Transaction Activity</th>
                          <th className="p-2.5 text-center">Points Delta</th>
                          <th className="p-2.5">Reference Bill</th>
                          <th className="p-2.5 pr-3 text-right">Running Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {selectedMember.activityHistory.map((act, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 pl-3">
                              <strong className="font-bold text-ink block">{act.activity}</strong>
                              <span className="text-[10px] text-muted">{act.date}</span>
                            </td>
                            <td className="p-2.5 text-center font-bold">
                              <span
                                className={
                                  act.pointsDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
                                }
                              >
                                {act.pointsDelta > 0 ? `+${act.pointsDelta}` : act.pointsDelta} pts
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-[#5A2EA6]">
                              {act.referenceBill}
                            </td>
                            <td className="p-2.5 pr-3 text-right font-extrabold text-ink">
                              {act.balance.toLocaleString()} pts
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `/admin/clients/${selectedMember.clientId}`;
                  }}
                  className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <span>Open Full Client Profile</span>
                  <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
                </Button>

                <Button
                  onClick={() => setSelectedMember(null)}
                  className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                >
                  Close Dossier
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
