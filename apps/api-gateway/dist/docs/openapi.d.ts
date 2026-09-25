export declare const gatewayOpenApiSpec: {
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            BearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
    };
    paths: {
        '/health': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/ready': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/metrics': {
            get: {
                summary: string;
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=openapi.d.ts.map