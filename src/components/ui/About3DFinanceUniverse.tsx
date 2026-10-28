import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  CreditCard, TrendingUp, ShieldCheck, Zap, Globe, Sparkles, 
  ArrowUpRight, Landmark, Layers, Lock, Cpu, Coins, BarChart3, Activity
} from 'lucide-react';

interface About3DFinanceUniverseProps {
  darkMode?: boolean;
}

export function About3DFinanceUniverse({ darkMode = true }: About3DFinanceUniverseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse tilt tracking for realistic 3D perspective parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-18, 18]);

  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Canvas background for 3D depth particles and floating currency telemetry
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for floating financial dust & market nodes
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      symbol?: string;
      alpha: number;
      pulseSpeed: number;
    }

    const symbols = ['$', '€', '£', '₦', 'R', 'KSh', 'د.إ', '¥'];
    const colors = ['#D9A94E', '#34A87E', '#0666EB', '#F4F1E8', '#F59E0B'];

    const particles: Particle[] = Array.from({ length: 65 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 800 + 100,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2.5 + 1,
      color: colors[i % colors.length],
      symbol: i % 4 === 0 ? symbols[i % symbols.length] : undefined,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Parallax offset based on current mouse spring
      const pX = smoothMouseX.get() * 80;
      const pY = smoothMouseY.get() * 50;

      // Draw subtle connecting constellation lines between near particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = (p1.x + pX * (p1.z / 600)) - (p2.x + pX * (p2.z / 600));
          const dy = (p1.y + pY * (p1.z / 600)) - (p2.y + pY * (p2.z / 600));
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.strokeStyle = `rgba(217, 169, 78, ${0.12 * (1 - dist / 90)})`;
            ctx.beginPath();
            ctx.moveTo(p1.x + pX * (p1.z / 600), p1.y + pY * (p1.z / 600));
            ctx.lineTo(p2.x + pX * (p2.z / 600), p2.y + pY * (p2.z / 600));
            ctx.stroke();
          }
        }
      }

      // Draw 3D Depth Particles & Glowing Floating Symbols
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;
        if (p.y < -40) p.y = height + 40;
        if (p.y > height + 40) p.y = -40;

        const posX = p.x + pX * (p.z / 500);
        const posY = p.y + pY * (p.z / 500);
        const dynamicAlpha = p.alpha + Math.sin(time + p.x) * 0.15;

        if (p.symbol) {
          ctx.font = `600 ${Math.round(p.size * 6 + 7)}px "JetBrains Mono", monospace`;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(0.85, dynamicAlpha * 0.7));
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.fillText(p.symbol, posX, posY);
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath();
          ctx.arc(posX, posY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(0.9, dynamicAlpha));
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
      style={{ perspective: 1200 }}
    >
      {/* 1. Background Particle & Currency Constellation Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      />

      {/* 2. Floating 3D Financial Stage Wrapper */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full h-full flex items-center justify-center pointer-events-auto"
      >

        {/* ========================================================================= */}
        {/* 3D BANK CARD 1: TITANIUM BLACK AFRIQUANTX SOVEREIGN CARD (LEFT ANCHOR)     */}
        {/* ========================================================================= */}
        <motion.div
          animate={{
            y: [-12, 14, -12],
            rotateZ: [-6, -4, -6],
            rotateY: [18, 12, 18],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          whileHover={{ scale: 1.08, zIndex: 50, rotateY: 0, rotateZ: 0 }}
          onMouseEnter={() => setActiveCard(1)}
          onMouseLeave={() => setActiveCard(null)}
          className="absolute left-[3%] sm:left-[6%] lg:left-[10%] top-[18%] sm:top-[22%] w-[240px] sm:w-[300px] lg:w-[340px] h-[150px] sm:h-[188px] lg:h-[212px] rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 bg-gradient-to-br from-[#12151C] via-[#090B0F] to-[#040507] border border-white/[0.18] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(217,169,78,0.15)] backdrop-blur-xl cursor-pointer transition-all duration-300 transform-gpu"
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(60px)' }}
        >
          {/* Card Surface Sheen Overlay */}
          <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] bg-[radial-gradient(ellipse_at_top_left,rgba(217,169,78,0.25),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 h-full flex flex-col justify-between text-[#F4F1E8]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#D9A94E]/20 border border-[#D9A94E]/40 flex items-center justify-center">
                  <Landmark className="w-3.5 h-3.5 text-[#D9A94E]" />
                </div>
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-[#D9A94E]">
                  AFRIQUANTX
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-white/80">
                TITANIUM WORLD
              </span>
            </div>

            {/* EMV Microchip & Contactless Waves */}
            <div className="flex items-center gap-3 my-auto">
              <div className="w-9 sm:w-11 h-7 sm:h-8 rounded-md bg-gradient-to-br from-[#F5D061] via-[#D9A94E] to-[#B38328] border border-[#FFE885]/40 shadow-inner flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 border-t border-b border-black/30 opacity-60" />
                <div className="absolute inset-0 border-l border-r border-black/30 opacity-60" />
                <Cpu className="w-4 h-4 text-black/60" />
              </div>
              <div className="space-y-0.5">
                <div className="w-4 h-[1.5px] bg-[#D9A94E]/60 rounded-full" />
                <div className="w-6 h-[1.5px] bg-[#D9A94E]/60 rounded-full" />
                <div className="w-8 h-[1.5px] bg-[#D9A94E]/60 rounded-full" />
              </div>
            </div>

            <div className="flex items-end justify-between font-mono">
              <div>
                <div className="text-[9px] text-[#F4F1E8]/50 uppercase tracking-wider">INSTITUTIONAL DESK</div>
                <div className="text-xs sm:text-sm font-bold tracking-widest text-white">•••• 8924</div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-[#D9A94E] font-bold">CLEARING T+0</div>
                <div className="text-[10px] text-white/70">12/30</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3D BANK CARD 2: EMERALD SOVEREIGN VAULT CARD (RIGHT ANCHOR)               */}
        {/* ========================================================================= */}
        <motion.div
          animate={{
            y: [14, -14, 14],
            rotateZ: [6, 4, 6],
            rotateY: [-18, -12, -18],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
          whileHover={{ scale: 1.08, zIndex: 50, rotateY: 0, rotateZ: 0 }}
          onMouseEnter={() => setActiveCard(2)}
          onMouseLeave={() => setActiveCard(null)}
          className="absolute right-[3%] sm:right-[6%] lg:right-[10%] bottom-[16%] sm:bottom-[20%] w-[230px] sm:w-[290px] lg:w-[330px] h-[145px] sm:h-[180px] lg:h-[205px] rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 bg-gradient-to-br from-[#0B251C] via-[#061510] to-[#020806] border border-[#34A87E]/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(52,168,126,0.2)] backdrop-blur-xl cursor-pointer transition-all duration-300 transform-gpu"
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(50px)' }}
        >
          {/* Card Emerald Glow Overlay */}
          <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] bg-[radial-gradient(ellipse_at_top_right,rgba(52,168,126,0.3),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-between text-[#F4F1E8]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#34A87E]/20 border border-[#34A87E]/40 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34A87E]" />
                </div>
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-[#34A87E]">
                  SOVEREIGN TREASURY
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#34A87E]/15 border border-[#34A87E]/30 text-[#34A87E]">
                12.5% YIELD
              </span>
            </div>

            {/* Microchip */}
            <div className="flex items-center gap-3 my-auto">
              <div className="w-9 sm:w-11 h-7 sm:h-8 rounded-md bg-gradient-to-br from-[#A7F3D0] via-[#34A87E] to-[#065F46] border border-[#D1FAE5]/40 shadow-inner flex items-center justify-center">
                <Zap className="w-4 h-4 text-black/70" />
              </div>
              <div className="text-[10px] font-mono text-[#34A87E]">
                MULTI-CURRENCY ACH / WIRE
              </div>
            </div>

            <div className="flex items-end justify-between font-mono">
              <div>
                <div className="text-[9px] text-[#F4F1E8]/50 uppercase tracking-wider">PAN-AFRICA DUAL-VAULT</div>
                <div className="text-xs sm:text-sm font-bold tracking-widest text-white">USD • NGN • ZAR</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Globe className="w-4 h-4 text-[#34A87E]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* 3D FLOATING FINANCIAL MARKET CANDLESTICK & METRIC CARDS (ORBITING)        */}
        {/* ========================================================================= */}

        {/* Top-Right Holographic Market Screen */}
        <motion.div
          animate={{
            y: [-10, 8, -10],
            rotateZ: [2, -2, 2],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute right-[4%] sm:right-[12%] lg:right-[15%] top-[12%] sm:top-[15%] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#090C12]/90 border border-white/[0.14] shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md hidden sm:flex items-center gap-3 z-30"
          style={{ transform: 'translateZ(90px)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#34A87E]/15 border border-[#34A87E]/30 flex items-center justify-center text-[#34A87E]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="font-mono">
            <div className="text-[10px] text-[#F4F1E8]/60 flex items-center gap-1.5">
              <span>JSE / NGX LIQUIDITY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A87E] animate-pulse" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>$70.6B USD</span>
              <span className="text-[#34A87E] text-[10px]">+18.4%</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom-Left Live FIX Latency Ticker Screen */}
        <motion.div
          animate={{
            y: [8, -10, 8],
            rotateZ: [-3, 1, -3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8
          }}
          className="absolute left-[4%] sm:left-[12%] lg:left-[16%] bottom-[12%] sm:bottom-[15%] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#090C12]/90 border border-white/[0.14] shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md hidden sm:flex items-center gap-3 z-30"
          style={{ transform: 'translateZ(85px)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#D9A94E]/15 border border-[#D9A94E]/30 flex items-center justify-center text-[#D9A94E]">
            <Activity className="w-4 h-4" />
          </div>
          <div className="font-mono">
            <div className="text-[10px] text-[#F4F1E8]/60">FIX 4.4 CLEARING ENGINE</div>
            <div className="text-xs sm:text-sm font-bold text-[#34A87E] flex items-center gap-2">
              <span>410μs Latency</span>
              <span className="text-white/60 text-[10px]">T+0 DvP</span>
            </div>
          </div>
        </motion.div>

        {/* Orbiting 3D Glass Currency Chips */}
        <motion.div
          animate={{
            y: [-15, 15, -15],
            rotateZ: [0, 360],
          }}
          transition={{
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            rotateZ: { duration: 40, repeat: Infinity, ease: 'linear' }
          }}
          className="absolute left-[24%] sm:left-[28%] top-[24%] w-10 h-10 rounded-full bg-gradient-to-br from-[#D9A94E]/30 to-black/80 border border-[#D9A94E]/50 shadow-[0_0_20px_rgba(217,169,78,0.4)] backdrop-blur-md flex items-center justify-center text-sm font-mono font-extrabold text-[#D9A94E] hidden md:flex"
          style={{ transform: 'translateZ(110px)' }}
        >
          $
        </motion.div>

        <motion.div
          animate={{
            y: [12, -16, 12],
            rotateZ: [360, 0],
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            rotateZ: { duration: 45, repeat: Infinity, ease: 'linear' }
          }}
          className="absolute right-[25%] sm:right-[30%] top-[28%] w-11 h-11 rounded-full bg-gradient-to-br from-[#34A87E]/30 to-black/80 border border-[#34A87E]/50 shadow-[0_0_20px_rgba(52,168,126,0.4)] backdrop-blur-md flex items-center justify-center text-sm font-mono font-extrabold text-[#34A87E] hidden md:flex"
          style={{ transform: 'translateZ(100px)' }}
        >
          ₦
        </motion.div>

        <motion.div
          animate={{
            y: [-10, 14, -10],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3
          }}
          className="absolute right-[22%] bottom-[24%] w-9 h-9 rounded-full bg-gradient-to-br from-[#0666EB]/30 to-black/80 border border-[#0666EB]/50 shadow-[0_0_20px_rgba(6,102,235,0.4)] backdrop-blur-md flex items-center justify-center text-xs font-mono font-extrabold text-[#0666EB] hidden md:flex"
          style={{ transform: 'translateZ(75px)' }}
        >
          €
        </motion.div>

        <motion.div
          animate={{
            y: [14, -12, 14],
          }}
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.7
          }}
          className="absolute left-[20%] bottom-[28%] w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B]/30 to-black/80 border border-[#F59E0B]/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] backdrop-blur-md flex items-center justify-center text-xs font-mono font-extrabold text-[#F59E0B] hidden md:flex"
          style={{ transform: 'translateZ(70px)' }}
        >
          R
        </motion.div>

      </motion.div>
    </div>
  );
}
