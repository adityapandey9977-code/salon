import { AppLayout } from '@/shared/layouts/AppLayout/AppLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { FinanceBranchProvider } from '../context/FinanceBranchContext';
import { FinanceSidebar } from '../layouts/Sidebar/Sidebar';

import { AttendanceLeavePage } from '../pages/AttendanceLeavePage';
import { CommissionsPage } from '../pages/CommissionsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeFinancePage } from '../pages/EmployeeFinancePage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { PayrollExportPage } from '../pages/PayrollExportPage';
import { PayrollPage } from '../pages/PayrollPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProfitabilityPage } from '../pages/ProfitabilityPage';
import { ReceiptsPage } from '../pages/ReceiptsPage';
import { RefundsPage } from '../pages/RefundsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SettlementsPage } from '../pages/SettlementsPage';

export function FinanceApp() {
  return (
    <FinanceBranchProvider>
      <BrowserRouter basename="/finance">
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['FINANCE_HR', 'TENANT_ADMIN', 'SALON_ADMIN']} loginPath="/finance/login" />}>
            <Route path="/" element={<AppLayout sidebar={<FinanceSidebar />} />}>
            <Route index element={<DashboardPage />} />
            <Route path="receipts" element={<ReceiptsPage />} />
            <Route path="refunds" element={<RefundsPage />} />
            <Route path="settlements" element={<SettlementsPage />} />
            <Route path="commissions" element={<CommissionsPage />} />
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="payroll-export" element={<PayrollExportPage />} />
            <Route path="profitability" element={<ProfitabilityPage />} />
            <Route path="employee-finance" element={<EmployeeFinancePage />} />
            <Route path="attendance-leave" element={<AttendanceLeavePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceBranchProvider>
  );
}

export default FinanceApp;
