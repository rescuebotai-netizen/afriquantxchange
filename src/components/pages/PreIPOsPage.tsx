import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, 
  Building2, TrendingUp, Lock, Sparkles, AlertCircle, FileText, Scale
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


interface PreIPOsPageProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth?: () => void;
}

const PRE_IPO_COMPANIES = [
  {
    id: 'paystack',
    name: 'Paystack Secondary Equity',
    ticker: 'PAYST-SEC',
    industry: 'Fintech / Payments',
    valuation: '$1.8 Billion',
    minInvestment: '$500',
    stage: 'Series C / Pre-IPO',
    risk: 'Low-Medium',
    gainTarget: '+45%',
    logo: '💳',
    desc: 'Stripe subsidiary driving modern digital payments infrastructure across West and East Africa.'
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave Inc.',
    ticker: 'FLTW-SEC',
    industry: 'Enterprise FX & Banking',
    valuation: '$3.2 Billion',
    minInvestment: '$1,000',
    stage: 'Series D / Pre-IPO',
    risk: 'Medium',
    gainTarget: '+62%',
    logo: '⚡',
    desc: 'Cross-border payment rail processing over 200M transactions annually across 34 countries.'
  },
  {
    id: 'moniepoint',
    name: 'Moniepoint Financial',
    ticker: 'MNPT-SEC',
    industry: 'Commercial & Agent Banking',
    valuation: '$1.0 Billion',
    minInvestment: '$250',
    stage: 'Series C Unicorn',
    risk: 'Low-Medium',
    gainTarget: '+38%',
    logo: '🏧',
    desc: 'Largest agency banking network processing $12B+ monthly transaction volume.'
  },
  {
    id: 'opay',
    name: 'OPay Digital Services',
    ticker: 'OPAY-SEC',
    industry: 'Consumer Neo-Banking',
    valuation: '$2.4 Billion',
    minInvestment: '$500',
    stage: 'Late Stage Unicorn',
    risk: 'Medium',
    gainTarget: '+50%',
    logo: '📱',
    desc: 'Super-app ecosystem providing mobile wallets, micro-loans, and instant transfers to 40M+ users.'
  }
];

const TIMELINE_STAGES = [
  { stage: '1. Seed/Series A', desc: 'Venture Capital & Founders', status: 'Completed' },
  { stage: '2. Growth Scale', desc: 'Institutional Private Rounds', status: 'Completed' },
  { stage: '3. Pre-IPO Secondary', desc: 'AfriQuantX Liquidity Access Window', status: 'ACTIVE NOW', active: true },
  { stage: '4. Public Listing (IPO)', desc: 'NYSE / LSE / JSE Ring Bell', status: 'Upcoming' }
];

const FAQS = [
  {
    q: 'How does AfriQuantX source Pre-IPO secondary shares?',
    a: 'We partner directly with verified early employees, angel investors, and venture funds seeking secondary liquidity prior to public listing, acquiring non-dilutive equity transfers audited by tier-1 law firms.'
  },
  {
    q: 'What is the minimum holding period for Pre-IPO investments?',
    a: 'While Pre-IPO shares are intended for multi-year holding until the official public listing (IPO), AfriQuantX operates a secondary peer-to-peer marketplace where you can list your equity units to other verified investors at any time.'
  },
  {
    q: 'What happens if a company does not go public?',
    a: 'In the event of an acquisition, merger, or delayed IPO, share certificates automatically convert according to the shareholder agreement, preserving dividend rights and buyout liquidation preferences.'
  }
];

