import Redis from 'ioredis';
import { config } from '../../config';

export const redis = new Redis(config.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 100, 2000);
  },
});

redis.on('error', (err) => {
  console.warn('[Identity Redis] Connection error:', err.message);
});
