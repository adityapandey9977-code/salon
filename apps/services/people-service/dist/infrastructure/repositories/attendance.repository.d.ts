import { type AttendanceMethod, type AttendanceStatus } from '../prisma/generated-client';
export interface AttendanceRecordDto {
    id: string;
    tenantId: string;
    employeeId: string;
    branchId: string;
    attendanceDate: string;
    clockInAt: string | null;
    clockOutAt: string | null;
    status: AttendanceStatus;
    lateMinutes: number;
    earlyLeaveMinutes: number;
    overtimeMinutes: number;
    clockInMethod: AttendanceMethod | null;
    clockOutMethod: AttendanceMethod | null;
    clockInLatitude: number | null;
    clockInLongitude: number | null;
    clockOutLatitude: number | null;
    clockOutLongitude: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}
export declare class AttendanceRepository {
    private toDto;
    findByEmployeeAndDate(tenantId: string, employeeId: string, attendanceDate: Date): Promise<AttendanceRecordDto | null>;
    findActiveClockIn(tenantId: string, employeeId: string, attendanceDate: Date): Promise<AttendanceRecordDto | null>;
    createClockIn(data: {
        tenantId: string;
        employeeId: string;
        branchId: string;
        attendanceDate: Date;
        clockInAt: Date;
        method?: AttendanceMethod;
        latitude?: number | null;
        longitude?: number | null;
        notes?: string | null;
    }): Promise<AttendanceRecordDto>;
    updateClockOut(id: string, data: {
        clockOutAt: Date;
        status: AttendanceStatus;
        lateMinutes: number;
        earlyLeaveMinutes: number;
        overtimeMinutes: number;
        method?: AttendanceMethod;
        latitude?: number | null;
        longitude?: number | null;
        notes?: string | null;
    }): Promise<AttendanceRecordDto>;
    recordManualAttendance(data: {
        tenantId: string;
        employeeId: string;
        branchId: string;
        attendanceDate: Date;
        clockInAt?: Date | null;
        clockOutAt?: Date | null;
        status: AttendanceStatus;
        lateMinutes?: number;
        earlyLeaveMinutes?: number;
        overtimeMinutes?: number;
        notes?: string | null;
    }): Promise<AttendanceRecordDto>;
    queryAttendance(params: {
        tenantId: string;
        branchId?: string;
        employeeId?: string;
        startDate?: Date;
        endDate?: Date;
        status?: AttendanceStatus;
        page?: number;
        limit?: number;
    }): Promise<{
        items: AttendanceRecordDto[];
        total: number;
        page: number;
        limit: number;
    }>;
}
export declare const attendanceRepository: AttendanceRepository;
//# sourceMappingURL=attendance.repository.d.ts.map