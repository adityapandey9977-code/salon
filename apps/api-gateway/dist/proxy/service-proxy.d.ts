import type { Request, Response } from 'express';
export declare const identityServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const organizationServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const peopleServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const customerServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const bookingServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const commerceServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const paymentServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const inventoryServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const financeServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const communicationServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const platformServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare const reportingServiceProxy: import("http-proxy-middleware").RequestHandler<any, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
export declare function handleUnimplementedService(serviceName: string): (_req: Request, res: Response) => void;
//# sourceMappingURL=service-proxy.d.ts.map