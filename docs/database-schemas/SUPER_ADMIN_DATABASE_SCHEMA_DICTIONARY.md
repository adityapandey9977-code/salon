#   Salon & Spa SaaS — Super Admin Panel Database Schema & Data Dictionary

**Document Version:** 2.4.0  
**Target Architecture:** PostgreSQL 15+ / Distributed Multi-Tenant SQL Engine  
**System Scope:** Super Admin / Brand Owner / Head Office Master Control Panel  
**Document Classification:** Technical Architecture & Database Entity Mapping Specification  

---

## Executive Summary & Database Architecture Overview

The Super Admin Database is designed as a **relational, multi-branch, multi-tenant capable architecture** with strict referential integrity, decimal precision for financial accounting (Indian GST CGST/SGST/IGST compliance), and FIFO (First-In, First-Out) inventory costing.

### Key Architectural Standards:
1. **Primary Keys:** UUID v4 (`uuid_generate_v4()`) or prefixed alphanumeric business identifiers (`id VARCHAR(64) PRIMARY KEY`).
2. **Audit Timestamps:** Every table contains `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP` and `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`.
3. **Soft Deletes:** `is_deleted BOOLEAN DEFAULT FALSE` and `deleted_at TIMESTAMP WITH TIME ZONE` on all transactional and core entity tables.
4. **Monetary Precision:** All monetary amounts are stored as `DECIMAL(12, 2)` to eliminate floating-point rounding errors.
5. **Quantity & Measurement Precision:** Standard ingredient consumption quantities stored as `DECIMAL(10, 3)` supporting decimal grams (`gm`), milliliters (`ml`), and fractional units.

---

## ERD High-Level Entity Domains

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. BRAND & IDENTITY CORE                               │
│                      [brands] ───< [branches] ───< [branch_schedules]                  │
│                         │                │                                             │
│                         ▼                ▼                                             │
│                 [users / roles]   [franchise_partners] ──< [franchise_contracts]       │
└─────────────────────────┬────────────────┬─────────────────────────────┬───────────────┘
                          │                │                             │
┌─────────────────────────▼────────────────▼─────────────────────────────▼───────────────┐
│                           2. CATALOGUE & BILL OF MATERIALS (BOM)                       │
│    [service_categories] ──< [services] ──< [service_recipes] >── [products_master_skus]│
│                                  │                                     │               │
└──────────────────────────────────┼─────────────────────────────────────┼───────────────┘
                                   │                                     │
┌──────────────────────────────────▼─────────────────────────────────────▼───────────────┐
│                         3. INVENTORY, LOGISTICS & PROCUREMENT                          │
│ [suppliers] ──< [purchase_orders] ──< [goods_receipt_notes] ──> [branch_stock_ledgers] │
│      │                                                                 ▲               │
│      └──< [purchase_returns_debit_notes]                                │               │
│                                                                        │               │
│ [stock_transfers] ─────────────────────────────────────────────────────┤               │
│ [stocktake_sessions] ──< [stocktake_discrepancies] ────────────────────┘               │
└──────────────────────────────────┬─────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────────────────────┐
│                          4. CLIENT CRM, POS & OPERATIONS                               │
│ [clients] ──< [appointments] ──< [invoices] ──< [payments]                             │
│     │               │                 │                                                │
│     └──< [client_packages]            └──< [staff_commission_ledger] >── [staff_profiles]  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Brand & Organization Core Entities

### 1.1 `brands` (Tenant Root)
Master tenant profile for salon enterprises.

| Field Name | Data Type | Constraints | Mapping & Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique Brand ID (e.g. `BRD-001`) |
| `name` | `VARCHAR(150)` | `NOT NULL` | Brand Trading Name (e.g. "Atelier Luxury Salons") |
| `legal_name` | `VARCHAR(200)` | `NOT NULL` | Registered Legal Corporate Entity Name |
| `gstin` | `VARCHAR(15)` | `UNIQUE` | Central 15-character GSTIN Registration |
| `pan_number` | `VARCHAR(10)` | `NOT NULL` | Income Tax Permanent Account Number (PAN) |
| `headquarters_address` | `TEXT` | `NOT NULL` | HQ Registered Office Physical Address |
| `contact_email` | `VARCHAR(150)` | `NOT NULL` | Central Operations Support Email |
| `contact_phone` | `VARCHAR(20)` | `NOT NULL` | Central Direct Contact Phone |
| `logo_url` | `TEXT` | `NULL` | Brand Logo Asset Storage URL |
| `currency` | `VARCHAR(3)` | `DEFAULT 'INR'` | Base Operating Currency ISO Code |
| `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Suspended`, `Trial`, `Inactive` |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record Creation Timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record Update Timestamp |

