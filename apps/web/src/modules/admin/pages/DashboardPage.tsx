import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Flame,
  Gift,
  HelpCircle,
  Layers,
  MapPin,
  Megaphone,
  MessageSquare,
  Percent,
  Phone,
  PieChart,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Tag,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

// ─── TYPES & INTERFACES ───────────────────────────────────────────────────────

type DateRangeOption =
  | 'Today'
  | 'Yesterday'
  | 'This Week'
  | 'This Month'
  | 'Last Month'
  | 'This Quarter'
  | 'This Year'
  | 'Custom Range';

type RevenueCategory = 'Services' | 'Retail' | 'Packages' | 'Memberships';

interface ApprovalItem {
  id: string;
  type: 'Price Change' | 'Refund' | 'Commission' | 'Discount' | 'Inventory';
  requester: string;
  requesterRole: string;
  branch: string;
  details: string;
  amount?: string;
  timestamp: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
}

interface BranchMetric {
  id: string;
  name: string;
  city: string;
  type: 'Company-Owned' | 'Franchise';
  revenue: number;
  appointments: number;
  occupancy: number;
  growth: number;
  status: 'Top Performer' | 'On Target' | 'Needs Attention';
  rating: number;
  compliance: number;
  manager: string;
}

interface StaffMetric {
  id: string;
  name: string;
  role: string;
  branch: string;
  avatar: string;
  revenue: string;
  utilisation: number;
  rebookingRate: number;
  targetPercent: number;
  servicesCount: number;
}

interface CampaignMetric {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'SMS' | 'Meta Ads' | 'Email';
  audience: number;
  delivered: number;
  bookings: number;
  attended: number;
  revenue: string;
  roi: string;
  status: 'Active' | 'Completed' | 'Optimizing';
}

// ─── INITIAL MOCK DATA ─────────────────────────────────────────────────────────

const initialBranches: BranchMetric[] = [
  {
    id: 'BR-01',
    name: 'Atelier Indrapuri Flagship',
    city: 'Bhopal, MP',
    type: 'Company-Owned',
    revenue: 942000,
    appointments: 482,
    occupancy: 88.5,
    growth: 16.4,
    status: 'Top Performer',
    rating: 4.9,
    compliance: 98,
    manager: 'Rajiv Mehra',
  },
  {
    id: 'BR-02',
    name: 'Atelier Arera Luxury Lounge',
    city: 'Bhopal, MP',
    type: 'Company-Owned',
    revenue: 785000,
    appointments: 394,
    occupancy: 84.0,
    growth: 12.8,
    status: 'On Target',
    rating: 4.8,
    compliance: 96,
    manager: 'Sunita Roy',
  },
  {
    id: 'BR-03',
    name: 'Atelier Koregaon Park Grand',
    city: 'Pune, MH',
    type: 'Franchise',
    revenue: 615000,
    appointments: 310,
    occupancy: 81.2,
    growth: 18.2,
    status: 'Top Performer',
    rating: 4.9,
    compliance: 95,
    manager: 'Rohan Deshmukh',
  },
  {
    id: 'BR-04',
    name: 'Atelier MG Road Express',
    city: 'Indore, MP',
    type: 'Company-Owned',
    revenue: 382000,
    appointments: 214,
    occupancy: 73.5,
    growth: 5.1,
    status: 'Needs Attention',
    rating: 4.6,
    compliance: 91,
    manager: 'Karan Joshi',
  },
  {
    id: 'BR-05',
    name: 'Atelier Whitefield Studio',
    city: 'Bengaluru, KA',
    type: 'Franchise',
    revenue: 121200,
    appointments: 82,
    occupancy: 68.0,
    growth: 24.5,
    status: 'On Target',
    rating: 4.7,
    compliance: 94,
    manager: 'Priya Sharma',
  },
];

const staffList: StaffMetric[] = [
  {
    id: 'ST-01',
    name: 'Zoya Khan',
    role: 'Senior Master Stylist',
    branch: 'Indrapuri · Bhopal',
    avatar: 'ZK',
    revenue: '₹2,48,000',
    utilisation: 92,
    rebookingRate: 78,
    targetPercent: 124,
    servicesCount: 114,
  },
  {
    id: 'ST-02',
    name: 'Sameer Sheikh',
    role: 'Lead Hair Artist',
    branch: 'Arera Colony · Bhopal',
    avatar: 'SS',
    revenue: '₹1,94,500',
    utilisation: 86,
    rebookingRate: 72,
    targetPercent: 108,
    servicesCount: 96,
  },
  {
    id: 'ST-03',
    name: 'Kavita Menon',
    role: 'Spa & Wellness Director',
    branch: 'Koregaon · Pune',
    avatar: 'KM',
    revenue: '₹1,82,000',
    utilisation: 88,
    rebookingRate: 69,
    targetPercent: 104,
    servicesCount: 84,
  },
  {
    id: 'ST-04',
    name: 'Amitabh Sen',
    role: 'Creative Color Specialist',
    branch: 'Indrapuri · Bhopal',
    avatar: 'AS',
    revenue: '₹1,65,000',
    utilisation: 79,
    rebookingRate: 65,
    targetPercent: 96,
    servicesCount: 78,
  },
  {
    id: 'ST-05',
    name: 'Pooja Verma',
    role: 'Nail & Aesthetics Lead',
    branch: 'MG Road · Indore',
    avatar: 'PV',
    revenue: '₹1,18,000',
    utilisation: 64,
    rebookingRate: 54,
    targetPercent: 78,
    servicesCount: 62,
  },
];

