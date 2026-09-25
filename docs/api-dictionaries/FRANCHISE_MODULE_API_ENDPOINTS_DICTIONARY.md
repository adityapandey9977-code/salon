#   Salon SaaS — Franchise Partner Portal API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.0.0  
**Target System:**   Salon SaaS — Franchise Partner Portal (`apps/web/src/modules/franchise`) & Backend API Gateway (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Franchise Owners, Outlet Sales Analytics, Royalty Invoices, Audits, Compliance & Support  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & Franchise Tenant Scoping

The **Franchise Module** (`apps/web/src/modules/franchise`) provides a portal for Franchise Partners (FOFO/FOCO salon owners). It allows franchise owners to monitor their assigned outlets' gross sales, review monthly royalty fee invoices, inspect local inventory stock levels, audit staff performance, access brand marketing collateral, and log compliance tickets.

```
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│   Franchise Partner Portal (/franchise)│ ──► │  Tenant Franchise Gateway (/api/v1/*)  │
│  (apps/web/src/modules/franchise)      │     │  • /tenant/franchise   • /billing      │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## 2. Franchise Partner Authentication APIs

**Base Path:** `/api/v1/auth`, `/api/v1/tenant/franchise`  
**Database Entities:** `franchise_partners`, `users`, `roles`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Partner Login Screen | Authenticates Franchise Partner credentials and returns JWT token bound to partner ID. | Body: `{ email, password, role: 'FRANCHISE_PARTNER' }` |
| `/api/v1/tenant/franchise/me` | `GET` | Navigation Header | Validates partner session token, master franchise agreement status, and assigned outlets list. | Res: `{ partner_id, partner_name: 'Gwalior Royal Spa Co.', outlets: ['BR-GWL-01'] }` |

---

## 3. Screen-by-Screen API Endpoint Dictionary

### 3.1 Screen: Franchise Dashboard & Performance Overview (`/franchise/`)
* **UI Pages:** `DashboardPage.tsx`, `PerformancePage.tsx`
* **Target Entities:** `franchise_partners`, `invoices`, `branches`

| Endpoint URI | HTTP Method | Target UI Widget | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/tenant/franchise/dashboard-kpis`| `GET` | Overview KPI Cards | Computes Monthly Outlets Gross Turnover, Net Profit Share, Royalty Invoiced, and Client Satisfaction Score. | Res: `{ grossTurnover, netProfitShare, royaltyInvoiced, clientSatisfactionScore }` |
| `/api/v1/tenant/franchise/sales-trend` | `GET` | Sales Trend Telemetry | Generates multi-outlet sales trendline charts across franchise outlets. | Query: `?range=THIS_QUARTER`<br>Res: `{ salesTrend: [...] }` |

---

### 3.2 Screen: Franchise Outlets Registry (`/franchise/locations`)
* **UI Pages:** `MyLocationsPage.tsx`, `MyFranchisePage.tsx`
* **Target Entities:** `branches`, `franchise_agreements`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/tenant/franchise/outlets` | `GET` | Outlets Roster | Displays all salon branches operated by the franchise partner, station counts, and General Manager contacts. | Res: `Array<FranchiseOutletObject>` |
| `/api/v1/tenant/franchise/agreements` | `GET` | Agreement Details Tab | Displays master licensing contract terms, agreement expiry date, royalty % rate (e.g. 8.5%), and renewal status. | Res: `{ agreementId, startDate, expiryDate: '2026-09-11', royaltyPct: 8.5, status: 'Active' }` |

---

### 3.3 Screen: Royalty Fee Invoices & Payment Ledger (`/franchise/royalty-fees`)
* **UI Pages:** `FranchiseFeesPage.tsx`, `FinancePage.tsx`
* **Target Entities:** `royalty_invoices`, `payments`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/billing/royalties/partner` | `GET` | Royalty Invoices Grid | Lists monthly brand royalty fee invoices, GMV calculation breakdowns, and payment statuses (`Paid`, `Overdue`). | Query: `?partner_id=FP-8803`<br>Res: `Array<RoyaltyInvoiceObject>` |
| `/api/v1/billing/royalties/:id/pay` | `POST` | Pay Royalty Button | Initiates online ACH / Razorpay net-banking payment to settle overdue brand royalty fee invoices. | Body: `{ invoice_id, payment_mode: 'NetBanking' }` |

---

### 3.4 Screen: Outlet Sales, Staff & Inventory Audit (`/franchise/sales`, `/franchise/staff`, `/franchise/inventory`)
* **UI Pages:** `SalesSummaryPage.tsx`, `StaffOverviewPage.tsx`, `InventorySummaryPage.tsx`
* **Target Entities:** `invoices`, `staff_members`, `inventory_items`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/tenant/franchise/sales-summary`| `GET` | Sales Summary Tab | Audits outlet sales breakdown (Service Sales vs Retail Sales vs Package Redemptions). | Res: `{ serviceSales, retailSales, packageSales }` |
| `/api/v1/tenant/franchise/staff-summary`| `GET` | Staff Overview Tab | Views outlet staffing levels, attendance compliance, and specialist productivity scores. | Res: `Array<OutletStaffSummary>` |
| `/api/v1/tenant/franchise/inventory-summary`| `GET` | Inventory Stock Summary | Audits local shelf inventory valuation and dispensary stock replenishment logs. | Res: `{ totalStockValue, lowStockAlertsCount }` |

---

### 3.5 Screen: Brand Compliance & Support (`/franchise/compliance`, `/franchise/support`)
* **UI Pages:** `CompliancePage.tsx`, `SupportPage.tsx`, `DocumentsPage.tsx`
* **Target Entities:** `franchise_compliance_logs`, `support_tickets`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/tenant/franchise/compliance` | `GET` | Compliance Audit Grid | Monitors brand hygiene audits, mystery shopper scores, and statutory GST compliance certifications. | Res: `Array<ComplianceAuditItem>` |
| `/api/v1/tenant/franchise/tickets` | `POST` | Open Support Ticket Form | Opens a high-priority support ticket to Corporate Brand Head for operational assistance or supply issues. | Body: `{ title, priority: 'High', description: 'Requesting equipment maintenance' }` |

---

## 4. End-to-End API Integration Workflows

### Flow 4.1: End-to-End Monthly Franchise Royalty Review & Payment Settlement Flow
```
┌───────────────────────────────────────┐
│ 1. GET /billing/royalties/partner     │ ──► Partner inspects monthly 8.5% GMV royalty fee invoice.
└───────────────────┬───────────────────┘
                    │
                    v
┌───────────────────────────────────────┐
│ 2. GET /tenant/franchise/sales-summary│ ──► Audits gross monthly sales breakdown to verify invoice accuracy.
└───────────────────┬───────────────────┘
                    │
                    v
┌───────────────────────────────────────┐
│ 3. POST /billing/royalties/:id/pay    │ ──► Initiates Razorpay NetBanking ACH payment to settle royalty bill.
└───────────────────┬───────────────────┘
                    │
                    v
┌───────────────────────────────────────┐
│ 4. GET /tenant/franchise/agreements   │ ──► Agreement status updates & compliance score clears.
└───────────────────────────────────────┘
```

---

## 5. Verification Summary

- **Franchise APIs Documented:** 2 Auth endpoints + 11 operational REST endpoints across all 18 franchise screens (`/franchise/*`).
- **End-to-End Workflow Documented:** Complete Monthly Royalty Audit & ACH Payment Settlement Sequence.
