import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { customerEventPublisher } from '../../infrastructure/messaging/publisher';
import { segmentRepository, } from '../../infrastructure/repositories/segment.repository';
export class SegmentService {
    async getSegments(tenantId) {
        return segmentRepository.list(tenantId);
    }
    async getSegmentById(tenantId, id) {
        return segmentRepository.findById(tenantId, id);
    }
    async createSegment(tenantId, input, userId = null, correlationId) {
        const segment = await segmentRepository.create({
            tenantId,
            name: input.name,
            description: input.description,
            segmentType: input.segmentType,
            isDynamic: input.isDynamic,
            criteriaJson: input.criteriaJson,
        });
        await customerEventPublisher.publish({
            eventType: DOMAIN_EVENTS.CUSTOMER_SEGMENT_UPDATED,
            aggregateType: 'CustomerSegment',
            aggregateId: segment.id,
            tenantId,
            userId,
            correlationId,
            payload: {
                tenantId,
                segmentId: segment.id,
                name: segment.name,
                action: 'CREATED',
            },
        });
        return segment;
    }
    async addMember(tenantId, segmentId, customerId) {
        await segmentRepository.addMember(tenantId, segmentId, customerId);
    }
    async removeMember(tenantId, segmentId, customerId) {
        await segmentRepository.removeMember(tenantId, segmentId, customerId);
    }
}
export const segmentService = new SegmentService();
