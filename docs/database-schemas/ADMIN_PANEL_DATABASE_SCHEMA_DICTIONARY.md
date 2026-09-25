#   Salon SaaS — Admin Panel Module Database Schema & UI Field Mapping Dictionary

**Document Version:** 2.5.0  
**Target System:**   Salon SaaS Web Application (`/admin/*`)  
**Scope:** Admin Panel Page-by-Page & Tab-by-Tab Database Entity Mapping  
**Classification:** Complete Database Dictionary & Technical UI-to-Schema Mapping  

---

## Architecture & UI Route Mapping Matrix

This document defines the direct relational database mapping for every user interface component, form field, and table across all 12 modules in the Admin Master Portal.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ADMIN PANEL MODULE NAVIGATION MAP (/admin/*)                            │
├────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────┤
│ 1. Business & Operations       │ 2. Commercial & Assets                │ 3. Governance & Intelligence  │
│  • /locations (Branches)       │  • /packages-memberships (Tiers)      │  • /franchise (Partners/Royalty)│
│  • /catalogue (Services/BOM)   │  • /finance (GST Billing/Payments)    │  • /reports-analytics (BI)    │
│  • /clients (CRM/Profiles)     │  • /inventory (Stock/PO/Transfers)    │  • /brand-settings (Rules)    │
│  • /staff (Stylists/Rosters)   │  • /marketing (WhatsApp/Campaigns)    │  • /roles-permissions (RBAC)  │
│  • /operations (Calendar/POS)  │                                       │  • /audit-logs (Lineage)      │
└────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────┘
```

---

## 1. Locations & Multi-Branch Desk (`/admin/locations`)

### 1.1 UI Page: All Branches Registry (`AllBranchesTab.tsx`)
**Primary Database Table:** `branches`  
**Related Tables:** `brands`, `franchise_partners`, `branch_operating_hours`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Branch ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique Branch Code (e.g. `BR-001`) |
| **Branch Name** | `name` | `VARCHAR(150)` | `NOT NULL` | Registered Name (e.g. "Atelier Indrapuri Flagship") |
| **Branch Code** | `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | System Prefix Code (e.g. `ATL-IND-01`) |
| **Location Type** | `type` | `VARCHAR(30)` | `NOT NULL` | `Flagship`, `Lounge`, `Express`, `Franchise` |
| **Franchise Partner Assignment** | `franchise_partner_id` | `VARCHAR(64)` | `NULL, FK -> franchise_partners(id)` | Linked master franchise partner if FOFO/FOCO |
| **City / Region** | `city` | `VARCHAR(80)` | `NOT NULL` | City Name (e.g. "Bhopal", "Indore", "Pune") |
| **State / Province** | `state` | `VARCHAR(80)` | `NOT NULL DEFAULT 'Madhya Pradesh'` | State for GST Intra/Interstate logic |
| **Street Address** | `address_street` | `TEXT` | `NOT NULL` | Physical premises address |
| **Postal Code** | `postal_code` | `VARCHAR(10)` | `NOT NULL` | 6-digit PIN code |
| **Branch General Manager** | `manager_name` | `VARCHAR(120)` | `NOT NULL` | Assigned General Manager |
| **Manager Official Email** | `manager_email` | `VARCHAR(150)` | `NOT NULL` | Notification & escalation inbox |
| **Contact Phone Number** | `contact_phone` | `VARCHAR(20)` | `NOT NULL` | Client reception phone number |
| **Working Hours Window** | `working_hours_display` | `VARCHAR(80)` | `DEFAULT '09:00 AM - 09:00 PM'` | Operating shift display string |
| **Total Chairs / Stations** | `chair_count` | `INTEGER` | `DEFAULT 12` | Total concurrent styling chairs |
| **Monthly Revenue (MTD)** | `revenue_mtd` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Real-time computed MTD gross revenue |
| **Occupancy %** | `occupancy_pct` | `DECIMAL(5, 2)` | `DEFAULT 0.00` | `(Actual Booked Minutes / Capacity) * 100` |
| **Branch Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Inactive`, `Under Renovation` |

---

### 1.2 UI Page: Branch Working Hours & Shift Schedules (`WorkingHoursTab.tsx`)
**Primary Database Table:** `branch_operating_hours`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Schedule ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Schedule record ID |
| **Branch Link** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Target Salon Branch |
| **Day of Week** | `day_of_week` | `SMALLINT` | `NOT NULL (0-6)` | `0` = Sunday, `1` = Monday, ..., `6` = Saturday |
| **Is Open / Working Day** | `is_open` | `BOOLEAN` | `DEFAULT TRUE` | Open status for bookings |
| **Opening Time** | `opening_time` | `TIME` | `NOT NULL DEFAULT '09:00:00'` | Shift start time |
| **Closing Time** | `closing_time` | `TIME` | `NOT NULL DEFAULT '21:00:00'` | Shift end time |
| **Mid-Day Sanitization Break** | `break_start_time` | `TIME` | `NULL` | Daily floor prep / break start |
| **Break End Time** | `break_end_time` | `TIME` | `NULL` | Daily floor prep / break end |

---

## 2. Catalogue, Services & Recipe BOM Desk (`/admin/catalogue`)

### 2.1 UI Page: Service Menu Master (`ServicesTab.tsx`)
**Primary Database Table:** `services`  
**Related Tables:** `service_categories`, `service_recipes`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Service SKU ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Service ID (e.g. `SRV-MAJ-613`) |
| **Category Selection** | `category_id` | `VARCHAR(64)` | `NOT NULL, FK -> service_categories(id)` | Hair, Skin, Spa, Nails |
| **Service Title** | `name` | `VARCHAR(150)` | `NOT NULL` | e.g. "Global Hair Colour - Majirel" |
| **Service Code** | `code` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | e.g. `SRV-COL-001` |
| **Gender Applicability** | `gender_target` | `VARCHAR(20)` | `DEFAULT 'Unisex'` | `Female`, `Male`, `Unisex`, `Kids` |
| **Execution Duration** | `base_duration_mins` | `INTEGER` | `NOT NULL` | Minutes on chair |
| **Turnaround Buffer** | `buffer_time_mins` | `INTEGER` | `DEFAULT 10` | Disinfection & cleaning buffer |
| **Base Service Price** | `base_price` | `DECIMAL(12, 2)` | `NOT NULL` | Base price (Excl. Tax) |
| **GST Tax Rate** | `gst_rate_pct` | `DECIMAL(5, 2)` | `DEFAULT 18.00` | 18% standard GST |
| **HSN/SAC Service Code** | `hsn_sac_code` | `VARCHAR(20)` | `DEFAULT '999721'` | Indian GST SAC Code for Salons |
| **Loyalty Points Reward** | `reward_points` | `INTEGER` | `DEFAULT 50` | Reward points earned upon completion |
| **Active Status** | `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Visible in booking & POS |

---

### 2.2 UI Page: Service Recipe BOM (Bill of Materials) (`AddRecipeModal.tsx`)
**Primary Database Table:** `service_recipes`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Recipe Line ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Recipe Item ID |
| **Service Link** | `service_id` | `VARCHAR(64)` | `NOT NULL, FK -> services(id)` | Parent Service |
| **Dispensed Product SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | Linked Consumable SKU |
| **Standard Quantity** | `standard_quantity` | `DECIMAL(10, 3)` | `NOT NULL` | e.g. `45.000` (45 grams or ml) |
| **Measurement Unit** | `measurement_unit` | `VARCHAR(30)` | `NOT NULL` | `ml`, `gm`, `Tubes`, `Pods`, `Kits`, `Scoops` |
| **Allowable Variance %** | `tolerance_pct` | `DECIMAL(5, 2)` | `DEFAULT 10.00` | Allowed threshold before wastage flag |
| **Ingredient FIFO Cost** | `ingredient_cost` | `DECIMAL(12, 2)` | `NOT NULL` | Computed FIFO cost per service |

---

## 3. Inventory & Procurement Master Desk (`/admin/inventory`)

### 3.1 UI Tab: Master SKU Directory (`ProductsConsumablesTab.tsx`, `AddMasterSkuModal.tsx`)
**Primary Database Table:** `products_master_skus`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Master SKU ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Master SKU (e.g. `SKU-MAJ-613`) |
| **Barcode / SKU Code** | `sku_code` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Barcode scanned at POS/GRN |
| **Product Full Name** | `name` | `VARCHAR(180)` | `NOT NULL` | e.g. "L'Oréal Majirel Colour Tube - 6.13" |
| **Brand / Manufacturer** | `brand_manufacturer` | `VARCHAR(100)` | `NOT NULL` | L'Oréal, Moroccanoil, O3+, Schwarzkopf |
| **Product Category** | `category` | `VARCHAR(80)` | `NOT NULL` | Hair Care, Colour, Aesthetics, Spa |
| **Item Classification** | `item_type` | `VARCHAR(30)` | `NOT NULL` | `Consumable (Backwash)`, `Retail (Resale)`, `Equipment` |
| **Standard Packaging Unit** | `measurement_unit` | `VARCHAR(30)` | `NOT NULL` | `ml`, `gm`, `Tubes`, `Bottles`, `Tubs`, `pcs` |
| **Container Size Display** | `package_volume_size` | `VARCHAR(50)` | `NOT NULL` | e.g. "500ml", "60ml Tube", "1000ml" |
| **GST HSN Code** | `hsn_code` | `VARCHAR(20)` | `NOT NULL` | 8-digit GST HSN (e.g. `33051090`) |
| **GST Rate %** | `gst_rate_pct` | `DECIMAL(5, 2)` | `DEFAULT 18.00` | 18% or 28% GST |
| **Maximum Retail Price (MRP)**| `mrp_selling_price` | `DECIMAL(12, 2)` | `NOT NULL` | Retail price charged to clients |
| **Base Purchase Cost** | `default_purchase_cost`| `DECIMAL(12, 2)`| `NOT NULL` | Inward FIFO baseline cost price |
| **Global Reorder Level** | `reorder_threshold` | `INTEGER` | `DEFAULT 10` | Auto PO trigger threshold |

---

### 3.2 UI Tab: Multi-Branch Stock Ledgers (`StockTab.tsx`)
**Primary Database Table:** `branch_stock_ledgers`  
**Secondary Table:** `stock_batches`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Ledger ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Stock Ledger ID |
| **Branch Outlet** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Salon Branch |
| **Product SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | Master Product SKU |
| **On-Hand Physical Stock** | `on_hand_qty` | `DECIMAL(10, 3)` | `NOT NULL DEFAULT 0` | Physical stock in branch store |
| **Allocated / In-Service Qty** | `allocated_qty` | `DECIMAL(10, 3)` | `DEFAULT 0` | Stock currently reserved |
| **Available Stock Units** | `available_qty` | `DECIMAL(10, 3)` | `GENERATED ALWAYS AS (on_hand_qty - allocated_qty)` | Net available stock |
| **Stock Valuation (₹)** | `stock_valuation` | `DECIMAL(12, 2)` | `NOT NULL` | `available_qty * unit_fifo_cost` |
| **Stock Health Status** | `stock_health` | `VARCHAR(20)` | `DEFAULT 'Optimal'` | `Optimal`, `Low Stock`, `Critical Out of Stock` |

---

### 3.3 UI Tab: Suppliers & Vendor Directory (`ProcurementTab.tsx`, `AddSupplierModal.tsx`)
**Primary Database Table:** `suppliers`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Vendor ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Supplier ID (e.g. `SUP-001`) |
| **Vendor Trading Name** | `name` | `VARCHAR(180)` | `NOT NULL` | Legal Entity Name |
| **Supplier Code** | `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | Vendor Identifier (e.g. `SUP-LOR-01`) |
| **Legal GSTIN** | `gstin` | `VARCHAR(15)` | `NOT NULL` | 15-character GSTIN |
| **Key Contact Representative** | `contact_person` | `VARCHAR(120)` | `NOT NULL` | KAM / Account Executive Name |
| **Order Desk Phone** | `phone` | `VARCHAR(20)` | `NOT NULL` | Dispatch contact number |
| **Order Desk Email** | `email` | `VARCHAR(150)` | `NOT NULL` | Official order placement email |
| **Warehouse Physical Address** | `address` | `TEXT` | `NOT NULL` | Dispatch depot address |
| **Commercial Payment Terms** | `payment_terms` | `VARCHAR(100)` | `DEFAULT 'Net 30 Days'` | Settlement terms |
| **Approved Credit Limit** | `credit_limit` | `DECIMAL(12, 2)` | `DEFAULT 500000.00` | Max credit outstanding (₹) |
| **Fulfillment Lead Time** | `lead_time_days` | `INTEGER` | `DEFAULT 3` | Transit fulfillment days |
| **Serviced Branches** | `branches_served_ids` | `TEXT[]` | `NOT NULL` | Array of Branch IDs supplied |
| **Vendor Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Under Review`, `Inactive` |

---

### 3.4 UI Tab: Purchase Orders & Line Items (`CreatePOModal.tsx`, `ProcurementTab.tsx`)
**Primary Database Table:** `purchase_orders`  
**Secondary Table:** `po_line_items`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Purchase Order ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | PO ID (e.g. `PO-2026-081`) |
| **PO Number** | `po_number` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | Official PO Reference |
| **Supplier Selected** | `supplier_id` | `VARCHAR(64)` | `NOT NULL, FK -> suppliers(id)` | Vendor Partner |
| **Delivery Branch** | `delivery_branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Receiving Outlet |
| **Order Placement Date** | `order_date` | `DATE` | `NOT NULL` | Order Date |
| **Expected Delivery Date** | `expected_delivery_date`| `DATE` | `NOT NULL` | Scheduled Arrival Date |
| **Subtotal (Excl. Tax)** | `subtotal_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Base cost of goods |
| **Accrued GST (18%)** | `tax_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Input tax credit accrual |
| **Commercial Discount** | `discount_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Special vendor rebate |
| **Gross Total Payable** | `total_payable_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Total PO liability |
| **Receiving Progress Units** | `received_units_count` | `INTEGER` | `DEFAULT 0` | Total units inwarded via GRN |
| **Approval Stage / Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Pending Approval'` | `Pending Approval`, `Approved`, `Ordered`, `Partially Received`, `Fully Received` |
| **Requester Name** | `created_by` | `VARCHAR(100)` | `NOT NULL` | Maker user |
| **Authorizer Name** | `approved_by` | `VARCHAR(100)` | `NULL` | Checker user |

---

### 3.5 UI Tab: Purchase Returns & Debit Notes (`InitiatePurchaseReturnModal.tsx`)
**Primary Database Table:** `purchase_returns_debit_notes`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Return ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Return Reference (`RET-PUR-001`) |
| **Vendor Link** | `supplier_id` | `VARCHAR(64)` | `NOT NULL, FK -> suppliers(id)` | Target Vendor |
| **Returning Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Origin Salon Outlet |
| **Product Item** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | Defective/Spoiled SKU |
| **Batch / Lot No.** | `batch_number` | `VARCHAR(60)` | `NOT NULL` | Manufacturing Lot # |
| **Return Quantity** | `quantity` | `INTEGER` | `NOT NULL` | Units debited |
| **Unit Purchase Cost** | `unit_cost` | `DECIMAL(12, 2)` | `NOT NULL` | FIFO Unit Cost (₹) |
| **Total Debit Amount** | `amount` | `DECIMAL(12, 2)` | `NOT NULL` | Total Claim Value with GST |
| **Debit Note Reference** | `credit_note_ref` | `VARCHAR(50)` | `NOT NULL` | Reference Code (e.g. `DN-2026-0881`) |
| **Reason for Return** | `reason` | `VARCHAR(120)` | `NOT NULL` | `Damaged in Transit`, `Near Expiry Spoilage`, `Expired Stock`, `Quality Defect` |
| **Settlement Mode** | `settlement_mode` | `VARCHAR(50)` | `DEFAULT 'Credit Note'` | `Credit Note`, `Direct Bank Refund`, `Free Replacement` |
| **Finance Posting Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Processed'` | `Requested`, `Processed`, `Completed` |

---

### 3.6 UI Tab: Inter-Branch Stock Transfers (`TransfersTab.tsx`, `NewTransferRequestModal.tsx`)
**Primary Database Table:** `stock_transfers`  
**Secondary Table:** `transfer_line_items`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Transfer ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Transfer ID (e.g. `TR-2026-042`) |
| **Source Branch (Origin)** | `source_branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Dispatch Outlet |
| **Destination Branch (Target)**| `destination_branch_id`| `VARCHAR(64)`| `NOT NULL, FK -> branches(id)` | Receiving Outlet |
| **Total SKUs Transferred** | `total_items` | `INTEGER` | `NOT NULL` | Count of distinct SKUs |
| **Total Quantity Units** | `total_quantity` | `INTEGER` | `NOT NULL` | Total physical units |
| **Business Justification** | `purpose` | `VARCHAR(200)` | `NOT NULL` | Weekend Rush, Pre-Expiry, Bridal |
| **Logistics Carrier Mode** | `carrier` | `VARCHAR(100)` | `NOT NULL` | Internal Van, BlueDart, Hand Carry |
| **Container Box Seal #** | `seal_number` | `VARCHAR(60)` | `NOT NULL` | Tamper-Evident Seal Code |
| **Requester Name** | `requested_by` | `VARCHAR(120)` | `NOT NULL` | Floor Manager / Storekeeper |
| **Authorizer Name** | `approved_by` | `VARCHAR(120)` | `NULL` | Head Office Inventory Director |
| **Transfer Stage Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Requested'` | `Requested`, `Approved`, `Dispatched`, `In Transit`, `Received`, `Rejected` |

---

### 3.7 UI Tab: Physical Stocktake Audits (`StocktakeTab.tsx`, `ScheduleStocktakeModal.tsx`)
**Primary Database Table:** `stocktake_sessions`  
**Secondary Table:** `stocktake_discrepancies`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Audit Session ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Audit ID (e.g. `STK-AUDIT-AUG26-01`) |
| **Audited Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Salon Branch |
| **Scheduled Audit Date** | `audit_date` | `DATE` | `NOT NULL` | Audit Scheduled Date |
| **Audit Scope & Type** | `audit_type` | `VARCHAR(80)` | `NOT NULL` | Full Store, Cycle Count, Spot Check |
| **Counting Methodology** | `counting_methodology`| `VARCHAR(40)` | `DEFAULT 'Blind Count'` | `Blind Count` vs `Visible Book Count` |
| **Freeze POS Transactions** | `is_pos_frozen` | `BOOLEAN` | `DEFAULT TRUE` | Freeze POS dispensing during audit |
| **Lead Auditor Assigned** | `conducted_by` | `VARCHAR(120)` | `NOT NULL` | Lead Auditor Name |
| **Auditor Designation** | `auditor_role` | `VARCHAR(80)` | `NOT NULL` | Store Auditor, Floor Manager, HO |
| **Secondary Witness** | `secondary_witness` | `VARCHAR(120)` | `NULL` | Dual sign-off witness |
| **Total SKUs Audited** | `items_counted` | `INTEGER` | `NOT NULL` | SKU Count |
| **Expected Book Stock Qty** | `expected_quantity` | `INTEGER` | `NOT NULL` | Theoretical inventory units |
| **Physical Counted Qty** | `actual_quantity` | `INTEGER` | `NOT NULL` | Physical hand-counted units |
| **Net Variance Units** | `variance_quantity` | `INTEGER` | `NOT NULL DEFAULT 0` | Difference (Actual - Expected) |
| **Net Financial Impact** | `variance_value` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Net loss/gain in ₹ |
| **Audit Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Planned'` | `Planned`, `In Progress`, `Pending Approval`, `Approved`, `Completed` |

---

## 4. Client CRM, Memberships & Packages (`/admin/clients`, `/admin/packages-memberships`)

### 4.1 UI Page: Client Directory & CRM (`ClientProfilePage.tsx`, `ClientProfileDossierModal.tsx`)
**Primary Database Table:** `clients`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Client ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Client Record ID (`CLT-001`) |
| **Primary Mobile Phone** | `mobile_phone` | `VARCHAR(20)` | `UNIQUE, NOT NULL` | Primary POS Search Key |
| **First Name** | `first_name` | `VARCHAR(80)` | `NOT NULL` | Given name |
| **Last Name** | `last_name` | `VARCHAR(80)` | `NOT NULL` | Surname |
| **Email Address** | `email` | `VARCHAR(150)` | `NULL` | Client notification email |
| **Gender** | `gender` | `VARCHAR(20)` | `DEFAULT 'Female'` | `Female`, `Male`, `Other` |
| **Date of Birth** | `birth_date` | `DATE` | `NULL` | Birthday marketing triggers |
| **Wedding Anniversary** | `anniversary_date` | `DATE` | `NULL` | Anniversary promotional triggers |
| **VIP Tier Level** | `vip_tier` | `VARCHAR(30)` | `DEFAULT 'Regular'` | `Bronze`, `Silver`, `Gold`, `Diamond VIP` |
| **Prepaid Wallet Balance** | `wallet_balance` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Account advance deposit (₹) |
| **Loyalty Points Balance** | `loyalty_points` | `INTEGER` | `DEFAULT 0` | Redeemable loyalty points |
| **Lifetime Spend Value** | `lifetime_spend` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Cumulative historical revenue |
| **Total Completed Visits** | `visit_count` | `INTEGER` | `DEFAULT 0` | Completed appointment count |
| **Chemical Allergies & Notes** | `allergies_notes` | `TEXT` | `NULL` | Patch test & contraindications |

---

### 4.2 UI Page: Packages & Memberships (`PackagesTab.tsx`, `CreatePackageModal.tsx`)
**Primary Database Table:** `packages_memberships`  
**Secondary Table:** `client_package_subscriptions`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Package ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Package ID (e.g. `PKG-BRIDAL-01`) |
| **Package / Plan Title** | `name` | `VARCHAR(150)` | `NOT NULL` | e.g. "Royal Bridal Glow Package" |
| **Package Type** | `package_type` | `VARCHAR(30)` | `NOT NULL` | `Service Session Bundle`, `Membership Tier`, `Prepaid Wallet Value Card` |
| **Package Selling Price** | `price` | `DECIMAL(12, 2)` | `NOT NULL` | Total package price |
| **Total Included Sessions** | `total_sessions` | `INTEGER` | `NOT NULL` | Total service vouchers bundled |
| **Validity Period Days** | `validity_days` | `INTEGER` | `DEFAULT 365` | Expiry duration in days |
| **Included Services List** | `included_service_ids` | `VARCHAR(64)[]` | `NOT NULL` | Array of Service IDs bundled |
| **Tier Discount on Addons %** | `addon_discount_pct` | `DECIMAL(5, 2)` | `DEFAULT 10.00` | Retail/addon service discount % |

---

## 5. Staff, Stylists & Commission Engine (`/admin/staff`)

### 5.1 UI Page: Staff Directory & Profiles (`StaffProfilePage.tsx`)
**Primary Database Table:** `staff_profiles`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Staff ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Staff ID (e.g. `STF-001`) |
| **Assigned Home Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Primary Branch Location |
| **Employee ID Card #** | `employee_code` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | Staff Badge ID |
| **Full Name** | `full_name` | `VARCHAR(120)` | `NOT NULL` | Stylist / Therapist Name |
| **Designation / Specialization**| `designation` | `VARCHAR(80)` | `NOT NULL` | `Master Stylist`, `Senior Aesthetician`, `Nail Tech` |
| **Contact Mobile Phone** | `mobile_phone` | `VARCHAR(20)` | `NOT NULL` | Mobile Phone |
| **Monthly Fixed Salary** | `base_salary_monthly` | `DECIMAL(12, 2)` | `DEFAULT 25000.00` | Base monthly fixed compensation |
| **Service Commission Slab %** | `service_commission_pct`| `DECIMAL(5, 2)`| `DEFAULT 10.00` | Commission on service revenue |
| **Retail Product Upsell %** | `retail_commission_pct` | `DECIMAL(5, 2)` | `DEFAULT 5.00` | Commission on retail sales |
| **Employment Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `On Leave`, `Terminated` |

---

### 5.2 UI Tab: Stylist Commission Accrual Ledger (`StaffCommissionTab.tsx`)
**Primary Database Table:** `staff_commission_ledger`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Commission Ledger ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Entry ID |
| **Beneficiary Staff** | `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Stylist Beneficiary |
| **Triggering Tax Invoice** | `invoice_id` | `VARCHAR(64)` | `NOT NULL, FK -> invoices(id)` | Completed Invoice |
| **Billed Service Amount** | `service_billed_amount`| `DECIMAL(12, 2)` | `DEFAULT 0.00` | Net service sales value |
| **Billed Retail Amount** | `retail_billed_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Net retail products value |
| **Calculated Commission ₹** | `commission_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Earned incentive payout |
| **Payout Month / Cycle** | `payout_month` | `VARCHAR(10)` | `NOT NULL` | e.g. "AUG-2026" |
| **Settlement Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Accrued'` | `Accrued`, `Approved`, `Paid` |

---

## 6. Finance, Invoicing & Split-Tender POS (`/admin/finance`)

### 6.1 UI Page: GST Invoices Master Desk (`FinancialOverviewTab.tsx`)
**Primary Database Table:** `invoices`  
**Secondary Table:** `invoice_payments`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Tax Invoice Record ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Invoice Record ID |
| **GST Tax Invoice Number** | `invoice_number` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Official GST Invoice (e.g. `INV-ATL-26-0881`) |
| **Billing Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Salon Billing Outlet |
| **Customer Billed** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Client Profile |
| **Linked Appointment** | `appointment_id` | `VARCHAR(64)` | `NULL, FK -> appointments(id)` | Associated booking |
| **Taxable Subtotal Amount** | `subtotal_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Net taxable base amount |
| **CGST (Central Tax 9%)** | `cgst_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Central GST component |
| **SGST (State Tax 9%)** | `sgst_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | State GST component |
| **IGST (Integrated Tax 18%)**| `igst_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Interstate GST component |
| **Discount Concession** | `discount_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Discount applied |
| **Gross Invoice Total Payable**| `total_payable_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Net Bill Total (₹) |
| **Settlement Status** | `payment_status` | `VARCHAR(20)` | `DEFAULT 'Paid'` | `Paid`, `Partially Paid`, `Refunded` |
| **Checkout Timestamp** | `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Billing checkout timestamp |

---

## 7. Franchise & Partner Network Governance (`/admin/franchise`)

### 7.1 UI Page: Franchise Partner Directory (`FranchisePartnersTab.tsx`, `FranchiseMasterPage.tsx`)
**Primary Database Table:** `franchise_partners`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Partner Licensee ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Partner ID (e.g. `FP-001`) |
| **Franchise Entity Name** | `name` | `VARCHAR(180)` | `NOT NULL` | e.g. "Apex Wellness & Spa LLP" |
| **Partner Code** | `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | License Code (e.g. `FP-IND-01`) |
| **Managing Principal** | `contact_person` | `VARCHAR(120)` | `NOT NULL` | Managing Director / Owner |
| **Direct Contact Phone** | `phone` | `VARCHAR(20)` | `NOT NULL` | Partner contact phone |
| **Corporate Email** | `email` | `VARCHAR(150)` | `NOT NULL` | Official business email |
| **GSTIN Registration** | `gstin` | `VARCHAR(15)` | `NOT NULL` | Franchisee Legal GSTIN |
| **Allocated Territory** | `region` | `VARCHAR(120)` | `NOT NULL` | Exclusive Territory Region |
| **Agreement Validity Start** | `agreement_start_date` | `DATE` | `NOT NULL` | Effective Start Date |
| **Agreement Expiry Date** | `agreement_end_date` | `DATE` | `NOT NULL` | Contract Renewal Date |
| **Royalty Calculation Rule** | `royalty_structure` | `VARCHAR(100)` | `DEFAULT '10% Gross Services'` | Royalty formula |
| **Accrued Royalty Total** | `royalty_accrued_total`| `DECIMAL(12, 2)` | `DEFAULT 0.00` | Total franchise fees accrued |
| **Settlement Status** | `commission_status` | `VARCHAR(30)` | `DEFAULT 'Up to Date'` | `Up to Date`, `Pending Review`, `Settlement Overdue` |
| **Operational Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Under Review`, `Terminated` |

---

## 8. Brand Settings, RBAC & Audit Lineage (`/admin/brand-settings`, `/admin/roles-permissions`, `/admin/audit-logs`)

### 8.1 UI Page: Audit Logs Lineage Desk
**Primary Database Table:** `audit_logs`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Audit Event ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique log entry ID |
| **Actor User ID** | `user_id` | `VARCHAR(64)` | `NOT NULL, FK -> users(id)` | User who executed action |
| **Actor Name & Role** | `user_display_name` | `VARCHAR(120)` | `NOT NULL` | e.g. "Aditya Pandey (Brand Owner)" |
| **Target Entity Type** | `entity_name` | `VARCHAR(60)` | `NOT NULL` | `BRANCH`, `PURCHASE_ORDER`, `STOCK_TRANSFER`, `INVOICE` |
| **Target Entity ID** | `entity_id` | `VARCHAR(64)` | `NOT NULL` | Target Record Identifier |
| **Action Performed** | `action_type` | `VARCHAR(40)` | `NOT NULL` | `CREATE`, `UPDATE`, `AUTHORIZE`, `DELETE`, `REFUND` |
| **Change Delta Payload** | `changes_json` | `JSONB` | `NOT NULL` | Complete before/after diff payload |
| **IP Address & Client User-Agent**| `ip_address` | `VARCHAR(45)` | `NOT NULL` | Client Origin IP Address |
| **Event Timestamp** | `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Exact ISO-8601 Timestamp |

---

## Summary of All Admin Module Entity Mappings

| Admin Module Tab | Primary Database Tables | Key Foreign Keys | UI Actions & Workflows Supported |
| :--- | :--- | :--- | :--- |
| **`/admin/locations`** | `branches`, `branch_operating_hours` | `brand_id`, `franchise_partner_id` | Add new branch, assign franchise partner, configure working hours & holidays |
| **`/admin/catalogue`** | `services`, `service_categories`, `service_recipes` | `category_id`, `product_sku_id` | Service pricing, execution duration, buffer times, recipe ingredient BOM |
| **`/admin/inventory`** | `products_master_skus`, `branch_stock_ledgers`, `suppliers`, `purchase_orders`, `purchase_returns_debit_notes`, `stock_transfers`, `stocktake_sessions` | `supplier_id`, `delivery_branch_id`, `source_branch_id`, `destination_branch_id` | Master SKUs, physical stock ledger, vendor PO generation, GRN inwarding, debit notes, inter-branch transfers, physical cycle count stocktake |
| **`/admin/clients`** | `clients`, `client_notes_allergies` | `brand_id` | Client CRM, VIP tiers, wallet balance, visit history, chemical allergies |
| **`/admin/packages-memberships`** | `packages_memberships`, `client_package_subscriptions` | `included_service_ids`, `client_id` | Session packages, membership tiers, loyalty point rewards |
| **`/admin/staff`** | `staff_profiles`, `staff_commission_ledger` | `branch_id`, `staff_id`, `invoice_id` | Stylist profiles, designations, monthly salary, tiered commission engine |
| **`/admin/finance`** | `invoices`, `invoice_payments` | `branch_id`, `client_id`, `appointment_id` | GST billing (CGST/SGST/IGST), split-tender POS, refund ledger |
| **`/admin/franchise`** | `franchise_partners`, `branches` | `brand_id`, `franchise_partner_id` | Partner directory, territory management, royalty fee accrual |
| **`/admin/brand-settings`** | `brands`, `users`, `role_permissions`, `audit_logs` | `brand_id`, `user_id` | Corporate settings, RBAC permission matrix, complete event audit lineage |

---
*End of Admin Panel Module Database Schema Specification.*
