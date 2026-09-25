import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { staffApi } from '@/shared/api/staff.api';
import { tenantsApi } from '@/shared/api/tenants.api';
import { tokenStorage } from '@/shared/api/client';
import { useAuth } from '@/shared/context/AuthContext';
import type { FullStaffRecord } from '../../admin/pages/staff/StaffProfilePage';

export interface AssignedBranch {
  id: string;
  name: string;
  code: string;
  city: string;
  state?: string;
  postalCode?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  phone?: string;
  email?: string;
  type?: string;
  workingHours: string;
  status: string;
  primaryManagerEmployeeId?: string | null;
  manager?: string;
  managerEmail?: string;
  isFranchiseOwned?: boolean;
  franchisePartnerName?: string;
}

interface BranchContextValue {
  assignedBranch: AssignedBranch | null;
  availableBranches: any[];
  currentStaff: FullStaffRecord | null;
  isLoading: boolean;
  refetchBranch: () => Promise<void>;
  selectBranch: (branchId: string) => Promise<void>;
}

const STORAGE_KEY = 'digiflex_assigned_branch';

const BranchContext = createContext<BranchContextValue>({
  assignedBranch: null,
  availableBranches: [],
  currentStaff: null,
  isLoading: true,
  refetchBranch: async () => {},
  selectBranch: async () => {},
});

export const useBranch = () => useContext(BranchContext);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [assignedBranch, setAssignedBranch] = useState<AssignedBranch | null>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.id) {
          tokenStorage.setBranchId(parsed.id);
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [availableBranches, setAvailableBranches] = useState<any[]>([]);
  const [currentStaff, setCurrentStaff] = useState<FullStaffRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBranchDetails = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // 1. Fetch current staff profile
      let staff: FullStaffRecord | null = null;
      try {
        staff = await staffApi.getMe();
        setCurrentStaff(staff);
      } catch (staffErr) {
        console.warn('[BranchContext] Could not load staff/me record:', staffErr);
      }

      // 2. Determine target branch identifier
      const targetBranchId =
        user.branchIds?.[0] ||
        staff?.primaryBranchId ||
        (user as any).branchId ||
        null;

      // 3. Fetch all branches
      let branches: any[] = [];
      try {
        branches = await tenantsApi.listBranches();
        if (Array.isArray(branches)) {
          setAvailableBranches(branches);
        }
      } catch (branchListErr) {
        console.warn('[BranchContext] Could not list branches:', branchListErr);
      }

      // 4. Find matching branch (checking target, then cached selection, then staff/email, then first)
      const cachedBranchId = assignedBranch?.id;
      let matchedBranch: any = null;
      if (targetBranchId && branches.length > 0) {
        matchedBranch = branches.find((b) => b.id?.toLowerCase() === targetBranchId.toLowerCase());
      }
      if (!matchedBranch && cachedBranchId && branches.length > 0) {
        matchedBranch = branches.find((b) => b.id?.toLowerCase() === cachedBranchId.toLowerCase());
      }
      if (!matchedBranch && staff?.id && branches.length > 0) {
        matchedBranch = branches.find((b) => b.primaryManagerEmployeeId === staff!.id);
      }
      if (!matchedBranch && user.email && branches.length > 0) {
        matchedBranch = branches.find(
          (b) =>
            b.managerEmail?.toLowerCase() === user.email.toLowerCase() ||
            b.email?.toLowerCase() === user.email.toLowerCase(),
        );
      }
      if (!matchedBranch && branches.length > 0) {
        matchedBranch = branches[0];
      }

      // 5. If matched or target exists, try to get full details
      let fullBranchDetails: any = null;
      const finalId = matchedBranch?.id || targetBranchId;
      if (finalId) {
        try {
          fullBranchDetails = await tenantsApi.getBranchById(finalId);
        } catch {
          fullBranchDetails = matchedBranch;
        }
      }

      const raw = fullBranchDetails || matchedBranch;
      if (raw) {
        const resolvedBranch: AssignedBranch = {
          id: raw.id,
          name: raw.name || 'Assigned Branch',
          code: raw.code || 'BR001',
          city: raw.city || 'Central',
          state: raw.state || '',
          postalCode: raw.postalCode || '',
          address: raw.addressLine1 || raw.address || `${raw.city || 'Main'} Branch Location`,
          addressLine1: raw.addressLine1 || raw.address || '',
          addressLine2: raw.addressLine2 || '',
          phone: raw.phone || raw.contactNumber || '+91 98765 43210',
          email: raw.email || raw.managerEmail || user.email,
          type: raw.type || 'Flagship Branch',
          workingHours: raw.workingHours || '09:00 AM - 09:00 PM',
          status: raw.status || 'Active',
          primaryManagerEmployeeId: raw.primaryManagerEmployeeId || staff?.id || null,
          manager:
            staff?.fullName ||
            (staff ? `${staff.firstName} ${staff.lastName}`.trim() : raw.manager || user.fullName || 'Branch Manager'),
          managerEmail: (staff as any)?.email || raw.managerEmail || user.email,
          isFranchiseOwned: Boolean(raw.isFranchiseOwned || raw.franchiseId),
          franchisePartnerName: raw.franchisePartnerName || raw.franchise?.companyName,
        };

        setAssignedBranch(resolvedBranch);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resolvedBranch));
        if (resolvedBranch.id) {
          tokenStorage.setBranchId(resolvedBranch.id);
        }
      }
    } catch (err) {
      console.error('[BranchContext] Error loading assigned branch details:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, assignedBranch?.id]);

  const selectBranch = useCallback(
    async (branchId: string) => {
      const matched = availableBranches.find((b) => b.id?.toLowerCase() === branchId.toLowerCase());
      if (matched) {
        const resolvedBranch: AssignedBranch = {
          id: matched.id,
          name: matched.name || 'Assigned Branch',
          code: matched.code || 'BR001',
          city: matched.city || 'Central',
          state: matched.state || '',
          postalCode: matched.postalCode || '',
          address: matched.addressLine1 || matched.address || `${matched.city || 'Main'} Branch Location`,
          addressLine1: matched.addressLine1 || matched.address || '',
          addressLine2: matched.addressLine2 || '',
          phone: matched.phone || matched.contactNumber || '+91 98765 43210',
          email: matched.email || matched.managerEmail || user?.email,
          type: matched.type || 'Flagship Branch',
          workingHours: matched.workingHours || '09:00 AM - 09:00 PM',
          status: matched.status || 'Active',
          primaryManagerEmployeeId: matched.primaryManagerEmployeeId || currentStaff?.id || null,
          manager:
            currentStaff?.fullName ||
            (currentStaff ? `${currentStaff.firstName} ${currentStaff.lastName}`.trim() : matched.manager || user?.fullName || 'Branch Manager'),
          managerEmail: (currentStaff as any)?.email || matched.managerEmail || user?.email,
          isFranchiseOwned: Boolean(matched.isFranchiseOwned || matched.franchiseId),
          franchisePartnerName: matched.franchisePartnerName || matched.franchise?.companyName,
        };
        setAssignedBranch(resolvedBranch);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resolvedBranch));
        if (resolvedBranch.id) {
          tokenStorage.setBranchId(resolvedBranch.id);
        }
      }
    },
    [availableBranches, currentStaff, user],
  );

  useEffect(() => {
    fetchBranchDetails();
  }, [fetchBranchDetails]);

  return (
    <BranchContext.Provider
      value={{
        assignedBranch,
        availableBranches,
        currentStaff,
        isLoading,
        refetchBranch: fetchBranchDetails,
        selectBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};
