import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  Bell,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileText,
  Globe,
  Landmark,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function NotificationsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [selectedFilter, setSelectedFilter] = useState('All Notifications');

  const notificationTypesList = [
    'Payroll Ready',
    'Refund Pending',
    'Settlement Pending',
    'Commission Generated',
    'Export Ready',
  ];

  const [notifications, setNotifications] = useState([
    {
      id: 'NOT-FIN-01',
      branchId: 'mumbai',
      type: 'Payroll Ready',
      title: 'Monthly Staff Payroll Batch Ready for Disbursal',
      message:
        'August 2026 payroll batch for Bandra West Flagship (₹8,40,000 total net payable) has been generated and is ready for CFO signoff.',
      time: '10 mins ago',
      read: false,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'NOT-FIN-02',
      branchId: 'mumbai',
      type: 'Refund Pending',
      title: 'Customer Refund Approval Request Pending',
      message:
        'Refund request #REF-401 (₹1,500) for customer Ananya Roy at Bandra West Flagship requires manager authorization.',
      time: '35 mins ago',
      read: false,
      icon: <RotateCcw className="w-5 h-5 text-rose-600" />,
    },
    {
      id: 'NOT-FIN-03',
      branchId: 'mumbai',
      type: 'Settlement Pending',
      title: 'Daily Closing Collection Settlement Pending',
      message:
        'Daily closing collection of ₹88,400 for Bandra West Flagship requires bank reconciliation & verification.',
      time: '1 hour ago',
      read: false,
      icon: <Landmark className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'NOT-FIN-04',
      branchId: 'delhi',
      type: 'Refund Pending',
      title: 'Delhi South Extension Refund Approved',
      message:
        'Refund request #REF-390 (₹2,400) for customer Pooja Verma at South Extension II has been completed.',
      time: '2 hours ago',
      read: true,
      icon: <RotateCcw className="w-5 h-5 text-rose-600" />,
    },
    {
      id: 'NOT-FIN-05',
      branchId: 'bangalore',
      type: 'Commission Generated',
      title: 'Staff Monthly Incentive Batch Calculated',
      message:
        'August 2026 commission incentive batch (₹30,500 across Bangalore stylists) has been calculated automatically.',
      time: '3 hours ago',
      read: true,
      icon: <Award className="w-5 h-5 text-[#5A2EA6]" />,
    },
    {
      id: 'NOT-FIN-06',
      branchId: 'hyderabad',
      type: 'Export Ready',
      title: 'Hyderabad Direct Deposit Export Ready',
      message:
        'SBI Corporate Direct Deposit CSV batch for Jubilee Hills has been compiled and is ready for download.',
      time: '4 hours ago',
      read: true,
      icon: <Download className="w-5 h-5 text-indigo-600" />,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast('Notifications Cleared: All Finance & HR activity notifications marked as read.');
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesBranch = isAllBranches || n.branchId === selectedBranchId;
    const matchesFilter = selectedFilter === 'All Notifications' || n.type === selectedFilter;
    return matchesBranch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Finance &amp; HR Activity Alerts Stream
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Activity Stream' : `${selectedBranch.shortName}`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Real-time notifications: Payroll Ready, Refund Pending, Settlement Pending, Commission Generated, and Export Ready alerts across all network branches.'
              : `Real-time activity alerts and approval requests specifically for ${selectedBranch.name}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Check className="w-3.5 h-3.5 text-purple-600" /> Mark All as Read
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {['All Notifications', ...notificationTypesList].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedFilter(t)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === t
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS STREAM */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-line p-8 text-center text-soft text-xs">
            No activity notifications found for {selectedBranch.shortName}.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 bg-white rounded-2xl border shadow-xs flex items-start justify-between gap-4 transition-all hover:shadow-md ${
                !n.read ? 'border-purple-300 bg-purple-50/10' : 'border-line'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-paper rounded-xl border border-line shrink-0">{n.icon}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-ink">{n.title}</h4>
                    <span className="text-[9.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.2 rounded-full border border-purple-200">
                      {n.type}
                    </span>
                  </div>
                  <p className="text-xs text-soft leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-muted block">{n.time}</span>
                </div>
              </div>

              {!n.read && <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-2" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
