#   Salon SaaS · Super-Admin Frontend UI & Integration Specification

> **Document Version**: `1.0.0`  
> **Source Directory**: `apps/web/src/modules/super-admin`  
> **Design System**: `@salon-spa-saas/ui` (Glassmorphism, Inter & Serif Typography, Tailwind CSS)  
> **State Management**: `SuperAdminContext.tsx` + Microservice API Client Gateways  

---

## 1. Frontend Architecture & Directory Layout

The `super-admin` frontend is an enterprise dashboard module designed for SaaS platform administrators to manage multi-tenant salons, roles, billing, announcements, feature flags, API integrations, and support operations.

### Directory Structure Blueprint

```
apps/web/src/modules/super-admin/
├── app/
│   └── App.tsx                       # Main Module Entry & Router Component
├── main.tsx                           # Standalone Mount Entry point
├── context/
│   └── SuperAdminContext.tsx          # Centralized Global State & API Store
├── layouts/
│   └── Sidebar/                       # Navigation Drawer with Active Route Highlights
├── components/                        # UI Modals, KPI Charts & Shared Widgets (21 files)
│   ├── BaseModal.tsx                  # Standard Modal Container Wrapper
│   ├── DashboardCharts.tsx            # Recharts Analytics Telemetry Widgets
│   ├── ProvisionTenantModal.tsx       # 3-Tab Tenant & Salon Provisioning Form
│   ├── WhiteLabelSettingsModal.tsx    # CNAME Branding & Custom Theme Form
│   ├── CreateAdminUserModal.tsx       # Operator Profile & MFA Form
│   ├── CreateCustomRoleModal.tsx      # RBAC Scopes & Permission Grid Form
│   ├── SubscriptionPlanModal.tsx      # Tier Pricing & Feature Quota Form
│   ├── CreateInvoiceModal.tsx         # Invoicing & Billing Cycle Form
│   ├── CreateAnnouncementModal.tsx    # Broadcast Advisory Dispatch Form
│   ├── SimulateNotificationModal.tsx  # Push/SMS Channel Test Simulator
│   ├── CreateFeatureFlagModal.tsx     # Feature Toggle & AB Test Form
│   ├── ManageRolloutModal.tsx         # Progressive Percentage Rollout Form
│   ├── GenerateApiKeyModal.tsx        # Developer API Key Provisioning Form
│   ├── ConfigureIntegrationModal.tsx  # External SaaS POS Integration Form
│   ├── SalonDetailsModal.tsx          # Tenant Deep Inspection Modal
│   ├── UserDetailsModal.tsx           # Admin User Detail Inspector
│   ├── AnnouncementDetailsModal.tsx   # Broadcast Advisory Inspector
│   ├── InspectAuditTraceModal.tsx     # IP & Callstack Audit Log Inspector
│   ├── InspectNotificationModal.tsx   # Notification Delivery Log Inspector
│   ├── InspectTicketModal.tsx         # Support Ticket Conversation Inspector
│   └── ProvisionSalonModal.tsx        # Branch Unit Provisioning Modal
├── pages/                             # 16 Full Page View Views
│   ├── DashboardPage.tsx              # Executive KPIs & MRR Telemetry
│   ├── SalonsPage.tsx                 # Salons / Tenants Roster & CNAME Status
│   ├── AddSalonPage.tsx               # Direct Salon Onboarding Page
│   ├── AddFranchisePartnerPage.tsx    # Multi-Branch Franchise Grouping Page
│   ├── UsersPage.tsx                  # Admin Operators Directory & MFA Status
│   ├── RolesPermissionsPage.tsx       # Global RBAC Role Scopes Matrix
│   ├── SubscriptionPlansPage.tsx      # SaaS Tier Plans & Subscriber Counts
│   ├── BillingPaymentsPage.tsx        # Invoice History & Payment Telemetry
│   ├── AnnouncementsPage.tsx          # Platform Announcements Roster
│   ├── NotificationsPage.tsx          # Push & Email Notification Logs
│   ├── AuditLogsPage.tsx              # System Audit Trail & Geolocation Logs
│   ├── FeatureFlagsPage.tsx           # Dynamic Flags & Kill-Switches
│   ├── IntegrationsPage.tsx           # External Third-Party SaaS Connectors
│   ├── ApiKeysPage.tsx                # Developer API Gateway Key Directory
│   ├── SupportTicketsPage.tsx         # Multi-Tenant Support Desk & SLA Matrix
│   └── SettingsPage.tsx               # Global SaaS Configuration & White-Labeling
└── utils/
    └── pdfGenerator.ts                # PDF Walkthrough & Report Generator (jsPDF + html2canvas)
```

