# System Design: People Service Architecture

## 1. Domain & Boundary Responsibilities

`people-service` owns:
- Employee master records & HR profiles
- Stylist professional profiles & booking capability flags
- Staff branch assignments
- Stylist skills catalogue
- Shift definitions & Master rostering
- Attendance logs, geolocation clock-in/out & schedule variance computation
- Leave requests, approvals, and annual leave balances
- AES-encrypted sensitive statutory data (Aadhaar, PAN, Bank Details)
- Staff KYC document metadata references

`people-service` does NOT own:
- Authentication, passwords, JWT tokens (Owned by `identity-service`)
- Branches, rooms, chairs, salon physical resources (Owned by `organization-service`)
- Service master definitions and retail catalogue (Owned by `commerce-service`)
- Commissions, tip pool disbursement, net salary calculations (Owned by `finance-service`)
- Client CRM records (Owned by `customer-service`)
- Appointments and booking slot locking (Owned by `booking-service`)

## 2. Database Design & Logical References (`people_db`)
`people_db` maintains strictly logical UUID columns for external foreign entities without cross-database PostgreSQL foreign keys:
- `identityUserId`: Points logically to `identity_db.users.id`
- `primaryBranchId`, `branchId`: Points logically to `organization_db.branches.id`
- `serviceId`: Points logically to `commerce_db.services.id`
- `salaryStructureReferenceId`: Points logically to `finance_db.salary_structures.id`

## 3. Redis Read Layer Architecture
```
Incoming Read Request
        │
        ▼
[ PeopleReadStore (Redis) ]
   ├── HIT  ──► Return Cached DTO
   └── MISS ──► [ EmployeeRepository / Prisma ]
                     │
                     ▼
             [ PostgreSQL (people_db) ]
                     │
                     ▼
             Populate Redis with TTL & Return DTO
```

### Key Namespaces & TTLs
- `tenant:{tenantId}:staff:{employeeId}` (TTL: 3600s)
- `tenant:{tenantId}:branch:{branchId}:staff` (TTL: 1800s)
- `tenant:{tenantId}:staff:{employeeId}:branches` (TTL: 1800s)
- `tenant:{tenantId}:staff:{employeeId}:skills` (TTL: 3600s)
- `tenant:{tenantId}:branch:{branchId}:shifts` (TTL: 3600s)
- `tenant:{tenantId}:staff:{employeeId}:roster:{date}` (TTL: 900s)

*Sensitive statutory data (Aadhaar, PAN, Bank account) and live attendance are NEVER cached.*

## 4. RabbitMQ Domain Events
Versioned asynchronous events published to `salon.events.topic`:
- `EMPLOYEE_CREATED.v1`
- `EMPLOYEE_UPDATED.v1`
- `EMPLOYEE_ACTIVATED.v1`
- `EMPLOYEE_DEACTIVATED.v1`
- `STAFF_BRANCH_ASSIGNED.v1`
- `STAFF_BRANCH_REMOVED.v1`
- `STAFF_SKILL_UPDATED.v1`
- `ROSTER_UPDATED.v1`
- `ATTENDANCE_CLOCKED_IN.v1`
- `ATTENDANCE_CLOCKED_OUT.v1`
- `LEAVE_REQUESTED.v1`
- `LEAVE_APPROVED.v1`
- `LEAVE_REJECTED.v1`
