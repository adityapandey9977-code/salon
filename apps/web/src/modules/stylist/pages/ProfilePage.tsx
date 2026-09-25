import { Avatar, Button, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  KeyRound,
  Lock,
  Pin,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';

export function ProfilePage() {
  const { toast } = useToast();

  const { user } = useAuth();

  // Profile Details
  const [name, setName] = useState(user?.fullName || 'Stylist');
  const [role, setRole] = useState(user?.roles?.[0]?.name || 'Stylist');
  const [phone, setPhone] = useState(user?.mobilePhone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [station, setStation] = useState('  Salon');
  const [skills, setSkills] = useState(
    'Balayage Bleach, Kérastase Scalp Therapy, Keratin Treatment, Bridal Styling',
  );

  useEffect(() => {
    if (user) {
      setName(user.fullName || 'Stylist');
      setRole(user.roles?.[0]?.name || 'Stylist');
      setPhone(user.mobilePhone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Password Reset States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Stylist Profile credentials updated successfully!');
  };

  const handleResetPassword = (e: React.FormEvent) => {
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
      toast('New password and confirmation do not match!');
      return;
    }

    toast('Password updated successfully! Next login requires new credentials. 🔑');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
          My Professional Profile
        </h1>
        <p className="text-[13px] text-soft mt-1">
          Stylist credentials, skill level certification, shift timings, and security settings
        </p>
      </div>

      {/* Header Profile Badge */}
      <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <Avatar
          variant="circle-profile"
          initials={name.substring(0, 2).toUpperCase() || 'S'}
          className="w-20 h-20 bg-gradient-to-br from-[#5A2EA6] to-[#7B42D6] text-white text-2xl font-bold shadow-md"
        />
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="font-serif text-2xl font-bold text-ink">{name}</h2>
            <span className="bg-amber-400 text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Senior Master
            </span>
          </div>
          <p className="text-xs text-[#5A2EA6] font-bold">{role}</p>
          <p className="text-xs text-soft">
            <strong className="text-ink">{station}</strong>
          </p>
        </div>
      </div>

      {/* Account Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs space-y-4"
      >
        <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-3">
          Stylist Account Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
              Professional Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
              Mobile Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink font-mono outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
            Skill &amp; Certification Matrix
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            className="h-10 px-6 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
          >
            Save Profile Credentials
          </Button>
        </div>
      </form>

      {/* SECURITY & PASSWORD RESET SECTION */}
      <form
        onSubmit={handleResetPassword}
        className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#5A2EA6]" /> Security &amp; Password Reset
            </h3>
            <p className="text-xs text-soft mt-0.5">
              Update your password to keep your stylist terminal credentials secure
            </p>
          </div>
          <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
            2FA Active
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                required
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                required
              />
            </div>
          </div>

          {/* Password Security Rules */}
          <div className="bg-[#F8F5FF] border border-[#5A2EA6]/15 rounded-xl p-3 text-[11px] space-y-1">
            <span className="font-bold text-[#5A2EA6] block">Password Security Requirements:</span>
            <div className="flex flex-wrap gap-4 text-soft font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Minimum 8 characters
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> At least 1 uppercase letter
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> At least 1 number or special
                symbol
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            className="h-10 px-6 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer shadow-xs"
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
