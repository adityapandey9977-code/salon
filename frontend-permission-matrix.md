# Frontend Panel/Module/Route Permission Matrix

## Executive Summary

Based on audit of the current frontend system, this matrix maps the existing 9 role-based panels to their modules, routes, sidebar items, and required permissions for the new RBAC implementation.

## Current Panel Architecture

The system has **9 distinct role-based panels** with path-based routing:

1. `/super-admin` - Platform operators
2. `/admin` - Salon owners/administrators  
3. `/branch-manager` - Branch/location managers
4. `/stylist` - Service providers
5. `/call-center` - Customer support agents
6. `/inventory` - Stock/warehouse managers
7. `/finance` - Finance controllers
8. `/franchise` - Franchise partners
9. `/client` - Customer-facing portal

## Detailed Permission Matrix

### 1. SUPER ADMIN PANEL (`/super-admin`)

**Current Roles**: SUPER_ADMIN, SUPPORT_OPERATOR, BILLING_SPECIALIST, SECURITY_AUDITOR

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/super-admin/` | Dashboard | Role: SUPER_ADMIN | `panel.super_admin.access` |
| Tenant Management | `/super-admin/tenants` | Tenants | Role: SUPER_ADMIN | `platform.tenant.read` |
| Tenant Creation | `/super-admin/tenants/new` | - | Role: SUPER_ADMIN | `platform.tenant.create` |
| Subscription Management | `/super-admin/subscriptions` | Subscriptions | Role: SUPER_ADMIN | `platform.subscription.read` |
| Platform Analytics | `/super-admin/analytics` | Analytics | Role: SUPER_ADMIN | `platform.analytics.read` |
| System Settings | `/super-admin/settings` | Settings | Role: SUPER_ADMIN | `platform.settings.manage` |
| Platform Audit | `/super-admin/audit` | Audit Logs | Role: SUPER_ADMIN | `platform.audit.read` |

### 2. ADMIN PANEL (`/admin`)

**Current Roles**: SALON_ADMIN, TENANT_ADMIN

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/admin/` | Dashboard | Role: SALON_ADMIN | `panel.admin.access` |
| **CORE - Locations** |
| Branch Directory | `/admin/locations` | Locations | Role: SALON_ADMIN | `branch.read` |
| Branch Performance | `/admin/locations/performance` | - | Role: SALON_ADMIN | `branch.analytics.read` |
| Branch Comparison | `/admin/locations/comparison` | - | Role: SALON_ADMIN | `branch.analytics.read` |
| Working Hours | `/admin/locations/working-hours` | - | Role: SALON_ADMIN | `branch.settings.manage` |
| Holidays Config | `/admin/locations/holidays` | - | Role: SALON_ADMIN | `branch.settings.manage` |
| Create Branch | `/admin/locations/new` | - | Role: SALON_ADMIN | `branch.create` |
| Branch Details | `/admin/locations/:id` | - | Role: SALON_ADMIN | `branch.read` |
| **BUSINESS - Catalogue** |
| Service Catalogue | `/admin/catalogue` | Services & Pricing | Role: SALON_ADMIN | `service.read` |
| Service Categories | `/admin/catalogue/categories` | - | Role: SALON_ADMIN | `service.category.manage` |
| Service Management | `/admin/catalogue/services` | - | Role: SALON_ADMIN | `service.manage` |
| Pricing Management | `/admin/catalogue/pricing` | - | Role: SALON_ADMIN | `service.pricing.manage` |
| Skills Management | `/admin/catalogue/skills` | - | Role: SALON_ADMIN | `service.skills.manage` |
| Resource Management | `/admin/catalogue/resources` | - | Role: SALON_ADMIN | `branch.resource.manage` |
| **BUSINESS - Clients** |
| Client Directory | `/admin/clients` | Clients | Role: SALON_ADMIN | `customer.read` |
| Client Segments | `/admin/clients/segments` | - | Role: SALON_ADMIN | `customer.analytics.read` |
| Client Retention | `/admin/clients/retention` | - | Role: SALON_ADMIN | `customer.analytics.read` |
| Inactive Clients | `/admin/clients/inactive` | - | Role: SALON_ADMIN | `customer.read` |
| Client Feedback | `/admin/clients/feedback` | - | Role: SALON_ADMIN | `customer.feedback.read` |
| Support Tickets | `/admin/clients/tickets` | - | Role: SALON_ADMIN | `customer.support.read` |
| Client Profile | `/admin/clients/:id` | - | Role: SALON_ADMIN | `customer.read` |
| **BUSINESS - Staff** |
| Staff Directory | `/admin/staff` | Staff | Role: SALON_ADMIN | `staff.read` |
| Staff Performance | `/admin/staff/performance` | - | Role: SALON_ADMIN | `staff.analytics.read` |
| Staff Roster | `/admin/staff/roster` | - | Role: SALON_ADMIN | `staff.roster.read` |
| Staff Attendance | `/admin/staff/attendance` | - | Role: SALON_ADMIN | `staff.attendance.read` |
| Staff Targets | `/admin/staff/targets` | - | Role: SALON_ADMIN | `staff.targets.read` |
| Staff Commission | `/admin/staff/commission` | - | Role: SALON_ADMIN | `staff.commission.read` |
| Staff Productivity | `/admin/staff/productivity` | - | Role: SALON_ADMIN | `staff.analytics.read` |
| Staff Profile | `/admin/staff/:id` | - | Role: SALON_ADMIN | `staff.read` |
| **BUSINESS - Operations** |
| Operations Dashboard | `/admin/operations` | Operations | Role: SALON_ADMIN | `appointment.read` |
| Appointments Calendar | `/admin/operations/appointments` | - | Role: SALON_ADMIN | `appointment.read` |
| Queue Management | `/admin/operations/queue` | - | Role: SALON_ADMIN | `appointment.queue.read` |
| Availability Management | `/admin/operations/availability` | - | Role: SALON_ADMIN | `appointment.availability.manage` |
| Home Service | `/admin/operations/homeservice` | - | Role: SALON_ADMIN | `appointment.homeservice.read` |
| **COMMERCIAL - Packages** |
| Packages & Memberships | `/admin/packages-memberships` | Packages | Role: SALON_ADMIN | `package.read` |
| Package Management | `/admin/packages-memberships/packages` | - | Role: SALON_ADMIN | `package.manage` |
| Package Usage | `/admin/packages-memberships/usage` | - | Role: SALON_ADMIN | `package.analytics.read` |
| Membership Management | `/admin/packages-memberships/memberships` | - | Role: SALON_ADMIN | `membership.manage` |
| Membership Benefits | `/admin/packages-memberships/benefits` | - | Role: SALON_ADMIN | `membership.benefits.manage` |
| Membership Renewals | `/admin/packages-memberships/renewals` | - | Role: SALON_ADMIN | `membership.renewals.read` |
| **COMMERCIAL - Finance** |
| Finance Overview | `/admin/finance` | Finance | Role: SALON_ADMIN | `finance.read` |
| Revenue Collections | `/admin/finance/revenue-collections` | - | Role: SALON_ADMIN | `finance.revenue.read` |
| Transactions | `/admin/finance/transactions` | - | Role: SALON_ADMIN | `finance.transaction.read` |
| Refunds | `/admin/finance/refunds` | - | Role: SALON_ADMIN | `finance.refund.read` |
| Staff Commissions | `/admin/finance/commissions` | - | Role: SALON_ADMIN | `finance.commission.read` |
| Financial Settlements | `/admin/finance/settlements` | - | Role: SALON_ADMIN | `finance.settlement.read` |
| Profitability | `/admin/finance/profitability` | - | Role: SALON_ADMIN | `finance.analytics.read` |
| Tax Management | `/admin/finance/tax` | - | Role: SALON_ADMIN | `finance.tax.read` |
| Financial Alerts | `/admin/finance/alerts` | - | Role: SALON_ADMIN | `finance.alerts.read` |
| Financial Reports | `/admin/finance/reports` | - | Role: SALON_ADMIN | `finance.reports.read` |
| **COMMERCIAL - Inventory** |
| Inventory Overview | `/admin/inventory` | Inventory | Role: SALON_ADMIN | `inventory.read` |
| Product Catalogue | `/admin/inventory/products` | - | Role: SALON_ADMIN | `inventory.product.read` |
| Stock Levels | `/admin/inventory/stock` | - | Role: SALON_ADMIN | `inventory.stock.read` |
| Procurement | `/admin/inventory/procurement` | - | Role: SALON_ADMIN | `inventory.procurement.read` |
| Stock Transfers | `/admin/inventory/transfers` | - | Role: SALON_ADMIN | `inventory.transfer.read` |
| Stock Consumption | `/admin/inventory/consumption` | - | Role: SALON_ADMIN | `inventory.consumption.read` |
| Stock Audits | `/admin/inventory/stocktake` | - | Role: SALON_ADMIN | `inventory.audit.read` |
| Inventory Reports | `/admin/inventory/reports` | - | Role: SALON_ADMIN | `inventory.reports.read` |
| **MARKETING** |
| Marketing Overview | `/admin/marketing` | Marketing | Role: SALON_ADMIN | `marketing.read` |
| Campaign Management | `/admin/marketing/campaigns` | - | Role: SALON_ADMIN | `marketing.campaign.read` |
| Promotions | `/admin/marketing/promotions` | - | Role: SALON_ADMIN | `marketing.promotion.read` |
| Loyalty Programs | `/admin/marketing/loyalty` | - | Role: SALON_ADMIN | `marketing.loyalty.read` |
| Marketing Reports | `/admin/marketing/reports` | - | Role: SALON_ADMIN | `marketing.reports.read` |
| **FRANCHISE** |
| Franchise Overview | `/admin/franchise` | Franchise | Role: SALON_ADMIN | `franchise.read` |
| Franchise Partners | `/admin/franchise/partners` | - | Role: SALON_ADMIN | `franchise.partner.read` |
| Franchise Locations | `/admin/franchise/locations` | - | Role: SALON_ADMIN | `franchise.location.read` |
| Franchise Agreements | `/admin/franchise/agreements` | - | Role: SALON_ADMIN | `franchise.agreement.read` |
| Franchise Royalties | `/admin/franchise/royalties` | - | Role: SALON_ADMIN | `franchise.royalty.read` |
| Franchise Reports | `/admin/franchise/reports` | - | Role: SALON_ADMIN | `franchise.reports.read` |
| **ANALYTICS** |
| Reports Overview | `/admin/reports` | Reports | Role: SALON_ADMIN | `report.read` |
| Operations Reports | `/admin/reports/operations` | - | Role: SALON_ADMIN | `report.operations.read` |
| Revenue Reports | `/admin/reports/revenue` | - | Role: SALON_ADMIN | `report.revenue.read` |
| Staff Reports | `/admin/reports/staff` | - | Role: SALON_ADMIN | `report.staff.read` |
| Client Reports | `/admin/reports/clients` | - | Role: SALON_ADMIN | `report.client.read` |
| Inventory Reports | `/admin/reports/inventory` | - | Role: SALON_ADMIN | `report.inventory.read` |
| Marketing Reports | `/admin/reports/marketing` | - | Role: SALON_ADMIN | `report.marketing.read` |
| Franchise Reports | `/admin/reports/franchise` | - | Role: SALON_ADMIN | `report.franchise.read` |
| Custom Reports | `/admin/reports/custom` | - | Role: SALON_ADMIN | `report.custom.read` |
| **ADMINISTRATION** |
| Brand Settings | `/admin/settings` | Settings | Role: SALON_ADMIN | `settings.read` |
| Brand Profile | `/admin/settings/profile` | - | Role: SALON_ADMIN | `settings.profile.manage` |
| Location Settings | `/admin/settings/locations` | - | Role: SALON_ADMIN | `settings.location.manage` |
| Pricing Policies | `/admin/settings/pricing` | - | Role: SALON_ADMIN | `settings.pricing.manage` |
| Business Policies | `/admin/settings/policies` | - | Role: SALON_ADMIN | `settings.policy.manage` |
| Operating Hours | `/admin/settings/hours` | - | Role: SALON_ADMIN | `settings.hours.manage` |
| Role Management | `/admin/settings/roles` | - | Role: SALON_ADMIN | `settings.roles.manage` |
| Access Controls | `/admin/settings/controls` | - | Role: SALON_ADMIN | `settings.access.manage` |
| Audit Settings | `/admin/settings/audit` | - | Role: SALON_ADMIN | `settings.audit.read` |
| Roles & Permissions | `/admin/roles-permissions` | Roles | Role: SALON_ADMIN | `role.read` |
| Role Matrix | `/admin/roles-permissions/matrix` | - | Role: SALON_ADMIN | `role.permissions.read` |
| Role Assignments | `/admin/roles-permissions/assignments` | - | Role: SALON_ADMIN | `role.assignment.read` |
| Assignment History | `/admin/roles-permissions/history` | - | Role: SALON_ADMIN | `role.history.read` |
| System Audit | `/admin/audit-logs` | Audit Logs | Role: SALON_ADMIN | `audit.read` |
| Notifications | `/admin/notifications` | Notifications | Role: SALON_ADMIN | `notification.read` |

