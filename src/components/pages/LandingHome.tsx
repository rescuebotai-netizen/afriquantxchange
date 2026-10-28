import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, ShieldCheck, Zap, ArrowRight, Play, CheckCircle2, 
  Sparkles, Layers, Cpu, Globe, PieChart, Star, ChevronRight, Lock, 
  BarChart3, Activity, UserCheck, DollarSign, Smartphone, CreditCard,
  Building2, Award, Landmark, Wallet, Check
} from 'lucide-react';
import { AfricanGlobeCanvas } from './AfricanGlobeCanvas';
import { SharedFooter } from './SharedFooter';
import { 
  KineticWordReveal, 
  TextMorph, 
  AnimatedQuoteCarousel, 
  TypewriterText 
} from '../ui/KineticTypography';
import { PanAfricanHeroSection } from '../ui/PanAfricanHeroSection';
import { MaterializeCardSection } from '../ui/MaterializeCardSection';
import { HeroVideoBackground } from '../ui/HeroVideoBackground';
import { 
  SecurityVaultCard, 
  CustomerJourneyFlow 
} from '../ui/InteractiveFintechGraphics';
import { AfriQuantXInvestmentBankSection } from '../ui/AfriQuantXInvestmentBankSection';
import { PlatformVideoPlayerSection } from '../ui/PlatformVideoPlayerSection';
import { AfricanPartnersMarquee } from '../ui/AfricanPartnersMarquee';
import { RealTimePortfolioCommand } from '../ui/RealTimePortfolioCommand';

interface LandingHomeProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard?: () => void;
}

