import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { TopNavLayout } from '@/shared/layouts/TopNavLayout/TopNavLayout';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { TopNavbar } from '../layouts/TopNavbar/TopNavbar';
import '../styles/index.css';

import { AddBranchPage } from '../pages/AddBranchPage';
import { AddManagerPage } from '../pages/AddManagerPage';
import { AppointmentsAnalyticsPage } from '../pages/AppointmentsAnalyticsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { BranchAnalyticsPage } from '../pages/BranchAnalyticsPage';
import { BranchesPage } from '../pages/BranchesPage';
// Import all pages
import { DashboardPage } from '../pages/DashboardPage';
import { FinancePage } from '../pages/FinancePage';
import { FranchisePage } from '../pages/FranchisePage';
import { InventoryPage } from '../pages/InventoryPage';
import { ManagersPage } from '../pages/ManagersPage';
import { MarketingPage } from '../pages/MarketingPage';
import { MembershipsPage } from '../pages/MembershipsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { PackagesMembershipsPage } from '../pages/PackagesMembershipsPage';
import { PackagesPage } from '../pages/PackagesPage';
import { ReportsPage } from '../pages/ReportsPage';
import { RolesPermissionsPage } from '../pages/RolesPermissionsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { CatalogueMasterPage } from '../pages/catalogue/CatalogueMasterPage';
import { ClientProfilePage } from '../pages/clients/ClientProfilePage';
import { ClientsMasterPage } from '../pages/clients/ClientsMasterPage';
import { OperationsMasterPage } from '../pages/operations/OperationsMasterPage';
import { PackagesMasterPage } from '../pages/packages/PackagesMasterPage';
import { StaffMasterPage } from '../pages/staff/StaffMasterPage';
import { StaffProfilePage } from '../pages/staff/StaffProfilePage';
import { AdminProvider } from '../context/AdminContext';

