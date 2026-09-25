#   Salon SaaS — Inventory Panel Module Database Schema & UI Field Mapping Dictionary

**Document Version:** 2.9.0  
**Target System:**   Salon SaaS Web Application (`/admin/inventory` & `/inventory-controller/*`)  
**Scope:** Inventory Controller & Supply Chain Workspace (Master SKUs, FIFO Batches, Procurement POs, GRN, Debit Notes, Transfers, Recipe Wastage & Stocktake Audits)  
**Classification:** Complete Database Dictionary & Technical UI-to-Schema Mapping  

---

## Architecture & Inventory Supply Chain Domain Map

The **Inventory Panel** operates with **Central SKU Governance** and **Multi-Branch Stock Partitioning**. It implements **FIFO (First-In, First-Out) costing**, automated **BOM (Bill of Materials) service consumption**, double-custody **tamper-sealed stock transfers**, and **blind-count physical stocktake reconciliation**.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              INVENTORY SUPPLY CHAIN DOMAIN MAP                                         │
├────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────┤
│ 1. Master SKUs & Batch FIFO    │ 2. Procurement & Vendor Debit Notes   │ 3. Logistics & Stocktake Audits│
│  • Master Products & Barcodes  │  • Supplier Directory & Credit Terms  │  • Inter-Branch Stock Transfer │
│  • Multi-Branch Stock Ledgers  │  • PO Creation & Maker-Checker Approval│ • Tamper-Evident Box Seals   │
│  • FIFO Batch Expiry Tracking  │  • Goods Receipt Notes (GRN)          │  • Recipe BOM Usage & Wastage │
│  • Packaging Units (ml/gm/tube)│  • Purchase Returns & Debit Notes     │  • Blind Physical Stocktake   │
└────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────┘
```

---

## 1. Master SKU Catalog, Packaging Units & Classifications

### 1.1 UI Tab: Master SKU Directory (`ProductsConsumablesTab.tsx`, `AddMasterSkuModal.tsx`)
**Primary Database Table:** `products_master_skus`  
**Related Table:** `brands`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Master SKU ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique SKU ID (e.g. `SKU-MAJ-613`) |
| **Brand Tenant Link** | `brand_id` | `VARCHAR(64)` | `NOT NULL, FK -> brands(id)` | Central Enterprise Tenant |
| **Barcode / SKU Code** | `sku_code` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Universal Product Barcode / EAN-13 |
| **Product Full Name** | `name` | `VARCHAR(180)` | `NOT NULL` | e.g. "L'Oréal Majirel Colour Tube - 6.13" |
| **Brand / Manufacturer** | `brand_manufacturer` | `VARCHAR(100)` | `NOT NULL` | L'Oréal, Moroccanoil, O3+, Schwarzkopf |
| **Category Classification** | `category` | `VARCHAR(80)` | `NOT NULL` | `Hair Care`, `Chemical & Colour`, `Skin & Aesthetics`, `Spa & Body` |
| **Subcategory** | `subcategory` | `VARCHAR(80)` | `NULL` | e.g. "Permanent Colour", "Oxidant Developer" |
| **Item Classification** | `item_type` | `VARCHAR(30)` | `NOT NULL` | `Consumable (Backwash)`, `Retail (Resale)`, `Equipment & Tools` |
| **Standard Packaging Unit** | `measurement_unit` | `VARCHAR(30)` | `NOT NULL` | `ml`, `gm`, `Tubes`, `Bottles`, `Tubs`, `Scoops`, `Kits`, `pcs` |
| **Package Volume / Size** | `package_volume_size` | `VARCHAR(50)` | `NOT NULL` | Net container volume (e.g. "500ml", "60ml Tube") |
| **GST 8-Digit HSN Code** | `hsn_code` | `VARCHAR(20)` | `NOT NULL` | Indian GST Tariff HSN (e.g. `33051090`) |
| **GST Tax Rate %** | `gst_rate_pct` | `DECIMAL(5, 2)` | `DEFAULT 18.00` | 18.00% or 28.00% GST |
| **Maximum Retail Price (MRP)**| `mrp_selling_price` | `DECIMAL(12, 2)` | `NOT NULL` | Retail price charged to clients (₹) |
| **Default FIFO Purchase Cost**| `default_purchase_cost`| `DECIMAL(12, 2)`| `NOT NULL` | Standard baseline inwarding cost (₹) |
| **Global Reorder Level** | `reorder_threshold` | `INTEGER` | `DEFAULT 10` | Automated replenishment alert trigger |
| **Active Catalog Status** | `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active product in system |

