import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, Landmark, RefreshCw, Globe, Repeat, LineChart, 
  PieChart, Activity, DollarSign, Award, FileText, Cpu, 
  Search, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, X, Sparkles, ExternalLink
} from 'lucide-react';

export interface FeatureDetail {
  id: string;
  name: string;
  category: string;
  tagline: string;
  icon: React.ElementType;
  badge: string;
  highlightStats: { label: string; value: string }[];
  overview: string;
  keyCapabilities: string[];
  techSpec: string;
  securityAndCompliance: string;
}

export const PLATFORM_FEATURES: FeatureDetail[] = [
  {
    id: 'wallet',
    name: 'Wallet',
    category: 'Banking & Treasury',
    tagline: 'Multi-Currency Account & Instant Settlement Vaults',
    icon: Wallet,
    badge: 'Multi-Currency',
    highlightStats: [
      { label: 'Currencies Supported', value: '18+ Pan-African & USD/EUR' },
      { label: 'Settlement Speed', value: '< 410ms Instant' },
      { label: 'Security Level', value: 'Multi-Sig Hardware HSM' }
    ],
    overview: 'The AfriQuantX Wallet acts as your central treasury engine for holding, funding, and converting fiat and digital capital. Seamlessly hold USD, NGN, ZAR, KES, GHS, and EUR in segregated tier-1 custodian vaults with instant ledger finality.',
    keyCapabilities: [
      'Multi-currency sub-accounts with local ACH, NIBSS, and RTGS clearing',
      'Automated FX conversion with zero hidden spread markups',
      'Programmable withdrawal limits and multi-signature corporate approvals',
      'Yield-bearing overnight auto-sweep options into sovereign treasury bills',
      'Biometric & hardware key security (FIPS 140-2 Level 3 compliant)'
    ],
    techSpec: 'Sub-second WebSocket ledger synchronization with REST API webhooks for automated enterprise payouts.',
    securityAndCompliance: 'Fully segregated tier-1 custodian bank accounts protected by $250,000 FDIC/NDIC equivalent insurance policies.'
  },
  {
    id: 'markets',
    name: 'Markets',
    category: 'Trading & Exchanges',
    tagline: 'Pan-African & Global Exchange Gateway',
    icon: Landmark,
    badge: '14 Exchanges',
    highlightStats: [
      { label: 'Active Listed Assets', value: '2,400+ Securities' },
      { label: 'Order Execution Latency', value: '< 2.4 ms Direct DMA' },
      { label: 'Exchange Coverage', value: 'JSE, NGX, GSE, NSE, NYSE' }
    ],
    overview: 'Direct Market Access (DMA) to all major African equity exchanges and sovereign debt desks alongside global US markets. Trade dual-listed blue chips, government debt, and commodities through a single unified interface.',
    keyCapabilities: [
      'Real-time Level 2 order book streaming across NGX, JSE, and NSE',
      'Unified cross-exchange margin accounts eliminating fragmented liquidity',
      'Fractional share execution starting from as low as $1.00',
      'Dark pool liquidity aggregation for large institutional block orders',
      'Sub-second FX auto-conversion at time of order execution'
    ],
    techSpec: 'Direct FIX Protocol 4.4 connections into Johannesburg Stock Exchange (JSE) and Nigerian Exchange (NGX) gateways.',
    securityAndCompliance: 'Regulated broker-dealer routing in compliance with SEC, FSCA South Africa, and CMA Kenya guidelines.'
  },
  {
    id: 'secondary-market',
    name: 'Secondary Market',
    category: 'Private Equity',
    tagline: 'Pre-IPO Tech Equity & Venture Secondary Liquidity',
    icon: RefreshCw,
    badge: 'Exclusive SPV',
    highlightStats: [
      { label: 'Pre-IPO Listings', value: '$450M+ Verified Volume' },
      { label: 'Average CAGR', value: '48.2% Historical' },
      { label: 'Min Investment', value: '$500 Fractional' }
    ],
    overview: 'Unlocks secondary equity transfers in top-tier Pan-African technology unicorns prior to public stock exchange listing. Trade verified Special Purpose Vehicle (SPV) units in companies like Flutterwave, Paystack, and Moniepoint.',
    keyCapabilities: [
      'Verified Cap Table integration directly with company legal counsel',
      'Standardized board-approved secondary transfer documentation',
      'Fractionalized SPV structures allowing retail and angel entry',
      'Automated rights of first refusal (ROFR) clearing workflows',
      'Escrow-backed settlement guaranteeing instantaneous share transfer'
    ],
    techSpec: 'Smart contract SPV tokenization ledger with cryptographic proof of ownership for every share certificate.',
    securityAndCompliance: 'Diligenced under SEC Private Placement Exemption Reg D / Reg S frameworks with accredited investor validation.'
  },
  {
    id: 'forex-market',
    name: 'Forex Market',
    category: 'FX & Hedging',
    tagline: 'Sub-Second Pan-African Currency Swaps & Forward Contracts',
    icon: Globe,
    badge: 'Real-Time FX',
    highlightStats: [
      { label: 'Daily FX Liquidity Pool', value: '$120M+ Depth' },
      { label: 'Average Spread', value: '0.04% Interbank' },
      { label: 'Forward Hedging', value: 'Up to 365 Days' }
    ],
    overview: 'Institutional-grade foreign exchange desk providing continuous liquidity for cross-border African currency pairs (USD/NGN, USD/ZAR, USD/KES, EUR/GHS). Hedge against local currency devaluation using algorithmic FX forwards.',
    keyCapabilities: [
      'Interbank spot FX rates with tight bid-ask spreads',
      'Non-Deliverable Forwards (NDFs) for hedging currency volatility',
      'Algorithmic execution avoiding local bank liquidity bottlenecks',
      'Automated multi-currency rebalancing for corporate treasuries',
      'Direct central bank exchange rate feeds updated in real-time'
    ],
    techSpec: 'Automated market making algorithm tapping into regional liquidity hubs in London, Dubai, Johannesburg, and Lagos.',
    securityAndCompliance: 'Authorized FX dealer protocols in adherence to Pan-African Payment and Settlement System (PAPSS) standards.'
  },
  {
    id: 'trade',
    name: 'Trade',
    category: 'Trading & Execution',
    tagline: 'High-Frequency Terminal & Order Execution System',
    icon: Repeat,
    badge: 'Smart Order Router',
    highlightStats: [
      { label: 'Max Slippage Guarantee', value: '< 0.02%' },
      { label: 'Order Types', value: '12 Advanced Types' },
      { label: 'Execution Rate', value: '15,000 orders/sec' }
    ],
    overview: 'A pro-grade trading terminal built for retail traders and quantitative funds alike. Features advanced chart analysis, stop-loss/take-profit triggers, smart order routing (SOR), and automated TWAP/VWAP execution algorithms.',
    keyCapabilities: [
      'TradingView charting library integration with 100+ technical indicators',
      'Smart Order Router (SOR) picking the optimal liquidity venue automatically',
      'Bracket orders, OCO (One-Cancels-the-Other), and trailing stop losses',
      'Institutional block trading terminal with iceberg order masking',
      'One-click algorithmic execution templates'
    ],
    techSpec: 'Low-latency React/C++ WebAssembly order entry engine rendering 60FPS tick data charts without frame drops.',
    securityAndCompliance: 'Order protection rules enforcing pre-trade risk checks and automated fat-finger prevention limits.'
  },
  {
    id: 'index',
    name: 'Index',
    category: 'Market Analytics',
    tagline: 'Proprietary Pan-African Benchmark & Sector Indices',
    icon: LineChart,
    badge: 'Proprietary Indices',
    highlightStats: [
      { label: 'Flagship Index', value: 'AQX Pan-Africa 50' },
      { label: 'Index YTD Return', value: '+34.2%' },
      { label: 'Rebalance Frequency', value: 'Quarterly Auto' }
    ],
    overview: 'Track the performance of the African continent with proprietary benchmark indices. Invest in index funds tracking top 50 African capitalizations, Sovereign Bond Composites, and the Fintech Unicorn 10 Index.',
    keyCapabilities: [
      'AfriQuantX Pan-Africa 50 Index capturing 80% of regional market cap',
      'African Tech Unicorn 10 Index measuring high-growth private tech valuations',
      'Sovereign Bond Debt Composite Index weighted by credit rating and yield',
      'One-click index basket buying with automated quarterly rebalancing',
      'Transparent index methodology and real-time constituent weighting updates'
    ],
    techSpec: 'Algorithmic index calculation engine adjusting weights dynamically based on free-float liquidity and currency shifts.',
    securityAndCompliance: 'Index methodology independently calculated and verified under IOSCO Principles for Financial Benchmarks.'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    category: 'Wealth Management',
    tagline: 'Real-Time Asset Allocation & Unrealized PnL Engine',
    icon: PieChart,
    badge: 'Real-Time PnL',
    highlightStats: [
      { label: 'Portfolio Tracking', value: '100% Real-Time' },
      { label: 'Risk Metrics', value: 'VaR, Beta, Sharpe' },
      { label: 'Auto-Rebalance', value: 'Threshold Triggered' }
    ],
    overview: 'Comprehensive portfolio command center displaying multi-asset holdings, performance attribution, risk concentration heatmaps, and automated rebalancing triggers to keep your asset allocation optimal.',
    keyCapabilities: [
      'Visual breakdown by asset class, geography, currency, and sector risk',
      'Unrealized and realized Profit & Loss (PnL) tracking in base currency',
      'Value-at-Risk (VaR) and Monte Carlo stress testing simulations',
      'Automated tax-loss harvesting recommendations',
      'Custom benchmark comparison against S&P 500 and MSCI Emerging Markets'
    ],
    techSpec: 'Real-time mark-to-market pricing model evaluating illiquid assets and sovereign paper accurately.',
    securityAndCompliance: 'Client asset isolation guarantees ensuring user assets are never rehypothecated or lent without consent.'
  },
  {
    id: 'activity-center',
    name: 'Activity Center',
    category: 'Audit & Operations',
    tagline: 'Live Audit Trail & Cryptographic Transaction Ledger',
    icon: Activity,
    badge: 'Instant Audit',
    highlightStats: [
      { label: 'Audit Trail Retention', value: 'Permanent / Immutable' },
      { label: 'Verification', value: 'Zero-Knowledge Proofs' },
      { label: 'Latency', value: 'Instant Event Log' }
    ],
    overview: 'Complete operational transparency with a real-time activity log tracking every deposit, trade, order execution, currency swap, and dividend payout with cryptographic hash timestamps.',
    keyCapabilities: [
      'Searchable activity stream with filters for asset, date range, and transaction type',
      'Cryptographic transaction receipts with blockchain-anchored proof of execution',
      'Detailed order execution breakdowns showing fill prices, exchange fees, and timestamps',
      'Real-time notification webhooks for institutional operations teams',
      'Downloadable raw JSON/CSV activity logs for ERP integration'
    ],
    techSpec: 'Immutable append-only database architecture generating zero-knowledge proof receipts for external audit verification.',
    securityAndCompliance: 'Meets SOC2 Type II, ISO 27001, and anti-money laundering (AML) audit log requirements.'
  },
  {
    id: 'payouts',
    name: 'Payouts',
    category: 'Cash Flow',
    tagline: 'Automated Dividend Distribution & Bond Coupon Sweeps',
    icon: DollarSign,
    badge: 'Automated Cash Flow',
    highlightStats: [
      { label: 'Coupon Processing', value: 'Zero Settlement Delay' },
      { label: 'Payout Currency', value: 'USD or Local Fiat' },
      { label: 'Reinvestment APY', value: '+2.4% Compound Boost' }
    ],
    overview: 'Streamlines incoming cash flows from stock dividends, Eurobond coupon interest, and private equity distributions. Automatically route payouts to local bank accounts or sweep them into high-yield dollar vaults.',
    keyCapabilities: [
      'Automated dividend tracking calendar with upcoming payment forecasts',
      'Direct coupon collection from sovereign bond issuers without intermediary delays',
      'Automatic DRIP (Dividend Reinvestment Plan) option to compound wealth',
      'Multi-currency payout destination routing (bank account, mobile money, USD wallet)',
      'Instant withholding tax deduction receipt generation'
    ],
    techSpec: 'Direct integration with central securities depositories (CSD) for automated corporate action processing.',
    securityAndCompliance: 'Automatic tax treaty withholding calculations avoiding double taxation under bilateral agreements.'
  },
  {
    id: 'performance',
    name: 'Performance',
    category: 'Analytics & Reporting',
    tagline: 'Sharpe Ratio Analytics & Historical Drawdown Curves',
    icon: Award,
    badge: 'Sharpe 2.85',
    highlightStats: [
      { label: 'Sharpe Ratio', value: '2.85 Net Model' },
      { label: 'Max Historical Drawdown', value: '4.20% Managed' },
      { label: 'Alpha vs Benchmark', value: '+14.6%' }
    ],
    overview: 'Deep quantitative performance analytics measuring return on risk, alpha generation, beta exposure, max drawdown, and time-weighted vs money-weighted returns over custom time horizons.',
    keyCapabilities: [
      'Interactive performance charts with time-weighted return (TWR) metrics',
      'Sharpe, Sortino, and Calmar ratio risk-adjusted return evaluations',
      'Detailed attribution analysis highlighting top winning and losing positions',
      'Comparative benchmarking against local inflation and regional indices',
      'Monthly performance statement generation'
    ],
    techSpec: 'High-speed statistical computation engine calculating volatility matrices and drawdown curves dynamically.',
    securityAndCompliance: 'GIPS (Global Investment Performance Standards) compliant calculation methods.'
  },
  {
    id: 'reports-audits',
    name: 'Reports & Audits',
    category: 'Tax & Compliance',
    tagline: 'PwC/KPMG Verified Statements & Tax Export Tools',
    icon: FileText,
    badge: 'PwC / KPMG Audited',
    highlightStats: [
      { label: 'Audit Verification', value: 'Big 4 Verified' },
      { label: 'Export Formats', value: 'PDF, CSV, OFX, QuickBooks' },
      { label: 'Tax Year Coverage', value: 'Global Jurisdictions' }
    ],
    overview: 'Generate institutional tax reports, monthly holding statements, and official proof-of-funds documents with one click. Audited by Big 4 accounting firms for maximum regulatory trust.',
    keyCapabilities: [
      'One-click generation of annual capital gains tax reports for local tax filing',
      'Official proof of funds and holdings statements signed with institutional digital signatures',
      'Export compatibility with QuickBooks, Xero, and corporate ERP accounting systems',
      'Independent proof of solvency and reserve backing statements',
      'Customizable report date ranges and multi-currency reporting options'
    ],
    techSpec: 'Cryptographically signed PDF generator featuring QR code verification for third-party proof validation.',
    securityAndCompliance: 'Compliant with IRS, HMRC, FIRS Nigeria, and SARS South Africa tax disclosure frameworks.'
  },
  {
    id: 'aqei-intelligence',
    name: 'AQEI Intelligence',
    category: 'AI & Analytics',
    tagline: 'Neural Market Sentiment & Satellite Macro Signal Stream',
    icon: Cpu,
    badge: 'Neural Signal Engine',
    highlightStats: [
      { label: 'Signals Analyzed/Sec', value: '1.2M Data Points' },
      { label: 'Predictive Horizon', value: '3-Week Alpha' },
      { label: 'Signal Accuracy', value: '94.8% Backtested' }
    ],
    overview: 'Powered by the AfriQuantX DeepMind neural engine (AQEI v4.2). Scans satellite freight imaging, port container density, central bank rate whispers, and mobile money velocity to generate real-time trade signals.',
    keyCapabilities: [
      'Satellite tracking of African agricultural, mining, and shipping logistics',
      'Natural language processing (NLP) of central bank policy releases & local news',
      'Predictive sovereign debt default and rating upgrade/downgrade indicators',
      'Automated sentiment analysis for dual-listed equities across JSE and NGX',
      'Custom AI signal alerts pushed directly to mobile or Webhook terminal'
    ],
    techSpec: 'Transformer-based neural network trained on 20+ years of Pan-African macroeconomic and tick-level trading datasets.',
    securityAndCompliance: 'Strict anti-insider-trading algorithms adhering to SEC and international market manipulation prevention standards.'
  }
];

