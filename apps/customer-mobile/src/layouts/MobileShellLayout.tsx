import type React from 'react';
import { View as RNView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Outlet, useLocation } from 'react-router';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { ToastContainer } from '../components/ToastContainer';
import { Div } from '../components/primitives';

const isWeb = typeof document !== 'undefined';

export const MobileShellLayout: React.FC = () => {
  const location = useLocation();

  const hideBottomNavRoutes = [
    '/service-details',
    '/booking/step1',
    '/booking/step2',
    '/booking/step3',
    '/booking/step4',
    '/booking/step5',
    '/booking/success',
    '/reset-password',
    '/login',
    '/signup',
  ];

  const shouldHideBottomNav = hideBottomNavRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  if (isWeb) {
    return (
      <Div className="min-h-screen bg-slate-900 flex justify-center items-center py-0 sm:py-6 relative">
        <ToastContainer />
        {/* Mobile Device Mockup Frame for Web Desktop Browser */}
        <Div className="w-full max-w-md min-h-screen sm:min-h-[844px] sm:h-[844px] bg-[#F6F4FF] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 overflow-y-auto relative flex flex-col no-scrollbar">
          {/* Dynamic Screen Content */}
          <Div className="flex-1 flex flex-col">
            <Outlet />
          </Div>

          {/* Bottom Tab Bar */}
          {!shouldHideBottomNav && <MobileBottomNav />}
        </Div>
      </Div>
    );
  }

  // Native Expo Go layout: Render flex View on booking pages to allow absolute bottom button pinning
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F4FF' }}>
      <ToastContainer />
      {shouldHideBottomNav ? (
        <RNView style={{ flex: 1, backgroundColor: '#F6F4FF' }}>
          <Outlet />
        </RNView>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: '#F6F4FF' }}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          <Outlet />
        </ScrollView>
      )}
      {!shouldHideBottomNav && <MobileBottomNav />}
    </SafeAreaView>
  );
};
