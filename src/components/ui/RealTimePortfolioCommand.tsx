import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface RealTimePortfolioCommandProps {
  onNavigateToAuth: () => void;
}

interface KPIItem {
  id: string;
  label: string;
  value: number;
  format: 'compact' | 'int' | 'decimal';
  prefix?: string;
  suffix?: string;
  delta?: string;
}

const INVESTOR_KPIS: KPIItem[] = [
  { id: 'val', label: 'Portfolio Value', value: 18400000, format: 'compact', prefix: '$', delta: '+2.4%' },
  { id: 'dep', label: 'Capital Deployed', value: 12100000, format: 'compact', prefix: '$' },
  { id: 'deals', label: 'Active Deals', value: 34, format: 'int' },
  { id: 'irr', label: 'Net IRR', value: 21.6, format: 'decimal', suffix: '%' }
];

const COMPANY_KPIS: KPIItem[] = [
  { id: 'raised', label: 'Capital Raised', value: 4200000, format: 'compact', prefix: '$', delta: '+68% of round' },
  { id: 'matches', label: 'Investor Matches', value: 19, format: 'int' },
  { id: 'time', label: 'Avg. Time to Term Sheet', value: 11, format: 'int', suffix: ' days' },
  { id: 'views', label: 'Data Room Views', value: 126, format: 'int' }
];

const FEEDS_DATA = {
  investors: [
    'Term sheet signed — Series A round',
    'New capital match — $1.2M opportunity',
    'Deal closed — expansion-stage platform',
    'Investor commitment — $3.4M allocated',
    'Due diligence completed — growth-stage SME'
  ],
  companies: [
    'Investor match found — institutional fund',
    'Term sheet received — new offer',
    'Data room accessed — prospective partner',
    'Funding round 68% subscribed',
    'New investor interest registered'
  ]
};

const TIME_MINS = [1, 4, 9, 14, 22];

