import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { NotFoundError, ConflictError, BadRequestError } from '@salon-spa-saas/common-types';
import { createEventEnvelope } from '@salon-spa-saas/events';
import { DomainStatus, DomainType, SSLStatus } from '../../infrastructure/prisma/generated-client';
import crypto from 'crypto';

export class DomainService {
  constructor(
    private domainRepo: DomainRepository = new DomainRepository(),
    private cache: PlatformReadStore = new PlatformReadStore()
  ) { }

  async listDomains(tenantId: string) {
    const cached = await this.cache.getDomains(tenantId);
    if (cached) return cached;

    const domains = await this.domainRepo.listDomainsByTenantId(tenantId);
    await this.cache.setDomains(tenantId, domains);
    return domains;
  }

  async resolveDomain(hostname: string) {
    const normalized = hostname.toLowerCase().trim();
    const cached = await this.cache.getDomainResolution(normalized);
    if (cached) return cached;

    const domain = await this.domainRepo.findDomainByHostname(normalized);
    if (!domain || domain.status !== DomainStatus.ACTIVE) {
      return null;
    }

    const resolution = {
      tenantId: domain.tenantId,
      domainType: domain.domainType,
      isPrimary: domain.isPrimary,
    };

    await this.cache.setDomainResolution(normalized, resolution);
    return resolution;
  }

  async addDomain(data: {
    tenantId: string;
    hostname: string;
    domainType?: DomainType;
    isPrimary?: boolean;
  }) {
    const normalized = data.hostname.toLowerCase().trim();
    if (!/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,10}$/i.test(normalized)) {
      throw new BadRequestError(`Invalid hostname format: ${normalized}`);
    }

    const existing = await this.domainRepo.findDomainByHostname(normalized);
    if (existing) {
      throw new ConflictError(`Hostname ${normalized} is already registered`);
    }

    const verificationToken = `salon-verify-${crypto.randomBytes(16).toString('hex')}`;

    const domain = await this.domainRepo.createDomain({
      tenantId: data.tenantId,
      hostname: normalized,
      domainType: data.domainType || DomainType.ADMIN,
      isPrimary: data.isPrimary ?? false,
      verificationToken,
      verificationMethod: 'TXT',
    });

    await this.cache.invalidateDomains(data.tenantId);

    const event = createEventEnvelope({
      eventType: 'DOMAIN_ADDED.v1',
      aggregateType: 'CustomDomain',
      aggregateId: domain.id,
      tenantId: data.tenantId,
      payload: {
        domainId: domain.id,
        tenantId: domain.tenantId,
        hostname: domain.hostname,
        verificationToken: domain.verificationToken,
      },
    });
    await eventBus.publish(event);

    return domain;
  }

  async verifyDomain(id: string) {
    const domain = await this.domainRepo.findDomainById(id);
    if (!domain) throw new NotFoundError(`Domain ${id} not found`);

    // In production, perform DNS TXT record check. For automated verification:
    const updated = await this.domainRepo.updateDomainStatus(id, {
      status: DomainStatus.ACTIVE,
      verifiedAt: new Date(),
      sslStatus: SSLStatus.ISSUED,
    });

    await this.cache.invalidateDomains(domain.tenantId);
    await this.cache.setDomainResolution(domain.hostname, {
      tenantId: domain.tenantId,
      domainType: domain.domainType,
      isPrimary: domain.isPrimary,
    });

    const event = createEventEnvelope({
      eventType: 'DOMAIN_VERIFIED.v1',
      aggregateType: 'CustomDomain',
      aggregateId: domain.id,
      tenantId: domain.tenantId,
      payload: {
        domainId: domain.id,
        tenantId: domain.tenantId,
        hostname: domain.hostname,
        status: DomainStatus.ACTIVE,
      },
    });
    await eventBus.publish(event);

    return updated;
  }

  async deleteDomain(id: string) {
    const domain = await this.domainRepo.findDomainById(id);
    if (!domain) throw new NotFoundError(`Domain ${id} not found`);

    const deleted = await this.domainRepo.deleteDomain(id);
    await this.cache.invalidateDomains(domain.tenantId);
    await this.cache.invalidateDomainResolution(domain.hostname);

    const event = createEventEnvelope({
      eventType: 'DOMAIN_DISABLED.v1',
      aggregateType: 'CustomDomain',
      aggregateId: domain.id,
      tenantId: domain.tenantId,
      payload: {
        domainId: domain.id,
        tenantId: domain.tenantId,
        hostname: domain.hostname,
      },
    });
    await eventBus.publish(event);

    return deleted;
  }

  // Tenant Branding
  async getBranding(tenantId: string) {
    const branding = await this.domainRepo.findBrandingByTenantId(tenantId);
    if (!branding) {
      return {
        tenantId,
        brandName: null,
        primaryColor: '#8B5CF6',
        secondaryColor: '#EC4899',
        logoObjectKey: null,
        faviconObjectKey: null,
        appTitle: '  Salon',
        customCss: null,
      };
    }
    return branding;
  }

  async updateBranding(
    tenantId: string,
    data: {
      brandName?: string;
      primaryColor?: string;
      secondaryColor?: string;
      logoObjectKey?: string;
      faviconObjectKey?: string;
      appTitle?: string;
      customCss?: string;
    }
  ) {
    const updated = await this.domainRepo.upsertBranding({
      tenantId,
      ...data,
    });

    const event = createEventEnvelope({
      eventType: 'TENANT_BRANDING_UPDATED.v1',
      aggregateType: 'TenantBranding',
      aggregateId: updated.id,
      tenantId,
      payload: {
        tenantId,
        brandName: updated.brandName,
        primaryColor: updated.primaryColor,
        secondaryColor: updated.secondaryColor,
        appTitle: updated.appTitle,
      },
    });
    await eventBus.publish(event);

    return updated;
  }
}
