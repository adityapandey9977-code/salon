import { z } from 'zod';
export const AppointmentStatusEnum = z.enum([
    'HOLD',
    'PENDING_CONFIRMATION',
    'CONFIRMED',
    'CHECKED_IN',
    'IN_SERVICE',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
]);
export const BookingSourceEnum = z.enum(['ADMIN', 'BRANCH', 'ONLINE', 'CALL_CENTER', 'WALK_IN', 'CUSTOMER_APP']);
export const AppointmentItemRequestSchema = z.object({
    serviceId: z.string().uuid(),
    staffId: z.string().uuid().optional().nullable(),
    resourceId: z.string().uuid().optional().nullable(),
    scheduledStartAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)),
    scheduledEndAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)),
    price: z.number().optional(),
    notes: z.string().optional().nullable(),
});
export const CreateAppointmentRequestSchema = z.object({
    branchId: z.string().uuid(),
    customerId: z.string().uuid(),
    source: BookingSourceEnum.default('ADMIN'),
    scheduledStartAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)),
    scheduledEndAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)),
    timezone: z.string().default('Asia/Kolkata'),
    notes: z.string().max(1000).optional().nullable(),
    items: z.array(AppointmentItemRequestSchema).min(1),
    holdToken: z.string().optional().nullable(),
    depositRequired: z.boolean().optional(),
    depositAmount: z.number().optional(),
    totalAmount: z.number().optional(),
});
export const UpdateAppointmentStatusRequestSchema = z.object({
    status: AppointmentStatusEnum,
    reason: z.string().optional().nullable(),
});
export const ReassignStaffRequestSchema = z.object({
    appointmentItemId: z.string().uuid(),
    newStaffId: z.string().uuid(),
    reason: z.string().optional().nullable(),
});
export const CheckAvailabilityRequestSchema = z.object({
    branchId: z.string().uuid(),
    serviceId: z.string().uuid(),
    staffId: z.string().uuid().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});
export const HoldSlotRequestSchema = z.object({
    branchId: z.string().uuid(),
    staffId: z.string().uuid(),
    startsAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)),
    durationMinutes: z.number().int().positive(),
    customerId: z.string().uuid().optional().nullable(),
});
export const CreateWalkInRequestSchema = z.object({
    branchId: z.string().uuid(),
    customerId: z.string().uuid(),
    serviceId: z.string().uuid(),
    staffId: z.string().uuid().optional().nullable(),
    notes: z.string().optional().nullable(),
});
export const QueryAppointmentsRequestSchema = z.object({
    branchId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
    staffId: z.string().uuid().optional(),
    status: AppointmentStatusEnum.optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
