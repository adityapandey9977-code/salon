import {
  AlertTriangle,
  ArrowLeft,
  Crown,
  KeyRound,
  LogOut,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export interface ProtectedRouteProps {
  allowedRoles?: string[];
  allowedUserTypes?: ('PLATFORM' | 'TENANT' | 'CUSTOMER')[];
  requiredPermission?: string;
  loginPath?: string;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  allowedUserTypes,
  requiredPermission,
  loginPath,
  children,
}) => {
  const { isAuthenticated, isLoading, user, logout, hasPermission } = useAuth();
  const location = useLocation();

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF8FC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center font-serif font-bold text-2xl shadow-lg shadow-[#5A2EA6]/25 animate-pulse mb-4">
          S
        </div>
        <h3 className="font-serif font-bold text-ink text-base">Verifying Security Session</h3>
        <p className="text-xs text-soft mt-1">Authenticating RBAC authority with API Gateway...</p>
      </div>
    );
  }

  // 2. Unauthenticated State -> Redirect to Login with safe path (no infinite loops)
  if (!isAuthenticated) {
    const baseLogin = loginPath || '/login';
    const currentFullPath = window.location.pathname;

    if (
      currentFullPath === baseLogin ||
      currentFullPath.endsWith('/login') ||
      currentFullPath.startsWith('/login')
    ) {
      return null;
    }

    const cleanPath = currentFullPath;
    const redirectUrl =
      cleanPath && cleanPath !== '/' && !cleanPath.includes('/login')
        ? `${baseLogin}?redirect=${encodeURIComponent(cleanPath)}`
        : baseLogin;

    // Use full-page navigation so we break out of the sub-router's basename
    window.location.replace(redirectUrl);
    return null;
  }

  // 3. Role & Permission Authorization Check
  if (user) {
    const userRoleCodes = [...user.roles.map((r) => r.code), ...(user.role ? [user.role] : [])];
    if (userRoleCodes.includes('TENANT_ADMIN') && !userRoleCodes.includes('SALON_ADMIN')) {
      userRoleCodes.push('SALON_ADMIN');
    }
    if (userRoleCodes.includes('SALON_ADMIN') && !userRoleCodes.includes('TENANT_ADMIN')) {
      userRoleCodes.push('TENANT_ADMIN');
    }
    const isSuperAdmin =
      (user.userType === 'PLATFORM' || Boolean(user.email?.includes('superadmin'))) &&
      (userRoleCodes.includes('SUPER_ADMIN') ||
        userRoleCodes.includes('SUPPORT_OPERATOR') ||
        userRoleCodes.includes('SECURITY_AUDITOR') ||
        user.role === 'SUPER_ADMIN' ||
        Boolean(user.email?.includes('superadmin')));

    const isTenantOrBranchUser =
      !isSuperAdmin && (
        user.userType === 'TENANT' ||
        userRoleCodes.includes('BRANCH_MANAGER') ||
        userRoleCodes.includes('TENANT_ADMIN') ||
        userRoleCodes.includes('SALON_ADMIN') ||
        Boolean(user.tenantId)
      );

    const isPlatformConsole =
      allowedUserTypes?.includes('PLATFORM') ||
      location.pathname.startsWith('/super-admin');

    // Super Admin & Tenant Admin have universal access within their respective domain
    const hasRoleMatch =
      !allowedRoles ||
      allowedRoles.length === 0 ||
      isSuperAdmin ||
      (!isPlatformConsole && allowedRoles.some((role) => userRoleCodes.includes(role))) ||
      (isPlatformConsole && !isTenantOrBranchUser && allowedRoles.some((role) => userRoleCodes.includes(role)));

    const hasUserTypeMatch =
      !allowedUserTypes ||
      allowedUserTypes.length === 0 ||
      (allowedUserTypes.includes('PLATFORM') && isTenantOrBranchUser
        ? false
        : isSuperAdmin ||
          (user.userType ? allowedUserTypes.includes(user.userType) : true));

    const hasPermissionMatch =
      !requiredPermission ||
      isSuperAdmin ||
      (!isPlatformConsole && (userRoleCodes.includes('TENANT_ADMIN') || userRoleCodes.includes('SALON_ADMIN'))) ||
      hasPermission(requiredPermission);

    if (!hasRoleMatch || !hasUserTypeMatch || !hasPermissionMatch) {
      return (
        <div className="min-h-screen w-full bg-[#140b1e] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-md w-full rounded-3xl bg-[#1f122e] border border-rose-500/30 p-8 shadow-2xl relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 block mb-1">
              403 · Access Restricted
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">
              Unauthorized Workspace
            </h2>
            <p className="text-xs text-white/70 leading-relaxed mb-6">
              Your current account (<span className="text-white font-semibold">{user.email}</span>)
              does not have authorization to access this workspace.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left mb-6 space-y-1.5 text-xs">
              <div className="flex justify-between text-white/60 text-[11px]">
                <span>Assigned Roles:</span>
                <span className="text-[#e6c594] font-semibold">
                  {userRoleCodes.join(', ') || 'None'}
                </span>
              </div>
              {allowedRoles && allowedRoles.length > 0 && (
                <div className="flex justify-between text-white/60 text-[11px]">
                  <span>Required Roles:</span>
                  <span className="text-rose-300 font-semibold">
                    {allowedRoles.join(', ')}
                  </span>
                </div>
              )}
              {requiredPermission && (
                <div className="flex justify-between text-white/60 text-[11px]">
                  <span>Required Capability:</span>
                  <span className="text-rose-300 font-semibold font-mono text-[10px]">
                    {requiredPermission}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (isSuperAdmin) {
                    window.location.href = '/super-admin';
                  } else if (userRoleCodes.includes('FRANCHISE_OWNER') || Boolean(user.franchiseId)) {
                    window.location.href = '/franchise';
                  } else if (userRoleCodes.includes('INVENTORY_MANAGER')) {
                    window.location.href = '/inventory';
                  } else if (userRoleCodes.includes('FINANCE_HR')) {
                    window.location.href = '/finance';
                  } else if (userRoleCodes.includes('CALL_CENTER_AGENT')) {
                    window.location.href = '/call-center';
                  } else if (userRoleCodes.includes('STYLIST')) {
                    window.location.href = '/stylist';
                  } else if (userRoleCodes.includes('BRANCH_MANAGER')) {
                    window.location.href = '/branch-manager';
                  } else if (userRoleCodes.includes('TENANT_ADMIN') || userRoleCodes.includes('SALON_ADMIN')) {
                    window.location.href = '/admin';
                  } else {
                    window.location.href = '/login';
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e6c594] to-[#dfa0a0] text-[#140d1a] font-bold text-xs hover:brightness-110 transition cursor-pointer"
              >
                Go to My Authorized Portal →
              </button>

              <button
                type="button"
                onClick={() => {
                  logout().then(() => {
                    window.location.href = '/login';
                  });
                }}
                className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Account / Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // 4. Authorized -> Render children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
