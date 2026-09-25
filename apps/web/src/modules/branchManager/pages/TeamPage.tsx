import React from 'react';
import { useSearchParams } from 'react-router';
import { StaffMasterPage } from '../../admin/pages/staff/StaffMasterPage';
import { useBranch } from '../context/BranchContext';

export function TeamPage() {
  const { assignedBranch } = useBranch();
  const [searchParams] = useSearchParams();

  const urlBranchId = searchParams.get('branchId');
  const effectiveBranchId = urlBranchId || assignedBranch?.id;
  const effectiveBranchName =
    assignedBranch?.id === effectiveBranchId ? assignedBranch?.name || '' : '';

  return (
    <StaffMasterPage
      roleTitle="Branch Manager"
      parentSection="Clients & Team"
      defaultBranch={effectiveBranchName}
      branchId={effectiveBranchId}
      lockBranch={true}
      initialTab="all"
    />
  );
}

export default TeamPage;
