# Feature: Cancel Appointment

## 1. Business Context & Overview
Cancels a scheduled salon appointment, recording cancellation reason and triggering customer notification.

## 2. Service Ownership
- **Owner**: `booking-service`
- **Database**: `booking_db` (table: `appointments`, `appointment_status_histories`)

## 3. API Contract
- **Endpoint**: `PATCH /api/v1/appointments/:id/cancel`
- **Permissions**: `appointment.cancel`
- **Request Body**:
```json
{
  "reason": "Customer requested cancellation due to travel"
}
```

## 4. Architecture & Persistence Flow
1. Transition appointment `status = CANCELLED`.
2. Append reason to `appointment_status_histories`.
3. Invalidate Redis calendar and appointment cache.
4. Publish `AppointmentCancelled` event to RabbitMQ.
