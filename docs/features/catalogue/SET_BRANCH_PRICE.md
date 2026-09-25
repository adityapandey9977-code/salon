# Feature: Set Branch Service Price

## 1. Business Context & Overview
Overrides base service pricing for high-tier or regional salon branches (e.g. airport/luxury mall branch premium pricing).

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `service_branch_prices`)

## 3. API Contract
- **Endpoint**: `PUT /api/v1/services/:id/pricing`
- **Permissions**: `service.price.manage`
- **Request Body**:
```json
{
  "branchId": "d3b07384-d113-4672-881b-801264c93591",
  "price": 2800.00
}
```

## 4. Architecture & Persistence Flow
1. Upsert `service_branch_prices` record with `[tenantId, branchId, serviceId]`.
2. Invalidate branch cache `tenant:{tenantId}:branch:{branchId}:service:{serviceId}:price`.
3. Publish `ServicePriceUpdated` event to RabbitMQ.
