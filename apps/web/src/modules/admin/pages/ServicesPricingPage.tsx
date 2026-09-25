import { Button, ScissorsIcon, cn, useToast } from '@salon-spa-saas/ui';
import { Pencil, Power } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DialogModal } from '../../../shared/components/DialogModal';

const initialServices = [
  {
    name: 'Signature Haircut & Style',
    category: 'Hair Dressing & Styling',
    price: '₹1,850',
    duration: '45 mins',
    status: 'Active',
  },
  {
    name: 'Keratin Treatment',
    category: 'Hair Dressing & Styling',
    price: '₹4,200',
    duration: '120 mins',
    status: 'Active',
  },
  {
    name: 'Balayage Highlight & Tone',
    category: 'Hair Dressing & Styling',
    price: '₹6,500',
    duration: '180 mins',
    status: 'Active',
  },
  {
    name: 'Radiance Vitamin C Facial',
    category: 'Skin & Organic Therapy',
    price: '₹2,500',
    duration: '60 mins',
    status: 'Active',
  },
  {
    name: 'Deep Cleanse Hydrating Mask',
    category: 'Skin & Organic Therapy',
    price: '₹1,800',
    duration: '45 mins',
    status: 'Active',
  },
  {
    name: 'Gel Manicure & Polish',
    category: 'Nails Art & Spa',
    price: '₹1,200',
    duration: '40 mins',
    status: 'Active',
  },
  {
    name: 'Spa Pedicure & Massage',
    category: 'Nails Art & Spa',
    price: '₹1,500',
    duration: '50 mins',
    status: 'Active',
  },
];

export function ServicesPricingPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState(initialServices);
  const [activeCategory, setActiveCategory] = useState<
    'All' | 'Hair Dressing & Styling' | 'Skin & Organic Therapy' | 'Nails Art & Spa'
  >('All');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<(typeof initialServices)[0] | null>(null);

  // Edit states
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');

  // Toggle deactivation
  const toggleServiceStatus = (name: string) => {
    setServices((prev) =>
      prev.map((item) => {
        if (item.name === name) {
          const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
          toast(`${name} marked as ${nextStatus}!`);
          return { ...item, status: nextStatus };
        }
        return item;
      }),
    );
  };

  // Edit action
  const openEditModal = (service: (typeof initialServices)[0]) => {
    setSelectedService(service);
    setEditPrice(service.price);
    setEditDuration(service.duration);
    setIsEditModalOpen(true);
  };

  // Save Quick edits
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setServices((prev) =>
      prev.map((item) => {
        if (item.name === selectedService.name) {
          return {
            ...item,
            price: editPrice.startsWith('₹') ? editPrice : `₹${editPrice}`,
            duration: editDuration.includes('mins') ? editDuration : `${editDuration} mins`,
          };
        }
        return item;
      }),
    );

    toast(`Updated pricing details for ${selectedService.name}!`);
    setIsEditModalOpen(false);
    setSelectedService(null);
  };

  // Unique categories list for page grouping
  const categories =
    activeCategory === 'All'
      ? ['Hair Dressing & Styling', 'Skin & Organic Therapy', 'Nails Art & Spa']
      : [activeCategory];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Services &amp; Pricing
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Configure service catalogs, pricing lists, and durations.
          </p>
        </div>
        <Button
          onClick={() => navigate('/services-pricing/new')}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary gap-1.5 flex items-center"
        >
          <ScissorsIcon className="w-3.5 h-3.5" />
          <span>Add Custom Service</span>
        </Button>
      </div>

      {/* Category filters bar */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {(
          ['All', 'Hair Dressing & Styling', 'Skin & Organic Therapy', 'Nails Art & Spa'] as const
        ).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveCategory(filter)}
            className={`px-4 py-1.5 rounded-full border text-[11px] font-bold cursor-pointer transition whitespace-nowrap ${
              activeCategory === filter
                ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                : 'bg-white text-muted border-line hover:bg-paper/30'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div>
        {categories.map((catName) => {
          const items = services.filter((item) => item.category === catName);
          if (items.length === 0) return null;

          return (
            <div
              key={catName}
              className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between mb-8"
            >
              <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
                <div className="premium-card-header-glow" />
                <div className="header-shine" />
                <div className="z-10 w-full">
                  <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                    {catName}
                  </h3>
                  <p className="text-[10px] text-white/80 mt-0.5">Configured pricing catalog</p>
                </div>
              </div>

              <div className="p-0 flex-1 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[12px]">
                    <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                      <tr>
                        {['Service Name', 'Base Pricing', 'Duration', 'Status', 'Actions'].map(
                          (h, i) => (
                            <th
                              key={h}
                              className={cn(
                                'p-4 font-bold text-[10px] tracking-wider uppercase',
                                i === 0 ? 'pl-6' : i === 4 ? 'pr-6 text-right' : '',
                              )}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                      {items.map((item, i) => (
                        <tr key={i} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                          <td className="p-4 pl-6 font-bold text-ink">{item.name}</td>
                          <td className="p-4 font-bold text-[#5A2EA6] text-[13px]">{item.price}</td>
                          <td className="p-4 font-semibold">{item.duration}</td>
                          <td className="p-4">
                            <span
                              className={cn(
                                'inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold',
                                item.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800',
                              )}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(item)}
                                title="Edit Service"
                                className="text-[#5A2EA6] hover:bg-[#5A2EA6]/5 p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleServiceStatus(item.name)}
                                title={
                                  item.status === 'Active'
                                    ? 'Deactivate Service'
                                    : 'Activate Service'
                                }
                                className={cn(
                                  'p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent',
                                  item.status === 'Active'
                                    ? 'text-rose-500 hover:bg-rose-50'
                                    : 'text-emerald-600 hover:bg-emerald-50',
                                )}
                              >
                                <Power className="w-4 h-4" />
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
          );
        })}
      </div>

      {/* Quick Edit Service Modal */}
      <DialogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Quick Edit Service"
        description={`Modify operational pricing variables for ${selectedService?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Operational Base Pricing (INR)</label>
            <input
              type="text"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink"> Roster Allocated Duration</label>
            <input
              type="text"
              value={editDuration}
              onChange={(e) => setEditDuration(e.target.value)}
              className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
            >
              Save Pricing changes
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
    </div>
  );
}
