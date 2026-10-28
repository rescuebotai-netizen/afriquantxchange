import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Target, 
  Info,
  Calendar,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot
} from 'recharts';

interface PerformanceAnalyticsProps {
  setActiveTab: (tab: string) => void;
  initialRange?: string;
}

// Generate some dummy data for different ranges
const generateData = (points: number, startValue: number, volatility: number, trend: number) => {
  let value = startValue;
  let netInvest = startValue * 0.9;
  return Array.from({ length: points }).map((_, i) => {
    value = value * (1 + (Math.random() - 0.5) * volatility + trend);
    if (i % Math.floor(points / 4) === 0) {
      netInvest += 5000; // Simulate periodic investments
    }
    return {
      name: `Point ${i}`,
      date: new Date(Date.now() - (points - i) * 86400000).toLocaleDateString(),
      value: Math.round(value),
      netInvestment: Math.round(netInvest),
      benchmark: Math.round(startValue * Math.pow(1 + trend * 0.8, i)),
    };
  });
};

const dataSets = {
  '1M': generateData(30, 120000, 0.02, 0.001),
  '3M': generateData(90, 110000, 0.03, 0.0015),
  '6M': generateData(180, 90000, 0.04, 0.002),
  '1Y': generateData(365, 70000, 0.05, 0.001),
  'ALL': generateData(730, 50000, 0.06, 0.0015),
};

const events = [
  { index: 15, label: 'Dividend', type: 'dividend' },
  { index: 45, label: 'Market Shift', type: 'market' },
  { index: 75, label: 'Investment', type: 'investment' },
];

