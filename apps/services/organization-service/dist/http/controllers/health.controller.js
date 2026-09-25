import { prisma } from '../../infrastructure/prisma/client';
export class HealthController {
    static health(_req, res) {
        res.status(200).json({
            status: 'ok',
            service: 'organization-service',
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
            service: 'organization-service',
            timestamp: new Date().toISOString(),
            checks: { database: dbStatus },
        });
    }
    static metrics(_req, res) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(`# HELP organization_service_uptime_seconds Service uptime\n# TYPE organization_service_uptime_seconds gauge\norganization_service_uptime_seconds ${process.uptime()}\n`);
    }
}
