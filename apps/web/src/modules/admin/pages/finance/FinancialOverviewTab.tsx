import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  HelpCircle,
  Layers,
  Percent,
  PieChart as PieChartIcon,
  Receipt,
  ShieldAlert,
  Sparkles,
  Store,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';

export function FinancialOverviewTab() {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [comparePeriod, setComparePeriod] = useState(true);
  const [trendMetric, setTrendMetric] = useState<'gross' | 'net' | 'collections'>('gross');
  const [trendGranularity, setTrendGranularity] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [sortField, setSortField] = useState<
    'revenue' | 'growth' | 'collection' | 'refunds' | 'net'
  >('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleExport = (type: string) => {
    toast(`Exporting ${type} report for ${dateFilter}...`);
  };

  // 10 Global KPI Cards for Brand Owner
  const kpiData = [
    {
      title: 'Total Revenue',
      amount: '₹48,50,000',
      change: '+14.2%',
      isPositive: true,
      subtext: 'vs ₹42,47,000 last period',
      badge: 'Gross Billing',
      accent: 'from-purple-600 to-indigo-700',
    },
    {
      title: 'Service Revenue',
      amount: '₹31,52,500',
      change: '+12.8%',
      isPositive: true,
      subtext: '65.0% of total revenue',
      badge: 'Core Services',
      accent: 'from-blue-600 to-cyan-700',
    },
    {
      title: 'Retail Revenue',
      amount: '₹7,27,500',
      change: '+18.4%',
      isPositive: true,
      subtext: '15.0% of total revenue',
      badge: 'Salon Products',
      accent: 'from-amber-600 to-orange-700',
    },
    {
      title: 'Package Revenue',
      amount: '₹5,82,000',
      change: '+9.1%',
      isPositive: true,
      subtext: '12.0% of total revenue',
      badge: 'Bundled Sessions',
      accent: 'from-emerald-600 to-teal-700',
    },
    {
      title: 'Membership Revenue',
      amount: '₹3,88,000',
      change: '+22.5%',
      isPositive: true,
      subtext: '8.0% of total revenue',
      badge: 'VIP Subscriptions',
      accent: 'from-rose-600 to-pink-700',
    },
    {
      title: 'Total Collections',
      amount: '₹46,80,000',
      change: '+13.5%',
      isPositive: true,
      subtext: '₹1,70,000 pending/in-transit',
      badge: 'Realized Cash/Digital',
      accent: 'from-teal-600 to-emerald-700',
    },
    {
      title: 'Refunds & Returns',
      amount: '₹1,20,000',
      change: '-4.2%',
      isPositive: true, // fewer refunds is good
      subtext: '2.47% refund rate (Target <3%)',
      badge: 'Returns & Credits',
      accent: 'from-red-600 to-rose-700',
    },
    {
      title: 'Discounts & Promos',
      amount: '₹3,40,000',
      change: '+5.0%',
      isPositive: false,
      subtext: '7.0% effective discount rate',
      badge: 'Promotions',
      accent: 'from-orange-600 to-amber-700',
    },
    {
      title: 'Taxes (GST Accounted)',
      amount: '₹7,40,000',
      change: '+14.1%',
      isPositive: true,
      subtext: '18% GST (CGST 9% + SGST 9%)',
      badge: 'Tax Accrual',
      accent: 'from-indigo-600 to-purple-700',
    },
    {
      title: 'Net Revenue',
      amount: '₹43,90,000',
      change: '+15.6%',
      isPositive: true,
      subtext: 'Gross - Discounts - Refunds',
      badge: 'Net Operating',
      accent: 'from-purple-700 to-fuchsia-800',
    },
  ];

  // Revenue Sources Breakdown
  const revenueSources = [
    {
      name: 'Salon & Spa Services',
      amount: '₹31,52,500',
      rawAmount: 3152500,
      percentage: 65.0,
      prevPeriod: '₹27,94,700',
      growth: '+12.8%',
      color: 'bg-[#5A2EA6]',
      ringColor: '#5A2EA6',
    },
    {
      name: 'Retail Haircare & Skincare',
      amount: '₹7,27,500',
      rawAmount: 727500,
      percentage: 15.0,
      prevPeriod: '₹6,14,400',
      growth: '+18.4%',
      color: 'bg-[#8B6FD8]',
      ringColor: '#8B6FD8',
    },
    {
      name: 'Prepaid Service Packages',
      amount: '₹5,82,000',
      rawAmount: 582000,
      percentage: 12.0,
      prevPeriod: '₹5,33,400',
      growth: '+9.1%',
      color: 'bg-[#0D9488]',
      ringColor: '#0D9488',
    },
    {
      name: 'Annual VIP Memberships',
      amount: '₹3,88,000',
      rawAmount: 388000,
      percentage: 8.0,
      prevPeriod: '₹3,16,700',
      growth: '+22.5%',
      color: 'bg-[#E11D48]',
      ringColor: '#E11D48',
    },
    {
      name: 'Gift Cards & Vouchers',
      amount: '₹1,94,000',
      rawAmount: 194000,
      percentage: 4.0,
      prevPeriod: '₹1,74,600',
      growth: '+11.1%',
      color: 'bg-[#D97706]',
      ringColor: '#D97706',
    },
    {
      name: 'Other Configured Sources',
      amount: '₹97,000',
      rawAmount: 97000,
      percentage: 2.0,
      prevPeriod: '₹89,800',
      growth: '+8.0%',
      color: 'bg-[#64748B]',
      ringColor: '#64748B',
    },
  ];

  // Branch-wise Performance Data
  const branchData = [
    {
      id: 'BR-01',
      name: 'Indore Central (Flagship)',
      city: 'Indore',
      serviceRev: '₹9,80,000',
      retailRev: '₹2,50,000',
      packageRev: '₹1,80,000',
      membershipRev: '₹1,20,000',
      grossRev: '₹15,30,000',
      rawGross: 1530000,
      discounts: '₹1,05,000',
      refunds: '₹32,000',
      tax: '₹2,34,000',
      netRev: '₹13,93,000',
      rawNet: 1393000,
      collection: '₹14,90,000',
      rawCollection: 1490000,
      growth: '+16.8%',
      rawGrowth: 16.8,
      rawRefunds: 32000,
      refundRate: '2.09%',
      ranking: 1,
    },
    {
      id: 'BR-02',
      name: 'Vijay Nagar Boutique',
      city: 'Indore',
      serviceRev: '₹7,60,000',
      retailRev: '₹1,85,000',
      packageRev: '₹1,40,000',
      membershipRev: '₹95,000',
      grossRev: '₹11,80,000',
      rawGross: 1180000,
      discounts: '₹80,000',
      refunds: '₹28,000',
      tax: '₹1,80,000',
      netRev: '₹10,72,000',
      rawNet: 1072000,
      collection: '₹11,40,000',
      rawCollection: 1140000,
      growth: '+14.2%',
      rawGrowth: 14.2,
      rawRefunds: 28000,
      refundRate: '2.37%',
      ranking: 2,
    },
    {
      id: 'BR-03',
      name: 'Bhopal Arera Colony',
      city: 'Bhopal',
      serviceRev: '₹6,40,000',
      retailRev: '₹1,42,500',
      packageRev: '₹1,20,000',
      membershipRev: '₹82,000',
      grossRev: '₹9,84,500',
      rawGross: 984500,
      discounts: '₹72,000',
      refunds: '₹26,000',
      tax: '₹1,50,000',
      netRev: '₹8,86,500',
      rawNet: 886500,
      collection: '₹9,50,000',
      rawCollection: 950000,
      growth: '+11.5%',
      rawGrowth: 11.5,
      rawRefunds: 26000,
      refundRate: '2.64%',
      ranking: 3,
    },
    {
      id: 'BR-04',
      name: 'Ujjain Mahakal Road',
      city: 'Ujjain',
      serviceRev: '₹4,60,000',
      retailRev: '₹95,000',
      packageRev: '₹82,000',
      membershipRev: '₹51,000',
      grossRev: '₹6,88,000',
      rawGross: 688000,
      discounts: '₹48,000',
      refunds: '₹20,000',
      tax: '₹1,05,000',
      netRev: '₹6,20,000',
      rawNet: 620000,
      collection: '₹6,65,000',
      rawCollection: 665000,
      growth: '+8.9%',
      rawGrowth: 8.9,
      rawRefunds: 20000,
      refundRate: '2.90%',
      ranking: 4,
    },
    {
      id: 'BR-05',
      name: 'Gwalior City Centre',
      city: 'Gwalior',
      serviceRev: '₹3,12,500',
      retailRev: '₹55,000',
      packageRev: '₹60,000',
      membershipRev: '₹40,000',
      grossRev: '₹4,67,500',
      rawGross: 467500,
      discounts: '₹35,000',
      refunds: '₹14,000',
      tax: '₹71,000',
      netRev: '₹4,18,500',
      rawNet: 418500,
      collection: '₹4,35,000',
      rawCollection: 435000,
      growth: '+7.4%',
      rawGrowth: 7.4,
      rawRefunds: 14000,
      refundRate: '2.99%',
      ranking: 5,
    },
  ];

  // Sorting logic
  const sortedBranches = [...branchData].sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortField === 'revenue') {
      valA = a.rawGross;
      valB = b.rawGross;
    } else if (sortField === 'growth') {
      valA = a.rawGrowth;
      valB = b.rawGrowth;
    } else if (sortField === 'collection') {
      valA = a.rawCollection;
      valB = b.rawCollection;
    } else if (sortField === 'refunds') {
      valA = a.rawRefunds;
      valB = b.rawRefunds;
    } else if (sortField === 'net') {
      valA = a.rawNet;
      valB = b.rawNet;
    }
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const handleSort = (field: 'revenue' | 'growth' | 'collection' | 'refunds' | 'net') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Trend bars mock data
  const trendDays = [
    { label: 'Aug 01', gross: 142000, net: 128000, collection: 139000, prev: 125000 },
    { label: 'Aug 03', gross: 168000, net: 151000, collection: 162000, prev: 148000 },
    { label: 'Aug 05', gross: 155000, net: 140000, collection: 150000, prev: 135000 },
    { label: 'Aug 07', gross: 195000, net: 178000, collection: 189000, prev: 160000 },
    { label: 'Aug 09', gross: 210000, net: 191000, collection: 204000, prev: 175000 },
    { label: 'Aug 11', gross: 185000, net: 168000, collection: 179000, prev: 162000 },
    { label: 'Aug 13', gross: 220000, net: 199000, collection: 215000, prev: 188000 },
    { label: 'Aug 15', gross: 260000, net: 236000, collection: 252000, prev: 210000 },
    { label: 'Aug 17', gross: 245000, net: 222000, collection: 238000, prev: 205000 },
    { label: 'Aug 18', gross: 275000, net: 251000, collection: 268000, prev: 228000 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 px-3 py-1.5 rounded-xl">
            <Store className="w-4 h-4 text-[#5A2EA6]" />
            <span className="text-[11px] font-bold text-soft uppercase tracking-wider">
              Branch:
            </span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              aria-label="Filter by branch"
              className="bg-transparent text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All 5 Branches (Consolidated)</option>
              <option value="BR-01">Indore Central</option>
              <option value="BR-02">Vijay Nagar Boutique</option>
              <option value="BR-03">Bhopal Arera Colony</option>
              <option value="BR-04">Ujjain Mahakal Road</option>
              <option value="BR-05">Gwalior City Centre</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-1 bg-[#F8F5FF] border border-[#5A2EA6]/20 p-1 rounded-xl overflow-x-auto">
            {[
              'Today',
              'Yesterday',
              'This Week',
              'This Month',
              'Last Month',
              'This Quarter',
              'This Year',
              'Custom',
            ].map((range) => (
              <button
                key={range}
                onClick={() => setDateFilter(range)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
                  dateFilter === range
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'bg-transparent text-soft hover:text-ink',
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Compare Toggle */}
          <label className="flex items-center gap-1.5 text-xs font-bold text-soft cursor-pointer select-none ml-1">
            <input
              type="checkbox"
              checked={comparePeriod}
              onChange={(e) => setComparePeriod(e.target.checked)}
              className="rounded text-[#5A2EA6] focus:ring-0 cursor-pointer w-3.5 h-3.5"
            />
            <span>Compare vs Last Period</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('Financial Overview Summary')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Overview</span>
          </Button>
        </div>
      </div>

      {/* 2. 10 Global KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {kpiData.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-3.5 border border-[#5A2EA6]/10 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="text-[10px] font-bold text-soft uppercase tracking-wider">
                {kpi.title}
              </span>
              <span className="text-[8px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-[#5A2EA6] border border-purple-100 whitespace-nowrap inline-flex items-center">
                {kpi.badge}
              </span>
            </div>

            <div className="my-1">
              <span className="text-lg font-serif font-bold text-ink block leading-tight tracking-tight">
                {kpi.amount}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] mt-1 pt-1.5 border-t border-line/40">
              <span
                className={cn(
                  'font-bold flex items-center gap-0.5',
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
              <span className="text-[9px] text-muted truncate max-w-[110px]">{kpi.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Revenue Breakdown + Visual Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Streams Distribution (Pie/Bar summary) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                  <PieChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    Revenue Source Breakdown
                  </h3>
                  <p className="text-[11px] text-muted">
                    Contribution by operational business channel
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#5A2EA6] bg-[#5A2EA6]/10 px-2 py-0.5 rounded-full">
                ₹48.5 Lakhs Total
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex my-4 shadow-inner">
              {revenueSources.map((source, i) => (
                <div
                  key={i}
                  style={{ width: `${source.percentage}%` }}
                  className={cn('h-full transition-all duration-500', source.color)}
                  title={`${source.name}: ${source.percentage}% (${source.amount})`}
                />
              ))}
            </div>

            {/* Detailed Source Breakdown List */}
            <div className="space-y-2.5">
              {revenueSources.map((source, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F5FF] transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('w-3 h-3 rounded-md shrink-0', source.color)} />
                    <div>
                      <span className="font-bold text-ink block leading-tight">{source.name}</span>
                      <span className="text-[10px] text-muted">Prev: {source.prevPeriod}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <strong className="text-ink font-bold">{source.amount}</strong>
                      <span className="text-[10px] font-bold text-soft">
                        ({source.percentage}%)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                      <TrendingUp className="w-2.5 h-2.5" />
                      {source.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-line/40 flex items-center justify-between text-[11px] text-soft">
            <span>
              Highest growth: <strong>VIP Memberships (+22.5%)</strong>
            </span>
            <span className="text-[#5A2EA6] font-bold">100% Reconciled</span>
          </div>
        </div>

        {/* 4. Revenue Trend Chart (Gross vs Net vs Collections) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    Multi-Day Revenue Trajectory
                  </h3>
                  <p className="text-[11px] text-muted">Comparison against previous month pacing</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Metric Selector */}
                <div className="flex items-center bg-[#F8F5FF] border border-[#5A2EA6]/20 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setTrendMetric('gross')}
                    className={cn(
                      'px-2 py-1 rounded-md font-bold text-[11px] transition cursor-pointer border-0',
                      trendMetric === 'gross' ? 'bg-[#5A2EA6] text-white shadow-xs' : 'text-soft',
                    )}
                  >
                    Gross
                  </button>
                  <button
                    onClick={() => setTrendMetric('net')}
                    className={cn(
                      'px-2 py-1 rounded-md font-bold text-[11px] transition cursor-pointer border-0',
                      trendMetric === 'net' ? 'bg-[#5A2EA6] text-white shadow-xs' : 'text-soft',
                    )}
                  >
                    Net
                  </button>
                  <button
                    onClick={() => setTrendMetric('collections')}
                    className={cn(
                      'px-2 py-1 rounded-md font-bold text-[11px] transition cursor-pointer border-0',
                      trendMetric === 'collections'
                        ? 'bg-[#5A2EA6] text-white shadow-xs'
                        : 'text-soft',
                    )}
                  >
                    Collections
                  </button>
                </div>

                {/* Granularity */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold text-muted">
                  {(['Daily', 'Weekly', 'Monthly'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setTrendGranularity(g)}
                      className={cn(
                        'px-2 py-0.5 rounded-md cursor-pointer border-0',
                        trendGranularity === g ? 'bg-white text-ink shadow-xs' : 'hover:text-ink',
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Interactive Trend Bars */}
            <div className="pt-2 pb-1">
              <div className="h-44 w-full flex items-end justify-between gap-2.5 border-b border-slate-100 pb-2">
                {trendDays.map((day, idx) => {
                  const val =
                    trendMetric === 'gross'
                      ? day.gross
                      : trendMetric === 'net'
                        ? day.net
                        : day.collection;
                  const max = 300000;
                  const currentHeight = Math.round((val / max) * 100);
                  const prevHeight = Math.round((day.prev / max) * 100);

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1 group relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg">
                        <div className="font-bold">
                          {day.label}: ₹{val.toLocaleString()}
                        </div>
                        <div className="text-[9px] text-slate-300">
                          Prev: ₹{day.prev.toLocaleString()}
                        </div>
                      </div>

                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        {/* Previous Period Bar */}
                        <div
                          style={{ height: `${prevHeight}%` }}
                          className="w-2.5 bg-slate-200 rounded-t-sm transition-all duration-300"
                          title={`Prev Period: ₹${day.prev.toLocaleString()}`}
                        />
                        {/* Current Period Bar */}
                        <div
                          style={{ height: `${currentHeight}%` }}
                          className={cn(
                            'w-3.5 rounded-t-sm transition-all duration-300 group-hover:brightness-110 shadow-xs',
                            trendMetric === 'gross'
                              ? 'bg-[#5A2EA6]'
                              : trendMetric === 'net'
                                ? 'bg-emerald-600'
                                : 'bg-blue-600',
                          )}
                          title={`Current: ₹${val.toLocaleString()}`}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-soft group-hover:text-ink">
                        {day.label.slice(4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend & Summary */}
            <div className="flex items-center justify-between text-xs pt-3">
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'w-3 h-3 rounded-sm',
                      trendMetric === 'gross'
                        ? 'bg-[#5A2EA6]'
                        : trendMetric === 'net'
                          ? 'bg-emerald-600'
                          : 'bg-blue-600',
                    )}
                  />
                  <span className="font-bold text-ink capitalize">
                    Current Period ({trendMetric})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-200" />
                  <span className="font-semibold text-soft">Previous Comparison Period</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-600">
                  Avg Pace: ₹2.15L / Day (+14.2%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Branch-Wise Financial Performance Comparison */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Branch-wise Financial Performance
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                5 Locations Active
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Ranked cross-branch comparison of revenue mix, discounts, refunds, and collected cash
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-soft font-bold">Sort by:</span>
            <div className="flex items-center gap-1 bg-white border border-[#5A2EA6]/20 p-1 rounded-xl text-xs">
              <button
                onClick={() => handleSort('revenue')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border-0',
                  sortField === 'revenue' ? 'bg-[#5A2EA6] text-white' : 'text-soft',
                )}
              >
                Revenue
              </button>
              <button
                onClick={() => handleSort('growth')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border-0',
                  sortField === 'growth' ? 'bg-[#5A2EA6] text-white' : 'text-soft',
                )}
              >
                Growth
              </button>
              <button
                onClick={() => handleSort('collection')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border-0',
                  sortField === 'collection' ? 'bg-[#5A2EA6] text-white' : 'text-soft',
                )}
              >
                Collection
              </button>
              <button
                onClick={() => handleSort('refunds')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border-0',
                  sortField === 'refunds' ? 'bg-[#5A2EA6] text-white' : 'text-soft',
                )}
              >
                Refunds
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Rank & Branch</th>
                <th className="p-3.5 text-right">Service Rev</th>
                <th className="p-3.5 text-right">Retail Rev</th>
                <th className="p-3.5 text-right">Packages</th>
                <th className="p-3.5 text-right">Memberships</th>
                <th className="p-3.5 text-right">Gross Rev</th>
                <th className="p-3.5 text-right">Discounts</th>
                <th className="p-3.5 text-right">Refunds</th>
                <th className="p-3.5 text-right">Tax (18%)</th>
                <th className="p-3.5 text-right">Net Rev</th>
                <th className="p-3.5 text-right">Collected</th>
                <th className="p-3.5 pr-5 text-right">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {sortedBranches.map((b, idx) => (
                <tr key={b.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Rank & Branch Name */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'w-6 h-6 rounded-full text-[10px] font-extrabold grid place-items-center shrink-0',
                          idx === 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : idx === 1
                              ? 'bg-slate-200 text-slate-800'
                              : idx === 2
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-purple-50 text-[#5A2EA6]',
                        )}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <strong className="font-bold text-ink block text-xs">{b.name}</strong>
                        <span className="text-[10px] text-muted">
                          {b.city} · {b.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Streams */}
                  <td className="p-3.5 text-right font-semibold whitespace-nowrap">
                    {b.serviceRev}
                  </td>
                  <td className="p-3.5 text-right text-soft whitespace-nowrap">{b.retailRev}</td>
                  <td className="p-3.5 text-right text-soft whitespace-nowrap">{b.packageRev}</td>
                  <td className="p-3.5 text-right text-soft whitespace-nowrap">
                    {b.membershipRev}
                  </td>

                  {/* Gross */}
                  <td className="p-3.5 text-right font-bold text-ink bg-purple-50/30 whitespace-nowrap">
                    {b.grossRev}
                  </td>

                  {/* Deductions */}
                  <td className="p-3.5 text-right text-rose-600 font-semibold whitespace-nowrap">
                    -{b.discounts}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <span className="text-red-700 font-semibold block">-{b.refunds}</span>
                    <span className="text-[9px] text-muted">{b.refundRate}</span>
                  </td>
                  <td className="p-3.5 text-right text-indigo-700 font-medium whitespace-nowrap">
                    {b.tax}
                  </td>

                  {/* Net & Collections */}
                  <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] whitespace-nowrap">
                    {b.netRev}
                  </td>
                  <td className="p-3.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                    {b.collection}
                  </td>

                  {/* Growth */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      <TrendingUp className="w-2.5 h-2.5" />
                      {b.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total Summary Row */}
            <tfoot className="bg-[#F8F5FF] border-t-2 border-[#5A2EA6]/20 font-bold text-xs text-ink">
              <tr className="whitespace-nowrap">
                <td className="p-3.5 pl-5 uppercase tracking-wider text-[#5A2EA6]">
                  Consolidated Total (5 Branches)
                </td>
                <td className="p-3.5 text-right">₹31,52,500</td>
                <td className="p-3.5 text-right">₹7,27,500</td>
                <td className="p-3.5 text-right">₹5,82,000</td>
                <td className="p-3.5 text-right">₹3,88,000</td>
                <td className="p-3.5 text-right font-extrabold text-[#5A2EA6]">₹48,50,000</td>
                <td className="p-3.5 text-right text-rose-600">-₹3,40,000</td>
                <td className="p-3.5 text-right text-red-700">-₹1,20,000</td>
                <td className="p-3.5 text-right text-indigo-700">₹7,40,000</td>
                <td className="p-3.5 text-right font-extrabold text-[#5A2EA6]">₹43,90,000</td>
                <td className="p-3.5 text-right font-extrabold text-emerald-700">₹46,80,000</td>
                <td className="p-3.5 pr-5 text-right text-emerald-700">+14.2% Avg</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
