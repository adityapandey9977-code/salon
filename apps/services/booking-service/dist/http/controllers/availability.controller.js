import { BadRequestError } from '@salon-spa-saas/common-types';
import { availabilityService } from '../../application/services/availability.service';
export class AvailabilityController {
    static async getAvailability(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const { branchId, serviceId, date, staffId, duration } = req.query;
            if (!branchId || !date) {
                throw new BadRequestError('branchId and date query parameters are required');
            }
            const slots = await availabilityService.getAvailableSlots({
                tenantId,
                branchId: branchId,
                serviceId: serviceId,
                date: date,
                staffId: staffId,
                durationMinutes: duration ? Number(duration) : undefined,
            });
            res.status(200).json({ success: true, data: slots });
        }
        catch (err) {
            next(err);
        }
    }
}
