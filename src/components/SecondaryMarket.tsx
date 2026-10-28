import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Clock, 
  Activity, ShieldCheck, BarChart3, ArrowRightLeft,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

interface SecondaryMarketProps {
  setActiveTab: (tab: string) => void;
  initialView?: 'hub' | 'asset' | 'trade' | 'confirmation';
  assetSlug?: string;
  tradeType?: 'buy' | 'sell';
}

const assets = [
  {
    id: 'paystack-payst',
    name: 'Paystack',
    ticker: 'PAYST',
    price: 145.47,
    change: '+2.42%',
    trend: 'up',
    marketCap: '$1.2B',
    volume24h: '1.2M',
    liquidityScore: 98,
    description: 'Leading African payment gateway acquired by Stripe. Secondary shares available from early employees and seed investors.',
    sector: 'FinTech',
    logo: 'PS'
  },
  {
    id: 'flutterwave-flwv',
    name: 'Flutterwave',
    ticker: 'FLWV',
    price: 210.30,
    change: '-1.15%',
    trend: 'down',
    marketCap: '$3.0B',
    volume24h: '850K',
    liquidityScore: 92,
    description: 'B2B payments infrastructure for Africa. Pre-IPO secondary shares.',
    sector: 'FinTech',
    logo: 'FW'
  },
  {
    id: 'andela-andl',
    name: 'Andela',
    ticker: 'ANDL',
    price: 85.20,
    change: '+5.60%',
    trend: 'up',
    marketCap: '$1.5B',
    volume24h: '420K',
    liquidityScore: 85,
    description: 'Global talent network connecting African developers with global companies.',
    sector: 'EdTech / HR',
    logo: 'AN'
  }
];

const generateChartData = (points: number, startPrice: number) => {
  let currentPrice = startPrice;
  return Array.from({ length: points }).map((_, i) => {
    const change = (Math.random() - 0.45) * (startPrice * 0.02);
    currentPrice += change;
    return {
      time: `${Math.floor(i / 60)}:${(i % 60).toString().padStart(2, '0')}`,
      price: Number(currentPrice.toFixed(2))
    };
  });
};

