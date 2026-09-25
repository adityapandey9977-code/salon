import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { TopNavLayout } from '@/shared/layouts/TopNavLayout/TopNavLayout';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { BranchProvider } from '../context/BranchContext';
import { TopNavbar } from '../layouts/TopNavbar/TopNavbar';
import '../styles/index.css';

import { AppointmentsPage } from '../pages/AppointmentsPage';
import { CreateInvoicePage } from '../pages/CreateInvoicePage';
import { CustomersPage } from '../pages/CustomersPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { RetailPage } from '../pages/RetailPage';
import { ServicesPage } from '../pages/ServicesPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TeamPage } from '../pages/TeamPage';
import { WalkinsPage } from '../pages/WalkinsPage';

export function App() {
  return (
    <BranchProvider>
      <BrowserRouter basename="/branch-manager">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute requiredPermission="panel.branch.access">
              <TopNavLayout navbar={<TopNavbar />} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route
            path="appointments"
            element={
              <ProtectedRoute requiredPermission="appointment.read">
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="operations"
            element={
              <ProtectedRoute requiredPermission="appointment.read">
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="operations/*"
            element={
              <ProtectedRoute requiredPermission="appointment.read">
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="walk-ins"
            element={
              <ProtectedRoute requiredPermission="appointment.read">
                <WalkinsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <ProtectedRoute requiredPermission="customer.read">
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="clients"
            element={
              <ProtectedRoute requiredPermission="customer.read">
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="services"
            element={
              <ProtectedRoute requiredPermission="commerce.read">
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="services/*"
            element={
              <ProtectedRoute requiredPermission="commerce.read">
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="catalogue"
            element={
              <ProtectedRoute requiredPermission="commerce.read">
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="catalogue/*"
            element={
              <ProtectedRoute requiredPermission="commerce.read">
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="team"
            element={
              <ProtectedRoute requiredPermission="staff.read">
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="team/*"
            element={
              <ProtectedRoute requiredPermission="staff.read">
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="staff"
            element={
              <ProtectedRoute requiredPermission="staff.read">
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="staff/*"
            element={
              <ProtectedRoute requiredPermission="staff.read">
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="retail"
            element={
              <ProtectedRoute requiredPermission="inventory.retail.read">
                <RetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="retail/*"
            element={
              <ProtectedRoute requiredPermission="inventory.retail.read">
                <RetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <ProtectedRoute requiredPermission="inventory.retail.read">
                <RetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory/*"
            element={
              <ProtectedRoute requiredPermission="inventory.retail.read">
                <RetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="payments"
            element={
              <ProtectedRoute requiredPermission="payment.read">
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="payments/new-invoice"
            element={
              <ProtectedRoute requiredPermission="payment.create">
                <CreateInvoicePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute requiredPermission="report.branch.read">
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports/*"
            element={
              <ProtectedRoute requiredPermission="report.branch.read">
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute requiredPermission="branch.settings.read">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings/*"
            element={
              <ProtectedRoute requiredPermission="branch.settings.read">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="audit-logs"
            element={
              <ProtectedRoute requiredPermission="branch.settings.read">
                <SettingsPage defaultTab="audit" />
              </ProtectedRoute>
            }
          />
          <Route
            path="audit-logs/*"
            element={
              <ProtectedRoute requiredPermission="branch.settings.read">
                <SettingsPage defaultTab="audit" />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </BranchProvider>
  );
}

export default App;
