import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize2, ShieldCheck, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { LiveMarketTicker } from './LiveMarketTicker';

interface PlatformVideoPlayerSectionProps {
  videoId?: string;
  title?: string;
  subtitle?: string;
}

export function PlatformVideoPlayerSection({
  videoId = 'M-QFGiwUCPA',
  title = 'Watch AfriQuantX in Action',
  subtitle = 'Experience our sub-millisecond quantitative engine, automated risk controls, and institutional cross-border settlement in real-time.'
}: PlatformVideoPlayerSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full bg-[#000000] border-y border-white/10 text-white overflow-hidden">
      
      {/* Integrated Live Market Ticker in Video Section */}
      <div className="w-full border-b border-white/10">
        <LiveMarketTicker />
      </div>

      <div className="relative py-16">
        {/* Glow Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gradient-to-r from-blue-600/15 via-emerald-500/15 to-[#D9A94E]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Main Stretched Container */}
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 xl:px-24 space-y-6">
          
          {/* Video Frame */}
          <div className="relative aspect-[21/9] sm:aspect-video w-full bg-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden group">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1&playsinline=1`}
                title="AfriQuantX Institutional Platform Video"
                className="w-full h-full object-cover border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center">
                {/* Fallback Poster Card */}
                <div className="text-center space-y-4 p-8 z-10">
                  <div className="w-16 h-16 rounded-full bg-blue-600/30 border border-blue-500 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{title}</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">{subtitle}</p>
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Play Full Platform Video
                  </button>
                </div>
              </div>
            )}

            {/* Top Video Header Overlay Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AFRIQUANTX PLATFORM SHOWCASE 2026</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-[#D5FF2F]">
                <Cpu className="w-3.5 h-3.5 text-[#00C805]" />
                <span>QUANTITATIVE ENGINE v4.2 DEMO</span>
              </div>
            </div>

            {/* Bottom Floating Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-black/80 hover:bg-black text-white border border-white/10 backdrop-blur-md transition-all"
                  title={isPlaying ? 'Pause Video' : 'Play Video'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-xl bg-black/80 hover:bg-black text-white border border-white/10 backdrop-blur-md transition-all"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Video Caption & Callout Bar */}
          <div className="p-6 md:p-8 bg-zinc-950/80 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h4>
              <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">{subtitle}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>SEC & Central Bank Compliant</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
