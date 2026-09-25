export const inventoryOpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: '  Salon & Spa SaaS — Inventory Service API',
    version: '1.0.0',
    description: 'SKU Catalogue, Branch Stock, Immutable Movements, Suppliers, POs, Transfers & Adjustments',
  },
  servers: [{ url: 'http://localhost:4008', description: 'Local Development' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        responses: { '200': { description: 'Service is healthy' } },
      },
    },
    '/ready': {
      get: {
        summary: 'Readiness check endpoint',
        responses: { '200': { description: 'Service is ready' } },
      },
    },
    '/api/v1/inventory/skus': {
      get: {
        tags: ['Inventory'],
        summary: 'List master SKU catalogue with branch stock levels',
        responses: { '200': { description: 'List of SKUs' } },
      },
      post: {
        tags: ['Inventory'],
        summary: 'Create a new SKU item in catalogue',
        responses: { '201': { description: 'SKU created' } },
      },
    },
    '/api/v1/inventory/branches/{branchId}/stock': {
      get: {
        tags: ['Inventory'],
        summary: 'Get live inventory for a specific branch',
        parameters: [{ name: 'branchId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Branch stock' } },
      },
    },
    '/api/v1/inventory/adjustments': {
      post: {
        tags: ['Inventory'],
        summary: 'Post stock adjustment with immutable ledger trail',
        responses: { '200': { description: 'Stock adjusted' } },
      },
    },
  },
};
