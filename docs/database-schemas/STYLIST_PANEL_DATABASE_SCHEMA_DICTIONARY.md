#   Salon SaaS — Stylist Panel Module Database Schema & UI Field Mapping Dictionary

**Document Version:** 3.1.0  
**Target System:**   Salon SaaS Web Application & Tablet App (`/stylist-portal/*`)  
**Scope:** Stylist & Therapist Workspace (Daily Chair Queue, Digital Formula Cards, BOM Recipe Logging, Real-Time Commission Wallet & Portfolio)  
**Classification:** Complete Database Dictionary & Technical UI-to-Schema Mapping  

---

## Architecture & Stylist Operational Domain Map

The **Stylist Panel** operates with **Stylist User Scoping** (`WHERE staff_id = :current_stylist_id`). Performing stylists interact directly with the client's treatment history, log bespoke colour formulas, track real-time commission earnings, and manage chair lifecycle states.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                STYLIST OPERATIONAL DOMAIN MAP                                          │
├────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────┤
│ 1. Chair Queue & Appointments  │ 2. Digital Formula Cards & BOM        │ 3. Wallet, Commission & Leave │
│  • Today's Client Roster Queue │  • Client History & Scalp Notes       │  • Real-Time Commission Wallet│
│  • Chair Check-in & In-Service │  • Colour Mixing Formula Cards        │  • Daily Tips & Retail Upsells│
│  • Add-on Service Upsell       │  • Dispensed Consumables BOM Logging  │  • Monthly Target Progress %  │
│  • Before / After Style Photos │  • Chemical Allergy Alerts            │  • Shift Rosters & Leave Desk │
└────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────┘
```

---

## 1. Stylist Shift Roster & Daily Appointments Queue

### 1.1 UI View: Today's Appointments & Chair Queue (`StylistQueuePage.tsx`)
**Primary Database Table:** `appointments`  
**Secondary Tables:** `appointment_line_items`, `clients`, `staff_profiles`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Booking Reference** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Booking ID (e.g. `APT-2026-901`) |
| **Branch Scope** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Active Salon Branch |
| **Assigned Stylist** | `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Current Stylist ID |
| **Client Customer** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Client Profile |
| **Styling Station / Chair** | `station_chair_number` | `VARCHAR(30)` | `NOT NULL` | Assigned Styling Station |
| **Scheduled Start Slot** | `scheduled_start_time` | `TIMESTAMPTZ` | `NOT NULL` | Scheduled Start Time |
| **Scheduled End Slot** | `scheduled_end_time` | `TIMESTAMPTZ` | `NOT NULL` | Scheduled Finish Time |
| **Actual Service Start** | `actual_service_started_at`| `TIMESTAMPTZ` | `NULL` | When stylist clicked "Start Service" |
| **Actual Service End** | `actual_completed_time`| `TIMESTAMPTZ` | `NULL` | When stylist clicked "Complete Service" |
| **Chair Lifecycle Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Confirmed'` | `Confirmed`, `Arrived`, `In Service`, `Completed` |
| **Estimated Ticket (₹)** | `total_estimated_amount`| `DECIMAL(12, 2)`| `NOT NULL` | Total service value |

---

## 2. Client Consultation Dossier & Digital Formula Cards

### 2.1 UI View: Digital Colour & Treatment Formula Cards (`StylistFormulaCards.tsx`)
**Primary Database Table:** `client_treatment_formula_cards`

