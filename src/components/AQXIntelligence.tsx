import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, BrainCircuit, TrendingUp, ShieldCheck, 
  PieChart, Activity, AlertTriangle, ArrowRight, Zap,
  BarChart3, Target, RefreshCw, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { AITradingBot } from './AITradingBot';

const projectionData = [
  { month: 'Jan', value: 100000, projected: 100000 },
  { month: 'Feb', value: 105000, projected: 105000 },
  { month: 'Mar', value: 108000, projected: 108000 },
  { month: 'Apr', value: null, projected: 112000 },
  { month: 'May', value: null, projected: 118000 },
  { month: 'Jun', value: null, projected: 125000 },
];

const sectorData = [
  { name: 'FinTech', value: 45, color: '#0066FF' },
  { name: 'Technology', value: 25, color: '#00FFB2' },
  { name: 'Financials', value: 20, color: '#FFFFFF' },
  { name: 'Manufacturing', value: 10, color: '#9333EA' },
];

interface AQXIntelligenceProps {
  setActiveTab: (tab: string) => void;
}

export function AQXIntelligence({ setActiveTab }: AQXIntelligenceProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 flex items-center justify-center border border-[#0066FF]/30">
              <BrainCircuit className="w-5 h-5 text-[#0066FF]" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AQX Intelligence</h1>
          </div>
          <p className="text-zinc-400 mt-2 max-w-2xl">
            AI-driven insights based on your portfolio, market signals, and predictive analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('intelligence-ngx-assistant')}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" /> Ask AI Assistant
          </button>
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] hover:bg-[#0066FF]/20 transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projection & Risk */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Projection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#0066FF]/30 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#0066FF]" />
                  Portfolio Projection
                </h2>
                <p className="text-2xl font-bold text-[#00C896] mt-2">Projected Growth: +18% this quarter</p>
              </div>
              <div className="bg-[#0066FF]/10 border border-[#0066FF]/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0066FF]" />
                <span className="text-xs font-bold text-[#0066FF]">87% AI Certainty</span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FFB2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00FFB2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  <Area type="monotone" dataKey="projected" stroke="#00FFB2" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Strategic Insight Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-default group">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-4 h-4 text-[#FFFFFF]" />
                <h3 className="text-sm font-bold text-white">Diversification</h3>
              </div>
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                Your exposure to Technology (Naspers) has reduced volatility by <span className="text-[#00C896] font-bold">12%</span>.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-default group">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#FFFFFF]" />
                <h3 className="text-sm font-bold text-white">Opportunity Signals</h3>
              </div>
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                <span className="text-[#FFFFFF] font-bold">Financials</span> sector shows strong pre-dividend momentum.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-default group">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-sm font-bold text-white">Market Signals</h3>
              </div>
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                AQX Tech 100 index is trending <span className="text-[#0066FF] font-bold">bullish</span> (short-term breakout detected).
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Actions & Deep Dive */}
        <div className="space-y-6">
          {/* Risk Profile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00C896]" />
                Risk Profile
              </h2>
              <span className="px-3 py-1 bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 rounded-full text-xs font-bold uppercase tracking-wider">
                Low Risk
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Asset Allocation Balance</span>
                <span className="text-[#00C896] font-medium">Optimal</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Sector Exposure</span>
                <span className="text-[#0066FF] font-medium">Well Distributed</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Volatility Score</span>
                <span className="text-white font-medium">24 / 100</span>
              </div>
            </div>
          </motion.div>

          {/* Recommended Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#0066FF]/20 to-[#FFFFFF]/20 border border-[#0066FF]/20 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-24 h-24 text-[#0066FF]" />
            </div>
            <h2 className="text-lg font-bold text-white mb-4 relative z-10 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FFFFFF]" />
              AI Decision Engine
            </h2>
            
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl hover:border-[#FFFFFF]/50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFFFFF]/20 flex items-center justify-center shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium group-hover:text-[#FFFFFF] transition-colors">Reallocate to Financials</h4>
                    <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                      Reallocate 12% ($7,200) from low-performing assets into Financials to maximize Q4 dividend yield (<span className="text-[#00C896] font-medium">+2.8% projected gain</span>).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl hover:border-[#00C896]/50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00C896]/20 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-[#00C896]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium group-hover:text-[#00C896] transition-colors">Hold Technology Positions</h4>
                    <p className="text-sm text-zinc-400 mt-1">Current positions in Naspers are stabilizing your portfolio volatility.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl hover:border-[#0066FF]/50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 flex items-center justify-center shrink-0 mt-1">
                    <AlertTriangle className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium group-hover:text-[#0066FF] transition-colors">Monitor Tech Index</h4>
                    <p className="text-sm text-zinc-400 mt-1">Watch for confirmed breakout above 14,200 resistance level.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Deep Dive Analytics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-[#FFFFFF]" />
          <h2 className="text-xl font-bold text-white">Deep Dive Analytics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Sector Breakdown</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-bold text-lg">100%</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {sectorData.map(sector => (
                <div key={sector.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                  <span className="text-xs text-zinc-400">{sector.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Historical Performance vs AQX Benchmarks</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">Your Portfolio</span>
                    <span className="text-[#00C896]">+14.2%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00C896] rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">NGX All-Share Index</span>
                    <span className="text-[#0066FF]">+8.5%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0066FF] rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Predictive Modeling (Next 30-90 Days)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">30-Day Outlook</span>
                  <p className="text-lg font-bold text-white mt-1">+4.5% <span className="text-sm font-normal text-zinc-400">Expected</span></p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">90-Day Outlook</span>
                  <p className="text-lg font-bold text-white mt-1">+12.8% <span className="text-sm font-normal text-zinc-400">Expected</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Embedded AI Trading Bot component */}
      <AITradingBot setActiveTab={setActiveTab} />
    </div>
  );
}
