import { cautionRepository } from '../../infrastructure/repositories/caution.repository';
export class CautionService {
    async getCautions(tenantId, customerId) {
        return cautionRepository.findByCustomerId(tenantId, customerId);
    }
    async addCaution(tenantId, customerId, input) {
        return cautionRepository.create({
            tenantId,
            customerId,
            type: input.type,
            title: input.title,
            description: input.description,
            severity: input.severity,
            active: input.active,
        });
    }
    async updateCaution(tenantId, cautionId, input) {
        return cautionRepository.update(tenantId, cautionId, input);
    }
}
export const cautionService = new CautionService();
