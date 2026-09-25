import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Edit2,
  Globe,
  Layers,
  MapPin,
  Save,
  ShieldCheck,
  Sliders,
  Store,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface BranchConfig {
  id: string;
  name: string;
  code: string;
  city: string;
  type: string;
  status: 'Active' | 'Under Fitout' | 'Inactive';
  pricingModel: 'Brand Master' | 'Tier-1 Premium' | 'Tier-2 Express' | 'Franchise Specific';
  workingHours: string;
  timeZone: string;
  currency: string;
}

const initialBranches: BranchConfig[] = [
  {
    id: 'LOC-01',
    name: 'Indore - Vijay Nagar Flagship',
    code: 'IND-VN-01',
    city: 'Indore',
    type: 'COCO Flagship',
    status: 'Active',
    pricingModel: 'Brand Master',
    workingHours: '09:00 AM - 09:30 PM',
    timeZone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
  },
  {
    id: 'LOC-02',
    name: 'Indore - Palasia Premium Studio',
    code: 'IND-PAL-02',
    city: 'Indore',
    type: 'COCO Boutique',
    status: 'Active',
    pricingModel: 'Tier-1 Premium',
    workingHours: '10:00 AM - 09:00 PM',
    timeZone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
  },
  {
    id: 'LOC-03',
    name: 'Bhopal - Arera Colony Lounge',
    code: 'BHP-AC-03',
    city: 'Bhopal',
    type: 'FOFO Franchise',
    status: 'Active',
    pricingModel: 'Brand Master',
    workingHours: '10:00 AM - 09:00 PM',
    timeZone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
  },
  {
    id: 'LOC-04',
    name: 'Ujjain - Freeganj Main Studio',
    code: 'UJJ-FG-04',
    city: 'Ujjain',
    type: 'FOCO Franchise',
    status: 'Active',
    pricingModel: 'Tier-2 Express',
    workingHours: '09:30 AM - 08:30 PM',
    timeZone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
  },
  {
    id: 'LOC-05',
    name: 'Gwalior - City Centre Hub',
    code: 'GWL-CC-05',
    city: 'Gwalior',
    type: 'FOFO Franchise',
    status: 'Active',
    pricingModel: 'Tier-2 Express',
    workingHours: '10:00 AM - 09:00 PM',
    timeZone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
  },
  {
    id: 'LOC-06',
    name: 'Jabalpur - Civil Lines Lounge',
    code: 'JBL-CL-06',
    city: 'Jabalpur',
    type: 'COCO Boutique',
    status: 'Active',
    pricingModel: 'Brand Master',
    workingHours: '10:00 AM - 08:30 PM',
    timeZone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
  },
];

import { useAdminContext } from '../../context/AdminContext';

