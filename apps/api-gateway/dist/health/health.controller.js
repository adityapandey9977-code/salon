import client from 'prom-client';
import { GatewayRedisManager } from '../security/redis-gateway';
const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'api_gateway_' });
export class GatewayHealthController {
    getHealth(_req, res) {
        res.status(200).json({
            status: 'UP',
            service: 'api-gateway',
            timestamp: new Date().toISOString(),
        });
    }
    async getReady(_req, res) {
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
    async getMetrics(_req, res) {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.send(metrics);
    }
}
export const gatewayHealthController = new GatewayHealthController();
