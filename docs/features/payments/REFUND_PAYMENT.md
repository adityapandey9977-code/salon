# Feature: Refund Payment

## 1. Business Context & Overview
Executes full or partial payment refunds against captured transactions via gateway adapter and posts audit trail.

## 2. Service Ownership
- **Owner**: `payment-service`
- **Database**: `payment_db` (table: `refunds`, `payment_transactions`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/payments/:id/refund`
- **Permissions**: `payment.refund`
- **Request Body**:
```json
{
  "amount": 500.00,
  "reason": "Customer dissatisfied with hair styling result"
}
```

## 4. Architecture & Persistence Flow
1. Fetch original transaction under tenant scope.
2. Execute refund via Gateway Adapter.
3. In PostgreSQL transaction: insert `refunds` record, update transaction status to `REFUNDED`.
4. Publish `RefundCompleted` domain event.
