# Service Documentation: Inventory Service (`apps/services/inventory-service`)

> **Stock Tracking, Professional vs Retail Usage, Purchase Orders, Inter-Branch Transfers & Suppliers**

---

## 1. Overview & Responsibilities

The **Inventory Service** governs physical supplies, beauty products, and back-bar consumption items. It distinguishes between retail stock (for customer purchase) and professional consumption stock (shampoos, bleach powders, spa oils used during treatments), providing automated low-stock alerts, purchase order workflows, vendor catalogues, and inter-branch inventory transfers.

### Key Responsibilities
- **Dual Stock Tracking**: Separate tracking for **Retail Inventory** (for sale at POS) and **Professional Back-Bar Inventory** (used internally during service execution).
- **Stock Movements & Audit Logs**: Full ledger of stock additions, sales deductions, waste write-offs, and physical stock count reconciliations.
- **Low-Stock Triggers**: Automated alerts when stock counts fall below configured re-order minimum levels.
- **Supplier & Vendor Directory**: Vendor profiles, contact information, price agreements, and lead times.
- **Purchase Order (PO) Lifecycle**: `DRAFT` -> `SUBMITTED` -> `PARTIALLY_RECEIVED` -> `RECEIVED` -> `CLOSED`.
- **Inter-Branch Stock Transfers**: Formal request, dispatch, and receiving workflow between different salon branch locations.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `INVENTORY_SERVICE_PORT` / `PORT` | `3008` | HTTP listener port |
| **Database URL** | `INVENTORY_DATABASE_URL` | `postgresql://.../inventory_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration |

---

## 3. Database Schema Entities (`inventory_db`)

- **`StockLevel`**: `id`, `tenantId`, `branchId`, `productId`, `retailQuantity`, `professionalQuantity`, `minThreshold`, `reorderQuantity`, `updatedAt`
- **`StockMovement`**: `id`, `tenantId`, `branchId`, `productId`, `movementType` (`PURCHASE_RECEIPT`, `SALE_DEDUCTION`, `SERVICE_CONSUMPTION`, `TRANSFER_IN`, `TRANSFER_OUT`, `WASTE_WRITE_OFF`, `MANUAL_ADJUSTMENT`), `quantityChange`, `previousQuantity`, `newQuantity`, `referenceId`, `recordedByUserId`, `timestamp`
- **`Supplier`**: `id`, `tenantId`, `name`, `contactPerson`, `email`, `phone`, `address`, `taxId`, `status`
- **`PurchaseOrder`**: `id`, `tenantId`, `branchId`, `supplierId`, `poNumber`, `status` (`DRAFT`, `ORDERED`, `RECEIVED`, `CANCELLED`), `totalCost`, `orderedAt`, `receivedAt`
- **`PurchaseOrderItem`**: `id`, `purchaseOrderId`, `productId`, `orderedQuantity`, `receivedQuantity`, `unitCost`
- **`StockTransfer`**: `id`, `tenantId`, `sourceBranchId`, `destinationBranchId`, `status` (`REQUESTED`, `IN_TRANSIT`, `RECEIVED`, `REJECTED`), `dispatchedAt`, `receivedAt`
- **`StockTransferItem`**: `id`, `stockTransferId`, `productId`, `quantity`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:branch:{branchId}:stock-levels` (TTL: 180s)
- `tenant:{tenantId}:branch:{branchId}:low-stock` (TTL: 120s)

---

## 5. Key API Endpoints

- `GET /api/v1/inventory/stock-levels`
- `PATCH /api/v1/inventory/stock-levels/adjust`
- `GET /api/v1/inventory/stock-movements`
- `GET /api/v1/inventory/suppliers`
- `POST /api/v1/inventory/suppliers`
- `GET /api/v1/inventory/purchase-orders`
- `POST /api/v1/inventory/purchase-orders`
- `POST /api/v1/inventory/purchase-orders/:id/receive`
- `GET /api/v1/inventory/transfers`
- `POST /api/v1/inventory/transfers`
- `POST /api/v1/inventory/transfers/:id/receive`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.inventory.stock.low_alert`
  - `salon.events.inventory.po.received`
  - `salon.events.inventory.transfer.completed`
- **Consumed Events**:
  - `salon.events.payment.completed` -> Deducts retail product quantities from `StockLevel`
  - `salon.events.booking.completed` -> Deducts service formula professional consumable quantities
