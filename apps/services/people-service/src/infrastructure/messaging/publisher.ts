import {
  createEventEnvelope,
  type DomainEventName,
  RabbitMQEventBus,
} from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';

const logger = createLogger('people-event-publisher');

export class PeopleEventPublisher {
  private static instance: PeopleEventPublisher;
  private bus: RabbitMQEventBus;

  private constructor() {
    this.bus = new RabbitMQEventBus({
      url: config.RABBITMQ_URL,
      serviceName: 'people-service',
    });
  }

  public static getInstance(): PeopleEventPublisher {
    if (!PeopleEventPublisher.instance) {
      PeopleEventPublisher.instance = new PeopleEventPublisher();
    }
    return PeopleEventPublisher.instance;
  }

  public async connect(): Promise<void> {
    if (config.NODE_ENV === 'test') return;
    try {
      await this.bus.connect();
    } catch {
      logger.warn('RabbitMQ connect failed, running in resilient mode');
    }
  }

  public async publishEvent<T extends Record<string, unknown>>(params: {
    eventType: DomainEventName | string;
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

      const routingKey = `people.${params.eventType.toLowerCase()}`;
      await this.bus.publish(envelope, routingKey);
      logger.info(
        {
          eventType: params.eventType,
          aggregateId: params.aggregateId,
          tenantId: params.tenantId,
        },
        'Published domain event',
      );
    } catch (err) {
      logger.error({ err, eventType: params.eventType }, 'Failed to publish domain event');
    }
  }

  public async close(): Promise<void> {
    await this.bus.close();
  }
}

export const eventPublisher = PeopleEventPublisher.getInstance();
