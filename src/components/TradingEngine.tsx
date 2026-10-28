import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, ArrowRightLeft, Zap, ShieldCheck, TrendingUp, Clock, 
  DollarSign, Loader2, AlertTriangle, Play, Square, Settings2, 
  Terminal, Server, RefreshCw, Cpu, Database, Award, CheckCircle2,
  ListFilter, FileSpreadsheet, PlayCircle, BarChart3, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateTradingSignals } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OvexRfqTrading } from './OvexRfqTrading';

// Sound design using Web Audio API
const playSoundEffect = (type: 'beep' | 'success' | 'click' | 'stop') => {
  if (typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'success') {
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'stop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn("Blocked sound effect:", e);
  }
};

const MOCK_STRATEGIES = [
  {
    id: 'ema_cross',
    name: 'EMA Crossover (Rust)',
    description: 'Nautilus EMA crossover strategy optimized with SIMD instructions for cross-venue arbitrage.',
    status: 'Running',
    trades: 124,
    profit: '+$14,240.20',
    venue: 'AQX / NSE',
    latency: '380ns',
    parameters: { fast_period: 12, slow_period: 26, slippage_tolerance: 0.02 }
  },
  {
    id: 'market_maker',
    name: 'Nautilus Market Maker',
    description: 'High-frequency inventory-skewed market-making strategy providing orderbook liquidity.',
    status: 'Running',
    trades: 1842,
    profit: '+$28,490.50',
    venue: 'AQX Only',
    latency: '410ns',
    parameters: { half_spread: 0.05, inventory_limit: 10000, risk_factor: 0.15 }
  },
  {
    id: 'mean_reversion',
    name: 'Nautilus Mean Reversion',
    description: 'Ornstein-Uhlenbeck statistical arbitrage targeting temporary cross-asset dispersion.',
    status: 'Idle',
    trades: 0,
    profit: '$0.00',
    venue: 'AQX / JSE',
    latency: '520ns',
    parameters: { lookback: 60, entry_std: 2.0, exit_std: 0.5 }
  }
];

const BACKTEST_CURVES: Record<string, any[]> = {
  ema_cross: [
    { step: '0%', value: 10000 }, { step: '10%', value: 10250 }, { step: '20%', value: 10110 },
    { step: '30%', value: 10450 }, { step: '40%', value: 10700 }, { step: '50%', value: 10620 },
    { step: '60%', value: 11200 }, { step: '70%', value: 11480 }, { step: '80%', value: 11390 },
    { step: '90%', value: 11950 }, { step: '100%', value: 12420 }
  ],
  market_maker: [
    { step: '0%', value: 10000 }, { step: '10%', value: 10300 }, { step: '20%', value: 10610 },
    { step: '30%', value: 10890 }, { step: '40%', value: 11240 }, { step: '50%', value: 11500 },
    { step: '60%', value: 11840 }, { step: '70%', value: 12150 }, { step: '80%', value: 12490 },
    { step: '90%', value: 12820 }, { step: '100%', value: 13180 }
  ],
  mean_reversion: [
    { step: '0%', value: 10000 }, { step: '10%', value: 9910 }, { step: '20%', value: 10210 },
    { step: '30%', value: 10150 }, { step: '40%', value: 10440 }, { step: '50%', value: 10820 },
    { step: '60%', value: 10690 }, { step: '70%', value: 11110 }, { step: '80%', value: 11450 },
    { step: '90%', value: 11310 }, { step: '100%', value: 11890 }
  ]
};

