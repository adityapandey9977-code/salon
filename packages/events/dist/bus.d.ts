import type { EventEnvelope } from './envelope';
export interface EventBusConfig {
    url: string;
    exchangeName?: string;
    serviceName: string;
}
export type EventHandler<T = Record<string, unknown>> = (event: EventEnvelope<T>) => Promise<void>;
export declare class RabbitMQEventBus {
    private connection;
    private channel;
    private readonly exchangeName;
    private readonly serviceName;
    private readonly url;
    private isConnecting;
    constructor(config: EventBusConfig);
    connect(): Promise<void>;
    publish<T extends Record<string, unknown>>(event: EventEnvelope<T>, routingKey?: string): Promise<boolean>;
    subscribe<T extends Record<string, unknown>>(routingKey: string, handler: EventHandler<T>, queueNamePrefix?: string): Promise<void>;
    close(): Promise<void>;
    isConnected(): boolean;
}
//# sourceMappingURL=bus.d.ts.map