export function PerformanceAnalytics({ setActiveTab, initialRange = '6M' }: PerformanceAnalyticsProps) {
  const [range, setRange] = useState(initialRange);
  const [isLoading, setIsLoading] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const data = dataSets[range as keyof typeof dataSets] || dataSets['6M'];

  // Calculate metrics based on current data
  const metrics = useMemo(() => {
    const start = data[0];
    const end = data[data.length - 1];
    const profitLoss = end.value - end.netInvestment;
    const roi = (profitLoss / end.netInvestment) * 100;
    const isPositive = profitLoss >= 0;
    
    return {
      currentValue: end.value,
      netInvestment: end.netInvestment,
      profitLoss,
      roi,
      isPositive,
      volatility: (Math.random() * 5 + 10).toFixed(1) // Simulated volatility index
    };
  }, [data]);

  // Simulate loading state on range change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [range]);

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    setSelectedPoint(null);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[200px]">
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">{payload[0].payload.date}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFFFFF]" /> Total Value
              </span>
              <span className="text-sm font-bold text-white">${payload[0].value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0066FF]" /> Net Invested
              </span>
              <span className="text-sm font-bold text-zinc-300">${payload[1].value.toLocaleString()}</span>
            </div>
            {showBenchmark && payload[2] && (
              <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                <span className="text-sm text-zinc-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-500" /> Benchmark
                </span>
                <span className="text-sm font-bold text-zinc-400">${payload[2].value.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Sticky Time Filters */}
      <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl pt-4 pb-6 -mx-6 px-6 md:-mx-8 md:px-8 border-b border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Portfolio Performance</h1>
              <p className="text-zinc-400 text-sm">Total Value vs Net Investment across time and market conditions</p>
            </div>
          </div>

          <div className="flex bg-[#0A0A0A] p-1.5 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            {['1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
              <button 
                key={period}
                onClick={() => handleRangeChange(period)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  range === period 
                    ? 'bg-white/10 text-white shadow-sm scale-105' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Core Metrics Overlay */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Value</p>
          <h3 className="text-2xl font-bold text-white">${metrics.currentValue.toLocaleString()}</h3>
        </div>
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Net Investment</p>
          <h3 className="text-2xl font-bold text-zinc-300">${metrics.netInvestment.toLocaleString()}</h3>
        </div>
        <div className={`bg-gradient-to-br ${metrics.isPositive ? 'from-[#00C896]/10 to-[#0A0A0A]' : 'from-[#FF3B3B]/10 to-[#0A0A0A]'} border ${metrics.isPositive ? 'border-[#00C896]/20' : 'border-[#FF3B3B]/20'} rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${metrics.isPositive ? 'text-[#00C896]/70' : 'text-[#FF3B3B]/70'}`}>Profit / Loss</p>
          <div className="flex items-end gap-3">
            <h3 className={`text-2xl font-bold ${metrics.isPositive ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
              {metrics.isPositive ? '+' : '-'}${Math.abs(metrics.profitLoss).toLocaleString()}
            </h3>
            <span className={`text-sm font-bold mb-1 ${metrics.isPositive ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
              ({metrics.roi.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Volatility Index</p>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FFFFFF]" />
            <h3 className="text-2xl font-bold text-white">{metrics.volatility}</h3>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* AI Insight Layer */}
        <div className="absolute top-6 left-6 right-6 md:right-auto md:max-w-md z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-[#0066FF]/20 to-[#FFFFFF]/10 border border-[#0066FF]/30 backdrop-blur-md rounded-2xl p-4 shadow-[0_0_20px_rgba(0,102,255,0.15)]"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#0066FF]/90 leading-relaxed font-medium">
                  {metrics.isPositive 
                    ? `Your portfolio outperformed your net investment by ${metrics.roi.toFixed(1)}% over ${range}.`
                    : `Drawdown detected in the selected period due to broader market volatility.`}
                </p>
                <button className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF] hover:text-[#0044AA] mt-2 transition-colors">
                  Analyze Drivers
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benchmark Toggle */}
        <div className="absolute top-6 right-6 z-10 hidden md:block">
          <button 
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border ${
              showBenchmark 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-black/40 border-white/10 text-zinc-500 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            AQX Tech Index
          </button>
        </div>

        {/* Chart Area */}
        <div className="h-[500px] w-full mt-24 md:mt-16 relative">
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-[#0A0A0A]/80 backdrop-blur-sm"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider animate-pulse">Recalculating...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data} 
              margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
              onClick={(e: any) => {
                if (e && e.activePayload) {
                  setSelectedPoint(e.activePayload[0].payload);
                }
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metrics.isPositive ? "#FFFFFF" : "#ef4444"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={metrics.isPositive ? "#FFFFFF" : "#ef4444"} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#ffffff40" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10} 
                minTickGap={50}
                className="font-mono" 
              />
              <YAxis 
                stroke="#ffffff40" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} 
                dx={-10} 
                className="font-mono" 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }} />
              
              {showBenchmark && (
                <Area 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#888888" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  fill="none" 
                  isAnimationActive={!isLoading}
                />
              )}
              
              <Area 
                type="stepAfter" 
                dataKey="netInvestment" 
                stroke="#0066FF" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorInvest)" 
                isAnimationActive={!isLoading}
              />
              
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={metrics.isPositive ? "#FFFFFF" : "#ef4444"} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                isAnimationActive={!isLoading}
              />

              {/* Event Markers */}
              {events.map((event, i) => {
                const point = data[event.index];
                if (!point) return null;
                return (
                  <ReferenceDot 
                    key={i} 
                    x={point.date} 
                    y={point.value} 
                    r={4} 
                    fill="#0A0A0A" 
                    stroke="#fff" 
                    strokeWidth={2} 
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drill-Down Panel (Shows when a point is clicked) */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            className="bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0066FF]" />
                Snapshot: {selectedPoint.date}
              </h3>
              <button 
                onClick={() => setSelectedPoint(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Composition</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Naspers</span>
                    <span className="text-sm font-bold text-[#00FFB2]">42%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-[#00FFB2] h-full rounded-full w-[42%]" /></div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-white">Standard Bank</span>
                    <span className="text-sm font-bold text-[#0066FF]">35%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-[#0066FF] h-full rounded-full w-[35%]" /></div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-white">Cash</span>
                    <span className="text-sm font-bold text-zinc-400">23%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-zinc-500 h-full rounded-full w-[23%]" /></div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Movement Drivers</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#FFFFFF] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white mb-2">Capital Efficiency Improved</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Your capital efficiency improved by 22% around this date, driven by Technology exposure and strategic exits in FLW shares. The market index remained relatively flat during this period.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
