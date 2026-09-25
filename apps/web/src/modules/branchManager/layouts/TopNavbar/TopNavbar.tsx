import { Avatar, cn, useToast } from '@salon-spa-saas/ui';
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  LayoutDashboard,
  Menu,
  Package,
  Receipt,
  Settings,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/shared/context/AuthContext';
import { useBranch } from '../../context/BranchContext';
import { BranchManagerProfileModal } from './BranchManagerProfileModal';
import { NavDropdown } from './NavDropdown';
import {
  type BranchNotification,
  NotificationDropdown,
  initialBranchNotifications,
} from './NotificationDropdown';

export function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();
  const { assignedBranch, availableBranches, selectBranch, currentStaff } = useBranch();
  const pathname = location.pathname;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<BranchNotification[]>(
    initialBranchNotifications,
  );

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open & listen for ESC
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast('All branch notifications marked as read.');
  };

  // Active path checking helpers
  const isDashboardActive = pathname === '/' || pathname === '/dashboard' || pathname === '';
  const isAppointmentsActive = pathname.startsWith('/appointments');
  const isWalkinsActive = pathname.startsWith('/walk-ins');
  const isOperationsGroupActive = isAppointmentsActive || isWalkinsActive;

  const isCustomersActive = pathname.startsWith('/customers') || pathname.startsWith('/clients');
  const isTeamActive = pathname.startsWith('/team') || pathname.startsWith('/staff');
  const isCatalogueActive = pathname.startsWith('/catalogue') || pathname.startsWith('/services');
  const isServicesActive = isCatalogueActive;
  const isClientsTeamGroupActive = isCustomersActive || isTeamActive;

  const isPaymentsActive = pathname.startsWith('/payments');
  const isRetailActive = pathname.startsWith('/retail') || pathname.startsWith('/inventory');
  const isCommercialGroupActive = isPaymentsActive || isRetailActive;

  const isReportsActive = pathname.startsWith('/reports');
  const isSettingsActive = pathname.startsWith('/settings');

  // Capability-filtered navigation items
  const operationsItems = [
    hasPermission('appointment.read') && {
      icon: <Calendar className="w-3.5 h-3.5" />,
      label: 'Appointments Diary',
      path: '/appointments',
      badge: '28 Today',
      description: 'Multi-service calendar & slot management',
      isActive: isAppointmentsActive,
    },
    hasPermission('appointment.read') && {
      icon: <UserPlus className="w-3.5 h-3.5" />,
      label: 'Walk-ins & Live Queue',
      path: '/walk-ins',
      badge: '7 Waiting',
      description: 'Live queue tokens, wait estimates & check-in',
      isActive: isWalkinsActive,
    },
  ].filter(Boolean) as any[];

  const canViewCatalogue =
    hasPermission('service.read') ||
    hasPermission('commerce.read') ||
    hasPermission('panel.branch.access') ||
    true;

  const clientsTeamItems = [
    hasPermission('customer.read') && {
      icon: <Users className="w-3.5 h-3.5" />,
      label: 'Clients & Profiles',
      path: '/customers',
      description: 'Client CRM, household cards & history',
      isActive: isCustomersActive,
    },
    hasPermission('staff.read') && {
      icon: <UserCheck className="w-3.5 h-3.5" />,
      label: 'Stylists & Staff Roster',
      path: '/team',
      badge: '8 On Duty',
      description: 'Shifts, chairside stations & targets',
      isActive: isTeamActive,
    },
    // canViewCatalogue && {
    //   icon: <Sparkles className="w-3.5 h-3.5" />,
    //   label: 'Services Menu',
    //   path: '/catalogue',
    //   description: 'Branch treatments, timings & buffers',
    //   isActive: isCatalogueActive,
    // },
  ].filter(Boolean) as any[];

  const commercialItems = [
    hasPermission('payment.create') && {
      icon: <Receipt className="w-3.5 h-3.5" />,
      label: 'New POS Checkout',
      path: '/payments/new-invoice',
      badge: 'Fast',
      description: 'Quick cart billing & GST invoice generation',
      isActive: pathname === '/payments/new-invoice',
    },
    hasPermission('payment.read') && {
      icon: <CreditCard className="w-3.5 h-3.5" />,
      label: 'Payments & Invoices',
      path: '/payments',
      badge: '₹42.8K',
      description: 'Transaction history, receipts & split billing',
      isActive: isPaymentsActive && pathname === '/payments',
    },
    hasPermission('inventory.retail.read') && {
      icon: <Package className="w-3.5 h-3.5" />,
      label: 'Retail & Shelf Inventory',
      path: '/retail',
      badge: '4 Low',
      description: 'Shelf stock, barcodes & reorder alerts',
      isActive: isRetailActive,
    },
    hasPermission('payment.read') && {
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Cashier Shift Closure',
      path: '/payments',
      description: 'Daily shift reconciliation & cash drawer count',
      isActive: false,
    },
  ].filter(Boolean) as any[];

  const canViewReports = hasPermission('report.branch.read') || hasPermission('report.read');
  const canViewSettings = hasPermission('branch.settings.read') || hasPermission('branch.settings.manage');

  return (
    <header className="w-full bg-white border-b border-line/70 px-3 sm:px-4 lg:px-7 py-2.5 flex items-center justify-between gap-3 sm:gap-4 select-none">
      {/* ─── 1. LEFT SECTION: BRAND & ASSIGNED BRANCH IN ONE UNIFIED COLUMN ─── */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile / Tablet Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="xl:hidden w-8 h-8 -ml-1 rounded-lg flex items-center justify-center text-ink hover:bg-[#F3EEF9] transition-colors cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-[#5A2EA6]" />
        </button>

        <div className="relative group/branch shrink-0">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
            title={`Assigned Branch: ${assignedBranch?.name || '  Salon'} (${assignedBranch?.code || 'ACTIVE'})`}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover/branch:scale-105 transition-transform shrink-0">
              {(assignedBranch?.name || 'S')[0].toUpperCase()}
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <div className="flex items-center gap-1.5">
                <b className="font-serif font-bold text-[15px] text-ink tracking-tight max-w-[140px] truncate">
                  {assignedBranch?.name || '  Salon'}
                </b>
                <span className="px-1.5 py-0.2 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[8.5px] font-bold tracking-wider uppercase font-mono">
                  {assignedBranch?.code || 'BRANCH'}
                </span>
                {availableBranches && availableBranches.length > 1 && (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover/branch:text-[#5A2EA6] transition-colors" />
                )}
              </div>
              <span className="block text-[10px] font-medium text-slate-500 truncate max-w-[180px]">
                {assignedBranch?.type || 'Flagship Branch'} · {assignedBranch?.city || 'Bhopal'}
              </span>
            </div>
          </div>

          {availableBranches && availableBranches.length > 1 && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#5A2EA6]/15 py-2 hidden group-hover/branch:block z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                Switch Branch
              </div>
              <div className="max-h-60 overflow-y-auto">
                {availableBranches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectBranch(b.id);
                    }}
                    className={cn(
                      'w-full px-3.5 py-2 text-left text-xs flex items-center justify-between hover:bg-purple-50/60 transition-colors cursor-pointer border-0 bg-transparent',
                      b.id?.toLowerCase() === assignedBranch?.id?.toLowerCase()
                        ? 'bg-purple-50 text-[#5A2EA6] font-bold'
                        : 'text-ink font-medium',
                    )}
                  >
                    <span className="truncate">{b.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      {b.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── 2. CENTER SECTION: NAVIGATION DROPDOWNS & TABS (6 STREAMLINED ITEMS) ─── */}
      <nav className="hidden xl:flex items-center gap-1 lg:gap-1.5 flex-1 justify-center max-w-4xl">
        {/* 1. Dashboard Tab */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none outline-none border border-transparent shrink-0 whitespace-nowrap',
            isDashboardActive
              ? 'bg-[#5A2EA6] text-white shadow-xs font-bold'
              : 'text-soft/90 hover:text-ink hover:bg-[#FAF8FC]',
          )}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* 2. Operations Dropdown (Front Desk & Diary) */}
        {operationsItems.length > 0 && (
          <NavDropdown
            label="Operations"
            icon={<Calendar className="w-4 h-4" />}
            isActive={isOperationsGroupActive}
            categoryLabel="Front Desk & Diary Management"
            footerNote="Real-time multi-stylist diary, appointment bookings & live walk-in queue."
            items={operationsItems}
          />
        )}

        {/* 3. Clients & Team Dropdown */}
        {clientsTeamItems.length > 0 && (
          <NavDropdown
            label="Clients & Team"
            icon={<Users className="w-4 h-4" />}
            isActive={isClientsTeamGroupActive}
            categoryLabel="Customer CRM, Staff & Service Menu"
            footerNote="Client profiles, health records, stylist rosters and branch service catalog."
            items={clientsTeamItems}
          />
        )}

        {/* 4. Catalogue Tab */}
        {canViewCatalogue && (
          <button
            type="button"
            onClick={() => navigate('/catalogue')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none outline-none border border-transparent shrink-0 whitespace-nowrap',
              isCatalogueActive
                ? 'bg-[#5A2EA6] text-white shadow-xs font-bold'
                : 'text-soft/90 hover:text-ink hover:bg-[#FAF8FC]',
            )}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Catalogue</span>
          </button>
        )}

        {/* 5. POS & Commercial Dropdown */}
        {commercialItems.length > 0 && (
          <NavDropdown
            label="POS & Commercial"
            icon={<CreditCard className="w-4 h-4" />}
            isActive={isCommercialGroupActive}
            categoryLabel="Billing, Retail Shelf Stock & Shifts"
            footerNote="Fast POS invoicing, split payments, retail products and shift closing."
            items={commercialItems}
          />
        )}

        {/* 5. Reports & Analytics Tab */}
        {canViewReports && (
          <button
            type="button"
            onClick={() => navigate('/reports')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none outline-none border border-transparent shrink-0 whitespace-nowrap',
              isReportsActive
                ? 'bg-[#5A2EA6] text-white shadow-xs font-bold'
                : 'text-soft/90 hover:text-ink hover:bg-[#FAF8FC]',
            )}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Reports</span>
          </button>
        )}

        {/* 6. Settings Tab */}
        {canViewSettings && (
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none outline-none border border-transparent shrink-0 whitespace-nowrap',
              isSettingsActive
                ? 'bg-[#5A2EA6] text-white shadow-xs font-bold'
                : 'text-soft/90 hover:text-ink hover:bg-[#FAF8FC]',
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>
        )}
      </nav>

      {/* ─── 3. RIGHT SECTION: SHIFT BADGE, NOTIFICATIONS & USER PROFILE ─── */}
      <div className="flex items-center gap-2.5 shrink-0 ml-auto relative">
        {/* Shift Badge Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Shift #01 Active</span>
        </div>

        {/* Notification Bell with Popup Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={cn(
              'relative w-8 h-8 rounded-full flex items-center justify-center transition-colors border cursor-pointer',
              isNotificationOpen
                ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                : 'text-soft hover:text-[#5A2EA6] hover:bg-[#F6F4FF] border-line/60 bg-white',
            )}
            title="Branch Operations & Allergy Alerts"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Floating Notification Popup List */}
          <NotificationDropdown
            notifications={notifications}
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>

        {/* User Profile Avatar Pill */}
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-line/70 hover:border-[#5A2EA6]/40 bg-white hover:bg-[#FAF8FC] transition-all cursor-pointer shadow-xs group shrink-0"
          title={`Assigned Manager: ${user?.fullName || currentStaff?.fullName || 'Manager'} · ${assignedBranch?.name || 'Assigned Branch'}`}
        >
          <Avatar
            variant="circle-profile"
            initials={
              user?.fullName
                ? user.fullName
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
                : currentStaff?.avatarInitials || 'BM'
            }
            className="bg-[#5A2EA6] text-white shrink-0 shadow-xs w-7 h-7 ring-2 ring-white text-[11px] font-bold"
          />
          <div className="hidden sm:block text-left leading-tight pr-1">
            <strong className="block text-ink text-[11.5px] font-bold truncate group-hover:text-[#5A2EA6] transition-colors max-w-[95px] lg:max-w-[125px]">
              {user?.fullName || currentStaff?.fullName || user?.email || 'Branch Lead'}
            </strong>
            <span className="text-[9px] text-[#5A2EA6] font-semibold block truncate max-w-[95px] lg:max-w-[125px]">
              {assignedBranch?.name ? assignedBranch.name : (user?.roles?.[0]?.name || user?.role || 'Branch Manager')}
            </span>
          </div>
        </div>
      </div>

      {/* Branch Manager Profile & Cashier PIN Modal */}
      <BranchManagerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* ─── 4. MOBILE/TABLET NAVIGATION DRAWER (Rendered via Portal to document.body) ─── */}
      {isMobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] xl:hidden flex" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 z-[9999]"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer content */}
            <div className="fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white h-[100dvh] h-screen shadow-2xl flex flex-col z-[10000] animate-in slide-in-from-left duration-200 overflow-hidden">
              {/* Drawer Header */}
              <div className="p-4 border-b border-line/60 flex items-center justify-between bg-[#FAF8FC] shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm shrink-0">
                    {(assignedBranch?.name || 'S')[0].toUpperCase()}
                  </div>
                  <div className="leading-tight min-w-0">
                    <b className="font-serif font-bold text-[14px] text-ink block truncate max-w-[170px]">
                      {assignedBranch?.name || '  Salon'}
                    </b>
                    <span className="text-[9px] text-[#5A2EA6] font-bold uppercase tracking-wider block">
                      {assignedBranch?.code || 'BRANCH'} · {assignedBranch?.city || 'Local'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer border-0 bg-transparent shrink-0"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links Scrollable */}
              <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4 custom-scroll">
                {/* Dashboard */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/');
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all text-left cursor-pointer',
                      isDashboardActive
                        ? 'bg-[#5A2EA6] text-white font-bold shadow-xs'
                        : 'text-ink hover:bg-[#FAF8FC]',
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>Dashboard Overview</span>
                  </button>
                </div>

                {/* Front Desk & Operations */}
                {operationsItems.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                      Front Desk & Operations
                    </span>
                    <div className="space-y-0.5">
                      {operationsItems.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            navigate(item.path);
                            setIsMobileMenuOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                            item.isActive
                              ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                              : 'text-ink/80 hover:bg-[#FAF8FC]',
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-line/50 text-soft">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clients & Team */}
                {clientsTeamItems.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                      Clients & Team
                    </span>
                    <div className="space-y-0.5">
                      {clientsTeamItems.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            navigate(item.path);
                            setIsMobileMenuOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                            item.isActive
                              ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                              : 'text-ink/80 hover:bg-[#FAF8FC]',
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-line/50 text-soft">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Catalogue Overview */}
                {canViewCatalogue && (
                  <div>
                    <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                      Master Catalogue
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/catalogue');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isCatalogueActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#5A2EA6] shrink-0" />
                        <span>Catalogue</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6]">
                        View Only
                      </span>
                    </button>
                  </div>
                )}

                {/* POS & Commercial */}
                {commercialItems.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                      POS & Commercial
                    </span>
                    <div className="space-y-0.5">
                      {commercialItems.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            navigate(item.path);
                            setIsMobileMenuOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                            item.isActive
                              ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                              : 'text-ink/80 hover:bg-[#FAF8FC]',
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-line/50 text-soft">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights & Settings */}
                {(canViewReports || canViewSettings) && (
                  <div>
                    <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                      Insights & Settings
                    </span>
                    <div className="space-y-0.5">
                      {canViewReports && (
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/reports');
                            setIsMobileMenuOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                            isReportsActive
                              ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                              : 'text-ink/80 hover:bg-[#FAF8FC]',
                          )}
                        >
                          <BarChart3 className="w-4 h-4 shrink-0" />
                          <span>Reports & Analytics</span>
                        </button>
                      )}

                      {canViewSettings && (
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/settings');
                            setIsMobileMenuOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                            isSettingsActive
                              ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                              : 'text-ink/80 hover:bg-[#FAF8FC]',
                          )}
                        >
                          <Settings className="w-4 h-4 shrink-0" />
                          <span>Branch Settings</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </nav>

              {/* Drawer Footer / User Profile */}
              <div className="p-3 border-t border-line/60 bg-[#FAF8FC]">
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      variant="circle-profile"
                      initials={
                        user?.fullName
                          ? user.fullName
                            .split(' ')
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()
                          : currentStaff?.avatarInitials || 'BM'
                      }
                      className="bg-[#5A2EA6] text-white shrink-0 shadow-xs w-8 h-8 ring-2 ring-white text-[11px] font-bold"
                    />
                    <div className="min-w-0">
                      <strong className="block text-ink text-[12px] font-bold truncate">
                        {user?.fullName || currentStaff?.fullName || user?.email || 'Branch Lead'}
                      </strong>
                      <span className="text-[9.5px] text-[#5A2EA6] font-semibold block truncate">
                        {assignedBranch?.name ? assignedBranch.name : 'Branch Manager'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted shrink-0" />
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}

export default TopNavbar;
