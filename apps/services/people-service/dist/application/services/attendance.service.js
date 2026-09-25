import { ConflictError, NotFoundError, ValidationError } from '@salon-spa-saas/common-types';
import { calculateAttendanceMetrics } from '../../domain/calculations/attendance.calc';
import { eventPublisher } from '../../infrastructure/messaging/publisher';
import { attendanceRepository, } from '../../infrastructure/repositories/attendance.repository';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import { rosterRepository } from '../../infrastructure/repositories/roster.repository';
import { shiftRepository } from '../../infrastructure/repositories/shift.repository';
import { staffBranchRepository } from '../../infrastructure/repositories/staff-branch.repository';
export class AttendanceService {
    async clockIn(tenantId, employeeId, data, performedByUserId) {
        const employee = await employeeRepository.findById(tenantId, employeeId);
        if (!employee) {
            throw new NotFoundError('Employee not found');
        }
        if (employee.employmentStatus !== 'ACTIVE') {
            throw new ConflictError(`Employee cannot clock in because status is ${employee.employmentStatus}`);
        }
        // Verify employee is assigned to the specified branch
        const branchAssignment = await staffBranchRepository.findAssignment(tenantId, employeeId, data.branchId);
        if (!branchAssignment || branchAssignment.status !== 'ACTIVE') {
            if (employee.primaryBranchId !== data.branchId) {
                throw new ValidationError('Employee is not assigned to this branch');
            }
        }
        // Server-side authoritative timestamp
        const now = new Date();
        const today = new Date(now.toISOString().split('T')[0]);
        // Prevent duplicate active clock-in on the same day
        const activeClockIn = await attendanceRepository.findActiveClockIn(tenantId, employeeId, today);
        if (activeClockIn) {
            throw new ConflictError('Employee already has an active clock-in session for today');
        }
        // Check if a completed attendance record exists for today
        const existingForToday = await attendanceRepository.findByEmployeeAndDate(tenantId, employeeId, today);
        if (existingForToday && existingForToday.clockOutAt) {
            throw new ConflictError('Employee has already completed clock-in and clock-out for today');
        }
        const record = await attendanceRepository.createClockIn({
            tenantId,
            employeeId,
            branchId: data.branchId,
            attendanceDate: today,
            clockInAt: now,
            method: data.method,
            latitude: data.latitude,
            longitude: data.longitude,
            notes: data.notes,
        });
        await eventPublisher.publishEvent({
            eventType: 'AttendanceClockedIn',
            aggregateType: 'Attendance',
            aggregateId: record.id,
            tenantId,
            userId: performedByUserId,
            payload: {
                tenantId,
                employeeId,
                branchId: data.branchId,
                attendanceDate: record.attendanceDate,
                clockInAt: record.clockInAt,
                method: record.clockInMethod || 'WEB',
            },
        });
        return record;
    }
    async clockOut(tenantId, employeeId, data, performedByUserId) {
        const employee = await employeeRepository.findById(tenantId, employeeId);
        if (!employee) {
            throw new NotFoundError('Employee not found');
        }
        const now = new Date();
        const today = new Date(now.toISOString().split('T')[0]);
        const activeRecord = await attendanceRepository.findActiveClockIn(tenantId, employeeId, today);
        if (!activeRecord || !activeRecord.clockInAt) {
            throw new ConflictError('No active clock-in record found to clock out from');
        }
        const clockInTime = new Date(activeRecord.clockInAt);
        if (now.getTime() <= clockInTime.getTime()) {
            throw new ValidationError('Clock-out time must be strictly after clock-in time');
        }
        // Lookup shift or roster to calculate metrics
        const roster = await rosterRepository.findRosterByEmployeeAndDate(tenantId, employeeId, today);
        let shiftTiming = null;
        if (roster && roster.shiftId) {
            const shift = await shiftRepository.findShiftById(tenantId, roster.shiftId);
            if (shift) {
                shiftTiming = {
                    startTime: shift.startTime,
                    endTime: shift.endTime,
                    breakMinutes: shift.breakMinutes,
                    graceMinutes: shift.graceMinutes,
                };
            }
        }
        const metrics = calculateAttendanceMetrics({
            clockInAt: clockInTime,
            clockOutAt: now,
            shift: shiftTiming,
        });
        const updated = await attendanceRepository.updateClockOut(activeRecord.id, {
            clockOutAt: now,
            status: metrics.statusSuggestion,
            lateMinutes: metrics.lateMinutes,
            earlyLeaveMinutes: metrics.earlyLeaveMinutes,
            overtimeMinutes: metrics.overtimeMinutes,
            method: data.method,
            latitude: data.latitude,
            longitude: data.longitude,
            notes: data.notes,
        });
        await eventPublisher.publishEvent({
            eventType: 'AttendanceClockedOut',
            aggregateType: 'Attendance',
            aggregateId: updated.id,
            tenantId,
            userId: performedByUserId,
            payload: {
                tenantId,
                employeeId,
                branchId: updated.branchId,
                attendanceDate: updated.attendanceDate,
                clockOutAt: updated.clockOutAt,
                workedMinutes: metrics.workedMinutes,
                overtimeMinutes: metrics.overtimeMinutes,
                lateMinutes: metrics.lateMinutes,
            },
        });
        return updated;
    }
    async recordManualAttendance(tenantId, data, performedByUserId) {
        const employee = await employeeRepository.findById(tenantId, data.employeeId);
        if (!employee) {
            throw new NotFoundError('Employee not found');
        }
        const record = await attendanceRepository.recordManualAttendance({
            tenantId,
            employeeId: data.employeeId,
            branchId: data.branchId,
            attendanceDate: new Date(data.attendanceDate),
            clockInAt: data.clockInAt ? new Date(data.clockInAt) : null,
            clockOutAt: data.clockOutAt ? new Date(data.clockOutAt) : null,
            status: data.status,
            lateMinutes: data.lateMinutes,
            earlyLeaveMinutes: data.earlyLeaveMinutes,
            overtimeMinutes: data.overtimeMinutes,
            notes: data.notes,
        });
        return record;
    }
    async queryAttendance(tenantId, params) {
        return attendanceRepository.queryAttendance({
            tenantId,
            branchId: params.branchId,
            employeeId: params.employeeId,
            startDate: params.startDate ? new Date(params.startDate) : undefined,
            endDate: params.endDate ? new Date(params.endDate) : undefined,
            status: params.status,
            page: params.page,
            limit: params.limit,
        });
    }
    async getAttendanceForEmployee(tenantId, employeeId, dateStr) {
        if (dateStr) {
            const record = await attendanceRepository.findByEmployeeAndDate(tenantId, employeeId, new Date(dateStr));
            if (!record) {
                throw new NotFoundError('Attendance record not found for the specified date');
            }
            return record;
        }
        const result = await attendanceRepository.queryAttendance({
            tenantId,
            employeeId,
            page: 1,
            limit: 30,
        });
        return result.items;
    }
}
export const attendanceService = new AttendanceService();