---

## 2. Multi-Branch Physical Stock Ledgers & FIFO Batch Expiry Tracking

### 2.1 UI Tab: Physical Stock Ledger (`StockTab.tsx`)
**Primary Database Table:** `branch_stock_ledgers`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Stock Ledger Record ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique Ledger Entry ID |
| **Branch Outlet** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Salon Branch Location |
| **Product SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | Master Product SKU Link |
| **On-Hand Physical Stock** | `on_hand_quantity` | `DECIMAL(10, 3)` | `NOT NULL DEFAULT 0` | Total physical units in branch store |
| **Allocated / In-Service Qty** | `allocated_reserved_qty`| `DECIMAL(10, 3)`| `DEFAULT 0` | Stock currently locked in appointments |
| **Available Stock Units** | `available_quantity` | `DECIMAL(10, 3)` | `GENERATED ALWAYS AS (on_hand_quantity - allocated_reserved_qty)` | Net available stock for use |
| **Branch Safety Threshold** | `safety_stock_threshold`| `INTEGER` | `DEFAULT 5` | Branch reorder threshold |
| **Current Stock Valuation (₹)**| `stock_valuation` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | `available_quantity * unit_fifo_cost` |
| **Stock Health Badge** | `stock_status` | `VARCHAR(20)` | `DEFAULT 'Optimal'` | `Optimal`, `Low Stock`, `Out of Stock` |

---

### 2.2 Table: `stock_batches` (FIFO Batch / Lot Numbers & Expiry Quarantine)

| Batch Tracking Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Batch Record ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique Batch ID |
| **Holding Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Location storing batch |
| **Product SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | Target Product |
| **Manufacturing Batch / Lot #**| `batch_number` | `VARCHAR(60)` | `NOT NULL` | e.g. `LOT-LOR-2026-081` |
| **Manufacturing Date** | `manufacturing_date` | `DATE` | `NULL` | Production Date |
| **Expiry Date** | `expiry_date` | `DATE` | `NOT NULL` | Expiration Date |
| **Initial Inward Quantity** | `initial_quantity` | `DECIMAL(10, 3)` | `NOT NULL` | Units inwarded via GRN |
| **Current Remaining Quantity** | `current_remaining_qty` | `DECIMAL(10, 3)` | `NOT NULL` | Units remaining in FIFO queue |
| **Unit Purchase Cost Price** | `unit_purchase_cost` | `DECIMAL(12, 2)` | `NOT NULL` | Actual inward cost for FIFO realization |
| **Quarantine Status** | `is_quarantined` | `BOOLEAN` | `DEFAULT FALSE` | Locked if near-expiry / quality recall |

---

## 3. Vendor Directory, Procurement & Purchase Orders (POs)

