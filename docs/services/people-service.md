# Service Documentation: People Service (`apps/services/people-service`)

> **Staff Profiles, Stylist Capabilities, Shift Rosters, Attendance, Leaves & Commission Structures**

---

## 1. Overview & Responsibilities

The **People Service** manages the human workforce across the salon chain. It coordinates staff employment records, stylist service specializations, branch shift rotas, clock-in/out attendance logs, leave requests, and performance commission rules.

### Key Responsibilities
- **Staff Master Directory**: Employee ID, job title, contact details, branch assignments, hire date, and status.
- **Stylist Capabilities**: Service categories qualified to perform, service execution duration buffers, and skill ratings.
- **Shift Scheduling & Rostering**: Weekly branch rotas, working days, break intervals, and on-call assignments.
- **Attendance & Time Tracking**: Clock-in / clock-out timestamps, geo-fenced mobile check-ins, overtime calculations, and shift variances.
- **Leave & Absence Management**: Vacation, sick leave, maternity leave, and emergency approvals.
- **Commission & Incentive Schemas**: Tiered percentage rates for service execution vs. retail product sales.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `PEOPLE_SERVICE_PORT` / `PORT` | `3003` | HTTP listener port |
| **Database URL** | `PEOPLE_DATABASE_URL` | `postgresql://.../people_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration |

---

## 3. Database Schema Entities (`people_db`)

- **`StaffMember`**: `id`, `tenantId`, `branchId`, `userId`, `employeeCode`, `designation`, `phone`, `email`, `status`, `hiredAt`
- **`StylistSkill`**: `id`, `staffMemberId`, `serviceId`, `customDurationMinutes`, `proficiencyLevel`
- **`ShiftRoster`**: `id`, `tenantId`, `branchId`, `staffMemberId`, `date`, `startTime`, `endTime`, `isDayOff`
- **`AttendanceLog`**: `id`, `staffMemberId`, `branchId`, `clockIn`, `clockOut`, `breakDurationMinutes`, `status`
- **`LeaveRequest`**: `id`, `staffMemberId`, `leaveType`, `startDate`, `endDate`, `status`, `approvedBy`
- **`CommissionPlan`**: `id`, `tenantId`, `name`, `serviceCommissionRate`, `productCommissionRate`, `tierMinSales`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:branch:{branchId}:staff:active` (TTL: 300s)
- `tenant:{tenantId}:stylist:{staffMemberId}:skills` (TTL: 300s)
- `tenant:{tenantId}:branch:{branchId}:roster:{date}` (TTL: 120s)

---

## 5. Key API Endpoints

- `GET /api/v1/people/staff`
- `POST /api/v1/people/staff`
- `GET /api/v1/people/staff/:id`
- `PATCH /api/v1/people/staff/:id`
- `GET /api/v1/people/staff/:id/skills`
- `PUT /api/v1/people/staff/:id/skills`
- `GET /api/v1/people/rosters`
- `POST /api/v1/people/rosters/bulk`
- `POST /api/v1/people/attendance/clock-in`
- `POST /api/v1/people/attendance/clock-out`
- `GET /api/v1/people/leaves`
- `POST /api/v1/people/leaves`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.people.staff.created`
  - `salon.events.people.staff.updated`
  - `salon.events.people.roster.updated`
  - `salon.events.people.attendance.clocked_in`
