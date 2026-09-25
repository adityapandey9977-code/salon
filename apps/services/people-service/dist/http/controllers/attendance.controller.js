import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { ClockInRequestSchema, ClockOutRequestSchema, ManualAttendanceRequestSchema, QueryAttendanceRequestSchema, } from '@salon-spa-saas/contracts';
import { attendanceService } from '../../application/services/attendance.service';
import { staffService } from '../../application/services/staff.service';
export class AttendanceController {
    async clockIn(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = ClockInRequestSchema.parse(req.body);
        let targetEmployeeId = body.employeeId;
        if (!targetEmployeeId) {
            const userId = req.auth?.userId;
            if (!userId) {
                throw new UnauthorizedError('Employee ID or staff user authentication required to clock in');
            }
            const staffMe = await staffService.getStaffMe(userId, tenantId);
            targetEmployeeId = staffMe.id;
        }
        const userId = req.auth?.userId || null;
        const result = await attendanceService.clockIn(tenantId, targetEmployeeId, body, userId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async clockOut(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = ClockOutRequestSchema.parse(req.body);
        let targetEmployeeId = body.employeeId;
        if (!targetEmployeeId) {
            const userId = req.auth?.userId;
            if (!userId) {
                throw new UnauthorizedError('Employee ID or staff user authentication required to clock out');
            }
            const staffMe = await staffService.getStaffMe(userId, tenantId);
            targetEmployeeId = staffMe.id;
        }
        const userId = req.auth?.userId || null;
        const result = await attendanceService.clockOut(tenantId, targetEmployeeId, body, userId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async recordManualAttendance(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = ManualAttendanceRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const result = await attendanceService.recordManualAttendance(tenantId, body, userId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async queryAttendanceLog(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const query = QueryAttendanceRequestSchema.parse(req.query);
        const result = await attendanceService.queryAttendance(tenantId, query);
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
    async getEmployeeAttendance(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const date = req.query.date;
        const result = await attendanceService.getAttendanceForEmployee(tenantId, req.params.employeeId, date);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async punchAttendance(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'] || '11111111-1111-1111-1111-111111111111';
        const { employeeId, type } = req.body || {};
        const userId = req.auth?.userId || null;
        const branchId = req.body?.branchId || req.headers['x-branch-ids']?.split(',')[0] || '22222222-2222-2222-2222-222222222222';
        let result;
        if (type === 'CHECK_OUT') {
            result = await attendanceService.clockOut(tenantId, employeeId, { branchId, method: 'WEB' }, userId);
        }
        else {
            result = await attendanceService.clockIn(tenantId, employeeId, { branchId, method: 'WEB' }, userId);
        }
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const attendanceController = new AttendanceController();
