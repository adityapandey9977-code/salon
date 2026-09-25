import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { tenantsApi } from '@/shared/api/tenants.api';
import { tokenStorage } from '@/shared/api/client';
import type { TenantResponse } from '@/shared/api/types';

export interface AdminBranch {
  id: string;
  name: string;
  code: string;
  type: 'Flagship' | 'Lounge' | 'Express' | 'Franchise';
  address: string;
  city: string;
  state: string;
  manager: string;
  managerEmail: string;
  contactNumber: string;
  primaryManagerEmployeeId?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  workingHours: string;
  revenue: number;
  appointments: number;
  occupancy: number;
  staffCount: number;
  clientCount: number;
  createdDate: string;
  servicesAvailable: string[];
  franchisePartnerId?: string;
  franchisePartnerName?: string;
  isFranchiseOwned?: boolean;
}

export interface LocationOption {
  id: string;
  name: string;
  subtitle: string;
  active: boolean;
  count: string;
  city?: string;
}

export interface SalonTenantData {
  id: string;
  name: string;
  code: string;
  slug: string;
  salonName: string;
  legalName: string;
  tradeName?: string;
  displayName?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessEmail: string;
  businessPhone: string;
  contactEmail: string;
  contactPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  region: string;
  postalCode?: string;
  country?: string;
  currency: string;
  timezone: string;
  status: 'Active' | 'Suspended' | 'Pending Setup';
  activePlans: string;
  revenue: string;
  branchesCount: number;
  branchesList: string[];
  branches: AdminBranch[];
  primaryColor: string;
  customDomain?: string;
  serverIp?: string;
  edgeIp?: string;
  cnameTarget?: string;
  createdAt: string;
}

interface AdminContextType {
  salon: SalonTenantData;
  isLoading: boolean;
  selectedLocation: LocationOption;
  locationsList: LocationOption[];
  setSelectedLocation: (loc: LocationOption) => void;
  refetchSalon: () => Promise<void>;
  updateSalon: (payload: Partial<SalonTenantData>) => Promise<void>;
  createBranch: (payload: Partial<AdminBranch>) => Promise<AdminBranch>;
  updateBranch: (id: string, payload: Partial<AdminBranch>) => Promise<AdminBranch>;
  deleteBranch: (id: string) => Promise<void>;
  setBranches: React.Dispatch<React.SetStateAction<AdminBranch[]>>;
}