const initialApprovals: ApprovalItem[] = [
  {
    id: 'APR-2041',
    type: 'Discount',
    requester: 'Pooja Verma (Front Desk)',
    requesterRole: 'Front Desk Lead',
    branch: 'Indrapuri · Bhopal',
    details: '25% VIP Anniversary Discount on Bridal Deluxe Package for VIP Client #C-902',
    amount: '₹2,125 Discount',
    timestamp: '12 mins ago',
    status: 'Pending Review',
  },
  {
    id: 'APR-2040',
    type: 'Refund',
    requester: 'Karan Joshi',
    requesterRole: 'Branch Manager',
    branch: 'Indore MG Road',
    details: 'Partial refund request due to client rescheduling out-of-town for Keratin Package',
    amount: '₹3,500 Refund',
    timestamp: '45 mins ago',
    status: 'Pending Review',
  },
  {
    id: 'APR-2039',
    type: 'Price Change',
    requester: 'Sunita Roy',
    requesterRole: 'Salon Director',
    branch: 'All Branches (HQ)',
    details: 'HydraFacial Deluxe base tariff revision from ₹3,200 to ₹3,600 with new mask BOM',
    amount: '+₹400 / service',
    timestamp: '2 hours ago',
    status: 'Pending Review',
  },
  {
    id: 'APR-2038',
    type: 'Inventory',
    requester: 'Deepak Sharma',
    requesterRole: 'Storekeeper',
    branch: 'Arera Colony',
    details: "Damaged seal batch adjustment on 2 units L'Oreal Inoa Professional Color Tube",
    amount: '₹1,850 Write-off',
    timestamp: '3 hours ago',
    status: 'Pending Review',
  },
  {
    id: 'APR-2037',
    type: 'Commission',
    requester: 'Rohan Deshmukh',
    requesterRole: 'Franchise GM',
    branch: 'Pune Koregaon',
    details: 'Assistant Stylist split override adjustment (+5% team share on bridal marathon)',
    amount: '₹4,200 Commission',
    timestamp: '5 hours ago',
    status: 'Approved',
  },
];

const marketingCampaigns: CampaignMetric[] = [
  {
    id: 'CMP-101',
    name: 'Monsoon Glow & Hydration Re-engagement',
    channel: 'WhatsApp',
    audience: 4500,
    delivered: 4380,
    bookings: 342,
    attended: 310,
    revenue: '₹5,89,000',
    roi: '8.4x',
    status: 'Active',
  },
  {
    id: 'CMP-102',
    name: 'Bridal Deluxe Pre-Season Flash',
    channel: 'Meta Ads',
    audience: 28000,
    delivered: 26400,
    bookings: 184,
    attended: 168,
    revenue: '₹14,28,000',
    roi: '6.2x',
    status: 'Active',
  },
  {
    id: 'CMP-103',
    name: 'Inactive Client (90+ Days) Win-back',
    channel: 'SMS',
    audience: 1200,
    delivered: 1180,
    bookings: 94,
    attended: 82,
    revenue: '₹1,64,000',
    roi: '5.1x',
    status: 'Active',
  },
  {
    id: 'CMP-104',
    name: 'VIP Gold Tier Renewal Perks',
    channel: 'Email',
    audience: 850,
    delivered: 842,
    bookings: 126,
    attended: 120,
    revenue: '₹3,40,000',
    roi: '12.0x',
    status: 'Completed',
  },
];

