export declare const financeOpenApiSpec: {
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
        '/api/v1/finance/accounts': {
            get: {
                tags: string[];
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/commissions': {
            get: {
                tags: string[];
                summary: string;
                parameters: ({
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                } | {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format?: undefined;
                    };
                })[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/commissions/calculate': {
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
    };
};
//# sourceMappingURL=index.d.ts.map