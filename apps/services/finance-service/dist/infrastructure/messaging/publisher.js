import { createEventEnvelope, RabbitMQEventBus, } from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
const logger = createLogger('finance-event-publisher');
export class FinanceEventPublisher {
    static instance;
    bus;
    constructor() {
        this.bus = new RabbitMQEventBus({
            url: config.RABBITMQ_URL,
            serviceName: 'finance-service',
        });
    }
    static getInstance() {
        if (!FinanceEventPublisher.instance) {
            FinanceEventPublisher.instance = new FinanceEventPublisher();
        }
        return FinanceEventPublisher.instance;
    }
    async connect() {
        if (config.NODE_ENV === 'test')
            return;
        try {
            await this.bus.connect();
            logger.info('Finance event publisher connected to RabbitMQ');
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
                branchId: params.branchId,
                payload: params.payload,
                actorUserId: params.userId || undefined,
                correlationId: params.correlationId,
            });
            const routingKey = `finance.${params.eventType.toLowerCase()}`;
            await this.bus.publish(envelope, routingKey);
            logger.info({
                eventType: params.eventType,
                aggregateId: params.aggregateId,
                tenantId: params.tenantId,
            }, 'Published finance domain event');
        }
        catch (err) {
            logger.error({ err, eventType: params.eventType }, 'Failed to publish finance domain event');
        }
    }
    async close() {
        await this.bus.close();
    }
}
export const eventPublisher = FinanceEventPublisher.getInstance();
export const eventBus = {
    publish: (event) => eventPublisher.publishEvent(event),
};
