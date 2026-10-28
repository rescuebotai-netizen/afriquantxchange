import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Landmark, Globe2, ShieldCheck, ArrowUpRight, TrendingUp,
  Briefcase, Coins, Scale, LineChart, Layers, FileText, CheckCircle2, Award
} from 'lucide-react';

interface InvestmentBankSectionProps {
  onNavigateToAuth?: () => void;
  titleOverride?: string;
  subtitleOverride?: string;
}

export function AfriQuantXInvestmentBankSection({
  onNavigateToAuth,
  titleOverride,
  subtitleOverride
}: InvestmentBankSectionProps) {
  const services = [
    {
      icon: CapitalMarketIcon,
      tag: 'UNDERWRITING & ECM',
      title: 'Equity & Debt Capital Markets',
      desc: 'Full-service underwriting and book-running for Pan-African IPOs, corporate bond issuances, and syndicated debt capital.',
      stat: '$1.4B+ Underwritten',
      highlight: 'Direct JSE, NGX & LSE Listing Desk'
    },
    {
      icon: CrossBorderAdvisoryIcon,
      tag: 'CROSS-BORDER M&A',
      title: 'Mergers & Acquisitions Advisory',
      desc: 'Strategic buy-side and sell-side advisory powered by real-time AQEI valuation models and cross-border currency hedging.',
      stat: '42 Transactions Completed',
      highlight: 'Sub-Saharan & GCC Corridor Focus'
    },
    {
      icon: TreasuryFxIcon,
      tag: 'TREASURY & FX CLEARING',
      title: 'Institutional FX Swaps & Hedging',
      desc: 'Same-day settlement across USD, NGN, ZAR, KES, GHS & EUR. Protecting corporate balance sheets against currency devaluation.',
      stat: 'Sub-410ms Finality',
      highlight: 'Tier-1 Central Bank Custody'
    },
    {
      icon: DarkPoolLiquidityIcon,
      tag: 'DARK POOL & SECONDARY',
      title: 'Secondary Equity Market Making',
      desc: 'Institutional block trading for Pre-IPO unicorn shares and private secondary equity transactions with zero market impact.',
      stat: '$380M+ Secondary Volume',
      highlight: 'Cap Table Compliant Audits'
    }
  ];

  return (
    <section className="w-full py-24 px-6 sm:px-12 lg:px-16 xl:px-24 bg-zinc-950 text-white border-y border-zinc-800 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full space-y-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-zinc-800 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {titleOverride || "Institutional Investment Banking Built for Emerging Economies"}
            </h2>
            <p className="text-zinc-400 text-base lg:text-lg leading-relaxed">
              {subtitleOverride || "Empowering sovereigns, multinational corporations, and high-growth technology leaders with premier advisory, underwriting, and cross-border FX liquidity."}
            </p>
          </div>

          {onNavigateToAuth && (
            <button
              onClick={onNavigateToAuth}
              className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 group whitespace-nowrap shrink-0"
            >
              <span>Engage Advisory Desk</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {services.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 transition-all space-y-5 relative group overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400 tracking-wider uppercase">{s.tag}</span>
                    <div className="p-3 rounded-xl bg-zinc-800 text-white group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">{s.title}</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-2 text-xs font-mono">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>{s.stat}</span>
                  </div>
                  <div className="text-zinc-400 flex items-center gap-1 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{s.highlight}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Regulatory & Institutional Credentials Footer */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Licensed Securities Clearing & Investment Banking Desk</span>
          </div>
          <div className="flex items-center gap-6">
            <span>SEC Regulated Partner Network</span>
            <span>•</span>
            <span>NDIC / FDIC Custodial Vaults</span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Custom Helper Icons
function CapitalMarketIcon(props: any) {
  return <Briefcase {...props} />;
}
function CrossBorderAdvisoryIcon(props: any) {
  return <Globe2 {...props} />;
}
function TreasuryFxIcon(props: any) {
  return <Coins {...props} />;
}
function DarkPoolLiquidityIcon(props: any) {
  return <Layers {...props} />;
}