const DEFAULT_SALON: SalonTenantData = {
  id: 'a0000000-0000-0000-0000-000000000001',
  name: '  Luxury Salon & Spa',
  salonName: '  Luxury Salon & Spa',
  code: 'DGFX-HQ-01',
  slug: 'digiflex-salon',
  legalName: '  Wellness Enterprises Pvt Ltd',
  tradeName: '  Luxury Salon',
  displayName: '  Salon & Spa',
  ownerName: 'Salon Owner',
  ownerEmail: 'owner@digiflexsalon.com',
  ownerPhone: '+91 98260 12345',
  businessEmail: 'owner@digiflexsalon.com',
  businessPhone: '+91 98260 12345',
  contactEmail: 'contact@digiflexsalon.com',
  contactPhone: '+91 98260 12345',
  addressLine1: 'Corporate Heights, Main Road',
  city: 'Indore',
  state: 'Madhya Pradesh',
  region: 'Central India',
  postalCode: '452010',
  country: 'IN',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  status: 'Active',
  activePlans: 'Enterprise Tier Plan',
  revenue: '₹14,85,000 /mo',
  branchesCount: 0,
  branchesList: [],
  branches: [],
  primaryColor: '#5A2EA6',
  serverIp: '76.76.21.21',
  edgeIp: '76.76.21.21',
  cnameTarget: 'cname.digiflexsalon.com',
  createdAt: '2026-01-01',
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [salon, setSalon] = useState<SalonTenantData>(DEFAULT_SALON);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>({
    id: 'all',
    name: 'All Locations',
    subtitle: 'Multi-Location HQ Network',
    active: true,
    count: 'Live Network',
  });

  const generateBranchesForTenant = useCallback((t: any): AdminBranch[] => {
    const rawBranchList =
      Array.isArray(t.branchesList) && t.branchesList.length > 0
        ? t.branchesList
        : Array.isArray(t.branches) && t.branches.length > 0
          ? t.branches.map((b: any) => b.name)
          : [t.salonName || t.name || `${t.city || 'Central'} Branch`];

    const cityName = t.city || 'Indore';
    const stateName = t.state || t.region || 'Madhya Pradesh';
    const codePrefix = t.code ? t.code.replace('SALON-', '').slice(0, 4) : 'BR';

    return rawBranchList.map((branchName: string, index: number) => {
      const isFlagship = index === 0;
      return {
        id: `BR-${codePrefix}-${index + 101}`,
        name: branchName,
        code: `BR-${codePrefix}-${index + 101}`,
        type: isFlagship ? 'Flagship' : index % 2 === 0 ? 'Express' : 'Lounge',
        address: `${branchName}, ${t.addressLine1 || `${cityName} Prime Avenue`}`,
        city: cityName,
        state: stateName,
        manager: isFlagship ? (t.ownerName || 'Salon Manager') : `Branch Lead #${index + 1}`,
        managerEmail: isFlagship ? t.businessEmail : `branch${index + 1}@${t.slug || 'salon'}.com`,
        contactNumber: t.businessPhone || '+91 98000 11111',
        status: 'Active',
        workingHours: '09:00 AM – 09:00 PM (Mon–Sun)',
        revenue: Math.round(280000 + (index * 120000)),
        appointments: 140 + index * 45,
        occupancy: 78 + (index % 15),
        staffCount: 6 + index * 2,
        clientCount: 220 + index * 80,
        createdDate: t.createdAt ? (typeof t.createdAt === 'string' ? t.createdAt.split('T')[0] : '2026-01-15') : '2026-01-15',
        servicesAvailable: [
          'Hair Styling & Texture',
          'Bridal & Aesthetics',
          'Therapeutic Spa & Massage',
          'Nail Studio & Care',
          'Skin Glow & Facials',
        ],
      };
    });
  }, []);

  const loadTenantData = useCallback(async () => {
    setIsLoading(true);
    try {
      let targetTenant: any = null;

      // 1. If user has a specific tenantId from login, fetch directly
      if (user?.tenantId) {
        try {
          targetTenant = await tenantsApi.getById(user.tenantId);
        } catch (err) {
          console.warn(`[AdminContext] Direct fetch for tenant ${user.tenantId} failed, trying list fallback`, err);
        }
      }

      // 2. If no direct match or not found, do not fallback to matching by email to prevent cross-tenant data leaks
      if (!targetTenant && user?.tenantId) {
        targetTenant = {
          id: user.tenantId,
          name: 'Unconfigured Salon',
          salonName: 'Unconfigured Salon',
          status: 'PENDING',
          branches: []
        };
      }


      if (targetTenant) {
        if (targetTenant.id) {
          tokenStorage.setTenantId(targetTenant.id);
        }
        const salonName =
          targetTenant.salonName ||
          targetTenant.name ||
          targetTenant.tradeName ||
          user?.fullName ||
          'My Salon';
        const ownerName =
          targetTenant.legalName ||
          targetTenant.ownerName ||
          (user?.fullName !== salonName ? user?.fullName : '') ||
          'Salon Owner';
        const businessEmail =
          targetTenant.businessEmail ||
          targetTenant.ownerEmail ||
          user?.email ||
          'admin@salon.com';
        const businessPhone =
          targetTenant.businessPhone ||
          targetTenant.ownerPhone ||
          '+91 70895 42024';
        const city = targetTenant.city || 'Indore';
        const state = targetTenant.state || targetTenant.region || 'Madhya Pradesh';

        let liveBranches: AdminBranch[] = [];
        try {
          const dbBranches = await tenantsApi.listBranches(targetTenant.id);
          if (Array.isArray(dbBranches) && dbBranches.length > 0) {
            liveBranches = dbBranches.map((b: any, idx: number) => ({
              id: b.id,
              name: b.name,
              code: b.code || `BR-${(targetTenant.code || 'SALON').replace('SALON-', '').slice(0, 4)}-${101 + idx}`,
              type: b.type || (b.franchisePartnerId || b.franchiseId ? 'Franchise' : idx === 0 ? 'Flagship' : 'Express'),
              address: b.address || b.addressLine1 || `${b.name}, ${city}`,
              city: b.city || city,
              state: b.state || state,
              manager: b.manager || '',
              managerEmail: b.email || b.managerEmail || '',
              contactNumber: b.phone || b.contactNumber || businessPhone,
              primaryManagerEmployeeId: b.primaryManagerEmployeeId || undefined,
              status: (b.status === 'ACTIVE' || b.status === 'Active' ? 'Active' : b.status === 'Pending' || b.status === 'TEMPORARILY_CLOSED' ? 'Pending' : 'Inactive') as 'Active' | 'Inactive' | 'Pending',
              workingHours: b.workingHours || '09:00 AM – 09:00 PM',
              revenue: b.revenue || 0,
              appointments: b.appointments || 0,
              occupancy: b.occupancy || 0,
              staffCount: b.staffCount ?? (b.resources?.length ?? 0),
              clientCount: b.clientCount || 0,
              createdDate: b.createdDate || (typeof b.createdAt === 'string' ? b.createdAt.split('T')[0] : '2026-01-15'),
              servicesAvailable: b.servicesAvailable || [
                'Hair Styling & Texture',
                'Bridal & Aesthetics',
                'Therapeutic Spa & Massage',
                'Nail Studio & Care',
                'Skin Glow & Facials',
              ],
              franchisePartnerId: b.franchisePartnerId || b.franchiseId,
              franchisePartnerName: b.franchisePartnerName || b.franchise?.companyName,
              isFranchiseOwned: Boolean(b.franchisePartnerId || b.franchiseId),
            }));
          }
        } catch (bErr) {
          console.warn('[AdminContext] Could not fetch branches from API:', bErr);
        }

        if (liveBranches.length === 0) {
          liveBranches = generateBranchesForTenant(targetTenant);
        }

        const loadedSalon: SalonTenantData = {
          id: targetTenant.id,
          name: salonName,
          salonName,
          code: targetTenant.code || 'SALON-001',
          slug: targetTenant.slug || 'my-salon',
          legalName: targetTenant.legalName || ownerName,
          tradeName: targetTenant.tradeName || salonName,
          displayName: targetTenant.displayName || salonName,
          ownerName,
          ownerEmail: businessEmail,
          ownerPhone: businessPhone,
          businessEmail,
          businessPhone,
          contactEmail: targetTenant.contactEmail || businessEmail,
          contactPhone: targetTenant.contactPhone || businessPhone,
          addressLine1: targetTenant.addressLine1 || `${city} Central Location`,
          addressLine2: targetTenant.addressLine2,
          city,
          state,
          region: state,
          postalCode: targetTenant.postalCode || '462001',
          country: targetTenant.country || 'IN',
          currency: targetTenant.currency || 'INR',
          timezone: targetTenant.timezone || 'Asia/Kolkata',
          status:
            targetTenant.status === 'ACTIVE' || targetTenant.status === 'Active'
              ? 'Active'
              : 'Suspended',
          activePlans: targetTenant.activePlans || 'Enterprise Tier Plan',
          revenue: targetTenant.revenue || '₹6,80,000 /mo',
          branchesCount: liveBranches.length,
          branchesList: liveBranches.map((b) => b.name),
          branches: liveBranches,
          primaryColor: targetTenant.primaryColor || '#5A2EA6',
          customDomain: targetTenant.customDomain || undefined,
          serverIp: targetTenant.serverIp || targetTenant.edgeIp || targetTenant.dnsIp || '76.76.21.21',
          edgeIp: targetTenant.edgeIp || targetTenant.serverIp || '76.76.21.21',
          cnameTarget: targetTenant.cnameTarget || 'cname.digiflexsalon.com',
          createdAt:
            typeof targetTenant.createdAt === 'string'
              ? targetTenant.createdAt.split('T')[0]
              : '2026-09-04',
        };

        setSalon(loadedSalon);

        // Update default selected location
        setSelectedLocation({
          id: 'all',
          name: `All Locations (${loadedSalon.branchesCount})`,
          subtitle: `${salonName} Network`,
          active: true,
          count: `${loadedSalon.branchesCount * 18} Chairs`,
        });
      }
    } catch (err) {
      console.warn('[AdminContext] Could not load dynamic salon tenant:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, generateBranchesForTenant]);

  useEffect(() => {
    loadTenantData();
  }, [loadTenantData]);

  // Dynamic Location Selector Options
  const locationsList: LocationOption[] = useMemo(() => {
    const allOption: LocationOption = {
      id: 'all',
      name: `All Locations (${salon.branches.length})`,
      subtitle: `${salon.name} Multi-Location Network`,
      active: true,
      count: `${salon.branches.length * 18} Chairs`,
    };

    const branchOptions: LocationOption[] = salon.branches.map((b, idx) => ({
      id: b.id,
      name: b.name,
      subtitle: `Branch #${101 + idx} · ${b.type} · ${b.city}`,
      active: b.status === 'Active',
      count: `${14 + (idx * 4)} Chairs`,
      city: b.city,
    }));

    return [allOption, ...branchOptions];
  }, [salon]);

  const setBranches: React.Dispatch<React.SetStateAction<AdminBranch[]>> = (updater) => {
    setSalon((prev) => {
      const updated = typeof updater === 'function' ? updater(prev.branches) : updater;
      return {
        ...prev,
        branches: updated,
        branchesCount: updated.length,
        branchesList: updated.map((b) => b.name),
      };
    });
  };

  const createBranch = async (payload: Partial<AdminBranch>): Promise<AdminBranch> => {
    const isUuid = (str?: string | null) =>
      typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const currentTenantId = salon?.id || tokenStorage.getTenantId() || 'c7863cdd-efc2-4ec5-aa63-986a20942906';
    tokenStorage.setTenantId(currentTenantId);

    const cleanCode = (payload.code || `BR-${Math.floor(1000 + Math.random() * 9000)}`)
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '')
      .slice(0, 10);

    const branchName = payload.name || 'New Branch';
    const city = payload.city || salon.city || 'Indore';
    const state = payload.state || salon.state || 'Madhya Pradesh';
    const address = payload.address || `${branchName}, ${city}`;
    const phone = payload.contactNumber || salon.businessPhone || '+91 98000 00000';
    const managerEmail =
      payload.managerEmail && payload.managerEmail.includes('@')
        ? payload.managerEmail
        : salon.businessEmail && salon.businessEmail.includes('@')
          ? salon.businessEmail
          : undefined;

    try {
      const created = await tenantsApi.createBranch({
        tenantId: currentTenantId,
        name: branchName,
        code: cleanCode.length >= 2 ? cleanCode : `BR-${Math.floor(1000 + Math.random() * 9000)}`,
        addressLine1: address,
        city: city,
        state: state,
        postalCode: '452001',
        phone: phone,
        email: managerEmail,
        franchiseId: isUuid(payload.franchisePartnerId)
          ? payload.franchisePartnerId
          : isUuid((payload as any).franchiseId)
            ? (payload as any).franchiseId
            : undefined,
        franchisePartnerId: payload.franchisePartnerId || (payload as any).franchiseId,
        franchisePartnerName: payload.franchisePartnerName,
        primaryManagerEmployeeId: isUuid(payload.primaryManagerEmployeeId) ? payload.primaryManagerEmployeeId : undefined,
      });

      const newBranchItem: AdminBranch = {
        id: created.id,
        name: created.name || branchName,
        code: created.code || cleanCode,
        type: (created.franchiseId || payload.franchisePartnerId ? 'Franchise' : (payload.type || 'Flagship')),
        address: created.addressLine1 || address,
        city: created.city || city,
        state: created.state || state,
        manager: payload.manager || 'Branch Lead',
        managerEmail: created.email || managerEmail || '',
        contactNumber: created.phone || phone,
        status: (created.status === 'ACTIVE' || created.status === 'Active' ? 'Active' : 'Pending') as 'Active' | 'Inactive' | 'Pending',
        workingHours: payload.workingHours || '09:00 AM – 09:00 PM',
        revenue: 0,
        appointments: 0,
        occupancy: 0,
        staffCount: 6,
        clientCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        servicesAvailable: payload.servicesAvailable || [
          'Hair Styling & Texture',
          'Bridal & Aesthetics',
          'Therapeutic Spa & Massage',
        ],
        franchisePartnerId: created.franchiseId || payload.franchisePartnerId,
        franchisePartnerName: payload.franchisePartnerName,
        isFranchiseOwned: Boolean(created.franchiseId || payload.franchisePartnerId),
      };

      setBranches((prev) => [newBranchItem, ...prev.filter((b) => b.id !== newBranchItem.id)]);
      return newBranchItem;
    } catch (err) {
      console.error('[AdminContext] API branch creation failed:', err);
      const fallbackItem: AdminBranch = {
        id: `BR-00${salon.branches.length + 1}`,
        name: branchName,
        code: cleanCode,
        type: payload.type || (payload.franchisePartnerId ? 'Franchise' : 'Flagship'),
        address: address,
        city: city,
        state: state,
        manager: payload.manager || 'Branch Lead',
        managerEmail: managerEmail || '',
        contactNumber: phone,
        status: payload.status || 'Active',
        workingHours: payload.workingHours || '09:00 AM – 09:00 PM',
        revenue: 0,
        appointments: 0,
        occupancy: 0,
        staffCount: 6,
        clientCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        servicesAvailable: payload.servicesAvailable || [
          'Hair Styling & Texture',
          'Bridal & Aesthetics',
          'Therapeutic Spa & Massage',
        ],
        franchisePartnerId: payload.franchisePartnerId,
        franchisePartnerName: payload.franchisePartnerName,
        isFranchiseOwned: Boolean(payload.franchisePartnerId),
      };
      setBranches((prev) => [fallbackItem, ...prev.filter((b) => b.id !== fallbackItem.id)]);
      return fallbackItem;
    }
  };

  const updateBranch = async (id: string, payload: Partial<AdminBranch>): Promise<AdminBranch> => {
    try {
      await tenantsApi.updateBranch(id, {
        name: payload.name,
        code: payload.code,
        addressLine1: payload.address,
        city: payload.city,
        state: payload.state,
        phone: payload.contactNumber,
        email: payload.managerEmail,
        status: payload.status,
        franchisePartnerId: payload.franchisePartnerId,
        primaryManagerEmployeeId: payload.primaryManagerEmployeeId,
      });
    } catch (err) {
      console.warn('[AdminContext] API branch update notice:', err);
    }

    let updatedItem!: AdminBranch;
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          updatedItem = { ...b, ...payload };
          return updatedItem;
        }
        return b;
      }),
    );
    return updatedItem;
  };

  const deleteBranch = async (id: string): Promise<void> => {
    try {
      await tenantsApi.deleteBranch(id);
    } catch (err) {
      console.warn('[AdminContext] API branch delete notice:', err);
    }
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const updateSalon = async (payload: Partial<SalonTenantData>) => {
    setSalon((prev) => ({ ...prev, ...payload }));
    try {
      if (salon.id) {
        await tenantsApi.update(salon.id, {
          salonName: payload.name || payload.salonName,
          name: payload.name || payload.salonName,
          legalName: payload.legalName || payload.ownerName,
          businessEmail: payload.businessEmail || payload.ownerEmail,
          businessPhone: payload.businessPhone || payload.ownerPhone,
          city: payload.city,
          state: payload.state || payload.region,
          addressLine1: payload.addressLine1,
          primaryColor: payload.primaryColor,
          customDomain: payload.customDomain,
        });
      }
    } catch (err) {
      console.warn('[AdminContext] Failed to persist salon updates to API:', err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        salon,
        isLoading,
        selectedLocation,
        locationsList,
        setSelectedLocation,
        refetchSalon: loadTenantData,
        updateSalon,
        createBranch,
        updateBranch,
        deleteBranch,
        setBranches,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

const fallbackLocation: LocationOption = {
  id: 'all',
  name: 'All Locations',
  subtitle: 'Multi-Location HQ Network',
  active: true,
  count: 'All Locations',
};

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    return {
      salon: DEFAULT_SALON,
      isLoading: false,
      selectedLocation: fallbackLocation,
      setSelectedLocation: () => { },
      locationsList: [fallbackLocation],
      updateSalon: async () => { },
      refreshSalon: async () => { },
      refetchSalon: async () => { },
      createBranch: async () => ({} as AdminBranch),
      updateBranch: async () => ({} as AdminBranch),
      deleteBranch: async () => { },
      setBranches: () => { },
    };
  }
  return context;
}

export const useAdmin = useAdminContext;

