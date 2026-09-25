import type { Request, Response } from 'express';
import { prisma } from '../../infrastructure/prisma/client';

export class HealthController {
  public static health(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      service: 'organization-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }

  public static async ready(_req: Request, res: Response): Promise<void> {
    let dbStatus = 'healthy';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
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

  public static metrics(_req: Request, res: Response): void {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(
      `# HELP organization_service_uptime_seconds Service uptime\n# TYPE organization_service_uptime_seconds gauge\norganization_service_uptime_seconds ${process.uptime()}\n`,
    );
  }
}
