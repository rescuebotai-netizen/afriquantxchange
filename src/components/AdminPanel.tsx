import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  LayoutDashboard, Users, Wallet, TrendingUp, Image as ImageIcon, 
  ShieldAlert, Bell, Settings, Search, Sparkles, LogOut, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Activity,
  AlertTriangle, CheckCircle2, MoreVertical, Filter, Download,
  Plus, Eye, Ban, FileText, RefreshCw, AlertCircle, BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { cn } from '../lib/utils';

interface AdminPanelProps {
  onExit: () => void;
}

const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'wallets', label: 'Wallets & Tx', icon: Wallet },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'nft', label: 'NFT & Crypto', icon: ImageIcon },
  { id: 'compliance', label: 'Compliance', icon: ShieldAlert },
  { id: 'content', label: 'Content', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
];

const performanceData = [
  { time: '00:00', volume: 1200, users: 450, gmv: 45000 },
  { time: '04:00', volume: 1900, users: 520, gmv: 52000 },
  { time: '08:00', volume: 3500, users: 1100, gmv: 125000 },
  { time: '12:00', volume: 5200, users: 2800, gmv: 280000 },
  { time: '16:00', volume: 4800, users: 2400, gmv: 245000 },
  { time: '20:00', volume: 2100, users: 850, gmv: 85000 },
];

const recentTransactions = [
  { id: 'TX-9821', time: '2 mins ago', user: 'sarah.o@example.com', asset: 'USDC', amount: '+$50,000', status: 'Completed', risk: 'Low' },
  { id: 'TX-9820', time: '15 mins ago', user: 'mike.c@example.com', asset: 'ETH', amount: '-$12,400', status: 'Pending', risk: 'Medium' },
  { id: 'TX-9819', time: '1 hour ago', user: 'investor99@mail.com', asset: 'Naspers Equity', amount: '+$150,000', status: 'Flagged', risk: 'High' },
  { id: 'TX-9818', time: '2 hours ago', user: 'david.n@example.com', asset: 'BTC', amount: '+$8,200', status: 'Completed', risk: 'Low' },
];

const mockUsers = [
  { id: '1', name: 'Alex Thompson', email: 'alex.t@example.com', kyc: 'Verified', balance: '$145,200.00', risk: 'Low', lastActive: '2 mins ago', role: 'Investor' },
  { id: '2', name: 'Sarah Chen', email: 'schen@example.com', kyc: 'Pending', balance: '$12,450.00', risk: 'Medium', lastActive: '1 hr ago', role: 'Trader' },
  { id: '3', name: 'Michael Ross', email: 'mross@example.com', kyc: 'Verified', balance: '$2,450,000.00', risk: 'Low', lastActive: '5 mins ago', role: 'Institution' },
  { id: '4', name: 'Emma Wilson', email: 'emma.w@example.com', kyc: 'Rejected', balance: '$0.00', risk: 'High', lastActive: '2 days ago', role: 'Investor' },
  { id: '5', name: 'David Kim', email: 'dkim@example.com', kyc: 'Verified', balance: '$84,300.00', risk: 'Low', lastActive: 'Just now', role: 'Trader' },
];

const mockAIInsights = [
  { id: 'AI-001', type: 'Warning', title: 'Liquidity Warning', description: 'USDC Pool liquidity is dropping rapidly. Consider adjusting yield to attract deposits.', impact: 'High', time: '10 mins ago' },
  { id: 'AI-002', type: 'Alert', title: 'Trading Anomaly', description: 'Unusual trading volume detected on AgriFarm Plot A. Potential market manipulation.', impact: 'Critical', time: '1 hour ago' },
  { id: 'AI-003', type: 'Insight', title: 'Investment Trend', description: 'Renewable energy assets are seeing a 25% increase in interest this week.', impact: 'Medium', time: '5 hours ago' },
  { id: 'AI-004', type: 'Insight', title: 'User Behavior', description: 'New users from the recent marketing campaign are showing a high drop-off rate at the KYC step.', impact: 'Medium', time: '1 day ago' },
];

