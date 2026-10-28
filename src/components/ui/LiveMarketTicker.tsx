import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  category: 'FOREX' | 'EQUITY' | 'EUROBOND' | 'PRE-IPO';
}

const LIVE_MARKET_DATA: TickerItem[] = [
  { symbol: 'USD/NGN', name: 'Nigerian Naira', price: '1,480.50', change: '+1.12%', isPositive: true, category: 'FOREX' },
  { symbol: 'FLW.PRE', name: 'Flutterwave Pre-IPO', price: '$3.20B', change: '+4.85%', isPositive: true, category: 'PRE-IPO' },
  { symbol: 'JSE:TOP40', name: 'JSE Top 40 SA', price: '78,420.10', change: '+0.78%', isPositive: true, category: 'EQUITY' },
  { symbol: 'NGX:ASI', name: 'NGX All-Share', price: '102,150.30', change: '+1.45%', isPositive: true, category: 'EQUITY' },
  { symbol: 'NG-2038', name: 'Nigeria Eurobond 7.875%', price: '88.45', change: '-0.24%', isPositive: false, category: 'EUROBOND' },
  { symbol: 'MNP.PRE', name: 'Moniepoint Pre-IPO', price: '$1.05B', change: '+3.40%', isPositive: true, category: 'PRE-IPO' },
  { symbol: 'USD/ZAR', name: 'South African Rand', price: '18.24', change: '-0.42%', isPositive: false, category: 'FOREX' },
  { symbol: 'AQX-PA50', name: 'Pan-Africa 50 Index', price: '3,842.60', change: '+2.15%', isPositive: true, category: 'EQUITY' },
  { symbol: 'NSE:20', name: 'Nairobi NSE 20', price: '1,754.10', change: '+0.35%', isPositive: true, category: 'EQUITY' },
  { symbol: 'GH-2032', name: 'Ghana Eurobond 8.125%', price: '76.20', change: '+1.05%', isPositive: true, category: 'EUROBOND' },
];

export function LiveMarketTicker({ className = '' }: { className?: string }) {
  const tickerLoop = [...LIVE_MARKET_DATA, ...LIVE_MARKET_DATA];

  return (
    <div className={`w-full bg-[#0A0A0A] border-y border-white/[0.08] py-2.5 overflow-hidden relative ${className}`}>
      
      {/* Edge Fade Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      <div className="flex items-center">
        
        {/* Fixed Left Live Badge */}
        <div className="shrink-0 pl-6 pr-4 flex items-center gap-2 border-r border-white/10 z-20 bg-[#0A0A0A]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="font-mono text-[11px] font-bold tracking-wider text-white uppercase flex items-center gap-1">
            <span>LIVE</span>
            <span className="text-[#10B981]">MARKETS</span>
          </span>
        </div>

        {/* Infinite Framer Motion Scrolling Container */}
        <div className="flex overflow-hidden select-none">
          <motion.div
            className="flex items-center gap-5 whitespace-nowrap pl-6"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 32,
            }}
          >
            {tickerLoop.map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors group cursor-pointer"
              >
                {/* Category Badge */}
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  item.category === 'PRE-IPO' ? 'bg-[#7C4DFF]/20 text-[#A78BFA]' :
                  item.category === 'FOREX' ? 'bg-[#0666EB]/20 text-[#60A5FA]' :
                  item.category === 'EUROBOND' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {item.category}
                </span>

                <span className="font-mono font-bold text-xs text-white group-hover:text-blue-300 transition-colors">
                  {item.symbol}
                </span>

                <span className="font-mono text-xs text-zinc-300">
                  {item.price}
                </span>

                <span className={`inline-flex items-center text-xs font-mono font-bold ${
                  item.isPositive ? 'text-[#10B981]' : 'text-red-400'
                }`}>
                  {item.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {item.change}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
