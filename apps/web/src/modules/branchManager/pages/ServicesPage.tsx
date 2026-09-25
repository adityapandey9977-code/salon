import React from 'react';
import { CatalogueMasterPage } from '../../admin/pages/catalogue/CatalogueMasterPage';
import { useBranch } from '../context/BranchContext';

export function ServicesPage() {
  const { assignedBranch } = useBranch();

  return (
    <CatalogueMasterPage
      roleTitle="Branch Manager"
      parentSection="Catalogue"
      defaultBranch={assignedBranch?.name || 'All'}
      lockBranch={Boolean(assignedBranch?.name)}
      readOnly={true}
      initialTab="categories"
    />
  );
}

export default ServicesPage;
