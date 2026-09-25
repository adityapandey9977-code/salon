# Feature: Reschedule Appointment

## 1. Business Context & Overview
Changes the date, time slot, or assigned stylist for an upcoming appointment while verifying availability.

## 2. Service Ownership
- **Owner**: `booking-service`
- **Database**: `booking_db` (table: `appointments`, `appointment_items`)

## 3. API Contract
- **Endpoint**: `PATCH /api/v1/appointments/:id`
- **Permissions**: `appointment.update`

## 4. Architecture & Persistence Flow
1. Verify slot availability for new start/end times.
2. Update `appointments` and `appointment_items`.
3. Invalidate Redis calendar keys.
4. Publish `AppointmentRescheduled` event.
