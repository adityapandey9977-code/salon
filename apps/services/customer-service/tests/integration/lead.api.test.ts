import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app';
import { leadService } from '../../src/application/services/lead.service';

vi.mock('../../src/application/services/lead.service', () => ({
  leadService: {
    listLeads: vi.fn(),
    getLeadById: vi.fn(),
    createLead: vi.fn(),
    updateLeadStatus: vi.fn(),
    convertLead: vi.fn(),
  },
}));

describe('Lead API Endpoints', () => {
  const app = createApp();
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const leadId = '33333333-3333-3333-3333-333333333333';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/v1/customers/leads should create a lead', async () => {
    vi.mocked(leadService.createLead).mockResolvedValueOnce({
      id: leadId,
      tenantId,
      firstName: 'Rahul',
      lastName: 'Verma',
      mobilePhone: '9898989898',
      email: 'rahul@example.com',
      source: 'WALK_IN',
      status: 'NEW',
      preferredBranchId: null,
      interestedServiceId: null,
      assignedIdentityUserId: null,
      inquiryNotes: 'Interested in haircut & spa',
      convertedCustomerId: null,
      convertedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/v1/customers/leads')
      .set('x-tenant-id', tenantId)
      .set('x-principal-type', 'TENANT')
      .send({
        firstName: 'Rahul',
        lastName: 'Verma',
        mobilePhone: '9898989898',
        email: 'rahul@example.com',
        inquiryNotes: 'Interested in haircut & spa',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(leadId);
  });
});
