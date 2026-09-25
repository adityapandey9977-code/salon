import type { NextFunction, Request, Response } from 'express';
import {
  CreateAppointmentRequestSchema,
  UpdateAppointmentStatusRequestSchema,
} from '@salon-spa-saas/contracts';
import { bookingService } from '../../application/services/booking.service';

export class AppointmentController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const { branchId, customerId, staffId, status, startDate, endDate, page, limit } = req.query;

      const result = await bookingService.list(tenantId, {
        branchId: branchId as string,
        customerId: customerId as string,
        staffId: staffId as string,
        status: status as any,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        meta: {
          total: result.total,
          page: page ? Number(page) : 1,
          limit: limit ? Number(limit) : 20,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const appointment = await bookingService.getById(tenantId, id);
      res.status(200).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const validated = CreateAppointmentRequestSchema.parse(req.body);

      const appointment = await bookingService.create(
        tenantId,
        {
          branchId: validated.branchId,
          customerId: validated.customerId,
          source: (validated.source as any) || 'ADMIN',
          scheduledStartAt: validated.scheduledStartAt,
          scheduledEndAt: validated.scheduledEndAt,
          notes: validated.notes,
          depositRequired: validated.depositRequired,
          depositAmount: validated.depositAmount,
          items: validated.items.map((it: any) => ({
            serviceId: it.serviceId,
            staffId: it.staffId,
            scheduledStartAt: it.scheduledStartAt,
            scheduledEndAt: it.scheduledEndAt,
            price: it.price,
          })),
        },
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
      );

      res.status(201).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const validated = UpdateAppointmentStatusRequestSchema.parse(req.body);

      const appointment = await bookingService.updateStatus(
        tenantId,
        id,
        validated.status as any,
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
        validated.reason || undefined,
      );

      res.status(200).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  }

  public static async reassign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const { itemId, newStaffId } = req.body;
      const appointment = await bookingService.reassignStaff(
        tenantId,
        id,
        itemId,
        newStaffId,
      );
      res.status(200).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  }

  public static async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const appointment = await bookingService.updateStatus(
        tenantId,
        id,
        'CONFIRMED',
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
        'Confirmed by staff/admin',
      );
      res.status(200).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  }

  public static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const appointment = await bookingService.updateStatus(
        tenantId,
        id,
        'CANCELLED',
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
        req.body?.reason || 'Cancelled by user',
      );
      res.status(200).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  }

  public static async startService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const appointment = await bookingService.updateStatus(
        tenantId,
        id,
        'IN_SERVICE',
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
        'Service started by stylist',
      );
      res.status(200).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  }

  public static async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const id = req.params.id as string;
      const appointment = await bookingService.updateStatus(
        tenantId,
        id,
        'COMPLETED',
        {
          principalType: req.principal!.principalType,
          userId: req.principal!.userId,
        },
        'Service completed',
      );
      res.status(200).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  }

  public static async getCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const branchId = req.query.branchId as string;
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const calendar = await bookingService.getCalendar(tenantId, branchId, date);
      res.status(200).json({ success: true, data: calendar });
    } catch (err) {
      next(err);
    }
  }

  public static async getTodayQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const branchId = req.query.branchId as string;
      const queue = await bookingService.getTodayQueue(tenantId, branchId);
      res.status(200).json({ success: true, data: queue });
    } catch (err) {
      next(err);
    }
  }

  public static async getStylistSchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const staffId = req.query.staffId as string;
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const schedule = await bookingService.getStylistSchedule(tenantId, staffId, date);
      res.status(200).json({ success: true, data: schedule });
    } catch (err) {
      next(err);
    }
  }

  public static async getMyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const customerId = (req.query.customerId as string) || req.principal!.userId;
      const bookings = await bookingService.getMyBookings(tenantId, customerId || '');
      res.status(200).json({ success: true, data: bookings });
    } catch (err) {
      next(err);
    }
  }

  public static async getPendingConfirmations(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const branchId = req.query.branchId as string;
      const pending = await bookingService.getPendingConfirmations(tenantId, branchId);
      res.status(200).json({ success: true, data: pending });
    } catch (err) {
      next(err);
    }
  }

  public static async getCrossBranch(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tenantId = req.principal!.tenantId;
      const customerId = req.query.customerId as string;
      const bookings = await bookingService.getCrossBranch(tenantId, customerId);
      res.status(200).json({ success: true, data: bookings });
    } catch (err) {
      next(err);
    }
  }
}
