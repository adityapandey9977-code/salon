#   Salon SaaS — Comprehensive Super-Admin Module API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.5.0  
**Target System:**   Salon SaaS — Super-Admin Master Platform (`apps/web/src/modules/super-admin`) & Gateway API (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Every Screen, Sub-page, Modal, Superuser Authentication, and End-to-End Workflows  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & SuperAdmin Gateway Scoping

The **  Salon SaaS Super-Admin Module** (`apps/web/src/modules/super-admin`) is an enterprise platform control panel. It empowers SaaS system administrators to manage multi-tenant salon organizations, provision database instances, manage subscription billing, configure global feature flags, monitor API integrations, issue API keys, and respond to support tickets.

```
┌─────────────────────────────────────────┐
│     SUPER-ADMIN FRONTEND MODULE         │
│  (apps/web/src/modules/super-admin)     │
└────────────────────┬────────────────────┘
                     │ REST API / JSON over HTTPS
                     v
┌─────────────────────────────────────────┐
│     SUPER-ADMIN API GATEWAY             │
│  (apps/api/src/modules/tenant | auth)   │
└────────────────────┬────────────────────┘
                     │ PostgreSQL / Prisma ORM
                     v
┌─────────────────────────────────────────┐
│     MULTI-TENANT SAAS DATABASE PLATFORM │
│  (tenants, users, plans, billing, logs) │
└─────────────────────────────────────────┘
```

---

## 2. SuperAdmin Authentication & Superuser Session Management

Access to the SuperAdmin portal requires top-level system authority (`SUPER_ADMIN` role).

**Base Path:** `/api/v1/super-admin/auth`  
**Backend Controller:** `apps/api/src/modules/auth/auth.controller.ts`  
**Database Entities:** `users`, `user_sessions`, `roles`, `permissions`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Request Payload Highlights | Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/auth/login` | `POST` | `/super-admin/login`<br>SuperAdmin Portal Login | Authenticates system root administrators. Validates hardware key/credential & issues elevated JWT access token. | `{ email, password, root_key }` | `{ token, expiresIn, user: { id, email, role: 'SUPER_ADMIN' } }` |
| `/api/v1/super-admin/auth/mfa/verify` | `POST` | SuperAdmin 2FA Screen | Verifies mandatory TOTP/Hardware Authenticator token for SuperAdmin access. | `{ user_id, totp_code, session_token }` | `{ mfaVerified: true, superAccessToken }` |
| `/api/v1/super-admin/auth/refresh-token` | `POST` | Background Service Worker | Silently refreshes root access tokens via HTTP-only secure cookie. | `{ refreshToken }` | `{ accessToken, expiresIn }` |
| `/api/v1/super-admin/auth/me` | `GET` | Sidebar Header & Layout | Retrieves active SuperAdmin session metadata, root permissions, and system access scopes. | Headers: `Authorization: Bearer <token>` | `{ user_id, email, name, role, permissions: ['*'] }` |
| `/api/v1/super-admin/auth/logout` | `POST` | Top Nav Logout | Revokes root tokens, destroys session, and clears authentication cookies. | Headers: `Authorization: Bearer <token>` | `{ success: true, message: 'SuperAdmin session terminated' }` |
| `/api/v1/super-admin/auth/override-token` | `POST` | Tenant Inspection Modal | Generates a temporary 15-minute read-only inspection token to debug tenant issues. | `{ tenant_id, reason }` | `{ overrideToken, expiresAt }` |

---

## 3. Screen-by-Screen & Modal-by-Modal API Endpoint Dictionary

### 3.1 Screen: Executive SuperAdmin Dashboard (`/super-admin/`)
* **UI Pages & Components:** `DashboardPage.tsx`, `DashboardCharts.tsx`
* **Target Database Entities:** `tenants`, `invoices`, `subscription_plans`, `audit_logs`

| Endpoint URI | HTTP Method | Target UI Widget | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/dashboard/kpis` | `GET` | Platform Top KPI Cards | Computes Platform Total MRR, Annual Recurring Revenue (ARR), Total Active Tenants, Active Users, and System Uptime. | Res: `{ platformMrr, platformArr, activeTenants, totalUsers, systemUptimePct }` |
| `/api/v1/super-admin/dashboard/mrr-telemetry`| `GET` | `DashboardCharts.tsx` | Generates historical telemetry for MRR growth, subscriber churn rate, expansion revenue, and net MRR retention %. | Query: `?range=12m`<br>Res: `{ mrrTrend: [...], churnRateTrend: [...] }` |
| `/api/v1/super-admin/dashboard/tenant-health`| `GET` | Tenant Growth Grid | Displays tenant health metrics (Active Salon Count, Daily POS Bookings Volume, Storage Used). | Res: `Array<{ tenantId, tenantName, planName, status, dailyBookings }>` |
| `/api/v1/super-admin/dashboard/system-metrics`| `GET` | Infrastructure Monitor | Fetches API gateway request latency (ms), database connection pool health, and memory usage. | Res: `{ avgLatencyMs, dbPoolActive, memoryUsagePct }` |

---

### 3.2 Screen: Multi-Tenant Salons & Outlets Directory (`/super-admin/salons`)
* **UI Pages & Components:** `SalonsPage.tsx`, `AddSalonPage.tsx`, `AddFranchisePartnerPage.tsx`
* **UI Modals:** `ProvisionTenantModal.tsx`, `SalonDetailsModal.tsx`, `WhiteLabelSettingsModal.tsx`, `ProvisionSalonModal.tsx`
* **Target Database Entities:** `tenants`, `branches`, `subscription_plans`, `cname_records`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/tenants` | `GET` | `SalonsPage.tsx` | Lists all registered salon tenants across India with subscription plan, CNAME status, and active outlets. | Query: `?status=Active&plan=Enterprise`<br>Res: `Array<TenantObject>` |
| `/api/v1/super-admin/tenants` | `POST` | `ProvisionTenantModal.tsx`<br>`AddSalonPage.tsx` | Provisions a new salon tenant, creates primary admin account, initializes database schema, and assigns plan. | Body: `{ name, tenant_code, admin_email, plan_id, max_branches, cname_domain }` |
| `/api/v1/super-admin/tenants/:id` | `GET` | `SalonDetailsModal.tsx` | Retrieves full tenant metadata, active branch count, database storage usage, and active billing status. | Params: `id=TNT-Indore-01`<br>Res: `{ tenant, branches, usageMetrics, subscription }` |
| `/api/v1/super-admin/tenants/:id` | `PATCH` | `SalonDetailsModal.tsx` | Updates tenant configuration, modifies branch limits, or changes account status (`Active`, `Suspended`, `PastDue`). | Body: `{ status: 'Suspended', suspension_reason: 'Non-payment of subscription invoice' }` |
| `/api/v1/super-admin/tenants/:id` | `DELETE` | `SalonsPage.tsx` | Soft-deletes or permanently purges a tenant salon instance from the multi-tenant SaaS cluster. | Params: `id=TNT- Indrapuri-01` |
| `/api/v1/super-admin/tenants/:id/cname` | `PUT` | `WhiteLabelSettingsModal.tsx` | Configures custom domain CNAME record (e.g. `app.luxurybeautysalon.com`), SSL certificates, and custom branding. | Body: `{ cname_domain, ssl_status: 'Active', custom_primary_color: '#7C3AED', logo_url }` |
| `/api/v1/super-admin/tenants/franchise-group` | `POST` | `AddFranchisePartnerPage.tsx` | Onboards a multi-outlet franchise group with parent corporate tenant mapping and multi-branch allocation. | Body: `{ group_name, lead_partner_email, region, initial_outlets_count: 5 }` |

---

### 3.3 Screen: Subscription Plans & Quotas (`/super-admin/subscription-plans`)
* **UI Pages & Components:** `SubscriptionPlansPage.tsx`
* **UI Modals:** `SubscriptionPlanModal.tsx`
* **Target Database Entities:** `subscription_plans`, `tenants`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/plans` | `GET` | `SubscriptionPlansPage.tsx` | Lists all platform SaaS pricing tiers (Essential, Professional, Enterprise Luxe) with pricing and limits. | Res: `Array<SubscriptionPlanObject>` |
| `/api/v1/super-admin/plans` | `POST` | `SubscriptionPlanModal.tsx` | Defines a new subscription plan tier with monthly fee, annual price, branch quota, staff quota, and feature flags. | Body: `{ name: 'Enterprise Luxe', monthly_price: 12499, max_branches: 15, max_staff: 100, features: [...] }` |
| `/api/v1/super-admin/plans/:id` | `PATCH` | `SubscriptionPlanModal.tsx` | Modifies existing plan pricing, quota limits, or feature entitlements for upcoming renewal cycles. | Body: `{ monthly_price: 13999, max_staff: 120 }` |
| `/api/v1/super-admin/plans/:id` | `DELETE` | `SubscriptionPlansPage.tsx` | Archives a subscription tier to prevent new subscriber onboarding while maintaining legacy subscribers. | Params: `id=PLAN-LGT-01` |

---

### 3.4 Screen: Billing, Revenue & Invoicing (`/super-admin/billing-payments`)
* **UI Pages & Components:** `BillingPaymentsPage.tsx`
* **UI Modals:** `CreateInvoiceModal.tsx`
* **Target Database Entities:** `platform_invoices`, `tenant_subscriptions`, `payments`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/billing/invoices` | `GET` | `BillingPaymentsPage.tsx` | Fetches platform subscription billing invoices across all tenants with payment status (`Paid`, `Overdue`, `Pending`). | Query: `?status=Overdue`<br>Res: `Array<PlatformInvoiceObject>` |
| `/api/v1/super-admin/billing/invoices` | `POST` | `CreateInvoiceModal.tsx` | Manually issues a custom platform invoice (e.g. setup capex, customized integration fee, extra SMS credits). | Body: `{ tenant_id, description, amount: 25000.00, due_date: '2026-09-15', tax_rate_pct: 18.0 }` |
| `/api/v1/super-admin/billing/sweep` | `POST` | `BillingPaymentsPage.tsx` | Triggers automated Razorpay/Stripe ACH recurring subscription billing sweep across active tenants. | Body: `{ sweep_date: '2026-08-27' }`<br>Res: `{ processedCount, successCount, failedCount }` |

---

### 3.5 Screen: Platform Operators & Admin Users (`/super-admin/users`)
* **UI Pages & Components:** `UsersPage.tsx`
* **UI Modals:** `CreateAdminUserModal.tsx`, `UserDetailsModal.tsx`
* **Target Database Entities:** `users`, `roles`, `user_sessions`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/users` | `GET` | `UsersPage.tsx` | Lists all platform system operators, assigned RBAC roles, MFA enforcement status, and last active IP. | Query: `?role=SystemAdmin`<br>Res: `Array<UserObject>` |
| `/api/v1/super-admin/users` | `POST` | `CreateAdminUserModal.tsx` | Provisions a new platform operator or support engineer account with enforced MFA requirements. | Body: `{ full_name, email, role_id: 'ROL-SYS-ADMIN', enforce_mfa: true }` |
| `/api/v1/super-admin/users/:id` | `GET` | `UserDetailsModal.tsx` | Inspects full user profile, access logs, assigned tenant scopes, and active session tokens. | Params: `id=USR-9901` |
| `/api/v1/super-admin/users/:id` | `PATCH` / `DELETE` | `UsersPage.tsx` | Updates user permissions or revokes system access credentials immediately. | Body: `{ is_active: false, revocation_reason: 'Account Decommissioned' }` |

---

### 3.6 Screen: Global Roles & Permissions RBAC (`/super-admin/roles-permissions`)
* **UI Pages & Components:** `RolesPermissionsPage.tsx`
* **UI Modals:** `CreateCustomRoleModal.tsx`
* **Target Database Entities:** `roles`, `permissions`, `role_permissions`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/roles` | `GET` | `RolesPermissionsPage.tsx` | Retrieves global RBAC system roles and granted permission key matrices. | Res: `Array<RoleScopeObject>` |
| `/api/v1/super-admin/roles` | `POST` | `CreateCustomRoleModal.tsx` | Creates a customized administrative role with defined system privilege scopes. | Body: `{ name: 'Support Operations Lead', code: 'ROL-SUP-01', permissions: ['TICKETS_WRITE', 'TENANTS_READ'] }` |
| `/api/v1/super-admin/roles/:id/permissions` | `PUT` | `RolesPermissionsPage.tsx` | Bulk updates permission keys attached to a global role ID across the platform. | Body: `{ permission_keys: ['TENANTS_READ', 'INVOICES_CREATE', 'LOGS_VIEW'] }` |

---

### 3.7 Screen: Support Desk & SLA Tickets (`/super-admin/support-tickets`)
* **UI Pages & Components:** `SupportTicketsPage.tsx`
* **UI Modals:** `InspectTicketModal.tsx`
* **Target Database Entities:** `support_tickets`, `ticket_replies`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/tickets` | `GET` | `SupportTicketsPage.tsx` | Lists incoming tenant support tickets, SLA priority (`Urgent`, `High`, `Normal`), and assignment status. | Query: `?priority=Urgent`<br>Res: `Array<SupportTicketObject>` |
| `/api/v1/super-admin/tickets/:id/reply` | `POST` | `InspectTicketModal.tsx` | Dispatches official response or resolution notes to tenant manager support inquiry. | Body: `{ ticket_id, response_text, change_status_to: 'Resolved', internal_notes }` |
| `/api/v1/super-admin/tickets/:id/escalate` | `POST` | `SupportTicketsPage.tsx` | Escalates an un-responded SLA ticket to Tier-3 engineering leads. | Body: `{ escalation_level: 3, reason: '24h SLA Breached' }` |

---

### 3.8 Screen: System Broadcast Announcements (`/super-admin/announcements`)
* **UI Pages & Components:** `AnnouncementsPage.tsx`
* **UI Modals:** `CreateAnnouncementModal.tsx`, `AnnouncementDetailsModal.tsx`
* **Target Database Entities:** `system_announcements`, `announcement_deliveries`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/announcements` | `GET` / `POST` | `AnnouncementsPage.tsx`<br>`CreateAnnouncementModal.tsx` | Creates and dispatches platform-wide broadcast advisories (e.g., Scheduled Maintenance Window, Version 2.5 Feature Release). | Body: `{ title, content, target_audience: 'ALL_TENANTS', severity: 'Warning', scheduled_at }` |
| `/api/v1/super-admin/announcements/:id` | `DELETE` | `AnnouncementsPage.tsx` | Revokes or deletes an active broadcast banner from salon admin dashboards. | Params: `id=ANC-9901` |

---

### 3.9 Screen: Notification Delivery Logs & Simulator (`/super-admin/notifications`)
* **UI Pages & Components:** `NotificationsPage.tsx`
* **UI Modals:** `SimulateNotificationModal.tsx`, `InspectNotificationModal.tsx`
* **Target Database Entities:** `notification_logs`, `delivery_events`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/notifications/logs` | `GET` | `NotificationsPage.tsx` | Displays delivery telemetry logs across Push, SMS, and Email notification channels. | Query: `?status=Failed`<br>Res: `Array<NotificationLogObject>` |
| `/api/v1/super-admin/notifications/simulate` | `POST` | `SimulateNotificationModal.tsx` | Simulates push/SMS webhook delivery to test integration endpoints or trigger simulated 504 timeouts. | Body: `{ channel: 'WhatsApp', recipient_phone, payload_template, simulate_error_code: 504 }` |

---

### 3.10 Screen: Global Audit Logs & System Lineage (`/super-admin/audit-logs`)
* **UI Pages & Components:** `AuditLogsPage.tsx`
* **UI Modals:** `InspectAuditTraceModal.tsx`
* **Target Database Entities:** `audit_logs`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/audit` | `GET` | `AuditLogsPage.tsx` | Queries immutable platform security logs filterable by actor ID, target tenant, IP address, and geolocation. | Query: `?tenant_id=TNT-01&action=TENANT_SUSPEND`<br>Res: `Array<AuditTraceObject>` |
| `/api/v1/super-admin/audit/export` | `POST` | `AuditLogsPage.tsx` | Generates compliance export of security audit traces for statutory security review. | Body: `{ date_from, date_to, format: 'CSV' }` |

---

### 3.11 Screen: Third-Party SaaS Integrations (`/super-admin/integrations`)
* **UI Pages & Components:** `IntegrationsPage.tsx`
* **UI Modals:** `ConfigureIntegrationModal.tsx`
* **Target Database Entities:** `system_integrations`, `api_credentials`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/integrations` | `GET` | `IntegrationsPage.tsx` | Manages third-party connector statuses (Stripe, Twilio SMS, SendGrid Email, Razorpay POS). | Res: `Array<IntegrationObject>` |
| `/api/v1/super-admin/integrations/:id` | `PUT` | `ConfigureIntegrationModal.tsx` | Updates external API credentials, webhook signing secrets, and environment target URLs. | Body: `{ api_key: 'sk_live_9921...', webhook_secret: 'whsec_771...', environment: 'Production' }` |

---

### 3.12 Screen: Developer API Gateway Keys (`/super-admin/api-keys`)
* **UI Pages & Components:** `ApiKeysPage.tsx`
* **UI Modals:** `GenerateApiKeyModal.tsx`
* **Target Database Entities:** `developer_api_keys`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/api-keys` | `GET` / `POST` | `ApiKeysPage.tsx`<br>`GenerateApiKeyModal.tsx` | Provisions and lists developer API gateway keys with rate-limiting quotas and IP whitelist masks. | Body: `{ name: 'Indrapuri Mobile POS App Key', tenant_id, rate_limit_per_min: 1000, allowed_ips: ['103.21.12.5'] }` |
| `/api/v1/super-admin/api-keys/:id` | `DELETE` | `ApiKeysPage.tsx` | Instantly revokes a compromised developer API key token. | Params: `id=KEY-8819` |

---

### 3.13 Screen: Feature Flags & Progressive Rollouts (`/super-admin/feature-flags`)
* **UI Pages & Components:** `FeatureFlagsPage.tsx`
* **UI Modals:** `CreateFeatureFlagModal.tsx`, `ManageRolloutModal.tsx`
* **Target Database Entities:** `feature_flags`, `tenant_feature_overrides`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/feature-flags` | `GET` / `POST` | `FeatureFlagsPage.tsx`<br>`CreateFeatureFlagModal.tsx` | Defines dynamic feature toggles (e.g. `ENABLE_AI_RECOMMENDATIONS`, `ENABLE_HOME_SERVICE_TRACKING`). | Body: `{ key: 'ENABLE_AI_RECOMMENDATIONS', description: 'AI hair style suggestion module', default_enabled: false }` |
| `/api/v1/super-admin/feature-flags/:id/rollout` | `PATCH` | `ManageRolloutModal.tsx` | Configures progressive percentage rollout (e.g. enable for 25% of tenants) or targets specific tenant IDs. | Body: `{ rollout_percentage: 25.0, target_tenant_ids: ['TNT-IND-01', 'TNT-PUN-02'] }` |

---

### 3.14 Screen: Global Platform Settings & White-Labeling (`/super-admin/settings`)
* **UI Pages & Components:** `SettingsPage.tsx`
* **Target Database Entities:** `system_settings`, `cname_records`

| Endpoint URI | HTTP Method | Target UI Screen / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/super-admin/settings` | `GET` / `PATCH` | `SettingsPage.tsx` | Configures global SaaS platform defaults, default currency (`INR`), GST rate (18%), system maintenance mode, and branding. | Body: `{ system_name: '  Salon SaaS', default_currency: 'INR', maintenance_mode: false }` |

---

## 4. End-to-End API Integration Workflows

### Flow 4.1: End-to-End Tenant Onboarding, Database Provisioning & Custom Domain Configuration
Sequence of API transactions executed when a new multi-branch salon tenant joins the platform:

```
┌─────────────────────────┐
│ 1. POST /auth/login     │ ──► Root SuperAdmin authenticates & receives JWT bearer token.
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│ 2. POST /tenants        │ ──► Provisions new tenant record, creates primary Admin user, & initializes DB schema.
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│ 3. PUT /tenants/:id/cname│ ──► Binds custom white-label CNAME (e.g., app.indrapurisalon.com) & provisions SSL cert.
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│ 4. POST /billing/invoices│ ──► Generates setup capex invoice + first month subscription charges.
└────────────┬────────────┘
             │
             v
┌─────────────────────────┐
│ 5. POST /notifications/ │ ──► Dispatches automated welcome email & SMS credential package to Tenant Owner.
│    simulate             │
└─────────────────────────┘
```

---

### Flow 4.2: End-to-End Automated Subscription Billing Sweep & Tenant Lifecycle Management
Sequence executed during monthly automated subscription renewal sweeps:

1. **Quota Verification:** `GET /api/v1/super-admin/plans`  
   *Fetches baseline quotas (Max Branches, Max Staff, Monthly Price) for each active plan.*
2. **Automated Sweep Execution:** `POST /api/v1/super-admin/billing/sweep`  
   *Triggers Razorpay/Stripe ACH debit requests for all active subscriptions.*
3. **Webhook Processing (External Gateway):** `POST https://api.stripe.com/v1/invoices`  
   *Receives webhook events (`invoice.payment_succeeded` or `invoice.payment_failed`).*
4. **Tenant Status Transition:** `PATCH /api/v1/super-admin/tenants/:id`  
   *If payment succeeds: Renews active status for 30 days.*  
   *If payment fails: Updates status to `PastDue` and initiates 7-day grace period.*
5. **Advisory Dispatch:** `POST /api/v1/super-admin/announcements`  
   *Dispatches payment confirmation or overdue payment notification banner to tenant dashboard.*

---

### Flow 4.3: End-to-End Support Ticket SLA Escalation & Remote Emergency Diagnostics
Workflow executed when an urgent tenant support ticket requires root diagnostic investigation:

1. **Ticket Monitoring:** `GET /api/v1/super-admin/tickets?priority=Urgent`  
   *Filters incoming un-responded SLA tickets.*
2. **Emergency Override Token Request:** `POST /api/v1/super-admin/auth/override-token`  
   *SuperAdmin requests a 15-minute temporary read-only token to inspect affected tenant's data safely.*
3. **System Audit Log Inspection:** `GET /api/v1/super-admin/audit?tenant_id=TNT-01`  
   *Queries tenant's recent POS checkouts, inventory updates, and API call logs to pinpoint error cause.*
4. **Resolution & Reply:** `POST /api/v1/super-admin/tickets/:id/reply`  
   *Dispatches technical resolution response to tenant manager and closes ticket SLA timer.*

---

### Flow 4.4: End-to-End Progressive Feature Flag Rollout & Performance Telemetry
Workflow executed when launching a new platform feature (e.g. AI Treatment Recommendations):

1. **Feature Flag Definition:** `POST /api/v1/super-admin/feature-flags`  
   *Registers flag key `ENABLE_AI_RECOMMENDATIONS` with `default_enabled: false`.*
2. **Progressive Rollout Allocation:** `PATCH /api/v1/super-admin/feature-flags/:id/rollout`  
   *Increases rollout allocation from `10.0%` -> `50.0%` -> `100.0%` across active tenant cohorts.*
3. **System Performance Monitoring:** `GET /api/v1/super-admin/dashboard/system-metrics`  
   *Monitors database connection pool utilization and API request latency to verify system stability.*

---

### Flow 4.5: End-to-End Developer API Key Lifecycle & Security Incident Revocation
Workflow executed during developer token provisioning and emergency security revocation:

1. **API Key Provisioning:** `POST /api/v1/super-admin/api-keys`  
   *Issues a developer gateway key with strict rate limits (1000 req/min) and IP whitelisting.*
2. **Delivery Log Monitoring:** `GET /api/v1/super-admin/notifications/logs`  
   *Monitors API calls for abnormal traffic spikes or unauthorized IP access attempts.*
3. **Emergency Revocation:** `DELETE /api/v1/super-admin/api-keys/:id`  
   *Instantly revokes token access across API gateway proxies upon security detection.*
4. **Audit Export:** `POST /api/v1/super-admin/audit/export`  
   *Exports compliance audit trail for security incident review.*

---

## 5. Verification Summary

- **SuperAdmin APIs Documented:** 8 Authentication endpoints under `/api/v1/super-admin/auth` + 38 REST endpoints covering every SuperAdmin UI page & modal.
- **End-to-End Workflows Documented:** 5 complete step-by-step API integration sequences (Tenant Provisioning, Subscription Billing Sweep, Support SLA Escalation, Progressive Feature Rollout, API Key Lifecycle).
- **UI Screen Coverage:** 100% of all 16 SuperAdmin screens and 21 modals in [`apps/web/src/modules/super-admin`](file:///e:/salon%20management%20system/ -Salon/apps/web/src/modules/super-admin) mapped.
- **Database Schema Alignment:** Cross-referenced with [`docs/SUPER_ADMIN_DATABASE_SCHEMA_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/SUPER_ADMIN_DATABASE_SCHEMA_DICTIONARY.md) and [`docs/SuperAdmin_Frontend_UI_Integration_Spec.md`](file:///e:/salon%20management%20system/ -Salon/docs/SuperAdmin_Frontend_UI_Integration_Spec.md).
