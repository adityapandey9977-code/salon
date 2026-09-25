import { AppLayout } from '@/shared/layouts/AppLayout/AppLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { FranchiseSidebar } from '../layouts/Sidebar/Sidebar';

import { AnnouncementsPage } from '../pages/AnnouncementsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { CataloguePage } from '../pages/CataloguePage';
import { CompliancePage } from '../pages/CompliancePage';
import { CustomersPage } from '../pages/CustomersPage';
import { DashboardPage } from '../pages/DashboardPage';
import { DocumentsPage } from '../pages/DocumentsPage';
import { FinancePage } from '../pages/FinancePage';
import { FranchiseFeesPage } from '../pages/FranchiseFeesPage';
import { InventorySummaryPage } from '../pages/InventorySummaryPage';
import { MyFranchisePage } from '../pages/MyFranchisePage';
import { MyLocationsPage } from '../pages/MyLocationsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { PerformancePage } from '../pages/PerformancePage';
import { ProfilePage } from '../pages/ProfilePage';
import { SalesSummaryPage } from '../pages/SalesSummaryPage';
import { StaffOverviewPage } from '../pages/StaffOverviewPage';
import { SupportPage } from '../pages/SupportPage';

export function FranchiseApp() {
  return (
    <BrowserRouter basename="/franchise">
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['FRANCHISE_OWNER', 'SUPER_ADMIN']} loginPath="/franchise/login" />}>
          <Route path="/" element={<AppLayout sidebar={<FranchiseSidebar />} />}>
            <Route index element={<DashboardPage />} />
            <Route path="my-franchise" element={<MyFranchisePage />} />
            <Route path="locations" element={<MyLocationsPage />} />
            <Route path="catalogue" element={<CataloguePage />} />
            <Route path="catalogue/*" element={<CataloguePage />} />
            <Route path="staff" element={<StaffOverviewPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="sales" element={<SalesSummaryPage />} />
            <Route path="inventory" element={<InventorySummaryPage />} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="fees" element={<FranchiseFeesPage />} />
            <Route path="performance" element={<PerformancePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default FranchiseApp;
