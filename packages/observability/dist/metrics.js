export class SimpleMetricsCollector {
    static instance;
    metrics = [];
    maxBufferSize = 1000;
    constructor() { }
    static getInstance() {
        if (!SimpleMetricsCollector.instance) {
            SimpleMetricsCollector.instance = new SimpleMetricsCollector();
        }
        return SimpleMetricsCollector.instance;
    }
    record(metric) {
        if (this.metrics.length >= this.maxBufferSize) {
            this.metrics.shift();
        }
        this.metrics.push(metric);
    }
    getSummary() {
        if (this.metrics.length === 0) {
            return { totalRequests: 0, avgDurationMs: 0, statusCounts: {} };
        }
        const totalRequests = this.metrics.length;
        const totalDuration = this.metrics.reduce((acc, m) => acc + m.durationMs, 0);
        const statusCounts = {};
        for (const m of this.metrics) {
            statusCounts[m.statusCode] = (statusCounts[m.statusCode] || 0) + 1;
        }
        return {
            totalRequests,
            avgDurationMs: Math.round(totalDuration / totalRequests),
            statusCounts,
        };
    }
}
