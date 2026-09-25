import { Camera, ChevronLeft, Clock, MapPin, Star, User } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, Img, ModalOverlay, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const AppointmentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, cancelAppointment, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'History' | 'Cancelled'>('Upcoming');

  const [selectedPhotoApp, setSelectedPhotoApp] = useState<(typeof appointments)[0] | null>(null);
  const [ratingModalApp, setRatingModalApp] = useState<(typeof appointments)[0] | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(5);

  const filteredAppointments = appointments.filter((app) => {
    if (activeTab === 'Upcoming') return app.status === 'Confirmed';
    if (activeTab === 'History') return app.status === 'Completed';
    return app.status === 'Cancelled';
  });

  const handleSubmitRating = () => {
    showToast(`Thank you! Submitted ${ratingScore}-star review.`, 'success');
    setRatingModalApp(null);
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
        <H1 className="text-xl font-extrabold text-gray-900 tracking-tight text-center">
          My Appointments
        </H1>
        <Div className="w-12" />
      </Div>

      {/* Segmented Tab Ribbon */}
      <Div className="flex flex-row bg-white p-1.5 rounded-3xl border border-purple-100 shadow-xs">
        {(['Upcoming', 'History', 'Cancelled'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <Button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition-all flex flex-row items-center justify-center ${
                isSelected
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Span
                className={`text-center text-xs font-bold ${isSelected ? 'text-white font-bold' : 'text-gray-500 font-bold'}`}
              >
                {tab}
              </Span>
            </Button>
          );
        })}
      </Div>

      {/* Appointments List & Full-Width Empty State Card */}
      <Div className="space-y-3.5 pt-1">
        {filteredAppointments.length === 0 ? (
          <Div className="w-full bg-white rounded-3xl p-8 py-12 my-4 border border-purple-100 text-center space-y-4 shadow-xs flex flex-col items-center justify-center">
            <P className="text-sm font-bold text-gray-700 text-center">
              No {activeTab.toLowerCase()} appointments found.
            </P>
            <Button
              type="button"
              onClick={() => navigate('/services')}
              className="bg-[#7C3AED] hover:bg-purple-800 rounded-2xl px-6 py-3 shadow-xs mt-2 text-center flex flex-row items-center justify-center"
            >
              <Span className="text-white font-bold text-xs text-center">Book a Service</Span>
            </Button>
          </Div>
        ) : (
          filteredAppointments.map((app) => (
            <Div
              key={app.id}
              className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-4"
            >
              <Div className="flex flex-row items-start gap-3.5">
                <Img
                  src={app.image}
                  alt={app.serviceName}
                  className="w-16 h-16 rounded-2xl object-cover border border-purple-100 flex-shrink-0"
                />
                <Div className="flex-1 min-w-0 space-y-1">
                  <Div className="flex flex-row items-center justify-between">
                    <H3 className="text-xs font-bold text-gray-900 truncate">{app.serviceName}</H3>

                    {/* Status Pill Wrapper Container for 100% Mobile Parity */}
                    <Div
                      className={`px-2.5 py-0.5 rounded-full border flex flex-row items-center justify-center ${
                        app.status === 'Confirmed'
                          ? 'bg-emerald-50 border-emerald-200'
                          : app.status === 'Completed'
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-rose-50 border-rose-200'
                      }`}
                    >
                      <Span
                        className={`text-[10px] font-bold text-center ${
                          app.status === 'Confirmed'
                            ? 'text-emerald-700'
                            : app.status === 'Completed'
                              ? 'text-blue-700'
                              : 'text-rose-700'
                        }`}
                      >
                        {app.status}
                      </Span>
                    </Div>
                  </Div>

                  <Div className="flex flex-row items-center gap-1.5">
                    <Clock size={14} color="#7c3aed" />
                    <Span className="text-xs font-bold text-purple-700">{app.date}</Span>
                  </Div>

                  <Div className="flex flex-row items-center gap-1.5">
                    <MapPin size={14} color="#9ca3af" />
                    <Span className="text-[11px] font-semibold text-gray-500 truncate">
                      {app.branchName}
                    </Span>
                  </Div>

                  <Div className="flex flex-row items-center gap-1.5">
                    <User size={14} color="#9ca3af" />
                    <Span className="text-[11px] font-bold text-gray-800">
                      {app.specialistName}
                    </Span>
                  </Div>
                </Div>
              </Div>

              {/* Show OTP Code if Confirmed */}
              {app.status === 'Confirmed' && app.otpCode && (
                <Div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100 flex flex-row items-center justify-between">
                  <Span className="text-[10px] font-bold text-purple-700 uppercase">
                    Check-in OTP Code
                  </Span>
                  <Span className="text-sm font-black text-purple-900 tracking-wider">
                    {app.otpCode}
                  </Span>
                </Div>
              )}

              {/* Actions - Centered Buttons */}
              {app.status === 'Confirmed' && (
                <Div className="flex flex-row items-center justify-center gap-2.5 border-t border-purple-50 pt-3">
                  <Button
                    type="button"
                    onClick={() => navigate('/services')}
                    className="flex-1 py-2.5 border border-purple-600 text-purple-700 text-xs font-bold rounded-2xl hover:bg-purple-50 transition text-center flex flex-row items-center justify-center"
                  >
                    <Span className="text-purple-700 font-bold text-xs text-center w-full">
                      Reschedule
                    </Span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => cancelAppointment(app.id)}
                    className="flex-1 py-2.5 border border-rose-200 text-rose-600 text-xs font-bold rounded-2xl hover:bg-rose-50 transition text-center flex flex-row items-center justify-center"
                  >
                    <Span className="text-rose-600 font-bold text-xs text-center w-full">
                      Cancel
                    </Span>
                  </Button>
                </Div>
              )}

              {app.status === 'Completed' && (
                <Div className="flex flex-row items-center justify-center gap-2.5 border-t border-purple-50 pt-3">
                  {app.beforeAfterPhotos && (
                    <Button
                      type="button"
                      onClick={() => setSelectedPhotoApp(app)}
                      className="flex-1 py-2.5 border border-purple-200 text-purple-700 text-xs font-bold rounded-2xl flex flex-row items-center justify-center gap-1.5"
                    >
                      <Camera size={14} color="#7c3aed" />
                      <Span className="text-purple-700 font-bold text-xs text-center">Photos</Span>
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => setRatingModalApp(app)}
                    className="flex-1 py-2.5 bg-[#7C3AED] text-white text-xs font-bold rounded-2xl flex flex-row items-center justify-center gap-1.5"
                  >
                    <Star size={14} color="#ffffff" fill="#ffffff" />
                    <Span className="text-white font-bold text-xs text-center">Rate & Review</Span>
                  </Button>
                </Div>
              )}
            </Div>
          ))
        )}
      </Div>

      {/* Before/After Photos Modal - Uses ModalOverlay */}
      <ModalOverlay isOpen={!!selectedPhotoApp} onClose={() => setSelectedPhotoApp(null)}>
        {selectedPhotoApp?.beforeAfterPhotos && (
          <Div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl self-center">
            <H2 className="text-sm font-bold text-gray-900 text-center">Before & After Photos</H2>
            <Div className="flex flex-row gap-3 text-center">
              <Div className="flex-1 space-y-1">
                <Span className="text-[10px] font-bold text-gray-500 uppercase text-center block">
                  Before
                </Span>
                <Img
                  src={selectedPhotoApp.beforeAfterPhotos.before}
                  alt="Before"
                  className="w-full h-28 rounded-2xl object-cover border"
                />
              </Div>
              <Div className="flex-1 space-y-1">
                <Span className="text-[10px] font-bold text-purple-700 uppercase text-center block">
                  After
                </Span>
                <Img
                  src={selectedPhotoApp.beforeAfterPhotos.after}
                  alt="After"
                  className="w-full h-28 rounded-2xl object-cover border border-purple-300"
                />
              </Div>
            </Div>
            <Button
              type="button"
              onClick={() => setSelectedPhotoApp(null)}
              className="w-full py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-2xl flex flex-row items-center justify-center"
            >
              <Span className="text-gray-700 font-bold text-xs text-center w-full">Close</Span>
            </Button>
          </Div>
        )}
      </ModalOverlay>

      {/* Rating & Feedback Modal - Uses ModalOverlay */}
      <ModalOverlay isOpen={!!ratingModalApp} onClose={() => setRatingModalApp(null)}>
        {ratingModalApp && (
          <Div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl text-center self-center">
            <H2 className="text-sm font-bold text-gray-900 text-center">
              Rate Service & Specialist
            </H2>
            <P className="text-xs text-gray-600 text-center">{ratingModalApp.serviceName}</P>
            <Div className="flex flex-row justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button key={star} type="button" onClick={() => setRatingScore(star)}>
                  <Star
                    size={24}
                    color="#f59e0b"
                    fill={star <= ratingScore ? '#f59e0b' : 'transparent'}
                  />
                </Button>
              ))}
            </Div>
            <Div className="flex flex-row gap-2.5">
              <Button
                type="button"
                onClick={() => setRatingModalApp(null)}
                className="flex-1 py-3 text-xs font-bold border border-gray-200 text-gray-600 rounded-2xl flex flex-row items-center justify-center"
              >
                <Span className="text-gray-600 font-bold text-xs text-center w-full">Cancel</Span>
              </Button>
              <Button
                type="button"
                onClick={handleSubmitRating}
                className="flex-1 py-3 text-xs font-bold bg-[#7C3AED] text-white rounded-2xl flex flex-row items-center justify-center"
              >
                <Span className="text-white font-bold text-xs text-center w-full">Submit</Span>
              </Button>
            </Div>
          </Div>
        )}
      </ModalOverlay>
    </Div>
  );
};
