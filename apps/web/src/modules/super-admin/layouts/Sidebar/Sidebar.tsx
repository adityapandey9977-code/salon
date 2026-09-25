import { Avatar, cn } from '@salon-spa-saas/ui';
import {
  Bell,
  Boxes,
  Building2,
  Command,
  CreditCard,
  Crown,
  Key,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Megaphone,
  Receipt,
  Scissors,
  ScrollText,
  Settings,
  Shield,
  ShieldCheck,
  ToggleLeft,
  User,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/shared/context/AuthContext';
import { useSuperAdminStore } from '../../context/SuperAdminContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  badge?: string;
}

function SidebarItem({ icon, label, isActive, isCollapsed, onClick, badge }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-[10px] w-full border-0 bg-transparent text-left transition-all duration-200 cursor-pointer relative select-none outline-none min-h-[40px]',
        isCollapsed
          ? 'justify-center py-[8px] px-0 rounded-l-[10px] rounded-r-none'
          : 'pl-[14px] pr-[10px] py-[7px] rounded-l-[14px] rounded-r-none',
        isActive
          ? 'sidebar-active-cutout font-bold text-sage'
          : 'text-soft/80 hover:bg-white/35 hover:text-ink active:bg-white/40',
      )}
    >
      <div
        className={cn(
          'shrink-0 transition-transform duration-200 flex items-center justify-center',
          isActive ? 'text-[#5A2EA6]' : 'text-[#8b70a7] group-hover:scale-110',
        )}
      >
        {icon}
      </div>
      {!isCollapsed && <span className="text-[13px] font-medium tracking-[0.1px] truncate">{label}</span>}
      {!isCollapsed && badge && (
        <span className="ml-auto text-[9.5px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6] rounded-full px-1.5 py-0.5">
          {badge}
        </span>
      )}
    </button>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { canAccess } = useSuperAdminStore();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
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

  // On mobile drawer, always keep fully expanded for readable navigation
  const effectiveCollapsed = isMobile ? false : isCollapsed;

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  // Grouped Navigation Items with Granular RBAC Filtering & Upgraded Crisp Icons
  const tenantItems = [
    { label: 'Salons / Tenants', path: '/salons', icon: <Building2 className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
    { label: 'Subscription Plans', path: '/subscription-plans', icon: <CreditCard className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
    { label: 'Billing & Payments', path: '/billing-payments', icon: <Receipt className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
  ].filter((item) => canAccess(item.path));

  const userItems = [
    { label: 'Users', path: '/users', icon: <Users className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
    { label: 'Roles & Permissions', path: '/roles-permissions', icon: <ShieldCheck className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
  ].filter((item) => canAccess(item.path));

  const operationItems = [
    { label: 'Support Tickets', path: '/support-tickets', icon: <LifeBuoy className="w-[17px] h-[17px]" strokeWidth={1.8} />, badge: '14' },
    { label: 'Announcements', path: '/announcements', icon: <Megaphone className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="w-[17px] h-[17px]" strokeWidth={1.8} />, badge: '4' },
    { label: 'Audit Logs', path: '/audit-logs', icon: <ScrollText className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
  ].filter((item) => canAccess(item.path));

  const systemItems = [
    { label: 'Integrations', path: '/integrations', icon: <Boxes className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
    { label: 'API Keys', path: '/api-keys', icon: <Key className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
    { label: 'Feature Flags', path: '/feature-flags', icon: <ToggleLeft className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
    { label: 'Profile', path: '/profile', icon: <User className="w-[17px] h-[17px]" strokeWidth={1.8} /> },
  ].filter((item) => canAccess(item.path));

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 bg-pine text-soft transition-all duration-300 relative select-none overflow-visible',
        effectiveCollapsed
          ? 'w-[72px] p-[12px_0_8px] md:h-screen md:sticky md:top-0'
          : 'w-full md:w-[220px] p-[16px_0_8px] h-full md:h-screen md:sticky md:top-0',
      )}
    >
      {/* Absolute Toggle Button (Desktop Only) */}
      <button
        onClick={toggleCollapse}
        className={cn(
          'hidden md:flex absolute top-[16px] -right-2.5 w-5 h-5 bg-white text-ink border border-line rounded-full items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-all z-50',
        )}
        aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {effectiveCollapsed ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-2.5 h-2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-2.5 h-2.5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        )}
      </button>

      {/* Sidebar Header with Premium Super Admin Logo & Title */}
      <div
        className={cn(
          'pb-[12px] border-b border-line/30 mb-3.5',
          effectiveCollapsed ? 'px-[12px]' : 'px-[14px]',
        )}
      >
        <div className="flex items-center gap-[10px]">
          {/* Brand Logo Badge */}
          <div className="w-[32px] h-[32px] rounded-lg bg-[#5A2EA6] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Scissors className="w-4 h-4 text-white" />
          </div>

          {!effectiveCollapsed && (
            <div className="min-w-0">
              <b className="font-sans font-bold text-[14.5px] text-ink tracking-[0.1px] block truncate">
                Super Admin
              </b>
              <small className="block uppercase tracking-[1px] text-[8px] font-bold text-[#5A2EA6] mt-[0.5px] truncate">
                Platform Console
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto pr-0 space-y-4 no-scrollbar">
        {/* Core Dashboard */}
        {canAccess('/') && (
          <div>
            <nav className={cn('flex flex-col gap-0.5', effectiveCollapsed ? 'pl-2' : 'pl-3.5')}>
              <SidebarItem
                icon={<LayoutDashboard className="w-[17px] h-[17px]" strokeWidth={1.8} />}
                label="Dashboard"
                isActive={location.pathname === '/' || location.pathname === ''}
                isCollapsed={effectiveCollapsed}
                onClick={() => navigate('/')}
              />
            </nav>
          </div>
        )}

        {/* Tenant Management Group */}
        {tenantItems.length > 0 && (
          <div>
            {!effectiveCollapsed && (
              <span className="block px-[18px] py-1 text-[9.5px] font-bold uppercase tracking-wider text-muted/70">
                Tenant Management
              </span>
            )}
            <nav className={cn('flex flex-col gap-0.5 mt-1', effectiveCollapsed ? 'pl-2' : 'pl-3.5')}>
              {tenantItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                  isCollapsed={effectiveCollapsed}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </nav>
          </div>
        )}

        {/* User Management Group */}
        {userItems.length > 0 && (
          <div>
            {!effectiveCollapsed && (
              <span className="block px-[18px] py-1 text-[9.5px] font-bold uppercase tracking-wider text-muted/70">
                User Management
              </span>
            )}
            <nav className={cn('flex flex-col gap-0.5 mt-1', effectiveCollapsed ? 'pl-2' : 'pl-3.5')}>
              {userItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                  isCollapsed={effectiveCollapsed}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </nav>
          </div>
        )}

        {/* Operations Group */}
        {operationItems.length > 0 && (
          <div>
            {!effectiveCollapsed && (
              <span className="block px-[18px] py-1 text-[9.5px] font-bold uppercase tracking-wider text-muted/70">
                Operations
              </span>
            )}
            <nav className={cn('flex flex-col gap-0.5 mt-1', effectiveCollapsed ? 'pl-2' : 'pl-3.5')}>
              {operationItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                  isCollapsed={effectiveCollapsed}
                  onClick={() => navigate(item.path)}
                  badge={item.badge}
                />
              ))}
            </nav>
          </div>
        )}

        {/* System Group */}
        {systemItems.length > 0 && (
          <div>
            {!effectiveCollapsed && (
              <span className="block px-[18px] py-1 text-[9.5px] font-bold uppercase tracking-wider text-muted/70">
                System
              </span>
            )}
            <nav className={cn('flex flex-col gap-0.5 mt-1', effectiveCollapsed ? 'pl-2' : 'pl-3.5')}>
              {systemItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                  isCollapsed={effectiveCollapsed}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className={cn('mt-auto pt-2 border-t border-line/30', effectiveCollapsed ? 'px-1' : 'px-2')}>
        <div className="flex gap-[6px] items-center p-[2px_6px] justify-between">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            title="View Profile"
            className="flex items-center gap-[8px] min-w-0 text-left cursor-pointer border-0 bg-transparent hover:bg-white/40 p-1 -m-1 rounded-xl transition-all flex-1"
          >
            <Avatar
              variant="circle-profile"
              initials={user?.fullName ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'SA'}
              className="bg-[#5A2EA6] text-white shrink-0 shadow-sm w-7 h-7 text-[10.5px] font-bold"
            />
            {!effectiveCollapsed && (
              <div className="min-w-0">
                <strong className="block text-ink text-[11px] font-bold truncate max-w-[100px]">
                  {user?.fullName || 'Super Admin'}
                </strong>
                <span className="text-[9px] text-[#5A2EA6] font-semibold block truncate">
                  Super Admin
                </span>
              </div>
            )}
          </button>

          {!effectiveCollapsed && (
            <button
              type="button"
              onClick={() => logout().then(() => { window.location.href = '/super-admin/login'; })}
              title="Sign Out"
              className="w-6.5 h-6.5 rounded-lg hover:bg-white/40 text-soft hover:text-rose-600 flex items-center justify-center transition cursor-pointer border-0 bg-transparent shrink-0 ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

