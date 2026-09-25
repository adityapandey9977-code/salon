import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSuperAdminStore, SYSTEM_MODULES, getDefaultModulePermissions, ModuleCrudPermission, isSystemProtectedRole } from '../context/SuperAdminContext';
import { useToast, cn } from '@salon-spa-saas/ui';
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Search,
  CheckCheck,
  X,
  Eye,
  Edit3,
  RefreshCw,
  Trash2,
  Info,
  SlidersHorizontal,
  Lock,
} from 'lucide-react';

type ModuleCategory = 'All' | 'Dashboard' | 'Tenant Management' | 'User Management' | 'Operations' | 'System';

export function CreateCustomRolePage() {
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId?: string }>();
  const { toast } = useToast();
  const { roles, addCustomRole, updateCustomRole } = useSuperAdminStore();

  const existingRole = useMemo(() => {
    if (!roleId) return null;
    const cleanId = decodeURIComponent(roleId).trim().toLowerCase();
    return (
      roles.find(
        (r) =>
          r.id.toLowerCase() === cleanId ||
          r.role.toLowerCase() === cleanId ||
          r.role.toLowerCase().replace(/\s+/g, '-') === cleanId ||
          r.role.toLowerCase().replace(/\s+/g, '_') === cleanId,
      ) || null
    );
  }, [roleId, roles]);

  const isProtected = Boolean(existingRole && isSystemProtectedRole(existingRole));

  // Form State
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('Platform Wide');
  const [activeCategory, setActiveCategory] = useState<ModuleCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Granular Permissions State
  const [modulePermissions, setModulePermissions] = useState<Record<string, ModuleCrudPermission>>(
    () => getDefaultModulePermissions('none'),
  );

  // Synchronize state whenever existingRole is loaded or resolved
  useEffect(() => {
    if (existingRole) {
      setRoleName(existingRole.role || '');
      setDescription(existingRole.description || '');
      setScope(existingRole.scope || 'Platform Wide');
      if (existingRole.modulePermissions) {
        const defaults = getDefaultModulePermissions('none');
        setModulePermissions({ ...defaults, ...existingRole.modulePermissions });
      } else if (existingRole.permissions) {
        const mapped: Record<string, ModuleCrudPermission> = getDefaultModulePermissions('none');
        if (existingRole.permissions.tenants) {
          mapped.tenants = { view: true, edit: true, update: true, delete: false };
          mapped.supportTickets = { view: true, edit: true, update: true, delete: false };
          mapped.announcements = { view: true, edit: false, update: false, delete: false };
          mapped.notifications = { view: true, edit: false, update: false, delete: false };
        }
        if (existingRole.permissions.billing) {
          mapped.billingPayments = { view: true, edit: true, update: true, delete: true };
          mapped.subscriptionPlans = { view: true, edit: true, update: true, delete: false };
        }
        if (existingRole.permissions.usersRbac) {
          mapped.users = { view: true, edit: true, update: true, delete: false };
          mapped.rolesPermissions = { view: true, edit: true, update: true, delete: false };
          mapped.settings = { view: true, edit: true, update: true, delete: false };
        }
        if (existingRole.permissions.auditLogs) {
          mapped.auditLogs = { view: true, edit: false, update: false, delete: false };
        }
        if (existingRole.permissions.featureFlags) {
          mapped.featureFlags = { view: true, edit: true, update: true, delete: false };
          mapped.integrations = { view: true, edit: true, update: true, delete: false };
          mapped.apiKeys = { view: true, edit: true, update: true, delete: false };
        }
        setModulePermissions(mapped);
      }
    }
  }, [existingRole]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPossible = SYSTEM_MODULES.length * 4;
    let grantedCount = 0;
    let viewCount = 0;
    let editCount = 0;
    let updateCount = 0;
    let deleteCount = 0;

    SYSTEM_MODULES.forEach((mod) => {
      const p = modulePermissions[mod.id] || { view: false, edit: false, update: false, delete: false };
      if (p.view) { grantedCount++; viewCount++; }
      if (p.edit) { grantedCount++; editCount++; }
      if (p.update) { grantedCount++; updateCount++; }
      if (p.delete) { grantedCount++; deleteCount++; }
    });

    const percentage = Math.round((grantedCount / totalPossible) * 100);
    return { grantedCount, totalPossible, viewCount, editCount, updateCount, deleteCount, percentage };
  }, [modulePermissions]);

  // Filter modules
  const filteredModules = useMemo(() => {
    return SYSTEM_MODULES.filter((mod) => {
      const matchesCategory = activeCategory === 'All' || mod.category === activeCategory;
      const matchesSearch =
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handlers for individual cell toggle
  // Toggle single cell
  const handleToggleCell = (moduleId: string, action: keyof ModuleCrudPermission) => {
    if (isProtected) return;
    setModulePermissions((prev) => {
      const current = prev[moduleId] || { view: false, edit: false, update: false, delete: false };
      const nextValue = !current[action];

      // Smart UX rule: if enabling edit, update, or delete, automatically ensure view is enabled
      const updated: ModuleCrudPermission = {
        ...current,
        [action]: nextValue,
      };

      if (nextValue && (action === 'edit' || action === 'update' || action === 'delete')) {
        updated.view = true;
      }

      // If view is disabled, disable write actions as well
      if (!nextValue && action === 'view') {
        updated.edit = false;
        updated.update = false;
        updated.delete = false;
      }

      return {
        ...prev,
        [moduleId]: updated,
      };
    });
  };

  // Row actions
  const handleToggleRowAll = (moduleId: string) => {
    if (isProtected) return;
    setModulePermissions((prev) => {
      const current = prev[moduleId] || { view: false, edit: false, update: false, delete: false };
      const isAllChecked = current.view && current.edit && current.update && current.delete;
      const targetState = !isAllChecked;

      return {
        ...prev,
        [moduleId]: {
          view: targetState,
          edit: targetState,
          update: targetState,
          delete: targetState,
        },
      };
    });
  };

  // Bulk presets
  const handleApplyPreset = (preset: 'all' | 'none' | 'viewOnly') => {
    if (isProtected) return;
    setModulePermissions(getDefaultModulePermissions(preset));
    if (preset === 'all') {
      toast('Granted complete CRUD permissions across all system modules.');
    } else if (preset === 'none') {
      toast('Revoked all module permissions.');
    } else {
      toast('Configured read-only (View) permissions for all modules.');
    }
  };

  // Column bulk toggle (for visible modules)
  const handleToggleColumn = (action: keyof ModuleCrudPermission) => {
    if (isProtected) return;
    setModulePermissions((prev) => {
      const filtered = filteredModules;
      const allActive = filtered.every((m) => prev[m.id]?.[action]);
      const nextState = !allActive;

      const next = { ...prev };
      filtered.forEach((m) => {
        const current = next[m.id] || { view: false, edit: false, update: false, delete: false };
        const updated = { ...current, [action]: nextState };
        if (nextState && (action === 'edit' || action === 'update' || action === 'delete')) {
          updated.view = true;
        }
        if (!nextState && action === 'view') {
          updated.edit = false;
          updated.update = false;
          updated.delete = false;
        }
        next[m.id] = updated;
      });
      return next;
    });
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isProtected) {
      toast('Super Administrator is a protected system default role and cannot be modified.');
      navigate('/roles-permissions');
      return;
    }

    if (!roleName.trim()) {
      toast('Please enter a role name.');
      return;
    }

    if (!description.trim()) {
      toast('Please provide a brief role scope description.');
      return;
    }

    const targetRole = existingRole;
    const isEditMode = Boolean(targetRole || roleId);
    const targetId = targetRole?.id || roleId;

    if (isEditMode && targetId) {
      updateCustomRole(targetId, {
        role: roleName.trim(),
        description: description.trim(),
        scope,
        modulePermissions,
        permissions: {
          tenants: modulePermissions.tenants?.view || false,
          billing: modulePermissions.billingPayments?.view || false,
          auditLogs: modulePermissions.auditLogs?.view || false,
          featureFlags: modulePermissions.featureFlags?.view || false,
          usersRbac:
            modulePermissions.users?.view || modulePermissions.rolesPermissions?.view || false,
        },
      });
      toast(`Custom role "${roleName}" has been successfully updated.`);
    } else {
      addCustomRole({
        role: roleName.trim(),
        description: description.trim(),
        scope,
        modulePermissions,
        permissions: {
          tenants: modulePermissions.tenants?.view || false,
          billing: modulePermissions.billingPayments?.view || false,
          auditLogs: modulePermissions.auditLogs?.view || false,
          featureFlags: modulePermissions.featureFlags?.view || false,
          usersRbac:
            modulePermissions.users?.view || modulePermissions.rolesPermissions?.view || false,
        },
      });
      toast(`New custom role "${roleName}" created successfully!`);
    }

    navigate('/roles-permissions');
  };

  const categories: ModuleCategory[] = [
    'All',
    'Dashboard',
    'Tenant Management',
    'User Management',
    'Operations',
    'System',
  ];

  return (
    <div className="animate-in fade-in duration-300 max-w-7xl mx-auto space-y-6 pb-6">
      {/* ── Top Header ── */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#ECE6F8] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/roles-permissions')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ECE6F8] bg-white shadow-xs transition-all duration-200 hover:border-[#5A2EA6]/30 hover:bg-[#5A2EA6]/5 group cursor-pointer"
              title="Return to Roles & Permissions"
            >
              <ArrowLeft className="h-4 w-4 text-[#6d5b73] transition-colors group-hover:text-[#5A2EA6]" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-[22px] font-semibold text-ink leading-tight">
                  {existingRole ? 'Edit Custom Role Scope' : 'Create Custom Role'}
                </h1>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                  {existingRole ? 'Modify RBAC Definition' : 'New RBAC Definition'}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-muted">
                Define access boundary, operator scope, and granular CRUD permissions for all system modules.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <div className="flex items-center gap-2 rounded-full border border-[#5A2EA6]/15 bg-white px-3 py-1 shadow-xs">
              <div className="h-2 w-2 rounded-full bg-[#5A2EA6] animate-pulse" />
              <span className="text-[11px] font-semibold text-ink">
                Privileges: <strong className="text-[#5A2EA6]">{stats.grantedCount}</strong>/{stats.totalPossible}
              </span>
              <span className="text-[10px] text-muted font-bold ml-1">({stats.percentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Body ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ───────── Hero Identity Card ───────── */}
        <div className="relative overflow-hidden rounded-[24px] border border-[#EFE7FF] bg-gradient-to-r from-[#F7F2FF] via-[#EFE6FF] to-[#F9F7FF] p-5 md:p-6 shadow-xs">
          <div className="absolute -top-20 -left-20 h-44 w-44 rounded-full bg-[#A970FF]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-10 h-44 w-44 rounded-full bg-[#7B4DFF]/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] shadow-md shrink-0">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#8A6AB8]">
                  Access Control Governance
                </span>
                <h2 className="mt-0.5 font-serif text-[18px] font-bold text-[#2E1F46]">
                  Role Definition &amp; Boundary Scoping
                </h2>
                <p className="mt-1 text-[12px] text-[#6F6286] max-w-2xl leading-relaxed">
                  Provide a distinct title, identify the authorization boundary, and set explicit View, Edit, Update, and Delete capabilities.
                </p>
              </div>
            </div>

            {/* Live Status Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-white/75 backdrop-blur-xs border border-[#5A2EA6]/15 rounded-2xl p-3 shadow-xs shrink-0">
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-muted tracking-wider">Configured Access</span>
                <span className="text-[13px] font-bold text-ink">
                  {stats.percentage >= 90 ? 'Full System Authority' : stats.percentage >= 50 ? 'Extended Operational' : stats.percentage > 0 ? 'Restricted Operational' : 'Zero Privileges'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#5A2EA6]/10 flex items-center justify-center text-[#5A2EA6] font-bold text-xs">
                {stats.percentage}%
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Protected System Role Banner ───────── */}
        {isProtected && (
          <div className="rounded-[20px] border border-amber-200 bg-amber-50/90 p-4 md:p-5 flex items-start gap-3.5 text-amber-950 shadow-xs animate-in fade-in duration-200">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-tight text-amber-900">Protected System Default Role</h4>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                <strong>Super Administrator</strong> is the core default platform role with permanent full access across all 16 system modules (100% platform coverage). It cannot be modified, renamed, or deleted.
              </p>
            </div>
          </div>
        )}

        {/* ───────── Section 1: Role Information Fields ───────── */}
        <div className="bg-white rounded-[22px] border border-[#ECE6F8] p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#ECE6F8]">
            <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/8 flex items-center justify-center text-[#5A2EA6]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-[15px] font-bold text-ink tracking-tight">Role Identity &amp; Scope Boundary</h3>
              <p className="text-muted text-[11px]">Primary identifier and authorization boundary for assigned users</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Role Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A2EA6] mb-1.5">
                Role Group Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isProtected}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Regional Support Manager, Platform Security Specialist"
                className={cn(
                  'w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl p-3 text-[13px] font-semibold text-ink outline-none focus:border-[#5A2EA6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] placeholder:text-muted transition-all duration-200',
                  isProtected && 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed',
                )}
              />
              <span className="text-[10.5px] text-muted mt-1 block">
                Official role title as displayed across user management tables.
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A2EA6] mb-1.5">
              Role Description &amp; Operational Boundaries <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              disabled={isProtected}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the operational responsibilities, escalation rights, and data access level for operators assigned to this role group..."
              className={cn(
                'w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl p-3 text-[13px] font-medium text-ink outline-none focus:border-[#5A2EA6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(90,46,166,0.08)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] placeholder:text-muted transition-all duration-200',
                isProtected && 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed',
              )}
            />
          </div>
        </div>

        {/* ───────── Section 2: Granular CRUD Permissions Matrix ───────── */}
        <div className="bg-white rounded-[24px] border border-[#ECE6F8] shadow-xs overflow-hidden">
          {/* Header & Quick Action Presets */}
          <div className="p-5 md:p-6 border-b border-[#ECE6F8] bg-gradient-to-b from-[#FAF8FE] to-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/8 flex items-center justify-center text-[#5A2EA6]">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-[16px] font-bold text-ink tracking-tight">
                      Module Permissions Matrix (View, Edit, Update, Delete)
                    </h3>
                    <p className="text-muted text-[11px]">
                      Grant specific CRUD authorization flags individually for each platform and domain module.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bulk Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('all')}
                  className="px-3 py-1.5 rounded-xl text-[11.5px] font-bold text-[#5A2EA6] bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 border border-[#5A2EA6]/20 transition-all cursor-pointer flex items-center gap-1.5"
                  title="Select all 4 permissions for every module"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  <span>Grant All</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('viewOnly')}
                  className="px-3 py-1.5 rounded-xl text-[11.5px] font-bold text-[#6d5b73] bg-[#F8F5FF] hover:bg-[#ECE6F8] border border-[#ECE6F8] transition-all cursor-pointer flex items-center gap-1.5"
                  title="Enable View only across all modules"
                >
                  <Eye className="w-3.5 h-3.5 text-[#6d5b73]" />
                  <span>View Only</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('none')}
                  className="px-3 py-1.5 rounded-xl text-[11.5px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5"
                  title="Clear all permissions"
                >
                  <X className="w-3.5 h-3.5 text-rose-600" />
                  <span>Revoke All</span>
                </button>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="mt-4 pt-4 border-t border-[#ECE6F8] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                      activeCategory === cat
                        ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                        : 'bg-white text-soft border-[#ECE6F8] hover:bg-[#F8F5FF] hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search modules..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#ECE6F8] bg-white text-xs font-medium text-ink outline-none focus:border-[#5A2EA6] focus:shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  <th className="p-4 pl-6 font-bold text-[10.5px] tracking-wider uppercase min-w-[280px]">
                    System Module &amp; Scope
                  </th>
                  <th className="p-4 font-bold text-[10.5px] tracking-wider uppercase min-w-[140px]">
                    Category
                  </th>

                  {/* View Column with Bulk Header Click */}
                  <th className="p-4 text-center min-w-[110px]">
                    <button
                      type="button"
                      onClick={() => handleToggleColumn('view')}
                      className="inline-flex items-center gap-1 text-[10.5px] font-bold tracking-wider uppercase text-[#5A2EA6] hover:underline cursor-pointer group"
                      title="Toggle View permission for all visible modules"
                    >
                      <Eye className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>View</span>
                    </button>
                  </th>

                  {/* Edit Column with Bulk Header Click */}
                  <th className="p-4 text-center min-w-[110px]">
                    <button
                      type="button"
                      onClick={() => handleToggleColumn('edit')}
                      className="inline-flex items-center gap-1 text-[10.5px] font-bold tracking-wider uppercase text-[#5A2EA6] hover:underline cursor-pointer group"
                      title="Toggle Edit permission for all visible modules"
                    >
                      <Edit3 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>Edit</span>
                    </button>
                  </th>

                  {/* Update Column with Bulk Header Click */}
                  <th className="p-4 text-center min-w-[110px]">
                    <button
                      type="button"
                      onClick={() => handleToggleColumn('update')}
                      className="inline-flex items-center gap-1 text-[10.5px] font-bold tracking-wider uppercase text-[#5A2EA6] hover:underline cursor-pointer group"
                      title="Toggle Update permission for all visible modules"
                    >
                      <RefreshCw className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>Update</span>
                    </button>
                  </th>

                  {/* Delete Column with Bulk Header Click */}
                  <th className="p-4 text-center min-w-[110px]">
                    <button
                      type="button"
                      onClick={() => handleToggleColumn('delete')}
                      className="inline-flex items-center gap-1 text-[10.5px] font-bold tracking-wider uppercase text-rose-600 hover:underline cursor-pointer group"
                      title="Toggle Delete permission for all visible modules"
                    >
                      <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>Delete</span>
                    </button>
                  </th>

                  {/* Row Quick Action */}
                  <th className="p-4 pr-6 text-right font-bold text-[10.5px] tracking-wider uppercase text-[#5A2EA6] min-w-[120px]">
                    Row Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#ECE6F8] text-[#6d5b73]">
                {filteredModules.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-6 h-6 text-muted/50" />
                        <span className="text-[13px] font-semibold text-ink">No modules found matching filter</span>
                        <p className="text-[11px]">Try adjusting your search query or selecting "All" categories.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredModules.map((mod) => {
                    const perm = modulePermissions[mod.id] || { view: false, edit: false, update: false, delete: false };
                    const isRowFullyChecked = perm.view && perm.edit && perm.update && perm.delete;
                    const hasAnyChecked = perm.view || perm.edit || perm.update || perm.delete;

                    return (
                      <tr
                        key={mod.id}
                        className={`transition-colors duration-150 ${
                          isRowFullyChecked
                            ? 'bg-[#5A2EA6]/4 hover:bg-[#5A2EA6]/7'
                            : hasAnyChecked
                            ? 'bg-[#FCFAFF] hover:bg-[#F8F5FF]'
                            : 'hover:bg-[#FAF8FE]'
                        }`}
                      >
                        {/* Module Name & Summary */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#5A2EA6]/40 shrink-0" />
                            <div>
                              <strong className="block font-sans text-[13px] font-bold text-ink leading-tight">
                                {mod.name}
                              </strong>
                              <span className="text-[11px] text-muted block mt-0.5 max-w-sm">
                                {mod.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="p-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-[#ECE6F8] text-[#5A2EA6]">
                            {mod.category}
                          </span>
                        </td>

                        {/* View Checkbox */}
                        <td className="p-4 text-center">
                          <label
                            className="inline-flex items-center justify-center p-2 rounded-xl cursor-pointer hover:bg-white transition-all select-none"
                            title={`Toggle View for ${mod.name}`}
                          >
                            <input
                              type="checkbox"
                              checked={perm.view}
                              onChange={() => handleToggleCell(mod.id, 'view')}
                              className="w-4 h-4 rounded text-[#5A2EA6] accent-[#5A2EA6] cursor-pointer"
                            />
                          </label>
                        </td>

                        {/* Edit Checkbox */}
                        <td className="p-4 text-center">
                          <label
                            className="inline-flex items-center justify-center p-2 rounded-xl cursor-pointer hover:bg-white transition-all select-none"
                            title={`Toggle Edit for ${mod.name}`}
                          >
                            <input
                              type="checkbox"
                              checked={perm.edit}
                              onChange={() => handleToggleCell(mod.id, 'edit')}
                              className="w-4 h-4 rounded text-[#5A2EA6] accent-[#5A2EA6] cursor-pointer"
                            />
                          </label>
                        </td>

                        {/* Update Checkbox */}
                        <td className="p-4 text-center">
                          <label
                            className="inline-flex items-center justify-center p-2 rounded-xl cursor-pointer hover:bg-white transition-all select-none"
                            title={`Toggle Update for ${mod.name}`}
                          >
                            <input
                              type="checkbox"
                              checked={perm.update}
                              onChange={() => handleToggleCell(mod.id, 'update')}
                              className="w-4 h-4 rounded text-[#5A2EA6] accent-[#5A2EA6] cursor-pointer"
                            />
                          </label>
                        </td>

                        {/* Delete Checkbox */}
                        <td className="p-4 text-center">
                          <label
                            className="inline-flex items-center justify-center p-2 rounded-xl cursor-pointer hover:bg-white transition-all select-none"
                            title={`Toggle Delete for ${mod.name}`}
                          >
                            <input
                              type="checkbox"
                              checked={perm.delete}
                              onChange={() => handleToggleCell(mod.id, 'delete')}
                              className="w-4 h-4 rounded text-rose-600 accent-rose-600 cursor-pointer"
                            />
                          </label>
                        </td>

                        {/* Row Quick Action */}
                        <td className="p-4 pr-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleRowAll(mod.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                              isRowFullyChecked
                                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                                : 'bg-white text-[#5A2EA6] border-[#5A2EA6]/20 hover:bg-[#5A2EA6]/10'
                            }`}
                          >
                            {isRowFullyChecked ? 'Clear All' : 'Select All'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Matrix Footer Note */}
          <div className="p-4 bg-[#FAF8FE] border-t border-[#ECE6F8] flex items-center justify-between text-[11.5px] text-muted">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>
                Enabling write permissions (<strong>Edit</strong>, <strong>Update</strong>, or <strong>Delete</strong>) automatically activates read (<strong>View</strong>) access.
              </span>
            </div>
            <span className="font-semibold text-ink hidden sm:inline">
              Showing {filteredModules.length} of {SYSTEM_MODULES.length} system modules
            </span>
          </div>
        </div>

        {/* ── Sticky Bottom Action Bar ── */}
        <div className="sticky bottom-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-[#ECE6F8] p-4 shadow-[0_8px_30px_rgba(90,46,166,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-ink">
              {roleName.trim() ? `Configuring "${roleName.trim()}"` : 'New Custom Role draft'}
            </span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline text-soft font-semibold">
              {stats.grantedCount} permissions granted ({stats.percentage}% platform coverage)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/roles-permissions')}
              className="px-5 py-2.5 rounded-xl text-[12.5px] font-bold text-soft border border-[#ECE6F8] bg-white hover:bg-[#F8F5FF] hover:text-ink cursor-pointer transition-all duration-200"
            >
              {isProtected ? 'Back to Roles' : 'Cancel'}
            </button>
            {isProtected ? (
              <div className="px-5 py-2.5 rounded-xl text-[12.5px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300 flex items-center gap-2 shadow-2xs">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Protected System Role (Immutable)</span>
              </div>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-[12.5px] font-bold text-white bg-gradient-to-r from-[#7B4DFF] to-[#A970FF] hover:from-[#6B3DE6] hover:to-[#9560EE] shadow-[0_4px_14px_rgba(123,77,255,0.35)] hover:shadow-[0_6px_20px_rgba(123,77,255,0.45)] cursor-pointer transition-all duration-200 flex items-center gap-2 border-0 hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{existingRole ? 'Save Role Scope Changes' : 'Create Custom Role'}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
