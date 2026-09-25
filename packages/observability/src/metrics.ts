export interface RequestMetrics {
  path: string;
  method: string;
  statusCode: number;
  durationMs: number;
  timestamp: string;
}

export class SimpleMetricsCollector {
  private static instance: SimpleMetricsCollector;
  private metrics: RequestMetrics[] = [];
  private readonly maxBufferSize = 1000;

  private constructor() {}

  public static getInstance(): SimpleMetricsCollector {
    if (!SimpleMetricsCollector.instance) {
      SimpleMetricsCollector.instance = new SimpleMetricsCollector();
    }
    return SimpleMetricsCollector.instance;
  }

  public record(metric: RequestMetrics): void {
    if (this.metrics.length >= this.maxBufferSize) {
      this.metrics.shift();
    }
    this.metrics.push(metric);
  }

  public getSummary(): {
    totalRequests: number;
    avgDurationMs: number;
    statusCounts: Record<number, number>;
  } {
    if (this.metrics.length === 0) {
      return { totalRequests: 0, avgDurationMs: 0, statusCounts: {} };
    }

    const totalRequests = this.metrics.length;
    const totalDuration = this.metrics.reduce((acc, m) => acc + m.durationMs, 0);
    const statusCounts: Record<number, number> = {};

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
