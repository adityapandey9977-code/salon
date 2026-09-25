export const communicationOpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: '  Salon & Spa SaaS — Communication Service API',
    version: '1.0.0',
    description: 'Multi-Channel Notifications (WhatsApp, SMS, Email, Push), Templates, Campaigns & Telephony Integrations',
  },
  servers: [{ url: 'http://localhost:4010', description: 'Local Development' }],
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
    '/api/v1/notifications/templates': {
      get: {
        tags: ['Notifications'],
        summary: 'List message notification templates',
        responses: { '200': { description: 'List of templates' } },
      },
    },
    '/api/v1/notifications/logs': {
      get: {
        tags: ['Notifications'],
        summary: 'Get notification delivery logs',
        responses: { '200': { description: 'Notification logs' } },
      },
    },
    '/api/v1/notifications/send': {
      post: {
        tags: ['Notifications'],
        summary: 'Send WhatsApp/SMS/Email/Push notification',
        responses: { '201': { description: 'Notification queued/sent' } },
      },
    },
  },
};