---

## 2. Integration Architecture (Where & How It Integrates)

The frontend integrates across 4 primary layers:

```
+-----------------------------------------------------------------------------------+
|                            Super Admin Frontend UI Layer                          |
|                       (React 18 + Tailwind + Lucide Icons)                       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        State Store (`SuperAdminContext.tsx`)                       |
|           - In-Memory Reactive State (`tenants[]`, `users[]`, `plans[]`)          |
|           - Dynamic Filtering & Variance Calculations                            |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                            Microservices API Client Layer                         |
|  - tenantApi.ts      - iamApi.ts       - billingApi.ts       - notificationApi.ts  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                          API Gateway (Port 4000 - Kong/Envoy)                     |
|            - HTTPS Route Proxy   - JWT Authentication   - Rate Limiting           |
+-----------------------------------------------------------------------------------+
```

1. **State Store Integration (`SuperAdminContext.tsx`)**:
   - Manages state for `tenants`, `users`, `roles`, `announcements`, `subscriptionPlans`, `invoices`.
   - Provides CRUD handlers (`addTenant`, `updateTenant`, `deleteTenant`, `addAdminUser`, etc.) that trigger UI re-renders and propagate API calls.
2. **Microservices API Gateway Integration**:
   - Connects to backend microservices via REST & gRPC proxies routed through `http://api-gateway:4000`.
   - Standard HTTP headers: `Authorization: Bearer <JWT>`, `X-Tenant-ID`, `X-Admin-Scope`.
3. **White-Labeling & Custom Theme Integration**:
   - Dynamically injects tenant CSS custom properties (`--primary-color`, logo URLs, custom CNAME domains) into root elements for white-labeled tenant dashboards.
4. **PDF Generator Integration (`pdfGenerator.ts`)**:
   - Uses `jspdf` and `html2canvas` to automatically render styled executive summaries, invoices, and PRD Traceability Walkthroughs.

---

## 3. Exhaustive Form Inventory & Field Specifications

Below is the complete breakdown of **all 12 Form Modals** in the `super-admin` module, detailing exact fields, types, options, defaults, and validation rules.

---

### Form 1: Tenant & Salon Provisioning Modal (`ProvisionTenantModal.tsx`)
- **Purpose**: Onboard new multi-tenant salon groups or edit existing salon accounts.
- **Total Fields**: 12 Fields across 3 Navigation Tabs.

| Tab | Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Basic Info** | Salon Group Name | `text` | Yes | `""` | e.g., "Blush & Bloom Salon Group" |
| **Basic Info** | Tenant Slug | `text` | No | Auto-generated from Name | e.g., `blush-bloom-salons` |
| **Basic Info** | Operating City | `select` | Yes | `"Bhopal"` | `Bhopal`, `Indore`, `Mumbai`, `Delhi`, `Bangalore` |
| **Basic Info** | Region / State | `text` | Yes | `"Central India"` | Region identifier |
| **Basic Info** | Subscription Tier | `select` | Yes | `"Enterprise Plan"` | `Enterprise Plan`, `Premium Plan`, `Standard Plan` |
| **Basic Info** | Initial Branch Count | `number` | Yes | `1` | Min: `1`, Max based on tier |
| **Owner Contact**| Owner Full Name | `text` | Yes | `""` | e.g., "Vikram Malhotra" |
| **Owner Contact**| Owner Email Address| `email` | Yes | `""` | Valid email string |
| **Owner Contact**| Owner Phone Number | `tel` | Yes | `""` | e.g., "+91 98765 43210" |
| **White-Label** | Custom CNAME Domain | `text` | No | `""` | Enabled via checkbox, e.g., `app.salon.com` |
| **White-Label** | Enable Custom Domain| `checkbox` | No | `false` | Toggles custom domain input visibility |
| **White-Label** | Primary Brand Color | `color` | Yes | `"#7C3AED"` | Hex color picker |

