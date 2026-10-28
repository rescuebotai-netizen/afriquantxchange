import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, Sparkles, Zap, Activity, ShieldCheck, ArrowRight, 
  Database, Network, BrainCircuit, RefreshCw, BarChart2, CheckCircle2
} from 'lucide-react';
import { SharedFooter } from './SharedFooter';
import { 
  KineticWordReveal, 
  TextMorph, 
  AnimatedQuoteCarousel, 
  TypewriterText,
  KineticCharacterStagger 
} from '../ui/KineticTypography';
import { HeroVideoBackground } from '../ui/HeroVideoBackground';
import { AIDecisionTreeFlow } from '../ui/InteractiveFintechGraphics';

interface AQEIEnginePageProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth?: () => void;
}

const DEMO_COMPANIES = [
  { name: 'Paystack Secondary', ticker: 'PAYST', riskScore: 92, growth: '+24.5%', rec: 'STRONG BUY', confidence: '98.7%' },
  { name: 'Dangote Cement', ticker: 'DANGCEM', riskScore: 88, growth: '+14.2%', rec: 'BUY', confidence: '96.2%' },
  { name: 'Flutterwave Inc.', ticker: 'FLTW', riskScore: 84, growth: '+31.0%', rec: 'STRONG BUY', confidence: '97.9%' },
  { name: 'Naspers Ltd', ticker: 'NPN', riskScore: 90, growth: '+18.6%', rec: 'BUY', confidence: '99.1%' },
  { name: 'Safaricom PLC', ticker: 'SCOM', riskScore: 86, growth: '+12.8%', rec: 'ACCUMULATE', confidence: '95.4%' }
];

