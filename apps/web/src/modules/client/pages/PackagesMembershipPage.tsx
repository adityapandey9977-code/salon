import { BookAppointmentModal } from '@/shared/components/BookAppointmentModal';
import { useToast } from '@salon-spa-saas/ui';
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Gift,
  Percent,
  ShieldCheck,
  Sparkles,
  Tag,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function PackagesMembershipPage() {
  const { toast } = useToast();
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Active Membership Details (3 Membership Fields)
  const membershipDetails = {
    membershipName: 'Gold Tier Membership',
    benefits: [
      'Flat 15% discount on all hair, facial & spa treatments',
      'Priority weekend appointment slot reservation',
      '2x loyalty rewards points on hair coloring & keratin treatments',
      'Annual ₹1,000 birthday pamper gift voucher',
    ],
    renewalDate: '2026-12-31',
  };

  // Master Active Packages State (Cards & Package Detail Fields)
  const [activePackages] = useState([
    {
      id: 'PKG-701',
      packageName: 'Bridal Pamper & Radiance Glow Package',
      sessionsPurchased: 5,
      sessionsUsed: 3,
      sessionsRemaining: 2,
      expiryDate: '2026-11-30',
      status: 'Active',
      includedServices: [
        'Hydra Facial Detox (3/3 Used)',
        'Hair Spa & Scalp Detox (2/2 Used)',
        'Full Body Polish (0/1 Used)',
      ],
      value: '₹14,500',
    },
    {
      id: 'PKG-602',
      packageName: 'Annual Keratin Hair Care Pass',
      sessionsPurchased: 3,
      sessionsUsed: 1,
      sessionsRemaining: 2,
      expiryDate: '2027-02-15',
      status: 'Active',
      includedServices: ['Keratin Hair Smoothing Treatment (1/3 Used)'],
      value: '₹18,000',
    },
  ]);

  const [vouchers] = useState([
    {
      code: 'GOLD-BDAY-1000',
      title: 'Birthday Pamper Gift Voucher',
      discount: '₹1,000 OFF',
      validTill: '2026-09-15',
      minSpend: '₹3,000',
    },
    {
      code: 'SPA-GLOW-20',
      title: 'Monsoon Spa Special Voucher',
      discount: '20% OFF',
      validTill: '2026-08-31',
      minSpend: '₹2,500',
    },
  ]);

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput) return;

    toast(
      `Promo Code Applied: [${promoCodeInput.toUpperCase()}] validated! Flat 15% bonus discount applied to your account.`,
    );
    setPromoCodeInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Packages &amp; Membership Privileges
          </h1>
          <p className="text-xs text-soft mt-1">
            View active membership tier status, package session balances, valid dates, and redeem
            digital promo vouchers.
          </p>
        </div>
      </div>

      {/* MEMBERSHIP SECTION - EXACT 3 REQUESTED MEMBERSHIP FIELDS */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white p-6 rounded-3xl shadow-md space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 text-amber-100">
              <Crown className="w-3.5 h-3.5 text-amber-300" /> Active Membership
            </span>

            {/* 1. Membership Name */}
            <h2 className="text-2xl font-serif font-bold text-white">
              {membershipDetails.membershipName}
            </h2>
          </div>

          {/* 3. Renewal Date */}
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-right">
            <div className="text-[10px] uppercase font-bold text-amber-200">
              Membership Renewal Date
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1 justify-end mt-0.5">
              <Calendar className="w-4 h-4 text-amber-300" /> {membershipDetails.renewalDate}
            </div>
          </div>
        </div>

        {/* 2. Benefits */}
        <div className="space-y-2 text-xs">
          <div className="text-amber-200 font-bold uppercase text-[10.5px] tracking-wider">
            Membership Benefits &amp; Privileges:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-amber-100">
            {membershipDetails.benefits.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE PACKAGES & PACKAGE DETAIL BREAKDOWN */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-ink">My Purchased Service Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                {/* 1. Package Name & Status */}
                <div className="flex justify-between items-center border-b border-line pb-2">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {pkg.id}
                  </span>
                  {/* Status */}
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {pkg.status}
                  </span>
                </div>

                <div>
                  {/* Package Name */}
                  <h4 className="text-base font-bold text-ink">{pkg.packageName}</h4>
                  {/* Remaining Sessions & Expiry Date */}
                  <p className="text-xs text-soft mt-0.5">
                    <strong className="text-emerald-700 font-bold">
                      {pkg.sessionsRemaining} Sessions Remaining
                    </strong>{' '}
                    • Valid Until {pkg.expiryDate}
                  </p>
                </div>

                {/* PACKAGE DETAIL BREAKDOWN - ALL 5 SPECIFIED FIELDS */}
                <div className="p-3.5 bg-pine/5 rounded-xl border border-line grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-soft block">Package Title</span>
                    <span className="font-bold text-ink truncate block">{pkg.packageName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-soft block">Sessions Purchased</span>
                    <span className="font-bold text-ink">{pkg.sessionsPurchased} Sessions</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-soft block">Sessions Used</span>
                    <span className="font-semibold text-purple-900">
                      {pkg.sessionsUsed} Sessions
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-soft block">Sessions Remaining</span>
                    <span className="font-bold text-emerald-700">
                      {pkg.sessionsRemaining} Sessions
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-line/60 pt-2">
                    <span className="text-[10px] text-soft block">Valid Until (Expiry Date)</span>
                    <span className="font-bold text-purple-900">{pkg.expiryDate}</span>
                  </div>
                </div>

                {/* Included Services Breakdown */}
                <div className="space-y-1 text-xs">
                  <span className="text-muted text-[10.5px] font-bold uppercase block">
                    Session Utilization Log:
                  </span>
                  {pkg.includedServices.map((srv, idx) => (
                    <div
                      key={idx}
                      className="font-medium text-ink flex items-center gap-1.5 text-[11.5px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {srv}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsBookModalOpen(true)}
                className="w-full py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border-0"
              >
                Redeem Package Session &amp; Book
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PROMO VOUCHERS & CODE APPLICATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column: Digital Gift Vouchers */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base font-bold text-ink">My Digital Gift Vouchers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vouchers.map((v) => (
              <div
                key={v.code}
                className="bg-gradient-to-br from-purple-50 via-white to-purple-100/50 p-4 rounded-2xl border border-purple-200 shadow-sm space-y-2 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold font-mono text-purple-900 bg-purple-200/60 px-2.5 py-0.5 rounded-full">
                      {v.code}
                    </span>
                    <span className="text-base font-bold text-purple-700">{v.discount}</span>
                  </div>

                  <h4 className="text-sm font-bold text-ink pt-1">{v.title}</h4>
                  <p className="text-xs text-soft">
                    Min Spend: {v.minSpend} • Expires {v.validTill}
                  </p>
                </div>

                <button
                  onClick={() => toast(`Voucher Copied: [${v.code}] copied to clipboard!`)}
                  className="w-full mt-3 py-1.5 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Copy Voucher Code
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Apply Promo Code Form */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-ink">Redeem Discount Code</h3>
          <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-ink">Enter Special Promo Code</span>
            </div>

            <form onSubmit={handleApplyPromoCode} className="space-y-3">
              <input
                type="text"
                placeholder="Enter Promo Code (e.g. MONSOON20)"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-mono font-bold text-xs text-ink outline-none focus:border-[#5A2EA6]"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0 transition-all"
              >
                Validate &amp; Redeem Code
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onConfirm={(data) => {
          toast(`Appointment Confirmed: Reserved ${data.service} at ${data.time}.`);
          setIsBookModalOpen(false);
        }}
      />
    </div>
  );
}
