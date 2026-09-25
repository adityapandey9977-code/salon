import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
  PrismaClient,
  ScopeType,
  UserStatus,
  UserType,
} from '../src/infrastructure/prisma/generated-client/index.js';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const prisma = new PrismaClient();

const PERMISSIONS = [
  // Panel Access
  { code: 'panel.super_admin.access', name: 'Super Admin Panel Access', module: 'PLATFORM', description: 'Access super admin workspace' },
  { code: 'panel.admin.access', name: 'Salon Admin Panel Access', module: 'ORGANIZATION', description: 'Access salon admin workspace' },
  { code: 'panel.branch.access', name: 'Branch Manager Panel Access', module: 'ORGANIZATION', description: 'Access branch manager workspace' },
  { code: 'panel.stylist.access', name: 'Stylist Panel Access', module: 'PEOPLE', description: 'Access stylist workspace' },
  { code: 'panel.callcenter.access', name: 'Call Center Panel Access', module: 'COMMUNICATION', description: 'Access call center workspace' },
  { code: 'panel.inventory.access', name: 'Inventory Panel Access', module: 'INVENTORY', description: 'Access inventory workspace' },
  { code: 'panel.finance.access', name: 'Finance Panel Access', module: 'FINANCE', description: 'Access finance workspace' },
  { code: 'panel.franchise.access', name: 'Franchise Partner Panel Access', module: 'ORGANIZATION', description: 'Access franchise partner workspace' },

  // Platform
  { code: 'platform.read', name: 'Read Platform Telemetry', module: 'PLATFORM', description: 'View platform stats' },
  { code: 'platform.manage', name: 'Manage Platform', module: 'PLATFORM', description: 'Manage tenants and plans' },
  { code: 'platform.tenant.read', name: 'Read Platform Tenants', module: 'PLATFORM', description: 'View tenant subscriptions' },
  { code: 'platform.tenant.create', name: 'Create Platform Tenant', module: 'PLATFORM', description: 'Provision new tenant organization' },
  { code: 'platform.tenant.manage', name: 'Manage Platform Tenant', module: 'PLATFORM', description: 'Configure tenant subscription, domains & branding' },
  { code: 'platform.plan.read', name: 'Read Subscription Plans', module: 'PLATFORM', description: 'View SaaS tiers' },
  { code: 'platform.plan.manage', name: 'Manage Subscription Plans', module: 'PLATFORM', description: 'Create and update subscription tiers' },
  { code: 'platform.feature.read', name: 'Read Feature Flags', module: 'PLATFORM', description: 'View SaaS features and entitlements' },
  { code: 'platform.feature.manage', name: 'Manage Feature Flags', module: 'PLATFORM', description: 'Configure feature flags and overrides' },
  { code: 'platform.domain.read', name: 'Read Custom Domains', module: 'PLATFORM', description: 'View tenant custom domains' },
  { code: 'platform.domain.manage', name: 'Manage Custom Domains', module: 'PLATFORM', description: 'Verify and configure custom domains' },

  // Tenant
  { code: 'tenant.read', name: 'Read Tenant Info', module: 'ORGANIZATION', description: 'View tenant profile' },
  { code: 'tenant.manage', name: 'Manage Tenant', module: 'ORGANIZATION', description: 'Update tenant settings' },

  // Branch
  { code: 'branch.read', name: 'Read Branches', module: 'ORGANIZATION', description: 'View branch details and rooms' },
  { code: 'branch.manage', name: 'Manage Branches', module: 'ORGANIZATION', description: 'Create and update branches' },
  { code: 'branch.settings.read', name: 'Read Branch Settings', module: 'ORGANIZATION', description: 'View branch operational settings' },
  { code: 'branch.settings.manage', name: 'Manage Branch Settings', module: 'ORGANIZATION', description: 'Update branch operational settings' },

  // Staff
  { code: 'staff.read', name: 'Read Staff', module: 'PEOPLE', description: 'View staff profiles and rosters' },
  { code: 'staff.manage', name: 'Manage Staff', module: 'PEOPLE', description: 'Assign shifts and skills' },

  // Customer
  { code: 'customer.read', name: 'Read Customers', module: 'CUSTOMER', description: 'View CRM profiles and cautions' },
  { code: 'customer.manage', name: 'Manage Customers', module: 'CUSTOMER', description: 'Create and update clients' },

  // Appointment
  { code: 'appointment.read', name: 'Read Appointments', module: 'BOOKING', description: 'View appointment calendar' },
  { code: 'appointment.create', name: 'Create Appointments', module: 'BOOKING', description: 'Book new appointments' },
  { code: 'appointment.update', name: 'Update Appointments', module: 'BOOKING', description: 'Reschedule or modify' },
  { code: 'appointment.cancel', name: 'Cancel Appointments', module: 'BOOKING', description: 'Cancel bookings' },
  { code: 'appointment.walkin.read', name: 'Read Walk-in Queue', module: 'BOOKING', description: 'View live branch walk-in queue' },

  // Commerce & POS
  { code: 'commerce.read', name: 'Read Catalogue & Invoices', module: 'COMMERCE', description: 'View POS and invoices' },
  { code: 'commerce.manage', name: 'Manage Commerce & POS', module: 'COMMERCE', description: 'POS checkout & pricing' },
  { code: 'service.read', name: 'Read Services', module: 'COMMERCE', description: 'View services and categories' },
  { code: 'service.manage', name: 'Manage Services', module: 'COMMERCE', description: 'Create and update services' },

  // Payment
  { code: 'payment.read', name: 'Read Payments', module: 'PAYMENT', description: 'View transaction records' },
  { code: 'payment.manage', name: 'Manage Payments', module: 'PAYMENT', description: 'Process payments and refunds' },

  // Inventory
  { code: 'inventory.read', name: 'Read Inventory', module: 'INVENTORY', description: 'View SKU stock balances' },
  { code: 'inventory.manage', name: 'Manage Inventory', module: 'INVENTORY', description: 'POs, GRNs and adjustments' },
  { code: 'inventory.retail.read', name: 'Read Retail Stock', module: 'INVENTORY', description: 'View retail shelf products and prices' },
  { code: 'inventory.stock.read', name: 'Read Stock Balances', module: 'INVENTORY', description: 'View branch stock levels' },
  { code: 'inventory.stock.adjust', name: 'Adjust Stock Balances', module: 'INVENTORY', description: 'Perform manual stock adjustments' },
  { code: 'inventory.supplier.read', name: 'Read Suppliers', module: 'INVENTORY', description: 'View supplier catalogue' },
  { code: 'inventory.supplier.manage', name: 'Manage Suppliers', module: 'INVENTORY', description: 'Create and update suppliers' },
  { code: 'inventory.po.read', name: 'Read Purchase Orders', module: 'INVENTORY', description: 'View purchase orders' },
  { code: 'inventory.po.create', name: 'Create Purchase Orders', module: 'INVENTORY', description: 'Create new purchase orders' },
  { code: 'inventory.po.approve', name: 'Approve Purchase Orders', module: 'INVENTORY', description: 'Approve PO and receive GRN' },
  { code: 'inventory.transfer.read', name: 'Read Transfers', module: 'INVENTORY', description: 'View inter-branch transfers' },
  { code: 'inventory.transfer.manage', name: 'Manage Transfers', module: 'INVENTORY', description: 'Dispatch and receive transfers' },
  { code: 'inventory.stocktake.read', name: 'Read Stocktakes', module: 'INVENTORY', description: 'View stock audit audits' },
  { code: 'inventory.stocktake.manage', name: 'Manage Stocktakes', module: 'INVENTORY', description: 'Initiate and complete stocktake' },

  // Finance
  { code: 'finance.read', name: 'Read Financials', module: 'FINANCE', description: 'View ledgers and reports' },
  { code: 'finance.manage', name: 'Manage Financials', module: 'FINANCE', description: 'Commissions and royalties' },
  { code: 'finance.account.read', name: 'Read Chart of Accounts', module: 'FINANCE', description: 'View accounting accounts' },
  { code: 'finance.account.manage', name: 'Manage Chart of Accounts', module: 'FINANCE', description: 'Create and update CoA' },
  { code: 'finance.journal.read', name: 'Read Journal Entries', module: 'FINANCE', description: 'View double-entry journals' },
  { code: 'finance.journal.post', name: 'Post Journal Entries', module: 'FINANCE', description: 'Post immutable journal transactions' },
  { code: 'commission.read', name: 'Read Staff Commissions', module: 'FINANCE', description: 'View stylist commissions' },
  { code: 'commission.manage', name: 'Manage Commissions', module: 'FINANCE', description: 'Configure commission rules and payouts' },
  { code: 'payroll.read', name: 'Read Payroll', module: 'FINANCE', description: 'View payroll runs and employee salaries' },
  { code: 'payroll.manage', name: 'Manage Payroll', module: 'FINANCE', description: 'Execute payroll calculations' },
  { code: 'payroll.approve', name: 'Approve Payroll', module: 'FINANCE', description: 'Approve payroll runs for disbursement' },
  { code: 'franchise.royalty.read', name: 'Read Franchise Royalties', module: 'FINANCE', description: 'View franchise royalty ledgers' },
  { code: 'franchise.royalty.manage', name: 'Manage Franchise Royalties', module: 'FINANCE', description: 'Configure royalty rules & settlements' },
  { code: 'franchise.settlement.read', name: 'Read Settlements', module: 'FINANCE', description: 'View partner settlements' },
  { code: 'franchise.settlement.manage', name: 'Manage Settlements', module: 'FINANCE', description: 'Process settlement payouts' },

  // Communication
  { code: 'notification.read', name: 'Read Notifications', module: 'COMMUNICATION', description: 'View delivery logs' },
  { code: 'notification.manage', name: 'Manage Notifications', module: 'COMMUNICATION', description: 'Configure templates and simulate' },
  { code: 'campaign.read', name: 'Read Marketing Campaigns', module: 'COMMUNICATION', description: 'View marketing campaigns' },
  { code: 'campaign.manage', name: 'Manage Campaigns', module: 'COMMUNICATION', description: 'Create and launch campaigns' },
  { code: 'callcenter.read', name: 'Read Call Center Logs', module: 'COMMUNICATION', description: 'View call logs & telemetry' },
  { code: 'callcenter.manage', name: 'Manage Call Center', module: 'COMMUNICATION', description: 'Record dispositions and agent state' },

  // Reports & Audit
  { code: 'dashboard.read', name: 'Read Dashboard KPIs', module: 'REPORTING', description: 'View operational metrics' },
  { code: 'report.read', name: 'Read Analytics Reports', module: 'REPORTING', description: 'Export business reports' },
  { code: 'report.branch.read', name: 'Read Branch Reports', module: 'REPORTING', description: 'View branch level performance reports' },
  { code: 'report.export', name: 'Export Reports', module: 'REPORTING', description: 'Queue and download report exports' },
  { code: 'audit.read', name: 'Read Audit Logs', module: 'REPORTING', description: 'View immutable audit trail' },
  { code: 'audit.export', name: 'Export Audit Logs', module: 'REPORTING', description: 'Export audit trails' },

  // Roles & Users
  { code: 'role.read', name: 'Read Roles', module: 'IDENTITY', description: 'View roles and permissions' },
  { code: 'role.manage', name: 'Manage Roles', module: 'IDENTITY', description: 'Assign role permissions' },
  { code: 'user.read', name: 'Read Users', module: 'IDENTITY', description: 'View user accounts' },
  { code: 'user.create', name: 'Create Users', module: 'IDENTITY', description: 'Provision new user accounts' },
  { code: 'user.update', name: 'Update Users', module: 'IDENTITY', description: 'Edit user profiles' },
  { code: 'user.suspend', name: 'Suspend Users', module: 'IDENTITY', description: 'Suspend/lock user accounts' },
];

