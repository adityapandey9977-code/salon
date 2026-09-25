import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { AssignStaffBranchRequestSchema, UpdateStaffBranchAssignmentRequestSchema, } from '@salon-spa-saas/contracts';
import { staffBranchService } from '../../application/services/staff-branch.service';
export class BranchAssignmentController {
    async getStaffBranches(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await staffBranchService.getStaffBranches(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async assignBranch(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = AssignStaffBranchRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const result = await staffBranchService.assignBranch(tenantId, req.params.id, body, userId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async updateAssignment(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = UpdateStaffBranchAssignmentRequestSchema.parse(req.body);
        const result = await staffBranchService.updateAssignment(tenantId, req.params.id, req.params.assignmentId, body);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async removeAssignment(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const userId = req.auth?.userId || null;
        const result = await staffBranchService.removeAssignment(tenantId, req.params.id, req.params.assignmentId, userId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const branchAssignmentController = new BranchAssignmentController();
