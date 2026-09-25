import { ChevronLeft, Gift, Plus, Users } from 'lucide-react-native';
import type React from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const PackagesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { packages, showToast } = useApp();

  const handleBuyPackage = () => {
    showToast('Redirecting to new packages catalog...', 'info');
    navigate('/services');
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
        <H1 className="text-xl font-extrabold text-gray-900 tracking-tight">My Packages</H1>
        <Div className="w-12" />
      </Div>

      {/* Packages List */}
      <Div className="space-y-4">
        {packages.map((pkg) => {
          const remainingSessions = pkg.totalSessions - pkg.usedSessions;
          const progressPercent = (pkg.usedSessions / pkg.totalSessions) * 100;
          return (
            <Div
              key={pkg.id}
              className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-3.5"
            >
              <Div className="flex flex-row items-start justify-between">
                <Div className="space-y-1">
                  <H2 className="text-sm font-bold text-gray-900">{pkg.name}</H2>
                  <P className="text-[11px] font-bold text-purple-700">{pkg.validity}</P>
                </Div>
                <Div className="w-10 h-10 rounded-full bg-purple-100 flex flex-row items-center justify-center">
                  <Gift size={20} color="#7c3aed" />
                </Div>
              </Div>

              {/* Progress Bar & Remaining Sessions */}
              <Div className="space-y-2">
                <Div className="flex flex-row items-center justify-between text-xs font-bold text-gray-800">
                  <Span className="text-xs font-bold text-gray-800">
                    {remainingSessions} of {pkg.totalSessions} Sessions Remaining
                  </Span>
                  <Span className="text-purple-700 font-bold">
                    {Math.round(progressPercent)}% Used
                  </Span>
                </Div>
                <Div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                  <Div
                    className="h-full bg-[#7C3AED] rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </Div>
              </Div>

              {/* Shared Family Rules Badge */}
              <Div className="flex flex-row items-center gap-2 text-[11px] font-semibold text-gray-500 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                <Users size={14} color="#6b7280" />
                <Span className="text-[11px] font-semibold text-gray-600">
                  Shareable with household family members
                </Span>
              </Div>

              <Button
                type="button"
                onClick={() => navigate('/booking/step1')}
                className="w-full py-3 border-2 border-purple-300 rounded-2xl text-purple-700 text-xs font-bold hover:bg-purple-50 transition text-center"
              >
                Book Session Now
              </Button>
            </Div>
          );
        })}
      </Div>

      {/* Fixed Bottom Buy Package CTA */}
      <Div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 px-5 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={handleBuyPackage}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-bold text-xs py-3.5 rounded-2xl shadow-sm transition text-center flex flex-row items-center justify-center gap-2"
        >
          <Plus size={18} color="#ffffff" />
          <Span className="text-white font-bold">Buy New Package</Span>
        </Button>
      </Div>
    </Div>
  );
};