export function App() {
  return (
    <AdminProvider>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['SALON_ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/" element={<TopNavLayout navbar={<TopNavbar />} />}>
          {/* 1. CORE */}
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="locations" element={<BranchesPage />} />
          <Route path="locations/all" element={<BranchesPage />} />
          <Route path="locations/performance" element={<BranchesPage />} />
          <Route path="locations/comparison" element={<BranchesPage />} />
          <Route path="locations/working-hours" element={<BranchesPage />} />
          <Route path="locations/holidays" element={<BranchesPage />} />
          <Route path="locations/new" element={<AddBranchPage />} />
          <Route path="locations/:id" element={<BranchAnalyticsPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="branches/new" element={<AddBranchPage />} />
          <Route path="branches/:id" element={<BranchAnalyticsPage />} />

          {/* 2. BUSINESS */}
          <Route path="catalogue" element={<CatalogueMasterPage />} />
          <Route path="catalogue/categories" element={<CatalogueMasterPage />} />
          <Route path="catalogue/services" element={<CatalogueMasterPage />} />
          <Route path="catalogue/pricing" element={<CatalogueMasterPage />} />
          <Route path="catalogue/skills" element={<CatalogueMasterPage />} />
          <Route path="catalogue/resources" element={<CatalogueMasterPage />} />
          <Route path="services-pricing" element={<CatalogueMasterPage />} />
          <Route path="services" element={<CatalogueMasterPage />} />
          <Route path="clients" element={<ClientsMasterPage />} />
          <Route path="clients/all" element={<ClientsMasterPage />} />
          <Route path="clients/segments" element={<ClientsMasterPage />} />
          <Route path="clients/retention" element={<ClientsMasterPage />} />
          <Route path="clients/inactive" element={<ClientsMasterPage />} />
          <Route path="clients/feedback" element={<ClientsMasterPage />} />
          <Route path="clients/tickets" element={<ClientsMasterPage />} />
          <Route path="clients/:id" element={<ClientProfilePage />} />
          <Route path="customers" element={<ClientsMasterPage />} />
          <Route path="staff" element={<StaffMasterPage />} />
          <Route path="staff/all" element={<StaffMasterPage />} />
          <Route path="staff/performance" element={<StaffMasterPage />} />
          <Route path="staff/roster" element={<StaffMasterPage />} />
          <Route path="staff/attendance" element={<StaffMasterPage />} />
          <Route path="staff/targets" element={<StaffMasterPage />} />
          <Route path="staff/commission" element={<StaffMasterPage />} />
          <Route path="staff/productivity" element={<StaffMasterPage />} />
          <Route path="staff/:id" element={<StaffProfilePage />} />
          <Route path="managers" element={<StaffMasterPage />} />
          <Route path="managers/new" element={<AddManagerPage />} />
          <Route path="operations" element={<OperationsMasterPage />} />
          <Route path="operations/calendar" element={<OperationsMasterPage />} />
          <Route path="operations/appointments" element={<OperationsMasterPage />} />
          <Route path="operations/queue" element={<OperationsMasterPage />} />
          <Route path="operations/availability" element={<OperationsMasterPage />} />
          <Route path="operations/delivery" element={<OperationsMasterPage />} />
          <Route path="operations/homeservice" element={<OperationsMasterPage />} />
          <Route path="operations/overview" element={<OperationsMasterPage />} />
          <Route path="appointments" element={<OperationsMasterPage />} />
          <Route path="appointments-analytics" element={<OperationsMasterPage />} />
          <Route path="walkins" element={<OperationsMasterPage />} />

          {/* 3. COMMERCIAL */}
          <Route path="packages-memberships" element={<PackagesMasterPage />} />
          <Route path="packages-memberships/packages" element={<PackagesMasterPage />} />
          <Route path="packages-memberships/usage" element={<PackagesMasterPage />} />
          <Route path="packages-memberships/memberships" element={<PackagesMasterPage />} />
          <Route path="packages-memberships/benefits" element={<PackagesMasterPage />} />
          <Route path="packages-memberships/renewals" element={<PackagesMasterPage />} />
          <Route path="packages" element={<PackagesMasterPage />} />
          <Route path="packages/usage" element={<PackagesMasterPage />} />
          <Route path="memberships" element={<PackagesMasterPage />} />
          <Route path="memberships/benefits" element={<PackagesMasterPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="finance/overview" element={<FinancePage />} />
          <Route path="finance/revenue-collections" element={<FinancePage />} />
          <Route path="finance/transactions" element={<FinancePage />} />
          <Route path="finance/refunds" element={<FinancePage />} />
          <Route path="finance/commissions" element={<FinancePage />} />
          <Route path="finance/settlements" element={<FinancePage />} />
          <Route path="finance/profitability" element={<FinancePage />} />
          <Route path="finance/tax" element={<FinancePage />} />
          <Route path="finance/alerts" element={<FinancePage />} />
          <Route path="finance/reports" element={<FinancePage />} />
          <Route path="payments" element={<FinancePage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/overview" element={<InventoryPage />} />
          <Route path="inventory/products" element={<InventoryPage />} />
          <Route path="inventory/stock" element={<InventoryPage />} />
          <Route path="inventory/procurement" element={<InventoryPage />} />
          <Route path="inventory/transfers" element={<InventoryPage />} />
          <Route path="inventory/consumption" element={<InventoryPage />} />
          <Route path="inventory/stocktake" element={<InventoryPage />} />
          <Route path="inventory/reports" element={<InventoryPage />} />
          {/* MARKETING */}
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="marketing/overview" element={<MarketingPage />} />
          <Route path="marketing/campaigns" element={<MarketingPage />} />
          <Route path="marketing/promotions" element={<MarketingPage />} />
          <Route path="marketing/loyalty" element={<MarketingPage />} />
          <Route path="marketing/reports" element={<MarketingPage />} />

          {/* 4. NETWORK / FRANCHISE */}
          <Route path="franchise" element={<FranchisePage />} />
          <Route path="franchise/overview" element={<FranchisePage />} />
          <Route path="franchise/partners" element={<FranchisePage />} />
          <Route path="franchise/locations" element={<FranchisePage />} />
          <Route path="franchise/agreements" element={<FranchisePage />} />
          <Route path="franchise/royalties" element={<FranchisePage />} />
          <Route path="franchise/reports" element={<FranchisePage />} />

          {/* 5. ANALYTICS */}
          <Route path="reports-analytics" element={<ReportsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/overview" element={<ReportsPage />} />
          <Route path="reports/operations" element={<ReportsPage />} />
          <Route path="reports/revenue" element={<ReportsPage />} />
          <Route path="reports/staff" element={<ReportsPage />} />
          <Route path="reports/clients" element={<ReportsPage />} />
          <Route path="reports/inventory" element={<ReportsPage />} />
          <Route path="reports/marketing" element={<ReportsPage />} />
          <Route path="reports/franchise" element={<ReportsPage />} />
          <Route path="reports/custom" element={<ReportsPage />} />

          {/* 6. ADMINISTRATION */}
          <Route path="brand-settings" element={<SettingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="brand-settings/profile" element={<SettingsPage />} />
          <Route path="brand-settings/locations" element={<SettingsPage />} />
          <Route path="brand-settings/pricing" element={<SettingsPage />} />
          <Route path="brand-settings/policies" element={<SettingsPage />} />
          <Route path="brand-settings/hours" element={<SettingsPage />} />
          <Route path="brand-settings/roles" element={<SettingsPage />} />
          <Route path="brand-settings/controls" element={<SettingsPage />} />
          <Route path="brand-settings/audit" element={<SettingsPage />} />
          <Route path="roles-permissions" element={<RolesPermissionsPage />} />
          <Route path="roles" element={<RolesPermissionsPage />} />
          <Route path="roles-permissions/roles" element={<RolesPermissionsPage />} />
          <Route path="roles-permissions/matrix" element={<RolesPermissionsPage />} />
          <Route path="roles-permissions/assignments" element={<RolesPermissionsPage />} />
          <Route path="roles-permissions/history" element={<RolesPermissionsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notifications/:id" element={<NotificationsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
