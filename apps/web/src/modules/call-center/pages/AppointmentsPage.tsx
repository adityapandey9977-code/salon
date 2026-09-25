import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Globe,
  MapPin,
  Plus,
  Scissors,
  Search,
  Sparkles,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';


export function AppointmentsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches
  } = useCallCenterBranch();

  const [activeTab, setActiveTab] = useState<'all' | 'reschedule' | 'cancel' | 'waitlist' | 'bridal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  const [newBookingForm, setNewBookingForm] = useState({
    clientName: '',
    phone: '',
    branch: selectedBranch.name,
    service: 'Hydra Facial & Scalp Spa',
    stylist: 'Vikram Kulkarni',
    date: '2026-09-03',
    time: '11:00 AM',
    deposit: '1000'
  });

  const [appointments, setAppointments] = useState([
    {
      id: 'APT-2026-901',
      clientName: 'Sunita Kapoor',
      phone: '+91 98112 33445',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      service: 'Keratin Hair Treatment',
      stylist: 'Vikram Kulkarni',
      date: '2026-09-02',
      time: '10:30 AM',
      status: 'Confirmed',
      deposit: '₹1,000'
    },
    {
      id: 'APT-2026-902',
      clientName: 'Vikram Sethi',
      phone: '+91 98123 45678',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      service: 'Beard Trim & Spa Haircut',
      stylist: 'Neha Sharma',
      date: '2026-09-02',
      time: '02:00 PM',
      status: 'Pending Deposit',
      deposit: '₹500'
    },
    {
      id: 'APT-2026-903',
      clientName: 'Meera Deshmukh',
      phone: '+91 98334 55667',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      service: 'Bridal Package Consultation',
      stylist: 'Kavita Sundaram',
      date: '2026-09-03',
      time: '04:00 PM',
      status: 'Confirmed',
      deposit: '₹2,500'
    },
    {
      id: 'APT-2026-904',
      clientName: 'Rahul Verma',
      phone: '+91 99887 66554',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      service: 'Deep Tissue Swedish Massage',
      stylist: 'Aditi Nair',
      date: '2026-09-03',
      time: '05:30 PM',
      status: 'Reschedule Requested',
      deposit: '₹1,200'
    }
  ]);

  const [waitlist, setWaitlist] = useState([
    {
      id: 'WL-101',
      clientName: 'Aarti Shah',
      phone: '+91 98777 66554',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      requestedService: 'Balayage Hair Color & Gloss',
      preferredTime: 'Saturday Afternoon',
      urgency: 'High'
    },
    {
      id: 'WL-102',
      clientName: 'Sameer Joshi',
      phone: '+91 98123 99887',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      requestedService: 'Executive Spa & Beard Sculpting',
      preferredTime: 'Friday Evening',
      urgency: 'Medium'
    }
  ]);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingForm.clientName || !newBookingForm.phone) return;

    const newId = `APT-2026-${Math.floor(910 + Math.random() * 80)}`;
    const newApt = {
      id: newId,
      clientName: newBookingForm.clientName,
      phone: newBookingForm.phone,
      branch: newBookingForm.branch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      service: newBookingForm.service,
      stylist: newBookingForm.stylist,
      date: newBookingForm.date,
      time: newBookingForm.time,
      status: 'Confirmed',
      deposit: `₹${Number(newBookingForm.deposit).toLocaleString('en-IN')}`
    };

    setAppointments([newApt, ...appointments]);
    setIsNewBookingModalOpen(false);
    setNewBookingForm({ clientName: '', phone: '', branch: selectedBranch.name, service: 'Hydra Facial & Scalp Spa', stylist: 'Vikram Kulkarni', date: '2026-09-03', time: '11:00 AM', deposit: '1000' });
    toast(`Appointment Dispatched: [${newId}] booked at ${newApt.branch}. WhatsApp confirmation sent to ${newApt.phone}.`);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    toast(`Appointment Cancelled: [${id}] status updated to Cancelled.`);
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesBranch = isAllBranches || a.branchId === selectedBranchId;
    const matchesTab =
      activeTab === 'all' ? true :
        activeTab === 'reschedule' ? a.status === 'Reschedule Requested' :
          activeTab === 'cancel' ? a.status === 'Cancelled' :
            activeTab === 'bridal' ? a.service.toLowerCase().includes('bridal') : true;
    const matchesSearch =
      a.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesTab && matchesSearch;
  });

  const filteredWaitlist = waitlist.filter((w) => isAllBranches || w.branchId === selectedBranchId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Cross-Branch Appointment Dispatch Engine
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Calendar Dispatch' : `${selectedBranch.shortName} Dispatch`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Multi-branch booking scheduler: Real-time specialist availability, conflict-free chair allocation, advance deposit links, and WhatsApp confirmation dispatch.'
              : `Appointment schedule and specialist availability strictly for ${selectedBranch.name}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </button>

          <button
            onClick={() => toast(`Export Schedule: Downloaded booking schedule for ${selectedBranch.shortName} as CSV.`)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export Schedule
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All Scheduled Bookings', count: appointments.filter(a => isAllBranches || a.branchId === selectedBranchId).length },
          { id: 'reschedule', label: 'Reschedule Requests', count: appointments.filter(a => a.status === 'Reschedule Requested' && (isAllBranches || a.branchId === selectedBranchId)).length },
          { id: 'cancel', label: 'Cancellations', count: appointments.filter(a => a.status === 'Cancelled' && (isAllBranches || a.branchId === selectedBranchId)).length },
          { id: 'waitlist', label: 'Waitlist & Slot Fill', count: filteredWaitlist.length },
          { id: 'bridal', label: 'Bridal & Group Bookings', count: appointments.filter(a => a.service.toLowerCase().includes('bridal') && (isAllBranches || a.branchId === selectedBranchId)).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-soft hover:text-ink border border-line'
              }`}
          >
            {tab.label}{' '}
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search by client name, mobile phone (+91), service, or Appointment ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent border-0 outline-none text-ink"
        />
      </div>

      {/* MAIN VIEW */}
      {activeTab === 'waitlist' ? (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-2">
            <h3 className="font-bold text-sm text-ink">Active Client Waitlist (Slot Fill Desk)</h3>
            <span className="text-xs text-soft">{filteredWaitlist.length} clients waiting</span>
          </div>

          <div className="space-y-3">
            {filteredWaitlist.map((w) => (
              <div key={w.id} className="p-3 bg-pine/5 rounded-xl border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-ink">{w.clientName} ({w.phone})</div>
                  <div className="text-[11px] text-soft">Requested: {w.requestedService} • Preferred: {w.preferredTime}</div>
                  <div className="text-[10px] text-purple-700 font-semibold">{w.branch}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${w.urgency === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                    {w.urgency} Urgency
                  </span>
                  <button
                    onClick={() => {
                      toast(`Allocating Slot: Contacting ${w.clientName} with newly opened chair at ${w.branch}.`);
                    }}
                    className="px-3 py-1 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer border-0"
                  >
                    Assign Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-3">Booking ID &amp; Time</th>
                  <th className="p-3">Client &amp; Phone #</th>
                  <th className="p-3">Target Outlet</th>
                  <th className="p-3">Service &amp; Stylist</th>
                  <th className="p-3">Advance Deposit</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-3 font-bold text-purple-700">
                      <div>{apt.id}</div>
                      <div className="text-[10px] text-muted font-mono">{apt.date} • {apt.time}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-ink">{apt.clientName}</div>
                      <div className="text-[10.5px] font-mono text-soft">{apt.phone}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-ink flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                        {apt.branch}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-ink">{apt.service}</div>
                      <div className="text-[10px] text-purple-700 flex items-center gap-1">
                        <Scissors className="w-2.5 h-2.5" />
                        {apt.stylist}
                      </div>
                    </td>

                    <td className="p-3 font-bold text-emerald-700">{apt.deposit}</td>

                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          apt.status === 'Pending Deposit' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            apt.status === 'Reschedule Requested' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                        {apt.status}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-1.5">
                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 rounded-lg text-[11px] font-bold cursor-pointer border border-rose-200"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW APPOINTMENT MODAL */}
      {isNewBookingModalOpen && createPortal(
        <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">Cross-Branch Booking Dispatch</h3>
                <p className="text-xs text-soft">Schedule conflict-free appointment at any salon branch</p>
              </div>
              <button onClick={() => setIsNewBookingModalOpen(false)} className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={newBookingForm.clientName}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, clientName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Guest Phone (+91) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={newBookingForm.phone}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-mono text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Target Salon Branch *</label>
                  <select
                    value={newBookingForm.branch}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, branch: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    {branches.filter(b => b.id !== 'all').map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Requested Service *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keratin Treatment"
                    value={newBookingForm.service}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, service: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newBookingForm.date}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, date: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    placeholder="11:00 AM"
                    value={newBookingForm.time}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, time: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Advance Deposit (₹)</label>
                  <input
                    type="number"
                    value={newBookingForm.deposit}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, deposit: e.target.value })}
                    className="w-full p-2.5 bg-white border border-emerald-400 rounded-xl font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Confirm &amp; Send WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
