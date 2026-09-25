import {
  Award,
  Bell,
  ChevronRight,
  Crown,
  Gift,
  Search,
  Sparkles,
  Wallet,
} from 'lucide-react-native';
import type React from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, H4, Img, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, appointments } = useApp();

  const upcomingApp = appointments.find((a) => a.status === 'Confirmed') || appointments[0];

  return (
    <Div className="p-4 px-5 space-y-6 pb-28">
      {/* Top Bar / Header with Clean Spacing */}
      <Div className="flex flex-row items-center justify-between pt-2 pb-1">
        <Div className="space-y-1 flex-1 pr-2">
          <H1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Hi, {user.name.split(' ')[0]}! 👋
          </H1>
          {/* Gold Member Pill Badge */}
          <Div className="self-start mt-1 inline-flex flex-row items-center gap-1.5 bg-[#fffbeb] px-3.5 py-1 rounded-full border border-[#fde68a]">
            <Crown size={14} color="#d97706" fill="#d97706" />
            <Span className="text-xs font-bold text-amber-900">{user.tier}</Span>
          </Div>
        </Div>
        <Button
          type="button"
          onClick={() => navigate('/support')}
          className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center shadow-xs flex-shrink-0"
        >
          <Bell size={24} color="#7c3aed" />
        </Button>
      </Div>

      {/* Search Bar with Search Icon & Left Margin Spacing */}
      <Div
        onClick={() => navigate('/services')}
        className="bg-white border border-purple-100 rounded-2xl px-4 py-3.5 flex flex-row items-center gap-3 shadow-xs cursor-pointer"
      >
        <Search size={20} color="#9ca3af" />
        <Span className="text-xs text-gray-400 font-medium ml-1">
          Search services, treatments...
        </Span>
      </Div>

      {/* 15% OFF Promo Banner Card - Border Removed */}
      <Div className="bg-[#E9D5FF] rounded-3xl p-5 flex flex-row items-center justify-between relative overflow-hidden shadow-xs min-h-[140px]">
        <Div className="flex-1 space-y-1.5 pr-2 z-10">
          <H2 className="text-2xl font-black text-gray-900 leading-tight">15% OFF</H2>
          <Span className="text-xs font-bold text-purple-950 block">on Hair & Facial Spa</Span>
          <Span className="text-[11px] font-semibold text-purple-800 block pb-1.5">
            For Gold Members
          </Span>
          <Button
            type="button"
            onClick={() => navigate('/services')}
            className="bg-[#7C3AED] hover:bg-purple-800 rounded-2xl px-5 py-2.5 self-start shadow-xs flex flex-row items-center justify-center"
          >
            <Span className="text-white text-xs font-bold text-center">Book Now</Span>
          </Button>
        </Div>
        <Img
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80"
          alt="Promo Facial Spa"
          className="w-28 h-28 object-cover rounded-2xl shadow-xs"
        />
      </Div>

      {/* Upcoming Appointment */}
      {upcomingApp && (
        <Div className="space-y-2.5">
          <H3 className="text-sm font-bold text-gray-900">Upcoming Appointment</H3>
          <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-4">
            <Div className="flex flex-row items-start gap-3.5">
              <Img
                src={upcomingApp.image}
                alt={upcomingApp.serviceName}
                className="w-16 h-16 rounded-2xl object-cover border border-purple-100 flex-shrink-0"
              />
              <Div className="flex-1 min-w-0 space-y-1">
                <Div className="flex flex-row items-center justify-between">
                  <H4 className="text-xs font-bold text-gray-900 truncate">
                    {upcomingApp.serviceName}
                  </H4>
                  <ChevronRight size={18} color="#9ca3af" />
                </Div>
                <P className="text-xs font-bold text-purple-700">Tomorrow, 04:00 PM</P>
                <P className="text-xs text-gray-500">{upcomingApp.branchName}</P>
                <Div className="flex flex-row items-center gap-1 pt-0.5">
                  <Span className="text-xs font-bold text-purple-700">
                    Specialist: {upcomingApp.specialistName}
                  </Span>
                  <ChevronRight size={14} color="#7c3aed" />
                </Div>
              </Div>
            </Div>

            <Button
              type="button"
              onClick={() => navigate('/appointments')}
              className="w-full border-2 border-purple-300 rounded-2xl py-3 flex flex-row items-center justify-center bg-white hover:bg-purple-50 transition"
            >
              <Span className="text-purple-700 text-xs font-bold text-center">View Details</Span>
            </Button>
          </Div>
        </Div>
      )}

      {/* Quick Actions */}
      <Div className="space-y-2.5 pt-1">
        <H3 className="text-sm font-bold text-gray-900">Quick Actions</H3>
        <Div className="flex flex-row gap-2">
          {[
            { label: 'Book', icon: Sparkles, path: '/services' },
            { label: 'Packages', icon: Gift, path: '/packages' },
            { label: 'Wallet', icon: Wallet, path: '/wallet' },
            { label: 'Loyalty', icon: Award, path: '/loyalty' },
          ].map(({ label, icon: Icon, path }) => (
            <Button
              key={label}
              type="button"
              onClick={() => navigate(path)}
              className="flex-1 bg-white border border-purple-100 rounded-3xl p-1.5 py-4 min-h-[96px] flex flex-col items-center justify-center gap-2 shadow-xs hover:border-purple-200 transition"
            >
              <Icon size={26} color="#7c3aed" />
              <Span className="text-[11px] font-bold text-gray-800 text-center tracking-tight">
                {label}
              </Span>
            </Button>
          ))}
        </Div>
      </Div>
    </Div>
  );
};
