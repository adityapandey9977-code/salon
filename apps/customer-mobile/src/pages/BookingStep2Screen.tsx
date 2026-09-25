import { CheckCircle2, ChevronLeft, Circle, Home, MapPin } from 'lucide-react-native';
import React from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const BookingStep2Screen: React.FC = () => {
  const navigate = useNavigate();
  const { user, branches, bookingFlow, updateBookingFlow } = useApp();

  const handleBranchSelect = (branch: (typeof branches)[0]) => {
    updateBookingFlow({ selectedBranch: branch, isHomeService: false });
  };

  const handleToggleHomeService = (isHome: boolean) => {
    updateBookingFlow({ isHomeService: isHome });
  };

  const handleContinue = () => {
    navigate('/booking/step3');
  };

  return (
    <Div style={{ flex: 1, position: 'relative', height: '100%' }}>
      {/* Scrollable Content Container */}
      <Div className="p-4 px-5 space-y-6 pb-36">
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
            2/5
          </Span>
        </Div>

        {/* Stepper Progress Bar with Light Purple Lines */}
        <Div className="flex flex-row items-center justify-between px-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <Div
                className={`w-8 h-8 rounded-full flex flex-row items-center justify-center text-xs font-bold transition-all ${
                  step <= 2
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-white border border-purple-200 text-purple-400'
                }`}
              >
                <Span
                  className={
                    step <= 2
                      ? 'text-white font-bold text-xs text-center'
                      : 'text-purple-400 font-bold text-xs text-center'
                  }
                >
                  {step}
                </Span>
              </Div>
              {step < 5 && (
                <Div
                  className={`flex-1 h-0.5 mx-1.5 rounded-full ${step < 2 ? 'bg-[#7C3AED]' : 'bg-purple-100'}`}
                />
              )}
            </React.Fragment>
          ))}
        </Div>

        {/* Service Location Toggle */}
        <Div className="bg-white p-1.5 rounded-3xl border border-purple-100 flex flex-row shadow-xs">
          <Button
            type="button"
            onClick={() => handleToggleHomeService(false)}
            className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all flex flex-row items-center justify-center ${
              !bookingFlow.isHomeService
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Span
              className={`text-center text-xs font-bold ${!bookingFlow.isHomeService ? 'text-white font-bold' : 'text-gray-600 font-bold'}`}
            >
              Salon Visit
            </Span>
          </Button>
          <Button
            type="button"
            onClick={() => handleToggleHomeService(true)}
            className={`flex-1 py-3 text-xs font-bold rounded-2xl flex flex-row items-center justify-center gap-1.5 transition-all ${
              bookingFlow.isHomeService
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home size={16} color={bookingFlow.isHomeService ? '#ffffff' : '#4b5563'} />
            <Span
              className={`text-center text-xs font-bold ${bookingFlow.isHomeService ? 'text-white font-bold' : 'text-gray-600 font-bold'}`}
            >
              At-Home Service
            </Span>
          </Button>
        </Div>

        {/* If At-Home Service selected */}
        {bookingFlow.isHomeService ? (
          <Div className="space-y-3">
            <H2 className="text-sm font-bold text-gray-900">Delivery Address</H2>
            <Div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs space-y-3">
              <Div className="flex flex-row items-center gap-2">
                <MapPin size={18} color="#7c3aed" />
                <Span className="text-xs font-bold text-gray-900">Saved Address</Span>
              </Div>
              <P className="text-xs text-gray-600">{user.savedAddress}</P>
              <Div className="border-t border-purple-50 pt-2 flex flex-row items-center justify-between">
                <Span className="text-[11px] text-gray-500">Travel Fee:</Span>
                <Span className="text-xs font-bold text-purple-700">+₹{bookingFlow.travelFee}</Span>
              </Div>
            </Div>
          </Div>
        ) : (
          /* Select Salon Branch */
          <Div className="space-y-3">
            <H2 className="text-sm font-bold text-gray-900">Select Salon Branch</H2>
            <Div className="space-y-3">
              {branches.map((b) => {
                const isSelected = bookingFlow.selectedBranch?.id === b.id;
                return (
                  <Div
                    key={b.id}
                    onClick={() => handleBranchSelect(b)}
                    className={`bg-white rounded-3xl p-4 px-5 border transition-all shadow-xs flex flex-row items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                        : 'border-purple-100 hover:border-purple-200'
                    }`}
                  >
                    <Div className="space-y-1">
                      <H3 className="text-xs font-bold text-gray-900">{b.name}</H3>
                      <Div className="flex flex-row items-center gap-1">
                        <MapPin size={14} color="#a855f7" />
                        <Span className="text-[11px] font-semibold text-gray-500">
                          {b.distance}
                        </Span>
                      </Div>
                    </Div>
                    {isSelected ? (
                      <CheckCircle2 size={22} color="#7c3aed" />
                    ) : (
                      <Circle size={22} color="#9ca3af" />
                    )}
                  </Div>
                );
              })}
            </Div>
          </Div>
        )}
      </Div>

      {/* Pinned Bottom Sticky Button Bar */}
      <Div className="absolute bottom-0 left-0 right-0 p-4 px-5 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
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
