import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPeopleApp } from '../../src/app';
import { attendanceRepository } from '../../src/infrastructure/repositories/attendance.repository';
import { employeeRepository } from '../../src/infrastructure/repositories/employee.repository';
import { rosterRepository } from '../../src/infrastructure/repositories/roster.repository';
import { staffBranchRepository } from '../../src/infrastructure/repositories/staff-branch.repository';

describe('Attendance API Endpoints', () => {
  const app = buildPeopleApp();
  const testTenantId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const testEmployeeId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const testBranchId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

  const mockEmployee = {
    id: testEmployeeId,
    tenantId: testTenantId,
    employeeCode: 'EMP-001',
    identityUserId: null,
    firstName: 'Priya',
    lastName: 'Sharma',
    displayName: 'Priya Sharma',
    email: 'priya@salon.local',
    mobilePhone: '+919876543210',
    dateOfBirth: null,
    gender: null,
    employmentStatus: 'ACTIVE' as const,
    employmentType: 'FULL_TIME' as const,
    joiningDate: '2024-01-10',
    exitDate: null,
    primaryBranchId: testBranchId,
    jobTitle: 'Senior Stylist',
    department: null,
    managerEmployeeId: null,
    profilePhotoObjectKey: null,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockAttendance = {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    tenantId: testTenantId,
    employeeId: testEmployeeId,
    branchId: testBranchId,
    attendanceDate: '2026-09-04',
    clockInAt: '2026-09-04T09:00:00.000Z',
    clockOutAt: null,
    status: 'PRESENT' as const,
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    overtimeMinutes: 0,
    clockInMethod: 'WEB' as const,
    clockOutMethod: null,
    clockInLatitude: null,
    clockInLongitude: null,
    clockOutLatitude: null,
    clockOutLongitude: null,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/v1/staff/clock-in should record clock in', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(staffBranchRepository, 'findAssignment').mockResolvedValueOnce({
      id: 'fa-1',
      employeeId: testEmployeeId,
      tenantId: testTenantId,
      branchId: testBranchId,
      isPrimary: true,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: null,
      status: 'ACTIVE',
    });
    vi.spyOn(attendanceRepository, 'findActiveClockIn').mockResolvedValueOnce(null);
    vi.spyOn(attendanceRepository, 'findByEmployeeAndDate').mockResolvedValueOnce(null);
    vi.spyOn(attendanceRepository, 'createClockIn').mockResolvedValueOnce(mockAttendance);

    const res = await request(app)
      .post('/api/v1/staff/clock-in')
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({
        employeeId: testEmployeeId,
        branchId: testBranchId,
        method: 'WEB',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.clockInAt).toBe('2026-09-04T09:00:00.000Z');
  });

  it('POST /api/v1/staff/clock-in should reject duplicate clock-in for the same day', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(staffBranchRepository, 'findAssignment').mockResolvedValueOnce({
      id: 'fa-1',
      employeeId: testEmployeeId,
      tenantId: testTenantId,
      branchId: testBranchId,
      isPrimary: true,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: null,
      status: 'ACTIVE',
    });
    vi.spyOn(attendanceRepository, 'findActiveClockIn').mockResolvedValueOnce(mockAttendance);

    const res = await request(app)
      .post('/api/v1/staff/clock-in')
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({
        employeeId: testEmployeeId,
        branchId: testBranchId,
        method: 'WEB',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('POST /api/v1/staff/clock-out should complete clock-out and calculate metrics', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(attendanceRepository, 'findActiveClockIn').mockResolvedValueOnce(mockAttendance);
    vi.spyOn(rosterRepository, 'findRosterByEmployeeAndDate').mockResolvedValueOnce(null);
    vi.spyOn(attendanceRepository, 'updateClockOut').mockResolvedValueOnce({
      ...mockAttendance,
      clockOutAt: '2026-09-04T17:00:00.000Z',
      status: 'PRESENT',
    });

    const res = await request(app)
      .post('/api/v1/staff/clock-out')
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({
        employeeId: testEmployeeId,
        branchId: testBranchId,
        method: 'WEB',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.clockOutAt).toBe('2026-09-04T17:00:00.000Z');
  });

  it('GET /api/v1/staff/attendance/log should return attendance history logs', async () => {
    vi.spyOn(attendanceRepository, 'queryAttendance').mockResolvedValueOnce({
      items: [mockAttendance],
      total: 1,
      page: 1,
      limit: 20,
    });

    const res = await request(app)
      .get('/api/v1/staff/attendance/log')
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});