| UI Form Field / Formula Card | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Formula Card ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Formula Record ID (e.g. `FORM-2026-081`) |
| **Client Link** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Customer Profile |
| **Performing Stylist** | `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Formulating Stylist |
| **Associated Service** | `service_id` | `VARCHAR(64)` | `NOT NULL, FK -> services(id)` | Service Performed |
| **Treatment Date** | `treatment_date` | `DATE` | `NOT NULL DEFAULT CURRENT_DATE` | Date Formulated |
| **Base Hair / Skin Tone** | `base_shade_level` | `VARCHAR(50)` | `NOT NULL` | e.g. "Level 4 Dark Brown (Virgin)" |
| **Target Shade Tone** | `target_shade_level` | `VARCHAR(50)` | `NOT NULL` | e.g. "Level 7 Caramel Blonde Balayage" |
| **Primary Color Shade Code** | `primary_formula_sku` | `VARCHAR(80)` | `NOT NULL` | e.g. "Majirel 6.13 (45g)" |
| **Oxidant Developer Volume** | `developer_volume_ratio`| `VARCHAR(80)` | `NOT NULL` | e.g. "20 Vol (60ml) · 1:1.5 Ratio" |
| **Processing Time (Mins)** | `processing_time_mins` | `INTEGER` | `DEFAULT 35` | Heat lamp / open air timer |
| **Chemical Patch Test Status**| `patch_test_cleared` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | Verified 24hr allergy clearance |
| **Scalp Sensitivity Notes** | `scalp_sensitivity_notes`| `TEXT` | `NULL` | e.g. "Slight tingling at nape area" |

---

## 3. Real-Time Recipe Consumable Dispensing & In-Chair Upselling

### 3.1 UI Modal: Log Dispensed Consumables (`DispenseConsumablesModal.tsx`)
**Primary Database Table:** `stock_consumption_logs`

| UI Form Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Consumption Event ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Consumption Record ID |
| **Appointment Link** | `appointment_id` | `VARCHAR(64)` | `NOT NULL, FK -> appointments(id)` | Current active appointment |
| **Performed Service** | `service_id` | `VARCHAR(64)` | `NOT NULL, FK -> services(id)` | Service being executed |
| **Product Consumable SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | Selected ingredient SKU |
| **Dispensed Quantity** | `actual_dispensed_qty` | `DECIMAL(10, 3)` | `NOT NULL` | Exact measured quantity (e.g. 48.000) |
| **Measurement Unit** | `measurement_unit` | `VARCHAR(30)` | `NOT NULL` | `ml`, `gm`, `Tubes`, `Scoops` |
| **Extra Quantity Reason** | `variance_notes` | `VARCHAR(150)` | `NULL` | e.g. "Extra long hair length mix" |

---

### 3.2 UI Modal: Add-On Service & Retail Upsell (`AddonServiceModal.tsx`)
**Primary Database Table:** `appointment_line_items`

| UI Upsell Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Line Item ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Item Line ID |
| **Appointment Link** | `appointment_id` | `VARCHAR(64)` | `NOT NULL, FK -> appointments(id)` | Parent Booking |
| **Upsold Service / Product** | `service_id` | `VARCHAR(64)` | `NOT NULL, FK -> services(id)` | e.g. "Olaplex Bond Multiplier Addon" |
| **Additional Price (₹)** | `price_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Add-on service rate |
| **Attributed Stylist ID** | `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Stylist earning upsell commission |
| **Is In-Chair Upsell** | `is_upsell_item` | `BOOLEAN` | `DEFAULT TRUE` | Tagged as in-service upsell |

---

## 4. Stylist Commission Wallet, Tips & Daily Earnings Tracker

### 4.1 UI View: Stylist Live Earnings & Wallet Desk (`StylistWalletPage.tsx`)
**Primary Database Table:** `staff_commission_ledger`  
**Secondary Tables:** `invoices`, `staff_monthly_targets`

| UI Wallet Field / Metric | Database Column / Query Source | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Stylist Link** | `staff_commission_ledger.staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Current Stylist ID |
| **Today's Commission Earned**| `SUM(commission_amount) WHERE DATE(created_at) = TODAY` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Real-time computed daily commission (₹) |
| **Today's Tips Collected (₹)**| `SUM(invoices.tip_amount)` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Gratuities attributed directly to stylist |
| **Month-to-Date Earnings (₹)**| `SUM(commission_amount) WHERE MONTH = CURRENT_MONTH` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Cumulative monthly accrued payout |
| **Monthly Revenue Billed (₹)**| `SUM(service_billed_amount + retail_billed_amount)` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Gross turnover generated on chair |
| **Monthly Sales Target (₹)** | `staff_monthly_targets.target_amount` | `DECIMAL(12, 2)` | `DEFAULT 200000.00` | Assigned monthly revenue target |
| **Target Achievement %** | `(revenue_billed / target_amount) * 100` | `DECIMAL(5, 2)` | `0.00% to 150.00%` | Monthly KPI progress bar |
| **Wallet Payout Status** | `staff_commission_ledger.status` | `VARCHAR(20)` | `DEFAULT 'Accrued'` | `Accrued`, `Approved by HR`, `Paid` |

---

## 5. Style Portfolio & Before/After Photo Cards

### 5.1 UI View: Before & After Portfolio Gallery (`StylistPortfolioPage.tsx`)
**Primary Database Table:** `stylist_portfolio_cards`

| UI Portfolio Card Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Portfolio Card ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Card ID (e.g. `PORT-2026-081`) |
| **Stylist Link** | `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Creator Stylist |
| **Appointment Link** | `appointment_id` | `VARCHAR(64)` | `NOT NULL, FK -> appointments(id)` | Completed Appointment |
| **Style Look Title** | `title` | `VARCHAR(150)` | `NOT NULL` | e.g. "Honey Balayage with Face Framing" |
| **Style Category Tags** | `style_tags` | `TEXT[]` | `NOT NULL` | `['Balayage', 'Blonde', 'Layered Cut']` |
| **Before Photo URL** | `before_photo_url` | `TEXT` | `NOT NULL` | Pre-treatment photo |
| **After Photo URL** | `after_photo_url` | `TEXT` | `NOT NULL` | Final finished look photo |
| **Client Consent Confirmed** | `client_consent_given` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | Client digital media consent |
| **Display on Brand Socials** | `is_featured` | `BOOLEAN` | `DEFAULT FALSE` | Featured on customer app showcase |

---

## Summary of Stylist Panel Entity Mappings

| Stylist UI Module | Primary Database Tables | Key Relations & Scoping | Operational Business Impact |
| :--- | :--- | :--- | :--- |
| **1. Chair Queue & Appointments** | `appointments`, `appointment_line_items` | `staff_id`, `branch_id`, `client_id` | Real-time daily appointment timeline, chair check-in, start/complete status |
| **2. Digital Formula Cards** | `client_treatment_formula_cards` | `client_id`, `staff_id`, `service_id` | Bespoke colour formulas, developer ratios, patch test verification, scalp notes |
| **3. Recipe Consumables BOM** | `stock_consumption_logs` | `appointment_id`, `service_id`, `product_sku_id` | Accurate recording of backwash ingredient dispensing with variance justification |
| **4. In-Chair Upsell Addons** | `appointment_line_items` | `appointment_id`, `staff_id`, `service_id` | Real-time add-on service attachments and retail product recommendations |
| **5. Live Commission Wallet** | `staff_commission_ledger`, `invoices` | `staff_id`, `invoice_id` | Live commission tracking (10% services + 5% retail), tips collection, KPI progress |
| **6. Before & After Portfolio** | `stylist_portfolio_cards` | `staff_id`, `appointment_id` | Visual transformation showcase, client consent verification, style tags |

---
*End of Stylist Panel Module Database Schema Specification.*
