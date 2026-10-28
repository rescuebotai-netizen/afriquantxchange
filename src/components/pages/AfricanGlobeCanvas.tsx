import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const AFRICAN_HUBS = [
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, x: 48, y: 52, index: '+14.2%', aum: '$12.4B' },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, x: 62, y: 82, index: '+9.8%', aum: '$18.1B' },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lng: 36.8219, x: 70, y: 56, index: '+11.5%', aum: '$5.4B' },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, x: 65, y: 28, index: '+18.0%', aum: '$8.2B' },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898, x: 34, y: 26, index: '+8.4%', aum: '$4.1B' },
];

export function AfricanGlobeCanvas() {
  const [activeHub, setActiveHub] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHub((prev) => (prev + 1) % AFRICAN_HUBS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center p-4">
      
      {/* Outer Orbit Rings */}
      <div className="absolute inset-0 rounded-full border border-dashed border-gray-300/60 animate-spin-slow pointer-events-none" />
      <div className="absolute inset-8 rounded-full border border-gray-200/50 pointer-events-none" />
      <div className="absolute inset-16 rounded-full bg-radial from-[#00C805]/10 via-[#D5FF2F]/5 to-transparent blur-2xl pointer-events-none" />

      {/* Futuristic Vector Globe Sphere */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full relative z-10 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
      >
        <defs>
          <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F5F5F7" />
            <stop offset="100%" stopColor="#E5E7EB" />
          </radialGradient>
          <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C805" />
            <stop offset="100%" stopColor="#D5FF2F" />
          </linearGradient>
        </defs>

        {/* Globe Base Sphere */}
        <circle cx="200" cy="200" r="160" fill="url(#globeGrad)" stroke="#E5E7EB" strokeWidth="2" />

        {/* Latitude Lines */}
        {[80, 120, 160, 200, 240, 280, 320].map((y, idx) => (
          <ellipse 
            key={idx} 
            cx="200" 
            cy={y} 
            rx={Math.sqrt(Math.max(0, 160 * 160 - (y - 200) * (y - 200)))} 
            ry={Math.sqrt(Math.max(0, 160 * 160 - (y - 200) * (y - 200))) * 0.3} 
            fill="none" 
            stroke="rgba(0,0,0,0.06)" 
            strokeWidth="1" 
          />
        ))}

        {/* Longitude Lines */}
        {[80, 120, 160, 200, 240, 280, 320].map((x, idx) => (
          <ellipse 
            key={idx} 
            cx={x} 
            cy="200" 
            rx={Math.sqrt(Math.max(0, 160 * 160 - (x - 200) * (x - 200))) * 0.3} 
            ry={Math.sqrt(Math.max(0, 160 * 160 - (x - 200) * (x - 200)))} 
            fill="none" 
            stroke="rgba(0,0,0,0.06)" 
            strokeWidth="1" 
          />
        ))}

        {/* Simplified Vector Contour of Africa */}
        <path
          d="M 175,90 C 220,95 240,130 220,160 C 240,175 250,210 230,250 C 210,290 190,300 170,270 C 150,250 145,210 160,180 C 140,160 135,120 175,90 Z"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />

        {/* Connecting Flight/Financial Liquidity Arcs */}
        <path 
          d="M 190,200 Q 210,140 240,170" 
          fill="none" 
          stroke="url(#glowLine)" 
          strokeWidth="2" 
          strokeDasharray="4 4"
        />
        <path 
          d="M 190,200 Q 230,260 210,290" 
          fill="none" 
          stroke="url(#glowLine)" 
          strokeWidth="2" 
          strokeDasharray="4 4"
        />

        {/* Interactive Hub Markers */}
        {AFRICAN_HUBS.map((hub, idx) => {
          const cx = 200 + (hub.x - 50) * 2.5;
          const cy = 200 + (hub.y - 50) * 2.5;
          const isSelected = activeHub === idx;

          return (
            <g key={idx} className="cursor-pointer" onClick={() => setActiveHub(idx)}>
              {/* Outer Pulse Ring */}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? "14" : "8"}
                className={isSelected ? "fill-[#00C805]/20 animate-ping" : "fill-transparent"}
              />
              {/* Core Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? "6" : "4"}
                fill={isSelected ? "#00C805" : "#1A1A1A"}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Active Node Badge */}
      <motion.div 
        key={activeHub}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black text-white p-4 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-4 min-w-[260px]"
      >
        <div className="w-10 h-10 rounded-xl bg-[#D5FF2F] text-black font-extrabold flex items-center justify-center font-mono text-sm shrink-0">
          {AFRICAN_HUBS[activeHub].name.substring(0, 3).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">{AFRICAN_HUBS[activeHub].name}</span>
            <span className="text-[10px] font-mono text-[#00C805] font-bold">{AFRICAN_HUBS[activeHub].index}</span>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            {AFRICAN_HUBS[activeHub].country} • {AFRICAN_HUBS[activeHub].aum} AUM
          </p>
        </div>
      </motion.div>

    </div>
  );
}
