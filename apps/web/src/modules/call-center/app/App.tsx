import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastProvider } from '@salon-spa-saas/ui';
import { AppLayout } from '@/shared/layouts/AppLayout/AppLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { CallCenterSidebar } from '../layouts/Sidebar/Sidebar';
import { CallCenterBranchProvider } from '../context/CallCenterBranchContext';
import { CallCenterMainLayout } from '../layouts/CallCenterMainLayout';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { CallLogsPage } from '../pages/CallLogsPage';
import { ConfirmationsPage } from '../pages/ConfirmationsPage';
import { CustomersPage } from '../pages/CustomersPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FollowUpCenterPage } from '../pages/FollowUpCenterPage';
import { LeadsPage } from '../pages/LeadsPage';
import { LostClientRecoveryPage } from '../pages/LostClientRecoveryPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SalesPackagesPage } from '../pages/SalesPackagesPage';
import { SupportTicketsPage } from '../pages/SupportTicketsPage';
import { TasksPage } from '../pages/TasksPage';


export function CallCenterApp() {
  return (
    <ToastProvider>
      <CallCenterBranchProvider>
        <BrowserRouter basename="/call-center">
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['CALL_CENTER_AGENT', 'TENANT_ADMIN', 'SALON_ADMIN']} loginPath="/call-center/login" />}>
              <Route path="/" element={<AppLayout sidebar={<CallCenterSidebar />} />}>
                <Route element={<CallCenterMainLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="leads" element={<LeadsPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="confirmations" element={<ConfirmationsPage />} />
                  <Route path="call-logs" element={<CallLogsPage />} />
                  <Route path="tickets" element={<SupportTicketsPage />} />
                  <Route path="sales-packages" element={<SalesPackagesPage />} />
                  <Route path="follow-ups" element={<FollowUpCenterPage />} />
                  <Route path="recovery" element={<LostClientRecoveryPage />} />
                  <Route path="tasks" element={<TasksPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CallCenterBranchProvider>
    </ToastProvider>
  );
}

export default CallCenterApp;
