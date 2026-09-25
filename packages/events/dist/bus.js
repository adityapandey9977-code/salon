import amqp from 'amqplib';
export class RabbitMQEventBus {
    connection = null;
    channel = null;
    exchangeName;
    serviceName;
    url;
    isConnecting = false;
    constructor(config) {
        this.url = config.url;
        this.exchangeName = config.exchangeName || 'salon.events.topic';
        this.serviceName = config.serviceName;
    }
    async connect() {
        if (this.channel || this.isConnecting)
            return;
        this.isConnecting = true;
        try {
            this.connection = await amqp.connect(this.url);
            this.channel = await this.connection.createChannel();
            // Declare topic exchange
            await this.channel.assertExchange(this.exchangeName, 'topic', {
                durable: true,
            });
            this.connection.on('error', (err) => {
                console.error(`[RabbitMQEventBus] Connection error:`, err);
            });
            this.connection.on('close', () => {
                console.warn(`[RabbitMQEventBus] Connection closed, will reconnect on next call`);
                this.channel = null;
                this.connection = null;
            });
        }
        catch (err) {
            console.error(`[RabbitMQEventBus] Failed to connect to RabbitMQ at ${this.url}:`, err);
            // Do not crash server in dev if rabbitmq is not yet started
        }
        finally {
            this.isConnecting = false;
        }
    }
    async publish(event, routingKey) {
        const key = routingKey || `${event.aggregateType.toLowerCase()}.${event.eventType.toLowerCase()}`;
        const payloadBuffer = Buffer.from(JSON.stringify(event));
        try {
            if (!this.channel) {
                await this.connect();
            }
            if (!this.channel) {
                console.warn(`[RabbitMQEventBus] Channel not available, buffered event: ${event.eventType}`);
                return false;
            }
            return this.channel.publish(this.exchangeName, key, payloadBuffer, {
                persistent: true,
                contentType: 'application/json',
                messageId: event.eventId,
                correlationId: event.correlationId,
                timestamp: new Date(event.occurredAt).getTime(),
            });
        }
        catch (err) {
            console.error(`[RabbitMQEventBus] Failed to publish event ${event.eventType}:`, err);
            return false;
        }
    }
    async subscribe(routingKey, handler, queueNamePrefix) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            if (!this.channel) {
                console.warn(`[RabbitMQEventBus] Channel not available for subscribing to ${routingKey}`);
                return;
            }
            const queue = `${queueNamePrefix || this.serviceName}.${routingKey.replace(/#/g, 'all')}`;
            await this.channel.assertQueue(queue, {
                durable: true,
                deadLetterExchange: `${this.exchangeName}.dlx`,
            });
            await this.channel.bindQueue(queue, this.exchangeName, routingKey);
            await this.channel.consume(queue, async (msg) => {
                if (!msg)
                    return;
                try {
                    const event = JSON.parse(msg.content.toString());
                    await handler(event);
                    this.channel?.ack(msg);
                }
                catch (handlerErr) {
                    console.error(`[RabbitMQEventBus] Error handling event on ${queue}:`, handlerErr);
                    // Reject without requeue to send to dead letter exchange if retries exceeded
                    this.channel?.nack(msg, false, false);
                }
            }, { noAck: false });
        }
        catch (err) {
            console.error(`[RabbitMQEventBus] Failed to subscribe to ${routingKey}:`, err);
        }
    }
    async close() {
        try {
            await this.channel?.close();
            await this.connection?.close();
        }
        catch (err) {
            console.error(`[RabbitMQEventBus] Error closing connection:`, err);
        }
        finally {
            this.channel = null;
            this.connection = null;
        }
    }
    isConnected() {
        return this.connection !== null && this.channel !== null;
    }
}
