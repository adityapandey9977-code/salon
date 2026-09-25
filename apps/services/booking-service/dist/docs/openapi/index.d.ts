export declare const bookingOpenApiSpec: {
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
            Appointment: {
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
                    branchId: {
                        type: string;
                        format: string;
                    };
                    customerId: {
                        type: string;
                        format: string;
                    };
                    bookingNumber: {
                        type: string;
                    };
                    source: {
                        type: string;
                        enum: string[];
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    scheduledStartAt: {
                        type: string;
                        format: string;
                    };
                    scheduledEndAt: {
                        type: string;
                        format: string;
                    };
                    subtotalEstimate: {
                        type: string;
                    };
                    depositRequired: {
                        type: string;
                    };
                    depositAmount: {
                        type: string;
                    };
                    notes: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
        };
    };
    paths: {
        '/api/v1/appointments': {
            get: {
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
        '/api/v1/appointments/availability': {
            get: {
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
        '/api/v1/appointments/calendar': {
            get: {
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
        '/api/v1/appointments/today-queue': {
            get: {
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
        '/api/v1/appointments/walkins': {
            get: {
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
        '/api/v1/appointments/{id}/confirm': {
            patch: {
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
        '/api/v1/appointments/{id}/cancel': {
            patch: {
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