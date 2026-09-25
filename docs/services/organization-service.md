# Service Documentation: Organization Service (`apps/services/organization-service`)

> **Multi-Tenant Hierarchy, Brand Profiles, Franchise Agreements, Branch Operations & Regional Settings**

---

## 1. Overview & Responsibilities

The **Organization Service** manages the organizational hierarchy of salon chains, including Brand Tenants, Franchisee Networks, Physical Branch Locations, Operational Hours, Operating Chairs/Stations, and Regional Locale/Tax Configurations.

```
                    ┌─────────────────────────┐
                    │      TENANT (Brand)     │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
      ┌─────────────────────┐         ┌─────────────────────┐
      │  DIRECT BRANCHES    │         │  FRANCHISE PARTNER  │
      └─────────────────────┘         └──────────┬──────────┘
                                                 │
                                                 ▼
                                      ┌─────────────────────┐
                                      │ FRANCHISE BRANCHES  │
                                      └─────────────────────┘
```

### Key Responsibilities
- **Brand / Tenant Administration**: Profile, logo, domain, contact info, and legal registration.
- **Franchise Partner Management**: Franchise agreements, royalty percentages, and branch assignments.
- **Branch Lifecycle**: Physical address, geo-coordinates, contact details, station/chair capacity, and manager assignment.
- **Operating Hours & Holidays**: Weekly schedules, split-shifts, public holidays, and emergency closures per branch.
- **Branch Station / Chair Topology**: Salon chairs, wash stations, private spa rooms, and aesthetic booths.
- **Regional & Currency Settings**: Timezones, default currency, date formatting, and local tax identification numbers.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `ORGANIZATION_SERVICE_PORT` / `PORT` | `3002` | HTTP listener port |
| **Database URL** | `ORGANIZATION_DATABASE_URL` | `postgresql://.../organization_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration |
| **Internal Secret** | `SERVICE_INTERNAL_SECRET` | — | Protected inter-service auth key |

---

## 3. Database Schema Entities (`organization_db`)

- **`Tenant`**: `id`, `name`, `code`, `logoUrl`, `status`, `currency`, `timezone`, `taxNumber`, `createdAt`, `updatedAt`
- **`Franchise`**: `id`, `tenantId`, `name`, `code`, `ownerUserId`, `royaltyPercentage`, `contractStart`, `contractEnd`, `status`
- **`Branch`**: `id`, `tenantId`, `franchiseId`, `name`, `code`, `address`, `city`, `state`, `postalCode`, `phone`, `email`, `geoLat`, `geoLng`, `status`
- **`BranchOperatingHour`**: `id`, `branchId`, `dayOfWeek`, `isOpen`, `openTime`, `closeTime`
- **`BranchStation`**: `id`, `branchId`, `name`, `stationType` (`CHAIR`, `WASH_BASIN`, `SPA_ROOM`, `NAIL_STATION`), `isAvailable`
- **`BranchHoliday`**: `id`, `branchId`, `date`, `name`, `isRecurring`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:profile` (TTL: 600s)
- `tenant:{tenantId}:branches:active` (TTL: 300s)
- `tenant:{tenantId}:branch:{branchId}:hours` (TTL: 300s)
- `tenant:{tenantId}:branch:{branchId}:stations` (TTL: 300s)

---

## 5. Key API Endpoints

- `GET /api/v1/organizations/tenants/current`
- `PATCH /api/v1/organizations/tenants/current`
- `GET /api/v1/organizations/branches`
- `POST /api/v1/organizations/branches`
- `GET /api/v1/organizations/branches/:id`
- `PATCH /api/v1/organizations/branches/:id`
- `GET /api/v1/organizations/branches/:id/operating-hours`
- `PUT /api/v1/organizations/branches/:id/operating-hours`
- `GET /api/v1/organizations/branches/:id/stations`
- `POST /api/v1/organizations/branches/:id/stations`
- `GET /api/v1/organizations/franchises`
- `POST /api/v1/organizations/franchises`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.organization.tenant.created`
  - `salon.events.organization.tenant.updated`
  - `salon.events.organization.branch.created`
  - `salon.events.organization.branch.updated`
  - `salon.events.organization.branch.deactivated`
