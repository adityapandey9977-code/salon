# Feature: Purchase Service Package

## 1. Business Context & Overview
Allows customers to buy multi-session service bundles at a discounted rate and redeem sessions over time.

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `package_masters`, `customer_packages`, `package_redemptions`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/packages/tele-sales` or POS Package Line Item
- **Permissions**: `package.manage`

## 4. Architecture & Persistence Flow
1. Create `CustomerPackage` record linked to package definition with expiration date.
2. Publish `PackagePurchased` domain event to RabbitMQ.
