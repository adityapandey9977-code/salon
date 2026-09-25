import type React from 'react';
import { BrowserRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { MobileShellLayout } from '../layouts/MobileShellLayout';

import { AppointmentsScreen } from '../pages/AppointmentsScreen';
import { BookingStep1Screen } from '../pages/BookingStep1Screen';
import { BookingStep2Screen } from '../pages/BookingStep2Screen';
import { BookingStep3Screen } from '../pages/BookingStep3Screen';
import { BookingStep4Screen } from '../pages/BookingStep4Screen';
import { BookingStep5Screen } from '../pages/BookingStep5Screen';
import { BookingSuccessScreen } from '../pages/BookingSuccessScreen';
import { HomeScreen } from '../pages/HomeScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { LoyaltyScreen } from '../pages/LoyaltyScreen';
import { PackagesScreen } from '../pages/PackagesScreen';
import { ProfileScreen } from '../pages/ProfileScreen';
import { ResetPasswordScreen } from '../pages/ResetPasswordScreen';
import { ServiceDetailsScreen } from '../pages/ServiceDetailsScreen';
import { ServicesScreen } from '../pages/ServicesScreen';
import { SignupScreen } from '../pages/SignupScreen';
import { SupportScreen } from '../pages/SupportScreen';
import { WalletScreen } from '../pages/WalletScreen';

// Choose MemoryRouter on Native (iOS/Android) where document is undefined
const RouterComponent = typeof document !== 'undefined' ? BrowserRouter : MemoryRouter;

export const App: React.FC = () => {
  return (
    <AppProvider>
      <RouterComponent>
        <Routes>
          <Route element={<MobileShellLayout />}>
            <Route index element={<HomeScreen />} />
            <Route path="services" element={<ServicesScreen />} />
            <Route path="service-details/:id" element={<ServiceDetailsScreen />} />

            {/* 5-Step Booking Flow */}
            <Route path="booking/step1" element={<BookingStep1Screen />} />
            <Route path="booking/step2" element={<BookingStep2Screen />} />
            <Route path="booking/step3" element={<BookingStep3Screen />} />
            <Route path="booking/step4" element={<BookingStep4Screen />} />
            <Route path="booking/step5" element={<BookingStep5Screen />} />
            <Route path="booking/success" element={<BookingSuccessScreen />} />

            {/* Main Tabs & Details */}
            <Route path="appointments" element={<AppointmentsScreen />} />
            <Route path="packages" element={<PackagesScreen />} />
            <Route path="wallet" element={<WalletScreen />} />
            <Route path="loyalty" element={<LoyaltyScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="reset-password" element={<ResetPasswordScreen />} />
            <Route path="login" element={<LoginScreen />} />
            <Route path="signup" element={<SignupScreen />} />
            <Route path="support" element={<SupportScreen />} />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </RouterComponent>
    </AppProvider>
  );
};

export default App;
