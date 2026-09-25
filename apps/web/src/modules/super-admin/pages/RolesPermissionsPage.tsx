import React from 'react';
import { useNavigate } from 'react-router';
import { Button, cn } from '@salon-spa-saas/ui';
import { useSuperAdminStore, isSystemProtectedRole } from '../context/SuperAdminContext';
import { Plus, Pencil, Trash2, Users, Lock } from 'lucide-react';

export function RolesPermissionsPage() {
  const navigate = useNavigate();
  const { roles, users, deleteCustomRole } = useSuperAdminStore();

  const getRoleUserCount = (roleItem: { id: string; role: string }) => {
    const roleName = (roleItem.role || '').toLowerCase().trim();
    const roleId = (roleItem.id || '').toLowerCase().trim();
    const roleNormalized = roleName.replace(/\s+/g, '_');

    return users.filter((u) => {
      const uRole = (u.role || '').toLowerCase().trim();
      const uNormalized = uRole.replace(/\s+/g, '_');
      return (
        uRole === roleName ||
        uRole === roleId ||
        uNormalized === roleNormalized ||
        uNormalized.replace(/^platform_/, '') === roleNormalized ||
        uNormalized === roleName.replace(/^platform_/, '') ||
        (roleNormalized === 'super_administrator' &&
          (uNormalized === 'super_admin' || uNormalized === 'superadmin')) ||
        (roleNormalized === 'super_admin' &&
          (uNormalized === 'super_administrator' || uNormalized === 'superadmin'))
      );
    }).length;
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Roles &amp; Permissions
          </h1>
          <p className="text-sm text-soft mt-1">
            Manage administrative privilege scopes, assign operators, and audit granular platform capabilities.
          </p>
        </div>
        <Button
          onClick={() => navigate('/roles-permissions/create')}
          className="bg-[#5A2EA6] hover:bg-[#4A248C] text-white flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </Button>
      </div>

      {/* Roles List */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/10 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#5A2EA6]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">Active Role Scopes</h2>
            <p className="text-xs text-soft mt-0.5">
              Configured system roles and custom-defined permission matrices
            </p>
          </div>
          <span className="px-3 py-1 bg-[#5A2EA6]/10 text-[#5A2EA6] text-xs font-bold rounded-full self-start sm:self-auto">
            {roles.length} Registered Roles
          </span>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#5A2EA6]/10 bg-[#5A2EA6]/5 text-[#5A2EA6]">
                  {[
                    'Role Name',
                    'Description Scope',
                    'Access Scope Area',
                    'Users Count',
                    'Actions',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-4 font-bold text-[10px] tracking-wider uppercase',
                        i === 0 ? 'pl-6' : i === 4 ? 'pr-6 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {roles.map((rl) => {
                  const assignedCount = getRoleUserCount(rl);
                  const isProtected = isSystemProtectedRole(rl);

                  return (
                    <tr key={rl.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      <td className="p-4 pl-6 font-bold text-ink">
                        <div className="flex items-center gap-2">
                          <span>{rl.role}</span>
                          {isProtected && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                              <Lock className="w-2.5 h-2.5" />
                              System Default
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-soft max-w-md">{rl.description}</td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6]">
                          {rl.scope}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-ink">{assignedCount} Users</td>

                      {/* Relatable Icon Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Role Scopes & Permissions */}
                          {isProtected ? (
                            <span
                              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center cursor-not-allowed border border-gray-200/60"
                              title="Super Administrator is a protected system default role with permanent full access and cannot be edited"
                            >
                              <Lock className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                          ) : (
                            <button
                              onClick={() => navigate(`/roles-permissions/edit/${rl.id}`)}
                              className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Edit Role Scope & Permissions"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}

                          {/* View Users Assigned */}
                          <button
                            onClick={() => {
                              const assigned = users.filter((u) => {
                                const uRole = (u.role || '').toLowerCase().trim();
                                const rName = (rl.role || '').toLowerCase().trim();
                                const rNorm = rName.replace(/\s+/g, '_');
                                const uNorm = uRole.replace(/\s+/g, '_');
                                return (
                                  uRole === rName ||
                                  uNorm === rNorm ||
                                  uNorm.replace(/^platform_/, '') === rNorm
                                );
                              });
                              if (assigned.length === 0) {
                                alert(`No operators currently assigned to "${rl.role}".`);
                              } else {
                                const list = assigned
                                  .map((u) => `• ${u.name} (${u.email}) - Status: ${u.status}`)
                                  .join('\n');
                                alert(
                                  `Assigned Operators for "${rl.role}" (${assigned.length}):\n\n${list}`,
                                );
                              }
                            }}
                            className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                            title="View Assigned Users"
                          >
                            <Users className="w-4 h-4" />
                          </button>

                          {/* Delete Custom Role */}
                          {isProtected ? (
                            <span
                              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center cursor-not-allowed border border-gray-200/60"
                              title="Super Administrator is a protected system default role and cannot be deleted"
                            >
                              <Lock className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                if (assignedCount > 0) {
                                  alert(
                                    `Cannot delete role "${rl.role}" while ${assignedCount} users are currently assigned to it. Reassign users first.`,
                                  );
                                  return;
                                }
                                if (
                                  confirm(`Are you sure you want to delete custom role "${rl.role}"?`)
                                ) {
                                  deleteCustomRole(rl.id);
                                }
                              }}
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Delete Custom Role Scope"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
