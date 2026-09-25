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
  FileCheck,
  Filter,
  Percent,
  ShieldCheck,
  Star,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { UniversalExportModal } from './UniversalExportModal';

export interface FranchiseScorecard {
  id: string;
  partnerName: string;
  code: string;
  region: string;
  locationsCount: number;
  revenue: string;
  utilisation: string;
  rating: string;
  royaltyFees: string;
  complianceScore: string;
  status: 'Active' | 'Pending' | 'Under Review';
}

const mockFranchiseScorecards: FranchiseScorecard[] = [
  {
    id: 'FP-SC-01',
    partnerName: 'Apex Wellness & Spa LLP',
    code: 'FP-IND-01',
    region: 'Indore & Malwa Region',
    locationsCount: 3,
    revenue: '₹24,80,000',
    utilisation: '88.4%',
    rating: '4.92',
    royaltyFees: '₹2,48,000',
    complianceScore: '98.5%',
    status: 'Active',
  },
  {
    id: 'FP-SC-02',
    partnerName: 'Radiance Salon Ventures',
    code: 'FP-BHP-02',
    region: 'Bhopal & Central MP',
    locationsCount: 2,
    revenue: '₹18,50,000',
    utilisation: '84.2%',
    rating: '4.85',
    royaltyFees: '₹1,85,000',
    complianceScore: '95.0%',
    status: 'Active',
  },
  {
    id: 'FP-SC-03',
    partnerName: 'Mahakal Beauty Partners',
    code: 'FP-UJJ-03',
    region: 'Ujjain Spiritual Circuit',
    locationsCount: 2,
    revenue: '₹14,20,000',
    utilisation: '81.8%',
    rating: '4.80',
    royaltyFees: '₹1,42,000',
    complianceScore: '92.0%',
    status: 'Active',
  },
  {
    id: 'FP-SC-04',
    partnerName: 'Gwalior Royal Spa Co.',
    code: 'FP-GWL-04',
    region: 'Gwalior & Chambal',
    locationsCount: 2,
    revenue: '₹12,40,000',
    utilisation: '79.2%',
    rating: '4.75',
    royaltyFees: '₹1,24,000',
    complianceScore: '89.0%',
    status: 'Active',
  },
  {
    id: 'FP-SC-05',
    partnerName: 'Jabalpur Luxe Salons',
    code: 'FP-JBL-05',
    region: 'Jabalpur & Mahakoshal',
    locationsCount: 1,
    revenue: '₹9,60,000',
    utilisation: '78.5%',
    rating: '4.82',
    royaltyFees: '₹96,000',
    complianceScore: '94.0%',
    status: 'Active',
  },
];

export function FranchiseAnalyticsTab() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('Current Quarter');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 6 Franchise KPIs (Section 8 PRD)
  const franKpis = [
    {
      title: 'Franchise Locations',
      value: '18 Outlets',
      sub: 'Across 6 Clusters',
      isPos: true,
      icon: Store,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Franchise Gross GMV',
      value: '₹86,50,000',
      sub: '+21.4% YoY Growth',
      isPos: true,
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Network Utilisation',
      value: '82.4%',
      sub: 'Workstation Pacing',
      isPos: true,
      icon: Percent,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Customer CSAT Rating',
      value: '4.80 / 5.0',
      sub: 'From 3,400 Ratings',
      isPos: true,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Royalty Accrued (10%)',
      value: '₹8,65,000',
      sub: 'Brand Fee Pool',
      isPos: true,
      icon: Award,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Statutory Compliance',
      value: '96.5%',
      sub: 'Audit Health Score',
      isPos: true,
      icon: ShieldCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
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
        reportTitle="Franchise Performance & Royalty Scorecard"
        defaultCategory="Franchise"
        availableColumns={[
          'Franchise Partner Entity',
          'Territory Region',
          'Outlets Count',
          'Gross Revenue GMV (₹)',
          'Chair Utilisation (%)',
          'Customer Rating',
          'Royalty Fees Accrued (₹)',
          'Compliance Audit Score (%)',
        ]}
        onExportComplete={(fmt, title) =>
          showToast(`Successfully exported ${title} in ${fmt} format.`)
        }
      />

      {/* 1. Global Filter Bar & Export Actions */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Territory Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Franchise Territories (6 Clusters)</option>
              <option value="Indore">Indore &amp; Malwa Region</option>
              <option value="Bhopal">Bhopal &amp; Central MP</option>
              <option value="Ujjain">Ujjain Spiritual Circuit</option>
              <option value="Gwalior">Gwalior &amp; Chambal</option>
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
          <span>Export Franchise Scorecard</span>
        </Button>
      </div>

      {/* 2. 6 KPI Metric Cards Grid (Section 8 PRD) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {franKpis.map((kpi, idx) => {
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

      {/* 3. Franchise Scorecard Matrix (Section 8 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Franchise Partner Performance Scorecard
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                PRD Franchise Scorecard
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Revenue, compliance, utilisation, customer ratings, and brand fee accruals across
              licensed partners
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">5 Active Partner Entities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Franchise Partner &amp; Code</th>
                <th className="p-3.5">Territory Region</th>
                <th className="p-3.5 text-center">Outlets</th>
                <th className="p-3.5 text-right font-bold text-ink">Gross GMV (₹)</th>
                <th className="p-3.5 text-center">Chair Utilisation</th>
                <th className="p-3.5 text-center">CSAT Rating</th>
                <th className="p-3.5 text-right font-bold text-[#5A2EA6]">Royalty Fees (10%)</th>
                <th className="p-3.5 pr-5 text-right">Compliance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {mockFranchiseScorecards.map((fs) => (
                <tr key={fs.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{fs.partnerName}</strong>
                    <span className="text-[10px] text-muted font-mono">{fs.code}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">
                    {fs.region}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                    {fs.locationsCount}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-extrabold text-slate-900 text-sm">
                    {fs.revenue}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-blue-700">
                    {fs.utilisation}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-amber-700">
                    ★ {fs.rating}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-bold text-[#5A2EA6]">
                    {fs.royaltyFees}
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {fs.complianceScore}
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
