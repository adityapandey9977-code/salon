export const gatewayOpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: '  Salon SaaS — Unified API Gateway',
    description:
      'Central ingress proxy, security enforcement, token authority routing, and rate limiting for Salon & Spa microservices.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'API Gateway',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Gateway liveness check',
        responses: { 200: { description: 'Gateway is alive' } },
      },
    },
    '/ready': {
      get: {
        summary: 'Gateway readiness check',
        responses: { 200: { description: 'Gateway dependencies are ready' } },
      },
    },
    '/metrics': {
      get: {
        summary: 'Prometheus metrics',
        responses: { 200: { description: 'Prometheus metrics text format' } },
      },
    },
  },
};
