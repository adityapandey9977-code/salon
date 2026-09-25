import { Button } from '@salon-spa-saas/ui';
import { Calendar, Lock, Mail, Phone, ShieldCheck, UserCheck } from 'lucide-react';
import type React from 'react';
import type { AdminUser } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Operator Profile: ${user.name}`}
      subtitle={`User ID: ${user.id} • ${user.role}`}
      icon={<UserCheck className="w-5 h-5" />}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Account Status</span>
            <span className="text-xs font-bold text-emerald-700 block mt-1">{user.status}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">MFA Protection</span>
            <span className="text-xs font-bold text-[#5A2EA6] block mt-1">
              {user.mfaEnabled ? 'Enforced (Active)' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-line space-y-2.5 text-xs text-ink">
          <div className="flex justify-between py-1.5 border-b border-line/50">
            <span className="text-muted flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#5A2EA6]" /> Work Email:
            </span>
            <strong className="font-semibold">{user.email}</strong>
          </div>
          <div className="flex justify-between py-1.5 border-b border-line/50">
            <span className="text-muted flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#5A2EA6]" /> Direct Phone:
            </span>
            <strong className="font-semibold">{user.phone}</strong>
          </div>
          <div className="flex justify-between py-1.5 border-b border-line/50">
            <span className="text-muted flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A2EA6]" /> Assigned Role Group:
            </span>
            <strong className="font-semibold text-[#5A2EA6]">{user.role}</strong>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" /> Member Since:
            </span>
            <strong className="font-semibold">{user.createdAt}</strong>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-semibold premium-btn-primary"
          >
            Close Profile
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
