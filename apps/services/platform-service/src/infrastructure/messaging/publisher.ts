import {
  createEventEnvelope,
  type DomainEventName,
  RabbitMQEventBus,
} from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';

const logger = createLogger('platform-event-publisher');

export class PlatformEventPublisher {
  private static instance: PlatformEventPublisher;
  private bus: RabbitMQEventBus;

  private constructor() {
    this.bus = new RabbitMQEventBus({
      url: config.RABBITMQ_URL,
      serviceName: 'platform-service',
    });
  }

  public static getInstance(): PlatformEventPublisher {
    if (!PlatformEventPublisher.instance) {
      PlatformEventPublisher.instance = new PlatformEventPublisher();
    }
    return PlatformEventPublisher.instance;
  }

  public async connect(): Promise<void> {
    if (config.NODE_ENV === 'test') return;
    try {
      await this.bus.connect();
      logger.info('Platform event publisher connected to RabbitMQ');
    } catch {
      logger.warn('RabbitMQ connect failed, running in resilient mode');
    }
  }

  public async publishEvent<T extends Record<string, unknown>>(params: {
    eventType: DomainEventName | string;
    aggregateType: string;
    aggregateId: string;
    tenantId?: string;
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
        tenantId: params.tenantId || 'platform',
        payload: params.payload,
        actorUserId: params.userId || undefined,
        correlationId: params.correlationId,
      });

      const routingKey = `platform.${params.eventType.toLowerCase()}`;
      await this.bus.publish(envelope, routingKey);
      logger.info(
        {
          eventType: params.eventType,
          aggregateId: params.aggregateId,
          tenantId: params.tenantId,
        },
        'Published platform domain event',
      );
    } catch (err) {
      logger.error({ err, eventType: params.eventType }, 'Failed to publish platform domain event');
    }
  }

  public async close(): Promise<void> {
    await this.bus.close();
  }
}

export const eventPublisher = PlatformEventPublisher.getInstance();
export const eventBus = {
  publish: (event: any) => eventPublisher.publishEvent(event),
};
