import { Button, cn } from '@salon-spa-saas/ui';
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Download,
  Filter,
  Layers,
  Megaphone,
  Package,
  Percent,
  Scissors,
  Sparkles,
  Store,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { UniversalExportModal } from './UniversalExportModal';

export interface ExecutiveOverviewTabProps {
  onNavigateTab?: (tab: string) => void;
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function ExecutiveOverviewTab({
  onNavigateTab,
  defaultBranch = 'all',
  lockBranch = false,
}: ExecutiveOverviewTabProps) {
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedDateRange, setSelectedDateRange] = useState('Current Quarter');
  const [comparePeriod, setComparePeriod] = useState('Previous Quarter');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 8 Core KPI Cards (Section 1 PRD)
  const kpiCards = [
    {
      title: 'Total Network Revenue',
      current: '₹1,42,80,000',
      previous: '₹1,18,50,000',
      change: '+20.5%',
      isPositive: true,
      sub: 'vs Prev Quarter',
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Total Appointments',
      current: '9,840',
      previous: '8,420',
      change: '+16.9%',
      isPositive: true,
      sub: '8,420 Completed',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Active Clients',
      current: '14,200',
      previous: '12,100',
      change: '+17.4%',
      isPositive: true,
      sub: 'Network-wide',
      icon: Users,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'New Client Inflow',
      current: '3,840',
      previous: '3,210',
      change: '+19.6%',
      isPositive: true,
      sub: '27.0% of total',
      icon: UserPlus,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Returning Clients',
      current: '10,360',
      previous: '8,890',
      change: '+16.5%',
      isPositive: true,
      sub: '73.0% Repeat Rate',
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Staff Utilisation',
      current: '84.5%',
      previous: '78.2%',
      change: '+6.3%',
      isPositive: true,
      sub: 'Target: 80.0%',
      icon: Percent,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Inventory Valuation',
      current: '₹28,40,000',
      previous: '₹29,80,000',
      change: '-4.7%',
      isPositive: true,
      sub: 'Optimized Turns',
      icon: Package,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Active Packages / Subs',
      current: '1,280',
      previous: '1,050',
      change: '+21.9%',
      isPositive: true,
      sub: '₹25.4L Book Value',
      icon: Award,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  // Branch Performance Summary Table
  const branchPerformance = [
    {
      branch: 'Indore - Vijay Nagar Flagship',
      type: 'COCO Flagship',
      revenue: '₹38,50,000',
      appointments: 2640,
      clients: 3820,
      utilisation: '88.4%',
      growth: '+22.4%',
      rating: '4.9/5',
    },
    {
      branch: 'Bhopal - Arera Colony Lounge',
      type: 'FOFO Franchise',
      revenue: '₹28,40,000',
      appointments: 1980,
      clients: 2890,
      utilisation: '84.2%',
      growth: '+18.1%',
      rating: '4.8/5',
    },
    {
      branch: 'Indore - Palasia Premium Studio',
      type: 'COCO Boutique',
      revenue: '₹26,80,000',
      appointments: 1840,
      clients: 2710,
      utilisation: '85.6%',
      growth: '+19.5%',
      rating: '4.9/5',
    },
    {
      branch: 'Ujjain - Freeganj Main Studio',
      type: 'FOCO Franchise',
      revenue: '₹21,20,000',
      appointments: 1520,
      clients: 2240,
      utilisation: '81.8%',
      growth: '+24.0%',
      rating: '4.8/5',
    },
    {
      branch: 'Gwalior - City Centre Hub',
      type: 'FOFO Franchise',
      revenue: '₹17,90,000',
      appointments: 1260,
      clients: 1840,
      utilisation: '79.2%',
      growth: '+14.2%',
      rating: '4.7/5',
    },
    {
      branch: 'Jabalpur - Civil Lines Lounge',
      type: 'COCO Boutique',
      revenue: '₹10,00,000',
      appointments: 600,
      clients: 700,
      utilisation: '76.0%',
      growth: '+11.0%',
      rating: '4.8/5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Export Modal */}
      <UniversalExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Executive Analytics Dossier"
        defaultCategory="Executive"
        onExportComplete={(fmt, title) =>
          showToast(`Successfully exported ${title} in ${fmt} format.`)
        }
      />

      {/* 1. Global Filter Bar & Export Actions */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Branch Scope */}
          {!lockBranch && (
            <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
              >
                <option value="all">All Salon Outlets (6 Branches)</option>
                <option value="indore-vn">Indore - Vijay Nagar Flagship</option>
                <option value="indore-pal">Indore - Palasia Premium</option>
                <option value="bhopal-arera">Bhopal - Arera Colony</option>
                <option value="ujjain-free">Ujjain - Freeganj Studio</option>
                <option value="gwalior-cc">Gwalior - City Centre</option>
                <option value="jabalpur-cl">Jabalpur - Civil Lines</option>
              </select>
            </div>
          )}

          {/* Date Range */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="Current Quarter">Current Quarter (Q2 FY26-27)</option>
              <option value="Current Month">Current Month (Aug 2026)</option>
              <option value="Last Month">Last Month (Jul 2026)</option>
              <option value="Financial YTD">Financial YTD (FY26-27)</option>
              <option value="Last 12 Months">Last 12 Rolling Months</option>
            </select>
          </div>

          {/* Benchmark Compare Period */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span className="text-soft font-semibold">Compare:</span>
            <select
              value={comparePeriod}
              onChange={(e) => setComparePeriod(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="Previous Quarter">Previous Quarter (Q1 FY26-27)</option>
              <option value="Same Quarter Last Year">Same Quarter Last Year (Q2 FY25-26)</option>
              <option value="Preceding Month">Preceding Month</option>
            </select>
          </div>
        </div>

        {/* Export Button */}
        <Button
          variant="outline"
          onClick={() => setIsExportOpen(true)}
          className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Export Executive Dossier</span>
        </Button>
      </div>

      {/* 2. 8 KPI Metric Cards Grid (Section 1 PRD) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpiCards.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={cn('w-6 h-6 rounded-lg grid place-items-center', kpi.bg, kpi.color)}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5',
                      kpi.isPositive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700',
                    )}
                  >
                    {kpi.isPositive ? (
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    ) : (
                      <ArrowDownRight className="w-2.5 h-2.5" />
                    )}
                    {kpi.change}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-soft uppercase tracking-wider block">
                  {kpi.title}
                </span>
                <strong className="text-sm font-serif font-bold text-ink mt-0.5 block truncate">
                  {kpi.current}
                </strong>
              </div>
              <div className="mt-1.5 pt-1 border-t border-slate-100 text-[9px] text-muted flex items-center justify-between">
                <span className="truncate">{kpi.sub}</span>
                <span className="text-[8px] font-mono text-soft">{kpi.previous}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. 7 Visual Charts & Cross-Module Intelligence Rows (Section 1 PRD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Revenue & Financial Velocity */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-ink text-base">
                Monthly Revenue Pacing &amp; Growth Trajectory
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                Quarterly GMV customer spend compared with target projections
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#5A2EA6]">
                <div className="w-2 h-2 rounded-full bg-[#5A2EA6]" />
                Actual FY26-27
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                Target Budget
              </span>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="space-y-3 pt-1 text-xs">
            {[
              {
                month: 'April 2026',
                actual: '₹44.2L',
                target: '₹40.0L',
                pct: 92,
                growth: '+18.4%',
              },
              { month: 'May 2026', actual: '₹48.6L', target: '₹44.0L', pct: 98, growth: '+21.2%' },
              {
                month: 'June 2026 (Peak Wedding)',
                actual: '₹50.0L',
                target: '₹46.0L',
                pct: 100,
                growth: '+24.5%',
              },
              { month: 'July 2026', actual: '₹46.8L', target: '₹45.0L', pct: 94, growth: '+19.8%' },
            ].map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-ink">{m.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted text-[11px]">Target: {m.target}</span>
                    <strong className="font-serif font-extrabold text-[#5A2EA6]">{m.actual}</strong>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                      {m.growth}
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    className="h-full bg-[#5A2EA6] rounded-full transition-all duration-500"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-soft font-semibold">
              Consolidated Net Gross GMV: <strong className="text-ink">₹1,42,80,000</strong>
            </span>
            <Button
              variant="outline"
              onClick={() => onNavigateTab && onNavigateTab('revenue')}
              className="h-[28px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
            >
              <span>Detailed Revenue Analytics</span>
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Chart 2 & 3: Client Inflow & Retention Cohort Ratio */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-ink text-base">
                Client Acquisition &amp; Loyalty
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                New client capture vs repeat customer retention ratio
              </p>
            </div>

            <div className="my-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-soft block uppercase font-bold">
                    Total Client Roster
                  </span>
                  <strong className="text-xl font-serif font-bold text-ink">14,200 Clients</strong>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  73% Retention
                </span>
              </div>

              {/* Stacked Ratio Bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200">
                <div
                  className="h-full bg-emerald-600"
                  style={{ width: '73%' }}
                  title="Returning (73%)"
                />
                <div className="h-full bg-indigo-600" style={{ width: '27%' }} title="New (27%)" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-xl bg-white border border-emerald-100">
                  <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Returning (73%)</span>
                  </div>
                  <strong className="text-sm font-bold text-ink block mt-0.5">
                    10,360 Clients
                  </strong>
                  <span className="text-[9px] text-muted">₹1,180 Avg Spend</span>
                </div>

                <div className="p-2 rounded-xl bg-white border border-indigo-100">
                  <div className="flex items-center gap-1 text-indigo-700 font-bold text-[11px]">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>New (27%)</span>
                  </div>
                  <strong className="text-sm font-bold text-ink block mt-0.5">3,840 Clients</strong>
                  <span className="text-[9px] text-muted">₹1,450 Avg Spend</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigateTab && onNavigateTab('clients')}
            className="w-full h-[32px] rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center justify-center gap-1"
          >
            <span>Inspect Retention Cohorts</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* 4. Cross-Module Benchmarks (Staff, Inventory, Marketing) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Staff Productivity */}
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#5A2EA6]" />
                <h4 className="font-serif font-bold text-ink text-sm">
                  Staff Productivity &amp; Utilisation
                </h4>
              </div>
              <span className="text-xs font-bold text-[#5A2EA6]">84.5% Avg</span>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-soft">Completed Rituals:</span>
                <strong className="text-ink">8,420 Services</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Retail Product Upsell:</span>
                <strong className="text-[#5A2EA6]">₹18,40,000</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Client Rebooking Rate:</span>
                <strong className="text-emerald-700">76.8% of visits</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Customer CSAT Feedback:</span>
                <strong className="text-amber-700">4.85 / 5.0 Rating</strong>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigateTab && onNavigateTab('staff')}
            className="w-full h-[30px] rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center justify-center gap-1"
          >
            <span>Staff Performance Matrix</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>

        {/* Module 2: Inventory & Consumption Efficiency */}
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <h4 className="font-serif font-bold text-ink text-sm">
                  Inventory &amp; Recipe Variance
                </h4>
              </div>
              <span className="text-xs font-bold text-amber-700">₹28.4L Stock</span>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-soft">Quarterly Consumption:</span>
                <strong className="text-ink">₹12,20,000</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Wastage Discrepancy:</span>
                <strong className="text-rose-700">₹48,000 (0.39%)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Recipe vs Actual Variance:</span>
                <strong className="text-emerald-700">+1.2% High Yield</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Stock Ageing Cycle:</span>
                <strong className="text-slate-800">42 Days Turns</strong>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigateTab && onNavigateTab('inventory')}
            className="w-full h-[30px] rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center justify-center gap-1"
          >
            <span>Inventory Analytics</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>

        {/* Module 3: Marketing Campaign ROI */}
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-600" />
                <h4 className="font-serif font-bold text-ink text-sm">
                  Marketing &amp; Campaign ROI
                </h4>
              </div>
              <span className="text-xs font-bold text-indigo-700">4 Active</span>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-soft">Delivered Audience Reach:</span>
                <strong className="text-ink">48,500 Clients</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Direct Bookings Captured:</span>
                <strong className="text-indigo-700">3,640 Bookings</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Campaign Attributed GMV:</span>
                <strong className="text-[#5A2EA6]">₹38,40,000</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-soft">Coupon Redemptions:</span>
                <strong className="text-emerald-700">4,120 Vouchers</strong>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigateTab && onNavigateTab('marketing')}
            className="w-full h-[30px] rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center justify-center gap-1"
          >
            <span>Marketing Analytics</span>
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* 5. Cross-Branch / Floor Zone Performance Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                {lockBranch
                  ? `${defaultBranch} · Floor Zones & Performance Benchmarking`
                  : 'Multi-Branch Performance Benchmarking Ledger'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {lockBranch ? 'Zone Performance' : 'Executive Comparison'}
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              {lockBranch
                ? `Operational performance and utilisation across floor studios for ${defaultBranch}`
                : 'Comprehensive comparison across flagship salons, boutique studios, and franchise partners'}
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            {lockBranch ? '5 Salon Floor Zones' : 'Sorted by Gross GMV Revenue'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">
                  {lockBranch ? 'Floor Studio / Suite' : 'Salon Branch & Model'}
                </th>
                <th className="p-3.5 text-right">Quarterly GMV</th>
                <th className="p-3.5 text-center">Appointments</th>
                <th className="p-3.5 text-center">Client Volume</th>
                <th className="p-3.5 text-center">Staff Utilisation</th>
                <th className="p-3.5 text-center">YoY Growth</th>
                <th className="p-3.5 pr-5 text-right">Client Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {(lockBranch
                ? [
                    {
                      branch: 'Hair Care & Precision Styling Studio',
                      type: '6 Master Styling Stations',
                      revenue: '₹20,00,000',
                      appointments: 1240,
                      clients: 1680,
                      utilisation: '92.4%',
                      growth: '+24.5%',
                      rating: '4.95/5',
                    },
                    {
                      branch: 'Clinical Skin Aesthetics & Hydra-Facial Suite',
                      type: '2 Private Treatment Rooms',
                      revenue: '₹10,00,000',
                      appointments: 620,
                      clients: 890,
                      utilisation: '89.6%',
                      growth: '+21.0%',
                      rating: '4.92/5',
                    },
                    {
                      branch: 'Spa Sanctuary & Holistic Wellness Suite',
                      type: '3 Ayurveda Body Suites',
                      revenue: '₹5,00,000',
                      appointments: 410,
                      clients: 540,
                      utilisation: '86.2%',
                      growth: '+18.2%',
                      rating: '4.88/5',
                    },
                    {
                      branch: 'Nail Bar & Express Pedicure Lounge',
                      type: '4 Manicure / Pedicure Chairs',
                      revenue: '₹2,70,000',
                      appointments: 250,
                      clients: 390,
                      utilisation: '82.5%',
                      growth: '+15.6%',
                      rating: '4.85/5',
                    },
                    {
                      branch: 'Bridal Couture & VIP Transformation Suite',
                      type: '1 Private VIP Dressing Lounge',
                      revenue: '₹80,000',
                      appointments: 120,
                      clients: 120,
                      utilisation: '96.0%',
                      growth: '+32.0%',
                      rating: '5.0/5',
                    },
                  ]
                : branchPerformance
              ).map((bp, idx) => (
                <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{bp.branch}</strong>
                    <span className="text-[10px] text-muted font-semibold">{bp.type}</span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-extrabold text-slate-900 text-sm">
                    {bp.revenue}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                    {bp.appointments.toLocaleString()} visits
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap text-slate-800">
                    {bp.clients.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-[#5A2EA6]">
                    {bp.utilisation}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <TrendingUp className="w-3 h-3" />
                      <span>{bp.growth}</span>
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap font-bold text-amber-700">
                    ★ {bp.rating}
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
