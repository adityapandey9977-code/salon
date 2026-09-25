import { Button } from '@salon-spa-saas/ui';
import { Calendar, Megaphone, Radio, ShieldAlert, Users } from 'lucide-react';
import type React from 'react';
import type { Announcement } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface AnnouncementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement | null;
}

export const AnnouncementDetailsModal: React.FC<AnnouncementDetailsModalProps> = ({
  isOpen,
  onClose,
  announcement,
}) => {
  if (!announcement) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={announcement.title}
      subtitle={`Audience: ${announcement.audience} • Published: ${announcement.date}`}
      icon={<Megaphone className="w-5 h-5" />}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Quick Info Badges */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">
              Broadcast Status
            </span>
            <span className="text-xs font-bold text-[#5A2EA6] block mt-1">
              {announcement.status}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Priority Tier</span>
            <span className="text-xs font-bold text-ink block mt-1">{announcement.priority}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Target Audience</span>
            <span className="text-xs font-bold text-ink block mt-1 truncate">
              {announcement.audience}
            </span>
          </div>
        </div>

        {/* Active Channels */}
        <div className="p-3.5 rounded-xl border border-line bg-slate-50/60 space-y-1.5">
          <span className="text-[10.5px] font-bold text-soft uppercase tracking-wider block">
            Active Distribution Channels
          </span>
          <div className="flex flex-wrap gap-1.5">
            {announcement.channels.map((ch) => (
              <span
                key={ch}
                className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6]"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Announcement Message Body */}
        <div className="p-4 rounded-xl border border-line bg-white space-y-1.5">
          <span className="text-[10.5px] font-bold text-soft uppercase tracking-wider block">
            Full Broadcast Content
          </span>
          <p className="text-xs text-ink leading-relaxed font-medium">{announcement.content}</p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-semibold premium-btn-primary"
          >
            Close Details
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
