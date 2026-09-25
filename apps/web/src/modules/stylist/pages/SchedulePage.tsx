import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Loader2,
  MapPin,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Scissors,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  appointmentsApi,
  catalogueApi,
  customersApi,
  type ApiAppointmentItem,
  type ApiAppointmentSummary,
  type ApiCustomerSummary,
  type ApiServiceMaster,
} from '@/shared/api';
import { useCurrentStylist } from '../hooks/useCurrentStylist';

interface CalendarEvent {
  id: string;
  appointmentId: string;
  dayIndex: number; // 0 to 6
  dateStr: string;
  timeSlot: string; // '09:00 AM', '10:00 AM', etc.
  rawStartTime: string;
  rawEndTime: string;
  clientName: string;
  clientPhone?: string;
  serviceName: string;
  chair: string;
  duration: string;
  status: 'In Service' | 'Confirmed' | 'Waiting' | 'Completed' | 'Pending' | 'Cancelled';
  allergy?: string;
  color: string;
  price?: number;
}

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
];

function formatTimeSlot(dateStr: string): string {
  const d = new Date(dateStr);
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${strHours}:00 ${ampm}`;
}

function formatDisplayTime(dateStr: string): string {
  const d = new Date(dateStr);
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? `0${hours}` : `${hours}`;
  const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${strHours}:${strMinutes} ${ampm}`;
}

function normalizeStatus(
  status: string,
): 'In Service' | 'Confirmed' | 'Waiting' | 'Completed' | 'Pending' | 'Cancelled' {
  const s = (status || '').toUpperCase();
  if (s === 'IN_SERVICE' || s === 'IN SERVICE') return 'In Service';
  if (s === 'CONFIRMED') return 'Confirmed';
  if (s === 'WAITING' || s === 'CHECKED_IN') return 'Waiting';
  if (s === 'COMPLETED') return 'Completed';
  if (s === 'CANCELLED' || s === 'NO_SHOW') return 'Cancelled';
  return 'Pending';
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'In Service':
      return 'bg-[#5A2EA6] text-white border-[#5A2EA6]';
    case 'Waiting':
      return 'bg-amber-500 text-white border-amber-600';
    case 'Completed':
      return 'bg-emerald-600 text-white border-emerald-700';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-700 border-rose-300';
    case 'Confirmed':
    default:
      return 'bg-purple-100 text-[#5A2EA6] border-purple-300';
  }
}

