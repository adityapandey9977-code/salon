import type { Request, Response } from 'express';
import { prisma } from '../../infrastructure/prisma/client';
import { redis } from '../../infrastructure/redis/client';

export class HealthController {
  public static health(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      service: 'booking-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }

  public static async ready(_req: Request, res: Response): Promise<void> {
    let dbStatus = 'healthy';
    let redisStatus = 'healthy';

    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected';
    }

    try {
      if (redis.status === 'ready' || redis.status === 'connecting') {
        redisStatus = 'connected';
      } else {
        redisStatus = 'disconnected';
      }
    } catch {
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

  public static metrics(_req: Request, res: Response): void {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(
      `# HELP booking_service_uptime_seconds Service uptime\n# TYPE booking_service_uptime_seconds gauge\nbooking_service_uptime_seconds ${process.uptime()}\n`,
    );
  }
}
