import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronRight, ChevronLeft, Film, Cpu, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export interface CinematicScene {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  stat: string;
  statLabel: string;
  badge: string;
  icon: React.ReactNode;
  bgGradient: string;
  graphicContent: React.ReactNode;
}

export function CinematicShowcase() {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenes: CinematicScene[] = [
    {
      id: 'neural-signal',
      tag: 'SCENE 01 // NEURAL CAPITAL INTELLIGENCE',
      title: 'Real-Time Cross-Border FX & Eurobond Alpha',
      subtitle: 'AQEI deep neural networks analyze satellite freight data and central bank reserve movements across 14 African sovereign nations in sub-400ns.',
      stat: '99.84%',
      statLabel: 'Predictive Confidence Score',
      badge: 'LIVE QUANT MODEL',
      icon: <Cpu className="w-5 h-5 text-[#D5FF2F]" />,
      bgGradient: 'from-zinc-950 via-emerald-950/40 to-black',
      graphicContent: (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Animated Orbital Radar Nodes */}
          <div className="relative w-64 h-64 rounded-full border border-emerald-500/30 flex items-center justify-center animate-spin" style={{ animationDuration: '24s' }}>
            <div className="absolute inset-4 rounded-full border border-dashed border-[#D5FF2F]/40" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#D5FF2F] rounded-full shadow-[0_0_15px_#D5FF2F]" />
            <div className="absolute bottom-4 right-8 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#10B981]" />
          </div>

          <div className="absolute text-center space-y-2 pointer-events-none">
            <span className="font-mono text-3xl font-extrabold text-[#D5FF2F] tracking-wider">$4.2B+</span>
            <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Sovereign Debt Tracked</p>
          </div>
        </div>
      )
    },
    {
      id: 'pre-ipo',
      tag: 'SCENE 02 // SECONDARY LIQUIDITY ENGINE',
      title: 'Institutional Access to African Pre-IPO Unicorns',
      subtitle: 'Bypass traditional 7-year venture lockups. Acquire verified secondary equity in Flutterwave, Moniepoint, and OPay with instant multi-sig custody.',
      stat: '+48.2%',
      statLabel: 'Average Pre-IPO CAGR',
      badge: 'VERIFIED SPV ACCESS',
      icon: <Zap className="w-5 h-5 text-[#00C805]" />,
      bgGradient: 'from-black via-zinc-900 to-emerald-950/60',
      graphicContent: (
        <div className="w-full h-full flex flex-col justify-center space-y-4 px-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00C805]/20 flex items-center justify-center font-bold text-[#00C805]">
                FLW
              </div>
              <div>
                <div className="text-white font-bold text-sm">Flutterwave Inc.</div>
                <div className="text-xs text-zinc-400 font-mono">Series D Secondary</div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#00C805]/20 text-[#00C805] text-xs font-mono font-bold">
              $3.2B Valuation
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D5FF2F]/20 flex items-center justify-center font-bold text-[#D5FF2F]">
                MNP
              </div>
              <div>
                <div className="text-white font-bold text-sm">Moniepoint Financial</div>
                <div className="text-xs text-zinc-400 font-mono">Series C SPV</div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#D5FF2F]/20 text-[#D5FF2F] text-xs font-mono font-bold">
              $1.0B Unicorn
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'automated-yield',
      tag: 'SCENE 03 // AUTONOMOUS YIELD VAULTS',
      title: 'Hedated Dollar Treasury Yields at 14.8% APY',
      subtitle: 'Automated smart contracts continuously balance capital across high-yield African Eurobonds, inflation-protected sovereign paper, and FX swaps.',
      stat: '14.80%',
      statLabel: 'Net Dollar APY',
      badge: 'ZERO CAPITAL LOSS HEDGE',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      bgGradient: 'from-emerald-950 via-zinc-950 to-black',
      graphicContent: (
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between font-mono text-xs text-zinc-400">
              <span>VAULT ALLOCATION</span>
              <span className="text-[#D5FF2F]">AUTOMATED</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#00C805] w-[55%]" />
              <div className="h-full bg-[#D5FF2F] w-[30%]" />
              <div className="h-full bg-emerald-400 w-[15%]" />
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-zinc-400 pt-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00C805]" /> Eurobonds
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#D5FF2F]" /> FX Swaps
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Pre-IPO
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSceneIdx((prev) => (prev + 1) % scenes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  const currentScene = scenes[activeSceneIdx];

  return (
    <div className="w-full relative rounded-[32px] overflow-hidden bg-black text-white border border-zinc-800 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
      
      {/* Film Aspect Ratio Header Bar */}
      <div className="h-12 bg-zinc-900/90 border-b border-zinc-800 px-6 flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <Film className="w-4 h-4 text-[#D5FF2F] animate-pulse" />
          <span className="tracking-widest uppercase font-bold text-white">CINEMATIC PRODUCT TRAILER</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">21:9 ULTRA-WIDE</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#00C805]" /> : <Play className="w-3.5 h-3.5 text-[#D5FF2F]" />}
            <span>{isPlaying ? 'PAUSE TRAILER' : 'PLAY TRAILER'}</span>
          </button>
        </div>
      </div>

      {/* Main Film Stage Viewport */}
      <div className="relative min-h-[460px] lg:min-h-[500px] flex flex-col justify-between p-8 lg:p-14">
        
        {/* Dynamic Background Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} -z-10`}
          />
        </AnimatePresence>

        {/* Cinematic Spotlight Flare */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#D5FF2F]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Tag & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.div 
            key={`tag-${currentScene.id}`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 font-mono text-xs font-bold text-[#D5FF2F] tracking-widest"
          >
            {currentScene.icon}
            <span>{currentScene.tag}</span>
          </motion.div>

          <span className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-mono font-bold text-emerald-400">
            {currentScene.badge}
          </span>
        </div>

        {/* Center Grid: Story Content Left + Interactive Graphics Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6">
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentScene.id}`}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
                  {currentScene.title}
                </h2>
                <p className="text-base lg:text-lg text-zinc-300 leading-relaxed font-sans">
                  {currentScene.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-2 flex items-center gap-6">
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold font-mono text-[#D5FF2F]">
                  {currentScene.stat}
                </div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  {currentScene.statLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-[240px] lg:h-[280px] rounded-2xl bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md p-4 flex items-center justify-center overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`graphic-${currentScene.id}`}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full"
              >
                {currentScene.graphicContent}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Timeline Scene Switcher Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  setActiveSceneIdx(idx);
                  setIsPlaying(false);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeSceneIdx === idx
                    ? 'w-12 bg-[#D5FF2F]'
                    : 'w-3 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveSceneIdx((prev) => (prev - 1 + scenes.length) % scenes.length);
                setIsPlaying(false);
              }}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveSceneIdx((prev) => (prev + 1) % scenes.length);
                setIsPlaying(false);
              }}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
