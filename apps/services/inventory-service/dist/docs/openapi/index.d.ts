export declare const inventoryOpenApiSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    paths: {
        '/health': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/ready': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/inventory/skus': {
            get: {
                tags: string[];
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                tags: string[];
                summary: string;
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/inventory/branches/{branchId}/stock': {
            get: {
                tags: string[];
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/inventory/adjustments': {
            post: {
                tags: string[];
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=index.d.ts.map