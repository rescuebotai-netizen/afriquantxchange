import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRightLeft, TrendingUp, TrendingDown, 
  Search, Filter, Clock, Activity, ShieldCheck,
  ChevronDown, ArrowUpRight, ArrowDownRight, Radio,
  Loader2, Wifi, Terminal, Database, Sparkles, CheckCircle2, AlertTriangle, ArrowRight
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

const GLOBAL_ASSETS = [
  { id: 'g1', symbol: 'AAPL', name: 'Apple Inc.', price: 185.40, change: 1.25, type: 'Stock' },
  { id: 'g2', symbol: 'MSFT', name: 'Microsoft Corporation', price: 415.60, change: -0.45, type: 'Stock' },
  { id: 'g3', symbol: 'TSLA', name: 'Tesla Inc.', price: 178.90, change: 4.82, type: 'Stock' },
  { id: 'g4', symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.12, change: 8.45, type: 'Stock' },
  { id: 'g5', symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', price: 68420.00, change: 2.15, type: 'Crypto' },
  { id: 'g6', symbol: 'ETH/USD', name: 'Ethereum / US Dollar', price: 3450.50, change: -1.82, type: 'Crypto' },
  { id: 'g7', symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0845, change: 0.12, type: 'Forex' }
];

interface TwelveDataTradeProps {
  setActiveTab: (tab: string) => void;
}

export function TwelveDataTrade({ setActiveTab }: TwelveDataTradeProps) {
  const [assets, setAssets] = useState(GLOBAL_ASSETS);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
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

  const [streamStatus, setStreamStatus] = useState<{ message: string; type: string; mode: 'live' | 'mock' | 'connecting' }>({
    message: 'Establishing live channel...',
    type: 'info',
    mode: 'connecting'
  });
  const [tickLogs, setTickLogs] = useState<string[]>([]);
  const [flashingAssets, setFlashingAssets] = useState<Record<string, 'up' | 'down' | null>>({});

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

  // Fetch Historical Time Series Chart Data from Twelve Data
  useEffect(() => {
    const fetchChart = async () => {
      setChartLoading(true);
      try {
        const response = await fetch(`/api/market/twelvedata/time_series/${selectedSymbol}?interval=1day&outputsize=30`);
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.values && Array.isArray(data.values)) {
              // Reverse to ascending chronological order for Recharts
              const formatted = [...data.values].reverse().map((item: any) => ({
                time: item.datetime,
                price: parseFloat(item.close)
              }));
              setChartData(formatted);
              setChartSource(data.is_fallback ? 'fallback' : 'live');
            } else {
              throw new Error('Invalid values payload format');
            }
          } else {
            throw new Error('Response is not JSON format');
          }
        } else {
          throw new Error('Twelve Data fetch status abnormal');
        }
      } catch (e) {
        console.warn("TimeSeries fetch error:", e);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChart();
  }, [selectedSymbol]);

  // Connect to Twelve Data WebSocket Live Proxy Stream
  useEffect(() => {
    const symbolsParam = assets.map(a => a.symbol).join(',');
    const sseUrl = `/api/market/twelvedata/stream?symbols=${encodeURIComponent(symbolsParam)}`;
    
    setStreamStatus({ message: 'Initiating WebSocket bridge...', type: 'info', mode: 'connecting' });
    const eventSource = new EventSource(sseUrl);

    // Initial log
    addLog(`[System] Initializing Real-time WebSocket Gateway for: ${symbolsParam}`);

    eventSource.addEventListener('status', (event: any) => {
      try {
        const data = JSON.parse(event.data);
        setStreamStatus({
          message: data.message,
          type: data.type,
          mode: data.mode || 'live'
        });
        addLog(`[WS Bridge Status] ${data.message} (${data.mode?.toUpperCase()} Mode)`);
      } catch (e) {
        console.error('Status event parse error:', e);
      }
    });

    eventSource.addEventListener('price', (event: any) => {
      try {
        const data = JSON.parse(event.data);
        const { symbol, price, change_percent, timestamp } = data;
        
        // Update asset price locally
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

        // Log the received tick
        const formattedTime = new Date(timestamp * 1000).toLocaleTimeString();
        addLog(`[TICK] Received real-time update: ${symbol} = $${price.toFixed(4)} at ${formattedTime}`);

      } catch (e) {
        console.error('Price event parse error:', e);
      }
    });

    eventSource.onerror = (err) => {
      console.error('SSE Live Stream encountered an error:', err);
      setStreamStatus({
        message: 'Reconnecting WebSocket stream...',
        type: 'warning',
        mode: 'connecting'
      });
      addLog(`[System Error] Stream connection lost, attempting bridge recovery...`);
    };

    return () => {
      eventSource.close();
      addLog('[System] Terminated Live WebSocket connection handler.');
    };
  }, []);

  // Helper to add scrolling logs
  const addLog = (line: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTickLogs(prev => [...prev.slice(-30), `[${timestamp}] ${line}`]);
  };

  // Scroll to bottom of logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tickLogs]);

  const handleExecuteTrade = async () => {
    const sharesNum = parseFloat(amount) || 10;
    const value = sharesNum * selectedAsset.price;
    
    addLog(`[Trade] Initiating order: ${tradeAction.toUpperCase()} ${sharesNum} shares of ${selectedAsset.symbol}...`);
    try {
      let activeUserId = 'demo-user-twelvedata';
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

      const certId = `TDX-2026-${Math.floor(10000000 + Math.random() * 90000000)}`;
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
        issuerName: "Twelve Data Brokerage",
        issuerSignature: "Twelve Data Securitize Signature",
        sealImage: "Twelve Data Seal",
        qrUrl: `https://verify.twelvedata.com/certificate/${certId}`,
        transactionId: txId,
        purchaseDate: formattedDate,
        purchaseTime: formattedTime
      });
      setShowConfirmation(true);
      addLog(`[Trade] Executed order successfully: ${tradeAction.toUpperCase()} ${sharesNum} shares of ${selectedAsset.symbol}`);
    } catch (err: any) {
      console.warn("Trade execution error:", err);
      alert(err.message || "An unexpected error occurred during execution.");
    }
  };

  const isPositiveTrend = selectedAsset.change >= 0;
  const chartColor = isPositiveTrend ? '#00C896' : '#FF3B3B';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Twelve Data Terminal</h1>
            <span className="bg-[#0057FF]/15 border border-[#0057FF]/30 text-[#0057FF] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider">LIVE WEBSOCKETS</span>
          </div>
          <p className="text-zinc-400 mt-1">Institutional real-time global stock, crypto, and forex streaming network.</p>
        </div>

        {/* Live Stream Telemetry Indicator */}
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              streamStatus.mode === 'live' ? 'bg-[#00C853]' : streamStatus.mode === 'mock' ? 'bg-[#F9B233]' : 'bg-blue-400'
            }`} />
            <span className="text-xs font-mono font-semibold text-white">
              {streamStatus.mode === 'live' ? 'Twelve Data Live Feed' : streamStatus.mode === 'mock' ? 'High-Fi Sandbox Simulation' : 'Bridge Connecting...'}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs font-mono text-zinc-400">{streamStatus.message}</span>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Asset Selector, Historical Chart & Live Stream logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Header & Workspace Selection */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden">
            
            {/* Asset Selection Horizontal Scroll */}
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
                        ? 'bg-white/10 border-white/20 text-white shadow-lg shadow-black/25' 
                        : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                    } ${isAssetUp ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : ''} ${
                      isAssetDown ? 'bg-rose-500/20 border-rose-500/30 text-rose-300' : ''
                    }`}
                  >
                    <span>{asset.symbol}</span>
                    <span className="font-mono font-medium opacity-80">${asset.price.toFixed(asset.type === 'Crypto' ? 2 : 4)}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Asset Information */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0057FF] to-[#00C853] flex items-center justify-center font-bold text-white text-lg shadow-xl shadow-[#0057FF]/20">
                  {selectedAsset.symbol[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedAsset.name}
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono font-medium uppercase">{selectedAsset.type}</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white">${selectedAsset.price.toFixed(selectedAsset.type === 'Crypto' ? 2 : 4)}</span>
                    <span className={`flex items-center text-xs font-bold font-mono ${isPositiveTrend ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
                      {isPositiveTrend ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                      {selectedAsset.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Source Badge */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs font-mono">
                <Database className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-400">Source:</span>
                <span className={chartSource === 'live' ? 'text-[#00C853] font-bold' : 'text-zinc-400 font-medium'}>
                  {chartSource === 'live' ? 'Twelve Data REST API' : 'Simulated Historical Ticks'}
                </span>
              </div>
            </div>

            {/* Historical Recharts AreaChart */}
            <div className="h-72 w-full bg-[#04060C]/50 rounded-xl border border-white/5 p-4 relative flex items-center justify-center">
              {chartLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#0057FF] animate-spin" />
                  <p className="text-xs font-mono text-zinc-500 uppercase">Fetching historical values...</p>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTwelveData" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
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
                      contentStyle={{ backgroundColor: '#0A0F1C', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      labelStyle={{ color: '#888888', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#ffffff', fontFamily: 'monospace' }}
                    />
                    <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorTwelveData)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs font-mono text-zinc-500">Historical chart data unavailable.</p>
              )}
            </div>

          </div>

          {/* Real-time Streaming Tick Console */}
          <div className="bg-[#04060C] border border-white/10 rounded-2xl p-5 flex flex-col h-60 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00C853]" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-widest">WebSocket Streaming Terminal Logs</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Auto-scrolling stream active</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs select-text text-zinc-400">
              {tickLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-600 italic">
                  Waiting for incoming socket frames...
                </div>
              ) : (
                tickLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed whitespace-pre-wrap break-all border-l-2 border-white/5 pl-2 hover:border-white/25 transition-all">
                    {log}
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>

        </div>

        {/* Right Column: Execution Form / Trade Settings */}
        <div className="space-y-6">
          
          {/* Order Placement Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Buy / Sell Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl">
                <button 
                  onClick={() => setTradeAction('buy')}
                  className={`py-2 text-sm font-bold rounded-lg transition-colors ${tradeAction === 'buy' ? 'bg-[#00C896] text-black' : 'text-zinc-400 hover:text-white'}`}
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

              {/* Order Settings Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400 uppercase">
                  <span>Order Parameters</span>
                  <span className="text-zinc-300">Default Execution</span>
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

                {/* Amount Inputs */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-500 uppercase">Amount of Shares / Contracts</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full bg-[#0A0F1C]/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white font-mono font-bold focus:outline-none focus:border-[#0057FF] transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">QTY</span>
                  </div>
                </div>

                {/* Estimated Order Summary */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Selected Asset:</span>
                    <span className="text-white font-bold">{selectedAsset.symbol}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Execution Price:</span>
                    <span className="text-white">${selectedAsset.price.toFixed(selectedAsset.type === 'Crypto' ? 2 : 4)}</span>
                  </div>
                  <div className="h-px bg-white/5 my-1" />
                  <div className="flex justify-between text-zinc-400 font-bold">
                    <span>Est. Total Cost:</span>
                    <span className="text-[#0057FF]">${((parseFloat(amount) || 10) * selectedAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                  </div>
                </div>
              </div>

            </div>

            <button 
              onClick={handleExecuteTrade}
              className={`w-full py-4 rounded-xl font-bold mt-8 text-black transition-all shadow-lg ${
                tradeAction === 'buy' 
                  ? 'bg-[#00C896] hover:bg-[#00C896]/80 shadow-[#00C896]/20' 
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
              }`}
            >
              {tradeAction === 'buy' ? 'Execute Buy Order' : 'Execute Sell Order'}
            </button>
          </div>

          {/* Institutional Compliance Card */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 relative overflow-hidden space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00C853]" />
              <h4 className="font-bold text-xs uppercase tracking-widest text-white font-mono">Securitized & Cleared</h4>
            </div>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              All transactions executed on the Twelve Data Real-time Network are fully cleared and subject to instant digital certificate issuance under AQX clearing framework rules.
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
