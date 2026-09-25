import { z } from 'zod';
export declare const CustomerStatusEnum: z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>;
export type CustomerStatus = z.infer<typeof CustomerStatusEnum>;
export declare const CustomerSourceEnum: z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>;
export type CustomerSource = z.infer<typeof CustomerSourceEnum>;
export declare const GenderEnum: z.ZodEnum<["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]>;
export type Gender = z.infer<typeof GenderEnum>;
export declare const CautionSeverityEnum: z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>;
export type CautionSeverity = z.infer<typeof CautionSeverityEnum>;
export declare const LeadStatusEnum: z.ZodEnum<["NEW", "CONTACTED", "QUALIFIED", "BOOKING_PENDING", "CONVERTED", "LOST"]>;
export type LeadStatus = z.infer<typeof LeadStatusEnum>;
export declare const CreateCustomerRequestSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    displayName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mobilePhone: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    alternatePhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    gender: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]>, z.ZodString]>, string, unknown>>>;
    dateOfBirth: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>, z.ZodString]>, string, unknown>>>;
    preferredBranchId: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    franchiseId: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    source: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>, z.ZodString]>>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    segment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["HOME", "WORK", "BILLING", "OTHER"]>>;
        addressLine1: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        addressLine2: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        postalCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        country: z.ZodDefault<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "HOME" | "WORK" | "BILLING";
        country: string;
        isDefault: boolean;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
    }, {
        type?: "OTHER" | "HOME" | "WORK" | "BILLING" | undefined;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }>>;
    preferences: z.ZodOptional<z.ZodObject<{
        preferredStaffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        preferredCommunicationChannel: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodString>;
        appointmentReminderEnabled: z.ZodDefault<z.ZodBoolean>;
        marketingConsent: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        preferredCommunicationChannel: string;
        language: string;
        appointmentReminderEnabled: boolean;
        marketingConsent: boolean;
        preferredStaffId?: string | null | undefined;
    }, {
        preferredStaffId?: string | null | undefined;
        preferredCommunicationChannel?: string | undefined;
        language?: string | undefined;
        appointmentReminderEnabled?: boolean | undefined;
        marketingConsent?: boolean | undefined;
    }>>;
    cautions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["ALLERGY", "SKIN_SENSITIVITY", "HAIR_CHEMICAL_HISTORY", "MEDICAL_CAUTION", "SERVICE_RESTRICTION", "OTHER"]>;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        severity: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        description?: string | null | undefined;
    }, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        description?: string | null | undefined;
        severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    firstName: z.ZodString;
    lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    displayName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mobilePhone: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    alternatePhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    gender: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]>, z.ZodString]>, string, unknown>>>;
    dateOfBirth: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>, z.ZodString]>, string, unknown>>>;
    preferredBranchId: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    franchiseId: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    source: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>, z.ZodString]>>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    segment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["HOME", "WORK", "BILLING", "OTHER"]>>;
        addressLine1: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        addressLine2: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        postalCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        country: z.ZodDefault<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "HOME" | "WORK" | "BILLING";
        country: string;
        isDefault: boolean;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
    }, {
        type?: "OTHER" | "HOME" | "WORK" | "BILLING" | undefined;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }>>;
    preferences: z.ZodOptional<z.ZodObject<{
        preferredStaffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        preferredCommunicationChannel: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodString>;
        appointmentReminderEnabled: z.ZodDefault<z.ZodBoolean>;
        marketingConsent: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        preferredCommunicationChannel: string;
        language: string;
        appointmentReminderEnabled: boolean;
        marketingConsent: boolean;
        preferredStaffId?: string | null | undefined;
    }, {
        preferredStaffId?: string | null | undefined;
        preferredCommunicationChannel?: string | undefined;
        language?: string | undefined;
        appointmentReminderEnabled?: boolean | undefined;
        marketingConsent?: boolean | undefined;
    }>>;
    cautions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["ALLERGY", "SKIN_SENSITIVITY", "HAIR_CHEMICAL_HISTORY", "MEDICAL_CAUTION", "SERVICE_RESTRICTION", "OTHER"]>;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        severity: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        description?: string | null | undefined;
    }, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        description?: string | null | undefined;
        severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    firstName: z.ZodString;
    lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    displayName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mobilePhone: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    alternatePhone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    gender: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]>, z.ZodString]>, string, unknown>>>;
    dateOfBirth: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>, z.ZodString]>, string, unknown>>>;
    preferredBranchId: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    franchiseId: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    source: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>, z.ZodString]>>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    segment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["HOME", "WORK", "BILLING", "OTHER"]>>;
        addressLine1: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        addressLine2: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        postalCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        country: z.ZodDefault<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "HOME" | "WORK" | "BILLING";
        country: string;
        isDefault: boolean;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
    }, {
        type?: "OTHER" | "HOME" | "WORK" | "BILLING" | undefined;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }>>;
    preferences: z.ZodOptional<z.ZodObject<{
        preferredStaffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        preferredCommunicationChannel: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodString>;
        appointmentReminderEnabled: z.ZodDefault<z.ZodBoolean>;
        marketingConsent: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        preferredCommunicationChannel: string;
        language: string;
        appointmentReminderEnabled: boolean;
        marketingConsent: boolean;
        preferredStaffId?: string | null | undefined;
    }, {
        preferredStaffId?: string | null | undefined;
        preferredCommunicationChannel?: string | undefined;
        language?: string | undefined;
        appointmentReminderEnabled?: boolean | undefined;
        marketingConsent?: boolean | undefined;
    }>>;
    cautions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["ALLERGY", "SKIN_SENSITIVITY", "HAIR_CHEMICAL_HISTORY", "MEDICAL_CAUTION", "SERVICE_RESTRICTION", "OTHER"]>;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        severity: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        description?: string | null | undefined;
    }, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        description?: string | null | undefined;
        severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    }>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">>;
