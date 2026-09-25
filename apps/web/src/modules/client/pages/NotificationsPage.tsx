import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  Gift,
  Headphones,
  Sparkles,
  Star,
  Wallet,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

export function NotificationsPage() {
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string>('all');

  // Master Notifications State (All 7 Specified Notification Types)
  const [notifications, setNotifications] = useState([
    {
      id: 'NOT-701',
      type: 'Appointment Confirmed',
      title: 'Appointment Confirmed (APT-901)',
      message:
        'Your reservation for Hydra Facial Detox & Glow Spa with Priya Sharma has been confirmed for tomorrow at 04:00 PM.',
      time: '30 mins ago',
      read: false,
      iconType: 'confirmed',
    },
    {
      id: 'NOT-702',
      type: 'Appointment Reminder',
      title: '24h Appointment Reminder',
      message:
        'Reminder: Your visit for Balayage Hair Color & Gloss with Vikram Kulkarni is scheduled for tomorrow at 11:30 AM at Indrapuri Outlet.',
      time: '2 hours ago',
      read: false,
      iconType: 'reminder',
    },
    {
      id: 'NOT-703',
      type: 'Appointment Cancelled',
      title: 'Appointment Cancelled & Deposit Refunded',
      message:
        'Appointment APT-810 cancelled as requested. ₹500 deposit has been refunded to your digital wallet balance.',
      time: '1 day ago',
      read: true,
      iconType: 'cancelled',
    },
    {
      id: 'NOT-704',
      type: 'Package Expiry',
      title: 'Package Expiry Notice',
      message:
        'Your Bridal Pamper & Radiance Glow package has 2 remaining sessions valid until Nov 30, 2026.',
      time: '2 days ago',
      read: false,
      iconType: 'package',
    },
    {
      id: 'NOT-705',
      type: 'Wallet Updated',
      title: 'Wallet Recharged Successfully',
      message:
        'Wallet Top-Up of ₹1,000 via UPI (GPay) completed. Current Wallet Balance: ₹2,450.00.',
      time: '3 days ago',
      read: true,
      iconType: 'wallet',
    },
    {
      id: 'NOT-706',
      type: 'Loyalty Points Added',
      title: 'Loyalty Points Credited (+250 Pts)',
      message:
        'You earned +250 loyalty rewards points for your recent Balayage Hair Color visit. Total Balance: 1,250 Pts.',
      time: '4 days ago',
      read: true,
      iconType: 'points',
    },
    {
      id: 'NOT-707',
      type: 'Support Reply',
      title: 'Support Ticket Reply (TCK-401)',
      message:
        'Client Care Desk replied to your ticket "Refund inquiry for deposit": Issue status updated to In Progress.',
      time: '5 days ago',
      read: false,
      iconType: 'support',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast('Notifications Cleared: All notifications marked as read.');
  };

  const filteredNotifications = notifications.filter(
    (n) => filterType === 'all' || n.type === filterType,
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'Appointment Confirmed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'Appointment Reminder':
        return <Clock className="w-5 h-5 text-purple-600" />;
      case 'Appointment Cancelled':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case 'Package Expiry':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'Wallet Updated':
        return <Wallet className="w-5 h-5 text-teal-600" />;
      case 'Loyalty Points Added':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'Support Reply':
        return <Headphones className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Notifications &amp; Activity Stream
          </h1>
          <p className="text-xs text-soft mt-1">
            Real-time appointment confirmations, visit reminders, cancellations, package expiries,
            wallet top-ups, loyalty points, and support replies.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Check className="w-3.5 h-3.5 text-purple-600" />
          Mark All As Read
        </button>
      </div>

      {/* CATEGORY FILTER BAR - ALL 7 TYPES */}
      <div className="bg-white p-3.5 rounded-2xl border border-line shadow-sm space-y-2">
        <div className="text-[11px] font-bold text-soft uppercase tracking-wider">
          Filter Notification Category:
        </div>
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
          {[
            'all',
            'Appointment Confirmed',
            'Appointment Reminder',
            'Appointment Cancelled',
            'Package Expiry',
            'Wallet Updated',
            'Loyalty Points Added',
            'Support Reply',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                filterType === cat
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-pine/10 text-soft hover:text-ink'
              }`}
            >
              {cat === 'all' ? 'All Notifications' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              !n.read ? 'bg-purple-50/50 border-purple-200 shadow-sm' : 'bg-white border-line'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-line flex items-center justify-center shrink-0 shadow-xs">
                {getIcon(n.type)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md">
                    {n.type}
                  </span>
                  <span className="text-sm font-bold text-ink">{n.title}</span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" title="Unread" />
                  )}
                </div>
                <p className="text-xs text-soft leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-muted block pt-0.5 font-medium">{n.time}</span>
              </div>
            </div>

            {!n.read && (
              <button
                onClick={() =>
                  setNotifications(
                    notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                  )
                }
                className="px-2.5 py-1 text-[11px] font-bold text-purple-600 hover:text-purple-800 bg-white border border-purple-200 rounded-lg cursor-pointer shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
