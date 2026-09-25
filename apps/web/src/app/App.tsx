import React, { Component, Suspense, lazy } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { LoginPage } from '../shared/components/LoginPage';

// Robust lazy-loader with auto-retry on network/HMR blips or stale Vite chunks
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 3,
  interval = 500,
) {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (remaining: number) => {
        factory()
          .then(resolve)
          .catch((error) => {
            if (remaining <= 0) {
              const hasReloaded = sessionStorage.getItem('chunk_retry_reload');
              if (!hasReloaded) {
                sessionStorage.setItem('chunk_retry_reload', 'true');
                window.location.reload();
                return;
              }
              sessionStorage.removeItem('chunk_retry_reload');
              reject(error);
              return;
            }
            setTimeout(() => attempt(remaining - 1), interval);
          });
      };
      attempt(retries);
    }),
  );
}

// Module-level Error Boundary to catch uncaught module loading or runtime failures
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portal ErrorBoundary caught module load error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full rounded-2xl bg-white p-6 shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 text-[#5A2EA6] flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h2 className="text-lg font-bold text-slate-800">Connection Interrupted</h2>
            <p className="text-xs text-slate-500">
              A module could not be loaded due to a temporary dev server response timeout. Click below to reload.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#5A2EA6] text-white text-xs font-bold rounded-xl shadow hover:bg-[#482487] transition-all cursor-pointer"
            >
              Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const FranchiseLoginPage = lazyWithRetry(() =>
  import('../modules/franchise/pages/FranchiseLoginPage').then((m) => ({
    default: m.FranchiseLoginPage,
  })),
);
const SuperAdminLoginPage = lazyWithRetry(() =>
  import('../modules/super-admin/pages/SuperAdminLoginPage').then((m) => ({
    default: m.SuperAdminLoginPage,
  })),
);

// Code-split all module apps so login and routes load instantaneously without bundling all 9 portals
const AdminApp = lazyWithRetry(() => import('../modules/admin/app/App'));
const BranchManagerApp = lazyWithRetry(() => import('../modules/branchManager/app/App'));
const CallCenterApp = lazyWithRetry(() => import('../modules/call-center/app/App'));
const ClientApp = lazyWithRetry(() => import('../modules/client/app/App'));
const FinanceApp = lazyWithRetry(() => import('../modules/finance/app/App'));
const FranchiseApp = lazyWithRetry(() => import('../modules/franchise/app/App'));
const InventoryApp = lazyWithRetry(() => import('../modules/inventory/app/App'));
const StylistApp = lazyWithRetry(() => import('../modules/stylist/app/App'));
const SuperAdminApp = lazyWithRetry(() => import('../modules/super-admin/app/App'));
const SalonLandingPage = lazyWithRetry(() =>
  import('../modules/landing/components/SalonLandingPage').then((m) => ({
    default: m.SalonLandingPage,
  })),
);

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
      <span className="text-xs font-semibold text-slate-500">Loading module...</span>
    </div>
  </div>
);

const App = () => {
  const path = window.location.pathname;

  // Login pages load directly with zero delay
  if (
    path === '/franchise/login' ||
    path.startsWith('/franchise-login') ||
    path === '/franchise/login/'
  ) {
    return (
      <Suspense fallback={<PageLoader />}>
        <FranchiseLoginPage />
      </Suspense>
    );
  }

  if (
    path === '/login' ||
    path === '/login/' ||
    path === '/admin/login' ||
    path === '/admin/login/' ||
    path.startsWith('/stylist-login') ||
    path === '/stylist/login' ||
    path === '/stylist/login/'
  ) {
    return <LoginPage />;
  }

  if (
    path.startsWith('/branch-login') ||
    path.startsWith('/branch-manager-login') ||
    path === '/branch-manager/login' ||
    path === '/branch-manager/login/'
  ) {
    return <LoginPage />;
  }

  if (
    path.startsWith('/inventory-login') ||
    path === '/inventory/login' ||
    path === '/inventory/login/'
  ) {
    return <LoginPage />;
  }

  if (
    path.startsWith('/finance-login') ||
    path === '/finance/login' ||
    path === '/finance/login/'
  ) {
    return <LoginPage />;
  }

  if (
    path.startsWith('/call-center-login') ||
    path === '/call-center/login' ||
    path === '/call-center/login/'
  ) {
    return <LoginPage />;
  }

  if (path.startsWith('/superadmin-login') || path === '/super-admin-login') {
    return (
      <Suspense fallback={<PageLoader />}>
        <SuperAdminLoginPage />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        {path.startsWith('/super-admin') && <SuperAdminApp />}
        {path.startsWith('/admin') && <AdminApp />}
        {path.startsWith('/branch-manager') && <BranchManagerApp />}
        {path.startsWith('/stylist') && <StylistApp />}
        {path.startsWith('/call-center') && <CallCenterApp />}
        {path.startsWith('/inventory') && <InventoryApp />}
        {path.startsWith('/client') && <ClientApp />}
        {path.startsWith('/franchise') && <FranchiseApp />}
        {path.startsWith('/finance') && <FinanceApp />}
        {!path.startsWith('/super-admin') &&
          !path.startsWith('/admin') &&
          !path.startsWith('/branch-manager') &&
          !path.startsWith('/stylist') &&
          !path.startsWith('/call-center') &&
          !path.startsWith('/inventory') &&
          !path.startsWith('/client') &&
          !path.startsWith('/franchise') &&
          !path.startsWith('/finance') && <SalonLandingPage />}
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
