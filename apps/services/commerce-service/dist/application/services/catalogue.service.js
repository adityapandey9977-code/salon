import { NotFoundError } from '@salon-spa-saas/common-types';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { commerceReadStore } from '../../infrastructure/redis/commerce-read.store';
import { serviceRepository } from '../../infrastructure/repositories/service.repository';
export class CatalogueService {
    // Category operations
    async listCategories(tenantId) {
        return serviceRepository.listCategories(tenantId);
    }
    async createCategory(tenantId, input) {
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
    async updateCategory(tenantId, id, input) {
        return serviceRepository.updateCategory(tenantId, id, input);
    }
    async deleteCategory(tenantId, id) {
        await serviceRepository.deleteCategory(tenantId, id);
    }
    // Service operations
    async getServiceDetail(tenantId, serviceId) {
        const cached = await commerceReadStore.getService(tenantId, serviceId);
        if (cached)
            return cached;
        const service = await serviceRepository.findById(tenantId, serviceId);
        if (!service)
            throw new NotFoundError('Service not found');
        await commerceReadStore.setService(tenantId, service);
        return service;
    }
    async getBranchServicePrice(tenantId, serviceId, branchId) {
        return serviceRepository.findByBranch(tenantId, serviceId, branchId);
    }
    async listServices(tenantId, query) {
        const isActive = query.isActive !== undefined ? query.isActive === 'true' : undefined;
        const isBookableOnline = query.isBookableOnline !== undefined ? query.isBookableOnline === 'true' : undefined;
        return serviceRepository.list(tenantId, {
            categoryId: query.categoryId,
            search: query.search,
            isActive,
            isBookableOnline,
            page: query.page,
            limit: query.limit,
        });
    }
    async createService(tenantId, input, userId = null, correlationId) {
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
    async updateService(tenantId, serviceId, input, userId = null, correlationId) {
        const updated = await serviceRepository.update(tenantId, serviceId, input);
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
    async deleteService(tenantId, serviceId, userId = null, correlationId) {
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
    async setBranchPrice(tenantId, serviceId, input, userId = null, correlationId) {
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
    async setRecipe(tenantId, serviceId, input, userId = null, correlationId) {
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
    async listSkills(tenantId) {
        return serviceRepository.listSkills(tenantId);
    }
    async seedSkills(tenantId) {
        return serviceRepository.seedStandardSkills(tenantId);
    }
    async createSkill(tenantId, input) {
        return serviceRepository.createSkill(tenantId, input);
    }
    async updateSkill(tenantId, id, input) {
        return serviceRepository.updateSkill(tenantId, id, input);
    }
    async deleteSkill(tenantId, id) {
        await serviceRepository.deleteSkill(tenantId, id);
    }
}
export const catalogueService = new CatalogueService();
