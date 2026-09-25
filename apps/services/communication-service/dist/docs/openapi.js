export const communicationOpenApiSpec = {
    openapi: '3.0.0',
    info: {
        title: '  Communication & Telephony Service API',
        version: '1.0.0',
        description: 'Multi-channel Notifications (SMS, WhatsApp, Email, Push), Marketing Campaigns, and Telephony Integration',
    },
    servers: [
        {
            url: 'http://localhost:5010',
            description: 'Local Development Server',
        },
    ],
    paths: {
        '/health': {
            get: {
                summary: 'Liveness probe',
                responses: { '200': { description: 'Service is alive' } },
            },
        },
        '/ready': {
            get: {
                summary: 'Readiness probe',
                responses: { '200': { description: 'Service is ready' } },
            },
        },
        '/metrics': {
            get: {
                summary: 'Metrics',
                responses: { '200': { description: 'Prometheus metrics' } },
            },
        },
        '/api/v1/notifications': {
            get: {
                summary: 'List tenant notifications',
                responses: { '200': { description: 'Notification array' } },
            },
        },
        '/api/v1/notifications/{id}/resolve': {
            patch: {
                summary: 'Mark notification as resolved',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Notification resolved' } },
            },
        },
        '/api/v1/super-admin/notifications/logs': {
            get: {
                summary: 'Super admin global notification logs',
                responses: { '200': { description: 'Logs' } },
            },
        },
        '/api/v1/super-admin/notifications/simulate': {
            post: {
                summary: 'Simulate sending a notification across any channel',
                responses: { '201': { description: 'Dispatched simulated message' } },
            },
        },
        '/api/v1/marketing/campaigns': {
            get: {
                summary: 'List marketing campaigns',
                responses: { '200': { description: 'Campaigns array' } },
            },
            post: {
                summary: 'Create and schedule marketing campaign',
                responses: { '201': { description: 'Campaign created' } },
            },
        },
        '/api/v1/marketing/winback-offer': {
            post: {
                summary: 'Send automated winback offer campaign',
                responses: { '200': { description: 'Winback offer dispatched' } },
            },
        },
        '/api/v1/call-center/agents': {
            get: {
                summary: 'List call center agent profiles',
                responses: { '200': { description: 'Agents' } },
            },
        },
        '/api/v1/call-center/calls': {
            get: {
                summary: 'List telephony call logs',
                responses: { '200': { description: 'Call logs' } },
            },
        },
        '/api/v1/call-center/calls/{id}': {
            get: {
                summary: 'Get call log by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Call details' } },
            },
        },
        '/api/v1/call-center/calls/{id}/disposition': {
            post: {
                summary: 'Record call disposition (BOOKED, FOLLOW_UP, NO_ANSWER, etc.)',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Disposition recorded' } },
            },
        },
        '/api/v1/call-center/customer-context': {
            get: {
                summary: 'Get customer 360 context for incoming caller phone',
                parameters: [{ name: 'phone', in: 'query', required: false, schema: { type: 'string' } }],
                responses: { '200': { description: 'Customer context and appointment history' } },
            },
        },
    },
};
