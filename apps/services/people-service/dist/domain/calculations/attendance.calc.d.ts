export interface ShiftTiming {
    startTime: string;
    endTime: string;
    breakMinutes: number;
    graceMinutes: number;
}
export interface AttendanceCalculationResult {
    workedMinutes: number;
    lateMinutes: number;
    earlyLeaveMinutes: number;
    overtimeMinutes: number;
    statusSuggestion: 'PRESENT' | 'LATE' | 'HALF_DAY';
}
/**
 * Calculates attendance metrics comparing actual clock in/out timestamps against scheduled shift timings.
 */
export declare function calculateAttendanceMetrics(params: {
    clockInAt: Date;
    clockOutAt: Date;
    shift?: ShiftTiming | null;
}): AttendanceCalculationResult;
//# sourceMappingURL=attendance.calc.d.ts.map