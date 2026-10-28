import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Globe, BarChart3, Zap, BrainCircuit, Clock, ChevronRight, AlertCircle, ArrowRightLeft, DollarSign, Percent, Settings, Wallet, History, Shield, Server, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ForexMarketProps {
  view?: 'hub' | 'pair' | 'trade' | 'confirmation' | 'order' | 'history' | 'liquidity' | 'positions' | 'analytics';
  pairSlug?: string;
  orderId?: string;
  setActiveTab: (tab: string) => void;
}

const forexPairs = [
  { slug: 'usd-ngn', name: 'USD/NGN', fullName: 'US Dollar / Nigerian Naira', rate: 1450.50, change: -1.5, volume: '$45.2M', aiInsight: 'USD/NGN facing downward pressure due to recent CBN liquidity injections — short-term stabilization expected.' },
  { slug: 'usd-zar', name: 'USD/ZAR', fullName: 'US Dollar / South African Rand', rate: 18.75, change: 0.2, volume: '$120.5M', aiInsight: 'USD/ZAR rising due to weakening rand and global USD strength — short-term bullish continuation likely (+1.1% projected).' },
  { slug: 'eur-kes', name: 'EUR/KES', fullName: 'Euro / Kenyan Shilling', rate: 142.30, change: 0.8, volume: '$28.4M', aiInsight: 'EUR/KES showing strong bullish momentum following ECB rate hold — resistance test at 143.00 imminent.' },
  { slug: 'gbp-egp', name: 'GBP/EGP', fullName: 'British Pound / Egyptian Pound', rate: 59.80, change: -0.4, volume: '$15.7M', aiInsight: 'GBP/EGP consolidating after recent volatility. Watch for breakout above 60.00 level.' },
  { slug: 'usd-ghs', name: 'USD/GHS', fullName: 'US Dollar / Ghanaian Cedi', rate: 13.50, change: 0.1, volume: '$12.1M', aiInsight: 'USD/GHS remains stable amid improved cocoa export receipts. Range-bound trading expected.' },
];

const generateForexPairs = () => {
  const generated = [];
  const bases = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'ZAR', 'NGN', 'KES', 'EGP', 'GHS', 'UGX', 'TZS', 'RWF', 'XOF', 'XAF', 'MAD', 'DZD', 'AOA', 'BWP', 'CDF', 'ETB', 'GNF', 'LSL', 'MGA', 'MWK', 'MZN', 'NAD', 'SLL', 'SOS', 'SZL', 'TND', 'ZMW', 'ZWL', 'BIF', 'CVE', 'DJF', 'ERN', 'GMD', 'LRD', 'LYD', 'MRU', 'MUR', 'SCR', 'SDG', 'STN'];
  const quotes = [...bases];
  
  const existingSlugs = new Set(forexPairs.map(p => p.slug));

  let count = 1;
  for (let i = 0; i < bases.length; i++) {
    for (let j = 0; j < quotes.length; j++) {
      if (bases[i] !== quotes[j]) {
        const slug = `${bases[i].toLowerCase()}-${quotes[j].toLowerCase()}`;
        if (existingSlugs.has(slug)) continue;

        const rate = Math.random() * 1000 + 0.1;
        generated.push({
          slug,
          name: `${bases[i]}/${quotes[j]}`,
          fullName: `${bases[i]} to ${quotes[j]} Exchange Rate`,
          rate: Number(rate.toFixed(4)),
          change: Number(((Math.random() * 4) - 2).toFixed(2)),
          volume: `$${(Math.random() * 500 + 1).toFixed(1)}M`,
          aiInsight: `AI analysis suggests ${Math.random() > 0.5 ? 'bullish' : 'bearish'} trend for ${bases[i]}/${quotes[j]} based on regional economic indicators.`
        });
        count++;
        if (count > 2200) break;
      }
    }
    if (count > 2200) break;
  }
  return generated;
};

const allForexPairs = [...forexPairs, ...generateForexPairs()];

