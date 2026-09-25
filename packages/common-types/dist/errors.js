export class AppError extends Error {
    statusCode;
    code;
    details;
    isOperational;
    constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = isOperational;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', details) {
        super(message, 404, 'NOT_FOUND', details);
    }
}
export class BadRequestError extends AppError {
    constructor(message = 'Bad request', details) {
        super(message, 400, 'BAD_REQUEST', details);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access', details) {
        super(message, 401, 'UNAUTHORIZED', details);
    }
}
export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed', details) {
        super(message, 401, 'AUTHENTICATION_ERROR', details);
    }
}
export class AccountLockedError extends AppError {
    constructor(message = 'Account is locked', details) {
        super(message, 423, 'ACCOUNT_LOCKED', details);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden for this tenant or scope', details) {
        super(message, 403, 'FORBIDDEN', details);
    }
}
export class ConflictError extends AppError {
    constructor(message = 'Resource state conflict', details) {
        super(message, 409, 'CONFLICT', details);
    }
}
export class ValidationError extends AppError {
    constructor(message = 'Validation failed', details) {
        super(message, 422, 'VALIDATION_ERROR', details);
    }
}
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error', details) {
        super(message, 500, 'INTERNAL_SERVER_ERROR', details);
    }
}
