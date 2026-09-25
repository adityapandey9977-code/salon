import { useAuth } from '@/shared/context/AuthContext';
import { Avatar, cn } from '@salon-spa-saas/ui';
import {
  BarChart3,
  Building2,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Megaphone,
  Package,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Store,
  UserCheck,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { BrandOwnerProfileModal } from './BrandOwnerProfileModal';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  badge?: string;
  onClick: () => void;
}

function SidebarItem({ icon, label, isActive, isCollapsed, badge, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={cn(
        'group flex items-center gap-[10px] w-full border-0 bg-transparent text-left transition-all duration-200 cursor-pointer relative select-none outline-none',
        isCollapsed
          ? 'justify-center py-[9px] px-0 rounded-[12px] my-0.5'
          : 'pl-[14px] pr-[10px] py-[6.5px] rounded-l-[14px] rounded-r-none',
        isActive
          ? isCollapsed
            ? 'bg-[#5A2EA6] text-white shadow-sm font-bold'
            : 'sidebar-active-cutout font-bold text-sage bg-[#F6F4FF]'
          : 'text-soft/85 hover:bg-white/40 hover:text-ink',
      )}
    >
      <div
        className={cn(
          'shrink-0 transition-transform duration-200',
          isActive
            ? isCollapsed
              ? 'text-white'
              : 'text-sage scale-105'
            : 'text-muted group-hover:text-ink group-hover:scale-110',
        )}
      >
        {icon}
      </div>

      {!isCollapsed && (
        <div className="flex-1 flex items-center justify-between min-w-0 pr-1">
          <span className="text-[12px] tracking-[0.1px] truncate font-medium group-hover:font-semibold">
            {label}
          </span>
          {badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6]">
              {badge}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('brand-owner-sidebar-collapsed') === 'true';
  });

  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveCollapsed = isMobile ? false : isCollapsed;

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('brand-owner-sidebar-collapsed', String(next));
      return next;
    });
  };

  const pathname = location.pathname;

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

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 bg-pine text-soft transition-all duration-300 relative select-none overflow-visible border-r border-line/30',
        effectiveCollapsed
          ? 'w-[74px] p-[12px_6px_8px] md:h-screen md:sticky md:top-0'
          : 'w-full md:w-[240px] p-[16px_0_8px] h-full md:h-screen md:sticky md:top-0',
      )}
    >
      {/* Absolute Toggle Button (Desktop Only) */}
      <button
        onClick={toggleCollapse}
        className="hidden md:flex absolute top-[16px] -right-2.5 w-5 h-5 bg-white text-ink border border-line rounded-full items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-all z-50"
        aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {effectiveCollapsed ? (
          <ChevronRight className="w-3 h-3 text-[#5A2EA6]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[#5A2EA6]" />
        )}
      </button>

      {/* Header Badge: BRAND OWNER / HEAD OFFICE */}
      <div
        className={cn('pb-[12px] border-b border-line/30 mb-2', effectiveCollapsed ? 'px-1' : 'px-[14px]')}
      >
        <div className="flex items-center gap-[10px]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm shrink-0">
            A
          </div>
          {!effectiveCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <b className="font-serif font-bold text-[14px] text-ink tracking-tight block truncate">
                  Atelier
                </b>
                <span className="px-1.5 py-0.2 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[8px] font-bold uppercase tracking-wider">
                  HQ
                </span>
              </div>
              <span className="block uppercase tracking-[0.8px] text-[7.5px] font-bold text-[#5A2EA6] mt-0.5 truncate">
                Brand Owner / Head Office
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Brand / Multi-Location Selector */}
      <div className={cn('mb-2.5', effectiveCollapsed ? 'px-1' : 'px-2')}>
        <div className="flex gap-[6px] items-center border border-line/40 p-[5px_8px] bg-white/45 rounded-xl justify-center lg:justify-start hover:bg-white/70 transition-colors cursor-pointer shadow-xs">
          <div className="w-[20px] h-[20px] rounded-[6px] bg-[#cca080]/15 grid place-items-center text-[#cca080] shrink-0">
            <Store className="w-[11px] h-[11px] text-[#5A2EA6]" />
          </div>
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <strong className="block text-ink text-[10.5px] font-bold truncate">
                  All Branches (5)
                </strong>
                <span className="text-[8.5px] text-soft/80 block truncate font-medium">
                  Multi-Location HQ Network
                </span>
              </div>

              <button
                type="button"
                onClick={() => logout().then(() => { window.location.href = '/admin/login'; })}
                title="Sign Out"
                className="w-6.5 h-6.5 rounded-lg hover:bg-white/40 text-soft hover:text-rose-600 flex items-center justify-center transition cursor-pointer border-0 bg-transparent shrink-0 ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
              <div className="text-soft shrink-0">
                <ChevronDown className="w-3 h-3" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 flex flex-col gap-3 pr-0 pl-1.5 overflow-y-auto no-scrollbar pb-6">
        {/* ================= 1. CORE ================= */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[12px] pb-1 text-[8.5px] font-bold uppercase tracking-[1px] text-[#5A2EA6]">
              Core
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<LayoutDashboard className="w-[14px] h-[14px]" />}
              label="Dashboard"
              isActive={isDashboardActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/')}
            />
            <SidebarItem
              icon={<MapPin className="w-[14px] h-[14px]" />}
              label="Locations"
              isActive={isLocationsActive}
              isCollapsed={effectiveCollapsed}
              badge="5"
              onClick={() => navigate('/locations')}
            />
          </nav>
        </div>

        {/* ================= 2. BUSINESS ================= */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[12px] pb-1 text-[8.5px] font-bold uppercase tracking-[1px] text-[#5A2EA6]">
              Business
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<Sparkles className="w-[14px] h-[14px]" />}
              label="Catalogue"
              isActive={isCatalogueActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/catalogue')}
            />
            <SidebarItem
              icon={<Users className="w-[14px] h-[14px]" />}
              label="Clients"
              isActive={isClientsActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/clients')}
            />
            <SidebarItem
              icon={<UserCheck className="w-[14px] h-[14px]" />}
              label="Staff"
              isActive={isStaffActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/staff')}
            />
            <SidebarItem
              icon={<CalendarClock className="w-[14px] h-[14px]" />}
              label="Operations"
              isActive={isOperationsActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/operations')}
            />
          </nav>
        </div>

        {/* ================= 3. COMMERCIAL ================= */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[12px] pb-1 text-[8.5px] font-bold uppercase tracking-[1px] text-[#5A2EA6]">
              Commercial
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<Crown className="w-[14px] h-[14px]" />}
              label="Packages & Memberships"
              isActive={isPackagesActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/packages-memberships')}
            />
            <SidebarItem
              icon={<CreditCard className="w-[14px] h-[14px]" />}
              label="Finance"
              isActive={isFinanceActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/finance')}
            />
            <SidebarItem
              icon={<Package className="w-[14px] h-[14px]" />}
              label="Inventory"
              isActive={isInventoryActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/inventory')}
            />
            <SidebarItem
              icon={<Megaphone className="w-[14px] h-[14px]" />}
              label="Marketing"
              isActive={isMarketingActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/marketing')}
            />
          </nav>
        </div>

        {/* ================= 4. NETWORK ================= */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[12px] pb-1 text-[8.5px] font-bold uppercase tracking-[1px] text-[#5A2EA6]">
              Network
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<Building2 className="w-[14px] h-[14px]" />}
              label="Franchise"
              isActive={isFranchiseActive}
              isCollapsed={effectiveCollapsed}
              badge="New"
              onClick={() => navigate('/franchise')}
            />
          </nav>
        </div>

        {/* ================= 5. ANALYTICS ================= */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[12px] pb-1 text-[8.5px] font-bold uppercase tracking-[1px] text-[#5A2EA6]">
              Analytics
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<BarChart3 className="w-[14px] h-[14px]" />}
              label="Reports & Analytics"
              isActive={isReportsActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/reports-analytics')}
            />
          </nav>
        </div>

        {/* ================= 6. ADMINISTRATION ================= */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[12px] pb-1 text-[8.5px] font-bold uppercase tracking-[1px] text-[#5A2EA6]">
              Administration
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<Sliders className="w-[14px] h-[14px]" />}
              label="Brand Settings"
              isActive={isSettingsActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/brand-settings')}
            />
            <SidebarItem
              icon={<ShieldCheck className="w-[14px] h-[14px]" />}
              label="Roles & Permissions"
              isActive={isRolesActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/roles-permissions')}
            />
            <SidebarItem
              icon={<History className="w-[14px] h-[14px]" />}
              label="Audit Logs"
              isActive={isAuditActive}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/audit-logs')}
            />
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div
        className={cn(
          'mt-auto pt-2 border-t border-line/30 bg-pine',
          effectiveCollapsed ? 'px-1' : 'px-2',
        )}
      >
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="flex gap-[8px] items-center p-[5px_8px] rounded-xl bg-white/45 hover:bg-white/70 transition-all justify-center lg:justify-start cursor-pointer border border-line/30 shadow-3xs group"
          title="Click to view & update Brand Owner profile or change password"
        >
          <Avatar
            variant="circle-profile"
            initials="AS"
            className="bg-[#5A2EA6] text-white shrink-0 shadow-xs w-7 h-7 ring-2 ring-white"
          />
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <strong className="block text-ink text-[11px] font-bold truncate group-hover:text-[#5A2EA6] transition-colors">
                  Ananya Shah
                </strong>
                <span className="text-[9px] text-[#5A2EA6] font-semibold block truncate">
                  Super Director · HQ
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileModalOpen(true);
                }}
                className="text-soft hover:text-[#5A2EA6] p-1 rounded-lg hover:bg-purple-100/50 transition-colors border-0 bg-transparent cursor-pointer"
                title="Update Profile & Password"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Brand Owner Profile & Password Security Modal */}
      <BrandOwnerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </aside>
  );
}