export type CreateCustomerRequest = z.infer<typeof CreateCustomerRequestSchema>;
export declare const UpdateCustomerRequestSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    displayName: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    mobilePhone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    alternatePhone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    gender: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]>, z.ZodString]>, string, unknown>>>>;
    dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>, z.ZodString]>, string, unknown>>>>;
    preferredBranchId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    franchiseId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    source: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>, z.ZodString]>>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    segment: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["HOME", "WORK", "BILLING", "OTHER"]>>;
        addressLine1: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        addressLine2: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        postalCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        country: z.ZodDefault<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "HOME" | "WORK" | "BILLING";
        country: string;
        isDefault: boolean;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
    }, {
        type?: "OTHER" | "HOME" | "WORK" | "BILLING" | undefined;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }>>>;
    preferences: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        preferredStaffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        preferredCommunicationChannel: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodString>;
        appointmentReminderEnabled: z.ZodDefault<z.ZodBoolean>;
        marketingConsent: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        preferredCommunicationChannel: string;
        language: string;
        appointmentReminderEnabled: boolean;
        marketingConsent: boolean;
        preferredStaffId?: string | null | undefined;
    }, {
        preferredStaffId?: string | null | undefined;
        preferredCommunicationChannel?: string | undefined;
        language?: string | undefined;
        appointmentReminderEnabled?: boolean | undefined;
        marketingConsent?: boolean | undefined;
    }>>>;
    cautions: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["ALLERGY", "SKIN_SENSITIVITY", "HAIR_CHEMICAL_HISTORY", "MEDICAL_CAUTION", "SERVICE_RESTRICTION", "OTHER"]>;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        severity: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        description?: string | null | undefined;
    }, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        description?: string | null | undefined;
        severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    }>, "many">>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    displayName: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    mobilePhone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    alternatePhone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    gender: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]>, z.ZodString]>, string, unknown>>>>;
    dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>, z.ZodString]>, string, unknown>>>>;
    preferredBranchId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    franchiseId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    source: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>, z.ZodString]>>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    segment: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["HOME", "WORK", "BILLING", "OTHER"]>>;
        addressLine1: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        addressLine2: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        postalCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        country: z.ZodDefault<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "HOME" | "WORK" | "BILLING";
        country: string;
        isDefault: boolean;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
    }, {
        type?: "OTHER" | "HOME" | "WORK" | "BILLING" | undefined;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }>>>;
    preferences: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        preferredStaffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        preferredCommunicationChannel: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodString>;
        appointmentReminderEnabled: z.ZodDefault<z.ZodBoolean>;
        marketingConsent: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        preferredCommunicationChannel: string;
        language: string;
        appointmentReminderEnabled: boolean;
        marketingConsent: boolean;
        preferredStaffId?: string | null | undefined;
    }, {
        preferredStaffId?: string | null | undefined;
        preferredCommunicationChannel?: string | undefined;
        language?: string | undefined;
        appointmentReminderEnabled?: boolean | undefined;
        marketingConsent?: boolean | undefined;
    }>>>;
    cautions: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["ALLERGY", "SKIN_SENSITIVITY", "HAIR_CHEMICAL_HISTORY", "MEDICAL_CAUTION", "SERVICE_RESTRICTION", "OTHER"]>;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        severity: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        description?: string | null | undefined;
    }, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        description?: string | null | undefined;
        severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    }>, "many">>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    displayName: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    mobilePhone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    alternatePhone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    gender: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]>, z.ZodString]>, string, unknown>>>>;
    dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>, z.ZodString]>, string, unknown>>>>;
    preferredBranchId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    franchiseId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    source: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>, z.ZodString]>>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    segment: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["HOME", "WORK", "BILLING", "OTHER"]>>;
        addressLine1: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        addressLine2: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        state: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        postalCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        country: z.ZodDefault<z.ZodString>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "HOME" | "WORK" | "BILLING";
        country: string;
        isDefault: boolean;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
    }, {
        type?: "OTHER" | "HOME" | "WORK" | "BILLING" | undefined;
        addressLine1?: string | null | undefined;
        addressLine2?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        postalCode?: string | null | undefined;
        country?: string | undefined;
        isDefault?: boolean | undefined;
    }>>>;
    preferences: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        preferredStaffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        preferredCommunicationChannel: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodString>;
        appointmentReminderEnabled: z.ZodDefault<z.ZodBoolean>;
        marketingConsent: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        preferredCommunicationChannel: string;
        language: string;
        appointmentReminderEnabled: boolean;
        marketingConsent: boolean;
        preferredStaffId?: string | null | undefined;
    }, {
        preferredStaffId?: string | null | undefined;
        preferredCommunicationChannel?: string | undefined;
        language?: string | undefined;
        appointmentReminderEnabled?: boolean | undefined;
        marketingConsent?: boolean | undefined;
    }>>>;
    cautions: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["ALLERGY", "SKIN_SENSITIVITY", "HAIR_CHEMICAL_HISTORY", "MEDICAL_CAUTION", "SERVICE_RESTRICTION", "OTHER"]>;
        title: z.ZodString;
        description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        severity: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
        description?: string | null | undefined;
    }, {
        type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
        title: string;
        description?: string | null | undefined;
        severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    }>, "many">>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, z.ZodTypeAny, "passthrough">>;
