import {
  createEventEnvelope,
  type DomainEventName,
  RabbitMQEventBus,
} from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';

const logger = createLogger('payment-event-publisher');

export class PaymentEventPublisher {
  private static instance: PaymentEventPublisher;
  private bus: RabbitMQEventBus;

  private constructor() {
    this.bus = new RabbitMQEventBus({
      url: config.RABBITMQ_URL,
      serviceName: 'payment-service',
    });
  }

  public static getInstance(): PaymentEventPublisher {
    if (!PaymentEventPublisher.instance) {
      PaymentEventPublisher.instance = new PaymentEventPublisher();
    }
    return PaymentEventPublisher.instance;
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

      const routingKey = `payment.${params.eventType.toLowerCase()}`;
      await this.bus.publish(envelope, routingKey);
      logger.info(
        {
          eventType: params.eventType,
          aggregateId: params.aggregateId,
          tenantId: params.tenantId,
        },
        'Published payment domain event',
      );
    } catch (err) {
      logger.error({ err, eventType: params.eventType }, 'Failed to publish payment domain event');
    }
  }

  public async close(): Promise<void> {
    await this.bus.close();
  }
}

export const paymentEventPublisher = PaymentEventPublisher.getInstance();
