# Feature: Check Slot Availability

## 1. Business Context & Overview
Calculates dynamic 30-minute bookable appointment slots by evaluating branch operating hours, service duration, buffers, staff rosters, approved leaves, active booking holds, and existing appointments.

## 2. Service Ownership
- **Owner**: `booking-service`
- **Database**: `booking_db` (table: `appointments`, `appointment_items`, `booking_holds`)

## 3. API Contract
- **Endpoint**: `GET /api/v1/appointments/availability?branchId=X&serviceId=Y&date=2026-10-15&staffId=Z`
- **Permissions**: `appointment.read`

## 4. Architecture & Persistence Flow
1. Fetch service duration and buffers from `commerce-service` internal client.
2. Query `appointment_items` in PostgreSQL for existing overlapping appointments.
3. Query `booking_holds` for active unexpired hold tokens.
4. Return slot array with `{ startTime, endTime, available, reason }`.
