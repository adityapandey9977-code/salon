# Feature Guide: Assign Staff to Branch

## 1. Overview
Staff members in   Salon can be assigned to multiple physical branches. One assignment is designated as `isPrimary = true`.

## 2. Organization Validation Rule
Before allocating a staff member to a branch, `people-service` calls `organization-service` to ensure:
1. The branch exists.
2. The branch belongs to the authenticated `tenantId`.
3. The branch status is active.

## 3. Endpoint Specifications
- **Method**: `POST`
- **Path**: `/api/v1/staff/:id/branches`
- **Permission**: `staff.branch.manage`
- **Headers**:
  - `x-tenant-id`: Tenant UUID
  - `x-principal-type`: `TENANT` or `USER`

### Request Body Example
```json
{
  "branchId": "22222222-2222-2222-2222-222222222222",
  "isPrimary": true,
  "effectiveFrom": "2026-09-04",
  "status": "ACTIVE"
}
```

### Response Example
```json
{
  "success": true,
  "data": {
    "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "employeeId": "44444444-4444-4444-4444-444444444444",
    "tenantId": "11111111-1111-1111-1111-111111111111",
    "branchId": "22222222-2222-2222-2222-222222222222",
    "isPrimary": true,
    "effectiveFrom": "2026-09-04T00:00:00.000Z",
    "status": "ACTIVE"
  },
  "meta": {
    "correlationId": "d3b07384-d113-4a11-b0e6-a052b6d5f0e1"
  }
}
```

## 4. Cache Invalidation Triggers
- Invalidates `tenant:{tenantId}:staff:{employeeId}:branches`
- Invalidates `tenant:{tenantId}:branch:{branchId}:staff`
- Invalidates `tenant:{tenantId}:staff:{employeeId}`
