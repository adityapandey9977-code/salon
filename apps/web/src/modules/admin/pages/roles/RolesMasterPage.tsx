import { cn } from '@salon-spa-saas/ui';
import { ChevronRight, History, ShieldCheck, Sliders, Sparkles, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { PermissionHistoryTab } from './PermissionHistoryTab';
import { PermissionMatrixTab } from './PermissionMatrixTab';
import { RoleAssignmentsTab } from './RoleAssignmentsTab';
import { RolesListTab } from './RolesListTab';
import { rolesApi } from '@/shared/api/roles.api';
import { usersApi } from '@/shared/api/users.api';

import { filterSalonRoles, isPlatformRole } from '@/shared/utils/roleUtils';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

export type RolesTabType = 'roles' | 'matrix' | 'assignments' | 'history';

interface TabItem {
  id: RolesTabType;
  label: string;
  count?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function RolesMasterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as RolesTabType) || 'roles';
  const [activeMatrixRoleId, setActiveMatrixRoleId] = useState<string>('');
  const [activeAssignmentRoleId, setActiveAssignmentRoleId] = useState('all');
  const [rolesCount, setRolesCount] = useState<number>(0);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);

  useEffect(() => {
    setIsLoadingMetrics(true);
    Promise.all([rolesApi.list({ scope: 'TENANT', showOnFrontend: true, panel: 'ADMIN' }), usersApi.list({ userType: 'TENANT', limit: 100 })])
      .then(([roles, usersResult]) => {
        if (Array.isArray(roles)) {
          const salonRoles = filterSalonRoles(roles);
          setRolesCount(salonRoles.length);
          if (salonRoles.length > 0 && !activeMatrixRoleId) {
            setActiveMatrixRoleId(salonRoles[0].id);
          }
        }
        if (usersResult?.users && Array.isArray(usersResult.users)) {
          const salonUsers = usersResult.users.filter(
            (u: any) => u.userType !== 'PLATFORM' && !isPlatformRole(u.role)
          );
          setStaffCount(usersResult.pagination?.total || salonUsers.length);
        }
      })
      .catch((err) => {
        console.warn('[RolesMasterPage] Warning loading metrics:', err);
      })
      .finally(() => {
        setIsLoadingMetrics(false);
      });
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'roles',
      label: 'Roles Directory',
      count: isLoadingMetrics ? undefined : `${rolesCount} Roles`,
      icon: ShieldCheck,
      description: 'System persona roles and custom role definitions with organizational scopes',
    },
    {
      id: 'matrix',
      label: 'Permission Matrix',
      icon: Sliders,
      description: 'Granular Role × Multi-Module × 6 Permission Types interactive access grid',
    },
    {
      id: 'assignments',
      label: 'Role Assignments',
      count: isLoadingMetrics ? undefined : `${staffCount} Staff`,
      icon: Users,
      description: 'Active staff credentials mapped to system roles and branch scopes',
    },
    {
      id: 'history',
      label: 'Permission History',
      icon: History,
      description: 'Immutable configuration audit trail and maker-checker approval workflows',
    },
  ];

  const handleTabChange = (tabId: RolesTabType) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabId);
    setSearchParams(nextParams);
  };

  const handleNavigateToMatrix = (roleId: string) => {
    setActiveMatrixRoleId(roleId);
    handleTabChange('matrix');
  };

  const handleNavigateToAssignments = (roleId: string) => {
    setActiveAssignmentRoleId(roleId);
    handleTabChange('assignments');
  };

  const currentTabObj = tabs.find((t) => t.id === activeTabParam) || tabs[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Brand Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2D1552] via-[#45207A] to-[#5A2EA6] p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 h-48 w-48 rounded-full bg-[#E5D4FF]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-0.5 text-xs font-semibold text-[#E5D4FF] border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                Brand Owner / Head Office
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-[#E5D4FF] border border-purple-400/30">
                RBAC Access Control
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Roles &amp; Permission Governance
            </h1>
            <p className="text-sm text-purple-100/80 max-w-2xl">
              Centralized Role-Based Access Control (RBAC) governing 9 system personas, custom salon
              roles, 14 module privileges, staff credentials, and maker-checker approval trails.
            </p>
          </div>

          {/* Quick Metrics Pill Box */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
            <div className="text-right px-2">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">
                Configured Roles
              </span>
              <strong className="text-lg font-serif font-bold text-white">{rolesCount} Roles</strong>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-right px-2">
              <span className="text-[10px] text-purple-200 block uppercase font-bold tracking-wider">
                Active Staff
              </span>
              <strong className="text-lg font-serif font-bold text-emerald-300">{staffCount} Users</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar with Scroller */}
      <TabScroller>
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTabParam === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0',
                isActive
                  ? 'bg-[#5A2EA6] text-white shadow-sm ring-1 ring-[#5A2EA6]'
                  : 'text-slate-700 hover:bg-[#5A2EA6]/5 hover:text-[#5A2EA6]',
              )}
            >
              <IconComp className={cn('w-4 h-4', isActive ? 'text-white' : 'text-[#5A2EA6]')} />
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-extrabold',
                    isActive ? 'bg-white/20 text-white' : 'bg-[#5A2EA6]/10 text-[#5A2EA6]',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </TabScroller>

      {/* Tab Header Description */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs text-soft font-semibold">
          <span>Roles &amp; Permissions</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <strong className="text-ink font-bold">{currentTabObj.label}</strong>
          <span className="text-muted hidden sm:inline">· {currentTabObj.description}</span>
        </div>
      </div>

      {/* Tab Content Rendering */}
      <div className="animate-in fade-in duration-150">
        {activeTabParam === 'roles' && (
          <RolesListTab
            onNavigateToMatrix={handleNavigateToMatrix}
            onNavigateToAssignments={handleNavigateToAssignments}
            onUpdateRolesCount={setRolesCount}
          />
        )}
        {activeTabParam === 'matrix' && <PermissionMatrixTab initialRoleId={activeMatrixRoleId} />}
        {activeTabParam === 'assignments' && (
          <RoleAssignmentsTab
            initialRoleId={activeAssignmentRoleId}
            onNavigateToMatrix={handleNavigateToMatrix}
          />
        )}
        {activeTabParam === 'history' && <PermissionHistoryTab />}
      </div>
    </div>
  );
}
