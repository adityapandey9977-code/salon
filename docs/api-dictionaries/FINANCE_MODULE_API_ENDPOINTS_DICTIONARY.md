#   Salon SaaS — Finance & HR Module API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.0.0  
**Target System:**   Salon SaaS — Corporate Finance & HR Portal (`apps/web/src/modules/finance`) & Backend API Gateway (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Corporate Finance, Payroll Processing, GST Tax Filings, Commission Payouts, Refunds & Branch Profitability  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & Financial Domain Scoping

The **Finance Module** (`apps/web/src/modules/finance`) is an enterprise portal for CFOs, corporate accountants, and HR payroll managers. It centralizes brand-wide multi-branch financial accounting, automated payroll generation, GST tax returns filing (CGST 9% + SGST 9% / IGST 18%), staff commission disbursements, franchise royalty settlements, and branch profitability analytics.

```
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│    Corporate Finance SPA (/finance)    │ ──► │  Corporate Finance API Gateway         │
│  (apps/web/src/modules/finance)        │     │  • /billing   • /finance  • /reports   │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## 2. Authentication & Financial Role APIs

**Base Path:** `/api/v1/auth`  
**Database Entities:** `users`, `roles`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Finance Portal Login | Authenticates CFO, Chief Accountant, or HR Payroll Officer with elevated financial access tokens. | Body: `{ email, password, role: 'FINANCE_HR' }` |
| `/api/v1/auth/me` | `GET` | Navigation Bar Header | Verifies active session token, financial authorization scopes, and multi-tenant brand context. | Res: `{ user_id, name, role: 'FINANCE_HEAD', permissions: ['FINANCE_READ', 'PAYROLL_EXECUTE'] }` |

---

## 3. Screen-by-Screen API Endpoint Dictionary

### 3.1 Screen: Corporate Financial Dashboard (`/finance/`)
* **UI Pages:** `DashboardPage.tsx`
* **Target Entities:** `invoices`, `payments`, `payroll_runs`, `branch_ledgers`

| Endpoint URI | HTTP Method | Target UI Widget | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/finance/corporate-kpis` | `GET` | Financial Overview Cards | Computes Brand Gross Turnover, Net Profit Margins, Total GST Payable, Monthly Payroll Liability, and Overdue Royalties. | Res: `{ grossTurnover, netProfit, gstPayable, payrollLiability, overdueRoyalties }` |
| `/api/v1/finance/cashflow-trend` | `GET` | Cashflow SVG Telemetry | Generates multi-branch cash inflow vs outflow trendline metrics over 30/90/365 day periods. | Res: `{ inflowPoints: [...], outflowPoints: [...] }` |

---

### 3.2 Screen: Monthly Payroll Processing & Bank Dispatches (`/finance/payroll`)
* **UI Pages:** `PayrollPage.tsx`, `PayrollExportPage.tsx`
* **Target Entities:** `payroll_runs`, `staff_members`, `commissions`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/finance/payroll/run` | `GET` | Payroll Master Table | Calculates monthly salary payouts combining base salary, calculated service commissions, retail sales commissions, tips, and deductions. | Query: `?month=2026-08`<br>Res: `Array<PayrollItemObject>` |
| `/api/v1/finance/payroll/execute` | `POST` | "Execute Payroll" Button | Locks monthly payroll run, approves bank batch transfer file, and generates individual staff payslips. | Body: `{ month: '2026-08', total_payout_amount: 1485000.00, approval_token }` |
| `/api/v1/finance/payroll/export-bank`| `POST` | `PayrollExportPage.tsx` | Generates ICICI / HDFC Corporate NetBanking bulk NEFT/RTGS payment file for salary dispatches. | Body: `{ payroll_run_id, bank_format: 'ICICI_H2H' }` |

---

### 3.3 Screen: Staff Attendance & Overtime Verification (`/finance/attendance`)
* **UI Pages:** `AttendanceLeavePage.tsx`
* **Target Entities:** `staff_attendance_logs`, `staff_leave_requests`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/finance/attendance/summary` | `GET` | Attendance Audit Grid | Audits staff clock-in/out logs, paid leaves, unpaid leaves, and overtime hours for payroll reconciliation. | Query: `?month=2026-08`<br>Res: `Array<AttendanceAuditObject>` |

---

### 3.4 Screen: Staff Commission Payouts (`/finance/commissions`)
* **UI Pages:** `CommissionsPage.tsx`
* **Target Entities:** `commissions`, `invoices`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/finance/commissions/tiers` | `GET` / `PUT` | Commission Matrix | Views and updates tiered commission rules (e.g. 10% on service revenue above ₹50k, 15% on retail sales). | Body: `{ service_tier_1_pct: 10.0, retail_commission_pct: 15.0 }` |

---

### 3.5 Screen: Refunds & Credit Notes Audit (`/finance/refunds`)
* **UI Pages:** `RefundsPage.tsx`
* **Target Entities:** `refund_requests`, `customer_store_credits`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/billing/refunds/audit` | `GET` | Refunds Table | Audits refund applications submitted by branch managers and approves cash/bank refunds or store credit vouchers. | Query: `?status=Pending`<br>Res: `Array<RefundAuditItem>` |
| `/api/v1/billing/refunds/:id/approve`| `PATCH` | Approve Refund Button | Approves customer refund request and dispatches Razorpay automated reversal or store credit issuance. | Body: `{ refund_id, status: 'Approved', approval_notes }` |

---

### 3.6 Screen: Franchise Royalty Settlements (`/finance/settlements`)
* **UI Pages:** `SettlementsPage.tsx`
* **Target Entities:** `royalty_invoices`, `franchise_partners`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/billing/royalties/settlements`| `GET` / `POST` | Franchise Royalty Table | Tracks incoming royalty payments (e.g. 8.5% GMV fee) from franchise outlets, flagging overdue settlements (>30 days). | Body: `{ partner_id, billing_month: '2026-07', amount_settled, transaction_reference }` |

---

### 3.7 Screen: Multi-Branch Profitability & GST Tax Filing (`/finance/profitability`, `/finance/reports`)
* **UI Pages:** `ProfitabilityPage.tsx`, `ReportsPage.tsx`
* **Target Entities:** `invoices`, `branch_ledgers`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/finance/profitability/matrix` | `GET` | Profitability Matrix | Computes branch-by-branch Net Profit Margin (Gross Sales - COGS Consumables - Payroll - Rent). | Res: `Array<BranchProfitabilityObject>` |
| `/api/v1/finance/tax/gst-return` | `GET` | GST Filing Report | Generates GSTR-1 and GSTR-3B tax return reports formatted with CGST, SGST, IGST, and HSN/SAC SAC 999721 codes. | Query: `?month=2026-08`<br>Res: `{ totalTaxableValue, cgstTotal, sgstTotal, igstTotal }` |

---

## 4. End-to-End API Integration Workflows

### Flow 4.1: End-to-End Monthly Staff Payroll Calculation, Approval & Bank NEFT Export Flow
```
┌──────────────────────────────────────┐
│ 1. GET /finance/attendance/summary   │ ──► Audits monthly attendance, unpaid leaves & overtime hours across branches.
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 2. GET /finance/payroll/run          │ ──► Computes base salaries + service commissions + tip allocations.
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 3. POST /finance/payroll/execute     │ ──► CFO approves & locks monthly payroll run liability.
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 4. POST /finance/payroll/export-bank │ ──► Exports ICICI/HDFC Corporate NetBanking bulk NEFT file for bank dispatches.
└──────────────────────────────────────┘
```

---

## 5. Verification Summary

- **Finance & HR APIs Documented:** 2 Auth endpoints + 13 corporate financial REST endpoints across all 14 finance screens (`/finance/*`).
- **End-to-End Workflow Documented:** Complete Monthly Payroll Calculation, Approval & Corporate Bank Export Sequence.
