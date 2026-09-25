import { Button, cn } from '@salon-spa-saas/ui';
import {
  Eye,
  Filter,
  KeyRound,
  Lock,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { CreateAdminUserModal } from '../components/CreateAdminUserModal';
import { UserDetailsModal } from '../components/UserDetailsModal';
import { type AdminUser, useSuperAdminStore } from '../context/SuperAdminContext';

export function UsersPage() {
  const { users, updateAdminUser, deleteAdminUser } = useSuperAdminStore();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [selectedDetailsUser, setSelectedDetailsUser] = useState<AdminUser | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [mfaFilter, setMfaFilter] = useState<'All' | 'Enabled' | 'Disabled'>('All');

  // Unique Roles List
  const uniqueRoles = useMemo(() => {
    const roles = new Set(users.map((u) => u.role).filter(Boolean));
    return Array.from(roles);
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesMfa =
        mfaFilter === 'All' ||
        (mfaFilter === 'Enabled' && user.mfaEnabled) ||
        (mfaFilter === 'Disabled' && !user.mfaEnabled);

      return matchesSearch && matchesStatus && matchesRole && matchesMfa;
    });
  }, [users, searchQuery, statusFilter, roleFilter, mfaFilter]);

  const hasActiveFilters =
    searchQuery !== '' || statusFilter !== 'All' || roleFilter !== 'All' || mfaFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setRoleFilter('All');
    setMfaFilter('All');
  };

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const mfaEnabledCount = users.filter((u) => u.mfaEnabled).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-semibold tracking-tight">
              Super Admin Users & RBAC Roster
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#5A2EA6]/20">
              {users.length} Operators
            </span>
          </div>
          <p className="text-[13px] text-muted mt-1">
            Manage global administrator profiles, billing operators, and security RBAC privileges.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setIsUserModalOpen(true);
          }}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 shadow-sm hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Admin User</span>
        </Button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Registered Operators
            </span>
            <strong className="text-xl font-serif font-bold text-ink">{users.length} Users</strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Active Operators
            </span>
            <strong className="text-xl font-serif font-bold text-emerald-700">
              {activeCount} Active
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              MFA Protected
            </span>
            <strong className="text-xl font-serif font-bold text-ink">
              {mfaEnabledCount} Enforced
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Access Roles
            </span>
            <strong className="text-xl font-serif font-bold text-ink">
              {uniqueRoles.length} Defined Roles
            </strong>
          </div>
        </div>
      </div>

      {/* Directory Roster Table */}
      <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] shadow-xs overflow-hidden">
        {/* Search & Filter Header Bar */}
        <div className="p-5 border-b border-[#5A2EA6]/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">
                Super Administrators Directory
              </h3>
              <p className="text-[12px] text-muted mt-0.5">
                Filter by assigned role, account status, MFA security posture, or operator name
              </p>
            </div>
            <div className="text-xs text-muted flex items-center gap-2">
              <span className="font-semibold text-[#5A2EA6]">
                Showing {filteredUsers.length} of {users.length} Operators
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
                >
                  <X className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search name, email, role, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Account Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Assigned Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* MFA Security Filter */}
            <div className="relative">
              <select
                value={mfaFilter}
                onChange={(e) => setMfaFilter(e.target.value as any)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All MFA Postures</option>
                <option value="Enabled">MFA Enabled</option>
                <option value="Disabled">MFA Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Admin User',
                  'Email Address',
                  'Assigned Role',
                  'MFA Posture',
                  'Account Status',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-4 font-bold text-[10px] tracking-wider uppercase',
                      i === 0 ? 'pl-6' : i === 5 ? 'pr-6 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-4 pl-6 font-bold text-ink">
                      {user.name}
                      <span className="block text-[10px] font-normal text-muted">{user.phone}</span>
                    </td>
                    <td className="p-4 font-semibold text-ink">{user.email}</td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#5A2EA6]/10 text-[#5A2EA6]">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                          user.mfaEnabled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200',
                        )}
                      >
                        <Lock className="w-3 h-3" />
                        {user.mfaEnabled ? 'Enforced' : 'Not Enforced'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          updateAdminUser(user.id, {
                            status: user.status === 'Active' ? 'Inactive' : 'Active',
                          })
                        }
                        className={cn(
                          'inline-block px-2.5 py-1 rounded-full text-[9.5px] font-bold border-0 cursor-pointer transition-transform hover:scale-105',
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200',
                        )}
                        title="Click to toggle operator account status"
                      >
                        {user.status}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Profile */}
                        <button
                          onClick={() => setSelectedDetailsUser(user)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="View Operator Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit User & Role */}
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setIsUserModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Edit Admin User Profile"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete / Revoke Access */}
                        <button
                          onClick={() => {
                            if (
                              confirm(`Are you sure you want to revoke access for ${user.name}?`)
                            ) {
                              deleteAdminUser(user.id);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Revoke Admin Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted text-xs">
                    No admin users found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateAdminUserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        editUser={editingUser}
      />

      <UserDetailsModal
        isOpen={!!selectedDetailsUser}
        onClose={() => setSelectedDetailsUser(null)}
        user={selectedDetailsUser}
      />
    </div>
  );
}