export function FeatureExplorerHub({ 
  onNavigateToAuth,
  onNavigateToDashboard 
}: { 
  onNavigateToAuth?: () => void;
  onNavigateToDashboard?: () => void;
}) {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(PLATFORM_FEATURES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Banking & Treasury', 'Trading & Exchanges', 'Private Equity', 'FX & Hedging', 'Trading & Execution', 'Market Analytics', 'Wealth Management', 'Audit & Operations', 'Cash Flow', 'Analytics & Reporting', 'Tax & Compliance', 'AI & Analytics'];

  const filteredFeatures = PLATFORM_FEATURES.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-20 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-12">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F5F5] border border-gray-200 text-xs font-mono font-bold uppercase tracking-wider text-black">
          <Sparkles className="w-3.5 h-3.5 text-[#00C805]" />
          <span>INSTITUTIONAL PLATFORM MODULES</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-black">
          Explore the 12 Core Engine Modules
        </h2>
        <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
          From multi-currency settlement vaults to satellite-driven neural signals, extract detailed specifications and performance capabilities for every feature.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. Wallet, FX, AQEI, Reports)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#00C805] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Active Feature Counter */}
          <div className="font-mono text-xs text-gray-500">
            Showing <span className="font-bold text-black">{filteredFeatures.length}</span> of {PLATFORM_FEATURES.length} Modules
          </div>
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Feature Cards List + Right Deep-Dive Detail Information Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Feature Card Selection List */}
        <div className="lg:col-span-5 space-y-3 max-h-[680px] overflow-y-auto pr-2">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon;
            const isSelected = selectedFeature?.id === feature.id;

            return (
              <motion.div
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                whileHover={{ scale: 1.01 }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 relative overflow-hidden ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xl'
                    : 'bg-[#F9F9FB] border-gray-200/90 hover:border-gray-300 text-black'
                }`}
              >
                {/* Active Accent Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00C805]" />
                )}

                <div className={`p-3 rounded-xl shrink-0 ${
                  isSelected ? 'bg-zinc-800 text-[#D5FF2F]' : 'bg-white text-black border border-gray-200 shadow-sm'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base tracking-tight truncate">{feature.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                      isSelected ? 'bg-[#00C805]/20 text-[#00C805]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {feature.badge}
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${isSelected ? 'text-zinc-300' : 'text-gray-500'}`}>
                    {feature.tagline}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 self-center ${
                  isSelected ? 'text-[#00C805]' : 'text-gray-300'
                }`} />
              </motion.div>
            );
          })}

          {filteredFeatures.length === 0 && (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 space-y-2">
              <p className="font-bold text-sm text-black">No features found</p>
              <p className="text-xs">Try searching for "Wallet", "Markets", or "Forex".</p>
            </div>
          )}
        </div>

        {/* Right Deep-Dive Detail Information Display Pane */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedFeature && (
              <motion.div
                key={selectedFeature.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-950 text-white rounded-[32px] p-8 lg:p-10 border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C805]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Drawer Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-[#D5FF2F] flex items-center justify-center border border-zinc-700">
                      <selectedFeature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold tracking-tight text-white">{selectedFeature.name}</h3>
                        <span className="px-3 py-1 rounded-full bg-[#00C805]/20 text-[#00C805] text-xs font-mono font-bold">
                          {selectedFeature.category}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">{selectedFeature.tagline}</p>
                    </div>
                  </div>

                  <button
                    onClick={onNavigateToAuth || onNavigateToDashboard}
                    className="px-5 py-2.5 rounded-full bg-[#D5FF2F] text-black hover:bg-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <span>Launch Feature</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Highlight Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedFeature.highlightStats.map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                      <div className="text-xs font-mono text-zinc-400">{stat.label}</div>
                      <div className="text-base font-bold font-mono text-[#D5FF2F]">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Feature Overview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">MODULE OVERVIEW</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {selectedFeature.overview}
                  </p>
                </div>

                {/* Key Capabilities Bullet Points */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">CORE CAPABILITIES</h4>
                  <div className="space-y-2.5">
                    {selectedFeature.keyCapabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-zinc-200">
                        <CheckCircle2 className="w-4 h-4 text-[#00C805] shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Architecture & Compliance Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-[#D5FF2F] uppercase tracking-wider">
                      TECHNICAL SPECIFICATION
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {selectedFeature.techSpec}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      REGULATORY & SECURITY
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {selectedFeature.securityAndCompliance}
                    </p>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
}
