import { BookAppointmentModal } from '@/shared/components/BookAppointmentModal';
import { Button, cn, useToast } from '@salon-spa-saas/ui';
import { ChevronLeft, ChevronRight, Clock, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { DialogModal } from '../../../shared/components/DialogModal';

const initialAppointments = [
  {
    day: 'Sun 20',
    hour: '10:00 AM',
    name: 'Emma',
    service: 'Hair Style',
    colorClass: 'bg-[#cca080]/15 text-[#cca080] border-[#cca080]',
  },
  {
    day: 'Wed 23',
    hour: '10:00 AM',
    name: 'Sophia',
    service: 'Facial Treatment',
    colorClass: 'bg-[#5A2EA6]/10 text-[#5A2EA6] border-[#5A2EA6]',
  },
  {
    day: 'Mon 21',
    hour: '12:00 PM',
    name: 'Sonia',
    service: 'Nails Art',
    colorClass: 'bg-emerald-500/10 text-emerald-800 border-emerald-500',
  },
  {
    day: 'Thu 24',
    hour: '12:00 PM',
    name: 'Olivia',
    service: 'Facial Mask',
    colorClass: 'bg-[#cca080]/15 text-[#cca080] border-[#cca080]',
  },
  {
    day: 'Tue 22',
    hour: '03:00 PM',
    name: 'Cesia',
    service: 'Swedish Massage',
    colorClass: 'bg-[#5A2EA6]/10 text-[#5A2EA6] border-[#5A2EA6]',
  },
  {
    day: 'Fri 25',
    hour: '03:00 PM',
    name: 'Kassia',
    service: 'Cut & Polish',
    colorClass: 'bg-emerald-500/10 text-emerald-800 border-emerald-500',
  },
];

const hoursList = ['10:00 AM', '12:00 PM', '03:00 PM'];
const daysList = ['Sun 20', 'Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26'];

export function AppointmentsAnalyticsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [currentWeek, setCurrentWeek] = useState('July 20-26, 2026');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<(typeof initialAppointments)[0] | null>(null);

  // Form states
  const [targetDay, setTargetDay] = useState('Mon 21');
  const [targetHour, setTargetHour] = useState('10:00 AM');

  // Click on empty cell
  const handleCellClick = (day: string, hour: string) => {
    setTargetDay(day);
    setTargetHour(hour);
    setIsAddModalOpen(true);
  };

  // Delete booking
  const handleDeleteBooking = (day: string, hour: string, name: string) => {
    setAppointments((prev) => prev.filter((appt) => !(appt.day === day && appt.hour === hour)));
    toast(`Deleted booking for ${name} on ${day} at ${hour}.`);
    setIsDetailModalOpen(false);
    setSelectedAppt(null);
  };

  // Switch weeks simulation
  const shiftWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek('July 13-19, 2026');
      setAppointments([
        {
          day: 'Mon 21',
          hour: '10:00 AM',
          name: 'Rachel',
          service: 'Gloss Treatment',
          colorClass: 'bg-[#5A2EA6]/10 text-[#5A2EA6] border-[#5A2EA6]',
        },
        {
          day: 'Wed 23',
          hour: '12:00 PM',
          name: 'Monica',
          service: 'Spa Massage',
          colorClass: 'bg-[#cca080]/15 text-[#cca080] border-[#cca080]',
        },
      ]);
    } else {
      setCurrentWeek('July 27 - Aug 02, 2026');
      setAppointments([
        {
          day: 'Tue 22',
          hour: '10:00 AM',
          name: 'Joey',
          service: 'Beard Trim',
          colorClass: 'bg-emerald-500/10 text-emerald-800 border-emerald-500',
        },
        {
          day: 'Fri 25',
          hour: '03:00 PM',
          name: 'Phoebe',
          service: 'Full highlights',
          colorClass: 'bg-[#5A2EA6]/10 text-[#5A2EA6] border-[#5A2EA6]',
        },
      ]);
    }
    toast(`Switched calendar view to ${direction === 'prev' ? 'previous' : 'next'} week.`);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Appointment Booking &amp; Calendar
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Manage weekly salon room and chair occupancy across Indrapuri.
          </p>
        </div>
        <Button
          onClick={() => {
            setTargetDay('Mon 21');
            setTargetHour('10:00 AM');
            setIsAddModalOpen(true);
          }}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold gap-1.5 flex items-center premium-btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Appointment</span>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Weekly Calendar Grid */}
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />

            <div className="flex justify-between items-center w-full z-10 flex-wrap gap-3">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Weekly Roster &amp; Chair Occupancy
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {currentWeek}
                </p>
              </div>
              <div className="flex gap-1.5 items-center bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => shiftWeek('prev')}
                  className="p-1 hover:bg-white/20 transition-all rounded-lg border-0 cursor-pointer bg-transparent text-white flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-white px-2 select-none">
                  {currentWeek}
                </span>
                <button
                  onClick={() => shiftWeek('next')}
                  className="p-1 hover:bg-white/20 transition-all rounded-lg border-0 cursor-pointer bg-transparent text-white flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 bg-white">
            <div className="grid grid-cols-8 border-collapse border border-[#5A2EA6]/10 rounded-2xl overflow-hidden text-[11px] shadow-sm bg-white/80">
              {/* Header row */}
              <div className="bg-[#F8F5FF] p-3.5 font-bold text-center border-b border-r border-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] tracking-wide uppercase">
                Hour
              </div>
              {daysList.map((day) => (
                <div
                  key={day}
                  className="bg-[#F8F5FF] p-3.5 font-bold text-center border-b border-r last:border-r-0 border-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] tracking-wide uppercase"
                >
                  {day}
                </div>
              ))}

              {/* Grid hours mapping */}
              {hoursList.map((hour) => (
                <React.Fragment key={hour}>
                  <div className="p-3 text-right border-b last:border-b-0 border-r border-[#5A2EA6]/10 font-bold text-[#5A2EA6] bg-[#FCFAFF]/60 text-[10px] flex items-center justify-end pr-3 min-h-[64px]">
                    {hour}
                  </div>
                  {daysList.map((day, idx) => {
                    const matchedAppt = appointments.find(
                      (appt) => appt.day === day && appt.hour === hour,
                    );
                    const isLastDay = idx === daysList.length - 1;

                    return (
                      <div
                        key={day}
                        onClick={() => !matchedAppt && handleCellClick(day, hour)}
                        className={cn(
                          'border-b last:border-b-0 p-1 bg-white relative transition-colors duration-200 min-h-[64px]',
                          !isLastDay && 'border-r border-[#5A2EA6]/10',
                          !matchedAppt && 'hover:bg-[#5A2EA6]/3 cursor-pointer',
                        )}
                      >
                        {matchedAppt ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppt(matchedAppt);
                              setIsDetailModalOpen(true);
                            }}
                            className={cn(
                              'absolute inset-1 rounded-xl border-l-[3px] p-1.5 text-[9px] leading-tight font-bold overflow-hidden shadow-xs hover:scale-[1.03] transition-transform duration-200 cursor-pointer',
                              matchedAppt.colorClass,
                            )}
                          >
                            <b className="block font-bold">{matchedAppt.name}</b>
                            <span className="opacity-80 block truncate mt-0.5">
                              {matchedAppt.service}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Action Modal */}
      <DialogModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Appointment Details"
        description="Roster booking allocation details"
      >
        {selectedAppt && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#FCFAFF] border border-[#5A2EA6]/10 rounded-xl space-y-1.5 text-[12px]">
              <div className="flex justify-between font-bold text-ink">
                <span>Stylist:</span> <span>{selectedAppt.name}</span>
              </div>
              <div className="flex justify-between text-soft">
                <span>Treatment:</span> <span>{selectedAppt.service}</span>
              </div>
              <div className="flex justify-between text-soft">
                <span>Day Allocated:</span> <span>{selectedAppt.day}</span>
              </div>
              <div className="flex justify-between text-soft">
                <span>Time Slot:</span> <span>{selectedAppt.hour}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() =>
                  handleDeleteBooking(selectedAppt.day, selectedAppt.hour, selectedAppt.name)
                }
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Booking</span>
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-line hover:bg-paper/20 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </DialogModal>

      <BookAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={(data) => {
          let colorClass = 'bg-[#5A2EA6]/10 text-[#5A2EA6] border-[#5A2EA6]';
          if (
            data.service.toLowerCase().includes('facial') ||
            data.service.toLowerCase().includes('pedicure')
          ) {
            colorClass = 'bg-[#cca080]/15 text-[#cca080] border-[#cca080]';
          } else if (
            data.service.toLowerCase().includes('massage') ||
            data.service.toLowerCase().includes('makeup')
          ) {
            colorClass = 'bg-emerald-500/10 text-emerald-800 border-emerald-500';
          }

          const newBooking = {
            day: data.day || targetDay,
            hour: data.time,
            name: data.client,
            service: data.service,
            colorClass: colorClass,
          };

          setAppointments((prev) => [...prev, newBooking]);
          setIsAddModalOpen(false);
          toast(
            `Successfully booked ${data.client} for ${data.service} on ${data.day || targetDay} at ${data.time}!`,
          );
        }}
        defaultDay={targetDay}
        defaultTime={targetHour}
        defaultStaff="Emma Thompson"
        defaultRoom="Chair 1"
        showDaySelector={true}
      />
    </div>
  );
}
