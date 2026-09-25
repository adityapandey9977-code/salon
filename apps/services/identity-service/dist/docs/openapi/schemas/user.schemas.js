export const userSchemas = {
    UserProfile: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            userType: { type: 'string', enum: ['PLATFORM', 'TENANT', 'CUSTOMER'] },
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            mobilePhone: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INVITED', 'SUSPENDED', 'LOCKED'] },
            isMfaRequired: { type: 'boolean' },
            isMfaEnabled: { type: 'boolean' },
            lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateUserRequest: {
        type: 'object',
        required: ['email', 'password', 'fullName'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8, format: 'password' },
            fullName: { type: 'string', minLength: 2 },
            mobilePhone: { type: 'string', nullable: true },
            userType: { type: 'string', enum: ['PLATFORM', 'TENANT', 'CUSTOMER'], default: 'TENANT' },
            roles: { type: 'array', items: { type: 'string', format: 'uuid' } },
        },
    },
    UpdateUserRequest: {
        type: 'object',
        properties: {
            fullName: { type: 'string', minLength: 2 },
            mobilePhone: { type: 'string', nullable: true },
            isMfaRequired: { type: 'boolean' },
            status: { type: 'string', enum: ['ACTIVE', 'INVITED', 'SUSPENDED', 'LOCKED'] },
        },
    },
    UserScope: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            scopeType: { type: 'string', enum: ['PLATFORM', 'TENANT', 'FRANCHISE', 'BRANCH', 'SELF'] },
            tenantId: { type: 'string', format: 'uuid', nullable: true },
            franchiseId: { type: 'string', format: 'uuid', nullable: true },
            branchId: { type: 'string', format: 'uuid', nullable: true },
        },
    },
    CreateUserScopeRequest: {
        type: 'object',
        required: ['scopeType'],
        properties: {
            scopeType: { type: 'string', enum: ['PLATFORM', 'TENANT', 'FRANCHISE', 'BRANCH', 'SELF'] },
            tenantId: { type: 'string', format: 'uuid', nullable: true },
            franchiseId: { type: 'string', format: 'uuid', nullable: true },
            branchId: { type: 'string', format: 'uuid', nullable: true },
        },
    },
};
