#   Salon & Spa SaaS — Backend Microservices Directory

> **Master Map of 13 Specialized Microservices, Logical Databases, Ports & Architectural Roles**

---

## 1. Services Architecture Matrix

| # | Service Name | Path | Port | Logical Database | Primary Responsibility |
|---|---|---|---|---|---|
| **00** | **API Gateway** | `apps/api-gateway` | `3000` | *None* (Stateless Proxy) | Ingress routing, rate limiting, JWT & scope enforcement |
| **01** | **Identity Service** | `apps/services/identity-service` | `3001` | `identity_db` | Authentication, RBAC, Scopes, Sessions, MFA, User Authority |
| **02** | **Organization Service** | `apps/services/organization-service` | `3002` | `organization_db` | Brands, Franchises, Branches, Operating Hours, Stations |
| **03** | **People Service** | `apps/services/people-service` | `3003` | `people_db` | Staff, Stylist Skills, Shift Rosters, Attendance, Leaves |
| **04** | **Customer Service** | `apps/services/customer-service` | `3004` | `customer_db` | Client 360, Consultations, Formulas, Loyalty Points |
| **05** | **Booking Service** | `apps/services/booking-service` | `3005` | `booking_db` | Appointments, Real-time Slots, Double-booking lock, State Machine |
| **06** | **Commerce Service** | `apps/services/commerce-service` | `3006` | `commerce_db` | Service Menu, Packages, Memberships, Products, Gift Cards |
| **07** | **Payment Service** | `apps/services/payment-service` | `3007` | `payment_db` | POS Terminal, Multi-tender Split Bills, Invoices, Refunds |
| **08** | **Inventory Service** | `apps/services/inventory-service` | `3008` | `inventory_db` | Retail vs Pro Stock, Purchase Orders, Inter-Branch Transfers |
| **09** | **Finance Service** | `apps/services/finance-service` | `3009` | `finance_db` | Double-entry Ledgers, Cash Drawers, Expenses, Payroll, P&L |
| **10** | **Communication Service** | `apps/services/communication-service` | `3010` | `communication_db` | WhatsApp, SMS, Transactional Emails, Push Notifications |
| **11** | **Platform Service** | `apps/services/platform-service` | `3011` | `platform_db` | Multi-tenant SaaS Plans, Feature Flags, Platform Audit |
| **12** | **Reporting Service** | `apps/services/reporting-service` | `3012` | `reporting_db` | Aggregated Analytics, Revenue Trends, Stylist KPIs, Exports |

---

## 2. Shared Architectural Rules

1. **Database-Per-Service**: Every service exclusively accesses its own logical PostgreSQL database. No foreign joins or cross-database relations exist. Foreign entities are referenced strictly by UUID.
2. **Redis-First Read Pattern**: All read operations query Redis for safe projections first. On cache miss, they query PostgreSQL and warm up Redis with a configurable TTL.
3. **Authoritative Writes**: All mutations commit to PostgreSQL transactions **before** invalidating Redis caches.
4. **Security Exception**: Credentials (`passwordHash`, MFA secrets, refresh tokens) are **never** stored in Redis.
5. **Event Choreography**: Cross-service state synchronization uses RabbitMQ topic exchange (`salon.events.topic`).

---

## 3. Dedicated Service Documentation Links

- [API Gateway Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/api-gateway.md)
- [Identity Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/identity-service.md)
- [Organization Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/organization-service.md)
- [People Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/people-service.md)
- [Customer Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/customer-service.md)
- [Booking Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/booking-service.md)
- [Commerce Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/commerce-service.md)
- [Payment Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/payment-service.md)
- [Inventory Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/inventory-service.md)
- [Finance Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/finance-service.md)
- [Communication Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/communication-service.md)
- [Platform Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/platform-service.md)
- [Reporting Service Documentation](file:///e:/salon%20management%20system/ -Salon/docs/services/reporting-service.md)
