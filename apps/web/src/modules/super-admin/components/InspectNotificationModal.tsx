import { Button, cn } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  LifeBuoy,
  RotateCcw,
  Server,
  ShieldAlert,
  SlidersHorizontal,
  Unplug,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { BaseModal } from './BaseModal';

export type NotificationType =
  | 'New Tenant'
  | 'Subscription Expiring'
  | 'Support Ticket'
  | 'Integration Failure'
  | 'System Alert'
  | 'Configuration Change';

export type NotificationSeverity = 'Info' | 'Warning' | 'Critical' | 'Success';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  tenantName: string;
  severity: NotificationSeverity;
  timestamp: string;
  isRead: boolean;
  correlationId: string;
  sourceModule: string;
  details?: {
    planName?: string;
    expiryDays?: number;
    ticketId?: string;
    ticketPriority?: string;
    integrationName?: string;
    errorCode?: string;
    affectedEndpoint?: string;
    systemMetric?: string;
    changedBy?: string;
    beforeValue?: string;
    afterValue?: string;
    actionUrl?: string;
  };
}

interface InspectNotificationModalProps {
  notification: NotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleRead: (id: string) => void;
}

export const InspectNotificationModal: React.FC<InspectNotificationModalProps> = ({
  notification,
  isOpen,
  onClose,
  onToggleRead,
}) => {
  if (!notification) return null;

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'New Tenant':
        return <Building2 className="w-5 h-5 text-[#7C3AED]" />;
      case 'Subscription Expiring':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Support Ticket':
        return <LifeBuoy className="w-5 h-5 text-blue-500" />;
      case 'Integration Failure':
        return <Unplug className="w-5 h-5 text-rose-500" />;
      case 'System Alert':
        return <Activity className="w-5 h-5 text-purple-600" />;
      case 'Configuration Change':
        return <SlidersHorizontal className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#7C3AED]" />;
    }
  };

  const getSeverityBadge = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Critical
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Warning
          </span>
        );
      case 'Success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Success
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Info className="w-3 h-3 text-blue-600" /> Info
          </span>
        );
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={notification.title}
      subtitle={`Notification Event Payload • ${notification.id}`}
      icon={getTypeIcon(notification.type)}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Banner Summary Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F9F5FF] rounded-2xl border border-[#7C3AED]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
              {getTypeIcon(notification.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-slate-800">{notification.type}</span>
                {getSeverityBadge(notification.severity)}
              </div>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Tenant: <strong className="text-slate-700">{notification.tenantName}</strong> •{' '}
                {notification.timestamp}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleRead(notification.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border',
                notification.isRead
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-transparent shadow-sm',
              )}
            >
              {notification.isRead ? 'Mark Unread' : 'Mark as Read'}
            </button>
          </div>
        </div>

        {/* Message Content Body */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider text-muted">
            Event Description & Content
          </h4>
          <p className="text-[14px] text-slate-800 leading-relaxed font-normal">
            {notification.message}
          </p>
        </div>

        {/* Contextual Technical Payload Details */}
        {notification.details && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-[12.5px] font-bold text-slate-800 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#7C3AED]" /> Technical Telemetry & Parameters
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                  Correlation ID
                </span>
                <span className="font-mono text-slate-800 font-medium">
                  {notification.correlationId}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                  Origin Module
                </span>
                <span className="text-slate-800 font-medium">{notification.sourceModule}</span>
              </div>

              {notification.details.planName && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                    Subscription Plan
                  </span>
                  <span className="text-slate-800 font-medium">
                    {notification.details.planName}
                  </span>
                </div>
              )}

              {notification.details.expiryDays !== undefined && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                    Expiration Window
                  </span>
                  <span className="text-amber-700 font-bold">
                    {notification.details.expiryDays} Days Remaining
                  </span>
                </div>
              )}

              {notification.details.ticketId && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                    Support Ticket
                  </span>
                  <span className="text-blue-700 font-medium">
                    {notification.details.ticketId} ({notification.details.ticketPriority} Priority)
                  </span>
                </div>
              )}

              {notification.details.integrationName && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                    Integration Endpoint
                  </span>
                  <span className="text-rose-700 font-medium">
                    {notification.details.integrationName}
                  </span>
                </div>
              )}

              {notification.details.errorCode && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                    Error Response Code
                  </span>
                  <span className="font-mono text-rose-600 font-bold">
                    {notification.details.errorCode}
                  </span>
                </div>
              )}

              {notification.details.changedBy && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                    Operator / User
                  </span>
                  <span className="text-slate-800 font-medium">
                    {notification.details.changedBy}
                  </span>
                </div>
              )}
            </div>

            {/* Before / After Diff for Configuration Change */}
            {notification.type === 'Configuration Change' &&
              (notification.details.beforeValue || notification.details.afterValue) && (
                <div className="mt-3 p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-[12px] space-y-2">
                  <div className="text-slate-400 text-[11px] font-sans font-semibold uppercase tracking-wider">
                    State Mutation Diff
                  </div>
                  <div className="text-rose-400">
                    - Previous State: {notification.details.beforeValue || 'N/A'}
                  </div>
                  <div className="text-emerald-400">
                    + Updated State: {notification.details.afterValue || 'N/A'}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close Window
          </Button>

          {notification.details?.actionUrl && (
            <Button
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white gap-2"
              onClick={() => {
                onClose();
                window.location.href = `/super-admin${notification.details?.actionUrl}`;
              }}
            >
              Navigate to Module <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </BaseModal>
  );
};
