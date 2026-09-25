import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Flame,
  Globe,
  Layers,
  MapPin,
  PackageCheck,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShoppingCart,
  Shuffle,
  Sparkles,
  TrendingDown,
  Truck,
} from 'lucide-react';
import React, { useState } from 'react';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export function DashboardPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  // Chart Filters State
  const [valueTimeframe, setValueTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
  const [purchaseFilter, setPurchaseFilter] = useState<
    'Last 30 Days' | 'Monthly Purchases' | 'Supplier-wise'
  >('Last 30 Days');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'branch-matrix' | 'rebalancing'>(
    'overview',
  );

  // Inter-Branch Rebalancing Opportunities (AI / Rule Based)
  const [rebalancingSuggestions, setRebalancingSuggestions] = useState([
    {
      id: 'REBAL-01',
      product: 'Kérastase Nutritive Mask (500ml)',
      sku: 'KER-NUT-500',
      fromBranch: 'South Extension II (Delhi)',
      fromBranchId: 'delhi',
      fromStock: 18,
      toBranch: 'Bandra West Flagship (Mumbai)',
      toBranchId: 'mumbai',
      toStock: 2,
      recommendedQty: 6,
      urgency: 'High Urgency',
      reason: 'Mumbai weekend rush expected; Delhi has 45+ days surplus',
    },
    {
      id: 'REBAL-02',
      product: 'Olaplex No. 1 Bond Multiplier (525ml)',
      sku: 'OLA-NO1-525',
      fromBranch: 'Central Logistics Hub (Bhiwandi)',
      fromBranchId: 'central-hub',
      fromStock: 24,
      toBranch: 'Indiranagar Atelier (Bangalore)',
      toBranchId: 'bangalore',
      toStock: 1,
      recommendedQty: 4,
      urgency: 'Medium Urgency',
      reason: 'Reorder lead time from vendor is 6 days; hub transit takes 24h',
    },
    {
      id: 'REBAL-03',
      product: 'L’Oréal Majirel Color Cream 6.13',
      sku: 'LOR-MAJ-613',
      fromBranch: 'South Extension II (Delhi)',
      fromBranchId: 'delhi',
      fromStock: 35,
      toBranch: 'Jubilee Hills Suite (Hyderabad)',
      toBranchId: 'hyderabad',
      toStock: 3,
      recommendedQty: 10,
      urgency: 'Normal',
      reason: 'Stock balancing to prevent local stockout before festive booking',
    },
  ]);

  // Reorder Alerts & Stock Items Queue with Location Tags
  const [reorderQueue, setReorderQueue] = useState([
    {
      id: 'SKU-801',
      name: 'L’Oréal Developer 20Vol (1000ml)',
      branchName: 'Bandra West (Mumbai)',
      branchId: 'mumbai',
      currentStock: '4 Bottles',
      minLevel: '10 Bottles',
      category: 'Developer',
      supplier: 'L’Oréal India Ltd',
      status: 'Critical Low',
      surplusBranch: 'Delhi South Ex (16 available)',
    },
    {
      id: 'SKU-802',
      name: 'Kérastase Nutritive Mask (500ml)',
      branchName: 'Bandra West (Mumbai)',
      branchId: 'mumbai',
      currentStock: '2 Tubs',
      minLevel: '5 Tubs',
      category: 'Conditioner',
      supplier: 'Luxury Beauty Dist.',
      status: 'Low Stock',
      surplusBranch: 'Delhi South Ex (18 available)',
    },
    {
      id: 'SKU-803',
      name: 'Olaplex No. 1 Bond Multiplier (525ml)',
      branchName: 'Indiranagar (Bangalore)',
      branchId: 'bangalore',
      currentStock: '1 Bottle',
      minLevel: '4 Bottles',
      category: 'Hair Color',
      supplier: 'Olaplex India',
      status: 'Critical Low',
      surplusBranch: 'Central Hub (24 available)',
    },
    {
      id: 'SKU-804',
      name: 'Moroccanoil Treatment 100ml',
      branchName: 'Jubilee Hills (Hyderabad)',
      branchId: 'hyderabad',
      currentStock: '3 Bottles',
      minLevel: '8 Bottles',
      category: 'Retail Serum',
      supplier: 'Moroccanoil India Ltd',
      status: 'Low Stock',
      surplusBranch: 'Mumbai Flagship (14 available)',
    },
  ]);

  const handleCreatePO = (productName: string, branchName: string) => {
    toast(`Purchase Order Created: PO requisition generated for ${productName} (${branchName}).`);
  };

  const handleExecuteTransfer = (suggestion: (typeof rebalancingSuggestions)[0]) => {
    toast(
      `Inter-Branch Transfer Initiated: Dispatching ${suggestion.recommendedQty} units of ${suggestion.product} from ${suggestion.fromBranch} to ${suggestion.toBranch}.`,
    );
    setRebalancingSuggestions((prev) => prev.filter((item) => item.id !== suggestion.id));
  };

  // Filtered reorder queue based on branch selection
  const visibleReorderQueue = isAllBranches
    ? reorderQueue
    : reorderQueue.filter((item) => item.branchId === selectedBranchId);

  return (
    <div className="space-y-6">
      {/* TOP HEADER WITH SCOPE & ROLE INDICATORS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Inventory & Procurement Hub
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches
                ? 'Enterprise Chain Network (5 Branches)'
                : `Branch: ${selectedBranch.shortName}`}
            </span>
            <span className="text-[10px] font-semibold bg-pine/10 text-ink/75 px-2 py-0.5 rounded-full">
              Perspective: {userRole}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Consolidated multi-branch stock valuation, inter-branch balancing, centralized PO approvals, and supply chain health.'
              : `Active Store Ledger for ${selectedBranch.name} · Local GRN inwarding, service recipe consumption, and physical shelf stock.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Branch Scope Pills if in Multi-Branch mode */}
          {!isAllBranches && (
            <button
              onClick={() => setSelectedBranchId('all')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              View All Branches
            </button>
          )}

          <button
            onClick={() =>
              toast(`Export Valuation: ${selectedBranch.name} valuation report exported as CSV.`)
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Valuation
          </button>
        </div>
      </div>

      {/* ATTENTION FOCUS BANNER */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-purple-900/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            {isAllBranches
              ? 'Enterprise Multi-Branch Operations Focus'
              : `Daily Floor Focus · ${selectedBranch.shortName}`}
          </div>
          <h2 className="text-lg font-bold text-white">
            {isAllBranches
              ? 'What multi-location inventory requires attention today?'
              : `What inventory requires attention at ${selectedBranch.shortName}?`}
          </h2>
          <p className="text-xs text-purple-200/90 leading-relaxed">
            {isAllBranches ? (
              <>
                <span className="font-semibold text-white">14 Low Stock SKUs</span> across 5
                branches,{' '}
                <span className="font-semibold text-amber-300">8 Batches expiring &lt;30 days</span>
                ,{' '}
                <span className="font-semibold text-teal-300">
                  4 Inter-Branch Transfers In-Transit
                </span>
                , and{' '}
                <span className="font-semibold text-emerald-300">
                  3 Smart Rebalancing Opportunities
                </span>{' '}
                ready to execute.
              </>
            ) : (
              <>
                <span className="font-semibold text-white">
                  {selectedBranch.lowStockCount} Low Stock SKUs
                </span>{' '}
                ({selectedBranch.criticalLowCount} critical),{' '}
                <span className="font-semibold text-amber-300">
                  {selectedBranch.expiringCount} Batches expiring soon
                </span>
                , and{' '}
                <span className="font-semibold text-teal-300">
                  {selectedBranch.transfersCount} In-Transit Transfer
                </span>{' '}
                arriving.
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {isAllBranches && (
            <button
              onClick={() => setDashboardTab('rebalancing')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer border-0 flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Smart Rebalancing ({rebalancingSuggestions.length})
            </button>
          )}

          <button
            onClick={() =>
              toast(
                `Auto-Reorder: Bulk purchase orders generated for all low-stock items in ${selectedBranch.name}.`,
              )
            }
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer border-0 flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Auto-Reorder Low Stock
          </button>
        </div>
      </div>

      {/* 8 DYNAMIC KPI CARDS (Consolidated or Branch-Specific) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Stock Valuation */}
        <div className="bg-white p-3.5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="text-[10px] font-bold uppercase text-soft truncate">
            {isAllBranches ? 'Network Stock Value' : 'Branch Stock Value'}
          </div>
          <div className="text-base font-bold text-ink truncate">{selectedBranch.valuation}</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +4.8% MoM
          </div>
        </div>

        {/* 2. Low Stock SKUs */}
        <div className="bg-white p-3.5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="text-[10px] font-bold uppercase text-amber-700 truncate">
            Low Stock SKUs
          </div>
          <div className="text-base font-bold text-amber-600">
            {selectedBranch.lowStockCount} SKUs
          </div>
          <div className="text-[10px] text-amber-800 font-semibold">
            {selectedBranch.criticalLowCount} Critical
          </div>
        </div>

        {/* 3. Expiring Lots */}
        <div className="bg-white p-3.5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="text-[10px] font-bold uppercase text-rose-700 truncate">
            Expiring Batches
          </div>
          <div className="text-base font-bold text-rose-600">
            {selectedBranch.expiringCount} Lots
          </div>
          <div className="text-[10px] text-rose-700 font-semibold">&lt;30d FIFO</div>
        </div>

        {/* 4. Active SKUs */}
        <div className="bg-white p-3.5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="text-[10px] font-bold uppercase text-purple-700 truncate">
            Active SKUs
          </div>
          <div className="text-base font-bold text-purple-900">{selectedBranch.skusCount} SKUs</div>
          <div className="text-[10px] text-soft">Catalog Active</div>
        </div>

        {/* 5. Today's Service Consumption */}
        <div className="bg-white p-3.5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="text-[10px] font-bold uppercase text-indigo-700 truncate">
            Consumption Today
          </div>
          <div className="text-base font-bold text-indigo-900">
            {selectedBranch.consumptionToday}
          </div>
          <div className="text-[10px] text-soft">BOM Deducted</div>
        </div>

        {/* 6. Today's Purchases / GRN */}
        <div className="bg-white p-3.5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="text-[10px] font-bold uppercase text-blue-700 truncate">
            Purchases Today
          </div>
          <div className="text-base font-bold text-blue-700">{selectedBranch.purchasesToday}</div>
          <div className="text-[10px] text-blue-600 font-semibold">GRN Inwarded</div>
        </div>

        {/* 7. Inter-Branch Transfers */}
        <div className="bg-white p-3.5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="text-[10px] font-bold uppercase text-teal-700 truncate">
            Stock Transfers
          </div>
          <div className="text-base font-bold text-teal-700">
            {selectedBranch.transfersCount} In-Transit
          </div>
          <div className="text-[10px] text-soft">Sealed Shipments</div>
        </div>

        {/* 8. Wastage / Spillage */}
        <div className="bg-white p-3.5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="text-[10px] font-bold uppercase text-rose-700 truncate">
            Wastage / Loss
          </div>
          <div className="text-base font-bold text-rose-600">{selectedBranch.wastageToday}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">
            {selectedBranch.wastagePct} (Target &lt;2%)
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB SELECTOR */}
      {isAllBranches && (
        <div className="flex border-b border-line gap-2">
          <button
            onClick={() => setDashboardTab('overview')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              dashboardTab === 'overview'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-soft hover:text-ink'
            }`}
          >
            Network Analytics & Trends
          </button>
          <button
            onClick={() => setDashboardTab('branch-matrix')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              dashboardTab === 'branch-matrix'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-soft hover:text-ink'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-700" />
            Multi-Branch Stock Matrix (5 Outlets)
          </button>
          <button
            onClick={() => setDashboardTab('rebalancing')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              dashboardTab === 'rebalancing'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-soft hover:text-ink'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-700" />
            Smart Inter-Branch Rebalancing
            <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded-full">
              {rebalancingSuggestions.length} Ready
            </span>
          </button>
        </div>
      )}

      {/* VIEW 1: MULTI-BRANCH STOCK DISTRIBUTION MATRIX (Only in All Branches Mode when tab selected) */}
      {isAllBranches && dashboardTab === 'branch-matrix' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-700" />
                Multi-Branch Stock Distribution & Health Matrix
              </h2>
              <p className="text-xs text-soft">
                Real-time inventory valuation, stockout risks, and active movement across all brand
                outlets
              </p>
            </div>
            <button
              onClick={() =>
                toast('Stock Rebalance Manifest: Generating multi-outlet replenishment orders.')
              }
              className="px-3 py-1.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer border-0"
            >
              Generate Chain Replenishment POs
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line/60 bg-pine/5 text-soft uppercase tracking-wider font-semibold">
                  <th className="p-3">Branch Location & Type</th>
                  <th className="p-3">Stock Valuation</th>
                  <th className="p-3">SKU Count</th>
                  <th className="p-3">Low Stock Status</th>
                  <th className="p-3">Expiring &lt;30d</th>
                  <th className="p-3">In-Transit</th>
                  <th className="p-3">Store Lead</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {branches
                  .filter((b) => b.id !== 'all')
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-ink flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          {b.name}
                        </div>
                        <div className="text-[11px] text-soft">
                          {b.city} • <span className="text-purple-800 font-semibold">{b.type}</span>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-ink">{b.valuation}</td>
                      <td className="p-3 text-soft font-semibold">{b.skusCount} SKUs</td>
                      <td className="p-3">
                        {b.lowStockCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {b.lowStockCount} Low ({b.criticalLowCount} Critical)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {b.expiringCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            {b.expiringCount} Batches
                          </span>
                        ) : (
                          <span className="text-soft">0</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-teal-700 font-semibold">
                          {b.transfersCount} Transfers
                        </span>
                      </td>
                      <td className="p-3 text-soft">{b.manager}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedBranchId(b.id);
                            setDashboardTab('overview');
                            toast(`Switched context to ${b.name}`);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                        >
                          View Ledger →
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: SMART INTER-BRANCH REBALANCING OPPORTUNITIES */}
      {isAllBranches && dashboardTab === 'rebalancing' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-indigo-700" />
                Intelligent Inter-Branch Stock Rebalancing
              </h2>
              <p className="text-xs text-soft">
                Resolve local stockouts by moving surplus inventory between sister branches without
                new supplier procurement spend
              </p>
            </div>
            <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl">
              Potential Savings: ₹42,800
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rebalancingSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-4 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                    {sug.urgency}
                  </span>
                  <span className="text-[10px] font-bold text-soft">{sug.sku}</span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-ink">{sug.product}</h3>
                  <p className="text-[10.5px] text-soft mt-1 leading-snug">{sug.reason}</p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-line/60 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-soft">Source (Surplus):</span>
                    <span className="font-bold text-emerald-700">
                      {sug.fromBranch} ({sug.fromStock} on hand)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-soft">Destination (Deficit):</span>
                    <span className="font-bold text-rose-700">
                      {sug.toBranch} ({sug.toStock} on hand)
                    </span>
                  </div>
                  <div className="pt-1 border-t border-line/40 flex justify-between items-center text-xs font-bold text-purple-950">
                    <span>Recommended Transfer:</span>
                    <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md">
                      {sug.recommendedQty} Units
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleExecuteTransfer(sug)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Approve & Dispatch Transfer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OVERVIEW CHARTS SECTION */}
      {(!isAllBranches || dashboardTab === 'overview') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1: Inventory Value (Daily / Weekly / Monthly) */}
          <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink">Inventory Value Trend</h3>
                <p className="text-[11px] text-soft">
                  {isAllBranches
                    ? 'Total network asset valuation'
                    : `${selectedBranch.shortName} stock value`}
                </p>
              </div>
              <div className="flex bg-pine/10 p-0.5 rounded-lg">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setValueTimeframe(v)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md capitalize transition-all cursor-pointer ${
                      valueTimeframe === v
                        ? 'bg-white text-ink shadow-xs'
                        : 'text-soft hover:text-ink'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-line/60">
              {[
                { label: 'Week 1', height: '65%', val: isAllBranches ? '₹44.2L' : '₹11.2L' },
                { label: 'Week 2', height: '78%', val: isAllBranches ? '₹46.5L' : '₹11.8L' },
                { label: 'Week 3', height: '85%', val: isAllBranches ? '₹47.8L' : '₹12.1L' },
                { label: 'Week 4', height: '95%', val: isAllBranches ? '₹48.9L' : '₹12.45L' },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9.5px] font-bold text-purple-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.val}
                  </span>
                  <div
                    style={{ height: bar.height }}
                    className="w-full bg-gradient-to-t from-[#5A2EA6] to-purple-400 rounded-t-lg group-hover:brightness-110 transition-all"
                  />
                  <span className="text-[10px] text-soft font-medium mt-1">{bar.label}</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-soft text-center font-medium">
              Filtered Scope:{' '}
              <span className="font-bold text-purple-700">
                {selectedBranch.shortName} · {valueTimeframe} Ledger
              </span>
            </div>
          </div>

          {/* Chart 2: Product Consumption Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink">Service Recipe Consumption</h3>
              <p className="text-[11px] text-soft">Category consumption across active treatments</p>
            </div>

            <div className="space-y-2 text-xs">
              {[
                {
                  category: 'Hair Color (Majirel / Igora)',
                  pct: '38%',
                  color: 'bg-purple-600',
                  val: isAllBranches ? '₹22,100' : '₹5,400',
                },
                {
                  category: 'Oxidant Developers',
                  pct: '24%',
                  color: 'bg-indigo-500',
                  val: isAllBranches ? '₹14,000' : '₹3,400',
                },
                {
                  category: 'Backwash Shampoos',
                  pct: '15%',
                  color: 'bg-blue-500',
                  val: isAllBranches ? '₹8,700' : '₹2,100',
                },
                {
                  category: 'Conditioners & Masques',
                  pct: '11%',
                  color: 'bg-emerald-500',
                  val: isAllBranches ? '₹6,400' : '₹1,560',
                },
                {
                  category: 'Facial & Skin Aesthetics',
                  pct: '8%',
                  color: 'bg-amber-500',
                  val: isAllBranches ? '₹4,600' : '₹1,140',
                },
                {
                  category: 'Spa Massage Oils',
                  pct: '4%',
                  color: 'bg-rose-500',
                  val: isAllBranches ? '₹2,600' : '₹600',
                },
              ].map((c) => (
                <div key={c.category} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-ink">{c.category}</span>
                    <span className="text-soft">
                      {c.val} ({c.pct})
                    </span>
                  </div>
                  <div className="w-full bg-pine/10 h-2 rounded-full overflow-hidden">
                    <div style={{ width: c.pct }} className={`${c.color} h-full rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Purchase Trend & Spend */}
          <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink">Procurement & Orders</h3>
                <p className="text-[11px] text-soft">Supplier order fulfillment SLA & spend</p>
              </div>
            </div>

            <div className="flex bg-pine/10 p-0.5 rounded-lg w-full">
              {(['Last 30 Days', 'Monthly Purchases', 'Supplier-wise'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPurchaseFilter(p)}
                  className={`flex-1 py-1 text-[9.5px] font-bold rounded-md transition-all cursor-pointer ${
                    purchaseFilter === p
                      ? 'bg-white text-ink shadow-xs'
                      : 'text-soft hover:text-ink'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {purchaseFilter === 'Supplier-wise' ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-purple-50 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-purple-900">L’Oréal India Ltd</div>
                      <div className="text-[10px] text-soft">14 Orders • 98.5% SLA</div>
                    </div>
                    <div className="font-bold text-purple-900">₹2,45,000</div>
                  </div>
                  <div className="p-2.5 bg-indigo-50 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-indigo-900">Luxury Beauty Dist.</div>
                      <div className="text-[10px] text-soft">8 Orders • 94.2% SLA</div>
                    </div>
                    <div className="font-bold text-indigo-900">₹1,80,000</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-pine/5 rounded-2xl border border-line space-y-2 text-center">
                  <div className="text-xs text-soft font-medium">
                    Total Orders Fulfilled ({purchaseFilter})
                  </div>
                  <div className="text-2xl font-bold text-ink">
                    {isAllBranches ? '96 Purchase Orders' : '24 Purchase Orders'}
                  </div>
                  <div className="text-xs text-emerald-700 font-bold">
                    {isAllBranches
                      ? '₹18,40,000 Chain Procurement Spend'
                      : '₹4,25,000 Branch Spend'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REORDER & LOW STOCK QUEUE (WITH BRANCH & SURPLUS MAPPING) */}
      <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {isAllBranches
                ? 'Urgent Network Reorder & Low Stock Queue'
                : `Urgent Reorder Queue · ${selectedBranch.shortName}`}
            </h2>
            <p className="text-xs text-soft">
              SKUs below minimum safety threshold with available sister-branch surplus
              recommendations
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            Showing {visibleReorderQueue.length} items requiring action
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line/60 bg-pine/5 text-soft uppercase tracking-wider font-semibold">
                <th className="p-3">Product SKU</th>
                {isAllBranches && <th className="p-3">Affected Branch</th>}
                <th className="p-3">Category</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Sister Branch Surplus</th>
                <th className="p-3">Primary Supplier</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {visibleReorderQueue.map((item) => (
                <tr key={item.id} className="hover:bg-purple-50/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-ink">{item.name}</div>
                    <div className="text-[11px] text-soft">
                      {item.id} • Min: {item.minLevel}
                    </div>
                  </td>

                  {isAllBranches && (
                    <td className="p-3 font-semibold text-purple-900">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-700" />
                        {item.branchName}
                      </div>
                    </td>
                  )}

                  <td className="p-3 text-soft font-medium">{item.category}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Critical Low'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.currentStock}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                      {item.surplusBranch}
                    </span>
                  </td>

                  <td className="p-3 text-soft">{item.supplier}</td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() =>
                          toast(
                            `Transfer Requested: Requested transfer from ${item.surplusBranch} to ${item.branchName}.`,
                          )
                        }
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl text-[11px] font-bold border border-indigo-200 transition-all cursor-pointer"
                        title="Request stock from sister branch"
                      >
                        Transfer Stock
                      </button>
                      <button
                        onClick={() => handleCreatePO(item.name, item.branchName)}
                        className="px-3 py-1 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-[11px] font-semibold shadow-sm transition-all cursor-pointer border-0"
                      >
                        Create PO
                      </button>
                    </div>
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
