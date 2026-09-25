export const reportingOpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: '  Salon SaaS - Reporting & Analytics Service API',
    version: '1.0.0',
    description:
      'Read-optimized analytics projections, multi-tenant dashboards, branch comparisons, franchise metrics, operational reporting, async exports, and append-only audit trail.',
  },
  servers: [
    {
      url: 'http://localhost:5012',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Liveness probe',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Service is alive',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/ready': {
      get: {
        summary: 'Readiness probe',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Service dependencies are ready',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/metrics': {
      get: {
        summary: 'Prometheus metrics',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Prometheus metrics data',
            content: { 'text/plain': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/api/v1/dashboard/metrics': {
      get: {
        summary: 'Get multi-tenant / branch aggregated dashboard metrics',
        tags: ['Dashboards'],
        parameters: [
          { name: 'range', in: 'query', schema: { type: 'string', default: '30d' } },
          { name: 'branchId', in: 'query', schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': {
            description: 'Dashboard metrics summary and time-series',
          },
        },
      },
    },
    '/api/v1/dashboard/charts': {
      get: {
        summary: 'Get dashboard chart series',
        tags: ['Dashboards'],
        parameters: [
          { name: 'period', in: 'query', schema: { type: 'string', enum: ['week', 'month', 'year'], default: 'month' } },
        ],
        responses: {
          '200': { description: 'Chart series data' },
        },
      },
    },
    '/api/v1/dashboard/occupancy': {
      get: {
        summary: 'Get branch appointment occupancy percentage',
        tags: ['Dashboards'],
        responses: {
          '200': { description: 'Occupancy metrics' },
        },
      },
    },
    '/api/v1/dashboard/branch-kpis': {
      get: {
        summary: 'Get real-time branch KPIs',
        tags: ['Dashboards'],
        responses: {
          '200': { description: 'Branch KPI summary' },
        },
      },
    },
    '/api/v1/dashboard/call-center-kpis': {
      get: {
        summary: 'Get telephony & call center performance KPIs',
        tags: ['Dashboards'],
        responses: {
          '200': { description: 'Call center KPI metrics' },
        },
      },
    },
    '/api/v1/branches/analytics/comparison': {
      get: {
        summary: 'Get branch performance comparative analytics',
        tags: ['Dashboards'],
        responses: {
          '200': { description: 'Branch comparative metrics' },
        },
      },
    },
    '/api/v1/inventory/dashboard-kpis': {
      get: {
        summary: 'Get inventory stock valuation & alert KPIs',
        tags: ['Inventory Reporting'],
        responses: {
          '200': { description: 'Inventory KPIs' },
        },
      },
    },
    '/api/v1/tenant/franchise/dashboard-kpis': {
      get: {
        summary: 'Get franchise partner dashboard KPIs',
        tags: ['Franchise Reporting'],
        responses: {
          '200': { description: 'Franchise KPIs' },
        },
      },
    },
    '/api/v1/reports/executive-summary': {
      get: {
        summary: 'Get executive business summary report',
        tags: ['Reports'],
        responses: {
          '200': { description: 'Executive summary report data' },
        },
      },
    },
    '/api/v1/reports/revenue': {
      get: {
        summary: 'Get revenue, tax, and product/service breakdown report',
        tags: ['Reports'],
        responses: {
          '200': { description: 'Revenue report items' },
        },
      },
    },
    '/api/v1/reports/export': {
      post: {
        summary: 'Submit async report export job',
        tags: ['Reports'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  reportType: { type: 'string', default: 'EXECUTIVE_SUMMARY' },
                  parameters: { type: 'object' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Export job initiated' },
        },
      },
    },
    '/api/v1/audit': {
      get: {
        summary: 'Query sanitized append-only audit events',
        tags: ['Audit'],
        parameters: [
          { name: 'entityType', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
        ],
        responses: {
          '200': { description: 'Audit trail items' },
        },
      },
    },
    '/api/v1/super-admin/dashboard/kpis': {
      get: {
        summary: 'Platform-wide Super Admin control plane KPIs',
        tags: ['Super Admin'],
        responses: {
          '200': { description: 'Platform KPIs' },
        },
      },
    },
  },
};
