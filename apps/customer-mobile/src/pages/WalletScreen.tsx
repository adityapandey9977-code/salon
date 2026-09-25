import { ArrowDownLeft, ArrowUpRight, ChevronLeft, Gift, Plus } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, Input, ModalOverlay, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const WalletScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, transactions, addMoneyToWallet, showToast } = useApp();

  const [showAddMoneyModal, setShowAddMoneyModal] = useState<boolean>(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState<boolean>(false);
  const [topupAmountInput, setTopupAmountInput] = useState<string>('1000');
  const [giftCardCodeInput, setGiftCardCodeInput] = useState<string>('');

  const handleTopup = (amt?: number) => {
    const val = amt || Number.parseInt(topupAmountInput, 10);
    if (!Number.isNaN(val) && val > 0) {
      addMoneyToWallet(val);
      setShowAddMoneyModal(false);
    }
  };

  const handleRedeemGiftCard = () => {
    if (giftCardCodeInput.trim()) {
      addMoneyToWallet(500);
      setGiftCardCodeInput('');
      setShowGiftCardModal(false);
      showToast('Gift Card redeemed! Added ₹500 to Wallet', 'success');
    }
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
        <H1 className="text-xl font-extrabold text-gray-900 tracking-tight text-center">Wallet</H1>
        <Div className="w-12" />
      </Div>

      {/* Wallet Balance Hero Card */}
      <Div className="bg-[#7C3AED] rounded-3xl p-6 text-white space-y-4 shadow-md relative overflow-hidden">
        <Div className="space-y-1.5">
          <Span className="text-sm font-bold text-white uppercase tracking-wider block">
            Cash Balance
          </Span>

          {/* Unified single-line balance text */}
          <Span className="text-4xl font-black text-white block">
            ₹{user.walletBalance.toLocaleString()}.00
          </Span>

          <Div className="self-start mt-2 inline-flex flex-row items-center gap-1.5 bg-[#064e3b] px-3 py-1 rounded-full border border-emerald-400/40">
            <Span className="text-xs font-bold text-emerald-300">⚡ 1-Click Pay Ready</Span>
          </Div>
        </Div>

        {/* Action Buttons - Clean Single Plus Icon */}
        <Div className="flex flex-row gap-3 pt-2">
          <Button
            type="button"
            onClick={() => setShowAddMoneyModal(true)}
            className="flex-1 bg-white text-purple-900 py-3.5 rounded-2xl text-sm font-extrabold shadow-sm flex flex-row items-center justify-center gap-2"
          >
            <Plus size={18} color="#7c3aed" />
            <Span className="text-[#7C3AED] font-extrabold text-sm text-center">Add Money</Span>
          </Button>
          <Button
            type="button"
            onClick={() => setShowGiftCardModal(true)}
            className="flex-1 bg-white/20 text-white py-3.5 rounded-2xl text-sm font-extrabold flex flex-row items-center justify-center gap-2"
          >
            <Gift size={18} color="#ffffff" />
            <Span className="text-white font-extrabold text-xs text-center">Voucher</Span>
          </Button>
        </Div>
      </Div>

      {/* Recent Transactions List */}
      <Div className="space-y-3.5 pt-1">
        <H2 className="text-base font-extrabold text-gray-900">Recent Transactions</H2>
        <Div className="space-y-3.5">
          {transactions.map((tx) => (
            <Div
              key={tx.id}
              className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs flex flex-row items-center justify-between"
            >
              <Div className="flex flex-row items-center gap-4">
                <Div
                  className={`w-12 h-12 rounded-2xl flex flex-row items-center justify-center ${tx.type === 'credit'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                    }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft size={22} color="#059669" />
                  ) : (
                    <ArrowUpRight size={22} color="#e11d48" />
                  )}
                </Div>
                <Div className="space-y-1">
                  <H3 className="text-sm font-bold text-gray-900">{tx.title}</H3>
                  <P className="text-xs font-medium text-gray-500">{tx.date}</P>
                </Div>
              </Div>

              <Span
                className={`text-sm font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
              >
                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
              </Span>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Add Money Modal */}
      <ModalOverlay isOpen={showAddMoneyModal} onClose={() => setShowAddMoneyModal(false)}>
        <Div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl self-center">
          <H3 className="text-sm font-extrabold text-gray-900 text-center">Add Money to Wallet</H3>
          <Div className="space-y-1">
            <Span className="text-[11px] font-semibold text-gray-500">Enter Amount (₹)</Span>
            <Input
              type="number"
              value={topupAmountInput}
              onChange={(e) => setTopupAmountInput(e.target.value)}
              className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-sm font-bold text-gray-900"
            />
          </Div>
          {/* Presets - Flex 1 Equal Width */}
          <Div className="flex flex-row gap-2">
            {[500, 1000, 2000].map((amt) => (
              <Button
                key={amt}
                type="button"
                onClick={() => handleTopup(amt)}
                className="flex-1 py-3 bg-purple-100 border border-purple-300 rounded-2xl text-xs font-bold text-purple-800 text-center flex flex-row items-center justify-center"
              >
                <Span className="text-purple-800 font-bold text-xs text-center">+₹{amt}</Span>
              </Button>
            ))}
          </Div>
          <Div className="flex flex-row gap-2.5 pt-1">
            <Button
              type="button"
              onClick={() => setShowAddMoneyModal(false)}
              className="flex-1 py-3.5 text-xs font-bold border border-gray-200 text-gray-600 rounded-2xl flex flex-row items-center justify-center"
            >
              <Span className="text-gray-600 font-bold text-xs text-center">Cancel</Span>
            </Button>
            <Button
              type="button"
              onClick={() => handleTopup()}
              className="flex-1 py-3.5 text-xs font-bold bg-[#7C3AED] text-white rounded-2xl shadow-xs flex flex-row items-center justify-center"
            >
              <Span className="text-white font-bold text-xs text-center">Proceed Pay</Span>
            </Button>
          </Div>
        </Div>
      </ModalOverlay>

      {/* Redeem Voucher Modal */}
      <ModalOverlay isOpen={showGiftCardModal} onClose={() => setShowGiftCardModal(false)}>
        <Div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl self-center">
          <H3 className="text-sm font-extrabold text-gray-900 text-center">Redeem Gift Voucher</H3>
          <Input
            type="text"
            placeholder="Enter voucher code (e.g. GIFT500)"
            value={giftCardCodeInput}
            onChange={(e) => setGiftCardCodeInput(e.target.value)}
            className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-xs text-gray-900 uppercase font-bold"
          />
          <Div className="flex flex-row gap-2.5">
            <Button
              type="button"
              onClick={() => setShowGiftCardModal(false)}
              className="flex-1 py-3.5 text-xs font-bold border border-gray-200 text-gray-600 rounded-2xl flex flex-row items-center justify-center"
            >
              <Span className="text-gray-600 font-bold text-xs text-center">Cancel</Span>
            </Button>
            <Button
              type="button"
              onClick={handleRedeemGiftCard}
              className="flex-1 py-3.5 text-xs font-bold bg-[#7C3AED] text-white rounded-2xl shadow-xs flex flex-row items-center justify-center"
            >
              <Span className="text-white font-bold text-xs text-center">Redeem</Span>
            </Button>
          </Div>
        </Div>
      </ModalOverlay>
    </Div>
  );
};
