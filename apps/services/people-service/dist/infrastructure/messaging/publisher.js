import { createEventEnvelope, RabbitMQEventBus, } from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
const logger = createLogger('people-event-publisher');
export class PeopleEventPublisher {
    static instance;
    bus;
    constructor() {
        this.bus = new RabbitMQEventBus({
            url: config.RABBITMQ_URL,
            serviceName: 'people-service',
        });
    }
    static getInstance() {
        if (!PeopleEventPublisher.instance) {
            PeopleEventPublisher.instance = new PeopleEventPublisher();
        }
        return PeopleEventPublisher.instance;
    }
    async connect() {
        if (config.NODE_ENV === 'test')
            return;
        try {
            await this.bus.connect();
        }
        catch {
            logger.warn('RabbitMQ connect failed, running in resilient mode');
        }
    }
    async publishEvent(params) {
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
            logger.info({
                eventType: params.eventType,
                aggregateId: params.aggregateId,
                tenantId: params.tenantId,
            }, 'Published domain event');
        }
        catch (err) {
            logger.error({ err, eventType: params.eventType }, 'Failed to publish domain event');
        }
    }
    async close() {
        await this.bus.close();
    }
}
export const eventPublisher = PeopleEventPublisher.getInstance();
