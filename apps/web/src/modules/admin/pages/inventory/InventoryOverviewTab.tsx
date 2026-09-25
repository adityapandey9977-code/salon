import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  Layers,
  Package,
  PieChart as PieChartIcon,
  RefreshCw,
  Search,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

// Mock Branch Comparison Data
interface BranchStockSummary {
  branchId: string;
  name: string;
  city: string;
  totalSkus: number;
  totalUnits: number;
  stockValue: string;
  lowStockCount: number;
  outOfStockCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  wastageThisMonth: string;
  lastStocktakeDate: string;
  healthScore: number;
  status: 'Optimal' | 'Attention Required' | 'Critical Alerts';
}

const mockBranchStocks: BranchStockSummary[] = [
  {
    branchId: 'BR-01',
    name: 'Indore Central Flagship',
    city: 'Indore, MP',
    totalSkus: 280,
    totalUnits: 4620,
    stockValue: '₹9,85,000',
    lowStockCount: 8,
    outOfStockCount: 1,
    expiringSoonCount: 4,
    expiredCount: 0,
    wastageThisMonth: '₹8,400',
    lastStocktakeDate: '12 Aug 2026',
    healthScore: 96,
    status: 'Optimal',
  },
  {
    branchId: 'BR-02',
    name: 'Vijay Nagar Boutique',
    city: 'Indore, MP',
    totalSkus: 245,
    totalUnits: 3410,
    stockValue: '₹7,40,000',
    lowStockCount: 14,
    outOfStockCount: 3,
    expiringSoonCount: 6,
    expiredCount: 1,
    wastageThisMonth: '₹11,200',
    lastStocktakeDate: '10 Aug 2026',
    healthScore: 84,
    status: 'Attention Required',
  },
  {
    branchId: 'BR-03',
    name: 'Bhopal Arera Colony',
    city: 'Bhopal, MP',
    totalSkus: 210,
    totalUnits: 2890,
    stockValue: '₹5,65,000',
    lowStockCount: 9,
    outOfStockCount: 2,
    expiringSoonCount: 3,
    expiredCount: 1,
    wastageThisMonth: '₹6,900',
    lastStocktakeDate: '08 Aug 2026',
    healthScore: 89,
    status: 'Optimal',
  },
  {
    branchId: 'BR-04',
    name: 'Ujjain Mahakal Road',
    city: 'Ujjain, MP',
    totalSkus: 175,
    totalUnits: 2120,
    stockValue: '₹3,20,000',
    lowStockCount: 7,
    outOfStockCount: 2,
    expiringSoonCount: 3,
    expiredCount: 2,
    wastageThisMonth: '₹4,800',
    lastStocktakeDate: '14 Aug 2026',
    healthScore: 81,
    status: 'Attention Required',
  },
  {
    branchId: 'BR-05',
    name: 'Gwalior City Centre',
    city: 'Gwalior, MP',
    totalSkus: 160,
    totalUnits: 1810,
    stockValue: '₹2,40,000',
    lowStockCount: 4,
    outOfStockCount: 0,
    expiringSoonCount: 2,
    expiredCount: 0,
    wastageThisMonth: '₹3,200',
    lastStocktakeDate: '15 Aug 2026',
    healthScore: 98,
    status: 'Optimal',
  },
];

