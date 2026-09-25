import React, { useState } from 'react';
import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  CheckCircle2,
  CreditCard,
  Download,
  Gift,
  PackageCheck,
  Plus,
  Search,
  Sparkles,
  Building2,
  Globe,
  MapPin,
  Send,
  Tag,
  Zap
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';

export function SalesPackagesPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches
  } = useCallCenterBranch();

  const [activeTab, setActiveTab] = useState<'packages' | 'memberships' | 'giftcards' | 'coupons'>('packages');

  const [packages] = useState([
    {
      id: 'PKG-01',
      name: 'Bridal Glow Deluxe Concierge Package',
      sessions: 6,
      price: '₹24,999',
      originalPrice: '₹32,000',
      validity: '90 Days',
      validBranches: 'All Outlets',
      services: 'Pre-bridal Facial, Hair Spa, Body Polish, Manicure, Pedicure, Threading'
    },
    {
      id: 'PKG-02',
      name: 'Hair Restoration & Keratin Care Pass',
      sessions: 4,
      price: '₹14,499',
      originalPrice: '₹18,500',
      validity: '60 Days',
      validBranches: 'All Outlets',
      services: 'Keratin Spa, scalp detox, trim, blow dry'
    },
    {
      id: 'PKG-03',
      name: 'Monsoon Wellness Swedish Spa Pass',
      sessions: 3,
      price: '₹8,999',
      originalPrice: '₹12,000',
      validity: '45 Days',
      validBranches: 'All Outlets',
      services: 'Full body Swedish massage, Steam, Aroma therapy'
    }
  ]);

  const [memberships] = useState([
    {
      tier: 'Silver Club Member',
      annualFee: '₹9,999',
      discount: '10% on Services & Retail',
      perks: 'Free Birthday Blowdry, Priority Concierge Booking, Valid across all branches'
    },
    {
      tier: 'Gold Elite VIP Member',
      annualFee: '₹19,999',
      discount: '20% on Services & Retail',
      perks: 'Free Hydra Facial (1x), Dedicated Master Stylist, 2 Family passes'
    },
    {
      tier: 'Platinum Royalty Black Diamond',
      annualFee: '₹39,999',
      discount: '30% on Services & Retail',
      perks: 'Unlimited Blowdrys, VIP Suite Access, Home Service options, 100% wallet rollover'
    }
  ]);

  const [giftCards] = useState([
    { code: 'GC-5000', name: 'Luxury Birthday Spa Gift Voucher', amount: '₹5,000', popular: true },
    { code: 'GC-10000', name: 'Bridal Pampering Deluxe Card', amount: '₹10,000', popular: true },
    { code: 'GC-2500', name: 'Express Grooming & Glow Card', amount: '₹2,500', popular: false }
  ]);

  const [coupons] = useState([
    { code: 'WELCOME500', discount: 'Flat ₹500 Off', minSpend: 'Min ₹2,500', usage: 'First-time callers' },
    { code: 'REVIVE20', discount: '20% Off Services', minSpend: 'Min ₹1,500', usage: 'Lapsed client win-back' },
    { code: 'BRIDALVIP', discount: '₹3,000 Off Package', minSpend: 'Min ₹20,000', usage: 'Bridal consultations' }
  ]);

  const handleSendPaymentLink = (name: string, price: string) => {
    toast(`Payment Link Dispatched: Razorpay/UPI instant link for ${name} (${price}) sent via WhatsApp & SMS.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Package, Membership &amp; Voucher Desk
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Sales Catalog' : `${selectedBranch.shortName} Catalog`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Multi-location service packages, brand-wide membership tiers, digital gift vouchers, and promo code discounts with instant payment link dispatch.'
              : `Sales packages and digital vouchers available for ${selectedBranch.name}.`}
          </p>
        </div>

        <button
          onClick={() => toast(`Export Sales Catalog: Downloaded pricing catalog for ${selectedBranch.shortName} as CSV.`)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export Sales Catalog
        </button>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          {
            id: 'packages',
            label: 'Service Packages',
            icon: <PackageCheck className="w-3.5 h-3.5" />,
          },
          { id: 'memberships', label: 'Membership Tiers', icon: <Award className="w-3.5 h-3.5" /> },
          { id: 'giftcards', label: 'Digital Gift Cards', icon: <Gift className="w-3.5 h-3.5" /> },
          { id: 'coupons', label: 'Coupons & Promos', icon: <Tag className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-soft hover:text-ink border border-line'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* PACKAGES VIEW */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white p-5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                    {pkg.id}
                  </span>
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Save {pkg.originalPrice}
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink">{pkg.name}</h3>
                <div className="text-2xl font-bold text-purple-950">{pkg.price}</div>
                <div className="text-xs text-soft font-semibold">
                  {pkg.sessions} Complete Sessions • Valid {pkg.validity}
                </div>
                <p className="text-xs text-soft border-t border-line/60 pt-2 leading-relaxed">
                  {pkg.services}
                </p>
              </div>

              <button
                onClick={() => handleSendPaymentLink(pkg.name, pkg.price)}
                className="w-full py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer border-0 transition-all flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" /> Send Payment Link
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MEMBERSHIPS VIEW */}
      {activeTab === 'memberships' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {memberships.map((m, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                  Annual Tier
                </span>
                <h3 className="text-base font-bold text-ink">{m.tier}</h3>
                <div className="text-2xl font-bold text-purple-950">{m.annualFee}</div>
                <div className="text-xs font-bold text-emerald-700">{m.discount}</div>
                <p className="text-xs text-soft border-t border-line/60 pt-2 leading-relaxed">
                  {m.perks}
                </p>
              </div>

              <button
                onClick={() => handleSendPaymentLink(m.tier, m.annualFee)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer border-0 transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> Issue Membership
              </button>
            </div>
          ))}
        </div>
      )}

      {/* GIFT CARDS VIEW */}
      {activeTab === 'giftcards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {giftCards.map((g) => (
            <div
              key={g.code}
              className="bg-gradient-to-br from-purple-950 to-indigo-950 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-purple-200">
                  <span>{g.code}</span>
                  {g.popular && <span className="bg-amber-400 text-purple-950 text-[9px] font-bold px-2 py-0.2 rounded-full">Bestseller</span>}
                </div>
                <h3 className="text-base font-bold text-white">{g.name}</h3>
                <div className="text-3xl font-bold text-amber-300">{g.amount}</div>
                <p className="text-[11px] text-purple-200">Redeemable on services &amp; retail at any salon branch.</p>
              </div>

              <button
                onClick={() => handleSendPaymentLink(g.name, g.amount)}
                className="w-full py-2 bg-white text-purple-950 hover:bg-purple-50 text-xs font-bold rounded-xl shadow-xs cursor-pointer border-0 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send Digital Voucher
              </button>
            </div>
          ))}
        </div>
      )}

      {/* COUPONS VIEW */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="bg-white p-5 rounded-2xl border border-dashed border-purple-300 shadow-xs space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-mono font-bold text-[#5A2EA6] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-emerald-800">{c.discount}</span>
              </div>
              <div className="text-xs text-soft">{c.minSpend} • {c.usage}</div>
              <button
                onClick={() => toast(`Coupon Code Copied: [${c.code}] copied for customer booking.`)}
                className="w-full py-1.5 bg-paper border border-line hover:bg-purple-50 text-xs font-bold text-ink rounded-xl transition-all cursor-pointer"
              >
                Apply Coupon Code
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
