import { z } from 'zod';

export const RequestContextSchema = z.object({
  requestId: z.string().uuid(),
  correlationId: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  tenantId: z.string().uuid().nullable().optional(),
  franchiseId: z.string().uuid().nullable().optional(),
  branchIds: z.array(z.string().uuid()).default([]),
  role: z.string().nullable().optional(),
  permissions: z.array(z.string()).default([]),
});

export type RequestContext = z.infer<typeof RequestContextSchema>;
