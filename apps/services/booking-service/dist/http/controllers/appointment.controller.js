import { CreateAppointmentRequestSchema, UpdateAppointmentStatusRequestSchema, } from '@salon-spa-saas/contracts';
import { bookingService } from '../../application/services/booking.service';
export class AppointmentController {
    static async list(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const { branchId, customerId, staffId, status, startDate, endDate, page, limit } = req.query;
            const result = await bookingService.list(tenantId, {
                branchId: branchId,
                customerId: customerId,
                staffId: staffId,
                status: status,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
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
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const appointment = await bookingService.getById(tenantId, id);
            res.status(200).json({ success: true, data: appointment });
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const validated = CreateAppointmentRequestSchema.parse(req.body);
            const appointment = await bookingService.create(tenantId, {
                branchId: validated.branchId,
                customerId: validated.customerId,
                source: validated.source || 'ADMIN',
                scheduledStartAt: validated.scheduledStartAt,
                scheduledEndAt: validated.scheduledEndAt,
                notes: validated.notes,
                depositRequired: validated.depositRequired,
                depositAmount: validated.depositAmount,
                items: validated.items.map((it) => ({
                    serviceId: it.serviceId,
                    staffId: it.staffId,
                    scheduledStartAt: it.scheduledStartAt,
                    scheduledEndAt: it.scheduledEndAt,
                    price: it.price,
                })),
            }, {
                principalType: req.principal.principalType,
                userId: req.principal.userId,
            });
            res.status(201).json({ success: true, data: appointment });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const validated = UpdateAppointmentStatusRequestSchema.parse(req.body);
            const appointment = await bookingService.updateStatus(tenantId, id, validated.status, {
                principalType: req.principal.principalType,
                userId: req.principal.userId,
            }, validated.reason || undefined);
            res.status(200).json({ success: true, data: appointment });
        }
        catch (err) {
            next(err);
        }
    }
    static async reassign(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const { itemId, newStaffId } = req.body;
            const appointment = await bookingService.reassignStaff(tenantId, id, itemId, newStaffId);
            res.status(200).json({ success: true, data: appointment });
        }
        catch (err) {
            next(err);
        }
    }
    static async confirm(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const appointment = await bookingService.updateStatus(tenantId, id, 'CONFIRMED', {
                principalType: req.principal.principalType,
                userId: req.principal.userId,
            }, 'Confirmed by staff/admin');
            res.status(200).json({ success: true, data: appointment });
        }
        catch (err) {
            next(err);
        }
    }
    static async cancel(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const appointment = await bookingService.updateStatus(tenantId, id, 'CANCELLED', {
                principalType: req.principal.principalType,
                userId: req.principal.userId,
            }, req.body?.reason || 'Cancelled by user');
            res.status(200).json({ success: true, data: appointment });
        }
        catch (err) {
            next(err);
        }
    }
    static async startService(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const appointment = await bookingService.updateStatus(tenantId, id, 'IN_SERVICE', {
                principalType: req.principal.principalType,
                userId: req.principal.userId,
            }, 'Service started by stylist');
            res.status(200).json({ success: true, data: appointment });
        }
        catch (err) {
            next(err);
        }
    }
    static async complete(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const appointment = await bookingService.updateStatus(tenantId, id, 'COMPLETED', {
                principalType: req.principal.principalType,
                userId: req.principal.userId,
            }, 'Service completed');
            res.status(200).json({ success: true, data: appointment });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCalendar(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const branchId = req.query.branchId;
            const date = req.query.date || new Date().toISOString().split('T')[0];
            const calendar = await bookingService.getCalendar(tenantId, branchId, date);
            res.status(200).json({ success: true, data: calendar });
        }
        catch (err) {
            next(err);
        }
    }
    static async getTodayQueue(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const branchId = req.query.branchId;
            const queue = await bookingService.getTodayQueue(tenantId, branchId);
            res.status(200).json({ success: true, data: queue });
        }
        catch (err) {
            next(err);
        }
    }
    static async getStylistSchedule(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const staffId = req.query.staffId;
            const date = req.query.date || new Date().toISOString().split('T')[0];
            const schedule = await bookingService.getStylistSchedule(tenantId, staffId, date);
            res.status(200).json({ success: true, data: schedule });
        }
        catch (err) {
            next(err);
        }
    }
    static async getMyBookings(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const customerId = req.query.customerId || req.principal.userId;
            const bookings = await bookingService.getMyBookings(tenantId, customerId || '');
            res.status(200).json({ success: true, data: bookings });
        }
        catch (err) {
            next(err);
        }
    }
    static async getPendingConfirmations(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const branchId = req.query.branchId;
            const pending = await bookingService.getPendingConfirmations(tenantId, branchId);
            res.status(200).json({ success: true, data: pending });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCrossBranch(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const customerId = req.query.customerId;
            const bookings = await bookingService.getCrossBranch(tenantId, customerId);
            res.status(200).json({ success: true, data: bookings });
        }
        catch (err) {
            next(err);
        }
    }
}
