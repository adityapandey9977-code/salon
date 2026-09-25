// API Clients & Storage
export { apiClient, tokenStorage } from './client';
export { gatewayApi } from './gateway.api';
export { authApi } from './auth.api';
export { usersApi, type UserListResult } from './users.api';
export { rolesApi } from './roles.api';
export { tenantsApi } from './tenants.api';
export { staffApi, type ListStaffParams, type FullStaffRecord } from './staff.api';
export {
  catalogueApi,
  type ApiServiceCategory,
  type ApiServiceMaster,
  type ApiBranchPrice,
  type ApiBranchResource,
  type CreateCategoryPayload,
  type UpdateCategoryPayload,
  type CreateServicePayload,
  type UpdateServicePayload,
  type SetBranchPricePayload,
  type SetRecipePayload,
  type CreateResourcePayload,
  type UpdateResourcePayload,
  type ApiSkillMaster,
  type CreateSkillPayload,
  type UpdateSkillPayload,
} from './catalogue.api';
export {
  customersApi,
  type ListCustomersParams,
  type CreateCustomerPayload,
  type ApiCustomerSummary,
} from './customers.api';
export {
  appointmentsApi,
  type ListAppointmentsParams,
  type CreateAppointmentPayload,
  type AppointmentItemPayload,
  type ApiAppointmentSummary,
  type ApiAppointmentItem,
  type ApiAppointmentResource,
  type ApiTimeSlot,
} from './appointments.api';
export {
  auditApi,
  type BackendAuditEvent,
  type AuditFilter,
  type CreateAuditPayload,
  type AuditExportResult,
} from './audit.api';
export {
  inventoryApi,
  type ApiInventoryCategory,
  type ApiBranchStock,
  type ApiInventorySku,
  type CreateSkuPayload,
  type UpdateSkuPayload,
  type CreateCategoryPayload as CreateInventoryCategoryPayload,
  type ListSkusQuery,
} from './inventory.api';



// Types & DTOs
export * from './types';

// React Query Hooks
export * from './hooks/useGatewayHealth';
export * from './hooks/useAuth';
export * from './hooks/useUsers';
export * from './hooks/useRoles';
export * from './hooks/useStaff';

// Auth Context
export { AuthProvider, useAuth } from '../context/AuthContext';
export type { AuthProviderProps } from '../context/AuthContext';
