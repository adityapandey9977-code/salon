import { prisma } from '../../infrastructure/prisma/client';
export class HealthController {
    static async health(_req, res) {
        res.status(200).json({
            status: 'ok',
            service: 'inventory-service',
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
            service: 'inventory-service',
            timestamp: new Date().toISOString(),
            checks: { database: dbStatus },
        });
    }
    static async metrics(_req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.send('# HELP inventory_uptime_seconds Process uptime in seconds\n# TYPE inventory_uptime_seconds gauge\ninventory_uptime_seconds ' + process.uptime());
    }
}
