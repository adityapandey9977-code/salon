import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildGatewayApp } from '../src/app';

describe('API Gateway Health & Observability', () => {
  const app = buildGatewayApp();

  it('GET /health returns 200 UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('api-gateway');
  });

  it('GET /ready returns 200 READY', async () => {
    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('READY');
  });

  it('GET /metrics returns Prometheus metric format', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('api_gateway_');
  });
});