const mockWallets = [
  { id: 'W-1001', user: 'Alex Thompson', type: 'Fiat', balance: '$145,200.00', status: 'Active', lastActivity: '2 mins ago' },
  { id: 'W-1002', user: 'Sarah Chen', type: 'Crypto', balance: '12.5 ETH', status: 'Active', lastActivity: '1 hr ago' },
  { id: 'W-1003', user: 'Michael Ross', type: 'Equity', balance: '5,000 Shares', status: 'Active', lastActivity: '5 mins ago' },
  { id: 'W-1004', user: 'Emma Wilson', type: 'Fiat', balance: '$0.00', status: 'Suspended', lastActivity: '2 days ago' },
];

const mockCompliance = [
  { id: 'KYC-501', user: 'Alex Thompson', type: 'Level 2', status: 'Approved', submitted: '2 days ago', risk: 'Low' },
  { id: 'KYC-502', user: 'Sarah Chen', type: 'Level 1', status: 'Pending', submitted: '1 hr ago', risk: 'Medium' },
  { id: 'KYC-503', user: 'Michael Ross', type: 'Corporate', status: 'Approved', submitted: '1 week ago', risk: 'Low' },
  { id: 'KYC-504', user: 'Emma Wilson', type: 'Level 2', status: 'Rejected', submitted: '2 days ago', risk: 'High' },
];

const mockInvestments = [
  { id: 'INV-201', name: 'Naspers', type: 'Equity', raised: '$1.2M', target: '$2M', investors: 145, status: 'Active' },
  { id: 'INV-202', name: 'SolarGrid Pro', type: 'Debt', raised: '$500K', target: '$500K', investors: 82, status: 'Closed' },
  { id: 'INV-203', name: 'TechHub Lagos', type: 'Real Estate', raised: '$2.5M', target: '$5M', investors: 310, status: 'Active' },
  { id: 'INV-204', name: 'Financials AI', type: 'Equity', raised: '$0', target: '$1M', investors: 0, status: 'Pending' },
];

const mockNFTs = [
  { id: 'NFT-301', name: 'AgriFarm Plot A', collection: 'Real Estate', owner: 'Alex Thompson', value: '$25,000', status: 'Listed' },
  { id: 'NFT-302', name: 'Solar Panel 12B', collection: 'Energy', owner: 'Sarah Chen', value: '$1,200', status: 'Held' },
  { id: 'NFT-303', name: 'TechHub Share #45', collection: 'Equity', owner: 'Michael Ross', value: '$5,000', status: 'Listed' },
  { id: 'NFT-304', name: 'Carbon Credit 2025', collection: 'Commodity', owner: 'Emma Wilson', value: '$500', status: 'Held' },
];

const mockContent = [
  { id: 'POST-401', title: 'Q3 Platform Update', type: 'Announcement', author: 'Admin', date: 'Oct 15, 2025', status: 'Published' },
  { id: 'POST-402', title: 'New Investment Opportunity: SolarGrid', type: 'Notification', author: 'System', date: 'Oct 12, 2025', status: 'Published' },
  { id: 'POST-403', title: 'Maintenance Scheduled', type: 'Alert', author: 'Admin', date: 'Oct 20, 2025', status: 'Draft' },
  { id: 'POST-404', title: 'Market Analysis Report', type: 'Article', author: 'AI Advisor', date: 'Oct 10, 2025', status: 'Published' },
];

const mockAuditLogs = [
  { id: 'LOG-601', action: 'User Suspended', admin: 'superadmin@nxg.com', target: 'Emma Wilson', time: '2 days ago', ip: '192.168.1.1' },
  { id: 'LOG-602', action: 'Investment Approved', admin: 'investments@nxg.com', target: 'Naspers', time: '1 week ago', ip: '192.168.1.2' },
  { id: 'LOG-603', action: 'System Settings Updated', admin: 'superadmin@nxg.com', target: 'Fee Structure', time: '2 weeks ago', ip: '192.168.1.1' },
  { id: 'LOG-604', action: 'KYC Rejected', admin: 'compliance@nxg.com', target: 'Emma Wilson', time: '2 days ago', ip: '192.168.1.3' },
];