import { useAdminContext } from '../context/AdminContext';

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { toast } = useToast();
  const { salon } = useAdminContext();

  // Header State
  const [selectedBranch, setSelectedBranch] = useState<string>('All Locations');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>('This Month');
  const [comparePeriod, setComparePeriod] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Revenue Section State
  const [revenueCategory, setRevenueCategory] = useState<RevenueCategory>('Services');

  // Approvals State
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);

  // Drilldown Modals
  const [selectedBranchDetail, setSelectedBranchDetail] = useState<BranchMetric | null>(null);
  const [selectedStaffDetail, setSelectedStaffDetail] = useState<StaffMetric | null>(null);

  // Dynamic Branches source from salon
  const activeBranchMetrics: BranchMetric[] = useMemo(() => {
    if (salon?.branches && salon.branches.length > 0) {
      return salon.branches.map((b, idx) => ({
        id: b.id,
        name: b.name,
        city: b.city,
        type: b.type === 'Franchise' ? ('Franchise' as const) : ('Company-Owned' as const),
        revenue: b.revenue,
        appointments: b.appointments,
        occupancy: b.occupancy,
        growth: 14.5 - (idx * 2),
        status: idx === 0 ? ('Top Performer' as const) : ('On Target' as const),
        rating: 4.8 + (idx % 2 === 0 ? 0.1 : 0.0),
        compliance: 96 - (idx * 2),
        manager: b.manager,
      }));
    }
    return initialBranches;
  }, [salon]);

  // ─── COMPUTED TOTALS BASED ON FILTERS ─────────────────────────────────────────

  const filteredBranches = useMemo(() => {
    if (selectedBranch === 'All Locations') return activeBranchMetrics;
    return activeBranchMetrics.filter(
      (b) => b.name.toLowerCase().includes(selectedBranch.toLowerCase()) || b.city.toLowerCase().includes(selectedBranch.toLowerCase()),
    );
  }, [selectedBranch, activeBranchMetrics]);

  const totalRevenue = useMemo(() => {
    return filteredBranches.reduce((acc, b) => acc + b.revenue, 0);
  }, [filteredBranches]);

  const totalAppointments = useMemo(() => {
    return filteredBranches.reduce((acc, b) => acc + b.appointments, 0);
  }, [filteredBranches]);

  const avgOccupancy = useMemo(() => {
    if (!filteredBranches.length) return 0;
    return (
      filteredBranches.reduce((acc, b) => acc + b.occupancy, 0) / filteredBranches.length
    ).toFixed(1);
  }, [filteredBranches]);

  // Handle Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast('Dashboard live metrics synchronized across all 5 branches.');
    }, 600);
  };

  // Handle Export Action (adhering to project rule)
  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Branch,City,Type,Revenue,Appointments,Occupancy,Growth,Status,Rating',
        ...filteredBranches.map(
          (b) =>
            `"${b.name}","${b.city}","${b.type}",₹${b.revenue},${b.appointments},${b.occupancy}%,${b.growth}%,${b.status},${b.rating}`,
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `executive_dashboard_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(`Exported executive dashboard dataset successfully.`);
  };

  // Handle Approval Action (Maker-Checker live mutation)
  const handleApprovalAction = (id: string, action: 'Approved' | 'Rejected') => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item)),
    );
    setSelectedApproval(null);
    toast(`Approval ${id} marked as ${action}.`);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-7 pb-12">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HEADER CONTROLS
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[11px] font-bold tracking-wide uppercase mb-1.5 border border-[#5A2EA6]/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>{salon?.name || 'Salon'} · Head Office HQ</span>
          </div>
          <h1 className="font-serif text-[28px] text-ink font-semibold tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-[13px] text-muted mt-0.5">
            Real-time multi-location performance, revenue intelligence, occupancy, and risk
            exceptions for {salon?.name || 'your salon network'}.
          </p>
        </div>

        {/* Global Selectors & Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 flex-wrap shrink-0">
          {/* Branch / Location Selector */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6] appearance-none cursor-pointer shadow-xs"
            >
              <option value="All Locations">
                All Locations ({activeBranchMetrics.length} Branches)
              </option>
              {activeBranchMetrics.map((b) => (
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
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value as DateRangeOption)}
              className="h-10 pl-9 pr-8 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6] appearance-none cursor-pointer shadow-xs"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
              <option value="Custom Range">Custom Date Range</option>
            </select>
            <CalendarDays className="w-3.5 h-3.5 text-[#5A2EA6] absolute left-3 top-3.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-3.5 pointer-events-none" />
          </div>

          {/* Compare with Previous Period Toggle */}
          <button
            onClick={() => setComparePeriod(!comparePeriod)}
            className={cn(
              'h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer select-none',
              comparePeriod
                ? 'bg-purple-50 text-[#5A2EA6] border-[#5A2EA6]/40 shadow-xs'
                : 'bg-[#FCFAFF] text-muted border-slate-200 hover:text-ink',
            )}
            title="Toggle previous period growth benchmarks"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare Period</span>
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
            className="h-10 w-10 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-[#5A2EA6] hover:bg-[#5A2EA6]/10 flex items-center justify-center transition-colors cursor-pointer shadow-xs shrink-0"
            title="Refresh live metrics"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>

          {/* Export Button (variant="outline" with purple text/border on light background, right-aligned) */}
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Dashboard</span>
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. TOP 6 KPI CARDS
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Revenue */}
        <div className="premium-stat-card p-4.5 rounded-[22px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-serif text-ink tracking-tight">
              ₹{(totalRevenue / 100000).toFixed(2)}L
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.8%</span>
              {comparePeriod && (
                <span className="text-muted font-normal text-[10px]">vs ₹24.78L prev</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Appointments */}
        <div className="premium-stat-card p-4.5 rounded-[22px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Appointments
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] grid place-items-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-serif text-ink tracking-tight">
              {totalAppointments.toLocaleString()}
            </div>
            <div className="text-[10px] text-soft mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-700 font-semibold">1,290 Done</span>
              <span>·</span>
              <span className="text-rose-600 font-medium">80 No-Show</span>
              <span>·</span>
              <span className="text-amber-600 font-medium">112 Canc</span>
            </div>
          </div>
        </div>

        {/* 3. Occupancy */}
        <div className="premium-stat-card p-4.5 rounded-[22px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Occupancy
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 grid place-items-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-serif text-ink tracking-tight">
              {avgOccupancy}%
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#5A2EA6] h-full rounded-full transition-all"
                  style={{ width: `${avgOccupancy}%` }}
                />
              </div>
              <span className="text-[10px] text-muted font-bold">78/92 Chairs</span>
            </div>
          </div>
        </div>

        {/* 4. Clients */}
        <div className="premium-stat-card p-4.5 rounded-[22px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Clients Served
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 grid place-items-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-serif text-ink tracking-tight">3,920</div>
            <div className="text-[10.5px] text-soft mt-1 flex items-center justify-between">
              <span className="text-indigo-600 font-bold">840 New (21%)</span>
              <span className="text-emerald-600 font-bold">3,080 Repeat</span>
            </div>
          </div>
        </div>

        {/* 5. Average Bill Value (ABV) */}
        <div className="premium-stat-card p-4.5 rounded-[22px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-soft">
              Avg Bill Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 grid place-items-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-serif text-ink tracking-tight">₹1,920</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.4%</span>
              {comparePeriod && (
                <span className="text-muted font-normal text-[10px]">vs ₹1,770</span>
              )}
            </div>
          </div>
        </div>

        {/* 6. Package Liability */}
        <div className="premium-stat-card p-4.5 rounded-[22px] flex flex-col justify-between border-amber-200/60 bg-gradient-to-br from-amber-50/20 to-purple-50/20">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Package Liability
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 grid place-items-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-[24px] font-bold font-serif text-ink tracking-tight">₹9.84L</div>
            <div className="flex items-center justify-between text-[10px] font-bold mt-1">
              <span className="text-amber-800">482 Sessions left</span>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[9px] animate-pulse">
                38 Expiring
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. SECTION 10 & 11: ATTENTION REQUIRED & PENDING APPROVALS HUB
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 10: Attention Required (Alerts & Exceptions) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-[24px] border border-rose-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 grid place-items-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Attention Required
                  </h3>
                  <p className="text-[11px] text-muted">
                    Active exceptions requiring brand owner intervention
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                5 High Priority
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Alert 1: Low Stock */}
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-3">
                <Boxes className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-ink flex items-center justify-between">
                    <span>Critical Consumable Stockout</span>
                    <span className="text-[10px] text-rose-700 font-bold">Indore &amp; Pune</span>
                  </div>
                  <p className="text-[11px] text-soft mt-0.5">
                    L'Oreal 20 Vol Developer &amp; Keratin Serum below safety threshold (less than 2
                    days cover).
                  </p>
                </div>
              </div>

              {/* Alert 2: Packages Expiring Soon */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
                <Gift className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-ink flex items-center justify-between">
                    <span>38 Package Sessions Expiring in 7 Days</span>
                    <span className="text-[10px] text-amber-700 font-bold">₹1.42L Value</span>
                  </div>
                  <p className="text-[11px] text-soft mt-0.5">
                    Trigger automated WhatsApp retention reminder to prevent client loss and
                    disputes.
                  </p>
                </div>
              </div>

              {/* Alert 3: No-Show Rate Spike */}
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                <CalendarClock className="w-4 h-4 text-[#5A2EA6] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-ink flex items-center justify-between">
                    <span>No-Show Rate Spike (14.2%)</span>
                    <span className="text-[10px] text-purple-700 font-bold">MG Road Indore</span>
                  </div>
                  <p className="text-[11px] text-soft mt-0.5">
                    Enforce required 20% advance slot deposit policy on weekend afternoon bridal
                    slots.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-muted">Auto-refreshes every 5 mins</span>
            <button
              onClick={() => toast('All alert exceptions acknowledged.')}
              className="text-[11px] font-bold text-[#5A2EA6] hover:underline cursor-pointer border-0 bg-transparent"
            >
              Acknowledge All
            </button>
          </div>
        </div>

        {/* Section 11: Pending Approvals (Maker-Checker Multi-Branch Hub) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] grid place-items-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Pending Maker-Checker Approvals
                  </h3>
                  <p className="text-[11px] text-muted">
                    Authorizations required for discounts, refunds &amp; tariffs
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
                {approvals.filter((a) => a.status === 'Pending Review').length} Action Items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                  <tr>
                    {[
                      'Request Type',
                      'Branch & Requester',
                      'Details & Value',
                      'Status',
                      'Action',
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'p-2.5 font-bold text-[9.5px] uppercase tracking-wider',
                          i === 0 ? 'pl-3' : i === 4 ? 'pr-3 text-right' : '',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-soft">
                  {approvals.slice(0, 4).map((item) => (
                    <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-2.5 pl-3">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded-full text-[9px] font-bold',
                            item.type === 'Discount'
                              ? 'bg-amber-100 text-amber-800'
                              : item.type === 'Refund'
                                ? 'bg-rose-100 text-rose-800'
                                : item.type === 'Price Change'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-800',
                          )}
                        >
                          {item.type}
                        </span>
                        <div className="font-mono text-[9.5px] text-muted mt-0.5">{item.id}</div>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-ink">{item.branch}</div>
                        <div className="text-[10px] text-muted">{item.requester}</div>
                      </td>
                      <td className="p-2.5 max-w-[200px]">
                        <div className="text-[11px] text-ink truncate font-medium">
                          {item.details}
                        </div>
                        {item.amount && (
                          <div className="text-[10px] font-bold text-[#5A2EA6]">{item.amount}</div>
                        )}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold',
                            item.status === 'Pending Review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : item.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200',
                          )}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2.5 pr-3 text-right">
                        {item.status === 'Pending Review' ? (
                          <button
                            onClick={() => setSelectedApproval(item)}
                            className="px-2.5 py-1 rounded-lg bg-[#5A2EA6] text-white text-[10px] font-bold hover:bg-[#4a2489] transition-colors cursor-pointer border-0 shadow-2xs"
                          >
                            Review
                          </button>
                        ) : (
                          <span className="text-[10px] font-medium text-muted">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-muted">
              Dual-authorization Maker-Checker policy enforced
            </span>
            <button
              onClick={() => toast('Redirecting to full compliance approval ledger...')}
              className="text-[11px] font-bold text-[#5A2EA6] hover:underline cursor-pointer border-0 bg-transparent flex items-center gap-1"
            >
              <span>View All Approvals</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. MAIN SECTION 1: REVENUE TREND (INTERACTIVE CHART & CATEGORY TOGGLE)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                Revenue Trajectory &amp; Composition
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                +14.8% YoY
              </span>
            </div>
            <p className="text-[12px] text-muted mt-0.5">
              Daily revenue breakdown across branches, split by service, retail, package, and
              membership streams.
            </p>
          </div>

          {/* Revenue Stream Category Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FCFAFF] rounded-xl border border-[#5A2EA6]/15 self-start md:self-auto">
            {(['Services', 'Retail', 'Packages', 'Memberships'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setRevenueCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
                  revenueCategory === cat
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'bg-transparent text-soft hover:text-ink hover:bg-white/60',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Revenue Bar & Line Graphic with Dynamic Height Bars */}
        <div className="pt-4 pb-2">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-100 pb-2">
            {[
              { day: '01 Aug', val: 78, amt: '₹78,400', prev: 64 },
              { day: '04 Aug', val: 92, amt: '₹92,100', prev: 80 },
              { day: '07 Aug', val: 84, amt: '₹84,500', prev: 72 },
              { day: '10 Aug', val: 110, amt: '₹1,10,200', prev: 95 },
              { day: '13 Aug', val: 135, amt: '₹1,35,000', prev: 112 },
              { day: '15 Aug', val: 168, amt: '₹1,68,400', prev: 140 },
              { day: '17 Aug', val: 142, amt: '₹1,42,800', prev: 125 },
            ].map((item, idx) => (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              >
                {/* Tooltip on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-24 bg-slate-900 text-white text-[10px] font-bold p-2 rounded-xl shadow-lg pointer-events-none z-20 whitespace-nowrap">
                  <div className="text-emerald-400">{item.amt}</div>
                  <div className="text-white/70 font-normal">
                    {item.day} · {revenueCategory}
                  </div>
                  {comparePeriod && (
                    <div className="text-purple-300 font-mono text-[9px]">Prev Period: +18.2%</div>
                  )}
                </div>

                <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-48">
                  {/* Current Period Bar */}
                  <div
                    className={cn(
                      'w-full rounded-t-xl transition-all duration-300 group-hover:brightness-110 shadow-xs',
                      idx === 5
                        ? 'bg-gradient-to-t from-[#5A2EA6] to-[#8B6FD8]'
                        : 'bg-gradient-to-t from-[#5A2EA6]/80 to-[#8B6FD8]/80',
                    )}
                    style={{ height: `${(item.val / 170) * 100}%` }}
                  />

                  {/* Previous Period Comparative Bar */}
                  {comparePeriod && (
                    <div
                      className="w-1/2 bg-slate-200 rounded-t-md transition-all group-hover:bg-slate-300"
                      style={{ height: `${(item.prev / 170) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-bold text-soft group-hover:text-[#5A2EA6]">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted mt-3 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#5A2EA6]" />
                <span className="font-semibold text-ink">Current Period ({revenueCategory})</span>
              </div>
              {comparePeriod && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-300" />
                  <span className="font-medium text-soft">Previous 30 Days Benchmark</span>
                </div>
              )}
            </div>
            <span className="font-bold text-[#5A2EA6]">
              Peak: ₹1,68,400 on 15 Aug (Holiday Special)
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. SECTION 2 & 3: APPOINTMENTS & BRANCH PERFORMANCE TABLE
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 2: Appointment & Occupancy Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 grid place-items-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Booking Channels &amp; Queue
                  </h3>
                  <p className="text-[11px] text-muted">
                    Omnichannel intake and chair occupancy split
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#5A2EA6] bg-[#5A2EA6]/10 px-2.5 py-0.5 rounded-full">
                84.2% Occupancy
              </span>
            </div>

            {/* Funnel Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Total Bookings
                </span>
                <strong className="text-[16px] font-bold text-ink">1,482</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                  Completed
                </span>
                <strong className="text-[16px] font-bold text-emerald-900">1,290</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-[10px] text-blue-700 uppercase font-bold block">
                  Walk-in Queue
                </span>
                <strong className="text-[16px] font-bold text-blue-900">340</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                <span className="text-[10px] text-purple-700 uppercase font-bold block">
                  Live Waitlist
                </span>
                <strong className="text-[16px] font-bold text-purple-900">24</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <span className="text-[10px] text-rose-700 uppercase font-bold block">
                  No-Shows
                </span>
                <strong className="text-[16px] font-bold text-rose-900">80</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] text-amber-700 uppercase font-bold block">
                  Cancelled
                </span>
                <strong className="text-[16px] font-bold text-amber-900">112</strong>
              </div>
            </div>

            {/* Source Breakdown Progress Bars */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-ink block uppercase tracking-wider">
                Appointment Source Attribution
              </span>
              {[
                { source: 'Online Client App / Web Widget', pct: 42, color: 'bg-[#5A2EA6]' },
                { source: 'WhatsApp Automated Booking Bot', pct: 28, color: 'bg-emerald-500' },
                { source: 'Front Desk Walk-In Queue', pct: 18, color: 'bg-blue-500' },
                { source: 'Call Centre Inbound Sales', pct: 12, color: 'bg-amber-500' },
              ].map((src) => (
                <div key={src.source} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-ink">{src.source}</span>
                    <span className="font-bold text-soft">{src.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', src.color)}
                      style={{ width: `${src.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-muted">Avg Service Duration: 65 mins</span>
            <span className="font-bold text-emerald-600">Conflict-Free Diary: 99.8%</span>
          </div>
        </div>

        {/* Section 3: Branch Performance Card / Table */}
        <div className="lg:col-span-7 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Multi-Branch Performance Scorecard
                  </h3>
                  <p className="text-[11px] text-muted">
                    Comparative unit revenue, occupancy &amp; growth
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-ink">
                {filteredBranches.length} Branches Monitored
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                  <tr>
                    {[
                      'Branch Unit',
                      'Revenue (MTD)',
                      'Bookings',
                      'Occupancy',
                      'Growth',
                      'Status',
                      'Action',
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'p-2.5 font-bold text-[9.5px] uppercase tracking-wider',
                          i === 0 ? 'pl-3' : i === 6 ? 'pr-3 text-right' : '',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-soft">
                  {filteredBranches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-2.5 pl-3">
                        <div className="font-bold text-ink">{branch.name}</div>
                        <div className="text-[10px] text-muted">
                          {branch.city} · {branch.type}
                        </div>
                      </td>
                      <td className="p-2.5 font-bold text-ink">
                        ₹{(branch.revenue / 100000).toFixed(2)}L
                      </td>
                      <td className="p-2.5 font-semibold text-soft">{branch.appointments}</td>
                      <td className="p-2.5">
                        <span className="font-bold text-ink">{branch.occupancy}%</span>
                      </td>
                      <td className="p-2.5 font-bold text-emerald-600">+{branch.growth}%</td>
                      <td className="p-2.5">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded-full text-[9px] font-bold',
                            branch.status === 'Top Performer'
                              ? 'bg-emerald-100 text-emerald-800'
                              : branch.status === 'On Target'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-rose-100 text-rose-800',
                          )}
                        >
                          {branch.status}
                        </span>
                      </td>
                      <td className="p-2.5 pr-3 text-right">
                        <button
                          onClick={() => setSelectedBranchDetail(branch)}
                          className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#5A2EA6] hover:text-[#411b81] px-2 py-1 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 transition-colors cursor-pointer border-0"
                        >
                          <span>View Branch</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-muted">
              Aggregated across all company-owned &amp; franchise salons
            </span>
            <span className="font-bold text-[#5A2EA6]">Group CSAT: 4.85 / 5.0 ★</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. SECTION 4 & 5: STAFF PRODUCTIVITY & CLIENT RETENTION INTELLIGENCE
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 4: Staff Performance Leaderboard */}
        <div className="lg:col-span-6 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] grid place-items-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                  Staff Productivity &amp; Utilisation
                </h3>
                <p className="text-[11px] text-muted">
                  Stylist revenue contribution, rebooking &amp; target achievement
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Avg Utilisation: 81.8%
            </span>
          </div>

          <div className="space-y-3">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                onClick={() => setSelectedStaffDetail(staff)}
                className="p-3 rounded-2xl border border-slate-100 hover:border-[#5A2EA6]/30 hover:bg-[#FCFAFF] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {staff.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-ink text-xs truncate flex items-center gap-1.5">
                      <span>{staff.name}</span>
                      {staff.targetPercent >= 100 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[8.5px] font-bold">
                          {staff.targetPercent}% Target
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted truncate">
                      {staff.role} · {staff.branch}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <div className="font-bold text-ink text-xs">{staff.revenue}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      {staff.rebookingRate}% Rebook
                    </div>
                  </div>
                  <div className="hidden sm:block text-left w-16">
                    <div className="text-[10px] text-muted font-bold">Utilisation</div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-[#5A2EA6] h-full rounded-full"
                        style={{ width: `${staff.utilisation}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Client Retention & Cohort Intelligence */}
        <div className="lg:col-span-6 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 grid place-items-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Client Retention &amp; Cohorts
                  </h3>
                  <p className="text-[11px] text-muted">
                    Repeat frequency, rebooking adherence &amp; churn risk alerts
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                68.4% Rebooking Rate
              </span>
            </div>

            {/* Retention KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  New Acquisition
                </span>
                <strong className="text-[15px] font-bold text-ink">840</strong>
                <span className="text-[9.5px] text-emerald-600 block mt-0.5">+18% vs MoM</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                  Repeat Clients
                </span>
                <strong className="text-[15px] font-bold text-emerald-900">3,080</strong>
                <span className="text-[9.5px] text-emerald-700 block mt-0.5">78.6% share</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                <span className="text-[10px] text-purple-700 uppercase font-bold block">
                  Avg Visit Cycle
                </span>
                <strong className="text-[15px] font-bold text-purple-900">22 Days</strong>
                <span className="text-[9.5px] text-purple-700 block mt-0.5">High velocity</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                <span className="text-[10px] text-rose-700 uppercase font-bold block">
                  Churn Risk (90d+)
                </span>
                <strong className="text-[15px] font-bold text-rose-900">124</strong>
                <span className="text-[9.5px] text-rose-700 block mt-0.5">Dormant</span>
              </div>
            </div>

            {/* Churn Risk Win-back Action Callout */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  <span>Automated 90-Day Dormant Client Recovery Journey</span>
                </div>
                <p className="text-[11px] text-soft mt-0.5">
                  Send personalized WhatsApp welcome-back credits to 124 inactive salon clients.
                </p>
              </div>
              <Button
                onClick={() =>
                  toast('Triggered WhatsApp Win-Back campaign to 124 inactive clients.')
                }
                className="h-8 px-3 rounded-xl text-xs font-bold premium-btn-primary shrink-0"
              >
                Launch Win-Back
              </Button>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-muted">Household Family Profiles Linked: 840</span>
            <span className="font-bold text-[#5A2EA6]">Client Lifetime Value (LTV): ₹18,400</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          7. SECTION 6 & 7: PACKAGE LIABILITY & INVENTORY CONSUMPTION HEALTH
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 6: Package Liability & Breakage Accounting */}
        <div className="lg:col-span-6 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 grid place-items-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Package Liability &amp; Unearned Revenue
                  </h3>
                  <p className="text-[11px] text-muted">
                    Deferred service liability, redeemed balances &amp; breakage forecast
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                ₹9.84L Outstanding
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-muted uppercase font-bold block">Total Sold</span>
                <strong className="text-[15px] font-bold text-ink">₹32.40L</strong>
                <span className="text-[9px] text-muted block mt-0.5">Lifetime Bundles</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                  Redeemed Value
                </span>
                <strong className="text-[15px] font-bold text-emerald-900">₹22.56L</strong>
                <span className="text-[9px] text-emerald-700 block mt-0.5">Delivered</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                <span className="text-[10px] text-purple-700 uppercase font-bold block">
                  Breakage Recognized
                </span>
                <strong className="text-[15px] font-bold text-purple-900">₹1.42L</strong>
                <span className="text-[9px] text-purple-700 block mt-0.5">Expired to P&amp;L</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>38 Sessions Expiring This Week</span>
                <span>₹1,42,800 Liability</span>
              </div>
              <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="text-[10.5px] text-amber-800 flex justify-between">
                <span>Bridal Glow &amp; Seasonal Rejuvenation packages</span>
                <span className="font-bold">68% Redemption Velocity</span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-muted">Compliant with deferred revenue GAAP</span>
            <button
              onClick={() => toast('Exporting package liability schedule...')}
              className="font-bold text-[#5A2EA6] hover:underline cursor-pointer border-0 bg-transparent"
            >
              Export Liability Schedule
            </button>
          </div>
        </div>

        {/* Section 7: Inventory Consumption & Recipe Variance */}
        <div className="lg:col-span-6 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] grid place-items-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Inventory &amp; Recipe Consumption Health
                  </h3>
                  <p className="text-[11px] text-muted">
                    BOM recipe standards vs actual stylist back-bar usage
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                +3.8% Recipe Variance
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Recipe Standard
                </span>
                <strong className="text-[15px] font-bold text-ink">₹3,42,000</strong>
                <span className="text-[9px] text-muted block mt-0.5">Theoretical Usage</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] text-amber-700 uppercase font-bold block">
                  Actual Consumed
                </span>
                <strong className="text-[15px] font-bold text-amber-900">₹3,55,100</strong>
                <span className="text-[9px] text-amber-700 block mt-0.5">Logged Punches</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                <span className="text-[10px] text-rose-700 uppercase font-bold block">
                  Recorded Wastage
                </span>
                <strong className="text-[15px] font-bold text-rose-900">₹18,400</strong>
                <span className="text-[9px] text-rose-700 block mt-0.5">0.6% Shrinkage</span>
              </div>
            </div>

            {/* Inventory Alerts Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>6 Critical Back-Bar Items Below Minimum Reorder Level</span>
                </div>
                <button
                  onClick={() => toast('Generated automatic PO drafts to suppliers.')}
                  className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 transition-colors border-0 cursor-pointer"
                >
                  Generate PO
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#5A2EA6]">
                  <Clock className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />
                  <span>14 Batches Expiring in Next 30 Days (Value: ₹42,600)</span>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
                  FIFO Enforced
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-muted">Stock Ageing Audit: 94.2% fresh inventory</span>
            <span className="font-bold text-emerald-600">Stocktake Variance: ±0.4%</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          8. SECTION 8 & 9: MARKETING ROI & FRANCHISE COMPARISON
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 8: Marketing ROI Performance Table */}
        <div className="lg:col-span-6 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] grid place-items-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Marketing ROI &amp; Acquisition Campaigns
                  </h3>
                  <p className="text-[11px] text-muted">
                    Audience reached, conversions, revenue &amp; ROI multiplier
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                7.4x Aggregate ROI
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                  <tr>
                    {['Campaign Name', 'Channel', 'Delivered', 'Booked', 'Revenue', 'ROI'].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={cn(
                            'p-2.5 font-bold text-[9.5px] uppercase tracking-wider',
                            i === 0 ? 'pl-3' : i === 5 ? 'pr-3 text-right' : '',
                          )}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-soft">
                  {marketingCampaigns.map((cmp) => (
                    <tr key={cmp.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-2.5 pl-3">
                        <div className="font-bold text-ink truncate max-w-[150px]">{cmp.name}</div>
                        <div className="text-[9.5px] text-muted font-mono">{cmp.id}</div>
                      </td>
                      <td className="p-2.5">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6]">
                          {cmp.channel}
                        </span>
                      </td>
                      <td className="p-2.5 font-semibold text-soft">
                        {cmp.delivered.toLocaleString()}
                      </td>
                      <td className="p-2.5 font-bold text-ink">
                        {cmp.bookings}{' '}
                        <span className="text-[10px] text-muted font-normal">
                          ({cmp.attended} done)
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-emerald-700">{cmp.revenue}</td>
                      <td className="p-2.5 pr-3 text-right font-bold text-purple-700">{cmp.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-muted">TRAI DLT &amp; Meta API Verified</span>
            <button
              onClick={() => toast('Opening Marketing Campaign Builder...')}
              className="font-bold text-[#5A2EA6] hover:underline cursor-pointer border-0 bg-transparent"
            >
              Manage Campaigns
            </button>
          </div>
        </div>

        {/* Section 9: Branch vs Franchise Network Matrix */}
        <div className="lg:col-span-6 bg-white p-5 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 grid place-items-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] text-ink font-bold tracking-tight">
                    Company Branches vs Franchise Network
                  </h3>
                  <p className="text-[11px] text-muted">
                    Compliance audit, royalty settlement &amp; CSAT ratings
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#5A2EA6] bg-[#5A2EA6]/10 px-2.5 py-0.5 rounded-full">
                3 Owned · 2 Franchise
              </span>
            </div>

            <div className="space-y-3">
              {filteredBranches.map((unit) => (
                <div
                  key={unit.id}
                  className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-ink flex items-center gap-2">
                      <span className="truncate">{unit.name}</span>
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded-full text-[8.5px] font-bold uppercase',
                          unit.type === 'Company-Owned'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-indigo-100 text-indigo-800',
                        )}
                      >
                        {unit.type}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted mt-0.5">
                      Manager: {unit.manager} · Rating: ★ {unit.rating} / 5.0
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-ink">
                        ₹{(unit.revenue / 100000).toFixed(2)}L
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold">
                        {unit.compliance}% Compliance
                      </div>
                    </div>
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        unit.compliance >= 95 ? 'bg-emerald-500' : 'bg-amber-500',
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-muted">Royalty Invoicing Schedule: 1st of every month</span>
            <span className="font-bold text-[#5A2EA6]">Franchise Fee Realization: 100%</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          9. MODALS & DRILL-DOWN DRAWERS
          ───────────────────────────────────────────────────────────────────────────── */}

      {/* ─────────────────────────────────────────────────────────────────────────────
          9. MODALS & DRILL-DOWN DRAWERS (Portaled to document.body)
          ───────────────────────────────────────────────────────────────────────────── */}

      {/* Approval Review Modal */}
      {selectedApproval &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Review Approval Request
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5 font-mono">
                    {selectedApproval.id} · {selectedApproval.type}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs overflow-y-auto custom-scroll">
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Maker-Checker dual authorization requirement. Approving this request will
                  immediately execute the branch level financial override.
                </div>

                <div className="grid grid-cols-2 gap-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-bold">
                      Requester
                    </span>
                    <strong className="text-ink text-[13px]">{selectedApproval.requester}</strong>
                    <div className="text-[10.5px] text-[#5A2EA6] font-semibold">
                      {selectedApproval.requesterRole}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-bold">
                      Branch Location
                    </span>
                    <strong className="text-ink text-[13px]">{selectedApproval.branch}</strong>
                    <div className="text-[10.5px] text-muted">{selectedApproval.timestamp}</div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] block uppercase tracking-wider mb-1.5">
                    Justification &amp; Impact
                  </label>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-xl border border-purple-100 text-xs text-ink leading-relaxed font-medium">
                    {selectedApproval.details}
                  </div>
                </div>

                {selectedApproval.amount && (
                  <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between">
                    <span className="font-bold text-amber-900">Financial Impact:</span>
                    <strong className="text-amber-900 text-sm font-bold">
                      {selectedApproval.amount}
                    </strong>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <Button
                    variant="outline"
                    onClick={() => handleApprovalAction(selectedApproval.id, 'Rejected')}
                    className="h-10 px-5 rounded-xl text-xs font-semibold border-rose-200 text-rose-700 hover:bg-rose-50 bg-white"
                  >
                    Reject Request
                  </Button>
                  <Button
                    onClick={() => handleApprovalAction(selectedApproval.id, 'Approved')}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Authorize &amp; Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Branch Drilldown Modal */}
      {selectedBranchDetail &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    {selectedBranchDetail.name}
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    {selectedBranchDetail.city} · {selectedBranchDetail.type}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBranchDetail(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs overflow-y-auto custom-scroll">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-muted font-bold block uppercase">
                      Monthly Rev
                    </span>
                    <strong className="text-[16px] font-bold text-ink mt-0.5 block">
                      ₹{(selectedBranchDetail.revenue / 100000).toFixed(2)}L
                    </strong>
                  </div>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                      Occupancy
                    </span>
                    <strong className="text-[16px] font-bold text-emerald-900 mt-0.5 block">
                      {selectedBranchDetail.occupancy}%
                    </strong>
                  </div>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-blue-700 font-bold block uppercase">
                      Growth
                    </span>
                    <strong className="text-[16px] font-bold text-blue-900 mt-0.5 block">
                      +{selectedBranchDetail.growth}%
                    </strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">General Manager:</span>
                    <strong className="text-ink">{selectedBranchDetail.manager}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Compliance Health Score:</span>
                    <strong className="text-emerald-700 font-bold">
                      {selectedBranchDetail.compliance}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Customer CSAT Rating:</span>
                    <strong className="text-amber-700 font-bold">
                      ★ {selectedBranchDetail.rating} / 5.0
                    </strong>
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-purple-50">
                  <Button
                    onClick={() => setSelectedBranchDetail(null)}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Staff Detail Modal */}
      {selectedStaffDetail &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    {selectedStaffDetail.name}
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">{selectedStaffDetail.role}</p>
                </div>
                <button
                  onClick={() => setSelectedStaffDetail(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs overflow-y-auto custom-scroll">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-muted font-bold block uppercase">
                      Revenue Generated
                    </span>
                    <strong className="text-[16px] font-bold text-ink mt-0.5 block">
                      {selectedStaffDetail.revenue}
                    </strong>
                  </div>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                      Target Attainment
                    </span>
                    <strong className="text-[16px] font-bold text-emerald-900 mt-0.5 block">
                      {selectedStaffDetail.targetPercent}%
                    </strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Branch Location:</span>
                    <strong className="text-ink">{selectedStaffDetail.branch}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Total Services Performed:</span>
                    <strong className="text-ink">{selectedStaffDetail.servicesCount} visits</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Client Rebooking Rate:</span>
                    <strong className="text-emerald-700 font-bold">
                      {selectedStaffDetail.rebookingRate}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Chair Utilisation:</span>
                    <strong className="text-[#5A2EA6] font-bold">
                      {selectedStaffDetail.utilisation}%
                    </strong>
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-purple-50">
                  <Button
                    onClick={() => setSelectedStaffDetail(null)}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
