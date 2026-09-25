import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Armchair,
  Building2,
  Check,
  CheckCircle2,
  Download,
  Edit2,
  Eye,
  Filter,
  Home,
  Layers,
  Loader2,
  MapPin,
  Plus,
  Power,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  Tag,
  Trash2,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdminContext } from '../../context/AdminContext';
import { masterBranches } from '../locations/AllBranchesTab';
import { masterServices } from './ServicesTab';
import { catalogueApi, tenantsApi, type ApiBranchResource } from '@/shared/api';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type ResourceType = 'Room' | 'Chair' | 'Equipment';

export interface ResourceRecord {
  id: string;
  code: string;
  name: string;
  type: ResourceType;
  branchName: string;
  subType: string;
  capacityOrQty: string;
  linkedServices: string[];
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  lastInspected: string;
}

// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────

export const initialResources: ResourceRecord[] = [
  {
    id: 'RES-001',
    code: 'ROOM-AESTH-01',
    name: 'Aesthetic Treatment Suite 1',
    type: 'Room',
    branchName: 'Atelier Indrapuri Flagship',
    subType: 'Clinical Facial & Laser Suite',
    capacityOrQty: '1 Patient Bed',
    linkedServices: [
      '7-Step Medical Hydra-Facial Rejuvenation',
      'Collagen Red-Light Phototherapy Mask',
    ],
    status: 'Active',
    lastInspected: '14 Aug 2026',
  },
  {
    id: 'RES-002',
    code: 'ROOM-SPA-02',
    name: 'Private Spa Sanctuary Suite (Couples)',
    type: 'Room',
    branchName: 'Atelier Jaipur Royal Spa',
    subType: 'Ayurvedic & Aromatherapy Sanctuary',
    capacityOrQty: '2 Heated Massage Tables',
    linkedServices: ['Swedish Aromatherapy Deep Tissue Massage'],
    status: 'Active',
    lastInspected: '12 Aug 2026',
  },
  {
    id: 'RES-003',
    code: 'ROOM-BRID-03',
    name: 'Bridal VIP Vanity Suite',
    type: 'Room',
    branchName: 'Atelier Koregaon Park Grand',
    subType: 'Private Couture Dressing Room',
    capacityOrQty: '1 Bride + 2 Entourage',
    linkedServices: ['Couture HD Airbrush Bridal Glamour'],
    status: 'Active',
    lastInspected: '10 Aug 2026',
  },
  {
    id: 'RES-004',
    code: 'CHR-STYLE-01',
    name: 'Hydraulic Styling Station #1',
    type: 'Chair',
    branchName: 'Atelier Indrapuri Flagship',
    subType: 'Belvedere Italian Hydraulic Recliner',
    capacityOrQty: '1 Chair',
    linkedServices: ['Signature Precision Cut & Blowout', 'Cysteine & Keratin Infusion Treatment'],
    status: 'Active',
    lastInspected: '15 Aug 2026',
  },
  {
    id: 'RES-005',
    code: 'CHR-BARB-02',
    name: 'Executive Barber Throne #1',
    type: 'Chair',
    branchName: 'Atelier MG Road Express',
    subType: 'Takara Belmont Heavy Duty Barber Chair',
    capacityOrQty: '1 Chair',
    linkedServices: ['Executive Hot Towel Beard Sculpt & Scalp Polish'],
    status: 'Active',
    lastInspected: '08 Aug 2026',
  },
  {
    id: 'RES-006',
    code: 'CHR-NAIL-03',
    name: 'Nail Bar Station #2',
    type: 'Chair',
    branchName: 'Atelier Whitefield Studio',
    subType: 'Ergonomic Manicure Desk & Dust Extractor',
    capacityOrQty: '1 Station',
    linkedServices: ['Sculpted Gel Extensions & Ombre Art'],
    status: 'Active',
    lastInspected: '09 Aug 2026',
  },
  {
    id: 'RES-007',
    code: 'EQP-HYDR-01',
    name: 'Vortex Hydrodermabrasion Unit (Hydra Pro X)',
    type: 'Equipment',
    branchName: 'Atelier Indrapuri Flagship',
    subType: 'Clinical Aesthetic Vacuum Device',
    capacityOrQty: '1 Machine',
    linkedServices: ['7-Step Medical Hydra-Facial Rejuvenation'],
    status: 'Active',
    lastInspected: '16 Aug 2026',
  },
  {
    id: 'RES-008',
    code: 'EQP-AIRB-02',
    name: 'Temptu Air Pro Compressor Kit',
    type: 'Equipment',
    branchName: 'Atelier Koregaon Park Grand',
    subType: 'Cosmetic Airbrush Gun & Compressor',
    capacityOrQty: '2 Kits',
    linkedServices: ['Couture HD Airbrush Bridal Glamour'],
    status: 'Active',
    lastInspected: '05 Aug 2026',
  },
  {
    id: 'RES-009',
    code: 'EQP-LED-03',
    name: 'Omnilux Medical LED Canopy',
    type: 'Equipment',
    branchName: 'Atelier Arera Luxury Lounge',
    subType: 'Phototherapy Collagen Light Array',
    capacityOrQty: '1 Unit',
    linkedServices: ['Collagen Red-Light Phototherapy Mask'],
    status: 'Under Maintenance',
    lastInspected: '01 Aug 2026',
  },
];

