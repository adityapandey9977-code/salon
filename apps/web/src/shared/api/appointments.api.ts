import { apiClient, tokenStorage } from './client';
import type { ApiResponse } from './types';

export interface ListAppointmentsParams {
  branchId?: string;
  customerId?: string;
  staffId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentItemPayload {
  serviceId: string;
  staffId?: string | null;
  resourceId?: string | null;
  scheduledStartAt: string;
  scheduledEndAt: string;
  price?: number;
  notes?: string | null;
}

export interface CreateAppointmentPayload {
  branchId: string;
  customerId: string;
  source?: 'ADMIN' | 'BRANCH' | 'ONLINE' | 'CALL_CENTER' | 'WALK_IN' | 'CUSTOMER_APP';
  scheduledStartAt: string;
  scheduledEndAt: string;
  timezone?: string;
  notes?: string | null;
  depositRequired?: boolean;
  depositAmount?: number;
  totalAmount?: number;
  items: AppointmentItemPayload[];
}

export interface ApiAppointmentItem {
  id: string;
  tenantId: string;
  appointmentId: string;
  serviceId: string;
  staffId?: string | null;
  scheduledStartAt: string;
  scheduledEndAt: string;
  priceSnapshot: number;
  durationMinutesSnapshot: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAppointmentResource {
  id: string;
  tenantId: string;
  appointmentId: string;
  appointmentItemId?: string | null;
  resourceId: string;
  resourceType: string;
  createdAt: string;
}

export interface ApiAppointmentSummary {
  id: string;
  tenantId: string;
  branchId: string;
  customerId: string;
  bookingNumber: string;
  source: string;
  status: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  timezone: string;
  subtotalEstimate: number;
  depositRequired: boolean;
  depositAmount: number;
  notes?: string | null;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  completedAt?: string | null;
  items?: ApiAppointmentItem[];
  resources?: ApiAppointmentResource[];
  createdAt: string;
  updatedAt: string;
}

export const appointmentsApi = {
  /**
   * List / search appointments for active tenant and optional branch
   */
  async list(params?: ListAppointmentsParams): Promise<ApiAppointmentSummary[]> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.get<ApiResponse<ApiAppointmentSummary[]>>('/api/v1/appointments', {
      params: tid ? { tenantId: tid, ...params } : params,
      headers,
    });
    // Response might be { success: true, data: [...] } or { success: true, data: { data: [...] } }
    const resData: any = response.data.data;
    if (Array.isArray(resData)) {
      return resData;
    }
    if (resData && Array.isArray(resData.data)) {
      return resData.data;
    }
    return [];
  },

  /**
   * Get single appointment by UUID
   */
  async getById(id: string): Promise<ApiAppointmentSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.get<ApiResponse<ApiAppointmentSummary>>(`/api/v1/appointments/${id}`, {
      headers,
    });
    return response.data.data;
  },

  /**
   * Create a new appointment persisted in booking_db
   */
  async create(payload: CreateAppointmentPayload): Promise<ApiAppointmentSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const cleanPayload: CreateAppointmentPayload = {
      ...payload,
      source: payload.source || 'ADMIN',
      timezone: payload.timezone || 'Asia/Kolkata',
      notes: payload.notes?.trim() ? payload.notes.trim() : undefined,
      depositRequired: Boolean(payload.depositRequired),
      depositAmount: payload.depositAmount ? Number(payload.depositAmount) : 0,
      totalAmount: payload.totalAmount ? Number(payload.totalAmount) : undefined,
      items: payload.items.map((it) => ({
        serviceId: it.serviceId,
        staffId: it.staffId || undefined,
        resourceId: it.resourceId || undefined,
        scheduledStartAt: it.scheduledStartAt,
        scheduledEndAt: it.scheduledEndAt,
        price: it.price !== undefined ? Number(it.price) : undefined,
        notes: it.notes?.trim() || undefined,
      })),
    };

