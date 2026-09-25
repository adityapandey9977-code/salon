#   Salon SaaS — Branch Manager Panel Database Schema & UI Field Mapping Dictionary

**Document Version:** 2.6.0  
**Target System:**   Salon SaaS Web Application (`/branch-manager/*`)  
**Scope:** Branch Manager Workspace (Outlet Floor Operations, POS, Rosters, Local Stock & EOD Cash Drawer)  
**Classification:** Complete Database Dictionary & Technical UI-to-Schema Mapping  

---

## Architecture & Branch Operational Domain Map

The **Branch Manager Workspace** operates with strict **Branch Tenant Scoping** (`WHERE branch_id = :current_branch_id`). All local floor transactions, styling station assignments, cash drawer reconciliations, and inventory movements are bound to the manager's assigned branch.

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

## 1. Branch Overview & Live Floor Pulse

### 1.1 UI View: Branch Operations Dashboard
**Primary Tables:** `branches`, `appointments`, `staff_attendance_logs`, `invoices`, `cash_drawer_sessions`

| UI Metric / Dashboard Component | Database Column / Query Source | Data Type | Constraints / Calculation | Business Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Branch Context ID** | `branches.id` | `VARCHAR(64)` | `PRIMARY KEY` | Manager's active branch scope |
| **Today's Gross Sales (₹)** | `SUM(invoices.total_payable_amount)` | `DECIMAL(12, 2)` | `WHERE DATE(created_at) = CURRENT_DATE` | Live daily billed revenue |
| **Active Chair Occupancy %** | `(active_appointments / total_chairs) * 100` | `DECIMAL(5, 2)` | `0.00% to 100.00%` | Stations currently occupied |
| **Today's Bookings Count** | `COUNT(appointments.id)` | `INTEGER` | `WHERE scheduled_date = TODAY` | Total appointments today |
| **Staff on Floor Count** | `COUNT(staff_attendance_logs.id)` | `INTEGER` | `WHERE clock_out_time IS NULL` | Active stylists clocked in |
| **Walk-in Queue Length** | `COUNT(appointments.id)` | `INTEGER` | `WHERE status = 'Walk-In Waiting'` | Clients waiting in reception |
| **Cash in Till Balance (₹)** | `cash_drawer_sessions.current_cash_balance` | `DECIMAL(12, 2)` | `opening_float + cash_sales - cash_payouts` | Live physical cash in register |

---

## 2. Appointment Diary, Calendar & Floor Queue

### 2.1 UI Page: Booking Diary & Station Allocation
**Primary Database Table:** `appointments`  
**Secondary Tables:** `appointment_line_items`, `clients`, `staff_profiles`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Booking Reference** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Booking Ref (e.g. `APT-2026-901`) |
| **Branch Scope** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Current salon branch |
| **Client Search / Profile** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Selected Customer |
| **Assigned Stylist / Specialist**| `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)`| Performing Stylist |
| **Styling Chair / Treatment Room**| `station_chair_number` | `VARCHAR(30)` | `NOT NULL` | e.g. "Chair 04", "Spa Suite 02" |
| **Scheduled Start Time** | `scheduled_start_time` | `TIMESTAMPTZ` | `NOT NULL` | Service start slot |
| **Scheduled End Time** | `scheduled_end_time` | `TIMESTAMPTZ` | `NOT NULL` | Auto-computed from service durations |
| **Actual Check-in Time** | `actual_checkin_time` | `TIMESTAMPTZ` | `NULL` | Timestamp client arrived at reception |
| **Actual Service Completion** | `actual_completed_time`| `TIMESTAMPTZ` | `NULL` | Timestamp service concluded |
| **Booking Channel Source** | `booking_channel` | `VARCHAR(30)` | `DEFAULT 'Front Desk Walk-In'` | `Mobile App`, `Walk-In`, `Phone Call` |
| **Appointment Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Confirmed'` | `Confirmed`, `Arrived`, `In Service`, `Completed`, `Cancelled`, `No Show` |
| **Special Styling Notes** | `special_instructions` | `TEXT` | `NULL` | e.g. "Client requested low ammonia formula" |

---

### 2.2 UI Modal: Walk-In Client Check-In
**Primary Database Table:** `appointment_line_items`

