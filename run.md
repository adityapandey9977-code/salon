#   Salon SaaS — Startup & Run Guide

### 1. Seeded Dummy Accounts & Credentials

| Portal / Role | Email | Password | Scope |
|---|---|---|---|
| 👑 **Super Admin** (`/super-admin`) | `superadmin@digiflex.com` | `SuperAdmin@123!` | Platform |
| 🏢 **Salon Owner / Admin** (`/admin`) | `owner@glamour-salon.com` | `SuperAdmin@123!` | Tenant |
| 🏪 **Branch Manager** (`/branch-manager`) | `manager@glamour-salon.com` | `SuperAdmin@123!` | Branch |
| 🤝 **Franchise Partner** (`/franchise`) | `sanjay.chawla@apexwellness.in` | `Franchise@2026!` | Franchise |

---

### 2. How to Run Services & Frontend

#### Terminal 1: Backend Microservices (All 12 Services + API Gateway)
```powershell
pnpm dev:services
```
- **API Gateway**: `http://localhost:3030` (Swagger: `http://localhost:3030/docs`)
- **Identity Service**: `http://localhost:3001` (Swagger: `http://localhost:3001/docs`)
- **Organization Service**: `http://localhost:3002` (Swagger: `http://localhost:3002/docs`)
- **People Service**: `http://localhost:3003` (Swagger: `http://localhost:3003/docs`)
- **Customer Service**: `http://localhost:3004` (Swagger: `http://localhost:3004/docs`)
- **Booking Service**: `http://localhost:3005` (Swagger: `http://localhost:3005/docs`)
- **Commerce Service**: `http://localhost:3006` (Swagger: `http://localhost:3006/docs`)
- **Payment Service**: `http://localhost:3007` (Swagger: `http://localhost:3007/docs`)
- **Inventory Service**: `http://localhost:3008` (Swagger: `http://localhost:3008/docs`)
- **Finance Service**: `http://localhost:3009` (Swagger: `http://localhost:3009/docs`)
- **Communication Service**: `http://localhost:3010` (Swagger: `http://localhost:3010/docs`)
- **Platform Service**: `http://localhost:3011` (Swagger: `http://localhost:3011/docs`)
- **Reporting Service**: `http://localhost:3012` (Swagger: `http://localhost:3012/docs`)

#### Terminal 2: Web Application (Frontend)
```powershell
pnpm dev:web
```
- **Web App**: `http://localhost:5173`
- **Login Page**: `http://localhost:5173/login` (Protected RBAC routes redirect here automatically)

---

### 3. Database Management Commands (Already Completed)
```powershell
# Start docker containers
docker compose up postgres redis rabbitmq -d

# Generate Prisma clients
pnpm prisma:generate

# Apply migrations
pnpm db:migrate:identity
pnpm db:migrate:people

# Seed Super Admin, default roles, and staff specialists
pnpm seed:identity
pnpm seed:people
```
