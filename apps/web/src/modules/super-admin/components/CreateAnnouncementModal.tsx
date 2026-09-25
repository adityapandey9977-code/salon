import { Button } from '@salon-spa-saas/ui';
import { Bell, Megaphone, Send, ShieldAlert, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { type Announcement, useSuperAdminStore } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  editAnnouncement?: Announcement | null;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpen,
  onClose,
  editAnnouncement,
}) => {
  const { addAnnouncement, updateAnnouncement } = useSuperAdminStore();
  const [formData, setFormData] = useState({
    title: editAnnouncement?.title || '',
    content: editAnnouncement?.content || '',
    audience: editAnnouncement?.audience || 'All Tenants & Owners',
    priority: editAnnouncement?.priority || ('Info' as 'Info' | 'Warning' | 'Critical'),
    status: editAnnouncement?.status || ('Active' as 'Active' | 'Sent' | 'Draft' | 'Archived'),
    channels: editAnnouncement?.channels || ['In-App Banner'],
  });

  useEffect(() => {
    if (editAnnouncement) {
      setFormData({
        title: editAnnouncement.title,
        content: editAnnouncement.content,
        audience: editAnnouncement.audience,
        priority: editAnnouncement.priority,
        status: editAnnouncement.status,
        channels: editAnnouncement.channels || ['In-App Banner'],
      });
    } else {
      setFormData({
        title: '',
        content: '',
        audience: 'All Tenants & Owners',
        priority: 'Info',
        status: 'Active',
        channels: ['In-App Banner', 'Email'],
      });
    }
  }, [editAnnouncement, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    if (editAnnouncement) {
      updateAnnouncement(editAnnouncement.id, formData);
    } else {
      addAnnouncement(formData);
    }

    onClose();
  };

  const handleChannelToggle = (channelName: string) => {
    const exists = formData.channels.includes(channelName);
    if (exists) {
      setFormData({
        ...formData,
        channels: formData.channels.filter((c) => c !== channelName),
      });
    } else {
      setFormData({
        ...formData,
        channels: [...formData.channels, channelName],
      });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editAnnouncement ? 'Edit Platform Announcement' : 'Create Platform Announcement'}
      subtitle="Broadcast global platform advisories, release notes & maintenance alerts according to PRD notification rules"
      icon={<Megaphone className="w-5 h-5" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Announcement Title / Subject *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. System Scheduled Maintenance Q3"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Target Audience Scope *
            </label>
            <select
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All Tenants & Owners">All Tenants & Owners</option>
              <option value="Branch Managers">Branch Managers Only</option>
              <option value="Front Desk Staff">Front Desk Staff</option>
              <option value="Professional Stylists">Professional Stylists</option>
              <option value="Enterprise Plan Tier">Enterprise Plan Tier</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Priority Severity Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="Info">Info (Release / General)</option>
              <option value="Warning">Warning (Maintenance)</option>
              <option value="Critical">Critical (Urgent Alert)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Broadcast Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="Active">Active (Live Banner)</option>
              <option value="Sent">Sent (Completed)</option>
              <option value="Draft">Draft (Unpublished)</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Broadcast Channels Selection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-2">
            Broadcast Distribution Channels
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {['In-App Banner', 'Email', 'WhatsApp Broadcast', 'SMS Text'].map((ch) => {
              const isSelected = formData.channels.includes(ch);
              return (
                <div
                  key={ch}
                  onClick={() => handleChannelToggle(ch)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-[#5A2EA6] bg-[#F8F5FF]'
                      : 'border-[#5A2EA6]/15 bg-white hover:border-[#5A2EA6]/30'
                  }`}
                >
                  <span className="text-xs font-medium text-ink">{ch}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Announcement Body Message *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Write the full broadcast message content..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-3 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
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
            className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {editAnnouncement ? 'Save Broadcast Changes' : 'Broadcast Announcement'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