### 3.1 UI Tab: Vendor Master Directory (`ProcurementTab.tsx`, `AddSupplierModal.tsx`)
**Primary Database Table:** `suppliers`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Vendor ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Supplier ID (e.g. `SUP-001`) |
| **Vendor Trading Name** | `name` | `VARCHAR(180)` | `NOT NULL` | Legal Entity Name |
| **Supplier Code** | `code` | `VARCHAR(30)` | `UNIQUE, NOT NULL` | Identifier (e.g. `SUP-LOR-01`) |
| **Legal GSTIN** | `gstin` | `VARCHAR(15)` | `NOT NULL` | 15-character GSTIN |
| **Income Tax PAN** | `pan_number` | `VARCHAR(10)` | `NOT NULL` | Supplier PAN Card |
| **Key Account Manager (KAM)** | `contact_person` | `VARCHAR(120)` | `NOT NULL` | Contact Representative |
| **Order Desk Phone** | `phone` | `VARCHAR(20)` | `NOT NULL` | Dispatch Phone |
| **Order Desk Email** | `email` | `VARCHAR(150)` | `NOT NULL` | Official PO Email |
| **Warehouse Address** | `address` | `TEXT` | `NOT NULL` | Dispatch Depot Address |
| **Credit Payment Terms** | `payment_terms` | `VARCHAR(100)` | `DEFAULT 'Net 30 Days'` | Settlement agreement |
| **Approved Credit Limit (₹)** | `credit_limit` | `DECIMAL(12, 2)` | `DEFAULT 500000.00` | Credit line maximum |
| **Lead Time (Days)** | `lead_time_days` | `INTEGER` | `DEFAULT 3` | Average fulfillment days |
| **Serviced Branches** | `branches_served_ids` | `TEXT[]` | `NOT NULL` | Array of Branch IDs supplied |
| **Vendor Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Under Review`, `Inactive` |

---

### 3.2 UI Tab: Purchase Orders & Line Items (`CreatePOModal.tsx`, `ProcurementTab.tsx`)
**Primary Database Table:** `purchase_orders`  
**Secondary Table:** `po_line_items`

#### Table: `purchase_orders`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | PO ID (e.g. `PO-2026-081`) |
| `po_number` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | Official PO Reference Code |
| `supplier_id` | `VARCHAR(64)` | `NOT NULL, FK -> suppliers(id)` | Selected Vendor |
| `delivery_branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Receiving Salon Outlet |
| `order_date` | `DATE` | `NOT NULL` | Date PO Generated |
| `expected_delivery_date`| `DATE` | `NOT NULL` | Scheduled Arrival Date |
| `subtotal_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Base goods cost (Excl. Tax) |
| `tax_amount` | `DECIMAL(12, 2)` | `NOT NULL` | 18% Input GST Accrual |
| `discount_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Supplier Trade Discount |
| `total_payable_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Gross Total PO Liability |
| `status` | `VARCHAR(30)` | `DEFAULT 'Pending Approval'` | `Draft`, `Pending Approval`, `Approved`, `Ordered`, `Partially Received`, `Fully Received` |
| `created_by` | `VARCHAR(100)` | `NOT NULL` | Requester Name |
| `approved_by` | `VARCHAR(100)` | `NULL` | Authorizer Name |

#### Table: `po_line_items`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | PO Line ID |
| `purchase_order_id` | `VARCHAR(64)` | `NOT NULL, FK -> purchase_orders(id)` | Parent PO Header |
| `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | Ordered Product SKU |
| `ordered_quantity` | `INTEGER` | `NOT NULL` | Units Ordered |
| `received_quantity` | `INTEGER` | `DEFAULT 0` | Units Inwarded via GRN |
| `unit_cost_price` | `DECIMAL(12, 2)` | `NOT NULL` | Inward Unit Cost (₹) |
| `line_total_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Line Total (Qty * Unit Cost + GST) |

---

## 4. Purchase Returns, Debit Notes & Quality Reversals

### 4.1 UI Modal: Initiate Purchase Return & Debit Note (`InitiatePurchaseReturnModal.tsx`)
**Primary Database Table:** `purchase_returns_debit_notes`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Return ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Return ID (`RET-PUR-001`) |
| **Vendor Supplier** | `supplier_id` | `VARCHAR(64)` | `NOT NULL, FK -> suppliers(id)` | Target Vendor |
| **Returning Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Salon Branch returning stock |
| **Defective Product SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)`| SKU debited |
| **Batch / Lot Number** | `batch_number` | `VARCHAR(60)` | `NOT NULL` | Batch Lot # to quarantine/deduct |
| **Return Quantity (Units)** | `quantity` | `INTEGER` | `NOT NULL` | Count of units returned |
| **Unit Purchase Cost (FIFO)**| `unit_cost` | `DECIMAL(12, 2)` | `NOT NULL` | Baseline unit cost (₹) |
| **Debit Note Claim Value** | `amount` | `DECIMAL(12, 2)` | `NOT NULL` | Total refund claim with 18% GST |
| **Debit Note Reference** | `credit_note_ref` | `VARCHAR(50)` | `NOT NULL` | Document Ref (e.g. `DN-2026-0881`) |
| **Return Reason Classification**| `reason` | `VARCHAR(120)` | `NOT NULL` | `Damaged in Transit`, `Near Expiry Spoilage`, `Expired Stock`, `Quality Defect`, `Excess Supply` |
| **Commercial Settlement Mode**| `settlement_mode` | `VARCHAR(50)` | `DEFAULT 'Credit Note'` | `Credit Note`, `Direct Bank Refund`, `Free Replacement` |
| **Finance Posting Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Processed'` | `Requested`, `Processed`, `Completed` |
| **Created Timestamp** | `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Return transaction timestamp |

---

## 5. Inter-Branch Stock Transfers & Logistics Carrier Mode

### 5.1 UI Tab: Stock Transfers Desk (`TransfersTab.tsx`, `NewTransferRequestModal.tsx`)
**Primary Database Table:** `stock_transfers`  
**Secondary Table:** `transfer_line_items`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Transfer ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Transfer ID (e.g. `TR-2026-042`) |
| **Source Branch (Origin)** | `source_branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Dispatch Outlet |
| **Destination Branch (Target)**| `destination_branch_id`| `VARCHAR(64)`| `NOT NULL, FK -> branches(id)` | Receiving Outlet |
| **Distinct SKUs Count** | `total_items` | `INTEGER` | `NOT NULL` | Number of unique SKUs |
| **Total Physical Units** | `total_quantity` | `INTEGER` | `NOT NULL` | Sum of all units in manifest |
| **Business Justification** | `purpose` | `VARCHAR(200)` | `NOT NULL` | Weekend Rush, Stock Balancing, Bridal Event |
| **Logistics Carrier Mode** | `carrier` | `VARCHAR(100)` | `NOT NULL` | Internal Salon Van, BlueDart, Hand Carry |
| **Tamper Seal Number** | `seal_number` | `VARCHAR(60)` | `NOT NULL` | Tamper-evident Box Seal Code |
| **Requester Name** | `requested_by` | `VARCHAR(120)` | `NOT NULL` | Floor Manager / Storekeeper |
| **Authorizer Name** | `approved_by` | `VARCHAR(120)` | `NULL` | Head Office Inventory Director |
| **Transfer Stage Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Requested'` | `Requested`, `Approved`, `Dispatched`, `In Transit`, `Received`, `Rejected` |
| **Dispatched Timestamp** | `dispatched_at` | `TIMESTAMPTZ` | `NULL` | Transit Start Timestamp |
| **Delivered Timestamp** | `received_at` | `TIMESTAMPTZ` | `NULL` | GRN Delivery Timestamp |

