import React from 'react';
import { CatalogueMasterPage } from '../../admin/pages/catalogue/CatalogueMasterPage';

export function CataloguePage() {
  return (
    <CatalogueMasterPage
      roleTitle="Franchise Partner"
      parentSection="Operations & Staff"
      defaultBranch="All"
      lockBranch={false}
      readOnly={true}
      initialTab="categories"
    />
  );
}

export default CataloguePage;
