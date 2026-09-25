import { createEventEnvelope, RabbitMQEventBus, } from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
const logger = createLogger('commerce-event-publisher');
export class CommerceEventPublisher {
    static instance;
    bus;
    constructor() {
        this.bus = new RabbitMQEventBus({
            url: config.RABBITMQ_URL,
            serviceName: 'commerce-service',
        });
    }
    static getInstance() {
        if (!CommerceEventPublisher.instance) {
            CommerceEventPublisher.instance = new CommerceEventPublisher();
        }
        return CommerceEventPublisher.instance;
    }
    async publish(params) {
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
            const routingKey = `commerce.${params.eventType.toLowerCase()}`;
            await this.bus.publish(envelope, routingKey);
            logger.info({
                eventType: params.eventType,
                aggregateId: params.aggregateId,
                tenantId: params.tenantId,
            }, 'Published commerce domain event');
        }
        catch (err) {
            logger.error({ err, eventType: params.eventType }, 'Failed to publish commerce domain event');
        }
    }
    async close() {
        await this.bus.close();
    }
}
export const commerceEventPublisher = CommerceEventPublisher.getInstance();