---

### Form 2: White-Label Settings Modal (`WhiteLabelSettingsModal.tsx`)
- **Purpose**: Configure custom domain CNAME records and brand color palette for a tenant.
- **Total Fields**: 5 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Custom CNAME Domain | `text` | Yes | Tenant domain | e.g., `booking.elegancespa.in` |
| Brand Primary Color | `color` | Yes | `"#7C3AED"` | Hex code picker |
| Brand Logo URL | `url` | No | `""` | HTTPS image URL |
| Enable Custom CNAME SSL| `checkbox` | No | `true` | Enforces Let's Encrypt SSL binding |
| White-Label Email Headers | `checkbox` | No | `true` | Uses tenant domain in outgoing email From headers |

---

### Form 3: Create Admin User Modal (`CreateAdminUserModal.tsx`)
- **Purpose**: Invite internal SaaS platform operators and assign RBAC role groups.
- **Total Fields**: 6 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Operator Full Name | `text` | Yes | `""` | e.g., "Ananya Shah" |
| Work Email Address | `email` | Yes | `""` | Must be unique valid email |
| Direct Phone Contact | `tel` | No | `""` | Phone format |
| Assigned Role Group | `select` | Yes | `"Support Operator"` | Dynamic options from `roles[]` in Context |
| Account Status | `select` | Yes | `"Active"` | `Active` (Dashboard Access), `Inactive` (Suspended) |
| Enforce MFA Security | `checkbox` | No | `true` | Requires TOTP MFA enrollment on first login |

---

### Form 4: Create Custom Role Scope Modal (`CreateCustomRoleModal.tsx`)
- **Purpose**: Define custom RBAC access scopes and module permission entitlements.
- **Total Fields**: 8 Fields (3 metadata + 5 module access checkboxes).

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Role Group Name | `text` | Yes | `""` | e.g., "Regional Support Manager" |
| Access Scope Level | `select` | Yes | `"Platform Wide"` | `Platform Wide`, `Designated Branch Only`, `Tenant Level`, `Individual Account` |
| Role Description | `textarea` | Yes | `""` | Detailed description of scope boundaries |
| Entitlement: Tenants | `checkbox` | No | `true` | Access to Tenants & Salons Roster |
| Entitlement: Billing | `checkbox` | No | `false` | Access to Invoices & SaaS Subscriptions |
| Entitlement: Audit Logs| `checkbox` | No | `false` | Access to System Audit Trails & Security Logs |
| Entitlement: Flags | `checkbox` | No | `false` | Access to Feature Flags & Integrations |
| Entitlement: RBAC | `checkbox` | No | `false` | Access to User Management & Role Creation |

---

### Form 5: Subscription Plan Modal (`SubscriptionPlanModal.tsx`)
- **Purpose**: Define or update SaaS tier pricing, branch limits, and feature toggles.
- **Total Fields**: 9 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Plan Tier Name | `text` | Yes | `""` | e.g., "Enterprise Plan", "Standard Plan" |
| Monthly Price (INR) | `number` | Yes | `0` | e.g., `4999` (Numeric format) |
| Max Branches Quota | `number` | Yes | `1` | Maximum salon branches allowed per tenant |
| Max Staff Quota | `number` | Yes | `10` | Maximum staff accounts allowed |
| Plan Status | `select` | Yes | `"Active"` | `Active`, `Archived` |
| Has Custom API Access| `checkbox` | No | `false` | Entitles developer API key generation |
| Has White-Labeling | `checkbox` | No | `false` | Entitles CNAME custom domain binding |
| Rollout Percentage | `range` / `number` | No | `100` | Percentage rollout slider (`0%` - `100%`) |
| Deployment Strategy | `select` | No | `"Immediate All"` | `Immediate All`, `Phased Rollout`, `Beta Opt-In` |

