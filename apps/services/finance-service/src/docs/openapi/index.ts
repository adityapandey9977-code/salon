export const financeOpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: '  Salon & Spa SaaS — Finance Service API',
    version: '1.0.0',
    description: 'Accounting, Chart of Accounts, General Ledger, Staff Commissions & Franchise Royalty Settlements',
  },
  servers: [{ url: 'http://localhost:4009', description: 'Local Development' }],
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
    '/api/v1/finance/accounts': {
      get: {
        tags: ['Finance & Accounting'],
        summary: 'List chart of accounts',
        responses: { '200': { description: 'Chart of accounts' } },
      },
    },
    '/api/v1/finance/commissions': {
      get: {
        tags: ['Commissions'],
        summary: 'Get staff commission ledger',
        parameters: [
          { name: 'staffId', in: 'query', required: false, schema: { type: 'string', format: 'uuid' } },
          { name: 'periodMonth', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Commission ledger' } },
      },
    },
    '/api/v1/finance/commissions/calculate': {
      post: {
        tags: ['Commissions'],
        summary: 'Calculate and record staff commission for an invoice',
        responses: { '201': { description: 'Commission calculated' } },
      },
    },
  },
};
