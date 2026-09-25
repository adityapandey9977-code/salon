import { RabbitMQEventBus } from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import { ReportingConsumerService, type DomainEventEnvelope } from '../../application/services/reporting-consumer.service';

const logger = createLogger('reporting-event-subscriber');

export class ReportingEventSubscriber {
  private static instance: ReportingEventSubscriber;
  private bus: RabbitMQEventBus;

  private constructor() {
    this.bus = new RabbitMQEventBus({
      url: config.RABBITMQ_URL,
      serviceName: 'reporting-service',
    });
  }

  public static getInstance(): ReportingEventSubscriber {
    if (!ReportingEventSubscriber.instance) {
      ReportingEventSubscriber.instance = new ReportingEventSubscriber();
    }
    return ReportingEventSubscriber.instance;
  }

  public async start(): Promise<void> {
    if (config.NODE_ENV === 'test') return;
    try {
      await this.bus.connect();
      logger.info('Reporting event subscriber connected to RabbitMQ');

      const routingKeys = [
        'tenant.*',
        'customer.*',
        'appointment.*',
        'sale.*',
        'payment.*',
        'refund.*',
        'inventory.*',
        'finance.*',
        'commission.*',
        'royalty.*',
        'communication.*',
        'call.*',
      ];

      for (const routingKey of routingKeys) {
        await this.bus.subscribe(routingKey, async (envelope) => {
          await ReportingConsumerService.processEvent(envelope as unknown as DomainEventEnvelope);
        });
      }
      logger.info('Reporting subscriber registered for domain events');
    } catch {
      logger.warn('RabbitMQ connection not available, running reporting in API-only resilient mode');
    }
  }

  public async close(): Promise<void> {
    await this.bus.close();
  }
}

export const eventSubscriber = ReportingEventSubscriber.getInstance();