---

### 1.2 `branches` (Locations Master)
Physical salon outlets and franchise branch locations.

| Field Name | Data Type | Constraints | Mapping & Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique Branch ID (e.g. `BR-001`, `BR-002`) |
| `brand_id` | `VARCHAR(64)` | `REFERENCES brands(id)` | Foreign Key to Brand Tenant |
| `name` | `VARCHAR(150)` | `NOT NULL` | Branch Display Name (e.g. "Indrapuri Flagship") |
| `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | Unique Branch Code (e.g. `ATL-IND-01`) |
| `type` | `VARCHAR(30)` | `NOT NULL` | `Flagship`, `Lounge`, `Express`, `Franchise` |
| `franchise_partner_id` | `VARCHAR(64)` | `NULL, REFERENCES franchise_partners(id)` | Linked Franchise Partner if Franchise-owned |
| `address_street` | `TEXT` | `NOT NULL` | Street Address / Suite / Commercial Complex |
| `city` | `VARCHAR(80)` | `NOT NULL` | City Name (e.g. "Bhopal", "Indore", "Pune") |
| `state` | `VARCHAR(80)` | `NOT NULL` | State (e.g. "Madhya Pradesh", "Maharashtra") |
| `postal_code` | `VARCHAR(10)` | `NOT NULL` | 6-Digit PIN Code |
| `latitude` | `DECIMAL(10, 7)` | `NULL` | GPS Latitude Coordinate |
| `longitude` | `DECIMAL(10, 7)` | `NULL` | GPS Longitude Coordinate |
| `contact_phone` | `VARCHAR(20)` | `NOT NULL` | Branch Front Desk Reception Phone |
| `contact_email` | `VARCHAR(150)` | `NOT NULL` | Branch Official Inbox Email |
| `manager_name` | `VARCHAR(120)` | `NOT NULL` | General Manager in Charge |
| `working_hours` | `VARCHAR(80)` | `DEFAULT '09:00 AM - 09:00 PM'` | Operating Shift Timings |
| `chair_count` | `INTEGER` | `DEFAULT 10` | Total Styling Stations / Treatment Beds |
| `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Inactive`, `Under Renovation` |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Branch Creation Timestamp |

---

### 1.3 `users` & `roles_permissions` (Super Admin & RBAC)

#### Table: `users`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | User ID (`USR-001`) |
| `brand_id` | `VARCHAR(64)` | `REFERENCES brands(id)` | Brand Tenant ID |
| `branch_id` | `VARCHAR(64)` | `NULL, REFERENCES branches(id)` | Associated Branch (NULL for Super Admin) |
| `full_name` | `VARCHAR(120)` | `NOT NULL` | User Full Name |
| `email` | `VARCHAR(150)` | `UNIQUE, NOT NULL` | Login Email Identifier |
| `password_hash` | `TEXT` | `NOT NULL` | Argon2id / BCrypt Hashed Credentials |
| `role_code` | `VARCHAR(50)` | `NOT NULL` | `SUPER_ADMIN`, `BRAND_OWNER`, `FRANCHISEE`, `BRANCH_MANAGER`, `STAFF` |
| `is_2fa_enabled` | `BOOLEAN` | `DEFAULT FALSE` | Two-Factor Authentication Status |
| `last_login_at` | `TIMESTAMPTZ` | `NULL` | Timestamp of Last Authentication |
| `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Suspended`, `Invited` |

#### Table: `role_permissions`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Permission Mapping ID |
| `role_code` | `VARCHAR(50)` | `NOT NULL` | Role Code |
| `module_key` | `VARCHAR(50)` | `NOT NULL` | `INVENTORY`, `FINANCE`, `CATALOGUE`, `FRANCHISE`, `STAFF` |
| `can_read` | `BOOLEAN` | `DEFAULT TRUE` | View permission |
| `can_write` | `BOOLEAN` | `DEFAULT FALSE` | Create/Edit permission |
| `can_delete` | `BOOLEAN` | `DEFAULT FALSE` | Delete permission |
| `can_approve` | `BOOLEAN` | `DEFAULT FALSE` | Maker-checker approval authority |

---

## 2. Franchise & Master Partner Network Entities

### 2.1 `franchise_partners`
Master franchise entities holding territory operational licenses.

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Franchise Partner ID (e.g. `FP-001`) |
| `brand_id` | `VARCHAR(64)` | `REFERENCES brands(id)` | Owning Brand Tenant |
| `company_name` | `VARCHAR(180)` | `NOT NULL` | Partner Entity (e.g. "Apex Wellness & Spa LLP") |
| `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | Franchise Code (e.g. `FP-IND-01`) |
| `contact_person` | `VARCHAR(120)` | `NOT NULL` | Managing Director / Key Contact |
| `email` | `VARCHAR(150)` | `NOT NULL` | Official Business Email |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Contact Number |
| `gstin` | `VARCHAR(15)` | `NOT NULL` | Franchisee Legal GSTIN |
| `pan_number` | `VARCHAR(10)` | `NOT NULL` | Franchisee PAN Card |
| `territory_region` | `VARCHAR(120)` | `NOT NULL` | Territory Allocation (e.g. "Indore & Malwa") |
| `agreement_status` | `VARCHAR(30)` | `DEFAULT 'Active'` | `Active`, `Expiring Soon`, `Under Renewal`, `Terminated` |
| `agreement_start_date` | `DATE` | `NOT NULL` | Master Contract Effective Date |
| `agreement_end_date` | `DATE` | `NOT NULL` | Agreement Expiry / Renewal Date |
| `royalty_percentage` | `DECIMAL(5, 2)` | `DEFAULT 10.00` | Percentage of Gross Service Sales |
| `retail_markup_percentage`| `DECIMAL(5, 2)`| `DEFAULT 5.00` | Retail Supply Surcharge % |
| `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | Operational Status |

---

## 3. Catalogue, Services & Recipe BOM (Bill of Materials)

### 3.1 `service_categories` & `services`

#### Table: `service_categories`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Category ID (e.g. `CAT-HAIR`) |
| `brand_id` | `VARCHAR(64)` | `REFERENCES brands(id)` | Brand ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | e.g. "Hair Care & Styling", "Skin & Aesthetics" |
| `display_order` | `INTEGER` | `DEFAULT 0` | UI Sort Order Index |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active Status |

#### Table: `services`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Service ID (e.g. `SRV-COL-613`) |
| `category_id` | `VARCHAR(64)` | `REFERENCES service_categories(id)` | Category Foreign Key |
| `name` | `VARCHAR(150)` | `NOT NULL` | Service Title (e.g. "Global Hair Colour - Majirel") |
| `code` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | Unique Service SKU Code |
| `gender_target` | `VARCHAR(20)` | `DEFAULT 'Unisex'` | `Female`, `Male`, `Unisex`, `Kids` |
| `base_duration_mins` | `INTEGER` | `NOT NULL` | Service Execution Duration in Minutes |
| `buffer_time_mins` | `INTEGER` | `DEFAULT 10` | Cleaning / Prep Time Buffer |
| `base_price` | `DECIMAL(12, 2)` | `NOT NULL` | Standard Selling Price (Excl. Tax) |
| `gst_rate_percentage` | `DECIMAL(5, 2)` | `DEFAULT 18.00` | Applicable GST Rate |
| `hsn_sac_code` | `VARCHAR(20)` | `DEFAULT '999721'` | GST SAC Code for Salon Services |
| `reward_points_awarded` | `INTEGER` | `DEFAULT 50` | Loyalty Points Earned |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active Catalogue Listing |

---

### 3.2 `service_recipes` (Service Recipe BOM / Standard Quantity Consumption)
Maps exact professional consumables automatically deducted upon service checkout.

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Recipe Line ID (`RCP-001`) |
| `service_id` | `VARCHAR(64)` | `REFERENCES services(id)` | Target Salon Service |
| `product_sku_id` | `VARCHAR(64)` | `REFERENCES products_master_skus(id)` | Master Product Consumable |
| `standard_quantity` | `DECIMAL(10, 3)` | `NOT NULL` | Exact Dispensed Quantity (e.g. `45.000`) |
| `measurement_unit` | `VARCHAR(30)` | `NOT NULL` | `ml`, `gm`, `Tubes`, `Pumps`, `Scoops`, `Kits` |
| `tolerance_variance_pct` | `DECIMAL(5, 2)` | `DEFAULT 10.00` | Allowable Variance before Alert Threshold |
| `cost_per_service` | `DECIMAL(12, 2)` | `NOT NULL` | Computed FIFO Base Cost of Ingredient |

---

## 4. Products Master SKU, Multi-Branch Stock & Batch Ledgers

### 4.1 `products_master_skus` (Master Inventory Catalog)
Master catalog across all retail SKUs, backwash professional consumables, and spa supplies.

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Master Product ID (e.g. `SKU-MAJ-613`) |
| `brand_id` | `VARCHAR(64)` | `REFERENCES brands(id)` | Brand Tenant ID |
| `sku_code` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Unique Barcode / SKU Code |
| `name` | `VARCHAR(180)` | `NOT NULL` | Full Product Name |
| `brand_manufacturer` | `VARCHAR(100)` | `NOT NULL` | Manufacturer (e.g. "L'Oréal Professionnel") |
| `category` | `VARCHAR(80)` | `NOT NULL` | `Hair Care`, `Chemical & Colour`, `Skin & Aesthetics` |
| `item_type` | `VARCHAR(30)` | `NOT NULL` | `Consumable (Backwash)`, `Retail (Resale)`, `Equipment` |
| `measurement_unit` | `VARCHAR(30)` | `NOT NULL` | Standard Unit (`ml`, `gm`, `Tubes`, `Bottles`, `pcs`) |
| `package_volume_size` | `VARCHAR(50)` | `NOT NULL` | Container Volume (e.g. "500ml", "60ml Tube") |
| `hsn_code` | `VARCHAR(20)` | `NOT NULL` | GST 8-Digit HSN Code (e.g. `33051090`) |
| `gst_rate_percentage` | `DECIMAL(5, 2)` | `DEFAULT 18.00` | GST Rate (18% / 28%) |
| `mrp_selling_price` | `DECIMAL(12, 2)` | `NOT NULL` | Maximum Retail Price (MRP) |
| `default_purchase_cost` | `DECIMAL(12, 2)` | `NOT NULL` | Standard FIFO Baseline Cost Price |
| `global_reorder_level` | `INTEGER` | `DEFAULT 10` | Auto-Replenishment Threshold |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active Catalog Status |

---

### 4.2 `branch_stock_ledgers` (Physical Outlet Stock)
Real-time physical stock counts at each salon branch.

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Ledger Entry ID |
| `branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Outlet Location |
| `product_sku_id` | `VARCHAR(64)` | `REFERENCES products_master_skus(id)` | Master Product SKU |
| `on_hand_quantity` | `DECIMAL(10, 3)` | `NOT NULL DEFAULT 0` | Physical Stock on Shelf |
| `allocated_reserved_qty` | `DECIMAL(10, 3)`| `DEFAULT 0` | Reserved for In-Flight Appointments |
| `available_quantity` | `DECIMAL(10, 3)` | `GENERATED ALWAYS AS (on_hand_quantity - allocated_reserved_qty) STORED` | Net Available for Use |
| `safety_stock_threshold`| `INTEGER` | `DEFAULT 5` | Branch Specific Reorder Trigger |
| `last_stocktake_date` | `TIMESTAMPTZ` | `NULL` | Date of Last Verified Physical Audit |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last Movement Timestamp |

