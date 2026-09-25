import { useToast } from '@salon-spa-saas/ui';
import {
  ArrowUpRight,
  BarChart3,
  Box,
  Building2,
  Coins,
  DollarSign,
  Download,
  Globe,
  MapPin,
  Percent,
  PieChart,
  RotateCcw,
  Scissors,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import React from 'react';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function ProfitabilityPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  // ALL 6 PRD REQUIRED KPI CARDS DYNAMICALLY SCOPED
  const kpiCards = [
    {
      label: 'Gross Revenue',
      value: isAllBranches ? '₹68,40,000.00' : selectedBranch.todayRevenue,
      pct: '↑ 16.4% YoY',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      color: 'text-emerald-700',
    },
    {
      label: 'Operating Expenses (OpEx)',
      value: isAllBranches ? '₹39,80,000.00' : '₹28,400.00',
      pct: '58.1% Exp Ratio',
      icon: <PieChart className="w-5 h-5 text-rose-600" />,
      color: 'text-rose-700',
    },
    {
      label: 'Payroll & Staff Cost',
      value: selectedBranch.monthlyPayrollTotal,
      pct: '36.8% Revenue Share',
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      color: 'text-indigo-900',
    },
    {
      label: 'Backbar & Inventory COGS',
      value: isAllBranches ? '₹5,20,000.00' : '₹6,400.00',
      pct: '7.6% COGS Share',
      icon: <Box className="w-5 h-5 text-amber-600" />,
      color: 'text-amber-800',
    },
    {
      label: 'Refunds & Voids',
      value: selectedBranch.todayRefunds,
      pct: '0.02% Low Return Rate',
      icon: <RotateCcw className="w-5 h-5 text-rose-500" />,
      color: 'text-rose-600',
    },
    {
      label: 'EBITDA Net Profit Margin',
      value: selectedBranch.grossProfitMargin,
      pct: 'Target >30% Met',
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      color: 'text-purple-950',
    },
  ];

  // BRANCH PROFIT MARGINS COMPARISON WITH BRANCH ID TAGS
  const branchProfitMargins = [
    {
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      code: 'BOM-BD01',
      rev: '₹24,50,000',
      exp: '₹15,48,000',
      profit: '₹9,02,000',
      margin: '36.8%',
    },
    {
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      code: 'DEL-SX02',
      rev: '₹20,10,000',
      exp: '₹13,36,000',
      profit: '₹6,74,000',
      margin: '33.5%',
    },
    {
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      code: 'BLR-IN03',
      rev: '₹14,80,000',
      exp: '₹9,60,000',
      profit: '₹5,20,000',
      margin: '35.1%',
    },
    {
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      code: 'HYD-JH04',
      rev: '₹9,00,000',
      exp: '₹6,17,000',
      profit: '₹2,83,000',
      margin: '31.4%',
    },
  ];

  // DEPARTMENT PROFITABILITY
  const departmentProfitability = [
    {
      dept: 'Hair Care & Coloring',
      rev: isAllBranches ? '₹28,50,000' : '₹12,40,000',
      exp: isAllBranches ? '₹15,20,000' : '₹6,20,000',
      profit: isAllBranches ? '₹13,30,000' : '₹6,20,000',
      share: '46.7%',
    },
    {
      dept: 'Skin & Aesthetics',
      rev: isAllBranches ? '₹18,20,000' : '₹8,10,000',
      exp: isAllBranches ? '₹9,80,000' : '₹4,10,000',
      profit: isAllBranches ? '₹8,40,000' : '₹4,00,000',
      share: '29.5%',
    },
    {
      dept: 'Hair Spa & Therapy',
      rev: isAllBranches ? '₹12,40,000' : '₹5,20,000',
      exp: isAllBranches ? '₹6,90,000' : '₹2,90,000',
      profit: isAllBranches ? '₹5,50,000' : '₹2,30,000',
      share: '19.3%',
    },
    {
      dept: 'Nails & Retail Beauty',
      rev: isAllBranches ? '₹9,30,000' : '₹3,80,000',
      exp: isAllBranches ? '₹4,20,000' : '₹1,80,000',
      profit: isAllBranches ? '₹5,10,000' : '₹2,00,000',
      share: '17.9%',
    },
  ];

  // REGIONAL BENCHMARK COMPARISON
  const regionalBranchComparison = [
    {
      region: 'Mumbai Metro (West)',
      branchId: 'mumbai',
      profit: '₹22.5 Lakh',
      profitNum: 2250000,
      margin: '36.8%',
      outlets: '1 Flagship',
    },
    {
      region: 'Delhi NCR Region',
      branchId: 'delhi',
      profit: '₹18.0 Lakh',
      profitNum: 1800000,
      margin: '33.5%',
      outlets: '1 Atelier',
    },
    {
      region: 'Bangalore Tech Corridor',
      branchId: 'bangalore',
      profit: '₹14.2 Lakh',
      profitNum: 1420000,
      margin: '35.1%',
      outlets: '1 Atelier',
    },
    {
      region: 'Hyderabad Jubilee Hills',
      branchId: 'hyderabad',
      profit: '₹9.8 Lakh',
      profitNum: 980000,
      margin: '31.4%',
      outlets: '1 Wellness Suite',
    },
  ];

  // Strictly filter branch margins
  const filteredBranchMargins = branchProfitMargins.filter(
    (b) => isAllBranches || b.branchId === selectedBranchId,
  );

  // Strictly filter regional benchmarks
  const filteredRegionalBenchmarks = regionalBranchComparison.filter(
    (r) => isAllBranches || r.branchId === selectedBranchId,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Unit Economics &amp; Branch P&amp;L Command Center
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Consolidated P&L' : `${selectedBranch.shortName} P&L`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Consolidated net profit analysis, EBITDA margin tracking, product COGS ratios, department profitability, and multi-branch benchmarking.'
              : `Net profit analysis, EBITDA margin, and department profitability specifically for ${selectedBranch.name}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() =>
              toast(
                `Export P&L: Consolidated P&L profitability statement for ${selectedBranch.shortName} exported to CSV.`,
              )
            }
            className="flex items-center gap-1.5 px-4 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export P&amp;L Statement
          </button>
        </div>
      </div>

      {/* 6 PRD KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((c, idx) => (
          <div
            key={idx}
            className="bg-white p-3.5 rounded-2xl border border-line shadow-xs space-y-1.5 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center">
              <div className="p-1.5 bg-paper rounded-xl border border-line">{c.icon}</div>
              <span className="text-[9.5px] font-bold text-soft uppercase">{c.label}</span>
            </div>
            <div>
              <div className={`text-base font-bold tracking-tight ${c.color}`}>{c.value}</div>
              <span className="text-[9.5px] font-semibold text-emerald-700 block truncate">
                {c.pct}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2-COLUMN ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BRANCH PROFITABILITY TABLE */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-line pb-2">
            <h3 className="font-bold text-sm text-ink">
              {isAllBranches
                ? 'Multi-Branch EBITDA & Margins'
                : `${selectedBranch.shortName} EBITDA & Financial Margins`}
            </h3>
            <span className="text-[10px] text-soft">Gross vs Net</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-2.5">Branch</th>
                  <th className="p-2.5">Revenue</th>
                  <th className="p-2.5">Expenses</th>
                  <th className="p-2.5">EBITDA Profit</th>
                  <th className="p-2.5">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {filteredBranchMargins.map((b, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-2.5 font-bold text-ink">{b.branch}</td>
                    <td className="p-2.5 font-bold text-emerald-700">{b.rev}</td>
                    <td className="p-2.5 text-rose-600 font-semibold">{b.exp}</td>
                    <td className="p-2.5 font-bold text-purple-900">{b.profit}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.margin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DEPARTMENT PROFITABILITY */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-line pb-2">
            <h3 className="font-bold text-sm text-ink">
              {isAllBranches
                ? 'Service Department Contribution (All Branches)'
                : `${selectedBranch.shortName} Service Department Margins`}
            </h3>
            <span className="text-[10px] text-soft">Revenue &amp; Margin</span>
          </div>
          <div className="space-y-3">
            {departmentProfitability.map((dept, idx) => (
              <div
                key={idx}
                className="p-3 bg-pine/5 rounded-xl border border-line flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-ink">{dept.dept}</div>
                  <div className="text-[10px] text-soft">
                    Rev: {dept.rev} • Exp: {dept.exp}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700">{dept.profit}</div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    {dept.share} Share
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REGIONAL BENCHMARK CARDS */}
      <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-ink">
          {isAllBranches
            ? 'Regional Operating Benchmarks'
            : `${selectedBranch.shortName} Regional Benchmark`}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRegionalBenchmarks.map((r, idx) => (
            <div
              key={idx}
              className="p-4 bg-purple-50/40 rounded-2xl border border-purple-200/70 space-y-1"
            >
              <span className="text-[10px] font-bold text-soft uppercase">{r.region}</span>
              <div className="text-xl font-bold text-purple-950">{r.profit}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                {r.margin} EBITDA Margin ({r.outlets})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
