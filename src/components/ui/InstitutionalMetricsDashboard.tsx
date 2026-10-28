import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, TrendingUp, ShieldCheck, Activity, Globe, Zap } from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  value: number;
  format: 'currency' | 'compact' | 'int' | 'ms' | 'count';
  prefix?: string;
  suffix?: string;
  delta?: string;
  subtext: string;
}

const INSTITUTIONAL_METRICS: MetricItem[] = [
  {
    id: 'aua',
    label: 'Total Assets Under Administration',
    value: 42850000000,
    format: 'currency',
    prefix: '$',
    suffix: 'B',
    delta: '+18.4% YoY',
    subtext: 'Across 14 Pan-African member exchanges'
  },
  {
    id: 'pathways',
    label: 'Capital Pathways Opened',
    value: 128,
    format: 'int',
    delta: '+34 this quarter',
    subtext: 'Direct liquidity corridors between GCC, UK & Africa'
  },
  {
    id: 'sme_vol',
    label: 'SME & Corporate Investment Volume',
    value: 3150000000,
    format: 'currency',
    prefix: '$',
    suffix: 'B',
    delta: '+26.8% YoY',
    subtext: 'Directly routed to high-growth African enterprises'
  },
  {
    id: 'velocity',
    label: 'Average Settlement Velocity',
    value: 410,
    format: 'ms',
    suffix: 'ms',
    delta: 'T+0 Real-Time',
    subtext: 'Direct clearing via sub-millisecond FIX protocol'
  }
];

export function InstitutionalMetricsDashboard() {
  const [clock, setClock] = useState('00:00:00 UTC');
  const [metrics, setMetrics] = useState<{ [key: string]: number }>({
    aua: 42.85,
    pathways: 128,
    sme_vol: 3.15,
    velocity: 410
  });
  const [flashingKey, setFlashingKey] = useState<string | null>(null);

  // Live UTC Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live simulated micro-ticks
  useEffect(() => {
    const interval = setInterval(() => {
      const keys = ['aua', 'pathways', 'sme_vol', 'velocity'];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];

      setMetrics(prev => {
        if (randomKey === 'aua') {
          const delta = (Math.random() * 0.04 - 0.01);
          return { ...prev, aua: Number((prev.aua + delta).toFixed(2)) };
        } else if (randomKey === 'sme_vol') {
          const delta = (Math.random() * 0.02 - 0.005);
          return { ...prev, sme_vol: Number((prev.sme_vol + delta).toFixed(2)) };
        } else if (randomKey === 'velocity') {
          const delta = Math.floor(Math.random() * 10 - 5);
          return { ...prev, velocity: Math.max(380, Math.min(430, prev.velocity + delta)) };
        } else {
          return prev;
        }
      });

      setFlashingKey(randomKey);
      setTimeout(() => setFlashingKey(null), 800);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-12">
      
      {/* Top Status & Telemetry Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A87E] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34A87E]" />
          </span>
          <span className="font-mono text-xs font-bold text-[#34A87E] tracking-widest uppercase">
            INSTITUTIONAL CLEARING HOUSE TELEMETRY
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-[#F4F1E8]/50">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A94E]" />
            <span>14 Bourses Online</span>
          </div>
          <div>{clock}</div>
        </div>
      </div>

      {/* Metrics Row: Clean Minimal Data-First Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {INSTITUTIONAL_METRICS.map(item => {
          let displayValue = '';
          if (item.id === 'aua') displayValue = `$${metrics.aua}B`;
          else if (item.id === 'sme_vol') displayValue = `$${metrics.sme_vol}B`;
          else if (item.id === 'pathways') displayValue = `${metrics.pathways}`;
          else if (item.id === 'velocity') displayValue = `${metrics.velocity}ms`;

          const isFlashing = flashingKey === item.id;

          return (
            <div 
              key={item.id}
              className={`space-y-3 transition-all duration-500 pb-6 border-b sm:border-b-0 sm:border-r border-white/[0.06] last:border-r-0 ${
                isFlashing ? 'opacity-100 scale-[1.02]' : 'opacity-90'
              }`}
            >
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#F4F1E8]/50">
                {item.label}
              </div>

              <div className="flex items-baseline gap-2">
                <div className={`text-4xl lg:text-5xl font-extrabold text-[#F4F1E8] font-mono tracking-tight transition-colors duration-300 ${
                  isFlashing ? 'text-[#D9A94E]' : ''
                }`}>
                  {displayValue}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#34A87E] font-bold">{item.delta}</span>
              </div>

              <p className="text-xs text-[#F4F1E8]/40 leading-relaxed font-sans pt-1">
                {item.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Secondary Real-time Flow Stream Indicator */}
      <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono text-[#F4F1E8]/60">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-[#D9A94E] shrink-0" />
          <span>Daily Matching Engine Capacity: 1.4B messages/sec</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-[#34A87E] shrink-0" />
          <span>Zero Counterparty Default Rate: 100.00%</span>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-[#0666EB] shrink-0" />
          <span>Pan-African FX Clearing Corridor: Active T+0</span>
        </div>
      </div>

    </div>
  );
}
