import { NotFoundError } from '@salon-spa-saas/common-types';
import type {
  CreateServiceCategoryRequest,
  CreateServiceRecipeRequest,
  CreateServiceRequest,
  QueryServicesRequest,
  SetBranchPriceRequest,
  UpdateServiceCategoryRequest,
  UpdateServiceRequest,
} from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import type { CachedServiceMaster, ServiceCategoryDto } from '../../domain/entities/commerce.dto';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { commerceReadStore } from '../../infrastructure/redis/commerce-read.store';
import { serviceRepository } from '../../infrastructure/repositories/service.repository';

export class CatalogueService {
  // Category operations
  public async listCategories(tenantId: string): Promise<ServiceCategoryDto[]> {
    return serviceRepository.listCategories(tenantId);
  }

  public async createCategory(
    tenantId: string,
    input: CreateServiceCategoryRequest,
  ): Promise<ServiceCategoryDto> {
    return serviceRepository.createCategory({
      tenantId,
      name: input.name,
      code: input.code,
      description: input.description,
      sortOrder: input.sortOrder,
      imageUrl: input.imageUrl,
      accentColor: input.accentColor,
      isActive: input.isActive,
    });
  }

  public async updateCategory(
    tenantId: string,
    id: string,
    input: UpdateServiceCategoryRequest,
  ): Promise<ServiceCategoryDto> {
    return serviceRepository.updateCategory(tenantId, id, input);
  }

  public async deleteCategory(tenantId: string, id: string): Promise<void> {
    await serviceRepository.deleteCategory(tenantId, id);
  }

  // Service operations
  public async getServiceDetail(tenantId: string, serviceId: string): Promise<CachedServiceMaster> {
    const cached = await commerceReadStore.getService(tenantId, serviceId);
    if (cached) return cached;

    const service = await serviceRepository.findById(tenantId, serviceId);
    if (!service) throw new NotFoundError('Service not found');

    await commerceReadStore.setService(tenantId, service);
    return service;
  }

  public async getBranchServicePrice(
    tenantId: string,
    serviceId: string,
    branchId: string,
  ): Promise<{ service: CachedServiceMaster; effectivePrice: number }> {
    return serviceRepository.findByBranch(tenantId, serviceId, branchId);
  }

  public async listServices(
    tenantId: string,
    query: QueryServicesRequest,
  ): Promise<{ items: CachedServiceMaster[]; total: number; page: number; limit: number }> {
    const isActive = query.isActive !== undefined ? query.isActive === 'true' : undefined;
    const isBookableOnline =
      query.isBookableOnline !== undefined ? query.isBookableOnline === 'true' : undefined;

    return serviceRepository.list(tenantId, {
      categoryId: query.categoryId,
      search: query.search,
      isActive,
      isBookableOnline,
      page: query.page,
      limit: query.limit,
    });
  }

  public async createService(
    tenantId: string,
    input: CreateServiceRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<CachedServiceMaster> {
    const created = await serviceRepository.create({
      tenantId,
      categoryId: input.categoryId,
      code: input.code,
      name: input.name,
      description: input.description,
      durationMinutes: input.durationMinutes,
      bufferBeforeMinutes: input.bufferBeforeMinutes,
      bufferAfterMinutes: input.bufferAfterMinutes,
      basePrice: input.basePrice,
      gstRate: input.gstRate,
      taxCode: input.taxCode,
      sacCode: input.sacCode,
      requiresConsultation: input.requiresConsultation,
      requiresPatchTest: input.requiresPatchTest,
      isActive: input.isActive,
      isBookableOnline: input.isBookableOnline,
      imageUrl: input.imageUrl,
      requiredSkill: input.requiredSkill,
      requiredLevel: input.requiredLevel,
      requiredRoomOrChair: input.requiredRoomOrChair,
      requiredEquipment: input.requiredEquipment,
      pricingMode: input.pricingMode,
      discountEligible: input.discountEligible,
      availableBranches: input.availableBranches,
      metadata: input.metadata,
    });

    await commerceReadStore.setService(tenantId, created);

    await commerceEventPublisher.publish({
      eventType: DOMAIN_EVENTS.SERVICE_CREATED,
      aggregateType: 'Service',
      aggregateId: created.id,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        serviceId: created.id,
        code: created.code,
        name: created.name,
        basePrice: created.basePrice,
        durationMinutes: created.durationMinutes,
      },
    });

    return created;
  }

