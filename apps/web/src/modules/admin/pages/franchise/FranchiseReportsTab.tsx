import { Button, cn } from '@salon-spa-saas/ui';
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Printer,
  Search,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

interface ReportTemplate {
  id: string;
  name: string;
  category: 'Partner' | 'Location' | 'Agreement' | 'Commission';
  description: string;
  columns: string[];
  mockData: Record<string, string | number>[];
}

const reportTemplates: ReportTemplate[] = [
  // 1. Partner Reports
  {
    id: 'rep-part-01',
    name: 'Franchise Partner Summary Dossier',
    category: 'Partner',
    description:
      'Comprehensive entity registry, contact leadership, active location count, and agreement status',
    columns: [
      'Partner Name',
      'Entity Code',
      'Contact Lead',
      'Active / Total Outlets',
      'Agreement State',
      'Gross GMV',
      'Brand Royalty (10%)',
      'Status',
    ],
    mockData: [
      {
        'Partner Name': 'Apex Wellness & Spa LLP',
        'Entity Code': 'FP-IND-01',
        'Contact Lead': 'Sanjay Chawla',
        'Active / Total Outlets': '3 / 3 Outlets',
        'Agreement State': 'Active',
        'Gross GMV': '₹24,80,000',
        'Brand Royalty (10%)': '₹2,48,000',
        Status: 'Active',
      },
      {
        'Partner Name': 'Radiance Salon Ventures',
        'Entity Code': 'FP-BHP-02',
        'Contact Lead': 'Neha Kulkarni',
        'Active / Total Outlets': '2 / 2 Outlets',
        'Agreement State': 'Active',
        'Gross GMV': '₹18,50,000',
        'Brand Royalty (10%)': '₹1,85,000',
        Status: 'Active',
      },
      {
        'Partner Name': 'Mahakal Beauty Partners',
        'Entity Code': 'FP-UJJ-03',
        'Contact Lead': 'Pt. Rameshwar Sharma',
        'Active / Total Outlets': '2 / 2 Outlets',
        'Agreement State': 'Active',
        'Gross GMV': '₹14,20,000',
        'Brand Royalty (10%)': '₹1,42,000',
        Status: 'Active',
      },
      {
        'Partner Name': 'Gwalior Royal Spa Co.',
        'Entity Code': 'FP-GWL-04',
        'Contact Lead': 'Raja Vikramaditya',
        'Active / Total Outlets': '2 / 2 Outlets',
        'Agreement State': 'Expiring Soon',
        'Gross GMV': '₹12,40,000',
        'Brand Royalty (10%)': '₹1,24,000',
        Status: 'Active',
      },
      {
        'Partner Name': 'Zenith Esthetics Pvt Ltd',
        'Entity Code': 'FP-RPR-05',
        'Contact Lead': 'Deepak Agrawal',
        'Active / Total Outlets': '0 / 1 Outlets',
        'Agreement State': 'Draft',
        'Gross GMV': '₹0',
        'Brand Royalty (10%)': '₹0',
        Status: 'Pending',
      },
    ],
  },
  {
    id: 'rep-part-02',
    name: 'Partner Performance & Footfall Matrix',
    category: 'Partner',
    description:
      'Quarterly appointments, active client counts, average spend, and year-over-year revenue pacing',
    columns: [
      'Partner Name',
      'Quarterly Footfall',
      'New Clients',
      'Returning Clients',
      'Avg Ticket Size',
      'YoY Growth',
      'Rank',
    ],
    mockData: [
      {
        'Partner Name': 'Apex Wellness & Spa LLP',
        'Quarterly Footfall': '3,840 Visits',
        'New Clients': '1,120',
        'Returning Clients': '2,720',
        'Avg Ticket Size': '₹2,050',
        'YoY Growth': '+18.2%',
        Rank: '#1 Top GMV',
      },
      {
        'Partner Name': 'Radiance Salon Ventures',
        'Quarterly Footfall': '2,650 Visits',
        'New Clients': '780',
        'Returning Clients': '1,870',
        'Avg Ticket Size': '₹2,010',
        'YoY Growth': '+14.5%',
        Rank: '#2 Top GMV',
      },
      {
        'Partner Name': 'Mahakal Beauty Partners',
        'Quarterly Footfall': '1,980 Visits',
        'New Clients': '610',
        'Returning Clients': '1,370',
        'Avg Ticket Size': '₹1,690',
        'YoY Growth': '+22.0%',
        Rank: '#3 Top GMV',
      },
      {
        'Partner Name': 'Gwalior Royal Spa Co.',
        'Quarterly Footfall': '1,720 Visits',
        'New Clients': '510',
        'Returning Clients': '1,210',
        'Avg Ticket Size': '₹1,746',
        'YoY Growth': '+11.8%',
        Rank: '#4 Top GMV',
      },
    ],
  },
  // 2. Location Reports
  {
    id: 'rep-loc-01',
    name: 'Location Revenue & Outlet Performance',
    category: 'Location',
    description: 'Branch-by-branch customer sales, 10% royalty generation, and operational health',
    columns: [
      'Outlet Location',
      'Partner Entity',
      'City Cluster',
      'Quarterly GMV',
      'Royalty Accrual',
      'Settlement Status',
      'Operational State',
    ],
    mockData: [
      {
        'Outlet Location': 'Indore Vijay Nagar Flagship',
        'Partner Entity': 'Apex Wellness LLP',
        'City Cluster': 'Indore, MP',
        'Quarterly GMV': '₹14,20,000',
        'Royalty Accrual': '₹1,42,000',
        'Settlement Status': 'Settled',
        'Operational State': 'Active',
      },
      {
        'Outlet Location': 'Bhopal Arera Colony Lounge',
        'Partner Entity': 'Radiance Salon Ventures',
        'City Cluster': 'Bhopal, MP',
        'Quarterly GMV': '₹12,10,000',
        'Royalty Accrual': '₹1,21,000',
        'Settlement Status': 'Pending Clearing',
        'Operational State': 'Active',
      },
      {
        'Outlet Location': 'Ujjain Freeganj Main Studio',
        'Partner Entity': 'Mahakal Beauty Partners',
        'City Cluster': 'Ujjain, MP',
        'Quarterly GMV': '₹9,40,000',
        'Royalty Accrual': '₹94,000',
        'Settlement Status': 'Settled',
        'Operational State': 'Active',
      },
      {
        'Outlet Location': 'Gwalior City Centre Hub',
        'Partner Entity': 'Gwalior Royal Spa Co.',
        'City Cluster': 'Gwalior, MP',
        'Quarterly GMV': '₹8,10,000',
        'Royalty Accrual': '₹81,000',
        'Settlement Status': 'Settled',
        'Operational State': 'Active',
      },
      {
        'Outlet Location': 'Indore Palasia Premium Outlet',
        'Partner Entity': 'Apex Wellness LLP',
        'City Cluster': 'Indore, MP',
        'Quarterly GMV': '₹6,80,000',
        'Royalty Accrual': '₹68,000',
        'Settlement Status': 'Settled',
        'Operational State': 'Active',
      },
    ],
  },
  // 3. Agreement Reports
  {
    id: 'rep-agr-01',
    name: 'Agreement Expiry & Statutory Compliance Audit',
    category: 'Agreement',
    description:
      'Contractual terms, legal validity dates, upcoming renewal windows, and trade license compliance status',
    columns: [
      'Agreement ID',
      'Contract Model',
      'Partner Entity',
      'Start Date',
      'Expiry Date',
      'Renewal Window',
      'Compliance Score',
    ],
    mockData: [
      {
        'Agreement ID': 'AGR-2024-001',
        'Contract Model': 'Multi-Unit FOCO',
        'Partner Entity': 'Apex Wellness LLP',
        'Start Date': '01 Jan 2024',
        'Expiry Date': '31 Dec 2028',
        'Renewal Window': '01 Oct 2028',
        'Compliance Score': '100% Compliant',
      },
      {
        'Agreement ID': 'AGR-2024-002',
        'Contract Model': 'Single Unit FOFO',
        'Partner Entity': 'Radiance Salon Ventures',
        'Start Date': '15 Mar 2024',
        'Expiry Date': '14 Mar 2029',
        'Renewal Window': '15 Dec 2028',
        'Compliance Score': '100% Compliant',
      },
      {
        'Agreement ID': 'AGR-2021-008',
        'Contract Model': 'Single Unit FOFO',
        'Partner Entity': 'Gwalior Royal Spa Co.',
        'Start Date': '12 Sep 2021',
        'Expiry Date': '11 Sep 2026',
        'Renewal Window': '12 Jun 2026',
        'Compliance Score': 'Expiring Soon',
      },
      {
        'Agreement ID': 'AGR-2024-003',
        'Contract Model': 'Single Unit FOFO',
        'Partner Entity': 'Mahakal Beauty Partners',
        'Start Date': '01 Jun 2024',
        'Expiry Date': '31 May 2029',
        'Renewal Window': '01 Mar 2029',
        'Compliance Score': 'Pending Audit',
      },
    ],
  },
  // 4. Commission Reports
  {
    id: 'rep-com-01',
    name: 'Partner-wise Commission & Royalty Statement',
    category: 'Commission',
    description:
      'Monthly calculation vouchers, base royalty computations, marketing fund levies, and payout clearance ledger',
    columns: [
      'Voucher ID',
      'Period',
      'Partner Entity',
      'Gross GMV',
      'Base Royalty Rate',
      'Brand Royalty (₹)',
      'Net Payable (₹)',
      'Status',
    ],
    mockData: [
      {
        'Voucher ID': 'ROY-2026-081',
        Period: 'July 2026',
        'Partner Entity': 'Apex Wellness LLP',
        'Gross GMV': '₹14,20,000',
        'Base Royalty Rate': '10% Services + 5% Retail',
        'Brand Royalty (₹)': '₹1,33,000',
        'Net Payable (₹)': '₹1,57,800',
        Status: 'Settled',
      },
      {
        'Voucher ID': 'ROY-2026-082',
        Period: 'July 2026',
        'Partner Entity': 'Radiance Salon Ventures',
        'Gross GMV': '₹12,10,000',
        'Base Royalty Rate': '10% Flat Turnover',
        'Brand Royalty (₹)': '₹1,21,000',
        'Net Payable (₹)': '₹1,45,200',
        Status: 'Outstanding',
      },
      {
        'Voucher ID': 'ROY-2026-083',
        Period: 'July 2026',
        'Partner Entity': 'Mahakal Beauty Partners',
        'Gross GMV': '₹9,40,000',
        'Base Royalty Rate': '8.5% Gross Services',
        'Brand Royalty (₹)': '₹73,100',
        'Net Payable (₹)': '₹84,200',
        Status: 'Settled',
      },
      {
        'Voucher ID': 'ROY-2026-084',
        Period: 'July 2026',
        'Partner Entity': 'Gwalior Royal Spa Co.',
        'Gross GMV': '₹8,10,000',
        'Base Royalty Rate': '10% Flat Turnover',
        'Brand Royalty (₹)': '₹81,000',
        'Net Payable (₹)': '₹93,150',
        Status: 'Approved',
      },
    ],
  },
];

