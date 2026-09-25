import { Calendar, Check, MessageSquare } from 'lucide-react-native';
import type React from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const BookingSuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, showToast } = useApp();

  const latestApp = appointments[0];

  const handleAddToCalendar = () => {
    showToast('Appointment added to Phone Calendar!', 'success');
  };

  const handleWhatsAppNotify = () => {
    showToast('Booking details sent via WhatsApp!', 'info');
  };

  return (
    <Div className="p-4 px-5 space-y-6 pb-28 pt-2 text-center flex flex-col items-center">
      {/* Celebration Check Ring Graphic */}
      <Div className="w-22 h-22 rounded-full bg-[#7C3AED] text-white flex flex-row items-center justify-center shadow-lg ring-8 ring-purple-100 mt-6 self-center">
        <Check size={44} color="#ffffff" />
      </Div>

      {/* Main Title & Subtitle */}
      <Div className="space-y-1.5 flex flex-col items-center">
        <H1 className="text-2xl font-black text-gray-900 text-center">Booking Confirmed!</H1>
        <P className="text-xs font-semibold text-gray-500 max-w-xs leading-relaxed text-center">
          Your appointment has been successfully booked. Present your check-in OTP upon arrival at
          the outlet.
        </P>
      </Div>

      {/* Confirmed Appointment Details Card */}
      {latestApp && (
        <Div className="w-full bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-4 text-left">
          <Div className="flex flex-row items-center justify-between border-b border-purple-50 pb-3.5">
            <Div className="space-y-0.5">
              <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                BOOKING ID
              </Span>
              <H2 className="text-xs font-bold text-purple-900">{latestApp.bookingId}</H2>
            </Div>
            {latestApp.otpCode && (
              <Div className="bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-2xl text-right">
                <Span className="text-[10px] font-extrabold text-purple-700 block uppercase">
                  CHECK-IN OTP
                </Span>
                <Span className="text-base font-black text-purple-900 tracking-widest">
                  {latestApp.otpCode}
                </Span>
              </Div>
            )}
          </Div>

          <Div className="space-y-1">
            <H3 className="text-base font-black text-gray-900">{latestApp.serviceName}</H3>
            <P className="text-xs font-bold text-purple-700">
              {latestApp.date} · {latestApp.time || '11:30 AM'}
            </P>
            <P className="text-xs font-medium text-gray-500">{latestApp.branchName}</P>
            <Div className="flex flex-row items-center gap-1 pt-1">
              <Span className="text-xs text-gray-500 font-medium">Specialist: </Span>
              <Span className="text-xs font-bold text-gray-900">{latestApp.specialistName}</Span>
            </Div>
          </Div>

          {/* Quick Action Buttons - Calendar & WhatsApp */}
          <Div className="flex flex-row gap-3 pt-3.5 border-t border-purple-50">
            <Button
              type="button"
              onClick={handleAddToCalendar}
              className="flex-1 py-3.5 px-3 rounded-2xl border border-purple-200 bg-purple-50 flex flex-row items-center justify-center gap-2"
            >
              <Calendar size={18} color="#7c3aed" />
              <Span className="text-purple-700 font-extrabold text-xs text-center">Calendar</Span>
            </Button>
            <Button
              type="button"
              onClick={handleWhatsAppNotify}
              className="flex-1 py-3.5 px-3 rounded-2xl border border-emerald-200 bg-emerald-50 flex flex-row items-center justify-center gap-2"
            >
              <MessageSquare size={18} color="#059669" />
              <Span className="text-emerald-700 font-extrabold text-xs text-center">WhatsApp</Span>
            </Button>
          </Div>
        </Div>
      )}

      {/* Navigation CTAs */}
      <Div className="w-full space-y-3 pt-2">
        <Button
          type="button"
          onClick={() => navigate('/appointments')}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-sm text-center flex flex-row items-center justify-center"
        >
          <Span className="text-white font-extrabold text-sm text-center w-full">
            View My Appointments
          </Span>
        </Button>
        <Button
          type="button"
          onClick={() => navigate('/')}
          className="w-full bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 font-extrabold text-sm py-4 rounded-2xl text-center flex flex-row items-center justify-center"
        >
          <Span className="text-purple-700 font-extrabold text-sm text-center w-full">
            Back to Home
          </Span>
        </Button>
      </Div>
    </Div>
  );
};
