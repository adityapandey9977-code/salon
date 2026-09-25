import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPeopleApp } from '../../src/app';
import { employeeRepository } from '../../src/infrastructure/repositories/employee.repository';
import { leaveRepository } from '../../src/infrastructure/repositories/leave.repository';

describe('Leave API Endpoints', () => {
  const app = buildPeopleApp();
  const testTenantId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const testEmployeeId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const testLeaveId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

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
    primaryBranchId: null,
    jobTitle: 'Senior Stylist',
    department: null,
    managerEmployeeId: null,
    profilePhotoObjectKey: null,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockLeaveRequest = {
    id: testLeaveId,
    tenantId: testTenantId,
    employeeId: testEmployeeId,
    leaveType: 'CASUAL' as const,
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    reason: 'Family function',
    status: 'PENDING' as const,
    requestedAt: new Date().toISOString(),
    approvedAt: null,
    rejectedAt: null,
    approvedByIdentityUserId: null,
    rejectedByIdentityUserId: null,
    reviewNote: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('POST /api/v1/staff/leave should submit leave request', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(leaveRepository, 'createLeaveRequest').mockResolvedValueOnce(mockLeaveRequest);

    const res = await request(app)
      .post('/api/v1/staff/leave')
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({
        employeeId: testEmployeeId,
        leaveType: 'CASUAL',
        startDate: '2026-09-10',
        endDate: '2026-09-12',
        reason: 'Family function',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(testLeaveId);
    expect(res.body.data.status).toBe('PENDING');
  });

  it('POST /api/v1/staff/leave/:id/approve should approve leave and update balance', async () => {
    vi.spyOn(leaveRepository, 'approveLeaveRequest').mockResolvedValueOnce({
      ...mockLeaveRequest,
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      reviewNote: 'Approved by manager',
    });

    const res = await request(app)
      .post(`/api/v1/staff/leave/${testLeaveId}/approve`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({ reviewNote: 'Approved by manager' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('APPROVED');
  });

  it('GET /api/v1/staff/:id/leave-balances should return annual leave balances', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(leaveRepository, 'getLeaveBalances').mockResolvedValueOnce([
      {
        id: 'bal-1',
        employeeId: testEmployeeId,
        leaveType: 'CASUAL',
        year: 2026,
        openingBalance: 12,
        accrued: 0,
        used: 3,
        adjusted: 0,
        currentBalance: 9,
      },
    ]);

    const res = await request(app)
      .get(`/api/v1/staff/${testEmployeeId}/leave-balances`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].currentBalance).toBe(9);
  });
});