### 3. BRANCH MANAGER PANEL (`/branch-manager`)

**Current Roles**: BRANCH_MANAGER

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/branch-manager/` | Dashboard | Role: BRANCH_MANAGER | `panel.branch.access` |
| **Operations Dropdown** |
| Appointments Diary | `/branch-manager/appointments` | Appointments | Role: BRANCH_MANAGER | `appointment.read` |
| Walk-ins Queue | `/branch-manager/walk-ins` | Walk-ins | Role: BRANCH_MANAGER | `appointment.walkin.read` |
| **Clients & Team Dropdown** |
| Client Profiles | `/branch-manager/customers` | Customers | Role: BRANCH_MANAGER | `customer.read` |
| Staff Roster | `/branch-manager/team` | Team | Role: BRANCH_MANAGER | `staff.read` |
| Services Menu | `/branch-manager/services` | Services | Role: BRANCH_MANAGER | `service.read` |
| **POS & Commercial Dropdown** |
| New POS Checkout | `/branch-manager/payments/new-invoice` | New Invoice | Role: BRANCH_MANAGER | `invoice.create` |
| Payment History | `/branch-manager/payments` | Payments | Role: BRANCH_MANAGER | `payment.read` |
| Retail Inventory | `/branch-manager/retail` | Retail | Role: BRANCH_MANAGER | `inventory.retail.read` |
| Shift Closure | `/branch-manager/payments` | - | Role: BRANCH_MANAGER | `payment.shift.close` |
| **Analytics & Settings** |
| Reports & Analytics | `/branch-manager/reports` | Reports | Role: BRANCH_MANAGER | `report.branch.read` |
| Branch Settings | `/branch-manager/settings` | Settings | Role: BRANCH_MANAGER | `branch.settings.read` |
| Audit Logs | `/branch-manager/audit-logs` | - | Role: BRANCH_MANAGER | `audit.branch.read` |

### 4. STYLIST PANEL (`/stylist`)

**Current Roles**: STYLIST, STYLIST_THERAPIST

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/stylist/` | Dashboard | Role: STYLIST | `panel.stylist.access` |
| My Schedule | `/stylist/schedule` | Schedule | Role: STYLIST | `appointment.self.read` |
| My Clients | `/stylist/clients` | Clients | Role: STYLIST | `customer.self.read` |
| Service Notes | `/stylist/notes` | Notes | Role: STYLIST | `service.notes.read` |
| My Performance | `/stylist/performance` | Performance | Role: STYLIST | `performance.self.read` |
| Commission Tracker | `/stylist/commission` | Commission | Role: STYLIST | `commission.self.read` |
| Profile Settings | `/stylist/profile` | Profile | Role: STYLIST | `profile.self.manage` |

