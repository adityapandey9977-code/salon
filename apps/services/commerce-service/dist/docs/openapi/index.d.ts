export declare const openApiSpec: {
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
        schemas: {
            ServiceMaster: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    tenantId: {
                        type: string;
                        format: string;
                    };
                    code: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    durationMinutes: {
                        type: string;
                    };
                    basePrice: {
                        type: string;
                    };
                    gstRate: {
                        type: string;
                    };
                    isActive: {
                        type: string;
                    };
                };
            };
            Invoice: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    invoiceNumber: {
                        type: string;
                    };
                    grandTotal: {
                        type: string;
                    };
                    paidAmount: {
                        type: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                };
            };
        };
    };
    paths: {
        '/services': {
            get: {
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format?: undefined;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                        format?: undefined;
                    };
                })[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/billing/checkout': {
            post: {
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    201: {
                        description: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=index.d.ts.map