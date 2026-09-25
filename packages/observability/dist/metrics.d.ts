export interface RequestMetrics {
    path: string;
    method: string;
    statusCode: number;
    durationMs: number;
    timestamp: string;
}
export declare class SimpleMetricsCollector {
    private static instance;
    private metrics;
    private readonly maxBufferSize;
    private constructor();
    static getInstance(): SimpleMetricsCollector;
    record(metric: RequestMetrics): void;
    getSummary(): {
        totalRequests: number;
        avgDurationMs: number;
        statusCounts: Record<number, number>;
    };
}
//# sourceMappingURL=metrics.d.ts.map