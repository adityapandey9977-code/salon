import type { NextFunction, Request, Response } from 'express';
export declare class AppointmentController {
    static list(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static reassign(req: Request, res: Response, next: NextFunction): Promise<void>;
    static confirm(req: Request, res: Response, next: NextFunction): Promise<void>;
    static cancel(req: Request, res: Response, next: NextFunction): Promise<void>;
    static startService(req: Request, res: Response, next: NextFunction): Promise<void>;
    static complete(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCalendar(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTodayQueue(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStylistSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMyBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPendingConfirmations(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCrossBranch(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=appointment.controller.d.ts.map