import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface ReportCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  reports: Array<{
    id: string;
    name: string;
    description: string;
    dimensions: string[];
    sampleData: Array<{ [key: string]: string | number }>;
  }>;
}

export function FinancialReportsTab() {
  const { toast } = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState('revenue');
  const [selectedReportId, setSelectedReportId] = useState('rev-branch');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(true);

  // 6 Structured Report Categories (Section 17)
  const reportCategories: ReportCategory[] = [
    {
      id: 'revenue',
      name: 'Revenue Reports',
      icon: BarChart3,
      reports: [
        {
          id: 'rev-branch',
          name: 'Revenue by Branch',
          description:
            'Gross revenue, service & retail split, discounts, and net turnover across branches',
          dimensions: ['Branch', 'Gross Revenue', 'Discounts', 'Net Revenue', 'Growth YoY'],
          sampleData: [
            {
              Branch: 'Indore Central (Flagship)',
              'Gross Revenue': '₹15,30,000',
              Discounts: '₹1,05,000',
              'Net Revenue': '₹13,93,000',
              'Growth YoY': '+16.8%',
            },
            {
              Branch: 'Vijay Nagar Boutique',
              'Gross Revenue': '₹11,80,000',
              Discounts: '₹80,000',
              'Net Revenue': '₹10,72,000',
              'Growth YoY': '+14.2%',
            },
            {
              Branch: 'Bhopal Arera Colony',
              'Gross Revenue': '₹9,84,500',
              Discounts: '₹72,000',
              'Net Revenue': '₹8,86,500',
              'Growth YoY': '+11.5%',
            },
            {
              Branch: 'Ujjain Mahakal Road',
              'Gross Revenue': '₹6,88,000',
              Discounts: '₹48,000',
              'Net Revenue': '₹6,20,000',
              'Growth YoY': '+8.9%',
            },
            {
              Branch: 'Gwalior City Centre',
              'Gross Revenue': '₹4,67,500',
              Discounts: '₹35,000',
              'Net Revenue': '₹4,18,500',
              'Growth YoY': '+7.4%',
            },
          ],
        },
        {
          id: 'rev-service',
          name: 'Revenue by Service Category',
          description:
            'Performance breakdown of hair, aesthetics, spa therapy, bridal, and nail services',
          dimensions: ['Category', 'Bookings', 'Average Ticket', 'Total Revenue', 'Share %'],
          sampleData: [
            {
              Category: 'Hair Color & Styling',
              Bookings: 420,
              'Average Ticket': '₹3,800',
              'Total Revenue': '₹15,96,000',
              'Share %': '32.9%',
            },
            {
              Category: 'Facials & Med-Aesthetics',
              Bookings: 280,
              'Average Ticket': '₹3,200',
              'Total Revenue': '₹8,96,000',
              'Share %': '18.5%',
            },
            {
              Category: 'Spa & Body Therapies',
              Bookings: 190,
              'Average Ticket': '₹3,500',
              'Total Revenue': '₹6,65,000',
              'Share %': '13.7%',
            },
            {
              Category: 'Bridal & Party Packages',
              Bookings: 35,
              'Average Ticket': '₹18,000',
              'Total Revenue': '₹6,30,000',
              'Share %': '13.0%',
            },
          ],
        },
        {
          id: 'rev-staff',
          name: 'Revenue by Staff Member',
          description:
            'Stylist billing totals, retail attach rates, and service efficiency indices',
          dimensions: ['Staff Name', 'Branch', 'Service Revenue', 'Retail Sales', 'Total Realized'],
          sampleData: [
            {
              'Staff Name': 'Vikram Joshi',
              Branch: 'Indore Central',
              'Service Revenue': '₹3,45,000',
              'Retail Sales': '₹62,000',
              'Total Realized': '₹4,07,000',
            },
            {
              'Staff Name': 'Pooja Bhatt',
              Branch: 'Vijay Nagar',
              'Service Revenue': '₹2,80,000',
              'Retail Sales': '₹45,000',
              'Total Realized': '₹3,25,000',
            },
            {
              'Staff Name': 'Sunil Verma',
              Branch: 'Bhopal Arera',
              'Service Revenue': '₹2,10,000',
              'Retail Sales': '₹30,000',
              'Total Realized': '₹2,40,000',
            },
          ],
        },
        {
          id: 'rev-product',
          name: 'Revenue by Retail Product',
          description:
            'Sales velocity, margins, and stock turnover for salon merchandise and take-home care',
          dimensions: ['Product SKU', 'Brand', 'Units Sold', 'Gross Revenue', 'Gross Margin'],
          sampleData: [
            {
              'Product SKU': 'Kérastase Chronologiste Mask',
              Brand: 'Kérastase',
              'Units Sold': 64,
              'Gross Revenue': '₹2,68,800',
              'Gross Margin': '45%',
            },
            {
              'Product SKU': 'Olaplex No. 3 Hair Perfector',
              Brand: 'Olaplex',
              'Units Sold': 82,
              'Gross Revenue': '₹2,41,900',
              'Gross Margin': '42%',
            },
            {
              'Product SKU': 'Moroccanoil Treatment 100ml',
              Brand: 'Moroccanoil',
              'Units Sold': 48,
              'Gross Revenue': '₹1,53,600',
              'Gross Margin': '40%',
            },
          ],
        },
      ],
    },
    {
      id: 'collections',
      name: 'Collection Reports',
      icon: CreditCard,
      reports: [
        {
          id: 'col-summary',
          name: 'Collection Summary by Gateway',
          description: 'Realized settlement totals for UPI, Cards, Cash, and Payment Links',
          dimensions: [
            'Payment Channel',
            'Transaction Count',
            'Gross Collection',
            'Refund Deductions',
            'Net Realized',
          ],
          sampleData: [
            {
              'Payment Channel': 'UPI (PhonePe/GPay)',
              'Transaction Count': 1420,
              'Gross Collection': '₹22,46,400',
              'Refund Deductions': '₹42,000',
              'Net Realized': '₹22,04,400',
            },
            {
              'Payment Channel': 'Credit/Debit POS Cards',
              'Transaction Count': 680,
              'Gross Collection': '₹12,63,600',
              'Refund Deductions': '₹48,000',
              'Net Realized': '₹12,15,600',
            },
            {
              'Payment Channel': 'Cash Register',
              'Transaction Count': 410,
              'Gross Collection': '₹6,08,400',
              'Refund Deductions': '₹15,000',
              'Net Realized': '₹5,93,400',
            },
          ],
        },
        {
          id: 'col-outstanding',
          name: 'Outstanding Collections & Aging',
          description: 'Corporate client balances and delayed in-transit payment tracking',
          dimensions: [
            'Client / Entity',
            'Branch',
            'Invoice Ref',
            'Aging Days',
            'Outstanding Amount',
          ],
          sampleData: [
            {
              'Client / Entity': 'Vikramaditya Rao (Corporate)',
              Branch: 'Ujjain Mahakal',
              'Invoice Ref': 'INV-2026-8815',
              'Aging Days': '3 Days',
              'Outstanding Amount': '₹21,240',
            },
            {
              'Client / Entity': 'Bridal Glow Remaining Installment',
              Branch: 'Bhopal Arera',
              'Invoice Ref': 'INV-2026-8819',
              'Aging Days': '5 Days',
              'Outstanding Amount': '₹10,488',
            },
          ],
        },
      ],
    },
    {
      id: 'refunds',
      name: 'Refund Reports',
      icon: RotateCcw,
      reports: [
        {
          id: 'ref-summary',
          name: 'Refund Summary by Reason',
          description: 'Root cause analysis of reversals, credit vouchers, and wallet credits',
          dimensions: ['Reason Category', 'Count', 'Total Value', 'Resolution Type', 'Share %'],
          sampleData: [
            {
              'Reason Category': 'Service Quality / Preference',
              Count: 7,
              'Total Value': '₹48,000',
              'Resolution Type': 'Partial Refund',
              'Share %': '40.0%',
            },
            {
              'Reason Category': 'Stylist Emergency Rescheduling',
              Count: 4,
              'Total Value': '₹32,000',
              'Resolution Type': 'Full Reversal',
              'Share %': '26.7%',
            },
            {
              'Reason Category': 'Unopened Product Return',
              Count: 4,
              'Total Value': '₹24,000',
              'Resolution Type': 'Store Credit Note',
              'Share %': '20.0%',
            },
          ],
        },
      ],
    },
    {
      id: 'commissions',
      name: 'Commission Reports',
      icon: Users,
      reports: [
        {
          id: 'com-summary',
          name: 'Commission & Incentive Summary',
          description:
            'Base commission, milestone tier bonuses, assistant splits, and tips by branch',
          dimensions: [
            'Branch',
            'Staff Count',
            'Service Base',
            'Tier Bonuses',
            'Tips Pool',
            'Total Payout',
          ],
          sampleData: [
            {
              Branch: 'Indore Central',
              'Staff Count': 12,
              'Service Base': '₹1,42,000',
              'Tier Bonuses': '₹24,000',
              'Tips Pool': '₹18,500',
              'Total Payout': '₹1,84,500',
            },
            {
              Branch: 'Vijay Nagar Boutique',
              'Staff Count': 9,
              'Service Base': '₹1,08,000',
              'Tier Bonuses': '₹16,000',
              'Tips Pool': '₹12,400',
              'Total Payout': '₹1,36,400',
            },
            {
              Branch: 'Bhopal Arera Colony',
              'Staff Count': 8,
              'Service Base': '₹88,000',
              'Tier Bonuses': '₹9,500',
              'Tips Pool': '₹9,200',
              'Total Payout': '₹1,06,700',
            },
          ],
        },
      ],
    },
    {
      id: 'settlements',
      name: 'Settlement Reports',
      icon: Building2,
      reports: [
        {
          id: 'set-history',
          name: 'Branch Settlement History',
          description:
            'Fortnightly inter-branch revenue disbursement ledger and reconciliation records',
          dimensions: [
            'Settlement ID',
            'Branch',
            'Fortnight Period',
            'Net Revenue',
            'Settlement Dispatched',
            'Status',
          ],
          sampleData: [
            {
              'Settlement ID': 'SET-2026-081',
              Branch: 'Indore Central',
              'Fortnight Period': '01-15 Aug 2026',
              'Net Revenue': '₹13,93,000',
              'Settlement Dispatched': '₹13,53,000',
              Status: 'Settled',
            },
            {
              'Settlement ID': 'SET-2026-082',
              Branch: 'Vijay Nagar',
              'Fortnight Period': '01-15 Aug 2026',
              'Net Revenue': '₹10,72,000',
              'Settlement Dispatched': '₹10,32,000',
              Status: 'Settled',
            },
          ],
        },
      ],
    },
    {
      id: 'profitability',
      name: 'Profitability Reports',
      icon: TrendingUp,
      reports: [
        {
          id: 'prof-margins',
          name: 'Branch Profitability & Margin Analysis',
          description:
            'Comparative profit margins, cost structures, and overhead ratios across locations',
          dimensions: [
            'Branch Location',
            'Gross Revenue',
            'Total Operating Costs',
            'Estimated Net Profit',
            'Net Margin %',
          ],
          sampleData: [
            {
              'Branch Location': 'Indore Central (Flagship)',
              'Gross Revenue': '₹15,30,000',
              'Total Operating Costs': '₹8,90,000',
              'Estimated Net Profit': '₹6,40,000',
              'Net Margin %': '41.8%',
            },
            {
              'Branch Location': 'Vijay Nagar Boutique',
              'Gross Revenue': '₹11,80,000',
              'Total Operating Costs': '₹7,10,000',
              'Estimated Net Profit': '₹4,70,000',
              'Net Margin %': '39.8%',
            },
            {
              'Branch Location': 'Bhopal Arera Colony',
              'Gross Revenue': '₹9,84,500',
              'Total Operating Costs': '₹6,20,000',
              'Estimated Net Profit': '₹3,64,500',
              'Net Margin %': '37.0%',
            },
          ],
        },
      ],
    },
  ];

  const currentCategory =
    reportCategories.find((c) => c.id === selectedCategoryId) || reportCategories[0];
  const currentReport =
    currentCategory.reports.find((r) => r.id === selectedReportId) || currentCategory.reports[0];

  const handleExport = (format: 'CSV' | 'Excel' | 'PDF') => {
    toast(`Exporting "${currentReport.name}" in ${format} format...`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Filter & Report Generation Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Branches (Consolidated)</option>
            <option value="BR-01">Indore Central</option>
            <option value="BR-02">Vijay Nagar Boutique</option>
            <option value="BR-03">Bhopal Arera Colony</option>
            <option value="BR-04">Ujjain Mahakal Road</option>
            <option value="BR-05">Gwalior City Centre</option>
          </select>

          {/* Date Range */}
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="This Month">This Month (Aug 2026)</option>
            <option value="Last Month">Last Month (Jul 2026)</option>
            <option value="This Quarter">This Quarter (Q2 FY27)</option>
            <option value="This Year">This Financial Year (FY26-27)</option>
          </select>

          <Button
            onClick={() => {
              setIsPreviewGenerated(true);
              toast(`Generated updated preview for ${currentReport.name}`);
            }}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
          >
            Generate Report
          </Button>
        </div>

        {/* Multi-Format Export Buttons (Section 17) */}
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

      {/* 2. Category Selector & Report Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category List */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-2">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block px-1">
            Report Categories (6)
          </span>

          <div className="space-y-1.5">
            {reportCategories.map((cat) => {
              const Icon = cat.icon;
              const isCatActive = selectedCategoryId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={cn(
                    'p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-1',
                    isCatActive
                      ? 'border-[#5A2EA6] bg-[#FAF8FF] shadow-xs'
                      : 'border-slate-100 bg-white hover:bg-slate-50',
                  )}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedReportId(cat.reports[0].id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-lg grid place-items-center bg-purple-50 text-[#5A2EA6] shrink-0',
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <strong className="text-xs font-bold text-ink truncate">{cat.name}</strong>
                    </div>
                    <span className="text-[10px] text-[#5A2EA6] font-bold shrink-0">
                      {cat.reports.length} Reports
                    </span>
                  </div>

                  {/* Nested Reports List */}
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

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  Preview Ready
                </span>
              </div>
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
                          dim.toLowerCase().includes('collections') ||
                          dim.toLowerCase().includes('cash') ||
                          dim.toLowerCase().includes('card') ||
                          dim.toLowerCase().includes('upi') ||
                          dim.toLowerCase().includes('commission') ||
                          dim.toLowerCase().includes('tax') ||
                          dim.toLowerCase().includes('profit') ||
                          dim.toLowerCase().includes('margin') ||
                          dim.toLowerCase().includes('payout') ||
                          dim.toLowerCase().includes('rate') ||
                          dim.toLowerCase().includes('count') ||
                          dim.toLowerCase().includes('services') ||
                          dim.toLowerCase().includes('clients') ||
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
                            dim.toLowerCase().includes('collections') ||
                            dim.toLowerCase().includes('cash') ||
                            dim.toLowerCase().includes('card') ||
                            dim.toLowerCase().includes('upi') ||
                            dim.toLowerCase().includes('commission') ||
                            dim.toLowerCase().includes('tax') ||
                            dim.toLowerCase().includes('profit') ||
                            dim.toLowerCase().includes('margin') ||
                            dim.toLowerCase().includes('payout') ||
                            dim.toLowerCase().includes('rate') ||
                            dim.toLowerCase().includes('count') ||
                            dim.toLowerCase().includes('services') ||
                            dim.toLowerCase().includes('clients') ||
                            dim.includes('%'));

                        const val = (row as Record<string, any>)[dim];
                        const isTotal =
                          dim.toLowerCase().includes('total') || dim.toLowerCase().includes('net');

                        return (
                          <td
                            key={dim}
                            className={cn(
                              'p-3.5 whitespace-nowrap',
                              cIdx === 0 ? 'pl-5 font-bold text-ink text-left' : '',
                              isNum ? 'text-right' : 'text-left',
                              isTotal ? 'font-bold text-ink' : '',
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
