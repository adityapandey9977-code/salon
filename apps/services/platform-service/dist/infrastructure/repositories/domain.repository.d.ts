import { DomainStatus, DomainType, SSLStatus } from '../prisma/generated-client';
export declare class DomainRepository {
    findDomainById(id: string): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../prisma/generated-client").$Enums.SSLStatus;
    } | null>;
    findDomainByHostname(hostname: string): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../prisma/generated-client").$Enums.SSLStatus;
    } | null>;
    listDomainsByTenantId(tenantId: string): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../prisma/generated-client").$Enums.SSLStatus;
    }[]>;
    createDomain(data: {
        tenantId: string;
        hostname: string;
        domainType?: DomainType;
        isPrimary?: boolean;
        verificationToken?: string;
        verificationMethod?: string;
    }): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../prisma/generated-client").$Enums.SSLStatus;
    }>;
    updateDomainStatus(id: string, data: {
        status?: DomainStatus;
        verifiedAt?: Date | null;
        sslStatus?: SSLStatus;
        isPrimary?: boolean;
    }): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../prisma/generated-client").$Enums.SSLStatus;
    }>;
    deleteDomain(id: string): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../prisma/generated-client").$Enums.SSLStatus;
    }>;
    findBrandingByTenantId(tenantId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brandName: string | null;
        primaryColor: string;
        secondaryColor: string;
        logoObjectKey: string | null;
        faviconObjectKey: string | null;
        appTitle: string;
        customCss: string | null;
    } | null>;
    upsertBranding(data: {
        tenantId: string;
        brandName?: string;
        primaryColor?: string;
        secondaryColor?: string;
        logoObjectKey?: string;
        faviconObjectKey?: string;
        appTitle?: string;
        customCss?: string;
    }): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brandName: string | null;
        primaryColor: string;
        secondaryColor: string;
        logoObjectKey: string | null;
        faviconObjectKey: string | null;
        appTitle: string;
        customCss: string | null;
    }>;
}
//# sourceMappingURL=domain.repository.d.ts.map