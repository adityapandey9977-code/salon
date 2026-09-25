# Feature: Create Payment Intent

## 1. Business Context & Overview
Initiates a secure payment flow with gateway adapter orchestration (Razorpay, Stripe, or Mock) and idempotency enforcement.

## 2. Service Ownership
- **Owner**: `payment-service`
- **Database**: `payment_db` (table: `payment_intents`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/payments/intents`
- **Permissions**: `payment.create`
- **Request Body**:
```json
{
  "purpose": "INVOICE_PAYMENT",
  "referenceType": "INVOICE",
  "referenceId": "77777777-7777-7777-7777-777777777777",
  "amount": 2950.00,
  "currency": "INR",
  "provider": "RAZORPAY",
  "idempotencyKey": "pos-inv-7777-20261015"
}
```

## 4. Architecture & Persistence Flow
1. Check Redis idempotency key `tenant:{tenantId}:idempotency:{key}`.
2. If cache miss, check PostgreSQL `payment_intents` for duplicate key.
3. Call Gateway Provider adapter (`RazorpayPaymentProvider.createPaymentIntent`).
4. Persist in `payment_intents` and cache in Redis for 24h.
5. Publish `PaymentIntentCreated` event.
