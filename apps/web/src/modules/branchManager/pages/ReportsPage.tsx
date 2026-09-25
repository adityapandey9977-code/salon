import React from 'react';
import { ReportsMasterPage } from '../../admin/pages/reports/ReportsMasterPage';
import { useBranch } from '../context/BranchContext';

export function ReportsPage() {
  const { assignedBranch } = useBranch();

  return (
    <ReportsMasterPage
      roleTitle="Branch Manager"
      parentSection="Reports"
      defaultBranch={assignedBranch?.name || 'Assigned Branch'}
      lockBranch={true}
      initialTab="overview"
    />
  );
}

export type { ReportItem } from '../../admin/pages/reports/EodShiftClosuresTab';
export default ReportsPage;
