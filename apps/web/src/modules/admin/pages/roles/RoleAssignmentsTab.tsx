import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit2,
  Eye,
  Filter,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AssignmentDossierModal, type UserRoleAssignment } from './AssignmentDossierModal';
import { usersApi } from '@/shared/api/users.api';
import { rolesApi } from '@/shared/api/roles.api';
import { filterSalonRoles, isPlatformRole } from '@/shared/utils/roleUtils';

interface RoleAssignmentsTabProps {
  initialRoleId?: string;
  onNavigateToMatrix?: (roleId: string) => void;
}

export function RoleAssignmentsTab({ initialRoleId, onNavigateToMatrix }: RoleAssignmentsTabProps) {
  const [assignments, setAssignments] = useState<UserRoleAssignment[]>([]);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(initialRoleId || 'all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [selectedAssignmentForDossier, setSelectedAssignmentForDossier] =
    useState<UserRoleAssignment | null>(null);
  const [assignmentToChangeRole, setAssignmentToChangeRole] = useState<UserRoleAssignment | null>(
    null,
  );
  const [newSelectedRole, setNewSelectedRole] = useState('');
  const [assignmentToRemove, setAssignmentToRemove] = useState<UserRoleAssignment | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        usersApi.list({ userType: 'TENANT', limit: 100 }),
        rolesApi.list({ scope: 'TENANT', showOnFrontend: true, panel: 'ADMIN' }),
      ]);
      if (rolesRes && Array.isArray(rolesRes) && rolesRes.length > 0) {
        const salonRoles = filterSalonRoles(rolesRes);
        setAvailableRoles(salonRoles);
        if (salonRoles.length > 0 && !newSelectedRole) {
          setNewSelectedRole(salonRoles[0].name);
        }
      }
      if (usersRes?.users && Array.isArray(usersRes.users)) {
        // Exclude any platform operators that might be returned
        const salonUsers = usersRes.users.filter(
          (u: any) => u.userType !== 'PLATFORM' && !isPlatformRole(u.role),
        );
        const mapped: UserRoleAssignment[] = salonUsers.map((u: any) => {
          const primaryRole = u.roles && u.roles.length > 0 ? u.roles[0] : null;
          return {
            id: u.id,
            userName: u.fullName || u.email,
            empId: `EMP-${u.id.substring(0, 6).toUpperCase()}`,
            email: u.email,
            phone: u.mobilePhone || 'N/A',
            roleName: primaryRole?.name || u.role || 'Staff Member',
            roleId: primaryRole?.id || '',
            branch: u.salonName || 'All Outlets',
            scope: primaryRole?.isSystem ? 'Brand-wide' : 'Single Branch',
            status: u.status === 'SUSPENDED' || u.status === 'LOCKED' ? 'Inactive' : 'Active',
            assignedDate: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent',
            assignedBy: 'Administrator',
          };
        });
        setAssignments(mapped);
      } else {
        setAssignments([]);
      }
    } catch (err: any) {
      console.warn('[RoleAssignmentsTab] Load data warning:', err);
      setAssignments([]);
      showToast(err?.response?.data?.message || 'Failed to load staff assignments from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (assignmentToChangeRole || assignmentToRemove) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [assignmentToChangeRole, assignmentToRemove]);

  const handleChangeRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentToChangeRole) return;

    const targetRole = availableRoles.find(
      (r) => r.name === newSelectedRole || r.id === newSelectedRole,
    );
    const targetRoleId = targetRole ? targetRole.id : newSelectedRole;
    const targetRoleName = targetRole ? targetRole.name : newSelectedRole;

    try {
      if (targetRole?.id) {
        await usersApi.assignRoles(assignmentToChangeRole.id, [targetRole.id]);
      }
      showToast(`Role for ${assignmentToChangeRole.userName} changed to ${targetRoleName}.`);
      await loadData();
    } catch (err: any) {
      console.warn('[RoleAssignmentsTab] Assign role warning:', err);
      showToast(err?.response?.data?.message || `Failed to update role for ${assignmentToChangeRole.userName}`);
    }

    setAssignmentToChangeRole(null);
  };

  const handleConfirmRemoveAssignment = async () => {
    if (!assignmentToRemove) return;
    try {
      if (assignmentToRemove.roleId) {
        await usersApi.removeRole(assignmentToRemove.id, assignmentToRemove.roleId);
      }
      showToast(`Role assignment for ${assignmentToRemove.userName} removed.`);
      await loadData();
    } catch (err: any) {
      console.warn('[RoleAssignmentsTab] Remove role warning:', err);
      showToast(err?.response?.data?.message || `Failed to remove assignment for ${assignmentToRemove.userName}`);
    }
    setAssignmentToRemove(null);
  };

  const filteredAssignments = assignments.filter((a) => {
    if (
      roleFilter !== 'all' &&
      !a.roleName.toLowerCase().includes(roleFilter.toLowerCase()) &&
      a.roleId !== roleFilter
    )
      return false;
    if (branchFilter !== 'all' && !a.branch.toLowerCase().includes(branchFilter.toLowerCase()))
      return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (searchTerm) {
      const match = `${a.userName} ${a.empId} ${a.email} ${a.roleName} ${a.branch}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Assignment Details Dossier Modal */}
      <AssignmentDossierModal
        isOpen={!!selectedAssignmentForDossier}
        onClose={() => setSelectedAssignmentForDossier(null)}
        assignment={selectedAssignmentForDossier}
        onChangeRole={(asg) => setAssignmentToChangeRole(asg)}
      />

      {/* Change Role Modal */}
      {assignmentToChangeRole &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setAssignmentToChangeRole(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-serif font-bold text-ink text-lg">Change Assigned Role</h3>
                  <p className="text-xs text-muted">
                    Update access role for {assignmentToChangeRole.userName}
                  </p>
                </div>
                <button
                  onClick={() => setAssignmentToChangeRole(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangeRoleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-soft font-bold block mb-1">Select New System Role</label>
                  <select
                    value={newSelectedRole}
                    onChange={(e) => setNewSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink outline-none cursor-pointer"
                  >
                    {availableRoles.length > 0 ? (
                      availableRoles.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name} {r.isSystem ? '(System Role)' : '(Custom Role)'}
                        </option>
                      ))
                    ) : (
                      <option value="">No roles available</option>
                    )}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-900">
                  <span>
                    Modifying this role immediately applies new module permissions on next login.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setAssignmentToChangeRole(null)}
                    className="h-[34px] px-3.5 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-[34px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    Update Role
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Remove Role Assignment Confirmation Modal */}
      {assignmentToRemove &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setAssignmentToRemove(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 grid place-items-center shrink-0 border border-rose-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">
                    Remove Role Assignment
                  </h3>
                  <span className="text-[10px] text-muted font-semibold">
                    Revoke System Privileges
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Are you sure you want to revoke the <strong>{assignmentToRemove.roleName}</strong>{' '}
                role from <strong>{assignmentToRemove.userName}</strong> ({assignmentToRemove.empId}
                )? The user will lose dashboard access.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setAssignmentToRemove(null)}
                  className="h-[34px] px-3.5 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRemoveAssignment}
                  className="h-[34px] px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Revoke Role
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Header & Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl">
            <Search className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <input
              type="text"
              placeholder="Search by staff name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs font-semibold text-ink outline-none placeholder:text-muted w-56"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Assigned Roles</option>
            {availableRoles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active Operational</option>
            <option value="Inactive">Inactive / Locked</option>
          </select>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            if (assignments.length === 0) {
              showToast('No staff assignments to export.');
              return;
            }
            const headers = ['Staff Name', 'Emp ID', 'Role', 'Email', 'Phone', 'Branch', 'Scope', 'Status', 'Assigned Date'];
            const rows = filteredAssignments.map((a) => [
              `"${a.userName.replace(/"/g, '""')}"`,
              `"${a.empId}"`,
              `"${a.roleName}"`,
              `"${a.email}"`,
              `"${a.phone}"`,
              `"${a.branch}"`,
              `"${a.scope}"`,
              `"${a.status}"`,
              `"${a.assignedDate}"`,
            ]);
            const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `staff_role_assignments_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Role assignment roster exported in CSV format.');
          }}
          className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Export Assignments</span>
        </Button>
      </div>

      {/* Role Assignments Master Table (Section 9 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Active Staff Role Assignments Ledger
              </h3>
              {!isLoading && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                  {filteredAssignments.length} Assignments
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Live staff credentials mapped to system roles, organizational scopes, and assignment authors
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Staff Member &amp; ID</th>
                <th className="p-3.5">Assigned System Role</th>
                <th className="p-3.5">Branch Location</th>
                <th className="p-3.5">Scope</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Assigned Date &amp; By</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skel-asg-${idx}`} className="animate-pulse">
                    <td className="p-3.5 pl-5">
                      <div className="h-4 bg-slate-200 rounded w-36 mb-1" />
                      <div className="h-3 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-4 bg-slate-200 rounded w-32 mb-1" />
                      <div className="h-3 bg-slate-100 rounded w-44" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-4 bg-slate-200 rounded w-28" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-5 bg-slate-200 rounded-full w-24" />
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="h-5 bg-slate-200 rounded-full w-16 mx-auto" />
                    </td>
                    <td className="p-3.5">
                      <div className="h-3 bg-slate-200 rounded w-24 mb-1" />
                      <div className="h-2.5 bg-slate-100 rounded w-16" />
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="h-7 bg-slate-200 rounded-lg w-32 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center border border-purple-200">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif font-bold text-ink text-base">No Staff Assignments Found</h4>
                      <p className="text-xs text-muted max-w-sm">
                        {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                          ? 'No staff members match the selected filter criteria. Try resetting filters.'
                          : 'No staff users found with role assignments in the backend database.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((a) => (
                  <tr key={a.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{a.userName}</strong>
                      <span className="text-[10px] text-muted font-mono">{a.empId}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-bold text-[#5A2EA6] text-xs block">{a.roleName}</span>
                      <span className="text-[9px] text-muted">{a.email}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">{a.branch}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                          a.scope === 'Brand-wide'
                            ? 'bg-purple-50 text-[#5A2EA6] border-purple-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200',
                        )}
                      >
                        {a.scope}
                      </span>
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-800 text-[11px]">
                      <span className="font-semibold block">{a.assignedBy}</span>
                      <span className="text-[9px] text-muted">{a.assignedDate}</span>
                    </td>
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedAssignmentForDossier(a)}
                          className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Dossier</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setAssignmentToChangeRole(a)}
                          className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                          title="Change Role"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Change</span>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setAssignmentToRemove(a)}
                          className="h-[28px] px-2 rounded-lg text-[10px] font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
                          title="Revoke Assignment"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
