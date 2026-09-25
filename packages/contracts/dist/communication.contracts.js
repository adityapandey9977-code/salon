import { z } from 'zod';
export const SendNotificationRequestSchema = z.object({
    recipient: z.string().min(1),
    channel: z.enum(['WHATSAPP', 'SMS', 'EMAIL', 'PUSH']),
    templateId: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(1),
    variables: z.record(z.union([z.string(), z.number()])).optional(),
});