### 5. CALL CENTER PANEL (`/call-center`)

**Current Roles**: CALL_CENTER_AGENT

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/call-center/` | Dashboard | Role: CALL_CENTER_AGENT | `panel.call_center.access` |
| Multi-Branch Booking | `/call-center/booking` | Booking | Role: CALL_CENTER_AGENT | `appointment.create` |
| Client Lookup | `/call-center/clients` | Clients | Role: CALL_CENTER_AGENT | `customer.read` |
| Appointment Management | `/call-center/appointments` | Appointments | Role: CALL_CENTER_AGENT | `appointment.manage` |
| Call History | `/call-center/calls` | Calls | Role: CALL_CENTER_AGENT | `call.history.read` |
| Performance Metrics | `/call-center/metrics` | Metrics | Role: CALL_CENTER_AGENT | `performance.self.read` |

### 6. INVENTORY PANEL (`/inventory`)

**Current Roles**: INVENTORY_MANAGER, INVENTORY_USER

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/inventory/` | Dashboard | Role: INVENTORY_MANAGER | `panel.inventory.access` |
| Product Catalogue | `/inventory/products` | Products | Role: INVENTORY_MANAGER | `inventory.product.read` |
| Stock Levels | `/inventory/stock` | Stock | Role: INVENTORY_MANAGER | `inventory.stock.read` |
| Purchase Orders | `/inventory/procurement` | Procurement | Role: INVENTORY_MANAGER | `inventory.procurement.read` |
| Stock Transfers | `/inventory/transfers` | Transfers | Role: INVENTORY_MANAGER | `inventory.transfer.read` |
| Stock Audits | `/inventory/audits` | Audits | Role: INVENTORY_MANAGER | `inventory.audit.read` |
| Supplier Management | `/inventory/suppliers` | Suppliers | Role: INVENTORY_MANAGER | `inventory.supplier.read` |
| Reports | `/inventory/reports` | Reports | Role: INVENTORY_MANAGER | `inventory.reports.read` |

