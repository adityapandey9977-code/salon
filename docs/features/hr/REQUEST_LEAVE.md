# Feature Guide: Request Leave

## 1. Overview
Staff members can apply for leave across supported leave types (`CASUAL`, `SICK`, `PAID`, `UNPAID`, `MATERNITY`, `PATERNITY`, `COMP_OFF`, `OTHER`).

## 2. Endpoint Specifications
- **Method**: `POST`
- **Path**: `/api/v1/staff/leave`
- **Permission**: `leave.self` or `leave.manage`

### Request Body Example
```json
{
  "leaveType": "CASUAL",
  "startDate": "2026-09-10",
  "endDate": "2026-09-12",
  "reason": "Personal family commitment"
}
```

### Domain Event Emitted
- `LEAVE_REQUESTED.v1` (`LeaveRequested`)
