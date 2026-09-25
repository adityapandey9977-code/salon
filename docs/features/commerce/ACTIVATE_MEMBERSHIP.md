# Feature: Activate Customer Membership

## 1. Business Context & Overview
Activates tiered membership plans granting exclusive discounts on future visits.

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `membership_masters`, `customer_memberships`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/memberships`
- **Permissions**: `membership.manage`

## 4. Architecture & Persistence Flow
1. Persist `CustomerMembership` record.
2. Publish `MembershipActivated` domain event.
