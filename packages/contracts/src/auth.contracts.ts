import { z } from 'zod';

export const AuthPrincipalTypeEnum = z.enum(['USER', 'TENANT']);
export type AuthPrincipalType = z.infer<typeof AuthPrincipalTypeEnum>;

export const TenantCredentialStatusEnum = z.enum([
  'INVITED',
  'ACTIVE',
  'SUSPENDED',
  'LOCKED',
  'DISABLED',
]);
export type TenantCredentialStatus = z.infer<typeof TenantCredentialStatusEnum>;

export const UserTypeEnum = z.enum(['PLATFORM', 'TENANT', 'CUSTOMER']);
export type UserType = z.infer<typeof UserTypeEnum>;

export const UserStatusEnum = z.enum(['INVITED', 'ACTIVE', 'SUSPENDED', 'LOCKED']);
export type UserStatus = z.infer<typeof UserStatusEnum>;

export const ScopeTypeEnum = z.enum(['PLATFORM', 'TENANT', 'FRANCHISE', 'BRANCH', 'SELF']);
export type ScopeType = z.infer<typeof ScopeTypeEnum>;

export const MfaTypeEnum = z.enum(['TOTP', 'RECOVERY_CODE', 'HARDWARE_KEY']);
export type MfaType = z.infer<typeof MfaTypeEnum>;

export const SessionStatusEnum = z.enum(['ACTIVE', 'REVOKED', 'EXPIRED']);
export type SessionStatus = z.infer<typeof SessionStatusEnum>;

// =======================================================
// Super Admin & User Auth Schemas
// =======================================================

export const SuperAdminLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type SuperAdminLoginRequest = z.infer<typeof SuperAdminLoginRequestSchema>;

export const UserPrincipalSchema = z.object({
  type: z.literal('USER'),
  userId: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  userType: UserTypeEnum.optional(),
  status: UserStatusEnum,
  isMfaEnabled: z.boolean(),
  role: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  scopeType: ScopeTypeEnum,
  tenantId: z.string().uuid().nullable().optional(),
  franchiseId: z.string().uuid().nullable().optional(),
  branchIds: z.array(z.string().uuid()),
});
export type UserPrincipal = z.infer<typeof UserPrincipalSchema>;

export const SuperAdminLoginResponseSchema = z.object({
  requiresMfa: z.boolean().default(false),
  mfaChallengeId: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
  principal: UserPrincipalSchema.optional(),
});
export type SuperAdminLoginResponse = z.infer<typeof SuperAdminLoginResponseSchema>;

// Generic / Backward-compatible Login Request
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  tenantId: z.string().uuid().optional().nullable(),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  requiresMfa: z.boolean().default(false),
  mfaChallengeId: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
  user: z
    .object({
      id: z.string().uuid(),
      email: z.string().email(),
      fullName: z.string(),
      userType: UserTypeEnum,
      status: UserStatusEnum,
      isMfaEnabled: z.boolean(),
      role: z.string().optional(),
      roles: z.array(z.string()),
      permissions: z.array(z.string()),
      mobilePhone: z.string().optional().nullable(),
      tenantId: z.string().uuid().nullable().optional(),
      franchiseId: z.string().uuid().nullable().optional(),
      branchIds: z.array(z.string().uuid()),
    })
    .optional(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// =======================================================
// Tenant / Salon Direct Login Schemas
// =======================================================

export const TenantLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  tenantCode: z.string().optional(),
});
export type TenantLoginRequest = z.infer<typeof TenantLoginRequestSchema>;

export const TenantPrincipalSchema = z.object({
  type: z.literal('TENANT'),
  tenantId: z.string().uuid(),
  credentialId: z.string().uuid().optional(),
  loginEmail: z.string().email(),
  salonName: z.string().optional(),
  tenantCode: z.string().optional(),
  status: z.string(),
  role: z.literal('TENANT_ADMIN'),
  scopeType: z.literal('TENANT'),
  permissions: z.array(z.string()),
});
export type TenantPrincipal = z.infer<typeof TenantPrincipalSchema>;

