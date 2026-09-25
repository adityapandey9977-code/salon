import type { CustomerCautionDto } from '../../domain/entities/customer.dto';
export declare class CautionRepository {
    private toDto;
    findByCustomerId(tenantId: string, customerId: string): Promise<CustomerCautionDto[]>;
    create(data: {
        tenantId: string;
        customerId: string;
        type: string;
        title: string;
        description?: string | null;
        severity?: any;
        active?: boolean;
    }): Promise<CustomerCautionDto>;
    update(tenantId: string, id: string, data: {
        type?: string;
        title?: string;
        description?: string | null;
        severity?: any;
        active?: boolean;
    }): Promise<CustomerCautionDto>;
}
export declare const cautionRepository: CautionRepository;
//# sourceMappingURL=caution.repository.d.ts.map