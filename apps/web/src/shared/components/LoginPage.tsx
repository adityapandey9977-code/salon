import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Crown,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Store,
  UserCheck,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { staffApi } from '../api/staff.api';
import { tenantsApi } from '../api/tenants.api';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, isLoading, isAuthenticated, user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const redirectPath = searchParams.get('redirect') || '/admin';
  const isBranchLoginMode =
    window.location.pathname.startsWith('/branch-login') ||
    window.location.pathname.startsWith('/branch-manager') ||
    redirectPath.includes('branch-manager') ||
    searchParams.get('mode') === 'branch';

  const isAdminLoginMode =
    window.location.pathname.startsWith('/admin/login') ||
    window.location.pathname.startsWith('/admin-login') ||
    redirectPath.includes('admin') ||
    searchParams.get('mode') === 'admin';

  const isStylistLoginMode =
    window.location.pathname.startsWith('/stylist-login') ||
    window.location.pathname.startsWith('/stylist') ||
    redirectPath.includes('stylist') ||
    searchParams.get('mode') === 'stylist';

  const isInventoryLoginMode =
    window.location.pathname.startsWith('/inventory-login') ||
    window.location.pathname.startsWith('/inventory') ||
    redirectPath.includes('inventory') ||
    searchParams.get('mode') === 'inventory';

  const isFinanceLoginMode =
    window.location.pathname.startsWith('/finance-login') ||
    window.location.pathname.startsWith('/finance') ||
    redirectPath.includes('finance') ||
    searchParams.get('mode') === 'finance';

  const isCallCenterLoginMode =
    window.location.pathname.startsWith('/call-center-login') ||
    window.location.pathname.startsWith('/call-center') ||
    redirectPath.includes('call-center') ||
    searchParams.get('mode') === 'call_center';

  const [assignedBranch, setAssignedBranch] = useState<{
    id: string;
    name: string;
    code: string;
    city: string;
    workingHours?: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    let isMounted = true;

    // Platform Super Admin never has an outlet branch assigned
    const isUserSuperAdmin =
      user.userType === 'PLATFORM' ||
      user.roles?.some((r) => r.code === 'SUPER_ADMIN' || r.code === 'SUPER ADMINISTRATOR') ||
      user.email?.toLowerCase().includes('superadmin');
    if (isUserSuperAdmin) return;

    const resolveAssignedBranch = async () => {
      try {
        let branchId = user.branchIds?.[0];
        if (!branchId) {
          try {
            const staff = await staffApi.getMe();
            if (staff?.primaryBranchId) {
              branchId = staff.primaryBranchId;
            }
          } catch {
            // Non-staff or unlinked profile
          }
        }

        const branches = await tenantsApi.listBranches();
        if (!isMounted) return;

        let matched = null;
        if (branchId) {
          matched = branches.find((b: any) => b.id === branchId);
        }
        if (!matched && user.email) {
          matched = branches.find(
            (b: any) =>
              b.managerEmail?.toLowerCase() === user.email.toLowerCase() ||
              b.email?.toLowerCase() === user.email.toLowerCase(),
          );
        }
        if (!matched && branches.length > 0 && user.roles.some((r) => r.code === 'BRANCH_MANAGER')) {
          matched = branches[0];
        }

        if (matched) {
          setAssignedBranch({
            id: matched.id,
            name: matched.name,
            code: matched.code,
            city: matched.city,
            workingHours: matched.workingHours || '09:00 AM - 09:00 PM',
          });
        }
      } catch (err) {
        console.warn('Could not resolve assigned branch on login page:', err);
      }
    };

    resolveAssignedBranch();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  const handleQuickLogin = (
    roleType: 'super_admin' | 'salon_admin' | 'branch_manager' | 'franchise_partner' | 'stylist' | 'inventory_manager' | 'finance_hr' | 'call_center',
  ) => {
    if (roleType === 'super_admin') {
      setEmail('superadmin@digiflex.com');
      setPassword('SuperAdmin@123!');
      setTenantId('');
    } else if (roleType === 'salon_admin') {
      setEmail('owner@glamour-salon.com');
      setPassword('SalonAdmin@123!');
      setTenantId('f77a407a-45c1-4b8a-a08d-703bf7eeaea5');
    } else if (roleType === 'branch_manager') {
      setEmail('manager@glamour-salon.com');
      setPassword('SuperAdmin@123!');
      setTenantId('f77a407a-45c1-4b8a-a08d-703bf7eeaea5');
    } else if (roleType === 'stylist') {
      setEmail('stylist@salon.com');
      setPassword('SuperAdmin@123!');
      setTenantId('f77a407a-45c1-4b8a-a08d-703bf7eeaea5');
    } else if (roleType === 'inventory_manager') {
      setEmail('inventory@salon.com');
      setPassword('SuperAdmin@123!');
      setTenantId('f77a407a-45c1-4b8a-a08d-703bf7eeaea5');
    } else if (roleType === 'finance_hr') {
      setEmail('finance@salon.com');
      setPassword('SuperAdmin@123!');
      setTenantId('f77a407a-45c1-4b8a-a08d-703bf7eeaea5');
    } else if (roleType === 'call_center') {
      setEmail('agent@salon.com');
      setPassword('SuperAdmin@123!');
      setTenantId('f77a407a-45c1-4b8a-a08d-703bf7eeaea5');
    } else {
      setEmail('sanjay.chawla@apexwellness.in');
      setPassword('Franchise@2026!');
      setTenantId('f77a407a-45c1-4b8a-a08d-703bf7eeaea5');
    }
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanTenantId = tenantId.trim();

    try {
      const res = await login({
        email: cleanEmail,
        password: cleanPassword,
        tenantId: cleanTenantId ? cleanTenantId : undefined,
      });

      if (res.requiresMfa) {
        setSuccessMsg('MFA challenge required. Please verify code.');
        return;
      }

      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        // Redirect to appropriate dashboard based on user roles or requested redirect
        const userType = res.user?.userType;
        const roles: string[] = (res.user?.roles || []).map((r: any) =>
          typeof r === 'string' ? r : r.code || r.id,
        );
        if (res.user?.role) roles.push(res.user.role);

        // 1. Super Admin takes absolute top priority (Platform Scope)
        const isSuperAdmin =
          userType === 'PLATFORM' ||
          roles.includes('SUPER_ADMIN') ||
          roles.includes('SUPER ADMINISTRATOR') ||
          roles.includes('SUPPORT_OPERATOR') ||
          roles.includes('SECURITY_AUDITOR') ||
          res.user?.role === 'SUPER_ADMIN';

        // 2. Franchise Partner (Franchise Territory Scope)
        const isFranchise =
          !isSuperAdmin &&
          (roles.includes('FRANCHISE_OWNER') ||
            res.user?.role === 'FRANCHISE_OWNER' ||
            Boolean(res.user?.franchiseId) ||
            redirectPath.includes('franchise'));

        // 3. Inventory Scope
        const isInventory =
          !isSuperAdmin &&
          !isFranchise &&
          (roles.includes('INVENTORY_MANAGER') ||
            res.user?.role === 'INVENTORY_MANAGER' ||
            isInventoryLoginMode ||
            redirectPath.includes('inventory'));

        // 4. Finance Scope
        const isFinance =
          !isSuperAdmin &&
          !isFranchise &&
          (roles.includes('FINANCE_HR') ||
            res.user?.role === 'FINANCE_HR' ||
            isFinanceLoginMode ||
            redirectPath.includes('finance'));

        // 5. Call Center Scope
        const isCallCenter =
          !isSuperAdmin &&
          !isFranchise &&
          (roles.includes('CALL_CENTER_AGENT') ||
            res.user?.role === 'CALL_CENTER_AGENT' ||
            isCallCenterLoginMode ||
            redirectPath.includes('call-center'));

        // 6. Stylist Scope
        const isStylist =
          !isSuperAdmin &&
          !isFranchise &&
          (roles.includes('STYLIST') ||
            res.user?.role === 'STYLIST' ||
            isStylistLoginMode ||
            redirectPath.includes('stylist'));

        // 7. Branch Manager (Single Outlet Branch Scope)
        const isBranchManager =
          !isSuperAdmin &&
          !isFranchise &&
          !isInventory &&
          !isFinance &&
          !isCallCenter &&
          !isStylist &&
          (roles.includes('BRANCH_MANAGER') ||
            res.user?.role === 'BRANCH_MANAGER' ||
            isBranchLoginMode ||
            redirectPath.includes('branch-manager'));

        if (isSuperAdmin) {
          window.location.href = redirectPath.startsWith('/super-admin') ? redirectPath : '/super-admin';
        } else if (isFranchise) {
          window.location.href = redirectPath.startsWith('/franchise') ? redirectPath : '/franchise';
        } else if (isInventory) {
          window.location.href = redirectPath.startsWith('/inventory') ? redirectPath : '/inventory';
        } else if (isFinance) {
          window.location.href = redirectPath.startsWith('/finance') ? redirectPath : '/finance';
        } else if (isCallCenter) {
          window.location.href = redirectPath.startsWith('/call-center') ? redirectPath : '/call-center';
        } else if (isStylist) {
          window.location.href = redirectPath.startsWith('/stylist') ? redirectPath : '/stylist';
        } else if (isBranchManager) {
          window.location.href = redirectPath.startsWith('/branch-manager') ? redirectPath : '/branch-manager';
        } else {
          window.location.href = redirectPath.startsWith('/admin/login') || redirectPath === '/' ? '/admin' : redirectPath;
        }
      }, 500);
    } catch (err: any) {
      console.warn('Backend login failed, checking fallback mode:', err);
      const apiMsg = err.response?.data?.error?.message || err.message;

      // Allow offline development bypass if backend is not running
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMsg('API Gateway is offline or unreachable. Starting in Local Demo Auth Mode...');
        setTimeout(() => {
          if (email.includes('superadmin')) {
            window.location.href = '/super-admin';
          } else if (email.includes('franchise') || email.includes('apexwellness')) {
            window.location.href = '/franchise';
          } else if (email.includes('manager') || isBranchLoginMode) {
            window.location.href = '/branch-manager';
          } else if (email.includes('stylist') || isStylistLoginMode) {
            window.location.href = '/stylist';
          } else if (email.includes('inventory') || isInventoryLoginMode) {
            window.location.href = '/inventory';
          } else if (email.includes('finance') || isFinanceLoginMode) {
            window.location.href = '/finance';
          } else if (email.includes('agent') || isCallCenterLoginMode) {
            window.location.href = '/call-center';
          } else {
            window.location.href = '/admin';
          }
        }, 800);
      } else {
        setErrorMsg(apiMsg || 'Invalid email or password. Please try again.');
      }
    }
  };

  const isUserSuperAdmin =
    user?.userType === 'PLATFORM' ||
    user?.roles?.some((r) => r.code === 'SUPER_ADMIN' || r.code === 'SUPER ADMINISTRATOR') ||
    user?.role === 'SUPER_ADMIN' ||
    user?.email?.toLowerCase().includes('superadmin');

  const isInventoryUser =
    !isUserSuperAdmin &&
    (user?.roles?.some((r) => r.code === 'INVENTORY_MANAGER') || user?.role === 'INVENTORY_MANAGER');

  const isFinanceUser =
    !isUserSuperAdmin &&
    (user?.roles?.some((r) => r.code === 'FINANCE_HR') || user?.role === 'FINANCE_HR');

  const isCallCenterUser =
    !isUserSuperAdmin &&
    (user?.roles?.some((r) => r.code === 'CALL_CENTER_AGENT') || user?.role === 'CALL_CENTER_AGENT');

  const isStylistUser =
    !isUserSuperAdmin &&
    (user?.roles?.some((r) => r.code === 'STYLIST') || user?.role === 'STYLIST');

  const isBranchUser =
    !isUserSuperAdmin &&
    !isInventoryUser &&
    !isFinanceUser &&
    !isCallCenterUser &&
    !isStylistUser &&
    (user?.roles?.some((r) => r.code === 'BRANCH_MANAGER') || user?.role === 'BRANCH_MANAGER');

  const getUserTargetPortal = () => {
    if (!user) return '/admin';
    const roleCodes = [...(user.roles || []).map((r: any) => (typeof r === 'string' ? r : r.code || r.id)), ...(user.role ? [user.role] : [])];
    if (isUserSuperAdmin || roleCodes.includes('SUPER_ADMIN')) return '/super-admin';
    if (roleCodes.includes('FRANCHISE_OWNER') || Boolean(user.franchiseId)) return '/franchise';
    if (roleCodes.includes('INVENTORY_MANAGER')) return '/inventory';
    if (roleCodes.includes('FINANCE_HR')) return '/finance';
    if (roleCodes.includes('CALL_CENTER_AGENT')) return '/call-center';
    if (roleCodes.includes('STYLIST')) return '/stylist';
    if (roleCodes.includes('BRANCH_MANAGER')) return '/branch-manager';
    return '/admin';
  };

  return (
    <div className="min-h-screen w-full bg-[#12081f] bg-gradient-to-br from-[#180d29] via-[#12081f] to-[#0a0412] text-white flex flex-col justify-center items-center p-4 selection:bg-[#c084fc]/30 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#c084fc]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#e6c594]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e6c594] via-[#dfa0a0] to-[#c084fc] shadow-xl shadow-[#e6c594]/20 mb-3 text-[#140d1a] font-serif font-black text-2xl">
            {isBranchLoginMode ? 'B' : isStylistLoginMode ? 'S' : isInventoryLoginMode ? 'I' : isFinanceLoginMode ? 'F' : isCallCenterLoginMode ? 'C' : 'S'}
          </div>
          {isStylistLoginMode ? (
            <>
              <div className="inline-block mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold tracking-wider uppercase border border-pink-500/30">
                  Stylist Portal
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Stylist Login
              </h1>
              <p className="text-xs text-white/60 mt-1 font-medium">
                Sign in to manage your appointments and clients
              </p>
            </>
          ) : isBranchLoginMode ? (
            <>
              <div className="inline-block mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#c084fc]/20 text-[#e9d5ff] text-[10px] font-bold tracking-wider uppercase border border-[#c084fc]/30">
                  Branch Operations Portal
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Branch Manager Login
              </h1>
              <p className="text-xs text-white/60 mt-1 font-medium">
                Sign in to manage your assigned salon outlet
              </p>
            </>
          ) : isInventoryLoginMode ? (
            <>
              <div className="inline-block mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                  Inventory Operations Portal
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Inventory Controller Login
              </h1>
              <p className="text-xs text-white/60 mt-1 font-medium">
                Sign in to manage stock levels, purchases, and suppliers
              </p>
            </>
          ) : isFinanceLoginMode ? (
            <>
              <div className="inline-block mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-wider uppercase border border-blue-500/30">
                  Finance &amp; HR Portal
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Finance &amp; HR Specialist Login
              </h1>
              <p className="text-xs text-white/60 mt-1 font-medium">
                Sign in to manage payroll, commissions, and settlements
              </p>
            </>
          ) : isCallCenterLoginMode ? (
            <>
              <div className="inline-block mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold tracking-wider uppercase border border-cyan-500/30">
                  Call Center Operations Portal
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Call Center Agent Login
              </h1>
              <p className="text-xs text-white/60 mt-1 font-medium">
                Sign in to manage leads, incoming calls, and client bookings
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Salon &amp; Spa
              </h1>
              <p className="text-xs text-white/60 mt-1 font-medium">
                Multi-Tenant Enterprise Management Platform
              </p>
            </>
          )}
        </div>

        {/* Already Logged In Banner */}
        {isAuthenticated && user && (
          <div className="mb-4 p-4 rounded-2xl bg-white/10 border border-[#c084fc]/35 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#c084fc] bg-[#c084fc]/15 px-2 py-0.5 rounded uppercase tracking-wider">
                  Active Session · {isUserSuperAdmin ? 'Super Administrator' : isInventoryUser ? 'Inventory Controller' : isFinanceUser ? 'Finance & HR Specialist' : isCallCenterUser ? 'Call Center Agent' : isStylistUser ? 'Stylist' : isBranchUser ? 'Branch Manager' : user.roles?.[0]?.name || 'Staff'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <button
                onClick={() => logout()}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-medium transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>

            <div className="text-left">
              <p className="text-xs font-bold text-white truncate">
                {user.fullName} <span className="text-white/50 font-normal">({user.email})</span>
              </p>

              {/* Assigned Branch Details Card */}
              {assignedBranch ? (
                <div className="mt-2.5 p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#e6c594]">
                      <Store className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{assignedBranch.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-white text-[9px] font-mono font-bold">
                        {assignedBranch.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70 mt-0.5 flex items-center gap-1.5">
                      <span>📍 {assignedBranch.city}</span>
                      <span>•</span>
                      <span>🕒 {assignedBranch.workingHours}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      window.location.href = getUserTargetPortal();
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#e6c594] to-[#dfa0a0] text-[#140d1a] text-xs font-bold hover:brightness-110 shadow-md transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Enter Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      window.location.href = getUserTargetPortal();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Go to Workspace →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Box */}
        <div className="rounded-3xl bg-[#1d132b]/90 border border-purple-500/25 shadow-2xl p-6 sm:p-7 backdrop-blur-xl">
          {/* Quick Demo Credentials */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6c594] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Quick Role Credentials
              </span>
              <span className="text-[10px] text-white/40">Click to fill</span>
            </div>

            <div className="flex grid grid-cols-1 sm:grid-cols-2 gap-2">
              {isAdminLoginMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('salon_admin')}
                    className="p-2 rounded-xl border border-[#e6c594]/30 bg-[#e6c594]/10 hover:bg-[#e6c594]/20 text-left transition flex flex-col gap-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1 text-[#e6c594] font-bold text-[11px]">
                      <Store className="w-3 h-3" />
                      <span>Salon Owner</span>
                    </div>
                    <span className="text-[9px] text-white/50 group-hover:text-white/80 truncate">
                      owner@...
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('super_admin')}
                    className="p-2 rounded-xl border border-purple-400/20 bg-purple-500/10 hover:bg-purple-500/20 text-left transition flex flex-col gap-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1 text-[#fcd34d] font-bold text-[11px]">
                      <Crown className="w-3 h-3" />
                      <span>Super Admin</span>
                    </div>
                    <span className="text-[9px] text-white/50 group-hover:text-white/80 truncate">
                      superadmin@...
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('inventory_manager')}
                    className="p-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 hover:bg-cyan-500/20 text-left transition flex flex-col gap-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1 text-cyan-400 font-bold text-[11px]">
                      <Building2 className="w-3 h-3" />
                      <span>Inventory</span>
                    </div>
                    <span className="text-[9px] text-white/50 group-hover:text-white/80 truncate">
                      inventory@...
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('finance_hr')}
                    className="p-2 rounded-xl border border-green-400/20 bg-green-500/10 hover:bg-green-500/20 text-left transition flex flex-col gap-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1 text-green-400 font-bold text-[11px]">
                      <Building2 className="w-3 h-3" />
                      <span>Finance</span>
                    </div>
                    <span className="text-[9px] text-white/50 group-hover:text-white/80 truncate">
                      finance@...
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('call_center')}
                    className="p-2 rounded-xl border border-blue-400/20 bg-blue-500/10 hover:bg-blue-500/20 text-left transition flex flex-col gap-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1 text-blue-400 font-bold text-[11px]">
                      <Building2 className="w-3 h-3" />
                      <span>Call Center</span>
                    </div>
                    <span className="text-[9px] text-white/50 group-hover:text-white/80 truncate">
                      agent@...
                    </span>
                  </button>
                </>
              ) : isBranchLoginMode ? (
                <button
                  type="button"
                  onClick={() => handleQuickLogin('branch_manager')}
                  className="p-2 rounded-xl border border-purple-300/20 bg-purple-400/10 hover:bg-purple-400/20 text-left transition flex flex-col gap-0.5 cursor-pointer group col-span-1 sm:col-span-2"
                >
                  <div className="flex items-center gap-1 text-[#c084fc] font-bold text-[11px]">
                    <UserCheck className="w-3 h-3" />
                    <span>Branch Mgr</span>
                  </div>
                  <span className="text-[9px] text-white/50 group-hover:text-white/80 truncate">
                    manager@...
                  </span>
                </button>
              ) : isStylistLoginMode ? (
                <button
                  type="button"
                  onClick={() => handleQuickLogin('stylist')}
                  className="p-2 rounded-xl border border-pink-300/20 bg-pink-400/10 hover:bg-pink-400/20 text-left transition flex flex-col gap-0.5 cursor-pointer group col-span-1 sm:col-span-2"
                >
                  <div className="flex items-center gap-1 text-pink-400 font-bold text-[11px]">
                    <Sparkles className="w-3 h-3" />
                    <span>Stylist</span>
                  </div>
                  <span className="text-[9px] text-white/50 group-hover:text-white/80 truncate">
                    stylist@salon.com
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-white/40 tracking-wider">
              <span className="bg-[#1d132b] px-2">Account Login</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-tight">{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTenantId('');
                  }}
                  placeholder="admin@digiflex.com"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-purple-400/20 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594] transition"
                />
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setTenantId('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-purple-400/20 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594] transition"
                />
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] font-bold text-xs hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-[#e6c594]/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In &amp; Open Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-white/40 mt-5 space-y-1.5">
          <p>  Salon SaaS · Zero Trust RBAC Security</p>
          <div className="flex items-center justify-center gap-3 text-[10px]">
            <span>
              Default Password: <code className="text-[#e6c594]">SuperAdmin@123!</code>
            </span>
            <span>·</span>
            <span>
              Franchise Password: <code className="text-[#c084fc]">Franchise@2026!</code>
            </span>
          </div>
          <p className="pt-1">
            <a
              href="/franchise/login"
              className="text-xs font-semibold text-purple-300 hover:text-white transition-colors underline"
            >
              Open Dedicated Franchise Partner Login Portal →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
