import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  DollarSign, 
  PieChart, 
  Zap,
  BrainCircuit,
  Store,
  Briefcase,
  ChevronRight,
  Send,
  SlidersHorizontal,
  Globe,
  ArrowRightLeft,
  BarChart3,
  CheckCircle2,
  Bell,
  Newspaper,
  TrendingDown,
  Settings,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { motion } from 'motion/react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const data = [
  { name: 'Jan', value: 40000, investment: 20000 },
  { name: 'Feb', value: 30000, investment: 20000 },
  { name: 'Mar', value: 50000, investment: 30000 },
  { name: 'Apr', value: 45000, investment: 30000 },
  { name: 'May', value: 60000, investment: 40000 },
  { name: 'Jun', value: 55000, investment: 40000 },
  { name: 'Jul', value: 124500, investment: 80000 },
];

const initialRecentActivity = [
  { id: 1, type: 'buy', title: 'Invested in Naspers', amount: '$60,000.00', equity: '+1.25%', date: '2h ago' },
  { id: 2, type: 'dividend', title: 'Standard Bank Q2 Payout', amount: '+$1,240.50', equity: '-', date: '1d ago' },
  { id: 3, type: 'trade', title: 'Sold 500 MTN Shares', amount: '+$105,250.00', equity: '-0.1%', date: '2d ago' },
  { id: 4, type: 'invest', title: 'Dangote Cement RevShare Contract', amount: '$22,000.00', equity: '+0.4%', date: '3d ago' },
];

