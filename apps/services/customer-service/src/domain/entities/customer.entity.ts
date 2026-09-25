export interface CustomerEntity {
  id: string;
  tenantId: string;
  primaryBranchId: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNSPECIFIED';
  totalVisits: number;
  totalSpent: number;
  lastVisitAt: Date | null;
  isLead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
