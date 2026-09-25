import { z } from 'zod';
export declare const AppointmentStatusEnum: z.ZodEnum<["HOLD", "PENDING_CONFIRMATION", "CONFIRMED", "CHECKED_IN", "IN_SERVICE", "COMPLETED", "CANCELLED", "NO_SHOW"]>;
export type AppointmentStatus = z.infer<typeof AppointmentStatusEnum>;
export declare const BookingSourceEnum: z.ZodEnum<["ADMIN", "BRANCH", "ONLINE", "CALL_CENTER", "WALK_IN", "CUSTOMER_APP"]>;
export type BookingSource = z.infer<typeof BookingSourceEnum>;
export declare const AppointmentItemRequestSchema: z.ZodObject<{
    serviceId: z.ZodString;
    staffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    resourceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    scheduledStartAt: z.ZodUnion<[z.ZodString, z.ZodString]>;
    scheduledEndAt: z.ZodUnion<[z.ZodString, z.ZodString]>;
    price: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    serviceId: string;
    scheduledStartAt: string;
    scheduledEndAt: string;
    staffId?: string | null | undefined;
    resourceId?: string | null | undefined;
    price?: number | undefined;
    notes?: string | null | undefined;
}, {
    serviceId: string;
    scheduledStartAt: string;
    scheduledEndAt: string;
    staffId?: string | null | undefined;
    resourceId?: string | null | undefined;
    price?: number | undefined;
    notes?: string | null | undefined;
}>;
export type AppointmentItemRequest = z.infer<typeof AppointmentItemRequestSchema>;
export declare const CreateAppointmentRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    customerId: z.ZodString;
    source: z.ZodDefault<z.ZodEnum<["ADMIN", "BRANCH", "ONLINE", "CALL_CENTER", "WALK_IN", "CUSTOMER_APP"]>>;
    scheduledStartAt: z.ZodUnion<[z.ZodString, z.ZodString]>;
    scheduledEndAt: z.ZodUnion<[z.ZodString, z.ZodString]>;
    timezone: z.ZodDefault<z.ZodString>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        serviceId: z.ZodString;
        staffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        resourceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        scheduledStartAt: z.ZodUnion<[z.ZodString, z.ZodString]>;
        scheduledEndAt: z.ZodUnion<[z.ZodString, z.ZodString]>;
        price: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        serviceId: string;
        scheduledStartAt: string;
        scheduledEndAt: string;
        staffId?: string | null | undefined;
        resourceId?: string | null | undefined;
        price?: number | undefined;
        notes?: string | null | undefined;
    }, {
        serviceId: string;
        scheduledStartAt: string;
        scheduledEndAt: string;
        staffId?: string | null | undefined;
        resourceId?: string | null | undefined;
        price?: number | undefined;
        notes?: string | null | undefined;
    }>, "many">;
    holdToken: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    depositRequired: z.ZodOptional<z.ZodBoolean>;
    depositAmount: z.ZodOptional<z.ZodNumber>;
    totalAmount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    branchId: string;
    scheduledStartAt: string;
    scheduledEndAt: string;
    customerId: string;
    source: "BRANCH" | "ADMIN" | "ONLINE" | "CALL_CENTER" | "WALK_IN" | "CUSTOMER_APP";
    timezone: string;
    items: {
        serviceId: string;
        scheduledStartAt: string;
        scheduledEndAt: string;
        staffId?: string | null | undefined;
        resourceId?: string | null | undefined;
        price?: number | undefined;
        notes?: string | null | undefined;
    }[];
    notes?: string | null | undefined;
    holdToken?: string | null | undefined;
    depositRequired?: boolean | undefined;
    depositAmount?: number | undefined;
    totalAmount?: number | undefined;
}, {
    branchId: string;
    scheduledStartAt: string;
    scheduledEndAt: string;
    customerId: string;
    items: {
        serviceId: string;
        scheduledStartAt: string;
        scheduledEndAt: string;
        staffId?: string | null | undefined;
        resourceId?: string | null | undefined;
        price?: number | undefined;
        notes?: string | null | undefined;
    }[];
    notes?: string | null | undefined;
    source?: "BRANCH" | "ADMIN" | "ONLINE" | "CALL_CENTER" | "WALK_IN" | "CUSTOMER_APP" | undefined;
    timezone?: string | undefined;
    holdToken?: string | null | undefined;
    depositRequired?: boolean | undefined;
    depositAmount?: number | undefined;
    totalAmount?: number | undefined;
}>;
export type CreateAppointmentRequest = z.infer<typeof CreateAppointmentRequestSchema>;
export declare const UpdateAppointmentStatusRequestSchema: z.ZodObject<{
    status: z.ZodEnum<["HOLD", "PENDING_CONFIRMATION", "CONFIRMED", "CHECKED_IN", "IN_SERVICE", "COMPLETED", "CANCELLED", "NO_SHOW"]>;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "HOLD" | "PENDING_CONFIRMATION" | "CONFIRMED" | "CHECKED_IN" | "IN_SERVICE" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    reason?: string | null | undefined;
}, {
    status: "HOLD" | "PENDING_CONFIRMATION" | "CONFIRMED" | "CHECKED_IN" | "IN_SERVICE" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    reason?: string | null | undefined;
}>;
export type UpdateAppointmentStatusRequest = z.infer<typeof UpdateAppointmentStatusRequestSchema>;
export declare const ReassignStaffRequestSchema: z.ZodObject<{
    appointmentItemId: z.ZodString;
    newStaffId: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    appointmentItemId: string;
    newStaffId: string;
    reason?: string | null | undefined;
}, {
    appointmentItemId: string;
    newStaffId: string;
    reason?: string | null | undefined;
}>;
export type ReassignStaffRequest = z.infer<typeof ReassignStaffRequestSchema>;
export declare const CheckAvailabilityRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    serviceId: z.ZodString;
    staffId: z.ZodOptional<z.ZodString>;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    branchId: string;
    serviceId: string;
    staffId?: string | undefined;
}, {
    date: string;
    branchId: string;
    serviceId: string;
    staffId?: string | undefined;
}>;
export type CheckAvailabilityRequest = z.infer<typeof CheckAvailabilityRequestSchema>;
export declare const HoldSlotRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    staffId: z.ZodString;
    startsAt: z.ZodUnion<[z.ZodString, z.ZodString]>;
    durationMinutes: z.ZodNumber;
    customerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branchId: string;
    staffId: string;
    startsAt: string;
    durationMinutes: number;
    customerId?: string | null | undefined;
}, {
    branchId: string;
    staffId: string;
    startsAt: string;
    durationMinutes: number;
    customerId?: string | null | undefined;
}>;
export type HoldSlotRequest = z.infer<typeof HoldSlotRequestSchema>;
export declare const CreateWalkInRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    customerId: z.ZodString;
    serviceId: z.ZodString;
    staffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branchId: string;
    serviceId: string;
    customerId: string;
    staffId?: string | null | undefined;
    notes?: string | null | undefined;
}, {
    branchId: string;
    serviceId: string;
    customerId: string;
    staffId?: string | null | undefined;
    notes?: string | null | undefined;
}>;
export type CreateWalkInRequest = z.infer<typeof CreateWalkInRequestSchema>;
export declare const QueryAppointmentsRequestSchema: z.ZodObject<{
    branchId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    staffId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["HOLD", "PENDING_CONFIRMATION", "CONFIRMED", "CHECKED_IN", "IN_SERVICE", "COMPLETED", "CANCELLED", "NO_SHOW"]>>;
    date: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "HOLD" | "PENDING_CONFIRMATION" | "CONFIRMED" | "CHECKED_IN" | "IN_SERVICE" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | undefined;
    date?: string | undefined;
    branchId?: string | undefined;
    staffId?: string | undefined;
    customerId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    status?: "HOLD" | "PENDING_CONFIRMATION" | "CONFIRMED" | "CHECKED_IN" | "IN_SERVICE" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | undefined;
    date?: string | undefined;
    branchId?: string | undefined;
    staffId?: string | undefined;
    customerId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type QueryAppointmentsRequest = z.infer<typeof QueryAppointmentsRequestSchema>;
//# sourceMappingURL=booking.contracts.d.ts.map