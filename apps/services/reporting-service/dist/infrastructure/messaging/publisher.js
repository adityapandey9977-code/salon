import { RabbitMQEventBus } from '@salon-spa-saas/events';
import { config } from '../../config';
export const eventBus = new RabbitMQEventBus({
    url: config.RABBITMQ_URL,
    serviceName: 'reporting-service',
});