export function LocationsDefaultsTab() {
  const { salon } = useAdminContext();
  const [branches, setBranches] = useState<BranchConfig[]>(() => {
    if (salon?.branches) {
      return salon.branches.map((b, idx) => ({
        id: b.id,
        name: b.name,
        code: b.code,
        city: b.city,
        type: idx === 0 ? 'COCO Flagship' : 'COCO Boutique',
        status: 'Active' as const,
        pricingModel: 'Brand Master' as const,
        workingHours: b.workingHours || '09:00 AM - 09:00 PM',
        timeZone: salon.timezone ? `${salon.timezone} (IST)` : 'Asia/Kolkata (IST)',
        currency: `${salon.currency || 'INR'} (₹)`,
      }));
    }
    return initialBranches;
  });

  useEffect(() => {
    if (salon?.branches) {
      setBranches(
        salon.branches.map((b, idx) => ({
          id: b.id,
          name: b.name,
          code: b.code,
          city: b.city,
          type: idx === 0 ? 'COCO Flagship' : 'COCO Boutique',
          status: 'Active' as const,
          pricingModel: 'Brand Master' as const,
          workingHours: b.workingHours || '09:00 AM - 09:00 PM',
          timeZone: salon.timezone ? `${salon.timezone} (IST)` : 'Asia/Kolkata (IST)',
          currency: `${salon.currency || 'INR'} (₹)`,
        })),
      );
    }
  }, [salon]);

  const [selectedBranchForConfig, setSelectedBranchForConfig] = useState<BranchConfig | null>(null);

  // Brand-wide Defaults State (Section 2 PRD)
  const [defaultTimeZone, setDefaultTimeZone] = useState(
    salon?.timezone ? `${salon.timezone} (IST, UTC+05:30)` : 'Asia/Kolkata (IST, UTC+05:30)',
  );
  const [defaultCurrency, setDefaultCurrency] = useState(
    salon?.currency ? `${salon.currency} (₹) - Indian Rupee` : 'INR (₹) - Indian Rupee',
  );
  const [defaultCountry, setDefaultCountry] = useState(salon?.country === 'IN' ? 'India' : 'India');
  const [defaultLanguage, setDefaultLanguage] = useState('English (India)');
  const [defaultDateFormat, setDefaultDateFormat] = useState('DD/MM/YYYY (e.g. 18/08/2026)');
  const [defaultNumberFormat, setDefaultNumberFormat] = useState(
    'Indian Standard (₹ Lakhs & Crores)',
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (selectedBranchForConfig) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedBranchForConfig]);

  const handleSaveBranchOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchForConfig) return;
    setBranches(
      branches.map((b) => (b.id === selectedBranchForConfig.id ? selectedBranchForConfig : b)),
    );
    showToast(`Configuration updated for ${selectedBranchForConfig.name}.`);
    setSelectedBranchForConfig(null);
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

      {/* 1. Global Brand-Wide Location Defaults */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-ink text-base">
              Brand-Wide Regional &amp; Localization Defaults
            </h3>
            <p className="text-xs text-muted mt-0.5">
              System defaults inherited by all new and existing salon outlets across Central India
            </p>
          </div>
          <Button
            onClick={() => showToast('Brand localization defaults saved.')}
            className="h-[34px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Global Defaults</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-soft font-bold block mb-1">Default Time Zone</label>
            <select
              value={defaultTimeZone}
              onChange={(e) => setDefaultTimeZone(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
            >
              <option value="Asia/Kolkata (IST, UTC+05:30)">Asia/Kolkata (IST, UTC+05:30)</option>
              <option value="Asia/Dubai (GST, UTC+04:00)">Asia/Dubai (GST, UTC+04:00)</option>
              <option value="Asia/Singapore (SGT, UTC+08:00)">
                Asia/Singapore (SGT, UTC+08:00)
              </option>
            </select>
          </div>

          <div>
            <label className="text-soft font-bold block mb-1">Operating Tender Currency</label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none cursor-pointer"
            >
              <option value="INR (₹) - Indian Rupee">INR (₹) - Indian Rupee</option>
              <option value="USD ($) - US Dollar">USD ($) - US Dollar</option>
              <option value="AED (د.إ) - UAE Dirham">AED (د.إ) - UAE Dirham</option>
            </select>
          </div>

          <div>
            <label className="text-soft font-bold block mb-1">Country Jurisdiction</label>
            <input
              type="text"
              disabled
              value={defaultCountry}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="text-soft font-bold block mb-1">System Language</label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
            >
              <option value="English (India)">English (India)</option>
              <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
            </select>
          </div>

          <div>
            <label className="text-soft font-bold block mb-1">Standard Date Format</label>
            <select
              value={defaultDateFormat}
              onChange={(e) => setDefaultDateFormat(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
            >
              <option value="DD/MM/YYYY (e.g. 18/08/2026)">DD/MM/YYYY (e.g. 18/08/2026)</option>
              <option value="MM/DD/YYYY (e.g. 08/18/2026)">MM/DD/YYYY (e.g. 08/18/2026)</option>
              <option value="YYYY-MM-DD (e.g. 2026-08-18)">YYYY-MM-DD (e.g. 2026-08-18)</option>
            </select>
          </div>

          <div>
            <label className="text-soft font-bold block mb-1">Monetary Number Format</label>
            <select
              value={defaultNumberFormat}
              onChange={(e) => setDefaultNumberFormat(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
            >
              <option value="Indian Standard (₹ Lakhs & Crores)">
                Indian Standard (₹ Lakhs &amp; Crores)
              </option>
              <option value="International Standard (Thousands & Millions)">
                International Standard (Thousands &amp; Millions)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Location Scope & Configuration Matrix (Section 2 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Branch Scope &amp; Configuration Ledger
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {branches.length} Salons
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Brand-level oversight of branch pricing tiers, operating shift windows, and localized
              override configurations
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Salon Location &amp; Code</th>
                <th className="p-3.5">City &amp; Model</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Pricing Model</th>
                <th className="p-3.5">Standard Working Hours</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-muted">
                    No branch locations registered yet. Branches created by the administrator will be listed here for individual overrides.
                  </td>
                </tr>
              ) : (
                branches.map((b) => (
                  <tr key={b.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{b.name}</strong>
                      <span className="text-[10px] text-muted font-mono">{b.code}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{b.city}</span>
                      <span className="text-[10px] text-muted">{b.type}</span>
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-200">
                        {b.pricingModel}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap font-mono text-slate-900 text-[11px]">
                      {b.workingHours}
                    </td>
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedBranchForConfig(b)}
                        className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 ml-auto"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Configure</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Portaled Branch Configuration Modal */}
      {selectedBranchForConfig &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedBranchForConfig(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                    Branch Configuration
                  </span>
                  <h3 className="font-serif font-bold text-ink text-lg mt-1">
                    {selectedBranchForConfig.name}
                  </h3>
                  <p className="text-xs text-muted">
                    Override defaults and pricing model for this outlet
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBranchForConfig(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveBranchOverride} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="text-soft font-bold block mb-1">Assigned Pricing Model</label>
                  <select
                    value={selectedBranchForConfig.pricingModel}
                    onChange={(e) =>
                      setSelectedBranchForConfig({
                        ...selectedBranchForConfig,
                        pricingModel: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none cursor-pointer"
                  >
                    <option value="Brand Master">Brand Master Pricing (Shared Brand-wide)</option>
                    <option value="Tier-1 Premium">Tier-1 Premium (+15% Flagship Mark)</option>
                    <option value="Tier-2 Express">
                      Tier-2 Express (-10% High-volume Discount)
                    </option>
                    <option value="Franchise Specific">Franchise Specific Custom Tier</option>
                  </select>
                </div>

                <div>
                  <label className="text-soft font-bold block mb-1">Daily Operating Hours</label>
                  <input
                    type="text"
                    value={selectedBranchForConfig.workingHours}
                    onChange={(e) =>
                      setSelectedBranchForConfig({
                        ...selectedBranchForConfig,
                        workingHours: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-mono font-bold text-ink outline-none"
                  />
                </div>

                <div>
                  <label className="text-soft font-bold block mb-1">Operational Status</label>
                  <select
                    value={selectedBranchForConfig.status}
                    onChange={(e) =>
                      setSelectedBranchForConfig({
                        ...selectedBranchForConfig,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none cursor-pointer"
                  >
                    <option value="Active">Active Operational</option>
                    <option value="Under Fitout">Under Fitout / Refurbishment</option>
                    <option value="Inactive">Temporarily Inactive</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 flex items-center gap-2.5 text-xs text-purple-900">
                  <ShieldCheck className="w-4 h-4 text-[#5A2EA6] shrink-0" />
                  <span>
                    Changes immediately sync to the branch front desk and point-of-sale terminals.
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setSelectedBranchForConfig(null)}
                    className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-[36px] px-5 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    Save Override
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
