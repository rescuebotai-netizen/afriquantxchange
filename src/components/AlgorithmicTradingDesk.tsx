import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Play, Square, Activity, ShieldCheck, AlertTriangle, 
  Clock, Zap, CheckCircle2, RefreshCw, BarChart2, Layers, 
  Terminal, Lock, ArrowUpRight, ArrowDownRight, Settings2, Sliders,
  Bell, BellRing, Volume2, VolumeX, Plus, Trash2, ExternalLink,
  ChevronRight, Radio, Compass, ArrowRight, Eye
} from 'lucide-react';
import { BiometricAuthModal } from './BiometricAuthModal';
import { priceAlertService, PriceAlert } from '../services/priceAlertService';

export interface AlgoStrategy {
  id: 'twap' | 'vwap' | 'iceberg' | 'pov' | 'sniper';
  name: string;
  badge: string;
  description: string;
  defaultDurationMin: number;
  participationRate?: number;
  slippageLimitBps: number;
}

const STRATEGIES: AlgoStrategy[] = [
  {
    id: 'twap',
    name: 'TWAP (Time-Weighted Average Price)',
    badge: 'Linear Slice & Randomizer',
    description: 'Evenly distributes large parent orders across customized time horizons with stochastic jitter to obscure algorithmic footprint.',
    defaultDurationMin: 60,
    slippageLimitBps: 15
  },
  {
    id: 'vwap',
    name: 'VWAP (Volume-Weighted Average Price)',
    badge: 'Intraday Curve Matching',
    description: 'Dynamically scales child slices according to historical intraday volume profile to minimize market price impact.',
    defaultDurationMin: 120,
    slippageLimitBps: 20
  },
  {
    id: 'iceberg',
    name: 'Iceberg (Synthetic Hidden Reserve)',
    badge: 'Dark / Lit Split',
    description: 'Displays only a fraction (e.g. 5%) of the total order size in the public order book while refreshing automatically as filled.',
    defaultDurationMin: 45,
    slippageLimitBps: 10
  },
  {
    id: 'pov',
    name: 'POV (Percentage of Volume)',
    badge: '10% - 25% Inline Participation',
    description: 'Chases real-time tape volume directly by matching 15% of printed prints in the public market until parent size is filled.',
    defaultDurationMin: 90,
    participationRate: 15,
    slippageLimitBps: 25
  },
  {
    id: 'sniper',
    name: 'Sniper (Dark Liquidity Seeker)',
    badge: 'Zero Lit Footprint',
    description: 'Resting non-displayed orders across OTC dark liquidity pools; opportunistically attacks aggressive crossing prices.',
    defaultDurationMin: 30,
    slippageLimitBps: 8
  }
];

const AVAILABLE_TICKERS = [
  { symbol: 'JSE:SBK (Standard Bank)', name: 'Standard Bank Group', exchange: 'JSE' as const, currency: 'ZAR', basePrice: 208.50 },
  { symbol: 'JSE:NPN (Naspers Ltd)', name: 'Naspers Ltd', exchange: 'JSE' as const, currency: 'ZAR', basePrice: 3420.50 },
  { symbol: 'NGX:DANGCEM (Dangote)', name: 'Dangote Cement PLC', exchange: 'NGX' as const, currency: 'NGN', basePrice: 680.00 },
  { symbol: 'NSE:SCOM (Safaricom)', name: 'Safaricom PLC', exchange: 'NSE' as const, currency: 'KES', basePrice: 18.90 },
  { symbol: 'JSE:SOL (Sasol Ltd)', name: 'Sasol Energy Ltd', exchange: 'JSE' as const, currency: 'ZAR', basePrice: 142.30 },
  { symbol: 'EGX:COMI (CIB Egypt)', name: 'Commercial Int. Bank', exchange: 'EGX' as const, currency: 'EGP', basePrice: 84.10 }
];