export function AQEIEnginePage({ onNavigatePage, onNavigateToAuth }: AQEIEnginePageProps) {
  const [selectedCompanyIdx, setSelectedCompanyIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCo = DEMO_COMPANIES[selectedCompanyIdx];

  const handleSelectCompany = (idx: number) => {
    setIsGenerating(true);
    setSelectedCompanyIdx(idx);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white font-sans selection:bg-[#D5FF2F]">
      
      {/* 1. HERO SECTION WITH YOUTUBE VIDEO BACKGROUND */}
      <section className="relative pt-36 pb-28 px-6 lg:px-12 max-w-[1280px] mx-auto text-center space-y-8 overflow-hidden">
        <HeroVideoBackground videoId="LXb3EKWsInQ" overlayOpacity={0.88} darkMode={true} />

        <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-semibold tracking-tight leading-[1.04] text-white">
          The Intelligence Behind <br />
          <TextMorph 
            words={[
              "Every Investment Signal.",
              "Cross-Border FX Hedging.",
              "Pre-IPO Valuation Models.",
              "Sovereign Debt Risk Analysis.",
              "Autonomous Portfolio Alpha."
            ]} 
            interval={3200}
            className="text-emerald-400"
          />
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          DeepMind-inspired neural network analyzing alternative satellite imagery, mobile money flows, and macroeconomic signals across 14 African capital markets.
        </p>

        {/* Neural Network Node Animation Preview Box */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="bg-zinc-900/90 rounded-[28px] p-8 border border-zinc-800 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800 pb-4">
              <span className="flex items-center gap-2 text-[#00C805]">
                <span className="w-2 h-2 rounded-full bg-[#00C805] animate-ping" />
                NEURAL ENGINE LIVE (410ns LATENCY)
              </span>
              <span>1.4 BILLION SIGNALS / DAY</span>
            </div>

            <div className="grid grid-cols-4 gap-4 py-4 text-center">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block">DATA NODES</span>
                <span className="text-lg font-bold font-mono text-white">14,200+</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block">MODELS ACTIVE</span>
                <span className="text-lg font-bold font-mono text-[#D5FF2F]">38</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block">ACCURACY</span>
                <span className="text-lg font-bold font-mono text-[#00C805]">98.4%</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 block">AUM COVERED</span>
                <span className="text-lg font-bold font-mono text-white">$42.8B</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI ARCHITECTURE FLOW & INTERACTIVE PIPELINE */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-800 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <AIDecisionTreeFlow />
        </div>
      </section>

      {/* 3. INTERACTIVE AI DEMO COMPONENT */}
      <section className="py-28 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D5FF2F]">LIVE AI DEMO</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white">Test AQEI Engine in Real-Time.</h2>
        </div>

        <div className="bg-zinc-900 rounded-[32px] p-8 lg:p-12 border border-zinc-800 space-y-8 shadow-2xl">
          <div className="space-y-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">SELECT AN AFRICAN ASSET:</span>
            <div className="flex flex-wrap gap-3">
              {DEMO_COMPANIES.map((co, idx) => (
                <button
                  key={co.ticker}
                  onClick={() => handleSelectCompany(idx)}
                  className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all border ${selectedCompanyIdx === idx ? 'bg-[#00C805] text-black border-[#00C805] shadow-lg scale-105' : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'}`}
                >
                  {co.name} ({co.ticker})
                </button>
              ))}
            </div>
          </div>

          {/* AI Output Card */}
          <div className="bg-zinc-950 rounded-[24px] p-8 border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {isGenerating ? (
              <div className="col-span-3 py-12 flex flex-col items-center justify-center space-y-3 text-zinc-400">
                <RefreshCw className="w-8 h-8 text-[#00C805] animate-spin" />
                <span className="font-mono text-xs">Synthesizing 14,000 Neural Signals...</span>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-mono text-zinc-500 uppercase">RISK SCORE</span>
                  <div className="text-4xl font-extrabold font-mono text-white">{selectedCo.riskScore}/100</div>
                  <span className="text-[11px] font-mono text-[#00C805]">Low Systemic Volatility</span>
                </div>

                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-mono text-zinc-500 uppercase">12M GROWTH FORECAST</span>
                  <div className="text-4xl font-extrabold font-mono text-[#D5FF2F]">{selectedCo.growth}</div>
                  <span className="text-[11px] font-mono text-zinc-400">Confidence: {selectedCo.confidence}</span>
                </div>

                <div className="space-y-3 text-center md:text-right">
                  <span className="text-xs font-mono text-zinc-500 uppercase block">AQEI RECOMMENDATION</span>
                  <span className="inline-block px-5 py-2 rounded-full bg-[#00C805]/20 text-[#00C805] border border-[#00C805]/40 font-mono font-bold text-sm uppercase">
                    {selectedCo.rec}
                  </span>
                  <button 
                    onClick={onNavigateToAuth}
                    className="w-full mt-2 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#D5FF2F] transition-colors"
                  >
                    Execute Trade via AQEI
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. QUANTITATIVE RESEARCH & INSTITUTIONAL TESTIMONIAL QUOTES */}
      <section className="py-24 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D5FF2F]">QUANTITATIVE TESTIMONIALS</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white">
            Endorsed by chief risk officers & quant researchers.
          </h2>
        </div>

        <AnimatedQuoteCarousel 
          darkTheme={true}
          quotes={[
            {
              author: 'Prof. Adebayo Ogunlesi',
              role: 'Head of Financial Engineering',
              company: 'Pan-African Risk Lab',
              quote: 'The AQEI Engine handles African sovereign debt liquidity modeling better than legacy Bloomberg terminals. 410ns latency with zero false positives.',
              roi: '99.8% ACCURACY',
              avatar: '👨‍🏫'
            },
            {
              author: 'Marcus Vance',
              role: 'Chief Risk Officer',
              company: 'Atlas Macro Hedge Fund',
              quote: 'Using AQEI neural models to dynamically hedge NGN and ZAR exposure reduced our portfolio drawdown by 18.4% during sovereign rate hikes.',
              roi: '-18.4% DRAWDOWN',
              avatar: '🛡️'
            },
            {
              author: 'Dr. Soraya Benali',
              role: 'Quantitative Strategist',
              company: 'Casablanca Capital',
              quote: 'Alternative satellite imagery coupled with mobile money velocity calculations gives AQEI an unfair 3-week predictive advantage over traditional SEC filings.',
              roi: '+28.6% ALPHA',
              avatar: '👩‍💻'
            }
          ]} 
          autoPlayInterval={6000}
        />
      </section>

      {/* FOOTER */}
      <SharedFooter onNavigatePage={onNavigatePage} onNavigateToAuth={onNavigateToAuth} />

    </div>
  );
}
