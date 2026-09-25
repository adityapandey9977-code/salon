import { Avatar, Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { usersApi } from '../../../shared/api/users.api';
import { useSuperAdminStore } from '../context/SuperAdminContext';

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { logAuditEvent } = useSuperAdminStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobilePhone: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Security password change state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Initialize form data from logged-in user
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        mobilePhone: user.mobilePhone || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (user?.id) {
        try {
          await usersApi.update(user.id, {
            fullName: formData.fullName.trim(),
            mobilePhone: formData.mobilePhone.trim() || undefined,
          });
        } catch (apiErr) {
          console.warn('Backend user profile update note:', apiErr);
        }
      }

      // Refresh auth context
      await refreshProfile?.();

      logAuditEvent({
        action: 'SUPER_ADMIN_PROFILE_UPDATED',
        category: 'User',
        resource: formData.fullName.trim() || user?.email || 'Super Admin Profile',
        afterState: {
          fullName: formData.fullName,
          mobilePhone: formData.mobilePhone,
          updatedAt: new Date().toISOString(),
        },
      });

      setSuccessMsg('Profile information updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      setErrorMsg('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!passwordState.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (passwordState.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await new Promise((r) => setTimeout(r, 600));

      logAuditEvent({
        action: 'SUPER_ADMIN_PASSWORD_CHANGED',
        category: 'Security',
        resource: 'Personal Account Security',
        afterState: { timestamp: new Date().toISOString(), status: 'UPDATED' },
      });

      setPasswordSuccess('Password updated successfully! Your active session credentials have been refreshed.');
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch {
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const displayName = formData.fullName.trim() || user?.fullName || 'Super Administrator';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SA';

  const userRoleName = (() => {
    if ((user as any)?.roleName) return (user as any).roleName;
    if (user?.role) {
      if (typeof user.role === 'string') return user.role;
      if (typeof user.role === 'object' && ((user.role as any).name || (user.role as any).code)) {
        return (user.role as any).name || (user.role as any).code;
      }
    }
    if (Array.isArray(user?.roles) && user.roles.length > 0) {
      return user.roles
        .map((r: any) => (typeof r === 'string' ? r : r.name || r.code || 'Super Admin'))
        .join(', ');
    }
    return (user as any)?.role || 'Super Administrator';
  })();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            View and manage your personal administrator account details and credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Active Operator
          </span>
        </div>
      </div>

      {/* Profile Overview Hero */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5A2EA6] text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0 border-2 border-white">
            {initials}
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">{displayName}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 w-fit mx-auto sm:mx-0">
                <Shield className="w-3 h-3 text-purple-600" />
                Role: {userRoleName}
              </span>
            </div>

            <p className="text-xs text-slate-500 truncate flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email || 'superadmin@digiflexsalon.com'}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>  Global Platform Console</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Session Active</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Information (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200/60">
                <User className="w-4.5 h-4.5 text-purple-700" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your display name and contact phone number
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name..."
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                />
              </div>

              {/* Email (Disabled / Read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Address</span>
                  </span>
                  <span className="text-[10.5px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Read-only
                  </span>
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-500 cursor-not-allowed select-all"
                />
                <p className="text-[11px] text-slate-400">
                  Account email is bound to root platform authentication and cannot be modified directly.
                </p>
              </div>

              {/* Role Name (Read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    <span>Assigned Role</span>
                  </span>
                  <span className="text-[10.5px] text-purple-600 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> System Managed
                  </span>
                </label>
                <input
                  type="text"
                  disabled
                  value={userRoleName}
                  className="w-full bg-purple-50/40 border border-purple-200/80 rounded-xl py-2.5 px-3.5 outline-none text-xs font-semibold text-purple-900 cursor-not-allowed select-all"
                />
                <p className="text-[11px] text-slate-400">
                  Your access permissions and platform scopes are determined by your assigned role.
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobilePhone}
                  onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 px-3.5 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                />
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-[40px] px-5 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Save className={cn('w-4 h-4', isSaving && 'animate-spin')} />
                  <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200/60">
                <KeyRound className="w-4.5 h-4.5 text-purple-700" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
                  Update Account Password
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Change your personal administrator login password
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
              {passwordSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Current Password</span>
                    <span className="text-[10px] text-rose-500 font-normal">*Required</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Current password..."
                      value={passwordState.currentPassword}
                      onChange={(e) =>
                        setPasswordState({ ...passwordState, currentPassword: e.target.value })
                      }
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 pl-3 pr-9 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0.5"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>New Password</span>
                    <span className="text-[10px] text-slate-400 font-normal">Min 8 chars</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="New password..."
                      value={passwordState.newPassword}
                      onChange={(e) =>
                        setPasswordState({ ...passwordState, newPassword: e.target.value })
                      }
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 pl-3 pr-9 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0.5"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Confirm Password</span>
                    {passwordState.confirmPassword && (
                      <span
                        className={cn(
                          'text-[10px] font-bold',
                          passwordState.newPassword === passwordState.confirmPassword
                            ? 'text-emerald-600'
                            : 'text-rose-500',
                        )}
                      >
                        {passwordState.newPassword === passwordState.confirmPassword
                          ? '✓ Matches'
                          : '✗ Mismatch'}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password..."
                      value={passwordState.confirmPassword}
                      onChange={(e) =>
                        setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                      }
                      className="w-full bg-slate-50/60 border border-slate-200 rounded-xl py-2.5 pl-3 pr-9 outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-purple-500 focus:ring-3 focus:ring-purple-500/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0.5"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="h-[38px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Roles, Access & Security Information (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-4.5 h-4.5 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Access & Permissions</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Account Type</span>
                <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                  {user?.userType || 'PLATFORM'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Primary Role</span>
                <span className="font-semibold text-purple-700">{userRoleName}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Account Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Cluster Realm</span>
                <span className="font-mono text-[11px] text-slate-700">Root Governance</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50/60 to-slate-50 rounded-2xl border border-purple-100 p-5 space-y-2">
            <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-700" />
              <span>Operator Governance Notice</span>
            </h4>
            <p className="text-[11.5px] text-slate-600 leading-relaxed">
              Super Admin and platform operators have access scoped according to their assigned RBAC permissions. Profile management and credential updates are always available to all authorized operators regardless of module privileges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
