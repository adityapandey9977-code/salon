import type React from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '../../../shared/api/client';
import { rolesApi } from '../../../shared/api/roles.api';
import { tenantsApi } from '../../../shared/api/tenants.api';
import { usersApi } from '../../../shared/api/users.api';
import { auditApi, type BackendAuditEvent, type CreateAuditPayload } from '../../../shared/api/audit.api';
import { useAuth } from '../../../shared/context/AuthContext';
import { filterPlatformRoles } from '../../../shared/utils/roleUtils';
import type { AuditLogItem } from '../components/InspectAuditTraceModal';

export function mapBackendEventToAuditItem(evt: BackendAuditEvent): AuditLogItem {
  const meta = (evt.metadataJson && typeof evt.metadataJson === 'object' ? evt.metadataJson : {}) as Record<string, any>;
  
  let category: 'Tenant' | 'Billing' | 'Security' | 'User' = 'Tenant';
  if (meta.category && ['Tenant', 'Billing', 'Security', 'User'].includes(meta.category)) {
    category = meta.category as any;
  } else {
    const act = (evt.action || '').toUpperCase();
    const ent = (evt.entityType || '').toUpperCase();
    if (
      act.includes('PLAN') ||
      act.includes('SUBSCRIPTION') ||
      act.includes('INVOICE') ||
      act.includes('BILLING') ||
      act.includes('PAYMENT') ||
      ent.includes('PLAN') ||
      ent.includes('BILLING')
    ) {
      category = 'Billing';
    } else if (
      act.includes('KEY') ||
      act.includes('AUTH') ||
      act.includes('SECURITY') ||
      act.includes('MFA') ||
      act.includes('LOGIN')
    ) {
      category = 'Security';
    } else if (
      act.includes('USER') ||
      act.includes('ROLE') ||
      act.includes('PERMISSION') ||
      act.includes('STAFF') ||
      act.includes('OPERATOR') ||
      ent.includes('USER') ||
      ent.includes('ROLE')
    ) {
      category = 'User';
    }
  }

  const user = meta.actorName || evt.principalType || 'system_root';
  let resource = meta.targetName || evt.entityId || 'Platform System';
  if (evt.afterJson && typeof evt.afterJson === 'object') {
    const after = evt.afterJson as Record<string, any>;
    if (after.salonName) resource = after.salonName;
    else if (after.name) resource = after.name;
    else if (after.fullName) resource = after.fullName;
    else if (after.email) resource = after.email;
    else if (after.title) resource = after.title;
    else if (after.firstName) resource = `${after.firstName} ${after.lastName || ''}`.trim();
  }

  const d = new Date(evt.occurredAt);
  const formattedTimestamp = isNaN(d.getTime())
    ? evt.occurredAt
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

  return {
    id: evt.id ? `TRC-${evt.id.substring(0, 8).toUpperCase()}` : `TRC-${Date.now().toString().substring(7)}`,
    timestamp: formattedTimestamp,
    action: evt.action,
    user,
    resource,
    category,
    ipAddress: evt.ipAddress || '192.168.1.104',
    approver: meta.approver || 'system_root_verified',
    beforeState: evt.beforeJson && typeof evt.beforeJson === 'object' ? (evt.beforeJson as Record<string, any>) : undefined,
    afterState: evt.afterJson && typeof evt.afterJson === 'object' ? (evt.afterJson as Record<string, any>) : undefined,
  };
}


export interface Tenant {
  id: string;
  name: string;
  slug: string;
  city: string;
  region: string;
  activePlans: string;
  revenue: string;
  status: 'Active' | 'Suspended' | 'Pending Setup';
  contactEmail: string;
  contactPhone: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  branchesCount: number;
  branchesList?: string[];
  customDomain?: string;
  primaryColor?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive';
  mfaEnabled: boolean;
  createdAt: string;
}

export interface ModuleCrudPermission {
  view: boolean;
  edit: boolean;
  update: boolean;
  delete: boolean;
}

export interface SystemModuleDefinition {
  id: string;
  name: string;
  category: 'Dashboard' | 'Tenant Management' | 'User Management' | 'Operations' | 'System';
  description: string;
}

export const SYSTEM_MODULES: SystemModuleDefinition[] = [
  // Dashboard
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'Dashboard',
    description:
      'System overview, tenant health KPIs, global revenue metrics, and quick statistics',
  },

  // Tenant Management
  {
    id: 'tenants',
    name: 'Salons / Tenants',
    category: 'Tenant Management',
    description: 'Tenant provisioning, salon profiles, domain bindings, and branch allocations',
  },
  {
    id: 'subscriptionPlans',
    name: 'Subscription Plans',
    category: 'Tenant Management',
    description: 'Tier quotas, pricing rules, franchise entitlements, and rollout policies',
  },
  {
    id: 'billingPayments',
    name: 'Billing & Payments',
    category: 'Tenant Management',
    description: 'Tenant billing ledger, invoice generation, payment gateways, and collections',
  },

  // User Management
  {
    id: 'users',
    name: 'Users',
    category: 'User Management',
    description: 'Super admin operators, tenant admin accounts, credentials, and MFA security',
  },
  {
    id: 'rolesPermissions',
    name: 'Roles & Permissions',
    category: 'User Management',
    description: 'RBAC role groups, security scopes, and granular module privilege matrices',
  },

  // Operations
  {
    id: 'supportTickets',
    name: 'Support Tickets',
    category: 'Operations',
    description: 'Customer helpdesk tickets, escalations, SLAs, and resolution messaging',
  },
  {
    id: 'announcements',
    name: 'Announcements',
    category: 'Operations',
    description: 'Platform broadcast banners, scheduled maintenance alerts, and changelog posts',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    category: 'Operations',
    description: 'Operational alert dispatching, email triggers, and system push notifications',
  },
  {
    id: 'auditLogs',
    name: 'Audit Logs',
    category: 'Operations',
    description:
      'System event trails, compliance audit history, and security authentication traces',
  },

  // System
  {
    id: 'integrations',
    name: 'Integrations',
    category: 'System',
    description: 'Third-party API connectors, accounting sync, payment gateways, and webhooks',
  },
  {
    id: 'apiKeys',
    name: 'API Keys',
    category: 'System',
    description: 'Developer access keys, token rotation, rate limit quotas, and secret keys',
  },
  {
    id: 'featureFlags',
    name: 'Feature Flags',
    category: 'System',
    description: 'Dynamic feature flags, canary rollouts, tenant overrides, and beta controls',
  },
  {
    id: 'settings',
    name: 'Settings',
    category: 'System',
    description: 'Global system defaults, localized branding, SMTP settings, and backup regimes',
  },
];

export const getDefaultModulePermissions = (
  preset: 'all' | 'none' | 'viewOnly' = 'none',
): Record<string, ModuleCrudPermission> => {
  const result: Record<string, ModuleCrudPermission> = {};
  SYSTEM_MODULES.forEach((mod) => {
    result[mod.id] = {
      view: preset === 'all' || preset === 'viewOnly',
      edit: preset === 'all',
      update: preset === 'all',
      delete: preset === 'all',
    };
  });
  return result;
};

export function modulePermissionsToCodes(
  modPerms: Record<string, ModuleCrudPermission>,
): string[] {
  const codes: string[] = [];
  let hasAnyView = false;
  Object.entries(modPerms).forEach(([moduleId, perm]) => {
    const m = moduleId.toLowerCase();
    if (perm.view) {
      codes.push(`platform.${m}.view`);
      hasAnyView = true;
    }
    if (perm.edit) codes.push(`platform.${m}.edit`);
    if (perm.update) codes.push(`platform.${m}.update`);
    if (perm.delete) codes.push(`platform.${m}.delete`);
  });
  if (hasAnyView) {
    codes.push('platform.read');
  }
  return codes;
}

export function codesToModulePermissions(
  codes: string[],
): Record<string, ModuleCrudPermission> {
  const result = getDefaultModulePermissions('none');
  const codeSet = new Set(codes.map((c) => c.toLowerCase()));

  SYSTEM_MODULES.forEach((mod) => {
    const m = mod.id.toLowerCase();
    const aliases = [m];
    if (m === 'tenants') aliases.push('tenant');
    if (m === 'subscriptionplans') aliases.push('plan', 'subscription');
    if (m === 'billingpayments') aliases.push('billing', 'payments');
    if (m === 'rolespermissions') aliases.push('roles', 'permissions', 'rbac');
    if (m === 'branchessalons') aliases.push('branches', 'branch');
    if (m === 'servicecatalog') aliases.push('services', 'catalog');
    if (m === 'inventoryproducts') aliases.push('inventory', 'products');
    if (m === 'financialledgers') aliases.push('financials', 'finance', 'ledger');
    if (m === 'analyticsreports') aliases.push('analytics', 'reports');
    if (m === 'supporttickets') aliases.push('support', 'tickets');
    if (m === 'featureflags') aliases.push('features', 'feature');
    if (m === 'systemsettings') aliases.push('settings', 'system');

    let hasView = false;
    let hasEdit = false;
    let hasUpdate = false;
    let hasDelete = false;

    for (const a of aliases) {
      if (
        codeSet.has(`platform.${a}.view`) ||
        codeSet.has(`platform.${a}.read`) ||
        codeSet.has(`platform.${a}`) ||
        codeSet.has(`${a}.read`) ||
        codeSet.has(`${a}.view`)
      ) {
        hasView = true;
      }
      if (
        codeSet.has(`platform.${a}.edit`) ||
        codeSet.has(`platform.${a}.create`) ||
        codeSet.has(`${a}.create`) ||
        codeSet.has(`${a}.edit`)
      ) {
        hasEdit = true;
      }
      if (
        codeSet.has(`platform.${a}.update`) ||
        codeSet.has(`platform.${a}.manage`) ||
        codeSet.has(`${a}.manage`) ||
        codeSet.has(`${a}.update`)
      ) {
        hasUpdate = true;
      }
      if (
        codeSet.has(`platform.${a}.delete`) ||
        codeSet.has(`${a}.delete`)
      ) {
        hasDelete = true;
      }
    }

    if (hasView || hasEdit || hasUpdate || hasDelete) {
      result[mod.id] = {
        view: hasView || hasEdit || hasUpdate || hasDelete,
        edit: hasEdit,
        update: hasUpdate,
        delete: hasDelete,
      };
    }
  });

  return result;
}

