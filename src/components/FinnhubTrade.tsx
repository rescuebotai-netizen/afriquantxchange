import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRightLeft, TrendingUp, TrendingDown, 
  Search, Filter, Clock, Activity, ShieldCheck,
  ChevronDown, ArrowUpRight, ArrowDownRight, Radio,
  Loader2, Wifi, Terminal, Database, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Info
} from 'lucide-react';
import { StockPurchaseConfirmation } from './StockPurchaseConfirmation';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const FINNHUB_ASSETS = [
  { id: 'f1', symbol: 'AAPL', name: 'Apple Inc.', price: 185.40, change: 1.25, type: 'Stock' },
  { id: 'f2', symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.60, change: -0.45, type: 'Stock' },
  { id: 'f3', symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 174.42, change: 1.12, type: 'Stock' },
  { id: 'f4', symbol: 'TSLA', name: 'Tesla, Inc.', price: 178.90, change: 4.82, type: 'Stock' },
  { id: 'f5', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 151.60, change: -0.80, type: 'Stock' },
  { id: 'f6', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.12, change: 8.45, type: 'Stock' },
  { id: 'f7', symbol: 'META', name: 'Meta Platforms, Inc.', price: 495.20, change: 2.15, type: 'Stock' }
];

interface FinnhubTradeProps {
  setActiveTab: (tab: string) => void;
}