---

### Form 6: Create Invoice Modal (`CreateInvoiceModal.tsx`)
- **Purpose**: Issue manual invoices or record payments for a tenant salon.
- **Total Fields**: 5 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Invoice ID / Number | `text` | Yes | Auto-generated | e.g., `INV-2026-089` |
| Target Salon Group | `select` | Yes | First tenant | Populated from `tenants[]` in Context |
| Invoice Amount (INR) | `number` | Yes | `0` | e.g., `24500` |
| Payment Status | `select` | Yes | `"Pending"` | `Paid`, `Pending`, `Overdue` |
| Billing Cycle Period | `text` | Yes | `"Aug 2026"` | Month-Year billing descriptor |

---

### Form 7: Create Announcement Modal (`CreateAnnouncementModal.tsx`)
- **Purpose**: Broadcast platform-wide advisories, release notes, or maintenance alerts.
- **Total Fields**: 7 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Announcement Subject | `text` | Yes | `""` | e.g., "Scheduled Maintenance Alert Q3" |
| Target Audience Scope| `select` | Yes | `"All Tenants & Owners"` | `All Tenants & Owners`, `Branch Managers`, `Front Desk Staff`, `Stylists`, `Enterprise Tier` |
| Priority Severity Level| `select` | Yes | `"Info"` | `Info` (Release), `Warning` (Maintenance), `Critical` (Urgent Alert) |
| Broadcast Status | `select` | Yes | `"Active"` | `Active` (Live Banner), `Sent`, `Draft`, `Archived` |
| Delivery Channels | `checkboxes` | Yes | `["In-App Banner"]`| `In-App Banner`, `Email Push`, `SMS Alert` |
| Announcement Body | `textarea` | Yes | `""` | Rich text broadcast content |

---

### Form 8: Simulate Notification Modal (`SimulateNotificationModal.tsx`)
- **Purpose**: Test and simulate notification dispatches for verification before broadcasting.
- **Total Fields**: 5 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Recipient Email | `email` | Yes | `""` | Target test address |
| Channel Type | `select` | Yes | `"In-App Banner"` | `In-App Banner`, `Email Notification`, `SMS Gateway` |
| Category | `select` | Yes | `"System Alert"` | `System Alert`, `Billing Reminder`, `Feature Update` |
| Subject Header | `text` | Yes | `""` | Notification header string |
| Test Payload Body | `textarea` | Yes | `""` | JSON / Plain text test message |

---

### Form 9: Create Feature Flag Modal (`CreateFeatureFlagModal.tsx`)
- **Purpose**: Define dynamic system feature toggles and target environment rules.
- **Total Fields**: 7 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Flag Unique Key | `text` | Yes | `""` | Snake_case key, e.g., `enable_ai_scheduling` |
| Feature Name | `text` | Yes | `""` | Human readable title |
| Description | `textarea` | Yes | `""` | Feature scope & purpose |
| Initial State | `checkbox` / `toggle` | Yes | `false` | `Enabled` / `Disabled` |
| Environment Scope | `select` | Yes | `"Production"` | `Production`, `Staging`, `Development` |
| Target Rollout Strategy| `select` | Yes | `"Percentage Rollout"`| `Percentage Rollout`, `Target Whitelist`, `Global Toggle` |
| Target Percentage | `number` | No | `50` | Slider value `0` to `100` |

---

### Form 10: Manage Rollout Modal (`ManageRolloutModal.tsx`)
- **Purpose**: Adjust percentage rollout sliders for progressive plan releases or feature flags.
- **Total Fields**: 3 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Rollout Percentage | `range` (Slider) | Yes | Current value | `0%` to `100%` step `5` |
| Rollout Strategy | `select` | Yes | `"Phased Rollout"` | `Phased Rollout`, `Immediate All`, `Beta Opt-In` |
| Whitelisted Tenants | `multiselect` | No | `[]` | Selected specific tenant IDs |

