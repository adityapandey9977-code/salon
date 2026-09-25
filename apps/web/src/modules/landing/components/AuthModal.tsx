import type React from 'react';
import { useState } from 'react';
import type { AuthMode, AuthRole } from '../types/landingTypes';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: AuthRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'brand_owner',
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<AuthRole>(initialRole);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [salonName, setSalonName] = useState('');
  const [gstin, setGstin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  if (!isOpen) return null;

  const handleRoleRedirect = () => {
    onClose();
    if (role === 'super_admin') {
      window.location.href = '/super-admin';
    } else if (role === 'branch_manager') {
      window.location.href = '/branch-manager';
    } else {
      // Default brand owner / admin
      window.location.href = '/admin';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent && mode === 'register') {
      setOtpSent(true);
      return;
    }
    handleRoleRedirect();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#1b1224] border border-purple-500/30 shadow-2xl text-white">
        {/* Glow Effects - Midnight Plum & Champagne Rose */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#c084fc]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#dfa0a0]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e6c594] via-[#dfa0a0] to-[#c084fc] flex items-center justify-center font-bold text-[#140d1a] shadow-lg shadow-[#e6c594]/25">
              S&S
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold tracking-tight text-white">
                Salon & Spa Platform
              </h3>
              <p className="text-xs text-white/60">India-First Multi-Tenant SaaS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-white/10 bg-white/5">
          <button
            onClick={() => {
              setMode('login');
              setOtpSent(false);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition ${
              mode === 'login'
                ? 'text-[#e6c594] border-b-2 border-[#e6c594] bg-white/5 font-bold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setOtpSent(false);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition ${
              mode === 'register'
                ? 'text-[#e6c594] border-b-2 border-[#e6c594] bg-white/5 font-bold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Register Salon
          </button>
        </div>

        {/* Role Selector */}
        <div className="p-6 pb-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-2">
            Select Workspace Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('brand_owner')}
              className={`p-2.5 rounded-xl border text-xs font-medium text-center transition flex flex-col items-center gap-1 ${
                role === 'brand_owner'
                  ? 'border-[#e6c594] bg-[#e6c594]/15 text-[#e6c594]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="font-semibold">Brand Owner</span>
              <span className="text-[10px] opacity-70">Head Office</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('branch_manager')}
              className={`p-2.5 rounded-xl border text-xs font-medium text-center transition flex flex-col items-center gap-1 ${
                role === 'branch_manager'
                  ? 'border-[#c084fc] bg-[#c084fc]/20 text-[#e9d5ff]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="font-semibold">Branch Mgr</span>
              <span className="text-[10px] opacity-70">Front Desk POS</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('super_admin')}
              className={`p-2.5 rounded-xl border text-xs font-medium text-center transition flex flex-col items-center gap-1 ${
                role === 'super_admin'
                  ? 'border-[#dfa0a0] bg-[#dfa0a0]/20 text-[#fcd34d]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="font-semibold">Super Admin</span>
              <span className="text-[10px] opacity-70">SaaS Operator</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Salon / Spa Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Luxury Wellness & Spa"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/20 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  GSTIN Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="27AAAAA0000A1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/20 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">
              Email or Mobile Number
            </label>
            <input
              type="text"
              required
              placeholder="owner@aurasalon.com or +91 98765 43210"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/20 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594]"
            />
          </div>

          {!otpSent ? (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-purple-500/20 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">
                Enter 4-Digit WhatsApp OTP
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 rounded-xl bg-white/10 border border-[#e6c594] text-center text-lg font-bold text-white focus:outline-none"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] font-bold text-sm hover:brightness-110 transition shadow-lg shadow-[#e6c594]/25"
            >
              {mode === 'login'
                ? `Enter ${role === 'super_admin' ? 'Super Admin' : role === 'branch_manager' ? 'Branch Manager' : 'Brand Owner'} Workspace →`
                : otpSent
                  ? 'Verify & Complete Registration →'
                  : 'Send Verification OTP →'}
            </button>
          </div>

          <div className="text-center text-xs text-white/40 pt-2">
            By continuing, you agree to Salon & Spa Software's Terms of Service & DPDP Compliance
            policy.
          </div>
        </form>
      </div>
    </div>
  );
};
