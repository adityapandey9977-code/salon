import { ChevronLeft, CreditCard, Gift, Tag, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, Input, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const BookingStep5Screen: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    packages,
    bookingFlow,
    updateBookingFlow,
    addAppointment,
    applyCouponCode,
    redeemPackageSession,
  } = useApp();

  const [couponInput, setCouponInput] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>(bookingFlow.paymentOption);
  const [usePackageSession, setUsePackageSession] = useState<boolean>(false);

  const basePrice = bookingFlow.selectedService?.price || 0;
  const travelFee = bookingFlow.isHomeService ? bookingFlow.travelFee : 0;
  const packageDiscount = usePackageSession ? basePrice : 0;
  const couponDiscount = bookingFlow.couponDiscount || 0;
  const taxableAmount = Math.max(0, basePrice + travelFee - packageDiscount - couponDiscount);
  const gstAmount = Math.round(taxableAmount * 0.18);
  const finalTotal = taxableAmount + gstAmount;

  const activePackage = packages[0]; // e.g. Bridal Pamper Glow Package

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCouponCode(couponInput.trim());
    }
  };

  const handleConfirmBooking = () => {
    if (
      bookingFlow.selectedService &&
      (bookingFlow.selectedBranch || bookingFlow.isHomeService) &&
      bookingFlow.selectedSpecialist
    ) {
      if (usePackageSession && activePackage) {
        redeemPackageSession(activePackage.id);
      }

      addAppointment({
        id: `app_${Date.now()}`,
        bookingId: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
        serviceName: bookingFlow.selectedService.name,
        duration: bookingFlow.selectedService.duration,
        price: finalTotal,
        branchName: bookingFlow.isHomeService
          ? 'At-Home Service'
          : bookingFlow.selectedBranch?.name || 'Central Outlet',
        specialistName: bookingFlow.selectedSpecialist.name,
        date: bookingFlow.selectedDate,
        time: bookingFlow.selectedTime,
        status: 'Confirmed',
        otpCode: `${Math.floor(1000 + Math.random() * 9000)}`,
        image: bookingFlow.selectedService.image,
        isHomeService: bookingFlow.isHomeService,
        travelFee: travelFee,
      });
    }
    navigate('/booking/success');
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
            5/5
          </Span>
        </Div>

        {/* Stepper Progress Bar with Light Lines */}
        <Div className="flex flex-row items-center justify-between px-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <Div className="w-8 h-8 rounded-full flex flex-row items-center justify-center text-xs font-bold bg-[#7C3AED] text-white shadow-xs">
                <Span className="text-white font-bold text-xs text-center">{step}</Span>
              </Div>
              {step < 5 && <Div className="flex-1 h-0.5 mx-1.5 rounded-full bg-[#7C3AED]" />}
            </React.Fragment>
          ))}
        </Div>

        {/* Review Booking Details - Capital Letter Titles */}
        <Div className="space-y-3">
          <H2 className="text-sm font-extrabold text-gray-900">Review Booking</H2>
          <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-3.5 text-xs">
            <Div>
              <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                SERVICE
              </Span>
              <H3 className="font-bold text-gray-900 text-sm mt-0.5">
                {bookingFlow.selectedService?.name}
              </H3>
              <P className="text-[11px] font-medium text-gray-500">
                {bookingFlow.selectedService?.duration} Mins · ₹
                {bookingFlow.selectedService?.price.toLocaleString()}
              </P>
            </Div>

            <Div className="border-t border-purple-50 pt-2.5">
              <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                LOCATION / BRANCH
              </Span>
              <P className="font-bold text-gray-900 text-xs mt-0.5">
                {bookingFlow.isHomeService ? 'At-Home Service' : bookingFlow.selectedBranch?.name}
              </P>
            </Div>

            <Div className="border-t border-purple-50 pt-2.5">
              <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                SPECIALIST
              </Span>
              <P className="font-bold text-gray-900 text-xs mt-0.5">
                {bookingFlow.selectedSpecialist?.name}
              </P>
            </Div>

            <Div className="border-t border-purple-50 pt-2.5 flex flex-row items-center justify-between">
              <Div>
                <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                  DATE
                </Span>
                <P className="font-bold text-gray-900 text-xs mt-0.5">{bookingFlow.selectedDate}</P>
              </Div>
              <Div>
                <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                  TIME
                </Span>
                <P className="font-bold text-gray-900 text-xs mt-0.5">{bookingFlow.selectedTime}</P>
              </Div>
            </Div>
          </Div>
        </Div>

        {/* Package Session Redemption Option */}
        {activePackage && activePackage.usedSessions < activePackage.totalSessions && (
          <Div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-4 flex flex-row items-center justify-between shadow-xs">
            <Div className="flex flex-row items-center gap-3">
              <Gift size={22} color="#7c3aed" />
              <Div className="space-y-0.5">
                <Span className="text-xs font-bold text-purple-900 block">
                  Redeem Package Session
                </Span>
                <P className="text-[10px] font-medium text-purple-700">
                  {activePackage.name} ({activePackage.totalSessions - activePackage.usedSessions}{' '}
                  left)
                </P>
              </Div>
            </Div>
            <Button
              type="button"
              onClick={() => setUsePackageSession(!usePackageSession)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex flex-row items-center justify-center ${
                usePackageSession
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-white border border-purple-300 text-purple-700'
              }`}
            >
              <Span
                className={
                  usePackageSession
                    ? 'text-white font-bold text-xs text-center'
                    : 'text-purple-700 font-bold text-xs text-center'
                }
              >
                {usePackageSession ? 'Applied ✓' : 'Use 1 Session'}
              </Span>
            </Button>
          </Div>
        )}

        {/* Promo Coupon Entry - 16px Gap Between Tag Icon and Placeholder */}
        <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-3">
          <H2 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
            APPLY PROMO COUPON
          </H2>
          <Div className="flex flex-row gap-2.5 items-center">
            <Div className="relative flex-1 justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <Tag size={18} color="#7c3aed" />
              </Div>
              <Input
                type="text"
                placeholder="ENTER COUPON (E.G. GOLD15)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-gray-900 uppercase font-bold"
              />
            </Div>
            <Button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-[#7C3AED] hover:bg-purple-800 text-white px-6 py-3.5 rounded-2xl text-xs font-extrabold shadow-xs flex flex-row items-center justify-center"
            >
              <Span className="text-white font-extrabold text-xs text-center">Apply</Span>
            </Button>
          </Div>
        </Div>

        {/* Payment Summary */}
        <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-3 text-xs">
          <Div className="flex flex-row items-center justify-between text-gray-600">
            <Span className="text-xs font-medium text-gray-600">Base Service Price</Span>
            <Span className="text-xs font-bold text-gray-900">₹{basePrice.toLocaleString()}</Span>
          </Div>

          {bookingFlow.isHomeService && (
            <Div className="flex flex-row items-center justify-between text-gray-600">
              <Span className="text-xs font-medium text-gray-600">At-Home Travel Fee</Span>
              <Span className="text-xs font-bold text-gray-900">+₹{travelFee}</Span>
            </Div>
          )}

          {usePackageSession && (
            <Div className="flex flex-row items-center justify-between text-emerald-700 font-bold">
              <Span className="text-xs">Package Session Discount</Span>
              <Span className="text-xs">-₹{packageDiscount.toLocaleString()}</Span>
            </Div>
          )}

          {bookingFlow.appliedCoupon && (
            <Div className="flex flex-row items-center justify-between text-emerald-700 font-bold">
              <Span className="text-xs">Coupon ({bookingFlow.appliedCoupon})</Span>
              <Span className="text-xs">-₹{couponDiscount}</Span>
            </Div>
          )}

          <Div className="flex flex-row items-center justify-between text-gray-600">
            <Span className="text-xs font-medium text-gray-600">GST (18%)</Span>
            <Span className="text-xs font-bold text-gray-900">₹{gstAmount.toLocaleString()}</Span>
          </Div>

          <Div className="border-t border-purple-100 pt-3 flex flex-row items-center justify-between font-bold text-sm text-gray-900">
            <Span className="text-sm font-extrabold text-gray-900">Total Amount</Span>
            <Span className="text-base font-black text-purple-700">
              ₹{finalTotal.toLocaleString()}
            </Span>
          </Div>
        </Div>

        {/* Select Payment Method - Borderless Cards */}
        <Div className="space-y-2.5">
          <H2 className="text-sm font-extrabold text-gray-900">Select Payment Method</H2>
          <Div className="flex flex-row gap-3">
            {[
              { label: 'Card / GPay', icon: CreditCard },
              { label: `Wallet (₹${user.walletBalance})`, icon: Wallet },
            ].map(({ label, icon: Icon }) => {
              const isSelected = selectedPayment === label;
              return (
                <Button
                  key={label}
                  type="button"
                  onClick={() => setSelectedPayment(label)}
                  className={`flex-1 p-4.5 rounded-2xl text-xs font-extrabold flex flex-row items-center justify-center gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  <Icon size={18} color={isSelected ? '#ffffff' : '#7c3aed'} />
                  <Span
                    className={
                      isSelected
                        ? 'text-white font-extrabold text-xs text-center truncate'
                        : 'text-purple-900 font-extrabold text-xs text-center truncate'
                    }
                  >
                    {label}
                  </Span>
                </Button>
              );
            })}
          </Div>
        </Div>
      </Div>

      {/* Flush Bottom Sticky Confirm Booking Button Bar Pinned to Viewport Bottom */}
      <Div className="absolute bottom-0 left-0 right-0 p-4 px-5 pb-6 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={handleConfirmBooking}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-sm text-center flex flex-row items-center justify-center"
        >
          <Span className="text-white font-extrabold text-sm text-center w-full">
            Confirm Booking
          </Span>
        </Button>
      </Div>
    </Div>
  );
};
