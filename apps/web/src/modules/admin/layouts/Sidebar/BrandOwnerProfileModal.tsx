import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
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
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sliders,
  Smartphone,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdminContext } from '../../context/AdminContext';
import { authApi } from '@/shared/api/auth.api';

interface BrandOwnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'password';
}

export function BrandOwnerProfileModal({
  isOpen,
  onClose,
  initialTab = 'profile',
}: BrandOwnerProfileModalProps) {
  const { toast } = useToast();
  const { salon, updateSalon } = useAdminContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>(initialTab);

  const parsedName = (salon?.ownerName || 'Salon Owner').trim().split(' ');
  const defaultFirstName = parsedName[0] || 'Salon';
  const defaultLastName = parsedName.slice(1).join(' ') || 'Owner';

  // Profile Data
  const [profile, setProfile] = useState({
    firstName: defaultFirstName,
    lastName: defaultLastName,
    email: salon?.ownerEmail || salon?.businessEmail || 'owner@salon.com',
    phone: salon?.ownerPhone || salon?.businessPhone || '+91 99000 00000',
    title: 'Brand Owner & Managing Director',
    role: 'Salon Owner · HQ',
    hqLocation: `${salon?.name || 'Salon'} HQ · ${salon?.city || 'Central'}, ${salon?.state || 'India'}`,
  });

  // Keep state in sync with salon data when modal opens
  useEffect(() => {
    if (salon && isOpen) {
      const parts = (salon.ownerName || 'Salon Owner').trim().split(' ');
      setProfile({
        firstName: parts[0] || 'Salon',
        lastName: parts.slice(1).join(' ') || 'Owner',
        email: salon.ownerEmail || salon.businessEmail || 'owner@salon.com',
        phone: salon.ownerPhone || salon.businessPhone || '+91 99000 00000',
        title: 'Brand Owner & Managing Director',
        role: 'Salon Owner · HQ',
        hqLocation: `${salon.name} HQ · ${salon.city}, ${salon.state}`,
      });
    }
  }, [salon, isOpen]);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab(initialTab);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Strength calculations
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    await updateSalon({
      ownerName: fullName,
      legalName: fullName,
      ownerEmail: profile.email,
      businessEmail: profile.email,
      ownerPhone: profile.phone,
      businessPhone: profile.phone,
    });
    toast(`Executive profile for ${fullName} updated successfully.`);
    onClose();
  };

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
      onClose();
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

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200 text-xs flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-[#FCFAFF] to-[#F6F0FF] rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            <Avatar
              variant="circle-profile"
              initials="AS"
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5A2EA6] to-[#7B4DFF] text-white text-base font-bold font-serif shadow-md shrink-0 ring-2 ring-purple-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                  Brand Owner Account
                </span>
                <span className="text-xs font-semibold text-soft">Root Security</span>
              </div>
              <h3 className="font-serif font-bold text-ink text-lg mt-0.5">
                {profile.firstName} {profile.lastName} · {profile.role}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer border-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4">
          <div className="p-1 bg-[#FAF7FF] border border-purple-100 rounded-2xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={cn(
                'flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0',
                activeTab === 'profile'
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink',
              )}
            >
              <User className="w-3.5 h-3.5" />
              <span>Executive Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={cn(
                'flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0',
                activeTab === 'password'
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink',
              )}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password &amp; 2FA</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                    Primary Phone Number *
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
                    Executive Title
                  </label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>
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

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-slate-700 leading-relaxed text-[11px]">
                <strong className="text-[#5A2EA6] font-bold block mb-0.5">
                  Root Admin Privileges:
                </strong>
                As Brand Owner, updating this profile updates your executive contact across all
                multi-branch audit stamps and escalation notifications.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile</span>
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
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
                      {strengthLabel}
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
              </div>

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
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="h-10 px-5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isUpdatingPassword ? 'Updating Password...' : 'Update Password'}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default BrandOwnerProfileModal;
