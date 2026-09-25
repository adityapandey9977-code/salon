import Redis from 'ioredis';
import { config } from '../../config';

export const redis = new Redis(config.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: config.NODE_ENV === 'test' ? 0 : 3,
  enableOfflineQueue: config.NODE_ENV !== 'test',
  retryStrategy(times) {
    if (config.NODE_ENV === 'test') return null;
    return Math.min(times * 100, 2000);
  },
});

redis.on('error', () => {
  // Silent suppress unhandled error events
});
