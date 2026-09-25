import type { CreateCustomerNoteRequest } from '@salon-spa-saas/contracts';
import type { CustomerNoteDto } from '../../domain/entities/customer.dto';
import { noteRepository } from '../../infrastructure/repositories/note.repository';

export class NoteService {
  public async getNotes(tenantId: string, customerId: string): Promise<CustomerNoteDto[]> {
    return noteRepository.findByCustomerId(tenantId, customerId);
  }

  public async addNote(
    tenantId: string,
    customerId: string,
    input: CreateCustomerNoteRequest,
    principalType = 'USER',
    userId: string | null = null,
  ): Promise<CustomerNoteDto> {
    return noteRepository.create({
      tenantId,
      customerId,
      noteType: input.noteType,
      content: input.content,
      isPinned: input.isPinned,
      createdByPrincipalType: principalType,
      createdByUserId: userId,
    });
  }
}

export const noteService = new NoteService();
