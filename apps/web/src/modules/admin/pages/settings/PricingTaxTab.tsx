import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  DollarSign,
  FileText,
  HelpCircle,
  Layers,
  Percent,
  Save,
  ShieldCheck,
  Sliders,
  Tag,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface BranchPricingItem {
  id: string;
  item: string;
  category: string;
  brandPrice: string;
  branch: string;
  branchPrice: string;
  difference: string;
  status: 'Shared Master' | 'Branch Override' | 'Tier Surcharge';
}

const mockBranchPricing: BranchPricingItem[] = [
  {
    id: 'PRC-001',
    item: 'Signature Royal Balayage & Glaze',
    category: 'Hair Services',
    brandPrice: '₹4,500',
    branch: 'Indore - Vijay Nagar Flagship',
    branchPrice: '₹4,500',
    difference: '₹0 (0%)',
    status: 'Shared Master',
  },
  {
    id: 'PRC-002',
    item: 'Signature Royal Balayage & Glaze',
    category: 'Hair Services',
    brandPrice: '₹4,500',
    branch: 'Indore - Palasia Premium',
    branchPrice: '₹5,200',
    difference: '+₹700 (+15.5%)',
    status: 'Branch Override',
  },
  {
    id: 'PRC-003',
    item: 'O3+ Seaweed Illuminating Facial',
    category: 'Skincare',
    brandPrice: '₹2,800',
    branch: 'Ujjain - Freeganj Studio',
    branchPrice: '₹2,500',
    difference: '-₹300 (-10.7%)',
    status: 'Branch Override',
  },
  {
    id: 'PRC-004',
    item: 'Kerastase Nutritive 8H Magic Night Serum (90ml)',
    category: 'Retail Products',
    brandPrice: '₹3,600',
    branch: 'Bhopal - Arera Colony Lounge',
    branchPrice: '₹3,600',
    difference: '₹0 (0%)',
    status: 'Shared Master',
  },
  {
    id: 'PRC-005',
    item: 'Swedish Deep Tissue Aromatherapy (60 min)',
    category: 'Spa & Body',
    brandPrice: '₹2,400',
    branch: 'Gwalior - City Centre Hub',
    branchPrice: '₹2,200',
    difference: '-₹200 (-8.3%)',
    status: 'Tier Surcharge',
  },
];