---

### 4.3 `stock_batches` (Lot / Batch FIFO & Expiry Tracking)

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Batch Record ID |
| `branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Holding Branch |
| `product_sku_id` | `VARCHAR(64)` | `REFERENCES products_master_skus(id)` | Target Product |
| `batch_number` | `VARCHAR(60)` | `NOT NULL` | Manufacturing Lot Number (e.g. `LOT-LOR-2601`) |
| `manufacturing_date` | `DATE` | `NULL` | Production Date |
| `expiry_date` | `DATE` | `NOT NULL` | Expiration Date |
| `initial_inward_qty` | `DECIMAL(10, 3)` | `NOT NULL` | Original Inward Quantity |
| `current_remaining_qty` | `DECIMAL(10, 3)` | `NOT NULL` | Remaining Unconsumed Quantity |
| `unit_purchase_cost` | `DECIMAL(12, 2)` | `NOT NULL` | Cost at Inwarding for FIFO Realization |

---

## 5. Procurement, Suppliers, POs, GRN & Debit Notes

### 5.1 `suppliers` (Vendor Master Directory)

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Vendor ID (e.g. `SUP-001`) |
| `brand_id` | `VARCHAR(64)` | `REFERENCES brands(id)` | Owning Brand Tenant |
| `name` | `VARCHAR(180)` | `NOT NULL` | Vendor Legal Trading Name (e.g. "L'Oréal India") |
| `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | Vendor Identifier (e.g. `SUP-LOR-01`) |
| `gstin` | `VARCHAR(15)` | `NOT NULL` | Vendor GSTIN |
| `pan_number` | `VARCHAR(10)` | `NOT NULL` | Vendor PAN |
| `contact_person` | `VARCHAR(120)` | `NOT NULL` | Key Account Manager (KAM) |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Contact Number |
| `email` | `VARCHAR(150)` | `NOT NULL` | Order Desk Email |
| `warehouse_address` | `TEXT` | `NOT NULL` | Dispatch Warehouse Address |
| `payment_terms` | `VARCHAR(100)` | `DEFAULT 'Net 30 Days'` | Settlement Agreement |
| `credit_limit` | `DECIMAL(12, 2)` | `DEFAULT 500000.00` | Approved Credit Limit |
| `lead_time_days` | `INTEGER` | `DEFAULT 3` | Average Order Fulfillment Lead Days |
| `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Under Review`, `Inactive` |

