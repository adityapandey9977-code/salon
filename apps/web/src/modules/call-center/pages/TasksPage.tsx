import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Download,
  Filter,
  Plus,
  Search,
  Building2,
  Globe,
  MapPin,
  X
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';

export function TasksPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches
  } = useCallCenterBranch();

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskBranch, setNewTaskBranch] = useState(selectedBranch.name);
  const [newTaskPriority, setNewTaskPriority] = useState('High');

  const [tasks, setTasks] = useState([
    {
      id: 'TSK-01',
      title: 'Call Sunita Kapoor for Keratin Consultation callback',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      category: 'Inbound Lead Call',
      priority: 'High',
      dueDate: 'Today 11:30 AM',
      status: 'pending'
    },
    {
      id: 'TSK-02',
      title: 'Send WhatsApp quotation for Meera Bridal Group at South Ext',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      category: 'Quotation Follow-up',
      priority: 'Medium',
      dueDate: 'Today 02:00 PM',
      status: 'pending'
    },
    {
      id: 'TSK-03',
      title: 'Confirm 8 pending appointments for tomorrow at Indiranagar',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      category: 'Confirmation Desk',
      priority: 'High',
      dueDate: 'Today 05:00 PM',
      status: 'completed'
    },
    {
      id: 'TSK-04',
      title: 'Follow up on scalp spa satisfaction with Siddharth Rao',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      category: 'CSAT Review',
      priority: 'Medium',
      dueDate: 'Today 04:30 PM',
      status: 'pending'
    }
  ]);

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
    toast('Task Updated: Desk task status updated.');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask = {
      id: `TSK-${Math.floor(10 + Math.random() * 89)}`,
      title: newTaskTitle,
      branch: newTaskBranch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      category: 'Desk Task',
      priority: newTaskPriority,
      dueDate: 'Today 06:00 PM',
      status: 'pending'
    };

    setTasks([newTask, ...tasks]);
    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    toast(`Task Added: [${newTask.id}] assigned.`);
  };

  const filtered = tasks.filter((t) => {
    const matchesBranch = isAllBranches || t.branchId === selectedBranchId;
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesBranch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Concierge Task &amp; Checklist Center
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Tasks' : `${selectedBranch.shortName} Tasks`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Daily agent task assignments, priority calls, and multi-branch follow-up checklists.'
              : `Desk tasks and checklist items mapped to ${selectedBranch.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>

          <button
            onClick={() => toast(`Export Tasks: Downloaded task list for ${selectedBranch.shortName} as CSV.`)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Tasks
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-line pb-3">
          <h2 className="text-sm font-bold text-ink">Assigned Agent Checklist</h2>
          <div className="flex gap-2">
            {(['pending', 'completed', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer border-0 ${filter === f ? 'bg-purple-600 text-white shadow-xs' : 'bg-pine/5 text-soft hover:text-ink'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-soft text-xs">No tasks found in this queue.</div>
          ) : (
            filtered.map(task => (
              <div key={task.id} className="p-3.5 border border-line rounded-xl bg-pine/5 flex items-center justify-between hover:bg-purple-50/20 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleToggleTask(task.id)}
                    className="w-4 h-4 text-purple-600 rounded border-line cursor-pointer"
                  />
                  <div>
                    <div className={`text-xs font-bold ${task.status === 'completed' ? 'line-through text-soft' : 'text-ink'}`}>
                      {task.title}
                    </div>
                    <div className="text-[11px] text-soft flex items-center gap-2 mt-0.5">
                      <span>{task.category}</span>
                      <span>•</span>
                      <span className="text-purple-700 font-semibold">{task.branch}</span>
                      <span>•</span>
                      <span className="font-mono">{task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${task.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                  {task.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {isNewTaskModalOpen && createPortal(
        <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">Create Concierge Task</h3>
                <p className="text-xs text-soft">Assign follow-up action to desk queue</p>
              </div>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Task Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call customer regarding Saturday VIP suite..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Target Outlet</label>
                  <select
                    value={newTaskBranch}
                    onChange={(e) => setNewTaskBranch(e.target.value)}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    {branches.filter(b => b.id !== 'all').map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
