import type {
  CreateCustomerCautionRequest,
  UpdateCustomerCautionRequest,
} from '@salon-spa-saas/contracts';
import type { CustomerCautionDto } from '../../domain/entities/customer.dto';
import { cautionRepository } from '../../infrastructure/repositories/caution.repository';

export class CautionService {
  public async getCautions(tenantId: string, customerId: string): Promise<CustomerCautionDto[]> {
    return cautionRepository.findByCustomerId(tenantId, customerId);
  }

  public async addCaution(
    tenantId: string,
    customerId: string,
    input: CreateCustomerCautionRequest,
  ): Promise<CustomerCautionDto> {
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

  public async updateCaution(
    tenantId: string,
    cautionId: string,
    input: UpdateCustomerCautionRequest,
  ): Promise<CustomerCautionDto> {
    return cautionRepository.update(tenantId, cautionId, input);
  }
}

export const cautionService = new CautionService();
