import { useToast } from '@salon-spa-saas/ui';
import {
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Globe,
  History,
  Key,
  Laptop,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Sliders,
  Smartphone,
  User,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function ProfilePage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [activeTab, setActiveTab] = useState<
    'personal' | 'security' | 'preferences' | 'loginHistory' | 'changePassword'
  >('personal');

  // 1. PERSONAL DETAILS STATE
  const [personalDetails, setPersonalDetails] = useState({
    fullName: 'Vikramaditya Singhania',
    email: 'cfo-finance@digiflexsalon.com',
    phone: '+91 98765 00100',
    designation: 'Enterprise CFO & Finance Controller',
    employeeId: 'CFO-101',
    primaryBranch: 'Bandra West Flagship (Mumbai)',
    department: 'Corporate Finance & Accounts Governance',
  });

  // 2. SECURITY STATE
  const [securityDetails] = useState({
    twoFactorStatus: 'Enabled (Authenticator App)',
    biometricKey: 'Active (Fingerprint Touch ID)',
    authScope: 'Full Network-Wide Financial Authority',
    lastSecurityAudit: '2026-08-01 10:00 AM',
  });

  // 3. PREFERENCES STATE
  const [preferences, setPreferences] = useState({
    theme: 'Light Modern',
    currencyFormat: 'INR (₹) Lakhs / Crores',
    emailAlerts: 'All Financial Transactions',
    pushAlerts: 'High Priority Approvals Only',
    autoTimeout: '30 Minutes Inactivity',
  });

  // 4. LOGIN HISTORY STATE
  const [loginHistory] = useState([
    {
      id: 'LOG-4401',
      device: 'MacBook Pro (macOS 15.4)',
      ip: '103.21.124.88',
      location: 'Mumbai, India',
      timestamp: '2026-08-07 09:15 AM',
      status: 'Current Session',
    },
    {
      id: 'LOG-4390',
      device: 'iPhone 15 Pro (iOS 19.1)',
      ip: '103.21.124.89',
      location: 'Mumbai, India',
      timestamp: '2026-08-06 04:30 PM',
      status: 'Logged Out',
    },
    {
      id: 'LOG-4350',
      device: 'Windows Workstation',
      ip: '49.207.180.12',
      location: 'Delhi NCR, India',
      timestamp: '2026-08-04 11:20 AM',
      status: 'Logged Out',
    },
  ]);

  // 5. CHANGE PASSWORD STATE
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePersonalSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Personal Details Updated: Executive profile information updated.');
  };

  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Preferences Saved: System & display preferences updated.');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast('Error: Passwords do not match!');
      return;
    }
    toast('Password Changed: Account security password updated successfully.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Executive Profile &amp; Account Settings
          </h1>
          <p className="text-xs text-soft mt-1">
            Manage Personal Details, Security, System Preferences, Login Audit History, and Change
            Password credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5A2EA6] border border-purple-200 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" /> CFO Executive Authority
          </span>
        </div>
      </div>

      {/* 5 PROFILE TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'personal', label: '1. Personal Details' },
          { id: 'security', label: '2. Security & 2FA' },
          { id: 'preferences', label: '3. Preferences' },
          { id: 'loginHistory', label: '4. Login History' },
          { id: 'changePassword', label: '5. Change Password' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PERSONAL DETAILS */}
      {activeTab === 'personal' && (
        <form
          onSubmit={handlePersonalSave}
          className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 max-w-3xl"
        >
          <h3 className="font-bold text-sm text-ink">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={personalDetails.fullName}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, fullName: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                value={personalDetails.email}
                onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={personalDetails.phone}
                onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Designation
              </label>
              <input
                type="text"
                disabled
                value={personalDetails.designation}
                className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Primary Branch
              </label>
              <input
                type="text"
                value={personalDetails.primaryBranch}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, primaryBranch: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                value={personalDetails.department}
                onChange={(e) =>
                  setPersonalDetails({ ...personalDetails, department: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer border-0"
          >
            Save Personal Details
          </button>
        </form>
      )}

      {/* TAB 2: SECURITY */}
      {activeTab === 'security' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 max-w-3xl">
          <h3 className="font-bold text-sm text-ink">
            Authentication &amp; RBAC Security Authority
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-pine/5 rounded-xl border border-line flex justify-between items-center">
              <div>
                <div className="font-bold text-ink">Two-Factor Authentication (2FA)</div>
                <div className="text-[10px] text-soft">{securityDetails.twoFactorStatus}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>

            <div className="p-3 bg-pine/5 rounded-xl border border-line flex justify-between items-center">
              <div>
                <div className="font-bold text-ink">Biometric Key Access</div>
                <div className="text-[10px] text-soft">{securityDetails.biometricKey}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
                Enabled
              </span>
            </div>

            <div className="p-3 bg-pine/5 rounded-xl border border-line flex justify-between items-center">
              <div>
                <div className="font-bold text-ink">RBAC Scope</div>
                <div className="text-[10px] text-soft">{securityDetails.authScope}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Full Admin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOGIN HISTORY */}
      {activeTab === 'loginHistory' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden p-5 space-y-3">
          <h3 className="font-bold text-sm text-ink">Security Session Audit Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-2.5">Device &amp; OS</th>
                  <th className="p-2.5">IP Address</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {loginHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-purple-50/30">
                    <td className="p-2.5 font-bold text-ink">{h.device}</td>
                    <td className="p-2.5 font-mono text-soft">{h.ip}</td>
                    <td className="p-2.5 text-soft">{h.location}</td>
                    <td className="p-2.5 text-muted">{h.timestamp}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          h.status === 'Current Session'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CHANGE PASSWORD */}
      {activeTab === 'changePassword' && (
        <form
          onSubmit={handlePasswordReset}
          className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 max-w-md"
        >
          <h3 className="font-bold text-sm text-ink">Change Account Password</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer border-0"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}
