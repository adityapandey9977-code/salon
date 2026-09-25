#   Salon & Spa SaaS — Backend Microservices Architecture

## 1. Locked Service Ownership & Database Topology
Each microservice owns its own isolated logical PostgreSQL database, schema, migrations, seed, Redis read layer, and RabbitMQ publisher/subscriber. No cross-database queries or joins are permitted.

| Service | Logical Database | Primary Ownership |
| :--- | :--- | :--- |
| `identity-service` | `identity_db` | User auth, `TenantCredential` auth, sessions, roles, permissions |
| `organization-service` | `organization_db` | Salon business Tenants, Branches, Franchises, business hours |
| `people-service` | `people_db` | Staff/Employee profiles, rosters, attendance facts, leaves |
| `customer-service` | `customer_db` | Customers, leads, notes, marketing preferences |
| `booking-service` | `booking_db` | Appointments, slots, calendar schedules, tele-booking |
| `commerce-service` | `commerce_db` | Service catalogue, packages, memberships, invoices |
| `payment-service` | `payment_db` | Payment transactions, refunds, gateway webhooks |
| `platform-service` | `platform_db` | SaaS plans, subscriptions, feature flags, custom domains, provisioning |
| `inventory-service` | `inventory_db` | SKU master, stock ledger, procurement (PO/GRN), transfers, stocktake |
| `finance-service` | `finance_db` | Chart of accounts, double-entry journals, commissions, payroll, royalties |
| `communication-service` | `communication_db` | Multi-channel templates, notifications, campaigns, call center logs |
| `reporting-service` | `reporting_db` | Read-optimized analytics projections, dashboards, audit events |

## 2. Dual-Principal Authentication Model
- **`SUPER_ADMIN`**: Identity `User` with `principalType: 'USER'`, `SUPER_ADMIN` role, and platform scope.
- **`TENANT_ADMIN`**: Direct salon owner authentication using `TenantCredential` with `principalType: 'TENANT'`. Does NOT create or require a salon admin `User`.
- **`STAFF_USER`**: Branch manager, stylist, finance/HR, or call center agent represented as an Identity `User` + People `Employee` profile.

## 3. Asynchronous RabbitMQ Event Choreography
State synchronization across service boundaries is conducted exclusively via versioned domain events (`*.v1`) over RabbitMQ topic exchange `salon.events.topic`.
- Critical writes commit to local PostgreSQL before emitting events.
- Consumers implement idempotent handlers with deduplication.

## 4. Redis-First Safe Read Architecture
- PostgreSQL is the sole authoritative persistence tier.
- Redis acts as a high-performance safe read cache with short TTL (30s to 300s).
- Mutations invalidate relevant cache keys on transaction commit.
- Sensitive financial credentials, secrets, and private HR facts are never cached in Redis.

## 5. End-to-End Business Lifecycles
- **Provisioning Saga**: Super Admin $\rightarrow$ Platform validates plan $\rightarrow$ Org creates Tenant $\rightarrow$ Identity creates `TenantCredential` $\rightarrow$ Platform creates `TenantSubscription` $\rightarrow$ Emits `TENANT_PROVISIONED.v1`.
- **Sale Lifecycle**: POS Invoice paid $\rightarrow$ `SALE_COMPLETED.v1` $\rightarrow$ Inventory deducts retail/BOM stock $\rightarrow$ Finance posts balanced journal & calculates commissions/royalties $\rightarrow$ Communication sends customer receipt $\rightarrow$ Reporting aggregates daily revenue.
- **Franchise Royalty Engine**: 3-tier hierarchy (`BranchRoyaltyOverride` $\rightarrow$ `RoyaltyRule` $\rightarrow$ `Tenant/Brand Default`).
