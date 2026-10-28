import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, BarChart3, ShieldCheck, Zap, Layers, Globe, 
  ArrowRight, Check, Sparkles, DollarSign, PieChart, Cpu, Clock, CheckCircle2
} from 'lucide-react';
import { SharedFooter } from './SharedFooter';
import { MaterializeCardSection } from '../ui/MaterializeCardSection';
import { HeroVideoBackground } from '../ui/HeroVideoBackground';
import { CustomerJourneyFlow } from '../ui/InteractiveFintechGraphics';
import { 
  KineticWordReveal, 
  TextMorph, 
  AnimatedQuoteCarousel, 
  TypewriterText,
  KineticCharacterStagger 
} from '../ui/KineticTypography';

interface ProductsPageProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth?: () => void;
}

const PRODUCT_CATEGORIES = [
  {
    id: 'stocks',
    title: 'African & US Stocks',
    tagline: 'Fractional Shares & Instant Settlement',
    desc: 'Trade dual-listed blue chips on NGX, JSE, NSE, and US exchanges from $1. Zero commission.',
    icon: TrendingUp,
    badge: '0% Commission',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    metrics: ['14 Exchanges', 'Fractional Shares', '410ns Clearance']
  },
  {
    id: 'etfs',
    title: 'Pan-African ETFs',
    tagline: 'Broad Market & Sector Diversification',
    desc: 'Access thematic funds covering Tech Unicorns, Banking Giants, Clean Energy, and Gold Mining.',
    icon: PieChart,
    badge: 'Instant Yield',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    metrics: ['Auto-Rebalancing', '0.15% Expense Ratio', 'Dividend Reinvest']
  },
  {
    id: 'pre-ipos',
    title: 'Pre-IPO Secondary Equity',
    tagline: 'Private Unicorn Access',
    desc: 'Invest in Paystack, Flutterwave, and Moniepoint secondary shares before public exchange listing.',
    icon: Zap,
    badge: 'Exclusive',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    metrics: ['Verified Cap Table', '$500 Minimum', 'Secondary Liquidity']
  },
  {
    id: 'bonds',
    title: 'High-Yield Sovereign Bonds',
    tagline: 'Capital Preservation & Fixed Return',
    desc: 'Dollar-denominated Eurobonds and local Treasury bills delivering up to 14.8% annual returns.',
    icon: ShieldCheck,
    badge: '14.8% APY',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    metrics: ['Quarterly Payouts', 'Government Backed', 'Zero Risk Rating']
  },
  {
    id: 'ai-portfolios',
    title: 'AQEI Autonomous AI Portfolios',
    tagline: 'Algorithmic Risk-Managed Funds',
    desc: 'Let DeepMind-trained neural models execute high-frequency arbitrage and dynamic asset rotation.',
    icon: Cpu,
    badge: 'AI Powered',
    color: 'bg-black text-[#D5FF2F] border-gray-800',
    metrics: ['24/7 Monitoring', '0.04% Max Slippage', 'Auto Stop-Loss']
  },
  {
    id: 'business',
    title: 'Corporate Treasury Vaults',
    tagline: 'Institutional Cash Management',
    desc: 'Multi-currency yield vaults designed for high-growth tech ventures and enterprise balance sheets.',
    icon: Layers,
    badge: 'Institutional',
    color: 'bg-zinc-100 text-zinc-900 border-zinc-300',
    metrics: ['FDIC Insured Nodes', 'Multi-Sig Approval', 'Dedicated RM']
  }
];

