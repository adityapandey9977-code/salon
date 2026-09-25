import { AppLayout } from '@/shared/layouts/AppLayout/AppLayout';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ClientSidebar } from '../layouts/Sidebar/Sidebar';

import { AppointmentsPage } from '../pages/AppointmentsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { LoyaltyRewardsPage } from '../pages/LoyaltyRewardsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { PackagesMembershipPage } from '../pages/PackagesMembershipPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SearchServicesPage } from '../pages/SearchServicesPage';
import { ServiceHistoryPage } from '../pages/ServiceHistoryPage';
import { SupportPage } from '../pages/SupportPage';
import { WalletPage } from '../pages/WalletPage';

export function ClientApp() {
  return (
    <BrowserRouter basename="/client">
      <Routes>
        <Route path="/" element={<AppLayout sidebar={<ClientSidebar />} />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="services" element={<SearchServicesPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="packages" element={<PackagesMembershipPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="loyalty" element={<LoyaltyRewardsPage />} />
          <Route path="history" element={<ServiceHistoryPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default ClientApp;
