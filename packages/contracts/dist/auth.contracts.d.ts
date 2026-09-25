import { z } from 'zod';
export declare const AuthPrincipalTypeEnum: z.ZodEnum<["USER", "TENANT"]>;
export type AuthPrincipalType = z.infer<typeof AuthPrincipalTypeEnum>;
export declare const TenantCredentialStatusEnum: z.ZodEnum<["INVITED", "ACTIVE", "SUSPENDED", "LOCKED", "DISABLED"]>;
export type TenantCredentialStatus = z.infer<typeof TenantCredentialStatusEnum>;
export declare const UserTypeEnum: z.ZodEnum<["PLATFORM", "TENANT", "CUSTOMER"]>;
export type UserType = z.infer<typeof UserTypeEnum>;
export declare const UserStatusEnum: z.ZodEnum<["INVITED", "ACTIVE", "SUSPENDED", "LOCKED"]>;
export type UserStatus = z.infer<typeof UserStatusEnum>;
export declare const ScopeTypeEnum: z.ZodEnum<["PLATFORM", "TENANT", "FRANCHISE", "BRANCH", "SELF"]>;
export type ScopeType = z.infer<typeof ScopeTypeEnum>;
export declare const MfaTypeEnum: z.ZodEnum<["TOTP", "RECOVERY_CODE", "HARDWARE_KEY"]>;
export type MfaType = z.infer<typeof MfaTypeEnum>;
export declare const SessionStatusEnum: z.ZodEnum<["ACTIVE", "REVOKED", "EXPIRED"]>;
export type SessionStatus = z.infer<typeof SessionStatusEnum>;
export declare const SuperAdminLoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SuperAdminLoginRequest = z.infer<typeof SuperAdminLoginRequestSchema>;
export declare const UserPrincipalSchema: z.ZodObject<{
    type: z.ZodLiteral<"USER">;
    userId: z.ZodString;
    email: z.ZodString;
    fullName: z.ZodString;
    userType: z.ZodOptional<z.ZodEnum<["PLATFORM", "TENANT", "CUSTOMER"]>>;
    status: z.ZodEnum<["INVITED", "ACTIVE", "SUSPENDED", "LOCKED"]>;
    isMfaEnabled: z.ZodBoolean;
    role: z.ZodString;
    roles: z.ZodArray<z.ZodString, "many">;
    permissions: z.ZodArray<z.ZodString, "many">;
    scopeType: z.ZodEnum<["PLATFORM", "TENANT", "FRANCHISE", "BRANCH", "SELF"]>;
    tenantId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    franchiseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    type: "USER";
    status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
    email: string;
    userId: string;
    fullName: string;
    isMfaEnabled: boolean;
    role: string;
    roles: string[];
    permissions: string[];
    scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
    branchIds: string[];
    userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
    tenantId?: string | null | undefined;
    franchiseId?: string | null | undefined;
}, {
    type: "USER";
    status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
    email: string;
    userId: string;
    fullName: string;
    isMfaEnabled: boolean;
    role: string;
    roles: string[];
    permissions: string[];
    scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
    branchIds: string[];
    userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
    tenantId?: string | null | undefined;
    franchiseId?: string | null | undefined;
}>;
export type UserPrincipal = z.infer<typeof UserPrincipalSchema>;
export declare const SuperAdminLoginResponseSchema: z.ZodObject<{
    requiresMfa: z.ZodDefault<z.ZodBoolean>;
    mfaChallengeId: z.ZodOptional<z.ZodString>;
    accessToken: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodOptional<z.ZodString>;
    expiresIn: z.ZodOptional<z.ZodNumber>;
    principal: z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"USER">;
        userId: z.ZodString;
        email: z.ZodString;
        fullName: z.ZodString;
        userType: z.ZodOptional<z.ZodEnum<["PLATFORM", "TENANT", "CUSTOMER"]>>;
        status: z.ZodEnum<["INVITED", "ACTIVE", "SUSPENDED", "LOCKED"]>;
        isMfaEnabled: z.ZodBoolean;
        role: z.ZodString;
        roles: z.ZodArray<z.ZodString, "many">;
        permissions: z.ZodArray<z.ZodString, "many">;
        scopeType: z.ZodEnum<["PLATFORM", "TENANT", "FRANCHISE", "BRANCH", "SELF"]>;
        tenantId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        franchiseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        branchIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "USER";
        status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
        email: string;
        userId: string;
        fullName: string;
        isMfaEnabled: boolean;
        role: string;
        roles: string[];
        permissions: string[];
        scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
        branchIds: string[];
        userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
        tenantId?: string | null | undefined;
        franchiseId?: string | null | undefined;
    }, {
        type: "USER";
        status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
        email: string;
        userId: string;
        fullName: string;
        isMfaEnabled: boolean;
        role: string;
        roles: string[];
        permissions: string[];
        scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
        branchIds: string[];
        userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
        tenantId?: string | null | undefined;
        franchiseId?: string | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    requiresMfa: boolean;
    mfaChallengeId?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    expiresIn?: number | undefined;
    principal?: {
        type: "USER";
        status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
        email: string;
        userId: string;
        fullName: string;
        isMfaEnabled: boolean;
        role: string;
        roles: string[];
        permissions: string[];
        scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
        branchIds: string[];
        userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
        tenantId?: string | null | undefined;
        franchiseId?: string | null | undefined;
    } | undefined;
}, {
    requiresMfa?: boolean | undefined;
    mfaChallengeId?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    expiresIn?: number | undefined;
    principal?: {
        type: "USER";
        status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
        email: string;
        userId: string;
        fullName: string;
        isMfaEnabled: boolean;
        role: string;
        roles: string[];
        permissions: string[];
        scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
        branchIds: string[];
        userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
        tenantId?: string | null | undefined;
        franchiseId?: string | null | undefined;
    } | undefined;
}>;
export type SuperAdminLoginResponse = z.infer<typeof SuperAdminLoginResponseSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    tenantId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    tenantId?: string | null | undefined;
}, {
    email: string;
    password: string;
    tenantId?: string | null | undefined;
}>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export declare const LoginResponseSchema: z.ZodObject<{
    requiresMfa: z.ZodDefault<z.ZodBoolean>;
    mfaChallengeId: z.ZodOptional<z.ZodString>;
    accessToken: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodOptional<z.ZodString>;
    expiresIn: z.ZodOptional<z.ZodNumber>;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        fullName: z.ZodString;
        userType: z.ZodEnum<["PLATFORM", "TENANT", "CUSTOMER"]>;
        status: z.ZodEnum<["INVITED", "ACTIVE", "SUSPENDED", "LOCKED"]>;
        isMfaEnabled: z.ZodBoolean;
        role: z.ZodOptional<z.ZodString>;
        roles: z.ZodArray<z.ZodString, "many">;
        permissions: z.ZodArray<z.ZodString, "many">;
        mobilePhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        tenantId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        franchiseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        branchIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
        email: string;
        fullName: string;
        userType: "TENANT" | "PLATFORM" | "CUSTOMER";
        isMfaEnabled: boolean;
        roles: string[];
        permissions: string[];
        branchIds: string[];
        id: string;
        role?: string | undefined;
        tenantId?: string | null | undefined;
        franchiseId?: string | null | undefined;
        mobilePhone?: string | null | undefined;
    }, {
        status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
        email: string;
        fullName: string;
        userType: "TENANT" | "PLATFORM" | "CUSTOMER";
        isMfaEnabled: boolean;
        roles: string[];
        permissions: string[];
        branchIds: string[];
        id: string;
        role?: string | undefined;
        tenantId?: string | null | undefined;
        franchiseId?: string | null | undefined;
        mobilePhone?: string | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    requiresMfa: boolean;
    mfaChallengeId?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    expiresIn?: number | undefined;
    user?: {
        status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
        email: string;
        fullName: string;
        userType: "TENANT" | "PLATFORM" | "CUSTOMER";
        isMfaEnabled: boolean;
        roles: string[];
        permissions: string[];
        branchIds: string[];
        id: string;
        role?: string | undefined;
        tenantId?: string | null | undefined;
        franchiseId?: string | null | undefined;
        mobilePhone?: string | null | undefined;
    } | undefined;
}, {
    requiresMfa?: boolean | undefined;
    mfaChallengeId?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    expiresIn?: number | undefined;
    user?: {
        status: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED";
        email: string;
        fullName: string;
        userType: "TENANT" | "PLATFORM" | "CUSTOMER";
        isMfaEnabled: boolean;
        roles: string[];
        permissions: string[];
        branchIds: string[];
        id: string;
        role?: string | undefined;
        tenantId?: string | null | undefined;
        franchiseId?: string | null | undefined;
        mobilePhone?: string | null | undefined;
    } | undefined;
}>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export declare const TenantLoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    tenantCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    tenantCode?: string | undefined;
}, {
    email: string;
    password: string;
    tenantCode?: string | undefined;
}>;
export type TenantLoginRequest = z.infer<typeof TenantLoginRequestSchema>;
export declare const TenantPrincipalSchema: z.ZodObject<{
    type: z.ZodLiteral<"TENANT">;
    tenantId: z.ZodString;
    credentialId: z.ZodOptional<z.ZodString>;
    loginEmail: z.ZodString;
    salonName: z.ZodOptional<z.ZodString>;
    tenantCode: z.ZodOptional<z.ZodString>;
    status: z.ZodString;
    role: z.ZodLiteral<"TENANT_ADMIN">;
    scopeType: z.ZodLiteral<"TENANT">;
    permissions: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    type: "TENANT";
    status: string;
    role: "TENANT_ADMIN";
    permissions: string[];
    scopeType: "TENANT";
    tenantId: string;
    loginEmail: string;
    tenantCode?: string | undefined;
    credentialId?: string | undefined;
    salonName?: string | undefined;
}, {
    type: "TENANT";
    status: string;
    role: "TENANT_ADMIN";
    permissions: string[];
    scopeType: "TENANT";
    tenantId: string;
    loginEmail: string;
    tenantCode?: string | undefined;
    credentialId?: string | undefined;
    salonName?: string | undefined;
}>;
export type TenantPrincipal = z.infer<typeof TenantPrincipalSchema>;
export declare const TenantLoginResponseSchema: z.ZodObject<{
    requiresMfa: z.ZodDefault<z.ZodBoolean>;
    mfaChallengeId: z.ZodOptional<z.ZodString>;
    accessToken: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodOptional<z.ZodString>;
    expiresIn: z.ZodOptional<z.ZodNumber>;
    principal: z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"TENANT">;
        tenantId: z.ZodString;
        credentialId: z.ZodOptional<z.ZodString>;
        loginEmail: z.ZodString;
        salonName: z.ZodOptional<z.ZodString>;
        tenantCode: z.ZodOptional<z.ZodString>;
        status: z.ZodString;
        role: z.ZodLiteral<"TENANT_ADMIN">;
        scopeType: z.ZodLiteral<"TENANT">;
        permissions: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "TENANT";
        status: string;
        role: "TENANT_ADMIN";
        permissions: string[];
        scopeType: "TENANT";
        tenantId: string;
        loginEmail: string;
        tenantCode?: string | undefined;
        credentialId?: string | undefined;
        salonName?: string | undefined;
    }, {
        type: "TENANT";
        status: string;
        role: "TENANT_ADMIN";
        permissions: string[];
        scopeType: "TENANT";
        tenantId: string;
        loginEmail: string;
        tenantCode?: string | undefined;
        credentialId?: string | undefined;
        salonName?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    requiresMfa: boolean;
    mfaChallengeId?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    expiresIn?: number | undefined;
    principal?: {
        type: "TENANT";
        status: string;
        role: "TENANT_ADMIN";
        permissions: string[];
        scopeType: "TENANT";
        tenantId: string;
        loginEmail: string;
        tenantCode?: string | undefined;
        credentialId?: string | undefined;
        salonName?: string | undefined;
    } | undefined;
}, {
    requiresMfa?: boolean | undefined;
    mfaChallengeId?: string | undefined;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    expiresIn?: number | undefined;
    principal?: {
        type: "TENANT";
        status: string;
        role: "TENANT_ADMIN";
        permissions: string[];
        scopeType: "TENANT";
        tenantId: string;
        loginEmail: string;
        tenantCode?: string | undefined;
        credentialId?: string | undefined;
        salonName?: string | undefined;
    } | undefined;
}>;
export type TenantLoginResponse = z.infer<typeof TenantLoginResponseSchema>;
export declare const CreateTenantCredentialRequestSchema: z.ZodObject<{
    tenantId: z.ZodString;
    loginEmail: z.ZodString;
    mobilePhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    initialPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    loginEmail: string;
    initialPassword: string;
    mobilePhone?: string | null | undefined;
}, {
    tenantId: string;
    loginEmail: string;
    initialPassword: string;
    mobilePhone?: string | null | undefined;
}>;
export type CreateTenantCredentialRequest = z.infer<typeof CreateTenantCredentialRequestSchema>;
export declare const TenantForgotPasswordRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type TenantForgotPasswordRequest = z.infer<typeof TenantForgotPasswordRequestSchema>;
export declare const TenantResetPasswordRequestSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    newPassword: string;
}, {
    token: string;
    newPassword: string;
}>;
export type TenantResetPasswordRequest = z.infer<typeof TenantResetPasswordRequestSchema>;
export declare const RefreshTokenRequestSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export declare const RefreshTokenResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    expiresIn: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}, {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export declare const ForgotPasswordRequestSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export declare const ResetPasswordRequestSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    newPassword: string;
}, {
    token: string;
    newPassword: string;
}>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export declare const MfaVerifyRequestSchema: z.ZodObject<{
    challengeId: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    challengeId: string;
}, {
    code: string;
    challengeId: string;
}>;
export type MfaVerifyRequest = z.infer<typeof MfaVerifyRequestSchema>;
export declare const CreateUserRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    fullName: z.ZodString;
    mobilePhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    userType: z.ZodDefault<z.ZodEnum<["PLATFORM", "TENANT", "CUSTOMER"]>>;
    tenantId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    branchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    roles: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    fullName: string;
    userType: "TENANT" | "PLATFORM" | "CUSTOMER";
    roles: string[];
    branchIds: string[];
    tenantId?: string | null | undefined;
    mobilePhone?: string | null | undefined;
}, {
    email: string;
    password: string;
    fullName: string;
    userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
    roles?: string[] | undefined;
    tenantId?: string | null | undefined;
    branchIds?: string[] | undefined;
    mobilePhone?: string | null | undefined;
}>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export declare const UpdateUserRequestSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    mobilePhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isMfaRequired: z.ZodOptional<z.ZodBoolean>;
    isMfaEnabled: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["INVITED", "ACTIVE", "SUSPENDED", "LOCKED"]>>;
    role: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status?: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED" | undefined;
    email?: string | undefined;
    fullName?: string | undefined;
    isMfaEnabled?: boolean | undefined;
    role?: string | undefined;
    roles?: string[] | undefined;
    mobilePhone?: string | null | undefined;
    isMfaRequired?: boolean | undefined;
}, {
    status?: "INVITED" | "ACTIVE" | "SUSPENDED" | "LOCKED" | undefined;
    email?: string | undefined;
    fullName?: string | undefined;
    isMfaEnabled?: boolean | undefined;
    role?: string | undefined;
    roles?: string[] | undefined;
    mobilePhone?: string | null | undefined;
    isMfaRequired?: boolean | undefined;
}>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export declare const CreateRoleRequestSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    code: string;
    permissions: string[];
    name: string;
    description?: string | null | undefined;
}, {
    code: string;
    name: string;
    permissions?: string[] | undefined;
    description?: string | null | undefined;
}>;
export type CreateRoleRequest = z.infer<typeof CreateRoleRequestSchema>;
export declare const UpdateRoleRequestSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
}>;
export type UpdateRoleRequest = z.infer<typeof UpdateRoleRequestSchema>;
export declare const AssignRolePermissionsRequestSchema: z.ZodObject<{
    permissions: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    permissions: string[];
}, {
    permissions: string[];
}>;
export type AssignRolePermissionsRequest = z.infer<typeof AssignRolePermissionsRequestSchema>;
export declare const AssignUserRolesRequestSchema: z.ZodObject<{
    roleIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    roleIds: string[];
}, {
    roleIds: string[];
}>;
export type AssignUserRolesRequest = z.infer<typeof AssignUserRolesRequestSchema>;
export declare const CreateUserScopeRequestSchema: z.ZodObject<{
    scopeType: z.ZodEnum<["PLATFORM", "TENANT", "FRANCHISE", "BRANCH", "SELF"]>;
    tenantId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    franchiseId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    branchId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
    tenantId?: string | null | undefined;
    franchiseId?: string | null | undefined;
    branchId?: string | null | undefined;
}, {
    scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
    tenantId?: string | null | undefined;
    franchiseId?: string | null | undefined;
    branchId?: string | null | undefined;
}>;
export type CreateUserScopeRequest = z.infer<typeof CreateUserScopeRequestSchema>;
export declare const InternalAuthContextResponseSchema: z.ZodObject<{
    principalType: z.ZodDefault<z.ZodEnum<["USER", "TENANT"]>>;
    userId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tenantCredentialId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sessionId: z.ZodString;
    userType: z.ZodOptional<z.ZodEnum<["PLATFORM", "TENANT", "CUSTOMER"]>>;
    status: z.ZodString;
    role: z.ZodString;
    roles: z.ZodArray<z.ZodString, "many">;
    permissions: z.ZodArray<z.ZodString, "many">;
    scopeType: z.ZodEnum<["PLATFORM", "TENANT", "FRANCHISE", "BRANCH", "SELF"]>;
    tenantId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    franchiseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    scopes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        scopeType: z.ZodEnum<["PLATFORM", "TENANT", "FRANCHISE", "BRANCH", "SELF"]>;
        tenantId: z.ZodNullable<z.ZodString>;
        franchiseId: z.ZodNullable<z.ZodString>;
        branchId: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
        tenantId: string | null;
        franchiseId: string | null;
        id: string;
        branchId: string | null;
    }, {
        scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
        tenantId: string | null;
        franchiseId: string | null;
        id: string;
        branchId: string | null;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: string;
    role: string;
    roles: string[];
    permissions: string[];
    scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
    branchIds: string[];
    principalType: "USER" | "TENANT";
    sessionId: string;
    scopes: {
        scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
        tenantId: string | null;
        franchiseId: string | null;
        id: string;
        branchId: string | null;
    }[];
    userId?: string | null | undefined;
    userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
    tenantId?: string | null | undefined;
    franchiseId?: string | null | undefined;
    tenantCredentialId?: string | null | undefined;
}, {
    status: string;
    role: string;
    roles: string[];
    permissions: string[];
    scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
    sessionId: string;
    userId?: string | null | undefined;
    userType?: "TENANT" | "PLATFORM" | "CUSTOMER" | undefined;
    tenantId?: string | null | undefined;
    franchiseId?: string | null | undefined;
    branchIds?: string[] | undefined;
    principalType?: "USER" | "TENANT" | undefined;
    tenantCredentialId?: string | null | undefined;
    scopes?: {
        scopeType: "TENANT" | "PLATFORM" | "FRANCHISE" | "BRANCH" | "SELF";
        tenantId: string | null;
        franchiseId: string | null;
        id: string;
        branchId: string | null;
    }[] | undefined;
}>;
export type InternalAuthContextResponse = z.infer<typeof InternalAuthContextResponseSchema>;
//# sourceMappingURL=auth.contracts.d.ts.map