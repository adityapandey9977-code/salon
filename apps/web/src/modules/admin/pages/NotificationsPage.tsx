import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Layers,
  Package,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserCheck,
  XCircle,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  type AdminNotification,
  type NotificationCategory,
  type NotificationSeverity,
  initialAdminNotifications,
} from '../data/notificationsData';

export function NotificationsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [notifications, setNotifications] =
    useState<AdminNotification[]>(initialAdminNotifications);
  const [selectedId, setSelectedId] = useState<string>(
    searchParams.get('id') || initialAdminNotifications[0].id,
  );

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Unread' | 'Resolved'>('All');
  const [resolutionNote, setResolutionNote] = useState('');

  // Sync URL query param
  useEffect(() => {
    const idFromQuery = searchParams.get('id');
    if (idFromQuery && notifications.some((n) => n.id === idFromQuery)) {
      setSelectedId(idFromQuery);
    }
  }, [searchParams, notifications]);

  // Selected Notification Record
  const selectedNotification = useMemo(() => {
    return notifications.find((n) => n.id === selectedId) || notifications[0];
  }, [notifications, selectedId]);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        notif.title.toLowerCase().includes(q) ||
        notif.summary.toLowerCase().includes(q) ||
        notif.branch.toLowerCase().includes(q) ||
        notif.entityName.toLowerCase().includes(q) ||
        notif.id.toLowerCase().includes(q);

      const matchesSeverity = selectedSeverity === 'All' || notif.severity === selectedSeverity;
      const matchesCategory = selectedCategory === 'All' || notif.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'All'
          ? true
          : selectedStatus === 'Unread'
            ? !notif.isRead
            : notif.isResolved;

      return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
    });
  }, [notifications, searchQuery, selectedSeverity, selectedCategory, selectedStatus]);

  // Mark single as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast('All active notifications marked as read.');
  };

  // Resolve notification
  const handleResolveNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updatedTimeline = [
            {
              time: 'Just now',
              title: 'Incident Marked as Resolved',
              description: resolutionNote.trim()
                ? `Resolution Note: "${resolutionNote.trim()}"`
                : 'Operator acknowledged and applied standard SOP action.',
              actor: 'Brand Owner / Super Director',
            },
            ...n.timeline,
          ];
          return {
            ...n,
            isResolved: true,
            isRead: true,
            timeline: updatedTimeline,
          };
        }
        return n;
      }),
    );
    setResolutionNote('');
    toast(`Notification #${id} resolved successfully.`);
  };

  // Execute Action
  const handleExecuteSuggestedAction = (notif: AdminNotification) => {
    toast(`Executing SOP Action: "${notif.suggestedActionLabel}" for ${notif.entityName}`);
    if (notif.targetLink) {
      navigate(notif.targetLink);
    }
  };

  // Severity count helpers
  const totalCount = notifications.length;
  const criticalCount = notifications.filter((n) => n.severity === 'Critical').length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const resolvedCount = notifications.filter((n) => n.isResolved).length;

  const categoriesList = [
    'All',
    'Inventory & Supply',
    'Franchise & Partner',
    'Appointments & Operations',
    'Staff & Rostering',
    'Finance & Royalties',
  ];

  const getSeverityBadgeClass = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Warning':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Info':
      default:
        return 'bg-purple-100 text-[#5A2EA6] border-purple-200';
    }
  };

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'Inventory & Supply':
        return <Package className="w-3.5 h-3.5 text-amber-600" />;
      case 'Franchise & Partner':
        return <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />;
      case 'Appointments & Operations':
        return <Calendar className="w-3.5 h-3.5 text-blue-600" />;
      case 'Staff & Rostering':
        return <UserCheck className="w-3.5 h-3.5 text-pink-600" />;
      case 'Finance & Royalties':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#5A2EA6]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Enterprise Notification Center &amp; Alert Desk
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              Live Audit Telemetry
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Centralized monitoring of critical stockout exceptions, franchise compliance
            expirations, VIP bookings, and revenue targets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() =>
              toast(`Exported ${notifications.length} notification audit events to CSV.`)
            }
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Log</span>
          </Button>
        </div>
      </div>

      {/* 2. Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Alerts */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-3xs space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Total Alerts</span>
            <Bell className="w-4 h-4 text-[#5A2EA6]" />
          </div>
          <strong className="text-xl font-serif text-ink font-bold block">{totalCount}</strong>
          <span className="text-[10.5px] text-muted block">Across all 5 flagship outlets</span>
        </div>

        {/* Critical Exceptions */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-3xs space-y-1">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
            <span>Critical Exceptions</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <strong className="text-xl font-serif text-rose-700 font-bold block">
            {criticalCount}
          </strong>
          <span className="text-[10.5px] text-rose-800 font-semibold block">
            Requires immediate intervention
          </span>
        </div>

        {/* Unread Queue */}
        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 shadow-3xs space-y-1">
          <div className="flex items-center justify-between text-[#5A2EA6] text-xs font-bold">
            <span>Unread Queue</span>
            <Clock className="w-4 h-4 text-[#5A2EA6]" />
          </div>
          <strong className="text-xl font-serif text-[#5A2EA6] font-bold block">
            {unreadCount}
          </strong>
          <span className="text-[10.5px] text-purple-700 font-medium block">
            Pending Brand Owner review
          </span>
        </div>

        {/* Resolved Today */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-3xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>Resolved Incidents</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <strong className="text-xl font-serif text-emerald-700 font-bold block">
            {resolvedCount}
          </strong>
          <span className="text-[10.5px] text-emerald-700 font-medium block">
            SOP actions completed
          </span>
        </div>
      </div>

      {/* 3. Filter & Search Controls Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search alerts, SKUs, partners, branches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Success">Success</option>
              <option value="Info">Info</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Unread">Unread Only</option>
              <option value="Resolved">Resolved Incidents</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Master-Detail 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Notification Feed List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              Alert Queue ({filteredNotifications.length})
            </span>
            <span className="text-[11px] text-muted">Click to view incident telemetry</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto custom-scroll pr-1">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-purple-100 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <strong className="text-xs text-ink block font-bold">
                  No Matching Notifications
                </strong>
                <p className="text-[11px] text-muted">
                  Try adjusting your category or severity filters.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isSelected = selectedNotification?.id === notif.id;

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setSelectedId(notif.id);
                      setSearchParams({ id: notif.id });
                      handleMarkAsRead(notif.id);
                    }}
                    className={cn(
                      'p-4 rounded-2xl border transition-all cursor-pointer space-y-2 select-none relative',
                      isSelected
                        ? 'bg-white border-[#5A2EA6] shadow-[0_8px_25px_rgba(90,46,166,0.14)] ring-1 ring-[#5A2EA6]'
                        : notif.isRead
                          ? 'bg-white border-purple-100/80 hover:border-purple-200'
                          : 'bg-[#FCFAFF] border-purple-200 hover:border-[#5A2EA6]/40',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 rounded-lg bg-purple-50">
                          {getCategoryIcon(notif.category)}
                        </span>
                        <span
                          className={cn(
                            'text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                            getSeverityBadgeClass(notif.severity),
                          )}
                        >
                          {notif.severity}
                        </span>
                        {notif.isResolved && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ✓ Resolved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-muted">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{notif.timeAgo}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 ml-1 inline-block animate-pulse" />
                        )}
                      </div>
                    </div>

                    <div>
                      <strong
                        className={cn(
                          'text-xs block leading-snug font-bold',
                          isSelected ? 'text-[#5A2EA6]' : 'text-ink',
                        )}
                      >
                        {notif.title}
                      </strong>
                      <p className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-relaxed">
                        {notif.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-purple-50 text-[10.5px] text-soft">
                      <span className="flex items-center gap-1 font-semibold truncate max-w-[200px]">
                        <Building2 className="w-3 h-3 text-[#5A2EA6]" />
                        {notif.branch}
                      </span>
                      <span className="font-mono text-[10px] text-purple-700 font-bold">
                        {notif.id}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Notification Detail & Resolution Suite (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedNotification ? (
            <div className="bg-white rounded-[24px] border border-purple-100/90 shadow-sm overflow-hidden space-y-5 p-6 text-xs">
              {/* Detail Header Banner */}
              <div className="space-y-2 pb-4 border-b border-purple-50">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                      {selectedNotification.id}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider',
                        getSeverityBadgeClass(selectedNotification.severity),
                      )}
                    >
                      {selectedNotification.severity} Alert
                    </span>
                    <span className="text-[10.5px] text-muted bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold">
                      {selectedNotification.category}
                    </span>
                  </div>

                  <span className="text-[11px] text-muted flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#5A2EA6]" />
                    {selectedNotification.timeAgo} (
                    {new Date(selectedNotification.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    )
                  </span>
                </div>

                <h3 className="font-serif text-lg text-ink font-bold tracking-tight">
                  {selectedNotification.title}
                </h3>
              </div>

              {/* Detailed Narrative Message */}
              <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-1.5">
                <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                  Incident Narrative &amp; Telemetry Payload
                </span>
                <p className="text-xs text-ink leading-relaxed font-normal">
                  {selectedNotification.detailedMessage}
                </p>
              </div>

              {/* Entity Context Telemetry Card */}
              <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-3xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-ink uppercase tracking-wider">
                    Associated Entity Context
                  </span>
                  {selectedNotification.targetLink && (
                    <button
                      type="button"
                      onClick={() => navigate(selectedNotification.targetLink!)}
                      className="text-xs font-bold text-[#5A2EA6] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                    >
                      <span>Open {selectedNotification.entityType} Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Entity Type
                    </span>
                    <strong className="text-ink text-xs block">
                      {selectedNotification.entityType}
                    </strong>
                    <span className="font-mono text-[10px] text-[#5A2EA6]">
                      {selectedNotification.entityId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Entity Name / SKU
                    </span>
                    <strong
                      className="text-ink text-xs block truncate"
                      title={selectedNotification.entityName}
                    >
                      {selectedNotification.entityName}
                    </strong>
                    <span className="text-[10px] text-soft">{selectedNotification.branch}</span>
                  </div>
                  {selectedNotification.metadata?.financialValue && (
                    <div>
                      <span className="text-[10px] text-muted uppercase font-bold block">
                        Financial Value
                      </span>
                      <strong className="text-emerald-700 font-serif text-xs block font-bold">
                        {selectedNotification.metadata.financialValue}
                      </strong>
                      <span className="text-[10px] text-muted">Impact metric</span>
                    </div>
                  )}
                </div>

                {selectedNotification.metadata?.estimatedImpact && (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 flex items-center justify-between">
                    <span className="font-semibold">
                      ⚠️ {selectedNotification.metadata.estimatedImpact}
                    </span>
                    {selectedNotification.metadata.slaRemaining && (
                      <span className="font-bold text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-md">
                        SLA: {selectedNotification.metadata.slaRemaining}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actionable SOP Resolution Suite */}
              <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#FAF8FC] to-purple-50/50 border border-purple-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5A2EA6]" />
                    <strong className="text-xs text-ink font-bold">
                      Standard Operating Procedure (SOP) Actions
                    </strong>
                  </div>
                  {selectedNotification.isResolved ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      Handled &amp; Resolved
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                      Pending Operator Action
                    </span>
                  )}
                </div>

                {selectedNotification.suggestedActionLabel && (
                  <Button
                    type="button"
                    onClick={() => handleExecuteSuggestedAction(selectedNotification)}
                    className="w-full h-10 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>{selectedNotification.suggestedActionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}

                {/* Resolution Note & Mark Resolved */}
                {!selectedNotification.isResolved && (
                  <div className="space-y-2 pt-2 border-t border-purple-100">
                    <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                      Log Audit Resolution Note:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Authorized stock PO #PO-8812 with supplier; confirmed arrival at 9 AM."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                      />
                      <Button
                        type="button"
                        onClick={() => handleResolveNotification(selectedNotification.id)}
                        className="h-9 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chronological Event Audit Trail */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10.5px] font-bold text-ink uppercase tracking-wider block">
                  Incident Audit Timeline ({selectedNotification.timeline.length} Events)
                </span>
                <div className="space-y-2">
                  {selectedNotification.timeline.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100/80 flex items-start gap-3 text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold grid place-items-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <strong className="text-ink font-bold text-xs">{evt.title}</strong>
                          <span className="text-[10px] text-muted">{evt.time}</span>
                        </div>
                        <p className="text-[11px] text-muted mt-0.5">{evt.description}</p>
                        <span className="text-[9.5px] text-[#5A2EA6] font-semibold block mt-0.5">
                          Actor: {evt.actor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-purple-100 p-12 text-center text-muted">
              Select a notification from the list to view full details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
