# Feature Guide: Approve Leave Request & Quota Deduction

## 1. Overview
Authorized salon managers or Salon Admins (`TENANT` principal) can approve leave requests. Approval automatically calculates the leave duration in days and updates the staff member's annual `LeaveBalance` in a single transactional write.

## 2. Transactional Guarantees
1. Validates that the leave request is in `PENDING` state.
2. Calculates elapsed days count between `startDate` and `endDate`.
3. Marks request as `APPROVED`, timestamped with `approvedAt` and reviewer ID.
4. Increments the `used` count in the `LeaveBalance` record for the leave year.
5. Emits `LEAVE_APPROVED.v1`.

## 3. Endpoint Specifications
- **Method**: `POST`
- **Path**: `/api/v1/staff/leave/:id/approve`
- **Permission**: `leave.approve` or `leave.manage`

### Request Body Example
```json
{
  "reviewNote": "Approved by branch manager"
}
```

### Domain Event Emitted
- `LEAVE_APPROVED.v1` (`LeaveApproved`)
