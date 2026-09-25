export declare const userSchemas: {
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
};
//# sourceMappingURL=user.schemas.d.ts.map