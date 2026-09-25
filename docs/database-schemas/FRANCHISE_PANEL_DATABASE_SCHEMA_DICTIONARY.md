#   Salon SaaS — Franchise Panel Module Database Schema & UI Field Mapping Dictionary

**Document Version:** 2.7.0  
**Target System:**   Salon SaaS Web Application (`/franchise-portal/*` & `/admin/franchise`)  
**Scope:** Franchise Partner Workspace (Territory Multi-Outlets, Royalty Settlements, Central Supply & Audit Compliance)  
**Classification:** Complete Database Dictionary & Technical UI-to-Schema Mapping  

---

## Architecture & Franchise Partner Scoping Map

The **Franchise Partner Panel** operates with **Partner Entity Scoping** (`WHERE franchise_partner_id = :current_partner_id`). A single franchise licensee can govern multiple assigned salon outlets across their licensed geographic territory.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              FRANCHISE PARTNER OPERATIONAL DOMAIN MAP                                  │
├────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────┤
│ 1. Territory Outlets Desk      │ 2. Commercial Royalty & Billing       │ 3. Procurement & Brand Audits │
│  • Licensed Outlets Directory  │  • Gross Revenue Accruals             │  • Central HQ Supply Orders   │
│  • Multi-Branch P&L Analytics  │  • Royalty Calculation Engine (10%)   │  • Wholesale Pricing & Invoices│
│  • Regional Footfall & Density │  • Commission Settlement Invoices     │  • Brand SOP Compliance Audits│
│  • Client Base & Growth Metrics│  • Bank Proof & Payment Ledger        │  • Master Agreement Contract  │
└────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────┘
```

---

## 1. Franchise Partner Identity & Master Agreements

### 1.1 UI View: Franchise Partner Master Profile & Contracts Vault
**Primary Database Table:** `franchise_partners`  
**Secondary Table:** `franchise_contracts`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Partner Licensee ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Partner ID (e.g. `FP-001`) |
| **Brand Tenant Link** | `brand_id` | `VARCHAR(64)` | `NOT NULL, FK -> brands(id)` | Central Brand Owner |
| **Franchise Legal Entity** | `name` | `VARCHAR(180)` | `NOT NULL` | e.g. "Apex Wellness & Spa LLP" |
| **Partner Unique Code** | `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | License Code (e.g. `FP-IND-01`) |
| **Managing Principal / MD** | `contact_person` | `VARCHAR(120)` | `NOT NULL` | Authorized Representative |
| **Corporate Email** | `email` | `VARCHAR(150)` | `NOT NULL` | Legal & settlement communications |
| **Direct Contact Phone** | `phone` | `VARCHAR(20)` | `NOT NULL` | Official Phone Number |
| **Registered Business Address**| `address` | `TEXT` | `NOT NULL` | Corporate Registered Office |
| **Legal GSTIN** | `gstin` | `VARCHAR(15)` | `NOT NULL` | 15-character GSTIN Registration |
| **Income Tax PAN** | `pan_number` | `VARCHAR(10)` | `NOT NULL` | Corporate PAN Number |
| **Licensed Territory Region** | `region` | `VARCHAR(120)` | `NOT NULL` | Exclusive Region (e.g. "Indore & Malwa") |
| **Agreement Status** | `agreement_status` | `VARCHAR(30)` | `DEFAULT 'Active'` | `Active`, `Expiring Soon`, `Under Renewal`, `Terminated` |
| **Agreement Start Date** | `agreement_start_date` | `DATE` | `NOT NULL` | Contract Effective Date |
| **Agreement Expiry Date** | `agreement_end_date` | `DATE` | `NOT NULL` | Renewal / Expiration Date |
| **Royalty Calculation Formula**| `royalty_structure` | `VARCHAR(100)` | `DEFAULT '10% Gross Services + 5% Retail'` | Standard agreed fee structure |
| **Fixed Brand Support Fee (₹)**| `fixed_support_fee_monthly`| `DECIMAL(12, 2)`| `DEFAULT 0.00` | Monthly fixed technology & brand charge |
| **Bank Guarantee / Security (₹)**| `security_deposit_amount`| `DECIMAL(12, 2)`| `DEFAULT 1000000.00`| Refundable security deposit on file |

---

## 2. Licensed Franchise Outlets Directory & Regional Performance

