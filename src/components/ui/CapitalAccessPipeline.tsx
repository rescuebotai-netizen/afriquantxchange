import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  FileSearch, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Cpu, 
  Coins,
  ChevronRight,
  Clock,
  Briefcase
} from 'lucide-react';

interface CapitalAccessPipelineProps {
  onNavigateToAuth?: () => void;
}

interface PipelineStage {
  id: string;
  step: string;
  title: string;
  shortDesc: string;
  timeline: string;
  deliverables: string[];
  metrics: { label: string; value: string }[];
  status: string;
  icon: React.ElementType;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'vetting',
    step: 'Stage 01',
    title: 'Institutional Vetting & ESG Scoring',
    shortDesc: 'Algorithmic assessment of financial solvency, legal structuring, and cross-border regulatory compliance.',
    timeline: '3 - 5 Business Days',
    deliverables: [
      'SEC & Central Bank statutory alignment audit',
      'AI-driven balance sheet & solvency stress test',
      'IFRS accounting & corporate governance score',
      'KYC/AML institutional investor clearance'
    ],
    metrics: [
      { label: 'Audit Velocity', value: '72 hrs' },
      { label: 'Compliance Index', value: '99.8%' }
    ],
    status: 'Automated Diagnostic',
    icon: ShieldCheck
  },
  {
    id: 'dataroom',
    step: 'Stage 02',
    title: 'Digital Deal Room & Underwriting',
    shortDesc: 'Creation of a cryptographic, multi-sig data room with automated cap table reconciliation and prospectus drafting.',
    timeline: '5 - 7 Business Days',
    deliverables: [
      'Multi-sig zero-knowledge data room access',
      'Dynamic financial model & valuation telemetry',
      'Institutional prospectus & syndication memo',
      'Legal term sheet standardizations'
    ],
    metrics: [
      { label: 'Data Room Encryption', value: 'AES-256' },
      { label: 'Audit Trail', value: '100% Immutable' }
    ],
    status: 'Deal Room Active',
    icon: FileSearch
  },
  {
    id: 'syndication',
    step: 'Stage 03',
    title: 'Syndication & Institutional Book Building',
    shortDesc: 'Matching corporate offerings with 300+ accredited sovereign wealth funds, pension managers, and private equity syndicates.',
    timeline: '10 - 14 Business Days',
    deliverables: [
      'Direct roadshow to Pan-African & London family offices',
      'Algorithmic investor-match recommendation engine',
      'Anchor order commitment & price discovery',
      'Secondary tranche allocations'
    ],
    metrics: [
      { label: 'Institutional Network', value: '300+ Funds' },
      { label: 'Average Coverage', value: '2.4x Overbooked' }
    ],
    status: 'Book Building',
    icon: Users
  },
  {
    id: 'listing',
    step: 'Stage 04',
    title: 'Dual-Exchange Listing & Pre-IPO Placement',
    shortDesc: 'Fast-track routing for dual listings across NGX, JSE, LSE, and proprietary secondary liquidity desks.',
    timeline: '5 - 10 Business Days',
    deliverables: [
      'Dual depository settlement clearance (CSCS / Strate)',
      'Sub-millisecond FIX 4.4 routing integration',
      'Continuous liquidity market-making protocols',
      'Secondary private equity window activation'
    ],
    metrics: [
      { label: 'Supported Exchanges', value: '14 Bourses' },
      { label: 'Settlement Speed', value: 'T+0 Instant' }
    ],
    status: 'Market Integration',
    icon: TrendingUp
  },
  {
    id: 'deployment',
    step: 'Stage 05',
    title: 'Capital Settlement & Treasury Deployment',
    shortDesc: 'Multi-currency disbursement, automated FX risk hedging, and high-yield operational cash deployment.',
    timeline: 'T+0 Immediate',
    deliverables: [
      'Instant settlement in USD, EUR, NGN, ZAR, KES',
      'Automated FX forward contracts & risk minimization',
      'Treasury yield vault routing (up to 12.5% APY)',
      'Real-time automated cap table updates'
    ],
    metrics: [
      { label: 'FX Slippage Guard', value: '<0.02%' },
      { label: 'Treasury Yield', value: '12.5% APY' }
    ],
    status: 'Capital Deployed',
    icon: Coins
  }
];

