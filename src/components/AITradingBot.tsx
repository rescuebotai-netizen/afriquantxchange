import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Play, Square, Activity, AlertTriangle, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Strategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  assets: string[];
}

export function AITradingBot({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [status, setStatus] = useState<{ isRunning: boolean; strategy: Strategy | null }>({ isRunning: false, strategy: null });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) setUserId(user.id);
        } catch (e) {
          console.warn('Could not get user for AITradingBot:', e);
        }
      }

      await fetchStrategies();
      await fetchStatus();
      setIsLoading(false);
    };
    init();
  }, []);

  const fetchStrategies = async () => {
    try {
      const res = await fetch('/api/bot/strategies');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setStrategies(data.strategies || []);
        } else {
          console.warn("fetchStrategies response is not JSON format");
        }
      } else {
        console.warn(`fetchStrategies HTTP status: ${res.status}`);
      }
    } catch (e) {
      console.warn("Error fetching strategies:", e);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/bot/status');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setStatus(data);
        } else {
          console.warn("fetchStatus response is not JSON format");
        }
      } else {
        console.warn(`fetchStatus HTTP status: ${res.status}`);
      }
    } catch (e) {
      console.warn("Error fetching status:", e);
    }
  };

  const handleStart = async (strategyId: string) => {
    if (!userId) {
      setErrorMsg('You must be logged in to start the bot');
      return;
    }
    setErrorMsg(null);
    setActionLoading(true);
    try {
      const res = await fetch('/api/bot/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, strategyId })
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchStatus();
    } catch (e: any) {
      setErrorMsg(`Error starting bot: ${e.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    setErrorMsg(null);
    setActionLoading(true);
    try {
      const res = await fetch('/api/bot/stop', { method: 'POST' });
      if (!res.ok) throw new Error(await res.text());
      await fetchStatus();
    } catch (e: any) {
      setErrorMsg(`Error stopping bot: ${e.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-6 mt-12 bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-blue-500" />
            AI Trading Bot
          </h2>
          <p className="text-zinc-400 mt-1">Automate your trades using OpenRouter AI and real-time market signals.</p>
          {errorMsg && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {errorMsg}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {status.isRunning ? (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Bot is Running
            </div>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-500" />
              Bot is Stopped
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white">Available Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map(strategy => (
              <div key={strategy.id} className={`p-6 rounded-2xl border transition-all ${status.isRunning && status.strategy?.id === strategy.id ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white">{strategy.name}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase tracking-wider ${
                    strategy.riskLevel === 'high' ? 'bg-red-500/10 text-red-400' :
                    strategy.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {strategy.riskLevel} Risk
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mb-6">{strategy.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {strategy.assets.map(asset => (
                    <span key={asset} className="px-2 py-1 rounded-md bg-black/40 border border-white/5 text-xs text-zinc-300">
                      {asset}
                    </span>
                  ))}
                </div>
                
                {status.isRunning && status.strategy?.id === strategy.id ? (
                  <button 
                    onClick={handleStop}
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Square className="w-5 h-5" />}
                    Stop Trading
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStart(strategy.id)}
                    disabled={status.isRunning || actionLoading}
                    className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  >
                    {actionLoading && status.strategy?.id === strategy.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                    Start Strategy
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Live Execution Log
            </h3>
            <div className="space-y-4">
              {status.isRunning ? (
                <div className="text-sm text-zinc-400">
                  <p className="mb-2">Bot is actively monitoring markets and executing trades based on the <strong className="text-white">{status.strategy?.name}</strong> strategy.</p>
                  <p>Check the <button onClick={() => setActiveTab('activity')} className="text-blue-400 hover:underline">Activity Center</button> to see live trades as they happen.</p>
                </div>
              ) : (
                <div className="text-sm text-zinc-500 text-center py-8">
                  Bot is currently inactive. Select a strategy and click Start to begin automated trading.
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <h3 className="text-lg font-bold text-amber-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Risk Warning
            </h3>
            <p className="text-sm text-amber-200/70">
              Automated trading involves significant risk. The AI bot executes trades automatically based on market conditions. Ensure you have sufficient funds in your USD wallet before starting a strategy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
