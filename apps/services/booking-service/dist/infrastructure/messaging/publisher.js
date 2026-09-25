import { createEventEnvelope, RabbitMQEventBus, } from '@salon-spa-saas/events';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
const logger = createLogger('booking-event-publisher');
export class BookingEventPublisher {
    static instance;
    bus;
    constructor() {
        this.bus = new RabbitMQEventBus({
            url: config.RABBITMQ_URL,
            serviceName: 'booking-service',
        });
    }
    static getInstance() {
        if (!BookingEventPublisher.instance) {
            BookingEventPublisher.instance = new BookingEventPublisher();
        }
        return BookingEventPublisher.instance;
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
            const routingKey = `booking.${params.eventType.toLowerCase()}`;
            await this.bus.publish(envelope, routingKey);
            logger.info({
                eventType: params.eventType,
                aggregateId: params.aggregateId,
                tenantId: params.tenantId,
            }, 'Published booking domain event');
        }
        catch (err) {
            logger.error({ err, eventType: params.eventType }, 'Failed to publish booking domain event');
        }
    }
    async close() {
        await this.bus.close();
    }
}
export const bookingEventPublisher = BookingEventPublisher.getInstance();
