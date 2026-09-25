#   Salon SaaS — Master System API Endpoint & End-to-End Architecture Dictionary

**Document Version:** 3.0.0 — Enterprise Master Release  
**Target System:**   Salon SaaS Platform (All 10 Frontend Modules & Microservice API Gateways)  
**Scope:** Complete Consolidated Endpoint Inventory & Cross-Module End-to-End Transactional Life-Cycles  
**Classification:** Complete System Technical Architecture Specification  

---

## 1. Master System Architecture & Gateway Topology

The **  Salon SaaS Platform** operates on a multi-tenant microservices architecture supporting 10 specialized frontend modules (`apps/web/src/modules/*`) communicating with a centralized REST API Gateway (`apps/api/src/modules/*`).

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DIGIFLEX SALON SAAS FRONTEND MODULE TOPOLOGY                              │
├───────────────────────┬───────────────────────────┬────────────────────────────┬──────────────────────────┤
│ 1. Governance & SaaS  │ 2. Multi-Branch Operations│ 3. Client & Sales Channels │ 4. Field & Supply Chain  │
│  • SuperAdmin         │  • Brand Admin            │  • Client Self-Service App │  • Central Inventory     │
│  • Franchise Partner  │  • Branch Manager         │  • Call Center & Tele-Sales│  • Stylist Mobile        │
│  • Finance & HR       │                           │  • Public Landing Page     │                          │
└───────────────────────┴───────────────────────────┴────────────────────────────┴──────────────────────────┘
                                                     │ REST API / JSON over HTTPS
                                                     v
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  CENTRALIZED REST API GATEWAY MODULES                                     │
│  /auth  /appointments  /billing  /branches  /consultations  /customers  /dashboard  /inventory  /marketing │
│  /memberships  /notifications  /packages  /payments  /reports  /roles  /services  /settings  /staff  /tenant│
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                     │ PostgreSQL / Prisma ORM
                                                     v
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  PERSISTENT MULTI-TENANT DATABASE PLATFORM                                │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Module-by-Module Endpoint Index