export function isSystemProtectedRole(
  role?: { role?: string; id?: string; name?: string; code?: string; isSystem?: boolean } | null,
): boolean {
  if (!role) return false;
  if (role.isSystem) return true;
  const roleName = (role.role || role.name || '').toLowerCase().trim();
  const code = (role.code || '').toUpperCase().trim();
  const id = (role.id || '').toLowerCase().trim();

  return (
    roleName === 'super administrator' ||
    roleName === 'super admin' ||
    code === 'SUPER_ADMIN' ||
    code === 'PLATFORM_SUPER_ADMIN' ||
    id === 'rol-1'
  );
}

export interface RoleScope {
  id: string;
  role: string;
  description: string;
  scope: string;
  usersCount: number;
  permissions: {
    tenants: boolean;
    billing: boolean;
    auditLogs: boolean;
    featureFlags: boolean;
    usersRbac: boolean;
  };
  modulePermissions?: Record<string, ModuleCrudPermission>;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  audience: string;
  priority: 'Info' | 'Warning' | 'Critical';
  channels: string[];
  status: 'Active' | 'Sent' | 'Draft' | 'Archived';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  activeSubscribers: string;
  subscriberCount: number;
  status: 'Active' | 'Archived';
  features: string;
  maxBranches: number;
  maxStaff: number;
  hasCustomApi: boolean;
  hasWhiteLabel: boolean;
  rolloutPercentage?: number;
  rolloutStrategy?: string;
  tierBadge?: string;
  tagline?: string;
  billingCycle?: string;
  branchesQuota?: string;
  staffQuota?: string;
  apiQuota?: string;
  domainQuota?: string;
  themeVariant?: 'light' | 'popular' | 'enterprise';
  entitlements?: string[];
  hasFranchise?: boolean;
  franchiseQuota?: string;
  maxFranchises?: number;
}

export interface Invoice {
  invoiceId: string;
  salon: string;
  amount: string;
  numericAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  billingPeriod: string;
}