---

### 5.2 `purchase_orders` & `po_line_items`

#### Table: `purchase_orders`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Purchase Order ID (e.g. `PO-2026-081`) |
| `po_number` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | Official PO Number |
| `supplier_id` | `VARCHAR(64)` | `REFERENCES suppliers(id)` | Selected Vendor |
| `delivery_branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Target Receiving Branch |
| `order_date` | `DATE` | `NOT NULL` | Order Placement Date |
| `expected_delivery_date`| `DATE` | `NOT NULL` | Scheduled Arrival Date |
| `subtotal_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Net Amount (Excl. Tax) |
| `tax_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Accrued GST (18%) |
| `discount_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Commercial Vendor Discount |
| `total_payable_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Gross Total Amount |
| `status` | `VARCHAR(30)` | `DEFAULT 'Pending Approval'` | `Draft`, `Pending Approval`, `Approved`, `Ordered`, `Partially Received`, `Fully Received`, `Cancelled` |
| `created_by` | `VARCHAR(100)` | `NOT NULL` | Requester Name |
| `approved_by` | `VARCHAR(100)` | `NULL` | Authorizer Name |

#### Table: `po_line_items`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | PO Line ID |
| `purchase_order_id` | `VARCHAR(64)` | `REFERENCES purchase_orders(id)` | PO Header Link |
| `product_sku_id` | `VARCHAR(64)` | `REFERENCES products_master_skus(id)` | Ordered Product SKU |
| `ordered_quantity` | `INTEGER` | `NOT NULL` | Units Ordered |
| `received_quantity` | `INTEGER` | `DEFAULT 0` | Units Received via GRN |
| `unit_cost_price` | `DECIMAL(12, 2)` | `NOT NULL` | Negotiated Cost Price |
| `tax_rate_pct` | `DECIMAL(5, 2)` | `DEFAULT 18.00` | GST Rate |
| `line_total_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Total (Qty * Cost + Tax) |

