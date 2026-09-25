import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateEmployeeRequestSchema, ListStaffQuerySchema, UpdateEmployeeRequestSchema, } from '@salon-spa-saas/contracts';
import { staffService } from '../../application/services/staff.service';
const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || 'f1b473ba-4bcf-42a7-9017-c8488536dbe6';
export class StaffController {
    getTenantId(req) {
        const id = req.auth?.tenantId ||
            req.headers['x-tenant-id'] ||
            req.query?.tenantId ||
            req.body?.tenantId;
        return id || DEFAULT_TENANT_ID;
    }
    async listStaff(req, res) {
        const tenantId = this.getTenantId(req);
        const query = ListStaffQuerySchema.parse(req.query);
        const result = await staffService.listStaff(tenantId, query);
        res.json({
            success: true,
            data: result.items,
            meta: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: Math.ceil(result.total / result.limit),
                correlationId: req.headers['x-correlation-id'],
            },
        });
    }
    async getStaffById(req, res) {
        const tenantId = this.getTenantId(req);
        const result = await staffService.getStaffDetail(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async getStaffMe(req, res) {
        const userId = req.auth?.userId || req.headers['x-user-id'];
        if (!userId) {
            res.json({
                success: true,
                data: null,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
            return;
        }
        const tenantId = this.getTenantId(req);
        try {
            const result = await staffService.getStaffMe(userId, tenantId);
            res.json({
                success: true,
                data: result,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            if (err.name === 'NotFoundError' || err.statusCode === 404 || err.message?.includes('No linked employee')) {
                res.json({
                    success: true,
                    data: null,
                    meta: { correlationId: req.headers['x-correlation-id'] },
                });
                return;
            }
            throw err;
        }
    }
    async createStaff(req, res) {
        const tenantId = this.getTenantId(req);
        const body = CreateEmployeeRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const result = await staffService.createStaff(tenantId, body, userId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async updateStaff(req, res) {
        const tenantId = this.getTenantId(req);
        const body = UpdateEmployeeRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const result = await staffService.updateStaff(tenantId, req.params.id, body, userId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async deleteStaff(req, res) {
        const tenantId = this.getTenantId(req);
        const userId = req.auth?.userId || null;
        const deleteReason = req.body?.reason;
        const result = await staffService.softDeleteStaff(tenantId, req.params.id, userId, deleteReason);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async getBranchTeam(req, res) {
        const tenantId = this.getTenantId(req);
        const branchId = req.query.branchId || req.params.branchId;
        if (!branchId)
            throw new UnauthorizedError('Branch ID required');
        const result = await staffService.getBranchTeam(tenantId, branchId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const staffController = new StaffController();