export function PreIPOsPage({ onNavigatePage, onNavigateToAuth }: PreIPOsPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [checkedDiligence, setCheckedDiligence] = useState<number[]>([0, 1]);

  const toggleCheck = (idx: number) => {
    if (checkedDiligence.includes(idx)) {
      setCheckedDiligence(checkedDiligence.filter(i => i !== idx));
    } else {
      setCheckedDiligence([...checkedDiligence, idx]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#D5FF2F]">
      
      {/* 1. HERO SECTION WITH YOUTUBE VIDEO BACKGROUND */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 max-w-[1280px] mx-auto text-center space-y-8 overflow-hidden">
        <HeroVideoBackground videoId="LXb3EKWsInQ" overlayOpacity={0.88} />

        <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-semibold tracking-tight leading-[1.04]">
          <KineticWordReveal text="Own Tomorrow's" delay={0.1} /> <br />
          <TextMorph 
            words={[
              "Fintech Unicorns Today.",
              "Paystack Secondary Shares.",
              "Flutterwave Growth Equity.",
              "Moniepoint Series C Rights.",
              "Pre-Listing High Yield."
            ]} 
            interval={3000}
          />
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Access institutional secondary shares in Africa’s highest-valued tech unicorns before they ring the bell on global public stock exchanges.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <button 
            onClick={onNavigateToAuth}
            className="h-[52px] px-9 rounded-full bg-black text-white hover:bg-[#D5FF2F] hover:text-black font-semibold text-base transition-all shadow-lg flex items-center gap-2"
          >
            <span>Apply for Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. WHY PRE-IPO TIMELINE */}
      <section className="py-20 bg-[#F5F5F7] border-y border-gray-200/80 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">THE VENTURE CYCLE</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-black">Capture the highest upside before the IPO.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {TIMELINE_STAGES.map((t, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-[24px] border transition-all ${t.active ? 'bg-black text-white border-gray-800 shadow-xl scale-105' : 'bg-white border-gray-200/80 text-black'}`}
              >
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${t.active ? 'bg-[#D5FF2F] text-black' : 'bg-gray-100 text-gray-600'}`}>
                  {t.status}
                </span>
                <h4 className="text-lg font-bold mt-4 mb-1">{t.stage}</h4>
                <p className={`text-xs ${t.active ? 'text-gray-400' : 'text-gray-500'}`}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AVAILABLE OPPORTUNITIES GRID */}
      <section className="py-24 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">VERIFIED SECONDARY OFFERINGS</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-black">Live Pre-IPO Unicorn Equities.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRE_IPO_COMPANIES.map((company) => (
            <div 
              key={company.id}
              className="bg-white rounded-[28px] p-8 border border-gray-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{company.logo}</span>
                    <div>
                      <h3 className="text-xl font-bold text-black">{company.name}</h3>
                      <span className="text-xs font-mono text-gray-400">{company.ticker} • {company.industry}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#00C805] font-mono font-bold text-xs">
                    {company.gainTarget} Target Upside
                  </span>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed">{company.desc}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center font-mono text-xs">
                <div className="bg-[#F5F5F7] p-3 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">VALUATION</span>
                  <span className="font-bold text-black">{company.valuation}</span>
                </div>
                <div className="bg-[#F5F5F7] p-3 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">MIN INVEST</span>
                  <span className="font-bold text-black">{company.minInvestment}</span>
                </div>
                <div className="bg-[#F5F5F7] p-3 rounded-xl">
                  <span className="text-gray-400 block text-[10px]">STAGE</span>
                  <span className="font-bold text-black">{company.stage}</span>
                </div>
              </div>

              <button 
                onClick={onNavigateToAuth}
                className="w-full py-3.5 rounded-full bg-black text-white hover:bg-[#D5FF2F] hover:text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                Request Share Certificate Allocation
              </button>
            </div>
          ))}
        </div>
      </section>



      {/* 4. DUE DILIGENCE CHECKLIST */}
      <section className="py-20 bg-black text-white border-y border-gray-800 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-bold text-[#D5FF2F] uppercase tracking-widest">INSTITUTIONAL GRADE SECURITY</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-white">Interactive Due Diligence Checklist.</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every Pre-IPO asset listed on AfriQuantX passes through a rigorous 4-step compliance audit and cap table verification process.
            </p>
          </div>

          <div className="lg:col-span-6 bg-zinc-900 rounded-[28px] p-8 border border-zinc-800 space-y-4">
            {[
              'Independent Tier-1 Law Firm Cap Table Verification',
              'Audited Financial Statements & 3-Year Revenue Verification',
              'SEC & FINRA Compliant Special Purpose Vehicle (SPV) Structuring',
              'AQEI AI Sentiment Analysis & Volatility Stress Testing'
            ].map((item, idx) => {
              const isChecked = checkedDiligence.includes(idx);
              return (
                <div 
                  key={idx} 
                  onClick={() => toggleCheck(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${isChecked ? 'bg-zinc-800/80 border-[#00C805] text-white' : 'bg-zinc-950 border-zinc-800 text-gray-500'}`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs ${isChecked ? 'bg-[#00C805] text-black' : 'border border-gray-600'}`}>
                    {isChecked && '✓'}
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4.5 VENTURE CAPITAL & FOUNDER ANIMATED QUOTES */}
      <section className="py-20 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">FOUNDER & INVESTOR INSIGHTS</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-black">
            What tech founders & venture funds say about secondary liquidity.
          </h2>
        </div>

        <AnimatedQuoteCarousel 
          quotes={[
            {
              author: 'Shola Akinlade',
              role: 'Co-Founder & CEO',
              company: 'Paystack (Acquired by Stripe)',
              quote: 'Secondary liquidity platforms like AfriQuantX empower early employees to realize wealth without putting premature pressure on public listing timelines.',
              roi: '$1.8B VALUATION',
              avatar: '🚀'
            },
            {
              author: 'Olugbenga Agboola',
              role: 'Founder & CEO',
              company: 'Flutterwave Inc.',
              quote: 'Connecting global institutional LPs directly to Pan-African pre-IPO liquidity pools is essential for the next decade of African technology scale.',
              roi: '$3.2B VALUATION',
              avatar: '⚡'
            },
            {
              author: 'Tosin Eniolorunda',
              role: 'Founder',
              company: 'Moniepoint Financial',
              quote: 'Democratizing pre-IPO equity access allows retail investors in Lagos, Nairobi, and Johannesburg to share in the upside of African banking infrastructure.',
              roi: '$1.0B UNICORN',
              avatar: '🏦'
            }
          ]} 
          autoPlayInterval={5500}
        />
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className="py-24 px-6 lg:px-12 max-w-[960px] mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-3xl font-semibold text-black">Everything you need to know about Pre-IPOs.</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer shadow-sm hover:border-gray-400 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between font-bold text-base text-black">
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#00C805]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
                {isOpen && (
                  <p className="text-xs text-gray-500 leading-relaxed pt-2 border-t border-gray-100">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <SharedFooter onNavigatePage={onNavigatePage} onNavigateToAuth={onNavigateToAuth} />

    </div>
  );
}
