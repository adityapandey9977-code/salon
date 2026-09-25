import { useAuth } from '@/shared/context/AuthContext';
import { LogOut } from 'lucide-react';
import {
  ArrowRightIcon,
  Avatar,
  BoxIcon,
  CalendarIcon,
  ChartIcon,
  ChevronDownIcon,
  CreditCardIcon,
  OverviewIcon,
  PinIcon,
  ScissorsIcon,
  SettingsIcon,
  TeamIcon,
  UsersIcon,
  cn,
} from '@salon-spa-saas/ui';
import type React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useBranch } from '../../context/BranchContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  badge?: React.ReactNode;
  onClick: () => void;
}

function SidebarItem({ icon, label, isActive, isCollapsed, badge, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-[8px] w-full border-0 bg-transparent text-left transition-all duration-200 cursor-pointer relative select-none outline-none',
        isCollapsed
          ? 'justify-center py-[8px] px-0 rounded-l-[10px] rounded-r-none'
          : 'pl-[14px] pr-[10px] py-[6px] md:py-[5px] rounded-l-[14px] rounded-r-none',
        isActive
          ? 'sidebar-active-cutout font-bold text-sage'
          : 'text-soft/80 hover:bg-white/35 hover:text-ink',
      )}
    >
      <div
        className={cn(
          'shrink-0 transition-transform duration-200',
          isActive ? 'text-sage' : 'text-muted group-hover:scale-110',
        )}
      >
        {icon}
      </div>
      {!isCollapsed && (
        <>
          <span className="text-[12px] tracking-[0.1px] truncate">{label}</span>
          {badge && <span className="ml-auto">{badge}</span>}
        </>
      )}
    </button>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { assignedBranch } = useBranch();

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const effectiveCollapsed = isMobile ? false : isCollapsed;

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 bg-pine text-soft transition-all duration-300 sticky top-0 h-screen z-50 relative select-none overflow-visible w-full md:w-auto',
        effectiveCollapsed ? 'md:w-[72px] p-[12px_0_8px]' : 'w-full md:w-[220px] p-[16px_0_8px]',
      )}
    >
      {/* Absolute Toggle Button Sitting on Boundary - Desktop Only */}
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

      {/* Sidebar Header / Rounded Profile Container */}
      <div
        className={cn(
          'pb-[10px] border-b border-line/30 mb-2',
          effectiveCollapsed ? 'px-[12px]' : 'px-[14px]',
        )}
      >
        <div className="flex items-center gap-[8px]">
          <Avatar
            variant="square-monogram"
            initials="A"
            className="bg-[#8b70a7] text-white shrink-0 shadow-sm w-7.5 h-7.5"
          />
          {!effectiveCollapsed && (
            <div className="min-w-0">
              <b className="font-sans font-bold text-[13.5px] text-ink tracking-[0.1px] block truncate">
                Atelier
              </b>
              <small className="block uppercase tracking-[1px] text-[7.5px] text-muted mt-[0.2px] truncate">
                Salon operations
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Branch selector */}
      <div className={cn('mb-2.5', effectiveCollapsed ? 'px-1' : 'px-2')}>
        <div className="flex gap-[6px] items-center border border-line/40 p-[5px_8px] bg-white/40 rounded-xl justify-center lg:justify-start">
          <div className="w-[20px] h-[20px] rounded-[5px] bg-[#cca080]/10 grid place-items-center text-[#cca080] shrink-0">
            <PinIcon className="w-[11px] h-[11px]" />
          </div>
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <strong className="block text-ink text-[10.5px] font-semibold truncate">
                  {assignedBranch?.name || 'Assigned Branch'}
                </strong>
                <span className="text-[9px] text-soft/75 block truncate">
                  {assignedBranch?.code || 'BRANCH'} · {assignedBranch?.city || 'Local'}
                </span>
              </div>
              <div className="text-soft shrink-0">
                <ChevronDownIcon className="w-2.5 h-2.5" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 flex flex-col gap-2.5 pr-0 pl-1.5 overflow-y-auto no-scrollbar">
        {/* Today Section */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[10px] pb-0.5 text-[8px] font-bold uppercase tracking-[0.8px] text-sage">
              Today
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<OverviewIcon className="w-[13px] h-[13px]" />}
              label="Overview"
              isActive={location.pathname === '/'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/')}
            />
            <SidebarItem
              icon={<CalendarIcon className="w-[13px] h-[13px]" />}
              label="Appointments"
              isActive={location.pathname === '/appointments'}
              isCollapsed={effectiveCollapsed}
              badge={
                <span className="text-[8px] font-bold bg-[#8b70a7]/20 text-sage rounded-full px-1.5 py-0.2">
                  32
                </span>
              }
              onClick={() => navigate('/appointments')}
            />
            <SidebarItem
              icon={<ArrowRightIcon className="w-[13px] h-[13px]" />}
              label="Walk-ins"
              isActive={location.pathname === '/walk-ins'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/walk-ins')}
            />
          </nav>
        </div>

        {/* Manage Section */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[10px] pb-0.5 text-[8px] font-bold uppercase tracking-[0.8px] text-sage">
              Manage
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<UsersIcon className="w-[13px] h-[13px]" />}
              label="Customers"
              isActive={location.pathname === '/customers'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/customers')}
            />
            <SidebarItem
              icon={<ScissorsIcon className="w-[13px] h-[13px]" />}
              label="Services"
              isActive={location.pathname === '/services'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/services')}
            />
            <SidebarItem
              icon={<TeamIcon className="w-[13px] h-[13px]" />}
              label="Team"
              isActive={location.pathname === '/team'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/team')}
            />
            <SidebarItem
              icon={<BoxIcon className="w-[13px] h-[13px]" />}
              label="Retail &amp; stock"
              isActive={location.pathname === '/retail'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/retail')}
            />
            <SidebarItem
              icon={<CreditCardIcon className="w-[13px] h-[13px]" />}
              label="Payments"
              isActive={location.pathname === '/payments'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/payments')}
            />
          </nav>
        </div>

        {/* Insights Section */}
        <div>
          {!effectiveCollapsed && (
            <label className="block px-[10px] pb-0.5 text-[8px] font-bold uppercase tracking-[0.8px] text-sage">
              Insights
            </label>
          )}
          <nav className="flex flex-col gap-0.5">
            <SidebarItem
              icon={<ChartIcon className="w-[13px] h-[13px]" />}
              label="Reports"
              isActive={location.pathname === '/reports'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/reports')}
            />
            <SidebarItem
              icon={<SettingsIcon className="w-[13px] h-[13px]" />}
              label="Settings"
              isActive={location.pathname === '/settings'}
              isCollapsed={effectiveCollapsed}
              onClick={() => navigate('/settings')}
            />
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className={cn('mt-auto pt-1.5 border-t border-line/30', effectiveCollapsed ? 'px-1' : 'px-2')}>
        <div className="flex gap-[6px] items-center p-[2px_6px] justify-center lg:justify-start">
          <Avatar
            variant="circle-profile"
            initials="AS"
            className="bg-[#8b70a7] text-white shrink-0 shadow-sm w-6.5 h-6.5"
          />
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <strong className="block text-ink text-[10.5px] font-bold truncate">
                  Ananya Shah
                </strong>
                <span className="text-[9px] text-soft/75 block truncate">Branch Manager</span>
              </div>
              
              <button
                type="button"
                onClick={() => logout().then(() => { window.location.href = '/branch-manager/login'; })}
                title="Sign Out"
                className="w-6.5 h-6.5 rounded-lg hover:bg-white/40 text-soft hover:text-rose-600 flex items-center justify-center transition cursor-pointer border-0 bg-transparent shrink-0 ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
