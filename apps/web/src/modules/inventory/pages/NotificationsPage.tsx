import { useToast } from '@salon-spa-saas/ui';
import { AlertTriangle, Bell, Check, ShoppingCart, Truck } from 'lucide-react';
import React, { useState } from 'react';

export function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Low Stock Alert',
      message: 'Olaplex No.1 reached safety reorder threshold (1 unit remaining).',
      time: '10 mins ago',
      read: false,
    },
    {
      id: '2',
      title: 'PO Approved',
      message: 'PO-4091 for L’Oréal India Ltd approved by Brand Manager.',
      time: '1 hr ago',
      read: false,
    },
    {
      id: '3',
      title: 'Shipment In-Transit',
      message: 'PO-4091 shipment dispatched by L’Oréal India.',
      time: '3 hrs ago',
      read: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast('Notifications Cleared: All warehouse alerts marked as read.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Warehouse Notifications & System Alerts
          </h1>
          <p className="text-xs text-soft mt-1">
            Real-time alerts for purchase order approvals, shipment arrivals, and stock reorders.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-3 py-1.5 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold cursor-pointer"
        >
          Mark All as Read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line p-5 shadow-sm space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border flex justify-between items-center ${n.read ? 'bg-white border-line' : 'bg-purple-50/50 border-purple-200'}`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#5A2EA6] shrink-0" />
              <div>
                <div className="text-xs font-bold text-ink">{n.title}</div>
                <div className="text-[11px] text-soft">{n.message}</div>
              </div>
            </div>
            <span className="text-[10px] text-muted">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
