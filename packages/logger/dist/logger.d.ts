import { type Logger, type LoggerOptions } from 'pino';
export interface LogContext {
    service?: string;
    requestId?: string;
    correlationId?: string;
    tenantId?: string | null;
    branchId?: string | null;
    franchiseId?: string | null;
    userId?: string | null;
    eventId?: string;
    durationMs?: number;
    statusCode?: number;
    [key: string]: unknown;
}
export declare function createLogger(serviceName: string, options?: LoggerOptions): Logger;
export type { Logger };
//# sourceMappingURL=logger.d.ts.map