import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { NotFoundError, ConflictError } from '@salon-spa-saas/common-types';
export class SkuService {
    skuRepo;
    cache;
    constructor(skuRepo = new SkuRepository(), cache = new InventoryReadStore()) {
        this.skuRepo = skuRepo;
        this.cache = cache;
    }
    async listSkus(tenantId, filter) {
        return this.skuRepo.listSkus(tenantId, filter);
    }
    async getSkuById(tenantId, id) {
        const cached = await this.cache.getSku(tenantId, id);
        if (cached)
            return cached;
        const sku = await this.skuRepo.findById(tenantId, id);
        if (!sku)
            throw new NotFoundError(`SKU with id ${id} not found`);
        await this.cache.setSku(tenantId, id, sku);
        return sku;
    }
    async createSku(tenantId, data) {
        const existing = await this.skuRepo.findByCode(tenantId, data.skuCode);
        if (existing)
            throw new ConflictError(`SKU code ${data.skuCode} already exists for this tenant`);
        const sku = await this.skuRepo.createSku(tenantId, data);
        await eventBus.publish({
            eventType: 'SKU_CREATED.v1',
            aggregateType: 'InventorySku',
            aggregateId: sku.id,
            tenantId,
            payload: {
                skuId: sku.id,
                tenantId,
                skuCode: sku.skuCode,
                name: sku.name,
                unitOfMeasure: sku.unitOfMeasure,
                isConsumable: sku.isConsumable,
                isRetail: sku.isRetail,
            },
        });
        return sku;
    }
    async updateSku(tenantId, id, data) {
        await this.getSkuById(tenantId, id);
        const updated = await this.skuRepo.updateSku(tenantId, id, data);
        await this.cache.invalidateSku(tenantId, id);
        await eventBus.publish({
            eventType: 'SKU_UPDATED.v1',
            aggregateType: 'InventorySku',
            aggregateId: updated.id,
            tenantId,
            payload: {
                skuId: updated.id,
                tenantId,
                skuCode: updated.skuCode,
                name: updated.name,
            },
        });
        return updated;
    }
    async deleteSku(tenantId, id) {
        await this.getSkuById(tenantId, id);
        const deleted = await this.skuRepo.deleteSku(tenantId, id);
        await this.cache.invalidateSku(tenantId, id);
        return { success: true, message: 'SKU deleted successfully' };
    }
    // Categories
    async listCategories(tenantId) {
        return this.skuRepo.listCategories(tenantId);
    }
    async createCategory(tenantId, data) {
        return this.skuRepo.createCategory(tenantId, data);
    }
}
