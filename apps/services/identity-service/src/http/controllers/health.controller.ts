import type { Request, Response } from 'express';
import client from 'prom-client';
import { prisma } from '../../infrastructure/prisma/client';
import { redisConnectionManager } from '../../infrastructure/redis/redis-connection.manager';

// Prometheus registry
const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'identity_service_' });

export class HealthController {
  public async getHealth(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'UP',
      service: 'identity-service',
      timestamp: new Date().toISOString(),
    });
  }

  public async getReady(_req: Request, res: Response): Promise<void> {
    let dbStatus = 'DOWN';
    let redisStatus = 'DOWN';

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'UP';
    } catch (err) {
      dbStatus = 'DOWN';
    }

    try {
      const isRedisHealthy = await redisConnectionManager.isHealthy();
      redisStatus = isRedisHealthy ? 'UP' : 'DOWN';
    } catch {
      redisStatus = 'DOWN';
    }

    const isReady = dbStatus === 'UP'; // Redis is resilient fallback, DB is mandatory

    res.status(isReady ? 200 : 503).json({
      status: isReady ? 'READY' : 'NOT_READY',
      service: 'identity-service',
      checks: {
        database: dbStatus,
        redis: redisStatus,
      },
      timestamp: new Date().toISOString(),
    });
  }

  public async getMetrics(_req: Request, res: Response): Promise<void> {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
  }
}

export const healthController = new HealthController();
