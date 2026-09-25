#   Salon SaaS — Central Inventory & Supply Chain Module API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.0.0  
**Target System:**   Salon SaaS — Central Inventory Portal (`apps/web/src/modules/inventory`) & Backend API Gateway (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Procurement, Master SKUs, Purchase Orders, Inter-Branch Transfers, BOM Recipes, and Stocktake Audits  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & Central Supply Chain Gateway

The **Inventory Module** (`apps/web/src/modules/inventory`) is a supply chain management workspace for Central Warehouse Managers, Purchasing Officers, and Inventory Auditors. It controls master product SKU catalogs, supplier purchase orders, inter-branch stock dispatching, service consumable recipe Bill of Materials (BOM), internal usage logs, safety stock alerts, and stocktake reconciliation.

```
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│     Supply Chain Workspace (/inventory)│ ──► │  Central Supply Chain API Gateway      │
│  (apps/web/src/modules/inventory)      │     │  • /inventory    • /suppliers          │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## 2. Inventory Manager Authentication APIs

**Base Path:** `/api/v1/auth`  
**Database Entities:** `users`, `roles`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Inventory Portal Login | Authenticates Central Supply Chain Manager credentials and issues inventory authorization tokens. | Body: `{ email, password, role: 'INVENTORY_MANAGER' }` |
| `/api/v1/auth/me` | `GET` | Header Bar | Verifies active session token, assigned warehouse scope, and supply chain permissions. | Res: `{ user_id, name, warehouse_id: 'WH-CENTRAL-01' }` |

---

## 3. Screen-by-Screen API Endpoint Dictionary

### 3.1 Screen: Supply Chain Dashboard (`/inventory/`)
* **UI Pages:** `DashboardPage.tsx`, `AlertsPage.tsx`
* **Target Entities:** `inventory_items`, `stock_transfers`, `purchase_orders`

| Endpoint URI | HTTP Method | Target UI Widget | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/inventory/dashboard-kpis` | `GET` | Supply Chain Metric Cards | Computes Total Inventory Valuation (₹), Active SKUs Count, Pending Purchase Orders, and Critical Safety Stock Breaches. | Res: `{ totalValuation, activeSkusCount, pendingPurchaseOrders, safetyStockBreaches }` |
| `/api/v1/inventory/alerts/critical` | `GET` | `AlertsPage.tsx` | Displays real-time alerts for SKUs whose stock levels across central dispensaries have dropped below safety thresholds. | Res: `Array<CriticalStockAlertItem>` |

---

### 3.2 Screen: Master Product SKUs & Catalogue (`/inventory/products`)
* **UI Pages:** `ProductsPage.tsx`
* **Target Entities:** `inventory_items`, `suppliers`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/inventory/skus` | `GET` | Master Product Table | Fetches master catalog of consumable and retail SKUs (e.g. L'Oréal Majirel Color, Hydra Serums) with barcode & cost price. | Query: `?category=HairCare`<br>Res: `Array<MasterSkuObject>` |
| `/api/v1/inventory/skus` | `POST` | Add New Product Modal | Registers a new master product SKU with barcode, unit of measure, minimum safety stock buffer, and cost price. | Body: `{ sku_code, brand, product_name, category, cost_price: 850.00, reorder_level: 10 }` |

---

### 3.3 Screen: Purchase Orders & Supplier Procurement (`/inventory/purchases`, `/inventory/suppliers`)
* **UI Pages:** `PurchasesPage.tsx`, `SuppliersPage.tsx`, `GoodsReceiptPage.tsx`
* **Target Entities:** `purchase_orders`, `purchase_order_items`, `suppliers`, `stock_receipts`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/inventory/suppliers` | `GET` / `POST` | Suppliers Directory | Manages vendor relationships (L'Oréal India, Schwarzkopf, Lotus Herbals), credit terms, and GSTIN records. | Body: `{ vendor_name, contact_person, phone, email, gstin, payment_terms_days: 30 }` |
| `/api/v1/inventory/purchase-orders` | `GET` / `POST` | Purchase Orders Grid | Issues formal procurement POs to vendors for raw consumable batches and retail inventory replenishment. | Body: `{ supplier_id, expected_delivery_date, items: [{ sku_id, quantity, unit_cost }] }` |
| `/api/v1/inventory/goods-receipt` | `POST` | `GoodsReceiptPage.tsx` | Inspects incoming supplier shipment deliveries, verifies GRN voucher numbers, and updates warehouse stock balances. | Body: `{ purchase_order_id, grn_number, received_items: [{ sku_id, quantity_accepted, serial_batch_no }] }` |

---

### 3.4 Screen: Inter-Branch Stock Transfers (`/inventory/transfers`)
* **UI Pages:** `TransfersPage.tsx`
* **Target Entities:** `stock_transfers`, `stock_transfer_items`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/inventory/transfers` | `GET` | Stock Transfers Grid | Tracks inter-branch stock dispatches (Central Warehouse -> Indore, Indore -> Pune) with shipping status (`Pending`, `In-Transit`, `Delivered`). | Query: `?status=In-Transit`<br>Res: `Array<StockTransferObject>` |
| `/api/v1/inventory/transfers/dispatch`| `POST` | New Transfer Modal | Dispatches stock transfer shipment from central warehouse to a requesting salon branch. | Body: `{ source_warehouse_id, target_branch_id, items: [{ sku_id, quantity_dispatched }] }` |

---

### 3.5 Screen: Service Recipe BOM & Consumption Logs (`/inventory/recipes`, `/inventory/consumption`)
* **UI Pages:** `ServiceRecipesPage.tsx`, `ConsumptionPage.tsx`
* **Target Entities:** `service_recipes`, `stock_consumption_logs`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/inventory/recipes` | `GET` / `POST` | Service Recipes Table | Configures mandatory consumable product formulas (BOM) linked to service completion POS checkout scans. | Body: `{ service_id, recipe_items: [{ sku_id: 'SKU-5821', qty_per_service: 30, unit: 'ML' }] }` |
| `/api/v1/inventory/consumption` | `GET` | Consumption Logs Tab | Audits internal dispensary consumable usage vs POS checkout auto-deduction variance. | Query: `?branch_id=BR-001`<br>Res: `Array<ConsumptionLogObject>` |

---

### 3.6 Screen: Stocktake Audit & Reconciliation (`/inventory/audit`)
* **UI Pages:** `AuditPage.tsx`, `ReportsPage.tsx`
* **Target Entities:** `stocktake_audits`, `stock_adjustments`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/inventory/stocktake` | `POST` | Physical Audit Form | Submits physical shelf stock count audit findings and logs variance (Damaged, Expired, Stolen). | Body: `{ branch_id, audit_date, items: [{ sku_id, physical_count, system_count }] }` |
| `/api/v1/inventory/stocktake/adjust` | `POST` | Reconcile Variance Button | Approves inventory balance adjustment voucher to synchronize system ledger with physical audit count. | Body: `{ audit_id, adjustment_reason: 'Expired Product Disposal' }` |

---

## 4. End-to-End API Integration Workflows

### Flow 4.1: End-to-End Vendor Procurement, Goods Receipt (GRN) & Stock Ledger Update Flow
```
┌──────────────────────────────────────┐
│ 1. GET /inventory/alerts/critical    │ ──► System flags safety stock breach for L'Oréal Majirel 5.0.
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 2. POST /inventory/purchase-orders   │ ──► Issues Purchase Order (PO) to L'Oréal India Pvt Ltd for 100 units.
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 3. POST /inventory/goods-receipt     │ ──► Supplier delivers goods: Central Warehouse verifies GRN & batch numbers.
└──────────────────┬───────────────────┘
                   │
                   v
┌──────────────────────────────────────┐
│ 4. GET /inventory/skus               │ ──► Stock ledger updates balance & clears low-stock safety alert.
└──────────────────────────────────────┘
```

---

## 5. Verification Summary

- **Inventory APIs Documented:** 2 Auth endpoints + 13 supply chain REST endpoints across all 14 inventory screens (`/inventory/*`).
- **End-to-End Workflow Documented:** Complete Procurement PO, Goods Receipt GRN & Stock Ledger Sync Sequence.
