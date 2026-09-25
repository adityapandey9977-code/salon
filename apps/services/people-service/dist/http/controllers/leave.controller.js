import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { AdjustLeaveBalanceRequestSchema, CreateLeaveRequestSchema, ReviewLeaveDecisionSchema, UpdateLeaveRequestSchema, } from '@salon-spa-saas/contracts';
import { leaveService } from '../../application/services/leave.service';
import { staffService } from '../../application/services/staff.service';
export class LeaveController {
    async queryLeave(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await leaveService.queryLeave({
            tenantId,
            employeeId: req.query.employeeId,
            status: req.query.status,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
        });
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
    async getLeaveById(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await leaveService.getLeaveRequestById(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async createLeaveRequest(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CreateLeaveRequestSchema.parse(req.body);
        let targetEmployeeId = body.employeeId;
        if (!targetEmployeeId) {
            const userId = req.auth?.userId;
            if (!userId) {
                throw new UnauthorizedError('Employee ID or staff user authentication required to request leave');
            }
            const staffMe = await staffService.getStaffMe(userId, tenantId);
            targetEmployeeId = staffMe.id;
        }
        const result = await leaveService.createLeaveRequest(tenantId, targetEmployeeId, body);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async updateLeaveRequest(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = UpdateLeaveRequestSchema.parse(req.body);
        const result = await leaveService.updateLeaveRequest(tenantId, req.params.id, body);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async approveLeave(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = ReviewLeaveDecisionSchema.parse(req.body || {});
        const approverUserId = req.auth?.userId || null;
        const result = await leaveService.approveLeave(tenantId, req.params.id, approverUserId, body.reviewNote);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async rejectLeave(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = ReviewLeaveDecisionSchema.parse(req.body || {});
        const rejecterUserId = req.auth?.userId || null;
        const result = await leaveService.rejectLeave(tenantId, req.params.id, rejecterUserId, body.reviewNote);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async cancelLeave(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await leaveService.cancelLeave(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async getLeaveBalances(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const year = req.query.year ? Number(req.query.year) : undefined;
        const result = await leaveService.getLeaveBalances(tenantId, req.params.id, year);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async adjustLeaveBalance(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = AdjustLeaveBalanceRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const result = await leaveService.adjustLeaveBalance(tenantId, req.params.id, body, userId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const leaveController = new LeaveController();
