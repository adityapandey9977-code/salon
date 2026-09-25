import { describe, expect, it } from 'vitest';
import { enforceBranchScope, enforceTenantScope } from '../src/middleware/scope.middleware';

describe('Gateway Scope Middleware with Multi-Principal Support', () => {
  it('should allow TENANT principal direct access within its tenant scope', () => {
    const req: any = {
      user: {
        principalType: 'TENANT',
        tenantId: 'a0000000-0000-0000-0000-000000000001',
        role: 'TENANT_ADMIN',
        scopeType: 'TENANT',
        permissions: ['branch.manage'],
        branchIds: [],
        roles: ['TENANT_ADMIN'],
      },
      params: { tenantId: 'a0000000-0000-0000-0000-000000000001' },
      query: {},
      headers: {},
    };
    let nextCalled = false;
    enforceTenantScope(req, {} as any, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it('should deny TENANT principal access to another tenant scope', () => {
    const req: any = {
      user: {
        principalType: 'TENANT',
        tenantId: 'a0000000-0000-0000-0000-000000000001',
        role: 'TENANT_ADMIN',
        scopeType: 'TENANT',
        permissions: ['branch.manage'],
        branchIds: [],
        roles: ['TENANT_ADMIN'],
      },
      params: { tenantId: 'different-tenant-uuid' },
      query: {},
      headers: {},
    };

    expect(() => enforceTenantScope(req, {} as any, () => {})).toThrow(
      'Tenant scope violation',
    );
  });

  it('should allow TENANT principal access to any branch belonging to their tenant', () => {
    const req: any = {
      user: {
        principalType: 'TENANT',
        tenantId: 'a0000000-0000-0000-0000-000000000001',
        role: 'TENANT_ADMIN',
        scopeType: 'TENANT',
        permissions: ['branch.manage'],
        branchIds: [],
        roles: ['TENANT_ADMIN'],
      },
      params: { branchId: 'any-branch-uuid' },
      query: {},
      headers: {},
    };
    let nextCalled = false;
    enforceBranchScope(req, {} as any, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it('should allow SUPER_ADMIN platform user access to any tenant scope', () => {
    const req: any = {
      user: {
        principalType: 'USER',
        userId: 'super-admin-user-id',
        role: 'SUPER_ADMIN',
        scopeType: 'PLATFORM',
        userType: 'PLATFORM',
        permissions: ['*'],
        branchIds: [],
        roles: ['SUPER_ADMIN'],
      },
      params: { tenantId: 'any-tenant-uuid' },
      query: {},
      headers: {},
    };
    let nextCalled = false;
    enforceTenantScope(req, {} as any, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });
});
