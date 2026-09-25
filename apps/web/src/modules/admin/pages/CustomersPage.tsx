import bronzeMemberImg from '@/assets/images/Bronze-member.jpg';
import goldMemberImg from '@/assets/images/Gold-member.jpg';
import platinumMemberImg from '@/assets/images/Platinum-membe.jpg';
import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import { ArrowRightIcon, OverviewIcon, UsersIcon } from '@salon-spa-saas/ui';
import { Search, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const initialClients = [
  {
    name: 'Ava Rose',
    email: 'ava.rose@gmail.com',
    tier: 'Platinum Member',
    points: 500,
    stylist: 'Emma Burke',
    notes: 'Requires organic hair serum. Likes warm green tea.',
    history: [
      { date: 'Oct 20', service: 'Balayage & Trim', price: '₹4,500', stylist: 'Emma Burke' },
      { date: 'Sep 15', service: 'Hydrating Facial', price: '₹2,200', stylist: 'Mia Chen' },
    ],
  },
  {
    name: 'Mia Chen',
    email: 'mia.chen@gmail.com',
    tier: 'Gold Member',
    points: 250,
    stylist: 'Mia Chen',
    notes: 'Prefers silent service. Sensitive cuticles.',
    history: [
      { date: 'Jul 10', service: 'Acrylic Overlay', price: '₹1,500', stylist: 'Mia Chen' },
      { date: 'Jun 18', service: 'Spa Pedicure', price: '₹2,000', stylist: 'Mia Chen' },
    ],
  },
  {
    name: 'Emma Sophia',
    email: 'emma.sophia@gmail.com',
    tier: 'Gold Member',
    points: 250,
    stylist: 'Emma Burke',
    notes: 'Looking to dye hair lighter blonde in next session.',
    history: [
      { date: 'Jun 05', service: 'Blonde Highlights', price: '₹5,800', stylist: 'Emma Burke' },
    ],
  },
  {
    name: 'Kassia Burke',
    email: 'kassia.burke@gmail.com',
    tier: 'Bronze Member',
    points: 120,
    stylist: 'Kassia Sophia',
    notes: 'Always books pedicure. Allergic to lavender extract.',
    history: [
      { date: 'May 12', service: 'Pedicure Essential', price: '₹1,200', stylist: 'Kassia Sophia' },
    ],
  },
];

export function CustomersPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState(initialClients);
  const [selectedClientName, setSelectedClientName] = useState('Ava Rose');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [tierFilter, setTierFilter] = useState<'All' | 'Platinum' | 'Gold' | 'Bronze'>(
    (location.state as any)?.tier || 'All',
  );

  // Drawer open states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Close invite drawer on route/page change and update filter from location state
  useEffect(() => {
    setIsInviteModalOpen(false);
    if ((location.state as any)?.tier) {
      setTierFilter((location.state as any).tier);
    }
  }, [location.pathname, location.state]);

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTier, setNewTier] = useState('Bronze Member');
  const [newNotes, setNewNotes] = useState('');
  const [newStylist, setNewStylist] = useState('Emma Burke');

  // Currently selected client object
  const activeClient = clients.find((c) => c.name === selectedClientName) || clients[0] || null;

  // Add new client handler
  const handleInviteClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast('Please enter a valid name and email.');
      return;
    }

    const newClientObj = {
      name: newName,
      email: newEmail,
      tier: newTier,
      points: 100, // starting points
      stylist: newStylist,
      notes: newNotes || 'No preferences logged.',
      history: [],
    };

    setClients((prev) => [newClientObj, ...prev]);
    setSelectedClientName(newName);
    toast(`Client ${newName} successfully invited!`);

    // Reset and close
    setNewName('');
    setNewEmail('');
    setNewNotes('');
    setIsInviteModalOpen(false);
  };

  // Adjust points handler
  const incrementPoints = (name: string, amt: number) => {
    setClients((prev) => prev.map((c) => (c.name === name ? { ...c, points: c.points + amt } : c)));
    toast(`Credited +${amt} loyalty points to ${name}!`);
  };

  // Update client notes
  const updateClientNotes = (name: string, updatedNotes: string) => {
    setClients((prev) => prev.map((c) => (c.name === name ? { ...c, notes: updatedNotes } : c)));
    toast('Client notes updated successfully.');
  };

  // Delete client handler
  const handleDeleteClient = (name: string) => {
    const nextList = clients.filter((c) => c.name !== name);
    setClients(nextList);
    toast(`Removed ${name} from customer directory.`);
    if (nextList.length > 0) {
      setSelectedClientName(nextList[0].name);
    }
  };

  // Filters calculations
  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'All' || c.tier.includes(tierFilter);
    return matchesSearch && matchesTier;
  });

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Client Directory
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Monitor customer loyalty, notes, and rebooking logs.
          </p>
        </div>
        <Button
          onClick={() => setIsInviteModalOpen(true)}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary gap-1.5 flex items-center"
        >
          <UsersIcon className="w-3.5 h-3.5" />
          <span>Invite New Customer</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3.5 items-center justify-between mb-6">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-line rounded-xl py-2 px-3 pl-9 outline-none text-[12px] placeholder:text-soft focus:border-[#5A2EA6] shadow-xs"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {(['All', 'Platinum', 'Gold', 'Bronze'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTierFilter(filter)}
              className={`px-4 py-1.5 rounded-full border text-[11px] font-bold cursor-pointer transition ${
                tierFilter === filter
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                  : 'bg-white text-muted border-line hover:bg-paper/30'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <Button variant="primary" className="h-[40px] px-4 rounded-xl text-xs font-semibold">
          <UsersIcon className="w-3.5 h-3.5" />
          <span>Invite New Customer</span>
        </Button>
      </div>

      {/* Main client inspection panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Side: Client Selector table */}
        <div className="lg:col-span-2 premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Client Directory
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Recent customers and their loyalty status
              </p>
            </div>
          </div>
          <div className="p-0 flex-1 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                  <tr>
                    {['Client', 'Email Address', 'Points'].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'p-4 font-bold text-[10px] tracking-wider uppercase',
                          i === 0 ? 'pl-6' : i === 2 ? 'text-right pr-6' : '',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                  {filtered.map((client, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedClientName(client.name)}
                      className={cn(
                        'cursor-pointer transition-colors duration-200 border-l-[3px]',
                        client.tier.includes('Platinum')
                          ? cn(
                              'border-l-[#7B4DFF]',
                              selectedClientName === client.name
                                ? 'bg-[#F3EEFF]'
                                : 'bg-[#FDFCFF] hover:bg-[#F6F2FF]',
                            )
                          : client.tier.includes('Gold')
                            ? cn(
                                'border-l-[#F5C242]',
                                selectedClientName === client.name
                                  ? 'bg-[#FFF9E6]'
                                  : 'bg-[#FFFEF8] hover:bg-[#FFFBEC]',
                              )
                            : cn(
                                'border-l-[#cca080]',
                                selectedClientName === client.name
                                  ? 'bg-[#FFF5EC]'
                                  : 'bg-[#FFFCF8] hover:bg-[#FFF7EE]',
                              ),
                      )}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            variant="circle-profile"
                            initials={client.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                            className="w-8 h-8 text-[9px] font-bold bg-[#5A2EA6]/10 border border-[#5A2EA6]/10 text-ink shrink-0"
                          />
                          <div>
                            <b className="block text-ink">{client.name}</b>
                            <span
                              className={cn(
                                'block text-[9.5px] font-semibold',
                                client.tier.includes('Platinum')
                                  ? 'text-[#7B4DFF]'
                                  : client.tier.includes('Gold')
                                    ? 'text-[#B28213]'
                                    : 'text-[#A06A42]',
                              )}
                            >
                              {client.tier}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">{client.email}</td>
                      <td className="p-4 text-right pr-6 font-bold text-ink">{client.points}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-soft">
                        No clients match the current search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Selected client detail profile card */}
        {activeClient && (
          <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
            <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="z-10 w-full">
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Client Insights
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Details &amp; preferences of selected client
                </p>
              </div>
            </div>

            <div className="p-5 text-[12px] text-soft space-y-4 flex-1 bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-[#5A2EA6]/10 pb-3.5">
                  <Avatar
                    variant="circle-profile"
                    initials={activeClient.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                    className="bg-[#5A2EA6] text-white w-9 h-9 text-[10px] font-bold"
                  />
                  <div>
                    <h5 className="text-[13px] font-bold text-ink">{activeClient.name}</h5>
                    <span
                      className={cn(
                        'text-[9px] font-bold px-2.5 py-0.5 rounded-full mt-0.5 inline-block',
                        activeClient.tier.includes('Platinum')
                          ? 'bg-[#7B4DFF]/15 text-[#7B4DFF]'
                          : activeClient.tier.includes('Gold')
                            ? 'bg-[#F5C242]/15 text-[#B28213]'
                            : 'bg-[#cca080]/15 text-[#A06A42]',
                      )}
                    >
                      {activeClient.tier}
                    </span>
                  </div>
                  <span className="ml-auto text-[12px] font-bold text-[#5A2EA6]">
                    {activeClient.points} Points
                  </span>
                </div>

                <div className="space-y-2">
                  <p>
                    <b className="text-ink">Email:</b> {activeClient.email}
                  </p>
                  <p>
                    <b className="text-ink">Preferred Stylist:</b> {activeClient.stylist}
                  </p>

                  {/* Notes update section */}
                  <div className="bg-[#5A2EA6]/5 p-3 rounded-xl border border-[#5A2EA6]/10 text-[11px] text-[#6d5b73] space-y-1.5">
                    <b className="text-ink not-italic block">Preferences &amp; Notes:</b>
                    <textarea
                      value={activeClient.notes}
                      onChange={(e) => updateClientNotes(activeClient.name, e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-line rounded-lg p-2 outline-none text-[11px] text-ink resize-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <b className="text-ink block mb-2">Service History Log:</b>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                    {activeClient.history.map((h, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-[#5A2EA6]/5 p-2.5 rounded-xl border border-[#5A2EA6]/10"
                      >
                        <div>
                          <strong className="block text-ink text-[11px]">{h.service}</strong>
                          <span className="text-[9.5px] text-muted">
                            {h.date} · by {h.stylist}
                          </span>
                        </div>
                        <strong className="text-[#5A2EA6] font-bold">{h.price}</strong>
                      </div>
                    ))}
                    {activeClient.history.length === 0 && (
                      <p className="text-[11px] text-soft italic text-center py-2">
                        No service logs active.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons on client */}
              <div className="flex gap-2.5 pt-4 border-t border-line/45">
                <Button
                  onClick={() => incrementPoints(activeClient.name, 50)}
                  className="flex-1 text-[10px] font-bold h-9 rounded-xl border border-[#5A2EA6]/20 bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/10 text-[#5A2EA6] transition-colors"
                >
                  +50 Points
                </Button>
                <Button
                  onClick={() => handleDeleteClient(activeClient.name)}
                  className="flex-1 text-[10px] font-bold h-9 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                >
                  Delete Client
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right-Side Invite Drawer */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setIsInviteModalOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[420px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden border-l border-[#5A2EA6]/10">
            {/* Header (Fixed) */}
            <div className="premium-card-header px-6 py-5 relative min-h-[72px] flex items-center justify-between z-10 shrink-0">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="z-10">
                <h3 className="font-serif text-[16px] text-white font-bold tracking-tight">
                  Invite New Customer
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Register a client profile on the platform
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Wrapper */}
            <form
              onSubmit={handleInviteClient}
              className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-[#FAF8FF] via-[#F6F1FF] to-[#FCFBFF]"
            >
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-ink text-[12px]">Client Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rachel Green"
                    className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-ink text-[12px]">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="rachel@centralperk.com"
                    className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                    required
                  />
                </div>

                {/* Membership Tier Cards Selector */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-ink text-[12px]">Membership Tier</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Bronze */}
                    <div
                      onClick={() => setNewTier('Bronze Member')}
                      className={cn(
                        'relative p-3 rounded-xl border cursor-pointer transition-all duration-300 text-center flex flex-col justify-center min-h-[100px] overflow-hidden bg-cover bg-center',
                        newTier === 'Bronze Member'
                          ? 'border-[#cca080] shadow-[0_4px_12px_rgba(204,160,128,0.25)] ring-2 ring-[#cca080]/40'
                          : 'border-[#ECE6F8] hover:border-[#cca080]/40',
                      )}
                      style={{ backgroundImage: `url(${bronzeMemberImg})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3D2410]/90 via-[#3D2410]/50 to-[#3D2410]/30 rounded-xl" />
                      <span className="relative z-10 block text-[11px] uppercase font-bold tracking-wider text-[#F5DCC4]">
                        Bronze
                      </span>
                      <span className="relative z-10 block text-[12px] font-semibold text-white mt-0.5">
                        Bronze Member
                      </span>
                      <span className="relative z-10 block text-[10px] text-white/70">
                        Standard entry perks
                      </span>
                    </div>

                    {/* Gold */}
                    <div
                      onClick={() => setNewTier('Gold Member')}
                      className={cn(
                        'relative p-3 rounded-xl border cursor-pointer transition-all duration-300 text-center flex flex-col justify-center min-h-[100px] overflow-hidden bg-cover bg-center',
                        newTier === 'Gold Member'
                          ? 'border-[#F5C242] shadow-[0_4px_12px_rgba(245,194,66,0.25)] ring-2 ring-[#F5C242]/40'
                          : 'border-[#ECE6F8] hover:border-[#F5C242]/40',
                      )}
                      style={{ backgroundImage: `url(${goldMemberImg})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3D2F00]/90 via-[#3D2F00]/50 to-[#3D2F00]/30 rounded-xl" />
                      <span className="relative z-10 block text-[11px] uppercase font-bold tracking-wider text-[#FFE69C]">
                        Gold
                      </span>
                      <span className="relative z-10 block text-[12px] font-semibold text-white mt-0.5">
                        Gold Member
                      </span>
                      <span className="relative z-10 block text-[10px] text-white/70">
                        VIP priority bookings
                      </span>
                    </div>

                    {/* Platinum */}
                    <div
                      onClick={() => setNewTier('Platinum Member')}
                      className={cn(
                        'relative p-3 rounded-xl border cursor-pointer transition-all duration-300 text-center flex flex-col justify-center min-h-[100px] overflow-hidden bg-cover bg-center',
                        newTier === 'Platinum Member'
                          ? 'border-[#7B4DFF] shadow-[0_4px_12px_rgba(123,77,255,0.25)] ring-2 ring-[#7B4DFF]/40'
                          : 'border-[#ECE6F8] hover:border-[#7B4DFF]/40',
                      )}
                      style={{ backgroundImage: `url(${platinumMemberImg})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A3E]/90 via-[#1A0A3E]/50 to-[#1A0A3E]/30 rounded-xl" />
                      <span className="relative z-10 block text-[11px] uppercase font-bold tracking-wider text-[#C4ADFF]">
                        Platinum
                      </span>
                      <span className="relative z-10 block text-[12px] font-semibold text-white mt-0.5">
                        Platinum Member
                      </span>
                      <span className="relative z-10 block text-[10px] text-white/70">
                        Elite unlimited lounges
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-ink text-[12px]">Preferred Stylist</label>
                  <select
                    value={newStylist}
                    onChange={(e) => setNewStylist(e.target.value)}
                    className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Emma Burke">Emma Burke</option>
                    <option value="Mia Chen">Mia Chen</option>
                    <option value="Kassia Sophia">Kassia Sophia</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-ink text-[12px]">Roster Notes / Comments</label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Client hair preference or sensitive cuticles notes"
                    rows={2}
                    className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none resize-none focus:border-[#5A2EA6]"
                  />
                </div>
              </div>

              {/* Fixed Footer Action Buttons */}
              <div className="shrink-0 p-4 px-4 bg-white border-t border-[#5A2EA6]/10 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
                >
                  Add Customer
                </button>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-line hover:bg-paper/20 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