export function FinnhubTrade({ setActiveTab }: FinnhubTradeProps) {
  const [assets, setAssets] = useState(FINNHUB_ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  
  // Selected asset from state array to reflect live-updated price/changes
  const selectedAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [profileName, setProfileName] = useState('John Doe');

  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartSource, setChartSource] = useState<'live' | 'fallback'>('live');

  // Asset quote details (high, low, open, previous close)
  const [quoteDetails, setQuoteDetails] = useState<any>({
    high: 187.20,
    low: 183.10,
    open: 184.00,
    previousClose: 185.40
  });

  const [streamStatus, setStreamStatus] = useState<{ message: string; type: string; mode: 'live' | 'mock' | 'connecting' }>({
    message: 'Establishing live channel...',
    type: 'info',
    mode: 'connecting'
  });
  const [tickLogs, setTickLogs] = useState<string[]>([]);
  const [flashingAssets, setFlashingAssets] = useState<Record<string, 'up' | 'down' | null>>({});
  const [tickCount, setTickCount] = useState(0);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Load User Profile
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

  // Fetch REST quote (high, low, open) & time-series
  useEffect(() => {
    const fetchAssetData = async () => {
      setChartLoading(true);
      try {
        // Fetch REST Quote Details
        const quoteRes = await fetch(`/api/market/finnhub/quote/${selectedSymbol}`);
        if (quoteRes.ok) {
          const qContentType = quoteRes.headers.get('content-type');
          if (qContentType && qContentType.includes('application/json')) {
            const qData = await quoteRes.json();
            setQuoteDetails({
              high: qData.high || qData.price * 1.01,
              low: qData.low || qData.price * 0.99,
              open: qData.open || qData.previous_close || qData.price,
              previousClose: qData.previous_close || qData.price
            });

            // Sync price & change with current list if changed
            setAssets(prev => prev.map(a => {
              if (a.symbol === selectedSymbol) {
                return {
                  ...a,
                  price: qData.price,
                  change: qData.percent_change || a.change
                };
              }
              return a;
            }));
          }
        }

        // Fetch REST Chart Data
        const chartRes = await fetch(`/api/market/finnhub/time_series/${selectedSymbol}`);
        if (chartRes.ok) {
          const cContentType = chartRes.headers.get('content-type');
          if (cContentType && cContentType.includes('application/json')) {
            const cData = await chartRes.json();
            if (cData.values && Array.isArray(cData.values)) {
              // Reverse chronological to chronological ascending order
              const formatted = [...cData.values].reverse().map((item: any) => ({
                time: item.datetime,
                price: parseFloat(item.close)
              }));
              setChartData(formatted);
              setChartSource(cData.is_fallback ? 'fallback' : 'live');
            }
          }
        }
      } catch (e) {
        console.warn("Finnhub REST API fetch error:", e);
      } finally {
        setChartLoading(false);
      }
    };

    fetchAssetData();
  }, [selectedSymbol]);

  // Connect to Finnhub Server-Sent Events live ticker proxy
  useEffect(() => {
    const symbolsParam = assets.map(a => a.symbol).join(',');
    const sseUrl = `/api/market/finnhub/stream?symbols=${encodeURIComponent(symbolsParam)}`;
    
    setStreamStatus({ message: 'Initiating Finnhub socket bridge...', type: 'info', mode: 'connecting' });
    const eventSource = new EventSource(sseUrl);

    addLog(`[System] Connected to Finnhub Server-Sent Events Gateway for: ${symbolsParam}`);

    eventSource.addEventListener('status', (event: any) => {
      try {
        const data = JSON.parse(event.data);
        setStreamStatus({
          message: data.message,
          type: data.type,
          mode: data.mode || 'live'
        });
        addLog(`[Finnhub Bridge Status] ${data.message} (${data.mode?.toUpperCase()} Mode)`);
      } catch (e) {
        console.error('SSE Status event parse error:', e);
      }
    });

    eventSource.addEventListener('price', (event: any) => {
      try {
        const data = JSON.parse(event.data);
        const { symbol, price, change_percent, timestamp } = data;
        
        setTickCount(c => c + 1);

        // Update asset states in the real-time grid
        setAssets(prev => prev.map(asset => {
          if (asset.symbol === symbol) {
            const currentPrice = asset.price;
            const direction = price > currentPrice ? 'up' : price < currentPrice ? 'down' : null;
            
            if (direction) {
              setFlashingAssets(f => ({ ...f, [symbol]: direction }));
              setTimeout(() => {
                setFlashingAssets(f => ({ ...f, [symbol]: null }));
              }, 600);
            }

            return {
              ...asset,
              price: price,
              change: change_percent ? parseFloat(change_percent) : asset.change
            };
          }
          return asset;
        }));

        // Log the trade ticks
        const formattedTime = new Date(timestamp * 1000).toLocaleTimeString();
        addLog(`[TICK] ${symbol} => $${price.toFixed(2)} | Timed at ${formattedTime}`);

      } catch (e) {
        console.error('SSE Price event parse error:', e);
      }
    });

    eventSource.onerror = (err) => {
      console.error('Finnhub SSE Stream Error:', err);
      setStreamStatus({
        message: 'Re-routing connection gateway...',
        type: 'warning',
        mode: 'connecting'
      });
      addLog(`[System Error] Finnhub stream disconnect. Gateway recovering...`);
    };

    return () => {
      eventSource.close();
      addLog('[System] Gateway session terminated.');
    };
  }, []);

  const addLog = (line: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTickLogs(prev => [...prev.slice(-30), `[${timestamp}] ${line}`]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tickLogs]);

  const handleExecuteTrade = async () => {
    const sharesNum = parseFloat(amount) || 10;
    const value = sharesNum * selectedAsset.price;
    
    addLog(`[Trade Order] Initiating execution: ${tradeAction.toUpperCase()} ${sharesNum} shares of ${selectedAsset.symbol}...`);
    try {
      let activeUserId = 'demo-user-finnhub';
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
          assetType: 'stock',
          side: tradeAction,
          quantity: sharesNum,
          price: selectedAsset.price
        })
      });

      const resData = await res.json();
      if (!res.ok) {
        alert(resData.error || "Trade execution failed");
        addLog(`[Error] ${resData.error || "Trade execution failed"}`);
        return;
      }

      const certId = `FHB-2026-${Math.floor(10000000 + Math.random() * 90000000)}`;
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
      }) + " EST";

      setConfirmationData({
        success: true,
        certificateId: certId,
        shareholderName: profileName,
        companyName: selectedAsset.name,
        companyLogo: "/logo.svg",
        exchangeLogo: "/logo.svg",
        stockSymbol: selectedAsset.symbol,
        shares: sharesNum,
        purchasePrice: selectedAsset.price,
        investmentValue: value,
        ownershipPercentage: parseFloat((sharesNum / 1000000).toFixed(6)) || 0.000010,
        issuerName: "Finnhub Securitize Brokerage",
        issuerSignature: "Finnhub Smart Clearing Protocol",
        sealImage: "Finnhub Seal",
        qrUrl: `https://verify.finnhub.io/certificate/${certId}`,
        transactionId: txId,
        purchaseDate: formattedDate,
        purchaseTime: formattedTime
      });
      setShowConfirmation(true);
      addLog(`[Trade Order] Executed transaction successfully: ${tradeAction.toUpperCase()} ${sharesNum} shares of ${selectedAsset.symbol}`);
    } catch (err: any) {
      console.warn("Trade execution error:", err);
      alert(err.message || "An unexpected error occurred during execution.");
    }
  };

  const isPositiveTrend = selectedAsset.change >= 0;
  const chartColor = isPositiveTrend ? '#00FFB2' : '#FF3B3B';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Sub-header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Finnhub Real-time Workspace</h1>
            <span className="bg-[#FFFFFF]/15 border border-[#FFFFFF]/30 text-[#FFFFFF] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider">SECURE FINNHUB STREAM</span>
          </div>
          <p className="text-zinc-400 mt-1">Multi-asset streaming ticks backed by Finnhub APIs & high-frequency socket pipelines.</p>
        </div>

        {/* Live status panel */}
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              streamStatus.mode === 'live' ? 'bg-[#00FFB2]' : streamStatus.mode === 'mock' ? 'bg-[#FF9100]' : 'bg-blue-400'
            }`} />
            <span className="text-xs font-mono font-bold text-white uppercase">
              {streamStatus.mode === 'live' ? 'FINNHUB PRODUCTION' : streamStatus.mode === 'mock' ? 'SANDBOX STREAM' : 'ROUTING BRIDGE'}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs font-mono text-zinc-400">Ticks: <span className="text-[#00FFB2] font-semibold">{tickCount}</span></span>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Area (Chart, Ticker Horizontal Selector, Stats, Logs) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
            
            {/* Asset Horizontal Scrolling Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/5 scrollbar-thin scrollbar-thumb-white/10">
              {assets.map(asset => {
                const isSelected = asset.symbol === selectedSymbol;
                const isAssetUp = flashingAssets[asset.symbol] === 'up';
                const isAssetDown = flashingAssets[asset.symbol] === 'down';
                return (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedSymbol(asset.symbol)}
                    className={`px-4 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                      isSelected 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-[#00FFB2]/30 text-white shadow-lg' 
                        : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                    } ${isAssetUp ? 'bg-emerald-500/30 border-emerald-500/50 text-emerald-200 animate-pulse' : ''} ${
                      isAssetDown ? 'bg-rose-500/30 border-rose-500/50 text-rose-200 animate-pulse' : ''
                    }`}
                  >
                    <span>{asset.symbol}</span>
                    <span className="font-mono font-bold text-[#00FFB2]">${asset.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>

            {/* Asset Name, price tag, & high-level stats grid */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FFB2] to-[#0057FF] flex items-center justify-center font-black text-[#04060C] text-lg shadow-xl shadow-emerald-500/10">
                  {selectedAsset.symbol[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedAsset.name}
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono uppercase">{selectedAsset.type}</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black font-mono tracking-tight text-white">${selectedAsset.price.toFixed(2)}</span>
                    <span className={`flex items-center text-xs font-bold font-mono ${isPositiveTrend ? 'text-[#00FFB2]' : 'text-[#FF3B3B]'}`}>
                      {isPositiveTrend ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {selectedAsset.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Source Details */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs font-mono">
                <Database className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-400">Source:</span>
                <span className={chartSource === 'live' ? 'text-[#00FFB2] font-extrabold' : 'text-zinc-500 font-medium'}>
                  {chartSource === 'live' ? 'Finnhub REST API' : 'Simulated Daily Ticks'}
                </span>
              </div>
            </div>

            {/* Quote details Grid metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-white/[0.02] border border-white/5 p-4 rounded-xl font-mono text-xs">
              <div>
                <span className="text-zinc-500 block mb-1">Open Price</span>
                <span className="text-white font-bold">${quoteDetails.open.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Day High</span>
                <span className="text-emerald-400 font-bold">${quoteDetails.high.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Day Low</span>
                <span className="text-rose-400 font-bold">${quoteDetails.low.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Prev. Close</span>
                <span className="text-white font-bold">${quoteDetails.previousClose.toFixed(2)}</span>
              </div>
            </div>

            {/* Historical Recharts Graph */}
            <div className="h-72 w-full bg-[#04060C]/60 rounded-xl border border-white/5 p-4 relative flex items-center justify-center">
              {chartLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#00FFB2] animate-spin" />
                  <p className="text-xs font-mono text-zinc-500 uppercase">Fetching candlelight data...</p>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorFinnhub" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={10} 
                      tickMargin={10}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.2)" 
                      fontSize={10} 
                      domain={['auto', 'auto']}
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#04060C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      labelStyle={{ color: '#888888', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#ffffff', fontFamily: 'monospace' }}
                    />
                    <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorFinnhub)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs font-mono text-zinc-500">Candlestick chart data unavailable.</p>
              )}
            </div>

          </div>

          {/* Interactive logs console */}
          <div className="bg-[#04060C] border border-white/10 rounded-2xl p-5 flex flex-col h-60 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00FFB2]" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-widest">Finnhub WebSocket Pipeline Streams</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Stream buffer listening...</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs text-zinc-400">
              {tickLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-600 italic">
                  Connecting and reading Finnhub streams...
                </div>
              ) : (
                tickLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed whitespace-pre-wrap break-all border-l-2 border-white/5 pl-2 hover:border-white/20 transition-all">
                    {log}
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>

        </div>

        {/* Right Column (Trades form & specifications) */}
        <div className="space-y-6">
          
          {/* Order Placement Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl">
                <button 
                  onClick={() => setTradeAction('buy')}
                  className={`py-2 text-sm font-bold rounded-lg transition-colors ${tradeAction === 'buy' ? 'bg-[#00FFB2] text-[#04060C]' : 'text-zinc-400 hover:text-white'}`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setTradeAction('sell')}
                  className={`py-2 text-sm font-bold rounded-lg transition-colors ${tradeAction === 'sell' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  Sell
                </button>
              </div>

              {/* Order configuration fields */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400 uppercase">
                  <span>Finnhub Clearing Order</span>
                  <span className="text-zinc-300">STP Routed</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setOrderType('market')}
                    className={`py-2 text-xs font-bold rounded-lg border font-mono uppercase ${orderType === 'market' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Market
                  </button>
                  <button 
                    onClick={() => setOrderType('limit')}
                    className={`py-2 text-xs font-bold rounded-lg border font-mono uppercase ${orderType === 'limit' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Limit
                  </button>
                </div>

                {/* Amount of Shares input */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Shares Quantity</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full bg-[#0A0F1C]/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white font-mono font-bold focus:outline-none focus:border-[#00FFB2] transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">QTY</span>
                  </div>
                </div>

                {/* Cost/Pricing Summary details */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Instrument:</span>
                    <span className="text-white font-bold">{selectedAsset.symbol}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Tick Price:</span>
                    <span className="text-white">${selectedAsset.price.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/5 my-1" />
                  <div className="flex justify-between text-zinc-400 font-bold">
                    <span>Est. Settle Cost:</span>
                    <span className="text-[#00FFB2]">${((parseFloat(amount) || 15) * selectedAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

            </div>

            <button 
              onClick={handleExecuteTrade}
              className={`w-full py-4 rounded-xl font-bold mt-8 text-black transition-all shadow-lg ${
                tradeAction === 'buy' 
                  ? 'bg-[#00FFB2] hover:bg-[#00FFB2]/85 shadow-[#00FFB2]/10' 
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
              }`}
            >
              {tradeAction === 'buy' ? 'Execute Buy Order' : 'Execute Sell Order'}
            </button>
          </div>

          {/* Secure Clearing Certificate Notice */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 relative overflow-hidden space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00FFB2]" />
              <h4 className="font-bold text-xs uppercase tracking-widest text-white font-mono">Finnhub Secure Clearing</h4>
            </div>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Order settlement occurs through automated STP broker-dealer clearing. Ownership certificates are cryptographically verified and fully transferable.
            </p>
          </div>

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
