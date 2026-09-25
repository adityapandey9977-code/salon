import type { CreatePackageRequest } from '@salon-spa-saas/contracts';
import type { PackageMasterDto } from '../../domain/entities/commerce.dto';
export declare class PackageService {
    listPackages(tenantId: string): Promise<PackageMasterDto[]>;
    getPackageById(tenantId: string, id: string): Promise<PackageMasterDto>;
    createPackage(tenantId: string, input: CreatePackageRequest, userId?: string | null, correlationId?: string): Promise<PackageMasterDto>;
    updatePackage(tenantId: string, id: string, input: Partial<CreatePackageRequest>): Promise<PackageMasterDto>;
    listPackageUsage(tenantId: string): Promise<{
        id: string;
        redemptionCode: string;
        clientName: string;
        packageName: string;
        serviceRedeemed: any;
        sessionNumber: string;
        redeemedAt: string;
        branchName: string;
        staffName: string;
        status: string;
    }[]>;
    createPackageRedemption(tenantId: string, input: {
        customerPackageId: string;
        serviceId: string;
        appointmentId?: string | null;
        quantity?: number;
    }): Promise<{
        customerPackage: {
            package: {
                tenantId: string;
                code: string;
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                price: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
                imageUrl: string | null;
                validityDays: number;
                isShared: boolean;
                durationMins: number | null;
                salesCount: number;
                includedServicesText: string | null;
            };
        } & {
            tenantId: string;
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            startsAt: Date;
            expiresAt: Date;
            packageId: string;
            purchaseInvoiceId: string | null;
        };
    } & {
        tenantId: string;
        id: string;
        serviceId: string;
        appointmentId: string | null;
        customerPackageId: string;
        quantity: number;
        redeemedAt: Date;
    }>;
    getPackagesAnalytics(tenantId: string): Promise<{
        summary: {
            activePackages: number;
            unitsSold: number;
            enrolledVips: number;
            totalRevenue: number;
            sessionBurnoutRate: number;
        };
        packagesList: {
            id: string;
            name: string;
            code: string;
            price: number;
            salesCount: any;
            validityDays: number;
            isActive: boolean;
        }[];
        membershipsList: {
            id: string;
            name: string;
            price: number;
            membersCount: any;
            discountPercentage: number;
            isActive: boolean;
        }[];
    }>;
}
export declare const packageService: PackageService;
//# sourceMappingURL=package.service.d.ts.map