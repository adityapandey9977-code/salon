import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { AppLayout } from '@/shared/layouts/AppLayout/AppLayout';
import { Navigate, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router';
import { SuperAdminProvider, useSuperAdminStore } from '../context/SuperAdminContext';
import { Sidebar } from '../layouts/Sidebar/Sidebar';
import { AnnouncementsPage } from '../pages/AnnouncementsPage';
import { ApiKeysPage } from '../pages/ApiKeysPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { BillingPaymentsPage } from '../pages/BillingPaymentsPage';
import { CreateCustomRolePage } from '../pages/CreateCustomRolePage';
import { DashboardPage } from '../pages/DashboardPage';
import { FeatureFlagsPage } from '../pages/FeatureFlagsPage';
import { IntegrationsPage } from '../pages/IntegrationsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RolesPermissionsPage } from '../pages/RolesPermissionsPage';
import { SalonsPage } from '../pages/SalonsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SubscriptionPlansPage } from '../pages/SubscriptionPlansPage';
import { SuperAdminLoginPage } from '../pages/SuperAdminLoginPage';
import { SupportTicketsPage } from '../pages/SupportTicketsPage';
import { UsersPage } from '../pages/UsersPage';

function ModuleGuard({ path, children }: { path: string; children: React.ReactNode }) {
  const { canAccess } = useSuperAdminStore();
  if (!canAccess(path)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

const App = () => {
  return (
    <SuperAdminProvider>
      <BrowserRouter basename="/super-admin">
        <Routes>
          {/* Public Super Admin Login */}
          <Route path="login" element={<SuperAdminLoginPage />} />
          <Route path="/login" element={<SuperAdminLoginPage />} />

          {/* Protected Platform Operator Console */}
          <Route
            element={
              <ProtectedRoute
                allowedUserTypes={['PLATFORM']}
                allowedRoles={[
                  'SUPER_ADMIN',
                  'SUPPORT_OPERATOR',
                  'BILLING_SPECIALIST',
                  'SECURITY_AUDITOR',
                  'OPERATOR',
                  'SUPER ADMINISTRATOR',
                  'PLATFORM_ADMIN',
                ]}
                loginPath="/login"
              />
            }
          >
            <Route element={<AppLayout sidebar={<Sidebar />} />}>
              <Route index element={<DashboardPage />} />
              <Route path="/" element={<DashboardPage />} />
              <Route
                path="salons"
                element={
                  <ModuleGuard path="salons">
                    <SalonsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="subscription-plans"
                element={
                  <ModuleGuard path="subscription-plans">
                    <SubscriptionPlansPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="billing-payments"
                element={
                  <ModuleGuard path="billing-payments">
                    <BillingPaymentsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="users"
                element={
                  <ModuleGuard path="users">
                    <UsersPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="roles-permissions"
                element={
                  <ModuleGuard path="roles-permissions">
                    <RolesPermissionsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="roles-permissions/create"
                element={
                  <ModuleGuard path="roles-permissions">
                    <CreateCustomRolePage />
                  </ModuleGuard>
                }
              />
              <Route
                path="roles-permissions/edit/:roleId"
                element={
                  <ModuleGuard path="roles-permissions">
                    <CreateCustomRolePage />
                  </ModuleGuard>
                }
              />
              <Route
                path="support-tickets"
                element={
                  <ModuleGuard path="support-tickets">
                    <SupportTicketsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="announcements"
                element={
                  <ModuleGuard path="announcements">
                    <AnnouncementsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="notifications"
                element={
                  <ModuleGuard path="notifications">
                    <NotificationsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ModuleGuard path="audit-logs">
                    <AuditLogsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="integrations"
                element={
                  <ModuleGuard path="integrations">
                    <IntegrationsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="api-keys"
                element={
                  <ModuleGuard path="api-keys">
                    <ApiKeysPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="feature-flags"
                element={
                  <ModuleGuard path="feature-flags">
                    <FeatureFlagsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="settings"
                element={
                  <ModuleGuard path="settings">
                    <SettingsPage />
                  </ModuleGuard>
                }
              />
              <Route
                path="profile"
                element={<ProfilePage />}
              />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </SuperAdminProvider>
  );
};

export default App;
