import { waitlistRepository } from '../../infrastructure/repositories/waitlist.repository';
export class WaitlistController {
    static async list(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const { branchId, preferredDate, status } = req.query;
            const entries = await waitlistRepository.list(tenantId, {
                branchId: branchId,
                preferredDate: preferredDate,
                status: status,
            });
            res.status(200).json({ success: true, data: entries });
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const { branchId, customerId, serviceId, preferredStaffId, preferredDate, preferredStartTime, preferredEndTime, } = req.body;
            const entry = await waitlistRepository.create({
                tenantId,
                branchId,
                customerId,
                serviceId,
                preferredStaffId,
                preferredDate,
                preferredStartTime,
                preferredEndTime,
            });
            res.status(201).json({ success: true, data: entry });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const { status } = req.body;
            const entry = await waitlistRepository.updateStatus(tenantId, id, status);
            res.status(200).json({ success: true, data: entry });
        }
        catch (err) {
            next(err);
        }
    }
}
