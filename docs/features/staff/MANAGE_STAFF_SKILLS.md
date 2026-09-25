# Feature Guide: Manage Staff Skills

## 1. Overview
The skills catalogue connects stylist capabilities with salon services offered in `commerce-service`.
Skill levels supported:
- `TRAINEE`
- `JUNIOR`
- `INTERMEDIATE`
- `SENIOR`
- `EXPERT`
- `MASTER`

## 2. Cross-Service Service ID Reference
`serviceId` is a logical UUID referencing a service catalogue entry in `commerce-service`. There is strictly no direct database foreign key.

## 3. Endpoint Specifications
- **Add Skill**: `POST /api/v1/staff/:id/skills`
- **List Skills**: `GET /api/v1/staff/:id/skills`
- **Update Skill**: `PATCH /api/v1/staff/:id/skills/:skillId`
- **Delete Skill**: `DELETE /api/v1/staff/:id/skills/:skillId`

### Request Body Example
```json
{
  "serviceId": "77777777-7777-7777-7777-777777777777",
  "skillLevel": "SENIOR",
  "yearsExperience": 4.5,
  "isPrimary": true,
  "isActive": true
}
```

## 4. Cache Invalidation
- Invalidates `tenant:{tenantId}:staff:{employeeId}:skills`
