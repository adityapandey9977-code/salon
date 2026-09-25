import type { CustomerNoteDto } from '../../domain/entities/customer.dto';
import { prisma } from '../prisma/client';
import type { CustomerNote } from '../prisma/generated-client';

export class NoteRepository {
  private toDto(item: CustomerNote): CustomerNoteDto {
    return {
      id: item.id,
      tenantId: item.tenantId,
      customerId: item.customerId,
      noteType: item.noteType,
      content: item.content,
      isPinned: item.isPinned,
      createdByPrincipalType: item.createdByPrincipalType,
      createdByUserId: item.createdByUserId,
      createdAt: item.createdAt.toISOString(),
    };
  }

  public async findByCustomerId(tenantId: string, customerId: string): Promise<CustomerNoteDto[]> {
    const records = await prisma.customerNote.findMany({
      where: { tenantId, customerId },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
    return records.map((r) => this.toDto(r));
  }

  public async create(data: {
    tenantId: string;
    customerId: string;
    noteType: string;
    content: string;
    isPinned?: boolean;
    createdByPrincipalType?: string;
    createdByUserId?: string | null;
  }): Promise<CustomerNoteDto> {
    const record = await prisma.customerNote.create({
      data: {
        tenantId: data.tenantId,
        customerId: data.customerId,
        noteType: data.noteType,
        content: data.content,
        isPinned: data.isPinned || false,
        createdByPrincipalType: data.createdByPrincipalType || 'USER',
        createdByUserId: data.createdByUserId,
      },
    });
    return this.toDto(record);
  }
}

export const noteRepository = new NoteRepository();
