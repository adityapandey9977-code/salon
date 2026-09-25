import React, { useState } from 'react';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Bell,
  Building2,
  Check,
  Clock,
  Globe,
  LifeBuoy,
  MapPin,
  MessageSquare,
  PhoneIncoming,
  Sparkles,
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';


export function NotificationsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches
  } = useCallCenterBranch();

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Meta Lead Captured (Bandra West)',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      message: 'Ananya Roy submitted lead for Hydra Facial & Spa.',
      time: '5 mins ago',
      read: false,
      type: 'Lead'
    },
    {
      id: '2',
      title: 'Appointment Rescheduled (Delhi South Ext)',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      message: 'Vikram Sethi moved booking to 2:00 PM with Neha Sharma.',
      time: '20 mins ago',
      read: false,
      type: 'Booking'
    },
    {
      id: '3',
      title: 'Grievance Ticket Logged (Indiranagar)',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      message: 'Ticket TCK-2026-042 requires branch manager investigation.',
      time: '35 mins ago',
      read: false,
      type: 'Ticket'
    },
    {
      id: '4',
      title: 'Overdue Follow-up Alert (Hyderabad)',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      message: 'Post-service callback for Siddharth Rao is 15 mins overdue.',
      time: '1 hr ago',
      read: true,
      type: 'Follow-up'
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast('Notifications Cleared: All desk alerts marked as read.');
  };

  const filtered = notifications.filter((n) => isAllBranches || n.branchId === selectedBranchId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Desk Alerts &amp; Inbound Notifications
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Alerts' : `${selectedBranch.shortName} Alerts`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Real-time alerts for lead entries, missed callbacks, customer grievances, and confirmation updates across all branches.'
              : `Notifications and alerts strictly mapped to ${selectedBranch.name}.`}
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 text-purple-600" />
          Mark All as Read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line p-5 shadow-sm space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-soft text-xs">No alerts for {selectedBranch.shortName}.</div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${n.read ? 'bg-white border-line' : 'bg-purple-50/40 border-purple-200 shadow-xs'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-paper rounded-xl border border-line shrink-0">
                  {n.type === 'Ticket' ? <LifeBuoy className="w-4 h-4 text-rose-600" /> : <Bell className="w-4 h-4 text-purple-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-ink">{n.title}</strong>
                    <span className="text-[9px] font-bold bg-purple-100 text-purple-900 px-2 py-0.2 rounded-full">
                      {n.type}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-soft mt-0.5">{n.message}</div>
                  <div className="text-[10px] text-purple-700 font-semibold mt-1 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {n.branch}
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-muted font-mono self-end sm:self-auto">{n.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