| UI Modal Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Line Item ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Booking Item ID |
| **Appointment Link** | `appointment_id` | `VARCHAR(64)` | `NOT NULL, FK -> appointments(id)` | Parent Booking |
| **Selected Service** | `service_id` | `VARCHAR(64)` | `NOT NULL, FK -> services(id)` | Service from Catalogue |
| **Service Duration (Mins)** | `duration_minutes` | `INTEGER` | `NOT NULL` | Execution time |
| **Service Selling Price** | `price_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Standard or customized price |
| **Applied Discount (₹ / %)** | `discount_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Manager discretionary discount |
| **Item Sequence Index** | `service_order_index` | `SMALLINT` | `DEFAULT 1` | Order of multi-service execution |

---

## 3. Point of Sale (POS), Checkout & Recipe Consumable Auto-Deduction

### 3.1 UI Desk: POS Billing & Split-Tender Checkout
**Primary Database Table:** `invoices`  
**Secondary Tables:** `invoice_line_items`, `invoice_payments`, `stock_consumption_logs`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Tax Invoice Number** | `invoice_number` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | GST Tax Invoice (e.g. `INV-ATL-26-0881`) |
| **Branch Location** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Billing Branch |
| **Customer Billed** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Customer Profile |
| **Billing Cashier / Manager** | `cashier_user_id` | `VARCHAR(64)` | `NOT NULL, FK -> users(id)` | Logged-in Manager/Receptionist |
| **Taxable Subtotal (Services)**| `service_subtotal_amount`| `DECIMAL(12, 2)`| `NOT NULL` | Services base total |
| **Taxable Subtotal (Retail)** | `retail_subtotal_amount` | `DECIMAL(12, 2)`| `DEFAULT 0.00` | Retail products sold |
| **Central GST (CGST 9%)** | `cgst_amount` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | 9% Central GST |
| **State GST (SGST 9%)** | `sgst_amount` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | 9% State GST |
| **Integrated GST (IGST 18%)** | `igst_amount` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | 18% Interstate GST |
| **Stylist Tip Gratuity (₹)** | `tip_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Client tip attributed to stylist |
| **Gross Total Payable (₹)** | `total_payable_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Net invoice payable |
| **Payment Settlement Status** | `payment_status` | `VARCHAR(20)` | `DEFAULT 'Paid'` | `Paid`, `Partially Paid`, `Refunded` |

---

### 3.2 UI Component: Split-Tender Payment Methods
**Primary Database Table:** `invoice_payments`

| UI Tender Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Tender Payment ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Payment Transaction ID |
| **Invoice Link** | `invoice_id` | `VARCHAR(64)` | `NOT NULL, FK -> invoices(id)` | Target Invoice |
| **Payment Mode** | `payment_mode` | `VARCHAR(30)` | `NOT NULL` | `Cash`, `Credit Card`, `Debit Card`, `UPI / QR`, `Prepaid Wallet`, `Gift Voucher` |
| **Tendered Amount (₹)** | `amount_paid` | `DECIMAL(12, 2)` | `NOT NULL` | Amount paid in this mode |
| **Digital Gateway / EDC Ref** | `transaction_ref` | `VARCHAR(100)` | `NULL` | UPI UTR / Card EDC Slip Number |
| **Settlement Timestamp** | `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Exact timestamp payment captured |

---

### 3.3 Backend Automatic Trigger: Service Consumable Auto-Deduction
**Primary Database Table:** `stock_consumption_logs`

| Consumable Tracking Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Consumption Log ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Consumption Event ID |
| **Branch Location** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Branch where stock consumed |
| **Invoice Reference** | `invoice_id` | `VARCHAR(64)` | `NOT NULL, FK -> invoices(id)` | Completed Invoice |
| **Performed Service** | `service_id` | `VARCHAR(64)` | `NOT NULL, FK -> services(id)` | Service executed |
| **Consumed Product SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)`| Consumed SKU |
| **Batch / Lot Number** | `batch_number` | `VARCHAR(60)` | `NOT NULL` | FIFO Batch lot deducted |
| **Standard BOM Quantity** | `standard_recipe_qty`| `DECIMAL(10, 3)` | `NOT NULL` | Expected BOM standard (e.g. 45.000) |
| **Actual Dispensed Qty** | `actual_dispensed_qty`| `DECIMAL(10, 3)` | `NOT NULL` | Actual used (e.g. 48.000) |
| **Measurement Unit** | `measurement_unit` | `VARCHAR(30)` | `NOT NULL` | `ml`, `gm`, `Tubes`, `Scoops` |
| **Variance Delta Qty** | `variance_qty` | `DECIMAL(10, 3)` | `GENERATED ALWAYS AS (actual_dispensed_qty - standard_recipe_qty)` | Over/under consumption |
| **Variance Reason / Notes** | `variance_notes` | `VARCHAR(150)` | `NULL` | e.g. "Long/thick hair extra mix" |

