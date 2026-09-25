import filterBgImage from '@/assets/images/filter-background-image.jpg';
import { BookAppointmentModal } from '@/shared/components/BookAppointmentModal';
import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Bell,
  Briefcase,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Filter,
  Heart,
  LayoutGrid,
  List,
  MapPin,
  MoreVertical,
  Phone,
  Play,
  Plus,
  Scissors,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

interface AppointmentItem {
  id: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  stylistName: string;
  price: string;
  status: 'Confirmed' | 'Arrived' | 'In Service' | 'Completed' | 'Cancelled';
  day?: number;
  room?: string;
}

const initialAppointments: AppointmentItem[] = [
  {
    id: 'apt-1',
    timeSlot: '09:00 AM',
    clientName: 'Priya Sharma',
    clientPhone: '+91 98201 44521',
    serviceName: 'Balayage Color & Gloss',
    stylistName: 'Aditi Malhotra',
    price: '₹4,800',
    status: 'In Service',
    day: 20,
    room: 'Chair 03',
  },
  {
    id: 'apt-2',
    timeSlot: '10:00 AM',
    clientName: 'Aarav Khanna',
    clientPhone: '+91 98765 12345',
    serviceName: 'Signature Haircut & Beard',
    stylistName: 'Rohan Mehra',
    price: '₹1,200',
    status: 'Arrived',
    day: 21,
    room: 'Chair 01',
  },
  {
    id: 'apt-3',
    timeSlot: '10:30 AM',
    clientName: 'Meera Kapoor',
    clientPhone: '+91 99302 88412',
    serviceName: 'Kérastase Caviar Hair Spa',
    stylistName: 'Ananya Rao',
    price: '₹3,500',
    status: 'Confirmed',
    day: 19,
    room: 'Chair 03',
  },
  {
    id: 'apt-4',
    timeSlot: '11:00 AM',
    clientName: 'Sana Nair',
    clientPhone: '+91 98112 33455',
    serviceName: 'Hydra Facial Detox',
    stylistName: 'Simran Kaur',
    price: '₹4,200',
    status: 'Confirmed',
    day: 20,
    room: 'Room 01',
  },
  {
    id: 'apt-5',
    timeSlot: '01:00 PM',
    clientName: 'Vikram Malhotra',
    clientPhone: '+91 97654 88901',
    serviceName: 'Deep Tissue Swedish Massage',
    stylistName: 'Simran Kaur',
    price: '₹3,800',
    status: 'Completed',
    day: 22,
    room: 'Room 02',
  },
];

const hoursList = ['09:00 AM', '10:00 AM', '10:30 AM', '11:00 AM', '01:00 PM'];
const daysList = ['Sun 20', 'Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26'];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed: 'bg-[#e4f0e9] text-[#23694d]',
    Arrived: 'bg-[#fef3d4] text-[#8a6012]',
    'In Service': 'bg-[#f3e0d8] text-[#a04028]',
    Completed: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px]',
        map[status] ?? 'bg-gray-100 text-gray-500',
      )}
    >
      {status}
    </span>
  );
}

