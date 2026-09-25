export declare class ReportingEventSubscriber {
    private static instance;
    private bus;
    private constructor();
    static getInstance(): ReportingEventSubscriber;
    start(): Promise<void>;
    close(): Promise<void>;
}
export declare const eventSubscriber: ReportingEventSubscriber;
//# sourceMappingURL=subscriber.d.ts.map