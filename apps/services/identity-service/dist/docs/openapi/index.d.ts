export declare const identityOpenApiSpec: {
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
                description: string;
            };
            InternalServiceAuth: {
                type: string;
                in: string;
                name: string;
                description: string;
            };
        };
        schemas: {
            Role: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    code: {
                        type: string;
                    };
                    description: {
                        type: string;
                        nullable: boolean;
                    };
                    isSystem: {
                        type: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            Permission: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    code: {
                        type: string;
                    };
                    module: {
                        type: string;
                    };
                    description: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
            CreateRoleRequest: {
                type: string;
                required: string[];
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                    };
                    code: {
                        type: string;
                        minLength: number;
                    };
                    description: {
                        type: string;
                        nullable: boolean;
                    };
                    permissions: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
            };
            AssignRolePermissionsRequest: {
                type: string;
                required: string[];
                properties: {
                    permissions: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
            };
            AssignUserRolesRequest: {
                type: string;
                required: string[];
                properties: {
                    roleIds: {
                        type: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
            UserProfile: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    userType: {
                        type: string;
                        enum: string[];
                    };
                    fullName: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    mobilePhone: {
                        type: string;
                        nullable: boolean;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                    isMfaRequired: {
                        type: string;
                    };
                    isMfaEnabled: {
                        type: string;
                    };
                    lastLoginAt: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                    };
                };
            };
            CreateUserRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                    };
                    password: {
                        type: string;
                        minLength: number;
                        format: string;
                    };
                    fullName: {
                        type: string;
                        minLength: number;
                    };
                    mobilePhone: {
                        type: string;
                        nullable: boolean;
                    };
                    userType: {
                        type: string;
                        enum: string[];
                        default: string;
                    };
                    roles: {
                        type: string;
                        items: {
                            type: string;
                            format: string;
                        };
                    };
                };
            };
            UpdateUserRequest: {
                type: string;
                properties: {
                    fullName: {
                        type: string;
                        minLength: number;
                    };
                    mobilePhone: {
                        type: string;
                        nullable: boolean;
                    };
                    isMfaRequired: {
                        type: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                    };
                };
            };
            UserScope: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                    };
                    scopeType: {
                        type: string;
                        enum: string[];
                    };
                    tenantId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    franchiseId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    branchId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                };
            };
            CreateUserScopeRequest: {
                type: string;
                required: string[];
                properties: {
                    scopeType: {
                        type: string;
                        enum: string[];
                    };
                    tenantId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    franchiseId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                    branchId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                };
            };
            SuperAdminLoginRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        format: string;
                        example: string;
                    };
                };
            };
            SuperAdminLoginResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    data: {
                        type: string;
                        properties: {
                            requiresMfa: {
                                type: string;
                                example: boolean;
                            };
                            accessToken: {
                                type: string;
                            };
                            refreshToken: {
                                type: string;
                            };
                            expiresIn: {
                                type: string;
                                example: number;
                            };
                            principal: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        example: string;
                                    };
                                    userId: {
                                        type: string;
                                        format: string;
                                    };
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    fullName: {
                                        type: string;
                                    };
                                    role: {
                                        type: string;
                                        example: string;
                                    };
                                    scopeType: {
                                        type: string;
                                        example: string;
                                    };
                                    permissions: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    timestamp: {
                        type: string;
                        format: string;
                    };
                };
            };
            TenantLoginRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    tenantCode: {
                        type: string;
                        example: string;
                    };
                };
            };
            TenantLoginResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    data: {
                        type: string;
                        properties: {
                            requiresMfa: {
                                type: string;
                                example: boolean;
                            };
                            accessToken: {
                                type: string;
                            };
                            refreshToken: {
                                type: string;
                            };
                            expiresIn: {
                                type: string;
                                example: number;
                            };
                            principal: {
                                type: string;
                                properties: {
                                    type: {
                                        type: string;
                                        example: string;
                                    };
                                    tenantId: {
                                        type: string;
                                        format: string;
                                    };
                                    credentialId: {
                                        type: string;
                                        format: string;
                                    };
                                    loginEmail: {
                                        type: string;
                                        format: string;
                                    };
                                    salonName: {
                                        type: string;
                                    };
                                    tenantCode: {
                                        type: string;
                                    };
                                    role: {
                                        type: string;
                                        example: string;
                                    };
                                    scopeType: {
                                        type: string;
                                        example: string;
                                    };
                                    permissions: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    timestamp: {
                        type: string;
                        format: string;
                    };
                };
            };
            LoginRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        format: string;
                        example: string;
                    };
                    tenantId: {
                        type: string;
                        format: string;
                        nullable: boolean;
                    };
                };
            };
            LoginResponse: {
                type: string;
                properties: {
                    success: {
                        type: string;
                        example: boolean;
                    };
                    data: {
                        type: string;
                        properties: {
                            requiresMfa: {
                                type: string;
                                example: boolean;
                            };
                            mfaChallengeId: {
                                type: string;
                                nullable: boolean;
                            };
                            accessToken: {
                                type: string;
                                example: string;
                            };
                            refreshToken: {
                                type: string;
                                example: string;
                            };
                            expiresIn: {
                                type: string;
                                example: number;
                            };
                            user: {
                                type: string;
                                properties: {
                                    id: {
                                        type: string;
                                        format: string;
                                    };
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    fullName: {
                                        type: string;
                                    };
                                    userType: {
                                        type: string;
                                        enum: string[];
                                    };
                                    status: {
                                        type: string;
                                        enum: string[];
                                    };
                                    isMfaEnabled: {
                                        type: string;
                                    };
                                    roles: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                    };
                                    permissions: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                    };
                                    tenantId: {
                                        type: string;
                                        format: string;
                                        nullable: boolean;
                                    };
                                    franchiseId: {
                                        type: string;
                                        format: string;
                                        nullable: boolean;
                                    };
                                    branchIds: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    timestamp: {
                        type: string;
                        format: string;
                    };
                };
            };
            RefreshTokenRequest: {
                type: string;
                required: string[];
                properties: {
                    refreshToken: {
                        type: string;
                        example: string;
                    };
                };
            };
            MfaVerifyRequest: {
                type: string;
                required: string[];
                properties: {
                    challengeId: {
                        type: string;
                        format: string;
                    };
                    code: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        example: string;
                    };
                };
            };
            ForgotPasswordRequest: {
                type: string;
                required: string[];
                properties: {
                    email: {
                        type: string;
                        format: string;
                        example: string;
                    };
                };
            };
            ResetPasswordRequest: {
                type: string;
                required: string[];
                properties: {
                    token: {
                        type: string;
                    };
                    newPassword: {
                        type: string;
                        minLength: number;
                        format: string;
                    };
                };
            };
        };
    };
    paths: {
        '/api/v1/auth/login': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: string;
                                };
                            };
                        };
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/refresh-token': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/logout': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/me': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/mfa/verify': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/forgot-password': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/reset-password': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/auth/sessions': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/users': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default: number;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        default?: undefined;
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
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
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
        '/api/v1/users/{id}': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
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
            patch: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/users/{id}/suspend': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
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
        '/api/v1/users/{id}/activate': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
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
        '/api/v1/users/{id}/effective-access': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
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
        '/api/v1/users/{id}/scopes': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
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
            post: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
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
        '/api/v1/roles': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
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
        '/api/v1/roles/{id}/permissions': {
            put: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/api/v1/permissions': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    BearerAuth: never[];
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                };
            };
        };
        '/internal/v1/auth/context': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    InternalServiceAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    200: {
                        description: string;
                    };
                    401: {
                        description: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=index.d.ts.map