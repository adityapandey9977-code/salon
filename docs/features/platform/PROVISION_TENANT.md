# Feature: Tenant Provisioning Orchestration

## Overview
Platform Service orchestrates end-to-end multi-tenant onboarding without creating direct cross-database dependencies or creating a `SALON_ADMIN` User.

## Provisioning Saga Flow
1. Super Admin triggers `POST /api/v1/super-admin/tenants`.
2. Validates plan existence in `platform_db`.
3. Creates `TenantProvisioningRequest` (Status: `PENDING`).
4. Invokes **Organization Service** `POST /internal/v1/tenants` to create the Salon business tenant entity.
5. Receives authoritative `tenantId`.
6. Invokes **Identity Service** `POST /internal/v1/credentials` to create `TenantCredential` (for direct salon owner login via `TENANT` principal authority).
7. Creates `TenantSubscription` in `platform_db`.
8. Generates baseline custom domain resolution (`*.digiflexsalon.com`).
9. Completes provisioning request (`COMPLETED`) and publishes `TENANT_PROVISIONED.v1`.