---

### 5.3 `purchase_returns_debit_notes` (Vendor Returns & Refunds)

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Return ID (e.g. `RET-PUR-001`) |
| `supplier_id` | `VARCHAR(64)` | `REFERENCES suppliers(id)` | Target Vendor |
| `branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Returning Branch Location |
| `product_sku_id` | `VARCHAR(64)` | `REFERENCES products_master_skus(id)` | Returned SKU |
| `batch_number` | `VARCHAR(60)` | `NOT NULL` | Manufacturing Lot Number |
| `returned_quantity` | `INTEGER` | `NOT NULL` | Returned Unit Count |
| `unit_cost` | `DECIMAL(12, 2)` | `NOT NULL` | Unit FIFO Value |
| `debit_note_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Total Claim Value (Incl. Tax) |
| `debit_note_reference` | `VARCHAR(50)` | `NOT NULL` | Debit Note Reference (e.g. `DN-2026-0881`) |
| `reason_classification`| `VARCHAR(100)` | `NOT NULL` | `Damaged in Transit`, `Near Expiry Spoilage`, `Expired Stock`, `Quality Defect`, `Excess Supply` |
| `settlement_mode` | `VARCHAR(50)` | `DEFAULT 'Credit Note'` | `Credit Note`, `Direct Bank Refund`, `Free Replacement` |
| `finance_posting_status`| `VARCHAR(30)` | `DEFAULT 'Processed'` | `Requested`, `Processed`, `Completed`, `Rejected` |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Return Creation Timestamp |

---

## 6. Inter-Branch Stock Transfers & Physical Stocktake Audits

### 6.1 `stock_transfers` & `transfer_line_items`