const generateChartData = (basePrice: number, volatility: number) => {
  let currentPrice = basePrice;
  return Array.from({ length: 24 }).map((_, i) => {
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice + change;
    return {
      time: `${i}:00`,
      price: currentPrice
    };
  });
};

export function ForexMarket({ view = 'hub', pairSlug, orderId, setActiveTab }: ForexMarketProps) {
  const [activePair, setActivePair] = useState(allForexPairs.find(p => p.slug === pairSlug) || allForexPairs[0]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [amount, setAmount] = useState('1000');
  const [leverage, setLeverage] = useState('1x');
  const [flashingRows, setFlashingRows] = useState<Record<string, 'up' | 'down' | null>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const getPaginatedPairs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allForexPairs.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(allForexPairs.length / itemsPerPage);
    return (
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
        <span className="text-sm text-zinc-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, allForexPairs.length)} of {allForexPairs.length} pairs
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (pairSlug) {
      const pair = allForexPairs.find(p => p.slug === pairSlug);
      if (pair) {
        setActivePair(pair);
        setChartData(generateChartData(pair.rate, pair.rate * 0.005));
      }
    }
  }, [pairSlug]);

  // Simulate live rate updates
  useEffect(() => {
    if (view !== 'hub') return;

    const interval = setInterval(() => {
      const paginatedPairs = getPaginatedPairs();
      const randomPairIndex = Math.floor(Math.random() * paginatedPairs.length);
      const pair = paginatedPairs[randomPairIndex];
      const isUp = Math.random() > 0.5;
      
      setFlashingRows(prev => ({ ...prev, [pair.slug]: isUp ? 'up' : 'down' }));
      
      setTimeout(() => {
        setFlashingRows(prev => ({ ...prev, [pair.slug]: null }));
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [view, currentPage]);

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockOrderId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setActiveTab(`market-forex-order-${mockOrderId}`);
  };

  const renderHub = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Pan-African FX Liquidity Network</h1>
          <p className="text-zinc-400">Institutional-grade currency exchange and macro intelligence.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('market-forex-positions')} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10">
            Positions
          </button>
          <button onClick={() => setActiveTab('market-forex-history')} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10">
            History
          </button>
          <button onClick={() => setActiveTab('market-forex-analytics')} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10">
            AI Analytics
          </button>
          <button onClick={() => setActiveTab('market-forex-liquidity')} className="bg-white/5 hover:bg-white/10 text-amber-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-amber-500/20">
            LP Dashboard
          </button>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-500/20 ml-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Market Open
          </div>
        </div>
      </div>

      {/* AI Macro Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Macro Intelligence Layer</h3>
              <p className="text-sm text-blue-400">Real-time central bank & inflation analysis</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="text-sm text-zinc-400 mb-1">SARB Decision</div>
              <div className="text-white font-medium">Rates held at 8.25%</div>
              <div className="text-xs text-emerald-400 mt-1">ZAR Bullish</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="text-sm text-zinc-400 mb-1">Nigeria Inflation</div>
              <div className="text-white font-medium">Rose to 31.7%</div>
              <div className="text-xs text-red-400 mt-1">NGN Bearish</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="text-sm text-zinc-400 mb-1">US Fed Funds</div>
              <div className="text-white font-medium">Cuts delayed to Q3</div>
              <div className="text-xs text-emerald-400 mt-1">USD Bullish</div>
            </div>
          </div>
        </div>

        {/* Multi-Currency Wallet */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-medium">Multi-Currency Wallet</h3>
            </div>
            <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition-colors">
              Convert
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">USD</div>
                <span className="text-sm text-zinc-300">US Dollar</span>
              </div>
              <span className="text-white font-mono">$12,450.00</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">ZAR</div>
                <span className="text-sm text-zinc-300">SA Rand</span>
              </div>
              <span className="text-white font-mono">R 45,200.50</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">NGN</div>
                <span className="text-sm text-zinc-300">Naira</span>
              </div>
              <span className="text-white font-mono">₦ 2,500,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live FX Board */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Live FX Board
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pair</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Rate</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">24h Change</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Volume</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI Signal</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {getPaginatedPairs().map((pair) => (
                <tr 
                  key={pair.slug} 
                  onClick={() => setActiveTab(`market-forex-pair-${pair.slug}`)}
                  className={`hover:bg-white/5 transition-colors cursor-pointer group ${
                    flashingRows[pair.slug] === 'up' ? 'bg-emerald-500/20' : 
                    flashingRows[pair.slug] === 'down' ? 'bg-red-500/20' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                        <Globe className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{pair.name}</div>
                        <div className="text-xs text-zinc-500">{pair.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-mono text-white">
                    {pair.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                      pair.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {pair.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(pair.change)}%
                    </div>
                  </td>
                  <td className="p-4 text-sm text-zinc-400">{pair.volume}</td>
                  <td className="p-4">
                    <div className="max-w-xs text-xs text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">
                      <Zap className="w-3 h-3 inline mr-1 text-amber-400" />
                      {pair.aiInsight}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(`market-forex-trade-${pair.slug}`);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4">
          {renderPagination()}
        </div>
      </div>
    </div>
  );

  const renderPairDetail = () => (
    <div className="space-y-6">
      <button 
        onClick={() => setActiveTab('market-forex')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to FX Hub
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            {activePair.name}
            <span className={`text-lg px-3 py-1 rounded-xl flex items-center gap-1 ${
              activePair.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {activePair.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {Math.abs(activePair.change)}%
            </span>
          </h1>
          <p className="text-zinc-400 mt-1">{activePair.fullName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <div className="text-2xl font-mono text-white">
              {activePair.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
            <div className="text-sm text-zinc-500">Current Rate</div>
          </div>
          <button 
            onClick={() => setActiveTab(`market-forex-trade-${activePair.slug}`)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            Trade {activePair.name}
          </button>
        </div>
      </div>

      {/* AI Intelligence Engine */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-amber-400" />
            <h3 className="text-amber-400 font-medium">Pan-African FX Intelligence Engine</h3>
          </div>
          <p className="text-lg text-white leading-relaxed">
            "{activePair.aiInsight}"
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-4 h-4" /> Updated 2 mins ago
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <Activity className="w-4 h-4" /> 89% Confidence
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Live Chart</h3>
              <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
                {['1H', '1D', '1W', '1M'].map(tf => (
                  <button key={tf} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${tf === '1D' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}>
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activePair.change >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={activePair.change >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val.toFixed(2)} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: activePair.change >= 0 ? '#10b981' : '#ef4444' }}
                    formatter={(value: number) => [value.toFixed(4), 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke={activePair.change >= 0 ? '#10b981' : '#ef4444'} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Book */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Book</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-zinc-500 mb-2">
                <span>Size</span>
                <span>Ask</span>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={`ask-${i}`} className="flex justify-between text-sm relative">
                  <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{ width: `${Math.random() * 100}%` }} />
                  <span className="text-zinc-300 relative z-10">{(Math.random() * 10 + 1).toFixed(2)}M</span>
                  <span className="text-red-400 font-mono relative z-10">{(activePair.rate + (5-i)*0.001).toFixed(4)}</span>
                </div>
              ))}
              
              <div className="py-2 border-y border-white/10 flex justify-between items-center my-2">
                <span className="text-sm text-zinc-400">Spread</span>
                <span className="text-sm font-mono text-white">1.2 pips</span>
              </div>

              {[...Array(5)].map((_, i) => (
                <div key={`bid-${i}`} className="flex justify-between text-sm relative">
                  <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10" style={{ width: `${Math.random() * 100}%` }} />
                  <span className="text-zinc-300 relative z-10">{(Math.random() * 10 + 1).toFixed(2)}M</span>
                  <span className="text-emerald-400 font-mono relative z-10">{(activePair.rate - (i+1)*0.001).toFixed(4)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>Size</span>
                <span>Bid</span>
              </div>
            </div>
          </div>

          {/* Auto Trading Strategies */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Auto Trading</h3>
              <Settings className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="space-y-3">
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium text-sm">Buy on Dip</div>
                  <div className="text-xs text-zinc-500">Auto-buy if drops &gt; 1%</div>
                </div>
                <div className="w-10 h-5 bg-emerald-500/20 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-emerald-400 rounded-full" />
                </div>
              </div>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium text-sm">Sell on Resistance</div>
                  <div className="text-xs text-zinc-500">Auto-sell at {activePair.name === 'USD/ZAR' ? '19.00' : 'Resistance'}</div>
                </div>
                <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-400 rounded-full" />
                </div>
              </div>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-white font-medium text-sm">AI Signal Follower</div>
                  <div className="text-xs text-zinc-500">Trade on &gt; 85% confidence</div>
                </div>
                <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrade = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => setActiveTab(`market-forex-pair-${activePair.slug}`)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {activePair.name}
      </button>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-black/20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Trade {activePair.name}</h2>
            <div className="text-2xl font-mono text-white">
              {activePair.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
          </div>
          <p className="text-zinc-400">{activePair.fullName}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Buy/Sell Toggle */}
          <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
            <button
              onClick={() => setTradeMode('buy')}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                tradeMode === 'buy' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Buy (Long)
            </button>
            <button
              onClick={() => setTradeMode('sell')}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                tradeMode === 'sell' 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Sell (Short)
            </button>
          </div>

          {/* Order Type */}
          <div className="flex gap-2">
            {['market', 'limit', 'stop'].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type as any)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  orderType === type 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-transparent border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleTradeSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Amount (Base Currency)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-zinc-500" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-lg"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-zinc-500 font-medium">{activePair.name.split('/')[0]}</span>
                </div>
              </div>
            </div>

            {/* Limit Price Input (Conditional) */}
            {orderType !== 'market' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  {orderType === 'limit' ? 'Limit Price' : 'Stop Price'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={activePair.rate}
                    step="0.0001"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-lg font-mono"
                  />
                </div>
              </motion.div>
            )}

            {/* Leverage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-400">Leverage</label>
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> High Risk
                </span>
              </div>
              <div className="flex gap-2">
                {['1x', '5x', '10x', '50x'].map((lev) => (
                  <button
                    key={lev}
                    type="button"
                    onClick={() => setLeverage(lev)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      leverage === lev 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                        : 'bg-black/20 border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    {lev}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Estimated Value</span>
                <span className="text-white font-mono">
                  {(parseFloat(amount || '0') * activePair.rate).toLocaleString()} {activePair.name.split('/')[1]}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Margin Required</span>
                <span className="text-white font-mono">
                  ${(parseFloat(amount || '0') / parseInt(leverage)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Estimated Fees</span>
                <span className="text-white font-mono">$2.50</span>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                tradeMode === 'buy'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
              }`}
            >
              {tradeMode === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-md mx-auto mt-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
        
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Globe className="w-10 h-10 text-emerald-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Order Submitted</h2>
        <p className="text-zinc-400 mb-8">
          Your {tradeMode} order for {activePair.name} has been placed successfully.
        </p>
        
        <div className="bg-black/20 rounded-2xl p-4 mb-8 text-left space-y-3 border border-white/5">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Pair</span>
            <span className="text-white font-medium">{activePair.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Type</span>
            <span className="text-white font-medium capitalize">{orderType} {tradeMode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Amount</span>
            <span className="text-white font-medium">{amount} {activePair.name.split('/')[0]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Leverage</span>
            <span className="text-white font-medium">{leverage}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setActiveTab('market-forex-positions')}
          className="w-full bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-medium transition-colors"
        >
          View Positions
        </button>
      </motion.div>
    </div>
  );

  const renderOrder = () => (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <button 
        onClick={() => setActiveTab('market-forex')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to FX Hub
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Order Executed</h2>
            <p className="text-zinc-400">ID: {orderId || 'FX-8492-A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="text-sm text-zinc-500 mb-1">Pair</div>
            <div className="text-white font-medium text-lg">{activePair.name}</div>
          </div>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="text-sm text-zinc-500 mb-1">Action</div>
            <div className="text-white font-medium text-lg capitalize">{tradeMode}</div>
          </div>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="text-sm text-zinc-500 mb-1">Executed Price</div>
            <div className="text-white font-mono text-lg">{activePair.rate.toFixed(4)}</div>
          </div>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="text-sm text-zinc-500 mb-1">Slippage</div>
            <div className="text-emerald-400 font-mono text-lg">0.2 pips</div>
          </div>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="text-sm text-zinc-500 mb-1">Liquidity Provider</div>
            <div className="text-white font-medium text-lg">LMAX Exchange</div>
          </div>
          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
            <div className="text-sm text-zinc-500 mb-1">Status</div>
            <div className="text-emerald-400 font-medium text-lg">FILLED</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('market-forex-positions')}
            className="flex-1 bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            View Positions
          </button>
          <button 
            onClick={() => setActiveTab(`market-forex-trade-${activePair.slug}`)}
            className="flex-1 bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Trade Again
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderPositions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Open Positions</h1>
        <button 
          onClick={() => setActiveTab('market-forex')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to FX Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-zinc-400 mb-2">Total Exposure</div>
          <div className="text-3xl font-bold text-white font-mono">$124,500.00</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-zinc-400 mb-2">Margin Used</div>
          <div className="text-3xl font-bold text-white font-mono">$12,450.00</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-zinc-400 mb-2">Live PnL</div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">+$1,240.50</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/10 text-zinc-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Pair</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Size</th>
              <th className="p-4 font-medium">Entry Price</th>
              <th className="p-4 font-medium">Current Price</th>
              <th className="p-4 font-medium">PnL</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white">USD/ZAR</td>
              <td className="p-4 text-emerald-400 font-medium">LONG</td>
              <td className="p-4 text-white font-mono">100,000</td>
              <td className="p-4 text-zinc-400 font-mono">18.7000</td>
              <td className="p-4 text-white font-mono">18.7500</td>
              <td className="p-4 text-emerald-400 font-mono">+$500.00</td>
              <td className="p-4 text-right">
                <button className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-red-500/20">
                  Close
                </button>
              </td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white">EUR/KES</td>
              <td className="p-4 text-red-400 font-medium">SHORT</td>
              <td className="p-4 text-white font-mono">50,000</td>
              <td className="p-4 text-zinc-400 font-mono">142.5000</td>
              <td className="p-4 text-white font-mono">142.3000</td>
              <td className="p-4 text-emerald-400 font-mono">+$100.00</td>
              <td className="p-4 text-right">
                <button className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-red-500/20">
                  Close
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Trade History</h1>
        <button 
          onClick={() => setActiveTab('market-forex')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to FX Hub
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/10 text-zinc-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Pair</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Size</th>
              <th className="p-4 font-medium">Entry/Exit</th>
              <th className="p-4 font-medium">PnL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 text-zinc-400 text-sm">Today, 10:45 AM</td>
              <td className="p-4 font-bold text-white">USD/NGN</td>
              <td className="p-4 text-emerald-400 font-medium">LONG</td>
              <td className="p-4 text-white font-mono">10,000</td>
              <td className="p-4 text-zinc-400 font-mono">1440.00 / 1450.50</td>
              <td className="p-4 text-emerald-400 font-mono">+$105.00</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 text-zinc-400 text-sm">Yesterday, 14:20</td>
              <td className="p-4 font-bold text-white">GBP/EGP</td>
              <td className="p-4 text-red-400 font-medium">SHORT</td>
              <td className="p-4 text-white font-mono">25,000</td>
              <td className="p-4 text-zinc-400 font-mono">60.10 / 59.80</td>
              <td className="p-4 text-emerald-400 font-mono">+$75.00</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 text-zinc-400 text-sm">Mar 28, 09:15</td>
              <td className="p-4 font-bold text-white">USD/ZAR</td>
              <td className="p-4 text-emerald-400 font-medium">LONG</td>
              <td className="p-4 text-white font-mono">50,000</td>
              <td className="p-4 text-zinc-400 font-mono">18.80 / 18.75</td>
              <td className="p-4 text-red-400 font-mono">-$250.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLiquidity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Liquidity Provider Dashboard</h1>
          <p className="text-zinc-400">Admin view: LP performance, latency, and fill rates.</p>
        </div>
        <button 
          onClick={() => setActiveTab('market-forex')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to FX Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-zinc-400 mb-2">Aggregated Volume (24h)</div>
          <div className="text-3xl font-bold text-white font-mono">$4.2B</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-zinc-400 mb-2">Avg. Latency</div>
          <div className="text-3xl font-bold text-white font-mono">12ms</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-zinc-400 mb-2">Fill Rate</div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">99.8%</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="text-sm text-zinc-400 mb-2">Active LPs</div>
          <div className="text-3xl font-bold text-white font-mono">8</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/10 text-zinc-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Provider</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Latency</th>
              <th className="p-4 font-medium">Fill Rate</th>
              <th className="p-4 font-medium">Avg Spread (USD/ZAR)</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white flex items-center gap-2"><Server className="w-4 h-4 text-blue-400" /> LMAX Exchange</td>
              <td className="p-4 text-zinc-400">ECN</td>
              <td className="p-4 text-white font-mono">8ms</td>
              <td className="p-4 text-emerald-400 font-mono">99.9%</td>
              <td className="p-4 text-white font-mono">0.8 pips</td>
              <td className="p-4"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-xs">Active</span></td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white flex items-center gap-2"><Server className="w-4 h-4 text-blue-400" /> FXCM Pro</td>
              <td className="p-4 text-zinc-400">Prime Broker</td>
              <td className="p-4 text-white font-mono">15ms</td>
              <td className="p-4 text-emerald-400 font-mono">99.5%</td>
              <td className="p-4 text-white font-mono">1.1 pips</td>
              <td className="p-4"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-xs">Active</span></td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white flex items-center gap-2"><Server className="w-4 h-4 text-blue-400" /> Saxo Bank</td>
              <td className="p-4 text-zinc-400">Bank</td>
              <td className="p-4 text-white font-mono">22ms</td>
              <td className="p-4 text-emerald-400 font-mono">98.2%</td>
              <td className="p-4 text-white font-mono">1.5 pips</td>
              <td className="p-4"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-xs">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI & Performance Analytics</h1>
          <p className="text-zinc-400">Predictive modeling and risk scoring.</p>
        </div>
        <button 
          onClick={() => setActiveTab('market-forex')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to FX Hub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">AI Trade Signals</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-bold">USD/ZAR <span className="text-emerald-400 ml-2">LONG</span></div>
                  <div className="text-sm text-zinc-400">Confidence: 92%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-400">Target</div>
                  <div className="text-white font-mono">19.20</div>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mt-2">Strong bullish divergence detected on 4H chart. Macro factors support USD strength against ZAR.</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-bold">EUR/KES <span className="text-red-400 ml-2">SHORT</span></div>
                  <div className="text-sm text-zinc-400">Confidence: 78%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-400">Target</div>
                  <div className="text-white font-mono">140.50</div>
                </div>
              </div>
              <p className="text-sm text-zinc-300 mt-2">Overbought conditions on daily RSI. Expecting a minor pullback before further upside.</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Risk Scoring</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Portfolio Volatility</span>
                <span className="text-emerald-400">Low (12%)</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Margin Utilization</span>
                <span className="text-amber-400">Moderate (45%)</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-amber-400 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Drawdown Risk</span>
                <span className="text-emerald-400">Safe (2%)</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '2%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {view === 'hub' && renderHub()}
      {view === 'pair' && renderPairDetail()}
      {view === 'trade' && renderTrade()}
      {view === 'confirmation' && renderConfirmation()}
      {view === 'order' && renderOrder()}
      {view === 'history' && renderHistory()}
      {view === 'liquidity' && renderLiquidity()}
      {view === 'positions' && renderPositions()}
      {view === 'analytics' && renderAnalytics()}
    </div>
  );
}
