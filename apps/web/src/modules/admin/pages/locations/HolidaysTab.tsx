import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  CalendarDays,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  Filter,
  List,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAdminContext } from '../../context/AdminContext';
import { tenantsApi } from '@/shared/api/tenants.api';
import { masterBranches } from './AllBranchesTab';

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  monthIndex: number; // 0-11
  dayOfMonth: number;
  branchScope: string; // 'All Branches' or specific name
  type: 'Public Holiday' | 'Festival' | 'Branch Holiday' | 'Special Closure';
  description: string;
  status: 'Upcoming' | 'Passed';
}

const initialHolidays: HolidayItem[] = [
  {
    id: 'HOL-01',
    name: 'Independence Day Closure',
    date: '15 Aug 2026',
    monthIndex: 7,
    dayOfMonth: 15,
    branchScope: 'All Branches',
    type: 'Public Holiday',
    description: 'National public holiday closure across all company salons.',
    status: 'Passed',
  },
  {
    id: 'HOL-02',
    name: 'Raksha Bandhan Morning',
    date: '28 Aug 2026',
    monthIndex: 7,
    dayOfMonth: 28,
    branchScope: 'All Branches',
    type: 'Festival',
    description: 'Morning half-day festival closure. Salon opens at 02:00 PM for festive walk-ins.',
    status: 'Upcoming',
  },
  {
    id: 'HOL-03',
    name: 'Gandhi Jayanti',
    date: '02 Oct 2026',
    monthIndex: 9,
    dayOfMonth: 2,
    branchScope: 'All Branches',
    type: 'Public Holiday',
    description: 'National public holiday observance.',
    status: 'Upcoming',
  },
  {
    id: 'HOL-04',
    name: 'Diwali Festive Closure',
    date: '08 Nov 2026',
    monthIndex: 10,
    dayOfMonth: 8,
    branchScope: 'All Branches',
    type: 'Festival',
    description: 'Diwali Laxmi Pujan main festival day closure.',
    status: 'Upcoming',
  },
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function HolidaysTab() {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const branchList = useMemo(() => {
    return salon?.branches && salon.branches.length > 0 ? salon.branches : masterBranches;
  }, [salon?.branches]);

  const [holidays, setHolidays] = useState<HolidayItem[]>(initialHolidays);
  const [selectedBranch, setSelectedBranch] = useState<string>('All Branches');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(7); // August 2026

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewHoliday, setViewHoliday] = useState<HolidayItem | null>(null);
  const [editHoliday, setEditHoliday] = useState<HolidayItem | null>(null);
  const [deleteHoliday, setDeleteHoliday] = useState<HolidayItem | null>(null);

  // Load holidays from API
  useEffect(() => {
    tenantsApi
      .getHolidays()
      .then((apiHols) => {
        if (Array.isArray(apiHols) && apiHols.length > 0) {
          const mapped: HolidayItem[] = apiHols.map((h: any, idx: number) => {
            const dateObj = new Date(h.date);
            const mIdx = isNaN(dateObj.getMonth()) ? 7 : dateObj.getMonth();
            const dNum = isNaN(dateObj.getDate()) ? 15 : dateObj.getDate();
            return {
              id: h.id || `HOL-${idx + 1}`,
              name: h.description || h.name || 'Holiday Closure',
              date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              monthIndex: mIdx,
              dayOfMonth: dNum,
              branchScope: h.branch?.name || 'All Branches',
              type: (h.type || 'Public Holiday') as any,
              description: h.description || 'Scheduled Holiday',
              status: dateObj < new Date() ? 'Passed' : 'Upcoming',
            };
          });
          setHolidays(mapped);
        }
      })
      .catch((err) => {
        console.warn('[HolidaysTab] Could not load holidays from API:', err);
      });
  }, []);

  // New Holiday form
  const [newHol, setNewHol] = useState({
    name: '',
    date: '2026-08-25',
    branchScope: 'All Branches',
    type: 'Public Holiday' as HolidayItem['type'],
    description: '',
  });

  const filteredHolidays = holidays.filter((h) => {
    const matchesBranch =
      selectedBranch === 'All Branches' ||
      h.branchScope === 'All Branches' ||
      h.branchScope === selectedBranch;
    return matchesBranch;
  });

  const monthHolidays = filteredHolidays.filter((h) => h.monthIndex === currentMonthIndex);

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHol.name || !newHol.date) {
      toast('Please enter holiday name and date.');
      return;
    }

    const dateObj = new Date(newHol.date);
    const mIdx = isNaN(dateObj.getMonth()) ? 7 : dateObj.getMonth();
    const dNum = isNaN(dateObj.getDate()) ? 1 : dateObj.getDate();

    const created: HolidayItem = {
      id: `HOL-0${holidays.length + 1}`,
      name: newHol.name,
      date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      monthIndex: mIdx,
      dayOfMonth: dNum,
      branchScope: newHol.branchScope,
      type: newHol.type,
      description: newHol.description || `${newHol.name} closure`,
      status: 'Upcoming',
    };

    // Persist to API if branch selected
    try {
      const targetBranch = branchList.find((b) => b.name === newHol.branchScope) || branchList[0];
      if (targetBranch?.id) {
        await tenantsApi.createHoliday(targetBranch.id, {
          date: newHol.date,
          description: newHol.name,
        });
      }
    } catch (err) {
      console.warn('[HolidaysTab] Create holiday error:', err);
    }

    setHolidays((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewHol({
      name: '',
      date: '2026-08-25',
      branchScope: 'All Branches',
      type: 'Public Holiday',
      description: '',
    });
    toast(`Holiday "${created.name}" created and added to holiday schedules.`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteHoliday) return;
    try {
      await tenantsApi.deleteHoliday(deleteHoliday.id);
    } catch {
      // Ignored
    }
    setHolidays((prev) => prev.filter((h) => h.id !== deleteHoliday.id));
    setDeleteHoliday(null);
    toast('Holiday removed from schedule.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
            Branch Holiday Calendar &amp; Closures
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Manage public holidays, regional festivals, and planned maintenance closures across
            salons.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-start lg:justify-end shrink-0">
          {/* Branch Filter */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6] appearance-none cursor-pointer shadow-xs"
            >
              <option value="All Branches">All Locations</option>
              {branchList.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-[#5A2EA6] absolute left-3 top-3.5 pointer-events-none" />
          </div>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#5A2EA6]/25 bg-[#FCFAFF] text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6] appearance-none cursor-pointer shadow-xs"
          >
            <option value="2026">2026 Calendar</option>
            <option value="2027">2027 Calendar</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#FCFAFF] rounded-xl border border-[#5A2EA6]/20">
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5',
                viewMode === 'calendar'
                  ? 'bg-[#5A2EA6] text-white shadow-2xs'
                  : 'bg-transparent text-soft hover:text-ink',
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5',
                viewMode === 'list'
                  ? 'bg-[#5A2EA6] text-white shadow-2xs'
                  : 'bg-transparent text-soft hover:text-ink',
              )}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          {/* Add Holiday Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs shrink-0 whitespace-nowrap ml-auto lg:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Holiday</span>
          </Button>
        </div>
      </div>

      {/* ================= CALENDAR VIEW ================= */}
      {viewMode === 'calendar' ? (
        <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/12 shadow-xs space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-[18px] text-ink font-bold">
                {months[currentMonthIndex]} {selectedYear}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
                {monthHolidays.length} Holidays Scheduled
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-soft cursor-pointer bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-soft cursor-pointer bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Day Grid (Simplified month layout) */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="p-2 font-bold text-muted uppercase text-[10px]">
                {d}
              </div>
            ))}

            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const holidayOnThisDay = monthHolidays.find((h) => h.dayOfMonth === dayNum);

              return (
                <div
                  key={dayNum}
                  onClick={() => holidayOnThisDay && setViewHoliday(holidayOnThisDay)}
                  className={cn(
                    'min-h-[72px] p-2 rounded-xl border transition-all text-left flex flex-col justify-between',
                    holidayOnThisDay
                      ? 'bg-purple-50/80 border-[#5A2EA6]/30 cursor-pointer hover:shadow-xs hover:border-[#5A2EA6]'
                      : 'bg-[#FCFAFF]/50 border-slate-100',
                  )}
                >
                  <span
                    className={cn(
                      'text-xs font-bold',
                      holidayOnThisDay ? 'text-[#5A2EA6]' : 'text-slate-700',
                    )}
                  >
                    {dayNum}
                  </span>

                  {holidayOnThisDay && (
                    <div
                      className={cn(
                        'p-1 rounded-md text-[9px] font-bold line-clamp-1 truncate',
                        holidayOnThisDay.type === 'Public Holiday'
                          ? 'bg-rose-100 text-rose-800'
                          : holidayOnThisDay.type === 'Festival'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800',
                      )}
                      title={holidayOnThisDay.name}
                    >
                      {holidayOnThisDay.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-[11px] text-muted flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Public Holiday</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5A2EA6]" />
              <span>Festival</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Branch Special Closure</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= LIST VIEW ================= */
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Annual Holiday Schedule Ledger
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Complete chronological registry of holiday closures and blackout dates
                </p>
              </div>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {filteredHolidays.length} Holidays Listed
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Holiday Title',
                    'Date & Year',
                    'Branch Scope',
                    'Category Type',
                    'Description Details',
                    'Status',
                    'Actions',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === 6 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {filteredHolidays.map((hol) => (
                  <tr key={hol.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-ink text-[13px]">{hol.name}</div>
                      <div className="text-[10px] text-muted font-mono">{hol.id}</div>
                    </td>
                    <td className="p-3.5 font-bold text-ink text-[12px]">{hol.date}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-soft text-[11.5px]">
                        {hol.branchScope}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          hol.type === 'Public Holiday'
                            ? 'bg-rose-100 text-rose-800'
                            : hol.type === 'Festival'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800',
                        )}
                      >
                        {hol.type}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-[11.5px] text-soft">
                      {hol.description}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-block px-2 py-0.5 rounded-full text-[9.5px] font-bold border',
                          hol.status === 'Upcoming'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200',
                        )}
                      >
                        {hol.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewHoliday(hol)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditHoliday({ ...hol })}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Edit Holiday"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteHoliday(hol)}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Delete Holiday"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODALS (Portaled to document.body) ================= */}

      {/* 1. Add Holiday Modal */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Add Holiday or Special Closure
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Blackout date for booking diaries across brand salon locations.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleAddHoliday}
                className="p-6 space-y-4 overflow-y-auto custom-scroll"
              >
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Designated holiday dates will prevent customers and staff from scheduling
                  appointment slots for the selected branches.
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Holiday Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diwali Laxmi Pujan"
                    value={newHol.name}
                    onChange={(e) => setNewHol({ ...newHol, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newHol.date}
                      onChange={(e) => setNewHol({ ...newHol, date: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Holiday Type
                    </label>
                    <select
                      value={newHol.type}
                      onChange={(e) =>
                        setNewHol({ ...newHol, type: e.target.value as HolidayItem['type'] })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Public Holiday">Public Holiday</option>
                      <option value="Festival">Festival</option>
                      <option value="Branch Holiday">Branch Holiday</option>
                      <option value="Special Closure">Special Closure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Branch Applicability Scope
                  </label>
                  <select
                    value={newHol.branchScope}
                    onChange={(e) => setNewHol({ ...newHol, branchScope: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="All Branches">All Branches (Global Network)</option>
                    {branchList.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Description / Staff Operating Guidelines
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Details regarding opening timings, compensations or emergency coverage..."
                    value={newHol.description}
                    onChange={(e) => setNewHol({ ...newHol, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Add to Calendar
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. View Holiday Modal */}
      {viewHoliday &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">{viewHoliday.name}</h3>
                  <span className="text-xs text-[#5A2EA6] font-bold">{viewHoliday.date}</span>
                </div>
                <button
                  onClick={() => setViewHoliday(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                {viewHoliday.description}
              </div>

              <div className="space-y-2 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Category Type:</span>
                  <strong className="text-ink">{viewHoliday.type}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Branch Scope:</span>
                  <strong className="text-[#5A2EA6]">{viewHoliday.branchScope}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Diary Status:</span>
                  <span className="font-bold text-emerald-700">{viewHoliday.status}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end border-t border-purple-50">
                <Button
                  onClick={() => setViewHoliday(null)}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                >
                  Close Details
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Delete Confirmation Modal */}
      {deleteHoliday &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-2 border-b border-rose-50">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">Remove Holiday?</h3>
                  <p className="text-[11px] text-muted">
                    {deleteHoliday.name} ({deleteHoliday.date})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                Deleting this holiday will restore normal branch operating hours in the central
                appointment diary and reopen customer booking windows.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteHoliday(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