const KpiCard = ({ title, value, delta, sparklineData }: any) => (
  <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className="text-sm text-zinc-400 font-medium">{title}</div>
      <div className={cn("text-sm font-semibold flex items-center gap-1", delta > 0 ? "text-emerald-400" : "text-rose-400")}>
        {delta > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {Math.abs(delta)}%
      </div>
    </div>
    <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
    
    <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30 group-hover:opacity-60 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sparklineData}>
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={delta > 0 ? '#10B981' : '#F43F5E'} stopOpacity={0.4} />
              <stop offset="100%" stopColor={delta > 0 ? '#10B981' : '#F43F5E'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={delta > 0 ? '#10B981' : '#F43F5E'} fill={`url(#grad-${title})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export function AdminPanel({ onExit }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveUsers, setLiveUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (data && !error) {
        setLiveUsers(data.map(u => ({
          id: u.id,
          name: u.full_name || 'Unknown',
          email: u.email || 'N/A',
          kyc: u.kyc_status || 'Pending',
          balance: '$0.00', // Would need a join with wallets
          risk: 'Low',
          lastActive: new Date(u.updated_at).toLocaleDateString(),
          role: u.role || 'Investor'
        })));
      }
    } catch (e) {
      console.warn('Could not fetch profiles from Supabase:', e);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('profiles').update({ role: 'suspended' }).eq('id', userId);
      if (!error) fetchUsers();
    } catch (e) {
      console.warn('Could not suspend user:', e);
    }
  };

  const handleApproveKYC = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('profiles').update({ kyc_status: 'Verified' }).eq('id', userId);
      if (!error) fetchUsers();
    } catch (e) {
      console.warn('Could not approve KYC:', e);
    }
  };

  const handleExportLogs = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase.from('audit_logs').select('*');
      if (data && !error) {
        const csvContent = "data:text/csv;charset=utf-8," 
          + data.map(e => Object.values(e).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "audit_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.warn('Could not export logs:', e);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard 
                title="Total Active Users" 
                value="124,592" 
                delta={12.5} 
                sparklineData={[{value: 100}, {value: 120}, {value: 115}, {value: 140}, {value: 180}]} 
              />
              <KpiCard 
                title="Total Wallet Balance" 
                value="$842.5M" 
                delta={8.2} 
                sparklineData={[{value: 800}, {value: 810}, {value: 825}, {value: 830}, {value: 842}]} 
              />
              <KpiCard 
                title="24h Transaction Vol" 
                value="$12.4M" 
                delta={-2.4} 
                sparklineData={[{value: 15}, {value: 14}, {value: 12}, {value: 13}, {value: 12.4}]} 
              />
              <KpiCard 
                title="Pending KYC" 
                value="1,284" 
                delta={5.1} 
                sparklineData={[{value: 1000}, {value: 1100}, {value: 1050}, {value: 1200}, {value: 1284}]} 
              />
            </div>

            {/* Charts & AI Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-[#121826] border border-white/[0.08] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Platform Performance</h3>
                  <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                    {['1D', '1W', '1M', '1Y'].map(t => (
                      <button key={t} className={cn("px-3 py-1 text-xs font-medium rounded-md transition-colors", t === '1D' ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300")}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#121826', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#E5E7EB' }}
                      />
                      <Area type="monotone" dataKey="gmv" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#121826] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-rose-400">Liquidity Warning</h4>
                        <p className="text-xs text-rose-300/70 mt-1">USDC hot wallet balance dropping below 15% threshold. Recommended action: Rebalance from cold storage.</p>
                        <button className="mt-3 text-xs font-semibold bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-500/30 transition-colors">
                          Execute Rebalance
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-emerald-400">Trading Anomaly</h4>
                        <p className="text-xs text-emerald-300/70 mt-1">Unusual spike in secondary market trades for Naspers. No malicious patterns detected. Likely driven by recent PR.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap & Transactions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Heatmap */}
              <div className="lg:col-span-6 bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/[0.08] flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Activity Heatmap</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium rounded-md bg-white/10 text-white transition-colors">Trades</button>
                    <button className="px-3 py-1 text-xs font-medium rounded-md text-zinc-500 hover:text-zinc-300 transition-colors">Logins</button>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-8 gap-1">
                    <div className="col-span-1"></div>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                      <div key={d} className="text-center text-[10px] text-zinc-500 font-medium">{d}</div>
                    ))}
                    
                    {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((time, i) => (
                      <React.Fragment key={time}>
                        <div className="text-right text-[10px] text-zinc-500 font-medium pr-2 flex items-center justify-end">{time}</div>
                        {Array.from({ length: 7 }).map((_, j) => {
                          // Generate pseudo-random intensity
                          const intensity = Math.sin(i * 1.5 + j) * 0.5 + 0.5;
                          const bgOpacity = Math.max(0.1, intensity);
                          return (
                            <div 
                              key={`${i}-${j}`} 
                              className="aspect-square rounded-sm transition-all hover:scale-110 hover:z-10 cursor-pointer relative group"
                              style={{ backgroundColor: `rgba(59, 130, 246, ${bgOpacity})` }}
                            >
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                                {Math.floor(intensity * 1000)} actions
                              </div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-zinc-500">
                    <span>Less</span>
                    <div className="w-16 h-2 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-500/90" />
                    <span>More</span>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="lg:col-span-6 bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/[0.08] flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500">
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Asset</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                          <td className="px-4 py-3">
                            <div className="text-sm text-zinc-300">{tx.user}</div>
                            <div className="text-[10px] text-zinc-500">{tx.time}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-300">{tx.asset}</td>
                          <td className={cn("px-4 py-3 text-sm font-medium", tx.amount.startsWith('+') ? "text-emerald-400" : "text-white")}>{tx.amount}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-1 text-[10px] font-medium rounded-full border",
                              tx.status === 'Completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                              tx.status === 'Pending' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                              "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            )}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">User Management</h2>
              <div className="flex gap-3">
                <button onClick={handleExportLogs} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add User
                </button>
              </div>
            </div>

            <div className="bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col flex-1">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search users by name, email, or ID..." 
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Roles</option>
                    <option>Investor</option>
                    <option>Trader</option>
                    <option>Institution</option>
                  </select>
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All KYC Status</option>
                    <option>Verified</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/[0.08]">
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">KYC Status</th>
                      <th className="px-6 py-4 font-medium">Wallet Balance</th>
                      <th className="px-6 py-4 font-medium">Risk Score</th>
                      <th className="px-6 py-4 font-medium">Last Active</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {(liveUsers.length > 0 ? liveUsers : mockUsers).map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-medium text-xs border border-blue-500/20">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-xs text-zinc-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{user.role}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full border",
                            user.kyc === 'Verified' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            user.kyc === 'Pending' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          )}>
                            {user.kyc}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{user.balance}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-sm font-medium",
                            user.risk === 'Low' ? "text-emerald-400" :
                            user.risk === 'Medium' ? "text-amber-400" :
                            "text-rose-400"
                          )}>
                            {user.risk}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">{user.lastActive}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleApproveKYC(user.id)} className="p-1.5 rounded-md text-emerald-400 hover:bg-emerald-400/10 transition-colors" title="Approve KYC">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-blue-400 hover:bg-blue-400/10 transition-colors" title="View Profile">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-amber-400 hover:bg-amber-400/10 transition-colors" title="Reset 2FA">
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleSuspendUser(user.id)} className="p-1.5 rounded-md text-rose-400 hover:bg-rose-400/10 transition-colors" title="Suspend User">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-white/[0.08] flex items-center justify-between text-sm text-zinc-500">
                <div>Showing 1 to 5 of 12,453 users</div>
                <div className="flex gap-1">
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50">Prev</button>
                  <button className="px-3 py-1 rounded border border-white/10 bg-white/10 text-white">1</button>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">2</button>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">3</button>
                  <span className="px-2 py-1">...</span>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">Next</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'wallets':
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Wallets & Transactions</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export Report
                </button>
              </div>
            </div>

            {/* Liquidity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Total Platform Liquidity</div>
                <div className="text-2xl font-semibold text-white">$145,240,500.00</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">24h Deposit Volume</div>
                <div className="text-2xl font-semibold text-emerald-400">+$2,450,000.00</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">24h Withdrawal Volume</div>
                <div className="text-2xl font-semibold text-rose-400">-$845,200.00</div>
              </div>
            </div>

            <div className="bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col flex-1">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search transactions by ID, user, or asset..." 
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Types</option>
                    <option>Deposit</option>
                    <option>Withdrawal</option>
                    <option>Trade</option>
                  </select>
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Statuses</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Flagged</option>
                  </select>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/[0.08]">
                      <th className="px-6 py-4 font-medium">Transaction ID</th>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Asset</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Risk Level</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{tx.id}</div>
                          <div className="text-xs text-zinc-500">{tx.time}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{tx.user}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{tx.asset}</td>
                        <td className={cn("px-6 py-4 text-sm font-medium", tx.amount.startsWith('+') ? "text-emerald-400" : "text-white")}>{tx.amount}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full border",
                            tx.status === 'Completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            tx.status === 'Pending' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          )}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-sm font-medium",
                            tx.risk === 'Low' ? "text-emerald-400" :
                            tx.risk === 'Medium' ? "text-amber-400" :
                            "text-rose-400"
                          )}>
                            {tx.risk}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {tx.status === 'Pending' && (
                              <>
                                <button className="p-1.5 rounded-md text-emerald-400 hover:bg-emerald-400/10 transition-colors" title="Approve">
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded-md text-rose-400 hover:bg-rose-400/10 transition-colors" title="Reject">
                                  <Ban className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button className="p-1.5 rounded-md text-blue-400 hover:bg-blue-400/10 transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-white/[0.08] flex items-center justify-between text-sm text-zinc-500">
                <div>Showing 1 to 5 of 45,231 transactions</div>
                <div className="flex gap-1">
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50">Prev</button>
                  <button className="px-3 py-1 rounded border border-white/10 bg-white/10 text-white">1</button>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">2</button>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">3</button>
                  <span className="px-2 py-1">...</span>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">Next</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'compliance':
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">KYC/AML Compliance</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export Audit Log
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Pending KYC</div>
                <div className="text-2xl font-semibold text-amber-400">142</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Flagged for AML</div>
                <div className="text-2xl font-semibold text-rose-400">18</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Approved (24h)</div>
                <div className="text-2xl font-semibold text-emerald-400">356</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Auto-Approval Rate</div>
                <div className="text-2xl font-semibold text-white">84.2%</div>
              </div>
            </div>

            <div className="bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col flex-1">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search applications..." 
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Statuses</option>
                    <option>Pending</option>
                    <option>Flagged</option>
                  </select>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/[0.08]">
                      <th className="px-6 py-4 font-medium">App ID</th>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Document Type</th>
                      <th className="px-6 py-4 font-medium">Submission Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Risk Score</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {mockCompliance.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 text-sm font-medium text-white">{item.id}</td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{item.user}</td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{item.type}</td>
                        <td className="px-6 py-4 text-sm text-zinc-400">{item.submitted}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full border",
                            item.status === 'Pending' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                            "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          )}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-sm font-medium",
                            item.risk === 'Low' ? "text-emerald-400" :
                            item.risk === 'Medium' ? "text-amber-400" :
                            "text-rose-400"
                          )}>
                            {item.risk}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-md text-emerald-400 hover:bg-emerald-400/10 transition-colors" title="Approve">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-amber-400 hover:bg-amber-400/10 transition-colors" title="Request More Info">
                              <FileText className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-rose-400 hover:bg-rose-400/10 transition-colors" title="Reject">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-white/[0.08] flex items-center justify-between text-sm text-zinc-500">
                <div>Showing 1 to 4 of 160 pending applications</div>
                <div className="flex gap-1">
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50">Prev</button>
                  <button className="px-3 py-1 rounded border border-white/10 bg-white/10 text-white">1</button>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">2</button>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">3</button>
                  <span className="px-2 py-1">...</span>
                  <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">Next</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'investments':
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Investments & Trading</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Offering
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Total Trading Volume (24h)</div>
                <div className="text-2xl font-semibold text-white">$12,450,000.00</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Active Offerings</div>
                <div className="text-2xl font-semibold text-white">24</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Pending Approvals</div>
                <div className="text-2xl font-semibold text-amber-400">3</div>
              </div>
            </div>

            <div className="bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col flex-1">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search assets..." 
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Types</option>
                    <option>Equity</option>
                    <option>Debt</option>
                    <option>Index</option>
                  </select>
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Closed</option>
                    <option>Pending</option>
                  </select>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/[0.08]">
                      <th className="px-6 py-4 font-medium">Asset Name</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Total Raised</th>
                      <th className="px-6 py-4 font-medium">Target</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {mockInvestments.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{item.name}</div>
                          <div className="text-xs text-zinc-500">{item.id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{item.type}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{item.raised}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{item.target}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full border",
                            item.status === 'Active' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            item.status === 'Pending' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                            "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                          )}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.status === 'Pending' && (
                              <button className="p-1.5 rounded-md text-emerald-400 hover:bg-emerald-400/10 transition-colors" title="Approve Offering">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {item.status === 'Active' && (
                              <button className="p-1.5 rounded-md text-amber-400 hover:bg-amber-400/10 transition-colors" title="Pause Trading">
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-1.5 rounded-md text-blue-400 hover:bg-blue-400/10 transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
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
      case 'nft':
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">NFT & Crypto Management</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Adjust Liquidity
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Mint NFT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Total Tokenized Assets</div>
                <div className="text-2xl font-semibold text-white">142</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Total Crypto Liquidity</div>
                <div className="text-2xl font-semibold text-white">$45,200,000.00</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">24h NFT Volume</div>
                <div className="text-2xl font-semibold text-emerald-400">+$124,500.00</div>
              </div>
            </div>

            <div className="bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col flex-1">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search assets..." 
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Types</option>
                    <option>NFT</option>
                    <option>Crypto</option>
                    <option>Liquidity</option>
                  </select>
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Sold Out</option>
                  </select>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/[0.08]">
                      <th className="px-6 py-4 font-medium">Asset Name</th>
                      <th className="px-6 py-4 font-medium">Collection</th>
                      <th className="px-6 py-4 font-medium">Owner</th>
                      <th className="px-6 py-4 font-medium">Value</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {mockNFTs.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{item.name}</div>
                          <div className="text-xs text-zinc-500">{item.id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{item.collection}</td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{item.owner}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{item.value}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full border",
                            item.status === 'Active' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                          )}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-md text-blue-400 hover:bg-blue-400/10 transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-amber-400 hover:bg-amber-400/10 transition-colors" title="Manage">
                              <Settings className="w-4 h-4" />
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
      case 'content':
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Content & Notifications</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Send Push
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Post
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Total Published Content</div>
                <div className="text-2xl font-semibold text-white">342</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Active Announcements</div>
                <div className="text-2xl font-semibold text-white">2</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="text-sm text-zinc-400 font-medium mb-1">Push Notifications Sent (30d)</div>
                <div className="text-2xl font-semibold text-white">14</div>
              </div>
            </div>

            <div className="bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col flex-1">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search content..." 
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Types</option>
                    <option>Announcement</option>
                    <option>Education</option>
                  </select>
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Statuses</option>
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/[0.08]">
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Author</th>
                      <th className="px-6 py-4 font-medium">Publish Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {mockContent.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{item.title}</div>
                          <div className="text-xs text-zinc-500">{item.id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{item.type}</td>
                        <td className="px-6 py-4 text-sm text-zinc-300">{item.author}</td>
                        <td className="px-6 py-4 text-sm text-zinc-400">{item.date}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full border",
                            item.status === 'Published' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
                          )}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-md text-blue-400 hover:bg-blue-400/10 transition-colors" title="Edit">
                              <FileText className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-md text-rose-400 hover:bg-rose-400/10 transition-colors" title="Delete">
                              <Ban className="w-4 h-4" />
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
      case 'settings':
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Settings & Security</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Configuration */}
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-6 flex flex-col space-y-6">
                <h3 className="text-lg font-semibold text-white">Platform Configuration</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Trading Engine</div>
                      <div className="text-xs text-zinc-500">Enable or disable all trading activities</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">New User Registration</div>
                      <div className="text-xs text-zinc-500">Allow new users to sign up</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">Maintenance Mode</div>
                      <div className="text-xs text-zinc-500">Display maintenance page to all users</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08]">
                  <h4 className="text-sm font-medium text-white mb-4">Fee Structures</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-400">Standard Trading Fee</span>
                      <div className="flex items-center gap-2">
                        <input type="text" defaultValue="0.1" className="w-20 bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white text-right focus:outline-none focus:border-blue-500/50" />
                        <span className="text-sm text-zinc-500">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-400">Fiat Withdrawal Fee</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-500">$</span>
                        <input type="text" defaultValue="25.00" className="w-20 bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white text-right focus:outline-none focus:border-blue-500/50" />
                      </div>
                    </div>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors mt-2">
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>

              {/* Audit Logs */}
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/[0.08] flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Admin Audit Logs</h3>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/[0.08]">
                        <th className="px-6 py-4 font-medium">Admin</th>
                        <th className="px-6 py-4 font-medium">Action</th>
                        <th className="px-6 py-4 font-medium">Target</th>
                        <th className="px-6 py-4 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {mockAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-sm text-zinc-300">{log.admin}</td>
                          <td className="px-6 py-4 text-sm font-medium text-white">{log.action}</td>
                          <td className="px-6 py-4 text-sm text-zinc-400">{log.target}</td>
                          <td className="px-6 py-4 text-xs text-zinc-500">{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">AI Insights & Alerts</h2>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <div className="text-sm text-zinc-400 font-medium">Critical Alerts</div>
                </div>
                <div className="text-2xl font-semibold text-white">1</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <div className="text-sm text-zinc-400 font-medium">Active Warnings</div>
                </div>
                <div className="text-2xl font-semibold text-white">3</div>
              </div>
              <div className="bg-[#121826] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <BrainCircuit className="w-4 h-4 text-blue-400" />
                  <div className="text-sm text-zinc-400 font-medium">New Insights</div>
                </div>
                <div className="text-2xl font-semibold text-white">12</div>
              </div>
            </div>

            <div className="bg-[#121826] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col flex-1">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search insights..." 
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-blue-500/50 appearance-none">
                    <option>All Types</option>
                    <option>Alert</option>
                    <option>Warning</option>
                    <option>Insight</option>
                  </select>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/[0.08]">
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Insight / Alert</th>
                      <th className="px-6 py-4 font-medium">Impact</th>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {mockAIInsights.map((insight) => (
                      <tr key={insight.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 w-fit",
                            insight.type === 'Alert' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                            insight.type === 'Warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                            "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          )}>
                            {insight.type === 'Alert' && <AlertTriangle className="w-3 h-3" />}
                            {insight.type === 'Warning' && <AlertCircle className="w-3 h-3" />}
                            {insight.type === 'Insight' && <BrainCircuit className="w-3 h-3" />}
                            {insight.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white mb-1">{insight.title}</div>
                          <div className="text-sm text-zinc-400 max-w-md">{insight.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-sm font-medium",
                            insight.impact === 'Critical' ? "text-rose-400" :
                            insight.impact === 'High' ? "text-amber-400" :
                            "text-zinc-300"
                          )}>
                            {insight.impact}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">{insight.time}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-colors opacity-0 group-hover:opacity-100">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-zinc-500">
            Module under construction
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F14] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-white/[0.08] bg-[#121826] flex flex-col shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg mr-3">
            N
          </div>
          <span className="font-semibold text-lg tracking-tight">NXG Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group text-sm",
                  isActive 
                    ? "text-white bg-white/5" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="admin-active-nav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-400" : "group-hover:text-zinc-300")} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <span className="text-xs font-bold text-blue-400">SA</span>
              </div>
              <div>
                <p className="text-xs font-medium text-white">Super Admin</p>
                <p className="text-[10px] text-emerald-400">Prod Env v2.4</p>
              </div>
            </div>
            <button onClick={onExit} className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-md transition-colors" title="Exit Admin">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-white/[0.08] bg-[#121826]/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-black/40 rounded-xl px-3 py-2 w-64 border border-white/[0.08] focus-within:border-blue-500/50 transition-colors">
              <Search className="w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search users, TXs (⌘K)" 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-zinc-200 placeholder:text-zinc-600"
              />
            </div>
            <div className="hidden md:flex gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-400 font-medium cursor-pointer hover:bg-white/10 transition-colors">Pending KYC (12)</span>
              <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium cursor-pointer hover:bg-rose-500/20 transition-colors">High Risk (3)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
            <button className="relative p-2 rounded-xl bg-white/5 border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#121826]"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0B0F14]">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight capitalize">{activeTab.replace('-', ' ')}</h1>
              <p className="text-sm text-zinc-400 mt-1">Manage and monitor platform activity</p>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
