export const openApiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Commerce Service API',
        description: '  Salon & Spa SaaS Services Catalogue, Packages, Memberships, POS, and Invoices',
        version: '1.0.0',
    },
    servers: [{ url: '/api/v1', description: 'API v1 Gateway' }],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ServiceMaster: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    tenantId: { type: 'string', format: 'uuid' },
                    code: { type: 'string' },
                    name: { type: 'string' },
                    durationMinutes: { type: 'integer' },
                    basePrice: { type: 'number' },
                    gstRate: { type: 'number' },
                    isActive: { type: 'boolean' },
                },
            },
            Invoice: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    invoiceNumber: { type: 'string' },
                    grandTotal: { type: 'number' },
                    paidAmount: { type: 'number' },
                    status: { type: 'string', enum: ['PENDING_PAYMENT', 'PAID', 'PARTIALLY_PAID', 'CANCELLED', 'REFUNDED'] },
                },
            },
        },
    },
    paths: {
        '/services': {
            get: {
                summary: 'List Services',
                security: [{ BearerAuth: [] }],
                parameters: [
                    { name: 'categoryId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                ],
                responses: { 200: { description: 'Services list retrieved' } },
            },
        },
        '/billing/checkout': {
            post: {
                summary: 'POS Checkout & Invoice Creation',
                security: [{ BearerAuth: [] }],
                responses: { 201: { description: 'Invoice created successfully' } },
            },
        },
    },
};
