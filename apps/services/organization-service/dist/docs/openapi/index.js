export const organizationOpenApiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Organization Service API',
        description: 'Tenants, Brands, Franchise Partners, Branches & Resources Management',
        version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3002', description: 'Local Organization Service' }],
    paths: {
        '/api/v1/tenants': {
            get: {
                summary: 'List tenants',
                responses: { '200': { description: 'List of tenants' } },
            },
            post: {
                summary: 'Create tenant',
                responses: { '201': { description: 'Tenant created' } },
            },
        },
        '/api/v1/branches': {
            get: {
                summary: 'List branches',
                responses: { '200': { description: 'List of branches' } },
            },
            post: {
                summary: 'Create branch',
                responses: { '201': { description: 'Branch created' } },
            },
        },
    },
};
