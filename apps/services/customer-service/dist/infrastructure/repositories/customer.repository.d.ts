import type { CachedCustomer, CustomerSummaryDto } from '../../domain/entities/customer.dto';
import { Prisma, type CustomerStatus } from '../prisma/generated-client';
export declare class CustomerRepository {
    private toDto;
    private toSummaryDto;
    findById(tenantId: string, id: string): Promise<CachedCustomer | null>;
    findByNormalizedMobile(tenantId: string, normalizedMobile: string): Promise<CachedCustomer | null>;
    findByNormalizedEmail(tenantId: string, normalizedEmail: string): Promise<CachedCustomer | null>;
    list(tenantId: string, filters: {
        search?: string;
        mobilePhone?: string;
        email?: string;
        status?: CustomerStatus;
        branchId?: string;
        franchiseId?: string;
        hasFranchise?: boolean;
        source?: any;
        page: number;
        limit: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        items: CustomerSummaryDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: {
        tenantId: string;
        customerCode: string;
        firstName: string;
        lastName?: string | null;
        displayName: string;
        mobilePhone: string;
        normalizedMobile: string;
        email?: string | null;
        normalizedEmail?: string | null;
        alternatePhone?: string | null;
        gender?: any;
        dateOfBirth?: Date | null;
        status?: any;
        preferredBranchId?: string | null;
        franchiseId?: string | null;
        source?: any;
        notes?: string | null;
        avatarUrl?: string | null;
        segment?: string | null;
        address?: {
            type: string;
            addressLine1: string;
            addressLine2?: string | null;
            city: string;
            state: string;
            postalCode: string;
            country?: string;
            isDefault?: boolean;
        };
        preferences?: {
            preferredStaffId?: string | null;
            preferredCommunicationChannel?: string;
            language?: string;
            appointmentReminderEnabled?: boolean;
            marketingConsent?: boolean;
        };
        cautions?: Array<{
            type: string;
            title: string;
            description?: string | null;
            severity?: any;
        }>;
    }): Promise<CachedCustomer>;
    update(tenantId: string, id: string, data: Prisma.CustomerUpdateInput): Promise<CachedCustomer>;
    recordVisit(tenantId: string, id: string, amount: number, visitDate?: Date): Promise<CachedCustomer>;
    upsertAddress(tenantId: string, customerId: string, address: {
        type?: string;
        addressLine1?: string | null;
        addressLine2?: string | null;
        city?: string | null;
        state?: string | null;
        postalCode?: string | null;
        country?: string | null;
        isDefault?: boolean;
    }): Promise<{
        tenantId: string;
        type: string;
        id: string;
        addressLine1: string;
        addressLine2: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        customerId: string;
    } | undefined>;
    softDelete(tenantId: string, id: string, userId: string | null, reason?: string): Promise<void>;
    findDormant(tenantId: string, daysThreshold?: number): Promise<CustomerSummaryDto[]>;
}
export declare const customerRepository: CustomerRepository;
//# sourceMappingURL=customer.repository.d.ts.map