import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit2,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DayHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart: string;
  breakEnd: string;
}

interface BrandHoliday {
  id: string;
  name: string;
  date: string;
  applicableBranches: string;
  type: 'National Gazetted' | 'Festive Celebration' | 'Regional Holiday';
  status: 'Scheduled' | 'Completed' | 'Deactivated';
}

const initialWorkingDays: DayHours[] = [
  {
    day: 'Monday',
    isOpen: true,
    openTime: '09:30 AM',
    closeTime: '09:00 PM',
    breakStart: '02:00 PM',
    breakEnd: '03:00 PM',
  },
  {
    day: 'Tuesday',
    isOpen: true,
    openTime: '09:30 AM',
    closeTime: '09:00 PM',
    breakStart: '02:00 PM',
    breakEnd: '03:00 PM',
  },
  {
    day: 'Wednesday',
    isOpen: true,
    openTime: '09:30 AM',
    closeTime: '09:00 PM',
    breakStart: '02:00 PM',
    breakEnd: '03:00 PM',
  },
  {
    day: 'Thursday',
    isOpen: true,
    openTime: '09:30 AM',
    closeTime: '09:00 PM',
    breakStart: '02:00 PM',
    breakEnd: '03:00 PM',
  },
  {
    day: 'Friday',
    isOpen: true,
    openTime: '09:30 AM',
    closeTime: '09:30 PM',
    breakStart: '02:00 PM',
    breakEnd: '03:00 PM',
  },
  {
    day: 'Saturday',
    isOpen: true,
    openTime: '09:00 AM',
    closeTime: '10:00 PM',
    breakStart: '02:00 PM',
    breakEnd: '03:00 PM',
  },
  {
    day: 'Sunday',
    isOpen: true,
    openTime: '09:00 AM',
    closeTime: '10:00 PM',
    breakStart: '02:00 PM',
    breakEnd: '03:00 PM',
  },
];

const initialHolidays: BrandHoliday[] = [
  {
    id: 'HOL-001',
    name: 'Independence Day',
    date: '15 Aug 2026',
    applicableBranches: 'All 6 Network Salons',
    type: 'National Gazetted',
    status: 'Completed',
  },
  {
    id: 'HOL-002',
    name: 'Raksha Bandhan Special Half-Day',
    date: '28 Aug 2026',
    applicableBranches: 'All 6 Network Salons',
    type: 'Festive Celebration',
    status: 'Scheduled',
  },
  {
    id: 'HOL-003',
    name: 'Ganesh Chaturthi',
    date: '14 Sep 2026',
    applicableBranches: 'Indore, Bhopal, Ujjain Outlets',
    type: 'Festive Celebration',
    status: 'Scheduled',
  },
  {
    id: 'HOL-004',
    name: 'Gandhi Jayanti',
    date: '02 Oct 2026',
    applicableBranches: 'All 6 Network Salons',
    type: 'National Gazetted',
    status: 'Scheduled',
  },
  {
    id: 'HOL-005',
    name: 'Diwali & Laxmi Pujan Closure',
    date: '01 Nov 2026',
    applicableBranches: 'All 6 Network Salons',
    type: 'Festive Celebration',
    status: 'Scheduled',
  },
  {
    id: 'HOL-006',
    name: 'Madhya Pradesh Foundation Day',
    date: '01 Nov 2026',
    applicableBranches: 'All MP Outlets',
    type: 'Regional Holiday',
    status: 'Scheduled',
  },
];

