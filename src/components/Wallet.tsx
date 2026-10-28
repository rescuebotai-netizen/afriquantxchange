import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet as WalletIcon, Send, ArrowDownToLine, ArrowUpFromLine, RefreshCw, 
  CreditCard, Bitcoin, Image as ImageIcon, Briefcase, BrainCircuit,
  ChevronRight, Plus, ShieldCheck, Activity, ArrowRightLeft, QrCode,
  Landmark, Smartphone, TrendingUp, Search, Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

import { CardSystem } from './CardSystem';

const assetData = [
  { name: 'Cash (Fiat)', value: 45000, color: '#3b82f6', icon: Landmark },
  { name: 'Investments (Equity)', value: 124500, color: '#10b981', icon: Briefcase },
  { name: 'Crypto', value: 32000, color: '#8b5cf6', icon: Bitcoin },
  { name: 'NFTs', value: 15000, color: '#f59e0b', icon: ImageIcon },
];

const recentTransactions = [
  { id: 1, type: 'deposit', title: 'Bank Deposit', amount: '+$5,000.00', asset: 'USD', date: 'Today, 10:24 AM', status: 'completed' },
  { id: 2, type: 'convert', title: 'Converted USD to ETH', amount: '$1,200.00', asset: 'ETH', date: 'Yesterday', status: 'completed' },
  { id: 3, type: 'invest', title: 'Invested in Naspers', amount: '-$10,000.00', asset: 'Equity', date: 'Oct 15, 2025', status: 'completed' },
  { id: 4, type: 'send', title: 'Sent to @SarahO', amount: '-$450.00', asset: 'USDC', date: 'Oct 12, 2025', status: 'completed' },
];

const cards = [
  { id: 'fiat', type: 'Virtual Debit', balance: '$45,000.00', currency: 'USD', number: '**** **** **** 4281', expiry: '12/28', color: 'from-blue-600 to-blue-900' },
  { id: 'crypto', type: 'Crypto Wallet', balance: '2.45 ETH', currency: 'ETH', address: '0x71C...9A23', color: 'from-purple-600 to-purple-900' },
  { id: 'invest', type: 'Investment Portfolio', balance: '$124,500.00', currency: 'USD', address: 'NXG-INV-9921', color: 'from-emerald-600 to-emerald-900' },
];

