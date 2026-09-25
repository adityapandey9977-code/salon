import { createLogger } from '@salon-spa-saas/logger';
import { gatewayRedis } from '../security/redis-gateway';
const logger = createLogger('gateway-rate-limiter');
export function createRedisRateLimiter(options) {
    return async (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
        const identifier = req.body?.email || req.user?.userId || ip;
        const redisKey = `ratelimit:${options.keyPrefix}:${identifier}`;
        try {
            const current = await gatewayRedis.incr(redisKey);
            if (current === 1) {
                await gatewayRedis.expire(redisKey, options.windowSec);
            }
            res.setHeader('X-RateLimit-Limit', options.limit);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, options.limit - current));
            if (current > options.limit) {
                logger.warn({ ip, identifier, key: redisKey }, 'Rate limit exceeded');
                res.status(429).json({
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: 'Too many requests, please try again later.',
                    },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            next();
        }
        catch (err) {
            // Gracefully bypass if Redis is temporarily unreachable
            logger.warn({ error: err.message }, 'Redis rate limit error, bypassing check');
            next();
        }
    };
}
export const authRateLimiter = createRedisRateLimiter({
    keyPrefix: 'auth',
    limit: 30,
    windowSec: 60,
});
export const apiRateLimiter = createRedisRateLimiter({
    keyPrefix: 'api',
    limit: 120,
    windowSec: 60,
});
