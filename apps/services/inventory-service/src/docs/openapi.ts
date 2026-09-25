export const inventoryOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: '  Inventory & Procurement Service API',
    version: '1.0.0',
    description: 'Inventory Management, Procurement (PO & GRN), Immutable Stock Movements, Transfers, and Stocktake',
  },
  servers: [
    {
      url: 'http://localhost:3008',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Liveness probe',
        responses: { '200': { description: 'Service is alive' } },
      },
    },
    '/ready': {
      get: {
        summary: 'Readiness probe',
        responses: { '200': { description: 'Service is ready' } },
      },
    },
    '/metrics': {
      get: {
        summary: 'Metrics',
        responses: { '200': { description: 'Prometheus metrics' } },
      },
    },
    '/api/v1/inventory/dashboard-kpis': {
      get: {
        summary: 'Get inventory dashboard valuation and KPI metrics',
        responses: { '200': { description: 'Valuation, counts, and alert totals' } },
      },
    },
    '/api/v1/inventory/skus': {
      get: {
        summary: 'List SKUs master',
        responses: { '200': { description: 'Array of inventory SKUs' } },
      },
      post: {
        summary: 'Create a new inventory SKU',
        responses: { '201': { description: 'SKU created successfully' } },
      },
    },
    '/api/v1/inventory/skus/{id}': {
      get: {
        summary: 'Get SKU details by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'SKU details' } },
      },
      patch: {
        summary: 'Update SKU master fields',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Updated SKU details' } },
      },
    },
    '/api/v1/inventory/stock': {
      get: {
        summary: 'List stock projections across branches',
        responses: { '200': { description: 'Stock list' } },
      },
    },
    '/api/v1/inventory/branch-stock': {
      get: {
        summary: 'Get branch specific stock',
        responses: { '200': { description: 'Branch stock list' } },
      },
    },
    '/api/v1/inventory/alerts/branch': {
      get: {
        summary: 'Get low stock alerts for branch',
        responses: { '200': { description: 'List of items below reorder level' } },
      },
    },
    '/api/v1/inventory/alerts/critical': {
      get: {
        summary: 'Get critical (out of stock) alerts',
        responses: { '200': { description: 'List of out-of-stock items' } },
      },
    },
    '/api/v1/inventory/suppliers': {
      get: {
        summary: 'List suppliers',
        responses: { '200': { description: 'Supplier list' } },
      },
      post: {
        summary: 'Create a new supplier profile',
        responses: { '201': { description: 'Supplier created' } },
      },
    },
    '/api/v1/inventory/purchase-orders': {
      get: {
        summary: 'List purchase orders',
        responses: { '200': { description: 'PO list' } },
      },
      post: {
        summary: 'Create purchase order in DRAFT status',
        responses: { '201': { description: 'PO created' } },
      },
    },
    '/api/v1/inventory/purchase-orders/{id}': {
      get: {
        summary: 'Get PO details with line items',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Purchase order details' } },
      },
    },
    '/api/v1/inventory/purchase-orders/{id}/approve': {
      post: {
        summary: 'Approve purchase order',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Purchase order approved' } },
      },
    },
    '/api/v1/inventory/goods-receipt': {
      post: {
        summary: 'Record goods receipt (GRN) and update stock projections',
        responses: { '201': { description: 'GRN created and stock movements posted' } },
      },
    },
    '/api/v1/inventory/transfers': {
      get: {
        summary: 'List inter-branch stock transfers',
        responses: { '200': { description: 'Transfer list' } },
      },
      post: {
        summary: 'Create transfer request',
        responses: { '201': { description: 'Transfer requested' } },
      },
    },
    '/api/v1/inventory/transfers/{id}/dispatch': {
      post: {
        summary: 'Dispatch transfer from source branch',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Transfer dispatched' } },
      },
    },
    '/api/v1/inventory/transfers/{id}/receive': {
      post: {
        summary: 'Receive transfer at destination branch',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Transfer received and stock added' } },
      },
    },
    '/api/v1/inventory/stocktake': {
      get: {
        summary: 'List stocktake sessions',
        responses: { '200': { description: 'Stocktake list' } },
      },
      post: {
        summary: 'Start new physical stocktake',
        responses: { '201': { description: 'Stocktake created' } },
      },
    },
    '/api/v1/inventory/stocktake/{id}/complete': {
      post: {
        summary: 'Complete stocktake and apply compensating adjustment movements',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Stocktake completed and variance adjusted' } },
      },
    },
    '/api/v1/inventory/stock/adjust': {
      post: {
        summary: 'Post manual stock adjustment with immutable ledger record',
        responses: { '200': { description: 'Stock adjusted' } },
      },
    },
  },
};
