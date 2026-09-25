import React from 'react';
import { LocationsMasterPage } from './locations/LocationsMasterPage';
export { masterBranches as initialBranches } from './locations/AllBranchesTab';

export function BranchesPage() {
  return <LocationsMasterPage />;
}

export default BranchesPage;
