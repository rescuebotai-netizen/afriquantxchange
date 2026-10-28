import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRightLeft, TrendingUp, TrendingDown, 
  Search, Filter, Clock, Activity, ShieldCheck,
  ChevronDown, ArrowUpRight, ArrowDownRight, Radio, Landmark, Zap,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { StockPurchaseConfirmation } from './StockPurchaseConfirmation';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TwelveDataTrade } from './TwelveDataTrade';
import { FinnhubTrade } from './FinnhubTrade';
import { OvexRfqTrading } from './OvexRfqTrading';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const MOCK_ASSETS = [
  { id: '1', symbol: 'PAYST', name: 'Paystack', price: 145.20, change: 2.4, volume: '1.2M', liquidityScore: 98 },
  { id: '2', symbol: 'FLW', name: 'Flutterwave', price: 210.50, change: -1.2, volume: '850K', liquidityScore: 95 },
  { id: '3', symbol: 'AND', name: 'Andela', price: 85.00, change: 5.6, volume: '420K', liquidityScore: 88 },
  { id: '4', symbol: 'JUM', name: 'Jumia', price: 32.40, change: 0.8, volume: '2.1M', liquidityScore: 99 },
];

export function Trade({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState(MOCK_ASSETS[0].id);
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const [activeSubTab, setActiveSubTab] = useState<'ovex' | 'finnhub' | 'twelvedata' | 'private'>('ovex');
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);

  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [profileName, setProfileName] = useState('John Doe');

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
          if (profile?.full_name) {
            setProfileName(profile.full_name);
          }
        }
      } catch (e) {
        console.warn("Could not fetch user profile details:", e);
      }
    };
    fetchUser();
  }, []);
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('1D');
  
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  const prevPriceRef = useRef(selectedAsset.price);

  const selectedAssetIdRef = useRef(selectedAssetId);
  useEffect(() => {
    selectedAssetIdRef.current = selectedAssetId;
  }, [selectedAssetId]);

  // Fetch real-time quote from Bavest API
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/market/bavest/quote/${selectedAsset.symbol}`);
        if (response.ok) {
          const data = await response.json();
          if (data.price) {
            setAssets(prevAssets => prevAssets.map(asset => {
              if (asset.id === selectedAssetIdRef.current) {
                return {
                  ...asset,
                  price: data.price,
                  change: data.change || asset.change
                };
              }
              return asset;
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch Bavest quote:", error);
      }
    };

    // Initial fetch
    fetchQuote();
    
    // Poll every 5 seconds
    const interval = setInterval(fetchQuote, 5000);
    return () => clearInterval(interval);
  }, [selectedAsset.symbol]);

  // Track price direction for flash effect
  useEffect(() => {
    if (selectedAsset.price > prevPriceRef.current) {
      setPriceDirection('up');
    } else if (selectedAsset.price < prevPriceRef.current) {
      setPriceDirection('down');
    }
    prevPriceRef.current = selectedAsset.price;
    
    const timeout = setTimeout(() => setPriceDirection(null), 1000);
    return () => clearTimeout(timeout);
  }, [selectedAsset.price]);

  // Generate initial chart data when asset changes
  useEffect(() => {
    const data = [];
    let currentPrice = selectedAsset.price;
    const now = new Date();
    
    // Generate 50 past data points
    for (let i = 50; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000); // 2 second intervals
      // Random walk backwards
      const volatility = currentPrice * 0.002;
      const change = (Math.random() - 0.5) * volatility;
      currentPrice = currentPrice - change;
      
      data.unshift({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: currentPrice
      });
    }
    
    setChartData(data);
  }, [selectedAssetId, timeframe]); // Re-run when asset or timeframe changes

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => {
        const newAssets = prevAssets.map(asset => {
          // Add some random volatility (0.2% max change per tick)
          const volatility = asset.price * 0.002;
          const change = (Math.random() - 0.5) * volatility;
          const newPrice = Math.max(0.01, asset.price + change);
          
          // Update change percentage slightly too
          const newChange = asset.change + (Math.random() - 0.5) * 0.1;

          return {
            ...asset,
            price: newPrice,
            change: newChange
          };
        });

        // Update chart data synchronously with the asset price update
        const currentAsset = newAssets.find(a => a.id === selectedAssetIdRef.current);
        if (currentAsset) {
          setChartData(prevData => {
            if (prevData.length === 0) return prevData;
            const newDataPoint = {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              price: currentAsset.price
            };
            return [...prevData.slice(1), newDataPoint];
          });
        }

        return newAssets;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleExecuteTrade = async () => {
    const sharesNum = parseFloat(amount) || 150;
    const value = sharesNum * selectedAsset.price;

    try {
      let activeUserId = 'demo-trader-01';
      if (isSupabaseConfigured) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) activeUserId = user.id;
        } catch (e) {}
      }

      const res = await fetch('/api/trade/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          assetSymbol: selectedAsset.symbol,
          assetName: selectedAsset.name,
          assetType: selectedAsset.symbol.includes('-') || selectedAsset.symbol.includes('/') ? 'crypto' : 'stock',
          side: tradeAction,
          quantity: sharesNum,
          price: selectedAsset.price
        })
      });

      const resData = await res.json();
      if (!res.ok) {
        alert(resData.error || "Trade execution failed");
        return;
      }

      const certId = `AQX-2026-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const txId = `TX-${Math.floor(100000000 + Math.random() * 900000000)}`;
      
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      const formattedTime = today.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) + " CAT";

      setConfirmationData({
        success: true,
        certificateId: certId,
        shareholderName: profileName,
        companyName: selectedAsset.name + " Holdings Ltd",
        companyLogo: "/logo.svg",
        exchangeLogo: "/logo.svg",
        stockSymbol: selectedAsset.symbol,
        shares: sharesNum,
        purchasePrice: selectedAsset.price,
        investmentValue: value,
        ownershipPercentage: parseFloat((sharesNum / 50000).toFixed(4)) || 0.0042,
        issuerName: "Company Secretary",
        issuerSignature: "Company Secretary Signature",
        sealImage: "Company Seal",
        qrUrl: `https://verify.afriquant.com/certificate/${certId}`,
        transactionId: txId,
        purchaseDate: formattedDate,
        purchaseTime: formattedTime
      });
      setShowConfirmation(true);
    } catch (err: any) {
      console.warn("Trade execution error:", err);
      alert(err.message || "An unexpected error occurred during execution.");
    }
  };

  const isPositiveTrend = selectedAsset.change >= 0;
  const chartColor = isPositiveTrend ? '#00C896' : '#FF3B3B';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Trading Desk</h1>
          <p className="text-zinc-400 mt-1">Access private equity, start-up shares, and global financial networks.</p>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT SUB-MENU - COLLAPSIBLE */}
        <AnimatePresence initial={false} mode="wait">
          {isSubMenuOpen ? (
            <motion.aside
              key="trade-left-submenu"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full lg:w-64 shrink-0 overflow-hidden"
            >
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-3 space-y-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                      Trading Venues
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSubMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Hide Sub-Menu"
                    aria-label="Hide Sub-Menu"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: 'ovex', label: 'OVEX RFQ & AltcoinTrader', icon: Zap, color: 'text-emerald-400', desc: 'Deep Liquidity RFQ' },
                    { id: 'finnhub', label: 'Finnhub Live WS', icon: Radio, color: 'text-emerald-400', desc: 'Real-time WebSocket' },
                    { id: 'twelvedata', label: 'Twelve Data WS', icon: Radio, color: 'text-sky-400', desc: 'FX & Global Feeds' },
                    { id: 'private', label: 'African Startups', icon: Activity, color: 'text-zinc-400', desc: 'Secondary Equity' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSubTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSubTab(item.id as any)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-white text-black shadow-lg shadow-white/10'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-black' : item.color}`} />
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-bold uppercase tracking-wider truncate ${isActive ? 'text-black font-extrabold' : 'text-zinc-200'}`}>
                            {item.label}
                          </div>
                          <div className={`text-[10px] truncate ${isActive ? 'text-zinc-700' : 'text-zinc-500'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-2.5 border-t border-white/5 px-2 space-y-2">
                  <button
                    onClick={() => setActiveTab('integrations')}
                    className="w-full py-2 px-2.5 rounded-xl bg-blue-600/15 border border-blue-500/30 hover:bg-blue-600/25 text-blue-300 text-[11px] font-bold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>FIX & SOR Cockpit</span>
                    <span>→</span>
                  </button>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Execution API Connected
                    </span>
                  </div>
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.div
              key="trade-left-submenu-toggle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="shrink-0"
            >
              <button
                onClick={() => setIsSubMenuOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all shadow-xl cursor-pointer group"
                title="Show Sub-Menu"
              >
                <PanelLeftOpen className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
                <span>Show Venues</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WORKSPACE AREA */}
        <div className="flex-1 min-w-0 w-full">
          {activeSubTab === 'ovex' ? (
            <OvexRfqTrading />
          ) : activeSubTab === 'finnhub' ? (
            <FinnhubTrade setActiveTab={setActiveTab} />
          ) : activeSubTab === 'twelvedata' ? (
            <TwelveDataTrade setActiveTab={setActiveTab} />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Secondary Market</h1>
                  <p className="text-zinc-400 mt-1">Trade private equity with instant liquidity</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] text-sm font-medium">
                    <Activity className="w-4 h-4 animate-pulse" />
                    Market Open
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Chart & Trade Panel */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Chart Area */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-xl shadow-lg">
                  {selectedAsset.symbol[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedAsset.name} <span className="text-zinc-500 text-sm font-normal">{selectedAsset.symbol}</span></h2>
                  <div className="flex items-center gap-2 mt-1">
                    <motion.span 
                      key={selectedAsset.price}
                      initial={{ color: priceDirection === 'up' ? '#10b981' : priceDirection === 'down' ? '#f43f5e' : '#ffffff' }}
                      animate={{ color: '#ffffff' }}
                      transition={{ duration: 1 }}
                      className="text-2xl font-semibold"
                    >
                      ${selectedAsset.price.toFixed(2)}
                    </motion.span>
                    <span className={`flex items-center text-sm font-medium ${isPositiveTrend ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
                      {isPositiveTrend ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {Math.abs(selectedAsset.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                {['1H', '1D', '1W', '1M', '1Y'].map(tf => (
                  <button 
                    key={tf} 
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${timeframe === tf ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Live Chart Area */}
            <div className="h-64 w-full bg-[#0A0A0A]/50 rounded-xl border border-white/5 p-4 relative overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.2)" 
                    fontSize={10} 
                    tickMargin={10}
                    minTickGap={30}
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']} 
                    stroke="rgba(255,255,255,0.2)" 
                    fontSize={10} 
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                    width={60}
                    orientation="right"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={chartColor} 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-sm text-zinc-400 mb-1">24h Volume</p>
                <p className="text-lg font-semibold text-white">{selectedAsset.volume}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-sm text-zinc-400 mb-1">Liquidity Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-[#00C896]">{selectedAsset.liquidityScore}/100</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00C896] rounded-full" style={{ width: `${selectedAsset.liquidityScore}%` }} />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-sm text-zinc-400 mb-1">Market Cap</p>
                <p className="text-lg font-semibold text-white">$1.2B</p>
              </div>
            </div>
          </div>

          {/* Trade Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Trade Panel</h3>
              <ShieldCheck className="w-5 h-5 text-[#00C896]" />
            </div>

            {/* Buy/Sell Toggle */}
            <div className="flex p-1 bg-white/5 rounded-xl mb-6">
              <button 
                onClick={() => setTradeAction('buy')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tradeAction === 'buy' ? 'bg-[#00C896] text-white shadow-lg shadow-[#00C896]/20' : 'text-zinc-400 hover:text-white'}`}
              >
                Buy
              </button>
              <button 
                onClick={() => setTradeAction('sell')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tradeAction === 'sell' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-zinc-400 hover:text-white'}`}
              >
                Sell
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Type & Inputs */}
              <div className="space-y-4">
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="orderType" 
                      checked={orderType === 'market'} 
                      onChange={() => setOrderType('market')}
                      className="w-4 h-4 text-[#0066FF] bg-white/10 border-white/20 focus:ring-[#0066FF] focus:ring-offset-gray-900"
                    />
                    <span className="text-sm text-zinc-300">Market</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="orderType" 
                      checked={orderType === 'limit'} 
                      onChange={() => setOrderType('limit')}
                      className="w-4 h-4 text-[#0066FF] bg-white/10 border-white/20 focus:ring-[#0066FF] focus:ring-offset-gray-900"
                    />
                    <span className="text-sm text-zinc-300">Limit</span>
                  </label>
                </div>

                {orderType === 'limit' && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Limit Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#0066FF]/50 transition-colors"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Amount ({selectedAsset.symbol})</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0066FF]/50 transition-colors"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#0066FF] hover:text-[#0066FF]/80">
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary & CTA */}
              <div className="flex flex-col justify-end space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Available Balance</span>
                    <span className="text-white font-medium">$12,450.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Estimated Total</span>
                    <span className="text-white font-medium">
                      ${amount ? (parseFloat(amount) * selectedAsset.price).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                    <span className="text-zinc-500">Network Fee</span>
                    <span className="text-zinc-400">$0.50</span>
                  </div>
                </div>

                <button 
                  onClick={handleExecuteTrade}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                    tradeAction === 'buy' 
                      ? 'bg-[#00C896] hover:bg-[#00C896]/80 shadow-[#00C896]/20' 
                      : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                  }`}
                >
                  {tradeAction === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Book */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Order Book</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[#0066FF]/50 w-full" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-400 text-xs border-b border-white/5">
                    <th className="pb-3 font-medium">Asset</th>
                    <th className="pb-3 font-medium text-right">Price</th>
                    <th className="pb-3 font-medium text-right">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr 
                      key={asset.id} 
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${selectedAsset.id === asset.id ? 'bg-white/10' : ''}`}
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center font-bold text-white text-[10px]">
                            {asset.symbol[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white leading-none">{asset.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-white text-right">
                        <motion.span
                          key={asset.price}
                          initial={{ color: asset.price > (prevPriceRef.current || 0) ? '#10b981' : '#f43f5e' }}
                          animate={{ color: '#ffffff' }}
                          transition={{ duration: 1 }}
                        >
                          ${asset.price.toFixed(2)}
                        </motion.span>
                      </td>
                      <td className="py-3 text-sm text-right">
                        <span className={`flex items-center justify-end ${asset.change >= 0 ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
                          {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(asset.change).toFixed(2)}%
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
    </div>
          )}
        </div>
      </div>

      {showConfirmation && confirmationData && (
        <StockPurchaseConfirmation
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onViewPortfolio={() => {
            setShowConfirmation(false);
            setActiveTab('portfolio');
          }}
          onBuyMore={() => {
            setShowConfirmation(false);
            setAmount('');
          }}
          data={confirmationData}
        />
      )}
    </div>
  );
}
