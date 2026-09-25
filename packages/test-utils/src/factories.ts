import { randomUUID } from 'node:crypto';

export const TestFactories = {
  createTenantId: () => randomUUID(),
  createBranchId: () => randomUUID(),
  createUserId: () => randomUUID(),
  createClientId: () => randomUUID(),
  createServiceId: () => randomUUID(),
  createAppointmentId: () => randomUUID(),
  createInvoiceId: () => randomUUID(),
  createPaymentId: () => randomUUID(),
  createSkuId: () => randomUUID(),
};
