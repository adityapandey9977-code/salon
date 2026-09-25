import type { CreateCustomerRequest, QueryCustomersRequest, UpdateCustomerRequest } from '@salon-spa-saas/contracts';
import type { CachedCustomer, CustomerSummaryDto } from '../../domain/entities/customer.dto';
export declare class CustomerService {
    private generateCustomerCode;
    getCustomerDetail(tenantId: string, customerId: string): Promise<CachedCustomer>;
    lookupByMobile(tenantId: string, mobile: string): Promise<CachedCustomer | null>;
    listCustomers(tenantId: string, query: QueryCustomersRequest): Promise<{
        items: CustomerSummaryDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    createCustomer(tenantId: string, input: CreateCustomerRequest, userId?: string | null, correlationId?: string): Promise<CachedCustomer>;
    updateCustomer(tenantId: string, customerId: string, input: UpdateCustomerRequest, userId?: string | null, correlationId?: string): Promise<CachedCustomer>;
    softDeleteCustomer(tenantId: string, customerId: string, userId?: string | null, reason?: string, correlationId?: string): Promise<void>;
    recordVisit(tenantId: string, customerId: string, amount: number, visitDate?: string | Date): Promise<CachedCustomer>;
    getDormantCustomers(tenantId: string): Promise<CustomerSummaryDto[]>;
}
export declare const customerService: CustomerService;
//# sourceMappingURL=customer.service.d.ts.map