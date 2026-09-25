import pino from 'pino';
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
export function createLogger(serviceName, options) {
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
