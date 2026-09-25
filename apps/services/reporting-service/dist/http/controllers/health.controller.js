import { prisma } from '../../infrastructure/prisma/client';
export class HealthController {
    static async health(_req, res) {
        res.status(200).json({
            status: 'ok',
            service: 'reporting-service',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    }
    static async ready(_req, res) {
        let dbStatus = 'healthy';
        try {
            await prisma.$queryRaw `SELECT 1`;
        }
        catch {
            dbStatus = 'disconnected';
        }
        const isHealthy = dbStatus === 'healthy';
        res.status(isHealthy ? 200 : 503).json({
            status: isHealthy ? 'ready' : 'degraded',
            service: 'reporting-service',
            timestamp: new Date().toISOString(),
            checks: { database: dbStatus },
        });
    }
    static async metrics(_req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.send('# HELP reporting_uptime_seconds Process uptime in seconds\n# TYPE reporting_uptime_seconds gauge\nreporting_uptime_seconds ' + process.uptime());
    }
}
