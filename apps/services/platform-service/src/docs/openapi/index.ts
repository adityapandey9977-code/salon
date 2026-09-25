export const platformOpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: '  Salon & Spa SaaS — Platform Service API',
    version: '1.0.0',
    description: 'SaaS Tenant Lifecycle, Plans, Subscriptions, Entitlements & White-Label Customization',
  },
  servers: [{ url: 'http://localhost:4011', description: 'Local Development' }],
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
    '/api/v1/platform/tenants': {
      get: {
        tags: ['SaaS Tenants'],
        summary: 'List all registered SaaS tenants (Super Admin)',
        responses: { '200': { description: 'List of tenants' } },
      },
    },
    '/api/v1/platform/provision': {
      post: {
        tags: ['SaaS Tenants'],
        summary: 'Provision a new salon business SaaS tenant',
        responses: { '201': { description: 'Tenant provisioned' } },
      },
    },
    '/api/v1/platform/subscriptions/plans': {
      get: {
        tags: ['Subscriptions'],
        summary: 'List public SaaS subscription pricing plans',
        responses: { '200': { description: 'List of subscription plans' } },
      },
    },
  },
};
