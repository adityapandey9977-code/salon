export interface InventorySkuDto {
  id: string;
  tenantId: string;
  skuCode: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  unitOfMeasure: string;
  purchaseUnit?: string | null;
  consumptionUnit?: string | null;
  conversionFactor?: number | null;
  costPrice: number;
  retailPrice?: number | null;
  isConsumable: boolean;
  isRetail: boolean;
  trackBatch: boolean;
  trackExpiry: boolean;
  reorderEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BranchStockDto {
  id: string;
  tenantId: string;
  branchId: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  unitOfMeasure: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  reorderLevel?: number | null;
  reorderQuantity?: number | null;
  isLowStock: boolean;
  updatedAt: string;
}

export interface StockMovementDto {
  id: string;
  tenantId: string;
  branchId: string;
  skuId: string;
  batchId?: string | null;
  movementType: string;
  quantity: number;
  unitCost?: number | null;
  referenceType: string;
  referenceId?: string | null;
  reason?: string | null;
  occurredAt: string;
  actorPrincipalType: string;
  actorUserId?: string | null;
  correlationId?: string | null;
  createdAt: string;
}

export interface SupplierDto {
  id: string;
  tenantId: string;
  supplierCode: string;
  legalName: string;
  displayName?: string | null;
  gstin?: string | null;
  pan?: string | null;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderDto {
  id: string;
  tenantId: string;
  poNumber: string;
  supplierId: string;
  supplierName?: string;
  orderingBranchId?: string | null;
  status: string;
  currency: string;
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  expectedDeliveryAt?: string | null;
  items: Array<{
    id: string;
    skuId: string;
    skuCode?: string;
    skuName?: string;
    orderedQuantity: number;
    receivedQuantity: number;
    unitPrice: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceiptDto {
  id: string;
  tenantId: string;
  branchId: string;
  purchaseOrderId: string;
  grnNumber: string;
  supplierInvoiceNumber?: string | null;
  receivedAt: string;
  status: string;
  items: Array<{
    id: string;
    skuId: string;
    batchNumber?: string | null;
    expiryDate?: string | null;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    unitCost: number;
  }>;
  createdAt: string;
}

export interface StockTransferDto {
  id: string;
  tenantId: string;
  transferNumber: string;
  sourceBranchId: string;
  destinationBranchId: string;
  status: string;
  requestedAt: string;
  dispatchedAt?: string | null;
  receivedAt?: string | null;
  items: Array<{
    id: string;
    skuId: string;
    requestedQuantity: number;
    dispatchedQuantity?: number | null;
    receivedQuantity?: number | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface StocktakeDto {
  id: string;
  tenantId: string;
  branchId: string;
  status: string;
  startedAt: string;
  completedAt?: string | null;
  notes?: string | null;
  items: Array<{
    id: string;
    skuId: string;
    skuName?: string;
    expectedQuantity: number;
    countedQuantity: number;
    variance: number;
    adjustmentMovementId?: string | null;
  }>;
  createdAt: string;
}