export function SchedulePage() {
  const { toast } = useToast();
  const { stylist, staffId, stylistName, isLoading: isStylistLoading } = useCurrentStylist();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'calendar'>('today');
  const [calendarScale, setCalendarScale] = useState<'day' | 'week' | 'month'>('week');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [actionMenuEventId, setActionMenuEventId] = useState<string | null>(null);

  // Raw data stores
  const [appointments, setAppointments] = useState<ApiAppointmentSummary[]>([]);
  const [customers, setCustomers] = useState<ApiCustomerSummary[]>([]);
  const [services, setServices] = useState<ApiServiceMaster[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Calendar Week Offset (0 = this week, -1 = previous week, 1 = next week)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Calculate the 7 days of the active week
  const calendarDays = useMemo(() => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ...
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek + weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);

      const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

      days.push({
        day: dayNames[i],
        date: d.getDate(),
        fullDate: d,
        dateStr: d.toISOString().split('T')[0],
        isToday,
      });
    }
    return days;
  }, [weekOffset]);

  const activeWeekLabel = useMemo(() => {
    if (calendarDays.length === 0) return '';
    const first = calendarDays[0].fullDate;
    const last = calendarDays[6].fullDate;
    const m1 = first.toLocaleString('default', { month: 'short' });
    const m2 = last.toLocaleString('default', { month: 'short' });
    const y = last.getFullYear();
    return m1 === m2
      ? `${m1} ${first.getDate()} – ${last.getDate()}, ${y}`
      : `${m1} ${first.getDate()} – ${m2} ${last.getDate()}, ${y}`;
  }, [calendarDays]);

  // Fetch appointments, customers & catalogue
  const loadScheduleData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [aptList, custList, svcList] = await Promise.all([
        appointmentsApi
          .list({
            staffId: staffId || undefined,
            limit: 100,
          })
          .catch((err) => {
            console.warn('Failed to fetch appointments by staffId:', err);
            return [] as ApiAppointmentSummary[];
          }),
        customersApi.list({ limit: 100 }).catch(() => [] as ApiCustomerSummary[]),
        catalogueApi.fetchServices().catch(() => [] as ApiServiceMaster[]),
      ]);

      setAppointments(aptList || []);
      setCustomers(custList || []);
      setServices(svcList || []);
    } catch (err: any) {
      console.error('Error loading stylist schedule data:', err);
      toast('Could not load appointment data. Please refresh.');
    } finally {
      setIsLoadingData(false);
    }
  }, [staffId, toast]);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  // Convert raw appointments into unified calendar events
  const allEvents = useMemo<CalendarEvent[]>(() => {
    if (!appointments || appointments.length === 0) return [];

    const events: CalendarEvent[] = [];

    appointments.forEach((apt) => {
      // Find matching customer
      const cust = customers.find((c) => c.id === apt.customerId);
      const clientName =
        cust?.displayName ||
        `${cust?.firstName || ''} ${cust?.lastName || ''}`.trim() ||
        'Valued Client';
      const clientPhone = cust?.mobilePhone;

      // Filter items assigned to this stylist, or include all if staffId filter wasn't strict
      const relevantItems =
        apt.items && apt.items.length > 0
          ? apt.items.filter((it) => !staffId || it.staffId === staffId)
          : [];

      const itemsToMap =
        relevantItems.length > 0
          ? relevantItems
          : apt.items && apt.items.length > 0
            ? apt.items
            : [
                {
                  id: apt.id,
                  serviceId: 'default',
                  scheduledStartAt: apt.scheduledStartAt,
                  scheduledEndAt: apt.scheduledEndAt,
                  durationMinutesSnapshot: 60,
                  priceSnapshot: apt.subtotalEstimate || 0,
                  status: apt.status,
                } as any,
              ];

      itemsToMap.forEach((item: ApiAppointmentItem, idx: number) => {
        const svc = services.find((s) => s.id === item.serviceId);
        const serviceName = svc?.name || (idx === 0 && apt.notes ? apt.notes : 'Salon Service');

        // Extract chair from resources or default
        const resource = apt.resources?.[0];
        const chair = resource?.resourceType
          ? `${resource.resourceType} ${resource.id.slice(0, 2)}`
          : 'Station Chair 01';

        const startTime = item.scheduledStartAt || apt.scheduledStartAt;
        const endTime = item.scheduledEndAt || apt.scheduledEndAt;
        const itemDate = new Date(startTime);
        const dateStr = itemDate.toISOString().split('T')[0];

        // Day of week index (0 = Sun, ... 6 = Sat)
        const dayIndex = itemDate.getDay();
        const timeSlot = formatTimeSlot(startTime);
        const duration = item.durationMinutesSnapshot
          ? `${item.durationMinutesSnapshot} mins`
          : '60 mins';

        const status = normalizeStatus(item.status || apt.status);

        events.push({
          id: `${apt.id}-${item.id || idx}`,
          appointmentId: apt.id,
          dayIndex,
          dateStr,
          timeSlot,
          rawStartTime: startTime,
          rawEndTime: endTime,
          clientName,
          clientPhone,
          serviceName,
          chair,
          duration,
          status,
          allergy: apt.notes?.toLowerCase().includes('allerg')
            ? apt.notes
            : undefined,
          color: getStatusColor(status),
          price: Number(item.priceSnapshot || apt.subtotalEstimate || 0),
        });
      });
    });

    return events;
  }, [appointments, customers, services, staffId]);

  // Filter Today's Appointments
  const todayEvents = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return allEvents.filter((e) => e.dateStr === todayStr);
  }, [allEvents]);

  // Filter Upcoming Appointments (after today)
  const upcomingEvents = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return allEvents
      .filter((e) => e.dateStr > todayStr)
      .sort((a, b) => new Date(a.rawStartTime).getTime() - new Date(b.rawStartTime).getTime());
  }, [allEvents]);

  // Update appointment status action
  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: string,
    label: string,
  ) => {
    try {
      setIsUpdatingStatus(true);
      await appointmentsApi.updateStatus(appointmentId, newStatus);
      toast(`Appointment status updated to ${label}`);
      if (selectedEvent) {
        setSelectedEvent((prev) =>
          prev ? { ...prev, status: normalizeStatus(newStatus) } : null,
        );
      }
      setActionMenuEventId(null);
      await loadScheduleData();
    } catch (err: any) {
      console.error('Failed to update status:', err);
      toast(err?.message || 'Failed to update appointment status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const todayDateLabel = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
              My Schedule &amp; Time-Grid Diary
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {stylistName}
            </span>
          </div>
          <p className="text-[13px] text-soft mt-1">
            Personal appointment queue, daily service bookings, station chair allocations &amp; calendar diary
          </p>
        </div>

        {/* Tab Switcher & Refresh */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => loadScheduleData()}
            variant="outline"
            disabled={isLoadingData}
            className="h-9 px-3 text-xs font-bold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
            title="Refresh Schedule"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 mr-1', isLoadingData ? 'animate-spin' : '')} />
            Refresh
          </Button>

          <div className="flex bg-[#F8F5FF] p-1 rounded-2xl border border-[#5A2EA6]/15">
            <button
              onClick={() => setActiveTab('today')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
                activeTab === 'today'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
              )}
            >
              Today's Appointments ({todayEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
                activeTab === 'upcoming'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
              )}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
                activeTab === 'calendar'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
              )}
            >
              Full Time-Slot Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoadingData && (
        <div className="bg-[#FCFAFF] border border-[#5A2EA6]/15 rounded-2xl p-4 flex items-center justify-center gap-3 text-xs font-semibold text-[#5A2EA6]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Synchronizing schedule appointments from booking database...
        </div>
      )}

      {/* TAB 1: TODAY'S APPOINTMENTS */}
      {activeTab === 'today' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-ink">
                Today's Roster · {todayDateLabel}
              </h3>
              <p className="text-xs text-soft">
                Service appointments scheduled for {stylistName} today
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#5A2EA6] bg-[#5A2EA6]/10 px-3 py-1 rounded-full">
              {todayEvents.length} Appointments Scheduled
            </span>
          </div>

          {todayEvents.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <CalendarIcon className="w-10 h-10 text-[#5A2EA6]/30 mx-auto" />
              <p className="text-sm font-bold text-ink">No appointments scheduled for today</p>
              <p className="text-xs text-soft max-w-sm mx-auto">
                Any upcoming walk-ins or online bookings assigned to your profile will appear here live.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#5A2EA6]/10">
              {todayEvents.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-14 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] font-mono font-bold text-xs flex flex-col items-center justify-center shrink-0">
                      <span>{formatDisplayTime(item.rawStartTime)}</span>
                      <span className="text-[9.5px] text-soft font-normal">{item.duration}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-ink">{item.clientName}</h4>
                        {item.clientPhone && (
                          <span className="text-[11px] text-soft font-mono">
                            · {item.clientPhone}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-soft font-medium mt-0.5">
                        {item.serviceName} · <strong className="text-[#5A2EA6]">{item.chair}</strong>
                      </p>
                      {item.allergy && (
                        <span className="text-[10.5px] font-bold text-rose-700 block mt-1">
                          ⚠️ Safety Caution: {item.allergy}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold border',
                        item.status === 'In Service'
                          ? 'bg-purple-100 text-[#5A2EA6] border-purple-200'
                          : item.status === 'Waiting'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-[#5A2EA6]/10 text-[#5A2EA6] border-[#5A2EA6]/20',
                      )}
                    >
                      {item.status}
                    </span>

                    <div className="relative">
                      <Button
                        onClick={() =>
                          setActionMenuEventId(actionMenuEventId === item.id ? null : item.id)
                        }
                        variant="outline"
                        className="h-8 px-3 text-[11px] font-bold border-[#5A2EA6]/20 text-[#5A2EA6]"
                      >
                        Action ›
                      </Button>

                      {/* Dropdown Action Menu */}
                      {actionMenuEventId === item.id && (
                        <div className="absolute right-0 top-9 w-48 bg-white border border-[#5A2EA6]/20 rounded-2xl shadow-lg p-2 z-50 space-y-1 animate-in fade-in duration-150">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEvent(item);
                              setActionMenuEventId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-[#5A2EA6]/5 text-ink flex items-center gap-2 border-0 bg-transparent cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#5A2EA6]" /> View Full Details
                          </button>

                          {item.status !== 'In Service' && item.status !== 'Completed' && (
                            <button
                              type="button"
                              disabled={isUpdatingStatus}
                              onClick={() =>
                                handleUpdateStatus(item.appointmentId, 'IN_SERVICE', 'In Service')
                              }
                              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-purple-50 text-[#5A2EA6] flex items-center gap-2 border-0 bg-transparent cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 text-[#5A2EA6]" /> Start Service
                            </button>
                          )}

                          {item.status !== 'Completed' && (
                            <button
                              type="button"
                              disabled={isUpdatingStatus}
                              onClick={() =>
                                handleUpdateStatus(item.appointmentId, 'COMPLETED', 'Completed')
                              }
                              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 border-0 bg-transparent cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark Completed
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UPCOMING SCHEDULE */}
      {activeTab === 'upcoming' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-ink">Upcoming Reservations</h3>
              <p className="text-xs text-soft">
                Future confirmed client bookings for {stylistName}
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#5A2EA6] bg-[#5A2EA6]/10 px-3 py-1 rounded-full">
              {upcomingEvents.length} Total Upcoming
            </span>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <CalendarIcon className="w-10 h-10 text-[#5A2EA6]/30 mx-auto" />
              <p className="text-sm font-bold text-ink">No upcoming bookings found</p>
              <p className="text-xs text-soft">New reservations will automatically synchronize here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEvent(item)}
                  className="bg-[#FCFAFF] border border-[#5A2EA6]/15 rounded-2xl p-4 space-y-2 cursor-pointer hover:shadow-md hover:border-[#5A2EA6]/40 transition"
                >
                  <span className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    {new Date(item.rawStartTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <b className="text-sm font-bold text-ink block truncate">{item.clientName}</b>
                  <p className="text-[11.5px] text-soft font-medium truncate">{item.serviceName}</p>
                  <div className="flex justify-between items-center pt-2 text-[11px] border-t border-[#5A2EA6]/10">
                    <span className="font-mono font-bold text-ink">
                      {formatDisplayTime(item.rawStartTime)}
                    </span>
                    <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold px-2 py-0.5 rounded-md">
                      {item.chair}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FULL INTERACTIVE TIME-SLOT CALENDAR GRID */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4 overflow-hidden">
          {/* Calendar Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-ink">Interactive Diary Grid</h3>
                <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                  {activeWeekLabel}
                </span>
              </div>
              <p className="text-xs text-soft mt-0.5">
                Click any appointment block to view treatment details, client contacts &amp; chair status
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Navigation Arrows */}
              <div className="flex items-center gap-1 bg-[#F8F5FF] p-1 rounded-xl border border-[#5A2EA6]/15">
                <Button
                  variant="outline"
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                  className="h-8 w-8 p-0 rounded-lg border-0 text-[#5A2EA6] hover:bg-white"
                  title="Previous Week"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <button
                  type="button"
                  onClick={() => setWeekOffset(0)}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#5A2EA6] bg-transparent border-0 cursor-pointer hover:bg-white rounded-lg transition"
                >
                  Today
                </button>
                <Button
                  variant="outline"
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="h-8 w-8 p-0 rounded-lg border-0 text-[#5A2EA6] hover:bg-white"
                  title="Next Week"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Time-Slot Grid Table */}
          <div className="overflow-x-auto border border-[#5A2EA6]/15 rounded-2xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/15">
                  <th className="p-3 font-mono font-bold text-[10px] text-[#5A2EA6] uppercase tracking-wider text-center w-24 border-r border-[#5A2EA6]/15">
                    Time Slot
                  </th>
                  {calendarDays.map((d, dIdx) => (
                    <th
                      key={dIdx}
                      className={cn(
                        'p-3 text-center border-r border-[#5A2EA6]/10 last:border-r-0 min-w-[130px]',
                        d.isToday ? 'bg-[#5A2EA6]/10' : '',
                      )}
                    >
                      <span className="block text-[10px] font-bold text-soft uppercase tracking-wider">
                        {d.day}
                      </span>
                      <strong
                        className={cn(
                          'inline-block font-serif text-sm font-bold mt-0.5 px-2 py-0.5 rounded-full',
                          d.isToday ? 'bg-[#5A2EA6] text-white' : 'text-ink',
                        )}
                      >
                        {d.date}
                      </strong>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/10 text-xs">
                {timeSlots.map((slot) => (
                  <tr key={slot} className="hover:bg-[#FCFAFF] transition">
                    {/* Time Column */}
                    <td className="p-3 text-center font-mono font-bold text-[#5A2EA6] bg-[#FCFAFF] border-r border-[#5A2EA6]/15 select-none shrink-0">
                      {slot}
                    </td>

                    {/* 7 Day Columns */}
                    {calendarDays.map((d, dIdx) => {
                      const eventsInCell = allEvents.filter(
                        (e) => e.dateStr === d.dateStr && e.timeSlot === slot,
                      );

                      return (
                        <td
                          key={dIdx}
                          className="p-1.5 border-r border-[#5A2EA6]/10 last:border-r-0 align-top h-20 relative"
                        >
                          {eventsInCell.length > 0 ? (
                            <div className="space-y-1 h-full">
                              {eventsInCell.map((ev) => (
                                <div
                                  key={ev.id}
                                  onClick={() => setSelectedEvent(ev)}
                                  className={cn(
                                    'p-2 rounded-xl border shadow-xs cursor-pointer hover:scale-[1.02] transition-all h-full flex flex-col justify-between',
                                    ev.color,
                                  )}
                                >
                                  <div>
                                    <b className="text-[11px] font-bold block truncate">
                                      {ev.clientName}
                                    </b>
                                    <span className="text-[9.5px] opacity-90 block truncate">
                                      {ev.serviceName}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-[8.5px] font-mono pt-1">
                                    <span className="font-bold opacity-80">{ev.chair}</span>
                                    <span className="bg-black/20 px-1.5 py-0.2 rounded">
                                      {ev.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-xl hover:bg-[#5A2EA6]/5 transition border border-dashed border-transparent hover:border-[#5A2EA6]/20 grid place-items-center group">
                              <span className="text-[9px] font-bold text-[#5A2EA6]/40 opacity-0 group-hover:opacity-100">
                                Available
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointment Event Detail Modal */}
      {selectedEvent &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-[94vw] max-w-2xl lg:max-w-3xl max-h-[92vh] shadow-[0_30px_70px_rgba(90,46,166,0.25)] border border-[#5A2EA6]/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative z-[100000]">
              <div className="bg-gradient-to-b from-[#FCFAFF] to-[#F8F5FF] px-7 py-5 border-b border-[#5A2EA6]/15 flex justify-between items-center relative shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Service Appointment Details
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ink mt-0.5">
                    {selectedEvent.clientName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-paper text-soft hover:text-ink flex items-center justify-center transition border border-[#5A2EA6]/15 cursor-pointer shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-7 overflow-y-auto space-y-4 text-xs flex-1">
                <div className="flex justify-between py-2 border-b border-line/40 text-sm">
                  <span className="text-soft">Client Name:</span>
                  <strong className="font-bold text-ink">{selectedEvent.clientName}</strong>
                </div>

                {selectedEvent.clientPhone && (
                  <div className="flex justify-between py-2 border-b border-line/40 text-sm">
                    <span className="text-soft">Client Mobile:</span>
                    <span className="font-bold font-mono text-ink">{selectedEvent.clientPhone}</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-line/40 text-sm">
                  <span className="text-soft">Service Name:</span>
                  <strong className="font-bold text-[#5A2EA6]">{selectedEvent.serviceName}</strong>
                </div>

                <div className="flex justify-between py-2 border-b border-line/40 text-sm">
                  <span className="text-soft">Allocated Station Chair:</span>
                  <strong className="font-bold text-ink">{selectedEvent.chair}</strong>
                </div>

                <div className="flex justify-between py-2 border-b border-line/40 text-sm">
                  <span className="text-soft">Date &amp; Time Slot:</span>
                  <strong className="font-bold font-mono text-ink">
                    {new Date(selectedEvent.rawStartTime).toLocaleDateString()} at{' '}
                    {formatDisplayTime(selectedEvent.rawStartTime)} ({selectedEvent.duration})
                  </strong>
                </div>

                {selectedEvent.price !== undefined && (
                  <div className="flex justify-between py-2 border-b border-line/40 text-sm">
                    <span className="text-soft">Service Price Estimate:</span>
                    <strong className="font-bold font-mono text-ink">
                      ₹{selectedEvent.price.toLocaleString()}
                    </strong>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-line/40 text-sm">
                  <span className="text-soft">Service Status:</span>
                  <span className="font-bold text-[#5A2EA6] bg-[#5A2EA6]/10 px-3 py-1 rounded-full text-xs">
                    {selectedEvent.status}
                  </span>
                </div>

                {selectedEvent.allergy && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-xs font-semibold mt-2">
                    ⚠️ Safety Caution: {selectedEvent.allergy}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="bg-[#FCFAFF] px-7 py-4 border-t border-[#5A2EA6]/10 flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                  {selectedEvent.status !== 'In Service' && selectedEvent.status !== 'Completed' && (
                    <Button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        handleUpdateStatus(
                          selectedEvent.appointmentId,
                          'IN_SERVICE',
                          'In Service',
                        )
                      }
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A2EA6] text-white hover:bg-[#4A248A]"
                    >
                      <Play className="w-3.5 h-3.5 mr-1" /> Start Service
                    </Button>
                  )}

                  {selectedEvent.status !== 'Completed' && (
                    <Button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() =>
                        handleUpdateStatus(
                          selectedEvent.appointmentId,
                          'COMPLETED',
                          'Completed',
                        )
                      }
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete Service
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold border-line bg-white hover:bg-paper/40 cursor-pointer"
                >
                  Close Details
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