  public async updateService(
    tenantId: string,
    serviceId: string,
    input: UpdateServiceRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<CachedServiceMaster> {
    const updated = await serviceRepository.update(tenantId, serviceId, input as any);

    await commerceReadStore.invalidateService(tenantId, serviceId);
    await commerceReadStore.setService(tenantId, updated);

    await commerceEventPublisher.publish({
      eventType: DOMAIN_EVENTS.SERVICE_UPDATED,
      aggregateType: 'Service',
      aggregateId: serviceId,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        serviceId,
        updatedFields: Object.keys(input),
      },
    });

    return updated;
  }

  public async deleteService(
    tenantId: string,
    serviceId: string,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<void> {
    await serviceRepository.delete(tenantId, serviceId);
    await commerceReadStore.invalidateService(tenantId, serviceId);

    await commerceEventPublisher.publish({
      eventType: DOMAIN_EVENTS.SERVICE_DELETED,
      aggregateType: 'Service',
      aggregateId: serviceId,
      tenantId,
      userId,
      correlationId,
      payload: { tenantId, serviceId },
    });
  }

  public async setBranchPrice(
    tenantId: string,
    serviceId: string,
    input: SetBranchPriceRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<void> {
    await serviceRepository.setBranchPrice({
      tenantId,
      serviceId,
      branchId: input.branchId,
      price: input.price,
      effectiveFrom: input.effectiveFrom ? new Date(input.effectiveFrom) : null,
      effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null,
      isActive: input.isActive,
    });

    await commerceReadStore.invalidateService(tenantId, serviceId);

    await commerceEventPublisher.publish({
      eventType: DOMAIN_EVENTS.SERVICE_PRICE_UPDATED,
      aggregateType: 'Service',
      aggregateId: serviceId,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        serviceId,
        branchId: input.branchId,
        price: input.price,
      },
    });
  }

  public async setRecipe(
    tenantId: string,
    serviceId: string,
    input: CreateServiceRecipeRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<void> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validatedItems = input.items.map((it, idx) => ({
      ...it,
      skuId: uuidRegex.test(it.skuId)
        ? it.skuId
        : `00000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`,
    }));

    await serviceRepository.setRecipe({
      tenantId,
      serviceId,
      name: input.name,
      description: input.description,
      version: input.version,
      items: validatedItems,
    });

    await commerceEventPublisher.publish({
      eventType: DOMAIN_EVENTS.SERVICE_RECIPE_UPDATED,
      aggregateType: 'ServiceRecipe',
      aggregateId: serviceId,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        serviceId,
        itemCount: input.items.length,
      },
    });
  }

  // Skills operations
  public async listSkills(tenantId: string): Promise<any[]> {
    return serviceRepository.listSkills(tenantId);
  }

  public async seedSkills(tenantId: string): Promise<any[]> {
    return serviceRepository.seedStandardSkills(tenantId);
  }

  public async createSkill(tenantId: string, input: any): Promise<any> {
    return serviceRepository.createSkill(tenantId, input);
  }

  public async updateSkill(tenantId: string, id: string, input: any): Promise<any> {
    return serviceRepository.updateSkill(tenantId, id, input);
  }

  public async deleteSkill(tenantId: string, id: string): Promise<void> {
    await serviceRepository.deleteSkill(tenantId, id);
  }
}

export const catalogueService = new CatalogueService();
