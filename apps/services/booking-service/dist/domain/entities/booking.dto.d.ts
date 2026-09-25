export interface AppointmentItemDto {
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
export interface AppointmentResourceDto {
    id: string;
    tenantId: string;
    appointmentId: string;
    appointmentItemId?: string | null;
    resourceId: string;
    resourceType: string;
    createdAt: string;
}
export interface AppointmentDto {
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
    items?: AppointmentItemDto[];
    resources?: AppointmentResourceDto[];
    createdAt: string;
    updatedAt: string;
}
export interface BookingHoldDto {
    id: string;
    tenantId: string;
    branchId: string;
    holdToken: string;
    customerId?: string | null;
    startsAt: string;
    endsAt: string;
    expiresAt: string;
    status: string;
    createdAt: string;
}
export interface WaitlistEntryDto {
    id: string;
    tenantId: string;
    branchId: string;
    customerId: string;
    serviceId: string;
    preferredStaffId?: string | null;
    preferredDate: string;
    preferredStartTime?: string | null;
    preferredEndTime?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}
export interface TimeSlotDto {
    startTime: string;
    endTime: string;
    staffId?: string;
    available: boolean;
    reason?: string;
}
//# sourceMappingURL=booking.dto.d.ts.map