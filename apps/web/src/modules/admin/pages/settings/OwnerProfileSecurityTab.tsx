import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  BellRing,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { authApi } from '@/shared/api/auth.api';

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export function OwnerProfileSecurityTab() {
  const { toast } = useToast();

  // Profile Form State
  const [profile, setProfile] = useState({
    firstName: 'Ananya',
    lastName: 'Shah',
    email: 'ananya.shah@atelier-salons.com',
    phone: '+91 98201 22334',
    secondaryPhone: '+91 98201 22335',
    title: 'Brand Owner & Managing Director',
    role: 'Super Director · HQ',
    hqLocation: 'Atelier HQ · Nariman Point, Mumbai',
    emergencyContact: 'Vikram Shah (+91 98201 99880)',
    bio: 'Founder and Chief Brand Executive overseeing 6 luxury salons and academy franchises across India.',
    notifyWhatsapp: true,
    notifyEmail: true,
    notifySms: true,
  });

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Active Sessions State
  const [sessions, setSessions] = useState<SessionItem[]>([
    {
      id: 'sess-01',
      device: 'MacBook Pro 16" (Apple Silicon)',
      browser: 'Chrome 128.0 (macOS Sequoia)',
      location: 'Mumbai, Maharashtra, India',
      ip: '103.21.144.82',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: 'sess-02',
      device: 'iPhone 15 Pro Max',
      browser: '  Executive iOS App v3.4',
      location: 'Mumbai, Maharashtra, India',
      ip: '103.21.144.91',
      lastActive: '25 minutes ago',
      isCurrent: false,
    },
    {
      id: 'sess-03',
      device: 'ThinkPad X1 Carbon',
      browser: 'Firefox 129.0 (Windows 11)',
      location: 'Pune, Maharashtra, India',
      ip: '182.74.55.12',
      lastActive: '2 days ago',
      isCurrent: false,
    },
  ]);

  // Password Strength Calculations
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword !== '' && newPassword === confirmPassword;

  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;
  const strengthLabel =
    newPassword.length === 0
      ? 'Enter new password'
      : strengthScore <= 2
        ? 'Weak'
        : strengthScore <= 4
          ? 'Medium'
          : 'Strong';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast(`Brand Owner profile for ${profile.firstName} ${profile.lastName} updated successfully.`);
  };

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      toast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('New password and confirm password do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authApi.changePassword({
        email: profile.email,
        currentPassword,
        newPassword,
      });

      toast('Account password updated successfully in database!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const serverErr =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update password. Current security password may be incorrect.';
      toast(serverErr);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast('Session terminated. Device logged out.');
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast('All other active device sessions have been logged out.');
  };

  return (
    <div className="space-y-6 text-xs animate-in fade-in duration-200">
      {/* Overview Hero Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#5A2EA6]/15 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Avatar
              variant="circle-profile"
              initials="AS"
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#5A2EA6] to-[#7B4DFF] text-white text-2xl font-bold font-serif shadow-md shrink-0 ring-4 ring-purple-50"
            />
            <button
              type="button"
              onClick={() => toast('Profile photo upload simulation triggered.')}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#5A2EA6] text-white grid place-items-center shadow-md hover:bg-[#4a2489] transition-all cursor-pointer border-2 border-white"
              title="Change Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
                {profile.firstName} {profile.lastName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6] text-white text-[10px] font-extrabold uppercase tracking-wider">
                {profile.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Root Authority
              </span>
            </div>
            <p className="text-soft font-semibold">{profile.title}</p>
            <div className="flex items-center gap-4 text-muted pt-1 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <Mail className="w-3.5 h-3.5 text-[#5A2EA6]" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <Phone className="w-3.5 h-3.5 text-[#5A2EA6]" />
                {profile.phone}
              </span>
              <span className="flex items-center gap-1.5 text-soft">
                <MapPin className="w-3.5 h-3.5 text-[#5A2EA6]" />
                {profile.hqLocation}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="p-3.5 bg-[#FAF7FF] rounded-2xl border border-purple-100 text-center min-w-[130px]">
            <span className="text-[10px] text-muted uppercase font-bold block">
              Security Status
            </span>
            <strong className="text-xs font-bold text-emerald-700 block mt-0.5">
              2FA Enforced
            </strong>
            <span className="text-[9.5px] text-soft">Passkey Enabled</span>
          </div>
          <div className="p-3.5 bg-[#FAF7FF] rounded-2xl border border-purple-100 text-center min-w-[130px]">
            <span className="text-[10px] text-muted uppercase font-bold block">Active Logins</span>
            <strong className="text-xs font-bold text-ink block mt-0.5">
              {sessions.length} Devices
            </strong>
            <span className="text-[9.5px] text-[#5A2EA6] font-bold">1 In-Session</span>
          </div>
        </div>
      </div>

      {/* Main Form Split: Left Profile Information, Right Password & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN: PROFILE DETAILS ================= */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 border border-[#5A2EA6]/15 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] grid place-items-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    Executive Profile Information
                  </h3>
                  <p className="text-[11px] text-muted">
                    Update your administrative identity, email, and emergency contact details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Official Email Address (Login ID) *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Primary Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Executive Designation / Title
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Primary Headquarters Location
                </label>
                <input
                  type="text"
                  value={profile.hqLocation}
                  onChange={(e) => setProfile({ ...profile, hqLocation: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Emergency Recovery Contact
                </label>
                <input
                  type="text"
                  value={profile.emergencyContact}
                  onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  placeholder="Contact Name and Phone"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                  Executive Bio / Notes
                </label>
                <textarea
                  rows={2}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full p-3 rounded-xl border border-purple-100 bg-[#FCFAFF] font-medium text-ink focus:outline-none focus:border-[#5A2EA6] resize-none"
                />
              </div>
            </div>

            {/* Notification Channel Preferences */}
            <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-purple-100 space-y-3">
              <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                Brand Owner Direct Alert Channels
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.notifyWhatsapp}
                    onChange={(e) => setProfile({ ...profile, notifyWhatsapp: e.target.checked })}
                    className="rounded text-[#5A2EA6] focus:ring-0"
                  />
                  <span className="font-semibold text-ink">WhatsApp Critical Alerts</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.notifyEmail}
                    onChange={(e) => setProfile({ ...profile, notifyEmail: e.target.checked })}
                    className="rounded text-[#5A2EA6] focus:ring-0"
                  />
                  <span className="font-semibold text-ink">Daily P&amp;L Digest</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-purple-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.notifySms}
                    onChange={(e) => setProfile({ ...profile, notifySms: e.target.checked })}
                    className="rounded text-[#5A2EA6] focus:ring-0"
                  />
                  <span className="font-semibold text-ink">SMS Security OTP</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="h-10 px-6 rounded-xl font-bold text-xs premium-btn-primary flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        </div>

        {/* ================= RIGHT COLUMN: PASSWORD & SECURITY ================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Password Update Card */}
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white rounded-3xl p-6 border border-[#5A2EA6]/15 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-purple-50">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] grid place-items-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-ink text-base">Change Account Password</h3>
                <p className="text-[11px] text-muted">
                  Update your root login password to maintain high platform security.
                </p>
              </div>
            </div>

            {/* Current Password */}
            <div>
              <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-ink cursor-pointer border-0 bg-transparent"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                  New Password *
                </label>
                {newPassword && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      strengthScore <= 2
                        ? 'bg-rose-100 text-rose-800'
                        : strengthScore <= 4
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800',
                    )}
                  >
                    Strength: {strengthLabel}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-ink cursor-pointer border-0 bg-transparent"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Live Strength Checklist */}
              {newPassword && (
                <div className="grid grid-cols-2 gap-1.5 pt-2 text-[10px]">
                  <span
                    className={cn(
                      'flex items-center gap-1 font-semibold',
                      hasMinLength ? 'text-emerald-700' : 'text-slate-400',
                    )}
                  >
                    <Check className="w-3 h-3" /> Min 8 characters
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-1 font-semibold',
                      hasUpper ? 'text-emerald-700' : 'text-slate-400',
                    )}
                  >
                    <Check className="w-3 h-3" /> Uppercase letter
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-1 font-semibold',
                      hasNumber ? 'text-emerald-700' : 'text-slate-400',
                    )}
                  >
                    <Check className="w-3 h-3" /> Number (0-9)
                  </span>
                  <span
                    className={cn(
                      'flex items-center gap-1 font-semibold',
                      hasSpecial ? 'text-emerald-700' : 'text-slate-400',
                    )}
                  >
                    <Check className="w-3 h-3" /> Special symbol (!@#$)
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-ink cursor-pointer border-0 bg-transparent"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && (
                <div className="pt-1 text-[10.5px]">
                  {passwordsMatch ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match perfectly
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 rounded-xl font-bold text-xs premium-btn-primary flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </Button>
          </form>

          {/* Two-Factor Authentication (2FA) */}
          <div className="bg-white rounded-3xl p-6 border border-[#5A2EA6]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] grid place-items-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-sm">
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-[10.5px] text-muted">
                    Authenticator App &amp; Hardware Security Key
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={is2FAEnabled}
                  onChange={(e) => {
                    setIs2FAEnabled(e.target.checked);
                    toast(
                      e.target.checked ? '2FA enabled for Brand Owner login.' : '2FA disabled.',
                    );
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5A2EA6]" />
              </label>
            </div>

            {is2FAEnabled && (
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Authenticator Active
                    (Google Authenticator)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                    className="text-[10px] font-bold text-[#5A2EA6] hover:underline cursor-pointer border-0 bg-transparent"
                  >
                    {showBackupCodes ? 'Hide Backup Codes' : 'View Backup Codes'}
                  </button>
                </div>

                {showBackupCodes && (
                  <div className="p-3 bg-white rounded-xl border border-purple-100 font-mono text-[10.5px] space-y-1 text-slate-700">
                    <span className="text-[9.5px] font-sans font-bold text-muted uppercase block">
                      Emergency 8-Digit Recovery Codes:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 font-bold text-[#5A2EA6]">
                      <span>1. 8920-4412</span>
                      <span>2. 7731-9082</span>
                      <span>3. 1109-6543</span>
                      <span>4. 4482-1903</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= ACTIVE LOGIN SESSIONS ================= */}
      <div className="bg-white rounded-3xl p-6 border border-[#5A2EA6]/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] grid place-items-center">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-ink text-base">
                Active Logins &amp; Authorized Devices
              </h3>
              <p className="text-[11px] text-muted">
                Review active browsers and mobile devices authorized with your Brand Owner
                credentials.
              </p>
            </div>
          </div>
          {sessions.length > 1 && (
            <Button
              variant="outline"
              type="button"
              onClick={handleRevokeAllOtherSessions}
              className="h-8 px-3 rounded-xl text-xs font-bold border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 bg-white cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out All Other Devices</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className={cn(
                'p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3',
                sess.isCurrent
                  ? 'bg-[#F8F5FF] border-[#5A2EA6]/30 shadow-3xs'
                  : 'bg-white border-slate-200',
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-ink text-xs flex items-center gap-1.5 truncate">
                    <Laptop className="w-3.5 h-3.5 text-[#5A2EA6]" />
                    {sess.device}
                  </span>
                  {sess.isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold shrink-0">
                      This Device
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(sess.id)}
                      className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer border-0 bg-transparent"
                    >
                      Revoke
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-soft">{sess.browser}</p>
                <div className="text-[10px] text-muted mt-2 space-y-0.5">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#5A2EA6]" /> {sess.location}
                  </p>
                  <p className="font-mono text-[9.5px]">IP: {sess.ip}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-100/60 flex items-center justify-between text-[10px]">
                <span className="text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#5A2EA6]" /> {sess.lastActive}
                </span>
                <span className="text-emerald-700 font-bold">Encrypted TLS 1.3</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerProfileSecurityTab;
