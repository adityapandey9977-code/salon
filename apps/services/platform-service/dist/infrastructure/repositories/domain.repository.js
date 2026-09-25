import { prisma } from '../prisma/client';
import { DomainStatus, DomainType, SSLStatus } from '../prisma/generated-client';
export class DomainRepository {
    // Custom Domains
    async findDomainById(id) {
        return prisma.customDomain.findUnique({
            where: { id },
        });
    }
    async findDomainByHostname(hostname) {
        return prisma.customDomain.findUnique({
            where: { hostname: hostname.toLowerCase().trim() },
        });
    }
    async listDomainsByTenantId(tenantId) {
        return prisma.customDomain.findMany({
            where: { tenantId },
            orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
        });
    }
    async createDomain(data) {
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
    async updateDomainStatus(id, data) {
        return prisma.customDomain.update({
            where: { id },
            data,
        });
    }
    async deleteDomain(id) {
        return prisma.customDomain.delete({
            where: { id },
        });
    }
    // Tenant Branding
    async findBrandingByTenantId(tenantId) {
        return prisma.tenantBranding.findUnique({
            where: { tenantId },
        });
    }
    async upsertBranding(data) {
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
