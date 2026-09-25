import { prisma } from '../../infrastructure/prisma/client';
import { redis } from '../../infrastructure/redis/client';
export class HealthController {
    static health(_req, res) {
        res.status(200).json({
            status: 'ok',
            service: 'booking-service',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    }
    static async ready(_req, res) {
        let dbStatus = 'healthy';
        let redisStatus = 'healthy';
        try {
            await prisma.$queryRaw `SELECT 1`;
        }
        catch {
            dbStatus = 'disconnected';
        }
        try {
            if (redis.status === 'ready' || redis.status === 'connecting') {
                redisStatus = 'connected';
            }
            else {
                redisStatus = 'disconnected';
            }
        }
        catch {
            redisStatus = 'disconnected';
        }
        const isHealthy = dbStatus === 'healthy';
        res.status(isHealthy ? 200 : 503).json({
            status: isHealthy ? 'ready' : 'degraded',
            service: 'booking-service',
            timestamp: new Date().toISOString(),
            checks: {
                database: dbStatus,
                redis: redisStatus,
            },
        });
    }
    static metrics(_req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(`# HELP booking_service_uptime_seconds Service uptime\n# TYPE booking_service_uptime_seconds gauge\nbooking_service_uptime_seconds ${process.uptime()}\n`);
    }
}
