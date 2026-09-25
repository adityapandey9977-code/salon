import type { CreateCustomerSegmentRequest } from '@salon-spa-saas/contracts';
import { type CustomerSegmentDto } from '../../infrastructure/repositories/segment.repository';
export declare class SegmentService {
    getSegments(tenantId: string): Promise<CustomerSegmentDto[]>;
    getSegmentById(tenantId: string, id: string): Promise<CustomerSegmentDto | null>;
    createSegment(tenantId: string, input: CreateCustomerSegmentRequest, userId?: string | null, correlationId?: string): Promise<CustomerSegmentDto>;
    addMember(tenantId: string, segmentId: string, customerId: string): Promise<void>;
    removeMember(tenantId: string, segmentId: string, customerId: string): Promise<void>;
}
export declare const segmentService: SegmentService;
//# sourceMappingURL=segment.service.d.ts.map