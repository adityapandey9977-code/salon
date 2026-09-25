import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '@/shared/api/auth.api';
import { tokenStorage } from '@/shared/api/client';
import { gatewayApi } from '@/shared/api/gateway.api';
import type { GatewayHealthResponse } from '@/shared/api/types';
import { useAuth } from '@/shared/context/AuthContext';

export function SuperAdminLoginPage() {
  const navigate = useNavigate();
  const { login, verifyMfa, user, isAuthenticated, logout } = useAuth();

  // Form State
  const [email, setEmail] = useState('superadmin@digiflex.com');
  const [password, setPassword] = useState('SuperAdmin@123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // MFA Flow
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);

  // Forgot Password Flow
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // Gateway Live Diagnostics
  const [healthStatus, setHealthStatus] = useState<GatewayHealthResponse | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const checkGatewayStatus = async () => {
    setIsCheckingHealth(true);
    const start = performance.now();
    try {
      const res = await gatewayApi.getHealth();
      const end = performance.now();
      setHealthStatus(res);
      setLatencyMs(Math.round(end - start));
    } catch {
      setHealthStatus(null);
      setLatencyMs(null);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkGatewayStatus();
    const interval = setInterval(checkGatewayStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Quick Demo Auto-fill for Platform Roles
  const fillCredentials = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMsg(null);
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      const response = await login({ email: cleanEmail, password: cleanPassword });

      // MFA required
      if (response.requiresMfa) {
        setMfaChallengeId(response.mfaChallengeId || 'mfa_req');
        setSuccessMsg('MFA challenge triggered. Enter your 6-digit authentication token.');
        setIsSubmitting(false);
        return;
      }

      // Check user permissions
      const profile: any = response.user || (await authApi.getMe());
      const roleCodes: string[] = [];
      if (profile.role) roleCodes.push(String(profile.role).toUpperCase());
      if (Array.isArray(profile.roles)) {
        profile.roles.forEach((r: any) => {
          if (typeof r === 'string') roleCodes.push(r.toUpperCase());
          else if (r && typeof r === 'object') {
            if (r.code) roleCodes.push(r.code.toUpperCase());
            if (r.name) roleCodes.push(r.name.toUpperCase());
          }
        });
      }

      const isPlatformOperator =
        profile.userType === 'PLATFORM' ||
        roleCodes.some((r) =>
          [
            'SUPER_ADMIN',
            'SUPER ADMINISTRATOR',
            'SUPERADMIN',
            'SUPPORT_OPERATOR',
            'BILLING_SPECIALIST',
            'SECURITY_AUDITOR',
            'OPERATOR',
            'PLATFORM_ADMIN',
          ].includes(r),
        );

      if (!isPlatformOperator) {
        setErrorMsg(
          `Access Denied: Account '${profile.email}' is a tenant user, not a platform operator. Redirecting to Tenant Admin...`,
        );
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1500);
        return;
      }

      setSuccessMsg('Authenticated as Platform Operator. Opening Console...');
      setTimeout(() => {
        window.location.href = '/super-admin';
      }, 500);
    } catch (err: any) {
      console.warn('Super Admin Login Error:', err);
      const apiMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Authentication failed.';

      // Offline dev bypass fallback
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setErrorMsg(
          'API Gateway is currently unreachable. Entering Local SuperAdmin Demo Mode...',
        );
        setTimeout(() => {
          window.location.href = '/super-admin';
        }, 1000);
      } else {
        setErrorMsg(apiMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit MFA Code
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = mfaCode.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your MFA authenticator code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await verifyMfa(fullCode);
      setSuccessMsg('MFA token verified successfully! Access granted.');
      setTimeout(() => {
        window.location.href = '/super-admin';
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Invalid or expired MFA token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus('Requesting password reset link from Identity Service...');
    try {
      await authApi.forgotPassword({ email: forgotEmail });
      setForgotStatus('Password reset link sent to your email. Check your inbox.');
    } catch (err: any) {
      setForgotStatus(
        err.response?.data?.error?.message || 'Password reset request failed. Verify email address.',
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0714] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#c084fc]/30">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-[#5A2EA6]/25 via-[#2b1045]/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#c084fc]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#e6c594]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar: Status & Gateway Monitor */}
      <header className="w-full border-b border-white/10 bg-[#140b20]/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#e6c594] via-[#dfa0a0] to-[#c084fc] flex items-center justify-center font-serif font-black text-sm text-[#12081f] shadow-md shadow-[#e6c594]/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-white tracking-tight">
                Platform
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-[#e9d5ff] border border-purple-500/30">
                Root Security
              </span>
            </div>
            <span className="text-[10px] text-white/50 block">
              Multi-Tenant Global Operations Control
            </span>
          </div>
        </div>

        {/* Live Gateway Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${healthStatus?.status === 'UP'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
                }`}
            />
            <span className="text-white/80 text-[11px] hidden sm:inline">
              {healthStatus?.status === 'UP'
                ? `Gateway :3000 (UP${latencyMs ? ` · ${latencyMs}ms` : ''})`
                : 'Local Offline Mode'}
            </span>
            <button
              type="button"
              onClick={checkGatewayStatus}
              title="Refresh Gateway Health"
              className="text-white/50 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Center Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 py-10">
        <div className="w-full max-w-md">
          {/* Active Session Warning */}
          {isAuthenticated && user && (
            <div className="mb-4 p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 backdrop-blur-md flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#e6c594] uppercase tracking-wider block">
                  Current Session
                </span>
                <p className="font-semibold text-white truncate max-w-[200px]">
                  {user.fullName} ({user.email})
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => (window.location.href = '/super-admin')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#e6c594] to-[#dfa0a0] text-[#140d1a] font-bold text-xs hover:brightness-110 transition cursor-pointer"
                >
                  Enter Portal →
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Login Card */}
          <div className="rounded-3xl bg-[#170e24]/90 border border-purple-500/25 shadow-2xl p-7 sm:p-8 backdrop-blur-xl relative">
            {/* Header Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5A2EA6]/30 border border-purple-400/30 text-[#e9d5ff] text-[10px] font-bold uppercase tracking-wider mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e6c594]" />
                <span>Super Administrator Portal</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Platform Console Login
              </h1>
              <p className="text-xs text-white/60 mt-1">
                Enter your zero-trust administrative credentials
              </p>
            </div>

            {/* 1-Click Autofill Pill */}
            {!mfaChallengeId && (
              <div className="mb-5 p-3 rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-4 h-4 text-[#e6c594] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-[#e6c594] block truncate">
                      Root Super Admin Credential
                    </span>
                    <span className="text-[10px] text-white/50 truncate block">
                      superadmin@digiflex.com
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fillCredentials('superadmin@digiflex.com', 'SuperAdmin@123!')}
                  className="px-2.5 py-1 rounded-lg bg-[#e6c594]/20 hover:bg-[#e6c594]/30 text-[#e6c594] text-[10.5px] font-bold transition cursor-pointer shrink-0"
                >
                  Autofill
                </button>
              </div>
            )}

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{successMsg}</span>
              </div>
            )}

            {/* FORM: Standard Login vs MFA Challenge */}
            {!mfaChallengeId ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Operator Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="superadmin@digiflex.com"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-purple-400/20 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594] transition"
                    />
                    <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                      Master Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] text-[#e6c594] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/5 border border-purple-400/20 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594] transition"
                    />
                    <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-white/40 hover:text-white transition cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-white/10 border-purple-400/30 text-[#e6c594] focus:ring-0"
                    />
                    <span>Remember this session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#e6c594] via-[#dfa0a0] to-[#e6c594] text-[#140d1a] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-[#e6c594]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
                >
                  {isSubmitting ? (
                    <span>Authenticating Identity...</span>
                  ) : (
                    <>
                      <span>Authenticate &amp; Open Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* MFA CHALLENGE FORM */
              <form onSubmit={handleMfaSubmit} className="space-y-5">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-[#e6c594] flex items-center justify-center mx-auto mb-3">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">Enter MFA Passcode</h3>
                  <p className="text-xs text-white/60 mt-1">
                    Enter the 6-digit TOTP code generated by your Authenticator app
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {mfaCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`mfa-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const newCode = [...mfaCode];
                        newCode[idx] = val;
                        setMfaCode(newCode);
                        if (val && idx < 5) {
                          document.getElementById(`mfa-input-${idx + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !mfaCode[idx] && idx > 0) {
                          document.getElementById(`mfa-input-${idx - 1}`)?.focus();
                        }
                      }}
                      className="w-11 h-12 rounded-xl bg-white/10 border border-purple-400/40 text-center text-lg font-bold text-white focus:outline-none focus:border-[#e6c594]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#e6c594] to-[#dfa0a0] text-[#140d1a] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying Challenge...' : 'Verify MFA Token →'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMfaChallengeId(null);
                    setErrorMsg(null);
                  }}
                  className="w-full text-center text-xs text-white/50 hover:text-white transition cursor-pointer"
                >
                  ← Back to standard credentials
                </button>
              </form>
            )}

            {/* Link to Salon Owner Portal */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-white/60">
              Are you a Salon Owner or Branch Manager?{' '}
              <a href="/login" className="text-[#e6c594] font-semibold hover:underline">
                Go to Tenant Portal →
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#1c122b] border border-purple-500/30 p-6 shadow-2xl text-xs">
            <h3 className="font-serif font-bold text-base text-white mb-1">
              Reset Super Admin Password
            </h3>
            <p className="text-white/60 mb-4 leading-relaxed">
              Enter your registered root email address. Identity Service will send a secure password reset token.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="superadmin@digiflex.com"
                className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-purple-400/20 text-white placeholder-white/30 focus:outline-none focus:border-[#e6c594]"
              />

              {forgotStatus && (
                <div className="p-2.5 rounded-lg bg-white/5 border border-purple-400/20 text-[#e6c594]">
                  {forgotStatus}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setForgotStatus(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#e6c594] to-[#dfa0a0] text-[#140d1a] font-bold transition cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <footer className="w-full border-t border-white/10 bg-[#12081f]/80 backdrop-blur-md px-6 py-3 text-center text-xs text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#e6c594]" />
          <span>Encrypted with JWT RS256 &amp; TLS 1.3 · DPDP Compliant</span>
        </div>
        <div>  Salon &amp; Spa SaaS · Global Platform Operations</div>
      </footer>
    </div>
  );
}

export default SuperAdminLoginPage;
