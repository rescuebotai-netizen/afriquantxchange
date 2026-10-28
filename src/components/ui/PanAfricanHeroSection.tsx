import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown, Sparkles, Shield, TrendingUp, Globe2 } from 'lucide-react';

interface PanAfricanHeroSectionProps {
  onNavigateToAuth: () => void;
  onNavigatePage: (page: string) => void;
  onNavigateToDashboard?: () => void;
}

export function PanAfricanHeroSection({
  onNavigateToAuth,
  onNavigatePage,
  onNavigateToDashboard
}: PanAfricanHeroSectionProps) {
  // Mouse parallax coordinates for SVG network group
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  // Animated Count-Up Stats
  const [stats, setStats] = useState({ markets: 0, capital: 0, smes: 0 });

  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();

    const targetMarkets = 14;
    const targetCapital = 240;
    const targetSmes = 500;

    let animId: number;

    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      setStats({
        markets: Math.round(eased * targetMarkets),
        capital: Math.round(eased * targetCapital),
        smes: Math.round(eased * targetSmes),
      });

      if (p < 1) {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Parallax Mouse Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 18;
    const y = (clientY / innerHeight - 0.5) * 18;
    setParallax({ x: -x, y: -y });
  };

  const handleScrollToContent = () => {
    const el = document.getElementById('cards-experience') || document.getElementById('account-plans');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] flex flex-col justify-between bg-[#0D0F13] text-[#F4F1E8] overflow-hidden selection:bg-[#D9A94E] selection:text-[#0D0F13] border-b border-white/[0.08]"
    >
      {/* 1. Ambient Gradient Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 78% 45%, rgba(217,169,78,0.14), transparent 55%),
            radial-gradient(circle at 65% 70%, rgba(52,168,126,0.10), transparent 50%),
            radial-gradient(circle at 20% 30%, rgba(6,102,235,0.06), transparent 45%),
            #0D0F13
          `
        }}
      />

      {/* 2. Drifting Dot Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(244,241,232,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 950px 750px at 70% 50%, #000 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 950px 750px at 70% 50%, #000 40%, transparent 85%)',
        }}
      />

      {/* 3. Hero Main Grid Content */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 xl:px-24 pt-16 sm:pt-20 pb-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
        
        {/* Left Column: Copy, Headline & CTAs */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          {/* Headline with Staggered Slide-Up */}
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.04] text-[#F4F1E8]"
            >
              Unlock Africa's <br />
              <span className="text-[#D9A94E] drop-shadow-[0_0_35px_rgba(217,169,78,0.25)]">
                Private Capital.
              </span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="text-base sm:text-lg text-[#F4F1E8]/70 max-w-xl font-normal leading-relaxed"
          >
            AfriQuantX connects SMEs, investors, and capital across African markets — building faster, more transparent infrastructure for private markets, pre-IPOs, and sovereign yield on the continent.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 pt-2"
          >
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeSJRTsgzwwqIbZzpIT1_xvqu8_K-gsjqwFuhGNHYPlH2rAGA/viewform?usp=mail_form_link&urp=gmail_link"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-[#D9A94E] hover:bg-[#e4b55c] text-[#0D0F13] font-bold text-sm sm:text-base tracking-tight transition-all duration-200 shadow-[0_10px_28px_rgba(217,169,78,0.32)] hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer text-decoration-none"
            >
              <span>Request Early Access</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={handleScrollToContent}
              className="inline-flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-[#F4F1E8] hover:text-[#D9A94E] transition-colors py-3 group cursor-pointer"
            >
              <span>See how it works</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-[#D9A94E]" />
            </button>
          </motion.div>

          {/* Count-Up Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
            className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-8 sm:gap-12"
          >
            <div className="font-mono">
              <div className="text-2xl sm:text-3xl font-bold text-[#F4F1E8] tracking-tight">
                {stats.markets}
              </div>
              <div className="text-[11px] tracking-wider uppercase text-[#F4F1E8]/50 mt-1 font-sans">
                African Markets
              </div>
            </div>

            <div className="font-mono">
              <div className="text-2xl sm:text-3xl font-bold text-[#D9A94E] tracking-tight">
                ${stats.capital}M+
              </div>
              <div className="text-[11px] tracking-wider uppercase text-[#F4F1E8]/50 mt-1 font-sans">
                Capital Pathways
              </div>
            </div>

            <div className="font-mono">
              <div className="text-2xl sm:text-3xl font-bold text-[#34A87E] tracking-tight">
                {stats.smes}+
              </div>
              <div className="text-[11px] tracking-wider uppercase text-[#F4F1E8]/50 mt-1 font-sans">
                SMEs Onboarded
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Interactive Animated Network Visual */}
        <div className="lg:col-span-6 flex items-center justify-center relative min-h-[420px] sm:min-h-[520px]">
          
          <motion.div
            style={{
              transform: `translate(${parallax.x}px, ${parallax.y}px)`,
              transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="w-full max-w-[620px] relative"
          >
            <svg
              viewBox="0 0 600 600"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto overflow-visible select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
            >
              <defs>
                {/* Glow Filters */}
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Curved Network Paths */}
              <g className="paths" opacity="0.85">
                <path id="p1" d="M220,280 C300,250 350,300 430,320" fill="none" stroke="rgba(217,169,78,0.35)" strokeWidth="1.5" />
                <path id="p2" d="M220,280 C280,200 350,150 420,120" fill="none" stroke="rgba(52,168,126,0.35)" strokeWidth="1.5" />
                <path id="p3" d="M220,280 C190,270 170,270 150,260" fill="none" stroke="rgba(217,169,78,0.35)" strokeWidth="1.5" />
                <path id="p4" d="M220,280 C250,380 280,450 300,500" fill="none" stroke="rgba(52,168,126,0.35)" strokeWidth="1.5" />
                <path id="p5" d="M430,320 C440,250 430,180 420,120" fill="none" stroke="rgba(217,169,78,0.35)" strokeWidth="1.5" />
                <path id="p6" d="M430,320 C400,330 385,335 370,340" fill="none" stroke="rgba(52,168,126,0.35)" strokeWidth="1.5" />
                <path id="p7" d="M430,320 C425,360 422,380 420,400" fill="none" stroke="rgba(217,169,78,0.35)" strokeWidth="1.5" />
                <path id="p8" d="M430,320 C380,400 340,460 300,500" fill="none" stroke="rgba(52,168,126,0.35)" strokeWidth="1.5" />
                <path id="p9" d="M180,90 C280,90 350,100 420,120" fill="none" stroke="rgba(217,169,78,0.35)" strokeWidth="1.5" />
                <path id="p10" d="M180,90 C190,180 205,230 220,280" fill="none" stroke="rgba(52,168,126,0.35)" strokeWidth="1.5" />
              </g>

              {/* Animated Continuous Travelling Light Particles along the Paths */}
              <g className="particles">
                <circle r="3.5" fill="#D9A94E" filter="url(#goldGlow)">
                  <animateMotion dur="6.5s" repeatCount="indefinite" begin="0.2s">
                    <mpath href="#p1" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#34A87E" filter="url(#emeraldGlow)">
                  <animateMotion dur="7.8s" repeatCount="indefinite" begin="1s">
                    <mpath href="#p2" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#D9A94E" filter="url(#goldGlow)">
                  <animateMotion dur="5.4s" repeatCount="indefinite" begin="0.6s">
                    <mpath href="#p3" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#34A87E" filter="url(#emeraldGlow)">
                  <animateMotion dur="8.6s" repeatCount="indefinite" begin="1.6s">
                    <mpath href="#p4" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#D9A94E" filter="url(#goldGlow)">
                  <animateMotion dur="6.9s" repeatCount="indefinite" begin="0.4s">
                    <mpath href="#p5" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#34A87E" filter="url(#emeraldGlow)">
                  <animateMotion dur="5.9s" repeatCount="indefinite" begin="1.3s">
                    <mpath href="#p6" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#D9A94E" filter="url(#goldGlow)">
                  <animateMotion dur="7.2s" repeatCount="indefinite" begin="0.9s">
                    <mpath href="#p7" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#34A87E" filter="url(#emeraldGlow)">
                  <animateMotion dur="8.1s" repeatCount="indefinite" begin="0.3s">
                    <mpath href="#p8" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#D9A94E" filter="url(#goldGlow)">
                  <animateMotion dur="6.2s" repeatCount="indefinite" begin="1.8s">
                    <mpath href="#p9" />
                  </animateMotion>
                </circle>

                <circle r="3.5" fill="#34A87E" filter="url(#emeraldGlow)">
                  <animateMotion dur="7.5s" repeatCount="indefinite" begin="0.7s">
                    <mpath href="#p10" />
                  </animateMotion>
                </circle>
              </g>

              {/* City Hub Nodes */}
              <g className="nodes font-mono text-[11px] font-bold tracking-wider fill-[#F4F1E8]/80">
                {/* Lagos Hub */}
                <g transform="translate(220,280)">
                  <circle r="18" fill="#D9A94E" opacity="0.18" className="animate-ping" />
                  <circle r="7" fill="#D9A94E" filter="url(#goldGlow)" />
                  <circle r="3" fill="#0D0F13" />
                  <text x="12" y="-12" fill="#D9A94E" fontSize="12" fontWeight="bold">Lagos [NGX]</text>
                </g>

                {/* Nairobi Hub */}
                <g transform="translate(430,320)">
                  <circle r="18" fill="#34A87E" opacity="0.18" className="animate-ping" />
                  <circle r="7" fill="#34A87E" filter="url(#emeraldGlow)" />
                  <circle r="3" fill="#0D0F13" />
                  <text x="12" y="-12" fill="#34A87E" fontSize="12" fontWeight="bold">Nairobi [NSE]</text>
                </g>

                {/* Accra Hub */}
                <g transform="translate(150,260)">
                  <circle r="12" fill="#D9A94E" opacity="0.2" />
                  <circle r="5" fill="#D9A94E" />
                  <text x="-64" y="-8">Accra</text>
                </g>

                {/* Johannesburg Hub */}
                <g transform="translate(300,500)">
                  <circle r="18" fill="#34A87E" opacity="0.2" className="animate-ping" />
                  <circle r="7" fill="#34A87E" filter="url(#emeraldGlow)" />
                  <circle r="3" fill="#0D0F13" />
                  <text x="14" y="5" fill="#34A87E" fontSize="12" fontWeight="bold">Johannesburg [JSE]</text>
                </g>

                {/* Cairo Hub */}
                <g transform="translate(420,120)">
                  <circle r="14" fill="#D9A94E" opacity="0.2" />
                  <circle r="5.5" fill="#D9A94E" />
                  <text x="12" y="-10">Cairo [EGX]</text>
                </g>

                {/* Kigali Hub */}
                <g transform="translate(370,340)">
                  <circle r="10" fill="#34A87E" opacity="0.2" />
                  <circle r="4.5" fill="#34A87E" />
                  <text x="10" y="16">Kigali</text>
                </g>

                {/* Dar es Salaam Hub */}
                <g transform="translate(420,400)">
                  <circle r="10" fill="#D9A94E" opacity="0.2" />
                  <circle r="4.5" fill="#D9A94E" />
                  <text x="12" y="14">Dar es Salaam</text>
                </g>

                {/* Casablanca Hub */}
                <g transform="translate(180,90)">
                  <circle r="12" fill="#34A87E" opacity="0.2" />
                  <circle r="5" fill="#34A87E" />
                  <text x="-80" y="-8">Casablanca</text>
                </g>
              </g>
            </svg>

            {/* Micro Badge Overlay on Network Map */}
            <div className="absolute bottom-2 right-4 px-3.5 py-1.5 rounded-xl bg-[#171B26]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#D9A94E] flex items-center gap-2 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A87E] animate-pulse" />
              <span>LIVE AQEI ORDER ROUTING</span>
            </div>
          </motion.div>

        </div>

      </div>

      {/* 4. Scroll Cue Bar at Bottom */}
      <div 
        onClick={handleScrollToContent}
        className="relative z-10 pb-6 flex flex-col items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#F4F1E8]/50 hover:text-[#D9A94E] cursor-pointer transition-colors"
      >
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#D9A94E] to-transparent animate-bounce" />
        <span>Scroll to Explore</span>
      </div>

    </section>
  );
}
