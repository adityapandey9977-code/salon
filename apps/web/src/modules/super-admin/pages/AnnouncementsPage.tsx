import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Eye,
  Filter,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { AnnouncementDetailsModal } from '../components/AnnouncementDetailsModal';
import { CreateAnnouncementModal } from '../components/CreateAnnouncementModal';
import { type Announcement, useSuperAdminStore } from '../context/SuperAdminContext';

export function AnnouncementsPage() {
  const { announcements, deleteAnnouncement, updateAnnouncement } = useSuperAdminStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [selectedDetailsAnnouncement, setSelectedDetailsAnnouncement] =
    useState<Announcement | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Active' | 'Sent' | 'Draft' | 'Archived'
  >('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Info' | 'Warning' | 'Critical'>(
    'All',
  );
  const [audienceFilter, setAudienceFilter] = useState<string>('All');

  // Unique Audiences
  const uniqueAudiences = useMemo(() => {
    const audiences = new Set(announcements.map((a) => a.audience).filter(Boolean));
    return Array.from(audiences);
  }, [announcements]);

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch =
        ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.audience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ann.date.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || ann.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || ann.priority === priorityFilter;
      const matchesAudience = audienceFilter === 'All' || ann.audience === audienceFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesAudience;
    });
  }, [announcements, searchQuery, statusFilter, priorityFilter, audienceFilter]);

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    audienceFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setAudienceFilter('All');
  };

  const activeCount = announcements.filter((a) => a.status === 'Active').length;
  const sentCount = announcements.filter((a) => a.status === 'Sent').length;
  const criticalCount = announcements.filter((a) => a.priority === 'Critical').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-semibold tracking-tight">
              Announcements & System Advisories
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#5A2EA6]/20">
              {announcements.length} Broadcasts
            </span>
          </div>
          <p className="text-[13px] text-muted mt-1">
            Broadcast global platform advisories, release notes, and multi-channel system
            notifications according to PRD rules.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAnnouncement(null);
            setIsCreateModalOpen(true);
          }}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 shadow-sm hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Announcement</span>
        </Button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Total Announcements
            </span>
            <strong className="text-xl font-serif font-bold text-ink">
              {announcements.length} Advisories
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Active Broadcasts
            </span>
            <strong className="text-xl font-serif font-bold text-emerald-700">
              {activeCount} Active
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Dispatched Messages
            </span>
            <strong className="text-xl font-serif font-bold text-ink">{sentCount} Sent</strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Critical Advisories
            </span>
            <strong className="text-xl font-serif font-bold text-rose-700">
              {criticalCount} Critical
            </strong>
          </div>
        </div>
      </div>

      {/* Announcements Data Log Table */}
      <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] shadow-xs overflow-hidden">
        {/* Search & Filter Header Bar */}
        <div className="p-5 border-b border-[#5A2EA6]/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Announcements Broadcast Log</h3>
              <p className="text-[12px] text-muted mt-0.5">
                Filter by priority level, broadcast status, target audience, or search announcement
                text
              </p>
            </div>
            <div className="text-xs text-muted flex items-center gap-2">
              <span className="font-semibold text-[#5A2EA6]">
                Showing {filteredAnnouncements.length} of {announcements.length} Announcements
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
                placeholder="Search title, description, audience..."
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
                <option value="All">All Broadcast Statuses</option>
                <option value="Active">Active</option>
                <option value="Sent">Sent</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Priorities</option>
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Audience Filter */}
            <div className="relative">
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Target Audiences</option>
                {uniqueAudiences.map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {['Title & Content', 'Date', 'Audience Scope', 'Priority', 'Status', 'Actions'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-4 font-bold text-[10px] tracking-wider uppercase',
                        i === 0 ? 'pl-6' : i === 5 ? 'pr-6 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-4 pl-6">
                      <strong className="block text-ink font-semibold">{ann.title}</strong>
                      <span className="block text-[10px] text-muted truncate max-w-sm mt-0.5">
                        {ann.content}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-ink">{ann.date}</td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#5A2EA6]/10 text-[#5A2EA6]">
                        {ann.audience}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'inline-block px-2 py-0.5 rounded-md text-[9.5px] font-bold uppercase tracking-wider',
                          ann.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : ann.priority === 'Warning'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200',
                        )}
                      >
                        {ann.priority || 'Info'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-1 rounded-full text-[9.5px] font-bold border',
                          ann.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : ann.status === 'Sent'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200',
                        )}
                      >
                        {ann.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview Details */}
                        <button
                          onClick={() => setSelectedDetailsAnnouncement(ann)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Preview Full Announcement Content"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Announcement */}
                        <button
                          onClick={() => {
                            setEditingAnnouncement(ann);
                            setIsCreateModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Edit Broadcast Parameters"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Re-broadcast / Send Now */}
                        <button
                          onClick={() => {
                            updateAnnouncement(ann.id, { status: 'Sent' });
                            alert(
                              `Announcement "${ann.title}" has been broadcast to ${ann.audience}!`,
                            );
                          }}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Re-broadcast / Send Now"
                        >
                          <Send className="w-4 h-4" />
                        </button>

                        {/* Delete / Archive */}
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete announcement "${ann.title}"?`,
                              )
                            ) {
                              deleteAnnouncement(ann.id);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Delete Announcement"
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
                    No announcements found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateAnnouncementModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingAnnouncement(null);
        }}
        editAnnouncement={editingAnnouncement}
      />

      <AnnouncementDetailsModal
        isOpen={!!selectedDetailsAnnouncement}
        onClose={() => setSelectedDetailsAnnouncement(null)}
        announcement={selectedDetailsAnnouncement}
      />
    </div>
  );
}
