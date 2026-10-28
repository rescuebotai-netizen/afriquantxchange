import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Send, 
  Lock, 
  Sparkles, 
  BarChart3,
  Globe2,
  Cpu,
  ArrowUpRight,
  Landmark,
  Coins
} from 'lucide-react';
import { SharedFooter } from './SharedFooter';
import { HeroVideoBackground } from '../ui/HeroVideoBackground';
import { GlobalPaymentMesh } from '../ui/InteractiveFintechGraphics';
import { CapitalAccessPipeline } from '../ui/CapitalAccessPipeline';
import { InstitutionalMetricsDashboard } from '../ui/InstitutionalMetricsDashboard';
import { 
  KineticWordReveal, 
  TextMorph 
} from '../ui/KineticTypography';

interface BusinessPageProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth?: () => void;
}

const INSTITUTIONAL_SOLUTIONS = [
  {
    num: '01',
    title: 'Treasury Yield Vaults & FX Shield',
    desc: 'Deploy corporate liquidity into high-yield sovereign Eurobonds, local money market funds, and T+0 dual-currency buffers yielding up to 12.5% APY.',
    metrics: '12.5% APY • Daily Liquidity',
    features: ['Zero FX exposure via automatic forward hedging', 'T+0 instantaneous multi-currency sweep', 'Central bank and tier-1 custodian segregation']
  },
  {
    num: '02',
    title: 'Pre-IPO Syndication & Dual Cross-Listing',
    desc: 'Fast-track corporate capital rounds with direct underwriting and order-book routing across JSE, NGX, London Stock Exchange, and private secondary desks.',
    metrics: '300+ Institutional Funds • 14 Bourses',
    features: ['Real-time algorithmic book building', 'Automated SEC/IFRS compliance prospectus generators', 'Sub-millisecond FIX 4.4 routing to sovereign broker-dealers']
  },
  {
    num: '03',
    title: 'Corporate ESOP & Multi-Sig Treasury Management',
    desc: 'Empower African tech talent with automated equity stock options, institutional payroll distribution, and multi-party cryptographic authorization.',
    metrics: 'AES-256 Multi-Sig • Automated Tax Withholding',
    features: ['Automated cap table and vesting schedules', 'Multi-currency dividend distributions in USD/EUR/ZAR', 'Custom role-based permissions and hardware key support']
  },
  {
    num: '04',
    title: 'Sovereign Debt & Institutional Asset Allocation',
    desc: 'Tailored direct market access (DMA) and liquidity pipelines for family offices, sovereign wealth funds, and private equity firms deploying $10M+ AUM.',
    metrics: '$10M+ Allocations • Dedicated Desk',
    features: ['Bespoke private block trade settlement', 'Custom REST & WebSocket quantitative market feeds', 'Direct access to secondary debt auctions']
  }
];

