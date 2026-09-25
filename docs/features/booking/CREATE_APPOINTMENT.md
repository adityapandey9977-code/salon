# Feature: Create Appointment

## 1. Business Context & Overview
Books a single or multi-service salon appointment with distributed Redis slot locking, historical pricing snapshot, staff attribution, and status history tracking.

## 2. Service Ownership
- **Owner**: `booking-service`
- **Database**: `booking_db` (table: `appointments`, `appointment_items`, `appointment_status_histories`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/appointments`
- **Permissions**: `appointment.create`
- **Request Body**:
```json
{
  "branchId": "d3b07384-d113-4672-881b-801264c93591",
  "customerId": "33333333-3333-3333-3333-333333333333",
  "scheduledStartAt": "2026-10-15T10:00:00.000Z",
  "scheduledEndAt": "2026-10-15T11:00:00.000Z",
  "items": [
    {
      "serviceId": "44444444-4444-4444-4444-444444444444",
      "staffId": "55555555-5555-5555-5555-555555555555",
      "scheduledStartAt": "2026-10-15T10:00:00.000Z",
      "scheduledEndAt": "2026-10-15T11:00:00.000Z",
      "price": 750
    }
  ]
}
```

## 4. Architecture & Persistence Flow
1. Validate Customer via `customer-service` internal summary.
2. Validate Staff availability & leave via `people-service`.
3. Acquire Redis distributed lock: `SET tenant:{t}:branch:{b}:booking-slot:{staff}:{start} {token} NX PX 30000`.
4. Run atomic PostgreSQL transaction: double check conflicts, insert `appointments`, insert `appointment_items`, insert `appointment_status_histories`.
5. Invalidate Redis calendar cache.
6. Release Redis lock.
7. Publish `AppointmentCreated` domain event to RabbitMQ.
