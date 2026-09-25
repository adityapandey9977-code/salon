# Feature: Redeem Customer Loyalty Points

## 1. Business Context & Overview
Redeems accumulated loyalty reward points against invoice totals or service redemption.

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `customer_loyalties`, `loyalty_transactions`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/customers/loyalty/redeem`
- **Request Body**:
```json
{
  "customerId": "33333333-3333-3333-3333-333333333333",
  "points": 250,
  "referenceId": "77777777-7777-7777-7777-777777777777"
}
```

## 4. Architecture & Persistence Flow
1. Fetch loyalty account and verify points balance >= points requested.
2. In atomic PostgreSQL transaction: insert `LoyaltyTransaction` with `type = REDEEM`, deduct `pointsBalanceProjection`.
3. Publish `LoyaltyPointsRedeemed` domain event.
