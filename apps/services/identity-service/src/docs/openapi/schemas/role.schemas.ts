export const roleSchemas = {
  Role: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      code: { type: 'string' },
      description: { type: 'string', nullable: true },
      isSystem: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  Permission: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      code: { type: 'string' },
      module: { type: 'string' },
      description: { type: 'string', nullable: true },
    },
  },
  CreateRoleRequest: {
    type: 'object',
    required: ['name', 'code'],
    properties: {
      name: { type: 'string', minLength: 2 },
      code: { type: 'string', minLength: 2 },
      description: { type: 'string', nullable: true },
      permissions: { type: 'array', items: { type: 'string' } },
    },
  },
  AssignRolePermissionsRequest: {
    type: 'object',
    required: ['permissions'],
    properties: {
      permissions: { type: 'array', items: { type: 'string' } },
    },
  },
  AssignUserRolesRequest: {
    type: 'object',
    required: ['roleIds'],
    properties: {
      roleIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
    },
  },
};
