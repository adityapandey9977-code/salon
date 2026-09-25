# Feature Guide: Staff Clock-Out & Variance Computation

## 1. Overview
Clock-out closes the active attendance session and calculates worked duration and schedule variances against the assigned shift.

## 2. Calculated Fields
- `workedMinutes`: Actual elapsed time minus shift break minutes.
- `lateMinutes`: Delay beyond shift start time + grace minutes.
- `earlyLeaveMinutes`: Minutes departed before scheduled shift end.
- `overtimeMinutes`: Excess minutes worked beyond scheduled shift end.
- `status`: Automatically computes `PRESENT`, `LATE`, or `HALF_DAY`.

## 3. Separation of Concerns (No Payroll Calculations)
`people-service` owns attendance facts (minutes worked, late minutes, overtime minutes).
Monetary conversion and net salary calculations are strictly owned by `finance-service`.

## 4. Endpoint Specifications
- **Method**: `POST`
- **Path**: `/api/v1/staff/clock-out`
- **Permission**: `attendance.self` or `attendance.manage`

### Request Body Example
```json
{
  "branchId": "22222222-2222-2222-2222-222222222222",
  "method": "WEB"
}
```

### Domain Event Emitted
- `ATTENDANCE_CLOCKED_OUT.v1` (`AttendanceClockedOut`)
