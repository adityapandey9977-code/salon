# Feature: Manage Walk-in Clients

## 1. Business Context & Overview
Supports rapid in-person walk-in queuing, immediate seat allocation, and live chair assignment.

## 2. Service Ownership
- **Owner**: `booking-service`
- **Database**: `booking_db` (table: `appointments`)

## 3. API Contract
- **Create Walk-in**: `POST /api/v1/appointments/walkins`
- **Seat Walk-in**: `PATCH /api/v1/appointments/walkins/:id/seat`
- **Permissions**: `walkin.manage`

## 4. Architecture & Persistence Flow
1. Insert appointment with `source = WALK_IN`, `status = CHECKED_IN`.
2. On seating, assign stylist and update `status = IN_SERVICE`.
3. Invalidate today's queue cache.
4. Publish `AppointmentCheckedIn` and `ServiceStarted` domain events.
