import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPeopleApp } from '../../src/app';
import { organizationClient } from '../../src/infrastructure/clients/organization.client';
import { employeeRepository } from '../../src/infrastructure/repositories/employee.repository';
import { staffBranchRepository } from '../../src/infrastructure/repositories/staff-branch.repository';

describe('Staff Branch Assignment API Endpoints', () => {
  const app = buildPeopleApp();
  const testTenantId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const testEmployeeId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const testBranchId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  const testAssignmentId = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

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

  const mockAssignment = {
    id: testAssignmentId,
    employeeId: testEmployeeId,
    tenantId: testTenantId,
    branchId: testBranchId,
    isPrimary: true,
    effectiveFrom: new Date().toISOString(),
    effectiveTo: null,
    status: 'ACTIVE',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/staff/:id/branches should return employee branch assignments', async () => {
    vi.spyOn(staffBranchRepository, 'findAssignmentsByEmployee').mockResolvedValueOnce([mockAssignment]);

    const res = await request(app)
      .get(`/api/v1/staff/${testEmployeeId}/branches`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].branchId).toBe(testBranchId);
  });

  it('POST /api/v1/staff/:id/branches should assign employee to branch after validating organization', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(organizationClient, 'validateBranch').mockResolvedValueOnce({
      isValid: true,
      branchName: 'Downtown Branch',
      isActive: true,
    });
    vi.spyOn(staffBranchRepository, 'assignBranch').mockResolvedValueOnce(mockAssignment);

    const res = await request(app)
      .post(`/api/v1/staff/${testEmployeeId}/branches`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({
        branchId: testBranchId,
        isPrimary: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.branchId).toBe(testBranchId);
  });

  it('DELETE /api/v1/staff/:id/branches/:assignmentId should remove assignment', async () => {
    vi.spyOn(staffBranchRepository, 'findAssignmentById').mockResolvedValueOnce(mockAssignment);
    vi.spyOn(staffBranchRepository, 'removeAssignment').mockResolvedValueOnce(mockAssignment);

    const res = await request(app)
      .delete(`/api/v1/staff/${testEmployeeId}/branches/${testAssignmentId}`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
