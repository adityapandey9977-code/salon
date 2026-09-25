# Backend Microservices Architecture Specification

##   Multi-Tenant Salon & Spa SaaS Platform

---

## 1. Executive Summary & Monorepo Topology

The backend of   Salon SaaS follows a distributed **Database-Per-Service Microservices Architecture** contained inside a PNPM + Turborepo monorepo. It features 12 domain microservices, 1 unified API Gateway, RabbitMQ event choreography, Redis transient state/slot locking, and logically isolated PostgreSQL databases.

```
apps/
├── web/                     # React Frontend (Preserved)
├── customer-mobile/         # Expo React Native App (Preserved)
├── api-gateway/             # Port 5000: Edge Ingress, JWT Validation & Reverse Proxy
└── services/
    ├── identity-service/    # Port 5001 (identity_db): Auth, RBAC, Users, JWT
    ├── organization-service/# Port 5002 (organization_db): Tenants, Franchises, Branches, Resources
    ├── people-service/      # Port 5003 (people_db): Staff, Rosters, Shifts, Attendance, HR
    ├── customer-service/    # Port 5004 (customer_db): CRM, Leads, Cautions, Preferences
    ├── booking-service/     # Port 5005 (booking_db): Appointments, Holds, Allocations, Waitlist
    ├── commerce-service/    # Port 5006 (commerce_db): Catalogue, Invoicing, POS Cart, Wallet, Loyalty
    ├── payment-service/     # Port 5007 (payment_db): Intents, Gateways, Refunds, Webhooks
    ├── inventory-service/   # Port 5008 (inventory_db): SKUs, Stock, Batches, Movements, POs
    ├── finance-service/     # Port 5009 (finance_db): Chart of Accounts, Commissions, Royalties
    ├── communication-service/# Port 5010 (communication_db): Multi-Channel Alerts, Telephony
    ├── platform-service/    # Port 5011 (platform_db): SaaS Provisioning, Plans, Entitlements
    └── reporting-service/   # Port 5012 (reporting_db): Dashboards, Analytics & Immutable Audit Logs

packages/
├── contracts/               # Shared Request/Response DTO contracts
├── events/                  # Domain Event Envelopes, Types & RabbitMQ Bus
├── logger/                  # Pino structured logging with field redaction
├── observability/           # AsyncLocalStorage context & request metrics
├── common-types/            # Standard error hierarchy & API response envelopes
└── test-utils/              # Test harness, factories & mock event bus
```

---

## 2. Microservice Boundaries & Database Ownership

| Microservice | Port | Logical Database | Primary Ownership / Responsibilities |
|---|---|---|---|
| **`identity-service`** | `5001` | `identity_db` | Authentication, Bcrypt, JWT tokens, Refresh tokens, MFA, Users, Roles, Permissions, Scope assignments |
| **`organization-service`** | `5002` | `organization_db` | Tenant hierarchy, Brands, Franchise partner metadata, Branches, Rooms, Chairs, Equipment, Operating hours, Holidays |
| **`people-service`** | `5003` | `people_db` | Staff profiles, Branch assignments, Skills, Roster, Shifts, Attendance, Leave requests, Statutory HR info |
| **`customer-service`** | `5004` | `customer_db` | Customer CRM, Leads, Client notes, Medical/Allergy cautions, Service preferences, Segmentation tags |
| **`booking-service`** | `5005` | `booking_db` | Appointments, Line items, Staff/Room allocations, Real-time availability, Slot holds, Waitlists, Walk-ins |
| **`commerce-service`** | `5006` | `commerce_db` | Service catalogue, Branch pricing, BOM recipes, Packages, Memberships, Wallet, Loyalty, Coupons, Invoices |
| **`payment-service`** | `5007` | `payment_db` | Payment intents, Deposits, Razorpay/Stripe gateways, POS terminals, Webhooks, Refunds, Reconciliation |
| **`inventory-service`** | `5008` | `inventory_db` | Master SKU catalogue, Branch stock, Batches, Immutable stock movements, Suppliers, POs, Transfers, Adjustments |
| **`finance-service`** | `5009` | `finance_db` | Chart of accounts, General ledger, Staff commission ledger, Tip settlements, Franchise royalty engine |
| **`communication-service`** | `5010` | `communication_db` | WhatsApp, SMS, Email, Push notifications, Message templates, Marketing campaigns, Telephony routing |
| **`platform-service`** | `5011` | `platform_db` | SaaS Tenant provisioning, Subscription plans, Feature flags, Entitlements, Custom domains, White-labeling |
| **`reporting-service`** | `5012` | `reporting_db` | Business intelligence projections, Executive dashboards, Report exports, Append-only immutable audit trail |

