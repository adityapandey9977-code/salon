# Feature Guide: Create & Manage Roster

## 1. Overview
The master roster allocates staff members to specific shifts and time windows on scheduled calendar dates.

## 2. Status Lifecycle
- `SCHEDULED`: Initial plan created.
- `CONFIRMED`: Staff acknowledged.
- `COMPLETED`: Shift performed.
- `CANCELLED`: Shift cancelled.
- `ABSENT`: Staff absent.

## 3. Endpoints
- **Create Roster**: `POST /api/v1/staff/roster`
- **Query Roster**: `GET /api/v1/staff/roster?branchId=...&date=YYYY-MM-DD`
- **Update Roster**: `PATCH /api/v1/staff/roster/:id`
- **Delete Roster**: `DELETE /api/v1/staff/roster/:id`

### Request Body Example
```json
{
  "employeeId": "44444444-4444-4444-4444-444444444444",
  "branchId": "22222222-2222-2222-2222-222222222222",
  "shiftId": "33333333-3333-3333-3333-333333333301",
  "rosterDate": "2026-09-04",
  "startAt": "2026-09-04T09:00:00.000Z",
  "endAt": "2026-09-04T17:00:00.000Z",
  "status": "SCHEDULED"
}
```

## 4. Cache Invalidation
- Invalidates `tenant:{tenantId}:staff:{employeeId}:roster:{rosterDate}`
