import { useToast } from '@salon-spa-saas/ui';
import {
  BarChart3,
  Building,
  Building2,
  Calendar,
  ClipboardCheck,
  Clock,
  DollarSign,
  Download,
  FileText,
  Flame,
  Globe,
  MapPin,
  Search,
  Sparkles,
  TrendingDown,
  Truck,
} from 'lucide-react';
import React, { useState } from 'react';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export function ReportsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'valuation' | 'procurement' | 'consumption' | 'audit'
  >('all');
  const [dateRange, setDateRange] = useState<'This Month' | 'This Quarter' | 'Financial Year 2026'>(
    'This Month',
  );
  const [searchQuery, setSearchQuery] = useState('');

  // All 9 Reports requested by user
  const reports = [
    {
      id: 'REP-01',
      title: 'Inventory Valuation Report',
      category: 'valuation',
      desc: 'Audit-ready asset valuation per product category, FIFO batch cost breakdown, and total warehouse balance sheet valuation.',
      metrics: isAllBranches
        ? 'Total Network Value: ₹48,92,400 • 420 SKUs Across 5 Outlets'
        : `${selectedBranch.shortName} Valuation: ${selectedBranch.valuation} • ${selectedBranch.skusCount} SKUs`,
      icon: DollarSign,
    },
    {
      id: 'REP-02',
      title: 'Purchase Summary Report',
      category: 'procurement',
      desc: 'Periodical purchase order spending, fulfilled shipments, vendor invoice totals, and total GST input credit paid.',
      metrics: isAllBranches
        ? 'Monthly Chain Spend: ₹18,40,000 • 96 POs'
        : `Branch Spend: ${selectedBranch.purchasesToday} Today • 24 POs`,
      icon: FileText,
    },
    {
      id: 'REP-03',
      title: 'Supplier Summary & SLA Report',
      category: 'procurement',
      desc: 'Distributor performance scoring, on-time delivery rates (%), average lead times, and spending breakdown per vendor.',
      metrics: 'Avg SLA: 96.8% • 4 Active Contracted Vendors',
      icon: Truck,
    },
    {
      id: 'REP-04',
      title: 'Service Consumption Report (BOM)',
      category: 'consumption',
      desc: 'Service recipe auto-deductions, manual station usage, standard vs actual material consumption, and recipe variance.',
      metrics: isAllBranches
        ? 'Total Consumed: ₹58,400 Today • 24L Volume'
        : `${selectedBranch.shortName} Consumed: ${selectedBranch.consumptionToday} Today`,
      icon: BarChart3,
    },
    {
      id: 'REP-05',
      title: 'Expiry Report & FIFO Analysis',
      category: 'valuation',
      desc: 'Batch expiry schedule (<30d, <60d, <90d), dormant inventory risk analysis, and written-off expired losses.',
      metrics: isAllBranches
        ? 'Expiring Soon: 8 Batches • ₹24,600 Value'
        : `${selectedBranch.shortName} Expiring: ${selectedBranch.expiringCount} Batches`,
      icon: Clock,
    },
    {
      id: 'REP-06',
      title: 'Stock Movement & Inter-Branch Transfer Manifest',
      category: 'audit',
      desc: 'Inter-branch stock transfer dispatch/receipt logs, transport transit history, and cross-branch stock allocations.',
      metrics: isAllBranches
        ? 'Transfers Dispatched: 14 • 4 In-Transit'
        : `${selectedBranch.shortName} Transfers: ${selectedBranch.transfersCount} In-Transit`,
      icon: Building,
    },
    {
      id: 'REP-07',
      title: 'Stock Adjustment & Audit Report',
      category: 'audit',
      desc: 'Physical stocktake audit variances, count corrections, shrinkage analysis, and manager sign-off logs.',
      metrics: 'Audits Completed: 6 Sessions • 0.02% Net Variance',
      icon: ClipboardCheck,
    },
    {
      id: 'REP-08',
      title: 'Multi-Branch Comparative Stock Health',
      category: 'valuation',
      desc: 'Cross-branch stock balance comparison across Mumbai, Delhi, Bangalore, Hyderabad, and Central Hub.',
      metrics: 'Active Outlets: 5 Outlets + Central Logistics Hub',
      icon: Building2,
    },
    {
      id: 'REP-09',
      title: 'Wastage & Spillage Analysis Report',
      category: 'consumption',
      desc: 'Material spillage, container damage, breakage, leakage, and vendor quality defect financial loss analysis.',
      metrics: isAllBranches
        ? 'Total Wastage: ₹3,420 (1.7% Target <2%)'
        : `${selectedBranch.shortName} Wastage: ${selectedBranch.wastageToday} (${selectedBranch.wastagePct})`,
      icon: Flame,
    },
  ];

  const filteredReports = reports.filter((r) => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Inventory Reports & Valuation Analytics
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Consolidated Chain Reports' : `${selectedBranch.shortName} Reports`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Generate and export 9 analytical audit-ready reports across valuation, procurement,
            service consumption, and multi-branch movement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-pine/10 p-1 rounded-xl">
            {(['This Month', 'This Quarter', 'Financial Year 2026'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  dateRange === d ? 'bg-white text-ink shadow-sm' : 'text-soft hover:text-ink'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY SUB-TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All 9 Reports', count: reports.length },
          {
            id: 'valuation',
            label: 'Valuation & Inventory',
            count: reports.filter((r) => r.category === 'valuation').length,
          },
          {
            id: 'procurement',
            label: 'Procurement & Suppliers',
            count: reports.filter((r) => r.category === 'procurement').length,
          },
          {
            id: 'consumption',
            label: 'Consumption & Wastage',
            count: reports.filter((r) => r.category === 'consumption').length,
          },
          {
            id: 'audit',
            label: 'Audit & Movements',
            count: reports.filter((r) => r.category === 'audit').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {tab.label}{' '}
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search reports by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* 9 REPORT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-line pb-2">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {r.id}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-ink">{r.title}</h3>
                  <p className="text-xs text-soft mt-1 leading-relaxed">{r.desc}</p>
                </div>

                <div className="p-3 bg-pine/5 rounded-xl border border-line text-xs font-semibold text-purple-900">
                  {r.metrics}
                </div>
              </div>

              <button
                onClick={() =>
                  toast(
                    `Export Report: Generated ${r.title} (${selectedBranch.shortName} • ${dateRange}) CSV.`,
                  )
                }
                className="w-full py-2 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-purple-600" />
                Download {r.title} (CSV)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
