import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Smartphone, ShieldCheck, Zap, Sparkles, RefreshCw, 
  Check, Lock, Wifi, Eye, EyeOff, ArrowRight, Layers, Award,
  ChevronRight, Flame, Globe, Coins, Wallet, ArrowUpRight, Cpu
} from 'lucide-react';

export type CardMode = 'physical' | 'virtual' | 'crypto';
type FinishOption = 'obsidian' | 'platinum' | 'gold';

export function MaterializeCardSection({ 
  onNavigateToAuth 
}: { 
  onNavigateToAuth?: () => void;
}) {
  const [cardMode, setCardMode] = useState<CardMode>('physical');
  const [finish, setFinish] = useState<FinishOption>('obsidian');
  const [isAssembling, setIsAssembling] = useState(false);
  const [isSheenActive, setIsSheenActive] = useState(false);
  const [assemblyKey, setAssemblyKey] = useState(0);
  
  // Interactive Virtual & Crypto Card state
  const [showSensitive, setShowSensitive] = useState(false);
  const [isDisposable, setIsDisposable] = useState(false);
  const [dynamicCvv, setDynamicCvv] = useState('842');
  const [cvvCountdown, setCvvCountdown] = useState(54);
  const [selectedCryptoToken, setSelectedCryptoToken] = useState<'USDC' | 'USDT' | 'ETH' | 'BTC' | 'SOL'>('USDC');

  // 3D Tilt Coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic CVV auto-refresh ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCvvCountdown((prev) => {
        if (prev <= 1) {
          setDynamicCvv(Math.floor(100 + Math.random() * 900).toString());
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger Assembly/Minting animation sequence on mode switch or manual re-mint
  const triggerAssembly = (mode: CardMode) => {
    setCardMode(mode);
    setIsAssembling(true);
    setIsSheenActive(false);
    setAssemblyKey((k) => k + 1);

    // Sheen sweep trigger after grid converge
    const sheenTimer = setTimeout(() => {
      setIsSheenActive(true);
    }, 550);

    const finishTimer = setTimeout(() => {
      setIsAssembling(false);
    }, 1000);

    return () => {
      clearTimeout(sheenTimer);
      clearTimeout(finishTimer);
    };
  };

  // Mouse Move 3D Tilt Calculation (strictly 6-8 deg max)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = -((mouseY / (rect.height / 2)) * 7.5);
    const rotateY = (mouseX / (rect.width / 2)) * 7.5;

    setTilt({
      x: Math.max(-8, Math.min(8, rotateX)),
      y: Math.max(-8, Math.min(8, rotateY))
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Grid tiles configuration for the Physical "Materialize" assembly (5 rows x 8 cols = 40 tiles)
  const gridRows = 5;
  const gridCols = 8;
  const totalTiles = gridRows * gridCols;

  // Particle count for Virtual "Dematerialize / Dissolve"
  const particleCount = 32;

  return (
    <section id="cards-experience" className="py-24 sm:py-28 px-6 sm:px-12 lg:px-16 xl:px-24 w-full space-y-16 relative overflow-hidden selection:bg-[#D9A94E] selection:text-[#0D0F13] border-b border-black/[0.06]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#D9A94E]/10 via-[#0666EB]/10 to-[#34A87E]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0D0F13] leading-[1.06]">
          Physical, Virtual, or Crypto. <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#D9A94E] via-[#0666EB] to-[#34A87E] bg-clip-text text-transparent">
            Minted, Holographic, or On-Chain.
          </span>
        </h2>
        
        <p className="text-[#6E737B] text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
          Toggle between an 18g solid aerospace steel physical card assembled from precision lattice squares, an instant holographic virtual card, and the all-new AfriQuantX Crypto Card.
        </p>

        {/* Master 3-Way Mode Switcher */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-[#F4F1E8] border border-black/[0.08] shadow-inner relative max-w-full overflow-x-auto">
            
            {/* 1. Physical Mode */}
            <button
              onClick={() => triggerAssembly('physical')}
              className={`relative z-10 px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-300 flex items-center gap-2 shrink-0 ${
                cardMode === 'physical' 
                  ? 'text-white' 
                  : 'text-[#6E737B] hover:text-[#0D0F13]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Physical 18g Metal</span>
            </button>

            {/* 2. Virtual Holographic Mode */}
            <button
              onClick={() => triggerAssembly('virtual')}
              className={`relative z-10 px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-300 flex items-center gap-2 shrink-0 ${
                cardMode === 'virtual' 
                  ? 'text-white' 
                  : 'text-[#6E737B] hover:text-[#0D0F13]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Virtual Holographic</span>
            </button>

            {/* 3. AfriQuantX Crypto Card */}
            <button
              onClick={() => triggerAssembly('crypto')}
              className={`relative z-10 px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-300 flex items-center gap-2 shrink-0 ${
                cardMode === 'crypto' 
                  ? 'text-white' 
                  : 'text-[#6E737B] hover:text-[#0D0F13]'
              }`}
            >
              <Coins className="w-4 h-4 text-[#D9A94E]" />
              <span>AfriQuantX Crypto Card</span>
            </button>

            {/* Sliding Pill Indicator */}
            <motion.div
              layoutId="cardModeActivePill3"
              className="absolute inset-y-1.5 rounded-full bg-[#0D0F13] shadow-md"
              style={{
                left: cardMode === 'physical' ? '6px' : cardMode === 'virtual' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 2px)',
                right: cardMode === 'physical' ? 'calc(66.66% + 2px)' : cardMode === 'virtual' ? 'calc(33.33% + 2px)' : '6px',
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          </div>
        </div>
      </div>

      {/* 2. Interactive Showcase Arena (3D Canvas + Technical Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* LEFT: 3D Interactive Card Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          
          <div 
            ref={cardContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-[460px] aspect-[1.586/1] relative cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: 1200 }}
          >
            {/* Motion Card Surface with 3D Cursor Tilt & Autonomous Mobile/Idle Oscillation */}
            <motion.div
              animate={
                isHovered
                  ? { rotateX: tilt.x, rotateY: tilt.y, scale: 1.03 }
                  : { 
                      // Gentle 2-3° autonomous drift loop (6s) for mobile/idle
                      rotateX: [0, 2.8, -2.4, 0], 
                      rotateY: [0, -3.2, 3.0, 0],
                      scale: 1
                    }
              }
              transition={
                isHovered
                  ? { type: 'spring', stiffness: 220, damping: 20 }
                  : { 
                      rotateX: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
                      rotateY: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
                      scale: { duration: 0.4 }
                    }
              }
              style={{ transformStyle: 'preserve-3d' }}
              className="w-full h-full relative"
            >
              
              {/* =========================================================================
                  STATE 1: PHYSICAL 18G METAL CARD (CONVERGING SQUARES & METALLIC SHEEN)
                  ========================================================================= */}
              {cardMode === 'physical' && (
                <div 
                  key={`physical-${assemblyKey}-${finish}`}
                  className={`
                    w-full h-full rounded-[24px] p-6 sm:p-7 relative overflow-hidden 
                    shadow-[0_24px_60px_rgba(13,15,19,0.35)] border transition-colors duration-500
                    flex flex-col justify-between
                    ${finish === 'obsidian' 
                      ? 'bg-gradient-to-tr from-[#0D0F13] via-[#1A1D24] to-[#0A0C0E] border-white/15 text-white' 
                      : finish === 'platinum'
                      ? 'bg-gradient-to-tr from-[#D1D5DB] via-[#F3F4F6] to-[#9CA3AF] border-white/60 text-[#111827]'
                      : 'bg-gradient-to-tr from-[#2A1F0D] via-[#4A3818] to-[#1F170A] border-[#D9A94E]/40 text-amber-100'
                    }
                  `}
                >
                  
                  {/* Subtle Brushed Metal Texture Lines */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)`
                    }}
                  />

                  {/* 1. Grid of Small Squares Converging to Assemble Card */}
                  <AnimatePresence>
                    {isAssembling && (
                      <motion.div 
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 grid grid-cols-8 grid-rows-5 gap-1 p-2 bg-[#0D0F13] z-40 rounded-[24px] overflow-hidden"
                      >
                        {Array.from({ length: totalTiles }).map((_, idx) => {
                          const col = idx % gridCols;
                          const row = Math.floor(idx / gridCols);
                          const distFromCenter = Math.hypot(col - 3.5, row - 2);
                          return (
                            <motion.div
                              key={`tile-${idx}`}
                              initial={{
                                scale: 0.1,
                                opacity: 0,
                                z: 90,
                                rotateX: (Math.random() - 0.5) * 70,
                                rotateY: (Math.random() - 0.5) * 70,
                              }}
                              animate={{
                                scale: 1,
                                opacity: 1,
                                z: 0,
                                rotateX: 0,
                                rotateY: 0,
                              }}
                              transition={{
                                duration: 0.7,
                                delay: distFromCenter * 0.035,
                                ease: [0.22, 1, 0.36, 1], // Custom overshoot bezier
                              }}
                              className={`rounded-sm border ${
                                finish === 'platinum'
                                  ? 'bg-zinc-300 border-zinc-200'
                                  : finish === 'gold'
                                  ? 'bg-[#8B6B2B] border-[#D9A94E]/60'
                                  : 'bg-zinc-800 border-zinc-700/80'
                              }`}
                            />
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 2. Metallic Light-Sheen Sweep Overlay (Passing left->right, ~800ms) */}
                  <motion.div
                    key={`sheen-${assemblyKey}`}
                    initial={{ x: '-160%' }}
                    animate={{ x: isSheenActive ? '220%' : '-160%' }}
                    transition={{
                      duration: 0.8,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-25deg] pointer-events-none z-30"
                  />

                  {/* 3. Thin Diagonal Light-Reflection Band (Continuous 5s Loop simulating brushed metal) */}
                  <motion.div
                    animate={{ x: ['-220%', '320%'] }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 3.4,
                      duration: 1.6,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent skew-x-[-20deg] pointer-events-none z-20"
                  />

                  {/* Physical Card Face Elements */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      {/* Laser-Etched EMV Gold Chip */}
                      <div className="w-11 h-9 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1.5px] shadow-sm relative overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-tr from-amber-300 to-amber-100 rounded-[6px] grid grid-cols-2 grid-rows-3 gap-[1px] p-[2px]">
                          <div className="border border-amber-600/40 rounded-sm" />
                          <div className="border border-amber-600/40 rounded-sm" />
                          <div className="border border-amber-600/40 rounded-sm col-span-2" />
                          <div className="border border-amber-600/40 rounded-sm" />
                          <div className="border border-amber-600/40 rounded-sm" />
                        </div>
                      </div>

                      {/* Contactless Wave */}
                      <Wifi className={`w-5 h-5 rotate-90 ${finish === 'platinum' ? 'text-zinc-600' : finish === 'gold' ? 'text-[#D9A94E]' : 'text-zinc-400'}`} />
                    </div>

                    {/* Brand Watermark */}
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="font-mono font-bold text-[11px] uppercase tracking-widest">AFRIQUANTX</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D9A94E]" />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-tighter opacity-60 block">
                        18g SOLID METAL // SEC & JSE
                      </span>
                    </div>
                  </div>

                  {/* Card Number Preview */}
                  <div className="my-auto py-2 relative z-10">
                    <div className={`font-mono text-lg sm:text-xl font-bold tracking-[0.22em] ${finish === 'platinum' ? 'text-zinc-900' : 'text-zinc-100'}`}>
                      5412 •••• •••• 8842
                    </div>
                  </div>

                  {/* Card Bottom Metadata */}
                  <div className="flex items-end justify-between relative z-10">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest opacity-60 block">CARDHOLDER</span>
                      <span className="font-mono font-bold text-xs sm:text-sm tracking-wide block">
                        K. MENSAH // SAHARA CAP
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase tracking-widest opacity-60 block">EXPIRES</span>
                      <span className="font-mono font-bold text-xs sm:text-sm tracking-widest block">
                        08/31
                      </span>
                    </div>

                    {/* Tier Badge */}
                    <div className="shrink-0">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold tracking-wider border ${
                        finish === 'platinum'
                          ? 'bg-black text-white border-black'
                          : finish === 'gold'
                          ? 'bg-[#D9A94E] text-[#0D0F13] border-[#D9A94E]'
                          : 'bg-white/10 text-white border-white/20'
                      }`}>
                        {finish === 'gold' ? 'ROYAL GOLD' : finish === 'platinum' ? 'PLATINUM' : 'OBSIDIAN METAL'}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* =========================================================================
                  STATE 2: VIRTUAL CARD (UPWARD DISSOLVE PARTICLES & TRANSLUCENT HOLOGRAM)
                  ========================================================================= */}
              {cardMode === 'virtual' && (
                <div 
                  key={`virtual-${assemblyKey}`}
                  className="w-full h-full rounded-[24px] p-6 sm:p-7 relative overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/[0.12] via-[#0666EB]/[0.14] to-[#7C4DFF]/[0.20] border border-cyan-400/40 shadow-[0_0_50px_rgba(6,102,235,0.25)] text-white flex flex-col justify-between transition-all duration-700"
                >
                  
                  {/* Upward Floating Particles upon Dematerialization */}
                  <AnimatePresence>
                    {isAssembling && (
                      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
                        {Array.from({ length: particleCount }).map((_, i) => (
                          <motion.div
                            key={`vp-${i}`}
                            initial={{
                              x: `${Math.random() * 100}%`,
                              y: '90%',
                              opacity: 0,
                              scale: Math.random() * 1.5 + 0.5,
                            }}
                            animate={{
                              y: '-20%',
                              opacity: [0, 1, 0],
                              x: `${(Math.random() - 0.5) * 40 + (i / particleCount) * 100}%`,
                            }}
                            transition={{
                              duration: 0.85 + Math.random() * 0.35,
                              delay: Math.random() * 0.2,
                              ease: 'easeOut',
                            }}
                            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]"
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Holographic Glowing Border Pulse */}
                  <div className="absolute inset-0 rounded-[24px] border border-cyan-400/35 shadow-[inset_0_0_22px_rgba(56,189,248,0.18)] pointer-events-none" />

                  {/* Thin Light Reflection Band (Continuous 5s loop) */}
                  <motion.div
                    animate={{ x: ['-220%', '320%'] }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 3.4,
                      duration: 1.6,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-cyan-300/[0.22] to-transparent skew-x-[-20deg] pointer-events-none z-20"
                  />

                  {/* Virtual Card Header */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center text-cyan-300 shadow-sm">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-xs text-white block leading-tight">
                          INSTANT VIRTUAL
                        </span>
                        <span className="text-[9px] font-mono text-cyan-300/90 block">
                          {isDisposable ? '● SINGLE-USE BURNER' : '● MULTI-USE CRYPTO-SHIELD'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSensitive(!showSensitive)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-[10px] font-mono"
                      >
                        {showSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showSensitive ? 'Hide' : 'Reveal'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Virtual Card Middle Number & Dynamic Security */}
                  <div className="my-auto py-2 relative z-10 space-y-1.5">
                    <div className="font-mono text-xl sm:text-2xl font-bold tracking-[0.24em] text-cyan-100 text-shadow">
                      {showSensitive ? '4916 8820 4410 9931' : '4916 •••• •••• 9931'}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-cyan-200">
                        <span className="opacity-60 text-[10px]">DYNAMIC CVV:</span>
                        <span className="font-bold bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30 text-cyan-300">
                          {showSensitive ? dynamicCvv : '•••'}
                        </span>
                        <span className="text-[10px] text-cyan-400/80">({cvvCountdown}s)</span>
                      </div>
                    </div>
                  </div>

                  {/* Virtual Card Bottom Controls */}
                  <div className="flex items-end justify-between relative z-10">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-300/70 block">VIRTUAL ACCOUNT</span>
                      <span className="font-mono font-bold text-xs sm:text-sm tracking-wide block text-white">
                        PAN-AFRICAN FX MESH
                      </span>
                    </div>

                    {/* Apple Pay / Google Pay Instant Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono font-bold">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
                      <span>APPLE / GOOGLE PAY</span>
                    </div>
                  </div>

                </div>
              )}

              {/* =========================================================================
                  STATE 3: AFRIQUANTX CRYPTO CARD (WEB3 DEFI MESH & ON-CHAIN SETTLEMENT)
                  ========================================================================= */}
              {cardMode === 'crypto' && (
                <div 
                  key={`crypto-${assemblyKey}`}
                  className="w-full h-full rounded-[24px] p-6 sm:p-7 relative overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-[#0D0F13] via-[#12231A] to-[#1F2B14] border border-[#34A87E]/50 shadow-[0_0_50px_rgba(52,168,126,0.30)] text-white flex flex-col justify-between transition-all duration-700"
                >
                  
                  {/* Cyber Grid Matrix Background */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(#34A87E 1px, transparent 1px)`,
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* Matrix Particle Burst on Assembly */}
                  <AnimatePresence>
                    {isAssembling && (
                      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
                        {Array.from({ length: particleCount }).map((_, i) => (
                          <motion.div
                            key={`cp-${i}`}
                            initial={{
                              scale: 0,
                              opacity: 0,
                              x: `${Math.random() * 100}%`,
                              y: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              scale: [0, 1.4, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 0.75,
                              delay: Math.random() * 0.25,
                              ease: 'easeOut',
                            }}
                            className="absolute w-2 h-2 rounded-full bg-[#D9A94E] shadow-[0_0_10px_#D9A94E]"
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Golden-Emerald Sheen Sweep Overlay */}
                  <motion.div
                    animate={{ x: ['-220%', '320%'] }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 3.4,
                      duration: 1.6,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-[#D9A94E]/[0.25] to-transparent skew-x-[-20deg] pointer-events-none z-20"
                  />

                  {/* Crypto Card Header */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#34A87E]/20 border border-[#34A87E]/40 flex items-center justify-center text-[#34A87E] shadow-sm">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-xs text-white block leading-tight">
                          AFRIQUANTX CRYPTO CARD
                        </span>
                        <span className="text-[9px] font-mono text-[#D9A94E] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34A87E] animate-pulse" />
                          <span>ON-CHAIN ZERO-SLIPPAGE SETTLEMENT</span>
                        </span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-[#34A87E]/20 border border-[#34A87E]/40 text-[#34A87E] text-[10px] font-mono font-bold flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      <span>EVM & SOLANA</span>
                    </div>
                  </div>

                  {/* Crypto Card Middle Balance & Token Selection */}
                  <div className="my-auto py-2 relative z-10 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-emerald-300/70 uppercase tracking-widest block">LINKED VAULT BALANCE</span>
                        <div className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                          <span>$42,850.00</span>
                          <span className="text-xs text-[#D9A94E] font-normal">({selectedCryptoToken})</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono text-emerald-300/70 uppercase tracking-widest block">AQX STAKING APY</span>
                        <span className="font-mono text-sm font-bold text-[#34A87E] block">+8.4% APY</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <span className="text-[10px] opacity-70">PAY WITH:</span>
                      {(['USDC', 'USDT', 'SOL', 'ETH', 'BTC'] as const).map((tok) => (
                        <button
                          key={tok}
                          onClick={() => setSelectedCryptoToken(tok)}
                          className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                            selectedCryptoToken === tok
                              ? 'bg-[#D9A94E] text-[#0D0F13] font-bold shadow-sm'
                              : 'bg-white/10 text-white/70 hover:text-white'
                          }`}
                        >
                          {tok}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Crypto Card Bottom Controls */}
                  <div className="flex items-end justify-between relative z-10">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#34A87E] block">NON-CUSTODIAL HASH</span>
                      <span className="font-mono font-bold text-xs tracking-wider text-zinc-300 block truncate max-w-[180px]">
                        0x8f2c...4d9a (Verified)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A94E]/20 border border-[#D9A94E]/40 text-[10px] font-mono font-bold text-[#D9A94E]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>2.5% CRYPTO CASHBACK</span>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </div>

          {/* Interactive Action Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => triggerAssembly(cardMode)}
              className="px-4 py-2 rounded-full bg-[#F4F1E8] hover:bg-[#EAE6D8] text-[#0D0F13] text-xs font-mono font-bold transition-all flex items-center gap-2 border border-black/[0.08] hover:scale-105"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#D9A94E] ${isAssembling ? 'animate-spin' : ''}`} />
              <span>
                {cardMode === 'physical' 
                  ? 'Assemble Card Structure' 
                  : cardMode === 'virtual' 
                  ? 'Re-Dissolve Hologram' 
                  : 'Re-Sync On-Chain Mesh'}
              </span>
            </button>

            {cardMode === 'physical' && (
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F4F1E8] border border-black/[0.08]">
                {(['obsidian', 'platinum', 'gold'] as FinishOption[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${
                      finish === f 
                        ? 'bg-[#0D0F13] text-white shadow-sm' 
                        : 'text-[#6E737B] hover:text-[#0D0F13]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {cardMode === 'virtual' && (
              <button
                onClick={() => setIsDisposable(!isDisposable)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold transition-all border ${
                  isDisposable 
                    ? 'bg-[#0666EB] text-white border-[#0666EB]' 
                    : 'bg-[#F4F1E8] text-[#6E737B] border-black/[0.08] hover:text-[#0D0F13]'
                }`}
              >
                {isDisposable ? 'Disposable Burner Active' : 'Enable Disposable Mode'}
              </button>
            )}

            {cardMode === 'crypto' && (
              <div className="px-3 py-1.5 rounded-full bg-[#34A87E]/10 border border-[#34A87E]/30 text-[#34A87E] text-[10px] font-mono font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Auto-Converts to NGN / KES / ZAR at POS</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Technical Specifications & Capability Matrix */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#D9A94E]">
              {cardMode === 'physical' ? (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>AEROSPACE-GRADE METAL ARCHITECTURE</span>
                </>
              ) : cardMode === 'virtual' ? (
                <>
                  <Zap className="w-4 h-4 text-[#0666EB]" />
                  <span>EPHEMERAL CRYPTOGRAPHIC EMISSION</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-[#34A87E]" />
                  <span>HYBRID WEB3 ON-CHAIN SETTLEMENT</span>
                </>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D0F13] tracking-tight">
              {cardMode === 'physical' 
                ? 'Precision 18g Solid Stainless Steel' 
                : cardMode === 'virtual'
                ? 'Zero-Latency Instant Holographic Issuance'
                : 'Spend Crypto Anywhere with Instant Local Fiat Liquidity'}
            </h3>

            <p className="text-sm text-[#6E737B] leading-relaxed">
              {cardMode === 'physical'
                ? 'CNC machine-milled from a single sheet of aerospace-grade stainless steel with laser-etched micro-lettering and biometric contactless clearing.'
                : cardMode === 'virtual'
                ? 'Issued in sub-50 milliseconds with rolling 60-second dynamic CVV codes, single-use burner modes, and immediate push integration into Apple Pay and Google Wallet.'
                : 'Hold USDT, USDC, BTC, or ETH while earning 8.4% APY staking yield. Auto-converts to Nigerian Naira, Kenyan Shilling, or South African Rand at exact interbank rates at checkout.'}
            </p>
          </div>

          {/* Technical Specs Matrix */}
          <div className="p-6 rounded-2xl bg-[#F4F1E8] border border-black/[0.06] space-y-3.5 font-mono text-xs">
            {cardMode === 'physical' ? (
              <>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">CARD WEIGHT & BUILD</span>
                  <span className="font-bold text-[#0D0F13]">18.0 Grams (Solid Steel)</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">FX CLEARING SPREAD</span>
                  <span className="font-bold text-[#34A87E]">0.0% Interbank Spot Rate</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">ATM WITHDRAWAL LIMIT</span>
                  <span className="font-bold text-[#0D0F13]">$10,000 / Day Worldwide</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E737B]">GLOBAL LOUNGE ACCESS</span>
                  <span className="font-bold text-[#D9A94E]">1,400+ International Airports</span>
                </div>
              </>
            ) : cardMode === 'virtual' ? (
              <>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">ISSUANCE TIME</span>
                  <span className="font-bold text-[#34A87E]">0.05 Seconds (Instant)</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">DYNAMIC SECURITY</span>
                  <span className="font-bold text-[#0666EB]">60s Rotating 3D CVV</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">BURNER PROTECTION</span>
                  <span className="font-bold text-[#7C4DFF]">Auto-Destruct on Merchant Charge</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E737B]">WALLET PROVISIONING</span>
                  <span className="font-bold text-[#0D0F13]">Instant Apple / Google Pay</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">SUPPORTED ASSETS</span>
                  <span className="font-bold text-[#0D0F13]">USDC, USDT, SOL, ETH, BTC</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">STAKING CASHBACK</span>
                  <span className="font-bold text-[#D9A94E]">2.5% Paid in AQX / USDC</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                  <span className="text-[#6E737B]">GAS FEES AT POS</span>
                  <span className="font-bold text-[#34A87E]">$0.00 (Gasless Relayer)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E737B]">CHAIN SETTLEMENT</span>
                  <span className="font-bold text-[#0D0F13]">Polygon, Arbitrum & Solana</span>
                </div>
              </>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onNavigateToAuth}
              className="h-[50px] px-8 rounded-full bg-[#0D0F13] text-white hover:bg-black font-bold text-sm tracking-tight transition-all duration-200 shadow-[0_4px_20px_rgba(13,15,19,0.18)] hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              <span>
                {cardMode === 'physical' 
                  ? 'Order 18g Metal Card' 
                  : cardMode === 'virtual' 
                  ? 'Generate Instant Virtual Card' 
                  : 'Claim AfriQuantX Crypto Card'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#D9A94E]" />
            </button>

            <button
              onClick={() => triggerAssembly(cardMode === 'physical' ? 'virtual' : cardMode === 'virtual' ? 'crypto' : 'physical')}
              className="h-[50px] px-6 rounded-full bg-[#F4F1E8] hover:bg-[#EAE6D8] text-[#0D0F13] font-bold text-xs tracking-tight transition-all"
            >
              <span>Switch Card Type</span>
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
