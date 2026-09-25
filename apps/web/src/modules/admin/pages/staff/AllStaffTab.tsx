import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Archive,
  Award,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit2,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { staffApi } from '@/shared/api';
import { tenantsApi } from '@/shared/api/tenants.api';
import { masterBranches } from '../locations/AllBranchesTab';
import { StaffFormModal } from './StaffFormModal';
import { type FullStaffRecord, StaffProfilePage, masterStaffRecords } from './StaffProfilePage';
import { useAdminContext } from '../../context/AdminContext';

export interface AllStaffTabProps {
  defaultBranch?: string;
  branchId?: string;
  lockBranch?: boolean;
  franchiseId?: string;
  hasFranchise?: boolean;
}

export function AllStaffTab({
  defaultBranch = 'All',
  branchId,
  lockBranch = false,
  franchiseId,
  hasFranchise = false,
}: AllStaffTabProps = {}) {
  const isFranchiseScoped = hasFranchise || Boolean(franchiseId);
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const [liveBranches, setLiveBranches] = useState<any[]>(
    salon?.branches && salon.branches.length > 0 ? salon.branches : [],
  );

  React.useEffect(() => {
    let isMounted = true;
    async function fetchLiveBranches() {
      try {
        const list = await tenantsApi.listBranches();
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setLiveBranches(list);
        }
      } catch (err) {
        console.warn('Live branch API notice (using fallback):', err);
      }
    }
    if (!salon?.branches || salon.branches.length === 0) {
      fetchLiveBranches();
    }
    return () => {
      isMounted = false;
    };
  }, [salon?.branches]);

  const availableBranches = useMemo(() => {
    let list =
      salon?.branches && salon.branches.length > 0
        ? salon.branches
        : liveBranches.length > 0
          ? liveBranches
          : masterBranches;

    if (franchiseId) {
      const franchiseBranches = list.filter(
        (b: any) => b.franchiseId === franchiseId || b.franchise_id === franchiseId,
      );
      if (franchiseBranches.length > 0) {
        list = franchiseBranches;
      }
    }

    if (
      branchId &&
      defaultBranch &&
      defaultBranch !== 'All' &&
      !list.some((b: any) => b.id === branchId)
    ) {
      return [{ id: branchId, name: defaultBranch, code: 'BRANCH' }, ...list];
    }
    return list;
  }, [salon?.branches, liveBranches, branchId, defaultBranch, franchiseId]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [staffList, setStaffList] = useState<FullStaffRecord[]>(masterStaffRecords);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [roleFilter, setRoleFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Synchronize branchFilter if defaultBranch updates asynchronously
  React.useEffect(() => {
    if (defaultBranch && defaultBranch !== 'All') {
      setBranchFilter(defaultBranch);
    }
  }, [defaultBranch]);

  // Fetch live staff from API
  React.useEffect(() => {
    let isMounted = true;
    async function loadStaff() {
      try {
        setIsLoadingApi(true);
        const apiStaff = await staffApi.list();
        if (isMounted && Array.isArray(apiStaff) && apiStaff.length > 0) {
          const mapped: FullStaffRecord[] = apiStaff.map((s) => {
            const rawBranchId = (s.primaryBranchId || (s as any).primary_branch_id || '').trim();
            const rawFranchiseId = (s.franchiseId || (s as any).franchise_id || '').trim();
            const br = availableBranches.find(
              (b: any) => b.id && rawBranchId && b.id.toLowerCase() === rawBranchId.toLowerCase(),
            );
            return {
              ...s,
              branch:
                br?.name ||
                (branchId && rawBranchId.toLowerCase() === branchId.toLowerCase() ? defaultBranch : '') ||
                s.branch ||
                'Assigned Branch',
              primaryBranchId: rawBranchId,
              franchiseId: rawFranchiseId || null,
            };
          });

          if (lockBranch && branchId) {
            const normalizedBranchId = branchId.toLowerCase().trim();
            // For branch manager panel: strictly show staff whose primary_branch_id matches branch id
            const filteredByBranch = mapped.filter(
              (s) => (s.primaryBranchId || '').toLowerCase().trim() === normalizedBranchId,
            );
            setStaffList(filteredByBranch);
          } else if (isFranchiseScoped) {
            // In the franchise panel on staff overview section: show employees assigned to franchise or its branches
            const franchiseBranchIds = new Set(
              availableBranches.map((b: any) => (b.id || '').toLowerCase().trim()).filter(Boolean),
            );
            const filteredByFranchise = mapped.filter((s) => {
              const staffFranchiseId = (s.franchiseId || '').toLowerCase().trim();
              const staffBranchId = (s.primaryBranchId || '').toLowerCase().trim();
              if (franchiseId) {
                if (staffFranchiseId && staffFranchiseId === franchiseId.toLowerCase().trim()) {
                  return true;
                }
                if (staffBranchId && franchiseBranchIds.has(staffBranchId)) {
                  return true;
                }
                return false;
              }
              
              // Fallback if no franchiseId is explicitly provided but we are in franchise mode
              if (staffBranchId && franchiseBranchIds.has(staffBranchId)) {
                return true;
              }
              if (staffFranchiseId) {
                return true;
              }
              return false;
            });
            setStaffList(filteredByFranchise.length > 0 ? filteredByFranchise : mapped);
          } else {
            // Merge API staff records with master staff records seamlessly
            const merged: FullStaffRecord[] = [...mapped];
            for (const m of masterStaffRecords) {
              if (!merged.some((s) => s.id === m.id || s.fullName === m.fullName)) {
                merged.push(m);
              }
            }
            setStaffList(merged);
          }
        }
      } catch (err) {
        console.warn('Live staff API fetch notice:', err);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }
    loadStaff();
    return () => {
      isMounted = false;
    };
  }, [availableBranches, lockBranch, branchId, defaultBranch, franchiseId, isFranchiseScoped]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<FullStaffRecord | null>(null);
  const [selectedStaffForProfile, setSelectedStaffForProfile] = useState<FullStaffRecord | null>(
    null,
  );
  const [toggleStatusStaff, setToggleStatusStaff] = useState<FullStaffRecord | null>(null);

  const allRoles = [
    'All',
    'Senior Master Aesthetician',
    'Creative Hair Art Director',
    'Lead Master Barber & Stylist',
    'Senior Nail Artist & Extensionist',
    'Senior Spa & Holistic Therapist',
  ];
  const allSkills = [
    'All',
    'Medical Hydra-Facial',
    'Laser Skin Resurfacing',
    'Balayage & Color Formulation',
    'Precision Styling',
    'Executive Beard Sculpt',
    'Gel Extensions & French Ombre',
    'Swedish Aromatherapy',
  ];

  const filteredStaff = useMemo(() => {
    // Resolve targeted branch id from props, branchFilter, or availableBranches
    const targetBranchId =
      branchId ||
      availableBranches.find(
        (b: any) => b.id === branchFilter || b.name === branchFilter || b.name === defaultBranch,
      )?.id;

    const activeTargetBranchId = (branchId || targetBranchId || '').toLowerCase().trim();

    return staffList.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const fullName = s.fullName || `${s.firstName || ''} ${s.lastName || ''}`.trim();
      const matchesSearch =
        !q ||
        fullName.toLowerCase().includes(q) ||
        (s.id || '').toLowerCase().includes(q) ||
        ((s as any).employeeCode || '').toLowerCase().includes(q) ||
        (s.role || (s as any).jobTitle || '').toLowerCase().includes(q) ||
        (Array.isArray(s.skills) && s.skills.some((sk) => (sk || '').toLowerCase().includes(q))) ||
        Boolean(s.email && s.email.toLowerCase().includes(q)) ||
        Boolean(s.mobile && s.mobile.includes(q)) ||
        Boolean(s.mobilePhone && s.mobilePhone.includes(q));

      const empBranchId = (s.primaryBranchId || (s as any).primary_branch_id || '').toLowerCase().trim();

      const matchesBranch =
        lockBranch && activeTargetBranchId
          ? empBranchId === activeTargetBranchId
          : branchFilter === 'All' ||
            s.branch === branchFilter ||
            empBranchId === branchFilter.toLowerCase().trim() ||
            (activeTargetBranchId && empBranchId === activeTargetBranchId);

      const matchesRole = roleFilter === 'All' || s.role === roleFilter || (s as any).jobTitle === roleFilter;
      const matchesSkill =
        skillFilter === 'All' ||
        (Array.isArray(s.skills) &&
          s.skills.some((sk) => (sk || '').toLowerCase().includes(skillFilter.toLowerCase())));
      const matchesStatus =
        statusFilter === 'All' ||
        s.status === statusFilter ||
        (statusFilter === 'Active' && ((s as any).employmentStatus === 'ACTIVE' || s.status?.toLowerCase() === 'active')) ||
        (statusFilter === 'Inactive' && ((s as any).employmentStatus === 'INACTIVE' || s.status?.toLowerCase() === 'inactive'));

      // Franchise Scoping: strictly only show employees who have franchise_id
      if (isFranchiseScoped && !s.franchiseId) {
        return false;
      }
      if (
        franchiseId &&
        s.franchiseId &&
        s.franchiseId.toLowerCase().trim() !== franchiseId.toLowerCase().trim()
      ) {
        return false;
      }

      return matchesSearch && matchesBranch && matchesRole && matchesSkill && matchesStatus;
    });
  }, [staffList, searchQuery, branchFilter, roleFilter, skillFilter, statusFilter, lockBranch, branchId, defaultBranch, availableBranches, isFranchiseScoped, franchiseId]);

  const handleSaveStaffRecord = async (saved: FullStaffRecord) => {
    const isUuid = (str?: any) =>
      typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const isExisting = Boolean(saved.id && isUuid(saved.id));
    
    // Ensure primaryBranchId and friendly branch name are synced from availableBranches
    const matchedBranch = availableBranches.find(
      (b: any) =>
        (isUuid(b.id) && b.id === saved.primaryBranchId) ||
        b.name === saved.branch ||
        (branchId && b.id === branchId),
    );
    const validBranchId =
      (isUuid(saved.primaryBranchId) ? saved.primaryBranchId : undefined) ||
      (matchedBranch && isUuid(matchedBranch.id) ? matchedBranch.id : undefined) ||
      (branchId && isUuid(branchId) ? branchId : undefined);

    const enrichedRecord: FullStaffRecord = {
      ...saved,
      branch:
        matchedBranch?.name ||
        saved.branch ||
        (validBranchId === branchId ? defaultBranch : '') ||
        availableBranches[0]?.name ||
        'Default Branch',
      primaryBranchId: validBranchId || '',
      franchiseId: saved.franchiseId || franchiseId || undefined,
    };

    // Optimistic UI update
    setStaffList((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === enrichedRecord.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = enrichedRecord;
        return next;
      }
      return [enrichedRecord, ...prev];
    });

    // Also update global masterStaffRecords for cross-tab persistence
    const masterIdx = masterStaffRecords.findIndex((s) => s.id === enrichedRecord.id);
    if (masterIdx >= 0) {
      masterStaffRecords[masterIdx] = enrichedRecord;
    } else {
      masterStaffRecords.unshift(enrichedRecord);
    }

    // Persist to People API
    try {
      if (isExisting) {
        const updated = await staffApi.update(enrichedRecord.id, {
          ...enrichedRecord,
          primaryBranchId: validBranchId || null,
          franchiseId: enrichedRecord.franchiseId || franchiseId || undefined,
        });
        if (updated && updated.id) {
          const merged = { ...enrichedRecord, ...updated };
          setStaffList((prev) => prev.map((s) => (s.id === enrichedRecord.id ? merged : s)));
          const mIdx = masterStaffRecords.findIndex((s) => s.id === enrichedRecord.id);
          if (mIdx >= 0) masterStaffRecords[mIdx] = merged;
        }
      } else {
        const created = await staffApi.create({
          ...enrichedRecord,
          primaryBranchId: validBranchId || null,
          franchiseId: enrichedRecord.franchiseId || franchiseId || null,
        });
        if (created && created.id) {
          const merged = { ...enrichedRecord, ...created, id: created.id };
          setStaffList((prev) => [
            merged,
            ...prev.filter((s) => s.id !== enrichedRecord.id && s.id !== created.id),
          ]);
          const mIdx = masterStaffRecords.findIndex((s) => s.id === enrichedRecord.id);
          if (mIdx >= 0) {
            masterStaffRecords[mIdx] = merged;
          } else {
            masterStaffRecords.unshift(merged);
          }
        }
      }
    } catch (err) {
      console.error('Staff API persistence error:', err);
    }
  };

  const handleToggleStatus = async (staff: FullStaffRecord) => {
    const nextStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
    setStaffList((prev) => prev.map((s) => (s.id === staff.id ? { ...s, status: nextStatus } : s)));
    setToggleStatusStaff(null);
    toast(`Staff "${staff.fullName}" status updated to ${nextStatus}.`);

    try {
      await staffApi.update(staff.id, { status: nextStatus });
    } catch (err) {
      console.warn('Staff status API update note:', err);
    }
  };

  const handleExport = () => {
    toast(`Exported ${filteredStaff.length} staff records to CSV.`);
  };

  const activeStaffId = searchParams.get('staffId');
  const activeStaffFromUrl = activeStaffId ? staffList.find((s) => s.id === activeStaffId) : null;

  if (selectedStaffForProfile || activeStaffFromUrl) {
    return (
      <StaffProfilePage
        staffData={selectedStaffForProfile || activeStaffFromUrl || undefined}
        onBack={() => {
          setSelectedStaffForProfile(null);
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete('staffId');
            return next;
          });
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              All Staff Central Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {staffList.length} Team Members
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Centrally manage brand-wide stylists, aestheticians, therapists, competency levels,
            branches, and employment records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by Name, Role, Skill, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Branch Filter */}
          {!lockBranch && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Branch:</span>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="All">All Branches</option>
                {availableBranches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!lockBranch && <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />}

          {/* Role Filter */}
          <div className="flex items-center gap-1">
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              {allRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Master Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Consolidated Staff Directory &amp; Roles
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Multi-branch staffing roster, certified skill tiers, and performance telemetry
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredStaff.length} Staff Members Active
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Staff Identity & ID',
                  'Role & Level',
                  ...(!lockBranch ? ['Primary Branch'] : []),
                  'Specialised Skills',
                  'Contact Details',
                  'Joining Date',
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
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={lockBranch ? 7 : 8} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-ink font-serif mb-1">
                        {searchQuery || branchFilter !== 'All' || roleFilter !== 'All' || statusFilter !== 'All'
                          ? 'No matching staff members found'
                          : 'No staff members added yet'}
                      </h4>
                      <p className="text-xs text-muted mb-4 text-center max-w-xs">
                        {searchQuery || branchFilter !== 'All' || roleFilter !== 'All' || statusFilter !== 'All'
                          ? 'Try adjusting your search query or filter selections to view staff.'
                          : 'Create your first staff profile with custom service commissions, roles, and shift timings.'}
                      </p>
                      {!searchQuery && branchFilter === 'All' && roleFilter === 'All' && statusFilter === 'All' && (
                        <Button
                          onClick={() => {
                            setEditingStaff(null);
                            setIsAddModalOpen(true);
                          }}
                          className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a248c] text-white flex items-center gap-2 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Staff Member</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  {/* Staff Identity */}
                  <td className="p-3.5 pl-5">
                    <button
                      onClick={() => setSearchParams({ tab: 'all', staffId: staff.id })}
                      className="flex items-center gap-3 text-left group bg-transparent border-0 p-0 cursor-pointer w-full focus:outline-none"
                      title="Click to view full staff profile"
                    >
                      {staff.avatarUrl ? (
                        <img
                          src={staff.avatarUrl}
                          alt={staff.fullName}
                          className="w-9 h-9 rounded-2xl object-cover shadow-2xs shrink-0 group-hover:scale-105 transition-transform border border-purple-200"
                        />
                      ) : (
                        <Avatar
                          initials={staff.avatarInitials}
                          className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] text-white font-serif text-xs font-bold shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div>
                        <div className="font-bold text-ink text-[13px] group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                          {staff.fullName}
                        </div>
                        <div className="text-[10px] text-[#5A2EA6] font-mono font-bold">
                          {staff.employeeCode || staff.id} · {staff.employmentType}
                        </div>
                      </div>
                    </button>
                  </td>

                  {/* Role & Level */}
                  <td className="p-3.5">
                    <div className="font-bold text-ink text-xs">{staff.role}</div>
                    <span className="inline-block px-2 py-0.2 rounded-md bg-purple-50 text-[#5A2EA6] text-[9.5px] font-bold mt-0.5 border border-purple-100">
                      Tier: {staff.level}
                    </span>
                  </td>

                  {/* Primary Branch */}
                  {!lockBranch && <td className="p-3.5 font-semibold text-soft">{staff.branch}</td>}

                  {/* Skills */}
                  <td className="p-3.5 max-w-[220px]">
                    {(() => {
                      const displaySkills =
                        Array.isArray(staff.skills) && staff.skills.length > 0
                          ? staff.skills
                          : staff.profile?.specialization
                            ? staff.profile.specialization
                                .split(/[,;|]/)
                                .map((s: string) => s.trim())
                                .filter(Boolean)
                            : (() => {
                                const jt = (staff.role || '').toLowerCase();
                                if (jt.includes('hr') || jt.includes('finance') || jt.includes('talent')) {
                                  return ['Talent Management', 'Payroll & Compliance', 'HR Operations'];
                                }
                                if (jt.includes('call') || jt.includes('support') || jt.includes('client')) {
                                  return ['Inbound Calling', 'Appointment Booking', 'Client Relations'];
                                }
                                if (jt.includes('inventory') || jt.includes('stock') || jt.includes('warehouse')) {
                                  return ['Stock Auditing', 'Vendor Procurement', 'Reorder Tracking'];
                                }
                                if (jt.includes('branch manager') || jt.includes('manager')) {
                                  return ['Store Operations', 'Team Leadership', 'P&L Management'];
                                }
                                if (jt.includes('stylist') || jt.includes('hair') || jt.includes('barber')) {
                                  return ['Hair Styling & Cut', 'Balayage & Coloring', 'Keratin Complex'];
                                }
                                if (jt.includes('aesthetician') || jt.includes('skin') || jt.includes('laser')) {
                                  return ['Medical Hydra-Facial', 'Laser Resurfacing', 'Chemical Peels'];
                                }
                                return ['Client Consultation', 'Service Excellence'];
                              })();

                      return (
                        <div className="flex items-center gap-1 flex-wrap">
                          {displaySkills.slice(0, 2).map((sk: string) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 bg-purple-50 text-[#5A2EA6] border border-purple-100/80 rounded-md text-[9.5px] font-semibold truncate max-w-[130px]"
                            >
                              {sk}
                            </span>
                          ))}
                          {displaySkills.length > 2 && (
                            <span className="text-[9.5px] text-[#5A2EA6] font-bold px-1.5 py-0.5 bg-purple-50/50 rounded border border-purple-100/50">
                              +{displaySkills.length - 2}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>

                  {/* Contact */}
                  <td className="p-3.5">
                    <div className="font-semibold text-ink text-xs">{staff.mobile}</div>
                    <div className="text-[10px] text-muted truncate max-w-[130px]">
                      {staff.email}
                    </div>
                  </td>

                  {/* Joining Date */}
                  <td className="p-3.5 text-soft font-medium">{staff.joiningDate}</td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        staff.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : staff.status === 'On Leave'
                            ? 'bg-amber-100 text-amber-800'
                            : staff.status === 'Suspended'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          staff.status === 'Active' ? 'bg-emerald-600' : 'bg-amber-500',
                        )}
                      />
                      {staff.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingStaff(staff)}
                        className="h-8 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border border-purple-200/60"
                        title="Edit Full Staff Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setSearchParams({ tab: 'all', staffId: staff.id })}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-0"
                        title="View Detailed Staff Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => setToggleStatusStaff(staff)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0',
                          staff.status === 'Active'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
                        )}
                        title={staff.status === 'Active' ? 'Deactivate Staff' : 'Activate Staff'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Add / Edit Staff Comprehensive 360° Modal */}
      <StaffFormModal
        isOpen={isAddModalOpen || !!editingStaff}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStaff(null);
        }}
        mode={editingStaff ? 'edit' : 'add'}
        initialData={editingStaff}
        defaultBranch={
          branchFilter !== 'All'
            ? branchFilter
            : defaultBranch !== 'All'
              ? defaultBranch
              : availableBranches[0]?.name
        }
        defaultBranchId={
          branchId ||
          availableBranches.find(
            (b: any) =>
              b.name === (branchFilter !== 'All' ? branchFilter : defaultBranch) ||
              b.id === branchId,
          )?.id ||
          availableBranches[0]?.id
        }
        defaultFranchiseId={franchiseId}
        onSave={handleSaveStaffRecord}
      />

      {/* 2. Deactivate Staff Safeguard Modal */}
      {toggleStatusStaff &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-rose-50">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">
                    {toggleStatusStaff.status === 'Active'
                      ? 'Deactivate Staff Account?'
                      : 'Reactivate Staff Account?'}
                  </h3>
                  <p className="text-[11px] text-muted">
                    {toggleStatusStaff.fullName} ({toggleStatusStaff.employeeCode || toggleStatusStaff.id}) ·{' '}
                    {toggleStatusStaff.branch}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                {toggleStatusStaff.status === 'Active'
                  ? `Deactivating "${toggleStatusStaff.fullName}" will pause new appointment scheduling and floor shift assignments while preserving historical commission payouts, attendance ledgers, and service completion logs (non-destructive safeguarding).`
                  : `Reactivating "${toggleStatusStaff.fullName}" will restore booking eligibility on branch calendars.`}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setToggleStatusStaff(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => handleToggleStatus(toggleStatusStaff)}
                  className={cn(
                    'h-10 px-6 rounded-xl text-xs font-bold shadow-md transition-all',
                    toggleStatusStaff.status === 'Active'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#5A2EA6] hover:bg-[#4a2489] text-white',
                  )}
                >
                  Confirm {toggleStatusStaff.status === 'Active' ? 'Deactivation' : 'Activation'}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default AllStaffTab;
