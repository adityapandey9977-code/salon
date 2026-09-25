import { useToast } from '@salon-spa-saas/ui';
import { ArrowLeft, Award, Check, Mail, MapPin, Phone, Sparkles, User } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function AddManagerPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('Indore Flagship');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [kpi, setKpi] = useState('90%');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast('Please fill in required fields.');
      return;
    }
    toast(`Successfully onboarded manager: ${name}!`);
    navigate('/managers');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in duration-300 max-w-4xl mx-auto flex flex-col h-full overflow-hidden"
    >
      {/* ── Fixed Page Header ── */}
      <div className="shrink-0 border-b border-line pb-2 pt-1 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/managers')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-xs transition-all duration-200 hover:border-[#5A2EA6]/30 hover:bg-[#5A2EA6]/5 group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-soft transition-colors group-hover:text-[#5A2EA6]" />
          </button>
          <div>
            <h1 className="font-serif text-[18px] font-semibold leading-tight text-ink">
              Add New Manager
            </h1>
            <p className="text-[10.5px] text-soft">
              Onboard a new chain store administrator and assign location access.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#5A2EA6]/10 bg-[#5A2EA6]/5 px-2.5 py-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#5A2EA6]" />
          <span className="text-[10.5px] font-semibold text-[#5A2EA6]">Step 1 of 1</span>
        </div>
      </div>

      {/* ── Scrollable Body area ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3.5 space-y-4 pr-1 min-h-0">
        {/* Banner with modern premium glow */}
        <div className="relative overflow-hidden rounded-xl border border-[#EFE7FF] bg-gradient-to-r from-[#F7F2FF] via-[#EFE6FF] to-[#F9F7FF] shadow-xs">
          <div className="relative flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] shadow-md shrink-0">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-[#8A6AB8]">
                  Administrator Setup
                </p>
                <h2 className="font-serif text-[15px] font-bold text-[#2E1F46]">
                  Manager Credentials & Location Profile
                </h2>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-[#8A6AB8]/40 animate-pulse hidden md:block" />
          </div>
        </div>

        {/* Input Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card for Identity */}
          <div className="bg-white border border-[#EBE3FA] p-5 rounded-2xl space-y-3.5 shadow-2xs">
            <h3 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Personal Info
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                Manager Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white border border-[#E9E1FF] rounded-xl pl-9 pr-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  required
                />
                <User className="w-3.5 h-3.5 text-soft absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                Contact Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-white border border-[#E9E1FF] rounded-xl pl-9 pr-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                />
                <Phone className="w-3.5 h-3.5 text-soft absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                Platform Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@atelier.com"
                  className="w-full bg-white border border-[#E9E1FF] rounded-xl pl-9 pr-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  required
                />
                <Mail className="w-3.5 h-3.5 text-soft absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Card for Assignment */}
          <div className="bg-white border border-[#EBE3FA] p-5 rounded-2xl space-y-3.5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Branch & Target
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Assigned Branch
                </label>
                <div className="relative">
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-white border border-[#E9E1FF] rounded-xl pl-9 pr-9 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition cursor-pointer appearance-none"
                  >
                    <option value="Indore Flagship">Indore Flagship</option>
                    <option value="Bhopal Branch">Bhopal Branch</option>
                    <option value="Pune Branch">Pune Branch</option>
                  </select>
                  <MapPin className="w-3.5 h-3.5 text-soft absolute left-3 top-1/2 -translate-y-1/2" />
                  <span className="w-4 h-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-r-2 border-b-2 border-soft/50 rotate-45 transform origin-center -translate-x-[2px] -mt-[3px] scale-50" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Performance Target KPI
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={kpi}
                    onChange={(e) => setKpi(e.target.value)}
                    placeholder="e.g. 92%"
                    className="w-full bg-white border border-[#E9E1FF] rounded-xl pl-9 pr-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                    required
                  />
                  <Award className="w-3.5 h-3.5 text-soft absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8F5FF] border border-[#5A2EA6]/10 rounded-xl text-[10.5px] text-[#5A2EA6] font-medium leading-relaxed mt-2">
              💡 <strong>System Access Provision:</strong> Credential creation automatically
              generates a temporary portal password sent directly to the manager's email address.
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/managers')}
            className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-soft border border-line bg-white hover:bg-paper/20 hover:text-ink transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-white bg-gradient-to-r from-[#7B4DFF] to-[#A970FF] hover:from-[#6B3DE6] hover:to-[#9560EE] shadow-sm hover:shadow-md cursor-pointer transition border-0 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Onboard Manager</span>
          </button>
        </div>
      </div>
    </form>
  );
}
