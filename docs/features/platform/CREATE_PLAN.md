# Feature: Create SaaS Subscription Plan

## Overview
Platform Super Admins can define SaaS subscription tiers with pricing, billing intervals, limits (max branches, staff, customers), and feature assignments.

## Architecture & Data Flow
1. **Super Admin API**: `POST /api/v1/super-admin/plans`
2. **Persistence**: `SubscriptionPlan` record in `platform_db`.
3. **Cache**: Plan metadata cached in Redis (`platform:plan:{planId}`).
4. **Events**: Emits `SUBSCRIPTION_CHANGED.v1` on updates.

## Parameters
- `code`: Unique uppercase code (`STARTER`, `GROWTH`, `ENTERPRISE`)
- `name`: Human-readable plan name
- `billingInterval`: `MONTHLY` | `QUARTERLY` | `YEARLY` | `CUSTOM`
- `basePrice`: Decimal recurring price
- `currency`: ISO currency code (`INR`, `USD`)
- `maxBranches`, `maxStaff`, `maxCustomers`: Numeric resource quotas
