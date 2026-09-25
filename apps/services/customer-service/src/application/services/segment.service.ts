import type { CreateCustomerSegmentRequest } from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { customerEventPublisher } from '../../infrastructure/messaging/publisher';
import {
  type CustomerSegmentDto,
  segmentRepository,
} from '../../infrastructure/repositories/segment.repository';

export class SegmentService {
  public async getSegments(tenantId: string): Promise<CustomerSegmentDto[]> {
    return segmentRepository.list(tenantId);
  }

  public async getSegmentById(tenantId: string, id: string): Promise<CustomerSegmentDto | null> {
    return segmentRepository.findById(tenantId, id);
  }

  public async createSegment(
    tenantId: string,
    input: CreateCustomerSegmentRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<CustomerSegmentDto> {
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

  public async addMember(tenantId: string, segmentId: string, customerId: string): Promise<void> {
    await segmentRepository.addMember(tenantId, segmentId, customerId);
  }

  public async removeMember(tenantId: string, segmentId: string, customerId: string): Promise<void> {
    await segmentRepository.removeMember(tenantId, segmentId, customerId);
  }
}

export const segmentService = new SegmentService();
