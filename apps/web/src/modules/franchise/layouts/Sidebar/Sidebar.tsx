import {
  Avatar,
  BoxIcon,
  CalendarIcon,
  ChevronDownIcon,
  CreditCardIcon,
  OverviewIcon,
  PinIcon,
  SettingsIcon,
  TeamIcon,
  UsersIcon,
  cn,
} from '@salon-spa-saas/ui';
import {
  Bell,
  Building,
  Building2,
  ClipboardCheck,
  CreditCard,
  Crown,
  FileText,
  Headphones,
  Megaphone,
  Scissors,
  User,
  UserCheck,
  LogOut } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../../../shared/context/AuthContext';
import { tenantsApi } from '@/shared/api/tenants.api';

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

export function FranchiseSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [tenantName, setTenantName] = useState<string | null>(null);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('franchise-sidebar-collapsed') === 'true';
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

  useEffect(() => {
    if (user?.tenantId) {
      tenantsApi
        .getById(user.tenantId)
        .then((res) => {
          if (res && res.name) setTenantName(res.name);
        })
        .catch((err) => console.error('Failed to fetch tenant name:', err));
    }
  }, [user?.tenantId]);

  const [outletInfo, setOutletInfo] = useState<{ active: number; limit: number; region: string }>(() => ({
    active: Number(localStorage.getItem('digiflex_franchise_active_outlets') || 0),
    limit: Number(localStorage.getItem('digiflex_franchise_max_outlets') || 1),
    region: localStorage.getItem('digiflex_franchise_region') || 'Indore & Malwa Region',
  }));

  useEffect(() => {
    const fId = localStorage.getItem('digiflex_franchise_id');
    const reg = localStorage.getItem('digiflex_franchise_region') || 'Indore & Malwa Region';
    const max = Number(localStorage.getItem('digiflex_franchise_max_outlets') || 1);
    if (fId) {
      tenantsApi
        .getFranchiseBranches(fId)
        .then((br) => {
          if (Array.isArray(br)) {
            localStorage.setItem('digiflex_franchise_active_outlets', String(br.length));
            setOutletInfo({ active: br.length, limit: max, region: reg });
          }
        })
        .catch(() => {});
    } else {
      setOutletInfo({
        active: Number(localStorage.getItem('digiflex_franchise_active_outlets') || 0),
        limit: max,
        region: reg,
      });
    }
  }, [location.pathname]);

  const effectiveCollapsed = isMobile ? false : isCollapsed;

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('franchise-sidebar-collapsed', String(next));
      return next;
    });
  };

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', icon: <OverviewIcon className="w-[13px] h-[13px]" />, path: '/' },
        {
          label: 'My Franchise',
          icon: <Building className="w-[13px] h-[13px]" />,
          path: '/my-franchise',
        },
        {
          label: 'My Locations',
          icon: <Building2 className="w-[13px] h-[13px]" />,
          path: '/locations',
        },
      ],
    },
    {
      title: 'OPERATIONS & STAFF',
      items: [
        {
          label: 'Catalogue',
          icon: <Scissors className="w-[13px] h-[13px]" />,
          path: '/catalogue',
        },
        {
          label: 'Staff Overview',
          icon: <TeamIcon className="w-[13px] h-[13px]" />,
          path: '/staff',
        },
        {
          label: 'Customers',
          icon: <UsersIcon className="w-[13px] h-[13px]" />,
          path: '/customers',
        },
        {
          label: 'Appointments',
          icon: <CalendarIcon className="w-[13px] h-[13px]" />,
          path: '/appointments',
        },
      ],
    },
    {
      title: 'FINANCIALS & STOCK',
      items: [
        { label: 'Finance', icon: <CreditCard className="w-[13px] h-[13px]" />, path: '/finance' },
        {
          label: 'Inventory Summary',
          icon: <BoxIcon className="w-[13px] h-[13px]" />,
          path: '/inventory',
        },
        {
          label: 'Compliance',
          icon: <ClipboardCheck className="w-[13px] h-[13px]" />,
          path: '/compliance',
        },
        {
          label: 'Franchise Fees',
          icon: <CreditCardIcon className="w-[13px] h-[13px]" />,
          path: '/fees',
          badge: (
            <span className="text-[8px] font-bold bg-amber-100 text-amber-900 rounded-full px-1.5 py-0.2">
              Due
            </span>
          ),
        },
      ],
    },
    {
      title: 'HQ & RESOURCES',
      items: [
        {
          label: 'Documents',
          icon: <FileText className="w-[13px] h-[13px]" />,
          path: '/documents',
        },
        {
          label: 'Announcements',
          icon: <Megaphone className="w-[13px] h-[13px]" />,
          path: '/announcements',
        },
        { label: 'Support', icon: <Headphones className="w-[13px] h-[13px]" />, path: '/support' },
        {
          label: 'Notifications',
          icon: <Bell className="w-[13px] h-[13px]" />,
          path: '/notifications',
          badge: (
            <span className="text-[8px] font-bold bg-[#8b70a7]/20 text-sage rounded-full px-1.5 py-0.2">
              3
            </span>
          ),
        },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'My Profile', icon: <User className="w-[13px] h-[13px]" />, path: '/profile' },
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
        className="hidden md:flex absolute top-[16px] -right-2.5 w-5 h-5 bg-white text-ink border border-line rounded-full items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-all z-50"
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
      {(() => {
        const brandTitle =
          tenantName ||
          user?.salonName ||
          localStorage.getItem('digiflex_franchise_brand_name') ||
          localStorage.getItem('digiflex_franchise_parent_salon') ||
          'Glamour Salon & Spa';
        const brandInitial = brandTitle.charAt(0).toUpperCase();

        return (
          <div
            className={cn(
              'pb-[10px] border-b border-line/30 mb-2',
              effectiveCollapsed ? 'px-[12px]' : 'px-[14px]',
            )}
          >
            <div className="flex items-center gap-[8px]">
              <Avatar
                variant="square-monogram"
                initials={brandInitial || 'G'}
                className="bg-[#8b70a7] text-white shrink-0 shadow-sm w-7.5 h-7.5"
              />
              {!effectiveCollapsed && (
                <div className="min-w-0">
                  <b className="font-sans font-bold text-[13.5px] text-ink tracking-[0.1px] block truncate">
                    {brandTitle}
                  </b>
                  <small className="block uppercase tracking-[1px] text-[7.5px] text-muted mt-[0.2px] truncate">
                    Franchise Network
                  </small>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Franchise Selector Box */}
      <div className={cn('mb-2.5', effectiveCollapsed ? 'px-1' : 'px-2')}>
        <div className="flex gap-[6px] items-center border border-line/40 p-[5px_8px] bg-white/40 rounded-xl justify-center lg:justify-start">
          <div className="w-[20px] h-[20px] rounded-[5px] bg-[#cca080]/10 grid place-items-center text-[#cca080] shrink-0">
            <PinIcon className="w-[11px] h-[11px]" />
          </div>
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <strong className="block text-ink text-[10.5px] font-semibold truncate">
                  {outletInfo.region}
                </strong>
                <span className="text-[9px] text-soft/75 block truncate">
                  {outletInfo.active} / {outletInfo.limit} Outlets Active
                </span>
              </div>

              <button
                type="button"
                onClick={() => logout().then(() => { window.location.href = '/franchise/login'; })}
                title="Sign Out"
                className="w-6.5 h-6.5 rounded-lg hover:bg-white/40 text-soft hover:text-rose-600 flex items-center justify-center transition cursor-pointer border-0 bg-transparent shrink-0 ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
              <div className="text-soft shrink-0">
                <ChevronDownIcon className="w-2.5 h-2.5" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 flex flex-col gap-2.5 pr-0 pl-1.5 overflow-y-auto no-scrollbar">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {!effectiveCollapsed && (
              <label className="block px-[10px] pb-0.5 text-[8px] font-bold uppercase tracking-[0.8px] text-sage">
                {group.title}
              </label>
            )}
            <nav className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/' || location.pathname === ''
                    : location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`);

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

      {/* Sidebar Footer Profile */}
      {(() => {
        const dynamicPartner =
          user?.fullName ||
          localStorage.getItem('digiflex_franchise_partner_name') || 'Ashish Khopde Outlets LLP';
        const dynamicContact =
          localStorage.getItem('digiflex_franchise_contact_person') ||
          localStorage.getItem('digiflex_franchise_owner_name') ||
          'Ashish Khopde';
        const dynamicInitials = (user?.fullName || dynamicContact || dynamicPartner)
          .split(' ')
          .filter(Boolean)
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        return (
          <div
            className={cn(
              'pt-2 border-t border-line/30 mt-auto',
              effectiveCollapsed ? 'px-2 text-center' : 'px-3',
            )}
          >
            <div className="flex items-center gap-[8px]">
              <Avatar
                variant="square-monogram"
                initials={dynamicInitials || 'AK'}
                className="bg-[#5A2EA6] text-white shrink-0 shadow-sm w-7 h-7"
              />
              {!effectiveCollapsed && (
                <div className="min-w-0 text-left">
                  <strong className="block text-ink text-[11px] font-bold truncate">
                    {dynamicPartner}
                  </strong>
                  <span className="text-[9px] text-soft block truncate">
                    Franchise Partner
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </aside>
  );
}
