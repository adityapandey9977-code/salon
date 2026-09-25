import { Avatar, cn } from '@salon-spa-saas/ui';
import {
  Bell,
  Calendar,
  Camera,
  ChevronDown,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Pin,
  Scissors,
  Sparkles,
  Trophy,
  User,
  UserCheck,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/shared/context/AuthContext';

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
        'flex items-center gap-[8px] w-full border-0 bg-transparent text-left transition-all duration-200 cursor-pointer relative select-none outline-none min-h-[38px]',
        isCollapsed
          ? 'justify-center py-[8px] px-0 rounded-l-[10px] rounded-r-none'
          : 'pl-[14px] pr-[10px] py-[6px] rounded-l-[14px] rounded-r-none',
        isActive
          ? 'sidebar-active-cutout font-bold text-sage'
          : 'text-soft/80 hover:bg-white/35 hover:text-ink active:bg-white/40',
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
      {!isCollapsed && <span className="text-[12.5px] tracking-[0.1px] truncate">{label}</span>}
      {!isCollapsed && badge && <span className="ml-auto">{badge}</span>}
    </button>
  );
}

export function StylistSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('stylist-sidebar-collapsed') === 'true';
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
      localStorage.setItem('stylist-sidebar-collapsed', String(next));
      return next;
    });
  };

  const navGroups = [
    {
      group: 'CORE WORKSPACE',
      items: [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-[13px] h-[13px]" /> },
        {
          path: '/schedule',
          label: 'My Schedule',
          icon: <Calendar className="w-[13px] h-[13px]" />,
          badge: (
            <span className="text-[8px] font-bold bg-[#8b70a7]/20 text-sage rounded-full px-1.5 py-0.2">
              6 Today
            </span>
          ),
        },
        { path: '/clients', label: 'My Clients', icon: <Users className="w-[13px] h-[13px]" /> },
      ],
    },
    {
      group: 'SERVICE & TREATMENT',
      items: [
        {
          path: '/consultation',
          label: 'Consultation',
          icon: <ClipboardList className="w-[13px] h-[13px]" />,
        },
        {
          path: '/services',
          label: 'Service Management',
          icon: <Scissors className="w-[13px] h-[13px]" />,
          badge: (
            <span className="text-[8px] font-bold bg-emerald-500/20 text-emerald-800 rounded-full px-1.5 py-0.2">
              1 Active
            </span>
          ),
        },
        {
          path: '/formulas',
          label: 'Formulas & Recipes',
          icon: <FlaskConical className="w-[13px] h-[13px]" />,
        },
        {
          path: '/photos',
          label: 'Before / After Photos',
          icon: <Camera className="w-[13px] h-[13px]" />,
        },
        {
          path: '/notes',
          label: 'Service Notes',
          icon: <FileText className="w-[13px] h-[13px]" />,
        },
        {
          path: '/recommendations',
          label: 'Recommendations',
          icon: <Lightbulb className="w-[13px] h-[13px]" />,
        },
      ],
    },
    {
      group: 'GROWTH & PROFILE',
      items: [
        {
          path: '/performance',
          label: 'Performance',
          icon: <Trophy className="w-[13px] h-[13px]" />,
        },
        {
          path: '/notifications',
          label: 'Notifications',
          icon: <Bell className="w-[13px] h-[13px]" />,
          badge: (
            <span className="text-[8px] font-bold bg-rose-500/20 text-rose-800 rounded-full px-1.5 py-0.2">
              3
            </span>
          ),
        },
        {
          path: '/profile',
          label: 'My Profile',
          icon: <UserCheck className="w-[13px] h-[13px]" />,
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 bg-pine text-soft transition-all duration-300 relative select-none overflow-visible',
        effectiveCollapsed
          ? 'w-[72px] p-[12px_0_8px] md:h-screen md:sticky md:top-0'
          : 'w-full md:w-[220px] p-[16px_0_8px] h-full md:h-screen md:sticky md:top-0',
      )}
    >
      {/* Absolute Toggle Button Sitting on Boundary (Desktop Only) */}
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

      {/* Sidebar Header / Brand Header */}
      <div
        className={cn(
          'pb-[12px] border-b border-line/30 mb-3',
          effectiveCollapsed ? 'px-[12px]' : 'px-[14px]',
        )}
      >
        <div className="flex items-center gap-[8px]">
          <Avatar
            variant="square-monogram"
            initials="A"
            className="bg-[#8b70a7] text-white shrink-0 shadow-sm w-7.5 h-7.5 font-bold"
          />
          {!effectiveCollapsed && (
            <div className="min-w-0">
              <b className="font-serif text-[15px] text-ink font-bold tracking-[0.2px] block truncate">
                Salon
              </b>
              <small className="block font-sans uppercase tracking-[1.2px] text-[8px] text-muted mt-[-2px] truncate">
                Stylist Terminal
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 flex flex-col gap-2.5 pr-0 pl-1.5 overflow-y-auto no-scrollbar">
        {navGroups.map((grp) => (
          <div key={grp.group}>
            {!effectiveCollapsed && (
              <label className="block px-[10px] pb-0.5 text-[8px] font-bold uppercase tracking-[0.8px] text-sage">
                {grp.group}
              </label>
            )}
            <nav className="flex flex-col gap-0.5">
              {grp.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <SidebarItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive}
                    isCollapsed={effectiveCollapsed}
                    badge={item.badge}
                    onClick={() => navigate(item.path)}
                  />
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className={cn('mt-auto pt-1.5 border-t border-line/30', effectiveCollapsed ? 'px-1' : 'px-2')}>
        <div className="flex gap-[6px] items-center p-[2px_6px] justify-center lg:justify-start">
          <Avatar
            variant="circle-profile"
            initials={user?.fullName?.substring(0, 2).toUpperCase() || 'S'}
            className="bg-[#8b70a7] text-white shrink-0 shadow-sm w-6.5 h-6.5"
          />
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <strong className="block text-ink text-[10.5px] font-bold truncate">
                  {user?.fullName || 'Stylist'}
                </strong>
                <span className="text-[9px] text-soft/75 block truncate">
                  {user?.role === 'STYLIST' || user?.roles?.some(r => r.code === 'STYLIST') ? 'Stylist' : user?.roles?.[0]?.name || 'Staff'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => logout().then(() => { window.location.href = '/stylist/login'; })}
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
