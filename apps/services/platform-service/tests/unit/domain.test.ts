import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DomainService } from '../../src/application/services/domain.service';
import { BadRequestError, ConflictError } from '@salon-spa-saas/common-types';
import { DomainStatus, DomainType } from '../../src/infrastructure/prisma/generated-client';

describe('DomainService', () => {
  let domainService: DomainService;
  let mockDomainRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      getDomains: vi.fn().mockResolvedValue(null),
      setDomains: vi.fn().mockResolvedValue(undefined),
      invalidateDomains: vi.fn().mockResolvedValue(undefined),
      getDomainResolution: vi.fn().mockResolvedValue(null),
      setDomainResolution: vi.fn().mockResolvedValue(undefined),
      invalidateDomainResolution: vi.fn().mockResolvedValue(undefined),
    };

    mockDomainRepo = {
      findDomainById: vi.fn(),
      findDomainByHostname: vi.fn(),
      listDomainsByTenantId: vi.fn(),
      createDomain: vi.fn(),
      updateDomainStatus: vi.fn(),
      deleteDomain: vi.fn(),
      findBrandingByTenantId: vi.fn(),
      upsertBranding: vi.fn(),
    };

    domainService = new DomainService(mockDomainRepo, mockCache);
  });

  it('should reject invalid hostname format', async () => {
    await expect(
      domainService.addDomain({
        tenantId: 'tenant-123',
        hostname: 'invalid_hostname!@#',
      })
    ).rejects.toThrow(BadRequestError);
  });

  it('should reject duplicate hostname registration', async () => {
    mockDomainRepo.findDomainByHostname.mockResolvedValue({
      id: 'dom-1',
      hostname: 'salon.example.com',
      tenantId: 'tenant-999',
    });

    await expect(
      domainService.addDomain({
        tenantId: 'tenant-123',
        hostname: 'salon.example.com',
      })
    ).rejects.toThrow(ConflictError);
  });

  it('should successfully add and normalize valid hostname', async () => {
    mockDomainRepo.findDomainByHostname.mockResolvedValue(null);
    mockDomainRepo.createDomain.mockImplementation((data) => ({
      id: 'dom-2',
      ...data,
      status: DomainStatus.PENDING,
    }));

    const result = await domainService.addDomain({
      tenantId: 'tenant-123',
      hostname: '  SALON.MySpa.COM  ',
      domainType: DomainType.BOOKING,
    });

    expect(mockDomainRepo.createDomain).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'tenant-123',
        hostname: 'salon.myspa.com',
        domainType: DomainType.BOOKING,
      })
    );
    expect(result.id).toBe('dom-2');
  });
});
