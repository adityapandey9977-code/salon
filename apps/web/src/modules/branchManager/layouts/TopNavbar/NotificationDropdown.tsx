import { cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Crown,
  ExternalLink,
  Package,
  X,
} from 'lucide-react';
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';

export interface BranchNotification {
  id: string;
  type: 'allergy' | 'inventory' | 'cashier' | 'vip' | 'appointment';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
  badge?: string;
}

export const initialBranchNotifications: BranchNotification[] = [
  {
    id: 'notif-1',
    type: 'allergy',
    title: 'Client Safety Caution: Ammonia Allergy',
    description:
      'Ava Rose (10:15 AM slot) has severe Ammonia allergy. Ensure patch test & non-latex gloves are used.',
    time: '5m ago',
    isRead: false,
    actionUrl: '/customers',
    badge: 'High Caution',
  },
  {
    id: 'notif-2',
    type: 'inventory',
    title: 'Consumable Stock Reorder Warning',
    description:
      "L'Oreal 20 Vol Developer & Keratin Serum below 3-day safety threshold in dispensary.",
    time: '20m ago',
    isRead: false,
    actionUrl: '/retail',
    badge: 'Low Stock',
  },
  {
    id: 'notif-3',
    type: 'vip',
    title: 'VIP Member Arrived: Rohan Verma',
    description:
      'Gold VIP client checked in at reception for Master Stylist appointment with Emma Burke.',
    time: '45m ago',
    isRead: false,
    actionUrl: '/walk-ins',
    badge: 'VIP Member',
  },
  {
    id: 'notif-4',
    type: 'cashier',
    title: 'Shift #01 Cashier Reconciliation',
    description: 'Mid-day cashier collection exceeds ₹40,000 threshold. Verify safe deposit drop.',
    time: '1h ago',
    isRead: true,
    actionUrl: '/payments',
  },
];

interface NotificationDropdownProps {
  notifications: BranchNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationDropdown({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: BranchNotification['type']) => {
    switch (type) {
      case 'allergy':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-rose-600" />;
      case 'vip':
        return <Crown className="w-4 h-4 text-[#5A2EA6]" />;
      case 'cashier':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getBgColor = (type: BranchNotification['type']) => {
    switch (type) {
      case 'allergy':
        return 'bg-amber-50 border-amber-200';
      case 'inventory':
        return 'bg-rose-50 border-rose-200';
      case 'vip':
        return 'bg-purple-50 border-[#5A2EA6]/20';
      case 'cashier':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-88 sm:w-96 bg-white rounded-2xl shadow-[0_20px_50px_rgba(59,38,71,0.18)] border border-line/80 z-50 animate-in fade-in zoom-in-95 duration-150 text-left overflow-hidden select-none"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-line/50 flex items-center justify-between bg-gradient-to-r from-[#FAF8FC] to-white">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-sm text-ink">Branch Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6] text-white text-[10px] font-bold">
              {unreadCount} New
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] font-bold text-[#5A2EA6] hover:underline cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-84 overflow-y-auto divide-y divide-line/40">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-60" />
            <p className="text-xs font-semibold text-ink">All caught up!</p>
            <p className="text-[11px]">No active branch cautions or operational alerts.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onMarkAsRead(n.id);
                if (n.actionUrl) {
                  navigate(n.actionUrl);
                  onClose();
                }
              }}
              className={cn(
                'p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-[#FAF8FC]',
                !n.isRead && 'bg-[#FAF8FC]/70',
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5',
                  getBgColor(n.type),
                )}
              >
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-ink truncate group-hover:text-[#5A2EA6] transition-colors">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-muted shrink-0 font-medium">{n.time}</span>
                </div>

                <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed">
                  {n.description}
                </p>

                <div className="flex items-center gap-2 pt-0.5">
                  {n.badge && (
                    <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-[#5A2EA6]/10 text-[#5A2EA6]">
                      {n.badge}
                    </span>
                  )}
                  {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#5A2EA6] shrink-0" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50/80 border-t border-line/40 text-center">
        <button
          type="button"
          onClick={() => {
            navigate('/reports');
            onClose();
          }}
          className="text-xs font-bold text-[#5A2EA6] hover:underline cursor-pointer"
        >
          View Daily Operations Log &rarr;
        </button>
      </div>
    </div>
  );
}

export default NotificationDropdown;
