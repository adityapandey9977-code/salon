import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Copy,
  Edit2,
  ExternalLink,
  Key,
  Layers,
  Lock,
  ShieldCheck,
  Sliders,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { SystemRoleItem } from './CreateEditRoleModal';

interface RoleDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: SystemRoleItem | null;
  onEdit: (role: SystemRoleItem) => void;
  onManagePermissions: (role: SystemRoleItem) => void;
  onDuplicate: (role: SystemRoleItem) => void;
  onToggleStatus: (role: SystemRoleItem) => void;
}

export function RoleDossierModal({
  isOpen,
  onClose,
  role,
  onEdit,
  onManagePermissions,
  onDuplicate,
  onToggleStatus,
}: RoleDossierModalProps) {
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

  if (!isOpen || !role) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                Role Profile Dossier
              </span>
              <span className="text-xs font-mono font-bold text-soft">{role.code}</span>
              <span
                className={cn(
                  'px-2 py-0.2 rounded-full text-[9px] font-bold border',
                  role.roleType === 'System Role'
                    ? 'bg-purple-50 text-[#5A2EA6] border-purple-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200',
                )}
              >
                {role.roleType}
              </span>
            </div>
            <h3 className="font-serif font-bold text-ink text-xl mt-1">{role.name}</h3>
            <p className="text-xs text-muted">
              Authority scope, assigned staff volume, and inherited matrix permissions
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
              <span className="text-[9px] text-soft block uppercase font-bold">Assigned Users</span>
              <strong className="text-base font-serif font-bold text-ink block mt-0.5">
                {role.usersCount} Staff
              </strong>
              <span className="text-[9px] text-emerald-700 font-semibold">Active Roster</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
              <span className="text-[9px] text-soft block uppercase font-bold">Scope</span>
              <strong className="text-xs font-bold text-ink block mt-0.5 truncate">
                {role.scope}
              </strong>
              <span className="text-[9px] text-muted">{role.applicableBranches || 'Network'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
              <span className="text-[9px] text-soft block uppercase font-bold">Permissions</span>
              <strong className="text-base font-serif font-bold text-[#5A2EA6] block mt-0.5">
                {role.permissionsCount} Rules
              </strong>
              <span className="text-[9px] text-muted">Across 13 Modules</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
              <span className="text-[9px] text-soft block uppercase font-bold">Governance</span>
              <strong className="text-xs font-bold text-emerald-700 block mt-0.5">
                ● {role.status}
              </strong>
              <span className="text-[9px] text-muted">Audit Enforced</span>
            </div>
          </div>

          {/* Description Callout */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
            <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
              Operational Mandate &amp; Description
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">{role.description}</p>
          </div>

          {/* Role Audit Metadata */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-soft font-semibold block">Last Configured By</span>
              <strong className="text-ink font-bold">{role.updatedBy}</strong>
            </div>
            <div>
              <span className="text-soft font-semibold block">Revision Timestamp</span>
              <strong className="text-slate-800 font-mono font-bold">{role.lastUpdated}</strong>
            </div>
          </div>

          {/* Accessible vs Restricted Modules Pills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                Accessible Domain Modules ({role.accessibleModules?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => {
                  onManagePermissions(role);
                  onClose();
                }}
                className="text-[10px] font-bold text-[#5A2EA6] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
              >
                <span>Edit in Permission Matrix</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(role.accessibleModules && role.accessibleModules.length > 0
                ? role.accessibleModules
                : ['Operations', 'Clients']
              ).map((mod) => (
                <span
                  key={mod}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#F8F5FF] text-[#5A2EA6] border border-[#5A2EA6]/20 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A2EA6]" />
                  <span>{mod}</span>
                </span>
              ))}
            </div>

            {/* Non-Applicable / Restricted Modules */}
            {role.accessibleModules && role.accessibleModules.length < 13 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Restricted / Non-Applicable Modules
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Finance',
                    'Franchise',
                    'Brand Settings',
                    'Roles & Permissions',
                    'Audit Logs',
                    'Locations',
                    'Marketing',
                    'Reports & Analytics',
                    'Staff',
                    'Inventory',
                  ]
                    .filter((m) => !role.accessibleModules?.includes(m))
                    .map((mod) => (
                      <span
                        key={mod}
                        className="px-2 py-0.5 rounded-lg text-[9px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 opacity-70"
                      >
                        <Lock className="w-2.5 h-2.5" />
                        <span>{mod} (Restricted)</span>
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50 rounded-b-3xl">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
          >
            Close Dossier
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onDuplicate(role);
                onClose();
              }}
              className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate Role</span>
            </Button>

            {role.roleType !== 'System Role' && (
              <Button
                variant="outline"
                onClick={() => {
                  onEdit(role);
                  onClose();
                }}
                className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </Button>
            )}

            <Button
              onClick={() => {
                onManagePermissions(role);
                onClose();
              }}
              className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Manage Matrix</span>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
