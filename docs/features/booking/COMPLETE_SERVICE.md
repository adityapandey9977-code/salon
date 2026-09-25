# Feature: Complete Salon Service

## 1. Business Context & Overview
Marks an active service as finished, allowing the front desk to immediately generate a POS invoice for checkout.

## 2. Service Ownership
- **Owner**: `booking-service`
- **Database**: `booking_db` (table: `appointments`)

## 3. API Contract
- **Endpoint**: `PATCH /api/v1/appointments/:id/complete`
- **Permissions**: `appointment.complete`

## 4. Architecture & Persistence Flow
1. Update appointment `status = COMPLETED`, set `completedAt = now()`.
2. Invalidate cache.
3. Publish `AppointmentCompleted` and `ServiceCompleted` events.
