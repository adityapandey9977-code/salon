import { prisma } from '../prisma/client';
import { DomainStatus, DomainType, SSLStatus, Prisma } from '../prisma/generated-client';

export class DomainRepository {
  // Custom Domains
  async findDomainById(id: string) {
    return prisma.customDomain.findUnique({
      where: { id },
    });
  }

  async findDomainByHostname(hostname: string) {
    return prisma.customDomain.findUnique({
      where: { hostname: hostname.toLowerCase().trim() },
    });
  }

  async listDomainsByTenantId(tenantId: string) {
    return prisma.customDomain.findMany({
      where: { tenantId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async createDomain(data: {
    tenantId: string;
    hostname: string;
    domainType?: DomainType;
    isPrimary?: boolean;
    verificationToken?: string;
    verificationMethod?: string;
  }) {
    return prisma.customDomain.create({
      data: {
        tenantId: data.tenantId,
        hostname: data.hostname.toLowerCase().trim(),
        domainType: data.domainType || DomainType.ADMIN,
        isPrimary: data.isPrimary ?? false,
        verificationToken: data.verificationToken,
        verificationMethod: data.verificationMethod || 'TXT',
        status: DomainStatus.PENDING,
        sslStatus: SSLStatus.PENDING,
      },
    });
  }

  async updateDomainStatus(
    id: string,
    data: {
      status?: DomainStatus;
      verifiedAt?: Date | null;
      sslStatus?: SSLStatus;
      isPrimary?: boolean;
    }
  ) {
    return prisma.customDomain.update({
      where: { id },
      data,
    });
  }

  async deleteDomain(id: string) {
    return prisma.customDomain.delete({
      where: { id },
    });
  }

  // Tenant Branding
  async findBrandingByTenantId(tenantId: string) {
    return prisma.tenantBranding.findUnique({
      where: { tenantId },
    });
  }

  async upsertBranding(data: {
    tenantId: string;
    brandName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    logoObjectKey?: string;
    faviconObjectKey?: string;
    appTitle?: string;
    customCss?: string;
  }) {
    return prisma.tenantBranding.upsert({
      where: { tenantId: data.tenantId },
      create: {
        tenantId: data.tenantId,
        brandName: data.brandName,
        primaryColor: data.primaryColor || '#8B5CF6',
        secondaryColor: data.secondaryColor || '#EC4899',
        logoObjectKey: data.logoObjectKey,
        faviconObjectKey: data.faviconObjectKey,
        appTitle: data.appTitle || '  Salon',
        customCss: data.customCss,
      },
      update: {
        brandName: data.brandName,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        logoObjectKey: data.logoObjectKey,
        faviconObjectKey: data.faviconObjectKey,
        appTitle: data.appTitle,
        customCss: data.customCss,
      },
    });
  }
}
