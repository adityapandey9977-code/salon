# Service Documentation: Platform Service (`apps/services/platform-service`)

> **Multi-Tenant SaaS Subscriptions, Feature Flag Gates, White-Label Customizations & Platform Audit**

---

## 1. Overview & Responsibilities

The **Platform Service** manages the SuperAdmin master SaaS control plane. It oversees multi-tenant billing tiers (Starter, Growth, Enterprise), feature flag entitlement toggles (e.g. enabling WhatsApp module, Analytics, or AI Stylist suggestions), tenant onboarding workflows, white-label custom domain mappings, and platform-wide security audit trails.

### Key Responsibilities
- **SaaS Subscription Plans**: Subscription tiers, billing frequencies (Monthly/Annual), branch quota limits, and staff quota limits.
- **Tenant Subscriptions**: Plan assignment, trial expiry, renewal billing, upgrade/downgrade workflows, and grace-period suspensions.
- **Feature Flag Entitlements**: Granular feature gate toggles per tenant (e.g. `FEATURE_WHATSAPP_CAMPAIGNS`, `FEATURE_MULTI_BRANCH_INVENTORY`, `FEATURE_COMMISSION_PAYROLL`).
- **White-Label & Custom Branding**: Custom domain mappings, custom CSS brand themes, and favicon/app icon overrides.
- **Platform Audit Log Engine**: Centralized audit repository capturing administrative actions, sensitive data access, and configuration changes across all tenants.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `PLATFORM_SERVICE_PORT` / `PORT` | `3011` | HTTP listener port |
| **Database URL** | `PLATFORM_DATABASE_URL` | `postgresql://.../platform_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration |

---

## 3. Database Schema Entities (`platform_db`)

- **`SubscriptionPlan`**: `id`, `name`, `code` (`STARTER`, `GROWTH`, `ENTERPRISE`), `monthlyPrice`, `annualPrice`, `maxBranches`, `maxStaff`, `featureList`, `status`
- **`TenantSubscription`**: `id`, `tenantId`, `planId`, `status` (`TRIAL`, `ACTIVE`, `PAST_DUE`, `CANCELLED`), `currentPeriodStart`, `currentPeriodEnd`, `autoRenew`
- **`TenantFeatureFlag`**: `id`, `tenantId`, `featureKey`, `isEnabled`, `customLimit`
- **`CustomDomainMapping`**: `id`, `tenantId`, `customDomain`, `sslStatus`, `isVerified`
- **`PlatformAuditLog`**: `id`, `tenantId`, `userId`, `action`, `resource`, `resourceId`, `ipAddress`, `changesJson`, `timestamp`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:features` (TTL: 600s)
- `tenant:{tenantId}:subscription:status` (TTL: 300s)

---

## 5. Key API Endpoints

- `GET /api/v1/platform/plans`
- `POST /api/v1/platform/plans`
- `GET /api/v1/platform/tenants` (SuperAdmin tenant directory)
- `POST /api/v1/platform/tenants/provision`
- `GET /api/v1/platform/tenants/:tenantId/subscription`
- `PATCH /api/v1/platform/tenants/:tenantId/subscription`
- `GET /api/v1/platform/tenants/:tenantId/features`
- `PUT /api/v1/platform/tenants/:tenantId/features`
- `GET /api/v1/platform/audit-logs`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.platform.tenant.provisioned`
  - `salon.events.platform.subscription.changed`
  - `salon.events.platform.feature_flags.updated`