export function TradingEngine() {
  const [activeTab, setActiveTab] = useState<'ovex_rfq' | 'nautilus_strategies' | 'nautilus_backtest' | 'ai_recommendations' | 'nautilus_venue'>('ovex_rfq');
  const [strategies, setStrategies] = useState(MOCK_STRATEGIES);
  const [selectedStrategy, setSelectedStrategy] = useState(MOCK_STRATEGIES[0]);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestProgress, setBacktestProgress] = useState(0);
  const [backtestCompleted, setBacktestCompleted] = useState(false);
  const [backtestResults, setBacktestResults] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(true);

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Load AI recommendations as well
  useEffect(() => {
    const fetchSignals = async () => {
      setAiLoading(true);
      const result = await generateTradingSignals();
      if (result) {
        setAiData(result);
      }
      setAiLoading(false);
    };
    fetchSignals();
  }, []);

  // Periodic Log Stream Simulation
  useEffect(() => {
    const initialLogs = [
      `[${new Date().toISOString()}] [INFO] [nautilus_trader.core] Initialized rust engine core.`,
      `[${new Date().toISOString()}] [INFO] [nautilus_trader.cache] Security master cache synced with AQX core.`,
      `[${new Date().toISOString()}] [INFO] [nautilus_trader.execution] Active venues: AQX, NSE, JSE.`,
      `[${new Date().toISOString()}] [DEBUG] [nautilus_trader.strategy] Registered EMA Crossover strategy (ID: ema_cross).`,
      `[${new Date().toISOString()}] [DEBUG] [nautilus_trader.strategy] Registered Market Maker strategy (ID: market_maker).`
    ];
    setLogLines(initialLogs);

    const interval = setInterval(() => {
      const timestamp = new Date().toISOString();
      const templates = [
        `[${timestamp}] [DEBUG] [nautilus_trader.strategy] processing tick: AFQ 152.40 - inside spreads`,
        `[${timestamp}] [INFO] [nautilus_trader.execution] Sent market data snapshot to engine`,
        `[${timestamp}] [DEBUG] [nautilus_trader.cache] Cached 12 OrderBook updates from JSE`,
        `[${timestamp}] [INFO] [nautilus_trader.execution] Smart Order Router routing to AQX Clearing node`,
        `[${timestamp}] [DEBUG] [nautilus_trader.strategy] EMA crossover signal checked. Diff: +0.024`,
        `[${timestamp}] [INFO] [nautilus_trader.execution] Nautilus core processed internal feedback in 410ns`
      ];
      const randomLine = templates[Math.floor(Math.random() * templates.length)];
      setLogLines(prev => {
        const next = [...prev, randomLine];
        return next.slice(-80); // Keep last 80 logs
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Autoscroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logLines]);

  const toggleStrategy = (id: string) => {
    setStrategies(prev => prev.map(strat => {
      if (strat.id === id) {
        const nextStatus = strat.status === 'Running' ? 'Idle' : 'Running';
        if (nextStatus === 'Running') {
          playSoundEffect('beep');
        } else {
          playSoundEffect('stop');
        }
        return {
          ...strat,
          status: nextStatus,
          trades: nextStatus === 'Running' ? strat.trades : 0
        };
      }
      return strat;
    }));
  };

  const runBacktest = () => {
    playSoundEffect('click');
    setIsBacktesting(true);
    setBacktestCompleted(false);
    setBacktestProgress(0);

    const interval = setInterval(() => {
      setBacktestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBacktesting(false);
            setBacktestCompleted(true);
            playSoundEffect('success');
            // Mock result based on selected strategy
            setBacktestResults({
              profit: selectedStrategy.id === 'market_maker' ? 'R31,800.00' : selectedStrategy.id === 'ema_cross' ? 'R24,200.00' : 'R18,900.00',
              sharpe: selectedStrategy.id === 'market_maker' ? '3.12' : '2.84',
              drawdown: selectedStrategy.id === 'market_maker' ? '-2.8%' : '-4.2%',
              winRate: selectedStrategy.id === 'market_maker' ? '74.2%' : '68.5%',
              totalTrades: selectedStrategy.id === 'market_maker' ? '1,420' : '542',
              latency: selectedStrategy.latency
            });
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#0A0F1C] to-[#04060C] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Visual Accent top border */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0057FF] via-[#F9B233] to-[#00C853]" />

      {/* Institutional Top Control Bar */}
      <div className="p-6 border-b border-white/10 bg-white/[0.01] flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0057FF]/20 to-[#00C853]/10 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(0,87,255,0.15)]">
            <Radio className="w-6 h-6 text-[#00C853] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold tracking-tight text-xl">Nautilus Algorithmic Engine</span>
              <span className="bg-[#00C853]/10 border border-[#00C853]/30 px-2 py-0.5 rounded text-[10px] text-[#00C853] font-mono font-bold uppercase">RUST CORE</span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">Institutional-grade multi-venue high-frequency algorithmic engine.</p>
          </div>
        </div>

        {/* Engine Telemetry Metrics */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-2xl text-xs font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#F9B233]" />
            <span className="text-zinc-500">Latency:</span>
            <span className="text-[#00C853] font-bold">410ns</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#0057FF]" />
            <span className="text-zinc-500">Venue Sync:</span>
            <span className="text-emerald-400 font-bold">STABLE</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-500">Memory:</span>
            <span className="text-zinc-300 font-bold">142MB</span>
          </div>
        </div>
      </div>

      {/* Premium Tab Bar */}
      <div className="flex border-b border-white/5 bg-black/30 p-1">
        {[
          { id: 'ovex_rfq', label: 'OVEX OTC & RFQ Mesh', icon: Zap },
          { id: 'nautilus_strategies', label: 'Strategies Console', icon: Settings2 },
          { id: 'nautilus_backtest', label: 'Backtesting Lab', icon: BarChart3 },
          { id: 'ai_recommendations', label: 'AI Signal Router', icon: Activity },
          { id: 'nautilus_venue', label: 'Venue Connectors', icon: Server }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              playSoundEffect('click');
              setActiveTab(tab.id as any);
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-[#FFFFFF] text-white bg-white/[0.02]' 
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.01]'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#FFFFFF]' : 'text-zinc-400'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 0: OVEX OTC & RFQ Mesh */}
          {activeTab === 'ovex_rfq' && (
            <motion.div
              key="ovex_rfq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <OvexRfqTrading />
            </motion.div>
          )}

          {/* TAB 1: Nautilus Strategies Console */}
          {activeTab === 'nautilus_strategies' && (
            <motion.div
              key="strategies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Side: Strategy Cards */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest font-mono">Select Algorithmic Strategy</h3>
                    <span className="text-xs text-zinc-500 font-mono">3 Registered Strategies</span>
                  </div>

                  {strategies.map((strat) => {
                    const isRunning = strat.status === 'Running';
                    const isSelected = selectedStrategy.id === strat.id;
                    return (
                      <div
                        key={strat.id}
                        onClick={() => setSelectedStrategy(strat)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected 
                            ? 'bg-white/[0.04] border-[#00C853]/40 shadow-[0_0_20px_rgba(0,200,83,0.05)]' 
                            : 'bg-white/[0.01] border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className={`absolute top-0 left-0 w-1 h-full ${isRunning ? 'bg-[#00C853]' : 'bg-zinc-600'}`} />
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pl-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-bold text-white tracking-tight">{strat.name}</h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                                isRunning ? 'bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20' : 'bg-white/5 text-zinc-400 border border-white/10'
                              }`}>
                                {strat.status}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 max-w-lg">{strat.description}</p>
                          </div>

                          {/* Quick Performance Metrics */}
                          <div className="flex items-center gap-4 sm:text-right font-mono">
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase">Latency</span>
                              <p className="text-xs font-bold text-zinc-300">{strat.latency}</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase">Net Profit</span>
                              <p className={`text-xs font-bold ${isRunning ? 'text-[#00C853]' : 'text-zinc-500'}`}>{strat.profit}</p>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Footer controls */}
                        <div className="mt-4 pt-4 border-t border-white/[0.03] pl-3 flex justify-between items-center">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Venue: <strong className="text-zinc-300">{strat.venue}</strong></span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStrategy(strat.id);
                            }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
                              isRunning 
                                ? 'bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 text-[#FF3B3B] border border-[#FF3B3B]/20' 
                                : 'bg-[#00C853]/10 hover:bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/20'
                            }`}
                          >
                            {isRunning ? (
                              <>
                                <Square className="w-3.5 h-3.5 fill-current" />
                                <span>Stop Bot</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Execute Bot</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side: Strategy Parameters & Metrics Configuration */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Settings2 className="w-5 h-5 text-[#F9B233]" />
                      <h4 className="font-extrabold text-white uppercase text-xs font-mono tracking-widest">Bot Parameters</h4>
                    </div>
                    
                    <p className="text-xs text-zinc-400 mb-6 font-mono leading-relaxed">
                      Configuring parameters for <strong className="text-[#F9B233]">{selectedStrategy.name}</strong> core strategy. These affect trade sizing, trigger threshold and slippage tolerance.
                    </p>

                    <div className="space-y-6">
                      {Object.entries(selectedStrategy.parameters).map(([key, val]) => (
                        <div key={key} className="space-y-2 font-mono">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-400 uppercase">{key.replace('_', ' ')}</span>
                            <span className="text-white font-bold">{val}</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full relative overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#0057FF] to-[#00C853]" style={{ width: '65%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2 font-mono text-[11px] text-zinc-500">
                      <div className="flex justify-between">
                        <span>Engine Version:</span>
                        <span className="text-zinc-300">v2.8.4-stable</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compiler Optimization:</span>
                        <span className="text-[#00C853] font-bold">LTO-ENABLED</span>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-[#00C853] hover:bg-[#00C853]/90 text-black font-extrabold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg shadow-[#00C853]/20 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Save Configuration
                    </button>
                  </div>
                </div>

              </div>

              {/* Realtime Terminal Execution Console */}
              <div className="bg-[#04060C] border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col h-72">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#00C853]" />
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-widest">Nautilus Core Execution logs</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                    <span>ENGINE CONNECTED</span>
                  </div>
                </div>

                <div 
                  ref={logContainerRef}
                  className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs text-zinc-400 select-text selection:bg-[#00C853]/30"
                >
                  {logLines.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed tracking-tight break-all">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Nautilus Backtesting Lab */}
          {activeTab === 'nautilus_backtest' && (
            <motion.div
              key="backtesting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left controls */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-[#0057FF]" />
                      <h3 className="font-extrabold text-white uppercase text-xs font-mono tracking-widest">Backtest Parameters</h3>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">Validate performance using historical tick records of the AfriQuant Exchange.</p>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-2">
                      <span className="text-zinc-500 uppercase block">Selected Strategy</span>
                      <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white font-bold flex justify-between items-center">
                        <span>{selectedStrategy.name}</span>
                        <Settings2 className="w-4 h-4 text-zinc-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-zinc-500 uppercase block">Historical Asset</span>
                      <select className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white font-bold focus:outline-none">
                        <option value="AFQ">AFQ - AfriQuant Holdings</option>
                        <option value="PAYST">PAYST - Paystack Inc.</option>
                        <option value="FLW">FLW - Flutterwave Ltd</option>
                        <option value="JUM">JUM - Jumia Group</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-zinc-500 uppercase block">Simulation Range</span>
                      <select className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white font-bold focus:outline-none">
                        <option value="1M">Past Month (30 Days)</option>
                        <option value="3M">Past Quarter (90 Days)</option>
                        <option value="1Y">Past Year (365 Days)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-zinc-500 uppercase block">Initial Margin Capital</span>
                      <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white font-bold flex items-center justify-between">
                        <span>R10,000.00</span>
                        <DollarSign className="w-4 h-4 text-zinc-400" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    {isBacktesting ? (
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-mono text-zinc-400">
                          <span>Simulating historical ticks...</span>
                          <span className="font-bold text-[#00C853]">{backtestProgress}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#0057FF] to-[#00C853] h-full transition-all duration-150 ease-out"
                            style={{ width: `${backtestProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={runBacktest}
                        className="w-full py-4 bg-[#0057FF] hover:bg-[#0057FF]/90 text-white rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-lg shadow-[#0057FF]/20 flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-5 h-5 animate-pulse" />
                        <span>Run Backtesting Suite</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right display & performance analysis charts */}
                <div className="lg:col-span-2 space-y-6">
                  {backtestCompleted && backtestResults ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {/* Backtesting KPI Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-1 font-mono">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Backtest Net Profit</span>
                          <p className="text-xl font-bold text-[#00C853]">{backtestResults.profit}</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-1 font-mono">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Sharpe Ratio</span>
                          <p className="text-xl font-bold text-white">{backtestResults.sharpe}</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-1 font-mono">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Max Drawdown</span>
                          <p className="text-xl font-bold text-[#FF3B3B]">{backtestResults.drawdown}</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-1 font-mono">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Win Rate</span>
                          <p className="text-xl font-bold text-white">{backtestResults.winRate}</p>
                        </div>
                      </div>

                      {/* Equity Curve Area Chart */}
                      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#00C853]" />
                            Equity Growth Curve (Nautilus Engine Output)
                          </h4>
                          <span className="text-xs text-zinc-500 font-mono">{backtestResults.totalTrades} Executions simulated</span>
                        </div>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={BACKTEST_CURVES[selectedStrategy.id] || BACKTEST_CURVES.ema_cross}>
                              <defs>
                                <linearGradient id="backtestColor" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#00C853" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="step" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={['dataMin - 500', 'dataMax + 500']} />
                              <Tooltip contentStyle={{ backgroundColor: '#0A0F1C', borderColor: 'rgba(255,255,255,0.1)' }} />
                              <Area type="monotone" dataKey="value" stroke="#00C853" strokeWidth={2} fillOpacity={1} fill="url(#backtestColor)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-12 text-center space-y-3 min-h-[350px]">
                      <BarChart3 className="w-12 h-12 text-zinc-600 animate-pulse" />
                      <div>
                        <h4 className="text-base font-bold text-zinc-400">Backtesting Not Executed Yet</h4>
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">Configure parameters and run the Nautilus simulation engine to review performance analytics.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: Original AI Signal Router */}
          {activeTab === 'ai_recommendations' && (
            <motion.div
              key="ai_signals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <Loader2 className="w-8 h-8 text-[#00C853] animate-spin" />
                  <p className="text-zinc-400 text-sm font-mono uppercase tracking-wider">Generating high-fidelity trading signals...</p>
                </div>
              ) : aiData ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest font-mono">AI Recommended Executions</h3>
                    <span className="text-xs text-zinc-500 font-mono">Routing through Smart Router</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiData.recommendations?.map((trade: any, idx: number) => {
                      const isBuy = trade.action === 'BUY';
                      const colorClass = isBuy ? 'text-[#00C896]' : 'text-[#FF3B3B]';
                      const borderClass = isBuy ? 'border-[#00C896]/20' : 'border-[#FF3B3B]/20';
                      const solidBgClass = isBuy ? 'bg-[#00C896]' : 'bg-[#FF3B3B]';

                      return (
                        <div key={idx} className={`p-5 rounded-2xl bg-white/[0.01] border ${borderClass} hover:bg-white/[0.03] transition-all relative overflow-hidden group`}>
                          <div className={`absolute top-0 left-0 w-1.5 h-full ${solidBgClass}`} />
                          <div className="flex justify-between items-start mb-4 pl-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${colorClass}`}>{trade.action}</span>
                                <span className="text-white font-bold text-lg">{trade.asset}</span>
                              </div>
                              <p className="text-xs text-zinc-500 mt-1">{trade.name}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-white">{trade.quantity}</div>
                              <div className="text-xs text-zinc-400">{trade.price}</div>
                            </div>
                          </div>
                          <div className="pl-3 mb-4">
                            <p className="text-xs text-zinc-300 italic">"{trade.reason}"</p>
                          </div>
                          <div className="flex items-center justify-between pl-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#0057FF]" /> AI Confidence: {trade.confidence}
                            </span>
                            <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              isBuy ? 'bg-[#00C896]/20 text-[#00C896] hover:bg-[#00C896]/30' : 'bg-[#FF3B3B]/20 text-[#FF3B3B] hover:bg-[#FF3B3B]/30'
                            }`}>
                              One-Click {trade.action}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Smart Routing logs */}
                  <div className="p-6 rounded-2xl bg-black/20 border border-white/5">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      Smart Router Execution Status
                    </h3>
                    <div className="space-y-4 font-mono text-xs">
                      {aiData.executions?.map((exec: any, idx: number) => {
                        const isFilled = exec.status === 'Filled';
                        const statusColor = isFilled ? 'text-[#00C896]' : 'text-[#FFFFFF]';
                        
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-colors">
                            <div className="flex items-center gap-4">
                              <span className="text-zinc-500">{exec.time}</span>
                              <div>
                                <div className="text-sm font-bold text-white">{exec.action}</div>
                                <div className="text-xs text-zinc-400 flex items-center gap-1">
                                  <ArrowRightLeft className="w-3 h-3" /> {exec.route}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-bold uppercase tracking-wider ${statusColor}`}>{exec.status}</span>
                              <div className="text-sm font-medium text-white">{exec.price}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <AlertTriangle className="w-8 h-8 text-[#FF3B3B]" />
                  <p className="text-zinc-400 text-sm">Failed to generate intelligence signals.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Venue Connectors */}
          {activeTab === 'nautilus_venue' && (
            <motion.div
              key="venues"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'AfriQuant Clearing (AQX)', type: 'Primary Venue', status: 'Connected', latency: '410ns', pairs: '14 Active', color: '#00C853' },
                  { name: 'Nairobi Stock Exchange (NSE)', type: 'Inter-liquidity Bridge', status: 'Connected', latency: '38µs', pairs: '8 Active', color: '#0057FF' },
                  { name: 'Johannesburg Stock Exchange (JSE)', type: 'Inter-liquidity Bridge', status: 'Connected', latency: '42µs', pairs: '11 Active', color: '#F9B233' }
                ].map((venue, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-48">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/[0.02] rounded-full pointer-events-none" />
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{venue.type}</span>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#00C853] font-bold">
                          <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                          <span>CONNECTED</span>
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-white tracking-tight">{venue.name}</h4>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5 font-mono text-xs text-zinc-400">
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase block">Active Pairs</span>
                        <span className="text-zinc-200 font-bold">{venue.pairs}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 uppercase block">Clearing Latency</span>
                        <span className="font-bold" style={{ color: venue.color }}>{venue.latency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Cache Sync Diagnostics */}
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    Security Master & Cache Sync status
                  </h4>
                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono uppercase font-bold text-white rounded-lg flex items-center gap-1.5 transition-all">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Resync Cache
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                  <div className="bg-black/30 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 block">CACHED SECURITIES</span>
                    <span className="text-lg font-extrabold text-white">2,842</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 block">ORDERBOOKS IN MEMORY</span>
                    <span className="text-lg font-extrabold text-white">45 LOBs</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 block">CACHE INTEGRITY</span>
                    <span className="text-lg font-extrabold text-[#00C853]">99.99%</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 block">GC OVERHEAD</span>
                    <span className="text-lg font-extrabold text-[#00C853]">0.12ms</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
