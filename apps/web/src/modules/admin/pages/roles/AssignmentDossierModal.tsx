import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Layers,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface UserRoleAssignment {
  id: string;
  userName: string;
  empId: string;
  email: string;
  phone: string;
  roleName: string;
  roleId: string;
  branch: string;
  scope: 'Brand-wide' | 'Single Branch' | 'Selected Branches' | 'Franchise Scope';
  status: 'Active' | 'Inactive' | 'Pending';
  assignedDate: string;
  assignedBy: string;
}

interface AssignmentDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: UserRoleAssignment | null;
  onChangeRole: (assignment: UserRoleAssignment) => void;
}

export function AssignmentDossierModal({
  isOpen,
  onClose,
  assignment,
  onChangeRole,
}: AssignmentDossierModalProps) {
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

  if (!isOpen || !assignment) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                Staff Assignment Dossier
              </span>
              <span className="text-xs font-mono font-bold text-soft">{assignment.empId}</span>
            </div>
            <h3 className="font-serif font-bold text-ink text-xl mt-1">{assignment.userName}</h3>
            <p className="text-xs text-muted">
              Role mandate, inherited privileges, and organizational branch scope
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
          {/* User Contact & Branch Card */}
          <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                Staff Member Profile
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● {assignment.status} Assignment
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-soft block text-[10px] font-semibold">
                  Assigned Salon Outlet
                </span>
                <strong className="text-ink font-bold">{assignment.branch}</strong>
              </div>
              <div>
                <span className="text-soft block text-[10px] font-semibold">
                  Organizational Scope
                </span>
                <strong className="text-purple-700 font-bold">{assignment.scope}</strong>
              </div>
              <div>
                <span className="text-soft block text-[10px] font-semibold">Email Address</span>
                <span className="text-slate-800 font-medium">{assignment.email}</span>
              </div>
              <div>
                <span className="text-soft block text-[10px] font-semibold">Contact Phone</span>
                <span className="text-slate-800 font-mono font-medium">{assignment.phone}</span>
              </div>
            </div>
          </div>

          {/* Assigned Role Summary */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
            <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
              Active Assigned Role
            </span>
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-sm font-bold text-ink block">{assignment.roleName}</strong>
                <span className="text-[10px] text-muted">
                  Assigned by {assignment.assignedBy} on {assignment.assignedDate}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  onChangeRole(assignment);
                  onClose();
                }}
                className="h-[30px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
              >
                Change Role
              </Button>
            </div>
          </div>

          {/* Section 12 PRD: Inherited Permissions Breakdown */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                Inherited Permissions from {assignment.roleName}
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                100% Policy Compliant
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Clients Module</span>
                <span className="font-mono text-[10px] text-[#5A2EA6] font-bold">
                  View · Create · Edit · Export
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  Operations (Calendar &amp; Walk-ins)
                </span>
                <span className="font-mono text-[10px] text-[#5A2EA6] font-bold">
                  View · Create · Edit · Approve
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Staff Shifts &amp; Roster</span>
                <span className="font-mono text-[10px] text-[#5A2EA6] font-bold">
                  View · Approve
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Finance &amp; Brand Settings</span>
                <span className="font-mono text-[10px] text-rose-700 font-bold">
                  Restricted (No Access)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 rounded-b-3xl">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
          >
            Close Dossier
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
