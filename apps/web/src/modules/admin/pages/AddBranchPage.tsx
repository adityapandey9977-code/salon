import { useToast } from '@salon-spa-saas/ui';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  FileText,
  Globe,
  Hash,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function AddBranchPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [locationType, setLocationType] = useState('Standard Location');
  const [address, setAddress] = useState('');
  const [manager, setManager] = useState('');
  const [staffCount, setStaffCount] = useState('10');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gst, setGst] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
  const [operatingHours, setOperatingHours] = useState('10:00 AM – 8:00 PM');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !manager.trim()) {
      toast('Please fill in all required fields.');
      return;
    }
    toast(`Successfully provisioned new branch: ${name}!`);
    navigate('/branches');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in duration-300 max-w-5xl mx-auto flex flex-col h-full overflow-hidden"
    >
      {/* ── Fixed Page Header ── */}
      <div className="shrink-0 border-b border-line pb-2 pt-1 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/branches')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-xs transition-all duration-200 hover:border-[#5A2EA6]/30 hover:bg-[#5A2EA6]/5 group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-soft transition-colors group-hover:text-[#5A2EA6]" />
          </button>
          <div>
            <h1 className="font-serif text-[18px] font-semibold leading-tight text-ink">
              Add New Branch
            </h1>
            <p className="text-[10.5px] text-soft">
              Create a new salon location and assign its manager.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#5A2EA6]/10 bg-[#5A2EA6]/5 px-2.5 py-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#5A2EA6]" />
          <span className="text-[10.5px] font-semibold text-[#5A2EA6]">Step 1 of 1</span>
        </div>
      </div>

      {/* ── Andar Wala Container (Content + Buttons inside this div) ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2.5 space-y-3.5 pr-1 min-h-0">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-xl border border-[#EFE7FF] bg-gradient-to-r from-[#F7F2FF] via-[#EFE6FF] to-[#F9F7FF] shadow-xs">
          <div className="relative flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] shadow-md shrink-0">
                <Building2 className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <p className="text-[8.5px] font-bold uppercase tracking-[0.18em] text-[#8A6AB8]">
                  Branch Setup
                </p>
                <h2 className="font-serif text-[15px] font-bold text-[#2E1F46]">
                  Branch Information
                </h2>
              </div>
            </div>

            {/* Right Graphic with Working Smooth Floating/Bouncing Animation */}
            <div className="relative hidden lg:flex h-10 w-[180px] items-end justify-end overflow-hidden shrink-0">
              <div className="absolute bottom-0 flex items-end gap-1 z-10">
                <div className="h-4 w-5 rounded-t-md bg-gradient-to-t from-[#B18BFF] to-[#E7DAFF]" />
                <div className="h-8 w-6 rounded-t-md bg-gradient-to-t from-[#8F62FF] to-[#DCC9FF]" />
                <div className="h-6 w-5 rounded-t-md bg-gradient-to-t from-[#A970FF] to-[#E9DEFF]" />
                <div className="h-9 w-7 rounded-t-md bg-gradient-to-t from-[#7B4DFF] to-[#D7C0FF]" />
              </div>

              {/* Location Pin - animate-bounce add kiya aur duration-1000 ki conflict-class hata di */}
              <div className="absolute top-0 right-6 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] shadow-md z-20 animate-bounce">
                <MapPin className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-3">
          {/* Section 1 */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b border-line">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#5A2EA6]/8 flex items-center justify-center">
                <Building2 className="w-3 h-3 text-[#5A2EA6]" />
              </div>
              <h3 className="font-serif text-[13.5px] font-bold text-ink tracking-tight">
                Branch Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Branch Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pune Koregaon Park"
                  className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  required
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Location Type
                </label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs cursor-pointer transition"
                >
                  <option>Standard Location</option>
                  <option>Flagship Location</option>
                  <option>Boutique Location</option>
                  <option>Express Kiosk</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                Physical Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Koregaon Park Lane 5, Pune, Maharashtra"
                className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                required
              />
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b border-line">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#5A2EA6]/8 flex items-center justify-center">
                <User className="w-3 h-3 text-[#5A2EA6]" />
              </div>
              <h3 className="font-serif text-[13.5px] font-bold text-ink tracking-tight">
                Manager Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Assigned Manager <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="e.g. Aditi Malhotra"
                    className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 pl-8 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                    required
                  />
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-soft" />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Initial Staff Count
                </label>
                <input
                  type="number"
                  value={staffCount}
                  onChange={(e) => setStaffCount(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                />
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b border-line">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#5A2EA6]/8 flex items-center justify-center">
                <FileText className="w-3 h-3 text-[#5A2EA6]" />
              </div>
              <h3 className="font-serif text-[13.5px] font-bold text-ink tracking-tight">
                Business Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 pl-8 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  />
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-soft" />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="branch@atelier.com"
                    className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 pl-8 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  />
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-soft" />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  GST Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 pl-8 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  />
                  <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-soft" />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Opening Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={openingDate}
                    onChange={(e) => setOpeningDate(e.target.value)}
                    className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 pl-8 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition cursor-pointer"
                  />
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-soft" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b border-line">
              <div className="w-5.5 h-5.5 rounded-lg bg-[#5A2EA6]/8 flex items-center justify-center">
                <Clock className="w-3 h-3 text-[#5A2EA6]" />
              </div>
              <h3 className="font-serif text-[13.5px] font-bold text-ink tracking-tight">
                Operational Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Branch Timezone
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 pl-8 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs cursor-pointer transition"
                  >
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>Asia/Dubai (GST)</option>
                  </select>
                  <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-soft" />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                  Operating Hours
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="10:00 AM – 8:00 PM"
                    className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 pl-8 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  />
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-soft" />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-semibold text-[#5A2EA6] uppercase tracking-wider mb-0.5 block">
                Notes <span className="text-muted text-[9px]">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional instructions or special requirements..."
                rows={1}
                className="w-full bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition resize-none"
              />
            </div>
          </section>

          {/* Info Card */}
          <div className="bg-[#F8F5FF] border border-[#5A2EA6]/10 rounded-lg p-2.5 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#5A2EA6]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-3 h-3 text-[#5A2EA6]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink leading-snug">
                Managers & staff settings can be updated later from{' '}
                <span className="text-[#5A2EA6] font-bold">Branch Settings</span>.
              </p>
            </div>
          </div>
        </div>

        {/* ── Action Buttons Moving Inside the Content Container ── */}
        <div className="pt-3 border-t border-[#ECE6F8] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/branches')}
            className="px-5 py-1.5 rounded-lg text-[11px] font-bold text-soft border border-line bg-white hover:bg-paper/20 hover:text-ink transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-1.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-[#7B4DFF] to-[#A970FF] hover:from-[#6B3DE6] hover:to-[#9560EE] shadow-xs cursor-pointer transition flex items-center gap-1.5 border-0"
          >
            Create Branch
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </form>
  );
}
