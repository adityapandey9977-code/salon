import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app';
import { customerService } from '../../src/application/services/customer.service';

vi.mock('../../src/application/services/customer.service', () => ({
  customerService: {
    listCustomers: vi.fn(),
    getCustomerDetail: vi.fn(),
    createCustomer: vi.fn(),
    updateCustomer: vi.fn(),
    softDeleteCustomer: vi.fn(),
    getDormantCustomers: vi.fn(),
  },
}));

describe('Customer API Endpoints', () => {
  const app = createApp();
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const customerId = '22222222-2222-2222-2222-222222222222';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/customers should list customers with tenant context', async () => {
    vi.mocked(customerService.listCustomers).mockResolvedValueOnce({
      items: [
        {
          id: customerId,
          tenantId,
          customerCode: 'CUST-001',
          firstName: 'Ananya',
          lastName: 'Sharma',
          displayName: 'Ananya Sharma',
          mobilePhone: '9876543210',
          email: 'ananya@example.com',
          gender: 'FEMALE',
          status: 'ACTIVE',
          preferredBranchId: null,
          totalVisits: 5,
          totalSpent: 4500,
          lastVisitAt: null,
          firstVisitAt: null,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });

    const res = await request(app)
      .get('/api/v1/customers')
      .set('x-tenant-id', tenantId)
      .set('x-principal-type', 'TENANT');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].displayName).toBe('Ananya Sharma');
  });

  it('POST /api/v1/customers should create a new customer', async () => {
    vi.mocked(customerService.createCustomer).mockResolvedValueOnce({
      id: customerId,
      tenantId,
      customerCode: 'CUST-001',
      firstName: 'Ananya',
      lastName: 'Sharma',
      displayName: 'Ananya Sharma',
      email: 'ananya@example.com',
      mobilePhone: '9876543210',
      alternatePhone: null,
      gender: 'FEMALE',
      dateOfBirth: '1995-05-15',
      status: 'ACTIVE',
      preferredBranchId: null,
      source: 'WALK_IN',
      notes: null,
      totalVisits: 0,
      totalSpent: 0,
      lastVisitAt: null,
      firstVisitAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/v1/customers')
      .set('x-tenant-id', tenantId)
      .set('x-principal-type', 'TENANT')
      .send({
        firstName: 'Ananya',
        lastName: 'Sharma',
        mobilePhone: '9876543210',
        email: 'ananya@example.com',
        gender: 'FEMALE',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customerCode).toBe('CUST-001');
  });

  it('GET /api/v1/customers/:id should return single customer detail', async () => {
    vi.mocked(customerService.getCustomerDetail).mockResolvedValueOnce({
      id: customerId,
      tenantId,
      customerCode: 'CUST-001',
      firstName: 'Ananya',
      lastName: 'Sharma',
      displayName: 'Ananya Sharma',
      email: 'ananya@example.com',
      mobilePhone: '9876543210',
      alternatePhone: null,
      gender: 'FEMALE',
      dateOfBirth: null,
      status: 'ACTIVE',
      preferredBranchId: null,
      source: 'WALK_IN',
      notes: null,
      totalVisits: 1,
      totalSpent: 1200,
      lastVisitAt: null,
      firstVisitAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const res = await request(app)
      .get(`/api/v1/customers/${customerId}`)
      .set('x-tenant-id', tenantId)
      .set('x-principal-type', 'TENANT');

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(customerId);
  });
});
