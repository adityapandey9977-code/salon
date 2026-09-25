import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Crown,
  Download,
  HelpCircle,
  Layers,
  Package,
  Percent,
  PieChart as PieChartIcon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';

export function ProfitabilityLiabilityTab() {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [activeSubView, setActiveSubView] = useState<'profitability' | 'packageLiability'>(
    'profitability',
  );

  // Profitability High-level summary (Section 15)
  const profitabilitySummary = {
    grossRevenue: '₹48,50,000',
    totalCosts: '₹29,80,000',
    estimatedProfit: '₹18,70,000',
    grossMargin: '58.5%',
    netMargin: '38.5%',
    operatingEfficiency: '91.2%',
  };

  // Branch-Wise Margins
  const branchMargins = [
    {
      branch: 'Indore Central (Flagship)',
      grossRev: '₹15,30,000',
      totalCost: '₹8,90,000',
      netProfit: '₹6,40,000',
      margin: '41.8%',
      tag: 'Actual',
    },
    {
      branch: 'Vijay Nagar Boutique',
      grossRev: '₹11,80,000',
      totalCost: '₹7,10,000',
      netProfit: '₹4,70,000',
      margin: '39.8%',
      tag: 'Actual',
    },
    {
      branch: 'Bhopal Arera Colony',
      grossRev: '₹9,84,500',
      totalCost: '₹6,20,000',
      netProfit: '₹3,64,500',
      margin: '37.0%',
      tag: 'Estimated',
    },
    {
      branch: 'Ujjain Mahakal Road',
      grossRev: '₹6,88,000',
      totalCost: '₹4,40,000',
      netProfit: '₹2,48,000',
      margin: '36.0%',
      tag: 'Estimated',
    },
    {
      branch: 'Gwalior City Centre',
      grossRev: '₹4,67,500',
      totalCost: '₹3,20,000',
      netProfit: '₹1,47,500',
      margin: '31.5%',
      tag: 'Pending',
    },
  ];

  // Cost breakdown
  const costBreakdown = [
    {
      category: 'Staff Salaries & Commissions',
      amount: '₹16,40,000',
      pct: '55.0%',
      type: 'Actual',
      color: 'bg-[#5A2EA6]',
    },
    {
      category: 'Consumables & Product BOM Cost',
      amount: '₹6,80,000',
      pct: '22.8%',
      type: 'Estimated',
      color: 'bg-[#8B6FD8]',
    },
    {
      category: 'Branch Rent & Utility Overheads',
      amount: '₹4,50,000',
      pct: '15.1%',
      type: 'Actual',
      color: 'bg-[#0D9488]',
    },
    {
      category: 'Marketing & Digital Acquisition',
      amount: '₹2,10,000',
      pct: '7.1%',
      type: 'Actual',
      color: 'bg-[#D97706]',
    },
  ];

  // Package Liability Data (Section 16 / PRD P-04)
  const liabilityKpis = [
    { title: 'Packages Sold (Lifetime)', value: '620 Units', sub: '₹48.2L Cumulative' },
    {
      title: 'Redeemed Service Value',
      value: '₹32,40,000',
      sub: '67.2% Burnout rate',
      isGood: true,
    },
    { title: 'Outstanding Sessions', value: '740 Sessions', sub: 'Unclaimed bookings' },
    { title: 'Unearned Liability Value', value: '₹12,80,000', sub: 'Current balance sheet risk' },
    {
      title: 'Forecasted Breakage (Expired)',
      value: '₹3,00,000',
      sub: '6.2% Breakage gain',
      isGood: true,
    },
  ];

  const packageLiabilityLedger = [
    {
      branch: 'Indore Central',
      package: 'Bridal Radiance Deluxe (6x)',
      sold: 45,
      redeemed: 32,
      remaining: 13,
      outstandingValue: '₹3,12,000',
      expiry: '31 Dec 2026',
      status: 'Active',
    },
    {
      branch: 'Vijay Nagar Boutique',
      package: 'Hair Spa & Keratin Therapy (4x)',
      sold: 80,
      redeemed: 65,
      remaining: 15,
      outstandingValue: '₹1,80,000',
      expiry: '15 Nov 2026',
      status: 'Active',
    },
    {
      branch: 'Bhopal Arera Colony',
      package: 'Anti-Aging Hydra Glow (5x)',
      sold: 38,
      redeemed: 24,
      remaining: 14,
      outstandingValue: '₹2,24,000',
      expiry: '30 Oct 2026',
      status: 'Active',
    },
    {
      branch: 'Ujjain Mahakal Road',
      package: 'Men Grooming & Styling Pack (6x)',
      sold: 52,
      redeemed: 46,
      remaining: 6,
      outstandingValue: '₹72,000',
      expiry: '15 Sep 2026',
      status: 'Near Expiry',
    },
    {
      branch: 'Gwalior City Centre',
      package: 'Signature Aromatherapy Spa (3x)',
      sold: 26,
      redeemed: 26,
      remaining: 0,
      outstandingValue: '₹0',
      expiry: 'Expired',
      status: 'Completed',
    },
  ];

  const getTagBadge = (tag: string) => {
    switch (tag) {
      case 'Actual':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Estimated':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Sub-View Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubView('profitability')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubView === 'profitability'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'bg-slate-100 text-soft hover:text-ink',
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Profitability &amp; Margins Overview</span>
          </button>

          <button
            onClick={() => setActiveSubView('packageLiability')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubView === 'packageLiability'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'bg-slate-100 text-soft hover:text-ink',
            )}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Package Liability &amp; Breakage (PRD P-04)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast(`Exporting ${activeSubView} analytical summary...`)}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Analytics</span>
          </Button>
        </div>
      </div>

      {activeSubView === 'profitability' ? (
        /* SECTION 15: PROFITABILITY OVERVIEW */
        <div className="space-y-6">
          {/* Top Profitability Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Gross Revenue
              </span>
              <strong className="text-lg font-serif font-bold text-ink block mt-1">
                {profitabilitySummary.grossRevenue}
              </strong>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">
                Invoiced Streams
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Operating Costs
              </span>
              <strong className="text-lg font-serif font-bold text-rose-700 block mt-1">
                {profitabilitySummary.totalCosts}
              </strong>
              <span className="text-[9px] text-rose-600 font-semibold mt-1 block">
                Salaries + BOM + Rent
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs bg-gradient-to-br from-purple-50/50 to-white">
              <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
                Estimated Net Profit
              </span>
              <strong className="text-lg font-serif font-bold text-[#5A2EA6] block mt-1">
                {profitabilitySummary.estimatedProfit}
              </strong>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">+16.4% YoY</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">Gross Margin</span>
              <strong className="text-lg font-serif font-bold text-ink block mt-1">
                {profitabilitySummary.grossMargin}
              </strong>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">
                Healthy standard
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Net Profit Margin
              </span>
              <strong className="text-lg font-serif font-bold text-emerald-700 block mt-1">
                {profitabilitySummary.netMargin}
              </strong>
              <span className="text-[9px] text-emerald-600 font-bold mt-1 block">
                After overheads
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Operational Accuracy
              </span>
              <strong className="text-lg font-serif font-bold text-indigo-700 block mt-1">
                {profitabilitySummary.operatingEfficiency}
              </strong>
              <span className="text-[9px] text-indigo-600 font-bold mt-1 block">
                Formula BOM Sync
              </span>
            </div>
          </div>

          {/* Cost Structure vs Revenue Margin Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cost Breakdown */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                    <PieChartIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-ink text-base">
                      Operating Cost Distribution
                    </h3>
                    <p className="text-[11px] text-muted">
                      Cost of service delivery &amp; branch overheads
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {costBreakdown.map((cost, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-ink">{cost.category}</span>
                        <span
                          className={cn(
                            'text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap inline-flex items-center',
                            getTagBadge(cost.type),
                          )}
                        >
                          {cost.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">{cost.amount}</span>
                        <strong className="text-slate-800">{cost.pct}</strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                        <div
                          style={{ width: cost.pct }}
                          className={cn('h-full rounded-full', cost.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-soft">
                <span>Note: Consumables cost is estimated from service recipes (BOM)</span>
              </div>
            </div>

            {/* Branch Margin Comparison Table */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-ink text-base">
                      Branch-wise Profit &amp; Margin Ledger
                    </h3>
                    <p className="text-[11px] text-muted">Cross-location bottom line comparison</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase whitespace-nowrap">
                      <th className="p-2.5 pl-3">Branch</th>
                      <th className="p-2.5 text-right">Gross Rev</th>
                      <th className="p-2.5 text-right">Costs</th>
                      <th className="p-2.5 text-right">Net Profit</th>
                      <th className="p-2.5 text-right">Net Margin</th>
                      <th className="p-2.5 pr-3 text-right">Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {branchMargins.map((bm, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 pl-3 font-bold text-ink whitespace-nowrap">
                          {bm.branch}
                        </td>
                        <td className="p-2.5 text-right text-slate-800 whitespace-nowrap">
                          {bm.grossRev}
                        </td>
                        <td className="p-2.5 text-right text-rose-600 whitespace-nowrap">
                          -{bm.totalCost}
                        </td>
                        <td className="p-2.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                          {bm.netProfit}
                        </td>
                        <td className="p-2.5 text-right font-extrabold text-[#5A2EA6] whitespace-nowrap">
                          {bm.margin}
                        </td>
                        <td className="p-2.5 pr-3 text-right whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap',
                              getTagBadge(bm.tag),
                            )}
                          >
                            {bm.tag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SECTION 16: PACKAGE LIABILITY & BREAKAGE FORECASTING */
        <div className="space-y-6">
          {/* Liability KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            {liabilityKpis.map((kpi, idx) => (
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
                <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-muted">
                  {kpi.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Package Liability Ledger Table */}
          <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#5A2EA6]" />
                  <h3 className="font-serif font-bold text-ink text-base">
                    Package Liability &amp; Unearned Revenue Matrix
                  </h3>
                </div>
                <p className="text-[11px] text-muted mt-0.5">
                  Track unredeemed prepaid service liabilities, expiration breakage, and remaining
                  customer balance commitments
                </p>
              </div>

              <span className="text-xs font-bold text-[#5A2EA6] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 whitespace-nowrap">
                PRD Differentiator P-04
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                    <th className="p-3.5 pl-5">Branch Location</th>
                    <th className="p-3.5">Service Package</th>
                    <th className="p-3.5 text-center">Packages Sold</th>
                    <th className="p-3.5 text-center">Sessions Redeemed</th>
                    <th className="p-3.5 text-center">Remaining Sessions</th>
                    <th className="p-3.5 text-right">Outstanding Unearned Value</th>
                    <th className="p-3.5">Expiry Pacing</th>
                    <th className="p-3.5 pr-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                  {packageLiabilityLedger.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                      <td className="p-3.5 pl-5 font-bold text-ink whitespace-nowrap">
                        {row.branch}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900">{row.package}</td>
                      <td className="p-3.5 text-center whitespace-nowrap">{row.sold}</td>
                      <td className="p-3.5 text-center text-emerald-700 font-bold whitespace-nowrap">
                        {row.redeemed}
                      </td>
                      <td className="p-3.5 text-center font-bold text-indigo-700 whitespace-nowrap">
                        {row.remaining}
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                        {row.outstandingValue}
                      </td>
                      <td className="p-3.5 text-soft whitespace-nowrap">{row.expiry}</td>
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                            row.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : row.status === 'Near Expiry'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200',
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
