import { Button, cn } from '@salon-spa-saas/ui';
import { Award, BarChart2, DollarSign, Star, TrendingUp, Trophy } from 'lucide-react';
import React, { useState } from 'react';

export function PerformancePage() {
  const [activeTab, setActiveTab] = useState<'targets' | 'commission' | 'productivity'>('targets');

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
            Performance, Commission &amp; Incentive
          </h1>
          <p className="text-[13px] text-soft mt-1">
            Track monthly revenue targets, tier commissions, tip earnings, and chair productivity
            analytics
          </p>
        </div>

        <div className="flex bg-[#F8F5FF] p-1 rounded-2xl border border-[#5A2EA6]/15">
          <button
            onClick={() => setActiveTab('targets')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'targets'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Monthly Targets
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'commission'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Commissions &amp; Tips
          </button>
          <button
            onClick={() => setActiveTab('productivity')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'productivity'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Productivity &amp; Rating
          </button>
        </div>
      </div>

      {activeTab === 'targets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-ink border-b border-line pb-2">
              July 2026 Service Revenue Target
            </h3>
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-3xl font-bold text-[#5A2EA6]">₹1,85,000</span>
              <span className="text-xs font-bold text-soft">Target: ₹2,00,000</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#5A2EA6]/10 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-[#5A2EA6] to-[#7B42D6] h-full rounded-full w-[92.5%]" />
            </div>
            <p className="text-xs text-emerald-700 font-bold">
              ✓ 92.5% Achieved (Only ₹15,000 remaining to unlock 15% tier commission!)
            </p>
          </div>

          <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-ink border-b border-line pb-2">
              July 2026 Retail Product Target
            </h3>
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-3xl font-bold text-ink">₹28,500</span>
              <span className="text-xs font-bold text-soft">Target: ₹30,000</span>
            </div>
            <div className="w-full bg-[#5A2EA6]/10 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full w-[95%]" />
            </div>
            <p className="text-xs text-amber-800 font-bold">
              ✓ 95.0% Achieved (₹1,500 remaining for ₹2,500 retail bonus!)
            </p>
          </div>
        </div>
      )}

      {activeTab === 'commission' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink border-b border-line pb-3">
            Commission &amp; Tip Earnings Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="bg-[#F8F5FF] border border-[#5A2EA6]/20 p-4 rounded-2xl">
              <span className="text-soft block">Service Commission (12%)</span>
              <strong className="font-serif text-xl text-[#5A2EA6] font-bold block mt-1">
                ₹22,200
              </strong>
            </div>
            <div className="bg-[#F8F5FF] border border-[#5A2EA6]/20 p-4 rounded-2xl">
              <span className="text-soft block">Retail Commission (5%)</span>
              <strong className="font-serif text-xl text-[#5A2EA6] font-bold block mt-1">
                ₹1,425
              </strong>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-emerald-800 block">Direct Tips Collected</span>
              <strong className="font-serif text-xl text-emerald-700 font-bold block mt-1">
                ₹6,800
              </strong>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'productivity' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink border-b border-line pb-3">
            Chair Utilization &amp; Client Retention Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border border-line rounded-2xl">
              <span className="text-xs text-soft block">Average Chair Occupancy</span>
              <strong className="text-2xl font-bold text-[#5A2EA6] block mt-1">85%</strong>
            </div>
            <div className="p-4 border border-line rounded-2xl">
              <span className="text-xs text-soft block">Client Rebooking Rate</span>
              <strong className="text-2xl font-bold text-emerald-600 block mt-1">78%</strong>
            </div>
            <div className="p-4 border border-line rounded-2xl">
              <span className="text-xs text-soft block">Overall Stylist Rating</span>
              <strong className="text-2xl font-bold text-amber-500 block mt-1">4.9 ⭐</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
