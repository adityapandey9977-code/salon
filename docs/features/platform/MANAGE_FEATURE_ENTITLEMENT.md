# Feature: Subscription & Entitlement Management

## 1. Subscription Lifecycle (`CHANGE_SUBSCRIPTION.md`)
- Endpoint: `PATCH /api/v1/super-admin/tenants/:id/subscription`
- Supports status transitions: `TRIALING` $\rightarrow$ `ACTIVE` $\rightarrow$ `PAST_DUE` $\rightarrow$ `SUSPENDED` $\rightarrow$ `CANCELLED`.
- Publishes `SUBSCRIPTION_CHANGED.v1` to RabbitMQ.
- Invalidates Redis entitlement cache (`tenant:{tenantId}:entitlements`).

## 2. Feature Entitlement Hierarchy (`MANAGE_FEATURE_ENTITLEMENT.md`)
- Resolution order:
  1. `TenantFeatureOverride` (per-tenant custom overrides)
  2. `PlanFeature` (features bundled in active SaaS plan)
  3. Platform Default (fallback: disabled)
- Super Admin controls: `POST /api/v1/super-admin/feature-flags`
- Internal query: `GET /internal/v1/tenants/:tenantId/effective-entitlements`

## 3. Custom Domains & White-labeling (`ADD_CUSTOM_DOMAIN.md`)
- Endpoint: `POST /api/v1/super-admin/tenants/:id/domains`
- Hostname validation and DNS verification tokens.
- Domain types: `ADMIN`, `CUSTOMER`, `BOOKING`, `PUBLIC`.
- SSL status tracking: `PENDING`, `ISSUED`, `FAILED`, `EXPIRED`.
