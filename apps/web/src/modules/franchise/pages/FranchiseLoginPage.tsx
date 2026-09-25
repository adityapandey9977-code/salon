import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Store,
} from 'lucide-react';
import React, { useState } from 'react';
import { authApi } from '@/shared/api/auth.api';
import { tenantsApi } from '@/shared/api/tenants.api';

export function FranchiseLoginPage() {
  const [email, setEmail] = useState('sanjay.chawla@apexwellness.in');
  const [password, setPassword] = useState('Franchise@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const prevEmail = localStorage.getItem('digiflex_franchise_email');

    const updateSessionForEmail = async (targetEmail: string, realAccessToken?: string, userData?: any) => {
      if (realAccessToken) {
        localStorage.setItem('digiflex_access_token', realAccessToken);
      } else if (!localStorage.getItem('digiflex_access_token')) {
        localStorage.setItem('digiflex_access_token', 'demo_franchise_token_2026');
      }
      localStorage.setItem('digiflex_user_role', 'FRANCHISE_OWNER');
      localStorage.setItem('digiflex_franchise_email', targetEmail);

      let matchedPartner: any = null;
      try {
        const partners = await tenantsApi.listFranchises();
        if (Array.isArray(partners)) {
          matchedPartner = partners.find(
            (p: any) =>
              userData?.franchiseId && p.id === userData.franchiseId
          );
        }
      } catch (fErr) {
        console.warn('Could not fetch franchise partners during login:', fErr);
      }

      if (matchedPartner) {
        const partnerName = matchedPartner.companyName || matchedPartner.name || 'Ashish Khopde Outlets LLP';
        const contactPerson = matchedPartner.contactPerson || 'Ashish Khopde';
        localStorage.setItem('digiflex_franchise_id', matchedPartner.id);
        if (matchedPartner.tenantId || matchedPartner.tenant?.id) {
          localStorage.setItem('digiflex_tenant_id', matchedPartner.tenantId || matchedPartner.tenant?.id);
        }
        localStorage.setItem('digiflex_franchise_owner_name', contactPerson);
        localStorage.setItem('digiflex_franchise_contact_person', contactPerson);
        localStorage.setItem('digiflex_franchise_partner_name', partnerName);
        localStorage.setItem('digiflex_franchise_parent_salon', matchedPartner.tenant?.salonName || 'Glamour Salon & Spa');
        localStorage.setItem('digiflex_franchise_parent_salon_legal', matchedPartner.tenant?.legalName || 'Glamour Luxury Wellness Pvt Ltd');
        localStorage.setItem('digiflex_franchise_mobile', matchedPartner.contactPhone || '+91 98260 11450');
        localStorage.setItem('digiflex_franchise_code', matchedPartner.code || 'FRN-ASH-889');
        localStorage.setItem('digiflex_franchise_region', matchedPartner.region || 'Indore & Malwa Region');
      } else if (prevEmail !== targetEmail || !localStorage.getItem('digiflex_franchise_partner_name')) {
        const partnerName = 'Ashish Khopde Outlets LLP';
        const contactPerson = 'Ashish Khopde';
        localStorage.setItem('digiflex_franchise_owner_name', contactPerson);
        localStorage.setItem('digiflex_franchise_contact_person', contactPerson);
        localStorage.setItem('digiflex_franchise_partner_name', partnerName);
        localStorage.setItem('digiflex_franchise_parent_salon', 'Glamour Salon & Spa');
        localStorage.setItem('digiflex_franchise_parent_salon_legal', 'Glamour Luxury Wellness Pvt Ltd');
        localStorage.setItem('digiflex_franchise_mobile', '+91 98260 11450');
        localStorage.setItem(
          'digiflex_franchise_code',
          'FRN-ASH-889',
        );
      }
      if (userData?.franchiseId) {
        localStorage.setItem('digiflex_franchise_id', userData.franchiseId);
      }
      if (userData?.tenantId) {
        localStorage.setItem('digiflex_tenant_id', userData.tenantId);
      }
      if (userData?.branchIds?.[0]) {
        localStorage.setItem('digiflex_branch_id', userData.branchIds[0]);
      }
    };

    try {
      const loginRes = await authApi.loginFranchise({ email, password });
      await updateSessionForEmail(email, loginRes?.accessToken, loginRes?.user);

      setSuccessMsg('Authentication successful! Opening Franchise Partner Portal...');
      setTimeout(() => {
        window.location.href = '/franchise';
      }, 800);
    } catch (err: any) {
      const serverErr =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null);

      // If backend responded with 401 / 400 or explicit authentication error
      if (err.response && (err.response.status === 401 || err.response.status === 400 || serverErr)) {
        setErrorMsg(serverErr || 'Invalid email or password. Authentication failed.');
        return;
      }

      // Fallback check against saved password in localStorage if backend is unreachable
      const savedPass = localStorage.getItem('digiflex_franchise_password');
      if (savedPass && password !== savedPass) {
        setErrorMsg('Invalid password. Incorrect credentials provided.');
        return;
      }

      console.warn('Backend login fallback to local franchise session:', err);
      await updateSessionForEmail(email);

      setSuccessMsg('Local Franchise Partner Session Granted! Redirecting...');
      setTimeout(() => {
        window.location.href = '/franchise';
      }, 800);
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillDemoPartner = () => {
    setEmail('sanjay.chawla@apexwellness.in');
    setPassword('Franchise@2026!');
    setErrorMsg(null);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await authApi.forgotPassword({ email, portal: 'franchise' });
      setResetSent(true);
      setSuccessMsg('Password reset link sent to your registered email address.');
    } catch (err: any) {
      const serverErr =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null);
      setErrorMsg(serverErr || 'Failed to send password reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F0B1A] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#5A2EA6]/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8C52FF] to-[#5A2EA6] p-0.5 shadow-lg shadow-purple-900/40">
            <div className="w-full h-full bg-[#18112C] rounded-[14px] flex items-center justify-center">
              <Store className="w-5 h-5 text-[#A875FF]" />
            </div>
          </div>
          <div>
            <span className="font-serif font-extrabold text-lg text-white tracking-wide block">
              Salon SaaS
            </span>
            <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase block">
              Franchise &amp; Partner Network
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-xs font-semibold text-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Partner Portal Security Enabled
          </span>
          <a
            href="/login"
            className="text-xs font-semibold text-purple-300 hover:text-white transition-colors underline"
          >
            Salon Staff Login →
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto my-auto py-8 z-10">
        <div className="bg-[#18112C]/90 backdrop-blur-2xl border border-purple-800/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-xs font-extrabold text-purple-200 mb-3">
              <Building2 className="w-3.5 h-3.5 text-[#A875FF]" />
              FRANCHISE PARTNER PORTAL
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-2">
              {isForgotPassword ? 'Reset Password' : 'Partner Console Login'}
            </h1>
            <p className="text-xs text-purple-300">
              {isForgotPassword
                ? 'Enter your registered email address to receive a password reset link'
                : 'Access your franchise territory performance, outlets, royalties, and compliance dossier'}
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-purple-950/50 border border-purple-800/40 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-purple-200 block">
                Demo Partner Credential
              </span>
              <span className="text-[10px] font-mono text-purple-400 block">
                sanjay.chawla@apexwellness.in
              </span>
            </div>
            <button
              type="button"
              onClick={autofillDemoPartner}
              className="px-3 py-1.5 rounded-xl bg-[#5A2EA6] hover:bg-[#6E39CC] text-white text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-purple-950"
            >
              Autofill
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form or Forgot Password Form */}
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-purple-200 block mb-1.5">
                  Official Business Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. partner@apexwellness.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0F0B1A]/80 border border-purple-800/40 rounded-xl text-sm font-semibold text-white placeholder:text-purple-400/50 outline-none focus:border-[#8C52FF] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || resetSent}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8C52FF] to-[#5A2EA6] hover:from-[#9B66FF] hover:to-[#6E39CC] text-white font-extrabold text-sm shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>Sending Link...</span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <Mail className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-purple-200 block mb-1.5">
                  Official Business Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. partner@apexwellness.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0F0B1A]/80 border border-purple-800/40 rounded-xl text-sm font-semibold text-white placeholder:text-purple-400/50 outline-none focus:border-[#8C52FF] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-purple-200 block">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter auto-generated password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0F0B1A]/80 border border-purple-800/40 rounded-xl text-sm font-semibold text-white placeholder:text-purple-400/50 outline-none focus:border-[#8C52FF] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-purple-800 text-[#8C52FF] focus:ring-[#8C52FF] accent-[#8C52FF]"
                  />
                  <span className="text-xs text-purple-300 font-semibold">Remember this session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8C52FF] to-[#5A2EA6] hover:from-[#9B66FF] hover:to-[#6E39CC] text-white font-extrabold text-sm shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span>Authenticating Partner...</span>
                ) : (
                  <>
                    <span>Authenticate &amp; Open Partner Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center text-xs text-purple-400/60 z-10">
        Salon SaaS · Franchise Governance &amp; Multi-Outlet Royalty Network © 2026
      </footer>
    </div>
  );
}
