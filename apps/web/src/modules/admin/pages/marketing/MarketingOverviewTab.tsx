import { Button, cn } from '@salon-spa-saas/ui';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  Filter,
  Gift,
  Layers,
  Megaphone,
  Percent,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface MarketingOverviewProps {
  onNavigateTab?: (tab: string, filter?: string) => void;
}

interface BranchMarketingStat {
  branchId: string;
  branchName: string;
  campaignsCount: number;
  promotionsCount: number;
  redemptions: number;
  newClients: number;
  returningClients: number;
  loyaltyMembers: number;
  revenueGenerated: string;
  conversionRate: string;
}

const mockBranchStats: BranchMarketingStat[] = [
  {
    branchId: 'BR-01',
    branchName: 'Indore Central Flagship',
    campaignsCount: 4,
    promotionsCount: 6,
    redemptions: 1420,
    newClients: 280,
    returningClients: 1140,
    loyaltyMembers: 2150,
    revenueGenerated: '₹9,80,000',
    conversionRate: '8.4%',
  },
  {
    branchId: 'BR-02',
    branchName: 'Vijay Nagar Boutique',
    campaignsCount: 4,
    promotionsCount: 5,
    redemptions: 980,
    newClients: 195,
    returningClients: 785,
    loyaltyMembers: 1420,
    revenueGenerated: '₹6,45,000',
    conversionRate: '7.8%',
  },
  {
    branchId: 'BR-03',
    branchName: 'Bhopal Arera Colony',
    campaignsCount: 3,
    promotionsCount: 4,
    redemptions: 540,
    newClients: 110,
    returningClients: 430,
    loyaltyMembers: 860,
    revenueGenerated: '₹3,90,000',
    conversionRate: '6.9%',
  },
  {
    branchId: 'BR-04',
    branchName: 'Ujjain Mahakal Road',
    campaignsCount: 2,
    promotionsCount: 3,
    redemptions: 280,
    newClients: 55,
    returningClients: 225,
    loyaltyMembers: 410,
    revenueGenerated: '₹1,95,000',
    conversionRate: '6.2%',
  },
  {
    branchId: 'BR-05',
    branchName: 'Gwalior City Centre',
    campaignsCount: 2,
    promotionsCount: 3,
    redemptions: 200,
    newClients: 40,
    returningClients: 160,
    loyaltyMembers: 280,
    revenueGenerated: '₹1,40,000',
    conversionRate: '5.8%',
  },
];

