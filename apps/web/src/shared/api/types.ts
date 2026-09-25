import type {
  AssignRolePermissionsRequest,
  AssignUserRolesRequest,
  AuthPrincipalType,
  CreateBranchRequest,
  CreateResourceRequest,
  CreateRoleRequest,
  CreateTenantCredentialRequest,
  CreateTenantRequest,
  CreateUserRequest,
  CreateUserScopeRequest,
  ForgotPasswordRequest,
  InternalAuthContextResponse,
  LoginRequest,
  LoginResponse,
  MfaVerifyRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  ScopeType,
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  TenantCredentialStatus,
  TenantForgotPasswordRequest,
  TenantLoginRequest,
  TenantLoginResponse,
  TenantPrincipal,
  TenantResetPasswordRequest,
  TenantResponse,
  TenantStatus,
  UpdateRoleRequest,
  UpdateUserRequest,
  UserPrincipal,
  UserStatus,
  UserType,
} from '@salon-spa-saas/contracts';

// Standard API response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  userType?: UserType;
}

export interface RoleDto {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isSystem: boolean;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PermissionDto {
  id: string;
  code: string;
  name: string;
  module: string;
  description?: string | null;
}

export interface UserScopeDto {
  id: string;
  userId: string;
  scopeType: ScopeType;
  tenantId?: string | null;
  franchiseId?: string | null;
  branchId?: string | null;
  createdAt: string;
}

export interface UserEffectiveAccessDto {
  userId: string;
  roles: string[];
  permissions: string[];
  scopes: UserScopeDto[];
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  mobilePhone?: string | null;
  userType?: UserType | 'PLATFORM' | 'TENANT' | 'CUSTOMER';
  status?: UserStatus | 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'LOCKED';
  isMfaRequired?: boolean;
  isMfaEnabled?: boolean;
  tenantId?: string | null;
  franchiseId?: string | null;
  branchIds?: string[];
  salonName?: string;
  role?: string;
  roles: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  permissions?: string[];
  scopes?: UserScopeDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSessionDto {
  id: string;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

export interface GatewayHealthResponse {
  status: 'UP' | 'DOWN';
  timestamp: string;
  service: string;
  environment: string;
  version: string;
  uptime: number;
  dependencies: {
    redis: 'UP' | 'DOWN' | 'DISABLED';
    identityService: 'UP' | 'DOWN';
  };
}

export interface GatewayReadyResponse {
  status: 'READY' | 'NOT_READY';
  timestamp: string;
  checks: Record<string, 'UP' | 'DOWN' | 'DISABLED'>;
}

export type {
  AssignRolePermissionsRequest,
  AssignUserRolesRequest,
  AuthPrincipalType,
  CreateBranchRequest,
  CreateResourceRequest,
  CreateRoleRequest,
  CreateTenantCredentialRequest,
  CreateTenantRequest,
  CreateUserRequest,
  CreateUserScopeRequest,
  ForgotPasswordRequest,
  InternalAuthContextResponse,
  LoginRequest,
  LoginResponse,
  MfaVerifyRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  ScopeType,
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  TenantCredentialStatus,
  TenantForgotPasswordRequest,
  TenantLoginRequest,
  TenantLoginResponse,
  TenantPrincipal,
  TenantResetPasswordRequest,
  TenantResponse,
  TenantStatus,
  UpdateRoleRequest,
  UpdateUserRequest,
  UserPrincipal,
  UserStatus,
  UserType,
};
