export interface TenantEntity {
  id: string;
  name: string;
  subdomain: string;
  customDomain: string | null;
  ownerEmail: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: Date;
  updatedAt: Date;
}