---

## 6. Service Consumption, Recipe BOM & Wastage Auditing

### 6.1 UI Tab: Service Recipe Consumption Logs (`ConsumptionTab.tsx`)
**Primary Database Table:** `stock_consumption_logs`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Consumption Event ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Log Entry ID |
| **Branch Outlet** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Salon Branch |
| **Triggering Tax Invoice** | `invoice_id` | `VARCHAR(64)` | `NOT NULL, FK -> invoices(id)` | Associated Client Bill |
| **Executed Service** | `service_id` | `VARCHAR(64)` | `NOT NULL, FK -> services(id)` | Salon Service from Menu |
| **Consumed Product SKU** | `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)`| Consumed ingredient SKU |
| **Batch / Lot Deducted** | `batch_number` | `VARCHAR(60)` | `NOT NULL` | FIFO Batch lot deducted |
| **Standard BOM Recipe Qty** | `standard_recipe_qty`| `DECIMAL(10, 3)` | `NOT NULL` | Expected BOM standard (e.g. 45.000 ml) |
| **Actual Dispensed Qty** | `actual_dispensed_qty`| `DECIMAL(10, 3)` | `NOT NULL` | Stylist measured usage (e.g. 48.000 ml) |
| **Measurement Unit** | `measurement_unit` | `VARCHAR(30)` | `NOT NULL` | `ml`, `gm`, `Tubes`, `Scoops` |
| **Wastage / Variance Delta** | `variance_qty` | `DECIMAL(10, 3)` | `GENERATED ALWAYS AS (actual_dispensed_qty - standard_recipe_qty)` | Over/under consumption variance |
| **Variance Reason Justification**| `variance_notes` | `VARCHAR(150)` | `NULL` | e.g. "Long/thick hair extra mix", "Spillage" |

---

## 7. Physical Stocktake Audits & Cycle Count Reconciliation

### 7.1 UI Tab: Stocktake Sessions & Discrepancies (`StocktakeTab.tsx`, `ScheduleStocktakeModal.tsx`)
**Primary Database Table:** `stocktake_sessions`  
**Secondary Table:** `stocktake_discrepancies`

