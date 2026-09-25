#   Salon SaaS · Super-Admin Microservices Architecture & Decoupling Blueprint

> **Document Version**: `1.0.0`  
> **Target Platform**:   Salon SaaS (Multi-Tenant Enterprise Platform)  
> **Source Module**: `apps/web/src/modules/super-admin`  
> **Architectural Pattern**: Domain-Driven Microservices (DDD), Event-Driven Architecture (EDA), Database-per-Service, Saga Orchestration  

---

## 1. Executive Summary & Architectural Vision

The `super-admin` module currently resides within the web monorepo (`apps/web/src/modules/super-admin`) powered by a centralized React state context (`SuperAdminContext.tsx`) and monolithic backend API endpoints. As   Salon scales across multi-city salon chains, franchise networks, and enterprise accounts, breaking this monolithic management module into isolated, resilient, and independently scalable **Microservices** is essential.

### Core Architecture Principles
1. **Multi-Tenant Isolation & Security**: Zero-Trust access control, fine-grained RBAC, and strict tenant data separation.
2. **Domain-Driven Design (DDD)**: Each business context inside Super Admin is encapsulated within a distinct microservice with explicit boundaries.
3. **High Availability & Fault Isolation**: A failure in the Support Ticket service or Announcement engine will never impact Tenant Provisioning or Billing operations.
4. **Event-Driven Asynchrony**: Asynchronous cross-service communication using Apache Kafka / RabbitMQ with the Transactional Outbox pattern.
5. **Database-per-Service**: Independent schemas and persistence layer per service, eliminating database-level coupling.

---

## 2. Source Module (`super-admin`) Analysis

Analysis of `apps/web/src/modules/super-admin` reveals 16 core administrative capabilities currently grouped together:

| Page / Component File | Core Business Capability | Current State Management |
| :--- | :--- | :--- |
| `SalonsPage.tsx`, `AddSalonPage.tsx`, `AddFranchisePartnerPage.tsx`, `ProvisionTenantModal.tsx` | Tenant & Franchise Lifecycle Management | `tenants[]` array in `SuperAdminContext` |
| `UsersPage.tsx`, `RolesPermissionsPage.tsx`, `CreateAdminUserModal.tsx`, `CreateCustomRoleModal.tsx` | Platform IAM, Super-Admin Users & Global RBAC Scopes | `users[]`, `roles[]` in `SuperAdminContext` |
| `SubscriptionPlansPage.tsx`, `BillingPaymentsPage.tsx`, `SubscriptionPlanModal.tsx`, `CreateInvoiceModal.tsx` | SaaS Tier Pricing, Subscriber Quotas, Billing & Invoicing | `subscriptionPlans[]`, `invoices[]` in `SuperAdminContext` |
| `AnnouncementsPage.tsx`, `NotificationsPage.tsx`, `CreateAnnouncementModal.tsx`, `SimulateNotificationModal.tsx` | Global Broadcasts, Alert Dispatches & Multi-Channel Communications | `announcements[]` in `SuperAdminContext` |
| `AuditLogsPage.tsx`, `InspectAuditTraceModal.tsx` | System Audit Trail, Security Event Inspection & Geolocation Logs | Local mock array in `AuditLogsPage.tsx` |
| `FeatureFlagsPage.tsx`, `CreateFeatureFlagModal.tsx`, `ManageRolloutModal.tsx` | Feature Flagging, AB Testing & Progressive Rollout Strategies | Local state in `FeatureFlagsPage.tsx` |
| `IntegrationsPage.tsx`, `ApiKeysPage.tsx`, `GenerateApiKeyModal.tsx`, `WhiteLabelSettingsModal.tsx` | External SaaS Integrations, API Gateway Keys & CNAME Branding | Local state in page components |
| `SupportTicketsPage.tsx`, `InspectTicketModal.tsx` | Customer Support Ticketing, Priority Escalations & SLA Management | Local state in `SupportTicketsPage.tsx` |
| `DashboardPage.tsx`, `DashboardCharts.tsx` | Platform KPI Aggregations, MRR/ARR Telemetry & Analytics | Computed metrics from context state |

---

## 3. Target Microservices Decomposition (8 Microservices)

