import {
  CheckSquare,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Square,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const BookingStep4Screen: React.FC = () => {
  const navigate = useNavigate();
  const { bookingFlow, updateBookingFlow } = useApp();

  const [selectedDay, setSelectedDay] = useState<number>(12);
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [consentAgreed, setConsentAgreed] = useState<boolean>(true);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const calendarDates = [
    { day: 28, prevMonth: true },
    { day: 29, prevMonth: true },
    { day: 30, prevMonth: true },
    { day: 31, prevMonth: true },
    { day: 1, current: true },
    { day: 2, current: true },
    { day: 3, current: true },
    { day: 4, current: true },
    { day: 5, current: true },
    { day: 6, current: true },
    { day: 7, current: true },
    { day: 8, current: true },
    { day: 9, current: true },
    { day: 10, current: true },
    { day: 11, current: true },
    { day: 12, current: true },
    { day: 13, current: true },
    { day: 14, current: true },
    { day: 15, current: true },
    { day: 16, current: true },
    { day: 17, current: true },
    { day: 18, current: true },
    { day: 19, current: true },
    { day: 20, current: true },
    { day: 21, current: true },
    { day: 22, current: true },
    { day: 23, current: true },
    { day: 24, current: true },
    { day: 25, current: true },
    { day: 26, current: true },
    { day: 27, current: true },
    { day: 28, current: true },
    { day: 29, current: true },
    { day: 30, current: true },
    { day: 31, current: true },
  ];

  const timeSlotsRow1 = [
    { time: '10:00 AM', smart: false },
    { time: '10:30 AM', smart: true },
    { time: '11:00 AM', smart: false },
  ];
  const timeSlotsRow2 = [
    { time: '11:30 AM', smart: false },
    { time: '12:00 PM', smart: true },
    { time: '12:30 PM', smart: false },
  ];

  const handleContinue = () => {
    updateBookingFlow({
      selectedDate: `${selectedDay} Aug 2026 (Tue)`,
      selectedTime: selectedTime,
      consultation: {
        ...bookingFlow.consultation,
        consentAgreed: consentAgreed,
      },
    });
    navigate('/booking/step5');
  };

  return (
    <Div style={{ flex: 1, position: 'relative', height: '100%' }}>
      {/* Scrollable Content Container */}
      <Div className="p-4 px-5 space-y-6 pb-28">
        {/* Header with Clean Spacing */}
        <Div className="flex flex-row items-center justify-between pt-2 pb-1">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
          >
            <ChevronLeft size={24} color="#374151" />
          </Button>
          <H1 className="text-xl font-extrabold text-gray-900 tracking-tight text-center">
            Book Appointment
          </H1>
          <Span className="text-xs font-bold text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-200 text-center">
            4/5
          </Span>
        </Div>

        {/* Stepper Progress Bar with Light Purple Lines */}
        <Div className="flex flex-row items-center justify-between px-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <Div
                className={`w-8 h-8 rounded-full flex flex-row items-center justify-center text-xs font-bold transition-all ${
                  step <= 4
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-white border border-purple-200 text-purple-400'
                }`}
              >
                <Span
                  className={
                    step <= 4
                      ? 'text-white font-bold text-xs text-center'
                      : 'text-purple-400 font-bold text-xs text-center'
                  }
                >
                  {step}
                </Span>
              </Div>
              {step < 5 && (
                <Div
                  className={`flex-1 h-0.5 mx-1.5 rounded-full ${step < 4 ? 'bg-[#7C3AED]' : 'bg-purple-100'}`}
                />
              )}
            </React.Fragment>
          ))}
        </Div>

        {/* Select Date Section */}
        <Div className="space-y-3">
          <H2 className="text-sm font-extrabold text-gray-900">Select Date</H2>
          <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-4">
            <Div className="flex flex-row items-center justify-between">
              <Button type="button" className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
                <ChevronLeft size={18} color="#374151" />
              </Button>
              <Span className="text-xs font-bold text-gray-900">August 2026</Span>
              <Button type="button" className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
                <ChevronRightIcon size={18} color="#374151" />
              </Button>
            </Div>

            {/* Days of week */}
            <Div className="flex flex-row items-center justify-between text-center">
              {daysOfWeek.map((d) => (
                <Span key={d} className="flex-1 text-[10px] font-bold text-gray-400 text-center">
                  {d}
                </Span>
              ))}
            </Div>

            {/* Calendar Grid - 5 Equal Width Flex Rows */}
            <Div className="space-y-2">
              {[0, 1, 2, 3, 4].map((rowIndex) => (
                <Div key={rowIndex} className="flex flex-row items-center justify-between">
                  {calendarDates.slice(rowIndex * 7, rowIndex * 7 + 7).map((item, idx) => {
                    const isSelected = item.current && item.day === selectedDay;
                    return (
                      <Button
                        key={idx}
                        type="button"
                        onClick={() => item.current && setSelectedDay(item.day)}
                        disabled={!item.current}
                        className={`flex-1 w-9 h-9 mx-0.5 rounded-full flex flex-row items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#7C3AED] text-white font-bold shadow-xs'
                            : item.current
                              ? 'text-gray-800 hover:bg-purple-50'
                              : 'text-gray-300'
                        }`}
                      >
                        <Span
                          className={
                            isSelected
                              ? 'text-white font-bold text-xs text-center'
                              : 'text-gray-800 text-xs text-center'
                          }
                        >
                          {item.day}
                        </Span>
                      </Button>
                    );
                  })}
                </Div>
              ))}
            </Div>
          </Div>
        </Div>

        {/* Select Time Section */}
        <Div className="space-y-3">
          <Div className="flex flex-row items-center justify-between">
            <H2 className="text-sm font-extrabold text-gray-900">Select Time Slot</H2>
            <Div className="flex flex-row items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Zap size={12} color="#059669" fill="#059669" />
              <Span>Smart Slot Options</Span>
            </Div>
          </Div>
          <Div className="space-y-3">
            <Div className="flex flex-row gap-3">
              {timeSlotsRow1.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <Button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedTime(slot.time)}
                    className={`flex-1 py-3 px-2.5 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-0.5 transition-all ${
                      isSelected
                        ? 'bg-[#7C3AED] text-white border-purple-700 shadow-xs'
                        : 'bg-white text-gray-700 border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    <Span
                      className={
                        isSelected
                          ? 'text-white font-bold text-xs text-center'
                          : 'text-gray-800 font-bold text-xs text-center'
                      }
                    >
                      {slot.time}
                    </Span>
                    {slot.smart && !isSelected && (
                      <Span className="text-[9px] font-bold text-amber-600 text-center">
                        ⚡ Eco Slot
                      </Span>
                    )}
                  </Button>
                );
              })}
            </Div>
            <Div className="flex flex-row gap-3">
              {timeSlotsRow2.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <Button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedTime(slot.time)}
                    className={`flex-1 py-3 px-2.5 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-0.5 transition-all ${
                      isSelected
                        ? 'bg-[#7C3AED] text-white border-purple-700 shadow-xs'
                        : 'bg-white text-gray-700 border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    <Span
                      className={
                        isSelected
                          ? 'text-white font-bold text-xs text-center'
                          : 'text-gray-800 font-bold text-xs text-center'
                      }
                    >
                      {slot.time}
                    </Span>
                    {slot.smart && !isSelected && (
                      <Span className="text-[9px] font-bold text-amber-600 text-center">
                        ⚡ Eco Slot
                      </Span>
                    )}
                  </Button>
                );
              })}
            </Div>
          </Div>
        </Div>

        {/* Digital Consultation Waiver */}
        <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-3">
          <H2 className="text-xs font-extrabold text-gray-900 uppercase">
            Digital Consultation & Safety Waiver
          </H2>
          <P className="text-[11px] text-gray-600 leading-relaxed">
            I confirm that I have disclosed any skin sensitivities or health cautions prior to
            treatment.
          </P>
          <Div
            onClick={() => setConsentAgreed(!consentAgreed)}
            className="flex flex-row items-center gap-2.5 pt-1 cursor-pointer"
          >
            {consentAgreed ? (
              <CheckSquare size={20} color="#7c3aed" />
            ) : (
              <Square size={20} color="#9ca3af" />
            )}
            <Span className="text-xs font-bold text-gray-800">
              I accept consultation terms & waiver
            </Span>
          </Div>
        </Div>
      </Div>

      {/* Flush Bottom Sticky Continue Button Bar Pinned to Viewport Bottom */}
      <Div className="absolute bottom-0 left-0 right-0 p-4 px-5 pb-6 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={handleContinue}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-sm text-center flex flex-row items-center justify-center"
        >
          <Span className="text-white font-extrabold text-sm text-center w-full">Continue</Span>
        </Button>
      </Div>
    </Div>
  );
};