---

### Form 11: Generate API Key Modal (`GenerateApiKeyModal.tsx`)
- **Purpose**: Provision hashed API keys for developer integration with rate-limiting rules.
- **Total Fields**: 5 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Key Name / Label | `text` | Yes | `""` | e.g., "Production Webhook Key - Branch 1" |
| Associated Tenant | `select` | Yes | First tenant | Select from `tenants[]` |
| API Access Scope | `select` | Yes | `"Full Read/Write"` | `Full Read/Write`, `Read Only`, `Appointments API Only` |
| Rate Limit (RPS) | `number` | Yes | `100` | Requests Per Second cap |
| Key Expiration Period| `select` | Yes | `"1 Year"` | `90 Days`, `180 Days`, `1 Year`, `Never Expires` |

---

### Form 12: Configure Integration Modal (`ConfigureIntegrationModal.tsx`)
- **Purpose**: Connect third-party SaaS integrations (WhatsApp Business API, Tally POS, Razorpay).
- **Total Fields**: 5 Fields.

| Field Name | Input Type | Required | Default Value | Options / Validation |
| :--- | :--- | :--- | :--- | :--- |
| Integration Provider | `text` | Yes | Selected provider | e.g., "WhatsApp Business API" |
| Integration Category| `select` | Yes | `"Communication"` | `Communication`, `Accounting`, `POS Terminal` |
| API Secret Key / Token| `password` | Yes | `""` | Masked secret key input |
| Webhook Target URL | `url` | No | `""` | Valid HTTPS URL |
| Auto-Sync Enabled | `checkbox` | No | `true` | Toggles automatic real-time data sync |

---

## 4. Visual UI Standards & Dashboard Widgets

### 4.1 UI Design System Rules (AGENTS.md Compliance)
- **Clean Business Interface**: All PRD codes (`SALO-PR-052`, etc.) are hidden from user-facing buttons, labels, and modal headers.
- **Button Styling Standard**: Secondary/export action buttons use `variant="outline"` with purple text and border matching the standard theme (`#5A2EA6`).
- **Badge Color Conventions**:
  - `Active` / `Paid` / `Enabled`: Light Green badge (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - `Suspended` / `Overdue` / `Critical`: Light Red badge (`bg-rose-50 text-rose-700 border-rose-200`)
  - `Pending Setup` / `Warning`: Light Amber badge (`bg-amber-50 text-amber-700 border-amber-200`)
  - `Enterprise` / `Special`: Light Purple badge (`bg-[#5A2EA6]/10 text-[#5A2EA6] border-[#5A2EA6]/20`)

### 4.2 Dashboard Metric Summary Cards (`DashboardPage.tsx`)
1. **Total Salons / Tenants Card**: Shows total active accounts, total branches count, and month-over-month growth rate.
2. **Monthly Recurring Revenue (MRR) Telemetry**: Displays total platform MRR in INR (e.g., `₹87.1L /mo`), ARR extrapolation, and subscriber tier breakdown chart.
3. **Active Operator Directory Card**: Total super-admin staff count, active MFA enforcement percentage.
4. **Broadcast & Announcement Telemetry**: Number of active live banners, system alert dispatches, and reach analytics.

### 4.3 Deep Inspection Modals Summary
- `SalonDetailsModal.tsx`: Displays complete profile of a salon, branch list, owner email/phone, revenue telemetry, and custom CNAME status.
- `UserDetailsModal.tsx`: Displays administrator privileges, assigned role scope, MFA verification status, and audit log history.
- `InspectAuditTraceModal.tsx`: Displays raw execution callstack, IP address, user email, and JSON payload diff for audit compliance.
- `InspectTicketModal.tsx`: Renders full multi-tenant support ticket conversation thread with internal agent notes and SLA breach status timer.
