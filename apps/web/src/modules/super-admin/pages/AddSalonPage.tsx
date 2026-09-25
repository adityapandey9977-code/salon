import { Button, useToast } from '@salon-spa-saas/ui';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function AddSalonPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [plan, setPlan] = useState('Standard Plan');
  const [initialBranches, setInitialBranches] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !owner.trim() || !email.trim() || !phone.trim() || !city.trim()) {
      toast('Please fill in all required fields.');
      return;
    }
    toast(`Successfully provisioned new salon: ${name}!`);
    navigate('/salons');
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-6 pb-6">
      {/* ── Top Page Header ── */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#ECE6F8] p-4 sm:p-5 shadow-xs">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/salons')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white shadow-xs transition-all duration-200 hover:border-[#5A2EA6]/30 hover:bg-[#5A2EA6]/5 group"
            >
              <ArrowLeft className="h-4 w-4 text-soft transition-colors group-hover:text-[#5A2EA6]" />
            </button>
            <div>
              <h1 className="font-serif text-[24px] font-semibold leading-tight text-ink">
                Provision New Salon
              </h1>
              <p className="mt-0.5 text-[12px] text-soft">
                Register a new salon tenant and set up subscription details.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#5A2EA6]/10 bg-[#5A2EA6]/5 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-[#5A2EA6]" />
            <span className="text-[11px] font-semibold text-[#5A2EA6]">Tenant Onboarding</span>
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
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#8A6AB8]">
                  Tenant Provision
                </p>
                <h2 className="mt-0.5 font-serif text-[19px] font-bold text-[#2E1F46]">
                  Salon Information
                </h2>
                <p className="mt-1 max-w-md text-[11px] text-[#6F6286] font-normal leading-relaxed">
                  Fill in the details below to initialize a secure, isolated database tenant
                  instance.
                </p>
              </div>
            </div>

            {/* Right Illustration - Slimmed Down */}
            <div className="relative hidden lg:flex h-20 w-[280px] items-end justify-end overflow-hidden shrink-0">
              {/* Clouds */}
              <div className="absolute top-2 left-6 h-2 w-8 rounded-full bg-[#DCC9FF]/80" />
              <div className="absolute top-4 left-18 h-1.5 w-6 rounded-full bg-[#EADFFF]/80" />

              {/* Skyline */}
              <div className="absolute bottom-0 flex items-end gap-1.5 z-10">
                <div className="h-7 w-8 rounded-t-md bg-gradient-to-t from-[#B18BFF] to-[#E7DAFF]" />
                <div className="h-12 w-9 rounded-t-md bg-gradient-to-t from-[#8F62FF] to-[#DCC9FF]" />
                <div className="h-9 w-8 rounded-t-md bg-gradient-to-t from-[#A970FF] to-[#E9DEFF]" />
                <div className="h-15 w-10 rounded-t-md bg-gradient-to-t from-[#7B4DFF] to-[#D7C0FF]" />
              </div>

              {/* Location Pin */}
              <div className="absolute top-1 right-12 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] shadow-lg z-20 animate-bounce duration-1000">
                <MapPin className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Form Inner Container ── */}
        <div className="space-y-8 mt-6">
          {/* ─── Section 1: Tenant Details ─── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-line">
              <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/8 flex items-center justify-center">
                <Building className="w-4 h-4 text-[#5A2EA6]" />
              </div>
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink tracking-tight">
                  Salon Identity
                </h3>
                <p className="text-soft text-[11px]">Brand name, location city, and setup type</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salon Name */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Salon / Brand Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Belle Ame Luxury Spa"
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
                  placeholder="e.g. Mumbai"
                  className="w-full bg-white border border-line rounded-[18px] p-3.5 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                  required
                />
              </div>
            </div>
          </section>

          {/* ─── Section 2: Owner & Contact Details ─── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-line">
              <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/8 flex items-center justify-center">
                <User className="w-4 h-4 text-[#5A2EA6]" />
              </div>
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink tracking-tight">
                  Owner & Contact Details
                </h3>
                <p className="text-soft text-[11px]">
                  Primary point of contact for administrative billing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Owner Name */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Owner Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-white border border-line rounded-[18px] p-3.5 pl-11 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                    required
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5A2EA6]/10 flex items-center justify-center">
                    <User className="w-3 h-3 text-[#5A2EA6]" />
                  </div>
                </div>
              </div>

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
                    placeholder="owner@brand.com"
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
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-line rounded-[18px] p-3.5 pl-11 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                    required
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5A2EA6]/10 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Section 3: Subscription & Licensing ─── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-line">
              <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/8 flex items-center justify-center">
                <Award className="w-4 h-4 text-[#5A2EA6]" />
              </div>
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink tracking-tight">
                  Subscription Licensing
                </h3>
                <p className="text-soft text-[11px]">
                  Choose software plan tiers and license limits
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subscription Plan */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Subscription Tier
                </label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full bg-white border border-line rounded-[18px] p-3.5 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer transition-all duration-200 appearance-none"
                >
                  <option>Standard Plan</option>
                  <option>Premium Plan</option>
                  <option>Enterprise Plan</option>
                </select>
              </div>

              {/* Initial Branches Allocation */}
              <div className="group">
                <label className="text-[11px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-1.5 block">
                  Initial Branches Licensed
                </label>
                <input
                  type="number"
                  value={initialBranches}
                  onChange={(e) => setInitialBranches(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full bg-white border border-line rounded-[18px] p-3.5 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] placeholder:text-muted transition-all duration-200"
                />
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
                System-generated activation link will be sent to the administrator email to finalize
                credentials.
              </p>
            </div>
          </div>

          {/* ── Sticky Bottom Action Bar ── */}
          <div className="sticky bottom-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-[#ECE6F8] p-4 shadow-[0_8px_30px_rgba(90,46,166,0.12)] flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/salons')}
              className="px-8 py-2.5 rounded-xl text-[13px] font-bold text-soft border border-line hover:bg-paper/40 hover:text-ink cursor-pointer transition-all duration-200 bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-[#7B4DFF] to-[#A970FF] hover:from-[#6B3DE6] hover:to-[#9560EE] shadow-[0_4px_14px_rgba(123,77,255,0.35)] hover:shadow-[0_6px_20px_rgba(123,77,255,0.45)] cursor-pointer transition-all duration-200 flex items-center gap-2 border-0 hover:-translate-y-0.5"
            >
              Provision Salon
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
