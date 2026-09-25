# Feature: Update Customer Profile

## 1. Business Context & Overview
Updates existing client profile details, preferences, or communication consent while maintaining audit logs and synchronizing Redis read projections.

## 2. Service Ownership
- **Owner**: `customer-service`
- **Database**: `customer_db` (table: `customers`, `customer_preferences`)

## 3. API Contract
- **Endpoint**: `PATCH /api/v1/customers/:id`
- **Permissions**: `customer.update`
- **Request Body**:
```json
{
  "firstName": "Priya",
  "lastName": "Kapoor",
  "email": "priya.kapoor@example.com",
  "preferredBranchId": "d3b07384-d113-4672-881b-801264c93591"
}
```

## 4. Architecture & Persistence Flow
1. Verify customer exists under authenticated tenant scope.
2. If phone/email updated, normalize and check conflict.
3. Update DB record and bump `updatedAt`.
4. Evict Redis key `tenant:{tenantId}:customer:{customerId}` and rewrite updated DTO.
5. Publish `CustomerUpdated` event to RabbitMQ.