### 7. FINANCE PANEL (`/finance`)

**Current Roles**: FINANCE_HR, FINANCE_CONTROLLER

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/finance/` | Dashboard | Role: FINANCE_HR | `panel.finance.access` |
| Revenue Overview | `/finance/revenue` | Revenue | Role: FINANCE_HR | `finance.revenue.read` |
| Transaction History | `/finance/transactions` | Transactions | Role: FINANCE_HR | `finance.transaction.read` |
| Commission Management | `/finance/commissions` | Commissions | Role: FINANCE_HR | `finance.commission.read` |
| Payroll Management | `/finance/payroll` | Payroll | Role: FINANCE_HR | `finance.payroll.read` |
| Tax & GST | `/finance/tax` | Tax & GST | Role: FINANCE_HR | `finance.tax.read` |
| Financial Reports | `/finance/reports` | Reports | Role: FINANCE_HR | `finance.reports.read` |
| Audit & Compliance | `/finance/audit` | Audit | Role: FINANCE_HR | `finance.audit.read` |

### 8. FRANCHISE PANEL (`/franchise`)

**Current Roles**: FRANCHISE_OWNER, FRANCHISE_PARTNER

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/franchise/` | Dashboard | Role: FRANCHISE_OWNER | `panel.franchise.access` |
| My Branches | `/franchise/branches` | Branches | Role: FRANCHISE_OWNER | `franchise.branch.read` |
| Performance Analytics | `/franchise/analytics` | Analytics | Role: FRANCHISE_OWNER | `franchise.analytics.read` |
| Royalty Statements | `/franchise/royalties` | Royalties | Role: FRANCHISE_OWNER | `franchise.royalty.read` |
| Agreement Details | `/franchise/agreements` | Agreements | Role: FRANCHISE_OWNER | `franchise.agreement.read` |
| Support Center | `/franchise/support` | Support | Role: FRANCHISE_OWNER | `franchise.support.read` |

