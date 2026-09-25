import type { Request, Response } from 'express';
import client from 'prom-client';
import { prisma } from '../../infrastructure/prisma/client';
import { redisConnectionManager } from '../../infrastructure/redis/redis-connection.manager';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export class HealthController {
  public async health(_req: Request, res: Response): Promise<void> {
    res.json({
      status: 'ok',
      service: 'commerce-service',
      timestamp: new Date().toISOString(),
    });
  }

  public async ready(_req: Request, res: Response): Promise<void> {
    let dbStatus = 'down';
    let redisStatus = 'down';

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    try {
      redisStatus = redisConnectionManager.isReady() ? 'up' : 'down';
    } catch {
      redisStatus = 'down';
    }

    const isHealthy = dbStatus === 'up';

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'ready' : 'unhealthy',
      service: 'commerce-service',
      dependencies: {
        database: dbStatus,
        redis: redisStatus,
      },
      timestamp: new Date().toISOString(),
    });
  }

  public async metrics(_req: Request, res: Response): Promise<void> {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  }
}

export const healthController = new HealthController();