export function RealTimePortfolioCommand({ onNavigateToAuth }: RealTimePortfolioCommandProps) {
  const [activeTab, setActiveTab] = useState<'investors' | 'companies'>('investors');
  const [clock, setClock] = useState('00:00:00 UTC');
  const [kpis, setKpis] = useState<{ [key: string]: number }>({
    val: 18400000,
    dep: 12100000,
    deals: 34,
    irr: 21.6,
    raised: 4200000,
    matches: 19,
    time: 11,
    views: 126
  });
  const [flashingKey, setFlashingKey] = useState<string | null>(null);
  const [investorFeed, setInvestorFeed] = useState(FEEDS_DATA.investors);
  const [companyFeed, setCompanyFeed] = useState(FEEDS_DATA.companies);

  // 3D Perspective Mouse Tilt
  const panelRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Micro-Tick simulation
  useEffect(() => {
    const tickInterval = setInterval(() => {
      const currentList = activeTab === 'investors' ? INVESTOR_KPIS : COMPANY_KPIS;
      const targetItem = currentList[Math.floor(Math.random() * currentList.length)];
      const key = targetItem.id;
      
      setKpis((prev) => {
        const currentVal = prev[key] || targetItem.value;
        const deltaMultiplier = Math.random() * 0.012 - 0.004; // -0.4% to +0.8%
        const newVal = currentVal * (1 + deltaMultiplier);
        return { ...prev, [key]: newVal };
      });

      setFlashingKey(key);
      setTimeout(() => {
        setFlashingKey(null);
      }, 700);
    }, 3800);

    return () => clearInterval(tickInterval);
  }, [activeTab]);

  // Rotate Activity Feeds
  useEffect(() => {
    const invInterval = setInterval(() => {
      setInvestorFeed((prev) => {
        const copy = [...prev];
        const last = copy.pop();
        if (last) copy.unshift(last);
        return copy;
      });
    }, 4200);

    const compInterval = setInterval(() => {
      setCompanyFeed((prev) => {
        const copy = [...prev];
        const last = copy.pop();
        if (last) copy.unshift(last);
        return copy;
      });
    }, 5000);

    return () => {
      clearInterval(invInterval);
      clearInterval(compInterval);
    };
  }, []);

  // Mouse Move Tilt Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 4, y: -y * 4 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const formatKPIValue = (val: number, format: 'compact' | 'int' | 'decimal', prefix = '', suffix = '') => {
    let display = '';
    if (format === 'compact') {
      display = (val / 1000000).toFixed(1) + 'M';
    } else if (format === 'decimal') {
      display = val.toFixed(1);
    } else {
      display = Math.round(val).toLocaleString();
    }
    return `${prefix}${display}${suffix}`;
  };

  const activeKPIList = activeTab === 'investors' ? INVESTOR_KPIS : COMPANY_KPIS;
  const activeFeedList = activeTab === 'investors' ? investorFeed : companyFeed;

  return (
    <section className="relative py-28 lg:py-36 bg-[#0D0F13] text-[#F4F1E8] border-y border-white/[0.08] overflow-hidden selection:bg-[#D9A94E] selection:text-[#0D0F13]">
      
      {/* Background Dot Texture */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(244,241,232,0.05) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 1100px 700px at 50% 30%, #000 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 1100px 700px at 50% 30%, #000 40%, transparent 85%)',
        }}
      />

      {/* Ambient Gradient Backlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[360px] bg-gradient-to-r from-[#D9A94E]/10 via-[#34A87E]/10 to-[#0666EB]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 space-y-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-center space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F1E8] leading-tight">
            Real-time portfolio command, stripped of noise.
          </h2>
          <p className="text-base sm:text-lg text-[#F4F1E8]/70 leading-relaxed max-w-xl mx-auto">
            Track multi-asset allocations across dual-listed shares, sovereign bonds, and secondary markets with sub-millisecond price updates.
          </p>
        </motion.div>

        {/* View Toggle Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <div className="inline-flex bg-[#191D27] border border-[#F4F1E8]/10 p-1.5 rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab('investors')}
              className={`px-6 py-2 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 ${
                activeTab === 'investors'
                  ? 'bg-[#D9A94E] text-[#0D0F13] shadow-md'
                  : 'text-[#F4F1E8]/60 hover:text-[#F4F1E8]'
              }`}
            >
              For Investors
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-6 py-2 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-300 ${
                activeTab === 'companies'
                  ? 'bg-[#D9A94E] text-[#0D0F13] shadow-md'
                  : 'text-[#F4F1E8]/60 hover:text-[#F4F1E8]'
              }`}
            >
              For Companies
            </button>
          </div>
        </motion.div>

        {/* Dashboard 3D Tilt Container */}
        <motion.div 
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1400 }}
          className="w-full"
        >
          <div
            ref={panelRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              transformStyle: 'preserve-3d',
            }}
            className="relative rounded-3xl bg-gradient-to-br from-[#14171F] to-[#191D27] border border-[#F4F1E8]/10 p-6 sm:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.65),0_0_0_1px_rgba(217,169,78,0.06)]"
          >
            {/* Top Bar: Live Status + UTC Clock */}
            <div className="flex items-center justify-between border-b border-[#F4F1E8]/[0.08] pb-5 mb-7">
              <div className="flex items-center gap-2.5 font-mono text-xs tracking-widest text-[#34A87E] font-bold">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A87E] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34A87E]" />
                </span>
                <span>LIVE CLEARING</span>
              </div>
              <div className="font-mono text-xs text-[#F4F1E8]/40 tracking-wider">
                {clock}
              </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#F4F1E8]/10 rounded-2xl overflow-hidden mb-7 border border-[#F4F1E8]/10">
              {activeKPIList.map((item) => {
                const currentVal = kpis[item.id] !== undefined ? kpis[item.id] : item.value;
                const isFlashing = flashingKey === item.id;
                return (
                  <div
                    key={item.id}
                    className={`bg-[#14171F] p-5 transition-colors duration-500 ${
                      isFlashing ? 'bg-[#D9A94E]/15' : ''
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#F4F1E8]/50 mb-2">
                      {item.label}
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#F4F1E8] tracking-tight font-mono">
                      {formatKPIValue(currentVal, item.format, item.prefix, item.suffix)}
                    </div>
                    {item.delta ? (
                      <div className="font-mono text-xs font-bold text-[#34A87E] mt-1.5 flex items-center gap-1">
                        <span>{item.delta}</span>
                      </div>
                    ) : (
                      <div className="font-mono text-xs text-[#F4F1E8]/30 mt-1.5">Stable yield</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sparkline Chart */}
            <div className="p-2 mb-6">
              <svg viewBox="0 0 600 100" className="w-full h-24 sm:h-28 overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0666EB" />
                    <stop offset="50%" stopColor="#34A87E" />
                    <stop offset="100%" stopColor="#D9A94E" />
                  </linearGradient>
                </defs>

                {activeTab === 'investors' ? (
                  <>
                    <path
                      id="sparkPath1"
                      d="M0,80 L60,72 L120,76 L180,55 L240,60 L300,38 L360,44 L420,22 L480,30 L540,10 L600,16"
                      fill="none"
                      stroke="url(#chartGlow)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle r="5" fill="#D9A94E" className="filter drop-shadow-[0_0_8px_rgba(217,169,78,0.9)]">
                      <animateMotion dur="4.8s" repeatCount="indefinite">
                        <mpath href="#sparkPath1" />
                      </animateMotion>
                    </circle>
                  </>
                ) : (
                  <>
                    <path
                      id="sparkPath2"
                      d="M0,90 L60,85 L120,70 L180,72 L240,50 L300,52 L360,34 L420,38 L480,20 L540,24 L600,8"
                      fill="none"
                      stroke="url(#chartGlow)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle r="5" fill="#D9A94E" className="filter drop-shadow-[0_0_8px_rgba(217,169,78,0.9)]">
                      <animateMotion dur="5.2s" repeatCount="indefinite">
                        <mpath href="#sparkPath2" />
                      </animateMotion>
                    </circle>
                  </>
                )}
              </svg>
            </div>

            {/* Rolling Activity Feed */}
            <div className="border-t border-[#F4F1E8]/[0.08] pt-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#F4F1E8]/50 mb-3">
                Live Clearing Activity
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {activeFeedList.slice(0, 4).map((text, idx) => (
                    <motion.div
                      key={`${text}-${idx}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.35 }}
                      className="flex items-center justify-between py-2 border-b border-[#F4F1E8]/[0.04] text-xs sm:text-sm text-[#F4F1E8]/75"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34A87E] shrink-0 shadow-[0_0_6px_rgba(52,168,126,0.8)]" />
                        <span>{text}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#F4F1E8]/40 shrink-0">
                        {TIME_MINS[idx] || 1}m ago
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Live Demo Action Bar */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F4F1E8]/[0.08] mt-6">
              <div className="text-xs text-[#F4F1E8]/60 font-mono">
                Real-time FIX 4.4 &amp; REST protocol feeds active across 14 sovereign exchanges.
              </div>
              <button
                onClick={onNavigateToAuth}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F4F1E8] text-[#0D0F13] font-bold text-xs uppercase tracking-wider hover:bg-[#D9A94E] transition-all duration-200 hover:scale-[1.02] shadow-xl shrink-0"
              >
                <span>Open live demo</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
