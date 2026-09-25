import { NotFoundError } from '@salon-spa-saas/common-types';
import type { CustomerCautionDto } from '../../domain/entities/customer.dto';
import { prisma } from '../prisma/client';
import type { CustomerCaution } from '../prisma/generated-client';

export class CautionRepository {
  private toDto(item: CustomerCaution): CustomerCautionDto {
    return {
      id: item.id,
      tenantId: item.tenantId,
      customerId: item.customerId,
      type: item.type,
      title: item.title,
      description: item.description,
      severity: item.severity,
      active: item.active,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  public async findByCustomerId(tenantId: string, customerId: string): Promise<CustomerCautionDto[]> {
    const records = await prisma.customerCaution.findMany({
      where: { tenantId, customerId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDto(r));
  }

  public async create(data: {
    tenantId: string;
    customerId: string;
    type: string;
    title: string;
    description?: string | null;
    severity?: any;
    active?: boolean;
  }): Promise<CustomerCautionDto> {
    const record = await prisma.customerCaution.create({
      data: {
        tenantId: data.tenantId,
        customerId: data.customerId,
        type: data.type,
        title: data.title,
        description: data.description,
        severity: data.severity || 'MEDIUM',
        active: data.active !== undefined ? data.active : true,
      },
    });
    return this.toDto(record);
  }

  public async update(
    tenantId: string,
    id: string,
    data: {
      type?: string;
      title?: string;
      description?: string | null;
      severity?: any;
      active?: boolean;
    },
  ): Promise<CustomerCautionDto> {
    const existing = await prisma.customerCaution.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new NotFoundError('Customer caution not found');

    const updated = await prisma.customerCaution.update({
      where: { id },
      data,
    });
    return this.toDto(updated);
  }
}

export const cautionRepository = new CautionRepository();
