# Service Documentation: API Gateway (`apps/api-gateway`)

> **Ingress Router, Security Enforcement, Context Resolution & Distributed Rate Limiting**

---

## 1. Overview & Architecture

The **API Gateway** serves as the central unified entrypoint for all frontend web applications, mobile apps, and third-party webhook integrations. It provides a secure, hardened barrier in front of the microservice mesh, enforcing authentication, scope authorization, request correlation, and distributed rate limiting before proxying requests downstream.

```
                   CLIENT APPS (Web / Mobile)
                               │
                               ▼
                       ┌───────────────┐
                       │  API Gateway  │  (Port 3000)
                       └───────┬───────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    identity-service   organization-service   booking-service  ... (12 Services)
      (Port 3001)          (Port 3002)          (Port 3005)
```

### Key Responsibilities
- **Ingress Proxying**: Maps public `/api/v1/[domain]/*` routes to downstream backend microservices.
- **Strict Database Boundary**: **Zero database access**. API Gateway never connects to PostgreSQL or Prisma.
- **Authority Context Resolution**: Verifies JWT access tokens and fetches verified authority context from `Identity Service` via protected internal endpoints (`/internal/v1/auth/context`).
- **Scope & RBAC Enforcement**: Enforces multi-level tenant (`tenantId`), branch (`branchId`), franchise (`franchiseId`), and user permission requirements before forwarding requests.
- **Distributed Rate Limiting**: Redis-backed rate limiters for authentication endpoints (5 attempts/min), MFA verification, and general API routes.
- **Correlation & Tracing**: Injects and propagates `x-correlation-id` and `x-request-id` across downstream microservices.
- **Resilience & Controlled Degradation**: Returns standard `503 SERVICE_NOT_AVAILABLE` responses for unimplemented domain services.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `API_GATEWAY_PORT` / `PORT` | `3000` | Ingress HTTP listener port |
| **Node Environment** | `NODE_ENV` | `development` | `development`, `production`, `test` |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Connection string for rate limiting & cache |
| **JWT Access Secret** | `JWT_ACCESS_SECRET` | — | Secret key used to verify short-lived access JWTs |
| **Internal Service Secret** | `SERVICE_INTERNAL_SECRET` | — | Shared secret for inter-service internal endpoints |
| **Identity Service URL** | `IDENTITY_SERVICE_URL` | `http://localhost:3001` | Downstream Identity Service target |
| **Organization Service URL**| `ORGANIZATION_SERVICE_URL`| `http://localhost:3002` | Downstream Organization Service target |

---

## 3. Request Lifecycle & Middleware Pipeline

```
Incoming Request
  │
  ├─► 1. Helmet & CORS headers
  │
  ├─► 2. Correlation ID Middleware (generates `x-correlation-id`, `x-request-id`)
  │
  ├─► 3. Redis Rate Limiter (`authRateLimiter` / `apiRateLimiter`)
  │
  ├─► 4. Gateway Auth Middleware (Verifies Bearer JWT)
  │        └─► Calls `GET http://identity-service:3001/internal/v1/auth/context`
  │        └─► Attaches `req.user` & injects downstream headers:
  │              `x-user-id`, `x-user-type`, `x-tenant-id`, `x-branch-ids`, `x-franchise-id`
  │
  ├─► 5. Scope Middleware (`enforceTenantScope`, `enforceBranchScope`, `requireGatewayPermission`)
  │
  ├─► 6. Express Reverse Proxy (`http-proxy-middleware`)
  │        └─► Re-streams payload & forwards to target microservice
  │
  └─► 7. Centralized Error Handler (standard JSON envelope)
```

---

## 4. Routing & Proxy Map

| Ingress Path | Target Service | Downstream URL | Auth Required | Rate Limit |
|---|---|---|---|---|
| `/health`, `/ready`, `/metrics` | API Gateway Local | Local | No | None |
| `/docs` | Swagger UI | Local | No | None |
| `/api/v1/auth/*` | `identity-service` | `http://localhost:3001/api/v1/auth/*` | Mixed | 5 req / min |
| `/api/v1/users/*` | `identity-service` | `http://localhost:3001/api/v1/users/*` | Yes | 120 req / min |
| `/api/v1/roles/*` | `identity-service` | `http://localhost:3001/api/v1/roles/*` | Yes | 120 req / min |
| `/api/v1/permissions/*` | `identity-service` | `http://localhost:3001/api/v1/permissions/*` | Yes | 120 req / min |
| `/api/v1/organizations/*` | `organization-service` | `http://localhost:3002` | Yes | 120 req / min |
| `/api/v1/people/*` | `people-service` | `http://localhost:3003` | Yes | 120 req / min |
| `/api/v1/customers/*` | `customer-service` | `http://localhost:3004` | Yes | 120 req / min |
| `/api/v1/bookings/*` | `booking-service` | `http://localhost:3005` | Yes | 120 req / min |
| `/api/v1/commerce/*` | `commerce-service` | `http://localhost:3006` | Yes | 120 req / min |
| `/api/v1/payments/*` | `payment-service` | `http://localhost:3007` | Yes | 120 req / min |
| `/api/v1/inventory/*` | `inventory-service` | `http://localhost:3008` | Yes | 120 req / min |
| `/api/v1/finance/*` | `finance-service` | `http://localhost:3009` | Yes | 120 req / min |
| `/api/v1/communications/*` | `communication-service` | `http://localhost:3010` | Yes | 120 req / min |
| `/api/v1/platform/*` | `platform-service` | `http://localhost:3011` | Yes | 120 req / min |
| `/api/v1/reporting/*` | `reporting-service` | `http://localhost:3012` | Yes | 120 req / min |

---

## 5. Observability & Health Endpoints

- **`GET /health`**: Returns liveness status (`{"status": "UP", "service": "api-gateway"}`).
- **`GET /ready`**: Returns readiness status and Redis connection state.
- **`GET /metrics`**: Exposes Prometheus-compatible metrics prefixed with `api_gateway_`.
- **`GET /docs`**: Interactive Swagger UI API documentation.
