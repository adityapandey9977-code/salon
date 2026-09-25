import { Button, useToast } from '@salon-spa-saas/ui';
import { Bell, Check, Clock, ShieldAlert, User } from 'lucide-react';
import React from 'react';

export function NotificationsPage() {
  const { toast } = useToast();

  const notifications = [
    {
      title: 'Client Arrived at Reception',
      message: 'Client Priya Sharma has arrived for 10:00 AM Balayage appointment.',
      time: '10 mins ago',
      type: 'arrival',
    },
    {
      title: 'Patch Test Alert',
      message: 'Client Ava Rose (12:30 PM) requires latex-free gloves caution.',
      time: '25 mins ago',
      type: 'caution',
    },
    {
      title: 'Commission Payout Approved',
      message: 'Weekly tip payout of ₹1,450 approved by Branch Manager.',
      time: '2 hours ago',
      type: 'payout',
    },
  ];

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
            Shift &amp; Appointment Notifications
          </h1>
          <p className="text-[13px] text-soft mt-1">
            Real-time alerts for client arrivals, patch test warnings, and commission payouts
          </p>
        </div>
        <Button
          onClick={() => toast('Marked all notifications as read.')}
          variant="outline"
          className="h-8 text-xs font-bold border-[#5A2EA6]/20 text-[#5A2EA6]"
        >
          Mark All Read
        </Button>
      </div>

      <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs divide-y divide-[#5A2EA6]/10">
        {notifications.map((n, i) => (
          <div key={i} className="py-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <strong className="text-sm font-bold text-ink">{n.title}</strong>
                <span className="text-[10px] text-muted font-medium">{n.time}</span>
              </div>
              <p className="text-xs text-soft mt-0.5">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
