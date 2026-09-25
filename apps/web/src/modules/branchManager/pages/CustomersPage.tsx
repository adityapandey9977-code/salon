import React from 'react';
import { tokenStorage } from '@/shared/api';
import { useAuth } from '@/shared/context/AuthContext';
import { ClientsMasterPage } from '../../admin/pages/clients/ClientsMasterPage';
import { useBranch } from '../context/BranchContext';

export function CustomersPage() {
  const { assignedBranch } = useBranch();
  const { user } = useAuth();
  const branchId =
    assignedBranch?.id ||
    tokenStorage.getBranchId() ||
    user?.branchIds?.[0] ||
    undefined;

  return (
    <ClientsMasterPage
      roleTitle="Branch Manager"
      parentSection="Clients & Team"
      defaultBranch={assignedBranch?.name || 'Assigned Branch'}
      lockBranch={true}
      branchId={branchId}
      initialTab="all"
    />
  );
}

export default CustomersPage;