export function CapitalAccessPipeline({ onNavigateToAuth }: CapitalAccessPipelineProps) {
  const [activeStageId, setActiveStageId] = useState<string>('vetting');

  const activeStage = PIPELINE_STAGES.find(s => s.id === activeStageId) || PIPELINE_STAGES[0];
  const activeIndex = PIPELINE_STAGES.findIndex(s => s.id === activeStageId);

  return (
    <div className="w-full space-y-16">
      
      {/* Step Indicator Navigation */}
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 relative z-10">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isActive = stage.id === activeStageId;
            const isCompleted = idx < activeIndex;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`text-left p-4 lg:p-5 transition-all duration-300 group ${
                  isActive 
                    ? 'border-b-2 lg:border-b-0 border-[#D9A94E]' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#0D0F13] text-[#D9A94E] ring-4 ring-[#D9A94E]/20 shadow-md' 
                      : isCompleted
                      ? 'bg-[#34A87E] text-white'
                      : 'bg-black/[0.06] text-[#0D0F13]'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span>0{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#6E737B] hidden sm:inline">
                    {stage.step}
                  </span>
                </div>

                <div className={`text-sm lg:text-base font-bold tracking-tight line-clamp-1 transition-colors ${
                  isActive ? 'text-[#0D0F13]' : 'text-[#6E737B] group-hover:text-[#0D0F13]'
                }`}>
                  {stage.title.split('&')[0]}
                </div>
                <div className="text-xs font-mono text-[#D9A94E] font-medium mt-1">
                  {stage.timeline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Display (Fluid, Minimalist, Non-Boxed Layout) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pt-6 border-t border-black/[0.06]"
        >
          {/* Left Column: Stage Overview & Key Telemetry */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black/[0.05] rounded-full text-[#0D0F13]">
                {activeStage.step}
              </span>
              <span className="font-mono text-xs font-bold text-[#34A87E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34A87E] animate-pulse" />
                {activeStage.status}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0D0F13] tracking-tight leading-tight">
              {activeStage.title}
            </h3>

            <p className="text-base sm:text-lg text-[#6E737B] leading-relaxed">
              {activeStage.shortDesc}
            </p>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-black/[0.06]">
              {activeStage.metrics.map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E737B]">
                    {m.label}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0D0F13] font-mono tracking-tight">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onNavigateToAuth}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0D0F13] text-white hover:bg-[#D9A94E] hover:text-[#0D0F13] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md"
              >
                <span>Initiate Pipeline Diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="text-xs font-mono text-[#6E737B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated duration: {activeStage.timeline}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Deliverables & Underwriting Standards */}
          <div className="lg:col-span-6 space-y-6 lg:pl-8 lg:border-l border-black/[0.06]">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0F13]">
              Institutional Execution Standards &amp; Deliverables
            </div>

            <div className="space-y-4">
              {activeStage.deliverables.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="flex items-start gap-4 py-3 border-b border-black/[0.04]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#34A87E]/10 text-[#34A87E] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#0D0F13] leading-snug">
                      {item}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Next Stage Preview */}
            {activeIndex < PIPELINE_STAGES.length - 1 && (
              <div className="pt-4 flex items-center justify-between text-xs font-mono text-[#6E737B]">
                <span>Next sequence:</span>
                <button
                  onClick={() => setActiveStageId(PIPELINE_STAGES[activeIndex + 1].id)}
                  className="text-[#0D0F13] font-bold hover:text-[#D9A94E] inline-flex items-center gap-1 transition-colors"
                >
                  <span>{PIPELINE_STAGES[activeIndex + 1].title.split('&')[0]}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
