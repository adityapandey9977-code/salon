import client from 'prom-client';
import { prisma } from '../../infrastructure/prisma/client';
import { redisConnectionManager } from '../../infrastructure/redis/redis-connection.manager';
// Prometheus Metrics Registry
const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'people_service_' });
export class HealthController {
    getHealth(_req, res) {
        res.json({
            status: 'OK',
            service: 'people-service',
            timestamp: new Date().toISOString(),
        });
    }
    async getReady(_req, res) {
        const checks = {
            database: false,
            redis: false,
        };
        try {
            await prisma.$queryRaw `SELECT 1`;
            checks.database = true;
        }
        catch {
            checks.database = false;
        }
        try {
            checks.redis = await redisConnectionManager.isHealthy();
        }
        catch {
            checks.redis = false;
        }
        const isReady = checks.database; // Database is primary requirement for readiness
        res.status(isReady ? 200 : 503).json({
            status: isReady ? 'READY' : 'DEGRADED',
            service: 'people-service',
            checks,
            timestamp: new Date().toISOString(),
        });
    }
    async getMetrics(_req, res) {
        res.setHeader('Content-Type', register.contentType);
        res.send(await register.metrics());
    }
}
export const healthController = new HealthController();
