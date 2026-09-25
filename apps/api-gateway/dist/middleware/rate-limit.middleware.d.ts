import type { NextFunction, Request, Response } from 'express';
export declare function createRedisRateLimiter(options: {
    keyPrefix: string;
    limit: number;
    windowSec: number;
}): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authRateLimiter: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const apiRateLimiter: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=rate-limit.middleware.d.ts.map