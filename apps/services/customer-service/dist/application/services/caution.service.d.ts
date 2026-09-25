import type { CreateCustomerCautionRequest, UpdateCustomerCautionRequest } from '@salon-spa-saas/contracts';
import type { CustomerCautionDto } from '../../domain/entities/customer.dto';
export declare class CautionService {
    getCautions(tenantId: string, customerId: string): Promise<CustomerCautionDto[]>;
    addCaution(tenantId: string, customerId: string, input: CreateCustomerCautionRequest): Promise<CustomerCautionDto>;
    updateCaution(tenantId: string, cautionId: string, input: UpdateCustomerCautionRequest): Promise<CustomerCautionDto>;
}
export declare const cautionService: CautionService;
//# sourceMappingURL=caution.service.d.ts.map