export function ProductsPage({ onNavigatePage, onNavigateToAuth }: ProductsPageProps) {
  // Interactive Portfolio Builder Slider State
  const [riskLevel, setRiskLevel] = useState<number>(3); // 1 to 5
  const [initialDeposit, setInitialDeposit] = useState<number>(5000);
  const [durationYears, setDurationYears] = useState<number>(5);

  // Calculate estimated returns
  const returnRate = 0.08 + (riskLevel * 0.022); // 10.2% to 19%
  const estimatedReturn = Math.round(initialDeposit * Math.pow(1 + returnRate, durationYears));

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#D5FF2F]">
      
      {/* 1. HERO SECTION WITH YOUTUBE VIDEO BACKGROUND */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 max-w-[1280px] mx-auto text-center space-y-8 overflow-hidden">
        <HeroVideoBackground videoId="LXb3EKWsInQ" overlayOpacity={0.88} />

        <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-semibold tracking-tight leading-[1.04]">
          <KineticWordReveal text="Everything You Need to" delay={0.1} /> <br />
          <TextMorph 
            words={[
              "Build Generational Wealth.",
              "Trade Dual-Listed Stocks.",
              "Access Sovereign Eurobonds.",
              "Invest in Pre-IPO Unicorns.",
              "Automate Yield via AI."
            ]} 
            interval={3000}
          />
        </h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
        >
          From fractional African blue chips to private unicorn equity and autonomous AI yield engines—all managed under a single unified login.
        </motion.p>

        {/* 3D Floating Investment Cards Hero Mockup */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div 
            whileHover={{ y: -6 }}
            className="p-6 rounded-[24px] bg-white border border-gray-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00C805] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg">Public Equities</h4>
            <p className="text-xs text-gray-500">Dual-listed stocks across Lagos, Joburg, London, and New York.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6 }}
            className="p-6 rounded-[24px] bg-black text-white border border-gray-800 shadow-xl space-y-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D5FF2F] text-black flex items-center justify-center font-bold">
              IPO
            </div>
            <h4 className="font-bold text-lg text-white">Pre-IPO Equity</h4>
            <p className="text-xs text-gray-400">Direct allocation in Paystack, Flutterwave, and Moniepoint.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6 }}
            className="p-6 rounded-[24px] bg-white border border-gray-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg">AQEI Engine</h4>
            <p className="text-xs text-gray-500">Autonomous neural network executing 24/7 cross-border yield.</p>
          </motion.div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES GRID */}
      <section className="py-20 bg-[#F5F5F7] border-y border-gray-200/80 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">SIX ASSET CLASSES</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-black">Structured for every investor tier.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCT_CATEGORIES.map((prod) => {
              const Icon = prod.icon;
              return (
                <div 
                  key={prod.id} 
                  className="bg-white rounded-[24px] p-8 border border-gray-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center p-3">
                        <Icon className="w-6 h-6 text-[#D5FF2F]" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${prod.color}`}>
                        {prod.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-semibold text-black">{prod.title}</h3>
                    <p className="text-xs font-mono text-[#00C805] font-bold">{prod.tagline}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{prod.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2 font-mono text-xs text-gray-600">
                    {prod.metrics.map((m, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00C805]" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PORTFOLIO BUILDER SLIDER */}
      <section className="py-28 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">INTERACTIVE SIMULATOR</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-black">Customize your portfolio strategy.</h2>
        </div>

        <div className="bg-black text-white rounded-[32px] p-8 lg:p-14 border border-gray-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Controls Left */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Initial Investment Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-400">INITIAL INVESTMENT</span>
                <span className="text-[#D5FF2F] font-bold">${initialDeposit.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="50000" 
                step="500"
                value={initialDeposit} 
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className="w-full accent-[#00C805] bg-gray-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Risk Level Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-400">RISK ARCHETYPE</span>
                <span className="text-white font-bold">
                  {riskLevel === 1 && 'Conservative Sovereign Bonds'}
                  {riskLevel === 2 && 'Balanced Blue-Chip & ETFs'}
                  {riskLevel === 3 && 'Growth Tech & Public Equities'}
                  {riskLevel === 4 && 'Pre-IPO Tech Unicorns'}
                  {riskLevel === 5 && 'High-Frequency AQEI AI Bot'}
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1"
                value={riskLevel} 
                onChange={(e) => setRiskLevel(Number(e.target.value))}
                className="w-full accent-[#00C805] bg-gray-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Duration Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-gray-400">INVESTMENT HORIZON</span>
                <span className="text-white font-bold">{durationYears} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={durationYears} 
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full accent-[#00C805] bg-gray-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Results Display Right */}
          <div className="lg:col-span-5 bg-zinc-900 rounded-[24px] p-8 border border-zinc-800 text-center space-y-6">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block">ESTIMATED PROJECTED VALUE</span>
            <div className="text-4xl lg:text-5xl font-extrabold text-[#D5FF2F] tracking-tight font-mono">
              ${estimatedReturn.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-[#00C805] bg-[#00C805]/10 py-2 px-4 rounded-full inline-block">
              +{(returnRate * 100).toFixed(1)}% Projected Compound Return Rate
            </div>
            <div className="pt-4">
              <button 
                onClick={onNavigateToAuth}
                className="w-full py-4 rounded-full bg-[#00C805] hover:bg-[#D5FF2F] text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg"
              >
                Create Custom Portfolio
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3.5 MATERIALIZE & DEMATERIALIZE CARD SECTION */}
      <MaterializeCardSection onNavigateToAuth={onNavigateToAuth} />

      {/* FINTECH PROCESS VISUALS */}
      <section className="py-12 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-8">
        <CustomerJourneyFlow />
      </section>

      {/* 4. TRANSPARENT PRICING COMPARISON TABLE */}
      <section className="py-20 bg-white border-t border-gray-100 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">TRANSPARENT PRICING</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-black">Zero hidden management fees.</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase">
                  <th className="py-4 px-6">FEATURE / PRICING TIER</th>
                  <th className="py-4 px-6 text-black">STARTER</th>
                  <th className="py-4 px-6 text-[#00C805]">PRO INVESTOR</th>
                  <th className="py-4 px-6 text-purple-600">INSTITUTIONAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-6 font-sans font-semibold text-black">Account Minimum</td>
                  <td className="py-4 px-6">$0</td>
                  <td className="py-4 px-6">$1,000</td>
                  <td className="py-4 px-6">$50,000</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-sans font-semibold text-black">Stock & ETF Trades</td>
                  <td className="py-4 px-6 text-[#00C805] font-bold">$0 Commission</td>
                  <td className="py-4 px-6 text-[#00C805] font-bold">$0 Commission</td>
                  <td className="py-4 px-6 text-[#00C805] font-bold">$0 Commission</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-sans font-semibold text-black">Pre-IPO Secondary Access</td>
                  <td className="py-4 px-6 text-gray-400">Standard Tier</td>
                  <td className="py-4 px-6 text-black font-bold">Priority Allocation</td>
                  <td className="py-4 px-6 text-purple-600 font-bold">Guaranteed Direct Share</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-sans font-semibold text-black">AQEI AI Bot Execution</td>
                  <td className="py-4 px-6 text-gray-400">Basic Signals</td>
                  <td className="py-4 px-6 text-[#00C805] font-bold">Full Autonomous Bot</td>
                  <td className="py-4 px-6 text-purple-600 font-bold">Custom Neural Weights</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-sans font-semibold text-black">FX Settlement Fee</td>
                  <td className="py-4 px-6">0.15%</td>
                  <td className="py-4 px-6 font-bold text-[#00C805]">0.05%</td>
                  <td className="py-4 px-6 font-bold text-purple-600">0.00% Zero-Spread</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SharedFooter onNavigatePage={onNavigatePage} onNavigateToAuth={onNavigateToAuth} />

    </div>
  );
}
