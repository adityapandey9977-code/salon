import { useToast } from '@salon-spa-saas/ui';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  History,
  Plus,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function WalletPage() {
  const { toast } = useToast();
  const transactionsRef = useRef<HTMLDivElement>(null);

  const [walletBalance, setWalletBalance] = useState(2450);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('1000');

  // Wallet Overview Data (4 Fields)
  const walletOverview = {
    walletBalance: `₹${walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    lastRecharge: '₹2,000.00 on Aug 01, 2026',
    lastUsed: '₹500.00 on Aug 05, 2026',
    expiry: 'Never Expires',
  };

  // Master Transactions State (5 Columns: Date, Credit, Debit, Balance, Description)
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-901',
      date: '2026-08-05 04:15 PM',
      credit: '+ ₹500.00',
      debit: '-',
      balance: '₹2,450.00',
      description: 'Deposit Refund for Cancelled Visit (APT-901)',
    },
    {
      id: 'TXN-892',
      date: '2026-08-01 11:30 AM',
      credit: '+ ₹2,000.00',
      debit: '-',
      balance: '₹1,950.00',
      description: 'Wallet Recharge via UPI (GPay Payment)',
    },
    {
      id: 'TXN-882',
      date: '2026-07-20 02:45 PM',
      credit: '-',
      debit: '- ₹5,500.00',
      balance: '₹950.00',
      description: 'Service Payment for Balayage Color & Gloss',
    },
    {
      id: 'TXN-870',
      date: '2026-07-20 02:46 PM',
      credit: '+ ₹550.00',
      debit: '-',
      balance: '₹6,450.00',
      description: 'Gold Member 10% Automated Cashback Bonus',
    },
  ]);

  const scrollToTransactions = () => {
    transactionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    toast('Transaction History: Showing full digital wallet transaction ledger.');
  };

  const handleConfirmTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const addVal = Number.parseInt(topUpAmount) || 0;
    if (addVal <= 0) return;

    const newBal = walletBalance + addVal;
    setWalletBalance(newBal);

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newTxn = {
      id: `TXN-${Math.floor(900 + Math.random() * 90)}`,
      date: nowStr,
      credit: `+ ₹${addVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      debit: '-',
      balance: `₹${newBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      description: 'Instant Wallet Top-Up via NetBanking / UPI',
    };

    setTransactions([newTxn, ...transactions]);
    setIsTopUpModalOpen(false);
    toast(
      `Wallet Recharge Successful: ₹${addVal.toLocaleString()} added. New Balance: ₹${newBal.toLocaleString()}.`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & 2 ACTION BUTTONS (Add Money & View Transactions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Customer Digital Wallet
          </h1>
          <p className="text-xs text-soft mt-1">
            Manage prepaid funds, view instant cashbacks, and track detailed credit/debit
            transaction logs.
          </p>
        </div>

        {/* 2 ACTION BUTTONS REQUESTED BY USER */}
        <div className="flex flex-wrap gap-2 self-start md:self-auto">
          {/* Button 1: Add Money */}
          <button
            onClick={() => setIsTopUpModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Add Money
          </button>

          {/* Button 2: View Transactions */}
          <button
            onClick={scrollToTransactions}
            className="flex items-center gap-1.5 px-4 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <History className="w-4 h-4 text-purple-600" />
            View Transactions
          </button>
        </div>
      </div>

      {/* WALLET OVERVIEW CARDS - ALL 4 SPECIFIED FIELDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Wallet Balance */}
        <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
            1. Wallet Balance
          </span>
          <div className="text-2xl font-bold text-white tracking-tight">
            {walletOverview.walletBalance}
          </div>
          <div className="text-[11px] text-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 1-Click Pay Ready
          </div>
        </div>

        {/* Card 2: Last Recharge */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
            2. Last Recharge
          </span>
          <div className="text-base font-bold text-emerald-700">{walletOverview.lastRecharge}</div>
          <div className="text-[11px] text-soft">Recharged via UPI</div>
        </div>

        {/* Card 3: Last Used */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
            3. Last Used
          </span>
          <div className="text-base font-bold text-rose-700">{walletOverview.lastUsed}</div>
          <div className="text-[11px] text-soft">Appointment Deposit</div>
        </div>

        {/* Card 4: Expiry */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
            4. Expiry
          </span>
          <div className="text-base font-bold text-purple-700">{walletOverview.expiry}</div>
          <div className="text-[11px] text-soft">No Funds Annual Decay</div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE - ALL 5 SPECIFIED COLUMNS */}
      <div
        ref={transactionsRef}
        className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden space-y-3"
      >
        <div className="p-4 border-b border-line flex justify-between items-center">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" /> Wallet Transactions Ledger
          </h3>
          <button
            onClick={() =>
              toast('Export Statement: Wallet transaction statement downloaded (PDF/CSV).')
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export Statement
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Date</th>
                <th className="p-3">Credit</th>
                <th className="p-3">Debit</th>
                <th className="p-3">Balance</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-purple-50/30 transition-colors">
                  {/* 1. Date */}
                  <td className="p-3 font-medium text-soft">{t.date}</td>

                  {/* 2. Credit */}
                  <td className="p-3 font-bold text-emerald-700">
                    {t.credit !== '-' ? t.credit : '-'}
                  </td>

                  {/* 3. Debit */}
                  <td className="p-3 font-bold text-rose-700">{t.debit !== '-' ? t.debit : '-'}</td>

                  {/* 4. Balance */}
                  <td className="p-3 font-bold text-ink">{t.balance}</td>

                  {/* 5. Description */}
                  <td className="p-3 font-medium text-ink">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MONEY TOP-UP MODAL (createPortal) */}
      {isTopUpModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-5 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Recharge Digital Wallet
                  </h3>
                  <p className="text-xs text-soft">
                    Instant funds addition via UPI, Credit/Debit Card &amp; NetBanking
                  </p>
                </div>
                <button
                  onClick={() => setIsTopUpModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmTopUp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1.5">
                    Enter Top-Up Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full p-3 bg-paper/30 border border-line rounded-xl font-bold text-base text-ink outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* Quick Amount Chips */}
                <div className="flex gap-2">
                  {['500', '1000', '2500', '5000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className="flex-1 py-1.5 bg-pine/10 hover:bg-purple-100 text-ink text-xs font-bold rounded-xl border border-line cursor-pointer transition-all"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Automated Cashback Offer:
                  </div>
                  <p className="text-[11px]">
                    Recharge ₹2,000 or more to get instant ₹200 bonus cashback added to your wallet!
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsTopUpModalOpen(false)}
                    className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
