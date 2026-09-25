import { AppLayout } from '@/shared/layouts/AppLayout/AppLayout';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { StylistSidebar } from '../layouts/Sidebar/Sidebar';

import { ClientsPage } from '../pages/ClientsPage';
import { ConsultationPage } from '../pages/ConsultationPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FormulasPage } from '../pages/FormulasPage';
import { NotesPage } from '../pages/NotesPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { PerformancePage } from '../pages/PerformancePage';
import { PhotosPage } from '../pages/PhotosPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { SchedulePage } from '../pages/SchedulePage';
import { ServicesPage } from '../pages/ServicesPage';

export function StylistApp() {
  return (
    <BrowserRouter basename="/stylist">
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['STYLIST', 'BRANCH_MANAGER', 'SALON_ADMIN', 'SUPER_ADMIN']} loginPath="/stylist/login" />}>
          <Route path="/" element={<AppLayout sidebar={<StylistSidebar />} />}>
          <Route index element={<DashboardPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="consultation" element={<ConsultationPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="formulas" element={<FormulasPage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default StylistApp;
