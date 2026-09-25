import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildPeopleApp } from '../../src/app';
import { availabilityService } from '../../src/application/services/availability.service';

describe('Internal Service APIs (Booking Integration)', () => {
  const app = buildPeopleApp();
  const testTenantId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const testEmployeeId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const testBranchId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  const internalSecret = 'default_internal_secret_32_chars_minimum';

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /internal/v1/staff/:id/availability-context should reject without valid internal secret', async () => {
    const res = await request(app)
      .get(`/internal/v1/staff/${testEmployeeId}/availability-context`)
      .set('x-tenant-id', testTenantId);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /internal/v1/staff/:id/availability-context should return availability snapshot with internal secret', async () => {
    vi.spyOn(availabilityService, 'getStaffAvailabilityContext').mockResolvedValueOnce({
      employeeId: testEmployeeId,
      tenantId: testTenantId,
      displayName: 'Priya Sharma',
      isBookable: true,
      employmentStatus: 'ACTIVE',
      assignedBranchIds: [testBranchId],
      roster: [],
      leaves: [],
      skills: [],
    });

    const res = await request(app)
      .get(`/internal/v1/staff/${testEmployeeId}/availability-context`)
      .set('x-tenant-id', testTenantId)
      .set('x-internal-secret', internalSecret);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.employeeId).toBe(testEmployeeId);
    expect(res.body.data.isBookable).toBe(true);
  });
});
