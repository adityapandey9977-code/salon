import { apiClient } from './client';
import type { ApiResponse } from './types';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketCategory =
  | 'Royalty Billing'
  | 'Compliance Audit'
  | 'Inventory Supply'
  | 'Technical Support'
  | 'Marketing Assets'
  | 'General';

export interface SupportTicket {
  id: string;
  tenantId: string;
  submittedBy: string;
  submittedByEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  attachmentName?: string | null;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
}

export interface CreateTicketPayload {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  attachmentName?: string;
  tenantId?: string;
  submittedBy?: string;
  submittedByEmail?: string;
}

export const supportApi = {
  /**
   * List support tickets for the current tenant.
   * Optionally filter by status, priority, or category.
   */
  async listTickets(filters?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
  }): Promise<SupportTicket[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.category) params.append('category', filters.category);
    const qs = params.toString();
    const url = `/api/v1/support/tickets${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get<ApiResponse<SupportTicket[]>>(url);
    return res.data.data;
  },

  /**
   * Get a single ticket by ID.
   */
  async getTicket(id: string): Promise<SupportTicket> {
    const res = await apiClient.get<ApiResponse<SupportTicket>>(`/api/v1/support/tickets/${id}`);
    return res.data.data;
  },

  /**
   * Create a new support ticket.
   */
  async createTicket(payload: CreateTicketPayload): Promise<SupportTicket> {
    const res = await apiClient.post<ApiResponse<SupportTicket>>('/api/v1/support/tickets', payload);
    return res.data.data;
  },

  /**
   * Update a ticket's status.
   */
  async updateStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
    const res = await apiClient.patch<ApiResponse<SupportTicket>>(
      `/api/v1/support/tickets/${id}/status`,
      { status },
    );
    return res.data.data;
  },

  /**
   * Delete a ticket.
   */
  async deleteTicket(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/api/v1/support/tickets/${id}`);
  },
};
