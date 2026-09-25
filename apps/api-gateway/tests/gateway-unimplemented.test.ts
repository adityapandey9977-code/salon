import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { handleUnimplementedService } from '../src/proxy/service-proxy';

describe('API Gateway Unimplemented Route Handler', () => {
  const app = express();
  app.get('/api/v1/unimplemented-test', handleUnimplementedService('Test Service'));

  it('returns controlled 503 SERVICE_NOT_AVAILABLE with descriptive error', async () => {
    const res = await request(app).get('/api/v1/unimplemented-test');
    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('SERVICE_NOT_AVAILABLE');
    expect(res.body.error.message).toContain('Test Service');
  });
});