export function PricingTaxTab() {
  // A. Pricing Model State (Section 3 PRD)
  const [pricingStrategy, setPricingStrategy] = useState<'brand-wide' | 'branch-specific'>(
    'branch-specific',
  );
  const [allowBranchOverrides, setAllowBranchOverrides] = useState(true);

  // B. Tax Configuration State (Section 3 PRD)
  const [taxDisplayMode, setTaxDisplayMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [servicesTaxRate, setServicesTaxRate] = useState('18% GST (9% CGST + 9% SGST)');
  const [sacCodeHair, setSacCodeHair] = useState('999721');
  const [sacCodeBeauty, setSacCodeBeauty] = useState('999722');
  const [sacCodeSpa, setSacCodeSpa] = useState('999723');

  // C. Discount Policy State (Section 3 PRD)
  const [maxCashierDiscount, setMaxCashierDiscount] = useState('10%');
  const [managerApprovalThreshold, setManagerApprovalThreshold] = useState('15%');
  const [discountScope, setDiscountScope] = useState('Brand-wide Master Rule');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSavePricingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Pricing models, tax configuration, and discount governance policies saved.');
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

      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-bold text-ink text-lg">
            Pricing, Tax &amp; Discount Governance
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Centralized control of pricing strategies, tax display rules, SAC codes, and cashier
            discount thresholds
          </p>
        </div>

        <Button
          onClick={handleSavePricingConfig}
          className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Policy Configuration</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. PRICING MODEL */}
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">A. Pricing Strategy</h3>
            </div>
            <span className="text-[10px] font-bold text-[#5A2EA6] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              PRD Pricing Model
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-soft font-bold block mb-1.5">
                Master Pricing Architecture
              </label>
              <div className="space-y-2">
                <div
                  onClick={() => setPricingStrategy('brand-wide')}
                  className={cn(
                    'p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition select-none',
                    pricingStrategy === 'brand-wide'
                      ? 'bg-purple-50/70 border-purple-300'
                      : 'bg-slate-50 border-slate-200',
                  )}
                >
                  <input
                    type="radio"
                    checked={pricingStrategy === 'brand-wide'}
                    onChange={() => setPricingStrategy('brand-wide')}
                    className="accent-[#5A2EA6] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <strong className="text-ink block font-bold text-xs">
                      Strict Brand-Wide Pricing
                    </strong>
                    <p className="text-[10px] text-muted leading-tight mt-0.5">
                      All outlets charge identical catalog prices without local deviations.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPricingStrategy('branch-specific')}
                  className={cn(
                    'p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition select-none',
                    pricingStrategy === 'branch-specific'
                      ? 'bg-purple-50/70 border-purple-300'
                      : 'bg-slate-50 border-slate-200',
                  )}
                >
                  <input
                    type="radio"
                    checked={pricingStrategy === 'branch-specific'}
                    onChange={() => setPricingStrategy('branch-specific')}
                    className="accent-[#5A2EA6] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <strong className="text-ink block font-bold text-xs">
                      Tiered &amp; Branch-Specific Pricing
                    </strong>
                    <p className="text-[10px] text-muted leading-tight mt-0.5">
                      Allows tier surcharges (Flagship vs Express) and localized partner pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                Allow Branch Manager Pricing Overrides
              </span>
              <input
                type="checkbox"
                checked={allowBranchOverrides}
                onChange={(e) => setAllowBranchOverrides(e.target.checked)}
                className="accent-[#5A2EA6] w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* B. TAX & GST CONFIGURATION */}
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">B. Tax &amp; GST Rules</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              GST 18% Slabs
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-soft font-bold block mb-1">
                POS Checkout Tax Presentation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTaxDisplayMode('exclusive')}
                  className={cn(
                    'p-2.5 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer',
                    taxDisplayMode === 'exclusive'
                      ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                      : 'bg-[#F8F5FF] text-slate-700',
                  )}
                >
                  Tax Exclusive (Price + GST)
                </button>
                <button
                  type="button"
                  onClick={() => setTaxDisplayMode('inclusive')}
                  className={cn(
                    'p-2.5 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer',
                    taxDisplayMode === 'inclusive'
                      ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                      : 'bg-[#F8F5FF] text-slate-700',
                  )}
                >
                  Tax Inclusive (GST Inside)
                </button>
              </div>
            </div>

            <div>
              <label className="text-soft font-bold block mb-1">Standard Salon GST Slab</label>
              <input
                type="text"
                disabled
                value={servicesTaxRate}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                Statutory SAC Codes (Services)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[9px] text-soft font-semibold block">Hairdressing</span>
                  <input
                    type="text"
                    value={sacCodeHair}
                    onChange={(e) => setSacCodeHair(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-lg font-mono font-bold text-center text-ink text-xs"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-soft font-semibold block">
                    Skincare &amp; Facial
                  </span>
                  <input
                    type="text"
                    value={sacCodeBeauty}
                    onChange={(e) => setSacCodeBeauty(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-lg font-mono font-bold text-center text-ink text-xs"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-soft font-semibold block">
                    Spa &amp; Wellness
                  </span>
                  <input
                    type="text"
                    value={sacCodeSpa}
                    onChange={(e) => setSacCodeSpa(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-lg font-mono font-bold text-center text-ink text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* C. DISCOUNT POLICY */}
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">C. Discount Controls</h3>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Approval Limits
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-soft font-bold block mb-1">
                Max Cashier Self-Authorized Discount
              </label>
              <select
                value={maxCashierDiscount}
                onChange={(e) => setMaxCashierDiscount(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none cursor-pointer"
              >
                <option value="5%">5% Maximum per bill</option>
                <option value="10%">10% Maximum per bill</option>
                <option value="15%">15% Maximum per bill</option>
                <option value="0%">0% (No discretionary discounts)</option>
              </select>
            </div>

            <div>
              <label className="text-soft font-bold block mb-1">
                Branch Manager Approval Trigger
              </label>
              <select
                value={managerApprovalThreshold}
                onChange={(e) => setManagerApprovalThreshold(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none cursor-pointer"
              >
                <option value="15%">Discounts &gt; 15% require Manager PIN / OTP</option>
                <option value="20%">Discounts &gt; 20% require Manager PIN / OTP</option>
                <option value="25%">Discounts &gt; 25% require Head Office Authorization</option>
              </select>
            </div>

            <div>
              <label className="text-soft font-bold block mb-1">Enforcement Scope</label>
              <input
                type="text"
                disabled
                value={discountScope}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-2 text-[10px] text-purple-900">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />
              <span>Protects gross margins by blocking cashier unapproved concessions.</span>
            </div>
          </div>
        </div>
      </div>

      {/* D. BRANCH PRICING MATRIX TABLE (Section 3 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Branch-Specific Pricing Deviation Matrix
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                Pricing Discrepancy Audit
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Comparison between Master Brand catalog rate and local branch checkout pricing
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Service / Product &amp; Category</th>
                <th className="p-3.5 text-right">Brand Master Price</th>
                <th className="p-3.5">Branch Location</th>
                <th className="p-3.5 text-right font-bold text-ink">Branch Local Price</th>
                <th className="p-3.5 text-center">Variance / Difference</th>
                <th className="p-3.5 pr-5 text-right">Pricing Model Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {mockBranchPricing.map((bp) => (
                <tr key={bp.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{bp.item}</strong>
                    <span className="text-[10px] text-muted">{bp.category}</span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-bold text-slate-900">
                    {bp.brandPrice}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">
                    {bp.branch}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-extrabold text-[#5A2EA6] text-sm">
                    {bp.branchPrice}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-mono text-xs font-semibold">
                    {bp.difference}
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        bp.status === 'Shared Master'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-purple-50 text-[#5A2EA6] border-purple-200',
                      )}
                    >
                      {bp.status}
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
