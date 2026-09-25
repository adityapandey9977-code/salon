import { Button, useToast } from '@salon-spa-saas/ui';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  Info,
  Mail,
  MapPin,
  Percent,
  Phone,
  User,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function AddFranchisePartnerPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [partnerName, setPartnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('Central India');
  const [share, setShare] = useState('10');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !email.trim() || !phone.trim() || !city.trim() || !date.trim()) {
      toast('Please fill in all required fields.');
      return;
    }
    toast(`Successfully registered franchise partner: ${partnerName}!`);
    navigate('/franchise-partners');
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-6 pb-6">
      {/* ── Top Page Header ── */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#ECE6F8] p-4 sm:p-5 shadow-xs">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/franchise-partners')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white shadow-xs transition-all duration-200 hover:border-[#5A2EA6]/30 hover:bg-[#5A2EA6]/5 group"
            >
              <ArrowLeft className="h-4 w-4 text-soft transition-colors group-hover:text-[#5A2EA6]" />
            </button>
            <div>
              <h1 className="font-serif text-[24px] font-semibold leading-tight text-ink">
                Add Franchise Partner
              </h1>
              <p className="mt-0.5 text-[12px] text-soft">
                Onboard new franchise partners and configure profit share.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#5A2EA6]/10 bg-[#5A2EA6]/5 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-[#5A2EA6]" />
            <span className="text-[11px] font-semibold text-[#5A2EA6]">Partner Registration</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* ───────── Hero Card ───────── */}
        <div className="relative overflow-hidden rounded-[24px] border border-[#EFE7FF] bg-gradient-to-r from-[#F7F2FF] via-[#EFE6FF] to-[#F9F7FF] shadow-xs">
          {/* Background Glow */}
          <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-[#A970FF]/15 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-48 w-48 rounded-full bg-[#7B4DFF]/10 blur-3xl" />

          {/* Decorative Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(169,112,255,.12),transparent_45%)]" />

          <div className="relative flex items-center justify-between px-6 py-3.5">
            {/* Left Content */}
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] shadow-md shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#8A6AB8]">
                  Partner Onboarding
                </p>
                <h2 className="mt-0.5 font-serif text-[19px] font-bold text-[#2E1F46]">
                  Partner Information
                </h2>
                <p className="mt-1 max-w-md text-[11px] text-[#6F6286] font-normal leading-relaxed">
                  Fill in the details below to add a new franchise aggregator and link their
                  operations.
                </p>
              </div>
            </div>

            {/* Right Illustration - Slimmed Down */}
            <div className="relative hidden lg:flex h-20 w-[280px] items-end justify-end overflow-hidden shrink-0">
              {/* Skyline */}
              <div className="absolute bottom-0 flex items-end gap-1.5 z-10">
                <div className="h-7 w-8 rounded-t-md bg-gradient-to-t from-[#B18BFF] to-[#E7DAFF]" />
                <div className="h-12 w-9 rounded-t-md bg-gradient-to-t from-[#8F62FF] to-[#DCC9FF]" />
                <div className="h-9 w-8 rounded-t-md bg-gradient-to-t from-[#A970FF] to-[#E9DEFF]" />
                <div className="h-15 w-10 rounded-t-md bg-gradient-to-t from-[#7B4DFF] to-[#D7C0FF]" />
              </div>

              {/* Location Pin */}
              <div className="absolute top-1 right-12 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] shadow-lg z-20 animate-bounce duration-1000">
                <Percent className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Form Inner Container ── */}
        <div className="space-y-8 mt-6">
          {/* ─── Section 1: Partner Details ─── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-line">
              <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/8 flex items-center justify-center">
                <User className="w-4 h-4 text-[#5A2EA6]" />
              </div>
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink tracking-tight">
                  Partner Identity
                </h3>
                <p className="text-soft text-[11px]">
                  Primary partner name and regional assignments
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Partner Name */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Partner Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-white border border-line rounded-[18px] p-3.5 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                  required
                />
              </div>

              {/* City */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Operating City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Indore"
                  className="w-full bg-white border border-line rounded-[18px] p-3.5 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                  required
                />
              </div>
            </div>
          </section>

          {/* ─── Section 2: Contact Details ─── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-line">
              <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/8 flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#5A2EA6]" />
              </div>
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink tracking-tight">
                  Contact Information
                </h3>
                <p className="text-soft text-[11px]">Primary email and active mobile numbers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Email */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Primary Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@ateliergroup.co"
                    className="w-full bg-white border border-line rounded-[18px] p-3.5 pl-11 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                    required
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5A2EA6]/10 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98999 00011"
                    className="w-full bg-white border border-line rounded-[18px] p-3.5 pl-11 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                    required
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5A2EA6]/10 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  </div>
                </div>
              </div>

              {/* Region */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Operating Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-white border border-line rounded-[18px] p-3.5 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer transition-all duration-200 appearance-none"
                >
                  <option>Central India</option>
                  <option>West India</option>
                  <option>North India</option>
                  <option>South India</option>
                </select>
              </div>
            </div>
          </section>

          {/* ─── Section 3: Revenue & Agreement ─── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-line">
              <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/8 flex items-center justify-center">
                <Percent className="w-4 h-4 text-[#5A2EA6]" />
              </div>
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink tracking-tight">
                  Agreement & Equity
                </h3>
                <p className="text-soft text-[11px]">
                  Profit shares, commissions, and contract start date
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profit Share */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Profit Share Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={share}
                    onChange={(e) => setShare(e.target.value)}
                    placeholder="10"
                    className="w-full bg-white border border-line rounded-[18px] p-3.5 pl-11 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5A2EA6]/10 flex items-center justify-center">
                    <Percent className="w-3 h-3 text-[#5A2EA6]" />
                  </div>
                </div>
              </div>

              {/* Contract Date */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Contract Commencement Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-line rounded-[18px] p-3.5 pl-11 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer"
                    required
                  />
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Info Card ── */}
          <div className="bg-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#5A2EA6]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4.5 h-4.5 text-[#5A2EA6]" />
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-ink leading-relaxed">
                This contract and billing arrangement can be amended anytime by Super-Admin with
                appropriate notification to the partner.
              </p>
            </div>
          </div>

          {/* ── Sticky Bottom Action Bar ── */}
          <div className="sticky bottom-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-[#ECE6F8] p-4 shadow-[0_8px_30px_rgba(90,46,166,0.12)] flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/franchise-partners')}
              className="px-8 py-2.5 rounded-xl text-[13px] font-bold text-soft border border-line hover:bg-paper/40 hover:text-ink cursor-pointer transition-all duration-200 bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-[#7B4DFF] to-[#A970FF] hover:from-[#6B3DE6] hover:to-[#9560EE] shadow-[0_4px_14px_rgba(123,77,255,0.35)] hover:shadow-[0_6px_20px_rgba(123,77,255,0.45)] cursor-pointer transition-all duration-200 flex items-center gap-2 border-0 hover:-translate-y-0.5"
            >
              Register Partner
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
