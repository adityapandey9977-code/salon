import { randomUUID } from 'node:crypto';
export function correlationMiddleware(req, res, next) {
    const correlationId = req.headers['x-correlation-id'] || randomUUID();
    const requestId = req.headers['x-request-id'] || randomUUID();
    req.headers['x-correlation-id'] = correlationId;
    req.headers['x-request-id'] = requestId;
    res.setHeader('x-correlation-id', correlationId);
    res.setHeader('x-request-id', requestId);
    next();
}
