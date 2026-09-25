#   Salon & Spa SaaS - API Gateway

## Responsibilities
- Central ingress reverse-proxy routing to microservices
- JWT authentication and session token verification
- Tenant, Franchise, Branch, and RBAC scope enforcement
- Correlation ID generation and distributed context propagation
- Global API rate limiting and security headers (Helmet, CORS)
- Aggregated OpenAPI / Swagger documentation (`/docs`)
- Liveness and readiness endpoints (`/health`, `/ready`)

## Port
`5000`

## Routes Map
- `/api/v1/auth/*` -> `identity-service` (5001)
- `/api/v1/roles/*` -> `identity-service` (5001)
- `/api/v1/branches/*` -> `organization-service` (5002)
- `/api/v1/organizations/*` -> `organization-service` (5002)
- `/api/v1/staff/*` -> `people-service` (5003)
- `/api/v1/customers/*` -> `customer-service` (5004)
- `/api/v1/appointments/*` -> `booking-service` (5005)
- `/api/v1/services/*` -> `commerce-service` (5006)
- `/api/v1/packages/*` -> `commerce-service` (5006)
- `/api/v1/memberships/*` -> `commerce-service` (5006)
- `/api/v1/billing/*` -> `commerce-service` (5006)
- `/api/v1/payments/*` -> `payment-service` (5007)
- `/api/v1/inventory/*` -> `inventory-service` (5008)
- `/api/v1/finance/*` -> `finance-service` (5009)
- `/api/v1/notifications/*` -> `communication-service` (5010)
- `/api/v1/platform/*` -> `platform-service` (5011)
- `/api/v1/super-admin/*` -> `platform-service` (5011)
- `/api/v1/dashboard/*` -> `reporting-service` (5012)
- `/api/v1/reports/*` -> `reporting-service` (5012)
- `/api/v1/audit/*` -> `reporting-service` (5012)
