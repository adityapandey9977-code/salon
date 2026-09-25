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
        '/metrics': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/overview': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/corporate-kpis': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/cashflow-trend': {
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
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/journals': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/commissions/tiers': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            put: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/staff/commissions': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/payroll/run': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/payroll/execute': {
            post: {
                summary: string;
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/finance/payroll/{id}/approve': {
            post: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/billing/royalties': {
            post: {
                summary: string;
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/billing/royalties/settlements': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/billing/royalties/{id}/pay': {
            post: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
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
//# sourceMappingURL=openapi.d.ts.map