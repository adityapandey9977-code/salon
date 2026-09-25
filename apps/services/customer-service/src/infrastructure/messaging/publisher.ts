import {
  createEventEnvelope,
  type DomainEventName,
  RabbitMQEventBus,
} from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';

const logger = createLogger('customer-event-publisher');

export class CustomerEventPublisher {
  private static instance: CustomerEventPublisher;
  private bus: RabbitMQEventBus;

  private constructor() {
    this.bus = new RabbitMQEventBus({
      url: config.RABBITMQ_URL,
      serviceName: 'customer-service',
    });
  }

  public static getInstance(): CustomerEventPublisher {
    if (!CustomerEventPublisher.instance) {
      CustomerEventPublisher.instance = new CustomerEventPublisher();
    }
    return CustomerEventPublisher.instance;
  }

  public async publish<T extends Record<string, unknown>>(params: {
    eventType: DomainEventName;
    aggregateType: string;
    aggregateId: string;
    tenantId: string;
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
        eventType: params.eventType,
        aggregateType: params.aggregateType,
        aggregateId: params.aggregateId,
        tenantId: params.tenantId,
        payload: params.payload,
        actorUserId: params.userId || undefined,
        correlationId: params.correlationId,
      });

      const routingKey = `customer.${params.eventType.toLowerCase()}`;
      await this.bus.publish(envelope, routingKey);
      logger.info(
        {
          eventType: params.eventType,
          aggregateId: params.aggregateId,
          tenantId: params.tenantId,
        },
        'Published customer domain event',
      );
    } catch (err) {
      logger.error({ err, eventType: params.eventType }, 'Failed to publish customer domain event');
    }
  }

  public async close(): Promise<void> {
    await this.bus.close();
  }
}

export const customerEventPublisher = CustomerEventPublisher.getInstance();
