import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  DollarSign,
  Edit2,
  Gift,
  Layers,
  Scissors,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import type { FullMembershipRecord } from './CreateMembershipModal';

interface MembershipDetailsDrawerProps {
  membership: FullMembershipRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (mem: FullMembershipRecord) => void;
  onToggleStatus: (mem: FullMembershipRecord) => void;
}

export function MembershipDetailsDrawer({
  membership,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
}: MembershipDetailsDrawerProps) {
  const { toast } = useToast();

  if (!isOpen || !membership) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full shadow-[0_25px_70px_rgba(90,46,166,0.25)] border-l border-purple-100 flex flex-col animate-in slide-in-from-right duration-300 text-xs">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                {membership.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] font-bold text-[10px]">
                {membership.tier}
              </span>
            </div>
            <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight mt-1">
              {membership.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1 space-y-5">
          {/* Member KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] text-muted uppercase font-bold block">Annual Fee</span>
              <strong className="text-base font-bold font-serif text-[#5A2EA6] mt-0.5 block">
                ₹{membership.price.toLocaleString('en-IN')}
              </strong>
            </div>
            <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Active Members
              </span>
              <strong className="text-base font-bold font-serif text-emerald-700 mt-0.5 block">
                {membership.activeMembers} VIPs
              </strong>
            </div>
            <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Expiring (30d)
              </span>
              <strong className="text-base font-bold font-serif text-amber-700 mt-0.5 block">
                {membership.expiringMembers} Due
              </strong>
            </div>
            <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] text-muted uppercase font-bold block">Renewed</span>
              <strong className="text-base font-bold font-serif text-ink mt-0.5 block">
                {membership.renewedCount} Renewals
              </strong>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100/80 space-y-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Tier Privileges &amp; Scope
            </h4>
            <p className="text-xs text-muted leading-relaxed">{membership.description}</p>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="text-soft">
                Validity: <strong>{membership.durationMonths} Months</strong>
              </span>
              <span className="text-soft">
                Renewal: <strong>{membership.renewalRule}</strong>
              </span>
            </div>
          </div>

          {/* Benefits Catalog */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              Enrolled Privilege Benefits ({membership.benefits.length})
            </h4>
            <div className="space-y-2">
              {membership.benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between"
                >
                  <div>
                    <strong className="text-ink text-xs block">{b.name}</strong>
                    <span className="text-[10px] text-muted">
                      {b.applicableScope} · {b.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] block">
                      {b.value}
                    </span>
                    <span className="text-[9.5px] text-muted block mt-0.5">{b.usageLimit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Availability */}
          <div className="p-4 rounded-2xl bg-white border border-purple-100 space-y-1 text-xs">
            <span className="text-muted uppercase font-bold text-[10px] block">
              Cross-Branch Eligibility
            </span>
            <strong className="text-ink">{membership.branchAvailability.join(', ')}</strong>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-purple-50 bg-white shrink-0 flex items-center justify-between">
          <button
            onClick={() => onToggleStatus(membership)}
            className="h-9 px-3.5 rounded-xl text-xs font-bold text-soft bg-slate-100 hover:bg-slate-200 cursor-pointer border-0"
          >
            {membership.status === 'Active' ? 'Deactivate Tier' : 'Activate Tier'}
          </button>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                onClose();
                onEdit(membership);
              }}
              className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Membership</span>
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default MembershipDetailsDrawer;