    const response = await apiClient.post<ApiResponse<ApiAppointmentSummary>>(
      '/api/v1/appointments',
      cleanPayload,
      { headers },
    );
    return response.data.data;
  },

  /**
   * Update appointment status (CONFIRMED, IN_SERVICE, COMPLETED, CANCELLED, etc.)
   */
  async updateStatus(id: string, status: string, reason?: string): Promise<ApiAppointmentSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.patch<ApiResponse<ApiAppointmentSummary>>(
      `/api/v1/appointments/${id}/status`,
      { status, reason },
      { headers },
    );
    return response.data.data;
  },

  /**
   * Start service for appointment (transitions to IN_SERVICE)
   */
  async startService(id: string): Promise<ApiAppointmentSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.patch<ApiResponse<ApiAppointmentSummary>>(
      `/api/v1/appointments/${id}/start-service`,
      {},
      { headers },
    );
    return response.data.data;
  },

  /**
   * Complete appointment service (transitions to COMPLETED, records completedAt)
   */
  async completeService(id: string): Promise<ApiAppointmentSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.patch<ApiResponse<ApiAppointmentSummary>>(
      `/api/v1/appointments/${id}/complete`,
      {},
      { headers },
    );
    return response.data.data;
  },

  /**
   * Cancel appointment with reason
   */
  async cancel(id: string, reason?: string): Promise<ApiAppointmentSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.patch<ApiResponse<ApiAppointmentSummary>>(
      `/api/v1/appointments/${id}/cancel`,
      { reason },
      { headers },
    );
    return response.data.data;
  },

  /**
   * Confirm booking
   */
  async confirm(id: string): Promise<ApiAppointmentSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.patch<ApiResponse<ApiAppointmentSummary>>(
      `/api/v1/appointments/${id}/confirm`,
      {},
      { headers },
    );
    return response.data.data;
  },

  /**
   * Fetch walk-in queue for active tenant and optional branch
   */
  async getWalkins(branchId?: string): Promise<ApiAppointmentSummary[]> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.get<ApiResponse<ApiAppointmentSummary[]>>(
      '/api/v1/appointments/walkins',
      {
        params: { ...(tid ? { tenantId: tid } : {}), ...(branchId ? { branchId } : {}) },
        headers,
      },
    );
    const resData: any = response.data.data;
    if (Array.isArray(resData)) return resData;
    if (resData && Array.isArray(resData.data)) return resData.data;
    return [];
  },

  /**
   * Register a new walk-in client
   */
  async createWalkin(payload: {
    branchId: string;
    customerId: string;
    items: Array<{ serviceId: string; staffId?: string | null; price?: number }>;
    notes?: string;
  }): Promise<ApiAppointmentSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.post<ApiResponse<ApiAppointmentSummary>>(
      '/api/v1/appointments/walkins',
      payload,
      { headers },
    );
    return response.data.data;
  },

  /**
   * Check dynamic slot availability for a branch, date, service, and optional staff member
   */
  async getAvailability(params: {
    branchId: string;
    date: string;
    serviceId?: string;
    staffId?: string;
    duration?: number;
  }): Promise<ApiTimeSlot[]> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.get<ApiResponse<ApiTimeSlot[]>>(
      '/api/v1/appointments/availability',
      {
        params: { ...(tid ? { tenantId: tid } : {}), ...params },
        headers,
      },
    );
    const resData: any = response.data?.data;
    if (Array.isArray(resData)) return resData;
    return [];
  },

  /**
   * Get appointments schedule for a specific stylist on a date
   */
  async getStylistSchedule(staffId: string, date: string): Promise<ApiAppointmentSummary[]> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.get<ApiResponse<ApiAppointmentSummary[]>>(
      '/api/v1/appointments/stylist-schedule',
      {
        params: { ...(tid ? { tenantId: tid } : {}), staffId, date },
        headers,
      },
    );
    const resData: any = response.data?.data;
    if (Array.isArray(resData)) return resData;
    if (resData && Array.isArray(resData.data)) return resData.data;
    return [];
  },
};

export interface ApiTimeSlot {
  startTime: string;
  endTime: string;
  staffId?: string;
  available: boolean;
  reason?: string;
}