export function SecondaryMarket({ setActiveTab, initialView = 'hub', assetSlug, tradeType = 'buy' }: SecondaryMarketProps) {
  const [view, setView] = useState(initialView);
  const [selectedAsset, setSelectedAsset] = useState(assets.find(a => a.id === assetSlug) || assets[0]);
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState(generateChartData(60, selectedAsset.price));
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [tradeAmount, setTradeAmount] = useState('');
  const [currentTradeType, setCurrentTradeType] = useState(tradeType);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate live price updates
    const interval = setInterval(() => {
      setChartData(prev => {
        const lastPrice = prev[prev.length - 1].price;
        const change = (Math.random() - 0.48) * (lastPrice * 0.005);
        const newPrice = Number((lastPrice + change).toFixed(2));
        
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: newPrice
        }];
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  const handleAssetClick = (asset: typeof assets[0]) => {
    setSelectedAsset(asset);
    setChartData(generateChartData(60, asset.price));
    setView('asset');
  };

  const handleTradeClick = (type: 'buy' | 'sell') => {
    setCurrentTradeType(type);
    setView('trade');
  };

  const handleSubmitTrade = () => {
    setView('confirmation');
  };

  if (view === 'confirmation') {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8 text-center pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-[#00C896]/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-[#00C896]" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Trade Executed Successfully</h1>
        <p className="text-zinc-400 mb-8">
          Your {currentTradeType.toUpperCase()} order for {tradeAmount} shares of {selectedAsset.ticker} has been filled.
        </p>

        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 text-left max-w-md mx-auto mb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-zinc-500 text-sm">Asset</span>
              <span className="text-white font-medium">{selectedAsset.name} ({selectedAsset.ticker})</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-zinc-500 text-sm">Execution Price</span>
              <span className="text-white font-mono">${selectedAsset.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-zinc-500 text-sm">Total Value</span>
              <span className="text-white font-mono">${(Number(tradeAmount) * selectedAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Status</span>
              <span className="text-[#00C896] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settled
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setView('hub')}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
          >
            Back to Market
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl font-medium transition-colors"
          >
            View Portfolio
          </button>
        </div>
      </div>
    );
  }

  if (view === 'trade') {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => setView('asset')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {selectedAsset.ticker}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {currentTradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.ticker}
            </h2>

            <div className="flex p-1 bg-white/5 rounded-xl mb-8">
              <button
                onClick={() => setCurrentTradeType('buy')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  currentTradeType === 'buy' ? 'bg-[#00FFB2]/20 text-[#00FFB2]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setCurrentTradeType('sell')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  currentTradeType === 'sell' ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sell
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Order Type</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#0066FF]/50 transition-colors appearance-none">
                  <option>Market Order</option>
                  <option>Limit Order</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Shares</label>
                <input 
                  type="number" 
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#0066FF]/50 transition-colors text-xl font-mono"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Current Price</span>
                  <span className="text-white font-mono">${selectedAsset.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Estimated Total</span>
                  <span className="text-white font-mono font-bold">
                    ${(Number(tradeAmount || 0) * selectedAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-3 border-t border-white/5">
                  <span className="text-zinc-500">Available Balance</span>
                  <span className="text-zinc-300">$45,200.00</span>
                </div>
              </div>

              <button 
                onClick={handleSubmitTrade}
                disabled={!tradeAmount || Number(tradeAmount) <= 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  !tradeAmount || Number(tradeAmount) <= 0
                    ? 'bg-white/5 text-zinc-500 cursor-not-allowed'
                    : currentTradeType === 'buy'
                      ? 'bg-[#00FFB2] text-black hover:bg-[#00E6A0] shadow-[0_0_20px_rgba(0,255,178,0.3)]'
                      : 'bg-[#FF3B3B] text-white hover:bg-[#FF3B3B]/80 shadow-[0_0_20px_rgba(255,59,59,0.3)]'
                }`}
              >
                {currentTradeType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
              </button>
            </div>
          </div>

          {/* Market Context */}
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Live Order Book</h3>
              <div className="flex justify-between text-xs text-zinc-500 mb-2 px-2">
                <span>Size</span>
                <span>Price</span>
                <span>Size</span>
              </div>
              <div className="space-y-1 font-mono text-sm">
                {[...Array(5)].map((_, i) => (
                  <div key={`ask-${i}`} className="flex justify-between items-center relative px-2 py-1">
                    <div className="absolute inset-y-0 right-1/2 bg-[#FF3B3B]/10" style={{ width: `${Math.random() * 40 + 10}%` }} />
                    <span className="text-zinc-400 relative z-10">{Math.floor(Math.random() * 500 + 50)}</span>
                    <span className="text-[#FF3B3B] relative z-10">{(selectedAsset.price + (5 - i) * 0.05).toFixed(2)}</span>
                    <span className="text-zinc-800 relative z-10">-</span>
                  </div>
                ))}
                <div className="py-2 text-center text-white font-bold border-y border-white/5 my-2">
                  ${selectedAsset.price.toFixed(2)}
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={`bid-${i}`} className="flex justify-between items-center relative px-2 py-1">
                    <div className="absolute inset-y-0 left-1/2 bg-[#00C896]/10" style={{ width: `${Math.random() * 40 + 10}%` }} />
                    <span className="text-zinc-800 relative z-10">-</span>
                    <span className="text-[#00C896] relative z-10">{(selectedAsset.price - (i + 1) * 0.05).toFixed(2)}</span>
                    <span className="text-zinc-400 relative z-10">{Math.floor(Math.random() * 500 + 50)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0066FF]/10 to-transparent border border-[#0066FF]/20 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Execution Note</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Secondary market trades are executed via our proprietary matching engine. Settlement occurs T+1. Ensure you have reviewed the latest company disclosures before trading.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'asset') {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <button 
          onClick={() => setView('hub')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Secondary Market
        </button>

        {/* Asset Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center text-2xl font-bold shadow-lg">
              {selectedAsset.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">{selectedAsset.name}</h1>
                <span className="px-2 py-1 rounded-md bg-white/10 text-zinc-300 text-xs font-mono">{selectedAsset.ticker}</span>
              </div>
              <p className="text-zinc-400">{selectedAsset.sector} • Private Equity</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => handleTradeClick('buy')}
              className="flex-1 md:flex-none px-8 py-3 bg-[#00FFB2] hover:bg-[#00E6A0] text-black rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(0,255,178,0.2)]"
            >
              Buy
            </button>
            <button 
              onClick={() => handleTradeClick('sell')}
              className="flex-1 md:flex-none px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors"
            >
              Sell
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-5">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Price</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-mono text-white">${selectedAsset.price.toFixed(2)}</p>
              <p className={`text-sm font-medium mb-1 flex items-center ${selectedAsset.trend === 'up' ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
                {selectedAsset.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {selectedAsset.change}
              </p>
            </div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-5">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Implied Market Cap</p>
            <p className="text-2xl font-mono text-white">{selectedAsset.marketCap}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-5">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">24h Volume</p>
            <p className="text-2xl font-mono text-white">{selectedAsset.volume24h}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-5">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Liquidity Score</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-mono text-[#0066FF]">{selectedAsset.liquidityScore}</p>
              <span className="text-xs text-zinc-500">/100</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {['1H', '1D', '1W', '1M', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    timeframe === tf ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse" />
              Live • {currentTime}
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedAsset.trend === 'up' ? '#00FFB2' : '#EF4444'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={selectedAsset.trend === 'up' ? '#00FFB2' : '#EF4444'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                <YAxis domain={['auto', 'auto']} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val.toFixed(2)}`} orientation="right" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                  labelStyle={{ color: '#888' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={selectedAsset.trend === 'up' ? '#00FFB2' : '#EF4444'} 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* About & Order Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">About {selectedAsset.name}</h3>
            <p className="text-zinc-400 leading-relaxed mb-6">
              {selectedAsset.description}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Sector</p>
                <p className="text-white font-medium">{selectedAsset.sector}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Asset Class</p>
                <p className="text-white font-medium">Private Equity (Secondary)</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Recent Trades</h3>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => {
                const isBuy = Math.random() > 0.5;
                return (
                  <div key={i} className="flex justify-between items-center text-sm font-mono">
                    <span className={isBuy ? 'text-[#00C896]' : 'text-[#FF3B3B]'}>
                      {isBuy ? 'BUY' : 'SELL'}
                    </span>
                    <span className="text-white">${(selectedAsset.price + (Math.random() - 0.5)).toFixed(2)}</span>
                    <span className="text-zinc-500">{Math.floor(Math.random() * 500 + 10)} shrs</span>
                    <span className="text-zinc-600 text-xs">{new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Hub View
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Secondary Market</h1>
          <p className="text-zinc-400">Trade private equity with instant liquidity.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00FFB2]/10 border border-[#00FFB2]/20">
            <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse" />
            <span className="text-xs font-bold text-[#00FFB2] uppercase tracking-wider">Market Open</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm font-mono">
            <Clock className="w-4 h-4" />
            {currentTime}
          </div>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16 text-white" /></div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">24h Volume</p>
          <p className="text-3xl font-mono text-white mb-2">$12.4M</p>
          <p className="text-sm text-[#00FFB2] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +15.2% vs yesterday</p>
        </div>
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ArrowRightLeft className="w-16 h-16 text-[#0066FF]" /></div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Active Orders</p>
          <p className="text-3xl font-mono text-white mb-2">1,432</p>
          <p className="text-sm text-zinc-400">Across 45 assets</p>
        </div>
        <div className="bg-gradient-to-br from-[#0066FF]/10 to-transparent border border-[#0066FF]/20 rounded-3xl p-6 relative overflow-hidden">
          <p className="text-[#0066FF] text-xs font-bold uppercase tracking-wider mb-2">Market Sentiment</p>
          <p className="text-3xl font-bold text-white mb-2">Bullish</p>
          <div className="w-full bg-black/40 h-2 rounded-full mt-4 overflow-hidden flex">
            <div className="bg-[#00C896] h-full w-[65%]" />
            <div className="bg-[#FF3B3B] h-full w-[35%]" />
          </div>
          <div className="flex justify-between text-xs mt-2 text-zinc-500">
            <span>65% Buy</span>
            <span>35% Sell</span>
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Available Assets</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold">All</button>
            <button className="px-3 py-1.5 rounded-lg text-zinc-500 hover:text-white text-xs font-bold transition-colors">FinTech</button>
            <button className="px-3 py-1.5 rounded-lg text-zinc-500 hover:text-white text-xs font-bold transition-colors">Manufacturing</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Asset</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">24h Change</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Market Cap</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Liquidity</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map((asset) => (
                <tr 
                  key={asset.id} 
                  onClick={() => handleAssetClick(asset)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center font-bold text-white border border-white/10">
                        {asset.logo}
                      </div>
                      <div>
                        <p className="text-white font-bold flex items-center gap-1.5">
                          {asset.name}
                          <ShieldCheck className="w-3 h-3 text-[#0066FF]" />
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">{asset.ticker}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-white">${asset.price.toFixed(2)}</td>
                  <td className={`p-4 font-medium ${asset.trend === 'up' ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
                    <div className="flex items-center gap-1">
                      {asset.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {asset.change}
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400 font-mono">{asset.marketCap}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="bg-[#0066FF] h-full" style={{ width: `${asset.liquidityScore}%` }} />
                      </div>
                      <span className="text-xs text-zinc-500">{asset.liquidityScore}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-bold transition-colors opacity-0 group-hover:opacity-100">
                      Trade
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
}