export interface InventoryOverviewTabProps {
  onNavigateTab?: (tab: string, filter?: string) => void;
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function InventoryOverviewTab({
  onNavigateTab,
  defaultBranch = 'all',
  lockBranch = false,
}: InventoryOverviewTabProps) {
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'name' | 'value' | 'lowStock' | 'wastage' | 'expiry'>(
    'value',
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 10 KPI Cards
  const kpis = [
    {
      title: 'Total Products',
      value: '342 SKUs',
      change: '+12 new',
      isPositive: true,
      sub: '210 Retail · 132 Consumable',
      icon: Package,
      actionFilter: 'all',
    },
    {
      title: 'Total Stock Units',
      value: '14,850 Pcs',
      change: '+4.8%',
      isPositive: true,
      sub: 'Across 5 branches',
      icon: Layers,
      actionFilter: 'all',
    },
    {
      title: 'Total Stock Value',
      value: '₹28,50,000',
      change: '+6.2%',
      isPositive: true,
      sub: 'Cost Valuation (FIFO)',
      icon: TrendingUp,
      actionFilter: 'value',
    },
    {
      title: 'Low Stock Items',
      value: '42 Items',
      change: '-6 vs last wk',
      isPositive: true,
      sub: 'Below reorder threshold',
      icon: AlertTriangle,
      actionFilter: 'low-stock',
      highlightColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: 'Out of Stock',
      value: '8 Items',
      change: 'Critical',
      isPositive: false,
      sub: 'Zero stock units on shelf',
      icon: XCircle,
      actionFilter: 'out-of-stock',
      highlightColor: 'text-rose-700 bg-rose-50 border-rose-200',
    },
    {
      title: 'Expiring Soon',
      value: '18 Batches',
      change: 'Within 30 Days',
      isPositive: false,
      sub: '₹68,400 at expiry risk',
      icon: Clock,
      actionFilter: 'expiring-soon',
      highlightColor: 'text-orange-700 bg-orange-50 border-orange-200',
    },
    {
      title: 'Expired Stock',
      value: '4 Batches',
      change: 'Quarantined',
      isPositive: false,
      sub: '₹14,200 pending write-off',
      icon: ShieldAlert,
      actionFilter: 'expired',
      highlightColor: 'text-red-700 bg-red-50 border-red-200',
    },
    {
      title: 'Pending Purchase Orders',
      value: '12 Orders',
      change: '₹4.85L Value',
      isPositive: true,
      sub: '7 Approved · 5 In Transit',
      icon: RefreshCw,
      actionFilter: 'po',
    },
    {
      title: 'Pending Transfers',
      value: '6 Transfers',
      change: 'Inter-branch',
      isPositive: true,
      sub: '4 In Transit · 2 Awaiting Approval',
      icon: ArrowRight,
      actionFilter: 'transfers',
    },
    {
      title: 'Wastage This Month',
      value: '₹34,500',
      change: '1.21% of consumption',
      isPositive: true,
      sub: 'Under 2.5% SLA limit',
      icon: TrendingDown,
      actionFilter: 'wastage',
    },
  ];

  // Inventory Health Segments
  const healthSegments = [
    {
      label: 'In Stock (Healthy)',
      count: 12180,
      percentage: 82,
      color: 'bg-emerald-500',
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Low Stock',
      count: 1336,
      percentage: 9,
      color: 'bg-amber-500',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      label: 'Expiring Soon (<30d)',
      count: 594,
      percentage: 4,
      color: 'bg-orange-500',
      text: 'text-orange-700',
      bg: 'bg-orange-50',
    },
    {
      label: 'Out of Stock',
      count: 297,
      percentage: 2,
      color: 'bg-rose-500',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
    },
    {
      label: 'Quarantined / Blocked',
      count: 297,
      percentage: 2,
      color: 'bg-purple-500',
      text: 'text-purple-700',
      bg: 'bg-purple-50',
    },
    {
      label: 'Expired Stock',
      count: 148,
      percentage: 1,
      color: 'bg-red-600',
      text: 'text-red-700',
      bg: 'bg-red-50',
    },
  ];

  // Sorting Branch Stocks
  const sortedBranches = [...mockBranchStocks]
    .sort((a, b) => {
      if (sortField === 'value') {
        const valA = Number.parseInt(a.stockValue.replace(/[^0-9]/g, ''), 10);
        const valB = Number.parseInt(b.stockValue.replace(/[^0-9]/g, ''), 10);
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      if (sortField === 'lowStock') {
        return sortOrder === 'desc'
          ? b.lowStockCount - a.lowStockCount
          : a.lowStockCount - b.lowStockCount;
      }
      if (sortField === 'wastage') {
        const valA = Number.parseInt(a.wastageThisMonth.replace(/[^0-9]/g, ''), 10);
        const valB = Number.parseInt(b.wastageThisMonth.replace(/[^0-9]/g, ''), 10);
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      if (sortField === 'expiry') {
        return sortOrder === 'desc'
          ? b.expiringSoonCount - a.expiringSoonCount
          : a.expiringSoonCount - b.expiringSoonCount;
      }
      return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
    })
    .filter((b) => {
      if (selectedBranch !== 'all' && b.branchId !== selectedBranch) return false;
      if (searchTerm) {
        const matchQuery = `${b.name} ${b.city} ${b.branchId}`.toLowerCase();
        return matchQuery.includes(searchTerm.toLowerCase());
      }
      return true;
    });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Dashboard Filters Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#5A2EA6]" />
            <span className="text-xs font-bold text-ink">Dashboard Filters:</span>
          </div>

          {/* Branch Selector */}
          {!lockBranch && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Branches (5 Active)</option>
              <option value="BR-01">Indore Central Flagship</option>
              <option value="BR-02">Vijay Nagar Boutique</option>
              <option value="BR-03">Bhopal Arera Colony</option>
              <option value="BR-04">Ujjain Mahakal Road</option>
              <option value="BR-05">Gwalior City Centre</option>
            </select>
          )}

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Skin & Aesthetics">Skin &amp; Aesthetics</option>
            <option value="Colour & Chemical">Colour &amp; Chemical</option>
            <option value="Spa & Massage">Spa &amp; Massage</option>
            <option value="Nail & Waxing">Nail &amp; Waxing</option>
          </select>

          {/* Product / Consumable Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Types (Retail + Consumables)</option>
            <option value="Retail Product">Retail Products</option>
            <option value="Professional Consumable">Professional Consumables</option>
          </select>

          {/* Date Range */}
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="This Month">August 2026 (Active Month)</option>
            <option value="Last Month">July 2026</option>
            <option value="This Quarter">Q2 FY 2026-27</option>
            <option value="YTD">YTD FY26-27</option>
          </select>
        </div>

        {/* Export Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting consolidated inventory overview summary (CSV)...')}
            className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Stock Summary</span>
          </Button>
        </div>
      </div>

      {/* 2. 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                if (kpi.actionFilter === 'po' && onNavigateTab) onNavigateTab('procurement');
                else if (kpi.actionFilter === 'transfers' && onNavigateTab)
                  onNavigateTab('transfers');
                else if (kpi.actionFilter === 'wastage' && onNavigateTab)
                  onNavigateTab('consumption');
                else if (onNavigateTab) onNavigateTab('stock', kpi.actionFilter);
              }}
              className={cn(
                'bg-white rounded-2xl p-3.5 border shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer group',
                kpi.highlightColor || 'border-[#5A2EA6]/10',
              )}
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-soft uppercase tracking-wider line-clamp-1">
                  {kpi.title}
                </span>
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#5A2EA6] grid place-items-center shrink-0 group-hover:bg-[#5A2EA6] group-hover:text-white transition">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="my-1">
                <span className="text-lg font-serif font-bold text-ink block leading-tight">
                  {kpi.value}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] mt-1 pt-1.5 border-t border-line/40">
                <span
                  className={cn('font-bold', kpi.isPositive ? 'text-emerald-600' : 'text-rose-600')}
                >
                  {kpi.change}
                </span>
                <span className="text-[9px] text-muted truncate max-w-[100px]">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Section 2: Inventory Health Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Distribution Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                  <PieChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    Inventory Health &amp; Shelf Pacing
                  </h3>
                  <p className="text-[11px] text-muted">
                    Stock item distribution across shelf-life &amp; threshold states
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
                91% Healthy Pacing
              </span>
            </div>

            {/* Segmented Distribution Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex my-4 shadow-inner">
              {healthSegments.map((seg, i) => (
                <div
                  key={i}
                  style={{ width: `${seg.percentage}%` }}
                  className={cn('h-full transition-all duration-500', seg.color)}
                  title={`${seg.label}: ${seg.percentage}% (${seg.count.toLocaleString()} pcs)`}
                />
              ))}
            </div>

            {/* Health Segment Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {healthSegments.map((seg, i) => (
                <button
                  key={i}
                  onClick={() => onNavigateTab && onNavigateTab('stock', seg.label.toLowerCase())}
                  className={cn(
                    'p-2.5 rounded-xl border text-left transition hover:scale-[1.02] cursor-pointer',
                    seg.bg,
                    'border-transparent hover:border-[#5A2EA6]/30',
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cn('w-2 h-2 rounded-full shrink-0', seg.color)} />
                    <span className="text-[10px] font-bold text-slate-800 truncate block">
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <strong className={cn('text-xs font-bold font-serif', seg.text)}>
                      {seg.count.toLocaleString()} pcs
                    </strong>
                    <span className="text-[10px] font-extrabold text-soft">{seg.percentage}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-line/40 flex items-center justify-between text-[11px] text-soft">
            <span>
              Critical Reorder Trigger: <strong>42 SKUs Below Minimum</strong>
            </span>
            <span
              className="text-[#5A2EA6] font-bold cursor-pointer hover:underline"
              onClick={() => onNavigateTab && onNavigateTab('procurement')}
            >
              Generate POs &rarr;
            </span>
          </div>
        </div>

        {/* Fast Action Guidance & Risk Box */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-ink text-base">
                  Key Head Office Inventory Directives
                </h3>
                <p className="text-[11px] text-muted">
                  Automated threshold triggers and branch compliance alerts
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-rose-900 font-bold block">
                    8 Critical Stockouts in High-Demand Services
                  </strong>
                  <p className="text-rose-700 text-[11px] mt-0.5 leading-relaxed">
                    L&apos;Oréal Dia Richesse 6.13 and Keratin Smooth Cream are stock-out in Vijay
                    Nagar and Ujjain branches.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-900 font-bold block">
                    18 Consumable Batches Expiring in Next 30 Days
                  </strong>
                  <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                    Total value of ₹68,400. Pacing suggestion: Trigger inter-branch transfer to
                    high-volume Indore Flagship.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5A2EA6] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-ink font-bold block">
                    Monthly Physical Stocktake Reconciliation
                  </strong>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    5 of 5 branches have completed cycle counts. Overall variance stands at{' '}
                    <strong>-0.42%</strong>, well within compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-soft">
            <span>
              Automated Daily Sync: <strong>05:00 AM IST</strong>
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> System Audited
            </span>
          </div>
        </div>
      </div>

      {/* 4. Section 3: Branch-Wise Stock Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        {/* Table Header & Search Controls */}
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Multi-Branch Inventory &amp; Stock Health Comparison
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                {sortedBranches.length} Branches
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Ranked comparison of stock units, valuation, threshold breaches, expiring batches, and
              monthly wastage
            </p>
          </div>

          {/* Search + Quick Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6] w-48"
              />
            </div>

            <div className="flex items-center gap-1 bg-white border border-[#5A2EA6]/20 p-1 rounded-xl text-xs">
              <span className="text-[10px] font-bold text-soft px-1.5">Sort:</span>
              <button
                onClick={() => handleSort('value')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border-0 text-[11px]',
                  sortField === 'value'
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'text-soft hover:text-ink',
                )}
              >
                Stock Value
              </button>
              <button
                onClick={() => handleSort('lowStock')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border-0 text-[11px]',
                  sortField === 'lowStock'
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'text-soft hover:text-ink',
                )}
              >
                Low Stock
              </button>
              <button
                onClick={() => handleSort('wastage')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border-0 text-[11px]',
                  sortField === 'wastage'
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'text-soft hover:text-ink',
                )}
              >
                Wastage
              </button>
              <button
                onClick={() => handleSort('expiry')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border-0 text-[11px]',
                  sortField === 'expiry'
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'text-soft hover:text-ink',
                )}
              >
                Expiry Risk
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Branch Location</th>
                <th className="p-3.5 text-center">Total SKUs</th>
                <th className="p-3.5 text-right">Stock Units</th>
                <th className="p-3.5 text-right">Stock Value</th>
                <th className="p-3.5 text-center">Low Stock</th>
                <th className="p-3.5 text-center">Out of Stock</th>
                <th className="p-3.5 text-center">Expiring Soon</th>
                <th className="p-3.5 text-center">Expired</th>
                <th className="p-3.5 text-right">Wastage</th>
                <th className="p-3.5">Last Stocktake</th>
                <th className="p-3.5 text-center">Health Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {sortedBranches.map((b) => (
                <tr key={b.branchId} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Branch Name */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{b.name}</strong>
                    <span className="text-[10px] text-muted">
                      {b.city} · {b.branchId}
                    </span>
                  </td>

                  {/* SKUs */}
                  <td className="p-3.5 text-center font-semibold text-slate-800 whitespace-nowrap">
                    {b.totalSkus} SKUs
                  </td>

                  {/* Units */}
                  <td className="p-3.5 text-right font-bold text-ink whitespace-nowrap">
                    {b.totalUnits.toLocaleString()} pcs
                  </td>

                  {/* Value */}
                  <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                    {b.stockValue}
                  </td>

                  {/* Low Stock */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    {b.lowStockCount > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                        {b.lowStockCount} items
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  {/* Out of Stock */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    {b.outOfStockCount > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 whitespace-nowrap font-mono">
                        {b.outOfStockCount}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">0</span>
                    )}
                  </td>

                  {/* Expiring Soon */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    {b.expiringSoonCount > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 whitespace-nowrap">
                        {b.expiringSoonCount} batches
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  {/* Expired */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    {b.expiredCount > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-900 border border-red-300 whitespace-nowrap">
                        {b.expiredCount}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">0</span>
                    )}
                  </td>

                  {/* Wastage */}
                  <td className="p-3.5 text-right font-semibold text-rose-700 whitespace-nowrap">
                    {b.wastageThisMonth}
                  </td>

                  {/* Stocktake Date */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="text-slate-800 font-medium block text-xs">
                      {b.lastStocktakeDate}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        b.status === 'Optimal'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : b.status === 'Attention Required'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200',
                      )}
                    >
                      {b.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => onNavigateTab && onNavigateTab('stock', b.branchId)}
                      className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 inline-flex"
                    >
                      <Eye className="w-3 h-3 text-[#5A2EA6]" />
                      <span>View Branch Inventory</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total Row */}
            <tfoot className="bg-[#F8F5FF] border-t-2 border-[#5A2EA6]/20 font-bold text-xs text-ink">
              <tr className="whitespace-nowrap">
                <td className="p-3.5 pl-5 uppercase tracking-wider text-[#5A2EA6]">
                  Consolidated Network Total (5 Branches)
                </td>
                <td className="p-3.5 text-center">342 SKUs</td>
                <td className="p-3.5 text-right">14,850 pcs</td>
                <td className="p-3.5 text-right font-extrabold text-[#5A2EA6]">₹28,50,000</td>
                <td className="p-3.5 text-center text-amber-800">42 items</td>
                <td className="p-3.5 text-center text-rose-700">8 items</td>
                <td className="p-3.5 text-center text-orange-800">18 batches</td>
                <td className="p-3.5 text-center text-red-800">4 batches</td>
                <td className="p-3.5 text-right text-rose-700">₹34,500</td>
                <td className="p-3.5 text-soft" colSpan={3}>
                  100% Branches Audited (Cycle Count)
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