### 9. CLIENT PANEL (`/client`)

**Current Roles**: CUSTOMER

| Module | Route | Sidebar Item | Current Guard | Required Permission |
|--------|--------|--------------|---------------|-------------------|
| Dashboard | `/client/` | Dashboard | Role: CUSTOMER | `panel.client.access` |
| Book Appointment | `/client/booking` | Book | Role: CUSTOMER | `appointment.self.create` |
| My Appointments | `/client/appointments` | Appointments | Role: CUSTOMER | `appointment.self.read` |
| My Profile | `/client/profile` | Profile | Role: CUSTOMER | `profile.self.manage` |
| Wallet & Rewards | `/client/wallet` | Wallet | Role: CUSTOMER | `wallet.self.read` |
| Purchase History | `/client/history` | History | Role: CUSTOMER | `purchase.self.read` |
| Feedback & Reviews | `/client/feedback` | Feedback | Role: CUSTOMER | `feedback.self.manage` |

## Current Authentication Patterns

### Role-Based Guards
```typescript
// Current hardcoded role checks
if (user.roles.some(r => r.code === 'BRANCH_MANAGER')) {
  // Show branch manager content
}

// Existing permission infrastructure
const hasPermission = (permissionCode: string) => {
  if (!user) return false;
  const isSuper = user.roles.some(r => r.code === 'SUPER_ADMIN');
  if (isSuper) return true;
  return Boolean(user.permissions?.includes(permissionCode));
};
```

