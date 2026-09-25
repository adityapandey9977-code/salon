export interface ServiceMasterEntity {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  code: string;
  basePrice: number;
  durationMinutes: number;
  gstRate: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
