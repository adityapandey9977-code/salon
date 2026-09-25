import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildGatewayApp } from '../../src/app';

describe('API Gateway Foundation', () => {
  it('should return 200 on /health', async () => {
    const app = buildGatewayApp();
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('api-gateway');
  });

  it('should return 200 on /ready', async () => {
    const app = buildGatewayApp();
    const res = await request(app).get('/ready');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('READY');
  });
});
