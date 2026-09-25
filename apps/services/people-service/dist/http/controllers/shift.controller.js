import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateShiftRequestSchema, UpdateShiftRequestSchema, } from '@salon-spa-saas/contracts';
import { shiftService } from '../../application/services/shift.service';
export class ShiftController {
    async getShifts(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'] || '11111111-1111-1111-1111-111111111111';
        const branchId = req.query.branchId;
        const result = await shiftService.getShiftsByBranch(tenantId, branchId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async createShift(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CreateShiftRequestSchema.parse(req.body);
        const result = await shiftService.createShift(tenantId, body);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async updateShift(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = UpdateShiftRequestSchema.parse(req.body);
        const result = await shiftService.updateShift(tenantId, req.params.id, body);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async deleteShift(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await shiftService.deleteShift(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const shiftController = new ShiftController();
