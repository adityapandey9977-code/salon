import { BookAppointmentModal } from '@/shared/components/BookAppointmentModal';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MapPin,
  MessageSquare,
  Navigation,
  Plus,
  RotateCcw,
  Search,
  User,
  X,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';

export function AppointmentsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // 5 SUB-TABS: Book Appointment, Upcoming, History, Reschedule, Cancel
  const [activeTab, setActiveTab] = useState<
    'book' | 'upcoming' | 'history' | 'reschedule' | 'cancel'
  >('upcoming');

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<any>(null);
  const [cancelModalAppt, setCancelModalAppt] = useState<any>(null);

  // Form State for Inline Book Appointment (All 6 requested fields)
  const [bookForm, setBookForm] = useState({
    branch: 'Indrapuri Central Outlet',
    service: 'Hydra Facial Detox & Glow Spa',
    preferredStylist: 'Priya Sharma (Master Aesthetician)',
    date: '2026-08-08',
    time: '04:00 PM',
    specialNotes: 'Ammonia-free formulas only. Sensitive skin.',
  });

  // Reschedule Form State
  const [newRescheduleDate, setNewRescheduleDate] = useState('2026-08-09');
  const [newRescheduleTime, setNewRescheduleTime] = useState('02:00 PM');

  // Master Appointments State
  const [appointments, setAppointments] = useState([
    {
      id: 'APT-901',
      service: 'Hydra Facial Detox & Glow Spa',
      branch: 'Indrapuri Central Outlet',
      stylist: 'Priya Sharma',
      date: '2026-08-08',
      time: '04:00 PM',
      price: '₹4,200',
      depositPaid: '₹500',
      status: 'Confirmed',
      type: 'upcoming',
    },
    {
      id: 'APT-882',
      service: 'Balayage Hair Color & Gloss',
      branch: 'Indrapuri Central Outlet',
      stylist: 'Vikram Kulkarni',
      date: '2026-07-20',
      time: '11:30 AM',
      price: '₹6,500',
      depositPaid: '₹1,000',
      status: 'Completed',
      type: 'history',
    },
    {
      id: 'APT-855',
      service: 'Keratin Hair Spa & Scalp Detox',
      branch: 'Arera Colony Outlet',
      stylist: 'Aditi Malhotra',
      date: '2026-06-12',
      time: '03:00 PM',
      price: '₹4,800',
      depositPaid: '₹500',
      status: 'Completed',
      type: 'history',
    },
  ]);

  const handleInlineBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `APT-${Math.floor(900 + Math.random() * 90)}`;
    const newAppt = {
      id: newId,
      service: bookForm.service,
      branch: bookForm.branch,
      stylist: bookForm.preferredStylist,
      date: bookForm.date,
      time: bookForm.time,
      price: '₹4,200',
      depositPaid: '₹500',
      status: 'Confirmed',
      type: 'upcoming',
    };

    setAppointments([newAppt, ...appointments]);
    setActiveTab('upcoming');
    toast(
      `Appointment Booked Successfully: ${newId} confirmed for ${bookForm.date} at ${bookForm.time}. Deposit paid.`,
    );
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalAppt) return;

    setAppointments(
      appointments.map((a) =>
        a.id === rescheduleModalAppt.id
          ? { ...a, date: newRescheduleDate, time: newRescheduleTime }
          : a,
      ),
    );

    const apptId = rescheduleModalAppt.id;
    setRescheduleModalAppt(null);
    toast(
      `Reschedule Confirmed: ${apptId} updated to ${newRescheduleDate} at ${newRescheduleTime}. Reminders sent via WhatsApp.`,
    );
  };

  const handleConfirmCancel = (id: string) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a)));
    setCancelModalAppt(null);
    toast(`Appointment Cancelled: ${id} cancelled. ₹500 deposit refunded to your digital wallet.`);
  };

  const handleDirections = (branchName: string) => {
    toast(`Opening Directions: Redirecting to Google Maps for ${branchName}...`);
    window.open(
      `https://maps.google.com/?q=${encodeURIComponent(branchName + ' Bhopal')}`,
      '_blank',
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Appointments Management Desk
          </h1>
          <p className="text-xs text-soft mt-1">
            Book new appointments, manage upcoming visits, track past history, reschedule slots, and
            cancel bookings.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* 5 SUB-TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          {
            id: 'upcoming',
            label: 'Upcoming Appointments',
            count: appointments.filter((a) => a.type === 'upcoming' && a.status !== 'Cancelled')
              .length,
          },
          { id: 'book', label: 'Book Appointment' },
          {
            id: 'history',
            label: 'Appointment History',
            count: appointments.filter((a) => a.type === 'history').length,
          },
          { id: 'reschedule', label: 'Reschedule Requests' },
          {
            id: 'cancel',
            label: 'Cancelled Visits',
            count: appointments.filter((a) => a.status === 'Cancelled').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'book') {
                setIsBookModalOpen(true);
              }
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {tab.label}{' '}
            {tab.count !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: UPCOMING APPOINTMENTS TABLE */}
      {activeTab === 'upcoming' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-line flex justify-between items-center">
            <h3 className="text-base font-bold text-ink">Upcoming Appointment Visits</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-3">Appointment ID</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Stylist</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {appointments
                  .filter((a) => a.type === 'upcoming' && a.status !== 'Cancelled')
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-purple-50/30 transition-colors">
                      {/* Appointment ID */}
                      <td className="p-3 font-bold text-purple-700">{a.id}</td>

                      {/* Service */}
                      <td className="p-3 font-bold text-ink">{a.service}</td>

                      {/* Branch */}
                      <td className="p-3 font-medium text-soft">{a.branch}</td>

                      {/* Stylist */}
                      <td className="p-3 font-semibold text-purple-900">{a.stylist}</td>

                      {/* Date */}
                      <td className="p-3 font-bold text-ink">{a.date}</td>

                      {/* Time */}
                      <td className="p-3 font-bold text-purple-700">{a.time}</td>

                      {/* Status */}
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {a.status}
                        </span>
                      </td>

                      {/* ACTIONS: 3 BUTTONS (Reschedule, Cancel, Directions) */}
                      <td className="p-3 text-right space-x-1.5">
                        {/* Button 1: Reschedule */}
                        <button
                          onClick={() => setRescheduleModalAppt(a)}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold text-[11px] border border-purple-200 cursor-pointer"
                        >
                          Reschedule
                        </button>

                        {/* Button 2: Cancel */}
                        <button
                          onClick={() => setCancelModalAppt(a)}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold text-[11px] border border-rose-200 cursor-pointer"
                        >
                          Cancel
                        </button>

                        {/* Button 3: Directions */}
                        <button
                          onClick={() => handleDirections(a.branch)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-semibold text-[11px] border border-emerald-200 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3 text-emerald-600" /> Directions
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BOOK APPOINTMENT FORM - OPTIMIZED INLINE FORM */}
      {activeTab === 'book' && (
        <div className="bg-white p-6 rounded-3xl border border-line shadow-sm space-y-5 max-w-4xl mx-auto my-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 gap-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink">Book New Salon Session</h3>
              <p className="text-xs text-soft mt-0.5">
                Select service mode, branch outlet, specialist, date, and preferred time slot
              </p>
            </div>

            {/* Service Mode Toggle: In-Salon vs At-Home */}
            <div className="flex bg-pine/10 p-1 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => setBookForm({ ...bookForm, branch: 'Indrapuri Central Outlet' })}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  !bookForm.branch.includes('At-Home')
                    ? 'bg-[#5A2EA6] text-white shadow-sm'
                    : 'text-soft hover:text-ink'
                }`}
              >
                In-Salon Session
              </button>
              <button
                type="button"
                onClick={() => setBookForm({ ...bookForm, branch: 'At-Home Service (Bhopal)' })}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  bookForm.branch.includes('At-Home')
                    ? 'bg-[#5A2EA6] text-white shadow-sm'
                    : 'text-soft hover:text-ink'
                }`}
              >
                At-Home Service
              </button>
            </div>
          </div>

          <form onSubmit={handleInlineBookSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Branch Outlet */}
              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Branch Outlet *
                </label>
                <select
                  value={bookForm.branch}
                  onChange={(e) => setBookForm({ ...bookForm, branch: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Indrapuri Central Outlet">Indrapuri Central Outlet</option>
                  <option value="Arera Colony Outlet">Arera Colony Outlet</option>
                  <option value="Kolar Road Outlet">Kolar Road Outlet</option>
                  <option value="At-Home Service (Bhopal)">
                    At-Home Service (Bhopal Deliverable)
                  </option>
                </select>
              </div>

              {/* Treatment Service */}
              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Service Treatment *
                </label>
                <select
                  value={bookForm.service}
                  onChange={(e) => setBookForm({ ...bookForm, service: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Hydra Facial Detox & Glow Spa">
                    Hydra Facial Detox &amp; Glow Spa (60 Mins • ₹4,200)
                  </option>
                  <option value="Balayage Hair Color & Gloss">
                    Balayage Hair Color &amp; Gloss (120 Mins • ₹6,500)
                  </option>
                  <option value="Keratin Hair Smoothing Treatment">
                    Keratin Hair Smoothing Treatment (150 Mins • ₹7,800)
                  </option>
                  <option value="Precision Layered Haircut">
                    Precision Layered Haircut (45 Mins • ₹1,800)
                  </option>
                </select>
              </div>

              {/* Preferred Stylist */}
              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Preferred Specialist / Stylist *
                </label>
                <select
                  value={bookForm.preferredStylist}
                  onChange={(e) => setBookForm({ ...bookForm, preferredStylist: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Priya Sharma (Master Aesthetician)">
                    Priya Sharma (Master Aesthetician)
                  </option>
                  <option value="Vikram Kulkarni (Senior Colorist)">
                    Vikram Kulkarni (Senior Colorist)
                  </option>
                  <option value="Aditi Malhotra (Hair Spa Specialist)">
                    Aditi Malhotra (Hair Spa Specialist)
                  </option>
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookForm.date}
                    onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={bookForm.time}
                    onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="10:00 AM">10:00 AM Slot</option>
                    <option value="02:00 PM">02:00 PM Slot</option>
                    <option value="04:00 PM">04:00 PM Slot</option>
                    <option value="06:00 PM">06:00 PM Slot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Notes & Allergy Requests */}
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                Special Notes &amp; Skin Allergy Requests
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Ammonia-free formulas only. Sensitive skin facial products."
                value={bookForm.specialNotes}
                onChange={(e) => setBookForm({ ...bookForm, specialNotes: e.target.value })}
                className="w-full p-3 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
              />
            </div>

            {/* Summary & Confirm Button */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-purple-900 font-semibold">
                <span>
                  Selected: <strong className="font-bold">{bookForm.service}</strong>
                </span>{' '}
                •{' '}
                <span>
                  Deposit Due: <strong className="font-bold text-emerald-700">₹500</strong>
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-0 transition-all"
              >
                Confirm Booking &amp; Pay Deposit (₹500)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: APPOINTMENT HISTORY TABLE */}
      {(activeTab === 'history' || activeTab === 'reschedule' || activeTab === 'cancel') && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-line flex justify-between items-center">
            <h3 className="text-base font-bold text-ink">
              {activeTab === 'history'
                ? 'Past Visit History'
                : activeTab === 'reschedule'
                  ? 'Reschedule Log'
                  : 'Cancelled Visits Log'}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-3">Date</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Stylist</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Invoice</th>
                  <th className="p-3 text-right">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {appointments
                  .filter((a) =>
                    activeTab === 'cancel'
                      ? a.status === 'Cancelled'
                      : a.type === 'history' || a.status === 'Completed',
                  )
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-purple-50/30 transition-colors">
                      {/* 1. Date */}
                      <td className="p-3 font-bold text-ink">{a.date}</td>

                      {/* 2. Service */}
                      <td className="p-3 font-bold text-purple-700">{a.service}</td>

                      {/* 3. Stylist */}
                      <td className="p-3 font-semibold text-purple-900">{a.stylist}</td>

                      {/* 4. Amount */}
                      <td className="p-3 font-bold text-emerald-700 text-sm">{a.price}</td>

                      {/* 5. Status */}
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : a.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      {/* 6. Invoice */}
                      <td className="p-3">
                        <button
                          onClick={() =>
                            toast(`Download Invoice: Downloading receipt for ${a.id}...`)
                          }
                          className="px-2 py-1 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-lg font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-purple-600" /> Receipt
                        </button>
                      </td>

                      {/* 7. Feedback */}
                      <td className="p-3 text-right">
                        <button
                          onClick={() => navigate('/feedback')}
                          className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 rounded-lg font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3 text-amber-700" /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL (Wide max-w-xl createPortal) */}
      {rescheduleModalAppt &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Reschedule Visit
                  </h3>
                  <p className="text-xs text-soft">
                    {rescheduleModalAppt.service} ({rescheduleModalAppt.id})
                  </p>
                </div>
                <button
                  onClick={() => setRescheduleModalAppt(null)}
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
                      value={newRescheduleDate}
                      onChange={(e) => setNewRescheduleDate(e.target.value)}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={newRescheduleTime}
                      onChange={(e) => setNewRescheduleTime(e.target.value)}
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
                  of {rescheduleModalAppt.depositPaid} will be automatically transferred.
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setRescheduleModalAppt(null)}
                    className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Confirm New Slot
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* CANCEL MODAL (createPortal) */}
      {cancelModalAppt &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight text-rose-700">
                    Cancel Appointment
                  </h3>
                  <p className="text-xs text-soft">
                    {cancelModalAppt.service} ({cancelModalAppt.id})
                  </p>
                </div>
                <button
                  onClick={() => setCancelModalAppt(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 font-semibold">
                  Are you sure you want to cancel this visit? Your deposit of{' '}
                  {cancelModalAppt.depositPaid} will be immediately refunded to your digital wallet
                  balance.
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setCancelModalAppt(null)}
                  className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmCancel(cancelModalAppt.id)}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Confirm Cancellation &amp; Refund Deposit
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

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
