import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  BarChart3,
  Building2,
  Calendar,
  Crown,
  DollarSign,
  Download,
  Package,
  PieChart,
  RefreshCw,
  Scissors,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

export function PerformancePage() {
  const { toast } = useToast();

  // 8 CARDS REQUESTED BY USER: Revenue, Profit Trend, Appointments, Customer Retention, Repeat Customers, Package Sales, Average Rating, Branch Ranking
  const cards = [
    { label: 'Revenue', value: '₹48,50,000', pct: '↑ 14.2% MoM', color: 'text-emerald-700' },
    {
      label: 'Profit Trend',
      value: '34.8% Margin',
      pct: '+12.4% Net Profit',
      color: 'text-[#5A2EA6]',
    },
    {
      label: 'Appointments',
      value: '1,240 Visits',
      pct: '↑ 9.5% Volume',
      color: 'text-purple-900',
    },
    {
      label: 'Customer Retention',
      value: '84.2%',
      pct: 'Top 5% SaaS Benchmark',
      color: 'text-teal-700',
    },
    {
      label: 'Repeat Customers',
      value: '68.5%',
      pct: 'High Loyalty Index',
      color: 'text-emerald-800',
    },
    {
      label: 'Package Sales',
      value: '₹8,52,000',
      pct: '142 Packages Sold',
      color: 'text-purple-800',
    },
    {
      label: 'Average Rating',
      value: '4.9 / 5.0 ⭐',
      pct: '1,280 Verified Reviews',
      color: 'text-amber-700',
    },
    {
      label: 'Branch Ranking',
      value: '#1 Indrapuri',
      pct: 'Top Outlet Leader',
      color: 'text-[#5A2EA6]',
    },
  ];

  // 4 CHARTS DATA REQUESTED BY USER: Revenue, Appointments, Service Growth, Customer Retention
  const revenueData = [
    { month: 'Apr', rev: '₹38.2L' },
    { month: 'May', rev: '₹41.5L' },
    { month: 'Jun', rev: '₹43.8L' },
    { month: 'Jul', rev: '₹45.2L' },
    { month: 'Aug', rev: '₹48.5L' },
  ];

  const appointmentsData = [
    { month: 'Apr', appts: '980' },
    { month: 'May', appts: '1,050' },
    { month: 'Jun', appts: '1,120' },
    { month: 'Jul', appts: '1,180' },
    { month: 'Aug', appts: '1,240' },
  ];

  const serviceGrowth = [
    { name: 'Hydra Facials & Skincare', growth: '+28.4%', rev: '₹12,80,000' },
    { name: 'Keratin & Ammonia-free Hair Color', growth: '+22.1%', rev: '₹18,50,000' },
    { name: 'Deep Tissue & Spa Therapy', growth: '+18.5%', rev: '₹8,50,000' },
    { name: 'Nail Suite & Pedicure Therapy', growth: '+15.2%', rev: '₹8,70,000' },
  ];

  const customerRetentionData = [
    { month: 'Apr', rate: '80.1%' },
    { month: 'May', rate: '81.4%' },
    { month: 'Jun', rate: '82.8%' },
    { month: 'Jul', rate: '83.5%' },
    { month: 'Aug', rate: '84.2%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Franchise Performance &amp; Analytics
          </h1>
          <p className="text-xs text-soft mt-1">
            Core performance analytics, profit trends, customer retention rates, service growth
            metrics, and branch rankings.
          </p>
        </div>

        <button
          onClick={() => toast('Export Analytics: Performance benchmark report exported to CSV.')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" /> Export Performance Report
        </button>
      </div>

      {/* 8 CARDS REQUESTED BY USER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-line shadow-xs space-y-1 hover:shadow-md transition-all"
          >
            <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
              {c.label}
            </span>
            <div className={`text-2xl font-bold tracking-tight ${c.color}`}>{c.value}</div>
            <span className="text-[10.5px] font-semibold text-emerald-700 block">{c.pct}</span>
          </div>
        ))}
      </div>

      {/* 4 CHARTS SECTIONS REQUESTED BY USER: Revenue, Appointments, Service Growth, Customer Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" /> 1. Revenue Trajectory
              </h3>
              <p className="text-xs text-soft">5-Month consolidated revenue trend</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              +14.2% MoM
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center pt-1">
            {revenueData.map((r, idx) => (
              <div key={idx} className="p-3 bg-paper/40 rounded-xl border border-line space-y-0.5">
                <span className="text-[10px] font-bold text-soft uppercase">{r.month}</span>
                <div className="text-sm font-bold text-purple-950">{r.rev}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" /> 2. Appointments Volume
              </h3>
              <p className="text-xs text-soft">Monthly booking volume growth</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              1,240 Visits
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center pt-1">
            {appointmentsData.map((a, idx) => (
              <div key={idx} className="p-3 bg-pine/5 rounded-xl border border-line space-y-0.5">
                <span className="text-[10px] font-bold text-soft uppercase">{a.month}</span>
                <div className="text-sm font-bold text-emerald-800">{a.appts}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Service Growth */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2 border-b border-line pb-3">
            <Scissors className="w-4 h-4 text-purple-600" /> 3. Service Category Growth Rate
          </h3>

          <div className="space-y-3">
            {serviceGrowth.map((sg, idx) => (
              <div
                key={idx}
                className="p-3 bg-paper/40 rounded-xl border border-line flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-bold text-ink">{sg.name}</div>
                  <div className="text-[10.5px] text-soft">{sg.rev} Revenue</div>
                </div>
                <span className="font-bold text-emerald-700 text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {sg.growth}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Customer Retention */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" /> 4. Customer Retention Trend
              </h3>
              <p className="text-xs text-soft">Consolidated repeat client retention percentage</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              84.2% Active
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center pt-1">
            {customerRetentionData.map((cr, idx) => (
              <div
                key={idx}
                className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-0.5"
              >
                <span className="text-[10px] font-bold text-soft uppercase">{cr.month}</span>
                <div className="text-sm font-bold text-purple-900">{cr.rate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
