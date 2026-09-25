export const paymentOpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: '  Salon SaaS - Payment Service API',
    version: '1.0.0',
    description:
      'Payment Lifecycle & Gateway orchestration microservice managing payment intents, transactions, deposit reservations, idempotency, webhook verifications, payment links, and refunds.',
  },
  servers: [{ url: 'http://localhost:4007', description: 'Local Payment Service' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      PaymentIntent: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          tenantId: { type: 'string', format: 'uuid' },
          purpose: {
            type: 'string',
            enum: [
              'BOOKING_DEPOSIT',
              'INVOICE_PAYMENT',
              'MEMBERSHIP',
              'PACKAGE',
              'WALLET_TOPUP',
              'FRANCHISE_SETTLEMENT',
              'OTHER',
            ],
          },
          amount: { type: 'number' },
          currency: { type: 'string', default: 'INR' },
          status: {
            type: 'string',
            enum: [
              'CREATED',
              'PENDING',
              'REQUIRES_ACTION',
              'AUTHORIZED',
              'CAPTURED',
              'FAILED',
              'CANCELLED',
              'EXPIRED',
            ],
          },
          provider: { type: 'string' },
          idempotencyKey: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/v1/payments/intents': {
      post: {
        summary: 'Create payment intent with idempotency protection',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Payment intent created' } },
      },
    },
    '/api/v1/payments/verify-token': {
      post: {
        summary: 'Verify payment token / signature and record successful transaction',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Transaction verified and captured' } },
      },
    },
    '/api/v1/payments/payment-link': {
      post: {
        summary: 'Generate secure customer payment link',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Payment link generated' } },
      },
    },
    '/api/v1/payments/{id}/refund': {
      post: {
        summary: 'Execute refund against captured transaction',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Refund processed successfully' } },
      },
    },
    '/api/v1/payments/reconcile': {
      post: {
        summary: 'Record gateway settlement reconciliation',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Settlement recorded' } },
      },
    },
  },
};
