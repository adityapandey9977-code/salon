export declare const paymentOpenApiSpec: {
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
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
        schemas: {
            PaymentIntent: {
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
                    purpose: {
                        type: string;
                        enum: string[];
                    };
                    amount: {
                        type: string;
                    };
                    currency: {
                        type: string;
                        default: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    provider: {
                        type: string;
                    };
                    idempotencyKey: {
                        type: string;
                    };
                };
            };
        };
    };
    paths: {
        '/api/v1/payments/intents': {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/payments/verify-token': {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/payments/payment-link': {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/payments/{id}/refund': {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/payments/reconcile': {
            post: {
                summary: string;
                security: {
                    bearerAuth: never[];
                }[];
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