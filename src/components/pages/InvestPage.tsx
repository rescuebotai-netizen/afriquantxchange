import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, ShieldCheck, Zap, ArrowRight, CheckCircle2, 
  BarChart3, PieChart, Lock, UserCheck, Wallet, Activity, Compass, Flame
} from 'lucide-react';
import { SharedFooter } from './SharedFooter';
import { HeroVideoBackground } from '../ui/HeroVideoBackground';
import { PlatformVideoPlayerSection } from '../ui/PlatformVideoPlayerSection';
import { 
  KineticWordReveal, 
  TextMorph, 
  AnimatedQuoteCarousel, 
  TypewriterText,
  KineticCharacterStagger 
} from '../ui/KineticTypography';

interface InvestPageProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth?: () => void;
}

const JOURNEY_STEPS = [
  { step: '01', title: 'Create Account', desc: 'Register in under 90 seconds with instant mobile verification.', icon: UserCheck },
  { step: '02', title: 'Verify Identity', desc: 'Seamless AI KYC matching passkeys and national credentials.', icon: Lock },
  { step: '03', title: 'Deposit Funds', desc: 'Fund in local currency (NGN, KES, ZAR, EUR, USD) with zero deposit fees.', icon: Wallet },
  { step: '04', title: 'Select Strategy', desc: 'Choose long-term blue chips, pre-IPO tech, or automated AQEI bots.', icon: Compass },
  { step: '05', title: 'Track & Compounding', desc: 'Real-time 410ns tick reporting with automated dividend reinvestment.', icon: Activity }
];

const INVESTMENT_TYPES = [
  {
    title: 'Long-Term Compound Growth',
    target: '12-16% Annual Return',
    desc: 'Diversified baskets of Pan-African banking leaders, telcos, and infrastructure operators.',
    tag: 'Low Volatility',
    color: 'border-[#00C805]'
  },
  {
    title: 'High Yield Dividend Vaults',
    target: '9.4% Quarterly Dividend Yield',
    desc: 'High-payout dividend stocks and Eurobonds distributing passive quarterly cash returns.',
    tag: 'Passive Cash Flow',
    color: 'border-blue-500'
  },
  {
    title: 'Pre-IPO Tech Unicorns',
    target: '35%+ Target Capital Gain',
    desc: 'Secondary share allocations in Paystack, Flutterwave, and Moniepoint prior to NYSE listing.',
    tag: 'High Growth',
    color: 'border-amber-500'
  },
  {
    title: 'AQEI AI Autonomous Bot',
    target: '24/7 Arbitrage Execution',
    desc: 'Self-adjusting high-frequency neural algorithms capitalizing on cross-market pricing deltas.',
    tag: 'Automated AI',
    color: 'border-[#D5FF2F]'
  }
];

