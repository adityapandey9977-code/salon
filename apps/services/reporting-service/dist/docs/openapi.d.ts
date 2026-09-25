export declare const reportingOpenApiSpec: {
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
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/ready': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/metrics': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'text/plain': {
                                schema: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        '/api/v1/dashboard/metrics': {
            get: {
                summary: string;
                tags: string[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: string;
                        format?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                        default?: undefined;
                    };
                })[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/dashboard/charts': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum: string[];
                        default: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/dashboard/occupancy': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/dashboard/branch-kpis': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/dashboard/call-center-kpis': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/branches/analytics/comparison': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/inventory/dashboard-kpis': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/tenant/franchise/dashboard-kpis': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/reports/executive-summary': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/reports/revenue': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/reports/export': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    reportType: {
                                        type: string;
                                        default: string;
                                    };
                                    parameters: {
                                        type: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/audit': {
            get: {
                summary: string;
                tags: string[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                })[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/super-admin/dashboard/kpis': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=openapi.d.ts.map