### 2.1 UI Tab: Franchise Outlets Registry
**Primary Database Table:** `branches` (Filtered: `WHERE franchise_partner_id = :partner_id`)

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Outlet ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Branch Record ID (e.g. `BR-003`) |
| **Outlet Name** | `name` | `VARCHAR(150)` | `NOT NULL` | e.g. "Atelier Koregaon Park Grand" |
| **Branch Code** | `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | Outlet Code (e.g. `ATL-PUN-01`) |
| **City Location** | `city` | `VARCHAR(80)` | `NOT NULL` | City (e.g. "Pune", "Indore") |
| **Operating Model** | `type` | `VARCHAR(30)` | `DEFAULT 'Franchise'` | `Franchise (FOFO)` or `Franchise (FOCO)` |
| **Branch General Manager** | `manager_name` | `VARCHAR(120)` | `NOT NULL` | Outlet GM |
| **Contact Phone Number** | `contact_phone` | `VARCHAR(20)` | `NOT NULL` | Front Desk Reception |
| **Gross Monthly Revenue (MTD)**| `revenue_mtd` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Current month billed sales |
| **Monthly Appointments Count** | `appointments_mtd` | `INTEGER` | `DEFAULT 0` | Completed client visits |
| **Active Stylist Headcount** | `staff_count` | `INTEGER` | `DEFAULT 16` | Total stylists on outlet payroll |
| **Active Client Base** | `client_count` | `INTEGER` | `DEFAULT 940` | Unique clients visited |
| **Outlet Operational Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Temporarily Closed`, `Pending` |

---

## 3. Commercial Royalty Accruals & Settlement Invoices

### 3.1 UI Page: Monthly Royalty Calculation Ledger & Invoices
**Primary Database Table:** `franchise_royalty_settlements`  
**Secondary Table:** `franchise_royalty_breakdowns`

| UI Form Field / Settlement Report | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Settlement Invoice ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Invoice ID (e.g. `ROY-INV-2026-08`) |
| **Franchise Partner Link** | `franchise_partner_id` | `VARCHAR(64)` | `NOT NULL, FK -> franchise_partners(id)` | Billed Franchisee |
| **Billing Settlement Month** | `settlement_month` | `VARCHAR(10)` | `NOT NULL` | e.g. "AUG-2026" |
| **Total Gross Service Sales (₹)**| `gross_service_sales` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Sum of all franchise outlet services |
| **Service Royalty % Applied** | `service_royalty_pct` | `DECIMAL(5, 2)` | `DEFAULT 10.00` | Agreed % (10%) |
| **Calculated Service Royalty (₹)**| `service_royalty_amount`| `DECIMAL(12, 2)`| `GENERATED ALWAYS AS (gross_service_sales * service_royalty_pct / 100)` | Base service royalty fee |
| **Total Retail Product Sales (₹)**| `gross_retail_sales` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Gross retail products sold |
| **Retail Markup Royalty %** | `retail_royalty_pct` | `DECIMAL(5, 2)` | `DEFAULT 5.00` | Retail commission markup % |
| **Calculated Retail Royalty (₹)**| `retail_royalty_amount`| `DECIMAL(12, 2)` | `GENERATED ALWAYS AS (gross_retail_sales * retail_royalty_pct / 100)` | Retail royalty fee |
| **Total Taxable Royalty Base** | `subtotal_royalty_amount`| `DECIMAL(12, 2)`| `GENERATED ALWAYS AS (service_royalty_amount + retail_royalty_amount)` | Net royalty before GST |
| **GST on Franchise Services (18%)**| `gst_tax_amount` | `DECIMAL(12, 2)` | `GENERATED ALWAYS AS (subtotal_royalty_amount * 0.18)` | 18% Input GST |
| **Total Net Payable to HQ (₹)** | `total_payable_amount` | `DECIMAL(12, 2)` | `GENERATED ALWAYS AS (subtotal_royalty_amount + gst_tax_amount)` | Gross invoice liability |
| **Settlement Due Date** | `due_date` | `DATE` | `NOT NULL` | 7th of subsequent month |
| **Payment Status** | `payment_status` | `VARCHAR(30)` | `DEFAULT 'Pending Review'` | `Up to Date`, `Pending Review`, `Settlement Overdue`, `Paid` |
| **Bank UTR / Transaction Ref** | `bank_transaction_ref` | `VARCHAR(100)` | `NULL` | Bank Transfer UTR Number |
| **Payment Proof File URL** | `payment_receipt_url` | `TEXT` | `NULL` | Uploaded NEFT/RTGS receipt PDF |
| **HQ Settlement Sign-Off** | `verified_by_user_id` | `VARCHAR(64)` | `NULL, FK -> users(id)` | Central Finance Authorizer |

---

## 4. Central HQ Supply Orders & Procurement Requisitions