#### Table: `stock_transfers`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Transfer ID (e.g. `TR-2026-042`) |
| `source_branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Dispatch Origin Branch |
| `destination_branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Receiving Destination Branch |
| `requested_by` | `VARCHAR(120)` | `NOT NULL` | Requester |
| `approved_by` | `VARCHAR(120)` | `NULL` | Head Office Authorizer |
| `status` | `VARCHAR(30)` | `DEFAULT 'Requested'` | `Requested`, `Approved`, `Dispatched`, `In Transit`, `Received`, `Rejected`, `Cancelled` |
| `purpose_justification`| `VARCHAR(200)` | `NOT NULL` | Reason (e.g. "Weekend rush balancing") |
| `carrier_logistics_mode`| `VARCHAR(100)` | `NOT NULL` | e.g. "Internal Salon Logistics Van" |
| `container_seal_number`| `VARCHAR(60)` | `NOT NULL` | Tamper-evident Seal Code |
| `dispatched_at` | `TIMESTAMPTZ` | `NULL` | Dispatch Timestamp |
| `received_at` | `TIMESTAMPTZ` | `NULL` | Delivery Receipt Timestamp |

#### Table: `transfer_line_items`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Transfer Item ID |
| `stock_transfer_id` | `VARCHAR(64)` | `REFERENCES stock_transfers(id)` | Transfer Link |
| `product_sku_id` | `VARCHAR(64)` | `REFERENCES products_master_skus(id)` | Transferred SKU |
| `batch_number` | `VARCHAR(60)` | `NOT NULL` | Lot Number |
| `quantity` | `INTEGER` | `NOT NULL` | Units in Transit |
| `unit_name` | `VARCHAR(30)` | `NOT NULL` | Packaging Unit |

---

### 6.2 `stocktake_sessions` & `stocktake_discrepancies`

#### Table: `stocktake_sessions`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Audit ID (e.g. `STK-AUDIT-AUG26-01`) |
| `branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Audited Branch Location |
| `audit_date` | `DATE` | `NOT NULL` | Scheduled Audit Date |
| `audit_type` | `VARCHAR(80)` | `NOT NULL` | `Full Store Comprehensive`, `High-Value Category Cycle Count`, `Spot Check`, `Quarterly Valuation` |
| `counting_methodology` | `VARCHAR(40)` | `DEFAULT 'Blind Count'` | `Blind Count` or `Visible Book Count` |
| `is_pos_frozen` | `BOOLEAN` | `DEFAULT TRUE` | POS Transaction Lockdown Active |
| `lead_auditor_name` | `VARCHAR(120)` | `NOT NULL` | Assigned Lead Auditor |
| `auditor_role` | `VARCHAR(80)` | `NOT NULL` | `Internal Store Auditor`, `Floor Manager`, `HO Controller` |
| `secondary_witness` | `VARCHAR(120)` | `NULL` | Dual-custody Counter-Signer |
| `status` | `VARCHAR(30)` | `DEFAULT 'Planned'` | `Planned`, `In Progress`, `Pending Approval`, `Approved`, `Completed` |
| `variance_units_total` | `INTEGER` | `DEFAULT 0` | Net Difference (Physical Count - Book Stock) |
| `variance_value_total` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Net Financial Impact (₹) |

#### Table: `stocktake_discrepancies`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Discrepancy ID |
| `stocktake_session_id` | `VARCHAR(64)` | `REFERENCES stocktake_sessions(id)` | Stocktake Session Link |
| `product_sku_id` | `VARCHAR(64)` | `REFERENCES products_master_skus(id)` | SKU Audited |
| `expected_book_stock` | `INTEGER` | `NOT NULL` | Theoretical System Quantity |
| `actual_shelf_count` | `INTEGER` | `NOT NULL` | Physical Hand-Counted Quantity |
| `variance_delta` | `INTEGER` | `GENERATED ALWAYS AS (actual_shelf_count - expected_book_stock) STORED` | Net Variance |
| `unit_fifo_cost` | `DECIMAL(12, 2)` | `NOT NULL` | Cost Price per Unit |
| `value_impact` | `DECIMAL(12, 2)` | `NOT NULL` | Net Discrepancy Loss/Gain (₹) |
| `variance_reason_code` | `VARCHAR(100)` | `NOT NULL` | `Unrecorded Backwash Usage`, `Dropped/Damaged`, `Spillage Loss`, `Theft/Pilferage` |

---

## 7. Client CRM, Memberships & Loyalty Ledgers

### 7.1 `clients` (Customer Master)

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Client ID (e.g. `CLT-001`) |
| `brand_id` | `VARCHAR(64)` | `REFERENCES brands(id)` | Brand Tenant ID |
| `first_name` | `VARCHAR(80)` | `NOT NULL` | Client First Name |
| `last_name` | `VARCHAR(80)` | `NOT NULL` | Client Last Name |
| `mobile_phone` | `VARCHAR(20)` | `UNIQUE, NOT NULL` | Mobile Phone (Primary Key for POS Lookup) |
| `email` | `VARCHAR(150)` | `NULL` | Email Address |
| `gender` | `VARCHAR(20)` | `DEFAULT 'Female'` | Demographics |
| `birth_date` | `DATE` | `NULL` | Birthday (for Automated Marketing Promos) |
| `anniversary_date` | `DATE` | `NULL` | Anniversary Date |
| `vip_tier` | `VARCHAR(30)` | `DEFAULT 'Regular'` | `Bronze`, `Silver`, `Gold`, `Black Diamond VIP` |
| `wallet_balance` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Prepaid Wallet Balance |
| `loyalty_points` | `INTEGER` | `DEFAULT 0` | Available Loyalty Points |
| `lifetime_spend` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Lifetime Gross Spend |
| `allergies_contraindications`| `TEXT` | `NULL` | Chemical Allergy Notes (e.g. "Ammonia-sensitive") |

---

## 8. Appointments, POS Invoicing & GST Financial Transactions

### 8.1 `appointments` & `appointment_line_items`

#### Table: `appointments`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Booking Ref (e.g. `APT-2026-901`) |
| `branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Salon Branch |
| `client_id` | `VARCHAR(64)` | `REFERENCES clients(id)` | Client |
| `booking_channel` | `VARCHAR(30)` | `DEFAULT 'Client Mobile App'` | `Mobile App`, `Website`, `Front Desk Walk-In`, `Call Center` |
| `scheduled_start_time` | `TIMESTAMPTZ` | `NOT NULL` | Service Start Timestamp |
| `scheduled_end_time` | `TIMESTAMPTZ` | `NOT NULL` | Service End Timestamp |
| `status` | `VARCHAR(30)` | `DEFAULT 'Confirmed'` | `Confirmed`, `In Service`, `Completed`, `Cancelled`, `No Show` |
| `total_estimated_amount`| `DECIMAL(12, 2)`| `NOT NULL` | Gross Booking Value |

