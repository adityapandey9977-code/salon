import type { Request, Response } from 'express';
import client from 'prom-client';
import { GatewayRedisManager } from '../security/redis-gateway';

const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'api_gateway_' });

export class GatewayHealthController {
  public getHealth(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'UP',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    });
  }

  public async getReady(_req: Request, res: Response): Promise<void> {
    const isRedisHealthy = await GatewayRedisManager.getInstance().isHealthy();

    res.status(200).json({
      status: 'READY',
      service: 'api-gateway',
      checks: {
        redis: isRedisHealthy ? 'UP' : 'DEGRADED',
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

export const gatewayHealthController = new GatewayHealthController();
