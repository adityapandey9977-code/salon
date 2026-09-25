import { describe, expect, it } from 'vitest';
import { calculateAttendanceMetrics } from '../../../src/domain/calculations/attendance.calc';

describe('Attendance Calculation Domain Logic', () => {
  const standardShift = {
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: 60,
    graceMinutes: 15,
  };

  it('should calculate on-time attendance within grace period', () => {
    const clockInAt = new Date('2026-09-04T09:10:00.000Z'); // within 15m grace
    const clockOutAt = new Date('2026-09-04T17:00:00.000Z');

    const result = calculateAttendanceMetrics({
      clockInAt,
      clockOutAt,
      shift: standardShift,
    });

    expect(result.lateMinutes).toBe(0);
    expect(result.earlyLeaveMinutes).toBe(0);
    expect(result.overtimeMinutes).toBe(0);
    expect(result.statusSuggestion).toBe('PRESENT');
    // 8 hours - 1 hour break - 10 mins = 410 mins
    expect(result.workedMinutes).toBe(410);
  });

  it('should calculate late minutes when clock-in exceeds grace period', () => {
    const clockInAt = new Date('2026-09-04T09:30:00.000Z'); // 30 mins late (exceeds 15m grace)
    const clockOutAt = new Date('2026-09-04T17:00:00.000Z');

    const result = calculateAttendanceMetrics({
      clockInAt,
      clockOutAt,
      shift: standardShift,
    });

    expect(result.lateMinutes).toBe(30);
    expect(result.statusSuggestion).toBe('LATE');
  });

  it('should calculate early leave when clock-out is before shift end', () => {
    const clockInAt = new Date('2026-09-04T09:00:00.000Z');
    const clockOutAt = new Date('2026-09-04T16:15:00.000Z'); // 45 mins early

    const result = calculateAttendanceMetrics({
      clockInAt,
      clockOutAt,
      shift: standardShift,
    });

    expect(result.earlyLeaveMinutes).toBe(45);
    expect(result.lateMinutes).toBe(0);
  });

  it('should calculate overtime when clock-out exceeds shift end', () => {
    const clockInAt = new Date('2026-09-04T09:00:00.000Z');
    const clockOutAt = new Date('2026-09-04T18:30:00.000Z'); // 90 mins overtime

    const result = calculateAttendanceMetrics({
      clockInAt,
      clockOutAt,
      shift: standardShift,
    });

    expect(result.overtimeMinutes).toBe(90);
    expect(result.statusSuggestion).toBe('PRESENT');
  });

  it('should mark as HALF_DAY if worked less than half the shift', () => {
    const clockInAt = new Date('2026-09-04T09:00:00.000Z');
    const clockOutAt = new Date('2026-09-04T12:00:00.000Z'); // 3h worked

    const result = calculateAttendanceMetrics({
      clockInAt,
      clockOutAt,
      shift: standardShift,
    });

    expect(result.statusSuggestion).toBe('HALF_DAY');
  });

  it('should handle attendance without shift definition cleanly', () => {
    const clockInAt = new Date('2026-09-04T10:00:00.000Z');
    const clockOutAt = new Date('2026-09-04T18:00:00.000Z');

    const result = calculateAttendanceMetrics({
      clockInAt,
      clockOutAt,
      shift: null,
    });

    expect(result.workedMinutes).toBe(480);
    expect(result.lateMinutes).toBe(0);
    expect(result.earlyLeaveMinutes).toBe(0);
    expect(result.overtimeMinutes).toBe(0);
    expect(result.statusSuggestion).toBe('PRESENT');
  });
});
