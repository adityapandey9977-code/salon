export declare const peopleOpenApiSpec: {
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
        contact: {
            name: string;
            email: string;
        };
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
                description: string;
            };
        };
        schemas: {
            StandardSuccessResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    data: {
                        type: string;
                    };
                    meta: {
                        type: string;
                        properties: {
                            correlationId: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                };
            };
            StandardPaginatedResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    data: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    meta: {
                        type: string;
                        properties: {
                            page: {
                                type: string;
                                example: number;
                            };
                            limit: {
                                type: string;
                                example: number;
                            };
                            total: {
                                type: string;
                                example: number;
                            };
                            totalPages: {
                                type: string;
                                example: number;
                            };
                            correlationId: {
                                type: string;
                            };
                        };
                    };
                };
            };
            StandardErrorResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    error: {
                        type: string;
                        properties: {
                            code: {
                                type: string;
                                example: string;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            details: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            requestId: {
                                type: string;
                            };
                        };
                    };
                };
            };
            EmploymentStatus: {
                type: string;
                enum: string[];
            };
            EmploymentType: {
                type: string;
                enum: string[];
            };
            SkillLevel: {
                type: string;
                enum: string[];
            };
            RosterStatus: {
                type: string;
                enum: string[];
            };
            AttendanceStatus: {
                type: string;
                enum: string[];
            };
            LeaveType: {
                type: string;
                enum: string[];
            };
            LeaveStatus: {
                type: string;
                enum: string[];
            };
            StaffProfile: {
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
                    employeeCode: {
                        type: string;
                        example: string;
                    };
                    identityUserId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    firstName: {
                        type: string;
                        example: string;
                    };
                    lastName: {
                        type: string;
                        example: string;
                    };
                    displayName: {
                        type: string;
                        example: string;
                    };
                    email: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    mobilePhone: {
                        type: string;
                        example: string;
                    };
                    dateOfBirth: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    gender: {
                        type: string;
                        nullable: boolean;
                    };
                    employmentStatus: {
                        $ref: string;
                    };
                    employmentType: {
                        $ref: string;
                    };
                    joiningDate: {
                        type: string;
                        format: string;
                    };
                    primaryBranchId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    jobTitle: {
                        type: string;
                        example: string;
                    };
                    department: {
                        type: string;
                        example: string;
                        nullable: boolean;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            AttendanceRecord: {
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
                    employeeId: {
                        type: string;
                        format: string;
                    };
                    branchId: {
                        type: string;
                        format: string;
                    };
                    attendanceDate: {
                        type: string;
                        format: string;
                    };
                    clockInAt: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    clockOutAt: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    status: {
                        $ref: string;
                    };
                    lateMinutes: {
                        type: string;
                        example: number;
                    };
                    earlyLeaveMinutes: {
                        type: string;
                        example: number;
                    };
                    overtimeMinutes: {
                        type: string;
                        example: number;
                    };
                    clockInMethod: {
                        type: string;
                        example: string;
                    };
                };
            };
            LeaveRequest: {
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
                    employeeId: {
                        type: string;
                        format: string;
                    };
                    leaveType: {
                        $ref: string;
                    };
                    startDate: {
                        type: string;
                        format: string;
                    };
                    endDate: {
                        type: string;
                        format: string;
                    };
                    reason: {
                        type: string;
                    };
                    status: {
                        $ref: string;
                    };
                    requestedAt: {
                        type: string;
                        format: string;
                    };
                    approvedAt: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    reviewNote: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
        };
    };
    security: {
        bearerAuth: never[];
    }[];
    paths: {
        '/staff': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                        format?: undefined;
                        $ref?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                        default?: undefined;
                        $ref?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        $ref: string;
                        type?: undefined;
                        default?: undefined;
                        format?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default?: undefined;
                        format?: undefined;
                        $ref?: undefined;
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
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    employeeCode: {
                                        type: string;
                                        example: string;
                                    };
                                    firstName: {
                                        type: string;
                                        example: string;
                                    };
                                    lastName: {
                                        type: string;
                                        example: string;
                                    };
                                    displayName: {
                                        type: string;
                                        example: string;
                                    };
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    mobilePhone: {
                                        type: string;
                                        example: string;
                                    };
                                    jobTitle: {
                                        type: string;
                                        example: string;
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
                    409: {
                        description: string;
                    };
                };
            };
        };
        '/staff/me': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
        };
        '/staff/{id}': {
            get: {
                summary: string;
                tags: string[];
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
                    200: {
                        description: string;
                    };
                    404: {
                        description: string;
                    };
                };
            };
            patch: {
                summary: string;
                tags: string[];
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
                    200: {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                tags: string[];
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
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/staff/clock-in': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    branchId: {
                                        type: string;
                                        format: string;
                                    };
                                    method: {
                                        type: string;
                                        enum: string[];
                                        default: string;
                                    };
                                    latitude: {
                                        type: string;
                                    };
                                    longitude: {
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
                    409: {
                        description: string;
                    };
                };
            };
        };
        '/staff/clock-out': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    branchId: {
                                        type: string;
                                        format: string;
                                    };
                                    method: {
                                        type: string;
                                        default: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                    409: {
                        description: string;
                    };
                };
            };
        };
        '/staff/leave': {
            get: {
                summary: string;
                tags: string[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    leaveType: {
                                        $ref: string;
                                    };
                                    startDate: {
                                        type: string;
                                        format: string;
                                    };
                                    endDate: {
                                        type: string;
                                        format: string;
                                    };
                                    reason: {
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
        '/staff/leave/{id}/approve': {
            post: {
                summary: string;
                description: string;
                tags: string[];
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
                    200: {
                        description: string;
                    };
                    409: {
                        description: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=index.d.ts.map