export function AppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentItem[]>(initialAppointments);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [calendarScale, setCalendarScale] = useState<'day' | 'week' | 'month'>('week');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(19);

  // Custom calendar view states
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([
    'Hair',
    'Grooming',
    'Spa',
    'Skincare',
  ]);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([
    'Confirmed',
    'In Service',
    'Pending',
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dynamic Events mapping from appointments state
  const events = appointments.map((appt, idx) => {
    const dayNum = appt.day || 19;

    let category = 'Hair';
    if (
      appt.serviceName.toLowerCase().includes('facial') ||
      appt.serviceName.toLowerCase().includes('skincare')
    ) {
      category = 'Skincare';
    } else if (
      appt.serviceName.toLowerCase().includes('massage') ||
      appt.serviceName.toLowerCase().includes('spa') ||
      appt.serviceName.toLowerCase().includes('detox')
    ) {
      category = 'Spa';
    } else if (
      appt.serviceName.toLowerCase().includes('haircut') ||
      appt.serviceName.toLowerCase().includes('trim') ||
      appt.serviceName.toLowerCase().includes('beard') ||
      appt.serviceName.toLowerCase().includes('grooming')
    ) {
      category = 'Grooming';
    }

    let status = 'Confirmed';
    let badgeColor = 'bg-purple-100 text-purple-900 border-purple-300';
    if (
      appt.status.toLowerCase().includes('arrive') ||
      appt.status.toLowerCase().includes('service')
    ) {
      status = 'In Service';
      badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
    } else if (appt.status.toLowerCase().includes('pend')) {
      status = 'Pending';
      badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
    } else if (appt.status.toLowerCase().includes('complete')) {
      status = 'Confirmed';
      badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }

    let startHour = 10;
    if (appt.timeSlot) {
      const parts = appt.timeSlot.split(':');
      if (parts.length > 0) {
        let hr = Number.parseInt(parts[0], 10);
        const isPM = appt.timeSlot.toLowerCase().includes('pm');
        if (isPM && hr !== 12) hr += 12;
        if (!isPM && hr === 12) hr = 0;
        startHour = hr;
      }
    }

    return {
      id: appt.id,
      clientName: appt.clientName,
      clientPhone: appt.clientPhone,
      clientAvatar: `https://images.unsplash.com/photo-${1534528741775 + idx}?w=120`,
      service: appt.serviceName,
      staff: appt.stylistName,
      staffAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
      time: `${appt.timeSlot} - ${startHour + 1}:00 ${startHour >= 11 ? 'PM' : 'AM'}`,
      startHour: startHour,
      day: dayNum,
      category: category,
      status: status,
      price: appt.price,
      room: appt.room || 'Chair 03',
      notes: 'No specific client preferences recorded yet.',
      badgeColor: badgeColor,
    };
  });

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleStatus = (st: string) => {
    setActiveStatuses((prev) => (prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]));
  };

  const filteredEvents = events.filter(
    (e) => activeCategories.includes(e.category) && activeStatuses.includes(e.status),
  );

  const handleStatusChange = (id: string, newStatus: AppointmentItem['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    toast(`Appointment status changed to ${newStatus}`);
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = filterStatus === 'All' || appt.status === filterStatus;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="animate-in fade-in duration-300">
      {/* Page Header (Always Visible) */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Appointments Roster
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Check today's reservations list and statuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/40 backdrop-blur-md p-1 rounded-xl border border-line/40 shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-1 rounded-lg text-[11px] font-bold border-0 cursor-pointer transition',
                viewMode === 'list'
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-muted hover:text-ink',
              )}
            >
              List view
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'px-3 py-1 rounded-lg text-[11px] font-bold border-0 cursor-pointer transition',
                viewMode === 'calendar'
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-muted hover:text-ink',
              )}
            >
              Roster Schedule
            </button>
          </div>

          <Button
            onClick={() => setIsNewBookingOpen(true)}
            className="h-[40px] px-5 rounded-xl text-xs font-semibold premium-btn-primary gap-1.5 flex items-center shadow-lg cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Book appointment
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-[#FAF8FE] border border-[#5A2EA6]/10 rounded-[24px] p-5 shadow-xs mb-6">
          {/* Search bar & Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {['All', 'Confirmed', 'Arrived', 'In Service', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={cn(
                    'px-4 py-1.5 rounded-xl text-[11px] font-bold border cursor-pointer transition',
                    filterStatus === tab
                      ? 'bg-[#5A2EA6] text-white border-transparent'
                      : 'bg-white border-[#5A2EA6]/10 text-[#6D5B73] hover:bg-[#5A2EA6]/5',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search client/service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#5A2EA6]/15 bg-white focus:outline-none focus:border-[#5A2EA6] transition"
              />
            </div>
          </div>

          {/* List Table */}
          <div className="mt-5 border border-[#5A2EA6]/10 rounded-[20px] overflow-hidden bg-white/80">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF8FE] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                    {[
                      'Schedule Slot',
                      'Customer Name',
                      'Contact',
                      'Service Ordered',
                      'Assigned Stylist',
                      'Fee Charge',
                      'Status',
                      'Actions',
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'p-4 font-bold text-[10px] tracking-wider uppercase whitespace-nowrap',
                          i === 0 ? 'pl-6' : i === 7 ? 'pr-6 text-right' : '',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                  {filteredAppointments.map((appt) => (
                    <tr
                      key={appt.id}
                      onClick={() => {
                        const matchedEvent = events.find((e) => e.id === appt.id);
                        if (matchedEvent) {
                          setSelectedAppointment(matchedEvent);
                        }
                      }}
                      className="hover:bg-[#5A2EA6]/3 transition-colors duration-200 cursor-pointer"
                    >
                      <td className="p-4 pl-6 font-mono font-bold text-ink whitespace-nowrap">
                        {appt.timeSlot}
                      </td>
                      <td
                        className="p-4 font-bold text-ink whitespace-nowrap max-w-[130px] truncate"
                        title={appt.clientName}
                      >
                        {appt.clientName}
                      </td>
                      <td className="p-4 font-semibold whitespace-nowrap">{appt.clientPhone}</td>
                      <td
                        className="p-4 font-semibold text-ink whitespace-nowrap max-w-[170px] truncate"
                        title={appt.serviceName}
                      >
                        {appt.serviceName}
                      </td>
                      <td
                        className="p-4 font-semibold whitespace-nowrap max-w-[120px] truncate"
                        title={appt.stylistName}
                      >
                        {appt.stylistName}
                      </td>
                      <td className="p-4 font-bold text-[#5A2EA6] text-[13px] whitespace-nowrap">
                        {appt.price}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <StatusBadge status={appt.status} />
                      </td>
                      <td className="p-4 pr-6 text-right whitespace-nowrap space-x-2">
                        {appt.status === 'Confirmed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(appt.id, 'Arrived');
                            }}
                            title="Mark as Arrived"
                            className="w-8 h-8 inline-flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-blue-700 transition cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {appt.status === 'Arrived' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(appt.id, 'In Service');
                            }}
                            title="Start Service"
                            className="w-8 h-8 inline-flex items-center justify-center bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-full text-[#5A2EA6] transition cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {appt.status === 'In Service' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(appt.id, 'Completed');
                            }}
                            title="Checkout Guest"
                            className="w-8 h-8 inline-flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 transition cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(appt.id, 'Cancelled');
                          }}
                          title="Cancel Appointment"
                          className="w-8 h-8 inline-flex items-center justify-center bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full text-rose-700 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ── Grid/Calendar View (New Custom Premium Calendar Layout) ── */
        <div className="flex h-[720px] bg-[#F3EEF9] text-[#2C223B] font-sans overflow-hidden rounded-[32px] border border-[#5A2EA6]/15 shadow-xl select-none animate-in zoom-in-95 duration-200 mt-2">
          {/* ----------------- MAIN CALENDAR CONTAINER ----------------- */}
          <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden select-none bg-white">
            {/* Header: Navigation controls & Day/Week/Month toggles */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F0E6FA] pb-5 shrink-0">
              {/* Timeline Navigation Controls */}
              <div className="flex items-center space-x-3 bg-[#F8F4FD] px-4 py-2 rounded-full border border-[#E8DCF8]">
                <button
                  onClick={() => {
                    setSelectedDate(19);
                    toast('Navigated timeline back to today.');
                  }}
                  className="px-3.5 py-1.5 bg-[#E8DCF8] text-[#553C9A] border-0 rounded-full text-xs font-bold hover:bg-[#D6BCFA] transition cursor-pointer"
                >
                  Today
                </button>
                <div className="flex space-x-1 text-[#6B46C1]">
                  <ChevronLeft
                    onClick={() => setSelectedDate((prev) => (prev > 1 ? prev - 1 : 31))}
                    className="w-5 h-5 cursor-pointer hover:text-[#2C223B]"
                  />
                  <ChevronRight
                    onClick={() => setSelectedDate((prev) => (prev < 31 ? prev + 1 : 1))}
                    className="w-5 h-5 cursor-pointer hover:text-[#2C223B]"
                  />
                </div>
              </div>

              {/* View Toggle + Sidebar Toggle on the Right */}
              <div className="flex items-center space-x-3">
                <div className="bg-[#E8DCF8] p-1 rounded-full flex space-x-1 border border-[#D6BCFA] shrink-0">
                  {(['Month', 'Week', 'Day'] as const).map((view) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => {
                        setCalendarScale(view.toLowerCase() as any);
                        toast(`Switched view to ${view}`);
                      }}
                      className={cn(
                        'px-5 py-1.5 rounded-full text-xs font-bold capitalize transition border-0 cursor-pointer',
                        calendarScale === view.toLowerCase()
                          ? 'bg-white text-[#553C9A] shadow-md'
                          : 'text-[#6B46C1] hover:text-[#2C223B]',
                      )}
                    >
                      {view}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={cn(
                    'p-2 bg-[#E8DCF8] hover:bg-[#D6BCFA] text-[#553C9A] rounded-full border cursor-pointer transition-colors flex items-center justify-center h-[38px] w-[38px]',
                    isSidebarOpen ? 'border-[#8B5CF6]' : 'border-[#D6BCFA]',
                  )}
                  title="Toggle Filters & Mini Calendar"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Container Body */}
            <div className="flex-1 bg-white rounded-[24px] p-6 shadow-sm border border-[#E8DCF8] flex flex-col overflow-y-auto no-scrollbar">
              {/* ================= 1. WEEK VIEW ================= */}
              {calendarScale === 'week' && (
                <div className="w-full overflow-x-auto scrollbar-thin pb-4 select-none">
                  <div className="min-w-[1000px] flex flex-col h-full text-[12px]">
                    {/* Week Header Days */}
                    <div className="grid grid-cols-8 border-b border-[#F0E6FA] pb-3 text-center text-[#6B46C1] font-bold">
                      <div className="text-left pl-3 text-soft font-semibold">Timeline</div>
                      {['Sun 20', 'Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26'].map(
                        (day) => {
                          const dayNum = Number.parseInt(day.split(' ')[1], 10);
                          const isSelected = dayNum === selectedDate;
                          return (
                            <div
                              key={day}
                              onClick={() => {
                                setSelectedDate(dayNum);
                                setCalendarScale('day');
                                toast(`Selected ${day}`);
                              }}
                              className={cn(
                                'py-1.5 rounded-xl cursor-pointer hover:bg-[#F3EEF9] transition',
                                isSelected && 'bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]',
                              )}
                            >
                              {day}
                            </div>
                          );
                        },
                      )}
                    </div>

                    {/* Timeline Rows */}
                    <div className="divide-y divide-[#F0E6FA] mt-2">
                      {hoursList.map((hourSlot) => (
                        <div
                          key={hourSlot}
                          className="grid grid-cols-8 py-3.5 items-center hover:bg-[#FAF8FE]/50 transition-colors"
                        >
                          <div className="font-mono text-soft font-bold pl-3 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#C4B2E6]" /> {hourSlot}
                          </div>

                          {[
                            'Sun 20',
                            'Mon 21',
                            'Tue 22',
                            'Wed 23',
                            'Thu 24',
                            'Fri 25',
                            'Sat 26',
                          ].map((day) => {
                            const dayNum = Number.parseInt(day.split(' ')[1], 10);
                            const matchedEvent = filteredEvents.find(
                              (e) => e.day === dayNum && e.time.startsWith(hourSlot),
                            );

                            if (matchedEvent) {
                              return (
                                <div key={day} className="px-2">
                                  <div
                                    onClick={() => setSelectedAppointment(matchedEvent)}
                                    className={cn(
                                      'p-2.5 rounded-2xl border text-[11px] font-semibold cursor-pointer shadow-xs transition hover:scale-[1.03] hover:shadow-md',
                                      matchedEvent.badgeColor,
                                    )}
                                  >
                                    <p className="truncate font-bold leading-tight">
                                      {matchedEvent.clientName}
                                    </p>
                                    <p className="text-[9px] opacity-75 truncate">
                                      {matchedEvent.service}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={day}
                                onClick={() => {
                                  toast(`No appointment. Booking counter open for ${hourSlot}`);
                                  setIsNewBookingOpen(true);
                                }}
                                className="h-10 mx-2 rounded-xl border border-dashed border-[#E8DCF8] hover:border-[#8B5CF6] hover:bg-[#FAF8FE] transition cursor-pointer flex items-center justify-center group"
                              >
                                <Plus className="w-4 h-4 text-[#D6BCFA] group-hover:text-[#8B5CF6] transition-colors" />
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 2. DAY VIEW ================= */}
              {calendarScale === 'day' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center bg-[#FAF8FE] p-4 rounded-2xl border border-[#F0E6FA]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {selectedDate}
                      </span>
                      <div>
                        <h4 className="font-serif font-black text-[#2C223B]">
                          October {selectedDate}, 2026
                        </h4>
                        <p className="text-[11px] text-soft">Daily Roster Schedule</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#8B5CF6] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      {filteredEvents.filter((e) => e.day === selectedDate).length} Booked
                    </span>
                  </div>

                  <div className="divide-y divide-[#F0E6FA]">
                    {hoursList.map((hour) => {
                      const dayEvents = filteredEvents.filter(
                        (e) => e.day === selectedDate && e.time.startsWith(hour),
                      );

                      return (
                        <div key={hour} className="py-4 flex items-start gap-4">
                          <div className="w-20 font-mono text-xs font-bold text-soft pt-1">
                            {hour}
                          </div>
                          <div className="flex-1 space-y-2">
                            {dayEvents.length > 0 ? (
                              dayEvents.map((evt) => (
                                <div
                                  key={evt.id}
                                  onClick={() => setSelectedAppointment(evt)}
                                  className={cn(
                                    'p-3 rounded-2xl border cursor-pointer transition hover:shadow-md flex justify-between items-center',
                                    evt.badgeColor,
                                  )}
                                >
                                  <div>
                                    <h5 className="font-bold text-xs">{evt.clientName}</h5>
                                    <p className="text-[11px] opacity-80 mt-0.5">
                                      {evt.service} • Assigned to {evt.staff}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-full border border-black/5">
                                    {evt.room}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <button
                                onClick={() => setIsNewBookingOpen(true)}
                                className="w-full py-2.5 border border-dashed border-[#E8DCF8] hover:border-[#8B5CF6] hover:bg-[#FAF8FE] transition rounded-2xl text-[11px] font-bold text-soft cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" /> Book Slot {hour}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= 3. MONTH VIEW ================= */}
              {calendarScale === 'month' && (
                <div className="flex-1 flex flex-col text-[12px] h-full justify-between animate-in fade-in duration-200">
                  <div className="grid grid-cols-7 gap-3 text-center text-xs font-bold text-[#6B46C1] border-b border-[#F0E6FA] pb-3 shrink-0">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>

                  <div className="grid grid-cols-7 gap-3 flex-1 auto-rows-fr mt-3">
                    {/* Padding cells */}
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={`pad-${i}`}
                        className="p-3 bg-slate-50/20 rounded-2xl border border-transparent min-h-[64px]"
                      />
                    ))}

                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const dayEvents = filteredEvents.filter((e) => e.day === day);

                      const colIdx = (3 + i) % 7; // Wednesday is 3 (padding cells count is 3)
                      const tooltipPlacementClass =
                        colIdx === 0 || colIdx === 1
                          ? 'left-0 translate-x-0'
                          : colIdx === 5 || colIdx === 6
                            ? 'right-0 left-auto translate-x-0'
                            : 'left-1/2 -translate-x-1/2';

                      return (
                        <div
                          key={`day-${day}`}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onClick={() => {
                            setSelectedDate(day);
                            setCalendarScale('day');
                            toast(`Switched to Day view for Oct ${day}`);
                          }}
                          className="p-2.5 rounded-2xl border transition relative flex flex-col justify-between cursor-pointer min-h-[64px] bg-[#FAF8FE] border-[#F4EBFD] hover:border-[#8B5CF6] hover:shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <span
                              className={cn(
                                'text-xs font-bold flex items-center justify-center',
                                day === selectedDate
                                  ? 'bg-[#8B5CF6] text-white w-6 h-6 rounded-full'
                                  : 'text-[#3A2D52]',
                              )}
                            >
                              {day}
                            </span>
                            {dayEvents.length > 0 && (
                              <span className="text-[9px] font-bold text-[#6B46C1] bg-[#E8DCF8] px-1.5 py-0.5 rounded-md">
                                {dayEvents.length}
                              </span>
                            )}
                          </div>

                          {/* Event Indicators (Colored lines) inside Month Box */}
                          <div className="flex flex-col gap-1 mt-2">
                            {dayEvents.map((evt) => {
                              let barColor = 'bg-[#8B5CF6]'; // Hair
                              if (evt.category === 'Grooming') barColor = 'bg-[#F59E0B]';
                              else if (evt.category === 'Spa') barColor = 'bg-[#3B82F6]';
                              else if (evt.category === 'Skincare') barColor = 'bg-[#EC4899]';

                              return (
                                <div
                                  key={evt.id}
                                  className={cn('h-1 rounded-full w-full', barColor)}
                                  title={`${evt.clientName} - ${evt.service} (${evt.category})`}
                                />
                              );
                            })}
                          </div>

                          {/* HOVER OVERVIEW TOOLTIP */}
                          {hoveredDay === day && dayEvents.length > 0 && (
                            <div
                              className={cn(
                                'absolute bottom-full mb-2 w-56 bg-[#433854] text-white p-3 rounded-2xl shadow-2xl z-50 pointer-events-none border border-[#6B5985]',
                                tooltipPlacementClass,
                              )}
                            >
                              {/* Header */}
                              <p className="text-xs font-bold text-[#E5DCF2] mb-1.5 border-b border-[#5B4C73] pb-1">
                                Oct {day}, 2026 Overview
                              </p>

                              {/* Events List */}
                              <div className="space-y-1.5">
                                {dayEvents.map((e) => (
                                  <div key={e.id} className="text-[10px] leading-tight">
                                    <p className="font-bold text-white">
                                      {e.clientName} ({e.time.split(' - ')[0]})
                                    </p>
                                    <p className="text-[9px] text-[#CBBCDA]">{e.service}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* Color Category Legend */}
            <div className="flex flex-wrap items-center justify-end gap-4 mt-4 pt-3 border-t border-[#F0E6FA] text-[10px] font-bold text-[#6D5B73] shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-muted font-extrabold mr-1">
                Roster Legend:
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Hair Care
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Grooming
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Spa Therapy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Skincare Treatment
              </span>
            </div>
          </div>

          {/* ----------------- RIGHT SIDEBAR (Salon Background Image + Dark Purple Glassmorphism Overlay) ----------------- */}
          {isSidebarOpen && (
            <div
              className="w-80 text-white flex flex-col justify-between p-5 rounded-r-[32px] rounded-l-none shadow-2xl z-10 select-none shrink-0 relative overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 2), rgba(0, 0, 0, 0.1)), url(${filterBgImage})`,
              }}
            >
              <div className="space-y-6 relative z-10">
                {/* Top Controls */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    title="Close Sidebar Panel"
                    className="w-9 h-9 flex items-center justify-center bg-[#4F396F]/70 hover:bg-[#5C4282] backdrop-blur-md rounded-full border border-white/10 transition text-[#D6BCFA] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-1.5 bg-[#4F396F]/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FAF8FE]/10">
                    <Scissors className="w-4 h-4 text-[#C084FC]" />
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#F3EEF9]">
                      Admin Desk
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNewBookingOpen(true)}
                    title="Issue new counter booking"
                    className="w-9 h-9 flex items-center justify-center bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-full text-white border-0 shadow-lg shadow-purple-900/60 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Mini Calendar Widget */}
                <div className="bg-[#2E1D45]/80 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-lg text-[12px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm text-[#E2D4F8]">October 2026</span>
                    <div className="flex space-x-2">
                      <ChevronLeft
                        onClick={() => {
                          setSelectedDate((prev) => (prev > 1 ? prev - 1 : 31));
                          toast('Backward timeline navigated.');
                        }}
                        className="w-4 h-4 cursor-pointer text-[#C4B2E6] hover:text-white transition-colors"
                      />
                      <ChevronRight
                        onClick={() => {
                          setSelectedDate((prev) => (prev < 31 ? prev + 1 : 1));
                          toast('Forward timeline navigated.');
                        }}
                        className="w-4 h-4 cursor-pointer text-[#C4B2E6] hover:text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] text-[#B19CD9] mb-2 font-medium">
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                    <span>Su</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#E2D4F8]">
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const isSelected = day === selectedDate;
                      const hasAppointments = filteredEvents.some((e) => e.day === day);

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setSelectedDate(day);
                            setCalendarScale('day');
                            toast(`Selected date: October ${day}, 2026`);
                          }}
                          className={cn(
                            'h-7 w-7 relative flex items-center justify-center rounded-xl transition border-0 cursor-pointer text-[10px]',
                            isSelected
                              ? 'bg-[#8B5CF6] text-white font-bold shadow-md shadow-purple-900/80'
                              : 'hover:bg-[#4F3670]/60 text-[#D3C3ED] bg-transparent',
                          )}
                        >
                          {day}
                          {hasAppointments && !isSelected && (
                            <span className="absolute bottom-0.5 w-1 h-1 bg-[#C084FC] rounded-full"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Working Dynamic Filters */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#C4B2E6] uppercase tracking-wider flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5" /> Categories
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {['Hair', 'Grooming', 'Spa', 'Skincare'].map((cat) => (
                      <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={activeCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 rounded border-2 border-[#6E5796] bg-[#1E1230] checked:bg-[#8B5CF6] accent-[#8B5CF6] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-[#D3C3ED] group-hover:text-white transition-colors">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <h4 className="text-xs font-bold text-[#C4B2E6] uppercase tracking-wider mb-3">
                      Status
                    </h4>
                    <div className="space-y-2">
                      {['Confirmed', 'In Service', 'Pending'].map((st) => (
                        <label
                          key={st}
                          className="flex items-center space-x-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={activeStatuses.includes(st)}
                            onChange={() => toggleStatus(st)}
                            className="w-4 h-4 rounded border-2 border-[#6E5796] bg-[#1E1230] checked:bg-[#8B5CF6] accent-[#8B5CF6] cursor-pointer"
                          />
                          <span className="text-xs font-semibold text-[#D3C3ED] group-hover:text-white transition-colors">
                            {st}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Admin Profile */}
              <div className="pt-4 border-t border-white/10 flex items-center space-x-3 text-[12px] relative z-10 bg-[#25153A]/60 backdrop-blur-md -mx-5 -mb-5 p-5 rounded-br-[32px] rounded-bl-none">
                <div className="w-9 h-9 rounded-full bg-[#8B5CF6] text-white border border-purple-300 flex items-center justify-center font-bold text-sm shadow-sm">
                  M
                </div>
                <div>
                  <p className="font-bold text-[#F3EEF9]">Admin Desk</p>
                  <p className="text-[10px] text-[#C4B2E6] font-medium">Branch Operations</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Counter booking Modal */}
      <BookAppointmentModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onConfirm={(data) => {
          const newItem: AppointmentItem = {
            id: `apt-${Date.now()}`,
            timeSlot: data.time,
            clientName: data.client,
            clientPhone: '+91 99999 88888',
            serviceName: data.service,
            stylistName: data.staff,
            room: data.room,
            status: 'Confirmed',
            price: '₹2,500',
            day: data.day ? Number.parseInt(data.day.match(/\d+/)?.[0] || '19', 10) : 19,
          };
          setAppointments((prev) =>
            [newItem, ...prev].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)),
          );
          setIsNewBookingOpen(false);
          toast(' काउंटर बुकिंग सफलतापूर्वक दर्ज की गई।');
        }}
        defaultDay="Wed 23"
        defaultTime="10:00 AM"
        defaultStaff="Simran Kaur"
        defaultRoom="Chair 03"
        showDaySelector={true}
      />

      {/* ── RICH APPOINTMENT DETAIL MODAL (Slide-out Right Drawer) ── */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-end z-[100] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[420px] h-full shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col border-l border-[#5A2EA6]/10 animate-in slide-in-from-right duration-300 rounded-l-[32px] overflow-hidden">
            {/* Sticky Header */}
            <div className="p-5 border-b border-[#FAF8FE] flex items-center justify-between shrink-0 bg-white">
              <h3 className="text-md font-serif font-black text-[#2C223B]">Appointment Detail</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 bg-[#FAF8FE] hover:bg-[#E8DCF8] rounded-full border-0 cursor-pointer transition text-[#3A2D52] outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Compact Body */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto no-scrollbar bg-white">
              {/* Category & Status badges */}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wider',
                    selectedAppointment.badgeColor,
                  )}
                >
                  {selectedAppointment.category}
                </span>
                <span
                  className={cn(
                    'text-[9px] font-bold px-2 py-0.5 rounded-md',
                    selectedAppointment.status === 'In Service'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200',
                  )}
                >
                  {selectedAppointment.status}
                </span>
              </div>

              {/* Service Title */}
              <div>
                <h4 className="text-base font-serif font-black text-[#2C223B] leading-tight">
                  {selectedAppointment.service}
                </h4>
                <p className="text-[11px] text-soft flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3 h-3 text-[#8B5CF6]" />
                  <span>Allocated suite:</span>
                  <span className="text-[#3A2D52] font-bold">{selectedAppointment.room}</span>
                </p>
              </div>

              {/* Status Stepper Progression Tracker */}
              <div className="bg-[#FAF8FE] p-2.5 rounded-xl border border-[#F0E6FA] flex items-center justify-between text-[9px] font-bold text-soft select-none">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                    ✓
                  </div>
                  <span>Confirmed</span>
                </div>
                <div className="h-0.5 bg-emerald-300 flex-1 mx-2" />
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] border',
                      selectedAppointment.status === 'In Service' ||
                        selectedAppointment.status === 'Completed'
                        ? 'bg-emerald-500 text-white border-transparent'
                        : 'bg-white text-soft border-slate-300',
                    )}
                  >
                    {selectedAppointment.status === 'In Service' ||
                    selectedAppointment.status === 'Completed'
                      ? '✓'
                      : '2'}
                  </div>
                  <span>Arrived</span>
                </div>
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2',
                    selectedAppointment.status === 'In Service' ||
                      selectedAppointment.status === 'Completed'
                      ? 'bg-emerald-300'
                      : 'bg-slate-200',
                  )}
                />
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] border',
                      selectedAppointment.status === 'In Service'
                        ? 'bg-blue-500 text-white border-transparent animate-pulse'
                        : selectedAppointment.status === 'Completed'
                          ? 'bg-emerald-500 text-white border-transparent'
                          : 'bg-white text-soft border-slate-300',
                    )}
                  >
                    {selectedAppointment.status === 'Completed' ? '✓' : '3'}
                  </div>
                  <span>In Service</span>
                </div>
              </div>

              {/* Client & Staff Compact rows */}
              <div className="space-y-2.5">
                {/* Client Profile Box */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#FAF8FE] to-[#F5EFFE] border border-[#E9DDFD] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedAppointment.clientAvatar}
                      className="w-9 h-9 rounded-full object-cover border border-white shadow-sm shrink-0"
                      alt="Client"
                    />
                    <div>
                      <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#8B5CF6] block">
                        Client
                      </span>
                      <h4 className="font-bold text-xs text-[#2C223B]">
                        {selectedAppointment.clientName}
                      </h4>
                      <p className="text-[10px] text-soft mt-0.5 flex items-center gap-0.5">
                        <Phone className="w-2.5 h-2.5 text-soft" />{' '}
                        {selectedAppointment.clientPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Staff Profile Box */}
                <div className="p-3 rounded-xl bg-[#FAF8FE] border border-[#F0E6FA] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedAppointment.staffAvatar}
                      className="w-9 h-9 rounded-full object-cover border border-white shadow-sm shrink-0"
                      alt="Stylist"
                    />
                    <div>
                      <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#9F8BB8] block">
                        Stylist
                      </span>
                      <h4 className="font-bold text-xs text-[#2C223B]">
                        {selectedAppointment.staff}
                      </h4>
                      <p className="text-[10px] text-soft mt-0.5 flex items-center gap-0.5 font-semibold text-[#8B5CF6]">
                        <Sparkles className="w-2.5 h-2.5" /> Senior Stylist
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time & Cost Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-[#FAF8FE] border border-[#F0E6FA] rounded-xl text-[10.5px]">
                  <span className="text-soft font-bold uppercase text-[8px] tracking-wider block">
                    Time Allocation
                  </span>
                  <strong className="block text-[#2C223B] mt-0.5 text-xs">
                    {selectedAppointment.time}
                  </strong>
                  <span className="text-[9px] text-[#8B5CF6] font-semibold mt-0.5 block flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> Oct {selectedAppointment.day}
                  </span>
                </div>

                <div className="p-2.5 bg-[#FAF8FE] border border-[#F0E6FA] rounded-xl text-[10.5px] flex flex-col justify-between">
                  <div>
                    <span className="text-soft font-bold uppercase text-[8px] tracking-wider block">
                      Service Charge
                    </span>
                    <strong className="block text-[#8B5CF6] text-md font-black mt-0.5">
                      {selectedAppointment.price}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Special instructions */}
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-purple-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Special instructions
                </span>
                <p className="text-[10.5px] text-purple-955 mt-1 italic font-medium leading-relaxed">
                  "{selectedAppointment.notes}"
                </p>
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="flex space-x-3 p-5 bg-[#FAF8FE] border-t border-[#F0E6FA] shrink-0">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition cursor-pointer"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  const statusMap: Record<string, AppointmentItem['status']> = {
                    Confirmed: 'Arrived',
                    Arrived: 'In Service',
                    'In Service': 'Completed',
                  };
                  const currentStatus = selectedAppointment.status;
                  const nextStatus = statusMap[currentStatus];
                  if (nextStatus) {
                    handleStatusChange(selectedAppointment.id, nextStatus);
                  }
                  setSelectedAppointment(null);
                  toast('Status advanced successfully.');
                }}
                className="flex-1 py-2 rounded-lg bg-[#8B5CF6] text-white border-0 text-xs font-bold hover:bg-[#7C3AED] shadow-lg shadow-purple-500/20 transition cursor-pointer"
              >
                Advance Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
