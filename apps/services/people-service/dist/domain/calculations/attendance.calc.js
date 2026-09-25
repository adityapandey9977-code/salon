/**
 * Calculates attendance metrics comparing actual clock in/out timestamps against scheduled shift timings.
 */
export function calculateAttendanceMetrics(params) {
    const { clockInAt, clockOutAt, shift } = params;
    // Calculate raw worked duration in minutes
    const totalWorkedMs = Math.max(0, clockOutAt.getTime() - clockInAt.getTime());
    let workedMinutes = Math.floor(totalWorkedMs / (1000 * 60));
    if (shift && shift.breakMinutes > 0 && workedMinutes > shift.breakMinutes) {
        workedMinutes = Math.max(0, workedMinutes - shift.breakMinutes);
    }
    if (!shift) {
        return {
            workedMinutes,
            lateMinutes: 0,
            earlyLeaveMinutes: 0,
            overtimeMinutes: 0,
            statusSuggestion: workedMinutes >= 240 ? 'PRESENT' : 'HALF_DAY',
        };
    }
    // Parse shift start and end on the clockIn date in UTC
    const [shiftStartHours, shiftStartMins] = shift.startTime.split(':').map(Number);
    const [shiftEndHours, shiftEndMins] = shift.endTime.split(':').map(Number);
    const startUtcMs = Date.UTC(clockInAt.getUTCFullYear(), clockInAt.getUTCMonth(), clockInAt.getUTCDate(), shiftStartHours, shiftStartMins, 0, 0);
    const scheduledStart = new Date(startUtcMs);
    let endUtcMs = Date.UTC(clockInAt.getUTCFullYear(), clockInAt.getUTCMonth(), clockInAt.getUTCDate(), shiftEndHours, shiftEndMins, 0, 0);
    if (endUtcMs <= startUtcMs) {
        // Crosses midnight
        endUtcMs += 24 * 60 * 60 * 1000;
    }
    const scheduledEnd = new Date(endUtcMs);
    const scheduledShiftDurationMinutes = Math.floor((scheduledEnd.getTime() - scheduledStart.getTime()) / (1000 * 60));
    // Late calculation (incorporates graceMinutes)
    const graceLimitMs = scheduledStart.getTime() + shift.graceMinutes * 60 * 1000;
    let lateMinutes = 0;
    if (clockInAt.getTime() > graceLimitMs) {
        lateMinutes = Math.floor((clockInAt.getTime() - scheduledStart.getTime()) / (1000 * 60));
    }
    // Early leave calculation
    let earlyLeaveMinutes = 0;
    if (clockOutAt.getTime() < scheduledEnd.getTime()) {
        earlyLeaveMinutes = Math.floor((scheduledEnd.getTime() - clockOutAt.getTime()) / (1000 * 60));
    }
    // Overtime calculation
    let overtimeMinutes = 0;
    if (clockOutAt.getTime() > scheduledEnd.getTime()) {
        overtimeMinutes = Math.floor((clockOutAt.getTime() - scheduledEnd.getTime()) / (1000 * 60));
    }
    // Status suggestion
    let statusSuggestion = 'PRESENT';
    if (workedMinutes < scheduledShiftDurationMinutes / 2) {
        statusSuggestion = 'HALF_DAY';
    }
    else if (lateMinutes > 0) {
        statusSuggestion = 'LATE';
    }
    return {
        workedMinutes,
        lateMinutes,
        earlyLeaveMinutes,
        overtimeMinutes,
        statusSuggestion,
    };
}