```
                                    +-----------------------+
                                    |    Client Frontends   |
                                    | (Web / Mobile Apps)   |
                                    +-----------+-----------+
                                                |
                                                v
                                  +---------------------------+
                                  |    API Gateway (Kong)     |
                                  |   Port 4000 (HTTPS/gRPC)  |
                                  +-------------+-------------+
                                                |
     +-----------------+-------------------+----+-------------------+------------------+
     |                 |                   |                        |                  |
     v                 v                   v                        v                  v
+----------+   +---------------+   +---------------+       +------------------+   +----------+
| Tenant   |   | Identity & IAM|   | Billing &     |       | Broadcast &      |   | Audit &  |
| Service  |   | Service       |   | Subscription  |       | Notification     |   | Security |
| (4001)   |   | (4002)        |   | Service (4003)|       | Service (4004)   |   | (4005)   |
+----+-----+   +-------+-------+   +-------+-------+       +--------+---------+   +----+-----+
     |                 |                   |                        |                  |
     +-----------------+-------------------+----+-------------------+------------------+
                                                |
                                                v
                                  +---------------------------+
                                  | Event Bus (Kafka/RabbitMQ)|
                                  +---------------------------+
```

---

### Service 1: `tenant-service` (Port 4001)
- **Bounded Context**: Tenant Provisioning, Franchise Grouping, White-Labeling & CNAME Routing.
- **Database**: PostgreSQL (`tenant_db`)
- **Core Entities**:
  - `tenants` (`id`, `name`, `slug`, `city`, `region`, `status`, `custom_domain`, `primary_color`, `created_at`)
  - `branches` (`id`, `tenant_id`, `name`, `city`, `status`)
  - `franchise_groups` (`id`, `group_name`, `owner_tenant_id`)
- **REST Endpoints**:
  - `GET /api/v1/tenants` — Fetch filtered list of tenants (with search, status, tier, city filters)
  - `POST /api/v1/tenants/provision` — Provision new salon group / tenant
  - `PUT /api/v1/tenants/:id` — Update tenant profile & active plan bindings
  - `PATCH /api/v1/tenants/:id/white-label` — Update CNAME custom domain & primary color theme
  - `DELETE /api/v1/tenants/:id` — Suspend / soft-delete tenant
- **Published Domain Events**:
  - `tenant.provisioned` `{ tenantId, slug, ownerEmail, planId }`
  - `tenant.suspended` `{ tenantId, reason }`
  - `tenant.whitelabel_updated` `{ tenantId, customDomain, primaryColor }`

---

### Service 2: `identity-iam-service` (Port 4002)
- **Bounded Context**: Super-Admin User Directory, Global RBAC Scopes, MFA & Zero-Trust Session Management.
- **Database**: PostgreSQL (`iam_db`) + Redis Cache (Active Sessions & Token Blacklist)
- **Core Entities**:
  - `admin_users` (`id`, `name`, `email`, `phone`, `role_id`, `status`, `mfa_enabled`)
  - `global_roles` (`id`, `role_name`, `description`, `scope`, `permissions_json`)
  - `mfa_devices` (`id`, `user_id`, `secret`, `is_verified`)
- **REST / gRPC Endpoints**:
  - `GET /api/v1/iam/users` — List super-admin personnel
  - `POST /api/v1/iam/users` — Invite new super-admin staff member
  - `GET /api/v1/iam/roles` — Fetch global RBAC definitions
  - `POST /api/v1/iam/roles` — Create custom RBAC role with granular permissions
  - `POST /api/v1/iam/auth/verify-mfa` — Enforce multi-factor authentication check
- **Published Domain Events**:
  - `iam.user_created` `{ userId, email, role }`
  - `iam.role_modified` `{ roleId, permissions }`
  - `iam.security_alert` `{ userId, action: 'MFA_FAILED' | 'SUSPICIOUS_LOGIN' }`

---

### Service 3: `billing-subscription-service` (Port 4003)
- **Bounded Context**: Subscription Plans, Tier Quotas, Progressive Rollout Strategies, Invoicing & Payment Gateways.
- **Database**: PostgreSQL (`billing_db`)
- **Core Entities**:
  - `subscription_plans` (`id`, `name`, `numeric_price`, `max_branches`, `max_staff`, `has_custom_api`, `has_white_label`, `rollout_percentage`, `rollout_strategy`, `status`)
  - `subscriptions` (`id`, `tenant_id`, `plan_id`, `status`, `billing_cycle`, `current_period_end`)
  - `invoices` (`invoice_id`, `tenant_id`, `numeric_amount`, `status`, `billing_period`, `created_at`)
