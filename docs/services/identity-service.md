# Service Documentation: Identity Service (`apps/services/identity-service`)

> **Authentication, Authorization, Multi-Principal Architecture (Super Admin User & Direct TenantPrincipal), RBAC, User Scopes, Sessions, MFA & Redis-Accelerated Read Store**

---

## 1. Overview & Responsibilities

The **Identity Service** is the central authority for authentication, credential validation, RBAC permissions, multi-tenant scope assignments, session lifecycles, and MFA verification.

### Core Multi-Principal Model
1. **Super Admin (`SUPER_ADMIN`)**: Real Platform human `User` stored in `identity_db` with `SUPER_ADMIN` role and `PLATFORM` scope.
2. **Tenant / Salon Owner (`TENANT`)**: The Salon/Tenant itself logs in directly as `AuthPrincipalType.TENANT` using `TenantCredential` in `identity_db`. It links logically by UUID to `organization_db.organization_tenants.id` without any intermediate `SALON_ADMIN` User record.
3. **Staff Users**: Delegated human users (`User`) with roles such as `BRANCH_MANAGER`, `FINANCE_HR`, `STYLIST`, scoped to branch or tenant via `UserScopeAssignment`.

```
                    PLATFORM

              Super Admin Login
                     │
                     ▼
              identity-service
                     │
                 User record
                     │
                     ▼
              PLATFORM authority


                   TENANT

              Salon Direct Login
                     │
                     ▼
              identity-service
                     │
             TenantCredential
                     │
               logical tenantId (UUID)
                     │
                     ▼
           organization-service
                     │
             OrganizationTenant
                     │
              TENANT authority
```

### Key Responsibilities
1. **Authoritative Credential Validation**: Secure storage and verification of passwords via Bcrypt (`passwordHash` is **never** cached).
2. **Redis-First Read-Through Architecture**: Safe projections (`CachedUserProfile`, `CachedTenantProfile`, `CachedEffectiveAccess`, `CachedSessionMetadata`) are served from Redis on cache hit; DB fallback on cache miss with automatic warmup.
3. **Session Management & Token Rotation**: Refresh token family reuse detection, automatic session revocation upon security breach or password change.
4. **MFA Foundation**: TOTP verification challenge flows with temporary challenge state in Redis and encrypted secret persistence in DB.
5. **RBAC Engine**: Aggregates effective permissions from canonical system roles and tenant admin policies.
6. **Multi-Level Scope Engine**: Manages user scope assignments across `PLATFORM`, `TENANT`, `FRANCHISE`, `BRANCH`, and `SELF`.
7. **Gateway Context Provider**: Exposes `/internal/v1/auth/context` protected by `SERVICE_INTERNAL_SECRET` for token context resolution across all principal types.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `IDENTITY_SERVICE_PORT` / `PORT` | `3001` | HTTP listener port |
| **Database URL** | `IDENTITY_DATABASE_URL` | `postgresql://.../identity_db` | Dedicated PostgreSQL connection |
| **DB Connection Pool** | `DB_CONNECTION_LIMIT` / `DB_POOL_TIMEOUT` | `10` / `10` | Prisma connection pool parameters |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache & transient session store |
| **JWT Access Secret** | `JWT_ACCESS_SECRET` | — | Signing key for short-lived access JWTs |
| **JWT Access TTL** | `JWT_ACCESS_TTL` | `15m` | Access token lifespan |
| **JWT Refresh Secret** | `JWT_REFRESH_SECRET` | — | Refresh token validation key |
| **JWT Refresh TTL** | `JWT_REFRESH_TTL` | `7d` | Refresh token lifespan |
| **Internal Secret** | `SERVICE_INTERNAL_SECRET` | — | Protected inter-service auth key |
| **Profile Cache TTL** | `USER_PROFILE_CACHE_TTL` | `300` (5 mins) | Redis TTL for safe user/tenant profile |
| **Permission Cache TTL**| `USER_PERMISSION_CACHE_TTL`| `60` (1 min) | Redis TTL for effective permissions |
| **Role Cache TTL** | `USER_ROLE_CACHE_TTL` | `60` (1 min) | Redis TTL for user role list |
| **Scope Cache TTL** | `USER_SCOPE_CACHE_TTL` | `60` (1 min) | Redis TTL for scope assignments |
| **Session Cache TTL** | `SESSION_CACHE_TTL` | `60` (1 min) | Redis TTL for safe session metadata |

