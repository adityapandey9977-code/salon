import { BookAppointmentModal } from '@/shared/components/BookAppointmentModal';
import { useToast } from '@salon-spa-saas/ui';
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Heart,
  MapPin,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';
import React, { useState } from 'react';

export function SearchServicesPage() {
  const { toast } = useToast();

  // Filter States - All 5 requested filter dimensions
  const [searchName, setSearchName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedDurationRange, setSelectedDurationRange] = useState<string>('all');

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Master Service Catalog with Images, Prices, Durations, Descriptions, Categories, & Branches
  const services = [
    {
      id: 'SRV-01',
      name: 'Hydra Facial Detox & Glow Spa',
      category: 'Facial',
      branch: 'Indrapuri Central Outlet',
      priceNumeric: 4200,
      price: '₹4,200',
      durationMinutes: 60,
      duration: '60 Mins',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500',
      description:
        'Deep pore cleansing, hyaluronic acid infusion, vacuum extraction, and cold hammer LED light skin glow therapy.',
      popular: true,
    },
    {
      id: 'SRV-02',
      name: 'Balayage Hair Color & Gloss Treatment',
      category: 'Hair Color',
      branch: 'Indrapuri Central Outlet',
      priceNumeric: 6500,
      price: '₹6,500',
      durationMinutes: 120,
      duration: '120 Mins',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500',
      description:
        'Hand-painted dimension blonde highlights with ammonia-free L’Oréal Paris gloss seal for radiant shine.',
      popular: true,
    },
    {
      id: 'SRV-03',
      name: 'Deep Tissue Muscle Relief Massage',
      category: 'Spa',
      branch: 'Arera Colony Outlet',
      priceNumeric: 4500,
      price: '₹4,500',
      durationMinutes: 90,
      duration: '90 Mins',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500',
      description:
        'Targeted knot release therapy using organic aromatherapy essential oils, acupressure, and hot basalt stones.',
      popular: true,
    },
    {
      id: 'SRV-04',
      name: 'Precision Layered Haircut & Blowdry',
      category: 'Haircut',
      branch: 'Indrapuri Central Outlet',
      priceNumeric: 1800,
      price: '₹1,800',
      durationMinutes: 45,
      duration: '45 Mins',
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500',
      description:
        'Custom face-framing layer cut with scalp wash, conditioning, and volume bounce blowdry styling.',
      popular: false,
    },
    {
      id: 'SRV-05',
      name: 'Full Body Polish & Relaxation Massage',
      category: 'Massage',
      branch: 'Kolar Road Outlet',
      priceNumeric: 5200,
      price: '₹5,200',
      durationMinutes: 105,
      duration: '105 Mins',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500',
      description:
        'Exfoliating sea salt body scrub followed by a hydrating jojoba oil full body relaxation massage.',
      popular: false,
    },
    {
      id: 'SRV-06',
      name: 'Keratin Hair Smoothing Treatment',
      category: 'Hair Color',
      branch: 'Arera Colony Outlet',
      priceNumeric: 7800,
      price: '₹7,800',
      durationMinutes: 150,
      duration: '150 Mins',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
      description:
        'Frizz-free smoothness lasting up to 4 months with deep keratin protein nourishment and heat sealing.',
      popular: false,
    },
  ];

  const handleBookNow = (srv: any) => {
    setSelectedService(srv);
    setIsBookModalOpen(true);
  };

  // Filter Logic matching all 5 requested filter dimensions
  const filteredServices = services.filter((srv) => {
    // 1. Service Name text search
    const matchesName =
      srv.name.toLowerCase().includes(searchName.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchName.toLowerCase());

    // 2. Category Filter
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;

    // 3. Branch Filter
    const matchesBranch = selectedBranch === 'all' || srv.branch === selectedBranch;

    // 4. Price Range Filter
    let matchesPrice = true;
    if (selectedPriceRange === 'under2000') matchesPrice = srv.priceNumeric < 2000;
    else if (selectedPriceRange === '2000to5000')
      matchesPrice = srv.priceNumeric >= 2000 && srv.priceNumeric <= 5000;
    else if (selectedPriceRange === 'above5000') matchesPrice = srv.priceNumeric > 5000;

    // 5. Duration Filter
    let matchesDuration = true;
    if (selectedDurationRange === 'under45') matchesDuration = srv.durationMinutes < 45;
    else if (selectedDurationRange === '45to90')
      matchesDuration = srv.durationMinutes >= 45 && srv.durationMinutes <= 90;
    else if (selectedDurationRange === 'above90') matchesDuration = srv.durationMinutes > 90;

    return matchesName && matchesCategory && matchesBranch && matchesPrice && matchesDuration;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Explore Salon &amp; Spa Treatments
          </h1>
          <p className="text-xs text-soft mt-1">
            Search treatments by service name, category, branch outlet, price range, and duration.
          </p>
        </div>
      </div>

      {/* 5-FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-3">
        {/* Filter 1: Service Name Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by Service Name (e.g. Haircut, Facial, Spa, Massage, Hair Color)..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
          />
        </div>

        {/* Filters 2-5: Category, Branch, Price Range, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Filter 2: Category */}
          <div>
            <label className="block text-[10px] font-bold text-soft uppercase tracking-wider mb-1">
              2. Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
            >
              <option value="all">All Categories</option>
              <option value="Haircut">Haircut</option>
              <option value="Facial">Facial</option>
              <option value="Spa">Spa</option>
              <option value="Massage">Massage</option>
              <option value="Hair Color">Hair Color</option>
            </select>
          </div>

          {/* Filter 3: Branch */}
          <div>
            <label className="block text-[10px] font-bold text-soft uppercase tracking-wider mb-1">
              3. Salon Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-2 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
            >
              <option value="all">All Salon Outlets</option>
              <option value="Indrapuri Central Outlet">Indrapuri Central Outlet</option>
              <option value="Arera Colony Outlet">Arera Colony Outlet</option>
              <option value="Kolar Road Outlet">Kolar Road Outlet</option>
            </select>
          </div>

          {/* Filter 4: Price */}
          <div>
            <label className="block text-[10px] font-bold text-soft uppercase tracking-wider mb-1">
              4. Price Range
            </label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full p-2 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
            >
              <option value="all">All Prices</option>
              <option value="under2000">Under ₹2,000</option>
              <option value="2000to5000">₹2,000 - ₹5,000</option>
              <option value="above5000">Above ₹5,000</option>
            </select>
          </div>

          {/* Filter 5: Duration */}
          <div>
            <label className="block text-[10px] font-bold text-soft uppercase tracking-wider mb-1">
              5. Duration
            </label>
            <select
              value={selectedDurationRange}
              onChange={(e) => setSelectedDurationRange(e.target.value)}
              className="w-full p-2 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
            >
              <option value="all">All Durations</option>
              <option value="under45">Under 45 Mins</option>
              <option value="45to90">45 - 90 Mins</option>
              <option value="above90">Above 90 Mins</option>
            </select>
          </div>
        </div>
      </div>

      {/* SERVICE CARDS GRID - ALL 5 REQUIRED DISPLAY ELEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div className="space-y-3">
              {/* 1. Image */}
              <div className="relative h-48 overflow-hidden bg-pine/10">
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-xs">
                  {srv.category}
                </span>

                {srv.popular && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-300 px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" /> Popular
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1 text-[11px] text-soft font-semibold">
                  <MapPin className="w-3 h-3 text-purple-600" /> {srv.branch}
                </div>

                <h3 className="text-base font-bold text-ink leading-tight">{srv.name}</h3>

                {/* 4. Description */}
                <p className="text-xs text-soft leading-relaxed line-clamp-3">{srv.description}</p>

                {/* 2. Price & 3. Duration */}
                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <div className="flex items-center gap-1 text-xs text-soft font-semibold">
                    <Clock className="w-3.5 h-3.5 text-purple-600" /> {srv.duration}
                  </div>
                  <div className="text-base font-bold text-emerald-700">{srv.price}</div>
                </div>
              </div>
            </div>

            {/* 5. Book Now Button */}
            <div className="p-4 pt-0">
              <button
                onClick={() => handleBookNow(srv)}
                className="w-full py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onConfirm={(data) => {
          toast(`Appointment Confirmed: Reserved ${data.service} at ${data.time}.`);
          setIsBookModalOpen(false);
        }}
      />
    </div>
  );
}