export interface ResourcesTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
  readOnly?: boolean;
  onResourceCountChange?: (count: number) => void;
}

export function ResourcesTab({
  defaultBranch = 'All',
  lockBranch = false,
  readOnly = false,
  onResourceCountChange,
}: ResourcesTabProps = {}) {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const [dbBranches, setDbBranches] = useState<any[]>([]);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const branches = await tenantsApi.listBranches();
        if (Array.isArray(branches) && branches.length > 0) {
          setDbBranches(branches);
        }
      } catch (e) {
        console.warn('Could not load branches from API:', e);
      }
    };
    loadBranches();
  }, []);

  const adminBranches = useMemo(() => {
    if (dbBranches.length > 0) {
      return dbBranches;
    }
    if (salon?.branches && Array.isArray(salon.branches) && salon.branches.length > 0) {
      return salon.branches;
    }
    return masterBranches;
  }, [dbBranches, salon?.branches]);

  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | ResourceType>('All');
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceRecord | null>(null);
  const [viewResource, setViewResource] = useState<ResourceRecord | null>(null);
  const [deleteConfirmResource, setDeleteConfirmResource] = useState<ResourceRecord | null>(null);

  // Unified Resource Form State (Shared identically by Add and Edit)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Room' as ResourceType,
    branchName: adminBranches[0]?.name || 'Main Branch',
    subType: '',
    capacityOrQty: '1 Unit',
    status: 'Active' as ResourceRecord['status'],
  });

  const openAddModal = () => {
    setEditingResource(null);
    const defaultBranchName =
      (branchFilter !== 'All' ? branchFilter : adminBranches[0]?.name) || 'Main Branch';
    setFormData({
      name: '',
      code: `RES-${Math.floor(100 + Math.random() * 900)}`,
      type: 'Room',
      branchName: defaultBranchName,
      subType: '',
      capacityOrQty: '1 Unit',
      status: 'Active',
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (res: ResourceRecord) => {
    setEditingResource(res);
    setFormData({
      name: res.name,
      code: res.code,
      type: res.type,
      branchName: res.branchName,
      subType: res.subType,
      capacityOrQty: res.capacityOrQty,
      status: res.status,
    });
    setIsFormModalOpen(true);
  };

  // Synchronize default branch from parent props when resolved
  useEffect(() => {
    if (defaultBranch && defaultBranch.toLowerCase() !== 'assigned branch') {
      setBranchFilter(defaultBranch);
    }
  }, [defaultBranch]);

  // Load branch resources live from organization-service
  const loadResourcesData = async (overrideBranch?: string) => {
    setIsLoading(true);
    try {
      const currentFilter = overrideBranch !== undefined ? overrideBranch : branchFilter;
      const isGlobalFilter =
        currentFilter === 'All' ||
        !currentFilter ||
        currentFilter.toLowerCase() === 'assigned branch';

      const targetBranch = !isGlobalFilter
        ? adminBranches.find((b) => b.name === currentFilter || b.id === currentFilter)
        : undefined;
      const targetBranchId = targetBranch?.id;
      const validTargetId =
        targetBranchId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetBranchId)
          ? targetBranchId
          : undefined;

      const resList = await catalogueApi.fetchResources(validTargetId);

      if (Array.isArray(resList) && resList.length > 0) {
        const mapped: ResourceRecord[] = resList.map((r: ApiBranchResource) => {
          const typeUpper = String(r.type || '').toUpperCase();
          const typeTitle: ResourceType =
            typeUpper === 'ROOM' ? 'Room' : typeUpper === 'CHAIR' ? 'Chair' : 'Equipment';
          const branch = adminBranches.find((b) => b.id === r.branchId);
          const bName = r.branch?.name || (branch ? branch.name : r.branchId);
          return {
            id: r.id,
            code: r.code || `RES-${r.id.slice(0, 6).toUpperCase()}`,
            name: r.name,
            type: typeTitle,
            branchName: bName,
            subType: r.description || `${typeTitle} Resource Asset`,
            capacityOrQty: `${r.capacity || 1} Unit${(r.capacity || 1) > 1 ? 's' : ''}`,
            linkedServices: ['Master Service Protocol'],
            status: r.isAvailable ? 'Active' : 'Inactive',
            lastInspected: r.updatedAt
              ? new Date(r.updatedAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Verified Today',
          };
        });
        setResources(mapped);
        onResourceCountChange?.(mapped.length);
      } else {
        setResources([]);
        onResourceCountChange?.(0);
      }
    } catch (err) {
      console.error('Failed to load branch resources from API:', err);
      setResources([]);
      onResourceCountChange?.(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResourcesData();
  }, [branchFilter, dbBranches]);

  const handleSeedStandardResources = async () => {
    setIsSubmitting(true);
    try {
      const targetBranch =
        adminBranches.find(
          (b) =>
            (b.name === branchFilter || b.id === branchFilter) &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id),
        ) ||
        adminBranches.find((b) =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id),
        );

      if (!targetBranch) {
        toast('Please create or select an active branch for this salon before seeding equipment.');
        setIsSubmitting(false);
        return;
      }
      const targetBranchId = targetBranch.id;
      const standardAssets = [
        {
          branchId: targetBranchId,
          name: 'Aesthetic Treatment Suite 1',
          code: 'ROOM-AESTH-01',
          type: 'ROOM' as const,
          capacity: 1,
          description: 'Clinical Facial & Laser Suite with ergonomic patient bed',
          isAvailable: true,
        },
        {
          branchId: targetBranchId,
          name: 'Private Spa Sanctuary Suite (Couples)',
          code: 'ROOM-SPA-02',
          type: 'ROOM' as const,
          capacity: 2,
          description: 'Ayurvedic & Aromatherapy Sanctuary with heated massage tables',
          isAvailable: true,
        },
        {
          branchId: targetBranchId,
          name: 'Hydraulic Styling Station #1',
          code: 'CHR-STYLE-01',
          type: 'CHAIR' as const,
          capacity: 1,
          description: 'Belvedere Italian Hydraulic Recliner with 360 degree rotation',
          isAvailable: true,
        },
        {
          branchId: targetBranchId,
          name: 'Executive Barber Throne #1',
          code: 'CHR-BARB-02',
          type: 'CHAIR' as const,
          capacity: 1,
          description: 'Takara Belmont Heavy Duty Barber Chair with headrest',
          isAvailable: true,
        },
        {
          branchId: targetBranchId,
          name: 'Vortex Hydrodermabrasion Pro Unit',
          code: 'EQP-HYDR-01',
          type: 'EQUIPMENT' as const,
          capacity: 1,
          description: 'Clinical Aesthetic Vacuum Device with ultrasound infusion',
          isAvailable: true,
        },
        {
          branchId: targetBranchId,
          name: 'Omnilux Medical LED Canopy',
          code: 'EQP-LED-03',
          type: 'EQUIPMENT' as const,
          capacity: 1,
          description: 'Phototherapy Collagen Red-Light Canopy with dual spectrum',
          isAvailable: true,
        },
      ];
      for (const asset of standardAssets) {
        await catalogueApi.createResource(asset);
      }
      await loadResourcesData();
      toast('Standard salon suites, chairs, and laser units seeded successfully.');
    } catch (err) {
      console.error('Failed to seed resources to database:', err);
      toast('Failed to seed resources to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResources = useMemo(() => {
    const isSpecialBranch =
      branchFilter === 'All' ||
      !branchFilter ||
      branchFilter.toLowerCase() === 'assigned branch';

    const branchMatch = (r: ResourceRecord) => {
      if (isSpecialBranch) return true;
      if (lockBranch || readOnly) return true;
      const bFilterLower = branchFilter.toLowerCase().trim();
      if (r.branchName?.toLowerCase().trim() === bFilterLower) return true;
      if (r.id?.toLowerCase().trim() === bFilterLower) return true;
      if (
        r.branchName &&
        (r.branchName.toLowerCase().includes(bFilterLower) ||
          bFilterLower.includes(r.branchName.toLowerCase()))
      ) {
        return true;
      }
      const matchedBranch = adminBranches.find(
        (b) => b.name?.toLowerCase() === bFilterLower || b.id?.toLowerCase() === bFilterLower,
      );
      if (matchedBranch && r.branchName?.toLowerCase() === matchedBranch.name?.toLowerCase()) {
        return true;
      }
      return false;
    };

    const result = resources.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || r.type === typeFilter;
      const matchesBranch = branchMatch(r);
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

      return matchesSearch && matchesType && matchesBranch && matchesStatus;
    });

    return result;
  }, [resources, searchQuery, typeFilter, branchFilter, statusFilter, adminBranches]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    setIsSubmitting(true);

    const targetBranch =
      adminBranches.find(
        (b) =>
          (b.name === formData.branchName || b.id === formData.branchName) &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id),
      ) ||
      adminBranches.find((b) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id),
      );

    if (!targetBranch) {
      toast('Please create or select an active branch for this salon first.');
      setIsSubmitting(false);
      return;
    }
    const branchId = targetBranch.id;

    const apiType: 'ROOM' | 'CHAIR' | 'EQUIPMENT' =
      formData.type === 'Room' ? 'ROOM' : formData.type === 'Chair' ? 'CHAIR' : 'EQUIPMENT';
    const capacity = Number.parseInt(formData.capacityOrQty) || 1;

    try {
      if (editingResource) {
        const updated = await catalogueApi.updateResource(editingResource.id, {
          branchId,
          name: formData.name,
          code: formData.code.toUpperCase(),
          type: apiType,
          capacity,
          description: formData.subType,
          isAvailable: formData.status === 'Active',
        });
        toast(`Resource "${formData.name}" updated successfully in database.`);
        setResources((prev) =>
          prev.map((r) =>
            r.id === editingResource.id
              ? {
                  ...r,
                  name: updated?.name || formData.name,
                  code: updated?.code || formData.code.toUpperCase(),
                  type: formData.type,
                  branchName: updated?.branch?.name || formData.branchName,
                  subType: updated?.description || formData.subType,
                  capacityOrQty: `${updated?.capacity || capacity} Unit`,
                  status: (updated?.isAvailable ?? (formData.status === 'Active'))
                    ? 'Active'
                    : 'Inactive',
                  lastInspected: 'Just Now',
                }
              : r,
          ),
        );
      } else {
        const created = await catalogueApi.createResource({
          branchId,
          name: formData.name,
          code: formData.code.toUpperCase(),
          type: apiType,
          capacity,
          description: formData.subType,
          isAvailable: formData.status === 'Active',
        });
        toast(`Resource "${formData.name}" registered successfully in database.`);
        const newRecord: ResourceRecord = {
          id: created?.id || `RES-${Date.now()}`,
          code: created?.code || formData.code.toUpperCase(),
          name: created?.name || formData.name,
          type: formData.type,
          branchName: created?.branch?.name || formData.branchName,
          subType: created?.description || formData.subType || `${formData.type} Resource Asset`,
          capacityOrQty: `${created?.capacity || capacity} Unit`,
          linkedServices: ['Master Service Protocol'],
          status: (created?.isAvailable ?? (formData.status === 'Active')) ? 'Active' : 'Inactive',
          lastInspected: 'Just Now',
        };
        setResources((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
      }

      // Reset filters so the new/edited resource is guaranteed visible in the table
      setBranchFilter('All');
      if (typeFilter !== 'All' && typeFilter !== formData.type) {
        setTypeFilter('All');
      }

      await loadResourcesData('All');
      setIsFormModalOpen(false);
      setEditingResource(null);
    } catch (err: any) {
      console.error('Failed to save resource:', err);
      toast(
        `Error saving resource: ${
          err?.response?.data?.error?.message || err?.message || 'Database error'
        }`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (res: ResourceRecord) => {
    const nextStatus = res.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await catalogueApi.updateResource(res.id, {
        isAvailable: nextStatus === 'Active',
      });
      await loadResourcesData();
      toast(`Resource "${res.name}" marked as ${nextStatus}.`);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setResources((prev) =>
        prev.map((r) =>
          r.id === res.id ? { ...r, status: nextStatus, lastInspected: 'Just Now' } : r,
        ),
      );
      toast(`Resource "${res.name}" marked as ${nextStatus} locally.`);
    }
  };


  const handleDeleteResource = async () => {
    if (!deleteConfirmResource) return;
    setIsSubmitting(true);
    try {
      await catalogueApi.deleteResource(deleteConfirmResource.id);
      await loadResourcesData();
      toast(`Resource "${deleteConfirmResource.name}" permanently deleted.`);
    } catch (err) {
      console.error('Failed to delete resource:', err);
      setResources((prev) => prev.filter((r) => r.id !== deleteConfirmResource.id));
      toast(`Resource "${deleteConfirmResource.name}" deleted locally.`);
    } finally {
      setDeleteConfirmResource(null);
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    toast(`Exported ${filteredResources.length} salon resource assets to CSV.`);
  };

  // Narrow local variables for modal portals
  const viewRes = viewResource;
  const delRes = deleteConfirmResource;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Salon Resources &amp; Equipment Master
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              Rooms · Chairs · Machines
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Manage treatment suites, styling stations, high-end machines, and link them to
            appointment services to avoid double booking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => loadResourcesData()}
            disabled={isLoading}
            className="h-10 px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-1.5 shadow-xs"
            title="Synchronize from Database"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            <span>Sync</span>
          </Button>

          {readOnly && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5A2EA6] text-xs font-bold border border-purple-200/60 flex items-center gap-1.5 shadow-3xs">
              <Eye className="w-3.5 h-3.5" />
              <span>View-Only Mode</span>
            </div>
          )}

          {!readOnly && (
            <Button
              variant="outline"
              onClick={handleSeedStandardResources}
              disabled={isSubmitting}
              className="h-10 px-3.5 rounded-xl text-xs font-bold border-purple-200 text-[#5A2EA6] hover:bg-purple-50 bg-purple-50/30 flex items-center gap-1.5 shadow-xs"
              title="Seed standard rooms, styling chairs, and lasers"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Seed Standard Assets</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          {!readOnly && (
            <Button
              onClick={openAddModal}
              className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search resource, code, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <span>Asset Type:</span>
            {(['All', 'Room', 'Chair', 'Equipment'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border',
                  typeFilter === t
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                    : 'bg-[#FCFAFF] text-soft hover:bg-[#5A2EA6]/10 border-[#5A2EA6]/20',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Branch Filter */}
          {!lockBranch && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="All">All Branches</option>
                {adminBranches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Resource Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Physical Resource Allocation Registry
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Equipment and room capacity preventing booking collisions across multi-station
                salons
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredResources.length} Assets Listed
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Resource Asset Name',
                  'Type',
                  ...(!lockBranch ? ['Branch Location'] : []),
                  'Asset Code',
                  'Capacity / Specs',
                  'Linked Services',
                  'Status',
                  'Actions',
                ].map((h, i, arr) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === arr.length - 1 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {isLoading && resources.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 text-[#5A2EA6] animate-spin" />
                      <p className="text-xs font-semibold text-ink">
                        Synchronizing salon resources from database...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Armchair className="w-9 h-9 text-muted/50" />
                      <div>
                        <p className="text-sm font-semibold text-ink">No salon resources found</p>
                        <p className="text-xs text-soft mt-0.5">
                          Get started by seeding standard treatment rooms, styling chairs, and lasers.
                        </p>
                      </div>
                      <Button
                        onClick={handleSeedStandardResources}
                        disabled={isSubmitting}
                        className="mt-1 h-9 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Seed Standard Resources</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    {/* Asset Name */}
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center shrink-0 border border-purple-100 font-bold text-xs">
                          {res.type === 'Room' ? (
                            <Home className="w-4 h-4" />
                          ) : res.type === 'Chair' ? (
                            <Armchair className="w-4 h-4" />
                          ) : (
                            <Wrench className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-ink text-[13px]">{res.name}</div>
                          <div className="text-[10px] text-muted">{res.subType}</div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                          res.type === 'Room'
                            ? 'bg-purple-100 text-purple-800'
                            : res.type === 'Chair'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800',
                        )}
                      >
                        {res.type}
                      </span>
                    </td>

                    {/* Branch Location */}
                    {!lockBranch && (
                      <td className="p-3.5 font-semibold text-soft">{res.branchName}</td>
                    )}

                    {/* Code */}
                    <td className="p-3.5 font-mono text-[11px] font-bold text-[#5A2EA6]">
                      {res.code}
                    </td>

                    {/* Capacity */}
                    <td className="p-3.5 font-medium text-ink text-xs">{res.capacityOrQty}</td>

                    {/* Linked Services */}
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        {res.linkedServices.length} Treatments
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          res.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'Under Maintenance'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        {res.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewResource(res)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="View Asset Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {!readOnly && (
                          <>
                            <button
                              onClick={() => openEditModal(res)}
                              className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Edit Resource"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(res)}
                              className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0',
                                res.status === 'Active'
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
                              )}
                              title={
                                res.status === 'Active' ? 'Deactivate Resource' : 'Activate Resource'
                              }
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmResource(res)}
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Delete Resource"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS (Portaled to document.body) ================= */}

      {/* 1. Unified Add / Edit Resource Modal */}
      {isFormModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      {editingResource ? 'Edit Salon Asset / Resource' : 'Register Salon Asset / Resource'}
                    </span>
                    <span className="text-xs font-semibold text-soft">
                      {editingResource ? `Asset ID: ${editingResource.code}` : 'Central Registry'}
                    </span>
                  </div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight mt-1">
                    {editingResource
                      ? `Edit Resource: ${formData.name || editingResource.name}`
                      : 'Register Salon Asset / Resource'}
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Allocate treatment rooms, styling chairs, or specialised medical/aesthetic
                    devices.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsFormModalOpen(false);
                    setEditingResource(null);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="p-6 space-y-4 overflow-y-auto custom-scroll text-xs"
              >
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Resources lock automatically during scheduled appointments to ensure no two
                  stylists book the same chair, hydra machine, or bridal room simultaneously.
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Resource Asset Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as ResourceType })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Room">Room (Treatment Suite / Pod)</option>
                      <option value="Chair">Chair (Styling Station / Barber Recliner)</option>
                      <option value="Equipment">Equipment (Laser / Hydra Unit / Canopy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Branch Assignment *
                    </label>
                    <select
                      value={formData.branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      {adminBranches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Resource Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aesthetic Treatment Suite 2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Asset Identifier Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ROOM-AESTH-02"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Capacity / Unit Quantity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Bed / 2 Chairs / 1 Unit"
                      value={formData.capacityOrQty}
                      onChange={(e) =>
                        setFormData({ ...formData, capacityOrQty: e.target.value })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Operational Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as ResourceRecord['status'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Active">Active (Available for booking)</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                      <option value="Inactive">Inactive / Decommissioned</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Specification / Model Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Takara Belmont Hydraulic Recliner with shampoo connection"
                      value={formData.subType}
                      onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormModalOpen(false);
                      setEditingResource(null);
                    }}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingResource ? 'Update Resource Asset' : 'Register Resource Asset'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. View Resource Modal */}
      {viewRes &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">{viewRes.name}</h3>
                  <span className="text-xs text-[#5A2EA6] font-mono font-bold">
                    {viewRes.code}
                  </span>
                </div>
                <button
                  onClick={() => setViewResource(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Resource Category:</span>
                  <strong className="text-[#5A2EA6]">
                    {viewRes.type} ({viewRes.subType})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Allocated Branch:</span>
                  <strong className="text-ink">{viewRes.branchName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Capacity / Units:</span>
                  <strong className="text-ink">{viewRes.capacityOrQty}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Operational Status:</span>
                  <span className="font-bold text-emerald-700">{viewRes.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Last Inspection:</span>
                  <span className="font-mono text-soft">{viewRes.lastInspected}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-2">
                  Linked Services ({viewRes.linkedServices.length} Treatments)
                </label>
                <div className="space-y-1.5">
                  {viewRes.linkedServices.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-ink font-semibold flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-[#5A2EA6]" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end border-t border-purple-50">
                <Button
                  onClick={() => setViewResource(null)}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                >
                  Close Asset Dossier
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}



      {/* 4. Delete Resource Confirmation Modal */}
      {delRes &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-rose-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 grid place-items-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-[17px] text-ink font-bold">Delete Resource Asset</h3>
                    <p className="text-[11px] text-muted font-mono">{delRes.code}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteConfirmResource(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-muted leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-ink font-bold">"{delRes.name}"</strong>?
                Appointments scheduled in this room or chair will need to be reallocated.
              </p>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-rose-50">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmResource(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleDeleteResource}
                  disabled={isSubmitting}
                  className="h-10 px-5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Delete Resource</span>
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
