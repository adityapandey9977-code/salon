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
            CustomerSummary: {
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
                    customerCode: {
                        type: string;
                    };
                    displayName: {
                        type: string;
                    };
                    mobilePhone: {
                        type: string;
                    };
                    email: {
                        type: string;
                        nullable: boolean;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    totalVisits: {
                        type: string;
                    };
                    totalSpent: {
                        type: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            Lead: {
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
                    firstName: {
                        type: string;
                    };
                    lastName: {
                        type: string;
                        nullable: boolean;
                    };
                    mobilePhone: {
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
        '/customers': {
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
                        format?: undefined;
                        default?: undefined;
                    };
                } | {
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
            post: {
                summary: string;
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    firstName: {
                                        type: string;
                                    };
                                    lastName: {
                                        type: string;
                                    };
                                    mobilePhone: {
                                        type: string;
                                    };
                                    email: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
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