### 4.1 UI Page: Central Supply Ordering Desk
**Primary Database Table:** `franchise_supply_orders`  
**Secondary Table:** `franchise_supply_line_items`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Supply Order ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Order ID (e.g. `FSO-2026-112`) |
| **Franchise Partner Link** | `franchise_partner_id` | `VARCHAR(64)` | `NOT NULL, FK -> franchise_partners(id)` | Ordering Licensee |
| **Destination Outlet Branch** | `delivery_branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Receiving Franchise Branch |
| **Order Placement Date** | `order_date` | `DATE` | `NOT NULL DEFAULT CURRENT_DATE` | Date submitted |
| **Total SKUs Requested** | `item_count` | `INTEGER` | `NOT NULL` | SKU Count |
| **Total Units Ordered** | `total_units` | `INTEGER` | `NOT NULL` | Total bottles, tubes, units |
| **Total Order Value (₹)** | `total_order_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Wholesale B2B supply cost |
| **Logistics Carrier & Tracking**| `dispatch_tracking_number`| `VARCHAR(80)`| `NULL` | BlueDart / DHL AWB tracking code |
| **Fulfillment Stage** | `fulfillment_status` | `VARCHAR(30)` | `DEFAULT 'Submitted'` | `Submitted`, `Approved by HQ`, `Dispatched`, `Delivered` |

---

## 5. Brand Standards, Mystery Shopper & Quality Audits

### 5.1 UI Page: Brand SOP & Hygiene Audit Scores
**Primary Database Table:** `franchise_compliance_audits`

| UI Form Field / Audit Report | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Audit Report ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Audit ID (e.g. `AUD-SOP-2026-04`) |
| **Audited Franchise Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Target Outlet |
| **Audit Execution Date** | `audit_date` | `DATE` | `NOT NULL` | Inspection Date |
| **Inspector / Auditor Name** | `auditor_name` | `VARCHAR(120)` | `NOT NULL` | HQ Quality Controller |
| **Audit Type** | `audit_type` | `VARCHAR(60)` | `DEFAULT 'Quarterly Brand SOP Inspection'` | `Brand SOP`, `Mystery Shopper`, `Hygiene & Safety` |
| **Hygiene & Sanitation Score**| `hygiene_score_pct` | `DECIMAL(5, 2)` | `NOT NULL` | Sterilization & clean floor % |
| **Stylist Grooming & Uniform**| `grooming_score_pct` | `DECIMAL(5, 2)` | `NOT NULL` | Brand attire & etiquette % |
| **Client Consultation & Recipe**| `recipe_compliance_score`| `DECIMAL(5, 2)` | `NOT NULL` | Adherence to standard BOM % |
| **Overall Inspection Score %**| `overall_score_pct` | `DECIMAL(5, 2)` | `NOT NULL` | Net Weighted Score |
| **Compliance Grade** | `compliance_grade` | `VARCHAR(10)` | `NOT NULL` | `A+ (Excellent)`, `A (Compliant)`, `B (Action Required)`, `C (Warning)` |
| **Corrective Action Plan (CAP)**| `corrective_action_notes`| `TEXT` | `NULL` | Remediation requirements |

---

## Summary of Franchise Partner Entity Mappings

| Franchise UI Module | Primary Database Tables | Key Relations & Scoping | Business Impact & Workflow |
| :--- | :--- | :--- | :--- |
| **1. Partner Profile & Contracts** | `franchise_partners`, `franchise_contracts` | `brand_id`, `franchise_partner_id` | Master licensee details, legal GSTIN, territory rights, agreement validity & security deposit vault |
| **2. Regional Outlets Directory** | `branches` | `franchise_partner_id`, `brand_id` | Multi-outlet operational overview, monthly gross revenues, staffing counts, client visit volumes |
| **3. Royalty Accruals & Billing** | `franchise_royalty_settlements` | `franchise_partner_id`, `branches` | Automated 10% service royalty + 5% retail markup calculation, GST invoice generation, bank UTR settlement |
| **4. Central Supply Procurement** | `franchise_supply_orders`, `products_master_skus` | `franchise_partner_id`, `delivery_branch_id` | Wholesale backwash consumable and retail stock ordering from central brand warehouse with AWB tracking |
| **5. Brand SOP & Quality Audits** | `franchise_compliance_audits` | `branch_id`, `franchise_partner_id` | Quarterly mystery shopper and brand standard audit grading (A+, A, B, C) with corrective action logs |

---
*End of Franchise Panel Module Database Schema Specification.*
