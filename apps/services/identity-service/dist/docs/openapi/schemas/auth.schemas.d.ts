export declare const authSchemas: {
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
//# sourceMappingURL=auth.schemas.d.ts.map