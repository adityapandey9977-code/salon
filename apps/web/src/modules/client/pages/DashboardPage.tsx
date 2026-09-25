import { BookAppointmentModal } from '@/shared/components/BookAppointmentModal';
import { useToast } from '@salon-spa-saas/ui';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Gift,
  Headphones,
  Heart,
  History,
  MessageSquare,
  PackageCheck,
  Plus,
  RotateCcw,
  Sparkles,
  Star,
  Tag,
  User,
  Wallet,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';

export function DashboardPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState('2026-08-09');
  const [rescheduleTime, setRescheduleTime] = useState('02:00 PM');

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRescheduleModalOpen(false);
    toast(
      `Appointment Rescheduled: APT-901 moved to ${rescheduleDate} at ${rescheduleTime}. Reminders sent via WhatsApp.`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Gold Tier Member • Atelier Salon &amp; Spa
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Welcome back, Aakanksha!
          </h1>
          <p className="text-xs text-purple-200">
            Enjoy 15% Gold member discount on all hair &amp; facial spa bookings this month.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="z-10 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer border-0 flex items-center gap-1.5 shrink-0"
        >
          <Calendar className="w-4 h-4" />
          Book New Appointment
        </button>
      </div>

      {/* QUICK ACTIONS SECTION - 5 USER REQUESTED ACTIONS */}
      <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-soft">
          Quick Operations &amp; Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Action 1: Book Appointment */}
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="p-3.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-purple-900">Book Appointment</span>
          </button>

          {/* Action 2: Reschedule Appointment */}
          <button
            onClick={() => setIsRescheduleModalOpen(true)}
            className="p-3.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <RotateCcw className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-blue-900">Reschedule Visit</span>
          </button>

          {/* Action 3: View Packages */}
          <button
            onClick={() => navigate('/packages')}
            className="p-3.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Gift className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-amber-900">View Packages</span>
          </button>

          {/* Action 4: Give Feedback */}
          <button
            onClick={() => navigate('/feedback')}
            className="p-3.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-rose-900">Give Feedback</span>
          </button>

          {/* Action 5: Contact Support */}
          <button
            onClick={() => navigate('/support')}
            className="p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Headphones className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-emerald-900">Contact Support</span>
          </button>
        </div>
      </div>

      {/* ALL 6 USER REQUESTED CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Upcoming Appointment */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Upcoming Appointment
              </span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>

            <div>
              <h3 className="text-base font-bold text-ink">Hydra Facial Detox &amp; Glow Spa</h3>
              <p className="text-xs text-soft">Tomorrow, 04:00 PM • Indrapuri Outlet</p>
            </div>

            <div className="p-3 bg-pine/5 rounded-xl border border-line text-xs font-semibold text-purple-900">
              Specialist: Priya Sharma • Chair #3
            </div>
          </div>

          <button
            onClick={() => setIsRescheduleModalOpen(true)}
            className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-all cursor-pointer"
          >
            Reschedule Appointment
          </button>
        </div>

        {/* Card 2: Active Package */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                Active Package
              </span>
              <Gift className="w-4 h-4 text-amber-600" />
            </div>

            <div>
              <h3 className="text-base font-bold text-ink">Bridal Pamper Glow Package</h3>
              <p className="text-xs text-soft">3 of 5 Sessions Remaining • Valid till Nov 2026</p>
            </div>

            <div className="w-full bg-pine/10 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }} />
            </div>
          </div>

          <button
            onClick={() => navigate('/packages')}
            className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-all cursor-pointer"
          >
            View Active Packages
          </button>
        </div>

        {/* Card 3: Wallet Balance */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Wallet Balance
              </span>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>

            <div>
              <div className="text-3xl font-bold text-emerald-700">₹2,450</div>
              <p className="text-xs text-soft mt-0.5">Ready for 1-click checkout at salon desk</p>
            </div>

            <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              ✓ ₹550 Cashback bonus credited
            </div>
          </div>

          <button
            onClick={() => navigate('/wallet')}
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-all cursor-pointer"
          >
            Top-Up / View Wallet
          </button>
        </div>

        {/* Card 4: Loyalty Points */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                Loyalty Points
              </span>
              <Star className="w-4 h-4 text-purple-600 fill-purple-100" />
            </div>

            <div>
              <div className="text-3xl font-bold text-purple-900">1,250 Pts</div>
              <p className="text-xs text-soft mt-0.5">Convertible to ₹250 instant voucher</p>
            </div>

            <div className="text-[11px] text-purple-800 font-semibold bg-purple-50 p-2 rounded-lg border border-purple-200">
              Gold Tier • 750 Pts to Platinum
            </div>
          </div>

          <button
            onClick={() => navigate('/loyalty')}
            className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl border border-purple-200 transition-all cursor-pointer"
          >
            Redeem Points Catalog
          </button>
        </div>

        {/* Card 5: Recent Service */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Recent Service
              </span>
              <History className="w-4 h-4 text-slate-600" />
            </div>

            <div>
              <h3 className="text-base font-bold text-ink">Balayage Hair Color &amp; Gloss</h3>
              <p className="text-xs text-soft">Rendered 2026-07-20 • Bill: ₹6,500</p>
            </div>

            <div className="text-[11px] text-soft font-semibold">Specialist: Vikram Kulkarni</div>
          </div>

          <button
            onClick={() => navigate('/history')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            View Visit Receipt (PDF)
          </button>
        </div>

        {/* Card 6: Special Offers */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                Special Offers
              </span>
              <Tag className="w-4 h-4 text-rose-600" />
            </div>

            <div>
              <h3 className="text-base font-bold text-ink">Monsoon Spa Special Voucher</h3>
              <p className="text-xs text-soft">
                20% OFF on all body massages • Code: [SPA-GLOW-20]
              </p>
            </div>

            <div className="text-[11px] text-rose-700 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
              Valid till Aug 31, 2026
            </div>
          </div>

          <button
            onClick={() => navigate('/packages')}
            className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer"
          >
            Claim &amp; Apply Promo Code
          </button>
        </div>
      </div>

      {/* RESCHEDULE MODAL (Wide max-w-xl createPortal) */}
      {isRescheduleModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Reschedule Visit
                  </h3>
                  <p className="text-xs text-soft">Hydra Facial Detox &amp; Glow Spa (APT-901)</p>
                </div>
                <button
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      New Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      <option value="10:00 AM">10:00 AM Slot</option>
                      <option value="02:00 PM">02:00 PM Slot</option>
                      <option value="04:30 PM">04:30 PM Slot</option>
                      <option value="06:00 PM">06:00 PM Slot</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-xs font-semibold">
                  Notice: Rescheduling is free up to 4 hours prior to appointment time. Your deposit
                  of ₹500 will be automatically transferred.
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsRescheduleModalOpen(false)}
                    className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* BOOK APPOINTMENT MODAL */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onConfirm={(data) => {
          toast(
            `Appointment Confirmed: Reserved ${data.service} at ${data.time}. Deposit paid via wallet.`,
          );
          setIsBookModalOpen(false);
        }}
      />
    </div>
  );
}