interface SuperAdminContextType {
  tenants: Tenant[];
  users: AdminUser[];
  roles: RoleScope[];
  announcements: Announcement[];
  subscriptionPlans: SubscriptionPlan[];
  invoices: Invoice[];
  auditLogs: AuditLogItem[];
  isLoadingAuditLogs: boolean;
  fetchAuditLogs: () => Promise<void>;
  logAuditEvent: (entry: Partial<CreateAuditPayload> & {
    user?: string;
    resource?: string;
    beforeState?: any;
    afterState?: any;
  }) => Promise<void>;
  addTenant: (tenant: Partial<Tenant>) => void;
  updateTenant: (id: string, data: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  addAdminUser: (user: Partial<AdminUser> & { generatedPassword?: string }) => void;
  updateAdminUser: (id: string, data: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  addCustomRole: (role: Partial<RoleScope>) => void;
  updateCustomRole: (id: string, data: Partial<RoleScope>) => void;
  deleteCustomRole: (id: string) => void;
  addAnnouncement: (ann: Partial<Announcement>) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addSubscriptionPlan: (plan: Partial<SubscriptionPlan>) => void;
  updateSubscriptionPlan: (id: string, data: Partial<SubscriptionPlan>) => void;
  updatePlanRollout: (id: string, rolloutPercentage: number, strategy: string) => void;
  addInvoice: (invoice: Partial<Invoice>) => void;
  canAccess: (path: string) => boolean;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export const SuperAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 'ten-1',
      name: 'Blush & Bloom Salon Group',
      slug: 'blush-bloom-salons',
      status: 'Active',
      revenue: '₹24.5L /mo',
      city: 'Bhopal',
      region: 'Central India',
      activePlans: 'Enterprise Plan',
      contactEmail: 'contact@blushbloom.in',
      contactPhone: '+91 98765 43210',
      ownerName: 'Vikram Malhotra',
      ownerEmail: 'vikram@blushbloom.in',
      ownerPhone: '+91 98765 43210',
      branchesCount: 3,
      branchesList: ['Indrapuri Branch', 'Arera Colony Branch', 'MP Nagar Branch'],
      customDomain: 'app.blushbloom.in',
      primaryColor: '#7C3AED',
      createdAt: '2026-01-15',
    },
    {
      id: 'ten-2',
      name: 'Elegance Spa & Salon',
      slug: 'elegance-spa-bhopal',
      status: 'Active',
      revenue: '₹18.2L /mo',
      city: 'Bhopal',
      region: 'Central India',
      activePlans: 'Premium Plan',
      contactEmail: 'support@elegancespa.in',
      contactPhone: '+91 98765 12345',
      ownerName: 'Ananya Shah',
      ownerEmail: 'ananya@elegancespa.in',
      ownerPhone: '+91 98765 12345',
      branchesCount: 2,
      branchesList: ['Main Square Branch', 'Lake View Branch'],
      customDomain: 'booking.elegancespa.in',
      primaryColor: '#EC4899',
      createdAt: '2026-02-10',
    },
    {
      id: 'ten-3',
      name: 'Cut & Polish Salons',
      slug: 'cut-polish-salons',
      status: 'Active',
      revenue: '₹12.0L /mo',
      city: 'Bhopal',
      region: 'Central India',
      activePlans: 'Standard Plan',
      contactEmail: 'info@cutandpolish.com',
      contactPhone: '+91 98222 33445',
      ownerName: 'Rahul Sharma',
      ownerEmail: 'rahul@cutandpolish.com',
      ownerPhone: '+91 98222 33445',
      branchesCount: 1,
      branchesList: ['New Market Branch'],
      createdAt: '2026-03-01',
    },
    {
      id: 'ten-4',
      name: 'Royal Grooming Lounge',
      slug: 'royal-grooming-indore',
      status: 'Suspended',
      revenue: '₹0.00 /mo',
      city: 'Indore',
      region: 'Central India',
      activePlans: 'Standard Plan',
      contactEmail: 'manager@royalgrooming.in',
      contactPhone: '+91 98111 88990',
      ownerName: 'Sonia Patel',
      ownerEmail: 'sonia@royalgrooming.in',
      ownerPhone: '+91 98111 88990',
      branchesCount: 1,
      branchesList: ['Indore City Center'],
      createdAt: '2026-03-20',
    },
    {
      id: 'ten-5',
      name: 'Affinity Salon Suites',
      slug: 'affinity-salon-mumbai',
      status: 'Active',
      revenue: '₹32.4L /mo',
      city: 'Mumbai',
      region: 'West India',
      activePlans: 'Enterprise Plan',
      contactEmail: 'mumbai@affinitysalons.com',
      contactPhone: '+91 99000 11223',
      ownerName: 'Priya Verma',
      ownerEmail: 'priya@affinitysalons.com',
      ownerPhone: '+91 99000 11223',
      branchesCount: 4,
      branchesList: ['Bandra West', 'Juhu Beach', 'Powai Central', 'Andheri East'],
      customDomain: 'vip.affinitysalons.com',
      primaryColor: '#5A2EA6',
      createdAt: '2026-04-05',
    },
  ]);

  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 'usr-1',
      name: 'Ananya Shah',
      email: 'ananya@ateliergroup.co',
      phone: '+91 98765 00011',
      role: 'Super Administrator',
      status: 'Active',
      mfaEnabled: true,
      createdAt: '2026-01-10',
    },
    {
      id: 'usr-2',
      name: 'Rahul Sharma',
      email: 'rahul@luxurygrooming.com',
      phone: '+91 98765 00022',
      role: 'Support Operator',
      status: 'Active',
      mfaEnabled: true,
      createdAt: '2026-02-14',
    },
    {
      id: 'usr-3',
      name: 'Priya Patel',
      email: 'priya@blushbloom.in',
      phone: '+91 98765 00033',
      role: 'Billing Specialist',
      status: 'Active',
      mfaEnabled: false,
      createdAt: '2026-03-05',
    },
    {
      id: 'usr-4',
      name: 'Vikram Malhotra',
      email: 'vikram@blushbloom.in',
      phone: '+91 98765 00044',
      role: 'Support Operator',
      status: 'Inactive',
      mfaEnabled: false,
      createdAt: '2026-03-22',
    },
  ]);

  const [roles, setRoles] = useState<RoleScope[]>([
    {
      id: 'rol-1',
      role: 'Super Administrator',
      description:
        'Global operations admin. Complete system-wide write/read permissions across all modules',
      scope: 'Platform Wide',
      usersCount: 1,
      permissions: {
        tenants: true,
        billing: true,
        auditLogs: true,
        featureFlags: true,
        usersRbac: true,
      },
      modulePermissions: getDefaultModulePermissions('all'),
    },
    {
      id: 'rol-2',
      role: 'Support Operator',
      description:
        'Platform support operator. Manage tenant onboarding, support tickets & client assistance',
      scope: 'Platform Wide',
      usersCount: 2,
      permissions: {
        tenants: true,
        billing: false,
        auditLogs: true,
        featureFlags: false,
        usersRbac: false,
      },
      modulePermissions: {
        ...getDefaultModulePermissions('viewOnly'),
        supportTickets: { view: true, edit: true, update: true, delete: false },
        tenants: { view: true, edit: true, update: true, delete: false },
        users: { view: true, edit: true, update: false, delete: false },
      },
    },
    {
      id: 'rol-3',
      role: 'Billing Specialist',
      description:
        'Finance & billing specialist. Manage invoices, plan subscriptions and revenue audit',
      scope: 'Platform Wide',
      usersCount: 1,
      permissions: {
        tenants: false,
        billing: true,
        auditLogs: true,
        featureFlags: false,
        usersRbac: false,
      },
      modulePermissions: {
        ...getDefaultModulePermissions('none'),
        billingPayments: { view: true, edit: true, update: true, delete: true },
        subscriptionPlans: { view: true, edit: true, update: true, delete: false },
        auditLogs: { view: true, edit: false, update: false, delete: false },
      },
    },
    {
      id: 'rol-4',
      role: 'Security Auditor',
      description:
        'Compliance & audit operator. Inspect audit logs, security traces and API integrations',
      scope: 'Platform Wide',
      usersCount: 0,
      permissions: {
        tenants: false,
        billing: false,
        auditLogs: true,
        featureFlags: true,
        usersRbac: false,
      },
      modulePermissions: {
        ...getDefaultModulePermissions('viewOnly'),
        auditLogs: { view: true, edit: true, update: true, delete: false },
        apiKeys: { view: true, edit: true, update: true, delete: false },
        featureFlags: { view: true, edit: true, update: true, delete: false },
      },
    },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ann-1',
      title: 'System Scheduled Maintenance Q3',
      content:
        'Database index optimization and infrastructure maintenance scheduled for Sunday at 02:00 AM IST.',
      date: 'Jul 28, 2026',
      audience: 'All Tenants & Owners',
      priority: 'Warning',
      channels: ['In-App Banner', 'Email'],
      status: 'Active',
    },
    {
      id: 'ann-2',
      title: 'New Feature Release: Staff Roster Analytics',
      content:
        'Real-time staff utilization, commission calculations and automated shift roster exports are now live.',
      date: 'Jul 24, 2026',
      audience: 'Branch Managers',
      priority: 'Info',
      channels: ['In-App Banner'],
      status: 'Sent',
    },
    {
      id: 'ann-3',
      title: 'Billing System Update Advisory',
      content:
        'Updated GST invoice formatting and automatic PDF receipt downloads introduced to billing module.',
      date: 'Jul 15, 2026',
      audience: 'Tenant Owners & Admins',
      priority: 'Info',
      channels: ['Email', 'In-App Banner'],
      status: 'Archived',
    },
    {
      id: 'ann-4',
      title: 'Customer Loyalty Rewards Update',
      content: 'Enhanced tier rules and automated birthday/anniversary coupon triggers enabled.',
      date: 'Jul 05, 2026',
      audience: 'All Staff Accounts',
      priority: 'Info',
      channels: ['In-App Banner'],
      status: 'Archived',
    },
  ]);

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'plan-1',
      name: 'Starter Tier Plan',
      price: '₹2,500 /mo',
      numericPrice: 2500,
      billingCycle: 'per branch / month',
      tierBadge: 'Subscription Tier',
      tagline: 'Ideal for independent salons, single spas, and boutique studios',
      branchesQuota: '2 Branches',
      maxBranches: 2,
      staffQuota: '10 Staff Seats',
      maxStaff: 10,
      apiQuota: 'Basic Webhook APIs',
      hasCustomApi: false,
      domainQuota: 'Standard Salon Domain',
      hasWhiteLabel: false,
      themeVariant: 'light',
      hasFranchise: false,
      franchiseQuota: 'COCO Only (No Franchises)',
      maxFranchises: 0,
      activeSubscribers: '45 Tenants',
      subscriberCount: 45,
      status: 'Active',
      features: 'Conflict-free diary & GST POS invoicing, WhatsApp booking links, Basic stocktake',
      entitlements: [
        'Conflict-free diary & GST POS invoicing',
        'WhatsApp booking links & SMS reminders',
        'Basic stocktake & consumable inventory recipes',
        'Stylist daily target & tip performance tracker',
        'Standard 9am-9pm email operator support',
      ],
      rolloutPercentage: 100,
      rolloutStrategy: 'Immediate GA',
    },
    {
      id: 'plan-2',
      name: 'Premium Tier Plan',
      price: '₹6,500 /mo',
      numericPrice: 6500,
      billingCycle: 'per branch / month',
      tierBadge: '★ Most Popular',
      tagline: 'For growing salon chains, multi-branch brands, and wellness centers',
      branchesQuota: '10 Branches',
      maxBranches: 10,
      staffQuota: '50 Staff Seats',
      maxStaff: 50,
      apiQuota: 'Full REST API Access',
      hasCustomApi: true,
      domainQuota: 'Custom CNAME Domain',
      hasWhiteLabel: true,
      themeVariant: 'popular',
      hasFranchise: false,
      franchiseQuota: 'COCO Only (No Franchises)',
      maxFranchises: 0,
      activeSubscribers: '68 Tenants',
      subscriberCount: 68,
      status: 'Active',
      features:
        'Multi-branch central client history, Formula intelligence [P-02], Local-language WhatsApp',
      entitlements: [
        'Multi-branch central client history & shared wallet',
        'Formula intelligence [P-02] & allergy safety flags [P-01]',
        'Local-language WhatsApp booking assistant [P-06]',
        'Service recipe BOM inventory & stock variance alerts',
        'Custom commission rules & tiered staff incentives',
        'Priority 24/7 technical operator support',
      ],
      rolloutPercentage: 100,
      rolloutStrategy: 'Immediate GA',
    },
    {
      id: 'plan-3',
      name: 'Enterprise Tier Plan',
      price: '₹12,500 /mo',
      numericPrice: 12500,
      billingCycle: 'per branch / month',
      tierBadge: 'Subscription Tier',
      tagline: 'For nationwide salon chains, franchise networks, and enterprise brands',
      branchesQuota: 'Unlimited Branches',
      maxBranches: 999,
      staffQuota: 'Unlimited Staff Seats',
      maxStaff: 999,
      apiQuota: 'Custom ERP Sync',
      hasCustomApi: true,
      domainQuota: 'Full White-Label Branding',
      hasWhiteLabel: true,
      themeVariant: 'enterprise',
      hasFranchise: true,
      franchiseQuota: '10 Franchises Allowed',
      maxFranchises: 10,
      activeSubscribers: '15 Tenants',
      subscriberCount: 15,
      status: 'Active',
      features:
        'Franchise royalty settlement, Resource-aware smart slotting, Custom ERP sync, 99.99% SLA',
      entitlements: [
        'Franchise royalty settlement & compliance panel',
        'Resource-aware smart slot suggestions [P-03]',
        'Package liability & breakage forecasting [P-04]',
        'Custom ERP (Tally/Zoho) & dedicated API sync',
        'Dedicated SLA uptime guarantee (99.99%)',
        'Dedicated Account Manager & onboarding',
      ],
      rolloutPercentage: 85,
      rolloutStrategy: 'Staged Rollout (85%)',
    },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      invoiceId: 'INV-2026-0012',
      salon: 'Blush & Bloom Salon Group',
      amount: '₹12,500',
      numericAmount: 12500,
      status: 'Paid',
      date: 'Jul 24, 2026',
      billingPeriod: 'July 2026',
    },
    {
      invoiceId: 'INV-2026-0011',
      salon: 'Elegance Spa & Salon',
      amount: '₹8,400',
      numericAmount: 8400,
      status: 'Paid',
      date: 'Jul 20, 2026',
      billingPeriod: 'July 2026',
    },
    {
      invoiceId: 'INV-2026-0010',
      salon: 'Cut & Polish Salons',
      amount: '₹15,000',
      numericAmount: 15000,
      status: 'Pending',
      date: 'Jul 15, 2026',
      billingPeriod: 'July 2026',
    },
    {
      invoiceId: 'INV-2026-0009',
      salon: 'Royal Grooming Lounge',
      amount: '₹22,000',
      numericAmount: 22000,
      status: 'Paid',
      date: 'Jul 05, 2026',
      billingPeriod: 'June 2026',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState<boolean>(false);

  const fetchAuditLogs = useCallback(async () => {
    setIsLoadingAuditLogs(true);
    try {
      const res = await auditApi.list({ limit: 100 });
      if (res && Array.isArray(res.items)) {
        const mapped = res.items.map(mapBackendEventToAuditItem);
        setAuditLogs(mapped);
      }
    } catch (err) {
      console.warn('Failed to load audit logs from API:', err);
    } finally {
      setIsLoadingAuditLogs(false);
    }
  }, []);

  const logAuditEvent = useCallback(
    async (
      entry: Partial<CreateAuditPayload> & {
        user?: string;
        resource?: string;
        beforeState?: any;
        afterState?: any;
      },
    ) => {
      const operatorName =
        entry.actorName || entry.user || (user as any)?.fullName || user?.email || 'system_root';
      const resourceName = entry.resource || entry.entityId || 'Platform Resource';
      const actionName = entry.action || 'PLATFORM_OPERATION';
      const categoryName = (entry.category as any) || 'Tenant';

      const optimisticItem: AuditLogItem = {
        id: `TRC-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: actionName,
        user: operatorName,
        resource: resourceName,
        category: categoryName,
        ipAddress: entry.ipAddress || '192.168.1.104',
        approver: operatorName,
        beforeState: entry.beforeState || entry.beforeJson,
        afterState: entry.afterState || entry.afterJson,
      };

      setAuditLogs((prev) => [optimisticItem, ...prev]);

      try {
        const created = await auditApi.create({
          action: actionName,
          entityType: entry.entityType || categoryName || 'Platform',
          entityId: entry.entityId || `res-${Date.now()}`,
          actorName: operatorName,
          actorUserId: user?.id,
          category: categoryName,
          beforeJson: entry.beforeState || entry.beforeJson,
          afterJson: entry.afterState || entry.afterJson,
          metadataJson: {
            targetName: resourceName,
            actorName: operatorName,
            category: categoryName,
            approver: operatorName,
            ...(entry.metadataJson || {}),
          },
        });

        if (created && created.id) {
          setAuditLogs((prev) =>
            prev.map((item) =>
              item.id === optimisticItem.id ? mapBackendEventToAuditItem(created) : item,
            ),
          );
        }
      } catch (err) {
        console.warn('Failed to log audit event to backend:', err);
      }
    },
    [user],
  );

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const liveTenants = await tenantsApi.list();
        if (liveTenants && liveTenants.length > 0) {
          const mapped: Tenant[] = liveTenants.map((t) => ({
            id: t.id,
            name: t.salonName || t.name || 'Salon Tenant',
            slug: t.slug || 'salon',
            city: t.city || 'Bhopal',
            region: t.region || t.state || 'Central India',
            activePlans: t.activePlans || 'Starter Tier Plan',
            revenue: t.revenue || '₹0.00 /mo',
            status:
              t.status === 'Active' || t.status === 'ACTIVE'
                ? 'Active'
                : t.status === 'Suspended' || t.status === 'SUSPENDED'
                  ? 'Suspended'
                  : 'Pending Setup',
            contactEmail: t.businessEmail || t.contactEmail || t.ownerEmail || 'admin@salon.com',
            contactPhone: t.businessPhone || t.contactPhone || t.ownerPhone || '+91 99000 00000',
            ownerName: t.legalName || t.ownerName || 'Salon Owner',
            ownerEmail: t.businessEmail || t.ownerEmail || 'owner@salon.com',
            ownerPhone: t.businessPhone || t.ownerPhone || '+91 99000 00000',
            branchesCount: t.branchesCount ?? (t.branchesList ? t.branchesList.length : 0),
            branchesList: t.branchesList || [],
            customDomain: t.customDomain || undefined,
            primaryColor: t.primaryColor || '#7C3AED',
            createdAt:
              typeof t.createdAt === 'string'
                ? t.createdAt.split('T')[0]
                : new Date().toISOString().split('T')[0],
          }));
          setTenants(mapped);
        }
      } catch (err) {
        console.warn('Failed to load tenants from API:', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const result = await usersApi.list({ userType: 'PLATFORM', limit: 100 });
        if (result && result.users && result.users.length > 0) {
          const mappedUsers: AdminUser[] = result.users.map((u) => ({
            id: u.id,
            name: u.fullName || 'Platform User',
            email: u.email,
            phone: u.mobilePhone || '+91 98000 00000',
            role:
              u.role ||
              (u.roles && u.roles.length > 0
                ? u.roles[0].name || u.roles[0].code
                : u.userType === 'PLATFORM'
                  ? 'Super Administrator'
                  : 'Support Operator'),
            status: u.status === 'SUSPENDED' || u.status === 'LOCKED' ? 'Inactive' : 'Active',
            mfaEnabled: u.isMfaEnabled !== undefined ? u.isMfaEnabled : !!u.isMfaRequired,
            createdAt: u.createdAt ? u.createdAt.split('T')[0] : '2026-01-01',
          }));
          setUsers(mappedUsers);
        }
      } catch (err) {
        console.warn('Failed to load users from API:', err);
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await apiClient.get('/api/v1/super-admin/plans');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mappedPlans: SubscriptionPlan[] = res.data.data.map((p: any) => {
            let meta: any = {};
            if (p.description) {
              try {
                if (p.description.startsWith('{') && p.description.endsWith('}')) {
                  meta = JSON.parse(p.description);
                }
              } catch {
                meta = {};
              }
            }

            const themeVariant: 'light' | 'popular' | 'enterprise' =
              meta.themeVariant ||
              p.themeVariant ||
              (p.name?.toLowerCase().includes('enterprise')
                ? 'enterprise'
                : p.name?.toLowerCase().includes('premium') || p.code?.includes('PREMIUM')
                  ? 'popular'
                  : 'light');

            return {
              id: p.id,
              name: p.name,
              price: `₹${(p.priceMonthly || p.basePrice || p.price || 2500).toLocaleString('en-IN')} /mo`,
              numericPrice: p.priceMonthly || p.basePrice || p.price || 2500,
              activeSubscribers: `${p.subscribersCount || 0} Tenants`,
              subscriberCount: p.subscribersCount || 0,
              status: p.isActive !== false ? 'Active' : 'Archived',
              features: meta.summary || p.description || 'Enterprise feature bundle',
              maxBranches: p.maxBranches || 999,
              maxStaff: p.maxStaff || 999,
              hasCustomApi: meta.hasCustomApi ?? !!p.hasCustomApi,
              hasWhiteLabel: meta.hasWhiteLabel ?? !!p.hasWhiteLabel,
              rolloutPercentage: meta.rolloutPercentage ?? p.rolloutPercentage ?? 100,
              rolloutStrategy: meta.rolloutStrategy || p.rolloutStrategy || 'Immediate GA',
              tierBadge:
                meta.tierBadge ||
                p.tierBadge ||
                (themeVariant === 'popular' ? '★ Most Popular' : 'Subscription Tier'),
              tagline:
                meta.tagline ||
                p.tagline ||
                (p.description && !p.description.startsWith('{')
                  ? p.description.split('.')[0]
                  : themeVariant === 'enterprise'
                    ? 'For nationwide salon chains, franchise networks, and enterprise brands'
                    : themeVariant === 'popular'
                      ? 'For growing salon chains, multi-branch brands, and wellness centers'
                      : 'Ideal for independent salons, single spas, and boutique studios'),
              billingCycle: meta.billingCycle || p.billingCycle || 'per branch / month',
              branchesQuota:
                meta.branchesQuota ||
                p.branchesQuota ||
                (p.maxBranches >= 999 ? 'Unlimited Branches' : `${p.maxBranches || 3} Branches`),
              staffQuota:
                meta.staffQuota ||
                p.staffQuota ||
                (p.maxStaff >= 999 ? 'Unlimited Staff Seats' : `${p.maxStaff || 10} Staff Seats`),
              apiQuota:
                meta.apiQuota ||
                p.apiQuota ||
                (p.hasCustomApi ? 'Full REST API Access' : 'Basic Webhook APIs'),
              domainQuota:
                meta.domainQuota ||
                p.domainQuota ||
                (p.hasWhiteLabel ? 'Custom CNAME Domain' : 'Standard Salon Domain'),
              themeVariant,
              entitlements:
                meta.entitlements && meta.entitlements.length > 0
                  ? meta.entitlements
                  : p.entitlements && p.entitlements.length > 0
                    ? p.entitlements
                    : p.description && !p.description.startsWith('{')
                      ? p.description.split(',').map((s: string) => s.trim())
                      : [],
              hasFranchise:
                meta.hasFranchise ?? p.hasFranchise ?? (p.maxFranchises && p.maxFranchises > 0),
              franchiseQuota:
                meta.franchiseQuota ||
                p.franchiseQuota ||
                (p.maxFranchises && p.maxFranchises > 0
                  ? p.maxFranchises >= 999
                    ? 'Unlimited Franchises'
                    : `${p.maxFranchises} Franchises Allowed`
                  : 'COCO Only (No Franchises)'),
              maxFranchises: meta.maxFranchises ?? (p.maxFranchises || 0),
            };
          });
          setSubscriptionPlans(mappedPlans);
        }
      } catch (err) {
        console.warn('Failed to load subscription plans from API:', err);
      }
    };

    const fetchRoles = async () => {
      try {
        const liveRoles = await rolesApi.list({ scope: 'PLATFORM' });
        if (Array.isArray(liveRoles) && liveRoles.length > 0) {
          const platformRoles = filterPlatformRoles(liveRoles);

          setRoles((prev) => {
            const combined = [...prev];
            platformRoles.forEach((pr: any) => {
              let cleanDesc = (pr.description || '').trim();
              let parsedModPerms: Record<string, ModuleCrudPermission> | null = null;
              if (cleanDesc.includes('<!--META:')) {
                const match = cleanDesc.match(/<!--META:(.*?)-->/);
                if (match) {
                  try {
                    parsedModPerms = JSON.parse(match[1]);
                    cleanDesc = cleanDesc.replace(/<!--META:.*?-->/, '').trim();
                  } catch {}
                }
              }

              if (
                !parsedModPerms &&
                pr.permissions &&
                Array.isArray(pr.permissions) &&
                pr.permissions.length > 0
              ) {
                const codes = pr.permissions.map((p: any) => p.permission?.code || p.code || p);
                parsedModPerms = codesToModulePermissions(codes);
              }

              const exactCode = (pr.code || '').toUpperCase().trim();
              const exactName = (pr.name || '').toUpperCase().trim();
              const isSuper = isSystemProtectedRole({
                role: pr.name,
                code: pr.code,
                id: pr.id,
                isSystem: pr.isSystem,
              });

              if (isSuper) {
                parsedModPerms = getDefaultModulePermissions('all');
              }

              const existingIdx = combined.findIndex(
                (r) =>
                  r.id === pr.id ||
                  r.role.toLowerCase() === pr.name.toLowerCase() ||
                  (pr.code &&
                    r.role.toUpperCase().replace(/[^A-Z0-9]+/g, '_') ===
                      pr.code.replace(/^PLATFORM_/, '')),
              );

              if (existingIdx >= 0) {
                combined[existingIdx] = {
                  ...combined[existingIdx],
                  id: pr.id,
                  role: pr.name,
                  description: cleanDesc || combined[existingIdx].description,
                  usersCount: pr.users ? pr.users.length : combined[existingIdx].usersCount,
                  modulePermissions: isSuper
                    ? getDefaultModulePermissions('all')
                    : (parsedModPerms || combined[existingIdx].modulePermissions),
                  permissions: isSuper
                    ? {
                        tenants: true,
                        billing: true,
                        auditLogs: true,
                        featureFlags: true,
                        usersRbac: true,
                      }
                    : parsedModPerms
                      ? {
                          tenants: parsedModPerms.tenants?.view || false,
                          billing: parsedModPerms.billingPayments?.view || false,
                          auditLogs: parsedModPerms.auditLogs?.view || false,
                          featureFlags: parsedModPerms.featureFlags?.view || false,
                          usersRbac:
                            parsedModPerms.users?.view ||
                            parsedModPerms.rolesPermissions?.view ||
                            false,
                        }
                      : combined[existingIdx].permissions,
                };
              } else {
                let modPerms = isSuper
                  ? getDefaultModulePermissions('all')
                  : (parsedModPerms || getDefaultModulePermissions('none'));
                let perms = isSuper
                  ? {
                      tenants: true,
                      billing: true,
                      auditLogs: true,
                      featureFlags: true,
                      usersRbac: true,
                    }
                  : {
                      tenants: modPerms.tenants?.view || false,
                      billing: modPerms.billingPayments?.view || false,
                      auditLogs: modPerms.auditLogs?.view || false,
                      featureFlags: modPerms.featureFlags?.view || false,
                      usersRbac: modPerms.users?.view || modPerms.rolesPermissions?.view || false,
                    };

                if (isSuper) {
                  modPerms = getDefaultModulePermissions('all');
                  perms = {
                    tenants: true,
                    billing: true,
                    auditLogs: true,
                    featureFlags: true,
                    usersRbac: true,
                  };
                } else if (
                  exactCode === 'SUPPORT_OPERATOR' ||
                  exactName === 'SUPPORT OPERATOR'
                ) {
                  if (!parsedModPerms) {
                    modPerms = {
                      ...getDefaultModulePermissions('none'),
                      supportTickets: { view: true, edit: true, update: true, delete: false },
                      tenants: { view: true, edit: true, update: true, delete: false },
                      announcements: { view: true, edit: false, update: false, delete: false },
                      notifications: { view: true, edit: false, update: false, delete: false },
                    };
                  }
                } else if (
                  exactCode === 'BILLING_SPECIALIST' ||
                  exactName === 'BILLING SPECIALIST'
                ) {
                  if (!parsedModPerms) {
                    modPerms = {
                      ...getDefaultModulePermissions('none'),
                      billingPayments: { view: true, edit: true, update: true, delete: true },
                      subscriptionPlans: { view: true, edit: true, update: true, delete: false },
                    };
                  }
                } else if (
                  exactCode === 'SECURITY_AUDITOR' ||
                  exactName === 'SECURITY AUDITOR'
                ) {
                  if (!parsedModPerms) {
                    modPerms = {
                      ...getDefaultModulePermissions('none'),
                      auditLogs: { view: true, edit: false, update: false, delete: false },
                      featureFlags: { view: true, edit: false, update: false, delete: false },
                    };
                  }
                }

                combined.push({
                  id: pr.id,
                  role: pr.name,
                  description: cleanDesc || `${pr.name} platform access scope`,
                  scope: 'Platform Wide',
                  usersCount: pr.users ? pr.users.length : 0,
                  permissions: perms,
                  modulePermissions: modPerms,
                });
              }
            });
            return combined;
          });
        }
      } catch (err) {
        console.warn('Failed to load platform roles from API:', err);
      }
    };

    fetchTenants();
    fetchUsers();
    fetchRoles();
    fetchPlans();
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const addTenant = async (data: Partial<Tenant>) => {
    const tempId = `ten-${Date.now()}`;
    const optimisticTenant: Tenant = {
      id: tempId,
      name: data.name || 'New Salon Tenant',
      slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || 'new-tenant',
      city: data.city || 'Bhopal',
      region: data.region || 'Central India',
      activePlans: data.activePlans || 'Starter Tier Plan',
      revenue: data.revenue || '₹0.00 /mo',
      status: data.status || 'Active',
      contactEmail: data.contactEmail || data.ownerEmail || 'admin@salon.com',
      contactPhone: data.contactPhone || data.ownerPhone || '+91 99000 00000',
      ownerName: data.ownerName || 'Salon Owner',
      ownerEmail: data.ownerEmail || data.contactEmail || 'owner@salon.com',
      ownerPhone: data.ownerPhone || data.contactPhone || '+91 99000 00000',
      branchesCount: data.branchesCount ?? 1,
      branchesList:
        data.branchesList && data.branchesList.length > 0
          ? data.branchesList
          : [data.name || 'Main Branch'],
      customDomain: data.customDomain,
      primaryColor: data.primaryColor || '#5A2EA6',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTenants((prev) => [optimisticTenant, ...prev]);

    logAuditEvent({
      action: 'TENANT_CREATED',
      category: 'Tenant',
      entityType: 'Tenant',
      entityId: tempId,
      resource: data.name || 'New Salon Tenant',
      beforeState: { status: 'None', tenant_exists: false },
      afterState: {
        status: optimisticTenant.status,
        tenant: optimisticTenant.name,
        plan: optimisticTenant.activePlans,
        city: optimisticTenant.city,
      },
    });

    try {
      const liveCreated = await tenantsApi.create({
        name: data.name,
        salonName: data.name,
        slug: data.slug,
        city: data.city,
        region: data.region,
        state: data.region,
        activePlans: data.activePlans,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone,
        businessEmail: data.ownerEmail || data.contactEmail,
        businessPhone: data.ownerPhone || data.contactPhone,
        contactEmail: data.contactEmail || data.ownerEmail,
        contactPhone: data.contactPhone || data.ownerPhone,
        branchesCount: data.branchesCount ?? 1,
        branchesList:
          data.branchesList && data.branchesList.length > 0
            ? data.branchesList
            : [data.name || 'Main Branch'],
        customDomain: data.customDomain,
        primaryColor: data.primaryColor,
      });

      if (liveCreated && liveCreated.id) {
        setTenants((prev) =>
          prev.map((t) =>
            t.id === tempId
              ? {
                  ...t,
                  id: liveCreated.id,
                  name: liveCreated.salonName || liveCreated.name || t.name,
                  slug: liveCreated.slug || t.slug,
                  city: liveCreated.city || t.city,
                  ownerEmail: liveCreated.businessEmail || liveCreated.ownerEmail || t.ownerEmail,
                  ownerPhone: liveCreated.businessPhone || liveCreated.ownerPhone || t.ownerPhone,
                  branchesCount:
                    liveCreated.branchesCount ??
                    (liveCreated.branchesList ? liveCreated.branchesList.length : t.branchesCount),
                  branchesList: liveCreated.branchesList || t.branchesList || [],
                  customDomain: liveCreated.customDomain
                    ? liveCreated.customDomain
                    : t.customDomain,
                  primaryColor: liveCreated.primaryColor || t.primaryColor || '#7C3AED',
                  createdAt:
                    typeof liveCreated.createdAt === 'string'
                      ? liveCreated.createdAt.split('T')[0]
                      : t.createdAt,
                }
              : t,
          ),
        );
      }
    } catch (err) {
      console.warn('Error creating tenant on backend (optimistic copy retained):', err);
    }
  };

  const updateTenant = async (id: string, data: Partial<Tenant>) => {
    const existing = tenants.find((t) => t.id === id);
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));

    logAuditEvent({
      action: data.status === 'Suspended' ? 'TENANT_SUSPENDED' : 'TENANT_UPDATED',
      category: 'Tenant',
      entityType: 'Tenant',
      entityId: id,
      resource: data.name || existing?.name || id,
      beforeState: existing || { id },
      afterState: { ...(existing || {}), ...data },
    });

    try {
      await tenantsApi.update(id, {
        name: data.name,
        salonName: data.name,
        city: data.city,
        region: data.region,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone,
        ownerName: data.ownerName,
      });
    } catch (err) {
      console.warn('Failed to sync tenant update with backend:', err);
    }
  };

  const deleteTenant = async (id: string) => {
    const existing = tenants.find((t) => t.id === id);
    setTenants((prev) => prev.filter((t) => t.id !== id));

    logAuditEvent({
      action: 'TENANT_DELETED',
      category: 'Tenant',
      entityType: 'Tenant',
      entityId: id,
      resource: existing?.name || id,
      beforeState: existing || { id },
      afterState: { status: 'DELETED', deletedAt: new Date().toISOString() },
    });

    try {
      await tenantsApi.delete(id);
    } catch (err) {
      console.warn('Failed to sync tenant deletion with backend:', err);
    }
  };

  const addAdminUser = async (data: Partial<AdminUser> & { generatedPassword?: string }) => {
    const tempId = `usr-${Date.now()}`;
    const generatedPassword =
      data.generatedPassword || `SuperAdmin@${Math.floor(1000 + Math.random() * 9000)}!`;
    const newUser: AdminUser = {
      id: tempId,
      name: data.name || 'New Operator',
      email: data.email || 'operator@saas.com',
      phone: data.phone || '+91 98000 00000',
      role: data.role || 'Support Operator',
      status: data.status || 'Active',
      mfaEnabled: data.mfaEnabled ?? true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [newUser, ...prev]);

    if (data.role) {
      setRoles((prev) =>
        prev.map((r) => (r.role === data.role ? { ...r, usersCount: r.usersCount + 1 } : r)),
      );
    }

    logAuditEvent({
      action: 'USER_ONBOARDED',
      category: 'User',
      entityType: 'User',
      entityId: tempId,
      resource: `${newUser.name} (${newUser.role})`,
      beforeState: { exists: false },
      afterState: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        mfaEnabled: newUser.mfaEnabled,
      },
    });

    try {
      const roleCode =
        data.role === 'Super Admin' || data.role === 'Super Administrator'
          ? 'SUPER_ADMIN'
          : data.role === 'Support Operator'
            ? 'SUPPORT_OPERATOR'
            : data.role === 'Billing Specialist'
              ? 'BILLING_SPECIALIST'
              : data.role === 'Security Auditor'
                ? 'SECURITY_AUDITOR'
                : data.role || 'SUPER_ADMIN';

      const created = await usersApi.create({
        email: data.email || `operator-${Date.now()}@digiflex.com`,
        fullName: data.name || 'New Operator',
        password: generatedPassword,
        mobilePhone: data.phone || '+91 98000 00000',
        userType: 'PLATFORM',
        roles: [roleCode],
        branchIds: [],
      });
      if (created && created.id) {
        setUsers((prev) => prev.map((u) => (u.id === tempId ? { ...u, id: created.id } : u)));
      }

      // Log notification audit trace
      try {
        const loginUrl = `${window.location.origin}/super-admin/login`;
        await apiClient.post('/api/v1/super-admin/notifications/simulate', {
          tenantId: '00000000-0000-0000-0000-000000000000',
          recipientId: data.email,
          channel: 'EMAIL',
          subject: 'Super Admin Operator Onboarding - Credentials Dispatched',
          body: `Welcome ${data.name || 'Operator'}, your Super Admin credentials have been dispatched. Portal URL: ${loginUrl}`,
          variables: {
            operatorName: data.name,
            loginEmail: data.email,
            assignedRole: data.role,
            portalUrl: loginUrl,
            dispatchedAt: new Date().toISOString(),
          },
        });
      } catch (notifyErr) {
        console.warn('Notification trace recorded:', notifyErr);
      }
    } catch (err) {
      console.warn('Failed to sync created user with backend:', err);
    }
  };

  const updateAdminUser = async (id: string, data: Partial<AdminUser>) => {
    const existing = users.find((u) => u.id === id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));

    logAuditEvent({
      action: data.status === 'Inactive' ? 'USER_SUSPENDED' : 'USER_MODIFIED',
      category: 'User',
      entityType: 'User',
      entityId: id,
      resource: data.name || existing?.name || id,
      beforeState: existing || { id },
      afterState: { ...(existing || {}), ...data },
    });

    try {
      const payload: any = {};
      if (data.name !== undefined) payload.fullName = data.name;
      if (data.email !== undefined) payload.email = data.email;
      if (data.phone !== undefined) payload.mobilePhone = data.phone;
      if (data.status !== undefined) {
        payload.status = data.status === 'Active' ? 'ACTIVE' : 'SUSPENDED';
      }
      if (data.mfaEnabled !== undefined) {
        payload.isMfaEnabled = data.mfaEnabled;
        payload.isMfaRequired = data.mfaEnabled;
      }
      if (data.role !== undefined) {
        payload.role = data.role;
        payload.roles = [data.role];
      }

      const updated = await usersApi.update(id, payload);
      if (updated) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  name: updated.fullName || u.name,
                  email: updated.email || u.email,
                  phone: updated.mobilePhone || u.phone,
                  role:
                    updated.role ||
                    (updated.roles && updated.roles.length > 0
                      ? updated.roles[0].name || updated.roles[0].code
                      : data.role || u.role),
                  status:
                    updated.status === 'SUSPENDED' || updated.status === 'LOCKED'
                      ? 'Inactive'
                      : 'Active',
                  mfaEnabled:
                    updated.isMfaEnabled !== undefined ? updated.isMfaEnabled : u.mfaEnabled,
                }
              : u,
          ),
        );
      }
    } catch (err) {
      console.warn('Failed to sync user update with backend:', err);
    }
  };

  const deleteAdminUser = async (id: string) => {
    const targetUser = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (targetUser?.role) {
      setRoles((prev) =>
        prev.map((r) =>
          r.role === targetUser.role ? { ...r, usersCount: Math.max(0, r.usersCount - 1) } : r,
        ),
      );
    }

    logAuditEvent({
      action: 'USER_SUSPENDED',
      category: 'User',
      entityType: 'User',
      entityId: id,
      resource: targetUser?.name || id,
      beforeState: targetUser || { id },
      afterState: { status: 'SUSPENDED', suspendedAt: new Date().toISOString() },
    });

    try {
      await usersApi.suspend(id);
    } catch (err) {
      console.warn('Failed to sync user suspension with backend:', err);
    }
  };

  const addCustomRole = async (data: Partial<RoleScope>) => {
    const tempId = data.id || `rol-${Date.now()}`;
    const modPerms = data.modulePermissions || getDefaultModulePermissions('none');
    const newRole: RoleScope = {
      id: tempId,
      role: data.role || 'Custom Role Scope',
      description: data.description || 'Custom role scope description',
      scope: 'Platform Wide',
      usersCount: 0,
      permissions: data.permissions || {
        tenants: modPerms.tenants?.view || false,
        billing: modPerms.billingPayments?.view || false,
        auditLogs: modPerms.auditLogs?.view || false,
        featureFlags: modPerms.featureFlags?.view || false,
        usersRbac: modPerms.users?.view || modPerms.rolesPermissions?.view || false,
      },
      modulePermissions: modPerms,
    };
    setRoles((prev) => [...prev, newRole]);

    logAuditEvent({
      action: 'ROLE_CREATED',
      category: 'User',
      entityType: 'Role',
      entityId: tempId,
      resource: newRole.role,
      beforeState: { exists: false },
      afterState: { role: newRole.role, description: newRole.description, scope: newRole.scope },
    });

    try {
      const baseCode = (data.role || 'CUSTOM_ROLE').toUpperCase().replace(/[^A-Z0-9]+/g, '_');
      const code = baseCode.startsWith('PLATFORM_') ? baseCode : `PLATFORM_${baseCode}`;

      const permissionCodes = modulePermissionsToCodes(modPerms);
      const cleanDesc = (data.description || 'Platform operator custom role scope').replace(/<!--META:.*?-->/g, '').trim();
      const metaDescription = `${cleanDesc} <!--META:${JSON.stringify(modPerms)}-->`;

      const created = await rolesApi.create({
        name: data.role || 'Custom Role',
        code,
        description: metaDescription,
        permissions: permissionCodes,
      });

      if (created && created.id) {
        setRoles((prev) => prev.map((r) => (r.id === tempId ? { ...r, id: created.id } : r)));
      }
    } catch (err) {
      console.warn('Failed to sync custom role with backend:', err);
    }
  };

  const updateCustomRole = async (id: string, data: Partial<RoleScope>) => {
    const cleanId = id.trim().toLowerCase();
    const oldRole = roles.find(
      (r) =>
        r.id.toLowerCase() === cleanId ||
        r.role.toLowerCase() === cleanId ||
        r.role.toLowerCase().replace(/\s+/g, '-') === cleanId ||
        r.role.toLowerCase().replace(/\s+/g, '_') === cleanId,
    );

    if (isSystemProtectedRole(oldRole) || isSystemProtectedRole({ id })) {
      console.warn('Super Administrator is a protected system default role and cannot be modified.');
      return;
    }

    setRoles((prev) =>
      prev.map((r) => {
        if (
          r.id === id ||
          r.id.toLowerCase() === cleanId ||
          r.role.toLowerCase() === cleanId ||
          r.role.toLowerCase().replace(/\s+/g, '-') === cleanId ||
          r.role.toLowerCase().replace(/\s+/g, '_') === cleanId
        ) {
          return {
            ...r,
            ...data,
            scope: 'Platform Wide',
          };
        }
        return r;
      }),
    );

    // If role name was updated, update matching users assigned to old role name
    if (data.role && oldRole && oldRole.role !== data.role) {
      setUsers((prev) =>
        prev.map((u) => (u.role === oldRole.role ? { ...u, role: data.role! } : u)),
      );
    }

    logAuditEvent({
      action: 'ROLE_PERMISSIONS_UPDATED',
      category: 'User',
      entityType: 'Role',
      entityId: id,
      resource: data.role || oldRole?.role || id,
      beforeState: oldRole ? { role: oldRole.role, permissions: oldRole.permissions } : { id },
      afterState: { role: data.role || oldRole?.role, permissions: data.permissions || data.modulePermissions },
    });

    try {
      const targetBackendId = oldRole?.id || id;
      if (targetBackendId && !targetBackendId.startsWith('rol-')) {
        const rawDesc = data.description !== undefined ? data.description : (oldRole?.description || '');
        const cleanDesc = rawDesc.replace(/<!--META:.*?-->/g, '').trim();
        const modPerms = data.modulePermissions || oldRole?.modulePermissions;
        const metaDesc = modPerms
          ? `${cleanDesc} <!--META:${JSON.stringify(modPerms)}-->`
          : cleanDesc;

        await rolesApi.update(targetBackendId, {
          name: data.role,
          description: metaDesc,
        });

        if (modPerms) {
          const permissionCodes = modulePermissionsToCodes(modPerms);
          await rolesApi.assignPermissions(targetBackendId, permissionCodes);
        }
      }
    } catch (err) {
      console.warn('Failed to sync role update with backend:', err);
    }
  };

  const deleteCustomRole = async (id: string) => {
    const target = roles.find((r) => r.id === id);
    if (isSystemProtectedRole(target) || isSystemProtectedRole({ id })) {
      console.warn('Super Administrator is a protected system default role and cannot be deleted.');
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== id));

    logAuditEvent({
      action: 'ROLE_DELETED',
      category: 'User',
      entityType: 'Role',
      entityId: id,
      resource: target?.role || id,
      beforeState: target || { id },
      afterState: { deleted: true },
    });

    try {
      await rolesApi.delete(id);
    } catch (err) {
      console.warn('Failed to delete custom role from backend:', err);
    }
  };

  const addAnnouncement = async (data: Partial<Announcement>) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title || 'New Platform Advisory',
      content: data.content || 'Announcement content description...',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      audience: data.audience || 'All Tenants & Owners',
      priority: data.priority || 'Info',
      channels: data.channels || ['In-App Banner'],
      status: data.status || 'Active',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    logAuditEvent({
      action: 'ANNOUNCEMENT_PUBLISHED',
      category: 'Tenant',
      entityType: 'Announcement',
      entityId: newAnn.id,
      resource: newAnn.title,
      beforeState: { published: false },
      afterState: { title: newAnn.title, audience: newAnn.audience, priority: newAnn.priority },
    });
  };

  const updateAnnouncement = (id: string, data: Partial<Announcement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const addSubscriptionPlan = async (data: Partial<SubscriptionPlan>) => {
    const tempId = `plan-${Date.now()}`;
    const numericPrice = data.numericPrice || 5000;
    const themeVariant = data.themeVariant || 'popular';
    const newPlan: SubscriptionPlan = {
      id: tempId,
      name: data.name || 'New Custom Tier',
      price: data.price || `₹${numericPrice.toLocaleString('en-IN')} /mo`,
      numericPrice: numericPrice,
      billingCycle: data.billingCycle || 'per branch / month',
      tierBadge:
        data.tierBadge || (themeVariant === 'popular' ? '★ Most Popular' : 'Subscription Tier'),
      tagline: data.tagline || 'Comprehensive salon and spa management tier',
      branchesQuota: data.branchesQuota || `${data.maxBranches || 3} Branches`,
      staffQuota: data.staffQuota || `${data.maxStaff || 10} Staff Seats`,
      apiQuota:
        data.apiQuota || (data.hasCustomApi ? 'Full REST API Access' : 'Basic Webhook APIs'),
      domainQuota:
        data.domainQuota || (data.hasWhiteLabel ? 'Custom CNAME Domain' : 'Standard Salon Domain'),
      themeVariant,
      entitlements:
        data.entitlements && data.entitlements.length > 0
          ? data.entitlements
          : [
              'Conflict-free diary & GST POS invoicing',
              'WhatsApp booking links & SMS reminders',
              'Standard 9am-9pm email operator support',
            ],
      activeSubscribers: data.activeSubscribers || '0 Tenants',
      subscriberCount: data.subscriberCount || 0,
      status: 'Active',
      features:
        data.features ||
        (data.entitlements ? data.entitlements.join(', ') : 'Standard feature bundle'),
      maxBranches: data.maxBranches || 3,
      maxStaff: data.maxStaff || 10,
      hasCustomApi: data.hasCustomApi ?? false,
      hasWhiteLabel: data.hasWhiteLabel ?? false,
      hasFranchise: data.hasFranchise ?? false,
      franchiseQuota:
        data.franchiseQuota ||
        (data.hasFranchise ? 'Unlimited Franchises' : 'COCO Only (No Franchises)'),
      maxFranchises: data.hasFranchise ? (data.maxFranchises ?? 999) : 0,
      rolloutPercentage: data.rolloutPercentage ?? 100,
      rolloutStrategy: data.rolloutStrategy || 'Immediate GA',
    };
    setSubscriptionPlans((prev) => [...prev, newPlan]);

    logAuditEvent({
      action: 'SUBSCRIPTION_PLAN_CREATED',
      category: 'Billing',
      entityType: 'SubscriptionPlan',
      entityId: tempId,
      resource: newPlan.name,
      beforeState: { plan_exists: false },
      afterState: { name: newPlan.name, price: newPlan.price, maxBranches: newPlan.maxBranches },
    });

    try {
      const code = (data.name || 'CUSTOM_TIER').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const metaDescription = JSON.stringify({
        summary:
          data.features ||
          (data.entitlements ? data.entitlements.join(', ') : 'Standard feature bundle'),
        themeVariant: newPlan.themeVariant,
        tierBadge: newPlan.tierBadge,
        tagline: newPlan.tagline,
        billingCycle: newPlan.billingCycle,
        branchesQuota: newPlan.branchesQuota,
        staffQuota: newPlan.staffQuota,
        apiQuota: newPlan.apiQuota,
        domainQuota: newPlan.domainQuota,
        entitlements: newPlan.entitlements,
        hasFranchise: newPlan.hasFranchise,
        franchiseQuota: newPlan.franchiseQuota,
        maxFranchises: newPlan.maxFranchises,
        rolloutPercentage: newPlan.rolloutPercentage,
        rolloutStrategy: newPlan.rolloutStrategy,
      });

      const res = await apiClient.post('/api/v1/super-admin/plans', {
        name: data.name || 'New Custom Tier',
        code,
        basePrice: numericPrice,
        priceMonthly: numericPrice,
        priceAnnual: numericPrice * 10,
        maxBranches: data.maxBranches || 3,
        maxStaff: data.maxStaff || 10,
        hasCustomApi: data.hasCustomApi ?? false,
        hasWhiteLabel: data.hasWhiteLabel ?? false,
        description: metaDescription,
      });
      if (res.data?.data?.id) {
        setSubscriptionPlans((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: res.data.data.id } : p)),
        );
      }
    } catch (err) {
      console.warn('Failed to sync plan creation with backend:', err);
    }
  };

  const updateSubscriptionPlan = async (id: string, data: Partial<SubscriptionPlan>) => {
    const existing = subscriptionPlans.find((p) => p.id === id);
    setSubscriptionPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              price: data.numericPrice
                ? `₹${data.numericPrice.toLocaleString('en-IN')} /mo`
                : data.price || p.price,
              features: data.entitlements
                ? data.entitlements.join(', ')
                : data.features || p.features,
            }
          : p,
      ),
    );

    logAuditEvent({
      action: 'SUBSCRIPTION_PLAN_MODIFIED',
      category: 'Billing',
      entityType: 'SubscriptionPlan',
      entityId: id,
      resource: data.name || existing?.name || id,
      beforeState: existing
        ? { plan_price: existing.price, max_branches: existing.maxBranches }
        : { id },
      afterState: {
        plan_price: data.price || (data.numericPrice ? `₹${data.numericPrice} /mo` : existing?.price),
        max_branches: data.maxBranches || existing?.maxBranches,
      },
    });

    try {
      const metaDescription = JSON.stringify({
        summary: data.features || (data.entitlements ? data.entitlements.join(', ') : undefined),
        themeVariant: data.themeVariant,
        tierBadge: data.tierBadge,
        tagline: data.tagline,
        billingCycle: data.billingCycle,
        branchesQuota: data.branchesQuota,
        staffQuota: data.staffQuota,
        apiQuota: data.apiQuota,
        domainQuota: data.domainQuota,
        entitlements: data.entitlements,
        hasFranchise: data.hasFranchise,
        franchiseQuota: data.franchiseQuota,
        maxFranchises: data.maxFranchises,
        rolloutPercentage: data.rolloutPercentage,
        rolloutStrategy: data.rolloutStrategy,
      });

      await apiClient.patch(`/api/v1/super-admin/plans/${id}`, {
        name: data.name,
        basePrice: data.numericPrice,
        priceMonthly: data.numericPrice,
        maxBranches: data.maxBranches,
        maxStaff: data.maxStaff,
        hasCustomApi: data.hasCustomApi,
        hasWhiteLabel: data.hasWhiteLabel,
        description: metaDescription,
      });
    } catch (err) {
      console.warn('Failed to sync plan update with backend:', err);
    }
  };

  const updatePlanRollout = async (id: string, rolloutPercentage: number, strategy: string) => {
    const existing = subscriptionPlans.find((p) => p.id === id);
    setSubscriptionPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, rolloutPercentage, rolloutStrategy: `${strategy} (${rolloutPercentage}%)` }
          : p,
      ),
    );

    logAuditEvent({
      action: 'PLAN_ROLLOUT_UPDATED',
      category: 'Billing',
      entityType: 'SubscriptionPlan',
      entityId: id,
      resource: existing?.name || id,
      beforeState: { rolloutPercentage: existing?.rolloutPercentage, rolloutStrategy: existing?.rolloutStrategy },
      afterState: { rolloutPercentage, rolloutStrategy: `${strategy} (${rolloutPercentage}%)` },
    });

    try {
      await apiClient.patch(`/api/v1/super-admin/plans/${id}`, {
        rolloutPercentage,
        rolloutStrategy: strategy,
      });
    } catch (err) {
      console.warn('Failed to sync rollout update with backend:', err);
    }
  };

  const addInvoice = (data: Partial<Invoice>) => {
    const newId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: Invoice = {
      invoiceId: newId,
      salon: data.salon || 'Blush & Bloom Salon Group',
      amount: `₹${(data.numericAmount || 12500).toLocaleString('en-IN')}`,
      numericAmount: data.numericAmount || 12500,
      status: data.status || 'Paid',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      billingPeriod: data.billingPeriod || 'Current Month',
    };
    setInvoices((prev) => [newInv, ...prev]);

    logAuditEvent({
      action: 'INVOICE_GENERATED',
      category: 'Billing',
      entityType: 'Invoice',
      entityId: newId,
      resource: newInv.salon,
      beforeState: { invoice: 'Not Generated' },
      afterState: { invoiceId: newId, amount: newInv.amount, status: newInv.status },
    });
  };

  const canAccess = (path: string): boolean => {
    return checkModuleAccess(path, user, roles);
  };

  return (
    <SuperAdminContext.Provider
      value={{
        tenants,
        users,
        roles,
        announcements,
        subscriptionPlans,
        invoices,
        auditLogs,
        isLoadingAuditLogs,
        fetchAuditLogs,
        logAuditEvent,
        addTenant,
        updateTenant,
        deleteTenant,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        addCustomRole,
        updateCustomRole,
        deleteCustomRole,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addSubscriptionPlan,
        updateSubscriptionPlan,
        updatePlanRollout,
        addInvoice,
        canAccess,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdminStore = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdminStore must be used within a SuperAdminProvider');
  }
  return context;
};

const PATH_TO_MODULE_MAP: Record<string, string> = {
  salons: 'tenants',
  tenants: 'tenants',
  'subscription-plans': 'subscriptionPlans',
  subscriptionplans: 'subscriptionPlans',
  'billing-payments': 'billingPayments',
  billingpayments: 'billingPayments',
  users: 'users',
  'roles-permissions': 'rolesPermissions',
  rolespermissions: 'rolesPermissions',
  'support-tickets': 'supportTickets',
  supporttickets: 'supportTickets',
  announcements: 'announcements',
  notifications: 'notifications',
  'audit-logs': 'auditLogs',
  auditlogs: 'auditLogs',
  integrations: 'integrations',
  'api-keys': 'apiKeys',
  apikeys: 'apiKeys',
  'feature-flags': 'featureFlags',
  featureflags: 'featureFlags',
  settings: 'settings',
};

export function checkModuleAccess(
  path: string,
  user: {
    role?: string;
    roles?: Array<{ code: string; name?: string }> | string[];
    permissions?: string[];
    userType?: string;
  } | null,
  rolesList?: RoleScope[],
): boolean {
  if (!user) return false;

  const roleCodes: string[] = [];
  if (user.role) roleCodes.push(user.role.toUpperCase().trim());
  if (Array.isArray(user.roles)) {
    user.roles.forEach((r) => {
      if (typeof r === 'string') roleCodes.push(r.toUpperCase().trim());
      else if (r && typeof r === 'object') {
        if (r.code) roleCodes.push(r.code.toUpperCase().trim());
        if (r.name) roleCodes.push(r.name.toUpperCase().trim());
      }
    });
  }

  // Tenant and Branch users can NEVER access Super Admin console
  if (
    user.userType === 'TENANT' ||
    roleCodes.includes('BRANCH_MANAGER') ||
    roleCodes.includes('TENANT_ADMIN') ||
    roleCodes.includes('SALON_ADMIN')
  ) {
    return false;
  }

  // Universal access for Super Admin ONLY
  const isSuperAdmin =
    roleCodes.some((r) => {
      const normalized = r.replace(/\s+/g, '_');
      return [
        'SUPER_ADMIN',
        'SUPER_ADMINISTRATOR',
        'SUPERADMIN',
        'PLATFORM_SUPER_ADMIN',
        'PLATFORM_SUPER',
        'PLATFORM_ADMIN',
        'SUPER_ADMIN_ROLE',
      ].includes(normalized);
    }) ||
    (user.role &&
      ['super administrator', 'super admin', 'superadmin', 'platform super admin'].includes(
        user.role.toLowerCase().trim(),
      )) ||
    user.userType === 'SUPER_ADMIN';

  if (isSuperAdmin) {
    return true;
  }

  const cleanPath = path.replace(/^\//, '').split('/')[0].toLowerCase();
  // Dashboard and Profile are accessible to all platform operators unconditionally
  if (!cleanPath || cleanPath === 'dashboard' || cleanPath === 'profile') return true;

  const moduleKey = PATH_TO_MODULE_MAP[cleanPath] || cleanPath;

  // 1. Check against registered RoleScope list with granular module permissions
  if (rolesList && rolesList.length > 0) {
    const matchedRole = rolesList.find((rl: any) => {
      const rlName = (rl.role || '').toUpperCase().trim();
      const rlCode = (rl.code || '').toUpperCase().trim();
      const rlId = (rl.id || '').toUpperCase().trim();
      const rlNormalized = rlName.replace(/\s+/g, '_');

      return roleCodes.some((code) => {
        const c = code.trim().toUpperCase();
        const cNormalized = c.replace(/\s+/g, '_');
        return (
          c === rlName ||
          c === rlCode ||
          c === rlId ||
          cNormalized === rlNormalized ||
          cNormalized === rlCode ||
          cNormalized.replace(/^PLATFORM_/, '') === rlNormalized ||
          cNormalized.replace(/^PLATFORM_/, '') === rlCode
        );
      });
    });

    if (matchedRole) {
      if (
        matchedRole.modulePermissions &&
        matchedRole.modulePermissions[moduleKey] !== undefined
      ) {
        return Boolean(matchedRole.modulePermissions[moduleKey]?.view);
      }
      if (matchedRole.permissions) {
        switch (cleanPath) {
          case 'salons':
            return Boolean(matchedRole.permissions.tenants);
          case 'subscription-plans':
          case 'billing-payments':
            return Boolean(matchedRole.permissions.billing);
          case 'users':
          case 'roles-permissions':
            return Boolean(matchedRole.permissions.usersRbac);
          case 'support-tickets':
            return Boolean(matchedRole.permissions.tenants);
          case 'announcements':
          case 'notifications':
            return Boolean(matchedRole.permissions.tenants);
          case 'audit-logs':
            return Boolean(matchedRole.permissions.auditLogs);
          case 'integrations':
          case 'api-keys':
          case 'feature-flags':
            return Boolean(matchedRole.permissions.featureFlags);
          case 'settings':
            return Boolean(matchedRole.permissions.usersRbac);
        }
      }
    }
  }

  // 2. Check direct permission strings if present on user
  if (user.permissions && Array.isArray(user.permissions) && user.permissions.length > 0) {
    const perms = user.permissions.map((p) => p.toLowerCase());
    if (perms.includes('*') || perms.includes('all') || perms.includes('platform:admin')) {
      return true;
    }
    const hasModulePerm = perms.some((p) => {
      if (moduleKey === 'tenants' && (p.includes('tenant') || p.includes('salon'))) return true;
      if (
        moduleKey === 'subscriptionPlans' &&
        (p.includes('plan') || p.includes('subscription') || p.includes('billing'))
      )
        return true;
      if (
        moduleKey === 'billingPayments' &&
        (p.includes('billing') || p.includes('invoice') || p.includes('payment'))
      )
        return true;
      if (moduleKey === 'users' && p.includes('user') && !p.includes('role')) return true;
      if (
        moduleKey === 'rolesPermissions' &&
        (p.includes('role') || p.includes('permission') || p.includes('rbac'))
      )
        return true;
      if (moduleKey === 'supportTickets' && (p.includes('ticket') || p.includes('support')))
        return true;
      if (moduleKey === 'announcements' && p.includes('announcement')) return true;
      if (moduleKey === 'notifications' && p.includes('notification')) return true;
      if (moduleKey === 'auditLogs' && (p.includes('audit') || p.includes('log'))) return true;
      if (moduleKey === 'integrations' && p.includes('integration')) return true;
      if (moduleKey === 'apiKeys' && (p.includes('api') || p.includes('key'))) return true;
      if (moduleKey === 'featureFlags' && (p.includes('flag') || p.includes('feature')))
        return true;
      if (moduleKey === 'settings' && (p.includes('setting') || p.includes('config'))) return true;
      return p === moduleKey || p.startsWith(`${moduleKey}:`) || p.startsWith(`${cleanPath}:`);
    });
    if (hasModulePerm) return true;
  }

  // 3. Fallback role heuristics for standard platform roles
  const isSupport = roleCodes.some((r) => r.includes('SUPPORT') || r.includes('OPERATOR'));
  const isBilling = roleCodes.some(
    (r) => r.includes('BILLING') || r.includes('FINANCE') || r.includes('ACCOUNT'),
  );
  const isSecurity = roleCodes.some(
    (r) => r.includes('SECURITY') || r.includes('AUDIT') || r.includes('COMPLIANCE'),
  );

  if (isSupport) {
    return ['salons', 'support-tickets', 'announcements', 'notifications'].includes(cleanPath);
  }
  if (isBilling) {
    return ['subscription-plans', 'billing-payments'].includes(cleanPath);
  }
  if (isSecurity) {
    return ['audit-logs', 'feature-flags'].includes(cleanPath);
  }

  // Default: HIDE if not permitted
  return false;
}
