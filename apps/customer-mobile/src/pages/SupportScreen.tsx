import { ChevronLeft, HelpCircle, PhoneCall, Plus } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  Div,
  H1,
  H2,
  H3,
  H4,
  Input,
  ModalOverlay,
  P,
  Span,
} from '../components/primitives';
import { useApp } from '../context/AppContext';

export const SupportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { tickets, createSupportTicket, showToast } = useApp();
  const [showNewTicketModal, setShowNewTicketModal] = useState<boolean>(false);
  const [ticketTitleInput, setTicketTitleInput] = useState<string>('');

  const handleCreateTicket = () => {
    if (ticketTitleInput.trim()) {
      createSupportTicket(ticketTitleInput.trim());
      setTicketTitleInput('');
      setShowNewTicketModal(false);
    }
  };

  const handleContactWhatsApp = () => {
    showToast('Connecting to WhatsApp Salon Support...', 'info');
  };

  return (
    <Div className="p-4 px-5 space-y-6 pb-28">
      {/* Header with Clean Spacing */}
      <Div className="flex flex-row items-center justify-between pt-2 pb-1">
        <Button
          type="button"
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
        >
          <ChevronLeft size={24} color="#374151" />
        </Button>
        <H1 className="text-xl font-extrabold text-gray-900 tracking-tight">Support & Help</H1>
        <Div className="w-12" />
      </Div>

      {/* FAQs & Contact Us Quick Section */}
      <Div className="flex flex-row gap-3">
        <Div
          onClick={() => showToast('Frequently Asked Questions (FAQs)', 'info')}
          className="flex-1 bg-white rounded-3xl p-4 border border-purple-100 shadow-xs space-y-1.5 cursor-pointer hover:border-purple-200 transition"
        >
          <Div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex flex-row items-center justify-center">
            <HelpCircle size={20} color="#7c3aed" />
          </Div>
          <H2 className="text-xs font-bold text-gray-900 pt-1">FAQs</H2>
          <P className="text-[10px] font-medium text-gray-400">Find answers to common questions</P>
        </Div>

        <Div
          onClick={handleContactWhatsApp}
          className="flex-1 bg-white rounded-3xl p-4 border border-purple-100 shadow-xs space-y-1.5 cursor-pointer hover:border-purple-200 transition"
        >
          <Div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex flex-row items-center justify-center">
            <PhoneCall size={20} color="#7c3aed" />
          </Div>
          <H2 className="text-xs font-bold text-gray-900 pt-1">Contact Us</H2>
          <P className="text-[10px] font-medium text-gray-400">Call, Email or WhatsApp us</P>
        </Div>
      </Div>

      {/* Support Tickets Section */}
      <Div className="space-y-3 pt-1">
        <H3 className="text-sm font-bold text-gray-900">My Support Tickets</H3>
        <Div className="space-y-3">
          {tickets.map((t) => (
            <Div
              key={t.id}
              className="bg-white rounded-3xl p-4 border border-purple-100 shadow-xs flex flex-row items-center justify-between"
            >
              <Div className="space-y-1">
                <Div className="flex flex-row items-center gap-2">
                  <Span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                    {t.ticketNo}
                  </Span>
                  <H4 className="text-xs font-bold text-gray-900">{t.title}</H4>
                </Div>
                <P className="text-[10px] font-medium text-gray-400">{t.date}</P>
              </Div>

              <Span
                className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                  t.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : t.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {t.status}
              </Span>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Fixed Bottom Create Ticket CTA */}
      <Div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 px-5 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={() => setShowNewTicketModal(true)}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-bold text-xs py-3.5 rounded-2xl shadow-sm transition text-center flex flex-row items-center justify-center gap-2"
        >
          <Plus size={18} color="#ffffff" />
          <Span className="text-white font-bold text-xs">Create New Ticket</Span>
        </Button>
      </Div>

      {/* Create Ticket Modal Overlay */}
      <ModalOverlay isOpen={showNewTicketModal} onClose={() => setShowNewTicketModal(false)}>
        <Div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl self-center">
          <H3 className="text-sm font-bold text-gray-900 text-center">Create Support Ticket</H3>
          <Div className="space-y-1">
            <Span className="text-[11px] font-semibold text-gray-500">
              Issue Subject / Description
            </Span>
            <Input
              type="text"
              placeholder="e.g. Appointment Payment Issue"
              value={ticketTitleInput}
              onChange={(e) => setTicketTitleInput(e.target.value)}
              className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3 text-xs text-gray-900 font-bold"
            />
          </Div>
          <Div className="flex flex-row gap-2.5">
            <Button
              type="button"
              onClick={() => setShowNewTicketModal(false)}
              className="flex-1 py-3 text-xs font-bold border border-gray-200 text-gray-600 rounded-2xl flex flex-row items-center justify-center"
            >
              <Span className="text-gray-600 font-bold text-xs text-center">Cancel</Span>
            </Button>
            <Button
              type="button"
              onClick={handleCreateTicket}
              className="flex-1 py-3 text-xs font-bold bg-[#7C3AED] text-white rounded-2xl shadow-xs flex flex-row items-center justify-center"
            >
              <Span className="text-white font-bold text-xs text-center">Submit Ticket</Span>
            </Button>
          </Div>
        </Div>
      </ModalOverlay>
    </Div>
  );
};
