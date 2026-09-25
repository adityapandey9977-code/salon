import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Avatar, cn } from '@salon-spa-saas/ui';
import {
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Globe,
  Headphones,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MapPin,
  PackageCheck,
  PhoneCall,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuth } from '@/shared/api';
import { useCallCenterBranch } from '../../context/CallCenterBranchContext';

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
          : 'pl-[14px] pr-[10px] py-[5px] rounded-l-[14px] rounded-r-none',
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

export function CallCenterSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    agentStatus,
    setAgentStatus,
  } = useCallCenterBranch();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('callcenter-sidebar-collapsed') === 'true';
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

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('callcenter-sidebar-collapsed', String(next));
      return next;
    });
  };

  const navGroups = [
    {
      group: 'CORE CONCIERGE',
      items: [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-[13px] h-[13px]" /> },
        {
          path: '/leads',
          label: 'Inbound Leads',
          icon: <UserPlus className="w-[13px] h-[13px]" />,
          badge: (
            <span className="text-[8px] font-bold bg-amber-500/20 text-amber-800 rounded-full px-1.5 py-0.2">
              14 New
            </span>
          ),
        },
        { path: '/customers', label: 'Customer 360 CRM', icon: <Users className="w-[13px] h-[13px]" /> },
      ],
    },
    {
      group: 'BOOKING & DISPATCH',
      items: [
        { path: '/appointments', label: 'Multi-Branch Booking', icon: <Calendar className="w-[13px] h-[13px]" /> },
        {
          path: '/confirmations',
          label: 'Confirmations Queue',
          icon: <CheckCircle2 className="w-[13px] h-[13px]" />,
          badge: <span className="text-[8px] font-bold bg-[#8b70a7]/20 text-sage rounded-full px-1.5 py-0.2">8 Due</span>,
        },
      ],
    },
    {
      group: 'TELEPHONY & QUALITY',
      items: [
        { path: '/call-logs', label: 'Call Audio & Logs', icon: <Headphones className="w-[13px] h-[13px]" /> },
        {
          path: '/tickets',
          label: 'Grievance & Tickets',
          icon: <LifeBuoy className="w-[13px] h-[13px]" />,
          badge: selectedBranch.openGrievanceTickets > 0 ? (
            <span className="text-[8px] font-bold bg-rose-500/20 text-rose-800 rounded-full px-1.5 py-0.2">
              {selectedBranch.openGrievanceTickets} Open
            </span>
          ) : undefined,
        },
      ],
    },
    {
      group: 'OUTREACH & RETENTION',
      items: [
        { path: '/sales-packages', label: 'Packages & Memberships', icon: <PackageCheck className="w-[13px] h-[13px]" /> },
        {
          path: '/follow-ups',
          label: 'CSAT Follow-up',
          icon: <PhoneCall className="w-[13px] h-[13px]" />,
          badge: (
            <span className="text-[8px] font-bold bg-purple-500/20 text-purple-800 rounded-full px-1.5 py-0.2">
              12 Today
            </span>
          ),
        },
        { path: '/recovery', label: 'Lapsed Client Revival', icon: <UserMinus className="w-[13px] h-[13px]" /> },
      ],
    },
    {
      group: 'DESK WORKSPACE',
      items: [
        { path: '/tasks', label: 'Concierge Tasks', icon: <CheckSquare className="w-[13px] h-[13px]" /> },
        {
          path: '/notifications',
          label: 'Alerts',
          icon: <Bell className="w-[13px] h-[13px]" />,
          badge: (
            <span className="text-[8px] font-bold bg-rose-500/20 text-rose-800 rounded-full px-1.5 py-0.2">
              5
            </span>
          ),
        },
        { path: '/profile', label: 'My Profile', icon: <UserCheck className="w-[13px] h-[13px]" /> },
      ],
    },
  ];

  const userInitials = user?.fullName
    ? user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
    : 'RA';

  const displayName = user?.fullName || 'Rohan Arora';
  const displayRole = user?.roles?.some((r) => r.code === 'CALL_CENTER_AGENT')
    ? isAllBranches
      ? 'Head Concierge (National)'
      : `${selectedBranch.shortName} Concierge`
    : user?.roles?.[0]?.name || (isAllBranches ? 'Head Concierge' : `${selectedBranch.shortName} Desk`);

  return (
    <aside
      className={cn(
        'flex flex-col shrink-0 bg-pine text-soft transition-all duration-300 relative select-none overflow-visible',
        effectiveCollapsed
          ? 'w-[72px] p-[12px_0_8px] md:h-screen md:sticky md:top-0'
          : 'w-full md:w-[230px] p-[16px_0_8px] h-full md:h-screen md:sticky md:top-0',
      )}
    >
      {/* Toggle Button (Desktop Only) */}
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

      {/* Sidebar Header */}
      <div
        className={cn(
          'pb-[10px] border-b border-line/30 mb-2',
          effectiveCollapsed ? 'px-[12px]' : 'px-[14px]',
        )}
      >
        <div className="flex items-center gap-[8px]">
          <Avatar
            variant="square-monogram"
            initials="C"
            className="bg-[#5A2EA6] text-white shrink-0 shadow-sm w-7.5 h-7.5 font-bold"
          />
          {!effectiveCollapsed && (
            <div className="min-w-0 flex-1">
              <b className="font-serif text-[15px] text-ink font-bold tracking-[0.2px] block truncate">
                Desk
              </b>
              <small className="block font-sans uppercase tracking-[1.2px] text-[8px] text-muted mt-[-2px] truncate">
                Central Concierge
              </small>
            </div>
          )}
        </div>
      </div>

      {/* MULTI-BRANCH CONTEXT SELECTOR WIDGET */}
      <div className={cn('mb-3 relative', effectiveCollapsed ? 'px-1.5' : 'px-2')} ref={dropdownRef}>
        <button
          onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
          className={cn(
            'w-full flex items-center gap-2 rounded-xl p-2 text-left border transition-all cursor-pointer shadow-xs',
            isAllBranches
              ? 'bg-gradient-to-r from-purple-900/10 to-indigo-900/10 border-purple-300 text-purple-950 hover:bg-purple-100/60'
              : 'bg-white/80 border-line text-ink hover:bg-white',
            effectiveCollapsed && 'justify-center p-1.5',
          )}
          title={`Active Dispatch Scope: ${selectedBranch.name}`}
        >
          <div
            className={cn(
              'w-6 h-6 rounded-lg grid place-items-center shrink-0 text-white font-bold text-[10px]',
              isAllBranches ? 'bg-[#5A2EA6]' : 'bg-emerald-600',
            )}
          >
            {isAllBranches ? <Globe className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
          </div>

          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <strong className="block text-[11px] font-bold text-ink truncate leading-tight">
                    {selectedBranch.shortName}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() => logout().then(() => { window.location.href = '/call-center/login'; })}
                  title="Sign Out"
                  className="w-6.5 h-6.5 rounded-lg hover:bg-white/40 text-soft hover:text-rose-600 flex items-center justify-center transition cursor-pointer border-0 bg-transparent shrink-0 ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] text-soft/80 block truncate font-medium">
                  {selectedBranch.city}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted transition-transform duration-200 shrink-0',
                  isBranchDropdownOpen && 'rotate-180 text-purple-700',
                )}
              />
            </>
          )}
        </button>

        {/* Dropdown Popover */}
        {isBranchDropdownOpen && (
          <div
            className={cn(
              'absolute top-full mt-1.5 bg-white border border-line rounded-2xl shadow-xl z-50 p-2 space-y-1.5 text-xs text-ink',
              effectiveCollapsed ? 'left-full ml-2 w-64' : 'left-0 right-0 w-[240px]',
            )}
          >
            <div className="px-2 py-1 border-b border-line/60 flex items-center justify-between text-[10px] text-soft font-semibold uppercase tracking-wider">
              <span>Switch Dispatch Scope</span>
              <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-md">
                5 Branches
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5">
              {branches.map((b) => {
                const isSelected = b.id === selectedBranchId;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBranchId(b.id);
                      setIsBranchDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-left transition-all cursor-pointer border-0',
                      isSelected
                        ? 'bg-purple-50 text-purple-950 font-bold'
                        : 'hover:bg-pine/5 text-soft hover:text-ink',
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md grid place-items-center shrink-0 text-[10px] font-bold',
                        b.id === 'all'
                          ? 'bg-purple-100 text-purple-800'
                          : isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-pine/10 text-soft',
                      )}
                    >
                      {b.id === 'all' ? <Globe className="w-3 h-3" /> : b.code.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] truncate leading-snug">{b.name}</div>
                      <div className="text-[9px] text-soft/75 truncate flex items-center gap-1">
                        <span>{b.inquiriesToday} inq</span> •{' '}
                        <span className="text-emerald-700 font-semibold">{b.leadConversionRate} conv</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections with Seamless Cutout Tabs */}
      <div className="flex-1 flex flex-col gap-2 pr-0 pl-1.5 overflow-y-auto no-scrollbar">
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
                  item.path === '/'
                    ? location.pathname === '/' || location.pathname === ''
                    : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

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

      {/* Sticky Bottom User Profile */}
      <div className={cn('mt-auto pt-1.5 border-t border-line/30', effectiveCollapsed ? 'px-1' : 'px-2')}>
        <div
          onClick={() => navigate('/profile')}
          className="flex gap-[6px] items-center p-[2px_6px] justify-center lg:justify-start hover:bg-white/30 rounded-xl cursor-pointer transition-colors"
          title="View My Profile"
        >
          <Avatar
            variant="circle-profile"
            initials={userInitials}
            className="bg-[#5A2EA6] text-white shrink-0 shadow-sm w-6.5 h-6.5 font-bold text-[10px]"
          />
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <strong className="block text-ink text-[10.5px] font-bold truncate">
                  {displayName}
                </strong>
                <span className="text-[9px] text-soft/75 block truncate font-medium">
                  {displayRole}
                </span>
              </div>
              <div
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  agentStatus === 'Available'
                    ? 'bg-emerald-500'
                    : agentStatus === 'On Call'
                      ? 'bg-amber-500'
                      : 'bg-slate-400',
                )}
                title={`Status: ${agentStatus}`}
              />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
