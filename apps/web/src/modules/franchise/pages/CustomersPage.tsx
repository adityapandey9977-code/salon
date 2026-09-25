import React from 'react';
import { tokenStorage } from '@/shared/api';
import { useAuth } from '@/shared/context/AuthContext';
import { ClientsMasterPage } from '../../admin/pages/clients/ClientsMasterPage';

export function CustomersPage() {
  const { user } = useAuth();
  const franchiseId =
    tokenStorage.getFranchiseId() ||
    (user as any)?.franchiseId ||
    localStorage.getItem('digiflex_franchise_id') ||
    undefined;

  return (
    <ClientsMasterPage
      roleTitle="Franchise Network"
      parentSection="Operations & Staff"
      hasFranchise={true}
      franchiseId={franchiseId}
      initialTab="all"
    />
  );
}

export default CustomersPage;
