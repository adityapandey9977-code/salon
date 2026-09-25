import type { PackageMasterDto } from '../../domain/entities/commerce.dto';
import { Prisma } from '../prisma/generated-client';
export declare class PackageRepository {
    private toDto;
    findById(tenantId: string, id: string): Promise<PackageMasterDto | null>;
    list(tenantId: string): Promise<PackageMasterDto[]>;
    create(data: {
        tenantId: string;
        code: string;
        name: string;
        description?: string | null;
        price: number;
        validityDays?: number;
        isShared?: boolean;
        isActive?: boolean;
        durationMins?: number | null;
        salesCount?: number;
        imageUrl?: string | null;
        includedServicesText?: string | null;
        items: Array<{
            serviceId: string;
            includedQuantity: number;
        }>;
    }): Promise<PackageMasterDto>;
    update(tenantId: string, id: string, data: {
        name?: string;
        description?: string | null;
        price?: number;
        validityDays?: number;
        isShared?: boolean;
        isActive?: boolean;
        includedServicesText?: string | null;
    }): Promise<PackageMasterDto>;
    createCustomerPackage(data: {
        tenantId: string;
        customerId: string;
        packageId: string;
        purchaseInvoiceId?: string | null;
        validityDays: number;
    }): Promise<{
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
    }>;
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
    createPackageRedemption(data: {
        tenantId: string;
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
                price: Prisma.Decimal;
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
export declare const packageRepository: PackageRepository;
//# sourceMappingURL=package.repository.d.ts.map