export function AlgorithmicTradingDesk({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [selectedStrategy, setSelectedStrategy] = useState<AlgoStrategy>(STRATEGIES[0]);
  const [symbol, setSymbol] = useState('JSE:SBK (Standard Bank)');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [totalQuantity, setTotalQuantity] = useState<number>(50000);
  const [limitPrice, setLimitPrice] = useState<number>(208.50);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [sliceDisplayQty, setSliceDisplayQty] = useState<number>(2500);
  const [maxParticipationRate, setMaxParticipationRate] = useState<number>(15);
  const [slippageBps, setSlippageBps] = useState<number>(15);

  // Active sub-tab in right-hand section
  const [deskTab, setDeskTab] = useState<'radar' | 'orders' | 'fix'>('radar');

  // Execution State
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [activeAlgos, setActiveAlgos] = useState<any[]>([
    {
      id: 'ALGO-9082',
      strategy: 'VWAP',
      symbol: 'JSE:NPN (Naspers Ltd)',
      side: 'BUY',
      totalQty: 25000,
      filledQty: 18400,
      avgFillPrice: 3420.50,
      progress: 73.6,
      status: 'RUNNING',
      latencyMicrosec: 142,
      startedAt: '10:14:02'
    },
    {
      id: 'ALGO-9081',
      strategy: 'Iceberg',
      symbol: 'NGX:DANGCEM (Dangote)',
      side: 'SELL',
      totalQty: 100000,
      filledQty: 45000,
      avgFillPrice: 680.00,
      progress: 45.0,
      status: 'RUNNING',
      latencyMicrosec: 210,
      startedAt: '10:30:15'
    }
  ]);

  // FIX Protocol Live Stream Telemetry
  const [fixMessages, setFixMessages] = useState<any[]>([
    { time: '11:24:02.819', tag: '35=8 (ExecutionReport)', detail: 'ExecType=F (Trade) CumQty=18400 Price=3420.50 ClOrdID=ALGO-9082' },
    { time: '11:23:45.102', tag: '35=D (NewOrderSingle)', detail: 'Side=1 Symbol=JSE:NPN OrdType=2 (Limit) Qty=1200 Price=3421.00' },
    { time: '11:22:18.490', tag: '35=G (OrderCancelReplace)', detail: 'OrigClOrdID=SLICE-889 Price=680.50 NewQty=2500' }
  ]);

  // Price Alerting State
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeBannerAlert, setActiveBannerAlert] = useState<PriceAlert | null>(null);
  const [isNewAlertModalOpen, setIsNewAlertModalOpen] = useState(false);

  // New Alert Form state
  const [newAlertSymbol, setNewAlertSymbol] = useState(AVAILABLE_TICKERS[0].symbol);
  const [newAlertCondition, setNewAlertCondition] = useState<'GREATER_EQUAL' | 'LESS_EQUAL'>('GREATER_EQUAL');
  const [newAlertTargetPrice, setNewAlertTargetPrice] = useState<number>(215.00);
  const [newAlertPriority, setNewAlertPriority] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [newAlertAction, setNewAlertAction] = useState<PriceAlert['triggerAction']>('AUTO_ALGO_TWAP');
  const [newAlertNotes, setNewAlertNotes] = useState('');

  // Live prices ticker map
  const [livePrices, setLivePrices] = useState<Record<string, number>>({
    'JSE:SBK (Standard Bank)': 208.50,
    'JSE:NPN (Naspers Ltd)': 3420.50,
    'NGX:DANGCEM (Dangote)': 680.00,
    'NSE:SCOM (Safaricom)': 18.90,
    'JSE:SOL (Sasol Ltd)': 142.30,
    'EGX:COMI (CIB Egypt)': 84.10
  });

  // Subscribe to Price Alerts
  useEffect(() => {
    const unsub = priceAlertService.subscribe(loadedAlerts => {
      setAlerts(loadedAlerts);
    });
    setNotificationPermission(priceAlertService.getNotificationPermission());

    const handleAlertTriggered = (e: any) => {
      if (e.detail?.alert) {
        setActiveBannerAlert(e.detail.alert);
        // Log to FIX audit stream
        const timeStr = new Date().toTimeString().split(' ')[0];
        setFixMessages(prev => [
          {
            time: timeStr,
            tag: '35=U (PriceAlertTrigger)',
            detail: `ALERT_ID=${e.detail.alert.id} Symbol=${e.detail.alert.symbol} Target=${e.detail.alert.targetPrice} Actual=${e.detail.actualPrice} Action=${e.detail.alert.triggerAction}`
          },
          ...prev.slice(0, 7)
        ]);
      }
    };

    window.addEventListener('nxg_price_alert_triggered', handleAlertTriggered);

    return () => {
      unsub();
      window.removeEventListener('nxg_price_alert_triggered', handleAlertTriggered);
    };
  }, []);

  // Live streaming simulation: micro-ticks for prices & algo progress
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Ticks for live prices
      setLivePrices(prev => {
        const next: Record<string, number> = {};
        Object.entries(prev).forEach(([sym, price]) => {
          const deltaPct = (Math.random() - 0.49) * 0.004; // subtle stochastic tick
          const updated = parseFloat((price * (1 + deltaPct)).toFixed(2));
          next[sym] = updated;
        });

        // Feed updated prices to priceAlertService
        priceAlertService.updateQuotes(next);
        return next;
      });

      // 2. FIX message simulation
      const timeStr = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100);
      const isFill = Math.random() > 0.4;
      const newMsg = isFill
        ? { time: timeStr, tag: '35=8 (ExecutionReport)', detail: `ExecType=F (Fill) CumQty=+${Math.floor(Math.random() * 500 + 100)} SubNode=StrateTape Latency=112μs` }
        : { time: timeStr, tag: '35=D (ChildSlicePost)', detail: `OrdType=Limit DisplayQty=${sliceDisplayQty} RoutedTo=JSE_Lit_Book` };

      setFixMessages(prev => [newMsg, ...prev.slice(0, 7)]);

      // 3. Increment progress of active algos
      setActiveAlgos(prev => prev.map(algo => {
        if (algo.status === 'RUNNING' && algo.filledQty < algo.totalQty) {
          const addFill = Math.min(algo.totalQty - algo.filledQty, Math.floor(Math.random() * 150 + 20));
          const newFilled = algo.filledQty + addFill;
          return {
            ...algo,
            filledQty: newFilled,
            progress: parseFloat(((newFilled / algo.totalQty) * 100).toFixed(1)),
            status: newFilled >= algo.totalQty ? 'COMPLETED' : 'RUNNING'
          };
        }
        return algo;
      }));
    }, 3800);

    return () => clearInterval(interval);
  }, [sliceDisplayQty]);

  const totalNotional = totalQuantity * limitPrice;

  const handleLaunchAlgo = () => {
    setIsBioModalOpen(true);
  };

  const executeConfirmedAlgo = () => {
    const newAlgo = {
      id: `ALGO-${Math.floor(Math.random() * 9000 + 1000)}`,
      strategy: selectedStrategy.name.split(' ')[0],
      symbol: symbol,
      side: side,
      totalQty: totalQuantity,
      filledQty: 0,
      avgFillPrice: limitPrice,
      progress: 0,
      status: 'RUNNING',
      latencyMicrosec: Math.floor(Math.random() * 120 + 80),
      startedAt: new Date().toLocaleTimeString()
    };
    setActiveAlgos(prev => [newAlgo, ...prev]);
    setDeskTab('orders');
  };

  const handleCancelAlgo = (algoId: string) => {
    setActiveAlgos(prev => prev.map(a => a.id === algoId ? { ...a, status: 'CANCELLED' } : a));
    const timeStr = new Date().toTimeString().split(' ')[0];
    setFixMessages(prev => [{
      time: timeStr,
      tag: '35=F (OrderCancelRequest)',
      detail: `ClOrdID=${algoId} Status=CANCELLED_BY_DESK`
    }, ...prev]);
  };

  // Request browser notification permissions
  const handleEnableNotifications = async () => {
    const res = await priceAlertService.requestNotificationPermission();
    setNotificationPermission(res);
  };

  // Quick test simulation for any alert
  const handleSimulateAlertTrigger = (alert: PriceAlert) => {
    const targetPrice = alert.targetPrice;
    // Set actual trigger price slightly beyond threshold
    const actualPrice = alert.condition === 'GREATER_EQUAL' 
      ? parseFloat((targetPrice * 1.008).toFixed(2))
      : parseFloat((targetPrice * 0.992).toFixed(2));
    
    priceAlertService.triggerAlert(alert.id, actualPrice);
  };

  // Load alert parameters directly into Strategy Configurator
  const handleLoadAlertIntoDesk = (alert: PriceAlert) => {
    setSymbol(alert.symbol);
    setLimitPrice(alert.targetPrice);
    if (alert.condition === 'GREATER_EQUAL') {
      setSide('BUY');
    } else {
      setSide('BUY'); // buy dip
    }
    // Match strategy if specified
    if (alert.triggerAction === 'AUTO_ALGO_TWAP') {
      setSelectedStrategy(STRATEGIES[0]);
    } else if (alert.triggerAction === 'AUTO_ALGO_VWAP') {
      setSelectedStrategy(STRATEGIES[1]);
    } else if (alert.triggerAction === 'AUTO_ALGO_ICEBERG') {
      setSelectedStrategy(STRATEGIES[2]);
    }
  };

  // Handle Create New Alert Submit
  const handleCreateNewAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const tickerMeta = AVAILABLE_TICKERS.find(t => t.symbol === newAlertSymbol) || AVAILABLE_TICKERS[0];
    const currentP = livePrices[newAlertSymbol] || tickerMeta.basePrice;

    priceAlertService.createAlert({
      symbol: newAlertSymbol,
      assetName: tickerMeta.name,
      exchange: tickerMeta.exchange,
      currency: tickerMeta.currency,
      condition: newAlertCondition,
      targetPrice: newAlertTargetPrice,
      initialPrice: currentP,
      currentPrice: currentP,
      priority: newAlertPriority,
      triggerAction: newAlertAction,
      notes: newAlertNotes
    });

    setIsNewAlertModalOpen(false);
    setDeskTab('radar');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert (Shown when any price threshold is breached) */}
      <AnimatePresence>
        {activeBannerAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-[#0F1420] bg-gradient-to-r from-amber-950/80 via-[#0F1420] to-amber-950/60 border-2 border-amber-500/70 shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col md:flex-row items-center justify-between gap-4 relative z-30"
            style={{ backgroundColor: '#0F1420' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 animate-bounce">
                <BellRing className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    REAL-TIME PRICE THRESHOLD HIT
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {activeBannerAlert.id}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {activeBannerAlert.symbol} crossed {activeBannerAlert.condition === 'GREATER_EQUAL' ? '▲ resistance' : '▼ support'} at {activeBannerAlert.currency} {activeBannerAlert.triggeredPrice?.toFixed(2) || activeBannerAlert.targetPrice.toFixed(2)}
                </h4>
                <p className="text-xs text-zinc-300">
                  Target: {activeBannerAlert.currency} {activeBannerAlert.targetPrice.toFixed(2)} | Action: {activeBannerAlert.triggerAction.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => {
                  handleLoadAlertIntoDesk(activeBannerAlert);
                  setActiveBannerAlert(null);
                }}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>Auto-Configure Order</span>
              </button>

              {setActiveTab && (
                <button
                  onClick={() => {
                    setActiveTab('activity');
                    setActiveBannerAlert(null);
                  }}
                  className="py-2 px-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  <span>Activity Center →</span>
                </button>
              )}

              <button
                onClick={() => setActiveBannerAlert(null)}
                className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-zinc-300 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFFFF]/10 border border-[#FFFFFF]/30 rounded-full text-xs font-mono text-[#FFFFFF]">
            <Cpu className="w-3.5 h-3.5" />
            <span>Smart Order Routing & Real-Time Telemetry Radar</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            Institutional Algorithmic Desk
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Execute large parent blocks with low slippage using TWAP, VWAP, and synthetic Iceberg routers. Monitor real-time streaming price thresholds with desktop browser notifications.
          </p>
        </div>

        {/* Action Controls & KPIs */}
        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          {/* Browser Notification Permission Badge / Button */}
          {notificationPermission === 'granted' ? (
            <div className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Browser Alerts Active</span>
            </div>
          ) : (
            <button
              onClick={handleEnableNotifications}
              className="py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Click to enable native desktop browser alerts when price limits are triggered"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Enable Browser Alerts</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Chime sound is active' : 'Sound is muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {setActiveTab && (
            <button
              onClick={() => setActiveTab('activity')}
              className="py-2.5 px-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Activity Center</span>
            </button>
          )}

          {setActiveTab && (
            <button
              onClick={() => setActiveTab('integrations')}
              className="py-2.5 px-3.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>FIX & SOR Hub →</span>
            </button>
          )}

          <div className="bg-black/60 border border-white/10 rounded-2xl p-3 text-center min-w-[110px]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Engine Latency</span>
            <span className="text-base font-mono font-black text-emerald-400">114 μs</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Setup Form, Right Interactive Desk Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Strategy Configurator */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#FFFFFF]" /> Strategy Configurator
            </h3>

            {/* Strategy Selector Pills */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-zinc-400 uppercase">Select Execution Algorithm</label>
              <div className="grid grid-cols-1 gap-2">
                {STRATEGIES.map((strat) => {
                  const isSelected = selectedStrategy.id === strat.id;
                  return (
                    <button
                      key={strat.id}
                      onClick={() => setSelectedStrategy(strat)}
                      className={`text-left p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FFFFFF]/10 border-[#FFFFFF] text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                          : 'bg-black border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{strat.name}</span>
                        <span className="text-[9px] font-mono text-[#FFFFFF] bg-black px-1.5 py-0.5 rounded border border-[#FFFFFF]/30">{strat.badge}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{strat.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Asset & Order Parameters */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">Ticker / Asset</label>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Live: R {(livePrices[symbol] || limitPrice).toFixed(2)}
                  </span>
                </div>
                <select
                  value={symbol}
                  onChange={(e) => {
                    const nextSym = e.target.value;
                    setSymbol(nextSym);
                    if (livePrices[nextSym]) {
                      setLimitPrice(livePrices[nextSym]);
                    }
                  }}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FFFFFF] focus:outline-none font-mono"
                >
                  {AVAILABLE_TICKERS.map(t => (
                    <option key={t.symbol} value={t.symbol}>{t.symbol} ({t.currency})</option>
                  ))}
                </select>
              </div>

              {/* Side (Buy/Sell) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSide('BUY')}
                  className={`py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    side === 'BUY' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-black border border-white/10 text-zinc-400'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setSide('SELL')}
                  className={`py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    side === 'SELL' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-black border border-white/10 text-zinc-400'
                  }`}
                >
                  SELL
                </button>
              </div>

              {/* Total Qty & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Total Parent Qty</label>
                  <input
                    type="number"
                    step="1000"
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 1000)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-[#FFFFFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Limit Price</label>
                  <input
                    type="number"
                    step="0.50"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-[#FFFFFF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Algo Specific Controls */}
              {selectedStrategy.id === 'iceberg' && (
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Visible Display Slice Qty</label>
                  <input
                    type="number"
                    step="500"
                    value={sliceDisplayQty}
                    onChange={(e) => setSliceDisplayQty(parseInt(e.target.value) || 500)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#FFFFFF] focus:outline-none"
                  />
                </div>
              )}

              {selectedStrategy.id === 'pov' && (
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Target Volume Participation (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={maxParticipationRate}
                    onChange={(e) => setMaxParticipationRate(parseInt(e.target.value) || 10)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#FFFFFF] focus:outline-none"
                  />
                </div>
              )}

              {/* Pre-Trade Risk Gate Check */}
              <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Gross Notional:</span>
                  <span className="text-white font-bold">ZAR {totalNotional.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Pre-Trade VaR Impact:</span>
                  <span className="text-emerald-400 font-bold">&lt; 0.42% (Within Collar)</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Slippage Protection:</span>
                  <span className="text-[#FFFFFF]">{slippageBps} bps</span>
                </div>
              </div>

              {/* Launch Strategy Button */}
              <button
                onClick={handleLaunchAlgo}
                className="w-full py-3.5 bg-[#FFFFFF] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-[#E4E4E7] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Launch Algorithmic Execution</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Tabs for [Price Alert Radar] | [Active Orders] | [FIX Stream] */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 bg-black/50 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setDeskTab('radar')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  deskTab === 'radar'
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Price Alert Radar</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${deskTab === 'radar' ? 'bg-black/30 text-black' : 'bg-white/10 text-amber-400'}`}>
                  {alerts.filter(a => a.status === 'ARMED').length} Armed
                </span>
              </button>

              <button
                onClick={() => setDeskTab('orders')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  deskTab === 'orders'
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Active Algos</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${deskTab === 'orders' ? 'bg-black/30 text-black' : 'bg-white/10 text-white'}`}>
                  {activeAlgos.filter(a => a.status === 'RUNNING').length}
                </span>
              </button>

              <button
                onClick={() => setDeskTab('fix')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  deskTab === 'fix'
                    ? 'bg-emerald-500 text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>FIX 4.4/5.0 Stream</span>
              </button>
            </div>

            {deskTab === 'radar' && (
              <button
                onClick={() => setIsNewAlertModalOpen(true)}
                className="py-2 px-3.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Arm New Alert</span>
              </button>
            )}
          </div>

          {/* TAB 1: REAL-TIME PRICE ALERT RADAR */}
          {deskTab === 'radar' && (
            <div className="space-y-4">
              {/* Radar Live Banner */}
              <div className="bg-gradient-to-r from-amber-950/30 via-neutral-950 to-neutral-950 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                      Sub-Second Multi-Venue Price Monitor
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Real-Time Threshold Triggers & ActivityCenter Dispatch
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xl">
                    When streaming prices breach your set resistance or support collars, the system instantly triggers browser web notifications, sounds an institutional chime, updates the ActivityCenter, and routes algorithmic child slices.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      // Trigger first armed alert as test
                      const armed = alerts.find(a => a.status === 'ARMED') || alerts[0];
                      if (armed) handleSimulateAlertTrigger(armed);
                    }}
                    className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>⚡ Test Quick Trigger</span>
                  </button>
                </div>
              </div>

              {/* Alert Cards List */}
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="bg-black border border-white/10 rounded-2xl p-8 text-center space-y-3">
                    <Bell className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="text-sm text-zinc-400">No price alerts armed yet.</p>
                    <button
                      onClick={() => setIsNewAlertModalOpen(true)}
                      className="py-2 px-4 bg-amber-500 text-black font-bold text-xs rounded-xl"
                    >
                      Arm Your First Alert
                    </button>
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const currentLive = livePrices[alert.symbol] || alert.currentPrice;
                    const diffPct = (((currentLive - alert.targetPrice) / alert.targetPrice) * 100);
                    const distanceToTarget = Math.abs(diffPct).toFixed(2);
                    const isBreached = alert.status === 'TRIGGERED' ||
                      (alert.condition === 'GREATER_EQUAL' && currentLive >= alert.targetPrice) ||
                      (alert.condition === 'LESS_EQUAL' && currentLive <= alert.targetPrice);

                    return (
                      <div
                        key={alert.id}
                        className={`bg-black border rounded-2xl p-4 transition-all space-y-3 ${
                          alert.status === 'TRIGGERED'
                            ? 'border-amber-500/50 bg-amber-950/10'
                            : alert.status === 'PAUSED'
                            ? 'border-white/5 opacity-60'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-black text-white">{alert.symbol}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10">
                                {alert.exchange} Venue
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                                alert.priority === 'CRITICAL'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  : alert.priority === 'HIGH'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {alert.priority} Priority
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                                alert.status === 'TRIGGERED'
                                  ? 'bg-amber-500 text-black animate-pulse'
                                  : alert.status === 'ARMED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {alert.status}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-400 mt-1">
                              {alert.assetName} • Action: <span className="text-white font-mono">{alert.triggerAction.replace(/_/g, ' ')}</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleSimulateAlertTrigger(alert)}
                              className="py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Simulate immediate price trigger to test notifications and Activity Center update"
                            >
                              <Zap className="w-3 h-3 text-amber-400" />
                              <span>⚡ Test Trigger</span>
                            </button>

                            <button
                              onClick={() => handleLoadAlertIntoDesk(alert)}
                              className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Populate strategy configurator with this asset and target limit"
                            >
                              <Play className="w-3 h-3 text-emerald-400" />
                              <span>Load into Desk</span>
                            </button>

                            <button
                              onClick={() => priceAlertService.togglePauseAlert(alert.id)}
                              className="py-1.5 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-zinc-300 text-xs transition-colors cursor-pointer"
                            >
                              {alert.status === 'PAUSED' ? 'Resume' : 'Pause'}
                            </button>

                            {alert.status === 'TRIGGERED' && (
                              <button
                                onClick={() => priceAlertService.resetAlert(alert.id)}
                                className="py-1.5 px-2.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Re-Arm
                              </button>
                            )}

                            <button
                              onClick={() => priceAlertService.deleteAlert(alert.id)}
                              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Alert"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Price Gauges & Threshold Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-950/80 p-3 rounded-xl border border-white/5 text-xs font-mono">
                          <div>
                            <span className="text-zinc-500 text-[10px] uppercase block">Condition</span>
                            <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                              {alert.condition === 'GREATER_EQUAL' ? (
                                <>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>&gt;= Resistance</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                                  <span>&lt;= Support Dip</span>
                                </>
                              )}
                            </span>
                          </div>

                          <div>
                            <span className="text-zinc-500 text-[10px] uppercase block">Target Price</span>
                            <span className="text-amber-400 font-black mt-0.5 block">
                              {alert.currency} {alert.targetPrice.toFixed(2)}
                            </span>
                          </div>

                          <div>
                            <span className="text-zinc-500 text-[10px] uppercase block">Streaming Price</span>
                            <span className="text-white font-black mt-0.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              {alert.currency} {currentLive.toFixed(2)}
                            </span>
                          </div>

                          <div>
                            <span className="text-zinc-500 text-[10px] uppercase block">Delta to Target</span>
                            <span className={`font-bold mt-0.5 block ${
                              isBreached ? 'text-amber-400' : 'text-zinc-400'
                            }`}>
                              {isBreached ? '🎯 THRESHOLD HIT' : `${distanceToTarget}% away`}
                            </span>
                          </div>
                        </div>

                        {alert.notes && (
                          <p className="text-[11px] text-zinc-400 italic">
                            Strategy Note: &quot;{alert.notes}&quot;
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE RUNNING ALGORITHMS */}
          {deskTab === 'orders' && (
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FFFFFF]" /> Active Algorithmic Parent Orders
                </h3>
                <span className="text-xs font-mono text-zinc-400">Real-time Slicing Telemetry</span>
              </div>

              <div className="space-y-3">
                {activeAlgos.map((algo) => (
                  <div key={algo.id} className="bg-black border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-[#FFFFFF]">{algo.id}</span>
                          <span className="text-xs font-bold text-white">{algo.strategy} Strategy</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            algo.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {algo.side}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-zinc-300 mt-1">{algo.symbol}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          algo.status === 'RUNNING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse' :
                          algo.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {algo.status}
                        </span>
                        {algo.status === 'RUNNING' && (
                          <button
                            onClick={() => handleCancelAlgo(algo.id)}
                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress & Stats */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">Filled: {algo.filledQty.toLocaleString()} / {algo.totalQty.toLocaleString()} shares</span>
                        <span className="text-[#FFFFFF] font-bold">{algo.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#FFFFFF] h-full rounded-full transition-all duration-300"
                          style={{ width: `${algo.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                        <span>Avg Fill: R {algo.avgFillPrice.toFixed(2)}</span>
                        <span>Latency: {algo.latencyMicrosec} μs</span>
                        <span>Started: {algo.startedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FIX PROTOCOL STREAM */}
          {deskTab === 'fix' && (
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> FIX Protocol 4.4 / 5.0 Audit Stream
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Session Active
                </span>
              </div>

              <div className="bg-black border border-white/10 rounded-xl p-4 font-mono text-xs space-y-2 overflow-x-auto max-h-[480px]">
                {fixMessages.map((msg, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-500 text-[10px] shrink-0">{msg.time}</span>
                    <span className="text-[#FFFFFF] font-bold text-[11px] shrink-0">{msg.tag}</span>
                    <span className="text-zinc-300 text-[11px] truncate">{msg.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Arm New Price Alert Modal */}
      <AnimatePresence>
        {isNewAlertModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0F19] border-2 border-amber-500/50 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-[0_20px_70px_rgba(0,0,0,0.95)]"
              style={{ backgroundColor: '#0B0F19' }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <BellRing className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase">Arm Real-Time Price Alert</h3>
                    <p className="text-xs text-zinc-400">Trigger browser notification & Activity Center log</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNewAlertModalOpen(false)}
                  className="text-zinc-500 hover:text-white text-xs font-mono p-1"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateNewAlert} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Select Asset / Venue</label>
                  <select
                    value={newAlertSymbol}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setNewAlertSymbol(selected);
                      const base = livePrices[selected] || AVAILABLE_TICKERS.find(t => t.symbol === selected)?.basePrice || 100;
                      setNewAlertTargetPrice(parseFloat((base * 1.03).toFixed(2)));
                    }}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                  >
                    {AVAILABLE_TICKERS.map(t => (
                      <option key={t.symbol} value={t.symbol}>
                        {t.symbol} (Live: {t.currency} {(livePrices[t.symbol] || t.basePrice).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition: Breakout Above or Support Below */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Trigger Condition</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewAlertCondition('GREATER_EQUAL')}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        newAlertCondition === 'GREATER_EQUAL'
                          ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-black border border-white/10 text-zinc-400'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>&gt;= Resistance Breakout</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewAlertCondition('LESS_EQUAL')}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        newAlertCondition === 'LESS_EQUAL'
                          ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                          : 'bg-black border border-white/10 text-zinc-400'
                      }`}
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span>&lt;= Support Pullback</span>
                    </button>
                  </div>
                </div>

                {/* Target Price with Quick +/- % buttons */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Target Price Threshold</label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Current: {(livePrices[newAlertSymbol] || 100).toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.10"
                    value={newAlertTargetPrice}
                    onChange={(e) => setNewAlertTargetPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm font-mono font-bold text-amber-400 focus:border-amber-400 focus:outline-none"
                    required
                  />

                  {/* Quick percentage adjustment buttons */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[-5, -2, -1, 1, 2, 5].map(pct => (
                      <button
                        type="button"
                        key={pct}
                        onClick={() => {
                          const curr = livePrices[newAlertSymbol] || 100;
                          setNewAlertTargetPrice(parseFloat((curr * (1 + pct / 100)).toFixed(2)));
                        }}
                        className="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-zinc-300 transition-colors cursor-pointer"
                      >
                        {pct > 0 ? `+${pct}%` : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority & Action */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Urgency Priority</label>
                    <select
                      value={newAlertPriority}
                      onChange={(e) => setNewAlertPriority(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="HIGH">HIGH (Priority Chime)</option>
                      <option value="CRITICAL">CRITICAL (Persistent Alert)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Trigger Action</label>
                    <select
                      value={newAlertAction}
                      onChange={(e) => setNewAlertAction(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    >
                      <option value="AUTO_ALGO_TWAP">Auto-Launch TWAP Algo</option>
                      <option value="AUTO_ALGO_VWAP">Auto-Launch VWAP Algo</option>
                      <option value="AUTO_ALGO_ICEBERG">Auto-Launch Iceberg</option>
                      <option value="NOTIFICATION_ONLY">Notification Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Trading Desk Rationale (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Breakout collar trigger for Q2 equity position"
                    value={newAlertNotes}
                    onChange={(e) => setNewAlertNotes(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewAlertModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                  >
                    Arm Real-Time Alert
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hardware Biometric Security Gate Modal */}
      <BiometricAuthModal
        isOpen={isBioModalOpen}
        actionTitle="Authorize Algorithmic Parent Order"
        actionDescription={`Hardware verification required to sign and route algorithmic ${selectedStrategy.name} order for ${totalQuantity.toLocaleString()} shares of ${symbol}.`}
        amount={totalNotional}
        currency="ZAR"
        onSuccess={() => {
          setIsBioModalOpen(false);
          executeConfirmedAlgo();
        }}
        onCancel={() => setIsBioModalOpen(false)}
      />
    </div>
  );
}