export const TenantLoginResponseSchema = z.object({
  requiresMfa: z.boolean().default(false),
  mfaChallengeId: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
  principal: TenantPrincipalSchema.optional(),
});
export type TenantLoginResponse = z.infer<typeof TenantLoginResponseSchema>;

// Internal Tenant Credential Provisioning Schema
export const CreateTenantCredentialRequestSchema = z.object({
  tenantId: z.string().uuid(),
  loginEmail: z.string().email(),
  mobilePhone: z.string().optional().nullable(),
  initialPassword: z.string().min(8),
});
export type CreateTenantCredentialRequest = z.infer<
  typeof CreateTenantCredentialRequestSchema
>;

export const TenantForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});
export type TenantForgotPasswordRequest = z.infer<typeof TenantForgotPasswordRequestSchema>;

export const TenantResetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});
export type TenantResetPasswordRequest = z.infer<typeof TenantResetPasswordRequestSchema>;

// =======================================================
// Shared Auth Schemas
// =======================================================

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export const MfaVerifyRequestSchema = z.object({
  challengeId: z.string().min(1),
  code: z.string().length(6),
});
export type MfaVerifyRequest = z.infer<typeof MfaVerifyRequestSchema>;

// User Management Schemas
export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  mobilePhone: z.string().optional().nullable(),
  userType: UserTypeEnum.default('TENANT'),
  tenantId: z.string().uuid().optional().nullable(),
  branchIds: z.array(z.string().uuid()).default([]),
  roles: z.array(z.string()).default([]),
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  mobilePhone: z.string().optional().nullable(),
  isMfaRequired: z.boolean().optional(),
  isMfaEnabled: z.boolean().optional(),
  status: UserStatusEnum.optional(),
  role: z.string().optional(),
  roles: z.array(z.string()).optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

// Role & Permission Schemas
export const CreateRoleRequestSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional().nullable(),
  permissions: z.array(z.string()).default([]),
});
export type CreateRoleRequest = z.infer<typeof CreateRoleRequestSchema>;

export const UpdateRoleRequestSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
});
export type UpdateRoleRequest = z.infer<typeof UpdateRoleRequestSchema>;

export const AssignRolePermissionsRequestSchema = z.object({
  permissions: z.array(z.string()),
});
export type AssignRolePermissionsRequest = z.infer<typeof AssignRolePermissionsRequestSchema>;

export const AssignUserRolesRequestSchema = z.object({
  roleIds: z.array(z.string().uuid()),
});
export type AssignUserRolesRequest = z.infer<typeof AssignUserRolesRequestSchema>;

// User Scope Assignment Schemas
export const CreateUserScopeRequestSchema = z.object({
  scopeType: ScopeTypeEnum,
  tenantId: z.string().uuid().optional().nullable(),
  franchiseId: z.string().uuid().optional().nullable(),
  branchId: z.string().uuid().optional().nullable(),
});
export type CreateUserScopeRequest = z.infer<typeof CreateUserScopeRequestSchema>;

// Internal Gateway Context DTO
export const InternalAuthContextResponseSchema = z.object({
  principalType: AuthPrincipalTypeEnum.default('USER'),
  userId: z.string().uuid().optional().nullable(),
  tenantCredentialId: z.string().uuid().optional().nullable(),
  sessionId: z.string().uuid(),
  userType: UserTypeEnum.optional(),
  status: z.string(),
  role: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  scopeType: ScopeTypeEnum,
  tenantId: z.string().uuid().nullable().optional(),
  franchiseId: z.string().uuid().nullable().optional(),
  branchIds: z.array(z.string().uuid()).default([]),
  scopes: z
    .array(
      z.object({
        id: z.string().uuid(),
        scopeType: ScopeTypeEnum,
        tenantId: z.string().uuid().nullable(),
        franchiseId: z.string().uuid().nullable(),
        branchId: z.string().uuid().nullable(),
      }),
    )
    .default([]),
});
export type InternalAuthContextResponse = z.infer<typeof InternalAuthContextResponseSchema>;
