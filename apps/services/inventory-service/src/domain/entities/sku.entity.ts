export interface SkuMasterEntity {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  costPrice: number;
  retailPrice: number;
  reorderLevel: number;
  isRetail: boolean;
  isConsumable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
