import React from 'react';
import { InventoryMasterPage } from '../../admin/pages/inventory/InventoryMasterPage';
import { useBranch } from '../context/BranchContext';

export function RetailPage() {
  const { assignedBranch } = useBranch();

  return (
    <InventoryMasterPage
      roleTitle="Branch Manager"
      parentSection="Retail & Stock"
      defaultBranch={assignedBranch?.name || 'Assigned Branch'}
      lockBranch={true}
      initialTab="overview"
    />
  );
}

export default RetailPage;
