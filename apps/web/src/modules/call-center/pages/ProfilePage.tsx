import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useAuth } from '@/shared/api';

export function ProfilePage() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Reset Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Password Validation Helper
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast('Validation Error: Please enter your current account password.');
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      toast(
        'Weak Password: New password must be at least 8 characters with 1 uppercase letter and 1 number.',
      );
      return;
    }

    if (!isMatch) {
      toast('Password Mismatch: New password and confirm password do not match.');
      return;
    }

    // Success reset
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast('Password Reset Successfully: Your security credentials have been updated.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-line pb-4">
        <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
          Agent Profile & Account Security
        </h1>
        <p className="text-xs text-soft mt-1">
          Desk agent credentials, shift timings, performance metrics, and password security
          management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Agent Badge & Security Status */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4 text-center">
            <div className="w-20 h-20 bg-[#5A2EA6] text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
              {user?.fullName
                ? user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : 'RA'}
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">{user?.fullName || 'Rohan Arora'}</h2>
              <p className="text-xs text-purple-700 font-semibold">
                {user?.roles?.[0]?.name || 'Call Center & Concierge Specialist'}
              </p>
              <p className="text-[11px] text-soft mt-1">
                {user?.email || 'callcenter@gmail.com'} • Shift: Morning (09:00 AM - 06:00 PM)
              </p>
            </div>

            <div className="pt-2 border-t border-line flex justify-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Status: Active On Duty
              </span>
            </div>
          </div>

          {/* Account Security Overview Card */}
          <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Account Security Status
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-emerald-900">Strong Password Active</div>
              <div className="text-[11px] text-emerald-700">Last changed: 30 days ago</div>
            </div>

            <div className="text-[11px] text-soft space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span>Two-Factor Authentication:</span>
                <span className="font-bold text-emerald-700">Enabled (SMS)</span>
              </div>
              <div className="flex justify-between">
                <span>Active Session:</span>
                <span className="font-bold text-ink">Chrome / Windows 11</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Reset Password Card */}
        <div className="md:col-span-2 space-y-6">
          {/* Performance Summary */}
          <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-ink">Monthly Desk Performance Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-purple-50 rounded-xl text-center">
                <div className="text-xs text-purple-700 font-semibold">Total Calls</div>
                <div className="text-xl font-bold text-purple-900">642 Calls</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-center">
                <div className="text-xs text-emerald-700 font-semibold">Conversions</div>
                <div className="text-xl font-bold text-emerald-900">439 Leads</div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl text-center">
                <div className="text-xs text-indigo-700 font-semibold">Package Sales</div>
                <div className="text-xl font-bold text-indigo-900">₹3,84,000</div>
              </div>
            </div>
          </div>

          {/* Reset Password Form Section */}
          <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <KeyRound className="w-5 h-5 text-[#5A2EA6]" />
              <div>
                <h3 className="text-base font-bold text-ink">Reset Security Password</h3>
                <p className="text-xs text-soft">
                  Update your login password to maintain desk authorization security.
                </p>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 pr-10 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink bg-transparent border-0 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Password in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Enter new strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 pr-10 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink bg-transparent border-0 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 pr-10 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink bg-transparent border-0 cursor-pointer"
                    >
                      {showConfirmPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirement Checks */}
              <div className="p-3 bg-pine/5 rounded-xl border border-line space-y-1.5 text-xs">
                <div className="text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Password Requirements:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div
                    className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-soft'}`}
                  >
                    <CheckCircle
                      className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-muted'}`}
                    />
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-700 font-semibold' : 'text-soft'}`}
                  >
                    <CheckCircle
                      className={`w-3.5 h-3.5 ${hasUppercase ? 'text-emerald-600' : 'text-muted'}`}
                    />
                    1 Uppercase letter
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-soft'}`}
                  >
                    <CheckCircle
                      className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-600' : 'text-muted'}`}
                    />
                    1 Number (0-9)
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  Update Account Password
                </button>
              </div>
            </form>
          </div>

          {/* Scope Permissions */}
          <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-ink">Desk Scope Permissions</h3>
            <div className="space-y-2 text-xs text-soft">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Full Access to Lead Inbox &
                Meta/Google Attribution
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Appointment Scheduling &
                Multi-service Booking
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Package & Membership Sales
                issuing
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Lost-client winback campaign
                trigger rights
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
