import { describe, expect, it, vi } from 'vitest';
import { requirePermission } from '../../../src/middleware/permission.middleware';

describe('Permission Middleware', () => {
  it('should allow platform super admin automatically', async () => {
    const req: any = {
      auth: {
        principalType: 'USER',
        userType: 'PLATFORM',
        permissions: [],
      },
    };
    const res: any = {};
    const next = vi.fn();

    const middleware = requirePermission('staff.read');
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should allow tenant principal automatically for tenant-scoped operations', async () => {
    const req: any = {
      auth: {
        principalType: 'TENANT',
        tenantId: '11111111-1111-1111-1111-111111111111',
        role: 'TENANT_ADMIN',
        permissions: ['*'],
      },
    };
    const res: any = {};
    const next = vi.fn();

    const middleware = requirePermission('staff.manage', 'staff.create');
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should allow user with exact required permission', async () => {
    const req: any = {
      auth: {
        principalType: 'USER',
        userId: '22222222-2222-2222-2222-222222222222',
        permissions: ['staff.read', 'attendance.read'],
      },
    };
    const res: any = {};
    const next = vi.fn();

    const middleware = requirePermission('staff.read');
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should reject user without required permission with ForbiddenError', async () => {
    const req: any = {
      auth: {
        principalType: 'USER',
        userId: '22222222-2222-2222-2222-222222222222',
        permissions: ['customer.read'],
      },
    };
    const res: any = {};
    const next = vi.fn();

    const middleware = requirePermission('staff.delete');
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'FORBIDDEN',
        statusCode: 403,
      }),
    );
  });
});
