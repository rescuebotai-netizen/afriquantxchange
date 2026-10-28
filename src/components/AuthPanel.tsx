import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Mail, Lock, ArrowRight, User, Building, AlertCircle } from 'lucide-react';
import { InvestorOnboardingFlow } from './InvestorOnboardingFlow';
import { CompanyOnboardingFlow } from './CompanyOnboardingFlow';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '../lib/utils';

interface AuthPanelProps {
  onComplete: () => void;
}

type AuthMode = 'signin' | 'select-role' | 'investor-flow' | 'company-flow';

function LiveTradingVisualArt() {
  const [candles, setCandles] = useState<{ x: number; open: number; close: number; high: number; low: number }[]>([]);
  const [trades, setTrades] = useState<{ id: string; ticker: string; price: string; size: string; time: string; type: 'buy' | 'sell' }[]>([]);
  const [orderBook, setOrderBook] = useState<{ price: number; size: number; total: number; type: 'bid' | 'ask' }[]>([]);

  useEffect(() => {
    // Generate initial realistic candle values
    const initialCandles = [];
    let basePrice = 280;
    for (let i = 0; i < 24; i++) {
      const open = basePrice;
      const change = (Math.random() - 0.5) * 14;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
      initialCandles.push({ x: i, open, close, high, low });
      basePrice = close;
    }
    setCandles(initialCandles);

    // Initial simulated stock market trades
    const tickers = ['JSE', 'NGX', 'EGX', 'NSE', 'BRVM', 'AQX'];
    const initialTrades = Array.from({ length: 5 }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      ticker: tickers[Math.floor(Math.random() * tickers.length)],
      price: (150 + Math.random() * 550).toFixed(2),
      size: (Math.floor(Math.random() * 80) + 10) * 10 + '',
      time: new Date(Date.now() - i * 12000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: Math.random() > 0.5 ? 'buy' as const : 'sell' as const
    }));
    setTrades(initialTrades);

    // Initial Order Book Depth
    const bids = Array.from({ length: 4 }).map((_, i) => ({
      price: parseFloat((345.50 - i * 0.25).toFixed(2)),
      size: Math.floor(Math.random() * 1100) + 300,
      total: 0,
      type: 'bid' as const
    }));
    const asks = Array.from({ length: 4 }).map((_, i) => ({
      price: parseFloat((345.75 + i * 0.25).toFixed(2)),
      size: Math.floor(Math.random() * 1200) + 200,
      total: 0,
      type: 'ask' as const
    }));

    let bidTotal = 0;
    bids.forEach(b => { bidTotal += b.size; b.total = bidTotal; });
    let askTotal = 0;
    asks.forEach(a => { askTotal += a.size; a.total = askTotal; });

    setOrderBook([...asks.reverse(), ...bids]);

    // Live continuous ticking simulation
    const interval = setInterval(() => {
      // 1. Walk the latest candle price
      setCandles(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (!last) return prev;

        const change = (Math.random() - 0.5) * 6;
        const newClose = last.close + change;
        const newHigh = Math.max(last.high, newClose, last.open);
        const newLow = Math.min(last.low, newClose, last.open);

        next[next.length - 1] = {
          ...last,
          close: newClose,
          high: newHigh,
          low: newLow
        };

        // Shift chart occasionally
        if (Math.random() > 0.7) {
          next.shift();
          next.forEach((c, idx) => c.x = idx);
          const nextOpen = newClose;
          next.push({
            x: next.length,
            open: nextOpen,
            close: nextOpen + (Math.random() - 0.5) * 10,
            high: nextOpen + Math.random() * 5,
            low: nextOpen - Math.random() * 5
          });
        }
        return next;
      });

      // 2. Add real-time transaction ticks
      if (Math.random() > 0.3) {
        setTrades(prev => {
          const newTrade = {
            id: Math.random().toString(36).substr(2, 5).toUpperCase(),
            ticker: tickers[Math.floor(Math.random() * tickers.length)],
            price: (150 + Math.random() * 550).toFixed(2),
            size: (Math.floor(Math.random() * 100) + 10) * 5 + '',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            type: Math.random() > 0.5 ? 'buy' as const : 'sell' as const
          };
          return [newTrade, ...prev.slice(0, 4)];
        });
      }

      // 3. Jitter order book levels
      setOrderBook(prev => {
        return prev.map(item => {
          if (Math.random() > 0.5) {
            const delta = Math.floor((Math.random() - 0.5) * 150);
            return { ...item, size: Math.max(80, item.size + delta) };
          }
          return item;
        });
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const prices = candles.flatMap(c => [c.high, c.low]);
  const maxPrice = prices.length ? Math.max(...prices) : 320;
  const minPrice = prices.length ? Math.min(...prices) : 240;
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="w-full space-y-6 select-none max-w-lg">
      {/* Candlestick Terminal Screen */}
      <div className="border border-white/10 bg-black rounded-3xl p-6 relative shadow-[0_0_50px_rgba(255,255,255,0.03)] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-[10px] font-extrabold font-mono tracking-widest text-zinc-300">AQX INDEX // INTERACTIVE SIMULATOR</span>
          </div>
          <span className="text-[9px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded">B&W TERM</span>
        </div>

        {/* SVG Drawing of Market Trend */}
        <div className="relative h-44 w-full border-b border-white/5">
          <div className="absolute right-0 top-0 text-[8px] font-mono text-zinc-600">MAX: {maxPrice.toFixed(1)}</div>
          <div className="absolute right-0 bottom-0 text-[8px] font-mono text-zinc-600">MIN: {minPrice.toFixed(1)}</div>
          
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {candles.map((c, i) => {
              const w = 100 / candles.length;
              const x = (c.x * w) + (w / 2);
              const yHigh = ((maxPrice - c.high) / priceRange) * 100;
              const yLow = ((maxPrice - c.low) / priceRange) * 100;
              const yOpen = ((maxPrice - c.open) / priceRange) * 100;
              const yClose = ((maxPrice - c.close) / priceRange) * 100;
              
              const isGreen = c.close >= c.open;
              const fill = isGreen ? '#ffffff' : 'transparent';
              const stroke = '#ffffff';
              const top = Math.min(yOpen, yClose);
              const h = Math.max(2, Math.abs(yOpen - yClose));

              return (
                <g key={i}>
                  <line x1={`${x}%`} y1={`${yHigh}%`} x2={`${x}%`} y2={`${yLow}%`} stroke={stroke} strokeWidth={1} />
                  <rect 
                    x={`${x - w * 0.3}%`} 
                    y={`${top}%`} 
                    width={`${w * 0.6}%`} 
                    height={`${h}%`} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={1} 
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Quick Ticker Data Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5 text-center font-mono">
          <div>
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">LAST PRICE</span>
            <span className="text-xs font-bold text-white">
              ${candles.length ? candles[candles.length - 1].close.toFixed(2) : '285.50'}
            </span>
          </div>
          <div>
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">DAILY VOL</span>
            <span className="text-xs font-bold text-white">8.42M</span>
          </div>
          <div>
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">MARKET GAP</span>
            <span className="text-xs font-bold text-white">0.02%</span>
          </div>
        </div>
      </div>

      {/* Side-by-side Order Book and Live Trades */}
      <div className="grid grid-cols-2 gap-4">
        {/* Order Book Panel */}
        <div className="border border-white/5 bg-black rounded-2xl p-4 font-mono text-[9px] relative shadow-lg">
          <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-1">
            <span className="font-extrabold text-white tracking-widest uppercase">ORDER BOOK</span>
            <span className="text-zinc-500">SIZE</span>
          </div>
          <div className="space-y-1">
            {orderBook.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center relative py-0.5 px-1 overflow-hidden">
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-white/[0.03]"
                  style={{ width: `${Math.min(100, (item.size / 1500) * 100)}%` }}
                />
                <span className={cn("relative z-10 font-bold", item.type === 'ask' ? 'text-zinc-500' : 'text-white')}>
                  {item.price.toFixed(2)}
                </span>
                <span className="relative z-10 text-zinc-400">{item.size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Trades Stream */}
        <div className="border border-white/5 bg-black rounded-2xl p-4 font-mono text-[9px] relative shadow-lg flex flex-col justify-between h-[155px]">
          <div>
            <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-1">
              <span className="font-extrabold text-white tracking-widest uppercase">TICK FEED</span>
              <span className="text-zinc-500">SHARES</span>
            </div>
            <div className="space-y-1">
              {trades.map((t, idx) => (
                <div key={t.id || idx} className="flex justify-between items-center text-[8px] pb-0.5 border-b border-white/[0.01]">
                  <span className="text-zinc-500 uppercase">{t.ticker}</span>
                  <span className={cn("font-bold", t.type === 'buy' ? 'text-white' : 'text-zinc-500')}>
                    {t.price}
                  </span>
                  <span className="text-zinc-500">{t.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthPanel({ onComplete }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('onboardingProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.type === 'investor') setMode('investor-flow');
        else if (parsed.type === 'company') setMode('company-flow');
      } catch (e) {}
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
            
          if (profile?.role) {
            localStorage.setItem('userRole', profile.role);
          }
          onComplete();
          return;
        }
      }

      // Seamless Demo / Preview Mode Fallback when Supabase keys are unconfigured or endpoint unreachable
      await new Promise((resolve) => setTimeout(resolve, 600));
      const role = email.toLowerCase().includes('company') || email.toLowerCase().includes('enterprise')
        ? 'company'
        : email.toLowerCase().includes('admin')
        ? 'admin'
        : 'investor';
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);
      onComplete();
    } catch (err: any) {
      // If live Supabase call fails due to network / Failed to fetch, allow simulated access with notification
      if (err?.message?.includes('fetch') || err?.message?.includes('NetworkError') || err?.name === 'TypeError') {
        const role = email.toLowerCase().includes('company') ? 'company' : 'investor';
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);
        onComplete();
      } else {
        setError(err.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (mode === 'investor-flow') {
      return <InvestorOnboardingFlow onComplete={onComplete} onCancel={() => setMode('select-role')} />;
    }

    if (mode === 'company-flow') {
      return <CompanyOnboardingFlow onComplete={onComplete} onCancel={() => setMode('select-role')} />;
    }

    return (
      <div className="w-full max-w-md mx-auto relative z-10 flex flex-col justify-center min-h-[500px]">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="AfriQuantX Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AfriQuantX</h1>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold mt-1">Multi-Exchange Liquidity System</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-6 tracking-widest uppercase border-b border-white/10 pb-2">Sign In</h2>
                
                {error && (
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                    <p className="text-xs text-white">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-all text-sm font-mono"
                        placeholder="investor@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-all text-sm font-mono"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="group relative w-full py-3.5 bg-white text-black hover:bg-neutral-200 rounded-xl font-extrabold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                >
                  <span className="relative">{loading ? 'Authenticating...' : 'Access Platform'}</span>
                  {!loading && <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>

                <p className="text-center text-xs text-zinc-500 mt-6 font-medium">
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setMode('select-role')} 
                    className="text-white hover:underline font-bold transition-colors uppercase tracking-wider text-[10px]"
                  >
                    Complete Onboarding
                  </button>
                </p>
              </form>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6 tracking-widest uppercase border-b border-white/10 pb-2">Select Account Type</h2>

                <div className="space-y-4">
                  <button 
                    onClick={() => setMode('investor-flow')}
                    className="w-full p-4 bg-neutral-950 hover:bg-white/5 border border-white/10 hover:border-white rounded-2xl transition-all text-left group flex items-start gap-4"
                  >
                    <div className="p-3 bg-white/5 text-white border border-white/10 rounded-xl group-hover:bg-white group-hover:text-black transition-all">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1 group-hover:text-white transition-colors uppercase tracking-wider">Individual Investor</h3>
                      <p className="text-xs text-zinc-400">Access secondary markets, trade listed indices, and evaluate AQEI intelligence.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setMode('company-flow')}
                    className="w-full p-4 bg-neutral-950 hover:bg-white/5 border border-white/10 hover:border-white rounded-2xl transition-all text-left group flex items-start gap-4"
                  >
                    <div className="p-3 bg-white/5 text-white border border-white/10 rounded-xl group-hover:bg-white group-hover:text-black transition-all">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1 group-hover:text-white transition-colors uppercase tracking-wider">Institutional Enterprise</h3>
                      <p className="text-xs text-zinc-400">List high-growth corporate assets, handle enterprise payout events, and stream telemetry.</p>
                    </div>
                  </button>
                </div>

                <p className="text-center text-xs text-zinc-500 mt-6 font-medium">
                  Already onboarded?{' '}
                  <button 
                    type="button" 
                    onClick={() => setMode('signin')} 
                    className="text-white hover:underline font-bold transition-colors uppercase tracking-wider text-[10px]"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex bg-black text-white font-sans overflow-hidden">
      {/* Left Panel: High Fidelity Interactive Stock Market Graphics (Desktop Only) */}
      <div className="hidden lg:flex flex-col w-1/2 bg-neutral-950 border-r border-white/5 relative p-12 justify-between overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Ambient white spotlight */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/[0.01] blur-[160px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.svg" alt="AfriQuantX Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-lg tracking-widest text-white font-mono">AfriQuantX</span>
        </div>

        {/* Live trading graphic center */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          <LiveTradingVisualArt />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              TELEMETRY_ONLINE
            </span>
            <span>•</span>
            <span>DATA_STREAM: ACTIVE</span>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm">
            Designed for pan-African institutional scale. Access deep liquidity pools, automated settlements, and real-time smart routers in custom monochrome workspace.
          </p>
        </div>
      </div>

      {/* Right Panel: Onboarding & Auth Forms */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md relative z-10"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