- **REST Endpoints**:
  - `GET /api/v1/billing/plans` — List available subscription tiers
  - `POST /api/v1/billing/plans` — Create new plan tier (Standard, Premium, Enterprise)
  - `PATCH /api/v1/billing/plans/:id/rollout` — Update plan rollout percentage & deployment strategy
  - `GET /api/v1/billing/invoices` — List all invoices across tenants
  - `POST /api/v1/billing/invoices` — Generate manually / automatically generated invoice
- **Published Domain Events**:
  - `billing.plan_created` `{ planId, name, price }`
  - `billing.plan_rollout_updated` `{ planId, rolloutPercentage, strategy }`
  - `billing.invoice_generated` `{ invoiceId, tenantId, amount, status }`
  - `billing.payment_overdue` `{ tenantId, invoiceId }`

---

### Service 4: `notification-broadcast-service` (Port 4004)
- **Bounded Context**: System Announcements, Multi-Channel Broadcast Dispatches (Email, SMS, Push), Audience Targeting Engine.
- **Database**: MongoDB (`notification_db`) + Redis (Pub/Sub Queue)
- **Core Entities**:
  - `announcements` (`id`, `title`, `content`, `audience`, `priority`, `channels`, `status`, `created_at`)
  - `notification_logs` (`id`, `announcement_id`, `recipient_email`, `channel`, `delivery_status`, `sent_at`)
- **REST Endpoints**:
  - `GET /api/v1/announcements` — Retrieve broadcasts list
  - `POST /api/v1/announcements` — Dispatch new broadcast announcement
  - `POST /api/v1/notifications/simulate` — Execute test broadcast dispatch preview
  - `GET /api/v1/notifications/logs` — Inspect delivery analytics and failure reasons
- **Published Domain Events**:
  - `broadcast.dispatched` `{ announcementId, audience, channels }`
  - `notification.failed` `{ notificationId, recipient, reason }`

---

### Service 5: `audit-compliance-service` (Port 4005)
- **Bounded Context**: Immutable Platform Audit Logs, IP Geolocation Traces, Security Compliance.
- **Database**: TimescaleDB / MongoDB (`audit_db`) (Append-only storage)
- **Core Entities**:
  - `audit_logs` (`id`, `action`, `user_id`, `user_email`, `tenant_id`, `ip_address`, `location`, `details_json`, `timestamp`)
- **REST Endpoints**:
  - `GET /api/v1/audit/logs` — Query audit trail with filters (User, Module, Date Range, Risk Severity)
  - `GET /api/v1/audit/logs/:id/trace` — Retrieve deep execution call stack & payload diff
- **Consumed Events**: Consumes ALL events published across all services to maintain a centralized audit ledger.

---

### Service 6: `feature-flag-service` (Port 4006)
- **Bounded Context**: Dynamic Feature Flags, Gradual Rollouts, Multi-Tenant Kill-Switches, A/B Testing Rule Engine.
- **Database**: PostgreSQL (`flag_db`) + Redis (In-Memory Evaluation Cache <5ms latency)
- **Core Entities**:
  - `feature_flags` (`id`, `key`, `name`, `description`, `enabled`, `environment`, `rollout_percentage`, `target_tenants`)
- **REST Endpoints**:
  - `GET /api/v1/flags` — List platform feature flags
  - `POST /api/v1/flags` — Define new flag toggle
  - `PATCH /api/v1/flags/:id/toggle` — Instant kill-switch toggle
  - `GET /api/v1/flags/evaluate?tenantId=...` — High-performance flag evaluation endpoint
- **Published Domain Events**:
  - `flag.toggled` `{ flagKey, enabled, environment }`
  - `flag.rollout_modified` `{ flagKey, rolloutPercentage }`

---

### Service 7: `gateway-ecosystem-service` (Port 4007)
- **Bounded Context**: Developer API Keys, Webhook Subscriptions & External SaaS Integrations (WhatsApp POS, Tally, Accounting).
- **Database**: PostgreSQL (`ecosystem_db`)
- **Core Entities**:
  - `api_keys` (`id`, `tenant_id`, `key_hash`, `name`, `scope`, `rate_limit`, `status`, `created_at`)
  - `integrations` (`id`, `provider_name`, `category`, `status`, `config_json`)
  - `webhooks` (`id`, `tenant_id`, `target_url`, `events`, `secret_key`)
