import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  CheckCircle2,
  Info,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface SystemRoleItem {
  id: string;
  name: string;
  code: string;
  roleType: 'System Role' | 'Custom Role';
  description: string;
  usersCount: number;
  scope: 'Brand-wide' | 'Single Branch' | 'Selected Branches' | 'Franchise Scope';
  applicableBranches?: string;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
  updatedBy: string;
  permissionsCount: number;
  accessibleModules?: string[];
}

interface CreateEditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Partial<SystemRoleItem>, configureMatrix: boolean) => Promise<void> | void;
  existingRole?: SystemRoleItem | null;
}

export function CreateEditRoleModal({
  isOpen,
  onClose,
  onSave,
  existingRole,
}: CreateEditRoleModalProps) {
  const isEditing = !!existingRole;

  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState<SystemRoleItem['scope']>('Brand-wide');
  const [applicableBranches, setApplicableBranches] = useState('All Network Salons');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingRole) {
      setRoleName(existingRole.name);
      setRoleCode(existingRole.code);
      setDescription(existingRole.description);
      setScope(existingRole.scope);
      setApplicableBranches(existingRole.applicableBranches || 'All Network Salons');
      setStatus(existingRole.status);
    } else {
      setRoleName('');
      setRoleCode('');
      setDescription('');
      setScope('Brand-wide');
      setApplicableBranches('All Network Salons');
      setStatus('Active');
    }
    setError(null);
    setIsSubmitting(false);
  }, [existingRole, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (configureMatrix: boolean) => {
    if (!roleName.trim()) {
      setError('Role title is required.');
      return;
    }

    const cleanCode = roleCode.trim() || roleName.trim().toUpperCase().replace(/[^A-Z0-9]+/gi, '_');

    const payload: Partial<SystemRoleItem> = {
      name: roleName.trim(),
      code: cleanCode,
      description: description.trim() || 'Custom salon operational role.',
      roleType: existingRole ? existingRole.roleType : 'Custom Role',
      scope,
      applicableBranches,
      status,
      lastUpdated: 'Just now',
      updatedBy: 'Security Administrator',
    };

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(payload, configureMatrix);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save role. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                {isEditing ? 'Edit Role' : 'Create Custom Role'}
              </span>
              <span className="text-xs font-semibold text-soft">RBAC Configuration</span>
            </div>
            <h3 className="font-serif font-bold text-ink text-xl mt-1">
              {isEditing ? `Edit ${existingRole?.name}` : 'New Custom Role Definition'}
            </h3>
            <p className="text-xs text-muted">
              Define role identity, operational mandate, and organizational authority scope
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              {error}
            </div>
          )}

          {/* Role Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-soft font-bold block mb-1">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Colorist Supervisor"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none focus:border-[#5A2EA6]"
              />
            </div>

            <div>
              <label className="text-soft font-bold block mb-1">Role Code Identifier</label>
              <input
                type="text"
                placeholder="e.g. LEAD_COLORIST"
                value={roleCode}
                onChange={(e) => setRoleCode(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-mono font-bold text-[#5A2EA6] outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-soft font-bold block mb-1">
              Role Description &amp; Responsibilities
            </label>
            <textarea
              rows={2}
              placeholder="Outline daily duties, checkout privileges, and workflow permissions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-medium text-ink outline-none resize-none"
            />
          </div>

          {/* Organizational Scope */}
          <div>
            <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
              Organizational Authority Scope
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none cursor-pointer"
            >
              <option value="Brand-wide">Brand-wide (Access across all salons)</option>
              <option value="Single Branch">Single Branch (Assigned salon only)</option>
              <option value="Selected Branches">Selected Branches (Cluster access)</option>
              <option value="Franchise Scope">Franchise Scope (Partner territory)</option>
            </select>
          </div>

          {/* Branch Assignment */}
          {scope !== 'Brand-wide' && (
            <div>
              <label className="text-soft font-bold block mb-1">Applicable Outlets</label>
              <input
                type="text"
                placeholder="e.g. Indore Vijay Nagar, Indore Palasia"
                value={applicableBranches}
                onChange={(e) => setApplicableBranches(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none"
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-soft font-bold block mb-1">Operational Role Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Active')}
                className={cn(
                  'p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer',
                  status === 'Active'
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                    : 'bg-[#F8F5FF] text-slate-700',
                )}
              >
                ● Active Governance
              </button>
              <button
                type="button"
                onClick={() => setStatus('Inactive')}
                className={cn(
                  'p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer',
                  status === 'Inactive'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-[#F8F5FF] text-slate-700',
                )}
              >
                ○ Inactive / Suspended
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-2 text-xs text-purple-900">
            <Info className="w-4 h-4 text-[#5A2EA6] shrink-0" />
            <span>
              Granular 13-module permissions can be configured directly in the Permission Matrix
              after saving.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
            >
              {isSubmitting ? 'Saving...' : 'Save Role'}
            </Button>

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save & Configure Matrix'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
