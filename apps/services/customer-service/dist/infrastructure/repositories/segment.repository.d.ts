export interface CustomerSegmentDto {
    id: string;
    tenantId: string;
    name: string;
    description: string | null;
    segmentType: string;
    isDynamic: boolean;
    criteriaJson: any;
    memberCount?: number;
    createdAt: string;
    updatedAt: string;
}
export declare class SegmentRepository {
    private toDto;
    findById(tenantId: string, id: string): Promise<CustomerSegmentDto | null>;
    list(tenantId: string): Promise<CustomerSegmentDto[]>;
    create(data: {
        tenantId: string;
        name: string;
        description?: string | null;
        segmentType?: string;
        isDynamic?: boolean;
        criteriaJson?: any;
    }): Promise<CustomerSegmentDto>;
    addMember(tenantId: string, segmentId: string, customerId: string): Promise<void>;
    removeMember(tenantId: string, segmentId: string, customerId: string): Promise<void>;
}
export declare const segmentRepository: SegmentRepository;
//# sourceMappingURL=segment.repository.d.ts.map