---

## 3. Database Isolation Rules

1. **Strictly Database-Per-Service**: Under no circumstances does a service connect directly to or query another service's database.
2. **Zero Cross-Database Foreign Keys**: Entities across boundaries are linked purely via UUID fields:
   - `clientId String @db.Uuid` (References `customer-service`)
   - `branchId String @db.Uuid` (References `organization-service`)
   - `serviceId String @db.Uuid` (References `commerce-service`)
   - `staffId String @db.Uuid` (References `people-service`)
   - `invoiceId String @db.Uuid` (References `commerce-service`)
   - `skuId String @db.Uuid` (References `inventory-service`)
3. **No Distributed Transactions**: Inter-service coordination uses local transactions + asynchronous domain events.

---

## 4. Asynchronous Event-Driven Choreography

All domain events are published to RabbitMQ (`salon.events.topic` exchange) using the standard **Event Envelope**:

```json
{
  "eventId": "UUID",
  "eventType": "SaleCompleted",
  "eventVersion": 1,
  "occurredAt": "2026-09-03T18:00:00.000Z",
  "tenantId": "UUID",
  "branchId": "UUID",
  "franchiseId": "UUID | null",
  "actorUserId": "UUID | null",
  "correlationId": "UUID",
  "causationId": "UUID | null",
  "aggregateType": "Invoice",
  "aggregateId": "UUID",
  "payload": { ... }
}
```

### Core Event Flows

#### Flow A: Appointment Booking Lifecycle
1. Gateway receives `POST /api/v1/appointments`.
2. `booking-service` acquires temporary Redis slot lock (`lock:slot:{branchId}:{staffId}:{time}`).
3. Overlap check passes -> Appointment and line items are persisted to `booking_db`.
4. `booking-service` releases Redis lock and publishes `AppointmentCreated`.
5. Consumers:
   - `communication-service`: Sends WhatsApp booking confirmation to client.
   - `reporting-service`: Updates daily appointment forecast metric.
   - `reporting-service (Audit Worker)`: Writes immutable audit record.

#### Flow B: Service Execution & Completion
1. Appointment service completed -> `booking-service` updates status and publishes `ServiceCompleted`.
2. Consumers:
   - `inventory-service`: Automatically deducts consumable materials according to service recipe BOM.
   - `commerce-service`: Stages POS cart for quick front-desk checkout.
   - `customer-service`: Increments client visit count and records visit timestamp.

#### Flow C: POS Checkout & Sale Completion
1. Front desk checks out cart -> `commerce-service` creates Invoice, computes GST, records payment, and publishes `SaleCompleted`.
2. Consumers:
   - `inventory-service`: Deducts retail product stock from branch inventory.
   - `finance-service`: Computes staff commission ledger entry & franchise royalty calculations.
   - `customer-service`: Updates client total lifetime spend and tier ranking.
   - `communication-service`: Dispatches digital receipt link to client via SMS/WhatsApp.
   - `reporting-service`: Updates daily revenue dashboards and audit ledger.

---

## 5. Security & Ingress Context Propagation

- The **API Gateway** acts as the single public entrypoint on port `5000`.
- It validates JWT tokens, resolves tenant/franchise/branch permissions, and injects context headers into all downstream microservice requests:
  - `x-request-id`: Unique request trace ID
  - `x-correlation-id`: Distributed trace correlation ID
  - `x-user-id`: Authenticated user UUID
  - `x-tenant-id`: Tenant UUID
  - `x-franchise-id`: Franchise UUID (if applicable)
  - `x-branch-ids`: Array of authorized branch UUIDs
  - `x-role`: Role code (`SUPER_ADMIN`, `TENANT_ADMIN`, `BRANCH_MANAGER`, `STAFF`)
  - `x-permissions`: Permission codes list
  - `x-internal-secret`: Service-to-service internal shared secret
