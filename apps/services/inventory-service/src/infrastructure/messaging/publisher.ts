import {
  createEventEnvelope,
  type DomainEventName,
  RabbitMQEventBus,
} from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';

const logger = createLogger('inventory-event-publisher');

export class InventoryEventPublisher {
  private static instance: InventoryEventPublisher;
  private bus: RabbitMQEventBus;

  private constructor() {
    this.bus = new RabbitMQEventBus({
      url: config.RABBITMQ_URL,
      serviceName: 'inventory-service',
    });
  }

  public static getInstance(): InventoryEventPublisher {
    if (!InventoryEventPublisher.instance) {
      InventoryEventPublisher.instance = new InventoryEventPublisher();
    }
    return InventoryEventPublisher.instance;
  }

  public async connect(): Promise<void> {
    if (config.NODE_ENV === 'test') return;
    try {
      await this.bus.connect();
      logger.info('Inventory event publisher connected to RabbitMQ');
    } catch {
      logger.warn('RabbitMQ connect failed, running in resilient mode');
    }
  }

  public async publishEvent<T extends Record<string, unknown>>(params: {
    eventType: DomainEventName | string;
    aggregateType: string;
    aggregateId: string;
    tenantId: string;
    branchId?: string;
    payload: T;
    userId?: string | null;
    correlationId?: string;
  }): Promise<void> {
    if (config.NODE_ENV === 'test') {
      logger.debug({ eventType: params.eventType }, 'Test environment: skipped RabbitMQ publish');
      return;
    }

    try {
      const envelope = createEventEnvelope({
        eventType: params.eventType as any,
        aggregateType: params.aggregateType,
        aggregateId: params.aggregateId,
        tenantId: params.tenantId,
        branchId: params.branchId,
        payload: params.payload,
        actorUserId: params.userId || undefined,
        correlationId: params.correlationId,
      });

      const routingKey = `inventory.${params.eventType.toLowerCase()}`;
      await this.bus.publish(envelope, routingKey);
      logger.info(
        {
          eventType: params.eventType,
          aggregateId: params.aggregateId,
          tenantId: params.tenantId,
          branchId: params.branchId,
        },
        'Published inventory domain event',
      );
    } catch (err) {
      logger.error({ err, eventType: params.eventType }, 'Failed to publish inventory domain event');
    }
  }

  public async close(): Promise<void> {
    await this.bus.close();
  }
}

export const eventPublisher = InventoryEventPublisher.getInstance();
export const eventBus = {
  publish: (event: any) => eventPublisher.publishEvent(event),
};
