import { Button } from '@salon-spa-saas/ui';
import { Bell, Plus, Send } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { BaseModal } from './BaseModal';
import type {
  NotificationItem,
  NotificationSeverity,
  NotificationType,
} from './InspectNotificationModal';

interface SimulateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNotification: (notification: NotificationItem) => void;
}

export const SimulateNotificationModal: React.FC<SimulateNotificationModalProps> = ({
  isOpen,
  onClose,
  onAddNotification,
}) => {
  const [type, setType] = useState<NotificationType>('New Tenant');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [tenantName, setTenantName] = useState('Velvet Lounge & Spa');
  const [severity, setSeverity] = useState<NotificationSeverity>('Info');

  const handleTypeChange = (selectedType: NotificationType) => {
    setType(selectedType);
    switch (selectedType) {
      case 'New Tenant':
        setTitle('New Salon Tenant Registered');
        setMessage(
          'A new salon branch Velvet Lounge & Spa has successfully completed enterprise onboarding.',
        );
        setSeverity('Success');
        break;
      case 'Subscription Expiring':
        setTitle('Subscription Plan Renewal Notice');
        setMessage(
          'Subscription for Velvet Lounge & Spa will expire in 5 days. Auto-renew retry scheduled.',
        );
        setSeverity('Warning');
        break;
      case 'Support Ticket':
        setTitle('High Priority Support Ticket Logged');
        setMessage(
          'TCK-1049: Payment gateway integration timeout reported during weekend peak hours.',
        );
        setSeverity('Critical');
        break;
      case 'Integration Failure':
        setTitle('WhatsApp Business API Webhook Error');
        setMessage(
          'Webhook endpoint connection timeout (HTTP 504) encountered for outbound appointment reminders.',
        );
        setSeverity('Critical');
        break;
      case 'System Alert':
        setTitle('System Resource Capacity Warning');
        setMessage(
          'Redis memory cache node utilization crossed 85% threshold. Automated key eviction initiated.',
        );
        setSeverity('Warning');
        break;
      case 'Configuration Change':
        setTitle('Platform Tax Policy Updated');
        setMessage(
          'Global default GST rate updated from 18% to 18% inclusive with custom invoice branding rules.',
        );
        setSeverity('Info');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotification: NotificationItem = {
      id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      title,
      message,
      tenantName: tenantName || 'Global Operations',
      severity,
      timestamp: 'Just now',
      isRead: false,
      correlationId: `COR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      sourceModule:
        type === 'New Tenant'
          ? 'Tenant Lifecycle Engine'
          : type === 'Subscription Expiring'
            ? 'Billing & Subscriptions'
            : type === 'Support Ticket'
              ? 'Customer Support Service'
              : type === 'Integration Failure'
                ? 'Integration Webhook Dispatcher'
                : type === 'System Alert'
                  ? 'Infrastructure Telemetry'
                  : 'Platform Governance Config',
      details: {
        changedBy: 'Super Admin Operator',
        actionUrl:
          type === 'New Tenant'
            ? '/salons'
            : type === 'Subscription Expiring'
              ? '/subscription-plans'
              : type === 'Support Ticket'
                ? '/support-tickets'
                : type === 'Integration Failure'
                  ? '/integrations'
                  : '/settings',
      },
    };

    onAddNotification(newNotification);
    onClose();
    setTitle('');
    setMessage('');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Trigger Test Notification Event"
      subtitle="Simulate real-time system alerts and platform notification events"
      icon={<Bell className="w-5 h-5 text-white" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
            Notification Element / Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(
              [
                'New Tenant',
                'Subscription Expiring',
                'Support Ticket',
                'Integration Failure',
                'System Alert',
                'Configuration Change',
              ] as NotificationType[]
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`px-3 py-2 rounded-xl text-[12px] font-semibold text-left transition-all border ${
                  type === t
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as NotificationSeverity)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="Info">Info</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1">Target Tenant</label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="e.g. Indrapuri Salon"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-slate-700 mb-1">
            Notification Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter alert title"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        <div>
          <label className="block text-[12px] font-bold text-slate-700 mb-1">
            Event Message Body
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter detailed payload message"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white gap-2">
            <Send className="w-4 h-4" /> Dispatch Notification
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
