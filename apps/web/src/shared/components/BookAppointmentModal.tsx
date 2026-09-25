import { Button, cn } from '@salon-spa-saas/ui';
import { X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import bookMassageImg from '@/assets/images/Book-Massage.jpg';
import mensFacialImg from '@/assets/images/Mens-Facial.jpg';
import mensHaircutImg from '@/assets/images/Mens-haircut.jpg';
import pedicureImg from '@/assets/images/Pedicure.jpg';
import womenFacialImg from '@/assets/images/Women-Facial.jpg';
import womenHaircutImg from '@/assets/images/Women-haircut.jpg';
import womenMakeUpImg from '@/assets/images/women-MakeUp.jpg';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    client: string;
    service: string;
    time: string;
    staff: string;
    room: string;
    gender: 'Men' | 'Women';
    day?: string;
    serviceMode?: 'In-Salon' | 'At-Home';
    address?: string;
    pincode?: string;
    travelSurcharge?: string;
  }) => void;
  defaultDay?: string;
  defaultTime?: string;
  defaultStaff?: string;
  defaultRoom?: string;
  showDaySelector?: boolean;
}

export function BookAppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  defaultDay = 'Mon 21',
  defaultTime = '02:00 PM',
  defaultStaff = 'Emma Thompson',
  defaultRoom = 'Chair 1',
  showDaySelector = false,
}: BookAppointmentModalProps) {
  const [serviceMode, setServiceMode] = useState<'In-Salon' | 'At-Home'>('In-Salon');
  const [bookingGender, setBookingGender] = useState<'Men' | 'Women'>('Women');
  const [newService, setNewService] = useState('Signature Blowdry & Style');
  const [newClient, setNewClient] = useState('');
  const [newTime, setNewTime] = useState(defaultTime);
  const [newStaff, setNewStaff] = useState(defaultStaff);
  const [newRoom, setNewRoom] = useState(defaultRoom);
  const [targetDay, setTargetDay] = useState(defaultDay);

  // At-Home Service States (SALO-PR-068 - SALO-PR-072)
  const [homeAddress, setHomeAddress] = useState(
    'Flat 402, Royal Palms, Sector B, Indrapuri, Bhopal',
  );
  const [homePincode, setHomePincode] = useState('462022');
  const [travelDistance, setTravelDistance] = useState('6.5 km');
  const [travelSurcharge, setTravelSurcharge] = useState('₹150');

  // Sync state with default props if they change
  useEffect(() => {
    if (isOpen) {
      setNewTime(defaultTime);
      setNewStaff(defaultStaff);
      setNewRoom(defaultRoom);
      setTargetDay(defaultDay);
      setNewService(
        bookingGender === 'Men' ? 'Precision Haircut & Style' : 'Signature Blowdry & Style',
      );
    }
  }, [isOpen, defaultTime, defaultStaff, defaultRoom, defaultDay]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim()) return;

    onConfirm({
      client: newClient,
      service: newService,
      time: newTime,
      staff: newStaff,
      room: serviceMode === 'At-Home' ? 'Doorstep Visit' : newRoom,
      gender: bookingGender,
      day: targetDay,
      serviceMode,
      address: serviceMode === 'At-Home' ? `${homeAddress}, ${homePincode}` : undefined,
      pincode: serviceMode === 'At-Home' ? homePincode : undefined,
      travelSurcharge: serviceMode === 'At-Home' ? travelSurcharge : undefined,
    });

    setNewClient('');
  };

  const menServices = [
    {
      name: 'Precision Haircut & Style',
      img: mensHaircutImg,
      price: '₹1,850',
      duration: '45 mins',
    },
    {
      name: "Gentlemen's Radiance Facial",
      img: mensFacialImg,
      price: '₹2,500',
      duration: '60 mins',
    },
    {
      name: 'Full Body Swedish Massage',
      img: bookMassageImg,
      price: '₹4,200',
      duration: '90 mins',
    },
    { name: "Gentlemen's Spa Pedicure", img: pedicureImg, price: '₹1,500', duration: '50 mins' },
  ];

  const womenServices = [
    {
      name: 'Signature Blowdry & Style',
      img: womenHaircutImg,
      price: '₹1,850',
      duration: '45 mins',
    },
    { name: 'Organic Radiance Facial', img: womenFacialImg, price: '₹2,500', duration: '60 mins' },
    { name: 'Atelier Bridal MakeUp', img: womenMakeUpImg, price: '₹6,500', duration: '180 mins' },
    { name: 'Premium Spa Pedicure', img: pedicureImg, price: '₹1,500', duration: '50 mins' },
    {
      name: 'Full Body Swedish Massage',
      img: bookMassageImg,
      price: '₹4,200',
      duration: '90 mins',
    },
  ];

  const activeServices = bookingGender === 'Men' ? menServices : womenServices;

  return createPortal(
    <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-5xl h-auto md:h-[510px] max-h-[90vh] shadow-[0_25px_60px_rgba(90,46,166,0.18)] overflow-hidden border border-[#5A2EA6]/10 flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        {/* LEFT SIDE: SERVICE SELECTOR WITH LUXURY GRADIENT */}
        <div className="w-full md:w-3/5 bg-gradient-to-br from-[#FCFAFF] via-[#F3E8FF] to-[#E2D4FF] p-6 text-[#3B2647] flex flex-col justify-between relative md:h-full md:min-h-0 min-h-[380px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#cca080]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="z-10">
            <h2 className="font-serif text-[24px] font-bold tracking-tight mb-1 text-[#3B2647]">
              Atelier Signature Menu
            </h2>
            <p className="text-[#3B2647]/70 text-[11.5px] mb-6 font-sans font-medium">
              Select a premium service card to begin booking allocation
            </p>

            {/* Gender Selection Tabs */}
            <div className="flex bg-[#5A2EA6]/5 p-1 rounded-2xl border border-[#5A2EA6]/10 w-fit gap-1.5 mb-6">
              <button
                type="button"
                onClick={() => {
                  setBookingGender('Women');
                  setNewService('Signature Blowdry & Style');
                }}
                className={cn(
                  'px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-0',
                  bookingGender === 'Women'
                    ? 'bg-[#5A2EA6] text-white shadow-sm'
                    : 'bg-transparent text-[#5A2EA6]/80 hover:text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
                )}
              >
                For Ladies
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingGender('Men');
                  setNewService('Precision Haircut & Style');
                }}
                className={cn(
                  'px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-0',
                  bookingGender === 'Men'
                    ? 'bg-[#5A2EA6] text-white shadow-sm'
                    : 'bg-transparent text-[#5A2EA6]/80 hover:text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
                )}
              >
                For Gentlemen
              </button>
            </div>

            {/* Service Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[270px] overflow-y-auto pr-1.5 no-scrollbar">
              {activeServices.map((s) => (
                <div
                  key={s.name}
                  onClick={() => setNewService(s.name)}
                  className={cn(
                    'relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group hover:shadow-lg bg-white/30 backdrop-blur-xs',
                    newService === s.name
                      ? 'border-[#5A2EA6] scale-[1.02] shadow-[#5A2EA6]/10'
                      : 'border-[#5A2EA6]/10 hover:border-[#5A2EA6]/30',
                  )}
                >
                  <img
                    src={s.img}
                    alt={s.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3B2647]/90 via-[#3B2647]/20 to-transparent flex flex-col justify-end p-3.5" />
                  <div className="absolute inset-x-3 bottom-3 flex justify-between items-end z-10">
                    <div>
                      <h4 className="font-serif text-[12.5px] text-white font-bold leading-tight drop-shadow-sm">
                        {s.name}
                      </h4>
                      <p className="text-[9.5px] text-white/70 font-medium mt-0.5">{s.duration}</p>
                    </div>
                    <span className="text-[11.5px] font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                      {s.price}
                    </span>
                  </div>
                  {newService === s.name && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/20 z-10">
                      Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[9.5px] text-[#5A2EA6]/50 font-semibold tracking-wider uppercase mt-4 z-10">
            Atelier Premium Spa & Salon Enterprise
          </p>
        </div>

        {/* RIGHT SIDE: BOOKING FORM DETAILS */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-2/5 p-6 flex flex-col bg-white relative md:h-full overflow-hidden"
        >
          {/* Fixed Header */}
          <div className="flex justify-between items-center border-b border-line pb-3 shrink-0">
            <div>
              <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                Booking Details
              </h3>
              {showDaySelector && (
                <p className="text-[10px] text-soft mt-0.5 font-bold uppercase">
                  Scheduling on {targetDay}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl flex items-center justify-center hover:bg-paper/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Middle Content (no-scrollbar) */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-4">
            {/* Service Mode Selector Switcher (SALO-PR-068) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                Service Delivery Mode
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#5A2EA6]/5 p-1 rounded-xl border border-[#5A2EA6]/10">
                <button
                  type="button"
                  onClick={() => setServiceMode('In-Salon')}
                  className={cn(
                    'py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-0',
                    serviceMode === 'In-Salon'
                      ? 'bg-[#5A2EA6] text-white shadow-xs'
                      : 'bg-transparent text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
                  )}
                >
                  🏢 In-Salon Appointment
                </button>

                <button
                  type="button"
                  onClick={() => setServiceMode('At-Home')}
                  className={cn(
                    'py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-0',
                    serviceMode === 'At-Home'
                      ? 'bg-[#5A2EA6] text-white shadow-xs'
                      : 'bg-transparent text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
                  )}
                >
                  🏠 At-Home Doorstep Visit
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-soft uppercase tracking-wider">
                Client Full Name
              </label>
              <input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                placeholder="Enter client's legal name..."
                className="bg-paper/30 border border-line rounded-xl p-3 text-[12px] outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                required
              />
            </div>

            {/* At-Home Doorstep Address Panel */}
            {serviceMode === 'At-Home' && (
              <div className="p-3.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                    🏠 Doorstep Address &amp; Travel Fee
                  </span>
                  <span className="text-[10px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6] px-2 py-0.5 rounded-full font-mono">
                    Surcharge: {travelSurcharge} ({travelDistance})
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted block mb-1">
                    Client Street Address & Landmark
                  </label>
                  <input
                    type="text"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="House/Flat No, Landmark, Sector..."
                    className="w-full bg-white border border-line rounded-xl p-2.5 text-[11.5px] outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-muted block mb-1">
                      Pincode Area
                    </label>
                    <input
                      type="text"
                      value={homePincode}
                      onChange={(e) => setHomePincode(e.target.value)}
                      className="w-full bg-white border border-line rounded-xl p-2.5 text-[11.5px] outline-none font-mono font-bold text-ink"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted block mb-1">
                      Travel Distance Surcharge
                    </label>
                    <select
                      value={travelSurcharge}
                      onChange={(e) => {
                        setTravelSurcharge(e.target.value);
                        if (e.target.value === '₹150') setTravelDistance('6.5 km');
                        else if (e.target.value === '₹300') setTravelDistance('14 km');
                        else setTravelDistance('3.2 km');
                      }}
                      className="w-full bg-white border border-line rounded-xl p-2.5 text-[11px] font-bold text-ink cursor-pointer"
                    >
                      <option value="₹150">6.5 km (+₹150 Surcharge)</option>
                      <option value="₹300">14.0 km (+₹300 Surcharge)</option>
                      <option value="₹0">3.0 km (Standard - ₹0 Free Zone)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 bg-[#5A2EA6]/3 p-3.5 rounded-2xl border border-[#5A2EA6]/10">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                Selected Treatment
              </label>
              <div className="flex justify-between items-center mt-1">
                <span className="font-serif text-[13.5px] text-[#3b2647] font-semibold">
                  {newService}
                </span>
                <span className="text-[10.5px] bg-[#cca080]/15 text-[#cca080] font-bold px-2 py-0.5 rounded-md border border-[#cca080]/10 capitalize">
                  {bookingGender}
                </span>
              </div>
            </div>

            {/* Time Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-soft uppercase tracking-wider">
                Time Slot Grid
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'].map(
                  (slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewTime(slot)}
                      className={cn(
                        'py-2 rounded-xl text-[11px] font-bold border transition-all duration-300 cursor-pointer select-none',
                        newTime === slot
                          ? 'bg-[#5A2EA6] border-[#5A2EA6] text-white shadow-sm font-bold'
                          : 'bg-[#5A2EA6]/5 border-[#5A2EA6]/10 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 font-semibold',
                      )}
                    >
                      {slot}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Custom Day/Room/Staff dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              {showDaySelector ? (
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[11px] font-bold text-soft uppercase tracking-wider">
                    Allocated Day
                  </label>
                  <select
                    value={targetDay}
                    onChange={(e) => setTargetDay(e.target.value)}
                    className="bg-paper/30 border border-line rounded-xl p-3 text-[12px] outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                  >
                    {['Sun 20', 'Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26'].map(
                      (d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-soft uppercase tracking-wider">
                  Station Chair
                </label>
                <select
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  className="bg-paper/30 border border-line rounded-xl p-3 text-[12px] outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                >
                  <option value="Chair 1">Chair 01</option>
                  <option value="Chair 2">Chair 02</option>
                  <option value="Chair 03">Chair 03</option>
                  <option value="Room 01">Room 01</option>
                  <option value="Room 02">Room 02</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-soft uppercase tracking-wider">
                  Stylist
                </label>
                <select
                  value={newStaff}
                  onChange={(e) => setNewStaff(e.target.value)}
                  className="bg-paper/30 border border-line rounded-xl p-3 text-[12px] outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                >
                  <option value="Emma Thompson">Emma Thompson</option>
                  <option value="Neha Kapoor">Neha Kapoor</option>
                  <option value="Aditi Malhotra">Aditi Malhotra</option>
                  <option value="Rohan Mehra">Rohan Mehra</option>
                  <option value="Simran Kaur">Simran Kaur</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="flex gap-2.5 pt-4 border-t border-line shrink-0">
            <Button
              type="submit"
              className="flex-1 py-3 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer border-0 shadow-sm"
            >
              Confirm Reservation
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-xs font-bold border border-line bg-transparent hover:bg-paper/40 text-soft font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