const ROLES = [
  {
    code: 'SUPER_ADMIN',
    name: 'Super Administrator',
    isSystem: true,
    description: 'Full platform access across all modules',
  },
  {
    code: 'SUPPORT_OPERATOR',
    name: 'Support Operator',
    isSystem: true,
    description: 'Platform support operator for tenant onboarding and assistance',
  },
  {
    code: 'BILLING_SPECIALIST',
    name: 'Billing Specialist',
    isSystem: true,
    description: 'Platform billing specialist for invoices and subscription plans',
  },
  {
    code: 'SECURITY_AUDITOR',
    name: 'Security Auditor',
    isSystem: true,
    description: 'Compliance, audit traces and API security inspector',
  },
  {
    code: 'FRANCHISE_OWNER',
    name: 'Franchise Owner',
    isSystem: true,
    description: 'Owner/Manager of a Franchise region',
  },

  {
    code: 'BRANCH_MANAGER',
    name: 'Branch Manager',
    isSystem: true,
    description: 'Operational branch management',
  },
  {
    code: 'FINANCE_HR',
    name: 'Finance & HR Specialist',
    isSystem: true,
    description: 'Financial ledgers and payroll',
  },
  {
    code: 'INVENTORY_MANAGER',
    name: 'Inventory Controller',
    isSystem: true,
    description: 'Stock, POs and procurement',
  },
  {
    code: 'STYLIST',
    name: 'Stylist / Therapist',
    isSystem: true,
    description: 'Personal appointments and client notes',
  },
  {
    code: 'CALL_CENTER_AGENT',
    name: 'Call Center Agent',
    isSystem: true,
    description: 'Multi-branch booking and CRM',
  },
];

