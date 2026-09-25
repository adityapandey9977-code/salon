import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { DomainType } from '../../infrastructure/prisma/generated-client';
export declare class DomainService {
    private domainRepo;
    private cache;
    constructor(domainRepo?: DomainRepository, cache?: PlatformReadStore);
    listDomains(tenantId: string): Promise<any>;
    resolveDomain(hostname: string): Promise<any>;
    addDomain(data: {
        tenantId: string;
        hostname: string;
        domainType?: DomainType;
        isPrimary?: boolean;
    }): Promise<{
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../../infrastructure/prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../../infrastructure/prisma/generated-client").$Enums.SSLStatus;
    }>;
    verifyDomain(id: string): Promise<{
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../../infrastructure/prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../../infrastructure/prisma/generated-client").$Enums.SSLStatus;
    }>;
    deleteDomain(id: string): Promise<{
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.DomainStatus;
        id: string;
        hostname: string;
        createdAt: Date;
        updatedAt: Date;
        domainType: import("../../infrastructure/prisma/generated-client").$Enums.DomainType;
        isPrimary: boolean;
        verificationToken: string | null;
        verificationMethod: string | null;
        verifiedAt: Date | null;
        sslStatus: import("../../infrastructure/prisma/generated-client").$Enums.SSLStatus;
    }>;
    getBranding(tenantId: string): Promise<{
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
    } | {
        tenantId: string;
        brandName: null;
        primaryColor: string;
        secondaryColor: string;
        logoObjectKey: null;
        faviconObjectKey: null;
        appTitle: string;
        customCss: null;
    }>;
    updateBranding(tenantId: string, data: {
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
//# sourceMappingURL=domain.service.d.ts.map