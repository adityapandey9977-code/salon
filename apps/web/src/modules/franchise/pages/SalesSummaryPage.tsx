import { useToast } from '@salon-spa-saas/ui';
import {
  BarChart3,
  Building2,
  CreditCard,
  DollarSign,
  Download,
  PieChart,
  RefreshCw,
  Scissors,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';

export function SalesSummaryPage() {
  const { toast } = useToast();

  // 6 HIGH-LEVEL CARDS REQUESTED BY USER
  const cards = [
    {
      label: "Today's Sales",
      value: '₹1,84,500',
      pct: '↑ 14% vs yesterday',
      color: 'text-[#5A2EA6]',
    },
    {
      label: 'Monthly Sales',
      value: '₹48,50,000',
      pct: '↑ 14.2% vs last month',
      color: 'text-emerald-700',
    },
    {
      label: 'Package Sales',
      value: '₹8,52,000',
      pct: '17.5% of total sales',
      color: 'text-purple-900',
    },
    {
      label: 'Retail Sales',
      value: '₹8,70,000',
      pct: '17.9% of total sales',
      color: 'text-teal-700',
    },
    {
      label: 'Average Bill',
      value: '₹3,450',
      pct: 'Per client transaction',
      color: 'text-amber-800',
    },
    { label: 'Refunds', value: '₹12,400', pct: '0.25% refund rate', color: 'text-rose-700' },
  ];

  // 3 CHARTS DATA REQUESTED BY USER: Revenue Trend, Branch Revenue, Service Revenue
  const revenueTrend = [
    { month: 'Apr 2026', rev: '₹38,20,000', growth: '+8.2%' },
    { month: 'May 2026', rev: '₹41,50,000', growth: '+8.6%' },
    { month: 'Jun 2026', rev: '₹43,80,000', growth: '+5.5%' },
    { month: 'Jul 2026', rev: '₹45,20,000', growth: '+3.2%' },
    { month: 'Aug 2026', rev: '₹48,50,000', growth: '+7.3%' },
  ];

  const branchRevenue = [
    { branch: 'Indrapuri Central Outlet', rev: '₹16,40,000', percent: '33.8%' },
    { branch: 'Arera Colony Outlet', rev: '₹14,20,000', percent: '29.3%' },
    { branch: 'Kolar Road Outlet', rev: '₹10,80,000', percent: '22.3%' },
    { branch: 'MP Nagar Flagship Branch', rev: '₹7,10,000', percent: '14.6%' },
  ];

  const serviceRevenue = [
    { category: 'Hair Styling & Ammonia-Free Colors', rev: '₹18,50,000', share: '38.1%' },
    { category: 'Hydra Facials & Radiance Skincare', rev: '₹12,80,000', share: '26.4%' },
    { category: 'Body Spa & Deep Tissue Relief', rev: '₹8,50,000', share: '17.5%' },
    { category: 'Nail Suite & Pedicure Therapy', rev: '₹8,70,000', share: '18.0%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Franchise Sales &amp; Financial Performance Summary
          </h1>
          <p className="text-xs text-soft mt-1">
            High-level sales overview, daily &amp; monthly sales benchmarks, revenue trends, branch
            distribution, and service performance.
          </p>
        </div>

        <button
          onClick={() =>
            toast('Export Financials: High-level sales summary statement exported to CSV.')
          }
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" /> Export Summary Report
        </button>
      </div>

      {/* 6 METRIC CARDS REQUESTED BY USER: Today's Sales, Monthly Sales, Package Sales, Retail Sales, Average Bill, Refunds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-line shadow-xs space-y-1 hover:shadow-md transition-all"
          >
            <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
              {c.label}
            </span>
            <div className={`text-2xl font-bold tracking-tight ${c.color}`}>{c.value}</div>
            <span className="text-[10.5px] font-semibold text-emerald-700 block pt-0.5">
              {c.pct}
            </span>
          </div>
        ))}
      </div>

      {/* 3 CHARTS SECTIONS REQUESTED BY USER: Revenue Trend, Branch Revenue, Service Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" /> 1. Revenue Trend Trajectory
              </h3>
              <p className="text-xs text-soft">
                5-Month consolidated sales performance across outlets
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              +14.2% Growth
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3 text-center">
            {revenueTrend.map((t, idx) => (
              <div key={idx} className="p-3 bg-paper/40 rounded-xl border border-line space-y-1">
                <span className="text-[10px] font-bold text-soft uppercase">{t.month}</span>
                <div className="text-sm font-bold text-purple-950">{t.rev}</div>
                <div className="text-[10px] text-emerald-700 font-bold">{t.growth}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Branch Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2 border-b border-line pb-3">
            <Building2 className="w-4 h-4 text-purple-600" /> 2. Branch Revenue Distribution
          </h3>

          <div className="space-y-3">
            {branchRevenue.map((b, idx) => (
              <div key={idx} className="p-3 bg-pine/5 rounded-xl border border-line space-y-1">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>{b.branch}</span>
                  <span className="text-emerald-700">{b.rev}</span>
                </div>
                <div className="text-[10.5px] text-purple-700 font-bold">
                  {b.percent} of Total Sales
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Service Revenue */}
      <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-3">
        <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2 border-b border-line pb-3">
          <Scissors className="w-4 h-4 text-purple-600" /> 3. Service Category Revenue Mix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {serviceRevenue.map((s, idx) => (
            <div key={idx} className="p-3.5 bg-paper/30 rounded-xl border border-line space-y-1">
              <span className="text-[10px] font-bold text-soft uppercase">Category #{idx + 1}</span>
              <div className="font-bold text-ink text-xs pt-0.5">{s.category}</div>
              <div className="text-emerald-700 font-bold text-sm">{s.rev}</div>
              <div className="text-[10.5px] text-purple-700 font-semibold">{s.share} Share</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
