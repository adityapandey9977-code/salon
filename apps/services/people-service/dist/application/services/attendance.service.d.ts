import type { ClockInRequest, ClockOutRequest, ManualAttendanceRequest, QueryAttendanceRequest } from '@salon-spa-saas/contracts';
import { type AttendanceRecordDto } from '../../infrastructure/repositories/attendance.repository';
export declare class AttendanceService {
    clockIn(tenantId: string, employeeId: string, data: ClockInRequest, performedByUserId?: string | null): Promise<AttendanceRecordDto>;
    clockOut(tenantId: string, employeeId: string, data: ClockOutRequest, performedByUserId?: string | null): Promise<AttendanceRecordDto>;
    recordManualAttendance(tenantId: string, data: ManualAttendanceRequest, performedByUserId?: string | null): Promise<AttendanceRecordDto>;
    queryAttendance(tenantId: string, params: QueryAttendanceRequest): Promise<{
        items: AttendanceRecordDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAttendanceForEmployee(tenantId: string, employeeId: string, dateStr?: string): Promise<AttendanceRecordDto | AttendanceRecordDto[]>;
}
export declare const attendanceService: AttendanceService;
//# sourceMappingURL=attendance.service.d.ts.map