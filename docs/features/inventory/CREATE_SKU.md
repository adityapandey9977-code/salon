# Feature: Inventory SKU & Stock Ledger Management

## 1. SKU Master (`CREATE_SKU.md`)
- Endpoint: `POST /api/v1/inventory/skus`
- Supports consumables, retail products, batch tracking, expiry tracking, and UOM conversions.
- Scoped by `tenantId` + unique `skuCode`.

## 2. Immutable Append-Only Movement Ledger
- Table: `StockMovement`
- All changes are recorded with `movementType` (`PURCHASE_RECEIPT`, `SERVICE_CONSUMPTION`, `RETAIL_SALE`, `TRANSFER_OUT`, `TRANSFER_IN`, `ADJUSTMENT_IN`, `ADJUSTMENT_OUT`, `WASTAGE`).
- `BranchStock` maintains projected fast balances (`quantityOnHandProjection`, `quantityAvailableProjection`).

## 3. Procurement & Goods Receipt (`CREATE_PURCHASE_ORDER.md`, `RECEIVE_GOODS.md`)
- PO Workflow: `DRAFT` $\rightarrow$ `PENDING_APPROVAL` $\rightarrow$ `APPROVED` $\rightarrow$ `PARTIALLY_RECEIVED` $\rightarrow$ `RECEIVED`.
- Goods Receipt (GRN): creates `GoodsReceiptItem`, updates batch remaining quantity, generates `PURCHASE_RECEIPT` movements, and emits `GOODS_RECEIVED.v1` for Finance AP.

## 4. Transfers & Stocktake (`TRANSFER_STOCK.md`, `STOCKTAKE.md`)
- Inter-branch transfers dispatch from source and receive at destination branch.
- Stocktakes record physical vs expected counts and post compensating adjustment movements for variances.

## 5. Automated Recipe & Sale Consumption (`CONSUME_SERVICE_STOCK.md`)
- Listens to `SERVICE_COMPLETED.v1` and `SALE_COMPLETED.v1` from RabbitMQ.
- Computes BOM quantities idempotently and triggers `STOCK_LOW.v1` when below threshold.
