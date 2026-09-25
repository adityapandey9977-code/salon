import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app';
import { catalogueService } from '../../src/application/services/catalogue.service';

vi.mock('../../src/application/services/catalogue.service', () => ({
  catalogueService: {
    listCategories: vi.fn(),
    createCategory: vi.fn(),
    listServices: vi.fn(),
    getServiceDetail: vi.fn(),
    createService: vi.fn(),
    updateService: vi.fn(),
    setBranchPrice: vi.fn(),
    setRecipe: vi.fn(),
  },
}));

describe('Commerce Service API Endpoints', () => {
  const app = createApp();
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const serviceId = '22222222-2222-2222-2222-222222222222';
  const categoryId = '33333333-3333-3333-3333-333333333333';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/v1/services should return service list', async () => {
    vi.mocked(catalogueService.listServices).mockResolvedValueOnce({
      items: [
        {
          id: serviceId,
          tenantId,
          categoryId,
          code: 'HAIR-001',
          name: 'Classic Haircut',
          description: 'Standard hair cut and wash',
          durationMinutes: 45,
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 5,
          basePrice: 500,
          gstRate: 18,
          taxCode: null,
          sacCode: '9997',
          requiresConsultation: false,
          requiresPatchTest: false,
          isActive: true,
          isBookableOnline: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });

    const res = await request(app)
      .get('/api/v1/services')
      .set('x-tenant-id', tenantId)
      .set('x-principal-type', 'TENANT');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Classic Haircut');
  });

  it('POST /api/v1/services should create a new service', async () => {
    vi.mocked(catalogueService.createService).mockResolvedValueOnce({
      id: serviceId,
      tenantId,
      categoryId,
      code: 'HAIR-001',
      name: 'Classic Haircut',
      description: null,
      durationMinutes: 45,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      basePrice: 500,
      gstRate: 18,
      taxCode: null,
      sacCode: null,
      requiresConsultation: false,
      requiresPatchTest: false,
      isActive: true,
      isBookableOnline: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/v1/services')
      .set('x-tenant-id', tenantId)
      .set('x-principal-type', 'TENANT')
      .send({
        categoryId,
        code: 'HAIR-001',
        name: 'Classic Haircut',
        durationMinutes: 45,
        basePrice: 500,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('HAIR-001');
  });
});
