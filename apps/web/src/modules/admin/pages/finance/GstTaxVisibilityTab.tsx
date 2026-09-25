import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Download,
  ExternalLink,
  Info,
  Layers,
  Percent,
  PieChart as PieChartIcon,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';

export function GstTaxVisibilityTab() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('Aug 2026');

  // Tax Summary KPIs (Section 18)
  const taxKpis = [
    { title: 'Taxable Revenue (Base)', value: '₹41,10,169', sub: 'Excludes 18% GST', isGood: true },
    { title: 'Central GST (CGST 9%)', value: '₹3,70,000', sub: 'Intra-state accrual' },
    { title: 'State GST (SGST 9%)', value: '₹3,70,000', sub: 'MP State VAT/SGST' },
    { title: 'Integrated GST (IGST)', value: '₹0', sub: '100% Intra-state MP ops' },
    {
      title: 'Total Tax Accrual (18%)',
      value: '₹7,40,000',
      sub: 'Gross output GST liability',
      isGood: true,
    },
    { title: 'Credit Note Adjustments', value: '-₹18,305', sub: 'Tax reversed on refunds' },
  ];

  // Branch-Wise Tax Ledger
  const branchTaxLedger = [
    {
      branch: 'Indore Central (Flagship)',
      gstin: '23AABCU9603R1ZM',
      period: 'Aug 2026',
      taxableAmount: '₹12,96,610',
      cgst: '₹1,16,695 (9%)',
      sgst: '₹1,16,695 (9%)',
      igst: '₹0',
      totalTax: '₹2,33,390',
      status: 'Accrued',
    },
    {
      branch: 'Vijay Nagar Boutique',
      gstin: '23AABCU9603R1ZM',
      period: 'Aug 2026',
      taxableAmount: '₹10,00,000',
      cgst: '₹90,000 (9%)',
      sgst: '₹90,000 (9%)',
      igst: '₹0',
      totalTax: '₹1,80,000',
      status: 'Accrued',
    },
    {
      branch: 'Bhopal Arera Colony',
      gstin: '23AABCU9603R1ZM',
      period: 'Aug 2026',
      taxableAmount: '₹8,34,322',
      cgst: '₹75,089 (9%)',
      sgst: '₹75,089 (9%)',
      igst: '₹0',
      totalTax: '₹1,50,178',
      status: 'Accrued',
    },
    {
      branch: 'Ujjain Mahakal Road',
      gstin: '23AABCU9603R1ZM',
      period: 'Aug 2026',
      taxableAmount: '₹5,83,050',
      cgst: '₹52,475 (9%)',
      sgst: '₹52,475 (9%)',
      igst: '₹0',
      totalTax: '₹1,04,950',
      status: 'Accrued',
    },
    {
      branch: 'Gwalior City Centre',
      gstin: '23AABCU9603R1ZM',
      period: 'Aug 2026',
      taxableAmount: '₹3,96,186',
      cgst: '₹35,657 (9%)',
      sgst: '₹35,657 (9%)',
      igst: '₹0',
      totalTax: '₹71,314',
      status: 'Accrued',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif font-bold text-ink text-base">
            GSTIN &amp; Statutory Tax Visibility
          </h3>
          <p className="text-[11px] text-muted">
            Indian Goods &amp; Services Tax (GST) output breakdown by location (SAC 9997 &amp; HSN
            3305)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="Aug 2026">August 2026 (Active)</option>
            <option value="Jul 2026">July 2026 (Filed)</option>
            <option value="Q1 FY26">Q1 FY 2026-27</option>
          </select>

          <Button
            variant="outline"
            onClick={() => toast('Exporting GST GSTR-1 Preview Summary (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Tax Summary</span>
          </Button>
        </div>
      </div>

      {/* 2. Notice Box */}
      <div className="bg-purple-50/50 border border-[#5A2EA6]/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#5A2EA6] shrink-0" />
          <span className="text-soft text-[11px]">
            This is a <strong>Brand Owner Visibility &amp; Accrual UI</strong>. E-Invoicing
            generation, GSTR-1 JSON downloads, and direct GST portal submissions are executed by the
            accounting staff in the <strong>Finance Panel</strong>.
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = '/finance?tab=gst';
          }}
          className="h-[30px] px-3 rounded-lg text-[11px] font-bold border-[#5A2EA6]/40 text-[#5A2EA6] bg-white hover:bg-purple-50 shrink-0 flex items-center gap-1"
        >
          <span>Open Tax Desk</span>
          <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
        </Button>
      </div>

      {/* 3. 6 Tax KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {taxKpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                {kpi.title}
              </span>
              <strong className="text-base font-serif font-bold text-ink mt-1 block">
                {kpi.value}
              </strong>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-muted">
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Branch-Wise GST Ledger Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex items-center justify-between bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Branch-wise GST Tax Accrual Ledger
              </h3>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              18% GST output tax split into CGST (9%) and SGST (9%) under Madhya Pradesh GST
              jurisdiction
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            GSTIN: 23AABCU9603R1ZM (Active)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Branch Location</th>
                <th className="p-3.5">Filing Period</th>
                <th className="p-3.5 text-right">Taxable Sales (Base)</th>
                <th className="p-3.5 text-right">CGST (9%)</th>
                <th className="p-3.5 text-right">SGST (9%)</th>
                <th className="p-3.5 text-right">IGST (0%)</th>
                <th className="p-3.5 text-right">Total Tax Liability</th>
                <th className="p-3.5 pr-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {branchTaxLedger.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{row.branch}</strong>
                    <span className="text-[10px] text-soft font-mono">{row.gstin}</span>
                  </td>
                  <td className="p-3.5 text-slate-600 font-semibold whitespace-nowrap">
                    {row.period}
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                    {row.taxableAmount}
                  </td>
                  <td className="p-3.5 text-right font-medium text-indigo-700 whitespace-nowrap">
                    {row.cgst}
                  </td>
                  <td className="p-3.5 text-right font-medium text-indigo-700 whitespace-nowrap">
                    {row.sgst}
                  </td>
                  <td className="p-3.5 text-right text-slate-400 whitespace-nowrap">{row.igst}</td>
                  <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                    {row.totalTax}
                  </td>
                  <td className="p-3.5 pr-5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-200 whitespace-nowrap">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#F8F5FF] border-t-2 border-[#5A2EA6]/20 font-bold text-xs text-ink">
              <tr className="whitespace-nowrap">
                <td className="p-3.5 pl-5 uppercase tracking-wider text-[#5A2EA6]" colSpan={2}>
                  Consolidated Tax Total (18% GST)
                </td>
                <td className="p-3.5 text-right">₹41,10,169</td>
                <td className="p-3.5 text-right">₹3,70,000</td>
                <td className="p-3.5 text-right">₹3,70,000</td>
                <td className="p-3.5 text-right">₹0</td>
                <td className="p-3.5 text-right font-extrabold text-[#5A2EA6]">₹7,40,000</td>
                <td className="p-3.5 pr-5 text-center text-emerald-700">100% Accrued</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
