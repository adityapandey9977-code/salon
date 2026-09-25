# Feature: Point of Sale (POS) Checkout

## 1. Business Context & Overview
Performs atomic checkout calculation across services, retail products, packages, memberships, coupon discounts, GST computation, and creates draft/pending invoices.

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `invoices`, `invoice_line_items`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/billing/checkout`
- **Permissions**: `pos.use`
- **Request Body**:
```json
{
  "branchId": "d3b07384-d113-4672-881b-801264c93591",
  "customerId": "33333333-3333-3333-3333-333333333333",
  "appointmentId": "44444444-4444-4444-4444-444444444444",
  "items": [
    {
      "itemType": "SERVICE",
      "itemId": "55555555-5555-5555-5555-555555555555",
      "quantity": 1,
      "unitPrice": 1200,
      "discountAmount": 100
    }
  ]
}
```

## 4. Architecture & Persistence Flow
1. Calculate line GST and totals via `calculateOrderTax`.
2. Generate invoice sequence number (`INV-XXXXXX-YYYY`).
3. Save `invoices` and `invoice_line_items` in PostgreSQL transaction.
4. If payment intent required, initialize downstream call to `payment-service`.
5. Publish `InvoiceCreated` event to RabbitMQ.