const walletAccounts = [
  { id: 'zar', name: 'ZAR Wallet', type: 'cash', balance: 'R 245,890.00', usdValue: 13200, icon: Landmark, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'usd', name: 'USD Wallet', type: 'cash', balance: '$ 31,800.00', usdValue: 31800, icon: Landmark, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'btc', name: 'Bitcoin', type: 'crypto', balance: '0.45 BTC', usdValue: 28000, icon: Bitcoin, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'eth', name: 'Ethereum', type: 'crypto', balance: '2.4 ETH', usdValue: 4000, icon: Bitcoin, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'ngx', name: 'AQX Investment', type: 'equity', balance: '850 Shares', usdValue: 80000, icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'naspers', name: 'Naspers Equity', type: 'equity', balance: '1,200 Shares', usdValue: 44500, icon: Briefcase, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { id: 'nft1', name: 'African Digital Art', type: 'nft', balance: '1 Item', usdValue: 15000, icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

const assetTabs = [
  { id: 'all', label: 'All Assets' },
  { id: 'cash', label: 'Cash' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'equity', label: 'Equity' },
  { id: 'nft', label: 'NFTs' }
];

export function Wallet({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [activeCard, setActiveCard] = useState(0);
  const [showActionModal, setShowActionModal] = useState<string | null>(null);
  const [activeAssetTab, setActiveAssetTab] = useState('all');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('monthly');
  const [showCardSystem, setShowCardSystem] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalNetWorth, setTotalNetWorth] = useState(0);
  const [walletAccountsState, setWalletAccountsState] = useState(walletAccounts);
  
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [dbTransactions, setDbTransactions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const WITHDRAWAL_LIMIT = 50000;
  const WITHDRAWAL_THRESHOLD = 10000;

  useEffect(() => {
    fetchWalletData();

    if (!isSupabaseConfigured) return;

    try {
      const channel = supabase
        .channel('public:wallets')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => {
          fetchWalletData();
        })
        .subscribe();

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch (e) {}
      };
    } catch (e) {
      console.warn('Realtime channel unavailable:', e);
    }
  }, []);

  const fetchWalletData = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

    const { data: wallets } = await supabase
      .from('wallets')
      .select('*')
      .eq('profile_id', user.id);

    let cashTotal = 0;
    if (wallets) {
      const usdWallet = wallets.find(w => w.currency === 'USD');
      cashTotal = Number(usdWallet?.balance || 0);
      setTotalBalance(cashTotal);
      
      // Update the USD wallet balance in the UI
      const updatedAccounts = walletAccounts.map(acc => {
        if (acc.id === 'usd') {
          return {
            ...acc,
            balance: `$ ${cashTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            usdValue: cashTotal
          };
        }
        return acc;
      });
      setWalletAccountsState(updatedAccounts);
    }

    // Fetch Portfolio Items to calculate real net worth
    const { data: portfolio } = await supabase
      .from('portfolio_items')
      .select(`
        quantity, 
        average_buy_price, 
        assets ( current_price )
      `)
      .eq('profile_id', user.id);

    let portfolioTotal = 0;
    if (portfolio) {
      portfolioTotal = portfolio.reduce((sum, item) => {
        // Use current price if available, otherwise fallback to average buy price
        const currentPrice = (item.assets as any)?.current_price || item.average_buy_price;
        return sum + (Number(item.quantity) * Number(currentPrice));
      }, 0);
    }

    setTotalNetWorth(cashTotal + portfolioTotal);

    // Fetch transactions from DB
    try {
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (txs && txs.length > 0) {
        const formattedTxs = txs.map(t => ({
          id: t.id,
          type: t.type,
          title: t.type === 'deposit' ? 'Bank Deposit' :
                 t.type === 'withdrawal' ? 'Bank Withdrawal' :
                 t.type === 'trade' ? `Asset Trade (${t.reference})` :
                 t.type === 'investment' ? `Investment (${t.reference})` :
                 t.reference || 'Transaction',
          amount: (Number(t.amount) >= 0 ? '+' : '-') + '$' + Math.abs(Number(t.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          asset: t.metadata?.currency || 'USD',
          date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: t.status || 'completed'
        }));
        setDbTransactions(formattedTxs);
      }
    } catch (err) {
      console.warn("Failed to load db transactions:", err);
    }
    } catch (err) {
      console.warn("Failed to fetch wallet data:", err);
    }
  };

  const handleDepositSubmit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login first");
        return;
      }

      const response = await fetch('/api/trade/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: amt,
          currency: 'USD'
        })
      });

      if (response.ok) {
        setShowActionModal(null);
        setDepositAmount('');
        fetchWalletData();
      } else {
        const errData = await response.json();
        alert(errData.error || "Deposit failed");
      }
    } catch (error) {
      console.warn("Error depositing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) return;
    if (amt > WITHDRAWAL_LIMIT) {
      alert(`Withdrawal limit is $${WITHDRAWAL_LIMIT}`);
      return;
    }

    if (amt > WITHDRAWAL_THRESHOLD && !showWithdrawConfirmation) {
      setShowWithdrawConfirmation(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login first");
        return;
      }

      const response = await fetch('/api/trade/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: amt,
          currency: 'USD'
        })
      });

      if (response.ok) {
        setShowWithdrawConfirmation(false);
        setShowActionModal(null);
        setWithdrawAmount('');
        fetchWalletData();
      } else {
        const errData = await response.json();
        alert(errData.error || "Withdrawal failed");
      }
    } catch (error) {
      console.warn("Error withdrawing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmWithdrawal = () => {
    handleWithdrawSubmit();
  };

  const filteredAccounts = walletAccountsState.filter(acc => activeAssetTab === 'all' || acc.type === activeAssetTab);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWalletData();
    setIsRefreshing(false);
  };

  if (showCardSystem) {
    return <CardSystem onBack={() => setShowCardSystem(false)} />;
  }

  return (
    <motion.div 
      className="space-y-8 relative"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset }) => {
        if (offset.y > 100 && !isRefreshing) {
          handleRefresh();
        }
      }}
    >
      {/* Pull to Refresh Indicator */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 -top-12 flex items-center justify-center w-10 h-10 bg-zinc-800 rounded-full shadow-lg border border-zinc-700 z-50"
        animate={{ 
          y: isRefreshing ? 60 : 0,
          rotate: isRefreshing ? 360 : 0,
          opacity: isRefreshing ? 1 : 0
        }}
        transition={{ 
          y: { type: "spring", stiffness: 300, damping: 20 },
          rotate: { repeat: isRefreshing ? Infinity : 0, duration: 1, ease: "linear" }
        }}
      >
        <RefreshCw className="w-5 h-5 text-blue-400" />
      </motion.div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">NXG Wallet</h1>
          <p className="text-zinc-400 mt-1">The Intelligent Multi-Asset Financial Operating System.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Secured & Encrypted
        </div>
      </div>

      {/* Top Section: Total Balance & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Net Worth */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between"
        >
          
          <div>
            <p className="text-zinc-400 font-medium mb-2 flex items-center gap-2">
              Total Net Worth
            </p>
            <h2 className="text-5xl font-bold text-white tracking-tight mb-2">
              ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +5.2% All Time
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mt-8">
            {[
              { id: 'send', icon: Send, label: 'Send' },
              { id: 'deposit', icon: ArrowDownToLine, label: 'Deposit' },
              { id: 'withdraw', icon: ArrowUpFromLine, label: 'Withdraw' },
              { id: 'convert', icon: RefreshCw, label: 'Convert' },
            ].map((action) => (
              <button 
                key={action.id}
                onClick={() => setShowActionModal(action.id)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-zinc-300">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Swipeable Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative h-full min-h-[300px] flex items-center justify-center perspective-1000"
        >
          <div className="w-full max-w-md relative h-56">
            {cards.map((card, index) => {
              const isActive = index === activeCard;
              const offset = index - activeCard;
              const zIndex = 10 - Math.abs(offset);
              const scale = isActive ? 1 : 0.92;
              const translateX = offset * 110; // 110% width
              const opacity = Math.abs(offset) > 1 ? 0 : 1;
              const blur = isActive ? 'blur(0px)' : 'blur(4px)';

              return (
                <motion.div
                  key={card.id}
                  className="absolute inset-0 cursor-pointer"
                  style={{ zIndex }}
                  animate={{ 
                    scale, 
                    x: `${translateX}%`, 
                    opacity,
                    filter: blur
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => {
                    if (isActive) {
                      setShowCardSystem(true);
                    } else {
                      setActiveCard(index);
                    }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    if (swipe < -50 && activeCard < cards.length - 1) {
                      setActiveCard(activeCard + 1);
                    } else if (swipe > 50 && activeCard > 0) {
                      setActiveCard(activeCard - 1);
                    }
                  }}
                >
                  <div className={`w-full h-full rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-br ${card.color} shadow-2xl border border-white/20 overflow-hidden relative`}>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className="text-white/70 text-sm font-medium flex items-center gap-2">
                          {card.type}
                          {isActive && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Tap to manage</span>}
                        </p>
                        <h3 className="text-3xl font-bold text-white mt-1">{card.balance}</h3>
                      </div>
                      {card.id === 'fiat' ? (
                        <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-bold italic text-xs">VISA</span>
                        </div>
                      ) : card.id === 'crypto' ? (
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Bitcoin className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10">
                      {card.id === 'fiat' ? (
                        <div className="flex justify-between items-end">
                          <p className="text-white/90 font-mono tracking-widest">{card.number}</p>
                          <p className="text-white/70 text-sm">{card.expiry}</p>
                        </div>
                      ) : card.id === 'crypto' ? (
                        <div className="flex justify-between items-end">
                          <p className="text-white/90 font-mono text-sm">{card.address}</p>
                          <p className="text-white/70 text-sm">Network: ERC20</p>
                        </div>
                      ) : (
                        <div className="flex justify-between items-end">
                          <p className="text-white/90 font-mono text-sm">{card.address}</p>
                          <p className="text-white/70 text-sm">Status: Active</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Card Indicators */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {cards.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveCard(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === activeCard ? 'bg-blue-500 w-6' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wallet Accounts List & Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-white">Wallet Accounts</h2>
          <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full scrollbar-hide">
            {assetTabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveAssetTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeAssetTab === tab.id ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.bg} ${account.color} group-hover:scale-110 transition-transform`}>
                  <account.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{account.name}</p>
                  <p className="text-xs text-zinc-500 capitalize">{account.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{account.balance}</p>
                <p className="text-xs text-zinc-500">${account.usdValue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Middle Section: AI Insights & Asset Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Financial Brain */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <BrainCircuit className="w-48 h-48 text-blue-500" />
          </div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">NXG AI Brain</h2>
              <p className="text-sm text-blue-400">Real-time smart decisions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div className="bg-black/20 border border-white/5 rounded-2xl p-5 backdrop-blur-md hover:bg-black/30 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Idle Cash Detected</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-3">You are holding $45,000 in cash. Inflation is currently 4.2%.</p>
                  <button className="text-sm font-medium text-amber-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Move $10k to High-Yield <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-5 backdrop-blur-md hover:bg-black/30 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Crypto Volatility Alert</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-3">ETH is up 12% this week. Consider taking profits.</p>
                  <button className="text-sm font-medium text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Convert 1 ETH to USDC <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Asset Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Asset Allocation</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-2xl font-bold text-white">4</span>
              <span className="text-xs text-zinc-500">Asset Types</span>
            </div>
          </div>
          <div className="mt-4 space-y-3 flex-1 overflow-y-auto pr-2">
            {assetData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-zinc-300 font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium block">${item.value.toLocaleString()}</span>
                  <span className="text-xs text-zinc-500">{Math.round((item.value / totalNetWorth) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Recent Transactions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <button onClick={() => setActiveTab('portfolio')} className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          {(dbTransactions.length > 0 ? dbTransactions : recentTransactions).map((tx) => (
            <motion.div 
              key={tx.id} 
              className="relative overflow-hidden flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.04] transition-colors group cursor-pointer border border-transparent hover:border-white/5"
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('div');
                ripple.className = 'absolute rounded-full bg-white/20 pointer-events-none animate-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.width = '100px';
                ripple.style.height = '100px';
                ripple.style.transform = 'translate(-50%, -50%) scale(0)';
                
                e.currentTarget.appendChild(ripple);
                
                setTimeout(() => {
                  ripple.remove();
                }, 600);
              }}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' :
                  tx.type === 'withdrawal' ? 'bg-red-500/10 text-red-400' :
                  tx.type === 'convert' ? 'bg-blue-500/10 text-blue-400' :
                  tx.type === 'invest' || tx.type === 'trade' || tx.type === 'investment' ? 'bg-purple-500/10 text-purple-400' :
                  'bg-zinc-500/10 text-zinc-400'
                }`}>
                  {tx.type === 'deposit' ? <ArrowDownToLine className="w-5 h-5" /> :
                   tx.type === 'withdrawal' ? <ArrowDownToLine className="w-5 h-5 rotate-180 text-red-400" /> :
                   tx.type === 'convert' ? <RefreshCw className="w-5 h-5" /> :
                   tx.type === 'invest' || tx.type === 'trade' || tx.type === 'investment' ? <Briefcase className="w-5 h-5" /> :
                   <Send className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{tx.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{tx.date} • {tx.asset}</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.amount}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 capitalize">{tx.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Modals (Simplified for prototype) */}
      <AnimatePresence>
        {showActionModal && (
          <motion.div 
            key="action-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              onClick={() => setShowActionModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white capitalize">{showActionModal}</h2>
                <button onClick={() => setShowActionModal(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              {showActionModal === 'send' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="text" placeholder="Search / @Username / QR" className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-10 py-3.5 text-white focus:border-blue-500/50 outline-none transition-colors" />
                    <QrCode className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 hover:text-white cursor-pointer" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Select Asset</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-blue-500/50 transition-colors appearance-none">
                      <option className="bg-[#0a0a0f]">ZAR Wallet (R 245,890.00)</option>
                      <option className="bg-[#0a0a0f]">BTC Wallet (0.45 BTC)</option>
                      <option className="bg-[#0a0a0f]">AQX Equity (850 Shares)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</label>
                    <div className="relative">
                      <input type="number" placeholder="0.00" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-blue-500/50 transition-colors text-xl font-medium" />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400 hover:text-blue-300">MAX</button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-400 font-medium">Auto-detecting best route (low fees)...</p>
                      <p className="text-xs text-blue-300/70 mt-1">Est. Network Fee: $0.50 | ETA: Instant</p>
                    </div>
                  </div>

                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold mt-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                    Confirm Transfer
                  </button>
                </div>
              )}

              {showActionModal === 'deposit' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Select Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setActiveTab('trade')} className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium flex flex-col items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Card
                      </button>
                      <button onClick={() => setActiveTab('trade')} className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium flex flex-col items-center gap-2">
                        <Landmark className="w-5 h-5" /> Bank
                      </button>
                      <button onClick={() => setActiveTab('trade')} className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium flex flex-col items-center gap-2">
                        <Bitcoin className="w-5 h-5" /> Crypto
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input type="text" placeholder="Card Number" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-blue-500/50 transition-colors" />
                    <div className="flex gap-3">
                      <input type="text" placeholder="MM/YY" className="w-1/2 bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-blue-500/50 transition-colors" />
                      <input type="text" placeholder="CVC" className="w-1/2 bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount to Deposit</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white outline-none focus:border-blue-500/50 transition-colors text-xl font-medium" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Recurring Deposit</h4>
                        <p className="text-xs text-zinc-400">Automate your investments</p>
                      </div>
                      <button 
                        onClick={() => setIsRecurring(!isRecurring)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isRecurring ? 'bg-blue-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isRecurring ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {isRecurring && (
                      <div className="grid grid-cols-3 gap-2">
                        {['weekly', 'biweekly', 'monthly'].map((interval) => (
                          <button
                            key={interval}
                            onClick={() => setRecurringInterval(interval)}
                            className={`p-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                              recurringInterval === interval 
                                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' 
                                : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {interval}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleDepositSubmit}
                    disabled={isSubmitting || !depositAmount || parseFloat(depositAmount) <= 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold mt-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : (isRecurring ? `Schedule ${recurringInterval} Deposit` : 'Deposit Now')}
                  </button>
                </div>
              )}

              {showActionModal === 'withdraw' && !showWithdrawConfirmation && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Select Destination</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-blue-500/50 transition-colors appearance-none">
                      <option className="bg-[#0a0a0f]">Linked Bank Account (...4829)</option>
                      <option className="bg-[#0a0a0f]">External Crypto Wallet</option>
                      <option className="bg-[#0a0a0f]">Debit Card (...4281)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount to Withdraw</label>
                      <span className="text-xs text-zinc-400">Daily Limit: ${WITHDRAWAL_LIMIT.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-16 py-3.5 text-white outline-none focus:border-blue-500/50 transition-colors text-xl font-medium" 
                      />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400 hover:text-blue-300">MAX</button>
                    </div>
                    {parseFloat(withdrawAmount) > WITHDRAWAL_LIMIT && (
                      <p className="text-xs text-red-400 mt-1">Amount exceeds daily withdrawal limit.</p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Withdrawal Fee</span>
                      <span className="text-white font-medium">$2.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Processing Time</span>
                      <span className="text-white font-medium">1-2 Business Days</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleWithdrawSubmit}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > WITHDRAWAL_LIMIT}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold mt-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}

              {showActionModal === 'withdraw' && showWithdrawConfirmation && (
                <div className="space-y-5">
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">High Value Transfer</h3>
                    <p className="text-sm text-zinc-400">
                      You are about to withdraw <span className="text-white font-bold">${parseFloat(withdrawAmount).toLocaleString()}</span>. 
                      This exceeds the standard threshold and requires confirmation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-400/90">
                      For your security, withdrawals over ${WITHDRAWAL_THRESHOLD.toLocaleString()} may be subject to additional manual review by our compliance team.
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => setShowWithdrawConfirmation(false)}
                      className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={confirmWithdrawal}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}

              {showActionModal === 'convert' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 focus-within:border-blue-500/50 transition-colors">
                    <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">From</label>
                    <div className="flex justify-between items-center mt-2">
                      <select className="bg-transparent text-white font-bold text-xl outline-none appearance-none cursor-pointer">
                        <option className="bg-[#0a0a0f]">BTC (Bitcoin)</option>
                        <option className="bg-[#0a0a0f]">USD Cash</option>
                        <option className="bg-[#0a0a0f]">Naspers Equity</option>
                      </select>
                      <input type="text" placeholder="0.00" className="bg-transparent text-right text-2xl font-medium text-white outline-none w-1/2" />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">Balance: 0.45 BTC</p>
                  </div>
                  
                  <div className="flex justify-center -my-3 relative z-10">
                    <button className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center border-4 border-[#0a0a0f] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                      <ArrowRightLeft className="w-4 h-4 text-white rotate-90" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 focus-within:border-blue-500/50 transition-colors">
                    <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">To</label>
                    <div className="flex justify-between items-center mt-2">
                      <select className="bg-transparent text-white font-bold text-xl outline-none appearance-none cursor-pointer">
                        <option className="bg-[#0a0a0f]">AQX Equity</option>
                        <option className="bg-[#0a0a0f]">ETH</option>
                        <option className="bg-[#0a0a0f]">USD Cash</option>
                      </select>
                      <input type="text" placeholder="0.00" className="bg-transparent text-right text-2xl font-medium text-white outline-none w-1/2" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Exchange Rate</span>
                    <span className="text-white font-medium">1 BTC = 350 AQX Shares</span>
                  </div>

                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold mt-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                    Convert Now
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
