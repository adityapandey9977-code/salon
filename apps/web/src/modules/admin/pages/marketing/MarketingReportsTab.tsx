import { Button, cn } from '@salon-spa-saas/ui';
import {
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Megaphone,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

interface ReportTemplate {
  id: string;
  name: string;
  category: 'Campaign' | 'Promotion' | 'Client' | 'Loyalty';
  description: string;
  dimensions: string[];
  sampleData: Record<string, any>[];
}

const mockReportCategories = [
  {
    id: 'campaign',
    name: 'Campaign Reports',
    icon: Megaphone,
    reports: [
      {
        id: 'rep-cmp-01',
        name: 'Campaign Conversion & Revenue Performance',
        category: 'Campaign' as const,
        description:
          'Multi-channel promotional outreach reach, open rates, redemptions, and attributed salon turnover.',
        dimensions: [
          'Campaign Name',
          'Target Segment',
          'Audience Reach',
          'Engagement Rate',
          'Redemptions',
          'Attributed Revenue',
          'ROI Multiplier',
        ],
        sampleData: [
          {
            'Campaign Name': 'Monsoon Hair Spa & Keratin Revival',
            'Target Segment': 'Hair Care VIPs',
            'Audience Reach': '18,400',
            'Engagement Rate': '24.2%',
            Redemptions: '1,420',
            'Attributed Revenue': '₹9,20,000',
            'ROI Multiplier': '5.2x',
          },
          {
            'Campaign Name': 'Bridal Glow Aesthetics Pre-Booking',
            'Target Segment': 'Bridal Inquiries',
            'Audience Reach': '12,000',
            'Engagement Rate': '31.5%',
            Redemptions: '940',
            'Attributed Revenue': '₹8,50,000',
            'ROI Multiplier': '6.1x',
          },
          {
            'Campaign Name': 'VIP Platinum Double Points Blitz',
            'Target Segment': 'Platinum Members',
            'Audience Reach': '8,200',
            'Engagement Rate': '44.8%',
            Redemptions: '680',
            'Attributed Revenue': '₹4,10,000',
            'ROI Multiplier': '4.4x',
          },
          {
            'Campaign Name': 'Summer Refresh Express Glow',
            'Target Segment': 'All Clients',
            'Audience Reach': '22,000',
            'Engagement Rate': '28.0%',
            Redemptions: '1,890',
            'Attributed Revenue': '₹11,40,000',
            'ROI Multiplier': '5.8x',
          },
        ],
      },
      {
        id: 'rep-cmp-02',
        name: 'Campaign Redemptions & Footfall Pacing',
        category: 'Campaign' as const,
        description:
          'Weekly booking pace and redemption volume generated through marketing campaigns.',
        dimensions: [
          'Campaign Name',
          'Week 1 Uses',
          'Week 2 Uses',
          'Week 3 Uses',
          'Week 4 Uses',
          'Total Redemptions',
          'Redemption Rate',
        ],
        sampleData: [
          {
            'Campaign Name': 'Monsoon Hair Spa & Keratin Revival',
            'Week 1 Uses': '240',
            'Week 2 Uses': '420',
            'Week 3 Uses': '510',
            'Week 4 Uses': '250',
            'Total Redemptions': '1,420',
            'Redemption Rate': '7.7%',
          },
          {
            'Campaign Name': 'Bridal Glow Aesthetics Pre-Booking',
            'Week 1 Uses': '180',
            'Week 2 Uses': '290',
            'Week 3 Uses': '310',
            'Week 4 Uses': '160',
            'Total Redemptions': '940',
            'Redemption Rate': '7.8%',
          },
        ],
      },
    ],
  },
  {
    id: 'promotion',
    name: 'Promotion Reports',
    icon: Tag,
    reports: [
      {
        id: 'rep-prm-01',
        name: 'Offer Usage & Discount Valuation',
        category: 'Promotion' as const,
        description:
          'Coupon code redemptions, gross billing, discount absorbed, and net collections.',
        dimensions: [
          'Promo Code',
          'Offer Format',
          'Total Uses',
          'Gross Booking Value',
          'Discount Absorbed',
          'Net Revenue',
          'Avg Ticket Size',
        ],
        sampleData: [
          {
            'Promo Code': 'GLOW20',
            'Offer Format': '20% Percentage Off',
            'Total Uses': '1,420',
            'Gross Booking Value': '₹11,50,000',
            'Discount Absorbed': '₹2,30,000',
            'Net Revenue': '₹9,20,000',
            'Avg Ticket Size': '₹8,098',
          },
          {
            'Promo Code': 'WELCOME500',
            'Offer Format': '₹500 Cash Voucher',
            'Total Uses': '2,840',
            'Gross Booking Value': '₹15,62,000',
            'Discount Absorbed': '₹1,42,000',
            'Net Revenue': '₹14,20,000',
            'Avg Ticket Size': '₹5,500',
          },
          {
            'Promo Code': 'BRIDALSPA',
            'Offer Format': 'Complimentary Upgrade',
            'Total Uses': '380',
            'Gross Booking Value': '₹3,80,000',
            'Discount Absorbed': '₹38,000',
            'Net Revenue': '₹3,42,000',
            'Avg Ticket Size': '₹10,000',
          },
        ],
      },
      {
        id: 'rep-prm-02',
        name: 'Branch-Wise Promotion Performance',
        category: 'Promotion' as const,
        description: 'Outlet level redemption density, discount yield, and revenue contribution.',
        dimensions: [
          'Salon Outlet',
          'Active Offers',
          'Total Redemptions',
          'Discount Absorbed',
          'Attributed Net Revenue',
          'Share of Revenue',
        ],
        sampleData: [
          {
            'Salon Outlet': 'Indore Central Flagship',
            'Active Offers': '6 Offers',
            'Total Redemptions': '1,420',
            'Discount Absorbed': '₹1,85,000',
            'Attributed Net Revenue': '₹9,80,000',
            'Share of Revenue': '41.7%',
          },
          {
            'Salon Outlet': 'Vijay Nagar Boutique',
            'Active Offers': '5 Offers',
            'Total Redemptions': '980',
            'Discount Absorbed': '₹1,20,000',
            'Attributed Net Revenue': '₹6,45,000',
            'Share of Revenue': '27.4%',
          },
          {
            'Salon Outlet': 'Bhopal Arera Colony',
            'Active Offers': '4 Offers',
            'Total Redemptions': '540',
            'Discount Absorbed': '₹75,000',
            'Attributed Net Revenue': '₹3,90,000',
            'Share of Revenue': '16.6%',
          },
          {
            'Salon Outlet': 'Ujjain Mahakal Road',
            'Active Offers': '3 Offers',
            'Total Redemptions': '280',
            'Discount Absorbed': '₹38,000',
            'Attributed Net Revenue': '₹1,95,000',
            'Share of Revenue': '8.3%',
          },
          {
            'Salon Outlet': 'Gwalior City Centre',
            'Active Offers': '3 Offers',
            'Total Redemptions': '200',
            'Discount Absorbed': '₹28,000',
            'Attributed Net Revenue': '₹1,40,000',
            'Share of Revenue': '6.0%',
          },
        ],
      },
    ],
  },
  {
    id: 'client',
    name: 'Client Acquisition Reports',
    icon: Users,
    reports: [
      {
        id: 'rep-cli-01',
        name: 'New vs. Returning Client Engagement',
        category: 'Client' as const,
        description:
          'First-time client acquisition velocity versus repeat footfall retention and lifetime spend.',
        dimensions: [
          'Client Segment',
          'Enrolled Count',
          'Services Booked',
          'Total Turnover',
          'Avg Basket Value',
          'Return Frequency',
        ],
        sampleData: [
          {
            'Client Segment': 'First-Time Acquired Clients',
            'Enrolled Count': '680 Clients',
            'Services Booked': '1,020 Services',
            'Total Turnover': '₹4,85,000',
            'Avg Basket Value': '₹4,755',
            'Return Frequency': '1.5 visits',
          },
          {
            'Client Segment': 'Returning Regular Clients',
            'Enrolled Count': '2,740 Clients',
            'Services Booked': '5,890 Services',
            'Total Turnover': '₹18,65,000',
            'Avg Basket Value': '₹6,806',
            'Return Frequency': '3.8 visits',
          },
          {
            'Client Segment': 'VIP Loyalty Inner Circle',
            'Enrolled Count': '990 Clients',
            'Services Booked': '3,450 Services',
            'Total Turnover': '₹14,20,000',
            'Avg Basket Value': '₹14,343',
            'Return Frequency': '6.2 visits',
          },
        ],
      },
    ],
  },
  {
    id: 'loyalty',
    name: 'Loyalty Reports',
    icon: Award,
    reports: [
      {
        id: 'rep-loy-01',
        name: 'Loyalty Points Issuance & Burn Ledger',
        category: 'Loyalty' as const,
        description:
          'Brand-level reward currency audit tracking points credited, redeemed, expired, and active liability.',
        dimensions: [
          'Loyalty Tier',
          'Members Enrolled',
          'Points Accrued',
          'Points Redeemed',
          'Redemption Value',
          'Active Balance',
          'Burn Ratio',
        ],
        sampleData: [
          {
            'Loyalty Tier': 'Diamond Elite',
            'Members Enrolled': '210',
            'Points Accrued': '4,80,000 pts',
            'Points Redeemed': '3,90,000 pts',
            'Redemption Value': '₹3,90,000',
            'Active Balance': '90,000 pts',
            'Burn Ratio': '81.2%',
          },
          {
            'Loyalty Tier': 'Platinum VIP',
            'Members Enrolled': '780',
            'Points Accrued': '4,40,000 pts',
            'Points Redeemed': '3,20,000 pts',
            'Redemption Value': '₹3,20,000',
            'Active Balance': '1,20,000 pts',
            'Burn Ratio': '72.7%',
          },
          {
            'Loyalty Tier': 'Gold Preferred',
            'Members Enrolled': '1,680',
            'Points Accrued': '2,40,000 pts',
            'Points Redeemed': '1,40,000 pts',
            'Redemption Value': '₹1,40,000',
            'Active Balance': '1,00,000 pts',
            'Burn Ratio': '58.3%',
          },
          {
            'Loyalty Tier': 'Silver Entry',
            'Members Enrolled': '2,450',
            'Points Accrued': '80,000 pts',
            'Points Redeemed': '40,000 pts',
            'Redemption Value': '₹40,000',
            'Active Balance': '40,000 pts',
            'Burn Ratio': '50.0%',
          },
        ],
      },
    ],
  },
];

export function MarketingReportsTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('campaign');
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-cmp-01');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('This Month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentCategory =
    mockReportCategories.find((c) => c.id === selectedCategory) || mockReportCategories[0];
  const currentReport =
    currentCategory.reports.find((r) => r.id === selectedReportId) || currentCategory.reports[0];

  const handleExport = (format: string) => {
    showToast(`Exporting ${currentReport.name} in ${format} format...`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Filter Bar & Export Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Salon Outlets (5)</option>
              <option value="Indore Central">Indore Central Flagship</option>
              <option value="Vijay Nagar">Vijay Nagar Boutique</option>
              <option value="Bhopal">Bhopal Arera Colony</option>
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
              <option value="This Month">This Month (Aug 2026)</option>
              <option value="Last Month">Last Month (Jul 2026)</option>
              <option value="Last 90 Days">Last 90 Days (Q2/Q3)</option>
              <option value="Financial YTD">Financial YTD (FY26-27)</option>
            </select>
          </div>
        </div>

        {/* Multi-Format Export Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('CSV')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>CSV</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('Excel')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('PDF')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>PDF Walkthrough</span>
          </Button>
        </div>
      </div>

      {/* 2. Category Selector & Live Preview Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category List & Selector */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-2">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block px-1">
            Report Categories (4)
          </span>

          <div className="space-y-1.5">
            {mockReportCategories.map((cat) => {
              const IconComponent = cat.icon;
              const isCatActive = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  className={cn(
                    'rounded-2xl p-3 border transition cursor-pointer',
                    isCatActive
                      ? 'bg-[#F8F5FF] border-[#5A2EA6] shadow-xs'
                      : 'bg-white border-[#5A2EA6]/10 hover:border-[#5A2EA6]/30',
                  )}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedReportId(cat.reports[0].id);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-lg grid place-items-center shrink-0',
                          isCatActive ? 'bg-[#5A2EA6] text-white' : 'bg-purple-50 text-[#5A2EA6]',
                        )}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-ink truncate">{cat.name}</span>
                    </div>
                    <span className="text-[9px] font-bold text-muted bg-white px-2 py-0.5 rounded-full border border-slate-100 shrink-0">
                      {cat.reports.length} Template{cat.reports.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Nested Reports */}
                  {isCatActive && (
                    <div className="pt-2 mt-1 border-t border-purple-100/60 space-y-1">
                      {cat.reports.map((rep) => (
                        <button
                          key={rep.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReportId(rep.id);
                          }}
                          className={cn(
                            'w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border-0 flex items-center justify-between',
                            selectedReportId === rep.id
                              ? 'bg-[#5A2EA6] text-white font-bold shadow-xs'
                              : 'text-slate-700 hover:bg-purple-50',
                          )}
                        >
                          <span className="truncate">{rep.name}</span>
                          <ArrowRight className="w-3 h-3 shrink-0 ml-1 opacity-70" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Data Preview Canvas */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#5A2EA6]" />
                  <h3 className="font-serif font-bold text-ink text-base">{currentReport.name}</h3>
                </div>
                <p className="text-[11px] text-muted mt-0.5">{currentReport.description}</p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                Preview Generated
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                    {currentReport.dimensions.map((dim, i) => {
                      const isNum =
                        i > 0 &&
                        (dim.toLowerCase().includes('revenue') ||
                          dim.toLowerCase().includes('value') ||
                          dim.toLowerCase().includes('turnover') ||
                          dim.toLowerCase().includes('spend') ||
                          dim.toLowerCase().includes('discount') ||
                          dim.toLowerCase().includes('rate') ||
                          dim.toLowerCase().includes('reach') ||
                          dim.toLowerCase().includes('redemptions') ||
                          dim.toLowerCase().includes('uses') ||
                          dim.toLowerCase().includes('points') ||
                          dim.toLowerCase().includes('count') ||
                          dim.toLowerCase().includes('members') ||
                          dim.toLowerCase().includes('services') ||
                          dim.toLowerCase().includes('multiplier') ||
                          dim.toLowerCase().includes('share') ||
                          dim.toLowerCase().includes('ratio') ||
                          dim.toLowerCase().includes('frequency') ||
                          dim.toLowerCase().includes('basket') ||
                          dim.includes('%'));

                      return (
                        <th
                          key={dim}
                          className={cn(
                            'p-3.5',
                            i === 0 ? 'pl-5 text-left' : '',
                            isNum ? 'text-right' : 'text-left',
                            i === currentReport.dimensions.length - 1 ? 'pr-5 text-right' : '',
                          )}
                        >
                          {dim}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                  {currentReport.sampleData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                      {currentReport.dimensions.map((dim, cIdx) => {
                        const isNum =
                          cIdx > 0 &&
                          (dim.toLowerCase().includes('revenue') ||
                            dim.toLowerCase().includes('value') ||
                            dim.toLowerCase().includes('turnover') ||
                            dim.toLowerCase().includes('spend') ||
                            dim.toLowerCase().includes('discount') ||
                            dim.toLowerCase().includes('rate') ||
                            dim.toLowerCase().includes('reach') ||
                            dim.toLowerCase().includes('redemptions') ||
                            dim.toLowerCase().includes('uses') ||
                            dim.toLowerCase().includes('points') ||
                            dim.toLowerCase().includes('count') ||
                            dim.toLowerCase().includes('members') ||
                            dim.toLowerCase().includes('services') ||
                            dim.toLowerCase().includes('multiplier') ||
                            dim.toLowerCase().includes('share') ||
                            dim.toLowerCase().includes('ratio') ||
                            dim.toLowerCase().includes('frequency') ||
                            dim.toLowerCase().includes('basket') ||
                            dim.includes('%'));

                        const val = (row as Record<string, any>)[dim];
                        const isRev =
                          dim.toLowerCase().includes('revenue') ||
                          dim.toLowerCase().includes('turnover');

                        return (
                          <td
                            key={dim}
                            className={cn(
                              'p-3.5 whitespace-nowrap',
                              cIdx === 0 ? 'pl-5 font-bold text-ink text-left' : '',
                              isNum ? 'text-right' : 'text-left',
                              isRev ? 'font-bold text-ink' : '',
                              cIdx === currentReport.dimensions.length - 1
                                ? 'pr-5 text-right font-extrabold text-[#5A2EA6]'
                                : '',
                            )}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-soft">
              <span>
                Parameters: <strong>{selectedDateRange}</strong> · Branch:{' '}
                <strong>{selectedBranch}</strong>
              </span>
              <span className="text-[#5A2EA6] font-bold">100% Calculated &amp; Reconciled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
