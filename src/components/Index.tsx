import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, TrendingUp, TrendingDown, 
  Activity, Globe, Cpu, Zap, ShieldCheck,
  ArrowUpRight, ArrowDownRight, Info, BrainCircuit,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const INDEX_DATA = [
  { name: 'Jan', value: 1000 },
  { name: 'Feb', value: 1050 },
  { name: 'Mar', value: 1020 },
  { name: 'Apr', value: 1100 },
  { name: 'May', value: 1150 },
  { name: 'Jun', value: 1210 },
  { name: 'Jul', value: 1180 },
  { name: 'Aug', value: 1250 },
  { name: 'Sep', value: 1320 },
  { name: 'Oct', value: 1350 },
  { name: 'Nov', value: 1410 },
  { name: 'Dec', value: 1485 },
];

const SECTOR_DATA = [
  { name: 'Fintech', value: 45, color: '#6366f1' },
  { name: 'E-commerce', value: 25, color: '#8b5cf6' },
  { name: 'Healthtech', value: 15, color: '#10b981' },
  { name: 'Edtech', value: 10, color: '#f59e0b' },
  { name: 'Agtech', value: 5, color: '#3b82f6' },
];

const TOP_MOVERS = [
  { symbol: 'PAYST', name: 'Paystack', change: 12.5, type: 'gainer' },
  { symbol: 'FLW', name: 'Flutterwave', change: 8.2, type: 'gainer' },
  { symbol: 'AND', name: 'Andela', change: -5.4, type: 'loser' },
  { symbol: 'JUM', name: 'Jumia', change: -3.1, type: 'loser' },
];

export function Index({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AQX Tech 100</h1>
          </div>
          <p className="text-zinc-400">The S&P 500 of African Innovation. Tracking the top 100 tech companies.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-zinc-400 mb-1">Index Value</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-white">1,485.20</span>
              <span className="flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +48.5% YTD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Performance History</h2>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
              {['1M', '3M', '6M', 'YTD', '1Y', 'ALL'].map(tf => (
                <button key={tf} className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${tf === 'YTD' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}>
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={INDEX_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(5, 5, 10, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIndex)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: AI Insights & Sector Breakdown */}
        <div className="space-y-6">
          {/* AI Commentary */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">AI Index Intelligence</h3>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed relative z-10 mb-4">
              The AQX Tech 100 shows strong bullish momentum driven by Q3 earnings in the Fintech sector. Predictive models suggest a 5-8% upside in the next quarter, heavily weighted towards emerging AI and Healthtech startups.
            </p>
            <button onClick={() => setActiveTab('intelligence-ngx-assistant')} className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              Read Full Analysis <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sector Breakdown */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-6">Sector Weighting</h3>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={SECTOR_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {SECTOR_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(5, 5, 10, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-bold text-white">100</span>
                <span className="text-xs text-zinc-500">Companies</span>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {SECTOR_DATA.map((sector) => (
                <div key={sector.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                    <span className="text-zinc-300">{sector.name}</span>
                  </div>
                  <span className="text-white font-medium">{sector.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Movers & Investment Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movers */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top Movers (24h)</h3>
            <button onClick={() => setActiveTab('marketplace')} className="text-sm text-zinc-400 hover:text-white transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {TOP_MOVERS.map((mover) => (
              <div key={mover.symbol} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mover.type === 'gainer' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {mover.type === 'gainer' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{mover.symbol}</p>
                    <p className="text-xs text-zinc-400">{mover.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${mover.type === 'gainer' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {mover.change > 0 ? '+' : ''}{mover.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Products */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Index Investment Products</h3>
            <Info className="w-5 h-5 text-zinc-500" />
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div onClick={() => setActiveTab('trade')} className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">AQX Tech 100 ETF</h4>
                  <p className="text-sm text-blue-200 mb-4">Invest in the entire African tech ecosystem with a single click.</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-zinc-300"><span className="text-white font-medium">0.15%</span> Expense Ratio</span>
                    <span className="text-zinc-300"><span className="text-white font-medium">Quarterly</span> Rebalancing</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div onClick={() => setActiveTab('marketplace')} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Sector Bundles</h4>
                  <p className="text-sm text-zinc-400">Target specific high-growth sectors like Fintech or Healthtech.</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
