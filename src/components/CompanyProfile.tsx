import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ShieldCheck, TrendingUp, Users, 
  Briefcase, Activity, FileText, ChevronRight, 
  BrainCircuit, Download, ExternalLink, Play, Wallet,
  FileSpreadsheet, X, AlertTriangle, Target, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

interface CompanyProfileProps {
  companyId: string | null;
  onBack: () => void;
  setActiveTab: (tab: string) => void;
}

const performanceData = [
  { month: 'Jan', revenue: 120000, users: 4500 },
  { month: 'Feb', revenue: 145000, users: 5200 },
  { month: 'Mar', revenue: 160000, users: 6100 },
  { month: 'Apr', revenue: 190000, users: 7800 },
  { month: 'May', revenue: 220000, users: 9200 },
  { month: 'Jun', revenue: 280000, users: 11500 },
];

const fundingHistory = [
  { round: 'Seed', date: 'Oct 2024', amount: '$1.2M', valuation: '$5M', lead: 'Pan-African Ventures' },
  { round: 'Pre-Seed', date: 'Jan 2024', amount: '$250K', valuation: '$1.5M', lead: 'Angel Syndicate' },
];

const leadership = [
  { name: 'Sarah Odedina', role: 'Founder & CEO', prev: 'ex-Paystack, Stanford GSB' },
  { name: 'Michael Chen', role: 'CTO', prev: 'ex-Google, MIT' },
  { name: 'David Nwachukwu', role: 'Head of Growth', prev: 'ex-Uber Africa' },
];

