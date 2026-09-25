export function createSuccessResponse(data, message, meta) {
    return {
        success: true,
        message,
        data,
        meta,
        timestamp: new Date().toISOString(),
    };
}
export function createErrorResponse(message, code = 'INTERNAL_ERROR', details) {
    return {
        success: false,
        error: {
            code,
            message,
            details,
        },
        timestamp: new Date().toISOString(),
    };
}
