import pino, { type Logger, type LoggerOptions } from 'pino';

export interface LogContext {
  service?: string;
  requestId?: string;
  correlationId?: string;
  tenantId?: string | null;
  branchId?: string | null;
  franchiseId?: string | null;
  userId?: string | null;
  eventId?: string;
  durationMs?: number;
  statusCode?: number;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = [
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'serviceInternalSecret',
  'otp',
  'pin',
  'cvv',
  'cardNumber',
  'bankAccountNumber',
  'authorization',
];

export function createLogger(serviceName: string, options?: LoggerOptions): Logger {
  const isDev = process.env.NODE_ENV !== 'production';

  return pino({
    name: serviceName,
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
    redact: {
      paths: SENSITIVE_KEYS.flatMap((key) => [
        key,
        `*.${key}`,
        `*.*.${key}`,
        `headers.authorization`,
        `headers.cookie`,
        `body.${key}`,
        `payload.${key}`,
      ]),
      censor: '[REDACTED]',
    },
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    base: {
      service: serviceName,
      env: process.env.NODE_ENV || 'development',
    },
    ...options,
  });
}

export type { Logger };
