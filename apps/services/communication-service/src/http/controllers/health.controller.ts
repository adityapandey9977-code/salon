import type { Request, Response } from 'express';
import { prisma } from '../../infrastructure/prisma/client';

export class HealthController {
  static async health(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'ok',
      service: 'communication-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }

  static async ready(_req: Request, res: Response): Promise<void> {
    let dbStatus = 'healthy';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected';
    }

    const isHealthy = dbStatus === 'healthy';
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'ready' : 'degraded',
      service: 'communication-service',
      timestamp: new Date().toISOString(),
      checks: { database: dbStatus },
    });
  }

  static async metrics(_req: Request, res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/plain');
    res.send('# HELP comms_uptime_seconds Process uptime in seconds\n# TYPE comms_uptime_seconds gauge\ncomms_uptime_seconds ' + process.uptime());
  }
}
