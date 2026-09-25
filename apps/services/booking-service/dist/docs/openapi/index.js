export const bookingOpenApiSpec = {
    openapi: '3.0.3',
    info: {
        title: '  Salon SaaS - Booking Service API',
        version: '1.0.0',
        description: 'Production Booking & Scheduling Engine microservice owning appointments, line items, status lifecycles, availability slots, Redis locking, holds, waitlist, and walk-ins.',
    },
    servers: [{ url: 'http://localhost:4006', description: 'Local Booking Service' }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Appointment: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    tenantId: { type: 'string', format: 'uuid' },
                    branchId: { type: 'string', format: 'uuid' },
                    customerId: { type: 'string', format: 'uuid' },
                    bookingNumber: { type: 'string' },
                    source: {
                        type: 'string',
                        enum: ['ADMIN', 'BRANCH', 'ONLINE', 'CALL_CENTER', 'WALK_IN', 'CUSTOMER_APP'],
                    },
                    status: {
                        type: 'string',
                        enum: [
                            'HOLD',
                            'PENDING_CONFIRMATION',
                            'CONFIRMED',
                            'CHECKED_IN',
                            'IN_SERVICE',
                            'COMPLETED',
                            'CANCELLED',
                            'NO_SHOW',
                        ],
                    },
                    scheduledStartAt: { type: 'string', format: 'date-time' },
                    scheduledEndAt: { type: 'string', format: 'date-time' },
                    subtotalEstimate: { type: 'number' },
                    depositRequired: { type: 'boolean' },
                    depositAmount: { type: 'number' },
                    notes: { type: 'string', nullable: true },
                },
            },
        },
    },
    paths: {
        '/api/v1/appointments': {
            get: {
                summary: 'List appointments with filtering and pagination',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'List of appointments' } },
            },
            post: {
                summary: 'Create a new appointment',
                security: [{ bearerAuth: [] }],
                responses: { '201': { description: 'Appointment created successfully' } },
            },
        },
        '/api/v1/appointments/availability': {
            get: {
                summary: 'Check available time slots for service and staff',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Available slot list' } },
            },
        },
        '/api/v1/appointments/calendar': {
            get: {
                summary: 'Get branch appointment calendar by date',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Calendar appointments' } },
            },
        },
        '/api/v1/appointments/today-queue': {
            get: {
                summary: 'Get active queue for today (confirmed/checked-in/in-service)',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Today queue' } },
            },
        },
        '/api/v1/appointments/walkins': {
            get: {
                summary: 'Get today walk-ins',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'List walk-ins' } },
            },
            post: {
                summary: 'Create walk-in client appointment',
                security: [{ bearerAuth: [] }],
                responses: { '201': { description: 'Walk-in created' } },
            },
        },
        '/api/v1/appointments/{id}/confirm': {
            patch: {
                summary: 'Confirm appointment',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Appointment confirmed' } },
            },
        },
        '/api/v1/appointments/{id}/cancel': {
            patch: {
                summary: 'Cancel appointment with reason',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Appointment cancelled' } },
            },
        },
    },
};
