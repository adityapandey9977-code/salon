# Feature: Convert Lead to Customer

## 1. Business Context & Overview
Promotes a qualified sales lead to an active salon customer record upon booking confirmation or first visit.

## 2. Service Ownership
- **Owner**: `customer-service`
- **Database**: `customer_db` (table: `leads`, `customers`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/customers/leads/:id/convert`
- **Permissions**: `lead.convert`
- **Request Body**: `{}`

## 4. Architecture & Persistence Flow
1. Fetch lead by ID under tenant scope.
2. Begin DB transaction.
3. Check if customer already exists for mobile phone; if not, create new `Customer`.
4. Update `leads` record: `status = CONVERTED`, `convertedCustomerId = customer.id`.
5. Commit transaction.
6. Publish `LeadConverted` and `CustomerCreated` events.
