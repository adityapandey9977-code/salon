import { CheckCircle2, ChevronLeft, Circle, Sparkles, Star } from 'lucide-react-native';
import React from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, Img, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const BookingStep3Screen: React.FC = () => {
  const navigate = useNavigate();
  const { specialists, bookingFlow, updateBookingFlow } = useApp();

  const handleSpecialistSelect = (sp: (typeof specialists)[0]) => {
    updateBookingFlow({ selectedSpecialist: sp });
  };

  const handleContinue = () => {
    navigate('/booking/step4');
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
            3/5
          </Span>
        </Div>

        {/* Stepper Progress Bar with Light Purple Lines */}
        <Div className="flex flex-row items-center justify-between px-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <Div
                className={`w-8 h-8 rounded-full flex flex-row items-center justify-center text-xs font-bold transition-all ${
                  step <= 3
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-white border border-purple-200 text-purple-400'
                }`}
              >
                <Span
                  className={
                    step <= 3
                      ? 'text-white font-bold text-xs text-center'
                      : 'text-purple-400 font-bold text-xs text-center'
                  }
                >
                  {step}
                </Span>
              </Div>
              {step < 5 && (
                <Div
                  className={`flex-1 h-0.5 mx-1.5 rounded-full ${step < 3 ? 'bg-[#7C3AED]' : 'bg-purple-100'}`}
                />
              )}
            </React.Fragment>
          ))}
        </Div>

        {/* Select Specialist */}
        <Div className="space-y-3">
          <H2 className="text-sm font-extrabold text-gray-900">Select Specialist</H2>
          <Div className="space-y-3">
            {specialists.map((sp) => {
              const isSelected = bookingFlow.selectedSpecialist?.id === sp.id;
              return (
                <Div
                  key={sp.id}
                  onClick={() => handleSpecialistSelect(sp)}
                  className={`bg-white rounded-3xl p-4 px-5 border transition-all shadow-xs flex flex-row items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                      : 'border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <Div className="flex flex-row items-center gap-3.5">
                    <Img
                      src={sp.avatar}
                      alt={sp.name}
                      className="w-14 h-14 rounded-full object-cover border border-purple-100"
                    />
                    <Div className="space-y-0.5">
                      <H3 className="text-xs font-bold text-gray-900">{sp.name}</H3>
                      <Div className="flex flex-row items-center gap-1.5 text-[11px]">
                        <Div className="flex flex-row items-center gap-0.5 text-amber-600 font-semibold">
                          <Star size={12} color="#f59e0b" fill="#f59e0b" />
                          <Span>{sp.rating}</Span>
                        </Div>
                        <Span className="text-gray-400">•</Span>
                        <Span className="text-gray-500 font-semibold">{sp.experience}</Span>
                      </Div>
                      {sp.lastFormulaNote && (
                        <Div className="flex flex-row items-center gap-1 text-[10px] text-purple-700 font-bold pt-0.5">
                          <Sparkles size={10} color="#7c3aed" />
                          <Span className="truncate max-w-[180px]">Formula match on record</Span>
                        </Div>
                      )}
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
