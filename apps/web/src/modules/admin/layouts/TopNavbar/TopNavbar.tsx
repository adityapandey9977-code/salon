import { Avatar, cn, useToast } from '@salon-spa-saas/ui';
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Crown,
  History,
  Layers,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router';
import { NotificationDropdown } from '../../components/NotificationDropdown';
import { type AdminNotification, initialAdminNotifications } from '../../data/notificationsData';
import { BrandOwnerProfileModal } from '../Sidebar/BrandOwnerProfileModal';
import { LocationSelector } from './LocationSelector';
import { NavDropdown } from './NavDropdown';
import { useAdminContext } from '../../context/AdminContext';

export function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { salon, selectedLocation, setSelectedLocation, locationsList } = useAdminContext();
  const pathname = location.pathname;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<AdminNotification[]>(initialAdminNotifications);

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

  const salonInitial = (salon?.name || 'S').trim().charAt(0).toUpperCase();
  const ownerName = salon?.ownerName || 'Salon Owner';
  const ownerInitials =
    ownerName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'SO';

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast('All notifications marked as read.');
  };

  // Active path checking helpers
  const isDashboardActive = pathname === '/' || pathname === '/dashboard';
  const isLocationsActive = pathname.startsWith('/locations') || pathname.startsWith('/branches');
  const isCatalogueActive =
    pathname.startsWith('/catalogue') ||
    pathname.startsWith('/services-pricing') ||
    pathname.startsWith('/services');
  const isClientsActive = pathname.startsWith('/clients') || pathname.startsWith('/customers');
  const isStaffActive =
    pathname.startsWith('/staff') ||
    pathname.startsWith('/managers') ||
    pathname.startsWith('/team');
  const isOperationsActive =
    pathname.startsWith('/operations') ||
    pathname.startsWith('/appointments') ||
    pathname.startsWith('/walkins');
  const isBusinessGroupActive =
    isLocationsActive ||
    isCatalogueActive ||
    isClientsActive ||
    isStaffActive ||
    isOperationsActive;

  const isPackagesActive =
    pathname.startsWith('/packages-memberships') ||
    pathname.startsWith('/packages') ||
    pathname.startsWith('/memberships');
  const isFinanceActive = pathname.startsWith('/finance') || pathname.startsWith('/payments');
  const isInventoryActive =
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/inventory-analytics') ||
    pathname.startsWith('/retail');
  const isMarketingActive = pathname.startsWith('/marketing');
  const isCommercialGroupActive =
    isPackagesActive || isFinanceActive || isInventoryActive || isMarketingActive;

  const isFranchiseActive = pathname.startsWith('/franchise');
  const isReportsActive =
    pathname.startsWith('/reports-analytics') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/analytics');

  const isSettingsActive =
    pathname.startsWith('/brand-settings') || pathname.startsWith('/settings');
  const isRolesActive = pathname.startsWith('/roles-permissions') || pathname.startsWith('/roles');
  const isAuditActive = pathname.startsWith('/audit-logs');
  const isAdministrationGroupActive = isSettingsActive || isRolesActive || isAuditActive;

  return (
    <header className="w-full bg-white border-b border-line/70 px-3 sm:px-4 lg:px-7 py-2.5 flex items-center justify-between gap-3 sm:gap-4 select-none">
      {/* ─── 1. LEFT SECTION: BRAND IDENTITY & LOCATION SELECTOR ─── */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
        {/* Mobile / Tablet Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="xl:hidden w-8 h-8 -ml-1 rounded-lg flex items-center justify-center text-ink hover:bg-[#F3EEF9] transition-colors cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-[#5A2EA6]" />
        </button>

        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          title={`${salon?.name || 'Salon'} HQ - Brand Owner / Head Office`}
        >
          <div
            className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0"
            style={{
              background: `linear-gradient(135deg, ${salon?.primaryColor || '#5A2EA6'}, #8B6FD8)`,
            }}
          >
            {salonInitial}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="flex items-center gap-1.5">
              <b className="font-serif font-bold text-[15px] text-ink tracking-tight truncate max-w-[140px] md:max-w-[180px]">
                {salon?.name || 'Salon'}
              </b>
              <span className="px-1.5 py-0.2 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[8px] font-bold uppercase tracking-wider">
                {salon?.city ? `HQ · ${salon.city}` : 'HQ'}
              </span>
            </div>
            <span className="block uppercase tracking-[0.8px] text-[7.5px] font-bold text-[#5A2EA6]">
              Brand Owner / Head Office
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-line/80 hidden sm:block shrink-0" />

        {/* Location Selector */}
        <div className="shrink-0">
          <LocationSelector />
        </div>
      </div>

      {/* ─── 2. CENTER SECTION: NAVIGATION DROPDOWNS & TABS ─── */}
      <nav className="hidden xl:flex items-center gap-1 lg:gap-1.5 flex-1 justify-center max-w-4xl">
        {/* Dashboard Tab */}
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

        {/* Business Dropdown */}
        <NavDropdown
          label="Business"
          icon={<Briefcase className="w-4 h-4" />}
          isActive={isBusinessGroupActive}
          categoryLabel="Business & Salon Operations"
          footerNote="Manage core locations, services, staff, and appointments."
          items={[
            {
              icon: <MapPin className="w-3.5 h-3.5" />,
              label: 'Locations',
              path: '/locations',
              badge: String(salon?.branchesCount ?? salon?.branches?.length ?? 0),
              description: 'Branches, working hours & calendars',
              isActive: isLocationsActive,
            },
            {
              icon: <Sparkles className="w-3.5 h-3.5" />,
              label: 'Catalogue',
              path: '/catalogue',
              description: 'Services, pricing, buffers & recipes',
              isActive: isCatalogueActive,
            },
            {
              icon: <Users className="w-3.5 h-3.5" />,
              label: 'Clients',
              path: '/clients',
              description: 'Client CRM, history & segments',
              isActive: isClientsActive,
            },
            {
              icon: <UserCheck className="w-3.5 h-3.5" />,
              label: 'Staff',
              path: '/staff',
              description: 'Stylists, rosters & productivity',
              isActive: isStaffActive,
            },
            {
              icon: <CalendarClock className="w-3.5 h-3.5" />,
              label: 'Operations',
              path: '/operations',
              description: 'Appointments, diary & walk-in queue',
              isActive: isOperationsActive,
            },
          ]}
        />

        {/* Commercial Dropdown */}
        <NavDropdown
          label="Commercial"
          icon={<Layers className="w-4 h-4" />}
          isActive={isCommercialGroupActive}
          categoryLabel="Commercial, Revenue & Assets"
          footerNote="Financial transactions, stock levels and marketing campaigns."
          items={[
            {
              icon: <Crown className="w-3.5 h-3.5" />,
              label: 'Packages & Memberships',
              path: '/packages-memberships',
              description: 'Session balances, tiers & loyalty',
              isActive: isPackagesActive,
            },
            {
              icon: <CreditCard className="w-3.5 h-3.5" />,
              label: 'Finance',
              path: '/finance',
              description: 'GST billing, payments & settlements',
              isActive: isFinanceActive,
            },
            {
              icon: <Package className="w-3.5 h-3.5" />,
              label: 'Inventory',
              path: '/inventory',
              description: 'Stock, procurement & consumables',
              isActive: isInventoryActive,
            },
            {
              icon: <Megaphone className="w-3.5 h-3.5" />,
              label: 'Marketing',
              path: '/marketing',
              description: 'WhatsApp, campaigns & rebooking',
              isActive: isMarketingActive,
            },
          ]}
        />

        {/* Franchise Tab */}
        <button
          type="button"
          onClick={() => navigate('/franchise')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none outline-none border border-transparent shrink-0 whitespace-nowrap',
            isFranchiseActive
              ? 'bg-[#5A2EA6] text-white shadow-xs font-bold'
              : 'text-soft/90 hover:text-ink hover:bg-[#FAF8FC]',
          )}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>Franchise</span>
          <span
            className={cn(
              'text-[9px] font-bold px-1.5 py-0.2 rounded-full',
              isFranchiseActive ? 'bg-white/20 text-white' : 'bg-[#5A2EA6]/10 text-[#5A2EA6]',
            )}
          >
            New
          </span>
        </button>

        {/* Reports & Analytics Tab */}
        <button
          type="button"
          onClick={() => navigate('/reports-analytics')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none outline-none border border-transparent shrink-0 whitespace-nowrap',
            isReportsActive
              ? 'bg-[#5A2EA6] text-white shadow-xs font-bold'
              : 'text-soft/90 hover:text-ink hover:bg-[#FAF8FC]',
          )}
        >
          <BarChart3 className="w-4 h-4 shrink-0" />
          <span>Reports</span>
        </button>

        {/* Administration Dropdown */}
        <NavDropdown
          label="Administration"
          icon={<Settings className="w-4 h-4" />}
          isActive={isAdministrationGroupActive}
          categoryLabel="Governance & Security"
          footerNote="Brand configuration, RBAC permissions and audit lineage."
          items={[
            {
              icon: <Sliders className="w-3.5 h-3.5" />,
              label: 'Brand Settings',
              path: '/brand-settings',
              description: 'Brand profile, tax policies & rules',
              isActive: isSettingsActive,
            },
            {
              icon: <ShieldCheck className="w-3.5 h-3.5" />,
              label: 'Roles & Permissions',
              path: '/roles-permissions',
              description: 'Access matrix & role assignments',
              isActive: isRolesActive,
            },
            {
              icon: <History className="w-3.5 h-3.5" />,
              label: 'Audit Logs',
              path: '/audit-logs',
              description: 'Immutable compliance action history',
              isActive: isAuditActive,
            },
          ]}
        />
      </nav>

      {/* ─── 3. RIGHT SECTION: NOTIFICATIONS & USER PROFILE ─── */}
      <div className="flex items-center gap-2.5 shrink-0 ml-auto relative">
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
            title="Notifications & Alerts"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
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
          title="Click to view & update Brand Owner profile or change password"
        >
          <Avatar
            variant="circle-profile"
            initials={ownerInitials}
            className="bg-[#5A2EA6] text-white shrink-0 shadow-xs w-7 h-7 ring-2 ring-white text-[11px] font-bold"
          />
          <div className="hidden sm:block text-left leading-tight pr-1">
            <strong className="block text-ink text-[11.5px] font-bold truncate group-hover:text-[#5A2EA6] transition-colors max-w-[100px] lg:max-w-[120px]">
              {ownerName}
            </strong>
            <span className="text-[9px] text-[#5A2EA6] font-semibold block truncate">
              Salon Owner · HQ
            </span>
          </div>
        </div>
      </div>

      {/* Brand Owner Profile & Password Security Modal */}
      <BrandOwnerProfileModal
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
                  <div
                    className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${salon?.primaryColor || '#5A2EA6'}, #8B6FD8)`,
                    }}
                  >
                    {salonInitial}
                  </div>
                  <div className="leading-tight min-w-0">
                    <b className="font-serif font-bold text-[14px] text-ink block truncate max-w-[170px]">
                      {salon?.name || 'Salon'}
                    </b>
                    <span className="text-[9px] text-[#5A2EA6] font-bold uppercase tracking-wider block">
                      HQ · Management
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

              {/* Location Selector Mobile */}
              <div className="p-3 border-b border-line/40 bg-white shrink-0">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    Branch Context
                  </span>
                  <span className="text-[10px] text-[#5A2EA6] font-semibold">
                    {locationsList.length} Available
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={selectedLocation.id}
                    onChange={(e) => {
                      const found = locationsList.find((loc) => loc.id === e.target.value);
                      if (found) setSelectedLocation(found);
                    }}
                    className="w-full text-[12px] font-semibold text-ink bg-[#FAF8FC] border border-line/70 rounded-xl px-3 py-2 pr-8 outline-none focus:border-[#5A2EA6] appearance-none cursor-pointer shadow-xs"
                  >
                    {locationsList.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.subtitle ? `· ${loc.subtitle}` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
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

                {/* Business & Operations */}
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                    Business & Operations
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/locations');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isLocationsActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>Locations & Branches</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-line/50 text-soft">
                        {salon?.branchesCount ?? salon?.branches?.length ?? 0}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/catalogue');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isCatalogueActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Service Catalogue</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/clients');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isClientsActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <Users className="w-4 h-4 shrink-0" />
                      <span>Clients & CRM</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/staff');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isStaffActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <UserCheck className="w-4 h-4 shrink-0" />
                      <span>Staff & Roster</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/operations');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isOperationsActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <CalendarClock className="w-4 h-4 shrink-0" />
                      <span>Operations & Diary</span>
                    </button>
                  </div>
                </div>

                {/* Commercial & Revenue */}
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                    Commercial & Revenue
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/packages-memberships');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isPackagesActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <Crown className="w-4 h-4 shrink-0" />
                      <span>Packages & Memberships</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/finance');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isFinanceActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>Finance & Billing</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/inventory');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isInventoryActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <Package className="w-4 h-4 shrink-0" />
                      <span>Inventory & Stock</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/marketing');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isMarketingActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <Megaphone className="w-4 h-4 shrink-0" />
                      <span>Marketing & Campaigns</span>
                    </button>
                  </div>
                </div>

                {/* Growth & Insights */}
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                    Growth & Insights
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/franchise');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isFranchiseActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span>Franchise Network</span>
                      </div>
                      <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6]">
                        New
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/reports-analytics');
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
                  </div>
                </div>

                {/* Administration & Governance */}
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block px-2 mb-1">
                    Governance
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/brand-settings');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isSettingsActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <Sliders className="w-4 h-4 shrink-0" />
                      <span>Brand Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/roles-permissions');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isRolesActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Roles & Permissions</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/audit-logs');
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all text-left cursor-pointer',
                        isAuditActive
                          ? 'bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold'
                          : 'text-ink/80 hover:bg-[#FAF8FC]',
                      )}
                    >
                      <History className="w-4 h-4 shrink-0" />
                      <span>Audit Logs</span>
                    </button>
                  </div>
                </div>
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
                      initials={ownerInitials}
                      className="bg-[#5A2EA6] text-white shrink-0 shadow-xs w-8 h-8 ring-2 ring-white text-[11px] font-bold"
                    />
                    <div className="min-w-0">
                      <strong className="block text-ink text-[12px] font-bold truncate">
                        {ownerName}
                      </strong>
                      <span className="text-[9.5px] text-[#5A2EA6] font-semibold block truncate">
                        Brand Owner · Profile
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
