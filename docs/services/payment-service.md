# Service Documentation: Payment Service (`apps/services/payment-service`)

> **POS Checkout Terminal, Multi-Tender Split Billing, Invoices, Payment Gateways & Refunds**

---

## 1. Overview & Responsibilities

The **Payment Service** handles in-salon Point-of-Sale (POS) checkouts and online payments. It supports multi-tender split payments (e.g. paying partially via cash, card, and gift card), automated tip distribution, tax calculation, PDF receipt generation, and refund workflows.

```
                             CHECKOUT CART
                                   │
                                   ▼
                       [ INVOICE INITIALIZED ]
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
                 [ CASH ]      [ CARD / POS ]  [ GIFT CARD ]
                    │              │              │
                    └──────────────┼──────────────┘
                                   │
                                   ▼
                         [ PAYMENT COMPLETED ]
                                   │
                          (Emit Event to RabbitMQ)
```

### Key Responsibilities
- **POS Checkout & Cart Generation**: Aggregates appointment line items, add-on products, discounts, and tips into an immutable invoice.
- **Multi-Tender Split Billing**: Allows a single bill to be paid across multiple methods (`CASH`, `CREDIT_CARD`, `DEBIT_CARD`, `UPI`, `GIFT_CARD`, `LOYALTY_POINTS`).
- **Payment Gateway Integrations**: Stripe, Razorpay, and terminal card reader integration.
- **Tax Breakdown**: Compliant itemized tax calculations (VAT/GST/Sales Tax) based on branch locale.
- **Receipt & Invoice Lifecycle**: Numbering sequences, PDF invoice downloads, and digital receipt dispatch.
- **Refunds & Adjustments**: Partial or full refund processing with audit trails.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `PAYMENT_SERVICE_PORT` / `PORT` | `3007` | HTTP listener port |
| **Database URL** | `PAYMENT_DATABASE_URL` | `postgresql://.../payment_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration |

---

## 3. Database Schema Entities (`payment_db`)

- **`Invoice`**: `id`, `tenantId`, `branchId`, `customerId`, `appointmentId`, `invoiceNumber`, `subTotal`, `discountAmount`, `taxAmount`, `tipAmount`, `totalAmount`, `status` (`DRAFT`, `PAID`, `VOIDED`, `REFUNDED`), `issuedAt`, `paidAt`
- **`InvoiceItem`**: `id`, `invoiceId`, `itemType` (`SERVICE`, `PRODUCT`, `PACKAGE`, `MEMBERSHIP`), `itemId`, `name`, `quantity`, `unitPrice`, `taxRate`, `discountAmount`, `totalPrice`, `staffMemberId`
- **`PaymentTransaction`**: `id`, `invoiceId`, `paymentMethod` (`CASH`, `CARD`, `UPI`, `WALLET`, `GIFT_CARD`, `LOYALTY`), `amount`, `gatewayReference`, `status`, `paidAt`
- **`Refund`**: `id`, `invoiceId`, `transactionId`, `amount`, `reason`, `approvedByUserId`, `createdAt`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:invoice:{invoiceId}` (TTL: 300s)
- `tenant:{tenantId}:branch:{branchId}:daily-sales:{date}` (TTL: 60s)

---

## 5. Key API Endpoints

- `POST /api/v1/payments/invoices/checkout` (Generates invoice from appointment / items)
- `GET /api/v1/payments/invoices` (Lists invoices with date / branch filters)
- `GET /api/v1/payments/invoices/:id`
- `POST /api/v1/payments/invoices/:id/pay` (Records multi-tender payment)
- `POST /api/v1/payments/invoices/:id/void`
- `POST /api/v1/payments/invoices/:id/refund`
- `GET /api/v1/payments/invoices/:id/receipt-pdf`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.payment.invoice.created`
  - `salon.events.payment.completed`
  - `salon.events.payment.refunded`
- **Consumed Events**:
  - `salon.events.booking.completed` -> Triggers draft invoice generation
