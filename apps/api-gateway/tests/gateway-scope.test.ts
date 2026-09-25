import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import {
  enforceBranchScope,
  enforceTenantScope,
  requireGatewayPermission,
} from '../src/middleware/scope.middleware';

describe('API Gateway Scope & Permission Middleware', () => {
  it('should block request if user lacks required permission', async () => {
    const app = express();
    app.use((req, _res, next) => {
      req.user = {
        userId: '111',
        sessionId: '222',
        userType: 'TENANT',
        status: 'ACTIVE',
        roles: ['STYLIST'],
        permissions: ['appointment.read'],
        tenantId: 'tenant-123',
        franchiseId: null,
        branchIds: ['branch-456'],
        scopes: [],
      };
      next();
    });

    app.get('/protected', requireGatewayPermission('role.manage'), (_req, res) => {
      res.json({ success: true });
    });

    app.use((err: any, _req: any, res: any, _next: any) => {
      res.status(err.statusCode || 500).json({ error: err.code || 'ERROR' });
    });

    const res = await request(app).get('/protected');
    expect(res.status).toBe(403);
  });

  it('should allow request if user possesses required permission', async () => {
    const app = express();
    app.use((req, _res, next) => {
      req.user = {
        userId: '111',
        sessionId: '222',
        userType: 'TENANT',
        status: 'ACTIVE',
        roles: ['SALON_ADMIN'],
        permissions: ['role.manage'],
        tenantId: 'tenant-123',
        franchiseId: null,
        branchIds: [],
        scopes: [],
      };
      next();
    });

    app.get('/protected', requireGatewayPermission('role.manage'), (_req, res) => {
      res.json({ success: true });
    });

    const res = await request(app).get('/protected');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject tenant mismatch', async () => {
    const app = express();
    app.use((req, _res, next) => {
      req.user = {
        userId: '111',
        sessionId: '222',
        userType: 'TENANT',
        status: 'ACTIVE',
        roles: ['SALON_ADMIN'],
        permissions: ['customer.read'],
        tenantId: 'tenant-111',
        franchiseId: null,
        branchIds: [],
        scopes: [],
      };
      next();
    });

    app.get('/tenants/:tenantId/data', enforceTenantScope, (_req, res) => {
      res.json({ success: true });
    });

    app.use((err: any, _req: any, res: any, _next: any) => {
      res.status(err.statusCode || 500).json({ error: err.code || 'ERROR' });
    });

    const res = await request(app).get('/tenants/tenant-999/data');
    expect(res.status).toBe(403);
  });

  it('should reject branch scope mismatch', async () => {
    const app = express();
    app.use((req, _res, next) => {
      req.user = {
        userId: '111',
        sessionId: '222',
        userType: 'TENANT',
        status: 'ACTIVE',
        roles: ['STYLIST'],
        permissions: ['appointment.read'],
        tenantId: 'tenant-111',
        franchiseId: null,
        branchIds: ['branch-aaa'],
        scopes: [],
      };
      next();
    });

    app.get('/branches/:branchId/data', enforceBranchScope, (_req, res) => {
      res.json({ success: true });
    });

    app.use((err: any, _req: any, res: any, _next: any) => {
      res.status(err.statusCode || 500).json({ error: err.code || 'ERROR' });
    });

    const res = await request(app).get('/branches/branch-zzz/data');
    expect(res.status).toBe(403);
  });
});
