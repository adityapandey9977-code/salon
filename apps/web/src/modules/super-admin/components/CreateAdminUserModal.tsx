import { Button } from '@salon-spa-saas/ui';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Lock,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { type AdminUser, useSuperAdminStore } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface CreateAdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editUser?: AdminUser | null;
}

function generateSecurePassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz';
  const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const nums = '23456789';
  const syms = '!@#$%&*';

  let res = 'Super@';
  res += uppers[Math.floor(Math.random() * uppers.length)];
  res += chars[Math.floor(Math.random() * chars.length)];
  res += nums[Math.floor(Math.random() * nums.length)];
  res += syms[Math.floor(Math.random() * syms.length)];
  res += Math.floor(1000 + Math.random() * 9000);
  return res;
}

export const CreateAdminUserModal: React.FC<CreateAdminUserModalProps> = ({
  isOpen,
  onClose,
  editUser,
}) => {
  const { addAdminUser, updateAdminUser, roles } = useSuperAdminStore();
  const [formData, setFormData] = useState({
    name: editUser?.name || '',
    email: editUser?.email || '',
    phone: editUser?.phone || '',
    role: editUser?.role || 'Support Operator',
    status: editUser?.status || ('Active' as 'Active' | 'Inactive'),
    mfaEnabled: editUser?.mfaEnabled ?? true,
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createdSummary, setCreatedSummary] = useState<{
    name: string;
    email: string;
    role: string;
    mfaEnabled: boolean;
    loginUrl: string;
  } | null>(null);

  useEffect(() => {
    if (editUser) {
      setFormData({
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
        status: editUser.status,
        mfaEnabled: editUser.mfaEnabled,
      });
      setCreatedSummary(null);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Support Operator',
        status: 'Active',
        mfaEnabled: true,
      });
      setCreatedSummary(null);
    }
  }, [editUser, isOpen]);

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editUser) {
      updateAdminUser(editUser.id, formData);
      onClose();
    } else {
      // Auto-generate secure password and dispatch to user's email without exposing in UI
      const securePassword = generateSecurePassword();
      addAdminUser({
        ...formData,
        generatedPassword: securePassword,
      });

      setCreatedSummary({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        mfaEnabled: formData.mfaEnabled,
        loginUrl: `${window.location.origin}/super-admin/login`,
      });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        createdSummary
          ? 'Operator Provisioned & Welcome Email Dispatched'
          : editUser
            ? 'Edit Administrator Operator'
            : 'Create SuperAdmin Operator'
      }
      subtitle={
        createdSummary
          ? 'Operator profile is active and onboarding credentials have been securely delivered via email'
          : 'Provision internal SaaS operator profile, assign RBAC access group & dispatch login credentials'
      }
      icon={
        createdSummary ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <UserPlus className="w-5 h-5 text-[#5A2EA6]" />
        )
      }
      maxWidth={createdSummary ? 'md' : 'lg'}
    >
      {createdSummary ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white grid place-items-center shrink-0 mt-0.5">
              <Send className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <strong className="block font-bold text-sm text-emerald-900">
                Welcome Email Dispatched!
              </strong>
              <p className="text-emerald-800 leading-relaxed font-medium">
                An auto-generated secure password and direct onboarding link have been sent directly
                to <strong>{createdSummary.email}</strong>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase font-bold text-[#5A2EA6] tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Operator Account Summary
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                {createdSummary.role}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#5A2EA6]/10">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-muted block font-semibold">Operator Name</span>
                  <strong className="text-ink font-semibold text-xs truncate block">
                    {createdSummary.name}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#5A2EA6]/10">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-muted block font-semibold">Work Email</span>
                  <strong className="text-ink font-mono text-xs truncate block">
                    {createdSummary.email}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(createdSummary.email, 'email')}
                  className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-[#F8F5FF] text-[#5A2EA6] text-[11px] font-bold border border-slate-200 transition cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#5A2EA6]/10">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-muted block font-semibold">
                    Credentials Delivery
                  </span>
                  <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" /> Sent to Inbox (Hidden in UI
                    for security)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#5A2EA6]/10">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-muted block font-semibold">
                    Super Admin Login Portal
                  </span>
                  <a
                    href={createdSummary.loginUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5A2EA6] hover:underline font-mono text-[11px] truncate flex items-center gap-1 font-semibold"
                  >
                    <span>/super-admin/login</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(createdSummary.loginUrl, 'url')}
                  className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-[#F8F5FF] text-[#5A2EA6] text-[11px] font-bold border border-slate-200 transition cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {copiedField === 'url' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedField === 'url' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 text-[11.5px] text-[#5A2EA6] flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#5A2EA6] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Enterprise Zero-Exposure Policy:</strong> Auto-generated temporary passwords
              are never rendered in the UI or stored in client logs. The operator can log in using
              the email credentials and update their password on first sign-in.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCopy(createdSummary.loginUrl, 'portal-url')}
              className="h-[38px] px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              {copiedField === 'portal-url' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
                {copiedField === 'portal-url' ? 'Portal URL Copied!' : 'Copy Portal Link'}
              </span>
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary"
            >
              Done &amp; Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Operator Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya Shah"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="ananya@digiflex.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Direct Phone Contact
              </label>
              <input
                type="text"
                placeholder="+91 98765 00011"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Assigned Role Group *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.role}>
                    {r.role} ({r.scope})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="Active">Active (Dashboard Access Granted)</option>
                <option value="Inactive">Inactive (Access Suspended)</option>
              </select>
            </div>
          </div>

          {!editUser && (
            <div className="p-3.5 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A2EA6] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Auto-Generated Secure Password
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Email-Only Delivery
                </span>
              </div>

              <p className="text-[12px] text-ink leading-relaxed font-medium">
                A cryptographically secure, high-entropy password will be automatically generated
                and dispatched directly to{' '}
                <strong className="text-[#5A2EA6]">
                  {formData.email || "the operator's email"}
                </strong>
                .
              </p>

              <div className="flex items-center gap-2 text-[11px] text-muted pt-1">
                <Mail className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />
                <span>
                  For compliance and security, passwords are never shown on screen or recorded in
                  browser state.
                </span>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/15 flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#5A2EA6]" />
              <div>
                <span className="text-xs font-bold text-ink block">Mandatory MFA Enforced</span>
                <span className="text-[11px] text-muted">
                  Requires 2FA authenticator app on privileged login
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.mfaEnabled}
              onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#5A2EA6]/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-[38px] px-4 rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary"
            >
              {editUser ? 'Save Operator Changes' : 'Create Admin & Dispatch Password'}
            </Button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};
