import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EntitlementService } from '../../src/application/services/entitlement.service';
import { SubscriptionStatus } from '../../src/infrastructure/prisma/generated-client';

describe('EntitlementService - 3-tier resolution', () => {
  let entitlementService: EntitlementService;
  let mockSubRepo: any;
  let mockPlanRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      getEntitlements: vi.fn().mockResolvedValue(null),
      setEntitlements: vi.fn().mockResolvedValue(undefined),
      invalidateEntitlements: vi.fn().mockResolvedValue(undefined),
    };

    mockPlanRepo = {
      listFeatures: vi.fn().mockResolvedValue([
        { id: 'f-booking', key: 'BOOKING', name: 'Booking', isActive: true },
        { id: 'f-franchise', key: 'FRANCHISE', name: 'Franchise', isActive: true },
        { id: 'f-custom-domain', key: 'CUSTOM_DOMAIN', name: 'Custom Domain', isActive: true },
      ]),
    };

    mockSubRepo = {
      findByTenantId: vi.fn(),
      findOverridesByTenantId: vi.fn(),
    };

    entitlementService = new EntitlementService(mockSubRepo, mockPlanRepo, mockCache);
  });

  it('should return expired/empty entitlements if tenant has no active subscription', async () => {
    mockSubRepo.findByTenantId.mockResolvedValue(null);
    mockSubRepo.findOverridesByTenantId.mockResolvedValue([]);

    const result = await entitlementService.getEffectiveEntitlements('tenant-123');

    expect(result.tenantId).toBe('tenant-123');
    expect(result.subscriptionStatus).toBe('EXPIRED');
    expect(result.planCode).toBe('NONE');
    expect(result.limits.maxBranches).toBe(0);
  });

  it('should resolve plan features when active subscription is present', async () => {
    mockSubRepo.findByTenantId.mockResolvedValue({
      id: 'sub-1',
      tenantId: 'tenant-123',
      status: SubscriptionStatus.ACTIVE,
      plan: {
        id: 'p-growth',
        code: 'GROWTH',
        maxBranches: 5,
        maxStaff: 25,
        maxCustomers: 5000,
        planFeatures: [
          { featureId: 'f-booking', enabled: true },
          { featureId: 'f-franchise', enabled: false },
        ],
      },
    });
    mockSubRepo.findOverridesByTenantId.mockResolvedValue([]);

    const result = await entitlementService.getEffectiveEntitlements('tenant-123');

    expect(result.subscriptionStatus).toBe(SubscriptionStatus.ACTIVE);
    expect(result.planCode).toBe('GROWTH');
    expect(result.features.BOOKING.enabled).toBe(true);
    expect(result.features.FRANCHISE.enabled).toBe(false);
    expect(result.features.CUSTOM_DOMAIN.enabled).toBe(false);
    expect(result.limits.maxBranches).toBe(5);
  });

  it('should give highest priority to TenantFeatureOverride over Plan Feature', async () => {
    mockSubRepo.findByTenantId.mockResolvedValue({
      id: 'sub-1',
      tenantId: 'tenant-123',
      status: SubscriptionStatus.ACTIVE,
      plan: {
        id: 'p-starter',
        code: 'STARTER',
        maxBranches: 1,
        maxStaff: 5,
        maxCustomers: 1000,
        planFeatures: [
          { featureId: 'f-booking', enabled: true },
          { featureId: 'f-custom-domain', enabled: false },
        ],
      },
    });

    // Custom domain explicitly enabled for this specific tenant via override
    mockSubRepo.findOverridesByTenantId.mockResolvedValue([
      {
        id: 'ov-1',
        tenantId: 'tenant-123',
        featureId: 'f-custom-domain',
        enabled: true,
        limitValue: 2,
        effectiveFrom: new Date(Date.now() - 10000),
        effectiveTo: null,
      },
    ]);

    const result = await entitlementService.getEffectiveEntitlements('tenant-123');

    expect(result.features.CUSTOM_DOMAIN.enabled).toBe(true);
    expect(result.features.CUSTOM_DOMAIN.limitValue).toBe(2);
  });

  it('should disable features if subscription status is SUSPENDED', async () => {
    mockSubRepo.findByTenantId.mockResolvedValue({
      id: 'sub-1',
      tenantId: 'tenant-123',
      status: SubscriptionStatus.SUSPENDED,
      plan: {
        id: 'p-growth',
        code: 'GROWTH',
        planFeatures: [{ featureId: 'f-booking', enabled: true }],
      },
    });
    mockSubRepo.findOverridesByTenantId.mockResolvedValue([]);

    const result = await entitlementService.getEffectiveEntitlements('tenant-123');

    expect(result.subscriptionStatus).toBe(SubscriptionStatus.SUSPENDED);
    expect(result.features.BOOKING.enabled).toBe(false);
  });
});
