import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Bell,
  Building2,
  Calendar,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Info,
  Package,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { AdminNotification, NotificationSeverity } from '../data/notificationsData';

interface NotificationDropdownProps {
  notifications: AdminNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: AdminNotification) => void;
}

export function NotificationDropdown({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}: NotificationDropdownProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Alerts'>('All');

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.isRead;
    if (activeFilter === 'Alerts') return n.severity === 'Critical' || n.severity === 'Warning';
    return true;
  });

  const getSeverityIcon = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'Critical':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'Warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'Success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Info':
      default:
        return <Info className="w-3.5 h-3.5 text-[#5A2EA6]" />;
    }
  };

  const getSeverityBadgeClass = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Info':
      default:
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
    }
  };

  const handleItemClick = (notif: AdminNotification) => {
    onMarkAsRead(notif.id);
    onClose();
    if (onSelectNotification) {
      onSelectNotification(notif);
    }
    navigate(`/notifications?id=${notif.id}`);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-11 z-[999] w-[420px] max-w-[92vw] bg-white rounded-2xl shadow-[0_20px_60px_rgba(90,46,166,0.22)] border border-purple-100/90 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs"
    >
      {/* Header */}
      <div className="px-4.5 py-3.5 bg-gradient-to-r from-[#FAF8FC] to-white border-b border-purple-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5A2EA6]/10 text-[#5A2EA6] grid place-items-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-ink tracking-tight flex items-center gap-1.5">
              <span>Notifications &amp; Alerts</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9.5px] font-extrabold">
                  {unreadCount} New
                </span>
              )}
            </h4>
            <span className="text-[10px] text-muted">
              Real-time enterprise alerts &amp; exception feeds
            </span>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[10.5px] font-bold text-[#5A2EA6] hover:text-[#4a2489] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
            title="Mark all as read"
          >
            <CheckCheck className="w-3 h-3" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 bg-[#FCFAFF] border-b border-purple-50 flex items-center gap-1.5">
        {(['All', 'Unread', 'Alerts'] as const).map((tab) => {
          const count =
            tab === 'All'
              ? notifications.length
              : tab === 'Unread'
                ? unreadCount
                : notifications.filter((n) => n.severity === 'Critical' || n.severity === 'Warning')
                    .length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer border',
                activeFilter === tab
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-3xs'
                  : 'bg-white text-soft border-purple-100 hover:bg-purple-50',
              )}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto custom-scroll divide-y divide-purple-50/80">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-[#5A2EA6] mx-auto grid place-items-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <strong className="text-xs text-ink block font-bold">
              All clear! No notifications
            </strong>
            <p className="text-[11px] text-muted">
              You have resolved all operational alerts in this view.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={cn(
                'p-3.5 transition-colors cursor-pointer flex items-start gap-3 select-none group',
                !notif.isRead
                  ? 'bg-purple-50/35 hover:bg-purple-50/70'
                  : 'bg-white hover:bg-slate-50',
              )}
            >
              {/* Severity Icon Avatar */}
              <div
                className={cn(
                  'w-8 h-8 rounded-xl border grid place-items-center shrink-0 mt-0.5 shadow-3xs',
                  notif.severity === 'Critical'
                    ? 'bg-rose-50 border-rose-200'
                    : notif.severity === 'Warning'
                      ? 'bg-amber-50 border-amber-200'
                      : notif.severity === 'Success'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-purple-50 border-purple-200',
                )}
              >
                {getSeverityIcon(notif.severity)}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={cn(
                      'text-[9px] font-extrabold px-1.5 py-0.2 rounded-md border uppercase tracking-wider',
                      getSeverityBadgeClass(notif.severity),
                    )}
                  >
                    {notif.severity}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{notif.timeAgo}</span>
                    {!notif.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-1 inline-block animate-pulse" />
                    )}
                  </div>
                </div>

                <strong className="text-xs text-ink block leading-snug group-hover:text-[#5A2EA6] transition-colors truncate">
                  {notif.title}
                </strong>
                <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                  {notif.summary}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-soft">
                  <span className="font-semibold flex items-center gap-1 truncate max-w-[180px]">
                    <Building2 className="w-2.5 h-2.5 text-[#5A2EA6]" />
                    {notif.branch}
                  </span>
                  <span className="text-[#5A2EA6] font-bold group-hover:underline flex items-center gap-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#FAF8FC] border-t border-purple-50 flex items-center justify-between">
        <span className="text-[10.5px] text-muted">
          Showing {filteredNotifications.length} of {notifications.length} alerts
        </span>
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/notifications');
          }}
          className="text-xs font-bold text-[#5A2EA6] hover:text-[#4a2489] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
        >
          <span>Open Notification Center</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default NotificationDropdown;
