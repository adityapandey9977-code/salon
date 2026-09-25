import { createEventEnvelope, RabbitMQEventBus, } from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
const logger = createLogger('payment-event-publisher');
export class PaymentEventPublisher {
    static instance;
    bus;
    constructor() {
        this.bus = new RabbitMQEventBus({
            url: config.RABBITMQ_URL,
            serviceName: 'payment-service',
        });
    }
    static getInstance() {
        if (!PaymentEventPublisher.instance) {
            PaymentEventPublisher.instance = new PaymentEventPublisher();
        }
        return PaymentEventPublisher.instance;
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
            const routingKey = `payment.${params.eventType.toLowerCase()}`;
            await this.bus.publish(envelope, routingKey);
            logger.info({
                eventType: params.eventType,
                aggregateId: params.aggregateId,
                tenantId: params.tenantId,
            }, 'Published payment domain event');
        }
        catch (err) {
            logger.error({ err, eventType: params.eventType }, 'Failed to publish payment domain event');
        }
    }
    async close() {
        await this.bus.close();
    }
}
export const paymentEventPublisher = PaymentEventPublisher.getInstance();
