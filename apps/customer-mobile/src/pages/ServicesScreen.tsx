import { ChevronLeft, Search, SlidersHorizontal, Star } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, Img, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const ServicesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { services, updateBookingFlow } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { name: 'All', icon: '✨' },
    { name: 'Hair', icon: '✂️' },
    { name: 'Facial', icon: '🧖‍♀️' },
    { name: 'Spa', icon: '🪔' },
    { name: 'Massage', icon: '💆‍♀️' },
    { name: 'More', icon: '•••' },
  ];

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectService = (service: (typeof services)[0]) => {
    updateBookingFlow({ selectedService: service, selectedCategory: service.category });
    navigate(`/service-details/${service.id}`);
  };

  return (
    <Div className="p-4 px-5 space-y-6 pb-28">
      {/* Header with Clean Spacing */}
      <Div className="flex flex-row items-center justify-between pt-2 pb-1">
        <Button
          type="button"
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
        >
          <ChevronLeft size={24} color="#374151" />
        </Button>
        <H1 className="text-xl font-extrabold text-gray-900 tracking-tight">Services</H1>
        <Button
          type="button"
          className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
        >
          <SlidersHorizontal size={20} color="#7c3aed" />
        </Button>
      </Div>

      {/* Search Bar - Increased Hint Text Size */}
      <Div className="bg-white border border-purple-100 rounded-2xl px-4 py-4 flex flex-row items-center gap-3 shadow-xs">
        <Search size={22} color="#9ca3af" />
        <Span className="text-sm font-medium text-gray-400 ml-1">
          Search services, treatments...
        </Span>
      </Div>

      {/* Category Buttons Row - Increased Size */}
      <Div className="flex flex-row items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <Button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex flex-col items-center justify-center p-4 px-5 min-w-[90px] rounded-3xl border transition-all ${
                isSelected
                  ? 'bg-purple-100/80 border-purple-600 shadow-xs'
                  : 'bg-white border-purple-100'
              }`}
            >
              <Span className="text-2xl">{cat.icon}</Span>
              <Span className="text-xs font-extrabold text-gray-900 mt-1.5">{cat.name}</Span>
            </Button>
          );
        })}
      </Div>

      {/* Popular Services Section - Increased Card Size, Image, Text & Rating */}
      <Div className="space-y-3 pt-1">
        <H2 className="text-sm font-bold text-gray-900">Popular Services</H2>
        <Div className="space-y-4">
          {filteredServices.map((service) => (
            <Div
              key={service.id}
              onClick={() => handleSelectService(service)}
              className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs flex flex-row items-center gap-4 cursor-pointer hover:border-purple-200 transition"
            >
              <Img
                src={service.image}
                alt={service.name}
                className="w-20 h-20 rounded-2xl object-cover border border-purple-100 flex-shrink-0"
              />
              <Div className="flex-1 min-w-0 space-y-1.5">
                <H3 className="text-sm font-extrabold text-gray-900 truncate">{service.name}</H3>
                <P className="text-xs font-semibold text-gray-500">{service.duration} Mins</P>
                <Div className="flex flex-row items-center justify-between pt-1">
                  <Span className="text-sm font-black text-purple-700">
                    ₹{service.price.toLocaleString()}
                  </Span>
                  <Div className="flex flex-row items-center gap-1.5 text-xs font-bold text-amber-600">
                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                    <Span className="text-xs font-bold text-amber-600">{service.rating}</Span>
                  </Div>
                </Div>
              </Div>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  );
};