---

### 8.2 `invoices` & `invoice_payments`

#### Table: `invoices` (GST Tax Invoices)
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Invoice Record ID |
| `invoice_number` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | GST Tax Invoice # (e.g. `INV-ATL-26-0881`) |
| `branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Billing Branch |
| `client_id` | `VARCHAR(64)` | `REFERENCES clients(id)` | Billed Customer |
| `appointment_id` | `VARCHAR(64)` | `NULL, REFERENCES appointments(id)` | Linked Appointment (NULL for Retail Walk-in) |
| `subtotal_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Taxable Base Value |
| `cgst_amount` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Central GST (9% for Intra-state) |
| `sgst_amount` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | State GST (9% for Intra-state) |
| `igst_amount` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Integrated GST (18% for Inter-state) |
| `discount_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Applied Coupon / Membership Discount |
| `total_payable_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Final Gross Bill |
| `payment_status` | `VARCHAR(20)` | `DEFAULT 'Paid'` | `Paid`, `Partially Paid`, `Refunded`, `Credit Settlement` |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Checkout Timestamp |

#### Table: `invoice_payments` (Multi-Split Tender)
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Tender Payment ID |
| `invoice_id` | `VARCHAR(64)` | `REFERENCES invoices(id)` | Linked Tax Invoice |
| `payment_mode` | `VARCHAR(30)` | `NOT NULL` | `UPI / QR`, `Credit Card`, `Debit Card`, `Cash`, `Prepaid Wallet`, `Gift Voucher` |
| `amount_paid` | `DECIMAL(12, 2)` | `NOT NULL` | Amount Tendered |
| `gateway_transaction_ref`| `VARCHAR(100)`| `NULL` | Razorpay / PineLabs / Bank UTR Number |
| `payment_timestamp` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Payment Settlement Timestamp |

---

## 9. Staff, Stylists, Attendance & Commission Ledgers

### 9.1 `staff_profiles` & `staff_commission_ledger`

