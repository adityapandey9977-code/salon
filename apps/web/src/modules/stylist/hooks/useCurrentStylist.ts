import { useCallback, useEffect, useState } from 'react';
import { staffApi, type FullStaffRecord } from '@/shared/api/staff.api';
import { tokenStorage } from '@/shared/api/client';
import { useAuth } from '@/shared/context/AuthContext';

export interface CurrentStylistState {
  stylist: FullStaffRecord | null;
  staffId: string | null;
  stylistName: string;
  branchId?: string;
  tenantId?: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCurrentStylist(): CurrentStylistState {
  const { user } = useAuth();
  const [stylist, setStylist] = useState<FullStaffRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const resolveStylist = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Attempt to get linked employee profile from people-service
      let profile: FullStaffRecord | null = null;
      try {
        profile = await staffApi.getMe();
      } catch {
        profile = null;
      }

      // 2. If not found via /me, fetch roster and match by identityUserId / email / name
      if (!profile) {
        try {
          const list = await staffApi.list();
          if (Array.isArray(list) && list.length > 0) {
            // Priority match: identityUserId
            if (user?.id) {
              profile = list.find((s: any) => s.identityUserId === user.id) || null;
            }

            // Secondary match: email
            if (!profile && user?.email) {
              const uEmail = user.email.trim().toLowerCase();
              profile = list.find((s) => s.email && s.email.trim().toLowerCase() === uEmail) || null;
            }

            // Tertiary match: full name
            if (!profile && user?.fullName) {
              const uName = user.fullName.trim().toLowerCase();
              profile =
                list.find(
                  (s) =>
                    (s.displayName && s.displayName.trim().toLowerCase() === uName) ||
                    (s.fullName && s.fullName.trim().toLowerCase() === uName) ||
                    `${s.firstName} ${s.lastName}`.trim().toLowerCase() === uName,
                ) || null;
            }

            // Quaternary match: pick a staff member with 'Stylist' in job title or first staff
            if (!profile) {
              profile =
                list.find((s) => s.jobTitle?.toLowerCase().includes('stylist')) ||
                list[0] ||
                null;
            }
          }
        } catch (err: any) {
          console.warn('Failed to load staff list for stylist resolution:', err);
        }
      }

      setStylist(profile);
    } catch (err: any) {
      console.error('Error resolving current stylist profile:', err);
      setError(err?.message || 'Failed to resolve stylist profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    resolveStylist();
  }, [resolveStylist]);

  const branchId =
    stylist?.primaryBranchId ||
    (user?.branchIds && user.branchIds.length > 0 ? user.branchIds[0] : undefined) ||
    tokenStorage.getBranchId() ||
    undefined;

  const tenantId = stylist?.tenantId || user?.tenantId || tokenStorage.getTenantId() || undefined;

  const staffId = stylist?.id || user?.id || null;
  const stylistName = stylist?.displayName || stylist?.fullName || user?.fullName || 'Stylist';

  return {
    stylist,
    staffId,
    stylistName,
    branchId,
    tenantId,
    isLoading,
    error,
    refetch: resolveStylist,
  };
}