---

## 3. Database Schema (`identity_db`)

```mermaid
erDiagram
    USER ||--o{ USER_ROLE : has
    ROLE ||--o{ USER_ROLE : contains
    ROLE ||--o{ ROLE_PERMISSION : includes
    PERMISSION ||--o{ ROLE_PERMISSION : grants
    USER ||--o{ USER_SCOPE_ASSIGNMENT : scopes
    USER ||--o{ SESSION : creates
    TENANT_CREDENTIAL ||--o{ SESSION : creates
    SESSION ||--o{ REFRESH_TOKEN : owns
    USER ||--o{ MFA_METHOD : configures
    LOGIN_ATTEMPT : logs
```

### Models
1. **`User`**: Core human user record (`id`, `userType`, `fullName`, `email`, `mobilePhone`, `passwordHash`, `status`, `isMfaRequired`, `isMfaEnabled`, `failedLoginAttempts`, `lockedUntil`, `lastLoginAt`).
2. **`TenantCredential`**: Direct login credentials for Tenant principal (`id`, `tenantId`, `loginEmail`, `normalizedEmail`, `mobilePhone`, `passwordHash`, `status`, `isMfaRequired`, `isMfaEnabled`, `failedLoginAttempts`, `lockedUntil`, `lastLoginAt`).
3. **`Role`**: System and tenant roles (`id`, `name`, `code`, `description`, `isSystem`).
4. **`Permission`**: Granular permissions (`id`, `name`, `code`, `module`, `description`).
5. **`UserRole`**: Join table mapping users to roles.
6. **`RolePermission`**: Join table mapping roles to permissions.
7. **`UserScopeAssignment`**: User tenancy context (`id`, `userId`, `scopeType`, `tenantId`, `franchiseId`, `branchId`).
8. **`Session`**: Authoritative sessions supporting multi-principals (`id`, `principalType`, `userId`, `tenantCredentialId`, `tokenFamily`, `status`, `ipAddress`, `userAgent`, `expiresAt`).
9. **`RefreshToken`**: Rotated tokens (`id`, `sessionId`, `tokenHash`, `isUsed`, `isRevoked`, `expiresAt`).
10. **`MfaMethod`**: Encrypted MFA configurations (`id`, `userId`, `mfaType`, `secretEncrypted`, `isVerified`).
11. **`LoginAttempt`**: Audit log of login attempts (`id`, `email`, `ipAddress`, `userAgent`, `isSuccess`, `failureReason`).

---

## 4. Redis-First Read Architecture

### Safe Cache DTO Projections
To strictly protect sensitive data, credentials (`passwordHash`, MFA secrets, refresh tokens) are **never** stored in Redis. Only safe DTO projections are cached:
- **`CachedUserProfile`**: `{ id, userType, fullName, email, mobilePhone, status, isMfaRequired, isMfaEnabled, lastLoginAt }`
- **`CachedTenantProfile`**: `{ credentialId, tenantId, loginEmail, mobilePhone, status, salonName, tenantCode, isMfaRequired, isMfaEnabled, lastLoginAt }`
- **`CachedEffectiveAccess`**: `{ userId, roles[], permissions[], tenantId, franchiseId, branchIds[], scopeTypes[] }`
- **`CachedTenantEffectiveAccess`**: `{ tenantId, credentialId, role: 'TENANT_ADMIN', scopeType: 'TENANT', permissions[] }`
- **`CachedSessionMetadata`**: `{ id, principalType, userId, tenantCredentialId, tokenFamily, status, expiresAt }`
- **`CachedUserScope`**: `{ id, scopeType, tenantId, franchiseId, branchId }`

### Redis Cache Keys
- `platform:user:{userId}` or `tenant:{tenantId}:user:{userId}`
- `identity:user-email:{normalizedEmail}`
- `identity:user:{userId}:permissions`
- `identity:user:{userId}:roles`
- `identity:user:{userId}:scopes`
- `identity:user:{userId}:effective-access`
- `identity:user:{userId}:session:{sessionId}`
- `identity:mfa-challenge:{challengeId}`

