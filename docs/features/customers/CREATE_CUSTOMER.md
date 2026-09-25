# Feature: Create Customer Profile

## 1. Business Context & Overview
Allows salon receptionists, managers, and tenant owners to register a new client profile with contact details, address, initial preferences, tags, and medical/service cautions.

## 2. Service Ownership
- **Owner**: `customer-service`
- **Database**: `customer_db` (table: `customers`, `customer_addresses`, `customer_preferences`, `customer_cautions`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/customers`
- **Permissions**: `customer.create` (Bypassed by `TENANT` principal)
- **Request Body**:
```json
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "mobilePhone": "+919876543210",
  "email": "priya.sharma@example.com",
  "gender": "FEMALE",
  "preferredBranchId": "d3b07384-d113-4672-881b-801264c93591",
  "source": "WALK_IN",
  "address": {
    "addressLine1": "Flat 402, Lotus Heights",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400050",
    "country": "India"
  },
  "preferences": {
    "preferredStaffId": "e1a2b3c4-d5e6-47f8-9a0b-1c2d3e4f5a6b",
    "marketingConsent": true
  }
}
```

## 4. Architecture & Persistence Flow
1. Normalize phone (+E.164) and email (lowercase trimmed).
2. Check unique phone per tenant in `customer_db`.
3. Generate auto-sequenced `customerCode` (e.g. `CUST-XXXXXX`).
4. Persist in transactional PostgreSQL transaction.
5. Invalidate & write safe DTO to Redis cache (`tenant:{tenantId}:customer:{customerId}`).
6. Publish domain event `CustomerCreated` via RabbitMQ.