#### Table: `staff_profiles`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Staff ID (e.g. `STF-001`) |
| `branch_id` | `VARCHAR(64)` | `REFERENCES branches(id)` | Primary Branch Posting |
| `full_name` | `VARCHAR(120)` | `NOT NULL` | Stylist / Therapist Name |
| `employee_code` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | Staff ID Card # |
| `designation` | `VARCHAR(80)` | `NOT NULL` | `Master Stylist`, `Senior Aesthetician`, `Nail Artist`, `Therapist` |
| `mobile_phone` | `VARCHAR(20)` | `NOT NULL` | Phone Number |
| `base_salary_monthly` | `DECIMAL(12, 2)` | `DEFAULT 25000.00` | Fixed Monthly Salary |
| `service_commission_pct`| `DECIMAL(5, 2)`| `DEFAULT 10.00` | Base Service Commission % |
| `retail_commission_pct` | `DECIMAL(5, 2)`| `DEFAULT 5.00` | Retail Upsell Commission % |
| `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `On Leave`, `Resigned` |

#### Table: `staff_commission_ledger`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Commission Entry ID |
| `staff_id` | `VARCHAR(64)` | `REFERENCES staff_profiles(id)` | Beneficiary Stylist |
| `invoice_id` | `VARCHAR(64)` | `REFERENCES invoices(id)` | Triggering Invoice |
| `service_revenue_amount`| `DECIMAL(12, 2)`| `DEFAULT 0.00` | Net Service Sales Billed |
| `retail_revenue_amount` | `DECIMAL(12, 2)`| `DEFAULT 0.00` | Net Retail Products Sold |
| `commission_earned` | `DECIMAL(12, 2)` | `NOT NULL` | Calculated Commission (₹) |
| `payout_month` | `VARCHAR(10)` | `NOT NULL` | e.g. "AUG-2026" |
| `payout_status` | `VARCHAR(20)` | `DEFAULT 'Accrued'` | `Accrued`, `Approved`, `Paid` |

---

## 10. PostgreSQL Indexing & Optimization Strategy

For high-throughput multi-outlet operations, the following indexes are mandatory:

```sql
-- 1. Multi-Branch & Tenant Partitioning Indexes
CREATE INDEX idx_branches_brand_id ON branches(brand_id);
CREATE INDEX idx_branches_city_status ON branches(city, status);

-- 2. Fast POS Phone Lookup for Client CRM
CREATE INDEX idx_clients_mobile ON clients(mobile_phone);
CREATE INDEX idx_clients_brand_vip ON clients(brand_id, vip_tier);

-- 3. Live Physical Stock Ledger Composite Key
CREATE UNIQUE INDEX idx_branch_stock_composite ON branch_stock_ledgers(branch_id, product_sku_id);

-- 4. Fast FIFO Batch Expiry Queue Index
CREATE INDEX idx_stock_batches_fifo ON stock_batches(branch_id, product_sku_id, expiry_date, current_remaining_qty);

-- 5. Appointments Schedule Timeline
CREATE INDEX idx_appointments_schedule ON appointments(branch_id, scheduled_start_time, status);

-- 6. GST Tax Invoice & Financial Audit Trail
CREATE INDEX idx_invoices_branch_created ON invoices(branch_id, created_at);
CREATE INDEX idx_invoices_gstin ON invoices(invoice_number);
```

---

## Summary of Entities & System Mappings

| Domain | Entity Tables | Key Foreign Keys | Business Purpose in Super Admin Panel |
| :--- | :--- | :--- | :--- |
| **Brand & Locations** | `brands`, `branches`, `users`, `role_permissions` | `brand_id`, `franchise_partner_id` | Multi-branch governance, role access & central settings |
| **Franchise Network** | `franchise_partners`, `franchise_contracts` | `franchise_partner_id`, `brand_id` | Territory rights, royalty fee calculation & franchise portal |
| **Services & Recipes** | `service_categories`, `services`, `service_recipes` | `service_id`, `product_sku_id` | Catalogue, pricing, automatic recipe ingredient stock deductions |
| **Master Inventory** | `products_master_skus`, `branch_stock_ledgers`, `stock_batches` | `product_sku_id`, `branch_id` | Real-time multi-branch stock, FIFO valuation & expiry tracking |
| **Procurement & POs** | `suppliers`, `purchase_orders`, `po_line_items`, `purchase_returns` | `supplier_id`, `delivery_branch_id` | Supplier directory, PO maker-checker, GRN & debit notes |
| **Transfers & Audits** | `stock_transfers`, `stocktake_sessions`, `stocktake_discrepancies` | `source_branch_id`, `destination_branch_id` | Inter-branch replenishment & physical cycle count discrepancy ledger |
| **Client CRM & POS** | `clients`, `appointments`, `invoices`, `invoice_payments` | `client_id`, `branch_id`, `appointment_id` | Client CRM, POS billing, split tenders & GST tax accounting |
| **Staff & Commissions** | `staff_profiles`, `staff_commission_ledger` | `staff_id`, `branch_id`, `invoice_id` | Stylist rosters, attendance & tiered commission calculation |

---
*End of Super Admin Database Schema Specification.*