---

## 4. Local Shelf Stock, Inward Transfers & Daily Cycle Counts

### 4.1 UI Page: Local Branch Stock Ledger
**Primary Database Table:** `branch_stock_ledgers`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Branch Scope** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Manager's outlet |
| **Product SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | Consumable or Retail SKU |
| **On-Hand Physical Units** | `on_hand_quantity` | `DECIMAL(10, 3)` | `NOT NULL DEFAULT 0` | Physical units on shelf/backwash |
| **Reserved in Service** | `allocated_reserved_qty`| `DECIMAL(10, 3)`| `DEFAULT 0` | In-progress service locks |
| **Available Stock Units** | `available_quantity` | `DECIMAL(10, 3)` | `GENERATED ALWAYS AS (on_hand_quantity - allocated_reserved_qty)` | Net available |
| **Local Safety Threshold** | `safety_stock_threshold`| `INTEGER` | `DEFAULT 5` | Branch reorder warning level |
| **Stock Health Badge** | `stock_status` | `VARCHAR(20)` | `DEFAULT 'In Stock'` | `In Stock`, `Low Stock Alert`, `Depleted` |

---

### 4.2 UI Modal: Inter-Branch Transfer Inwarding & Goods Receipt (GRN)
**Primary Database Table:** `stock_transfers`  
**Secondary Table:** `stock_transfer_grn_receipts`

| UI Inwarding Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Transfer Manifest ID** | `stock_transfer_id` | `VARCHAR(64)` | `NOT NULL, FK -> stock_transfers(id)` | Dispatched transfer manifest |
| **Receiving Branch** | `destination_branch_id`| `VARCHAR(64)`| `NOT NULL, FK -> branches(id)` | Receiving Manager's branch |
| **Received Units Count** | `received_quantity` | `INTEGER` | `NOT NULL` | Units counted upon unboxing |
| **Tamper Seal Intact Check**| `is_seal_intact` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | Verified tamper seal integrity |
| **Transit Damage Units** | `damaged_in_transit_qty`| `INTEGER` | `DEFAULT 0` | Broken / leaked items |
| **Receiver Storekeeper Name**| `received_by` | `VARCHAR(120)` | `NOT NULL` | Manager/storekeeper sign-off |
| **Receipt Timestamp** | `received_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Exact inwarding timestamp |

---

## 5. Staff Rosters, Shift Clock-In & Stylist Performance

### 5.1 UI Page: Daily Staff Roster & Attendance Clock-In
**Primary Database Table:** `staff_attendance_logs`  
**Secondary Table:** `staff_shift_schedules`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Attendance Log ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Attendance Record ID |
| **Staff Member** | `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Stylist / Therapist |
| **Branch Location** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Branch location |
| **Shift Date** | `shift_date` | `DATE` | `NOT NULL DEFAULT CURRENT_DATE` | Operating date |
| **Scheduled Shift** | `shift_timing_code` | `VARCHAR(30)` | `DEFAULT 'Morning (09:00 - 18:00)'` | Assigned shift slot |
| **Clock-In Timestamp** | `clock_in_time` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Stylist biometric/app check-in |
| **Clock-Out Timestamp** | `clock_out_time` | `TIMESTAMPTZ` | `NULL` | Stylist check-out |
| **Break Minutes Total** | `total_break_minutes` | `INTEGER` | `DEFAULT 45` | Rest & lunch duration |
| **Daily Attendance Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Present'` | `Present`, `Late Check-In`, `Half Day`, `Absent` |

---

### 5.2 UI View: Daily Stylist Commission & Productivity Tracker
**Primary Database Table:** `staff_commission_ledger`

