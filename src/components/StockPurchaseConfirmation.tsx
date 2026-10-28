import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, Download, Share2, ArrowRight, RefreshCcw, 
  ShieldCheck, Award, QrCode, Globe, Clock, DollarSign, 
  User, Check, ChevronDown, Sparkles, Loader2, Info
} from 'lucide-react';
import html2canvas from 'html2canvas';

// Sound design using Web Audio API
const playSynthesizedSound = (type: 'success' | 'paper' | 'stamp' | 'sparkle') => {
  if (typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  try {
    const ctx = new AudioContext();
    
    if (type === 'success') {
      // Harmonic luxury major-seventh chord sweep
      const freqs = [130.81, 164.81, 196.00, 246.94, 261.63, 329.63, 392.00, 493.88]; // C major 7th voicing
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1 + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + 1.6);
      });
    } else if (type === 'paper') {
      // Custom low-passed noise sweep to simulate paper unfold
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start();
      noise.stop(ctx.currentTime + 0.4);
    } else if (type === 'stamp') {
      // Deep punchy stamp sound with subharmonic
      const osc = ctx.createOscillator();
      const oscLow = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.15);
      
      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(65, ctx.currentTime);
      oscLow.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      oscLow.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      oscLow.start();
      osc.stop(ctx.currentTime + 0.3);
      oscLow.stop(ctx.currentTime + 0.3);
    } else if (type === 'sparkle') {
      // Tiny high pitch sparkles
      const now = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000 + Math.random() * 1500, now + i * 0.08);
        gain.gain.setValueAtTime(0.03, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      }
    }
  } catch (e) {
    console.warn("Audio Context init blocked or not supported:", e);
  }
};

interface StockPurchaseConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPortfolio: () => void;
  onBuyMore: () => void;
  data: {
    success: boolean;
    certificateId: string;
    shareholderName: string;
    companyName: string;
    companyLogo?: string;
    exchangeLogo?: string;
    stockSymbol: string;
    shares: number;
    purchasePrice: number;
    investmentValue: number;
    ownershipPercentage: number;
    issuerName: string;
    issuerSignature?: string;
    sealImage?: string;
    qrUrl: string;
    transactionId: string;
    purchaseDate: string;
    purchaseTime: string;
  };
}

