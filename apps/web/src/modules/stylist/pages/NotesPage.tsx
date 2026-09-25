import { Button, cn, useToast } from '@salon-spa-saas/ui';
import { Calendar, Edit3, FileText, Plus, Search, Tag, Trash2, User } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface NoteItem {
  id: string;
  client: string;
  date: string;
  category: 'Scalp & Sensitivity' | 'Preference' | 'Formula Adjustment' | 'Allergy Caution';
  text: string;
}

const initialNotes: NoteItem[] = [
  {
    id: 'note-01',
    client: 'Priya Sharma',
    date: 'Jul 24, 2026',
    category: 'Scalp & Sensitivity',
    text: 'Client scalp showed slight redness near crown section during initial comb-through. Switched to organic ammonia-free bleach and low heat blowdry.',
  },
  {
    id: 'note-02',
    client: 'Ava Rose',
    date: 'Jul 10, 2026',
    category: 'Preference',
    text: 'Prefers non-scented organic oils and warm neck towels during hair wash. Sensitive to loud hairdryer sound.',
  },
  {
    id: 'note-03',
    client: 'Sonia Gupta',
    date: 'Jun 28, 2026',
    category: 'Formula Adjustment',
    text: 'Required 10g additional Olaplex No.1 additive due to previous box dye dryness.',
  },
];

export function NotesPage() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [searchTerm, setSearchTerm] = useState('');

  // Form Fields
  const [selectedClient, setSelectedClient] = useState('Priya Sharma');
  const [selectedCategory, setSelectedCategory] =
    useState<NoteItem['category']>('Scalp & Sensitivity');
  const [noteDate, setNoteDate] = useState('Jul 24, 2026');
  const [noteText, setNoteText] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNoteItem: NoteItem = {
      id: `note-${Date.now()}`,
      client: selectedClient,
      date: noteDate,
      category: selectedCategory,
      text: noteText,
    };

    setNotes([newNoteItem, ...notes]);
    setNoteText('');
    toast(`Saved service note for ${selectedClient} under ${selectedCategory}! 📝`);
  };

  const handleDeleteNote = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove the note for ${name}?`)) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast('Deleted service note record.');
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
          Service &amp; Scalp Notes
        </h1>
        <p className="text-[13px] text-soft mt-1">
          Private clinical observations, scalp sensitivity notes, and client preference records
        </p>
      </div>

      {/* Complete Multi-Field Add Note Form */}
      <form
        onSubmit={handleAddNote}
        className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4"
      >
        <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-2">
          Add New Session Note
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
              Select Client
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
            >
              <option value="Priya Sharma">Priya Sharma</option>
              <option value="Ava Rose">Ava Rose</option>
              <option value="Sonia Gupta">Sonia Gupta</option>
              <option value="Meera Kapoor">Meera Kapoor</option>
              <option value="Aarav Khanna">Aarav Khanna</option>
            </select>
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
              Note Category / Tag
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as NoteItem['category'])}
              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
            >
              <option value="Scalp &amp; Sensitivity">Scalp &amp; Sensitivity</option>
              <option value="Preference">Client Preference</option>
              <option value="Formula Adjustment">Formula Adjustment</option>
              <option value="Allergy Caution">Allergy Caution</option>
            </select>
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
              Session Date
            </label>
            <input
              type="text"
              value={noteDate}
              onChange={(e) => setNoteDate(e.target.value)}
              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block mb-1">
            Detailed Clinical / Session Note
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Record detailed scalp observations, formula adjustments, or specific client preferences..."
            className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs outline-none focus:border-[#5A2EA6] text-ink font-semibold h-24"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-9 px-5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Save Note Record
          </Button>
        </div>
      </form>

      {/* Filter & Notes List */}
      <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center gap-4 border-b border-line pb-3">
          <h3 className="font-serif text-base font-bold text-ink">
            Recorded Service Notes ({filteredNotes.length})
          </h3>
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes or clients..."
              className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 pl-8 text-xs font-semibold outline-none focus:border-[#5A2EA6]"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((n) => (
              <div
                key={n.id}
                className="p-4 bg-[#FCFAFF] border border-[#5A2EA6]/15 rounded-2xl space-y-2 hover:border-[#5A2EA6]/30 transition"
              >
                <div className="flex justify-between items-center border-b border-line/60 pb-2">
                  <div>
                    <b className="text-sm font-bold text-ink">{n.client}</b>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-soft font-mono">{n.date}</span>
                      <span className="text-[9.5px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6] px-2 py-0.5 rounded-full border border-[#5A2EA6]/20">
                        {n.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteNote(n.id, n.client)}
                    className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center border-0 cursor-pointer transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-soft leading-relaxed pt-1">{n.text}</p>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-xs text-muted font-semibold">
              No service notes match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
