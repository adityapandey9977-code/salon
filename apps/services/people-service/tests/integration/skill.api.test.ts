import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPeopleApp } from '../../src/app';
import { commerceClient } from '../../src/infrastructure/clients/commerce.client';
import { employeeRepository } from '../../src/infrastructure/repositories/employee.repository';
import { staffSkillRepository } from '../../src/infrastructure/repositories/staff-skill.repository';

describe('Staff Skill API Endpoints', () => {
  const app = buildPeopleApp();
  const testTenantId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const testEmployeeId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const testServiceId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  const testSkillId = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

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

  const mockSkill = {
    id: testSkillId,
    employeeId: testEmployeeId,
    tenantId: testTenantId,
    serviceId: testServiceId,
    skillLevel: 'SENIOR' as const,
    yearsExperience: 5.5,
    isPrimary: true,
    isActive: true,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/staff/:id/skills should return employee skills', async () => {
    vi.spyOn(staffSkillRepository, 'findSkillsByEmployee').mockResolvedValueOnce([mockSkill]);

    const res = await request(app)
      .get(`/api/v1/staff/${testEmployeeId}/skills`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].serviceId).toBe(testServiceId);
  });

  it('POST /api/v1/staff/:id/skills should add a skill to staff member', async () => {
    vi.spyOn(employeeRepository, 'findById').mockResolvedValueOnce(mockEmployee);
    vi.spyOn(commerceClient, 'validateServiceId').mockResolvedValueOnce({ isValid: true });
    vi.spyOn(staffSkillRepository, 'addSkill').mockResolvedValueOnce(mockSkill);

    const res = await request(app)
      .post(`/api/v1/staff/${testEmployeeId}/skills`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId)
      .send({
        serviceId: testServiceId,
        skillLevel: 'SENIOR',
        yearsExperience: 5.5,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.skillLevel).toBe('SENIOR');
  });

  it('DELETE /api/v1/staff/:id/skills/:skillId should remove skill', async () => {
    vi.spyOn(staffSkillRepository, 'findSkillById').mockResolvedValueOnce(mockSkill);
    vi.spyOn(staffSkillRepository, 'removeSkill').mockResolvedValueOnce(mockSkill);

    const res = await request(app)
      .delete(`/api/v1/staff/${testEmployeeId}/skills/${testSkillId}`)
      .set('x-principal-type', 'TENANT')
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
