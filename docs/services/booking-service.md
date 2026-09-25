# Service Documentation: Booking Service (`apps/services/booking-service`)

> **Appointment Scheduling, Real-Time Slot Calculations, Conflict Prevention & State Machine**

---

## 1. Overview & Responsibilities

The **Booking Service** manages appointment reservations across branches, stylists, and chairs. It enforces double-booking prevention, automated buffer intervals, multi-service sequences, appointment status state transitions, and real-time schedule grids.

```
                         BOOKING STATE MACHINE
                                   │
                                   ▼
                             [ CONFIRMED ]
                                   │
                   ┌───────────────┼───────────────┐
                   ▼               ▼               ▼
             [ CHECKED_IN ]   [ CANCELLED ]   [ NO_SHOW ]
                   │
                   ▼
             [ IN_SERVICE ]
                   │
                   ▼
             [ COMPLETED ]
```

### Key Responsibilities
- **Real-Time Slot Engine**: Computes open time slots considering operating hours, stylist shifts, station availability, and service durations.
- **Double-Booking Prevention**: Transactional slot locking in PostgreSQL preventing duplicate bookings for the same stylist or chair.
- **Multi-Service Sequencing**: Schedules multi-part appointments (e.g. Hair Wash -> Hair Coloring -> Hair Drying/Styling) with varying chair/stylist requirements.
- **Appointment State Machine**: Enforces valid state transitions: `PENDING` -> `CONFIRMED` -> `CHECKED_IN` -> `IN_SERVICE` -> `COMPLETED` / `CANCELLED` / `NO_SHOW`.
- **Buffer & Clean-up Times**: Automatic cooldown intervals between treatments for chair sanitization and equipment prep.
- **Walk-in Queue Management**: Quick-booking flow for walk-in clients with instant stylist allocation.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `BOOKING_SERVICE_PORT` / `PORT` | `3005` | HTTP listener port |
| **Database URL** | `BOOKING_DATABASE_URL` | `postgresql://.../booking_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration & slot locks |

---

## 3. Database Schema Entities (`booking_db`)

- **`Appointment`**: `id`, `tenantId`, `branchId`, `customerId`, `bookingCode`, `status`, `scheduledDate`, `startTime`, `endTime`, `totalDurationMinutes`, `totalAmount`, `notes`, `cancellationReason`
- **`AppointmentServiceItem`**: `id`, `appointmentId`, `serviceId`, `staffMemberId`, `stationId`, `sequenceOrder`, `startTime`, `endTime`, `durationMinutes`, `price`
- **`AppointmentLog`**: `id`, `appointmentId`, `previousStatus`, `newStatus`, `changedByUserId`, `timestamp`
- **`WalkInQueue`**: `id`, `tenantId`, `branchId`, `customerId`, `serviceIds`, `preferredStaffId`, `waitStatus`, `estimatedWaitMinutes`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:branch:{branchId}:calendar:{date}` (TTL: 60s)
- `tenant:{tenantId}:stylist:{staffId}:availability:{date}` (TTL: 60s)

---

## 5. Key API Endpoints

- `GET /api/v1/bookings/availability` (Computes free slots given date, branch, service, stylist)
- `POST /api/v1/bookings/appointments` (Creates appointment reservation)
- `GET /api/v1/bookings/appointments` (Lists appointments with calendar filters)
- `GET /api/v1/bookings/appointments/:id`
- `PATCH /api/v1/bookings/appointments/:id/status` (Updates status: `CHECKED_IN`, `IN_SERVICE`, `COMPLETED`, `CANCELLED`)
- `POST /api/v1/bookings/appointments/:id/reschedule`
- `GET /api/v1/bookings/walk-in-queue`
- `POST /api/v1/bookings/walk-in-queue`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.booking.created`
  - `salon.events.booking.confirmed`
  - `salon.events.booking.rescheduled`
  - `salon.events.booking.checked_in`
  - `salon.events.booking.completed`
  - `salon.events.booking.cancelled`
- **Consumed Events**:
  - `salon.events.people.roster.updated` -> Invalidates calendar slot caches
