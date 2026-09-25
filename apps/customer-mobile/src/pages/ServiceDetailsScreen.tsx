import { AlertTriangle, Check, ChevronLeft, Clock, Share2, Star } from 'lucide-react-native';
import type React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Div, H1, H2, H3, Img, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const ServiceDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { services, selectedBranch, updateBookingFlow, showToast } = useApp();

  const service = services.find((s) => s.id === id) || services[0];

  const handleBookNow = () => {
    updateBookingFlow({ selectedService: service, selectedCategory: service.category });
    navigate('/booking/step1');
  };

  const handleShare = () => {
    showToast('Service link copied to clipboard!', 'info');
  };

  return (
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
          Service Details
        </H1>
        <Button
          type="button"
          onClick={handleShare}
          className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
        >
          <Share2 size={20} color="#374151" />
        </Button>
      </Div>

      {/* Hero Image - Clean Rounded 3xl Corner Styling Without Tag */}
      <Div className="rounded-3xl overflow-hidden shadow-xs border border-purple-100">
        <Img
          src={service.image}
          alt={service.name}
          className="w-full h-56 rounded-3xl object-cover"
        />
      </Div>

      {/* Service Details Card - Scaled Up Font Sizes */}
      <Div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-4">
        <Div className="flex flex-row items-start justify-between gap-3">
          <H1 className="text-lg font-black text-gray-900 flex-1">{service.name}</H1>
          <Span className="text-2xl font-black text-purple-700 flex-shrink-0">
            ₹{service.price.toLocaleString()}
          </Span>
        </Div>

        {/* Metadata Pill Ribbon */}
        <Div className="flex flex-row items-center gap-3 pt-1 border-t border-purple-50">
          <Div className="flex flex-row items-center gap-1.5 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100">
            <Clock size={16} color="#7c3aed" />
            <Span className="text-sm font-bold text-purple-700">{service.duration} Mins</Span>
          </Div>

          <Div className="flex flex-row items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <Span className="text-sm font-bold text-amber-900">{service.rating}</Span>
            <Span className="text-xs font-semibold text-amber-700">
              ({service.reviewsCount} reviews)
            </Span>
          </Div>
        </Div>

        <P className="text-sm text-gray-600 leading-relaxed pt-1">{service.description}</P>
      </Div>

      {/* Patch Test Warning */}
      {service.requiresPatchTest && (
        <Div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 flex flex-row items-center gap-4">
          <Div className="w-11 h-11 rounded-2xl bg-amber-100 flex flex-row items-center justify-center flex-shrink-0">
            <AlertTriangle size={22} color="#d97706" />
          </Div>
          <Div className="space-y-0.5 flex-1">
            <Span className="text-sm font-extrabold text-amber-900 block">
              Patch Test Recommended
            </Span>
            <P className="text-xs text-amber-800 leading-normal">
              A quick 24-hr skin patch test is recommended before applying chemical formulas.
            </P>
          </Div>
        </Div>
      )}

      {/* Key Benefits List - Scaled Up Font Sizes */}
      <Div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-3.5">
        <H2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
          Key Benefits
        </H2>
        <Div className="space-y-3">
          {service.benefits.map((benefit, idx) => (
            <Div key={idx} className="flex flex-row items-center gap-3.5">
              <Div className="w-6 h-6 rounded-full bg-purple-100 flex flex-row items-center justify-center flex-shrink-0">
                <Check size={14} color="#7c3aed" />
              </Div>
              <Span className="text-sm font-bold text-gray-800 flex-1">{benefit}</Span>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Selected Salon Branch Info */}
      <Div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-2.5">
        <Span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider block">
          Available at Salon Branch
        </Span>
        <Div className="flex flex-row items-center justify-between">
          <Div className="space-y-0.5 flex-1">
            <H3 className="text-sm font-bold text-gray-900">{selectedBranch.name}</H3>
            <P className="text-xs font-medium text-gray-500">{selectedBranch.distance}</P>
          </Div>
          <Button
            type="button"
            onClick={() => navigate('/booking/step2')}
            className="text-xs font-bold text-purple-700 hover:underline flex flex-row items-center justify-center"
          >
            <Span className="text-purple-700 font-bold text-xs text-center">
              Change Branch &gt;
            </Span>
          </Button>
        </Div>
      </Div>

      {/* Bottom Sticky Book Appointment CTA */}
      <Div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 px-5 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={handleBookNow}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-bold text-sm py-4 rounded-2xl shadow-sm text-center flex flex-row items-center justify-center"
        >
          <Span className="text-white font-extrabold text-sm text-center w-full">
            Book Appointment
          </Span>
        </Button>
      </Div>
    </Div>
  );
};