### Route Protection
```typescript
<ProtectedRoute allowedRoles={['SALON_ADMIN', 'SUPER_ADMIN']} />
```

## Staff ID Authentication Requirements

### Current Login Flow
- `/login` - General login with email + password + optional tenantId
- `/super-admin-login` - Platform login  
- Quick role credentials for demo (Super Admin, Salon Owner, Branch Manager)

### Required Staff Login Enhancement
- **New Route**: `/staff-login` - Staff ID + Password authentication
- **Staff ID Format**: `EMP00124`, `BR001` (employeeCode from People service)
- **Tenant Resolution**: Via custom domain or tenant selection
- **Redirect Logic**: Based on effective permissions → appropriate panel

## Permission Cataloguing Strategy

### Panel-Level Permissions
```
panel.super_admin.access
panel.admin.access  
panel.branch.access
panel.stylist.access
panel.call_center.access
panel.inventory.access
panel.finance.access
panel.franchise.access
panel.client.access
```

### Module-Level Permissions
```
dashboard.read
appointment.read / create / update / cancel
customer.read / create / update
staff.read / manage
inventory.read / manage  
finance.read
report.read
settings.read
```

### Action-Level Permissions
```
appointment.create
appointment.update
appointment.cancel
staff.create
staff.edit
staff.delete
branch.create
invoice.create
payment.process
```

## Implementation Priority

### Phase 1: Core RBAC Backend
1. System vs Custom role differentiation in Identity service
2. Permission catalogue implementation
3. Staff ID authentication endpoint
4. Effective permission calculation with Redis caching

### Phase 2: Staff Management Enhancement  
1. Role selection in StaffFormModal
2. Branch manager assignment in branch forms
3. Staff creation API integration with role/branch assignment

### Phase 3: Frontend Permission Guards
1. Replace hardcoded role checks with `can(permission)` calls
2. Add route-level permission guards
3. Implement sidebar/menu permission filtering
4. Add action-level permission guards (buttons, tabs, etc.)

### Phase 4: Staff Login & Branch Scoping
1. Staff login page (`/staff-login`)
2. Staff ID + password authentication flow
3. Branch scope enforcement in Branch Manager panel
4. API-level branch scoping validation

## Security Considerations

### Multi-Tenant Isolation
- All permissions must be scoped by `tenantId`
- Branch-level permissions must validate branch ownership
- Custom roles must be tenant-isolated

### Branch Scoping
- BRANCH_MANAGER role must enforce `branchIds` scope
- API calls must validate branch access from JWT context
- Frontend branch selectors must be scoped to authorized branches

### Permission Inheritance  
- SUPER_ADMIN bypasses all permission checks
- System roles have global permission templates
- Custom roles allow tenant-specific permission customization

This matrix provides the foundation for implementing the comprehensive RBAC system while preserving the existing user experience and panel structure.