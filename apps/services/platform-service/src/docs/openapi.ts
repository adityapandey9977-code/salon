export const platformOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: '  Platform Service API',
    version: '1.0.0',
    description: 'SaaS Control Plane API: Subscriptions, Custom Domains, Feature Flags, and Tenant Provisioning',
  },
  servers: [
    {
      url: 'http://localhost:3011',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Liveness probe',
        responses: {
          '200': { description: 'Service is alive' },
        },
      },
    },
    '/ready': {
      get: {
        summary: 'Readiness probe',
        responses: {
          '200': { description: 'Service is ready' },
          '503': { description: 'Service dependencies unavailable' },
        },
      },
    },
    '/metrics': {
      get: {
        summary: 'Prometheus metrics',
        responses: {
          '200': { description: 'Service metrics' },
        },
      },
    },
    '/api/v1/super-admin/plans': {
      get: {
        summary: 'List subscription plans',
        responses: {
          '200': { description: 'List of subscription plans' },
        },
      },
      post: {
        summary: 'Create subscription plan',
        responses: {
          '201': { description: 'Plan created' },
        },
      },
    },
    '/api/v1/super-admin/plans/{id}': {
      get: {
        summary: 'Get subscription plan by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Plan details' },
          '404': { description: 'Plan not found' },
        },
      },
      patch: {
        summary: 'Update subscription plan',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Plan updated' },
        },
      },
      delete: {
        summary: 'Delete subscription plan',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Plan deleted' },
        },
      },
    },
    '/api/v1/super-admin/feature-flags': {
      get: {
        summary: 'List feature definitions',
        responses: {
          '200': { description: 'List of feature definitions' },
        },
      },
      post: {
        summary: 'Create feature definition',
        responses: {
          '201': { description: 'Feature created' },
        },
      },
    },
    '/api/v1/super-admin/tenants': {
      get: {
        summary: 'List tenant provisioning requests',
        responses: {
          '200': { description: 'List of provisioning requests' },
        },
      },
      post: {
        summary: 'Provision a new salon tenant',
        responses: {
          '201': { description: 'Tenant provisioning completed' },
        },
      },
    },
    '/api/v1/super-admin/tenants/{id}': {
      get: {
        summary: 'Get full tenant platform details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Tenant platform profile' },
        },
      },
    },
    '/api/v1/super-admin/tenants/{id}/subscription': {
      patch: {
        summary: 'Update tenant subscription',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Subscription updated' },
        },
      },
    },
    '/internal/v1/tenants/{tenantId}/effective-entitlements': {
      get: {
        summary: 'Get effective entitlements for tenant (3-tier resolution)',
        parameters: [{ name: 'tenantId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Effective entitlements' },
        },
      },
    },
    '/internal/v1/domains/{hostname}/resolve': {
      get: {
        summary: 'Resolve custom domain to tenant ID',
        parameters: [{ name: 'hostname', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Resolved tenant domain metadata' },
        },
      },
    },
  },
};
