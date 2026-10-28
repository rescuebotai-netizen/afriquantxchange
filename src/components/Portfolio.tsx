import React from 'react';
import { 
  Briefcase, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  ArrowUpRight, 
  Download, 
  FileText, 
  ShieldCheck,
  Lock,
  ChevronRight,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const holdings = [
  {
    id: 1,
    asset: 'Naspers',
    type: 'Common Shares',
    shares: '12,500',
    percentage: '1.25%',
    value: '$62,500.00',
    change: '+15.2%',
    status: 'Active'
  },
  {
    id: 2,
    asset: 'Standard Bank',
    type: 'Preferred Shares',
    shares: '8,000',
    percentage: '0.80%',
    value: '$40,000.00',
    change: '+8.5%',
    status: 'Active'
  },
  {
    id: 3,
    asset: 'Dangote Cement',
    type: 'Hybrid Contract',
    shares: '-',
    percentage: '0.40%',
    value: '$22,000.00',
    change: '+12.0%',
    status: 'Active'
  }
];

const documents = [
  { id: 1, name: 'Share Certificate - Naspers', date: 'Oct 12, 2025', type: 'PDF', size: '1.2 MB' },
  { id: 2, name: 'Q3 Dividend Statement', date: 'Jan 05, 2026', type: 'PDF', size: '0.8 MB' },
  { id: 3, name: 'Investment Agreement - Dangote Cement', date: 'Feb 20, 2026', type: 'PDF', size: '2.4 MB' },
];

const companySplitData = [
  { name: 'Naspers', value: 62500, color: '#FFFFFF' },
  { name: 'Standard Bank', value: 40000, color: '#FFFFFF' },
  { name: 'Dangote Cement', value: 22000, color: '#888888' },
];

const sectorData = [
  { name: 'Technology', value: 50, color: '#FFFFFF' },
  { name: 'Financials', value: 32, color: '#FFFFFF' },
  { name: 'Manufacturing', value: 18, color: '#888888' },
];

const riskData = [
  { name: 'Low Risk', value: 68, color: '#FFFFFF' },
  { name: 'Medium Risk', value: 32, color: '#FFFFFF' },
  { name: 'High Risk', value: 0, color: '#888888' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-[#FFFFFF]/40 p-3 rounded-xl shadow-2xl">
        <p className="text-white font-bold text-sm">{payload[0].name}</p>
        <p className="text-[#FFFFFF] text-xs font-mono mt-1">
          {payload[0].name.includes('Risk') || payload[0].name.includes('Tech') || payload[0].name === 'Manufacturing' 
            ? `${payload[0].value}%` 
            : `$${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

export function Portfolio({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-8 relative bg-black text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase">Multi-Asset Portfolio</h1>
          <p className="text-zinc-400 mt-1 font-medium">Manage your equity across the African private market network.</p>
        </div>
        <button className="bg-[#FFFFFF] text-black font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 hover:bg-white shadow-lg">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#FFFFFF]/40 transition-colors"
        >
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 rounded-xl">
               <Briefcase className="w-5 h-5 text-[#FFFFFF]" />
            </div>
            <h3 className="text-zinc-400 font-bold tracking-wider text-xs uppercase">Total Portfolio Value</h3>
          </div>
          <p className="text-4xl font-bold font-mono text-white mb-3 tracking-tight relative z-10">$124,500.00</p>
          <div className="flex items-center gap-2 text-sm font-medium relative z-10">
            <span className="flex items-center gap-1 text-[#FFFFFF] bg-[#FFFFFF]/10 px-2 py-1 rounded-lg border border-[#FFFFFF]/20 text-xs font-bold font-mono">
              <ArrowUpRight className="w-4 h-4 text-[#FFFFFF]" />
              +12.5%
            </span>
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold">All Time</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#FFFFFF]/40 transition-colors"
        >
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 rounded-xl">
              <Activity className="w-5 h-5 text-[#FFFFFF]" />
            </div>
            <h3 className="text-zinc-400 font-bold tracking-wider text-xs uppercase">Active Investments</h3>
          </div>
          <p className="text-4xl font-bold font-mono text-white mb-3 tracking-tight relative z-10">3 Companies</p>
          <div className="flex items-center gap-2 text-sm font-medium relative z-10">
            <span className="flex items-center gap-1 text-[#FFFFFF] bg-[#FFFFFF]/10 px-2 py-1 rounded-lg border border-[#FFFFFF]/20 text-xs font-bold">
              <TrendingUp className="w-4 h-4" />
              Diversified
            </span>
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Across 3 Sectors</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#FFFFFF]/40 transition-colors"
        >
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2.5 bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-[#FFFFFF]" />
            </div>
            <h3 className="text-zinc-400 font-bold tracking-wider text-xs uppercase">Overall Risk Profile</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-3 tracking-tight relative z-10 uppercase">Low-to-Medium</p>
          <div className="flex items-center gap-2 text-sm font-medium relative z-10">
            <span className="flex items-center gap-1 text-[#FFFFFF] bg-[#FFFFFF]/10 px-2 py-1 rounded-lg border border-[#FFFFFF]/20 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              Optimized
            </span>
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold">AI Rebalanced</span>
          </div>
        </motion.div>
      </div>

      {/* Allocation Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-black border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col"
        >
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Company Allocation</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={companySplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {companySplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-2xl font-bold font-mono text-white">3</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Assets</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {companySplitData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 font-medium">{item.name}</span>
                </div>
                <span className="text-white font-bold font-mono">{Math.round((item.value / 124500) * 100)}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col"
        >
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Sector Exposure</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-2xl font-bold font-mono text-white">3</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Sectors</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {sectorData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 font-medium">{item.name}</span>
                </div>
                <span className="text-white font-bold font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-black border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col"
        >
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Risk Profile</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <ShieldCheck className="w-8 h-8 text-[#FFFFFF] mb-1" />
              <span className="text-xs text-[#FFFFFF] font-bold uppercase tracking-wider">Healthy</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {riskData.filter(d => d.value > 0).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 font-medium">{item.name}</span>
                </div>
                <span className="text-white font-bold font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Asset Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-zinc-400 bg-white/[0.02]">
                  <th className="p-6 font-bold">Company</th>
                  <th className="p-6 font-bold">Type</th>
                  <th className="p-6 font-bold">Shares / %</th>
                  <th className="p-6 font-bold">Value</th>
                  <th className="p-6 font-bold text-right">Change</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {holdings.map((holding) => (
                  <tr key={holding.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 flex items-center justify-center text-[#FFFFFF] font-bold text-xs">
                        {holding.asset.charAt(0)}
                      </div>
                      {holding.asset}
                    </td>
                    <td className="p-6 text-zinc-400">
                      <span className="bg-white/5 px-2.5 py-1 rounded-lg text-xs border border-white/10 font-medium">
                        {holding.type}
                      </span>
                    </td>
                    <td className="p-6 text-zinc-300 font-mono">
                      {holding.shares !== '-' ? holding.shares : holding.percentage}
                      {holding.shares !== '-' && <span className="text-zinc-500 ml-2">({holding.percentage})</span>}
                    </td>
                    <td className="p-6 font-bold font-mono text-white tracking-tight">{holding.value}</td>
                    <td className="p-6 text-right">
                      <span className="inline-flex items-center gap-1 text-[#FFFFFF] bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#FFFFFF]" />
                        {holding.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Documents */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-[#FFFFFF]" />
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Legal Documents</h2>
            <button onClick={() => setActiveTab('company-profile')} className="text-[#FFFFFF] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.01] hover:border-[#FFFFFF]/30 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/5 rounded-xl text-zinc-400 group-hover:text-[#FFFFFF] group-hover:bg-[#FFFFFF]/10 transition-colors border border-white/10 group-hover:border-[#FFFFFF]/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-[#FFFFFF] transition-colors">{doc.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{doc.date} • {doc.size}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <Download className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto pt-8">
            <div className="bg-[#FFFFFF]/5 border border-[#FFFFFF]/20 rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden">
              <div className="p-2 bg-[#FFFFFF]/10 rounded-xl shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#FFFFFF]" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-[#FFFFFF] mb-1 uppercase tracking-wider">Smart Contracts Active</p>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Your equity and revenue share agreements are secured and automated via smart contracts.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
