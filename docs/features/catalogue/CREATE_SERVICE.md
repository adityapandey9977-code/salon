# Feature: Create Service Master

## 1. Business Context & Overview
Defines a salon service offering with category attribution, base price, duration, service buffers (prep/cleanup), consultation and patch test flags, and GST rate.

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `service_masters`, `service_categories`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/services`
- **Permissions**: `service.manage`
- **Request Body**:
```json
{
  "categoryId": "22222222-2222-2222-2222-222222222222",
  "code": "HAIR-SPA-01",
  "name": "Luxury Keratin Hair Spa",
  "durationMinutes": 60,
  "bufferBeforeMinutes": 5,
  "bufferAfterMinutes": 10,
  "basePrice": 2500,
  "taxRate": 18.0,
  "sacCode": "999721",
  "requiresConsultation": false,
  "requiresPatchTest": false,
  "isBookableOnline": true
}
```

## 4. Architecture & Persistence Flow
1. Verify category exists under tenant scope.
2. Persist in `service_masters` table.
3. Invalidate Redis cache `tenant:{tenantId}:services:catalogue`.
4. Publish `ServiceCreated` domain event to RabbitMQ.
