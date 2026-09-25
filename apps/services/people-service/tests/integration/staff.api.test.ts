import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPeopleApp } from '../../src/app';
import { employeeRepository } from '../../src/infrastructure/repositories/employee.repository';

describe('Staff API Endpoints', () => {
  const app = buildPeopleApp();
  const testTenantId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const testEmployeeId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

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
    dateOfBirth: '1995-05-15',
    gender: 'FEMALE',
    employmentStatus: 'ACTIVE' as const,
    employmentType: 'FULL_TIME' as const,
    joiningDate: '2024-01-10',
    exitDate: null,
    primaryBranchId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    jobTitle: 'Senior Stylist',
    department: 'Hair Care',
    managerEmployeeId: null,
    profilePhotoObjectKey: null,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      bio: 'Expert stylist',
      yearsOfExperience: 6,
      specialization: 'Balayage',
      designation: 'Senior Stylist',
      commissionEligible: true,
      acceptsOnlineBooking: true,
      isBookable: true,
      serviceCapacity: 1,
      profileVisibility: 'PUBLIC',
    },
    branchAssignments: [],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/staff should return paginated staff list for tenant', async () => {
    vi.spyOn(employeeRepository, 'listEmployees').mockResolvedValueOnce({
      items: [mockEmployee],
      total: 1,
      page: 1,
      limit: 20,
    });

    const res = await request(app)
      .get('/api/v1/staff')
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].employeeCode).toBe('EMP-001');
    expect(res.body.meta.total).toBe(1);
  });

  it('GET /api/v1/staff/:id should return single staff details', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);

    const res = await request(app)
      .get(`/api/v1/staff/${testEmployeeId}`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(testEmployeeId);
    expect(res.body.data.displayName).toBe('Priya Sharma');
  });

  it('POST /api/v1/staff should create an employee without requiring identity user', async () => {
    vi.spyOn(employeeRepository, 'findByEmployeeCode').mockResolvedValueOnce(null);
    vi.spyOn(employeeRepository, 'createEmployee').mockResolvedValueOnce(mockEmployee);

    const payload = {
      employeeCode: 'EMP-001',
      firstName: 'Priya',
      lastName: 'Sharma',
      displayName: 'Priya Sharma',
      mobilePhone: '+919876543210',
      jobTitle: 'Senior Stylist',
    };

    const res = await request(app)
      .post('/api/v1/staff')
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.employeeCode).toBe('EMP-001');
  });

  it('POST /api/v1/staff should reject duplicate employeeCode with 409 Conflict', async () => {
    vi.spyOn(employeeRepository, 'findByEmployeeCode').mockResolvedValueOnce(mockEmployee);

    const payload = {
      employeeCode: 'EMP-001',
      firstName: 'Priya',
      lastName: 'Sharma',
      displayName: 'Priya Sharma',
      mobilePhone: '+919876543210',
      jobTitle: 'Senior Stylist',
    };

    const res = await request(app)
      .post('/api/v1/staff')
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send(payload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('PATCH /api/v1/staff/:id should update employee fields', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(employeeRepository, 'updateEmployee').mockResolvedValueOnce({
      ...mockEmployee,
      jobTitle: 'Lead Hair Stylist',
    });

    const res = await request(app)
      .patch(`/api/v1/staff/${testEmployeeId}`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({ jobTitle: 'Lead Hair Stylist' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.jobTitle).toBe('Lead Hair Stylist');
  });

  it('DELETE /api/v1/staff/:id should perform soft-delete', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(employeeRepository, 'softDeleteEmployee').mockResolvedValueOnce({
      ...mockEmployee,
      employmentStatus: 'TERMINATED',
    });

    const res = await request(app)
      .delete(`/api/v1/staff/${testEmployeeId}`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({ reason: 'Contract ended' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.employmentStatus).toBe('TERMINATED');
  });

  it('GET /api/v1/staff/me should resolve profile for authenticated Staff User principal', async () => {
    const testUserId = '55555555-5555-5555-5555-555555555555';
    vi.spyOn(employeeRepository, 'findByIdentityUserId').mockResolvedValueOnce({
      ...mockEmployee,
      identityUserId: testUserId,
    });

    const res = await request(app)
      .get('/api/v1/staff/me')
      .set('x-principal-type', 'USER')
      .set('x-user-id', testUserId)
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.displayName).toBe('Priya Sharma');
  });
});
