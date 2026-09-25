export const reportingOpenApiSpec = {
    openapi: '3.0.3',
    info: {
        title: '  Salon & Spa SaaS — Reporting & Analytics Service API',
        version: '1.0.0',
        description: 'Business Intelligence Dashboards, Projections, KPI Aggregations & Immutable Audit Logging',
    },
    servers: [{ url: 'http://localhost:4012', description: 'Local Development' }],
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
        '/api/v1/dashboard/stats': {
            get: {
                tags: ['Dashboard & Analytics'],
                summary: 'Get revenue, appointment trends, and business performance KPIs',
                responses: { '200': { description: 'Dashboard stats' } },
            },
        },
        '/api/v1/audit/logs': {
            get: {
                tags: ['Audit Trail'],
                summary: 'Query immutable append-only audit trail logs',
                responses: { '200': { description: 'Audit logs' } },
            },
        },
    },
};