export function StockPurchaseConfirmation({
  isOpen,
  onClose,
  onViewPortfolio,
  onBuyMore,
  data
}: StockPurchaseConfirmationProps) {
  const [phase, setPhase] = useState<'executing' | 'branding' | 'success'>('executing');
  const [progress, setProgress] = useState(0);
  const [countValue, setCountValue] = useState(0);
  const [countPercentage, setCountPercentage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Floating stock ticker confetti particles
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; symbol: string; size: number; duration: number; delay: number; rot: number }>>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    // Initial sequence
    setPhase('executing');
    setProgress(0);

    // Timeline execution
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    // Switch to brand glow phase after 1.8s
    const brandTimeout = setTimeout(() => {
      setPhase('branding');
      playSynthesizedSound('sparkle');
    }, 1800);

    // Switch to success phase after 3.5s
    const successTimeout = setTimeout(() => {
      setPhase('success');
      playSynthesizedSound('success');
      
      // Paper unfold sound just as certificate comes up
      setTimeout(() => playSynthesizedSound('paper'), 400);
      
      // Stamp sound when stamp stamps
      setTimeout(() => playSynthesizedSound('stamp'), 1600);
      
      // Generate confetti particles
      const tickers = ['AFQ', 'AQX', 'ZAR', 'USD', 'AQX-SEC', 'SHARES', '✓'];
      const newParticles = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        symbol: tickers[Math.floor(Math.random() * tickers.length)],
        size: Math.random() * 12 + 8,
        duration: Math.random() * 3 + 4,
        delay: Math.random() * 1.5,
        rot: Math.random() * 360
      }));
      setParticles(newParticles);
    }, 3600);

    return () => {
      clearInterval(interval);
      clearTimeout(brandTimeout);
      clearTimeout(successTimeout);
    };
  }, [isOpen]);

  // Handle number counting animation
  useEffect(() => {
    if (phase !== 'success') {
      setCountValue(0);
      setCountPercentage(0);
      return;
    }

    let valStart = 0;
    const valEnd = data.investmentValue;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progressRatio * (2 - progressRatio);
      
      setCountValue(Math.floor(easeProgress * valEnd));
      setCountPercentage(parseFloat((easeProgress * data.ownershipPercentage).toFixed(4)));

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [phase, data.investmentValue, data.ownershipPercentage]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#090B10',
        scale: 2 // Premium high definition print quality
      });
      const link = document.createElement('a');
      link.download = `AQX-Share-Certificate-${data.certificateId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      playSynthesizedSound('sparkle');
    } catch (e) {
      console.error("Failed to generate download:", e);
    }
  };

  const handleShare = async () => {
    const shareUrl = data.qrUrl;
    const shareText = `Official Shareholder on AfriQuant Xchange! Verified Owner of ${data.shares} AFQ Shares.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AQX Ownership Certificate',
          text: shareText,
          url: shareUrl
        });
      } catch (e) {
        console.log("Share failed or canceled:", e);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      playSynthesizedSound('sparkle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090B10]/95 backdrop-blur-[30px] flex items-center justify-center p-4 sm:p-6 font-sans select-none text-white">
      {/* Dynamic Animated Particle Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#090B10] to-[#090B10]" />
        
        {/* Confetti Particles */}
        {phase === 'success' && particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ y: p.y + '%', x: p.x + 'vw', rotate: p.rot, opacity: 0.8 }}
            animate={{ y: '110vh', rotate: p.rot + 720, opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'linear',
              repeat: 0
            }}
            className="absolute font-mono font-bold text-[#F9B233]/30 whitespace-nowrap"
            style={{ fontSize: p.size }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Sequence Phase 1: Order Execution */}
        {phase === 'executing' && (
          <motion.div
            key="executing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-6 max-w-md w-full relative z-10 p-8"
          >
            <div className="relative w-28 h-28 mx-auto">
              {/* Outer rotating intelligence ring */}
              <svg className="absolute inset-0 w-full h-full animate-spin duration-[6s]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="45" stroke="#0057FF" strokeWidth="3" fill="none" strokeDasharray="100 200" />
              </svg>
              {/* Inner gathering particles */}
              <div className="absolute inset-2 border-2 border-dashed border-[#00C853]/30 rounded-full animate-spin duration-[15s]" />
              <div className="absolute inset-6 bg-white/[0.03] rounded-full flex items-center justify-center backdrop-blur-md">
                <Loader2 className="w-8 h-8 text-[#00C853] animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-wider uppercase text-zinc-400">Order Executing</h2>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto">Routing smart order through AfriQuant Xchange liquidity nodes...</p>
            </div>
            
            {/* Realtime progress tracker */}
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#0057FF] to-[#00C853] h-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Sequence Phase 2: Branding Glow */}
        {phase === 'branding' && (
          <motion.div
            key="branding"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center relative z-10 space-y-6"
          >
            {/* Green confirmation pulse expanding */}
            <div className="relative flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2.8, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-20 h-20 rounded-full bg-[#00C853]/20"
              />
              <motion.div 
                initial={{ scale: 0.6, opacity: 0.4 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, delay: 0.3, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-20 h-20 rounded-full bg-[#0057FF]/10"
              />
              <div className="w-24 h-24 rounded-3xl bg-[#090B10] border border-white/10 flex items-center justify-center shadow-2xl relative z-10 group p-4">
                {/* Glowing AfriQuantX logo mark */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 border border-dashed border-[#F9B233]/30 rounded-2xl"
                />
                <img src="/logo.svg" alt="AfriQuantX Logo" className="w-12 h-12 object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-widest text-[#F9B233]">AfriQuantX</h1>
              <p className="text-zinc-500 uppercase tracking-wider text-xs mt-1">Intelligent Securities Clearinghouse</p>
            </div>
          </motion.div>
        )}

        {/* Sequence Phase 3: Premium success & dynamic Certificate dashboard */}
        {phase === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl relative z-10 flex flex-col items-center space-y-8 py-8"
          >
            {/* Top Success Header */}
            <div className="text-center space-y-3">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                className="w-16 h-16 bg-[#00C853]/10 border border-[#00C853]/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,200,83,0.15)]"
              >
                <Check className="w-8 h-8 text-[#00C853] stroke-[3]" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Stock Purchase Successful</h1>
                <p className="text-zinc-400 text-sm sm:text-base">Congratulations! You are now an official shareholder.</p>
              </div>
            </div>

            {/* Horizontal or Landscape Share Certificate Panel */}
            <div className="w-full flex justify-center perspective-1000">
              <motion.div
                initial={{ y: 200, rotateX: 15, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, rotateX: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 60 }}
                className="w-full max-w-4xl"
              >
                {/* Certificate Container with premium light reflecting shimmer effect */}
                <div 
                  ref={certificateRef}
                  className="relative bg-[#090B10] border-2 border-[#F9B233]/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden group select-none text-left"
                  style={{
                    backgroundImage: 'radial-gradient(ellipse at top left, rgba(249,178,51,0.06), transparent 70%), radial-gradient(ellipse at bottom right, rgba(0,87,255,0.08), transparent 70%)'
                  }}
                >
                  {/* Subtle golden moving shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3s] pointer-events-none" />

                  {/* Top Header Row of Certificate */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#F9B233]/15">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F9B233]/15 flex items-center justify-center border border-[#F9B233]/25">
                        <Globe className="w-6 h-6 text-[#F9B233]" />
                      </div>
                      <div>
                        <span className="font-extrabold tracking-widest uppercase text-sm text-[#F9B233]">AfriQuant Xchange</span>
                        <p className="text-[10px] text-zinc-500 uppercase font-mono">Securities Clearance Authority</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                      <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider">SEC APPROVED</span>
                    </div>
                  </div>

                  {/* Main Decorative Header */}
                  <div className="text-center my-6 space-y-1">
                    <h2 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.25em]">SHAREHOLDING SECURITIES INSTRUMENT</h2>
                    <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400">
                      DIGITAL SHARE OWNERSHIP CERTIFICATE
                    </h3>
                  </div>

                  {/* Body Text Area */}
                  <div className="text-center max-w-2xl mx-auto space-y-3 py-4 border-y border-white/[0.05]">
                    <p className="text-zinc-500 font-serif italic text-sm">This certifies that</p>
                    <h4 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase font-sans">
                      {data.shareholderName}
                    </h4>
                    <p className="text-zinc-500 font-serif italic text-sm">
                      is the legally registered owner of <span className="text-[#00C853] font-sans font-bold not-italic">{data.shares}</span> ordinary shares issued by
                    </p>
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#F9B233] tracking-wide uppercase">
                      {data.companyName}
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                      fully paid and non-assessable in the capital stock of the issuing corporation, registered and cleared via AfriQuant Xchange digital securities protocol.
                    </p>
                  </div>

                  {/* Dynamic Transaction & Metadata Section */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 my-8">
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Certificate ID</span>
                      <p className="text-xs font-bold font-mono text-zinc-300">{data.certificateId}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Transaction ID</span>
                      <p className="text-xs font-bold font-mono text-zinc-300">{data.transactionId}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Ticker Symbol</span>
                      <p className="text-xs font-bold font-mono text-[#00C853]">{data.stockSymbol}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Ownership Percentage</span>
                      <p className="text-xs font-bold font-mono text-[#00C853]">{countPercentage}%</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Share Price</span>
                      <p className="text-xs font-bold font-mono text-zinc-300">R{data.purchasePrice.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Total Shares</span>
                      <p className="text-xs font-bold font-mono text-zinc-300">{data.shares}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Total Investment Value</span>
                      <p className="text-sm sm:text-base font-black font-mono text-[#F9B233]">
                        R{countValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Verification, Signatures and Stamps */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-white/[0.05]">
                    {/* Issuer and Dynamic Signature */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono block">ISSUING AUTHORITY</span>
                        <p className="text-xs font-bold text-zinc-300 font-mono">{data.issuerName}</p>
                      </div>
                      
                      {/* Auto-signing animation element */}
                      <div className="relative h-10 w-44 bg-white/[0.01] border border-white/[0.05] rounded-lg flex items-center justify-center overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.8, duration: 1.5, ease: 'easeInOut' }}
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-transparent via-[#0057FF]/10 to-transparent pointer-events-none"
                        />
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2, duration: 0.8 }}
                          className="text-sm font-serif italic tracking-widest text-[#0057FF]/90 font-semibold"
                        >
                          Company Secretary
                        </motion.span>
                      </div>
                    </div>

                    {/* Gold Embossed Seal (Self stamping) */}
                    <div className="flex items-center gap-6">
                      <div className="relative w-20 h-20">
                        <motion.div
                          initial={{ scale: 2.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1.6, type: 'spring', damping: 10, stiffness: 100 }}
                          className="w-full h-full rounded-full border-2 border-dashed border-[#F9B233] bg-gradient-to-tr from-[#8A7322] to-[#F9B233] p-1 shadow-lg flex items-center justify-center text-center relative overflow-hidden"
                        >
                          <div className="absolute inset-0.5 rounded-full border border-[#F9B233]/40 bg-[#090B10] flex flex-col items-center justify-center">
                            <span className="text-[6px] text-[#F9B233] font-bold font-mono tracking-tighter">OFFICIAL</span>
                            <Award className="w-5 h-5 text-[#F9B233] my-0.5" />
                            <span className="text-[5px] text-[#F9B233] font-mono leading-none">AQX SEAL</span>
                          </div>
                        </motion.div>
                        {/* Gold sparkle burst around the seal upon impact */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                          transition={{ delay: 1.8, duration: 0.8 }}
                          className="absolute inset-0 bg-radial-gradient from-[#F9B233]/30 to-transparent pointer-events-none"
                        />
                      </div>

                      {/* Pixel-by-pixel ownership verification QR Code */}
                      <div className="relative">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.0, duration: 1.2 }}
                          className="p-2 bg-white rounded-xl flex items-center justify-center border border-zinc-200"
                        >
                          <svg className="w-16 h-16 text-black" viewBox="0 0 100 100">
                            {/* Outer QR frame */}
                            <rect x="10" y="10" width="25" height="25" fill="black" />
                            <rect x="13" y="13" width="19" height="19" fill="white" />
                            <rect x="16" y="16" width="13" height="13" fill="black" />

                            <rect x="65" y="10" width="25" height="25" fill="black" />
                            <rect x="68" y="13" width="19" height="19" fill="white" />
                            <rect x="71" y="16" width="13" height="13" fill="black" />

                            <rect x="10" y="65" width="25" height="25" fill="black" />
                            <rect x="13" y="68" width="19" height="19" fill="white" />
                            <rect x="16" y="71" width="13" height="13" fill="black" />

                            {/* Center and random dots for premium QR look */}
                            <rect x="42" y="15" width="8" height="8" fill="black" />
                            <rect x="52" y="25" width="6" height="6" fill="black" />
                            <rect x="42" y="42" width="16" height="16" fill="black" />
                            <rect x="46" y="46" width="8" height="8" fill="white" />
                            <rect x="70" y="45" width="10" height="10" fill="black" />
                            <rect x="45" y="70" width="12" height="6" fill="black" />
                            <rect x="68" y="68" width="15" height="15" fill="black" />
                            <rect x="72" y="72" width="7" height="7" fill="white" />
                          </svg>
                        </motion.div>
                        <span className="text-[7px] text-zinc-500 font-mono uppercase block text-center mt-1">SCAN TO VERIFY</span>
                      </div>
                    </div>
                  </div>

                  {/* Tiny powered bottom mark */}
                  <div className="mt-8 pt-4 border-t border-white/[0.03] flex justify-between items-center text-[9px] text-zinc-500 font-mono">
                    <span>REGISTRY SEQUENCE: #00054892</span>
                    <span className="text-right">Powered by AfriQuant Xchange</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons Hub */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mt-6"
            >
              <button
                onClick={handleDownload}
                className="w-full sm:flex-1 py-4 bg-[#00C853] hover:bg-[#00C853]/90 text-[#090B10] rounded-2xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,200,83,0.2)] hover:scale-[1.02] transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download Certificate</span>
              </button>

              <button
                onClick={onViewPortfolio}
                className="w-full sm:flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <span>View Portfolio</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full sm:w-auto p-4 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all flex items-center justify-center"
                title="Share Certificate"
              >
                {copied ? <span className="text-xs text-[#00C853] font-bold">COPIED URL!</span> : <Share2 className="w-5 h-5" />}
              </button>

              <button
                onClick={onBuyMore}
                className="w-full sm:w-auto px-6 py-4 bg-transparent hover:bg-white/5 border border-dashed border-white/20 hover:border-white/40 text-zinc-400 hover:text-white rounded-2xl transition-all font-bold text-sm uppercase tracking-wider"
              >
                Buy More Shares
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