#### Table: `stocktake_sessions`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Audit Session ID (e.g. `STK-AUDIT-AUG26-01`) |
| `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Audited Branch Location |
| `audit_date` | `DATE` | `NOT NULL` | Scheduled Audit Date |
| `audit_type` | `VARCHAR(80)` | `NOT NULL` | `Full Store Comprehensive`, `High-Value Category Cycle Count`, `Spot Check`, `Quarterly Valuation` |
| `counting_methodology` | `VARCHAR(40)` | `DEFAULT 'Blind Count'` | `Blind Count` or `Visible Book Count` |
| `is_pos_frozen` | `BOOLEAN` | `DEFAULT TRUE` | POS Transaction Lockdown Active |
| `conducted_by` | `VARCHAR(120)` | `NOT NULL` | Lead Auditor Name |
| `auditor_role` | `VARCHAR(80)` | `NOT NULL` | `Internal Store Auditor`, `Floor Manager`, `HO Controller` |
| `secondary_witness` | `VARCHAR(120)` | `NULL` | Dual-custody Counter-Signer |
| `items_counted` | `INTEGER` | `NOT NULL` | Total SKUs audited |
| `expected_quantity` | `INTEGER` | `NOT NULL` | Theoretical System Quantity |
| `actual_quantity` | `INTEGER` | `NOT NULL` | Physical Hand-Counted Quantity |
| `variance_quantity` | `INTEGER` | `GENERATED ALWAYS AS (actual_quantity - expected_quantity)` | Net Variance Units |
| `variance_value` | `DECIMAL(12, 2)` | `NOT NULL DEFAULT 0.00` | Net Financial Discrepancy Loss/Gain (₹) |
| `status` | `VARCHAR(30)` | `DEFAULT 'Planned'` | `Planned`, `In Progress`, `Pending Approval`, `Approved`, `Completed` |

#### Table: `stocktake_discrepancies`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Discrepancy Entry ID |
| `stocktake_session_id` | `VARCHAR(64)` | `NOT NULL, FK -> stocktake_sessions(id)` | Parent Audit Session |
| `product_sku_id` | `VARCHAR(64)` | `NOT NULL, FK -> products_master_skus(id)` | SKU Audited |
| `expected_book_qty` | `INTEGER` | `NOT NULL` | Book Stock |
| `actual_shelf_qty` | `INTEGER` | `NOT NULL` | Physical Shelf Count |
| `variance_delta` | `INTEGER` | `GENERATED ALWAYS AS (actual_shelf_qty - expected_book_qty)` | Variance |
| `unit_cost` | `DECIMAL(12, 2)` | `NOT NULL` | Unit FIFO Cost Price |
| `loss_gain_value` | `DECIMAL(12, 2)` | `NOT NULL` | Financial Impact (₹) |
| `reason_code` | `VARCHAR(100)` | `NOT NULL` | `Unrecorded Backwash Usage`, `Dropped/Damaged`, `Spillage Loss`, `Theft/Pilferage` |

---

## Summary of Inventory Panel Entity Mappings

| Inventory UI Tab | Primary Database Tables | Key Relations & Scoping | Operational Business Impact |
| :--- | :--- | :--- | :--- |
| **1. Master SKUs Directory** | `products_master_skus` | `brand_id` | Universal SKU codes, barcodes, packaging units, HSN codes, MRP prices, and baseline FIFO costs |
| **2. Physical Stock & FIFO Batches**| `branch_stock_ledgers`, `stock_batches` | `branch_id`, `product_sku_id` | Real-time multi-branch stock on hand, allocated in-service stock, FIFO lot tracking, expiry quarantine |
| **3. Procurement & Purchase Orders**| `suppliers`, `purchase_orders`, `po_line_items` | `supplier_id`, `delivery_branch_id` | Supplier directory, credit terms, PO creation with maker-checker approvals, GRN inwarding |
| **4. Returns & Debit Notes** | `purchase_returns_debit_notes` | `supplier_id`, `branch_id`, `product_sku_id` | Defective vendor returns, 18% GST refund reversal, debit note reference generation |
| **5. Stock Transfers & Logistics** | `stock_transfers`, `transfer_line_items` | `source_branch_id`, `destination_branch_id` | Inter-branch inventory rebalancing, transport carrier modes, tamper-evident container seals |
| **6. Recipe Consumption & BOM** | `stock_consumption_logs` | `branch_id`, `service_id`, `product_sku_id`, `invoice_id` | Automated backwash stock deduction upon checkout, tolerance variance tracking, spillage logging |
| **7. Stocktake Audits & Reconciliation**| `stocktake_sessions`, `stocktake_discrepancies` | `branch_id`, `product_sku_id` | Blind physical audits, POS lockdown, expected vs actual discrepancy analysis, financial write-offs |

---
*End of Inventory Panel Module Database Schema Specification.*
