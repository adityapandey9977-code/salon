import { NotFoundError } from '@salon-spa-saas/common-types';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { packageRepository } from '../../infrastructure/repositories/package.repository';
export class PackageService {
    async listPackages(tenantId) {
        return packageRepository.list(tenantId);
    }
    async getPackageById(tenantId, id) {
        const pkg = await packageRepository.findById(tenantId, id);
        if (!pkg)
            throw new NotFoundError('Package not found');
        return pkg;
    }
    async createPackage(tenantId, input, userId = null, correlationId) {
        const created = await packageRepository.create({
            tenantId,
            code: input.code,
            name: input.name,
            description: input.description,
            price: input.price,
            validityDays: input.validityDays,
            isShared: input.isShared,
            isActive: input.isActive,
            durationMins: input.durationMins,
            salesCount: input.salesCount,
            imageUrl: input.imageUrl,
            includedServicesText: input.includedServicesText,
            items: input.items,
        });
        await commerceEventPublisher.publish({
            eventType: DOMAIN_EVENTS.PACKAGE_PURCHASED,
            aggregateType: 'Package',
            aggregateId: created.id,
            tenantId,
            userId,
            correlationId,
            payload: {
                tenantId,
                packageId: created.id,
                name: created.name,
                price: created.price,
            },
        });
        return created;
    }
    async updatePackage(tenantId, id, input) {
        return packageRepository.update(tenantId, id, {
            name: input.name,
            description: input.description,
            price: input.price,
            validityDays: input.validityDays,
            isShared: input.isShared,
            isActive: input.isActive,
            includedServicesText: input.includedServicesText,
        });
    }
    async listPackageUsage(tenantId) {
        return packageRepository.listPackageUsage(tenantId);
    }
    async createPackageRedemption(tenantId, input) {
        return packageRepository.createPackageRedemption({
            tenantId,
            ...input,
        });
    }
    async getPackagesAnalytics(tenantId) {
        return packageRepository.getPackagesAnalytics(tenantId);
    }
}
export const packageService = new PackageService();