- **REST Endpoints**:
  - `GET /api/v1/ecosystem/api-keys` — List active API keys
  - `POST /api/v1/ecosystem/api-keys/generate` — Provision new hashed API key
  - `POST /api/v1/ecosystem/integrations/configure` — Connect third-party SaaS integration
- **Published Domain Events**:
  - `apikey.generated` `{ keyId, tenantId, scopes }`
  - `integration.connected` `{ provider, tenantId }`

---

### Service 8: `support-ticket-service` (Port 4008)
- **Bounded Context**: Multi-Tenant Customer Support, Ticket Lifecycle, SLA Escalations, Priority Matrix.
- **Database**: PostgreSQL (`support_db`)
- **Core Entities**:
  - `support_tickets` (`id`, `ticket_no`, `tenant_id`, `subject`, `category`, `priority`, `status`, `assigned_to`, `sla_due_at`)
  - `ticket_messages` (`id`, `ticket_id`, `sender_id`, `message`, `attachments`)
- **REST Endpoints**:
  - `GET /api/v1/support/tickets` — Query support ticket roster
  - `GET /api/v1/support/tickets/:id` — Inspect ticket conversation history
  - `POST /api/v1/support/tickets/:id/reply` — Send agent reply to tenant
  - `PATCH /api/v1/support/tickets/:id/status` — Resolve / escalate support ticket
- **Published Domain Events**:
  - `ticket.created` `{ ticketId, tenantId, priority }`
  - `ticket.sla_breached` `{ ticketId, tenantId, hoursOverdue }`

---

## 4. Event-Driven Distributed Sequence Diagrams

### 4.1 Tenant Provisioning Workflow (Saga Pattern)

```
[Super Admin UI]     [API Gateway]     [Tenant Service]     [Event Bus (Kafka)]    [Billing Service]   [IAM Service]
       |                  |                    |                    |                      |                 |
       |-- POST Tenant -->|                    |                    |                      |                 |
       |   Form Data      |-- gRPC / HTTP ---->|                    |                      |                 |
       |                  |                    |-- 1. Create Record |                      |                 |
       |                  |                    |-- 2. Save Outbox   |                      |                 |
       |                  |                    |-- 3. Publish ----->|                      |                 |
       |                  |                    |  `tenant.created`  |-- Consume Event ---->|                 |
       |                  |                    |                    |                      |-- Provision     |
       |                  |                    |                    |                      |   Sub Contract |
       |                  |                    |                    |-- Consume Event ---------------------->|
       |                  |                    |                    |                      |                 |-- Provision
       |                  |                    |                    |                      |                 |   Owner Admin
       |<-- 201 Created --|<-- 201 Created ----|                    |                      |                 |   Account
```

---

## 5. API Gateway & Routing Configuration Specification

The API Gateway handles central HTTPS termination, JWT verification, rate limiting, and request routing to backend microservices.

```yaml
# Gateway Route Manifest (Kong / Envoy / NestJS Proxy)
routes:
  - path: /api/v1/tenants*
    service: tenant-service
    url: http://tenant-service:4001
    plugins:
      - jwt-auth
      - rbac-evaluator: { requiredScope: "tenants" }

  - path: /api/v1/iam*
    service: identity-iam-service
    url: http://identity-iam-service:4002
    plugins:
      - jwt-auth
      - rbac-evaluator: { requiredScope: "usersRbac" }

  - path: /api/v1/billing*
    service: billing-subscription-service
    url: http://billing-subscription-service:4003
    plugins:
      - jwt-auth
      - rbac-evaluator: { requiredScope: "billing" }

  - path: /api/v1/announcements*
    service: notification-broadcast-service
    url: http://notification-broadcast-service:4004
    plugins:
      - jwt-auth

  - path: /api/v1/audit*
    service: audit-compliance-service
    url: http://audit-compliance-service:4005
    plugins:
      - jwt-auth
      - rbac-evaluator: { requiredScope: "auditLogs" }

  - path: /api/v1/flags*
    service: feature-flag-service
    url: http://feature-flag-service:4006
    plugins:
      - jwt-auth
      - rbac-evaluator: { requiredScope: "featureFlags" }

  - path: /api/v1/ecosystem*
    service: gateway-ecosystem-service
    url: http://gateway-ecosystem-service:4007

  - path: /api/v1/support*
    service: support-ticket-service
    url: http://support-ticket-service:4008
```

