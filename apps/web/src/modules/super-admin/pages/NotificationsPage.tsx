import { Button, cn } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertTriangle,
  Bell,
  BellOff,
  Building2,
  CheckCheck,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  Info,
  LifeBuoy,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Unplug,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import {
  InspectNotificationModal,
  type NotificationItem,
  type NotificationSeverity,
  type NotificationType,
} from '../components/InspectNotificationModal';
import { SimulateNotificationModal } from '../components/SimulateNotificationModal';

const initialNotifications: NotificationItem[] = [
  {
    id: 'NTF-9021',
    type: 'New Tenant',
    title: 'New Enterprise Tenant Registered',
    message:
      'Velvet Luxe Salon & Spa Group completed organization onboarding and activated 5 branch locations.',
    tenantName: 'Velvet Luxe Group',
    severity: 'Success',
    timestamp: '10 mins ago',
    isRead: false,
    correlationId: 'COR-NT-8812',
    sourceModule: 'Tenant Provisioning Service',
    details: {
      planName: 'Enterprise Plan',
      changedBy: 'Super Admin Operator',
      actionUrl: '/salons',
    },
  },
  {
    id: 'NTF-9020',
    type: 'Subscription Expiring',
    title: 'Subscription Plan Renewal Notice',
    message:
      'Aura Beauty & Wellness Spa (Enterprise Tier) subscription will expire in 3 days. Payment method verification required.',
    tenantName: 'Aura Spa & Wellness',
    severity: 'Warning',
    timestamp: '45 mins ago',
    isRead: false,
    correlationId: 'COR-SUB-4410',
    sourceModule: 'Billing & Subscriptions',
    details: {
      planName: 'Enterprise Plan',
      expiryDays: 3,
      actionUrl: '/subscription-plans',
    },
  },
  {
    id: 'NTF-9019',
    type: 'Support Ticket',
    title: 'High Priority Support Ticket Logged',
    message:
      'TCK-1045: Ava Rose reported SMS verification code latency during online booking checkout.',
    tenantName: 'Indrapuri Salon',
    severity: 'Critical',
    timestamp: '2 hrs ago',
    isRead: false,
    correlationId: 'COR-TCK-1045',
    sourceModule: 'Customer Support SLA Tracker',
    details: {
      ticketId: 'TCK-1045',
      ticketPriority: 'High',
      actionUrl: '/support-tickets',
    },
  },
  {
    id: 'NTF-9018',
    type: 'Integration Failure',
    title: 'WhatsApp Business API Webhook Error',
    message:
      'Outbound appointment confirmation webhook encountered HTTP 504 gateway timeout on Meta API node.',
    tenantName: 'Blush & Bloom Group',
    severity: 'Critical',
    timestamp: '3 hrs ago',
    isRead: false,
    correlationId: 'COR-INT-9921',
    sourceModule: 'WhatsApp Business Integration',
    details: {
      integrationName: 'WhatsApp Cloud API',
      errorCode: 'HTTP_504_GATEWAY_TIMEOUT',
      affectedEndpoint: 'https://graph.facebook.com/v18.0/messages',
      actionUrl: '/integrations',
    },
  },
  {
    id: 'NTF-9017',
    type: 'System Alert',
    title: 'High Cache Node Memory Utilization',
    message:
      'Primary Redis cache cluster memory crossed 85% capacity threshold. LRU eviction executed cleanly.',
    tenantName: 'Platform Infrastructure',
    severity: 'Warning',
    timestamp: '5 hrs ago',
    isRead: true,
    correlationId: 'COR-SYS-7714',
    sourceModule: 'Infrastructure Monitoring',
    details: {
      systemMetric: 'Redis Cache Memory: 86.4%',
      actionUrl: '/settings',
    },
  },
  {
    id: 'NTF-9016',
    type: 'Configuration Change',
    title: 'Global Platform GST Policy Modified',
    message:
      'Super Admin updated global GST rate policy to 18% inclusive tax calculation for service invoices.',
    tenantName: 'Global Governance',
    severity: 'Info',
    timestamp: '1 day ago',
    isRead: true,
    correlationId: 'COR-CFG-3309',
    sourceModule: 'System Settings',
    details: {
      changedBy: 'Super Admin Operator',
      beforeValue: 'GST Tax Rate: 18% Exclusive',
      afterValue: 'GST Tax Rate: 18% Inclusive + HSN Tax Codes Enabled',
      actionUrl: '/settings',
    },
  },
  {
    id: 'NTF-9015',
    type: 'New Tenant',
    title: 'New Standard Salon Registered',
    message: 'Urban Cutters & Stylists completed onboarding for single-location salon operations.',
    tenantName: 'Urban Cutters',
    severity: 'Success',
    timestamp: '1 day ago',
    isRead: true,
    correlationId: 'COR-NT-8811',
    sourceModule: 'Tenant Provisioning Service',
    details: {
      planName: 'Standard Plan',
      actionUrl: '/salons',
    },
  },
  {
    id: 'NTF-9014',
    type: 'Subscription Expiring',
    title: 'Failed Subscription Auto-Charge',
    message:
      'Royal Grooming Lounge monthly payment failed due to expired credit card token. Dunning period active.',
    tenantName: 'Royal Grooming Lounge',
    severity: 'Critical',
    timestamp: '2 days ago',
    isRead: true,
    correlationId: 'COR-SUB-4409',
    sourceModule: 'Billing & Subscriptions',
    details: {
      planName: 'Premium Plan',
      expiryDays: 0,
      actionUrl: '/billing-payments',
    },
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedTypeTab, setSelectedTypeTab] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unread' | 'Read'>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [inspectingNotification, setInspectingNotification] = useState<NotificationItem | null>(
    null,
  );
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Notification Category Count Computation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: notifications.length,
      'New Tenant': 0,
      'Subscription Expiring': 0,
      'Support Ticket': 0,
      'Integration Failure': 0,
      'System Alert': 0,
      'Configuration Change': 0,
    };

    notifications.forEach((item) => {
      if (counts[item.type] !== undefined) {
        counts[item.type]++;
      }
    });

    return counts;
  }, [notifications]);

  // Dynamic Computed Summary Metrics
  const metrics = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead).length;
    const critical = notifications.filter((n) => n.severity === 'Critical').length;
    const newTenants = notifications.filter((n) => n.type === 'New Tenant').length;
    return { total, unread, critical, newTenants };
  }, [notifications]);

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesType = selectedTypeTab === 'All' || item.type === selectedTypeTab;
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Unread' && !item.isRead) ||
        (statusFilter === 'Read' && item.isRead);
      const matchesSeverity = severityFilter === 'All' || item.severity === severityFilter;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [notifications, selectedTypeTab, statusFilter, severityFilter, searchQuery]);

  // Handlers
  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextRead = !item.isRead;
          showToast(
            nextRead ? `Marked notification ${id} as read` : `Marked notification ${id} as unread`,
          );
          return { ...item, isRead: nextRead };
        }
        return item;
      }),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    showToast('All notifications have been marked as read.');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    showToast(`Notification ${id} removed.`);
    if (inspectingNotification?.id === id) {
      setInspectingNotification(null);
    }
  };

  const handleAddSimulatedNotification = (newNotification: NotificationItem) => {
    setNotifications((prev) => [newNotification, ...prev]);
    showToast(`New ${newNotification.type} notification event dispatched!`);
  };

  const handleExportCSV = () => {
    const headers = [
      'Notification ID',
      'Type',
      'Title',
      'Severity',
      'Tenant Name',
      'Read Status',
      'Timestamp',
      'Message',
    ];
    const rows = filteredNotifications.map((n) => [
      n.id,
      n.type,
      `"${n.title}"`,
      n.severity,
      `"${n.tenantName}"`,
      n.isRead ? 'Read' : 'Unread',
      n.timestamp,
      `"${n.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `super_admin_notifications_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported notifications report CSV successfully.');
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'New Tenant':
        return <Building2 className="w-4 h-4 text-[#7C3AED]" />;
      case 'Subscription Expiring':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Support Ticket':
        return <LifeBuoy className="w-4 h-4 text-blue-500" />;
      case 'Integration Failure':
        return <Unplug className="w-4 h-4 text-rose-500" />;
      case 'System Alert':
        return <Activity className="w-4 h-4 text-purple-600" />;
      case 'Configuration Change':
        return <SlidersHorizontal className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#7C3AED]" />;
    }
  };

  const getSeverityBadge = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-500" /> Critical
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-500" /> Warning
          </span>
        );
      case 'Success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Success
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3 h-3 text-blue-500" /> Info
          </span>
        );
    }
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-12">
      {/* Toast Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-slate-900 font-semibold tracking-tight">
            Platform Notifications
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Real-time event notification center for tenant onboarding, subscription renewals,
            support tickets, system telemetry, and governance alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export CSV button - Strictly formatted with variant="outline" with purple text/border to match Team section standard per AGENTS.md rule */}
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 bg-white gap-2 font-medium"
          >
            <Download className="w-4 h-4" /> Export Report
          </Button>

          <Button
            onClick={() => setIsSimulateModalOpen(true)}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white gap-2 font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Trigger Test Event
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Total Events
            </span>
            <div className="text-[28px] font-bold text-slate-900 mt-1 font-serif">
              {metrics.total}
            </div>
            <span className="text-[11.5px] text-slate-500 mt-0.5 block">Logged notifications</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#7C3AED]">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Unread Alerts
            </span>
            <div className="text-[28px] font-bold text-[#7C3AED] mt-1 font-serif">
              {metrics.unread}
            </div>
            <span className="text-[11.5px] text-purple-600 font-medium mt-0.5 block">
              Requires attention
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Critical Alerts
            </span>
            <div className="text-[28px] font-bold text-rose-600 mt-1 font-serif">
              {metrics.critical}
            </div>
            <span className="text-[11.5px] text-rose-500 font-medium mt-0.5 block">
              Tickets & integrations
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              New Tenants
            </span>
            <div className="text-[28px] font-bold text-emerald-600 mt-1 font-serif">
              {metrics.newTenants}
            </div>
            <span className="text-[11.5px] text-emerald-600 font-medium mt-0.5 block">
              Recent registrations
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Notification Element Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto custom-scroll">
        <div className="flex items-center gap-1.5 min-w-max">
          {(
            [
              { id: 'All', label: 'All Notifications' },
              { id: 'New Tenant', label: 'New Tenant' },
              { id: 'Subscription Expiring', label: 'Subscription Expiring' },
              { id: 'Support Ticket', label: 'Support Ticket' },
              { id: 'Integration Failure', label: 'Integration Failure' },
              { id: 'System Alert', label: 'System Alert' },
              { id: 'Configuration Change', label: 'Configuration Change' },
            ] as { id: string; label: string }[]
          ).map((tab) => {
            const count = categoryCounts[tab.id] || 0;
            const isActive = selectedTypeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeTab(tab.id)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition-all flex items-center gap-2 cursor-pointer border-0',
                  isActive
                    ? 'bg-[#7C3AED] text-white shadow-sm font-bold'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'px-2 py-0.5 text-[10px] rounded-full font-bold',
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar & Secondary Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Query */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification title, message, tenant or ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Unread' | 'Read')}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[12.5px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="All">All Statuses</option>
              <option value="Unread">Unread Only</option>
              <option value="Read">Read Only</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-slate-500">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[12.5px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Success">Success</option>
              <option value="Info">Info</option>
            </select>
          </div>

          {/* Mark All Read */}
          {metrics.unread > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              className="border-purple-200 text-[#7C3AED] hover:bg-purple-50 text-[12px] py-1.5 gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark All Read ({metrics.unread})
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List View */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <BellOff className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-bold text-slate-800">No notifications found</h3>
            <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
              No platform notification events match your current filter selection or search query.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTypeTab('All');
                setStatusFilter('All');
                setSeverityFilter('All');
                setSearchQuery('');
              }}
              className="text-[#7C3AED] border-[#7C3AED]"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={cn(
                'bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md',
                item.isRead
                  ? 'border-slate-200 opacity-90'
                  : 'border-[#7C3AED]/30 bg-gradient-to-r from-purple-50/30 via-white to-white',
              )}
            >
              {/* Item Info */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Unread indicator dot */}
                <div className="pt-1.5 shrink-0">
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      !item.isRead
                        ? 'bg-[#7C3AED] ring-4 ring-[#7C3AED]/20 animate-pulse'
                        : 'bg-slate-300',
                    )}
                  />
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80">
                  {getTypeIcon(item.type)}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.id}
                    </span>
                    <span className="text-[11px] font-bold text-[#7C3AED] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
                      {item.type}
                    </span>
                    {getSeverityBadge(item.severity)}
                  </div>

                  <h3 className="text-[14px] font-bold text-slate-900 truncate tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[12.5px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-slate-500 pt-1">
                    <span>
                      Tenant: <strong className="text-slate-700">{item.tenantName}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {item.timestamp}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{item.sourceModule}</span>
                  </div>
                </div>
              </div>

              {/* Item Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setInspectingNotification(item)}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-purple-200"
                >
                  <Eye className="w-3.5 h-3.5" /> Inspect
                </button>

                <button
                  onClick={() => handleToggleRead(item.id)}
                  title={item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  className={cn(
                    'p-2 rounded-xl text-[12px] transition-all cursor-pointer border',
                    item.isRead
                      ? 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                      : 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] border-transparent',
                  )}
                >
                  <CheckCheck className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteNotification(item.id)}
                  title="Remove notification"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer border border-transparent hover:border-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inspection Modal */}
      <InspectNotificationModal
        notification={inspectingNotification}
        isOpen={!!inspectingNotification}
        onClose={() => setInspectingNotification(null)}
        onToggleRead={handleToggleRead}
      />

      {/* Simulate Event Modal */}
      <SimulateNotificationModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onAddNotification={handleAddSimulatedNotification}
      />
    </div>
  );
}
