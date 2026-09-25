import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Headphones,
  Megaphone,
  Package,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';

export function NotificationsPage() {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState('all');

  // ALL 6 EXACT NOTIFICATION EXAMPLES REQUESTED BY USER
  const [notifications, setNotifications] = useState([
    {
      id: 'NOT-FRN-01',
      category: 'Compliance Due',
      title: 'Fire Safety NOC Clearance Due Renewal',
      message:
        'Fire Safety NOC clearance is due in 15 days for Kolar Road Outlet. Please upload updated clearance certificate.',
      time: '25 mins ago',
      read: false,
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'NOT-FRN-02',
      category: 'Fee Due',
      title: 'August 2026 Royalty Fee Invoice Reminded',
      message:
        'August 2026 Master Royalty Fee Invoice (₹6,01,800) is due on Aug 10, 2026. Avoid late fee penalties.',
      time: '1 hour ago',
      read: false,
      icon: <DollarSign className="w-5 h-5 text-rose-600" />,
    },
    {
      id: 'NOT-FRN-03',
      category: 'New Announcement',
      title: 'Head Office FY26 Price List Broadcast',
      message:
        'Head Office published updated FY26 Service & Retail Price List Revisions taking effect Sept 1, 2026.',
      time: '3 hours ago',
      read: false,
      icon: <Megaphone className="w-5 h-5 text-purple-600" />,
    },
    {
      id: 'NOT-FRN-04',
      category: 'Audit Scheduled',
      title: 'HQ Mystery Shopper & Sanitation Audit Scheduled',
      message:
        'HQ Mystery Shopper & Health Sanitation Audit is scheduled for Indrapuri Central Outlet on Aug 14, 2026.',
      time: '5 hours ago',
      read: true,
      icon: <Calendar className="w-5 h-5 text-indigo-600" />,
    },
    {
      id: 'NOT-FRN-05',
      category: 'Low Stock',
      title: 'Hair Color Cream Below Threshold',
      message:
        'L’Oréal Majirel Hair Color Cream #5 is below minimum stock threshold (12 units remaining). Request PO with HQ.',
      time: '1 day ago',
      read: true,
      icon: <Package className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'NOT-FRN-06',
      category: 'Support Reply',
      title: 'Head Office Support Reply Received',
      message:
        'Head Office Helpdesk replied to Ticket #TCK-FRN-901 regarding GST tax calculation clarification.',
      time: '2 days ago',
      read: true,
      icon: <Headphones className="w-5 h-5 text-emerald-600" />,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast('Notifications Cleared: All franchise notifications marked as read.');
  };

  const filteredNotifications = notifications.filter(
    (n) => filterCategory === 'all' || n.category === filterCategory,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Franchise Activity &amp; Notifications Feed
          </h1>
          <p className="text-xs text-soft mt-1">
            Real-time notifications across 6 core categories: Compliance Due, Fee Due, New
            Announcement, Audit Scheduled, Low Stock, and Support Reply.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Check className="w-3.5 h-3.5 text-purple-600" /> Mark All As Read
        </button>
      </div>

      {/* 6 CATEGORY FILTER BUTTONS */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            'all',
            'Compliance Due',
            'Fee Due',
            'New Announcement',
            'Audit Scheduled',
            'Low Stock',
            'Support Reply',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all border ${
                filterCategory === cat
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                  : 'bg-white text-soft hover:text-ink border-line'
              }`}
            >
              {cat === 'all' ? 'All Notifications' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* NOTIFICATIONS FEED */}
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
                {n.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                    {n.category}
                  </span>
                  <span className="text-sm font-bold text-ink">{n.title}</span>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />}
                </div>
                <p className="text-xs text-soft leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-muted block pt-0.5 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-soft" /> {n.time}
                </span>
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