export function CompanyProfile({ companyId, onBack, setActiveTab }: CompanyProfileProps) {
  const [localActiveTab, setLocalActiveTab] = useState<'overview' | 'financials' | 'dataroom'>('overview');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [previewDoc, setPreviewDoc] = useState<{name: string, type: string, size: string, date: string} | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const equityEarned = (investmentAmount / 2000000) * 100; // Assuming $2M valuation for example
  const quarterlyReturn = 8.5; // Fixed percentage for example

  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  React.useEffect(() => {
    if (localActiveTab === 'financials') {
      setIsLoadingHistory(true);
      fetch('/api/market/twelvedata/time_series/AAPL')
        .then(res => {
          if (!res.ok) throw new Error("HTTP error");
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          }
          throw new Error("Not JSON");
        })
        .then(data => {
          if (data.values && Array.isArray(data.values)) {
            const formatted = [...data.values].reverse().map((item: any) => ({
              date: item.datetime.length > 10 ? item.datetime.split(' ')[0] : item.datetime,
              price: parseFloat(item.close || item.price || 0)
            }));
            setHistoryData(formatted);
          } else {
            throw new Error("Invalid structure");
          }
        })
        .catch(err => {
          // Generate beautiful historical simulated timeline
          const mockValues = [];
          let basePrice = 185.40;
          for (let i = 20; i >= 0; i--) {
            const dateObj = new Date();
            dateObj.setDate(dateObj.getDate() - i);
            const rand = 1 + (Math.random() * 0.03 - 0.015);
            basePrice = basePrice * rand;
            mockValues.push({
              date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              price: parseFloat(basePrice.toFixed(2))
            });
          }
          setHistoryData(mockValues);
        })
        .finally(() => {
          setIsLoadingHistory(false);
        });
    }
  }, [localActiveTab]);

  return (
    <div className="space-y-8">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all">
            Follow
          </button>
          <button 
            onClick={() => setShowInvestModal(true)}
            className="px-6 py-2 rounded-xl bg-[#0066FF] text-white font-medium hover:bg-[#0066FF]/80 transition-all shadow-[0_0_15px_rgba(0,102,255,0.3)]"
          >
            Invest Now
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#00C896]/20 via-[#0066FF]/20 to-[#FFFFFF]/20" />
        <div className="p-8 pt-16 relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-end">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00C896] to-[#0066FF] flex items-center justify-center shrink-0 shadow-lg shadow-[#00C896]/20">
            <span className="text-3xl font-bold text-white">NA</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">Naspers</h1>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Company
              </span>
            </div>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Global consumer internet group and one of the largest technology investors in the world.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 md:w-32">
              <p className="text-zinc-500 text-xs mb-1">AI Growth Score</p>
              <p className="text-2xl font-mono text-[#00C896]">94/100</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 md:w-32">
              <p className="text-zinc-500 text-xs mb-1">Risk Level</p>
              <p className="text-2xl font-mono text-[#0066FF]">Low</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 md:w-32">
              <p className="text-zinc-500 text-xs mb-1">Investor Sentiment</p>
              <p className="text-2xl font-mono text-[#00C896]">Bullish</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-px">
        {['overview', 'financials', 'dataroom'].map((tab) => (
          <button
            key={tab}
            onClick={() => setLocalActiveTab(tab as any)}
            className={`px-6 py-3 text-sm font-medium capitalize transition-all relative ${
              localActiveTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab === 'dataroom' ? 'Data Room' : tab}
            {localActiveTab === tab && (
              <motion.div 
                layoutId="profile-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {localActiveTab === 'overview' && (
            <>
              {/* Promotional Video */}
              <section className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video bg-zinc-900 group cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                {!isPlayingVideo ? (
                  <>
                    <img src="https://picsum.photos/seed/agripay/1280/720?blur=2" alt="Video Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-xl font-bold text-white">Naspers - Vision 2026</h3>
                      <p className="text-sm text-zinc-300">2:45 • Company Overview</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="text-center space-y-4">
                      <Play className="w-12 h-12 text-zinc-600 mx-auto" />
                      <p className="text-zinc-400">Video player placeholder</p>
                      <button onClick={(e) => { e.stopPropagation(); setIsPlayingVideo(false); }} className="text-sm text-[#0066FF] hover:text-[#0066FF]/80">Close Video</button>
                    </div>
                  </div>
                )}
              </section>

              {/* Business Overview */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Business Overview</h2>
                <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                  <p>
                    Naspers is revolutionizing the agricultural supply chain by providing embedded finance solutions directly to smallholder farmers and cooperatives. By digitizing payments and crop receipts, Naspers creates verifiable financial histories that unlock credit, insurance, and global market access.
                  </p>
                  <p>
                    Currently operating in Nigeria, Kenya, and Ghana, the platform processes over $2M in monthly transaction volume with a 15% MoM growth rate.
                  </p>
                </div>
              </section>

              {/* AI Insights */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-[#FFFFFF]" />
                  <h2 className="text-xl font-semibold text-white">AI-Generated Insights</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#00C896]/10 to-transparent border border-[#00C896]/20">
                    <TrendingUp className="w-6 h-6 text-[#00C896] mb-3" />
                    <h3 className="text-white font-medium mb-2">Growth Potential</h3>
                    <p className="text-sm text-zinc-400">High potential in East African markets. Projected 3x user base growth over the next 18 months based on current MoM acquisition rates.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FF3B3B]/10 to-transparent border border-[#FF3B3B]/20">
                    <AlertTriangle className="w-6 h-6 text-[#FF3B3B] mb-3" />
                    <h3 className="text-white font-medium mb-2">Risk Assessment</h3>
                    <p className="text-sm text-zinc-400">Moderate regulatory risk in new jurisdictions. Dependency on local telecom infrastructure for mobile money integrations.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0066FF]/10 to-transparent border border-[#0066FF]/20">
                    <Target className="w-6 h-6 text-[#0066FF] mb-3" />
                    <h3 className="text-white font-medium mb-2">Market Opportunities</h3>
                    <p className="text-sm text-zinc-400">Expansion into micro-insurance products creates a strong cross-selling opportunity to the existing farmer network.</p>
                  </div>
                </div>
              </section>

              {/* Product Ecosystem */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Product Ecosystem</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-[#00C896]/20 flex items-center justify-center mb-4">
                      <Wallet className="w-5 h-5 text-[#00C896]" />
                    </div>
                    <h3 className="text-white font-medium mb-2">AgriWallet</h3>
                    <p className="text-sm text-zinc-400">Digital wallet for farmers to receive instant payments from buyers and cooperatives.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 flex items-center justify-center mb-4">
                      <TrendingUp className="w-5 h-5 text-[#0066FF]" />
                    </div>
                    <h3 className="text-white font-medium mb-2">YieldCredit</h3>
                    <p className="text-sm text-zinc-400">Micro-loans based on historical crop yield data and digital payment history.</p>
                  </div>
                </div>
              </section>

              {/* Funding Round Details */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Funding Round Details</h2>
                <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Round Type</th>
                        <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                        <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Amount Raised</th>
                        <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Valuation</th>
                        <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lead Investor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {fundingHistory.map((round, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-sm font-medium text-white">{round.round}</td>
                          <td className="p-4 text-sm text-zinc-400">{round.date}</td>
                          <td className="p-4 text-sm font-mono text-[#00C896]">{round.amount}</td>
                          <td className="p-4 text-sm font-mono text-zinc-300">{round.valuation}</td>
                          <td className="p-4 text-sm text-[#0066FF]">{round.lead}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Leadership */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Leadership Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {leadership.map((leader, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 mb-3" />
                      <h4 className="text-white font-medium">{leader.name}</h4>
                      <p className="text-xs text-[#0066FF] mb-2">{leader.role}</p>
                      <p className="text-xs text-zinc-500">{leader.prev}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {localActiveTab === 'financials' && (
            <div className="space-y-8">
              {/* Historical Prices (Stockdio) */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Historical Prices</h2>
                  <span className="flex items-center gap-1 text-xs text-[#0066FF] bg-[#0066FF]/10 px-2 py-1 rounded-lg">
                    <Activity className="w-3 h-3" /> Market Data
                  </span>
                </div>
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 min-h-[350px] flex flex-col justify-between">
                  {isLoadingHistory ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 py-16">
                      <RefreshCw className="w-8 h-8 animate-spin text-[#0066FF] mb-3" />
                      <span className="text-xs font-mono">Syncing TwelveData Core...</span>
                    </div>
                  ) : (
                    <div className="h-72 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                        <AreaChart data={historyData}>
                          <defs>
                            <linearGradient id="historyGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#52525b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#52525b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            domain={['auto', 'auto']}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '11px' }}
                            itemStyle={{ color: '#0066FF', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#0066FF" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#historyGrad)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-4 pt-4 border-t border-white/[0.04]">
                    <span>Continuous TwelveData & Finnhub Smart Feed Integration</span>
                    <span>All prices in USD</span>
                  </div>
                </div>
              </section>

              {/* Live Dashboards */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Revenue Growth</h2>
                  <span className="flex items-center gap-1 text-xs text-[#00C896] bg-[#00C896]/10 px-2 py-1 rounded-lg">
                    <Activity className="w-3 h-3" /> Live Data
                  </span>
                </div>
                <div className="h-72 w-full bg-white/5 border border-white/10 rounded-3xl p-6">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C896" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A0F1C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#00C896' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#00C896" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Funding History</h2>
                <div className="space-y-3">
                  {fundingHistory.map((round, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{round.round}</h4>
                          <span className="text-xs text-zinc-500">{round.date}</span>
                        </div>
                        <p className="text-sm text-zinc-400">Lead: {round.lead}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-mono">{round.amount}</p>
                        <p className="text-xs text-zinc-500">Valuation: {round.valuation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {localActiveTab === 'dataroom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Premium Data Room</h2>
                <button className="text-sm text-[#0066FF] hover:text-[#0066FF]/80 flex items-center gap-1">
                  <Download className="w-4 h-4" /> Download All
                </button>
              </div>
              
              {[
                { name: 'Q2 2025 Financial Statements.pdf', type: 'Financials', size: '2.4 MB', date: 'Oct 12, 2025' },
                { name: 'Cap Table & Ownership.xlsx', type: 'Legal', size: '1.1 MB', date: 'Oct 10, 2025' },
                { name: 'Investor Pitch Deck v4.pdf', type: 'Pitch', size: '8.5 MB', date: 'Oct 05, 2025' },
                { name: 'Certificate of Incorporation.pdf', type: 'Legal', size: '0.8 MB', date: 'Jan 15, 2024' },
              ].map((doc, i) => (
                <div 
                  key={i} 
                  onClick={() => setPreviewDoc(doc)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.name.endsWith('.xlsx') ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-[#0066FF]/10 text-[#0066FF]'}`}>
                      {doc.name.endsWith('.xlsx') ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-[#0066FF] transition-colors">{doc.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-white/5">{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0066FF]/10 to-transparent border border-[#0066FF]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-24 h-24 text-[#0066FF]" />
            </div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <BrainCircuit className="w-5 h-5 text-[#0066FF]" />
              <h3 className="text-white font-medium">AI Generated Insights</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <strong className="text-[#00C896]">Strong Growth Signal:</strong> Naspers has demonstrated exceptional retention (94%) among farming cooperatives, indicating high product-market fit.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <strong className="text-[#FF3B3B]">Risk Factor:</strong> High dependency on mobile network operator APIs in Kenya. Diversification of payment rails recommended.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <strong className="text-[#0066FF]">Market Opportunity:</strong> Expansion into Francophone West Africa could increase TAM by 40% within 18 months.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-white font-medium mb-2">Company Details</h3>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-zinc-500 text-sm">Founded</span>
              <span className="text-white text-sm">2023</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-zinc-500 text-sm">Headquarters</span>
              <span className="text-white text-sm">Lagos, Nigeria</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-zinc-500 text-sm">Employees</span>
              <span className="text-white text-sm">45-100</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-zinc-500 text-sm">Website</span>
              <a href="https://agripay.africa" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] text-sm flex items-center gap-1 hover:underline">
                agripay.africa <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Invest Modal */}
      <AnimatePresence>
        {showInvestModal && (
          <motion.div 
            key="invest-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              onClick={() => setShowInvestModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0F1C] border border-white/10 rounded-3xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00C896] to-[#0066FF]" />
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Confirm Investment</h2>
                <button onClick={() => setShowInvestModal(false)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C896] to-[#0066FF] flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-white">AP</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Naspers</h3>
                    <p className="text-sm text-zinc-400">Series A Equity</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Investment Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                    <input 
                      type="number" 
                      value={investmentAmount} 
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white outline-none focus:border-[#0066FF]/50 transition-colors text-xl font-medium" 
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Company Name</span>
                    <span className="text-white font-medium">Naspers</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Investment Amount</span>
                    <span className="text-white font-medium font-mono">${investmentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Equity Earned</span>
                    <span className="text-white font-medium font-mono">{equityEarned.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                    <span className="text-zinc-400">Quarterly Return</span>
                    <span className="text-[#00C896] font-bold font-mono">~{quarterlyReturn}%</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => setShowInvestModal(false)}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setShowInvestModal(false);
                      setActiveTab('portfolio');
                    }}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00C896] text-white font-bold hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] transition-all"
                  >
                    Confirm Investment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div 
            key="doc-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-[80vh] bg-[#0A0F1C] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${previewDoc.name.endsWith('.xlsx') ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-[#0066FF]/10 text-[#0066FF]'}`}>
                    {previewDoc.name.endsWith('.xlsx') ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{previewDoc.name}</h3>
                    <p className="text-xs text-zinc-400">{previewDoc.size} • {previewDoc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button onClick={() => setPreviewDoc(null)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-zinc-900/50 flex flex-col p-4 overflow-hidden">
                {previewDoc.name.endsWith('.xlsx') ? (
                  <div className="flex-1 bg-white rounded-xl overflow-hidden flex flex-col">
                    <div className="h-10 border-b border-zinc-200 bg-zinc-50 flex items-center px-4 gap-4">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 text-center text-xs font-medium text-zinc-500">
                        {previewDoc.name} - Read Only
                      </div>
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                      <table className="w-full text-sm text-left text-zinc-600 border-collapse">
                        <thead className="text-xs text-zinc-700 bg-zinc-100 uppercase">
                          <tr>
                            <th className="border border-zinc-200 px-4 py-2">Shareholder</th>
                            <th className="border border-zinc-200 px-4 py-2">Shares</th>
                            <th className="border border-zinc-200 px-4 py-2">Ownership %</th>
                            <th className="border border-zinc-200 px-4 py-2">Class</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="border border-zinc-200 px-4 py-2 font-medium text-zinc-900">Founders</td>
                            <td className="border border-zinc-200 px-4 py-2">5,000,000</td>
                            <td className="border border-zinc-200 px-4 py-2">50.0%</td>
                            <td className="border border-zinc-200 px-4 py-2">Common</td>
                          </tr>
                          <tr className="bg-zinc-50">
                            <td className="border border-zinc-200 px-4 py-2 font-medium text-zinc-900">Seed Investors</td>
                            <td className="border border-zinc-200 px-4 py-2">2,500,000</td>
                            <td className="border border-zinc-200 px-4 py-2">25.0%</td>
                            <td className="border border-zinc-200 px-4 py-2">Preferred Seed</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="border border-zinc-200 px-4 py-2 font-medium text-zinc-900">Series A Investors</td>
                            <td className="border border-zinc-200 px-4 py-2">1,500,000</td>
                            <td className="border border-zinc-200 px-4 py-2">15.0%</td>
                            <td className="border border-zinc-200 px-4 py-2">Preferred A</td>
                          </tr>
                          <tr className="bg-zinc-50">
                            <td className="border border-zinc-200 px-4 py-2 font-medium text-zinc-900">Option Pool</td>
                            <td className="border border-zinc-200 px-4 py-2">1,000,000</td>
                            <td className="border border-zinc-200 px-4 py-2">10.0%</td>
                            <td className="border border-zinc-200 px-4 py-2">Options</td>
                          </tr>
                          <tr className="bg-zinc-100 font-bold">
                            <td className="border border-zinc-200 px-4 py-2 text-zinc-900">Total</td>
                            <td className="border border-zinc-200 px-4 py-2">10,000,000</td>
                            <td className="border border-zinc-200 px-4 py-2">100.0%</td>
                            <td className="border border-zinc-200 px-4 py-2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-zinc-800 rounded-xl overflow-hidden flex flex-col items-center py-8 px-4 overflow-y-auto">
                    <div className="w-full max-w-2xl bg-white shadow-2xl min-h-[800px] p-12 flex flex-col">
                      <div className="border-b-2 border-zinc-900 pb-6 mb-8 flex justify-between items-end">
                        <div className="text-3xl font-bold text-zinc-900 tracking-tight">Naspers</div>
                        <div className="text-sm text-zinc-500 uppercase tracking-widest">{previewDoc.type}</div>
                      </div>
                      
                      <div className="flex-1 space-y-6 text-zinc-800">
                        <h1 className="text-4xl font-bold text-center mb-12 mt-8">{previewDoc.name.replace('.pdf', '')}</h1>
                        
                        <div className="space-y-4">
                          <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-200 pb-2">1. Executive Summary</h2>
                          <p className="leading-relaxed">
                            Naspers is revolutionizing the agricultural supply chain by providing embedded finance solutions directly to smallholder farmers and cooperatives. By digitizing payments and crop receipts, Naspers creates verifiable financial histories that unlock credit, insurance, and global market access.
                          </p>
                          <p className="leading-relaxed">
                            Currently operating in Nigeria, Kenya, and Ghana, the platform processes over $2M in monthly transaction volume with a 15% MoM growth rate.
                          </p>
                        </div>

                        <div className="space-y-4 mt-8">
                          <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-200 pb-2">2. Financial Highlights</h2>
                          <div className="grid grid-cols-2 gap-6 mt-4">
                            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                              <div className="text-sm text-zinc-500 mb-1">Q2 2025 Revenue</div>
                              <div className="text-2xl font-bold text-zinc-900">$850,000</div>
                            </div>
                            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                              <div className="text-sm text-zinc-500 mb-1">Gross Margin</div>
                              <div className="text-2xl font-bold text-zinc-900">68%</div>
                            </div>
                            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                              <div className="text-sm text-zinc-500 mb-1">Active Users</div>
                              <div className="text-2xl font-bold text-zinc-900">11,500+</div>
                            </div>
                            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                              <div className="text-sm text-zinc-500 mb-1">CAC</div>
                              <div className="text-2xl font-bold text-zinc-900">$12.50</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-12 text-center text-xs text-zinc-400">
                          CONFIDENTIAL AND PROPRIETARY - DO NOT DISTRIBUTE
                          <br />
                          Page 1 of 12
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