async function main() {
  console.log('Seeding Identity Service...');

  // Remove deprecated non-staff roles
  await prisma.role.deleteMany({
    where: {
      code: { in: ['SALON_ADMIN', 'CUSTOMER'] },
    },
  });

  // 1. Seed Permissions
  const permissionMap = new Map<string, string>();
  for (const perm of PERMISSIONS) {
    const record = await prisma.permission.upsert({
      where: { code: perm.code },
      update: { name: perm.name, description: perm.description },
      create: perm,
    });
    permissionMap.set(perm.code, record.id);
  }
  console.log(`Seeded ${PERMISSIONS.length} permissions.`);

  // 2. Seed Roles & Map Permissions
  const roleMap = new Map<string, string>();
  const rolePermMappings: { roleId: string, permissionId: string }[] = [];
  for (const role of ROLES) {
    const record = await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
        isSystem: true,
        roleType: 'SYSTEM',
        tenantId: null,
      },
      create: {
        ...role,
        isSystem: true,
        roleType: 'SYSTEM',
        tenantId: null,
      },
    });
    roleMap.set(role.code, record.id);

    // Map default permissions
    let rolePerms: string[] = [];
    if (role.code === 'SUPER_ADMIN') {
      rolePerms = PERMISSIONS.map((p) => p.code);
    } else if (role.code === 'SUPPORT_OPERATOR') {
      rolePerms = [
        'tenant.read',
        'tenant.manage',
        'branch.read',
        'customer.read',
        'communication.read',
        'communication.send',
        'report.read',
      ];
    } else if (role.code === 'BILLING_SPECIALIST') {
      rolePerms = [
        'finance.read',
        'finance.manage',
        'payment.read',
        'payment.manage',
        'report.read',
        'platform.read',
      ];
    } else if (role.code === 'SECURITY_AUDITOR') {
      rolePerms = ['report.read', 'platform.read', 'user.read', 'role.read'];
    } else if (role.code === 'FRANCHISE_OWNER') {
      rolePerms = [
        'panel.franchise.access',
        'tenant.read',
        'branch.read',
        'branch.manage',
        'branch.settings.read',
        'branch.settings.manage',
        'staff.read',
        'staff.manage',
        'customer.read',
        'appointment.read',
        'commerce.read',
        'service.read',
        'service.manage',
        'inventory.read',
        'report.read',
        'report.export',
        'dashboard.read',
        'finance.read',
        'franchise.royalty.read',
        'franchise.settlement.read',
        'notification.read',
        'campaign.read',
        'user.read',
      ];
    } else if (role.code === 'BRANCH_MANAGER') {
      rolePerms = [
        'panel.branch.access',
        'branch.read',
        'branch.manage',
        'branch.settings.read',
        'staff.read',
        'staff.manage',
        'customer.read',
        'customer.manage',
        'appointment.read',
        'appointment.create',
        'appointment.update',
        'appointment.cancel',
        'appointment.walkin.read',
        'commerce.read',
        'commerce.manage',
        'service.read',
        'service.manage',
        'payment.read',
        'payment.manage',
        'inventory.read',
        'inventory.retail.read',
        'inventory.stock.read',
        'inventory.stock.adjust',
        'report.read',
        'report.branch.read',
        'report.export',
        'dashboard.read',
        'user.read',
        'notification.read',
        'campaign.read',
        'callcenter.read',
      ];
    } else if (role.code === 'CALL_CENTER_AGENT') {
      rolePerms = [
        'callcenter.read',
        'callcenter.manage',
        'customer.read',
        'customer.manage',
        'appointment.read',
        'appointment.create',
        'appointment.update',
        'appointment.cancel',
        'notification.read',
        'notification.manage',
        'campaign.read',
        'campaign.manage',
        'commerce.read',
        'report.read',
        'dashboard.read',
        'branch.read',
      ];
    } else if (role.code === 'FINANCE_HR') {
      rolePerms = [
        'finance.read',
        'finance.manage',
        'finance.account.read',
        'finance.account.manage',
        'finance.journal.read',
        'finance.journal.post',
        'commission.read',
        'commission.manage',
        'payroll.read',
        'payroll.manage',
        'payroll.approve',
        'franchise.royalty.read',
        'franchise.royalty.manage',
        'franchise.settlement.read',
        'franchise.settlement.manage',
        'payment.read',
        'payment.manage',
        'staff.read',
        'report.read',
        'report.export',
        'audit.read',
        'dashboard.read',
      ];
    } else if (role.code === 'INVENTORY_MANAGER') {
      rolePerms = [
        'inventory.read',
        'inventory.manage',
        'inventory.stock.read',
        'inventory.stock.adjust',
        'inventory.supplier.read',
        'inventory.supplier.manage',
        'inventory.po.read',
        'inventory.po.create',
        'inventory.po.approve',
        'inventory.transfer.read',
        'inventory.transfer.manage',
        'inventory.stocktake.read',
        'inventory.stocktake.manage',
        'commerce.read',
        'report.read',
        'report.export',
        'dashboard.read',
      ];
    } else if (role.code === 'STYLIST') {
      rolePerms = [
        'appointment.read',
        'appointment.create',
        'appointment.update',
        'customer.read',
        'customer.manage',
        'staff.read',
        'commerce.read',
        'dashboard.read',
      ];
    }
    rolePermMappings.push(...rolePerms.map(permCode => ({
      roleId: record.id,
      permissionId: permissionMap.get(permCode)!
    })).filter(x => x.permissionId));
  }

  // Clear existing mappings to avoid unique constraint violations
  await prisma.rolePermission.deleteMany();

  // Bulk insert all mappings
  await prisma.rolePermission.createMany({
    data: rolePermMappings,
    skipDuplicates: true
  });

  console.log(`Seeded ${ROLES.length} roles and their permission mappings.`);

  // 3. Seed Platform Operator Users
  const defaultOperatorPasswordHash = await bcrypt.hash('Password@123!', 10);
  const superAdminPasswordHash = await bcrypt.hash('SuperAdmin@123!', 10);

  const superAdminRole = roleMap.get('SUPER_ADMIN')!;
  const supportOperatorRole = roleMap.get('SUPPORT_OPERATOR') || superAdminRole;
  const billingSpecialistRole = roleMap.get('BILLING_SPECIALIST') || superAdminRole;
  const securityAuditorRole = roleMap.get('SECURITY_AUDITOR') || superAdminRole;

  await prisma.user.upsert({
    where: { email: 'superadmin@digiflex.com' },
    update: {},
    create: {
      userType: UserType.PLATFORM,
      fullName: '  Super Admin',
      email: 'superadmin@digiflex.com',
      mobilePhone: '+91 9999900000',
      passwordHash: superAdminPasswordHash,
      status: UserStatus.ACTIVE,
      roles: {
        create: {
          roleId: superAdminRole,
        },
      },
      scopes: {
        create: {
          scopeType: ScopeType.PLATFORM,
        },
      },
    },
  });

  // 4. Seed Sample Tenant Credential (NO SALON_ADMIN User record - Tenant itself is the principal)
  const defaultTenantId = 'a0000000-0000-0000-0000-000000000001';
  const defaultBranchId = 'b0000000-0000-0000-0000-000000000001';
  const tenantPasswordHash = await bcrypt.hash('SalonAdmin@123!', 10);

  await prisma.tenantCredential.upsert({
    where: { normalizedEmail: 'owner@glamour-salon.com' },
    update: {
      passwordHash: tenantPasswordHash,
      status: 'ACTIVE',
    },
    create: {
      tenantId: defaultTenantId,
      loginEmail: 'owner@glamour-salon.com',
      normalizedEmail: 'owner@glamour-salon.com',
      mobilePhone: '+91 9888800000',
      passwordHash: tenantPasswordHash,
      status: 'ACTIVE',
      isMfaRequired: false,
      isMfaEnabled: false,
    },
  });

  // 5. Seed Sample Branch Manager User
  const branchManagerRole = roleMap.get('BRANCH_MANAGER')!;
  const inventoryManagerRole = roleMap.get('INVENTORY_MANAGER') || branchManagerRole;
  const financeHrRole = roleMap.get('FINANCE_HR') || branchManagerRole;
  const callCenterRole = roleMap.get('CALL_CENTER_AGENT') || branchManagerRole;
  const stylistRole = roleMap.get('STYLIST') || branchManagerRole;

  const staffPasswordHash = await bcrypt.hash('SuperAdmin@123!', 10);

  // Branch Manager
  await prisma.user.upsert({
    where: { email: 'manager@glamour-salon.com' },
    update: {
      passwordHash: staffPasswordHash,
    },
    create: {
      userType: UserType.TENANT,
      fullName: 'Koramangala Branch Manager',
      email: 'manager@glamour-salon.com',
      mobilePhone: '+91 9777700000',
      passwordHash: staffPasswordHash,
      status: UserStatus.ACTIVE,
      roles: {
        create: {
          roleId: branchManagerRole,
        },
      },
      scopes: {
        create: {
          scopeType: ScopeType.BRANCH,
          tenantId: defaultTenantId,
          branchId: defaultBranchId,
        },
      },
    },
  });

  // 6. Seed Inventory Controller / Storekeeper Lead (Vikram Kulkarni)
  const inventoryEmails = ['inventory@gmail.com', 'inventory@salon.com', 'inventory@glamour-salon.com'];
  for (const invEmail of inventoryEmails) {
    await prisma.user.upsert({
      where: { email: invEmail },
      update: {
        fullName: 'Vikram Kulkarni',
        passwordHash: staffPasswordHash,
        status: UserStatus.ACTIVE,
      },
      create: {
        userType: UserType.TENANT,
        fullName: 'Vikram Kulkarni',
        email: invEmail,
        mobilePhone: '+91 98201 99882',
        passwordHash: staffPasswordHash,
        status: UserStatus.ACTIVE,
        roles: {
          create: {
            roleId: inventoryManagerRole,
          },
        },
        scopes: {
          create: {
            scopeType: ScopeType.BRANCH,
            tenantId: defaultTenantId,
            branchId: defaultBranchId,
          },
        },
      },
    });
  }

  // 7. Seed Finance & HR Specialist (Rohit Sharma)
  const financeEmails = ['finance@gmail.com', 'finance@salon.com', 'finance@glamour-salon.com'];
  for (const finEmail of financeEmails) {
    await prisma.user.upsert({
      where: { email: finEmail },
      update: {
        fullName: 'Rohit Sharma',
        passwordHash: staffPasswordHash,
        status: UserStatus.ACTIVE,
      },
      create: {
        userType: UserType.TENANT,
        fullName: 'Rohit Sharma',
        email: finEmail,
        mobilePhone: '+91 98201 99883',
        passwordHash: staffPasswordHash,
        status: UserStatus.ACTIVE,
        roles: {
          create: {
            roleId: financeHrRole,
          },
        },
        scopes: {
          create: {
            scopeType: ScopeType.BRANCH,
            tenantId: defaultTenantId,
            branchId: defaultBranchId,
          },
        },
      },
    });
  }

  // 8. Seed Call Center Agent (Ananya Deshmukh)
  const agentEmails = ['agent@gmail.com', 'agent@salon.com', 'agent@glamour-salon.com'];
  for (const agEmail of agentEmails) {
    await prisma.user.upsert({
      where: { email: agEmail },
      update: {
        fullName: 'Ananya Deshmukh',
        passwordHash: staffPasswordHash,
        status: UserStatus.ACTIVE,
      },
      create: {
        userType: UserType.TENANT,
        fullName: 'Ananya Deshmukh',
        email: agEmail,
        mobilePhone: '+91 98201 99884',
        passwordHash: staffPasswordHash,
        status: UserStatus.ACTIVE,
        roles: {
          create: {
            roleId: callCenterRole,
          },
        },
        scopes: {
          create: {
            scopeType: ScopeType.BRANCH,
            tenantId: defaultTenantId,
            branchId: defaultBranchId,
          },
        },
      },
    });
  }

  // 9. Seed Stylist (Priya Sharma)
  const stylistEmails = ['stylist@gmail.com', 'stylist@salon.com', 'stylist@glamour-salon.com'];
  for (const stEmail of stylistEmails) {
    await prisma.user.upsert({
      where: { email: stEmail },
      update: {
        fullName: 'Priya Sharma',
        passwordHash: staffPasswordHash,
        status: UserStatus.ACTIVE,
      },
      create: {
        userType: UserType.TENANT,
        fullName: 'Priya Sharma',
        email: stEmail,
        mobilePhone: '+91 98201 99885',
        passwordHash: staffPasswordHash,
        status: UserStatus.ACTIVE,
        roles: {
          create: {
            roleId: stylistRole,
          },
        },
        scopes: {
          create: {
            scopeType: ScopeType.BRANCH,
            tenantId: defaultTenantId,
            branchId: defaultBranchId,
          },
        },
      },
    });
  }


  const allPlatformUsers = await prisma.user.findMany({
    where: { userType: UserType.PLATFORM },
  });
  for (const pUser of allPlatformUsers) {
    const existingRoles = await prisma.userRole.findMany({
      where: { userId: pUser.id },
    });
    if (existingRoles.length === 0) {
      await prisma.userRole.create({
        data: {
          userId: pUser.id,
          roleId: superAdminRole,
        },
      });
      console.log(`Attached SUPER_ADMIN role to platform user: ${pUser.email}`);
    }
  }

  console.log('Identity Service seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
