import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Bell, 
  RefreshCw, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  PieChart as PieChartIcon,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface PayoutsCenterProps {
  setActiveTab: (tab: string) => void;
  initialView?: 'overview' | 'q4-dividend' | 'q3-history';
}

const growthData = [
  { name: 'Q1', amount: 250 },
  { name: 'Q2', amount: 290 },
  { name: 'Q3', amount: 320 },
  { name: 'Q4 (Est)', amount: 450 },
];

const assetContribution = [
  { name: 'Naspers', value: 45, color: '#00FFB2' },
  { name: 'Standard Bank', value: 30, color: '#0066FF' },
  { name: 'Dangote Cement', value: 15, color: '#A1A1AA' },
  { name: 'Others', value: 10, color: '#52525B' },
];

export function PayoutsCenter({ setActiveTab, initialView = 'overview' }: PayoutsCenterProps) {
  const [view, setView] = useState(initialView);
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 5, minutes: 23 });
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [autoReinvest, setAutoReinvest] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Simulate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (view === 'q4-dividend') {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <button 
          onClick={() => setView('overview')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payouts
        </button>

        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Q4 Dividend Details</h1>
          <p className="text-zinc-400">Estimated breakdown and contributing assets for your upcoming payout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Total Estimated Payout</p>
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">$450.00</h2>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Expected Date</p>
                  <p className="text-white font-medium">Oct 31, 2026</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contributing Assets</h3>
              <div className="space-y-3">
                {[
                  { name: 'Naspers', shares: 1500, yield: '4.2%', amount: 202.50, color: '#00FFB2' },
                  { name: 'Standard Bank', shares: 800, yield: '3.8%', amount: 135.00, color: '#0066FF' },
                  { name: 'Dangote Cement', shares: 2000, yield: '5.1%', amount: 67.50, color: '#A1A1AA' },
                  { name: 'EduTech NG', shares: 500, yield: '2.9%', amount: 45.00, color: '#888888' },
                ].map((asset) => (
                  <div key={asset.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                      <div>
                        <p className="text-white font-medium">{asset.name}</p>
                        <p className="text-xs text-zinc-500">{asset.shares} shares • {asset.yield} yield</p>
                      </div>
                    </div>
                    <p className="text-white font-bold">${asset.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Sparkles className="w-24 h-24 text-white blur-xl" />
              </div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Sparkles className="w-5 h-5 text-white" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Forecast Adjustments</h3>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed relative z-10">
                Based on recent earnings reports, Naspers's contribution was adjusted up by 1.2%. Tax implications remain standard at 10% withholding for non-registered accounts.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tax Implications</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-sm text-zinc-400">Gross Dividend</span>
                  <span className="text-sm text-white font-medium">$500.00</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-sm text-zinc-400">Withholding Tax (10%)</span>
                  <span className="text-sm text-[#FF3B3B] font-medium">-$50.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Net Payout</span>
                  <span className="text-sm font-bold text-[#00FFB2]">$450.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'q3-history') {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <button 
          onClick={() => setView('overview')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payouts
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Q3 Payout Details</h1>
          <p className="text-zinc-400">Historical breakdown of your Q3 2026 dividend payout.</p>
        </div>
        {/* Similar detailed view for Q3 can be added here */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-[#00FFB2] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Successfully Paid</h2>
          <p className="text-zinc-400 mb-6">Your Q3 dividend of $320.00 was deposited on Jul 31, 2026.</p>
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
            Download Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Payouts Center</h1>
          <p className="text-zinc-400">Track your upcoming earnings, dividend schedules, and payout history.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          {showExportMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
            >
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left">
                <FileText className="w-4 h-4" /> PDF Statement
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors text-left border-t border-white/5">
                <FileSpreadsheet className="w-4 h-4" /> CSV Report
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Section 1: Upcoming Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setView('q4-dividend')}
            className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/[0.08] hover:border-[#00FFB2]/30 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFB2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse" />
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Estimated Q4 Dividend</p>
                </div>
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 tracking-tight">$450.00</h2>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Date</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  Oct 31, 2026
                </p>
              </div>
            </div>

            {/* Smart Countdown */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 mb-6 relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Countdown</p>
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-2xl font-bold text-white">{timeLeft.days}</span><span className="text-zinc-500 text-sm">d</span>
                    <span className="text-2xl font-bold text-white">{timeLeft.hours}</span><span className="text-zinc-500 text-sm">h</span>
                    <span className="text-2xl font-bold text-white">{timeLeft.minutes}</span><span className="text-zinc-500 text-sm">m</span>
                  </div>
                </div>
                <p className="text-[#00FFB2] text-sm font-medium">82% complete</p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-[#00FFB2]/50 to-[#00FFB2] h-full rounded-full shadow-[0_0_10px_rgba(0,255,178,0.5)]" 
                />
              </div>
            </div>

            {/* AI Insight */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 relative z-10">
              <Sparkles className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
              <p className="text-sm text-[#0066FF]/80">
                <strong className="text-white">AI Insight:</strong> Your Q4 dividend is projected to increase by <span className="text-[#00C896]">6.2%</span> compared to Q3 based on current portfolio performance.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Settings & Elite Upgrade */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3 text-white" /> Elite Upgrade
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Wealth Automation Engine</h3>
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
                $450 payout arriving in 14 days. Reinvesting into high-yield assets could generate an additional <strong className="text-white">$78 annually</strong>.
              </p>
              <button className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <RefreshCw className="w-4 h-4" /> Enable Auto-Reinvest
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-zinc-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-white">Notify 3 days before</span>
                </div>
                <button 
                  onClick={() => setNotifyEnabled(!notifyEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifyEnabled ? 'bg-[#00FFB2]' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${notifyEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-zinc-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-white">Auto-reinvest dividends</span>
                </div>
                <button 
                  onClick={() => setAutoReinvest(!autoReinvest)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${autoReinvest ? 'bg-[#0066FF]' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoReinvest ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section 2 & 3: History & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payout History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Payout History</h2>
            <button className="text-xs text-[#0066FF] hover:text-[#0044AA] font-bold uppercase tracking-wider transition-colors">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Period</th>
                  <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                  <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                  <th className="pb-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  onClick={() => setView('q3-history')}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <td className="py-4 text-sm text-white font-medium group-hover:text-[#0066FF] transition-colors">Q3</td>
                  <td className="py-4 text-sm font-bold text-[#00FFB2]">+$320.00</td>
                  <td className="py-4 text-sm text-zinc-400">Jul 31, 2026</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00FFB2]/10 text-[#00FFB2] text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="py-4 text-sm text-white font-medium">Q2</td>
                  <td className="py-4 text-sm font-bold text-[#00FFB2]">+$290.00</td>
                  <td className="py-4 text-sm text-zinc-400">Apr 30, 2026</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00FFB2]/10 text-[#00FFB2] text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="py-4 text-sm text-white font-medium">Q1</td>
                  <td className="py-4 text-sm font-bold text-[#00FFB2]">+$250.00</td>
                  <td className="py-4 text-sm text-zinc-400">Jan 31, 2026</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00FFB2]/10 text-[#00FFB2] text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Earnings Analytics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8"
        >
          <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6">Earnings Analytics</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total YTD</p>
              <p className="text-2xl font-bold text-white">$860.00</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">Avg Yield</p>
              <p className="text-2xl font-bold text-[#00FFB2]">4.6%</p>
            </div>
          </div>

          <div className="h-[200px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {growthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === growthData.length - 1 ? '#0066FF' : '#ffffff20'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-300">Top Contributor: <strong className="text-white">Naspers (45%)</strong></span>
            </div>
            <button className="text-xs text-[#0066FF] hover:text-[#0044AA] font-bold uppercase tracking-wider transition-colors">Details</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
