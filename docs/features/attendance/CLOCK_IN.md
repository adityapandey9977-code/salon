# Feature Guide: Staff Clock-In

## 1. Overview
Clock-in captures the authoritative, server-timestamped arrival of a staff member at their assigned salon branch.

## 2. Validation & Security Rules
1. **Server Timestamp**: The server's timestamp is strictly authoritative. Client clock timestamps are rejected.
2. **Active Employee Status**: Only employees with `employmentStatus = ACTIVE` can clock in.
3. **Assigned Branch**: Employee must be currently assigned to the branch.
4. **Duplicate Prevention**: Rejects clock-in if an active session already exists for today.

## 3. Endpoint Specifications
- **Method**: `POST`
- **Path**: `/api/v1/staff/clock-in`
- **Permission**: `attendance.self` or `attendance.manage`

### Request Body Example
```json
{
  "branchId": "22222222-2222-2222-2222-222222222222",
  "method": "WEB",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### Domain Event Emitted
- `ATTENDANCE_CLOCKED_IN.v1` (`AttendanceClockedIn`)
