import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, Img, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const BookingStep1Screen: React.FC = () => {
  const navigate = useNavigate();
  const { bookingFlow, updateBookingFlow } = useApp();

  const categoriesRow1 = [
    { name: 'Hair', icon: '✂️' },
    { name: 'Facial', icon: '🧖‍♀️' },
    { name: 'Spa', icon: '🪔' },
  ];
  const categoriesRow2 = [
    { name: 'Massage', icon: '💆‍♀️' },
    { name: 'Hair Color', icon: '🎨' },
    { name: 'More', icon: '•••' },
  ];

  const handleCategorySelect = (catName: string) => {
    updateBookingFlow({ selectedCategory: catName });
  };

  const handleContinue = () => {
    navigate('/booking/step2');
  };

  const service = bookingFlow.selectedService;

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
            1/5
          </Span>
        </Div>

        {/* Stepper Progress Bar with Light Purple Connecting Lines */}
        <Div className="flex flex-row items-center justify-between px-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <Div
                className={`w-8 h-8 rounded-full flex flex-row items-center justify-center text-xs font-bold transition-all ${
                  step === 1
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-white border border-purple-200 text-purple-400'
                }`}
              >
                <Span
                  className={
                    step === 1
                      ? 'text-white font-bold text-xs text-center'
                      : 'text-purple-400 font-bold text-xs text-center'
                  }
                >
                  {step}
                </Span>
              </Div>
              {step < 5 && <Div className="flex-1 h-0.5 mx-1.5 rounded-full bg-purple-100" />}
            </React.Fragment>
          ))}
        </Div>

        {/* Select Service Card */}
        <Div className="space-y-2.5">
          <H2 className="text-sm font-extrabold text-gray-900">Select Service</H2>
          {service && (
            <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs flex flex-row items-center gap-4">
              <Img
                src={service.image}
                alt={service.name}
                className="w-16 h-16 rounded-2xl object-cover border border-purple-100 flex-shrink-0"
              />
              <Div className="flex-1 min-w-0 space-y-0.5">
                <H3 className="text-sm font-bold text-gray-900 truncate">{service.name}</H3>
                <P className="text-xs font-semibold text-gray-500">
                  {service.duration} Mins · ₹{service.price.toLocaleString()}
                </P>
              </Div>
              <Button
                type="button"
                onClick={() => navigate('/services')}
                className="px-3.5 py-2 rounded-xl border border-purple-200 bg-purple-50 text-xs font-bold text-purple-700 hover:bg-purple-100 flex flex-row items-center justify-center"
              >
                <Span className="text-purple-700 font-bold text-xs text-center">Change</Span>
              </Button>
            </Div>
          )}
        </Div>

        {/* Select Category Grid */}
        <Div className="space-y-3">
          <H2 className="text-sm font-extrabold text-gray-900">Select Category</H2>
          <Div className="space-y-3">
            <Div className="flex flex-row gap-3">
              {categoriesRow1.map((cat) => {
                const isSelected = bookingFlow.selectedCategory === cat.name;
                return (
                  <Button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`flex-1 bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-2 border transition-all shadow-xs ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/80 shadow-xs'
                        : 'border-purple-100 hover:border-purple-200'
                    }`}
                  >
                    <Span className="text-3xl text-center block">{cat.icon}</Span>
                    <Span
                      className={`text-xs font-bold text-center block ${isSelected ? 'text-purple-900 font-extrabold' : 'text-gray-800'}`}
                    >
                      {cat.name}
                    </Span>
                  </Button>
                );
              })}
            </Div>
            <Div className="flex flex-row gap-3">
              {categoriesRow2.map((cat) => {
                const isSelected = bookingFlow.selectedCategory === cat.name;
                return (
                  <Button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`flex-1 bg-white rounded-3xl p-5 flex flex-col items-center justify-center gap-2 border transition-all shadow-xs ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/80 shadow-xs'
                        : 'border-purple-100 hover:border-purple-200'
                    }`}
                  >
                    <Span className="text-3xl text-center block">{cat.icon}</Span>
                    <Span
                      className={`text-xs font-bold text-center block ${isSelected ? 'text-purple-900 font-extrabold' : 'text-gray-800'}`}
                    >
                      {cat.name}
                    </Span>
                  </Button>
                );
              })}
            </Div>
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