export function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [recentActivity, setRecentActivity] = useState<any[]>(initialRecentActivity);
  const [aiTone, setAiTone] = useState<'formal' | 'simplified'>('formal');
  const [askAi, setAskAi] = useState('');
  const [showCustomizeAlerts, setShowCustomizeAlerts] = useState(false);
  const [marketIndices, setMarketIndices] = useState<any[]>([]);
  const [alertSettings, setAlertSettings] = useState({
    priceMovement: 5,
    newsSentiment: 'high',
    insiderActivity: true
  });
  const [totalBalance, setTotalBalance] = useState(124500); // Default mock balance

  // Fetch live market data from Massive API integration
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market/massive/data');
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            if (result.data) {
              setMarketIndices(result.data);
            }
          } else {
            console.warn("Failed to fetch market data: Response is not JSON format");
          }
        } else {
          console.warn(`Failed to fetch market data: HTTP status ${response.status}`);
        }
      } catch (error) {
        console.warn("Failed to fetch market data:", error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isSupabaseConfigured) {
        setRecentActivity(initialRecentActivity);
        return;
      }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setRecentActivity(initialRecentActivity);
          return;
        }

        // Fetch Wallets for Total Balance
        const { data: wallets } = await supabase
          .from('wallets')
          .select('balance, currency')
          .eq('profile_id', user.id);
        
        if (wallets) {
          // Only sum USD wallet to prevent mixing different currencies (e.g., USD and NGN)
          const usdWallet = wallets.find(w => w.currency === 'USD');
          if (usdWallet) {
            setTotalBalance(Number(usdWallet.balance));
          }
        }

        // Fetch Transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);

        if (transactions && transactions.length > 0) {
          const formatted = transactions.map(t => ({
            id: t.id,
            type: t.type === 'deposit' || t.type === 'withdrawal' ? 'dividend' : 
                  t.type === 'trade' ? 'trade' : 'invest',
            title: t.reference || 'Transaction',
            amount: Number(t.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            equity: '-',
            date: new Date(t.created_at).toLocaleString()
          }));
          setRecentActivity(formatted);
        } else {
          setRecentActivity(initialRecentActivity);
        }
      } catch (err) {
        console.warn('Dashboard Supabase fetch error:', err);
        setRecentActivity(initialRecentActivity);
      }
    };

    fetchDashboardData();

    if (!isSupabaseConfigured) return;

    try {
      const channel = supabase
        .channel('public:dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
          fetchDashboardData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => {
          fetchDashboardData();
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

  return (
    <div className="space-y-8 bg-black text-white">
      {/* Top Row: Portfolio & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Identity Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 relative overflow-hidden rounded-3xl bg-black border border-white/10 p-8 group hover:border-[#FFFFFF]/40 transition-colors shadow-2xl"
        >
          <div className="relative z-10 space-y-8">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#FFFFFF]" />
                Multi-Asset Portfolio
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold font-mono text-white tracking-tight">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <span className="text-[#FFFFFF] text-xs font-bold uppercase tracking-wider flex items-center bg-[#FFFFFF]/10 px-2.5 py-1 rounded-full border border-[#FFFFFF]/20 shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Active Companies</p>
                <p className="text-xl font-bold font-mono text-white">3</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Q3 Earnings</p>
                <p className="text-xl font-bold font-mono text-[#FFFFFF]">$1,240</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-black border border-white/10 p-8 flex flex-col shadow-2xl hover:border-[#FFFFFF]/40 transition-colors"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <BrainCircuit className="w-32 h-32 text-[#FFFFFF]" />
          </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-2 text-[#FFFFFF] font-bold uppercase tracking-wider text-xs">
              <BrainCircuit className="w-5 h-5" />
              <span>AQX Intelligence</span>
            </div>
            <div className="flex items-center gap-2 bg-black rounded-full p-1 border border-white/10">
              <button 
                onClick={() => setAiTone('formal')}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors ${aiTone === 'formal' ? 'bg-[#FFFFFF] text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Formal
              </button>
              <button 
                onClick={() => setAiTone('simplified')}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors ${aiTone === 'simplified' ? 'bg-[#FFFFFF] text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Simple
              </button>
            </div>
          </div>

          <div className="relative z-10 flex-1">
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
              {aiTone === 'formal' ? 'Portfolio projected to grow 18% this quarter.' : 'You are on track to make 18% more this quarter!'}
            </h3>
            <p className="text-zinc-300 leading-relaxed max-w-xl font-medium">
              {aiTone === 'formal' 
                ? 'Your recent diversification into Technology (Naspers) has optimized your risk profile. Consider increasing exposure to Financials before the Q4 dividend snapshot. The AQX Tech 100 index is also showing strong bullish signals.' 
                : 'Your new investment in Naspers is doing great. It might be a good idea to buy more Standard Bank shares before the next payout. The overall African tech market is also looking very strong right now.'}
            </p>
            
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF]">Low Risk</span>
              </div>
              <button onClick={() => setActiveTab('intelligence-ngx')} className="text-[#FFFFFF] text-xs font-bold uppercase tracking-wider hover:text-white flex items-center gap-1 transition-colors">
                View detailed analysis <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ask AI Input */}
          <div className="mt-6 relative z-10 flex items-center">
            <input 
              type="text"
              value={askAi}
              onChange={(e) => setAskAi(e.target.value)}
              onFocus={() => setActiveTab('intelligence-ngx-assistant')}
              placeholder="Ask AI about your portfolio..."
              className="w-full bg-black border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FFFFFF] transition-colors font-medium"
            />
            <button onClick={() => { if(askAi) setActiveTab('intelligence-ngx-assistant') }} className="absolute right-2 p-2 bg-[#FFFFFF] text-black hover:bg-white rounded-xl transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => setActiveTab('marketplace')} className="p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/40 transition-colors flex flex-col items-center justify-center gap-3 group shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Store className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors">Primary Markets</span>
        </button>
        <button onClick={() => setActiveTab('trade')} className="p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/40 transition-colors flex flex-col items-center justify-center gap-3 group shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <ArrowRightLeft className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors">Secondary Trade</span>
        </button>
        <button onClick={() => setActiveTab('index')} className="p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/40 transition-colors flex flex-col items-center justify-center gap-3 group shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <BarChart3 className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors">AQX Tech 100</span>
        </button>
        <button onClick={() => setActiveTab('portfolio')} className="p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/40 transition-colors flex flex-col items-center justify-center gap-3 group shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Briefcase className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors">Portfolio</span>
        </button>
      </div>

      {/* Global Markets Overview (Live via Massive API - Transparent Background) */}
      {marketIndices.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-transparent border border-white/10 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Globe className="w-4 h-4 text-[#FFFFFF]" />
              Global Markets Overview
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF]">Live via Massive API</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketIndices.map((index) => (
              <div key={index.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex justify-between items-center hover:border-[#FFFFFF]/30 transition-colors">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{index.name}</p>
                  <p className="text-lg font-bold font-mono text-white">{index.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg text-[#FFFFFF] bg-[#FFFFFF]/10 border border-[#FFFFFF]/20">
                  {index.trend === 'up' ? <TrendingUp className="w-3 h-3 text-[#FFFFFF]" /> : <TrendingDown className="w-3 h-3 text-[#FFFFFF]" />}
                  {index.change}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Real-Time Market Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-black border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Bell className="w-5 h-5 text-[#FFFFFF]" />
            Real-Time Market Alerts
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowCustomizeAlerts(true)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#FFFFFF]" /> Customize
            </button>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF] bg-[#FFFFFF]/10 px-2.5 py-1 rounded-lg border border-[#FFFFFF]/20 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse" /> Live
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price Movement Alert */}
          <div className="p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/40 transition-colors relative overflow-hidden flex flex-col group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FFFFFF]" />
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FFFFFF]" />
                <span className="text-sm font-bold text-white">AGRI (Naspers)</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Just now</span>
            </div>
            <p className="text-xs text-zinc-300 mb-3 leading-relaxed font-medium">Unusual volume detected. Price up 4.2% in the last 15 minutes.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-lg font-bold font-mono text-[#FFFFFF]">$14.85</span>
              <button onClick={() => setActiveTab('trade')} className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#FFFFFF] hover:bg-white px-2.5 py-1 rounded-md transition-colors font-mono">Trade Now</button>
            </div>
          </div>

          {/* News Sentiment Alert */}
          <div className="p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/40 transition-colors relative overflow-hidden flex flex-col group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FFFFFF]" />
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-[#FFFFFF]" />
                <span className="text-sm font-bold text-white">LOGI (Dangote Cement)</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">2m ago</span>
            </div>
            <p className="text-xs text-zinc-300 mb-3 leading-relaxed font-medium">News sentiment alert regarding supply chain adjustments in East Africa.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Sentiment Shift</span>
              <button onClick={() => setActiveTab('intelligence-ngx-assistant')} className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#FFFFFF] hover:bg-white px-2.5 py-1 rounded-md transition-colors font-mono">Analyze</button>
            </div>
          </div>

          {/* Insider Activity Alert */}
          <div className="p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/40 transition-colors relative overflow-hidden flex flex-col group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FFFFFF]" />
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#FFFFFF]" />
                <span className="text-sm font-bold text-white">HSYN (Standard Bank)</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">15m ago</span>
            </div>
            <p className="text-xs text-zinc-300 mb-3 leading-relaxed font-medium">Executive purchased 50,000 shares on the open market at $22.40.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFFFFF]">Insider Action</span>
              <button onClick={() => setActiveTab('portfolio')} className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#FFFFFF] hover:bg-white px-2.5 py-1 rounded-md transition-colors font-mono">View Filings</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Graph */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setActiveTab('performance')}
        className="bg-black border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl cursor-pointer hover:border-[#FFFFFF]/40 transition-colors"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Performance</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1">Total value vs. Net investment</p>
          </div>
          <div className="flex bg-black p-1 rounded-xl border border-white/10">
            {['1M', '3M', '6M', '1Y', 'ALL'].map((period, i) => (
              <button 
                key={period} 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(`performance-${period}`);
                }}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${i === 2 ? 'bg-[#FFFFFF] text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} dy={10} className="uppercase tracking-wider font-bold" />
              <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} dx={-10} className="font-mono" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000000', borderColor: '#FFFFFF', borderRadius: '16px', color: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="investment" stroke="rgba(255,255,255,0.4)" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorInvest)" />
              <Area type="monotone" dataKey="value" stroke="#FFFFFF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom Grid: Activity & Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Recent Activity</h2>
            <button onClick={() => setActiveTab('activity')} className="text-zinc-400 hover:text-[#FFFFFF] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#FFFFFF]/30 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border bg-[#FFFFFF]/10 text-[#FFFFFF] border-[#FFFFFF]/20">
                    {activity.type === 'buy' ? <Store className="w-5 h-5" /> :
                     activity.type === 'dividend' ? <DollarSign className="w-5 h-5" /> :
                     activity.type === 'trade' ? <ArrowRightLeft className="w-5 h-5" /> :
                     <Briefcase className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-[#FFFFFF] transition-colors">{activity.title}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-white">{activity.amount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-[#FFFFFF]">
                    {activity.equity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payouts / Dividends */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => setActiveTab('payouts')}
          className="bg-black border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col cursor-pointer hover:border-[#FFFFFF]/40 transition-colors"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Upcoming Payouts</h2>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('payouts');
              }}
              className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-[#FFFFFF] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
          
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('payouts-q4');
            }}
            className="flex-1 flex flex-col justify-center items-center text-center p-6 border border-white/10 rounded-2xl bg-white/[0.02] mb-6 relative overflow-hidden group hover:border-[#FFFFFF]/30 transition-colors"
          >
            <div className="absolute inset-0 bg-[#FFFFFF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-2 relative z-10">Estimated Q4 Dividend</p>
            <h3 className="text-4xl font-bold font-mono text-white tracking-tight mb-4 relative z-10">$450.00</h3>
            <div className="w-full max-w-xs bg-white/10 rounded-full h-2 mb-3 overflow-hidden relative z-10">
              <div className="bg-[#FFFFFF] h-full rounded-full w-[75%] shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 relative z-10">Payout in 14 days (Oct 31, 2026)</p>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/10">
            {/* Timeline Item */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('payouts-q3');
              }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#FFFFFF]/40 bg-black text-[#FFFFFF] shadow-[0_0_15px_rgba(212,175,55,0.2)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle2 className="w-5 h-5 text-[#FFFFFF]" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white">Q3 Payout</h4>
                  <span className="text-xs font-bold font-mono text-[#FFFFFF]">+$320.00</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Jul 31, 2026</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Customize Alerts Modal */}
      {showCustomizeAlerts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-white/10 rounded-3xl p-6 w-full max-w-md relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-[#FFFFFF]" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Settings className="w-5 h-5 text-[#FFFFFF]" />
                Customize Smart Alerts
              </h3>
              <button onClick={() => setShowCustomizeAlerts(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex justify-between">
                  <span>Price Movement Threshold</span>
                  <span className="text-[#FFFFFF]">{alertSettings.priceMovement}%</span>
                </label>
                <input 
                  type="range" 
                  min="1" max="20" 
                  value={alertSettings.priceMovement}
                  onChange={(e) => setAlertSettings({...alertSettings, priceMovement: parseInt(e.target.value)})}
                  className="w-full accent-[#FFFFFF]"
                />
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Alert me when a stock moves more than {alertSettings.priceMovement}% in a single day.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">News Sentiment Trigger</label>
                <select 
                  value={alertSettings.newsSentiment}
                  onChange={(e) => setAlertSettings({...alertSettings, newsSentiment: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-[#FFFFFF] transition-colors appearance-none"
                >
                  <option value="all">All News (High Noise)</option>
                  <option value="medium">Medium & High Impact</option>
                  <option value="high">High Impact Only (Major Events)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white">Insider Activity</h4>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">Notify on executive trades</p>
                </div>
                <button 
                  onClick={() => setAlertSettings({...alertSettings, insiderActivity: !alertSettings.insiderActivity})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${alertSettings.insiderActivity ? 'bg-[#FFFFFF]' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full ${alertSettings.insiderActivity ? 'bg-black left-7' : 'bg-white left-1'} transition-transform`} />
                </button>
              </div>

              <button 
                onClick={() => setShowCustomizeAlerts(false)}
                className="w-full py-3.5 rounded-xl bg-[#FFFFFF] text-black font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