export function BusinessPage({ onNavigatePage, onNavigateToAuth }: BusinessPageProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [aumRange, setAumRange] = useState('$1M - $10M');
  const [objective, setObjective] = useState('Treasury Yield & FX Hedging');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleAuth = () => {
    if (onNavigateToAuth) onNavigateToAuth();
    else onNavigatePage('dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-[#0D0F13] font-sans selection:bg-[#D9A94E] selection:text-[#0D0F13] overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: FULL-BLEED BLACK #0D0F13 WITH IPO LAUNCH VIDEO BACKGROUND */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-[#0D0F13] text-[#F4F1E8] px-6 sm:px-12 lg:px-16 xl:px-24 overflow-hidden border-b border-white/[0.08]">
        
        {/* IPO Launch YouTube Background Video */}
        <HeroVideoBackground 
          videoId="t5lO9Z42nZ0" 
          overlayOpacity={0.82} 
          darkMode={true} 
        />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-[#D9A94E]/12 via-[#34A87E]/10 to-[#0666EB]/12 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-28 sm:py-36">
          
          {/* Kinetic Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight text-[#F4F1E8] leading-[1.06]"
          >
            Institutional Capital Pipelines <br className="hidden sm:inline" />
            <span className="text-[#34A87E] drop-shadow-[0_0_35px_rgba(52,168,126,0.25)]">
              for African Enterprise.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-[#F4F1E8]/70 max-w-3xl mx-auto leading-relaxed"
          >
            Underwrite corporate IPOs, access 300+ institutional syndicates, sweep balance sheet cash into 12.5% yield vaults, and clear cross-border securities at sub-millisecond latency.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="#deal-room-inquiry" 
              className="w-full sm:w-auto h-[54px] px-9 rounded-full bg-[#F4F1E8] text-[#0D0F13] hover:bg-[#D9A94E] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Request Deal Room Access</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={handleAuth}
              className="w-full sm:w-auto h-[54px] px-8 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#F4F1E8] border border-white/[0.15] font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-200 backdrop-blur-md flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 text-[#34A87E]" />
              <span>Launch Institutional Terminal</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC INSTITUTIONAL METRICS SECTION: FULL-BLEED BLACK #000000        */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="py-24 bg-[#000000] text-[#F4F1E8] border-b border-white/[0.08] px-6 sm:px-12 lg:px-16 xl:px-24 w-full relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <InstitutionalMetricsDashboard />
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE CAPITAL ACCESS PIPELINE: PURE WHITE #FFFFFF                */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="py-28 lg:py-36 bg-white text-[#0D0F13] px-6 sm:px-12 lg:px-16 xl:px-24 w-full relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#34A87E]">
              CAPITAL ACCESS PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D0F13] leading-tight">
              From Initial Diagnostic to Multi-Exchange Liquidity.
            </h2>
            <p className="text-base sm:text-lg text-[#6E737B] leading-relaxed">
              Step through our structured underwriting pipeline. Every milestone is algorithmically verified, regulatory-cleared, and directly syndicated into sovereign capital markets.
            </p>
          </div>

          <CapitalAccessPipeline onNavigateToAuth={handleAuth} />

        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 4. INSTITUTIONAL SOLUTIONS: WARM LIGHT-GREY #F5F5F7 (FLUID, NON-BOXED)    */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="py-28 lg:py-36 bg-[#F5F5F7] text-[#0D0F13] border-y border-black/[0.06] px-6 sm:px-12 lg:px-16 xl:px-24 w-full"
      >
        <div className="max-w-7xl mx-auto space-y-20">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9A94E]">
              INVESTMENT BANKING SUITE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D0F13] leading-tight">
              Purpose-built infrastructure for African corporate treasuries.
            </h2>
            <p className="text-base sm:text-lg text-[#6E737B] leading-relaxed">
              Eliminate currency friction and scale treasury reserves with institutional grade execution rails.
            </p>
          </div>

          {/* Fluid Solutions Grid - Non-boxed Minimalist List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {INSTITUTIONAL_SOLUTIONS.map((sol, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="space-y-5 pt-6 border-t-2 border-black/[0.08]"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold font-mono text-[#D9A94E]">
                    {sol.num}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#34A87E] px-3 py-1 bg-[#34A87E]/10 rounded-full">
                    {sol.metrics}
                  </span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-[#0D0F13] tracking-tight">
                  {sol.title}
                </h3>

                <p className="text-base text-[#6E737B] leading-relaxed">
                  {sol.desc}
                </p>

                <ul className="space-y-2.5 pt-2">
                  {sol.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm text-[#0D0F13] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D0F13] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 5. GLOBAL PAYMENT & CLEARING MESH VISUALIZER: STRETCHED WORLD-CLASS        */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-[1540px] mx-auto w-full"
      >
        <GlobalPaymentMesh />
      </motion.section>

      {/* ========================================================================= */}
      {/* 6. INSTITUTIONAL CASE STUDY: DEEP CONTRAST BLACK #0D0F13                  */}
      {/* ========================================================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="py-28 lg:py-36 bg-[#0D0F13] text-[#F4F1E8] px-6 sm:px-12 lg:px-16 xl:px-24 w-full relative overflow-hidden border-y border-white/[0.08]"
      >
        {/* Glow */}
        <div className="absolute top-1/2 left-1/4 w-[700px] h-[350px] bg-gradient-to-r from-[#34A87E]/10 to-[#0666EB]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#34A87E]/10 border border-[#34A87E]/20 text-[#34A87E] text-xs font-mono font-bold uppercase tracking-wider">
                TRANSACTION BRIEF • PRE-IPO EXPANSION
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F1E8] tracking-tight leading-tight">
              "AfriQuantX preserved $1.4M in treasury yield while syndicating our Series C secondary tranche."
            </h3>

            <p className="text-base sm:text-lg text-[#F4F1E8]/70 leading-relaxed">
              By routing our balance sheet into dual-currency sovereign Eurobonds and automating our multi-exchange order book on the JSE &amp; NGX, AfriQuantX eliminated currency slippage and unlocked liquidity across 42 institutional allocators.
            </p>

            <div className="pt-4 flex items-center gap-4 text-xs font-mono text-[#F4F1E8]/50">
              <span className="text-[#F4F1E8] font-bold">CFO &amp; Head of Treasury</span>
              <span>•</span>
              <span>Pan-African Logistics Unicorn</span>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] space-y-6">
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#F4F1E8]/40">
                  TREASURY YIELD REALIZED
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#34A87E] font-mono tracking-tight">
                  +$1,420,000
                </div>
                <div className="text-xs font-mono text-[#F4F1E8]/60">
                  Annualized interest on Eurobond vault
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#F4F1E8]/40">
                  SECONDARY TRANCHE OVERSUBSCRIPTION
                </div>
                <div className="text-3xl font-extrabold text-[#D9A94E] font-mono tracking-tight">
                  3.2x Book Depth
                </div>
                <div className="text-xs font-mono text-[#F4F1E8]/60">
                  Cleared via FIX 4.4 protocol in 4 business days
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 7. DEAL ROOM & ADVISORY APPLICATION FORM: PURE WHITE #FFFFFF              */}
      {/* ========================================================================= */}
      <motion.section 
        id="deal-room-inquiry"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="py-28 lg:py-36 bg-white text-[#0D0F13] px-6 sm:px-12 lg:px-16 xl:px-24 w-full"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9A94E]">
              DIRECT INSTITUTIONAL INTAKE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D0F13]">
              Speak with Investment Banking &amp; Treasury.
            </h2>
            <p className="text-base text-[#6E737B] max-w-xl mx-auto">
              Request confidential underwriting, automated balance sheet audit, or dedicated FIX 4.4 clearing pipeline setup.
            </p>
          </div>

          {formSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-3xl bg-[#F5F5F7] border border-black/[0.08] text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#34A87E]/10 text-[#34A87E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-[#0D0F13]">
                Deal Room Request Registered
              </h4>
              <p className="text-sm text-[#6E737B] max-w-md mx-auto">
                Your company profile has been dispatched to our Quantitative Advisory team. A Senior Relationship Partner will contact you within 2 business hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0F13]">
                    CORPORATE / ENTITY NAME
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Flutterwave Group Ltd"
                    value={companyName} 
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full bg-[#F5F5F7] border border-black/[0.08] rounded-2xl px-5 py-4 text-sm text-[#0D0F13] focus:outline-none focus:border-[#D9A94E] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0F13]">
                    EXECUTIVE LEAD NAME &amp; TITLE
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Adebayo Ogunlesi, CFO"
                    value={contactName} 
                    onChange={e => setContactName(e.target.value)}
                    className="w-full bg-[#F5F5F7] border border-black/[0.08] rounded-2xl px-5 py-4 text-sm text-[#0D0F13] focus:outline-none focus:border-[#D9A94E] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0F13]">
                    INSTITUTIONAL WORK EMAIL
                  </label>
                  <input 
                    type="email" 
                    required 
                    placeholder="treasury@company.com"
                    value={workEmail} 
                    onChange={e => setWorkEmail(e.target.value)}
                    className="w-full bg-[#F5F5F7] border border-black/[0.08] rounded-2xl px-5 py-4 text-sm text-[#0D0F13] focus:outline-none focus:border-[#D9A94E] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0F13]">
                    PRIMARY MANDATE
                  </label>
                  <select 
                    value={objective} 
                    onChange={e => setObjective(e.target.value)}
                    className="w-full bg-[#F5F5F7] border border-black/[0.08] rounded-2xl px-5 py-4 text-sm text-[#0D0F13] focus:outline-none focus:border-[#D9A94E] transition-colors"
                  >
                    <option>Treasury Yield &amp; FX Hedging</option>
                    <option>Pre-IPO Underwriting &amp; Syndication</option>
                    <option>Dual Cross-Listing (JSE / NGX / LSE)</option>
                    <option>Corporate ESOP &amp; Multi-Sig Accounts</option>
                    <option>Institutional DMA Market Feeds</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0F13]">
                  TARGET TRANSACTION / TREASURY VOLUME
                </label>
                <select 
                  value={aumRange} 
                  onChange={e => setAumRange(e.target.value)}
                  className="w-full bg-[#F5F5F7] border border-black/[0.08] rounded-2xl px-5 py-4 text-sm text-[#0D0F13] focus:outline-none focus:border-[#D9A94E] transition-colors"
                >
                  <option>$500k - $2M</option>
                  <option>$2M - $10M</option>
                  <option>$10M - $50M</option>
                  <option>$50M - $250M</option>
                  <option>$250M+</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-5 rounded-full bg-[#0D0F13] text-white hover:bg-[#D9A94E] hover:text-[#0D0F13] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <span>Submit Confidential Mandate Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-[#6E737B] pt-2">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#34A87E]" />
                  <span>Strict NDA &amp; Non-Disclosure Protected</span>
                </div>
                <span>•</span>
                <div>SEC / Central Bank Compliant</div>
              </div>

            </form>
          )}

        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <SharedFooter onNavigatePage={onNavigatePage} onNavigateToAuth={onNavigateToAuth} />

    </div>
  );
}