export function FranchiseReportsTab() {
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | 'Partner' | 'Location' | 'Agreement' | 'Commission'
  >('All');
  const [activeTemplate, setActiveTemplate] = useState<ReportTemplate>(reportTemplates[0]);
  const [selectedDateRange, setSelectedDateRange] = useState('Current Quarter');
  const [selectedPartnerFilter, setSelectedPartnerFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTemplates = reportTemplates.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Category Pill Filter Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#5A2EA6]/10 pb-3">
        {(['All', 'Partner', 'Location', 'Agreement', 'Commission'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer',
              selectedCategory === cat
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-[#5A2EA6]/5 border border-slate-200',
            )}
          >
            <span>{cat === 'All' ? 'All Report Formats' : `${cat} Reports`}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Left Column: Template Selection Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-ink">Select Standard Report Model</span>
            <span className="text-[10px] text-muted font-semibold">
              {filteredTemplates.length} Available
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredTemplates.map((tmpl) => {
              const isSelected = activeTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setActiveTemplate(tmpl)}
                  className={cn(
                    'p-3.5 rounded-2xl border transition-all cursor-pointer text-left',
                    isSelected
                      ? 'bg-[#F8F5FF] border-[#5A2EA6] shadow-sm ring-1 ring-[#5A2EA6]/20'
                      : 'bg-white border-slate-200 hover:border-[#5A2EA6]/40 hover:bg-slate-50/50',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6]">
                      {tmpl.category} Report
                    </span>
                    <ChevronRight
                      className={cn(
                        'w-3.5 h-3.5',
                        isSelected ? 'text-[#5A2EA6]' : 'text-slate-400',
                      )}
                    />
                  </div>
                  <strong className="text-xs font-bold text-ink block">{tmpl.name}</strong>
                  <p className="text-[11px] text-muted mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Right Column: Report Customizer & Live Preview Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                  Live Report Engine
                </span>
                <h3 className="font-serif font-bold text-ink text-base mt-1">
                  {activeTemplate.name}
                </h3>
              </div>

              {/* Multi-Format Export Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => showToast(`Exporting ${activeTemplate.name} in CSV format...`)}
                  className="h-[32px] px-2.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  <span>CSV</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    showToast(`Exporting ${activeTemplate.name} in Excel (.xlsx) format...`)
                  }
                  className="h-[32px] px-2.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  <span>Excel</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    showToast(`Generating official PDF Document for ${activeTemplate.name}...`)
                  }
                  className="h-[32px] px-2.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  <span>PDF</span>
                </Button>
              </div>
            </div>

            {/* Parameter Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-soft font-bold block mb-1">Time Horizon</label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
                >
                  <option value="Current Quarter">Current Quarter (Q2 FY26-27)</option>
                  <option value="Current Month">Current Month (Aug 2026)</option>
                  <option value="Financial YTD">Financial YTD (FY26-27)</option>
                </select>
              </div>

              <div>
                <label className="text-soft font-bold block mb-1">Franchise Partner Filter</label>
                <select
                  value={selectedPartnerFilter}
                  onChange={(e) => setSelectedPartnerFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
                >
                  <option value="all">All Franchise Partners (Full Network)</option>
                  <option value="FP-IND-01">Apex Wellness &amp; Spa LLP</option>
                  <option value="FP-BHP-02">Radiance Salon Ventures</option>
                  <option value="FP-UJJ-03">Mahakal Beauty Partners</option>
                  <option value="FP-GWL-04">Gwalior Royal Spa Co.</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Data Preview Table */}
          <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-[#5A2EA6]/10 flex items-center justify-between bg-[#FCFAFF]">
              <span className="text-xs font-bold text-ink">
                Preview Canvas ({activeTemplate.mockData.length} Sample Records)
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Ready for Generation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] uppercase whitespace-nowrap">
                    {activeTemplate.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className={cn(
                          'p-3',
                          idx === 0 ? 'pl-4' : '',
                          idx === activeTemplate.columns.length - 1 ? 'pr-4' : '',
                          col.includes('GMV') ||
                            col.includes('Royalty') ||
                            col.includes('Payable') ||
                            col.includes('Size')
                            ? 'text-right'
                            : '',
                        )}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                  {activeTemplate.mockData.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                      {activeTemplate.columns.map((col, cIdx) => (
                        <td
                          key={cIdx}
                          className={cn(
                            'p-3 whitespace-nowrap',
                            cIdx === 0 ? 'pl-4 font-bold text-ink' : '',
                            cIdx === activeTemplate.columns.length - 1 ? 'pr-4' : '',
                            col.includes('GMV') ||
                              col.includes('Royalty') ||
                              col.includes('Payable')
                              ? 'text-right font-serif font-bold text-[#5A2EA6]'
                              : '',
                          )}
                        >
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
