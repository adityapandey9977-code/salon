import { Button, cn } from '@salon-spa-saas/ui';
import {
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Download,
  Filter,
  Megaphone,
  Percent,
  Tag,
  TrendingUp,
  UserX,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { UniversalExportModal } from './UniversalExportModal';

export interface CampaignROI {
  id: string;
  name: string;
  channel: string;
  audience: string;
  delivered: string;
  booked: number;
  attended: number;
  revenue: string;
  couponsUsed: number;
  optOutRate: string;
  roiMultiplier: string;
}

const mockCampaigns: CampaignROI[] = [
  {
    id: 'CMP-ROI-01',
    name: 'Monsoon Hair Spa & Hydra Glow Rejuvenation',
    channel: 'WhatsApp & SMS',
    audience: 'VIP & High-LTV Skincare Clients',
    delivered: '16,200',
    booked: 1420,
    attended: 1240,
    revenue: '₹16,80,000',
    couponsUsed: 1380,
    optOutRate: '0.4%',
    roiMultiplier: '8.4x ROI',
  },
  {
    id: 'CMP-ROI-02',
    name: 'Pre-Festive Raksha Bandhan Glow Voucher',
    channel: 'SMS & App Push',
    audience: 'All Active Clients (Last 90d)',
    delivered: '18,500',
    booked: 1280,
    attended: 1090,
    revenue: '₹12,40,000',
    couponsUsed: 1450,
    optOutRate: '0.6%',
    roiMultiplier: '7.1x ROI',
  },
  {
    id: 'CMP-ROI-03',
    name: 'Dormant Client Winback (₹500 Gift Credit)',
    channel: 'Email & WhatsApp',
    audience: 'Inactive Cohort (60-120d Lapsed)',
    delivered: '8,400',
    booked: 620,
    attended: 510,
    revenue: '₹5,80,000',
    couponsUsed: 780,
    optOutRate: '1.2%',
    roiMultiplier: '4.9x ROI',
  },
  {
    id: 'CMP-ROI-04',
    name: 'Bridal Couture Luxe Consultation Blast',
    channel: 'Direct Concierge & IG Ads',
    audience: 'High-Intent Wedding Leads',
    delivered: '5,400',
    booked: 320,
    attended: 280,
    revenue: '₹3,40,000',
    couponsUsed: 510,
    optOutRate: '0.3%',
    roiMultiplier: '6.2x ROI',
  },
];

export function MarketingAnalyticsTab() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('Current Quarter');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 8 Marketing Campaign KPIs (Section 7 PRD)
  const mktKpis = [
    {
      title: 'Active Campaigns',
      value: '4 Campaigns',
      sub: 'Cross-Channel',
      isPos: true,
      icon: Megaphone,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Total Reach / Delivered',
      value: '48,500',
      sub: '98.6% Deliverability',
      isPos: true,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Direct Bookings',
      value: '3,640',
      sub: '7.5% Inflow Rate',
      isPos: true,
      icon: Calendar,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Attended Visits',
      value: '3,120',
      sub: '85.7% Show-up Rate',
      isPos: true,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Attributed Revenue',
      value: '₹38,40,000',
      sub: 'Gross Campaign GMV',
      isPos: true,
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Coupon Redemptions',
      value: '4,120',
      sub: 'Promotional Vouchers',
      isPos: true,
      icon: Tag,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Audience Opt-Outs',
      value: '0.8%',
      sub: '388 Unsubscribes',
      isPos: true,
      icon: UserX,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      title: 'Campaign ROI',
      value: '7.2x Return',
      sub: 'Net Marketing Yield',
      isPos: true,
      icon: Award,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
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
        reportTitle="Marketing Campaign ROI & Conversion Dossier"
        defaultCategory="Marketing"
        availableColumns={[
          'Campaign Name',
          'Delivery Channel',
          'Target Audience Segment',
          'Audience Delivered',
          'Bookings Captured',
          'Visits Attended',
          'Revenue Generated (₹)',
          'Coupons Redeemed',
          'Opt-Out Rate (%)',
          'Campaign ROI',
        ]}
        onExportComplete={(fmt, title) =>
          showToast(`Successfully exported ${title} in ${fmt} format.`)
        }
      />

      {/* 1. Global Filter Bar & Export Actions */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Branch Scope */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Salon Outlets (Network-wide)</option>
              <option value="indore-vn">Indore - Vijay Nagar Flagship</option>
              <option value="indore-pal">Indore - Palasia Premium</option>
              <option value="bhopal-arera">Bhopal - Arera Colony</option>
              <option value="ujjain-free">Ujjain - Freeganj Studio</option>
              <option value="gwalior-cc">Gwalior - City Centre</option>
            </select>
          </div>

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
              <option value="Financial YTD">Financial YTD (FY26-27)</option>
            </select>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsExportOpen(true)}
          className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Export Marketing Data</span>
        </Button>
      </div>

      {/* 2. 8 KPI Metric Cards Grid (Section 7 PRD) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {mktKpis.map((kpi, idx) => {
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
                </div>
                <span className="text-[9px] font-bold text-soft uppercase tracking-wider block">
                  {kpi.title}
                </span>
                <strong className="text-sm font-serif font-bold text-ink mt-0.5 block truncate">
                  {kpi.value}
                </strong>
              </div>
              <div className="mt-1.5 pt-1 border-t border-slate-100 text-[9px] text-muted truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Campaign ROI Master Table (Section 7 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Marketing Campaign Conversion &amp; ROI Ledger
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                Campaign ROI Model
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Audience delivery, appointment bookings captured, attended footfall, attributed
              revenue, coupon usage, and opt-outs
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">4 Active Campaigns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Campaign Name &amp; Channel</th>
                <th className="p-3.5">Audience Segment</th>
                <th className="p-3.5 text-center">Delivered</th>
                <th className="p-3.5 text-center">Bookings</th>
                <th className="p-3.5 text-center">Attended</th>
                <th className="p-3.5 text-right font-bold text-ink">Revenue (₹)</th>
                <th className="p-3.5 text-center">Coupons Used</th>
                <th className="p-3.5 text-center">Opt-Outs</th>
                <th className="p-3.5 pr-5 text-right font-extrabold text-[#5A2EA6]">
                  ROI Multiplier
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {mockCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{c.name}</strong>
                    <span className="text-[10px] text-muted">{c.channel}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">
                    {c.audience}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-mono text-slate-900">
                    {c.delivered}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-indigo-700">
                    {c.booked.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-emerald-700">
                    {c.attended.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-extrabold text-[#5A2EA6] text-sm">
                    {c.revenue}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-slate-800">
                    {c.couponsUsed.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap text-rose-700 font-semibold">
                    {c.optOutRate}
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.roiMultiplier}
                    </span>
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
