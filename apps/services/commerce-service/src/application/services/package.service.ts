import { NotFoundError } from '@salon-spa-saas/common-types';
import type { CreatePackageRequest } from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import type { PackageMasterDto } from '../../domain/entities/commerce.dto';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { packageRepository } from '../../infrastructure/repositories/package.repository';

export class PackageService {
  public async listPackages(tenantId: string): Promise<PackageMasterDto[]> {
    return packageRepository.list(tenantId);
  }

  public async getPackageById(tenantId: string, id: string): Promise<PackageMasterDto> {
    const pkg = await packageRepository.findById(tenantId, id);
    if (!pkg) throw new NotFoundError('Package not found');
    return pkg;
  }

  public async createPackage(
    tenantId: string,
    input: CreatePackageRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<PackageMasterDto> {
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

  public async updatePackage(
    tenantId: string,
    id: string,
    input: Partial<CreatePackageRequest>,
  ): Promise<PackageMasterDto> {
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

  public async listPackageUsage(tenantId: string) {

    return packageRepository.listPackageUsage(tenantId);
  }

  public async createPackageRedemption(
    tenantId: string,
    input: {
      customerPackageId: string;
      serviceId: string;
      appointmentId?: string | null;
      quantity?: number;
    },
  ) {
    return packageRepository.createPackageRedemption({
      tenantId,
      ...input,
    });
  }

  public async getPackagesAnalytics(tenantId: string) {
    return packageRepository.getPackagesAnalytics(tenantId);
  }
}

export const packageService = new PackageService();
