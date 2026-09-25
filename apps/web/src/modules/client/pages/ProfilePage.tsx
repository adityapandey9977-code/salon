import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Bell,
  Calendar,
  Camera,
  CheckCircle,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sliders,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function ProfilePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'personal' | 'preferences' | 'communication' | 'security'
  >('personal');

  // Master Profile State - All 10 Fields
  const [profile, setProfile] = useState({
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    fullName: 'Aakanksha Sharma',
    mobileNumber: '+91 98765 11223',
    email: 'aakanksha@gmail.com',
    gender: 'Female',
    dateOfBirth: '1995-09-15',
    anniversary: '2021-12-10',
    preferredBranch: 'Indrapuri Central Outlet',
    preferredStylist: 'Vikram Kulkarni (Senior Colorist)',
    address: 'E-4/220 Arera Colony, Bhopal, MP 462016',
    allergies: 'Sensitive skin - Ammonia free hair color only',
    serviceMode: 'In-Salon',
  });

  // Communication Preferences State
  const [commPrefs, setCommPrefs] = useState({
    whatsappReminders: true,
    emailPromotions: true,
    smsReceipts: true,
    phoneCalls: false,
  });

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

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast('Password Reset Successfully: Your login credentials have been updated.');
  };

  const handleSaveProfile = () => {
    toast(
      'Profile Saved: Your profile information and preferences have been updated successfully.',
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-line pb-4">
        <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
          My Profile &amp; Account Settings
        </h1>
        <p className="text-xs text-soft mt-1">
          Manage personal contact details, dates, preferred salon outlet &amp; stylist,
          communication settings, and password security.
        </p>
      </div>

      {/* 4 TABS REQUESTED BY USER */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'personal', label: '1. Personal Details' },
          { id: 'preferences', label: '2. Preferences' },
          { id: 'communication', label: '3. Communication Preferences' },
          { id: 'security', label: '4. Security & Reset Password' },
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

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Photo Upload */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4 text-center relative">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={profile.profilePhoto}
                alt="Profile Photo"
                className="w-24 h-24 rounded-full object-cover border-2 border-purple-600 shadow-md"
              />
              <button
                onClick={() => toast('Profile Photo: Photo upload dialog opened.')}
                className="absolute bottom-0 right-0 p-2 bg-[#5A2EA6] text-white rounded-full shadow hover:bg-[#482387] cursor-pointer border-0"
                title="Upload Profile Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-ink">{profile.fullName}</h2>
              <p className="text-xs text-amber-700 font-bold">Gold Tier Member</p>
              <p className="text-[11px] text-soft mt-1">{profile.email}</p>
            </div>

            <div className="pt-2 border-t border-line flex justify-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Status: Active Client
              </span>
            </div>
          </div>

          {/* Skin & Hair Allergy Caution Alert */}
          <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Skin &amp; Hair Caution Alert
            </div>
            <p className="text-xs text-amber-800 font-medium">{profile.allergies}</p>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="md:col-span-2">
          {/* TAB 1: PERSONAL DETAILS (ALL 10 FIELDS) */}
          {activeTab === 'personal' && (
            <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4">
              <h3 className="text-base font-bold text-ink border-b border-line pb-3">
                Personal Contact &amp; Demographic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    1. Full Name *
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                  />
                </div>

                {/* 2. Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    2. Mobile Number *
                  </label>
                  <input
                    type="text"
                    value={profile.mobileNumber}
                    onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                  />
                </div>

                {/* 3. Email */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    3. Email Address *
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                  />
                </div>

                {/* 4. Gender */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    4. Gender *
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* 5. Date of Birth */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    5. Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                  />
                </div>

                {/* 6. Anniversary */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    6. Anniversary Date
                  </label>
                  <input
                    type="date"
                    value={profile.anniversary}
                    onChange={(e) => setProfile({ ...profile, anniversary: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                  />
                </div>
              </div>

              {/* 7. Address */}
              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  7. Address
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-sm"
                >
                  Save Personal Details
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4">
              <h3 className="text-base font-bold text-ink border-b border-line pb-3">
                Salon &amp; Specialist Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 8. Preferred Branch */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    8. Preferred Salon Branch *
                  </label>
                  <select
                    value={profile.preferredBranch}
                    onChange={(e) => setProfile({ ...profile, preferredBranch: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                  >
                    <option value="Indrapuri Central Outlet">Indrapuri Central Outlet</option>
                    <option value="Arera Colony Outlet">Arera Colony Outlet</option>
                    <option value="Kolar Road Outlet">Kolar Road Outlet</option>
                  </select>
                </div>

                {/* 9. Preferred Stylist */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    9. Preferred Specialist / Stylist *
                  </label>
                  <select
                    value={profile.preferredStylist}
                    onChange={(e) => setProfile({ ...profile, preferredStylist: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                  >
                    <option value="Vikram Kulkarni (Senior Colorist)">
                      Vikram Kulkarni (Senior Colorist)
                    </option>
                    <option value="Priya Sharma (Master Aesthetician)">
                      Priya Sharma (Master Aesthetician)
                    </option>
                    <option value="Aditi Malhotra (Hair Spa Specialist)">
                      Aditi Malhotra (Hair Spa Specialist)
                    </option>
                    <option value="Rohan Arora (Top Stylist)">Rohan Arora (Top Stylist)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Skin &amp; Hair Caution Notes / Allergies
                </label>
                <input
                  type="text"
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-sm"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNICATION PREFERENCES */}
          {activeTab === 'communication' && (
            <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4">
              <h3 className="text-base font-bold text-ink border-b border-line pb-3">
                Notification &amp; Channel Settings
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-pine/5 rounded-2xl border border-line flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">WhatsApp Appointment Reminders</div>
                    <div className="text-soft text-[11px]">
                      Receive 1-click confirmation &amp; 24h visit reminders via WhatsApp
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={commPrefs.whatsappReminders}
                    onChange={(e) =>
                      setCommPrefs({ ...commPrefs, whatsappReminders: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-pine/5 rounded-2xl border border-line flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">Email Offer Newsletters &amp; Invoices</div>
                    <div className="text-soft text-[11px]">
                      Receive digital receipts &amp; exclusive Gold member promo codes
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={commPrefs.emailPromotions}
                    onChange={(e) =>
                      setCommPrefs({ ...commPrefs, emailPromotions: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-pine/5 rounded-2xl border border-line flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">SMS Billing Alerts</div>
                    <div className="text-soft text-[11px]">
                      Receive text message alerts for wallet top-ups &amp; cashbacks
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={commPrefs.smsReceipts}
                    onChange={(e) => setCommPrefs({ ...commPrefs, smsReceipts: e.target.checked })}
                    className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-pine/5 rounded-2xl border border-line flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">Promotional Phone Calls</div>
                    <div className="text-soft text-[11px]">
                      Allow salon concierge desk to call regarding custom package deals
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={commPrefs.phoneCalls}
                    onChange={(e) => setCommPrefs({ ...commPrefs, phoneCalls: e.target.checked })}
                    className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-sm"
                >
                  Save Communication Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & RESET PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-line pb-3">
                <KeyRound className="w-5 h-5 text-[#5A2EA6]" />
                <div>
                  <h3 className="text-base font-bold text-ink">Reset Security Password</h3>
                  <p className="text-xs text-soft">
                    Update your login password to secure your account and wallet.
                  </p>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
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
                      {showCurrentPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

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
          )}
        </div>
      </div>
    </div>
  );
}