export function LandingHome({ onNavigatePage, onNavigateToAuth, onNavigateToDashboard }: LandingHomeProps) {
  // Plan/Account Tier selection tab state (Revolut style: Standard, Plus, Premium, Metal, Ultra)
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'plus' | 'premium' | 'metal' | 'ultra'>('metal');
  
  // Interactive Product Toggle: Physical / Virtual / Sovereign Vault
  const [activeAssetMode, setActiveAssetMode] = useState<'equities' | 'preipo' | 'eurobonds' | 'forex'>('equities');

  // Interactive AQEI Score State in Preview Section
  const [selectedAsset, setSelectedAsset] = useState('PAYST');

  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: '$0',
      period: '/ month',
      description: 'Zero-commission Pan-African investing & multi-currency account.',
      badge: 'Free Forever',
      badgeColor: 'bg-zinc-100 text-zinc-700',
      features: [
        'Zero commission on dual-listed equities',
        'NGN, ZAR, KES, USD multi-currency wallet',
        'Basic AQEI Risk Index scores',
        'Instant P2P transfers across Africa',
        'Virtual virtual debit card'
      ],
      popular: false,
      ctaText: 'Get Standard Free'
    },
    {
      id: 'plus',
      name: 'Plus',
      price: '$9.99',
      period: '/ month',
      description: 'Priority FX clearing rates and dedicated pre-IPO allocations.',
      badge: 'Smart Saver',
      badgeColor: 'bg-blue-50 text-blue-700',
      features: [
        'Everything in Standard',
        'Preferred sub-second FX conversion spreads',
        'Early access to Pre-IPO seed rounds',
        'Custom virtual cards with disposable numbers',
        'Automated monthly dividend reinvestment'
      ],
      popular: false,
      ctaText: 'Start 30-Day Free Trial'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: '/ month',
      description: 'Comprehensive algorithmic execution with DeepMind risk hedging.',
      badge: 'High Yield',
      badgeColor: 'bg-purple-50 text-purple-700',
      features: [
        'Everything in Plus',
        'Unlimited sub-second FX exchange at real interbank rates',
        'Autonomous AI quantitative rebalancing',
        'Global medical & purchase purchase insurance',
        'Higher daily ATM & instant wire withdrawal limits'
      ],
      popular: false,
      ctaText: 'Upgrade to Premium'
    },
    {
      id: 'metal',
      name: 'Metal',
      price: '$34.99',
      period: '/ month',
      description: '18g solid steel brushed card, 1.0% cashback & institutional pre-IPOs.',
      badge: 'Most Popular',
      badgeColor: 'bg-[#0A0A0A] text-white',
      accentGlow: 'border-2 border-black shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
      features: [
        '18g Solid Brushed Metal Card in Platinum or Black',
        'Up to 1.0% cashback on all stock & merchant purchases',
        'Direct access to Series B/C private unicorn shares',
        'Zero-markup Sovereign Eurobond secondary desk',
        '24/7 dedicated wealth advisory concierge'
      ],
      popular: true,
      ctaText: 'Get Metal Account'
    },
    {
      id: 'ultra',
      name: 'Ultra',
      price: '$69.99',
      period: '/ month',
      description: 'Platinum-plated luxury card, airport lounge access & syndicate co-investing.',
      badge: 'Platinum Prestige',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      features: [
        'Platinum-plated precision laser-etched metal card',
        'Unlimited complimentary worldwide airport lounge access',
        'Zero commission on block trades up to $5,000,000',
        'Direct syndicate co-investing with Tier 1 African VCs',
        'Full capital loss protection up to $250,000'
      ],
      popular: false,
      ctaText: 'Join Ultra Club'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#191C1F] font-sans selection:bg-[#0666EB] selection:text-white overflow-x-hidden">
      
      {/* 1. PAN-AFRICAN CAPITAL INFRASTRUCTURE HERO SECTION */}
      <PanAfricanHeroSection 
        onNavigateToAuth={onNavigateToAuth}
        onNavigatePage={onNavigatePage}
        onNavigateToDashboard={onNavigateToDashboard}
      />

      {/* 3. PARTNER & UNICORN LOGOS SECTION */}
      <section className="w-full space-y-0">
        <PlatformVideoPlayerSection videoId="M-QFGiwUCPA" />
        <AfricanPartnersMarquee />
      </section>

      {/* 4. RHYTHMIC FULL-BLEED SECTION 1: STATS & CLEARING METRICS (SOFT LIGHT GREY #F5F5F7) */}
      <section className="py-24 bg-[#F5F5F7] border-y border-black/[0.05] px-6 sm:px-12 lg:px-16 xl:px-24 w-full">
        <div className="w-full space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
              Built for speed, security, and institutional volume.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-8 rounded-2xl bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <span className="text-4xl lg:text-6xl font-black text-[#0A0A0A] tracking-tight">$42.8B+</span>
              <span className="text-xs font-semibold text-[#6E737B] block uppercase tracking-wider">ASSETS UNDER MANAGEMENT</span>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <span className="text-4xl lg:text-6xl font-black text-[#10B981] tracking-tight">300k+</span>
              <span className="text-xs font-semibold text-[#6E737B] block uppercase tracking-wider">ACTIVE INVESTORS</span>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <span className="text-4xl lg:text-6xl font-black text-[#0666EB] tracking-tight">14</span>
              <span className="text-xs font-semibold text-[#6E737B] block uppercase tracking-wider">AFRICAN EXCHANGES</span>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <span className="text-4xl lg:text-6xl font-black text-[#0A0A0A] tracking-tight">99.99%</span>
              <span className="text-xs font-semibold text-[#6E737B] block uppercase tracking-wider">CLEARING UPTIME</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY AFRIQUANTX — 3 EQUAL-WIDTH FEATURE CARDS (WHITE SECTION) */}
      <section className="py-28 px-6 sm:px-12 lg:px-16 xl:px-24 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
            Every tool you need to build serious wealth.
          </h2>
          <p className="text-base sm:text-lg text-[#6E737B] max-w-2xl mx-auto">
            Engineered with the polish of Apple and the high-frequency execution of London & Johannesburg trading floors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[#F5F5F7] rounded-3xl p-8 sm:p-10 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 space-y-6 group flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7 text-[#0666EB]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Quantitative Intelligence</h3>
                <p className="text-sm text-[#6E737B] leading-relaxed">
                  Algorithmic models process 1.4B daily signals across NGX, JSE, NSE and LSE to dynamically hedge FX risk and maximize yields.
                </p>
              </div>
            </div>
            <button 
              onClick={onNavigateToAuth}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0A0A0A] group-hover:text-[#0666EB] transition-colors pt-4"
            >
              <span>Get Started</span> <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-[#F5F5F7] rounded-3xl p-8 sm:p-10 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 space-y-6 group flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <PieChart className="w-7 h-7 text-[#10B981]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Fractional Pre-IPOs</h3>
                <p className="text-sm text-[#6E737B] leading-relaxed">
                  Own private equity in Africa's billion-dollar tech unicorns (Paystack, Flutterwave, Moniepoint) starting from just $10.
                </p>
              </div>
            </div>
            <button 
              onClick={onNavigateToAuth}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0A0A0A] group-hover:text-[#10B981] transition-colors pt-4"
            >
              <span>View Opportunities</span> <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-[#F5F5F7] rounded-3xl p-8 sm:p-10 border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 space-y-6 group flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-[#7C4DFF]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">Multi-Currency Wallet</h3>
                <p className="text-sm text-[#6E737B] leading-relaxed">
                  Hold, convert, and spend NGN, ZAR, KES, EUR, GBP, and USD with zero spread markups and instant bank wire settlement.
                </p>
              </div>
            </div>
            <button 
              onClick={onNavigateToAuth}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0A0A0A] group-hover:text-[#7C4DFF] transition-colors pt-4"
            >
              <span>Explore Multi-Currency</span> <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. REAL-TIME PORTFOLIO COMMAND */}
      <RealTimePortfolioCommand onNavigateToAuth={onNavigateToAuth} />

      {/* 7. PLAN TIERS GRID (STANDARD, PLUS, PREMIUM, METAL, ULTRA — REVOLUT ARCHETYPE) */}
      <section className="py-28 px-6 sm:px-12 lg:px-16 xl:px-24 w-full space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
            Choose your level of execution.
          </h2>
          <p className="text-base sm:text-lg text-[#6E737B] max-w-xl mx-auto">
            From zero-commission retail accounts to platinum metal cards and direct institutional syndicates.
          </p>
        </div>

        {/* 5-Column Grid on Desktop, Clean Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`
                  rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between relative
                  ${plan.popular 
                    ? 'bg-black text-white shadow-2xl scale-100 lg:scale-[1.03] z-20 border-2 border-black' 
                    : 'bg-[#F5F5F7] text-[#191C1F] hover:bg-[#EBEBEF] border border-black/[0.04]'
                  }
                `}
              >
                {/* Tier Top Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                    {plan.popular && (
                      <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                    )}
                  </div>

                  <div>
                    <h3 className={`text-2xl font-extrabold tracking-tight ${plan.popular ? 'text-white' : 'text-[#0A0A0A]'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${plan.popular ? 'text-zinc-400' : 'text-[#6E737B]'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className={`text-3xl font-black tracking-tight ${plan.popular ? 'text-white' : 'text-[#0A0A0A]'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs ${plan.popular ? 'text-zinc-400' : 'text-[#6E737B]'}`}>
                      {plan.period}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 pt-4 border-t border-black/[0.08] dark:border-white/10 text-xs">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 leading-tight">
                        <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.popular ? 'text-[#10B981]' : 'text-[#0666EB]'}`} />
                        <span className={plan.popular ? 'text-zinc-300' : 'text-[#4A4D52]'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-8">
                  <button
                    onClick={onNavigateToAuth}
                    className={`
                      w-full py-3.5 px-4 rounded-full font-bold text-xs tracking-tight transition-all duration-200 hover:scale-[1.02]
                      ${plan.popular 
                        ? 'bg-white text-black hover:bg-zinc-100 shadow-md' 
                        : 'bg-[#0A0A0A] text-white hover:bg-black shadow-sm'
                      }
                    `}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 8. AFRIQUANTX INVESTMENT BANK SERVICES SPOTLIGHT */}
      <AfriQuantXInvestmentBankSection onNavigateToAuth={onNavigateToAuth} />

      {/* 9. INTERACTIVE FINTECH GRAPHICS (SECURITY VAULT & CUSTOMER JOURNEY) */}
      <section className="py-20 px-6 sm:px-12 lg:px-16 xl:px-24 w-full space-y-12">
        <CustomerJourneyFlow />
        <SecurityVaultCard />
      </section>

      {/* 10. MATERIALIZE / DEMATERIALIZE CARD EXPERIENCE */}
      <MaterializeCardSection onNavigateToAuth={onNavigateToAuth} />

      {/* 11. INVESTOR TESTIMONIALS */}
      <section className="py-24 px-6 sm:px-12 lg:px-16 xl:px-24 w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
            Trusted by 300,000+ investors & funds.
          </h2>
        </div>

        <AnimatedQuoteCarousel 
          quotes={[
            {
              author: 'Tariq Al-Mansoor',
              role: 'Managing Partner',
              company: 'Sahara Capital Dubai',
              quote: 'AfriQuantX provided our fund with instant FX clearing and secondary access to Flutterwave pre-IPO equity that was previously unreachable in GCC markets.',
              roi: '+48.2% ROI'
            },
            {
              author: 'Dr. Chioma Nwachukwu',
              role: 'Private Investor',
              company: 'Lagos Tech Angels',
              quote: 'The algorithmic quantitative engine auto-rebalanced my portfolio into high-yield sovereign Eurobonds right before interest rate adjustments. Absolute quantitative masterclass.',
              roi: '+22.4% APY'
            },
            {
              author: 'Kofi Mensah',
              role: 'Tech Lead & Angel Investor',
              company: 'Accra Capital',
              quote: 'Fractional dual-listed shares across JSE and NGX from a single app. The typography, smooth animations, and kinetic interface polish are world-class.',
              roi: '+34.8% ROI'
            },
            {
              author: 'Elena Rostova',
              role: 'Global Emerging Markets Lead',
              company: 'Helios Fund London',
              quote: 'Executing $10M+ block trades in Pan-African sovereign debt with zero counterparty settlement risk and live quantitative execution metrics.',
              roi: '+19.6% APY'
            }
          ]} 
          autoPlayInterval={5000}
        />
      </section>

      {/* 12. FINAL CONTRAST BLACK CTA SECTION */}
      <section className="py-28 bg-[#000000] text-white px-6 sm:px-12 lg:px-16 xl:px-24 w-full text-center relative overflow-hidden border-t border-zinc-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#0666EB]/20 to-[#7C4DFF]/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Invest in Africa's future today.
          </h2>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal">
            Join 300,000+ investors creating generational wealth with zero-commission equities, pre-IPO tech unicorns, and algorithmic intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={onNavigateToAuth}
              className="w-full sm:w-auto h-[56px] px-10 rounded-full bg-white text-black hover:bg-zinc-100 font-extrabold text-base tracking-tight transition-all duration-200 shadow-[0_4px_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <span>Open your account in 3 minutes</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SharedFooter onNavigatePage={onNavigatePage} onNavigateToAuth={onNavigateToAuth} />

    </div>
  );
}
