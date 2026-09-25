import { authSchemas } from './schemas/auth.schemas';
import { roleSchemas } from './schemas/role.schemas';
import { userSchemas } from './schemas/user.schemas';

export const identityOpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: '  Salon SaaS — Identity Service API',
    description:
      'Authoritative Authentication, User Management, RBAC & Redis-Accelerated Read Architecture',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local Identity Service direct',
    },
    {
      url: 'http://localhost:3000',
      description: 'API Gateway proxy',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Short-lived access JWT token',
      },
      InternalServiceAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-service-secret',
        description: 'Protected service-to-service internal authorization header',
      },
    },
    schemas: {
      ...authSchemas,
      ...userSchemas,
      ...roleSchemas,
    },
  },
  paths: {
    '/api/v1/auth/login': {
      post: {
        summary: 'Authenticate user with email and password',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Login successful or MFA challenge issued',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } },
            },
          },
          401: { description: 'Invalid credentials or account locked' },
        },
      },
    },
    '/api/v1/auth/refresh-token': {
      post: {
        summary: 'Rotate refresh token and issue new access token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } },
          },
        },
        responses: {
          200: { description: 'Tokens rotated successfully' },
          401: { description: 'Invalid refresh token or reuse breach detected' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        summary: 'Revoke active server session and invalidate cache',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        summary: 'Get current user profile and effective permissions (Redis-first read)',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'User profile with effective access permissions' },
        },
      },
    },
    '/api/v1/auth/mfa/verify': {
      post: {
        summary: 'Verify TOTP MFA challenge',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/MfaVerifyRequest' } },
          },
        },
        responses: {
          200: { description: 'MFA verified, session established' },
          401: { description: 'Invalid MFA challenge or code' },
        },
      },
    },
    '/api/v1/auth/forgot-password': {
      post: {
        summary: 'Request password reset token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } },
          },
        },
        responses: {
          200: { description: 'Reset email instructions dispatched' },
        },
      },
    },
    '/api/v1/auth/reset-password': {
      post: {
        summary: 'Reset password using token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } },
          },
        },
        responses: {
          200: { description: 'Password reset and sessions revoked' },
        },
      },
    },
    '/api/v1/auth/sessions': {
      get: {
        summary: 'List all active user sessions',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'List of active sessions' },
        },
      },
    },
    '/api/v1/users': {
      get: {
        summary: 'List users with pagination and filters',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Paginated user list' },
        },
      },
      post: {
        summary: 'Create a new user',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateUserRequest' } },
          },
        },
        responses: {
          201: { description: 'User created successfully' },
        },
      },
    },
    '/api/v1/users/{id}': {
      get: {
        summary: 'Get user by ID (Redis-first safe projection)',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'User profile' },
        },
      },
      patch: {
        summary: 'Update user profile (PostgreSQL commit then Redis invalidation)',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } },
          },
        },
        responses: {
          200: { description: 'User updated' },
        },
      },
    },
    '/api/v1/users/{id}/suspend': {
      post: {
        summary: 'Suspend user and revoke all active sessions',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'User suspended' },
        },
      },
    },
    '/api/v1/users/{id}/activate': {
      post: {
        summary: 'Activate suspended user',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'User activated' },
        },
      },
    },
    '/api/v1/users/{id}/effective-access': {
      get: {
        summary: 'Get effective permissions, roles, and scopes for user (Redis-accelerated)',
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Effective access details' },
        },
      },
    },
    '/api/v1/users/{id}/scopes': {
      get: {
        summary: 'List user scope assignments',
        tags: ['User Scopes'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'User scopes' },
        },
      },
      post: {
        summary: 'Assign a new scope to user',
        tags: ['User Scopes'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateUserScopeRequest' } },
          },
        },
        responses: {
          201: { description: 'Scope assigned' },
        },
      },
    },
    '/api/v1/roles': {
      get: {
        summary: 'List all RBAC roles',
        tags: ['Roles & Permissions'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'List of roles' },
        },
      },
      post: {
        summary: 'Create custom role',
        tags: ['Roles & Permissions'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateRoleRequest' } },
          },
        },
        responses: {
          201: { description: 'Role created' },
        },
      },
    },
    '/api/v1/roles/{id}/permissions': {
      put: {
        summary: 'Assign permissions to role (invalidates access caches of assigned users)',
        tags: ['Roles & Permissions'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AssignRolePermissionsRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Permissions updated' },
        },
      },
    },
    '/api/v1/permissions': {
      get: {
        summary: 'List all system permissions',
        tags: ['Roles & Permissions'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'List of permissions' },
        },
      },
    },
    '/internal/v1/auth/context': {
      get: {
        summary: 'Internal endpoint for API Gateway to resolve token authority context',
        tags: ['Internal Service-to-Service'],
        security: [{ InternalServiceAuth: [] }],
        parameters: [
          { name: 'userId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'sessionId', in: 'query', schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Authority context' },
          401: { description: 'Unauthorized internal call' },
        },
      },
    },
  },
};
