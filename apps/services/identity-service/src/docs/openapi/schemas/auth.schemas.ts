export const authSchemas = {
  SuperAdminLoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'superadmin@digiflex.com' },
      password: { type: 'string', format: 'password', example: 'SuperAdmin@123!' },
    },
  },
  SuperAdminLoginResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          requiresMfa: { type: 'boolean', example: false },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          expiresIn: { type: 'number', example: 900 },
          principal: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'USER' },
              userId: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              fullName: { type: 'string' },
              role: { type: 'string', example: 'SUPER_ADMIN' },
              scopeType: { type: 'string', example: 'PLATFORM' },
              permissions: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
    },
  },
  TenantLoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'owner@glamour-salon.com' },
      password: { type: 'string', format: 'password', example: 'SalonAdmin@123!' },
      tenantCode: { type: 'string', example: 'SALON001' },
    },
  },
  TenantLoginResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          requiresMfa: { type: 'boolean', example: false },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          expiresIn: { type: 'number', example: 900 },
          principal: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'TENANT' },
              tenantId: { type: 'string', format: 'uuid' },
              credentialId: { type: 'string', format: 'uuid' },
              loginEmail: { type: 'string', format: 'email' },
              salonName: { type: 'string' },
              tenantCode: { type: 'string' },
              role: { type: 'string', example: 'TENANT_ADMIN' },
              scopeType: { type: 'string', example: 'TENANT' },
              permissions: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
    },
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'admin@digiflex.com' },
      password: { type: 'string', format: 'password', example: 'Password123!' },
      tenantId: { type: 'string', format: 'uuid', nullable: true },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          requiresMfa: { type: 'boolean', example: false },
          mfaChallengeId: { type: 'string', nullable: true },
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
          refreshToken: { type: 'string', example: '8f7a6b...' },
          expiresIn: { type: 'number', example: 900 },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              fullName: { type: 'string' },
              userType: { type: 'string', enum: ['PLATFORM', 'TENANT', 'CUSTOMER'] },
              status: { type: 'string', enum: ['ACTIVE', 'INVITED', 'SUSPENDED', 'LOCKED'] },
              isMfaEnabled: { type: 'boolean' },
              roles: { type: 'array', items: { type: 'string' } },
              permissions: { type: 'array', items: { type: 'string' } },
              tenantId: { type: 'string', format: 'uuid', nullable: true },
              franchiseId: { type: 'string', format: 'uuid', nullable: true },
              branchIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
            },
          },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
    },
  },
  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string', example: '8f7a6b...' },
    },
  },
  MfaVerifyRequest: {
    type: 'object',
    required: ['challengeId', 'code'],
    properties: {
      challengeId: { type: 'string', format: 'uuid' },
      code: { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
    },
  },
  ForgotPasswordRequest: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email', example: 'user@example.com' },
    },
  },
  ResetPasswordRequest: {
    type: 'object',
    required: ['token', 'newPassword'],
    properties: {
      token: { type: 'string' },
      newPassword: { type: 'string', minLength: 8, format: 'password' },
    },
  },
};