### Post-Commit Invalidation Pipeline
Writes always commit to PostgreSQL **first**. After the transaction succeeds, affected Redis keys are purged:
- **User Profile Update** -> Purge user profile & email index keys.
- **Role / Permission Assignment** -> Purge user access & permission caches for all affected users.
- **Scope Assignment** -> Purge user scopes & effective access keys.
- **Logout / Password Reset / Suspension** -> Revoke DB session and purge Redis session projections.

---

## 5. API Endpoints

### Public & Authentication APIs
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Email/password login; issues JWT or MFA challenge | No |
| `POST` | `/api/v1/auth/refresh-token`| Rotates refresh token & issues new access token | No |
| `POST` | `/api/v1/auth/logout` | Revokes server session & purges cache | Bearer JWT |
| `GET` | `/api/v1/auth/me` | **Redis-first read** for current user profile & access | Bearer JWT |
| `POST` | `/api/v1/auth/mfa/verify` | Verifies TOTP challenge code | No |
| `POST` | `/api/v1/auth/forgot-password`| Dispatches password reset token | No |
| `POST` | `/api/v1/auth/reset-password` | Resets password & revokes existing sessions | No |
| `GET` | `/api/v1/auth/sessions` | Lists active sessions for current user | Bearer JWT |
| `DELETE`| `/api/v1/auth/sessions/:id` | Revokes a specific session | Bearer JWT |

### User Management APIs
| Method | Endpoint | Permission Required | Description |
|---|---|---|---|
| `GET` | `/api/v1/users` | `user.read` | Paginated user list with filters |
| `POST` | `/api/v1/users` | `user.create` | Creates new user with role assignments |
| `GET` | `/api/v1/users/:id` | `user.read` | **Redis-first read** for user profile |
| `PATCH`| `/api/v1/users/:id` | `user.update` | Updates user details with cache invalidation |
| `POST` | `/api/v1/users/:id/suspend` | `user.suspend` | Locks user and revokes active sessions |
| `POST` | `/api/v1/users/:id/activate` | `user.update` | Activates suspended user |
| `POST` | `/api/v1/users/:id/roles` | `role.manage` | Assigns roles to user |
| `DELETE`| `/api/v1/users/:id/roles/:roleId`| `role.manage` | Removes role from user |
| `GET` | `/api/v1/users/:id/effective-access`| `user.read` | **Redis-backed** effective access DTO |
| `GET` | `/api/v1/users/:id/scopes` | `user.read` | Lists user scope assignments |
| `POST` | `/api/v1/users/:id/scopes` | `user.update` | Assigns new scope (enforcing scope rules) |
| `DELETE`| `/api/v1/users/:id/scopes/:scopeId`| `user.update` | Deletes scope assignment |

### Roles & Permissions APIs
| Method | Endpoint | Permission Required | Description |
|---|---|---|---|
| `GET` | `/api/v1/roles` | `role.read` | Lists all roles with assigned permissions |
| `POST` | `/api/v1/roles` | `role.manage` | Creates custom role |
| `GET` | `/api/v1/roles/:id` | `role.read` | Retrieves role by ID |
| `PATCH`| `/api/v1/roles/:id` | `role.manage` | Updates role name/description |
| `PUT` | `/api/v1/roles/:id/permissions`| `role.manage` | Updates permissions assigned to role |
| `GET` | `/api/v1/permissions` | `role.read` | Lists all 30 system permissions |

### Inter-Service Authority Context
| Method | Endpoint | Security Header | Description |
|---|---|---|---|
| `GET` | `/internal/v1/auth/context` | `x-service-secret` | Resolves full authority context for API Gateway |

---

## 6. Observability & Health

- **`GET /health`**: Returns liveness status (`{"status": "UP", "service": "identity-service"}`).
- **`GET /ready`**: Readiness check validating PostgreSQL connectivity and Redis health.
- **`GET /metrics`**: Exposes Prometheus metrics prefixed with `identity_service_`.
- **`GET /docs`**: Interactive Swagger UI API documentation.
