# Feature: Customer Prepaid Wallet Top-up

## 1. Business Context & Overview
Credits prepaid balance to a customer's dedicated digital wallet with double-entry ledger auditing.

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `customer_wallets`, `wallet_transactions`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/customers/wallet/topup`
- **Request Body**:
```json
{
  "customerId": "33333333-3333-3333-3333-333333333333",
  "amount": 5000.00
}
```

## 4. Architecture & Persistence Flow
1. Fetch/create `CustomerWallet` for tenant and customer.
2. In atomic transaction: insert `WalletTransaction` with `type = CREDIT`, update `currentBalance`.
3. Publish `WalletTransactionPosted` domain event.