export function InvestPage({ onNavigatePage, onNavigateToAuth }: InvestPageProps) {
  // Compound Calculator State
  const [monthlyContribution, setMonthlyContribution] = useState<number>(300);
  const [years, setYears] = useState<number>(5);
  const [expectedRate, setExpectedRate] = useState<number>(14);

  // Math for Compound Growth
  const calculateTotal = () => {
    const r = expectedRate / 100 / 12;
    const n = years * 12;
    let balance = 0;
    for (let i = 0; i < n; i++) {
      balance = (balance + monthlyContribution) * (1 + r);
    }
    return Math.round(balance);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#D5FF2F]">
      
      {/* 1. HERO SECTION WITH YOUTUBE VIDEO BACKGROUND */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 max-w-[1280px] mx-auto text-center space-y-8 overflow-hidden">
        <HeroVideoBackground videoId="LXb3EKWsInQ" overlayOpacity={0.88} />

        <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-semibold tracking-tight leading-[1.04]">
          <KineticWordReveal text="Smart Investing" delay={0.1} /> <br />
          <TextMorph 
            words={[
              "Starts Right Here.",
              "Delivers 14.8% Yield.",
              "Protects Dollar Wealth.",
              "Automates Compounding.",
              "Captures Alpha Trends."
            ]} 
            interval={3000}
          />
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Build a resilient wealth creation plan powered by African economic growth and automated algorithmic risk management.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <button 
            onClick={onNavigateToAuth}
            className="h-[52px] px-9 rounded-full bg-[#000000] text-white hover:bg-[#D5FF2F] hover:text-[#000000] font-semibold text-base transition-all shadow-lg flex items-center gap-2 group"
          >
            <span>Start Investing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Platform Video Showcase */}
        <div className="pt-6 max-w-4xl mx-auto">
          <PlatformVideoPlayerSection title="Investment Platform Video Tour" />
        </div>
      </section>

      {/* 2. INVESTMENT JOURNEY TIMELINE */}
      <section className="py-24 bg-[#F5F5F7] border-y border-gray-200/80 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">FIVE SIMPLE STEPS</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-black">Your journey from registration to yield.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {JOURNEY_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-[0_12px_30px_rgba(0,0,0,0.04)] hover:-translate-y-2 transition-all duration-300 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#00C805] bg-[#00C805]/10 px-2.5 py-1 rounded-full">
                      STEP {step.step}
                    </span>
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-black">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INVESTMENT TYPES CARDS */}
      <section className="py-28 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">DIVERSIFIED STRATEGIES</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-black">Choose your wealth creation model.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INVESTMENT_TYPES.map((inv, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-[28px] p-8 border-2 ${inv.color} shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 space-y-5`}
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black text-white font-mono font-bold text-xs uppercase tracking-wider">
                  {inv.tag}
                </span>
                <span className="text-sm font-mono font-bold text-[#00C805]">{inv.target}</span>
              </div>
              <h3 className="text-2xl font-bold text-black">{inv.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{inv.desc}</p>
              <div className="pt-2">
                <button 
                  onClick={onNavigateToAuth}
                  className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-[#00C805] transition-colors"
                >
                  <span>Select Strategy</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PORTFOLIO COMPOUNDING CALCULATOR */}
      <section className="py-24 bg-black text-white border-y border-gray-800 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-bold text-[#D5FF2F] uppercase tracking-widest">COMPOUND CALCULATOR</span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              See how regular deposits multiply over time.
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Consistently investing small amounts into high-yielding African markets accelerates wealth building through exponential compounding.
            </p>

            <div className="space-y-6 pt-4 font-mono text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">MONTHLY CONTRIBUTION</span>
                  <span className="text-[#D5FF2F] font-bold">${monthlyContribution}/mo</span>
                </div>
                <input 
                  type="range" min="50" max="2500" step="50" 
                  value={monthlyContribution} 
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full accent-[#00C805] bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">TIME HORIZON (YEARS)</span>
                  <span className="text-white font-bold">{years} Years</span>
                </div>
                <input 
                  type="range" min="1" max="15" step="1" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-[#00C805] bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">EXPECTED ANNUAL RETURN</span>
                  <span className="text-[#00C805] font-bold">{expectedRate}% APY</span>
                </div>
                <input 
                  type="range" min="6" max="24" step="1" 
                  value={expectedRate} 
                  onChange={(e) => setExpectedRate(Number(e.target.value))}
                  className="w-full accent-[#00C805] bg-gray-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-zinc-900 rounded-[32px] p-10 border border-zinc-800 text-center space-y-6 shadow-2xl">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">PROJECTED FUTURE PORTFOLIO</span>
            <div className="text-5xl lg:text-6xl font-extrabold text-[#D5FF2F] font-mono tracking-tight">
              ${calculateTotal().toLocaleString()}
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Total Principal Invested: ${ (monthlyContribution * years * 12).toLocaleString() } • Interest Gained: ${ (calculateTotal() - (monthlyContribution * years * 12)).toLocaleString() }
            </p>
            <div className="pt-4">
              <button 
                onClick={onNavigateToAuth}
                className="w-full py-4 rounded-full bg-[#00C805] hover:bg-[#D5FF2F] text-black font-bold text-sm uppercase tracking-wider transition-all shadow-lg"
              >
                Start This Plan Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <SharedFooter onNavigatePage={onNavigatePage} onNavigateToAuth={onNavigateToAuth} />

    </div>
  );
}
