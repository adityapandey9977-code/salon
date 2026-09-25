export const financeOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: '  Financial Accounting & Franchise Royalty API',
    version: '1.0.0',
    description: 'Double-entry Accounting, Staff Commissions, Payroll Runs, and Franchise Royalty Settlements',
  },
  servers: [
    {
      url: 'http://localhost:3009',
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
    '/api/v1/finance/overview': {
      get: {
        summary: 'Get financial overview projection (revenue, expenses, net profit, margin)',
        responses: { '200': { description: 'Overview metrics' } },
      },
    },
    '/api/v1/finance/corporate-kpis': {
      get: {
        summary: 'Get corporate EBITDA, gross margin, and burn rate KPIs',
        responses: { '200': { description: 'Corporate KPIs' } },
      },
    },
    '/api/v1/finance/cashflow-trend': {
      get: {
        summary: 'Get monthly cashflow trends',
        responses: { '200': { description: 'Cashflow trend array' } },
      },
    },
    '/api/v1/finance/accounts': {
      get: {
        summary: 'List chart of accounts',
        responses: { '200': { description: 'List of accounts' } },
      },
      post: {
        summary: 'Create account in chart of accounts',
        responses: { '201': { description: 'Account created' } },
      },
    },
    '/api/v1/finance/journals': {
      get: {
        summary: 'List posted journal entries with line breakdown',
        responses: { '200': { description: 'Journal entries' } },
      },
      post: {
        summary: 'Post balanced double-entry journal entry',
        responses: { '201': { description: 'Journal posted' } },
      },
    },
    '/api/v1/finance/commissions/tiers': {
      get: {
        summary: 'Get staff commission tiers and versioned rules',
        responses: { '200': { description: 'Commission rules' } },
      },
      put: {
        summary: 'Upsert commission rule',
        responses: { '200': { description: 'Rule upserted' } },
      },
    },
    '/api/v1/staff/commissions': {
      get: {
        summary: 'List earned staff commissions',
        responses: { '200': { description: 'Commission transactions' } },
      },
    },
    '/api/v1/finance/payroll/run': {
      get: {
        summary: 'List historical payroll runs',
        responses: { '200': { description: 'Payroll runs' } },
      },
    },
    '/api/v1/finance/payroll/execute': {
      post: {
        summary: 'Execute payroll run with attendance, commissions, and adjustments',
        responses: { '201': { description: 'Payroll run created' } },
      },
    },
    '/api/v1/finance/payroll/{id}/approve': {
      post: {
        summary: 'Approve payroll run',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Payroll run approved' } },
      },
    },
    '/api/v1/billing/royalties': {
      post: {
        summary: 'Create franchise royalty rule',
        responses: { '201': { description: 'Royalty rule created' } },
      },
    },
    '/api/v1/billing/royalties/settlements': {
      get: {
        summary: 'List franchise partner settlements',
        responses: { '200': { description: 'Settlement list' } },
      },
      post: {
        summary: 'Generate franchise settlement',
        responses: { '201': { description: 'Settlement generated' } },
      },
    },
    '/api/v1/billing/royalties/{id}/pay': {
      post: {
        summary: 'Mark franchise settlement paid',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Settlement marked paid' } },
      },
    },
  },
};
