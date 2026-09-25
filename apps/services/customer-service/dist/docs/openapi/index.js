export const openApiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Customer Service API',
        description: '  Salon & Spa SaaS Customer CRM, Leads, Notes, Cautions, and Segmentation',
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
            CustomerSummary: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    tenantId: { type: 'string', format: 'uuid' },
                    customerCode: { type: 'string' },
                    displayName: { type: 'string' },
                    mobilePhone: { type: 'string' },
                    email: { type: 'string', nullable: true },
                    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'DORMANT', 'BLOCKED', 'ARCHIVED'] },
                    totalVisits: { type: 'integer' },
                    totalSpent: { type: 'number' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            Lead: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    tenantId: { type: 'string', format: 'uuid' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string', nullable: true },
                    mobilePhone: { type: 'string' },
                    status: { type: 'string', enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'BOOKING_PENDING', 'CONVERTED', 'LOST'] },
                },
            },
        },
    },
    paths: {
        '/customers': {
            get: {
                summary: 'List Customers',
                security: [{ BearerAuth: [] }],
                parameters: [
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string' } },
                    { name: 'branchId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                ],
                responses: {
                    200: { description: 'Customers list retrieved' },
                },
            },
            post: {
                summary: 'Create Customer',
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['firstName', 'mobilePhone'],
                                properties: {
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    mobilePhone: { type: 'string' },
                                    email: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Customer created' },
                },
            },
        },
    },
};