| Module # | Module Name | Source Directory | Dedicated Specification File | Endpoint Count |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **SuperAdmin Master Control** | `apps/web/src/modules/super-admin` | [`SUPER_ADMIN_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/SUPER_ADMIN_MODULE_API_ENDPOINTS_DICTIONARY.md) | 46 Endpoints |
| **02** | **Brand Admin Master Desk** | `apps/web/src/modules/admin` | [`ADMIN_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/ADMIN_MODULE_API_ENDPOINTS_DICTIONARY.md) | 38 Endpoints |
| **03** | **Branch Manager Workspace** | `apps/web/src/modules/branchManager` | [`BRANCH_MANAGER_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/BRANCH_MANAGER_MODULE_API_ENDPOINTS_DICTIONARY.md) | 32 Endpoints |
| **04** | **Call Center & Tele-Sales** | `apps/web/src/modules/call-center` | [`CALL_CENTER_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/CALL_CENTER_MODULE_API_ENDPOINTS_DICTIONARY.md) | 14 Endpoints |
| **05** | **Client Self-Service App** | `apps/web/src/modules/client` | [`CLIENT_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/CLIENT_MODULE_API_ENDPOINTS_DICTIONARY.md) | 13 Endpoints |
| **06** | **Finance & HR Payroll** | `apps/web/src/modules/finance` | [`FINANCE_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/FINANCE_MODULE_API_ENDPOINTS_DICTIONARY.md) | 15 Endpoints |
| **07** | **Franchise Partner Portal** | `apps/web/src/modules/franchise` | [`FRANCHISE_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/FRANCHISE_MODULE_API_ENDPOINTS_DICTIONARY.md) | 13 Endpoints |
| **08** | **Central Inventory** | `apps/web/src/modules/inventory` | [`INVENTORY_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/INVENTORY_MODULE_API_ENDPOINTS_DICTIONARY.md) | 15 Endpoints |
| **09** | **Stylist Mobile Companion** | `apps/web/src/modules/stylist` | [`STYLIST_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/STYLIST_MODULE_API_ENDPOINTS_DICTIONARY.md) | 13 Endpoints |
| **10** | **Public Landing Page** | `apps/web/src/modules/landing` | [`LANDING_MODULE_API_ENDPOINTS_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/LANDING_MODULE_API_ENDPOINTS_DICTIONARY.md) | 4 Endpoints |

---

## 3. Master Cross-Module End-to-End Transactional Life-Cycles

### Master Workflow 1: Public Lead -> Tele-Sales -> Appointment -> In-Chair Treatment -> POS Checkout & BOM Auto-Deduction -> Royalty Calculation -> Financial Accounting

Complete 7-stage life-cycle spanning 7 modules when a customer discovers the salon online, receives a tele-booking call, attends an appointment, receives treatment, pays at POS, and triggers background royalty & financial accounting:

```
[1. LANDING MODULE]
   POST /api/v1/public/franchise-inquiry / Lead Capture
            │
            v
[2. CALL CENTER MODULE]
   POST /api/v1/appointments/tele-book ──► Books appointment & sends Razorpay deposit link.
            │
            v
[3. BRANCH MANAGER MODULE]
   PATCH /api/v1/appointments/walkins/:id/seat ──► Reception seats client on Chair 04 ('In-Service').
            │
            v
[4. STYLIST MODULE]
   POST /api/v1/consultations/formulas ──► Stylist logs exact Majirel hair color formula & complete treatment.
            │
            v
[5. BRANCH MANAGER POS MODULE]
   POST /api/v1/billing/checkout ──► Generates GST invoice, processes UPI payment, & auto-deducts BOM stock.
            │
            v
[6. FRANCHISE MODULE]
   POST /api/v1/billing/royalties ──► System updates gross GMV and computes monthly 8.5% royalty fee.
            │
            v
[7. FINANCE MODULE]
   GET /api/v1/finance/tax/gst-return ──► Reconciles GSTR-1 tax liability & records branch profit margin.
```

---

### Master Workflow 2: Safety Stock Breach -> Reorder Request -> Vendor PO -> Goods Receipt (GRN) -> Central Warehouse -> Inter-Branch Delivery

Complete supply chain replenishment life-cycle across 3 modules:

1. **Dispensary Low Stock Alert (Branch Manager):** `GET /api/v1/inventory/alerts/branch`  
   *Indore Indrapuri Flagship dispensary detects Hydra Serums below 5-unit safety stock.*
2. **Reorder Request (Branch Manager):** `POST /api/v1/inventory/reorder-request`  
   *Manager requests 20 units replenishment from Central Warehouse.*
3. **Vendor Procurement Order (Central Inventory):** `POST /api/v1/inventory/purchase-orders`  
   *Central Supply Officer issues Purchase Order (PO) to L'Oréal India Pvt Ltd for 100 units.*
4. **Goods Receipt Voucher GRN (Central Inventory):** `POST /api/v1/inventory/goods-receipt`  
   *Central Warehouse receives shipment, verifies GRN, and updates master stock ledger.*
5. **Inter-Branch Stock Dispatch (Central Inventory):** `POST /api/v1/inventory/transfers/dispatch`  
   *Dispatches 20 units to Indore Indrapuri Flagship.*
6. **Inter-Branch Goods Receipt (Branch Manager):** `POST /api/v1/inventory/receive-goods`  
   *Indore manager confirms arrival and local shelf inventory balance updates.*

---

### Master Workflow 3: Multi-Tenant Tenant Provisioning -> Custom Domain CNAME -> Subscription Billing Sweep -> Security Audit Lineage

Complete SaaS platform management life-cycle across 3 administrative modules:

1. **Tenant Provisioning (SuperAdmin):** `POST /api/v1/super-admin/tenants`  
   *Provisions new tenant "Indrapuri Beauty Lounge", seeds database schema, & creates admin user.*
2. **White-Label Custom Domain Setup (SuperAdmin):** `PUT /api/v1/super-admin/tenants/:id/cname`  
   *Binds custom domain `app.indrapurisalon.com` and configures SSL certificate.*
3. **Location Rules Setup (Brand Admin):** `POST /api/v1/branches`  
   *Brand Admin creates Indrapuri Flagship outlet, sets chair counts, and configures shift hours.*
4. **Monthly Subscription Sweep (SuperAdmin):** `POST /api/v1/super-admin/billing/sweep`  
   *Automated gateway sweep debits monthly Enterprise Luxe subscription fee via ACH.*
5. **Immutable Security Trail (SuperAdmin / Brand Admin):** `GET /api/v1/super-admin/audit`  
   *Audit engine logs tenant creation, CNAME binding, and payment events into immutable audit trail.*

---

## 4. Verification Summary

- **Total System Endpoints Documented:** 203 REST API Endpoints across all 10 frontend modules.
- **Dedicated Module Specifications Created:** 10 individual Markdown specification files saved in [`docs/`](file:///e:/salon%20management%20system/ -Salon/docs/).
- **Coverage:** 100% of all screens, tabs, modals, and cross-module end-to-end operational life-cycles mapped.