export function WorkingHoursHolidaysTab() {
  const [workingDays, setWorkingDays] = useState<DayHours[]>(initialWorkingDays);
  const [holidays, setHolidays] = useState<BrandHoliday[]>(initialHolidays);

  // Modal State for Add Holiday
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('2026-12-25');
  const [newHolidayType, setNewHolidayType] = useState<BrandHoliday['type']>('National Gazetted');
  const [newHolidayBranches, setNewHolidayBranches] = useState('All 6 Network Salons');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (isAddHolidayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddHolidayOpen]);

  const handleToggleDay = (index: number) => {
    const updated = [...workingDays];
    updated[index].isOpen = !updated[index].isOpen;
    setWorkingDays(updated);
  };

  const handleTimeChange = (index: number, field: keyof DayHours, val: string) => {
    const updated = [...workingDays];
    (updated[index] as any)[field] = val;
    setWorkingDays(updated);
  };

  const handleSaveWorkingHours = () => {
    showToast('Brand default working hours saved and synced across network calendars.');
  };

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim()) return;

    const newH: BrandHoliday = {
      id: `HOL-${Math.floor(100 + Math.random() * 900)}`,
      name: newHolidayName,
      date: newHolidayDate,
      applicableBranches: newHolidayBranches,
      type: newHolidayType,
      status: 'Scheduled',
    };
    setHolidays([...holidays, newH]);
    showToast(`Holiday "${newHolidayName}" added to brand calendar.`);
    setIsAddHolidayOpen(false);
    setNewHolidayName('');
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
    showToast('Holiday entry removed from calendar.');
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

      {/* 1. Brand-Level Default Working Hours (Section 6 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Standard Weekly Working Hours
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                Brand Default Template
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Establish default opening, closing, and staff lunch break hours for all 7 days of the
              week
            </p>
          </div>

          <Button
            onClick={handleSaveWorkingHours}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Hours to Network</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase">
                <th className="p-3 pl-4">Day of the Week</th>
                <th className="p-3 text-center">Salon Status</th>
                <th className="p-3">Opening Time</th>
                <th className="p-3">Closing Time</th>
                <th className="p-3">Midday Break Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {workingDays.map((d, idx) => (
                <tr key={d.day} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3 pl-4 font-bold text-ink text-xs whitespace-nowrap">{d.day}</td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggleDay(idx)}
                      className={cn(
                        'px-3 py-1 rounded-full text-[10px] font-bold transition border cursor-pointer',
                        d.isOpen
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200',
                      )}
                    >
                      {d.isOpen ? '● Open' : '○ Closed'}
                    </button>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <input
                      type="text"
                      disabled={!d.isOpen}
                      value={d.openTime}
                      onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                      className="px-2.5 py-1 bg-[#F8F5FF] disabled:bg-slate-50 border border-[#5A2EA6]/20 rounded-lg font-mono font-bold text-xs text-ink outline-none w-28"
                    />
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <input
                      type="text"
                      disabled={!d.isOpen}
                      value={d.closeTime}
                      onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                      className="px-2.5 py-1 bg-[#F8F5FF] disabled:bg-slate-50 border border-[#5A2EA6]/20 rounded-lg font-mono font-bold text-xs text-ink outline-none w-28"
                    />
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono text-xs">
                      <input
                        type="text"
                        disabled={!d.isOpen}
                        value={d.breakStart}
                        onChange={(e) => handleTimeChange(idx, 'breakStart', e.target.value)}
                        className="px-2 py-1 bg-[#F8F5FF] disabled:bg-slate-50 border border-[#5A2EA6]/20 rounded-lg font-bold text-xs text-ink outline-none w-24 text-center"
                      />
                      <span className="text-muted text-xs">to</span>
                      <input
                        type="text"
                        disabled={!d.isOpen}
                        value={d.breakEnd}
                        onChange={(e) => handleTimeChange(idx, 'breakEnd', e.target.value)}
                        className="px-2 py-1 bg-[#F8F5FF] disabled:bg-slate-50 border border-[#5A2EA6]/20 rounded-lg font-bold text-xs text-ink outline-none w-24 text-center"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Holiday Calendar Master Table (Section 6 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Brand Holiday &amp; Festive Closures Calendar
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {holidays.length} Holidays
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              National gazetted closures, festival half-days, and regional salon blackout dates
            </p>
          </div>

          <Button
            onClick={() => setIsAddHolidayOpen(true)}
            className="h-[32px] px-3 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Brand Holiday</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Holiday / Occasion</th>
                <th className="p-3.5">Calendar Date</th>
                <th className="p-3.5">Applicable Salons</th>
                <th className="p-3.5">Holiday Type</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {holidays.map((h) => (
                <tr key={h.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink text-xs">
                    {h.name}
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-mono text-slate-900 font-bold">
                    {h.date}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">
                    {h.applicableBranches}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        h.type === 'National Gazetted'
                          ? 'bg-purple-50 text-[#5A2EA6] border-purple-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200',
                      )}
                    >
                      {h.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                        h.status === 'Completed'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      )}
                    >
                      {h.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteHoliday(h.id)}
                      className="h-[28px] px-2 rounded-lg text-[10px] font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
                      title="Remove Holiday"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Add Brand Holiday Portaled Modal */}
      {isAddHolidayOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsAddHolidayOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                    Holiday Calendar
                  </span>
                  <h3 className="font-serif font-bold text-ink text-lg mt-1">
                    Schedule Brand Holiday
                  </h3>
                  <p className="text-xs text-muted">
                    Blackout salon appointment slots across selected branches
                  </p>
                </div>
                <button
                  onClick={() => setIsAddHolidayOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateHoliday} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="text-soft font-bold block mb-1">
                    Holiday / Occasion Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christmas Day Closure"
                    value={newHolidayName}
                    onChange={(e) => setNewHolidayName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none"
                  />
                </div>

                <div>
                  <label className="text-soft font-bold block mb-1">Calendar Date *</label>
                  <input
                    type="date"
                    required
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-soft font-bold block mb-1">Holiday Classification</label>
                  <select
                    value={newHolidayType}
                    onChange={(e) => setNewHolidayType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
                  >
                    <option value="National Gazetted">National Gazetted Holiday (Mandatory)</option>
                    <option value="Festive Celebration">
                      Festive Celebration (Brand Discretion)
                    </option>
                    <option value="Regional Holiday">Regional / State Specific Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="text-soft font-bold block mb-1">Applicable Salon Outlets</label>
                  <select
                    value={newHolidayBranches}
                    onChange={(e) => setNewHolidayBranches(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none cursor-pointer"
                  >
                    <option value="All 6 Network Salons">
                      All 6 Network Salons (Network-wide)
                    </option>
                    <option value="Indore Branches Only">
                      Indore Branches Only (Vijay Nagar &amp; Palasia)
                    </option>
                    <option value="Bhopal &amp; Gwalior Outlets">
                      Bhopal &amp; Gwalior Outlets
                    </option>
                    <option value="Ujjain Studio Only">Ujjain Studio Only</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsAddHolidayOpen(false)}
                    className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-[36px] px-5 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    Add Holiday
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
