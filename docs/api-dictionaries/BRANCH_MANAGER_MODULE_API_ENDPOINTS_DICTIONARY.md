#   Salon SaaS — Comprehensive Branch Manager Module API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.6.0  
**Target System:**   Salon SaaS — Branch Manager Workspace (`apps/web/src/modules/branchManager`) & Backend API Gateway (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Every Screen, POS Checkout, Roster Grid, and Branch End-to-End Operational Workflows  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & Branch Tenant Scoping

The **Branch Manager Module** (`apps/web/src/modules/branchManager`) is an operational workspace designed for salon outlet general managers, floor managers, and front-desk receptionists. 

All API queries and transactions executed in this workspace operate with **Strict Branch Tenant Scoping**:
```sql
-- Architectural Enforcer: All queries automatically inject active branch scope
SELECT * FROM appointments 
WHERE branch_id = :current_branch_id 
  AND scheduled_date = CURRENT_DATE;
```

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              BRANCH MANAGER OPERATIONAL DOMAIN MAP                                     │
├────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────┤
│ 1. Floor Operations & Diary    │ 2. Point of Sale & Checkout           │ 3. Local Stock & Team Control │
│  • Live Chair & Room Occupancy │  • Split-Tender POS Billing           │  • Local Shelf Stock Ledger   │
│  • Appointment Calendar Matrix │  • Auto Consumable Recipe Deduction   │  • BOM Recipe Consumption Logs│
│  • Walk-In Queue & Check-In    │  • Tip & Stylist Attribution          │  • Inter-Branch Goods Receipt │
│  • Client Consultation Records │  • GST Tax Invoicing & Credit Notes   │  • Daily Staff Shift Rosters  │
│                                │  • End-of-Day (EOD) Cash Till Close   │  • Stylist Commission Payouts │
└────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────┘
```

---

## 2. Authentication, Login & Shift Clock-In APIs

**Base Path:** `/api/v1/auth`, `/api/v1/staff`  
**Backend Controllers:** `apps/api/src/modules/auth/auth.controller.ts`, `apps/api/src/modules/staff/staff.controller.ts`  
**Database Entities:** `users`, `user_sessions`, `branches`, `staff_attendance_logs`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Request Payload Highlights | Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | `/branch-manager/login`<br>Manager Portal Login | Authenticates Branch Manager credentials and returns JWT bearer token bound to assigned branch ID (`branch_id`). | `{ email, password }` | `{ token, user: { id, role: 'BRANCH_MANAGER', branchId: 'BR-001' } }` |
| `/api/v1/auth/me` | `GET` | Sidebar & Header Bar | Validates session token and loads assigned branch metadata, active workstation ID, and manager authorization scopes. | Headers: `Authorization: Bearer <token>` | `{ user_id, name, branch_id, branch_name: 'Indrapuri Flagship' }` |
| `/api/v1/staff/clock-in` | `POST` | Top Nav Clock-In Button | Clocks in the manager or floor reception staff for the daily shift, starting the attendance tracking session. | `{ staff_id, branch_id, terminal_id }` | `{ clock_in_time, shift_status: 'Active' }` |
| `/api/v1/staff/clock-out` | `POST` | Top Nav Clock-Out Button | Clocks out the manager or floor reception staff at the end of shift after verifying EOD cash till reconciliation. | `{ staff_id, branch_id, eod_reconciled: true }` | `{ clock_out_time, total_shift_hours }` |

---

## 3. Screen-by-Screen & Tab-by-Tab API Endpoint Dictionary

### 3.1 Screen: Branch Dashboard & Live Floor Pulse (`/branch-manager/`)
* **UI Pages & Components:** `DashboardPage.tsx`
* **Target Database Entities:** `branches`, `appointments`, `invoices`, `staff_attendance_logs`, `cash_drawer_sessions`

| Endpoint URI | HTTP Method | Target UI Widget | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/dashboard/branch-kpis` | `GET` | Top Metric Cards | Fetches live daily billed revenue (₹), active chair occupancy %, total appointments today, clocked-in staff count, and till balance. | Query: `?branch_id=BR-001`<br>Res: `{ todayRevenue, occupancyPct, appointmentsToday, activeStaffCount, tillCashBalance }` |
| `/api/v1/appointments/today-queue` | `GET` | Appointments Stream Widget | Displays real-time timeline stream of appointments scheduled or in-service on the floor today. | Query: `?branch_id=BR-001&date=TODAY`<br>Res: `Array<AppointmentQueueItem>` |
| `/api/v1/inventory/alerts/branch` | `GET` | Low Stock Banner | Alerts manager of depleted consumable products (e.g. L'Oréal Shampoo tubes) below 5-unit safety stock at dispensary. | Query: `?branch_id=BR-001`<br>Res: `Array<LowStockAlertItem>` |

---

### 3.2 Screen: Appointments Diary & Station Calendar (`/branch-manager/appointments`)
* **UI Pages & Components:** `AppointmentsPage.tsx`
* **Target Database Entities:** `appointments`, `appointment_line_items`, `staff_schedules`, `clients`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/appointments` | `GET` | Calendar & Table View | Loads appointment diary scoped to manager's branch for selected date. Supports filtering by status (`Scheduled`, `In-Service`, `Completed`). | Query: `?branch_id=BR-001&date=2026-08-27`<br>Res: `Array<AppointmentObject>` |
| `/api/v1/appointments` | `POST` | New Appointment Modal | Creates a new phone or advance booking with client selection, treatment services, specialist assignment, and station chair number. | Body: `{ branch_id, client_id, staff_id, station_chair_number: 'Chair 04', scheduled_start_time, services: [...] }` |
| `/api/v1/appointments/:id/status`| `PATCH` | Action Buttons / Drag Drop | Updates booking state (e.g. `Arrived` -> `In-Service` when client sits on chair, or `Completed` after treatment). | Body: `{ status: 'In-Service', actual_start_time: '2026-08-27T10:30:00Z' }` |
| `/api/v1/appointments/:id/reassign`| `PATCH` | Reassign Specialist Modal | Reallocates an appointment to another available specialist when primary stylist is delayed or on emergency leave. | Body: `{ new_staff_id: 'STF-108', reassignment_reason: 'Stylist Delayed' }` |

---

### 3.3 Screen: Walk-In Client Check-In & POS Queue (`/branch-manager/walk-ins`)
* **UI Pages & Components:** `WalkinsPage.tsx`
* **Target Database Entities:** `appointments`, `appointment_line_items`, `clients`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/appointments/walkins` | `GET` | Reception Queue List | Fetches waiting list of un-booked walk-in clients currently seated in the reception lounge with estimated wait times. | Query: `?branch_id=BR-001`<br>Res: `Array<WalkinQueueItem>` |
| `/api/v1/appointments/walkins` | `POST` | Check-In Walk-In Modal | Issues a digital queue token for a walk-in client, selects requested services, and assigns next available styling chair. | Body: `{ branch_id, client_name, client_phone, requested_services: [...], preferred_stylist_id }` |
| `/api/v1/appointments/walkins/:id/seat`| `PATCH` | "Seat Client" Button | Marks walk-in token as `Seated` and notifies assigned specialist via mobile push alert. | Body: `{ station_chair_number: 'Chair 02', staff_id: 'STF-102' }` |

---

### 3.4 Screen: Client Directory & CRM Desk (`/branch-manager/customers`)
* **UI Pages & Components:** `CustomersPage.tsx`
* **Target Database Entities:** `clients`, `client_allergies`, `appointment_history`, `store_credits`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/customers` | `GET` | Clients Roster Table | Lists branch clients filterable by name, phone number, loyalty membership tier, and total visit count. | Query: `?branch_id=BR-001&search=Sharma`<br>Res: `Array<ClientObject>` |
| `/api/v1/customers` | `POST` | Add New Client Modal | Registers a new client profile at reception with contact details, gender, birthday, and patch test allergy tags. | Body: `{ branch_id, first_name, last_name, phone, email, gender, allergies: ['Ammonia Sensitive'] }` |
| `/api/v1/customers/:id/history` | `GET` | Client Profile Drawer | Retrieves client's historical treatment log, past formulas used, bill receipts, and remaining store credit balance. | Params: `id=CST-9910`<br>Res: `{ client, visitHistory, formulasUsed, creditBalance }` |

---

### 3.5 Screen: Services Menu & Recipe Viewer (`/branch-manager/services`)
* **UI Pages & Components:** `ServicesPage.tsx`
* **Target Database Entities:** `services`, `service_categories`, `service_recipes`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/services` | `GET` | Services Catalogue Grid | Displays active salon service menu filterable by category (Hair, Skin, Spa, Nails), turnaround duration, and base price. | Query: `?branch_id=BR-001`<br>Res: `Array<ServiceObject>` |
| `/api/v1/services/:id/recipe` | `GET` | View Recipe BOM Modal | Shows mandatory consumable inventory items (e.g. 30ml Color + 40ml Developer) required for standard service execution. | Params: `id=SRV-COL-01`<br>Res: `{ serviceName, recipeItems: [{ sku_name, qty, unit }] }` |

---

### 3.6 Screen: Team, Roster & Commission (`/branch-manager/team`)
* **UI Pages & Components:** `TeamPage.tsx`
* **Target Database Entities:** `staff_profiles`, `staff_attendance_logs`, `staff_rosters`, `commissions`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/staff/branch-team` | `GET` | Staff Roster & Status Grid | Lists all specialists assigned to current branch, active clock-in timestamps, current chair status, and today's target achievement. | Query: `?branch_id=BR-001`<br>Res: `Array<StaffStatusItem>` |
| `/api/v1/staff/attendance/log` | `GET` | Attendance Tab | Displays monthly attendance register, total shift hours worked, late arrival penalties, and overtime hours. | Query: `?branch_id=BR-001&month=2026-08`<br>Res: `Array<AttendanceRecord>` |
| `/api/v1/staff/tips/distribute` | `POST` | Tip Allocation Modal | Distributes daily floor tips collected at checkout among performing specialists and support assistants. | Body: `{ branch_id, date: '2026-08-27', total_tip_amount: 3500.00, allocations: [{ staff_id, tip_amount }] }` |

---

### 3.7 Screen: Retail Products & Local Shelf Stock (`/branch-manager/retail`)
* **UI Pages & Components:** `RetailPage.tsx`
* **Target Database Entities:** `inventory_items`, `branch_stock_ledger`, `stock_receipts`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/inventory/branch-stock` | `GET` | Shelf Stock Inventory Table | Monitors retail product stock (shampoos, serums, hair wax) and consumable salon dispensary stock at current branch. | Query: `?branch_id=BR-001`<br>Res: `Array<BranchStockItem>` |
| `/api/v1/inventory/reorder-request`| `POST` | Reorder Request Modal | Submits stock replenishment request to Central Warehouse for depleted product SKUs. | Body: `{ branch_id, items: [{ sku_id: 'SKU-5821', quantity_requested: 20 }] }` |
| `/api/v1/inventory/receive-goods` | `POST` | Receive Inter-Branch Goods | Confirms receipt of inter-branch stock delivery, updates local shelf inventory balance, and logs receipt voucher. | Body: `{ transfer_id, branch_id, items_received: [{ sku_id, qty_received }] }` |

---

### 3.8 Screen: Point of Sale (POS) & Invoice Checkout (`/branch-manager/payments/new-invoice`)
* **UI Pages & Components:** `CreateInvoicePage.tsx`
* **Target Database Entities:** `invoices`, `invoice_line_items`, `invoice_payments`, `stock_consumption_logs`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/billing/checkout` | `POST` | POS Split-Tender Checkout | Generates GST Tax Invoice (CGST 9% + SGST 9%), deducts consumable recipe stock, records payment modes (Cash/UPI/Card), and awards loyalty points. | Body: `{ branch_id, client_id, appointment_id, line_items: [...], payments: [{ mode: 'Cash', amount: 1000 }, { mode: 'UPI', amount: 1500 }], discount_amount, tip_amount }` |
| `/api/v1/billing/calculate-tax` | `POST` | Live Invoice Form | Computes real-time HSN/SAC GST breakdown, valid membership discounts, and total payable amount before billing. | Body: `{ branch_id, client_id, items: [...] }`<br>Res: `{ subtotal, cgst, sgst, discount, totalPayable }` |

---

### 3.9 Screen: Payments History & EOD Till Reconciliation (`/branch-manager/payments`)
* **UI Pages & Components:** `PaymentsPage.tsx`
* **Target Database Entities:** `invoices`, `payments`, `cash_drawer_sessions`, `refund_requests`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/billing/invoices/branch` | `GET` | Today's Invoices Table | Fetches all tax invoices generated today at manager's branch with receipt status and payment mode breakdown. | Query: `?branch_id=BR-001&date=TODAY`<br>Res: `Array<BranchInvoiceObject>` |
| `/api/v1/payments/cash-drawer/close`| `POST` | EOD Cash Till Close Modal | Reconciles physical cash in till drawer against system recorded cash sales, logs variance, and locks EOD register session. | Body: `{ branch_id, opening_float: 5000, physical_cash_counted: 48500, system_cash_expected: 48500, manager_notes }` |
| `/api/v1/billing/refunds/request` | `POST` | Process Refund Modal | Submits a service refund application or issues store credit to client upon service dissatisfaction. | Body: `{ invoice_id, refund_amount, refund_mode: 'StoreCredit', reason }` |

---

### 3.10 Screen: Branch Reports & Daily EOD Analytics (`/branch-manager/reports`)
* **UI Pages & Components:** `ReportsPage.tsx`
* **Target Database Entities:** `invoices`, `appointments`, `staff_attendance_logs`, `branch_stock_ledger`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/reports/branch-eod` | `GET` | EOD Daily Summary Report | Generates complete End-of-Day report summarizing gross turnover, service vs retail breakdown, GST collected, and payment split. | Query: `?branch_id=BR-001&date=2026-08-27`<br>Res: `{ grossRevenue, serviceSales, retailSales, totalGst, paymentSplit }` |
| `/api/v1/reports/stylist-productivity`| `GET` | Stylist Performance Report | Computes chair utilization %, ticket average, client request rate, and retail cross-sell revenue for each branch specialist. | Query: `?branch_id=BR-001&range=THIS_MONTH`<br>Res: `Array<StylistReportItem>` |
| `/api/v1/reports/branch-export` | `POST` | Export Report Modal | Exports daily floor reports in PDF or Excel format for regional manager submission or tax filing. | Body: `{ branch_id, report_type: 'EOD_Summary', format: 'PDF', date: '2026-08-27' }` |

---

### 3.11 Screen: Branch Settings & Station Configuration (`/branch-manager/settings`)
* **UI Pages & Components:** `SettingsPage.tsx`
* **Target Database Entities:** `branches`, `branch_operating_hours`, `styling_stations`

| Endpoint URI | HTTP Method | Target UI Section / Modal | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/branches/:id/settings` | `GET` / `PATCH` | Branch General Settings | Views and updates branch reception contact number, receipt footer message, and local POS thermal printer configurations. | Body: `{ contact_phone: '+91 755 4991200', receipt_footer: 'Thank you for visiting Atelier Luxury Spa!' }` |
| `/api/v1/branches/:id/stations` | `GET` / `POST` | Station Config Tab | Configures active styling chairs, barber stations, and aesthetic spa room designations. | Body: `{ station_name: 'Styling Chair 05', station_type: 'Hair Couture', is_active: true }` |

---

## 4. End-to-End API Integration Workflows

### Flow 4.1: End-to-End Walk-in Client Check-In, Chair Allocation & Checkout Flow
Complete operational sequence executed when an unannounced walk-in client arrives at salon reception:

```
┌──────────────────────────────────────┐
│ 1. POST /appointments/walkins        │ ──► Front desk receptionist registers client & issues digital Queue Token.
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 2. GET /appointments/availability    │ ──► System checks specialist availability & assigns styling chair (e.g. Chair 03).
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 3. PATCH /appointments/walkins/:id/seat│──► Seated on chair: Updates status to 'In-Service' & notifies specialist.
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 4. POST /billing/checkout            │ ──► Service concludes: Reception generates GST invoice & processes payment.
└──────────────────────────────────────┘
```

---

### Flow 4.2: End-to-End POS Billing, Consumable Recipe BOM Auto-Deduction & Split-Tender Checkout
Sequence executed at POS checkout desk upon treatment completion:

1. **Calculate Bill & Taxes:** `POST /api/v1/billing/calculate-tax`  
   *Calculates taxable service subtotal, retail products, HSN/SAC GST tax (18%), and applies membership discounts.*
2. **Execute Split-Tender Checkout:** `POST /api/v1/billing/checkout`  
   *Processes split payment (e.g., ₹1,000 Cash + ₹1,500 UPI QR scan + ₹500 Tip attribution to stylist).*
3. **Consumable Recipe Stock Auto-Deduction:** Internal Trigger  
   *Automatically deducts 30ml L'Oréal Majirel Colour Tube + 40ml Developer from `branch_stock_ledger` based on service BOM recipe.*
4. **Loyalty Reward Grant:** Internal Trigger  
   *Awards loyalty points (e.g., 100 pts) to client profile balance.*
5. **Print Tax Invoice:** `GET /api/v1/billing/invoices/:id/pdf`  
   *Prints GST compliant physical receipt on thermal POS printer.*

---

### Flow 4.3: End-to-End EOD Cash Drawer Till Reconciliation & Register Settlement
Sequence executed by the Branch Manager at end of business day:

1. **Clock-Out Verification Check:** `GET /api/v1/staff/branch-team`  
   *Verifies all specialists have completed appointments and clocked out.*
2. **Retrieve Daily Billing Totals:** `GET /api/v1/billing/invoices/branch?date=TODAY`  
   *Fetches system recorded payment mode totals (Expected Cash in till, Card settlements, UPI transactions).*
3. **Physical Till Counting & EOD Reconciliation:** `POST /api/v1/payments/cash-drawer/close`  
   *Manager inputs physical cash counted. System validates zero variance against `opening_float + cash_sales`.*
4. **EOD Summary Report Generation:** `GET /api/v1/reports/branch-eod`  
   *Generates official EOD report summarizing turnover, GST liability, and performance.*
5. **Manager Shift Clock-Out:** `POST /api/v1/staff/clock-out`  
   *Manager clocks out, locking register till session until next morning.*

---

### Flow 4.4: End-to-End Staff Shift Clock-In, Attendance Log & Daily Commission Calculation
Daily workflow tracking staff floor presence and earning attribution:

1. **Stylist Arrival Clock-In:** `POST /api/v1/staff/clock-in`  
   *Stylist clocks in on reception floor tablet; attendance log marks `Active` status.*
2. **Service Completion Attribution:** `POST /api/v1/billing/checkout`  
   *Every completed invoice credits service revenue and tip amounts to assigned stylist ID.*
3. **Daily Tip Distribution:** `POST /api/v1/staff/tips/distribute`  
   *Manager distributes floor tips collected at checkout among stylists and assistants.*
4. **Commission Computation:** `GET /api/v1/staff/commissions?month=2026-08`  
   *System updates stylist's MTD commission earnings based on revenue tier rules.*

---

### Flow 4.5: End-to-End Local Shelf Stock Audit, Reorder Request & Inter-Branch Goods Receipt
Workflow managing branch dispensary inventory replenishment:

1. **Low Stock Detection:** `GET /api/v1/inventory/alerts/branch`  
   *System alerts manager that L'Oréal Hydra Serums have fallen below 5-unit safety stock.*
2. **Reorder Request Submission:** `POST /api/v1/inventory/reorder-request`  
   *Manager submits request for 20 units to Central Warehouse.*
3. **Inter-Branch Goods Receipt Confirmation:** `POST /api/v1/inventory/receive-goods`  
   *Upon delivery arrival, manager inspects items, enters received quantities, and updates local shelf stock ledger.*

---

## 5. Verification Summary

- **Branch Manager APIs Documented:** 4 Authentication & Clock-In endpoints + 28 REST operational endpoints covering every Branch Manager UI screen & modal.
- **End-to-End Workflows Documented:** 5 complete step-by-step operational sequences (Walk-In Check-In, POS Split-Tender Checkout & BOM Auto-Deduction, EOD Cash Till Close, Staff Clock-In & Tips, Stock Reorder & Goods Receipt).
- **UI Screen Coverage:** 100% of all 11 Branch Manager pages in [`apps/web/src/modules/branchManager`](file:///e:/salon%20management%20system/ -Salon/apps/web/src/modules/branchManager) mapped.
- **Database Schema Alignment:** Cross-referenced with [`docs/BRANCH_MANAGER_DATABASE_SCHEMA_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/BRANCH_MANAGER_DATABASE_SCHEMA_DICTIONARY.md).