export type UpdateCustomerRequest = z.infer<typeof UpdateCustomerRequestSchema>;
export declare const QueryCustomersRequestSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    mobilePhone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>>;
    branchId: z.ZodOptional<z.ZodString>;
    franchiseId: z.ZodOptional<z.ZodString>;
    hasFranchise: z.ZodOptional<z.ZodEffects<z.ZodBoolean, boolean, unknown>>;
    source: z.ZodOptional<z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<["createdAt", "displayName", "totalVisits", "lastVisitAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy: "displayName" | "createdAt" | "totalVisits" | "lastVisitAt";
    status?: "ACTIVE" | "INACTIVE" | "DORMANT" | "BLOCKED" | "ARCHIVED" | undefined;
    email?: string | undefined;
    franchiseId?: string | undefined;
    mobilePhone?: string | undefined;
    branchId?: string | undefined;
    source?: "ONLINE" | "CALL_CENTER" | "WALK_IN" | "OTHER" | "REFERRAL" | "SOCIAL" | "CAMPAIGN" | undefined;
    search?: string | undefined;
    hasFranchise?: boolean | undefined;
}, {
    status?: "ACTIVE" | "INACTIVE" | "DORMANT" | "BLOCKED" | "ARCHIVED" | undefined;
    email?: string | undefined;
    franchiseId?: string | undefined;
    mobilePhone?: string | undefined;
    branchId?: string | undefined;
    source?: "ONLINE" | "CALL_CENTER" | "WALK_IN" | "OTHER" | "REFERRAL" | "SOCIAL" | "CAMPAIGN" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    search?: string | undefined;
    hasFranchise?: unknown;
    sortBy?: "displayName" | "createdAt" | "totalVisits" | "lastVisitAt" | undefined;
}>;
export type QueryCustomersRequest = z.infer<typeof QueryCustomersRequestSchema>;
export declare const CreateCustomerNoteRequestSchema: z.ZodObject<{
    noteType: z.ZodDefault<z.ZodEnum<["GENERAL", "PREFERENCE", "FEEDBACK", "COMPLAINT", "BILLING"]>>;
    content: z.ZodString;
    isPinned: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    noteType: "BILLING" | "GENERAL" | "PREFERENCE" | "FEEDBACK" | "COMPLAINT";
    content: string;
    isPinned: boolean;
}, {
    content: string;
    noteType?: "BILLING" | "GENERAL" | "PREFERENCE" | "FEEDBACK" | "COMPLAINT" | undefined;
    isPinned?: boolean | undefined;
}>;
export type CreateCustomerNoteRequest = z.infer<typeof CreateCustomerNoteRequestSchema>;
export declare const CreateCustomerCautionRequestSchema: z.ZodObject<{
    type: z.ZodEnum<["ALLERGY", "SKIN_SENSITIVITY", "HAIR_CHEMICAL_HISTORY", "MEDICAL_CAUTION", "SERVICE_RESTRICTION", "OTHER"]>;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    severity: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
    title: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    active: boolean;
    description?: string | null | undefined;
}, {
    type: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION";
    title: string;
    description?: string | null | undefined;
    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    active?: boolean | undefined;
}>;
export type CreateCustomerCautionRequest = z.infer<typeof CreateCustomerCautionRequestSchema>;
export declare const UpdateCustomerCautionRequestSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["ALLERGY", "SKIN_SENSITIVITY", "HAIR_CHEMICAL_HISTORY", "MEDICAL_CAUTION", "SERVICE_RESTRICTION", "OTHER"]>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    severity: z.ZodOptional<z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>>;
    active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    type?: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION" | undefined;
    description?: string | null | undefined;
    title?: string | undefined;
    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    active?: boolean | undefined;
}, {
    type?: "OTHER" | "ALLERGY" | "SKIN_SENSITIVITY" | "HAIR_CHEMICAL_HISTORY" | "MEDICAL_CAUTION" | "SERVICE_RESTRICTION" | undefined;
    description?: string | null | undefined;
    title?: string | undefined;
    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    active?: boolean | undefined;
}>;
export type UpdateCustomerCautionRequest = z.infer<typeof UpdateCustomerCautionRequestSchema>;
export declare const CreateLeadRequestSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    mobilePhone: z.ZodString;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    source: z.ZodDefault<z.ZodEnum<["WALK_IN", "ONLINE", "CALL_CENTER", "REFERRAL", "SOCIAL", "CAMPAIGN", "OTHER"]>>;
    preferredBranchId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    interestedServiceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    assignedIdentityUserId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    inquiryNotes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    mobilePhone: string;
    source: "ONLINE" | "CALL_CENTER" | "WALK_IN" | "OTHER" | "REFERRAL" | "SOCIAL" | "CAMPAIGN";
    firstName: string;
    email?: string | null | undefined;
    lastName?: string | null | undefined;
    preferredBranchId?: string | null | undefined;
    interestedServiceId?: string | null | undefined;
    assignedIdentityUserId?: string | null | undefined;
    inquiryNotes?: string | null | undefined;
}, {
    mobilePhone: string;
    firstName: string;
    email?: string | null | undefined;
    source?: "ONLINE" | "CALL_CENTER" | "WALK_IN" | "OTHER" | "REFERRAL" | "SOCIAL" | "CAMPAIGN" | undefined;
    lastName?: string | null | undefined;
    preferredBranchId?: string | null | undefined;
    interestedServiceId?: string | null | undefined;
    assignedIdentityUserId?: string | null | undefined;
    inquiryNotes?: string | null | undefined;
}>;
export type CreateLeadRequest = z.infer<typeof CreateLeadRequestSchema>;
export declare const UpdateLeadStatusRequestSchema: z.ZodObject<{
    status: z.ZodEnum<["NEW", "CONTACTED", "QUALIFIED", "BOOKING_PENDING", "CONVERTED", "LOST"]>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "BOOKING_PENDING" | "CONVERTED" | "LOST";
    notes?: string | null | undefined;
}, {
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "BOOKING_PENDING" | "CONVERTED" | "LOST";
    notes?: string | null | undefined;
}>;
export type UpdateLeadStatusRequest = z.infer<typeof UpdateLeadStatusRequestSchema>;
export declare const ConvertLeadRequestSchema: z.ZodObject<{
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    preferredBranchId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    notes?: string | null | undefined;
    preferredBranchId?: string | null | undefined;
}, {
    notes?: string | null | undefined;
    preferredBranchId?: string | null | undefined;
}>;
export type ConvertLeadRequest = z.infer<typeof ConvertLeadRequestSchema>;
export declare const CreateCustomerSegmentRequestSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    segmentType: z.ZodDefault<z.ZodEnum<["STATIC", "DYNAMIC", "RETENTION", "SPEND_TIER", "VISIT_FREQUENCY"]>>;
    isDynamic: z.ZodDefault<z.ZodBoolean>;
    criteriaJson: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    segmentType: "STATIC" | "DYNAMIC" | "RETENTION" | "SPEND_TIER" | "VISIT_FREQUENCY";
    isDynamic: boolean;
    description?: string | null | undefined;
    criteriaJson?: Record<string, unknown> | null | undefined;
}, {
    name: string;
    description?: string | null | undefined;
    segmentType?: "STATIC" | "DYNAMIC" | "RETENTION" | "SPEND_TIER" | "VISIT_FREQUENCY" | undefined;
    isDynamic?: boolean | undefined;
    criteriaJson?: Record<string, unknown> | null | undefined;
}>;
export type CreateCustomerSegmentRequest = z.infer<typeof CreateCustomerSegmentRequestSchema>;
export declare const CustomerSummaryResponseSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    customerCode: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodNullable<z.ZodString>;
    displayName: z.ZodString;
    mobilePhone: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    gender: z.ZodEnum<["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]>;
    status: z.ZodEnum<["ACTIVE", "INACTIVE", "DORMANT", "BLOCKED", "ARCHIVED"]>;
    preferredBranchId: z.ZodNullable<z.ZodString>;
    totalVisits: z.ZodNumber;
    totalSpent: z.ZodNumber;
    lastVisitAt: z.ZodNullable<z.ZodString>;
    firstVisitAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "ACTIVE" | "INACTIVE" | "DORMANT" | "BLOCKED" | "ARCHIVED";
    email: string | null;
    tenantId: string;
    id: string;
    mobilePhone: string;
    firstName: string;
    lastName: string | null;
    displayName: string;
    gender: "OTHER" | "MALE" | "FEMALE" | "UNSPECIFIED";
    preferredBranchId: string | null;
    createdAt: string;
    totalVisits: number;
    lastVisitAt: string | null;
    customerCode: string;
    totalSpent: number;
    firstVisitAt: string | null;
}, {
    status: "ACTIVE" | "INACTIVE" | "DORMANT" | "BLOCKED" | "ARCHIVED";
    email: string | null;
    tenantId: string;
    id: string;
    mobilePhone: string;
    firstName: string;
    lastName: string | null;
    displayName: string;
    gender: "OTHER" | "MALE" | "FEMALE" | "UNSPECIFIED";
    preferredBranchId: string | null;
    createdAt: string;
    totalVisits: number;
    lastVisitAt: string | null;
    customerCode: string;
    totalSpent: number;
    firstVisitAt: string | null;
}>;
export type CustomerSummaryResponse = z.infer<typeof CustomerSummaryResponseSchema>;
//# sourceMappingURL=customer.contracts.d.ts.map