| UI Metric / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Stylist Name** | `staff_profiles.full_name`| `VARCHAR(120)`| `NOT NULL` | Employee Full Name |
| **Designation** | `staff_profiles.designation`| `VARCHAR(80)`| `NOT NULL` | Master Stylist, Aesthetician |
| **Today's Completed Services**| `COUNT(invoices.id)` | `INTEGER` | `DEFAULT 0` | Service tickets completed |
| **Service Sales Value (₹)** | `SUM(service_billed_amount)`| `DECIMAL(12, 2)`| `DEFAULT 0.00` | Net service turnover |
| **Retail Products Sold (₹)** | `SUM(retail_billed_amount)` | `DECIMAL(12, 2)`| `DEFAULT 0.00` | Net retail products sold |
| **Daily Commission Earned** | `SUM(commission_amount)` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Earned daily commission (₹) |
| **Tips Collected (₹)** | `SUM(invoices.tip_amount)`| `DECIMAL(12, 2)`| `DEFAULT 0.00` | Direct gratuity earned |

---

## 6. Daily Cash Drawer & End-of-Day (EOD) Till Reconciliation

### 6.1 UI Modal: End-of-Day (EOD) Register Settlement & Till Closing
**Primary Database Table:** `cash_drawer_sessions`  
**Secondary Table:** `cash_drawer_payouts`

| UI Form Field / Settlement Report | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Session ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Till Session ID (e.g. `TILL-20260825-01`) |
| **Branch Scope** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Salon Branch |
| **Operating Date** | `session_date` | `DATE` | `NOT NULL DEFAULT CURRENT_DATE` | Business trading day |
| **Opening Cash Float (₹)** | `opening_cash_float` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 5000.00` | Starting change in till |
| **Total Cash Sales Collected**| `total_cash_sales` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Sum of Cash invoice payments |
| **Total Card Payments** | `total_card_sales` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | EDC POS machine batch total |
| **Total UPI / QR Payments** | `total_upi_sales` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Digital UPI QR collections |
| **Petty Cash Payouts / Expenses**| `total_cash_payouts` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Local branch supplies / tea payout |
| **Expected Cash in Till (₹)**| `expected_closing_cash` | `DECIMAL(12, 2)` | `GENERATED ALWAYS AS (opening_cash_float + total_cash_sales - total_cash_payouts)` | Theoretical cash balance |
| **Physical Hand-Counted Cash**| `actual_closing_cash` | `DECIMAL(12, 2)` | `NOT NULL` | Physical notes & coins counted |
| **Cash Till Discrepancy (₹)**| `cash_variance_delta` | `DECIMAL(12, 2)` | `GENERATED ALWAYS AS (actual_closing_cash - expected_closing_cash)` | Cash Over / Shortage |
| **Discrepancy Justification** | `variance_reason` | `TEXT` | `NULL` | Explanation for cash variance |
| **Closing Manager Name** | `closed_by_user_id` | `VARCHAR(64)` | `NOT NULL, FK -> users(id)` | Manager signing off EOD report |
| **EOD Sign-off Timestamp** | `closed_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Final register lock timestamp |

---

## Summary of Branch Manager Entity Mappings

| Branch Manager UI Workflow | Primary Database Tables | Key Relations & Scoping | Operational Business Impact |
| :--- | :--- | :--- | :--- |
| **1. Floor Diary & Chair Matrix** | `appointments`, `appointment_line_items` | `branch_id`, `client_id`, `staff_id` | Real-time chair allocation, walk-in check-in, service in-progress tracking |
| **2. POS Split-Tender Checkout** | `invoices`, `invoice_payments` | `branch_id`, `client_id`, `invoice_id` | GST compliance, multi-payment tender (Cash, Card, UPI, Wallet), tip allocation |
| **3. Recipe Consumable Deduction** | `stock_consumption_logs`, `branch_stock_ledgers` | `branch_id`, `service_id`, `product_sku_id` | Automatic backwash ingredient deduction based on standard BOM recipe |
| **4. Local Shelf Stock & GRN** | `branch_stock_ledgers`, `stock_transfers` | `branch_id`, `product_sku_id`, `destination_branch_id` | Local stock on hand, inward transfer verification, tamper-seal sign-off |
| **5. Staff Roster & Commissions** | `staff_attendance_logs`, `staff_commission_ledger` | `branch_id`, `staff_id`, `invoice_id` | Clock-in/out attendance, daily shift coverage, stylist incentive tracking |
| **6. End-of-Day Cash Till Close** | `cash_drawer_sessions`, `cash_drawer_payouts` | `branch_id`, `closed_by_user_id` | Opening float verification, cash over/short calculation, daily settlement report |

---
*End of Branch Manager Panel Module Database Schema Specification.*
