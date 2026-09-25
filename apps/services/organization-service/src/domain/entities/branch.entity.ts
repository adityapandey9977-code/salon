export interface BranchEntity {
  id: string;
  tenantId: string;
  brandId: string | null;
  franchiseId: string | null;
  name: string;
  code: string;
  city: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TEMPORARILY_CLOSED';
  createdAt: Date;
  updatedAt: Date;
}
