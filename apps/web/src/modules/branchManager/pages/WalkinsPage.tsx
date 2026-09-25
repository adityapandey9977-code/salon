import React from 'react';
import { OperationsMasterPage } from '../../admin/pages/operations/OperationsMasterPage';
import { useBranch } from '../context/BranchContext';

export function WalkinsPage() {
  const { assignedBranch, availableBranches } = useBranch();

  return (
    <OperationsMasterPage
      roleTitle="Branch Manager"
      parentSection="Operations"
      defaultBranch={assignedBranch?.name || 'Assigned Branch'}
      branchId={assignedBranch?.id}
      branchesList={availableBranches}
      lockBranch={true}
      initialTab="queue"
    />
  );
}

export default WalkinsPage;