---

## 6. Monorepo Implementation Architecture

To maintain monorepo ergonomics (`pnpm` + `Turborepo`), microservices will reside inside the `apps/` workspace alongside common shared packages in `packages/`:

```
 -Salon/
├── apps/
│   ├── web/                           # Super Admin & Branch Web Frontend
│   ├── api-gateway/                   # Central Routing & Auth Gateway (Port 4000)
│   ├── service-tenant/                # Tenant & Franchise Microservice (Port 4001)
│   ├── service-iam/                   # Identity & RBAC Microservice (Port 4002)
│   ├── service-billing/               # Subscription & Invoicing Microservice (Port 4003)
│   ├── service-notification/          # Broadcast & Push Microservice (Port 4004)
│   ├── service-audit/                 # Audit & Geolocation Log Service (Port 4005)
│   ├── service-feature-flag/          # Feature Flag & Rollout Service (Port 4006)
│   ├── service-ecosystem/             # API Keys & Webhooks Service (Port 4007)
│   └── service-support/               # Support Tickets & SLA Service (Port 4008)
├── packages/
│   ├── config/                        # Shared ESLint, TSConfig, Biome
│   ├── constants/                     # Shared System Constants
│   ├── events/                        # Event Schema definitions (Protobuf / Zod)
│   ├── types/                         # Shared DTOs & Interfaces
│   ├── ui/                            # Shared React Component Library
│   └── utils/                         # Logger, Crypto & Kafka client wrappers
├── docker/
│   ├── docker-compose.yml             # Local Microservices Dev Environment
│   └── docker-compose.override.yml
└── turbo.json                         # Turborepo build pipeline
```

---

## 7. Migration & Step-by-Step Refactoring Plan

### Phase 1: Frontend API Client Layer Abstraction
- Replace in-memory array mutations in `SuperAdminContext.tsx` with async RTK Query / TanStack Query hooks.
- Create API Service clients under `apps/web/src/modules/super-admin/api/` (`tenantApi.ts`, `billingApi.ts`, `iamApi.ts`).

### Phase 2: Core Microservices Extraction
- Extract `service-tenant`, `service-iam`, and `service-billing` into standalone NestJS / Fastify Node.js services.
- Configure `api-gateway` routes and database migrations via Prisma / Drizzle ORM.

### Phase 3: Event Bus Integration & Secondary Services Extraction
- Spin up Apache Kafka / RabbitMQ broker in `docker-compose.yml`.
- Extract `service-notification`, `service-audit`, `service-feature-flag`, `service-ecosystem`, and `service-support`.
- Implement Transactional Outbox pattern for zero event loss.

### Phase 4: Production Deployment & Observability
- Deploy Helm Charts to Kubernetes (EKS / GKE).
- Set up Prometheus metrics scraping (`/metrics`) and Grafana dashboards for cross-service tracing via OpenTelemetry.

---

## 8. Summary Traceability Matrix

| Super Admin UI Component | Backend Microservice Target | Primary Database Table | Core Domain Event |
| :--- | :--- | :--- | :--- |
| `ProvisionTenantModal.tsx` | `service-tenant` | `tenants`, `branches` | `tenant.provisioned` |
| `CreateAdminUserModal.tsx` | `service-iam` | `admin_users`, `global_roles` | `iam.user_created` |
| `SubscriptionPlanModal.tsx` | `service-billing` | `subscription_plans` | `billing.plan_created` |
| `CreateInvoiceModal.tsx` | `service-billing` | `invoices` | `billing.invoice_generated` |
| `CreateAnnouncementModal.tsx` | `service-notification` | `announcements` | `broadcast.dispatched` |
| `InspectAuditTraceModal.tsx` | `service-audit` | `audit_logs` | N/A (Event Consumer) |
| `CreateFeatureFlagModal.tsx` | `service-feature-flag` | `feature_flags` | `flag.toggled` |
| `GenerateApiKeyModal.tsx` | `service-ecosystem` | `api_keys` | `apikey.generated` |
| `InspectTicketModal.tsx` | `service-support` | `support_tickets` | `ticket.created` |
