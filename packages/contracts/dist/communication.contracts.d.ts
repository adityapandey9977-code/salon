import { z } from 'zod';
export declare const SendNotificationRequestSchema: z.ZodObject<{
    recipient: z.ZodString;
    channel: z.ZodEnum<["WHATSAPP", "SMS", "EMAIL", "PUSH"]>;
    templateId: z.ZodOptional<z.ZodString>;
    subject: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    recipient: string;
    channel: "WHATSAPP" | "SMS" | "EMAIL" | "PUSH";
    templateId?: string | undefined;
    subject?: string | undefined;
    variables?: Record<string, string | number> | undefined;
}, {
    message: string;
    recipient: string;
    channel: "WHATSAPP" | "SMS" | "EMAIL" | "PUSH";
    templateId?: string | undefined;
    subject?: string | undefined;
    variables?: Record<string, string | number> | undefined;
}>;
export type SendNotificationRequest = z.infer<typeof SendNotificationRequestSchema>;
//# sourceMappingURL=communication.contracts.d.ts.map