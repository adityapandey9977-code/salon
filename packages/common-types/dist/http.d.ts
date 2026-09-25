export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: Record<string, unknown>;
    timestamp: string;
}
export declare function createSuccessResponse<T>(data: T, message?: string, meta?: Record<string, unknown>): ApiResponse<T>;
export declare function createErrorResponse(message: string, code?: string, details?: unknown): ApiResponse<never>;
//# sourceMappingURL=http.d.ts.map