export function MarketingOverviewTab({ onNavigateTab }: MarketingOverviewProps) {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [selectedCampaignType, setSelectedCampaignType] = useState('all');
  const [selectedPromotionType, setSelectedPromotionType] = useState('all');
  const [sortField, setSortField] = useState<keyof BranchMarketingStat>('redemptions');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 7 Core KPIs
  const kpis = [
    {
      title: 'Active Campaigns',
      value: '4 Active',
      sub: '2 Scheduled · 8 Total',
      change: '+1 this mo',
      isPositive: true,
      icon: Megaphone,
      accent: 'text-purple-600',
      bgAccent: 'bg-purple-50',
      tabTarget: 'campaigns',
    },
    {
      title: 'Active Promotions',
      value: '8 Offers',
      sub: '3 Expiring in 7 Days',
      change: '+2 new',
      isPositive: true,
      icon: Tag,
      accent: 'text-indigo-600',
      bgAccent: 'bg-indigo-50',
      tabTarget: 'promotions',
    },
    {
      title: 'Campaign Reach',
      value: '48,500',
      sub: 'Clients Targeted',
      change: '+18.4% YoY',
      isPositive: true,
      icon: Users,
      accent: 'text-blue-600',
      bgAccent: 'bg-blue-50',
      tabTarget: 'campaigns',
    },
    {
      title: 'Offer Redemptions',
      value: '3,420',
      sub: '7.05% Conversion',
      change: '+12.6% MoM',
      isPositive: true,
      icon: CheckCircle2,
      accent: 'text-emerald-600',
      bgAccent: 'bg-emerald-50',
      tabTarget: 'promotions',
    },
    {
      title: 'New Clients Acquired',
      value: '680 Clients',
      sub: '19.8% First-timers',
      change: '+15.2% vs last mo',
      isPositive: true,
      icon: UserCheck,
      accent: 'text-amber-600',
      bgAccent: 'bg-amber-50',
      tabTarget: 'reports',
    },
    {
      title: 'Returning Clients',
      value: '2,740 Clients',
      sub: '80.2% Retention',
      change: '+8.4% MoM',
      isPositive: true,
      icon: TrendingUp,
      accent: 'text-teal-600',
      bgAccent: 'bg-teal-50',
      tabTarget: 'reports',
    },
    {
      title: 'Loyalty Members',
      value: '5,120',
      sub: '₹18.4L Member Spend',
      change: '+320 new enrollments',
      isPositive: true,
      icon: Award,
      accent: 'text-purple-700',
      bgAccent: 'bg-purple-50',
      tabTarget: 'loyalty',
    },
  ];

  // Top campaigns mock data
  const topCampaigns = [
    {
      name: 'Monsoon Hair Spa & Keratin Revival',
      reach: '18,400',
      redemptions: 1420,
      revenue: '₹9,20,000',
      conv: '7.7%',
      status: 'Active',
    },
    {
      name: 'Bridal Glow Aesthetics Pre-Booking',
      reach: '12,000',
      redemptions: 940,
      revenue: '₹8,50,000',
      conv: '7.8%',
      status: 'Active',
    },
    {
      name: 'VIP Platinum Double Points Blitz',
      reach: '8,200',
      redemptions: 680,
      revenue: '₹4,10,000',
      conv: '8.3%',
      status: 'Active',
    },
    {
      name: 'Weekend Colour & Cut Duo Pass',
      reach: '9,900',
      redemptions: 380,
      revenue: '₹1,70,000',
      conv: '3.8%',
      status: 'Scheduled',
    },
  ];

  // Promotion distribution
  const promoDistribution = [
    {
      type: 'Percentage Discount (15-25% Off)',
      share: 45,
      count: '1,540 uses',
      color: 'bg-[#5A2EA6]',
    },
    { type: 'Complimentary Spa Add-on', share: 25, count: '855 uses', color: 'bg-indigo-600' },
    { type: 'Flat Cash Voucher (₹500 Off)', share: 18, count: '615 uses', color: 'bg-purple-400' },
    { type: 'BOGO / Festive Bundle Pass', share: 12, count: '410 uses', color: 'bg-amber-400' },
  ];

  // Sorted branch stats
  const sortedBranches = useMemo(() => {
    return [...mockBranchStats].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string' && valA.startsWith('₹')) {
        valA = Number.parseInt(valA.replace(/[^0-9]/g, ''), 10);
        valB = Number.parseInt((valB as string).replace(/[^0-9]/g, ''), 10);
      }
      if (sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
      }
      return valA < valB ? 1 : -1;
    });
  }, [sortField, sortOrder]);

  const handleSort = (field: keyof BranchMarketingStat) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Global Filter Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              aria-label="Filter by salon branch location"
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Salon Branches (5)</option>
              <option value="BR-01">Indore Central Flagship</option>
              <option value="BR-02">Vijay Nagar Boutique</option>
              <option value="BR-03">Bhopal Arera Colony</option>
              <option value="BR-04">Ujjain Mahakal Road</option>
              <option value="BR-05">Gwalior City Centre</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              aria-label="Filter by time period"
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="This Month">This Month (Aug 2026)</option>
              <option value="Last Month">Last Month (Jul 2026)</option>
              <option value="Last 90 Days">Last 90 Days (Q2/Q3)</option>
              <option value="Financial YTD">Financial YTD (FY26-27)</option>
            </select>
          </div>

          {/* Campaign Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Megaphone className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedCampaignType}
              onChange={(e) => setSelectedCampaignType(e.target.value)}
              aria-label="Filter by campaign segment"
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Campaign Types</option>
              <option value="Seasonal">Seasonal &amp; Festive</option>
              <option value="Loyalty">Loyalty Multiplier</option>
              <option value="Re-engagement">Lapsed Client Revival</option>
              <option value="Service Launch">New Service Launch</option>
            </select>
          </div>

          {/* Promotion Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Tag className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedPromotionType}
              onChange={(e) => setSelectedPromotionType(e.target.value)}
              aria-label="Filter by promotion offer structure"
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Offer Formats</option>
              <option value="Percentage">Percentage Discounts</option>
              <option value="Fixed">Flat Cash Vouchers</option>
              <option value="Complimentary">Complimentary Upgrades</option>
              <option value="Bundle">Package Bundles</option>
            </select>
          </div>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting Marketing Overview dossier (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Dashboard</span>
          </Button>
        </div>
      </div>

      {/* 2. 7 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {kpis.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab && onNavigateTab(kpi.tabTarget)}
              className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between hover:border-[#5A2EA6]/40 hover:shadow-md transition cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-xl grid place-items-center',
                      kpi.bgAccent,
                      kpi.accent,
                    )}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-extrabold flex items-center',
                      kpi.isPositive ? 'text-emerald-600' : 'text-rose-600',
                    )}
                  >
                    {kpi.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {kpi.change}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                  {kpi.title}
                </span>
                <strong className="text-lg font-serif font-bold text-ink mt-0.5 block group-hover:text-[#5A2EA6] transition">
                  {kpi.value}
                </strong>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-muted truncate max-w-[110px]">{kpi.sub}</span>
                <ChevronRight className="w-3 h-3 text-soft group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Midsection: Top Campaigns & Promotion Distribution & Client Acquisition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Campaign Performance */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-[#5A2EA6]/10 flex items-center justify-between bg-[#FCFAFF]">
              <div>
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#5A2EA6]" />
                  <h3 className="font-serif font-bold text-ink text-base">
                    Campaign Performance &amp; Revenue Conversion
                  </h3>
                </div>
                <p className="text-[11px] text-muted mt-0.5">
                  Top performing multi-channel salon promotions active this period
                </p>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('campaigns')}
                className="text-xs font-bold text-[#5A2EA6] hover:underline cursor-pointer border-0 bg-transparent flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {topCampaigns.map((camp, cIdx) => (
                <div
                  key={cIdx}
                  className="p-3 rounded-xl border border-slate-100 hover:border-[#5A2EA6]/30 bg-slate-50/50 hover:bg-[#F8F5FF] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="font-bold text-ink text-xs">{camp.name}</strong>
                      <span
                        className={cn(
                          'px-2 py-0.2 rounded-full text-[9px] font-bold border',
                          camp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200',
                        )}
                      >
                        {camp.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-soft block">
                      Target Audience Reach: <strong>{camp.reach} clients</strong> · Redemptions:{' '}
                      <strong>{camp.redemptions}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:text-right">
                    <div>
                      <span className="text-[10px] text-soft uppercase font-bold block">
                        Conversion
                      </span>
                      <strong className="text-xs font-extrabold text-emerald-700">
                        {camp.conv}
                      </strong>
                    </div>
                    <div className="pl-3 border-l border-slate-200">
                      <span className="text-[10px] text-soft uppercase font-bold block">
                        Attributed Rev.
                      </span>
                      <strong className="text-xs font-serif font-bold text-[#5A2EA6]">
                        {camp.revenue}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#FCFAFF] border-t border-slate-100 flex items-center justify-between text-xs text-soft">
            <span>
              Total Attributed Campaign Revenue:{' '}
              <strong className="text-[#5A2EA6]">₹23,50,000</strong>
            </span>
            <span className="font-bold text-emerald-700">Overall ROI: 4.8x</span>
          </div>
        </div>

        {/* Promotion Redemptions & New vs Returning Split */}
        <div className="lg:col-span-5 space-y-6">
          {/* Promotion Redemptions Distribution */}
          <div className="bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-ink text-sm">Promotion Offer Breakdown</h4>
                <p className="text-[11px] text-muted">Redemption share across offer types</p>
              </div>
              <Tag className="w-4 h-4 text-[#5A2EA6]" />
            </div>

            {/* Distribution Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              {promoDistribution.map((item, idx) => (
                <div
                  key={idx}
                  style={{ width: `${item.share}%` }}
                  className={cn('h-full transition-all duration-300', item.color)}
                  title={`${item.type}: ${item.share}%`}
                />
              ))}
            </div>

            <div className="space-y-2 text-xs">
              {promoDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className={cn('w-2.5 h-2.5 rounded-full', item.color)} />
                    <span className="text-slate-700 font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">{item.count}</span>
                    <strong className="text-ink font-bold">{item.share}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New vs Returning Client Acquisition Split */}
          <div className="bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-ink text-sm">
                  New vs. Returning Client Mix
                </h4>
                <p className="text-[11px] text-muted">
                  Footfall generated through marketing outreach
                </p>
              </div>
              <Users className="w-4 h-4 text-[#5A2EA6]" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs pt-1">
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                <span className="text-soft text-[10px] uppercase font-bold block">
                  First-Time Clients
                </span>
                <strong className="text-base font-serif font-bold text-[#5A2EA6] mt-0.5 block">
                  680 (19.8%)
                </strong>
                <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                  +15.2% Acquisition
                </span>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100">
                <span className="text-soft text-[10px] uppercase font-bold block">
                  Returning Loyalty
                </span>
                <strong className="text-base font-serif font-bold text-teal-800 mt-0.5 block">
                  2,740 (80.2%)
                </strong>
                <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                  High Lifetime Value
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Branch-Wise Marketing Performance Table (Section 12 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Branch-Wise Marketing &amp; Promotion Performance
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                Multi-Branch Comparison
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Comprehensive multi-outlet breakdown of campaign participation, offer redemptions, and
              revenue generation
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">Live POS Synced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th
                  className="p-3.5 pl-5 cursor-pointer hover:underline"
                  onClick={() => handleSort('branchName')}
                >
                  Salon Branch &amp; Code{' '}
                  {sortField === 'branchName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:underline"
                  onClick={() => handleSort('campaignsCount')}
                >
                  Active Campaigns{' '}
                  {sortField === 'campaignsCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:underline"
                  onClick={() => handleSort('promotionsCount')}
                >
                  Active Offers{' '}
                  {sortField === 'promotionsCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:underline"
                  onClick={() => handleSort('redemptions')}
                >
                  Redemptions {sortField === 'redemptions' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:underline"
                  onClick={() => handleSort('newClients')}
                >
                  New Clients {sortField === 'newClients' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:underline"
                  onClick={() => handleSort('returningClients')}
                >
                  Returning Clients{' '}
                  {sortField === 'returningClients' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:underline"
                  onClick={() => handleSort('loyaltyMembers')}
                >
                  Loyalty Base {sortField === 'loyaltyMembers' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:underline"
                  onClick={() => handleSort('conversionRate')}
                >
                  Conversion % {sortField === 'conversionRate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-3.5 pr-5 text-right cursor-pointer hover:underline"
                  onClick={() => handleSort('revenueGenerated')}
                >
                  Attributed Revenue{' '}
                  {sortField === 'revenueGenerated' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {sortedBranches.map((b) => (
                <tr key={b.branchId} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Branch Name */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{b.branchName}</strong>
                    <span className="text-[10px] text-soft">{b.branchId}</span>
                  </td>

                  {/* Campaigns */}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-slate-800">
                    {b.campaignsCount} Active
                  </td>

                  {/* Promotions */}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-slate-800">
                    {b.promotionsCount} Offers
                  </td>

                  {/* Redemptions */}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink bg-purple-50/20">
                    {b.redemptions.toLocaleString()}
                  </td>

                  {/* New Clients */}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-emerald-700">
                    +{b.newClients}
                  </td>

                  {/* Returning Clients */}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-teal-800">
                    {b.returningClients}
                  </td>

                  {/* Loyalty Members */}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-[#5A2EA6]">
                    {b.loyaltyMembers.toLocaleString()}
                  </td>

                  {/* Conversion */}
                  <td className="p-3.5 text-center whitespace-nowrap font-extrabold text-slate-900">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {b.conversionRate}
                    </span>
                  </td>

                  {/* Revenue */}
                  <td className="p-3.5 pr-5 text-right font-extrabold font-serif text-[#5A2EA6] text-sm whitespace-nowrap">
                    {b.revenueGenerated}
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
