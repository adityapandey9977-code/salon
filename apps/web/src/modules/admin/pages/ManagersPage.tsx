import { Avatar, Button, UsersIcon, cn, useToast } from '@salon-spa-saas/ui';
import { Award, Eye, Pencil, Search, Trash2, TrendingUp, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { DialogModal } from '../../../shared/components/DialogModal';

const initialManagers = [
  {
    name: 'Rahul Sharma',
    branch: 'Indore Flagship',
    status: 'Active',
    email: 'rahul.sharma@atelier.com',
    phone: '+91 98765 43210',
    performance: '92%',
  },
  {
    name: 'Priya Patel',
    branch: 'Bhopal Branch',
    status: 'Active',
    email: 'priya.patel@atelier.com',
    phone: '+91 98765 43211',
    performance: '88%',
  },
  {
    name: 'Amit Deshmukh',
    branch: 'Pune Branch',
    status: 'Active',
    email: 'amit.deshmukh@atelier.com',
    phone: '+91 98765 43212',
    performance: '95%',
  },
];

const branchMap: Record<string, { id: string; name: string }> = {
  'Indore Flagship': { id: 'indore-flagship', name: 'Indore Flagship' },
  'Bhopal Branch': { id: 'bhopal-branch', name: 'Bhopal Branch' },
  'Pune Branch': { id: 'pune-branch', name: 'Pune Branch' },
};

export function ManagersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [managers, setManagers] = useState(initialManagers);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<(typeof initialManagers)[0] | null>(null);
  const [viewedManager, setViewedManager] = useState<(typeof initialManagers)[0] | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newBranch, setNewBranch] = useState('Indore Flagship');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newKPI, setNewKPI] = useState('90%');

  // Edit states
  const [editBranch, setEditBranch] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Add manager handler
  const handleAddManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast('Please fill in manager details.');
      return;
    }

    const newObj = {
      name: newName,
      branch: newBranch,
      status: 'Active',
      email: newEmail,
      phone: newPhone || '+91 90000 12345',
      performance: newKPI.includes('%') ? newKPI : `${newKPI}%`,
    };

    setManagers((prev) => [...prev, newObj]);
    toast(`Successfully onboarded branch manager: ${newName}!`);

    // Reset and close
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setIsAddModalOpen(false);
  };

  // Edit action
  const openEditModal = (m: (typeof initialManagers)[0]) => {
    setSelectedManager(m);
    setEditBranch(m.branch);
    setEditPhone(m.phone);
    setIsEditModalOpen(true);
  };

  // View action
  const openViewModal = (m: (typeof initialManagers)[0]) => {
    setViewedManager(m);
    setIsViewModalOpen(true);
  };

  // Delete action
  const handleDeleteManager = (name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setManagers((prev) => prev.filter((m) => m.name !== name));
      toast(`Successfully deleted manager: ${name}`);
    }
  };

  // Save changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManager) return;

    setManagers((prev) =>
      prev.map((m) => {
        if (m.name === selectedManager.name) {
          return {
            ...m,
            branch: editBranch,
            phone: editPhone,
          };
        }
        return m;
      }),
    );

    toast(`Successfully saved profile adjustments for ${selectedManager.name}!`);
    setIsEditModalOpen(false);
    setSelectedManager(null);
  };

  // Filter calculations
  const filtered = managers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Manager Management
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Manage managers, assignments, and check scores.
          </p>
        </div>
        <Button
          onClick={() => navigate('/managers/new')}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary gap-1.5 flex items-center shadow-md hover:shadow-lg transition-all"
        >
          <UsersIcon className="w-3.5 h-3.5" />
          <span>Add New Manager</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-80 mb-6">
        <input
          type="text"
          placeholder="Search managers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-line rounded-xl py-2 px-3 pl-9 outline-none text-[12px] placeholder:text-soft focus:border-[#5A2EA6] shadow-xs"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
      </div>

      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />

          <div className="flex justify-between items-center w-full z-10">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Branch Administrators
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Core managers operating individual chain stores
              </p>
            </div>
            <span className="text-[10px] font-bold text-white bg-white/15 px-3 py-1 rounded-lg border border-white/10">
              {filtered.length} Managers Total
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Manager',
                    'Assigned Branch',
                    'Contact Info',
                    'Status',
                    'Performance',
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
                {filtered.map((m, i) => (
                  <tr key={i} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar
                          variant="circle-profile"
                          initials={m.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                          className="bg-[#5A2EA6]/10 border border-[#5A2EA6]/15 text-[#5A2EA6] w-9 h-9 font-bold text-[10px]"
                        />
                        <div>
                          <strong className="block text-ink text-[13px] font-bold">{m.name}</strong>
                          <span className="text-[10px] text-soft font-semibold">
                            Manager level 2
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-ink">{m.branch}</td>
                    <td className="p-4">
                      <span className="block font-semibold">{m.email}</span>
                      <span className="block text-[10px] text-muted mt-0.5">{m.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-ink">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {m.performance} KPI
                      </div>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const bInfo = branchMap[m.branch] || {
                              id: 'indore-flagship',
                              name: 'Indore Flagship',
                            };
                            navigate(
                              `/branches/${bInfo.id}?name=${encodeURIComponent(bInfo.name)}&id=${bInfo.id}`,
                            );
                          }}
                          title="View Branch Analytics"
                          className="text-[#6A3BC8] hover:bg-[#5A2EA6]/5 p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openViewModal(m)}
                          title="View Profile"
                          className="text-[#5A2EA6] hover:bg-[#5A2EA6]/5 p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(m)}
                          title="Edit Settings"
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteManager(m.name)}
                          title="Delete Manager"
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Manager Modal */}
      <DialogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Branch Manager"
        description="Provision platform access credentials for a store manager"
      >
        <form onSubmit={handleAddManager} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Manager Full Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Rachel Green"
              className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-ink">Assigned Branch Location</label>
              <select
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
              >
                <option value="Indore Flagship">Indore Flagship</option>
                <option value="Bhopal Branch">Bhopal Branch</option>
                <option value="Pune Branch">Pune Branch</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-ink">Performance Target KPI</label>
              <input
                type="text"
                value={newKPI}
                onChange={(e) => setNewKPI(e.target.value)}
                placeholder="e.g. 90%"
                className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Platform Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="rachel@centralperk.com"
              className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Contact Phone Number</label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
            >
              Onboard Manager
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-line hover:bg-paper/20 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogModal>

      {/* Edit Profile Modal */}
      <DialogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Manager Settings"
        description={`Modify operational assignments for ${selectedManager?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Assigned Branch Location</label>
            <select
              value={editBranch}
              onChange={(e) => setEditBranch(e.target.value)}
              className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
            >
              <option value="Indore Flagship">Indore Flagship</option>
              <option value="Bhopal Branch">Bhopal Branch</option>
              <option value="Pune Branch">Pune Branch</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Contact Phone Number</label>
            <input
              type="text"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="bg-paper/40 border border-[#5A2EA6]/20 rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
            >
              Save Configuration
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-line hover:bg-paper/20 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogModal>

      {/* Right Slide-Over Drawer for View Profile details (Portaled to document.body) */}
      {isViewModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-md transition-opacity"
              onClick={() => setIsViewModalOpen(false)}
            />

            <div className="relative z-10 w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="premium-card-header px-6 py-5 relative min-h-[72px] flex items-center justify-between z-10 shrink-0">
                <div className="premium-card-header-glow" />
                <div className="header-shine" />
                <div className="flex items-center gap-2.5 z-10">
                  <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
                    <UsersIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-[18px] text-white font-bold tracking-tight">
                      Manager Profile Dossier
                    </h3>
                    <p className="text-[11px] text-white/80 mt-0.5">
                      Authorized Branch General Manager
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors border-0 bg-transparent cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              {viewedManager && (
                <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    {/* Top Profile Card */}
                    <div className="flex items-center gap-4 bg-[#FAF7FF] p-4 rounded-2xl border border-[#EBE3FA]">
                      <Avatar
                        initials={viewedManager.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B4DFF] to-[#9C6DFF] text-white font-serif text-lg font-bold shadow-sm"
                      />
                      <div>
                        <h4 className="text-base font-bold text-ink font-serif">
                          {viewedManager.name}
                        </h4>
                        <p className="text-xs text-soft">{viewedManager.branch}</p>
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-1',
                            viewedManager.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700',
                          )}
                        >
                          {viewedManager.status} Account
                        </span>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1 bg-paper/40 p-3 rounded-xl border border-line/45">
                        <span className="text-[10px] text-soft uppercase font-bold tracking-wider">
                          Branch Assignment
                        </span>
                        <span className="block font-semibold text-ink">{viewedManager.branch}</span>
                      </div>
                      <div className="space-y-1 bg-paper/40 p-3 rounded-xl border border-line/45">
                        <span className="text-[10px] text-soft uppercase font-bold tracking-wider">
                          Performance Target
                        </span>
                        <span className="block font-semibold text-[#5A2EA6]">
                          {viewedManager.performance} KPI Score
                        </span>
                      </div>
                      <div className="space-y-1 col-span-2 border-t border-line/45 pt-3">
                        <span className="text-[10px] text-soft uppercase font-bold tracking-wider">
                          Email Address
                        </span>
                        <span className="block font-semibold text-ink truncate">
                          {viewedManager.email}
                        </span>
                      </div>
                      <div className="space-y-1 col-span-2 border-t border-line/45 pt-3">
                        <span className="text-[10px] text-soft uppercase font-bold tracking-wider">
                          Phone Number
                        </span>
                        <span className="block font-semibold text-ink">{viewedManager.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-6 border-t border-line/45 space-y-2">
                    <button
                      onClick={() => {
                        const bInfo = branchMap[viewedManager.branch] || {
                          id: 'indore-flagship',
                          name: 'Indore Flagship',
                        };
                        navigate(
                          `/branches/${bInfo.id}?name=${encodeURIComponent(bInfo.name)}&id=${bInfo.id}`,
                        );
                        setIsViewModalOpen(false);
                      }}
                      className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#5A2EA6] hover:bg-[#4a268c] cursor-pointer transition flex items-center justify-center gap-2 border-0"
                    >
                      <TrendingUp className="w-4 h-4" /> View Branch Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        openEditModal(viewedManager);
                      }}
                      className="w-full py-3 rounded-xl text-xs font-bold text-ink border border-line hover:bg-paper/50 cursor-pointer transition bg-transparent border-0"
                    >
                      Modify Record
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
