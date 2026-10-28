import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown,
  Globe, 
  Activity, 
  Search, 
  Filter,
  BarChart2,
  Zap,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Newspaper,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Clock,
  Flame,
  Scale,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft
} from 'lucide-react';

import { AQEICopilot } from './AQEICopilot';
import { News } from './News';

interface Company {
  rank: number;
  name: string;
  country: string;
  exchange: string;
  sector: string;
  score: number;
  marketCap: string;
  peRatio: number;
  dividendYield: string;
  esgScore: number;
  trend: string;
  isPositive: boolean;
  volume24h: string;
  aiSignal: 'STRONG_BUY' | 'BUY' | 'ACCUMULATE' | 'HOLD' | 'REDUCE';
}

const baseCompanies = [
  { name: 'Naspers Ltd', country: 'South Africa', exchange: 'JSE', sector: 'Technology', mcap: '$38.4B', pe: 19.4, div: '0.8%', esg: 88 },
  { name: 'FirstRand Group', country: 'South Africa', exchange: 'JSE', sector: 'Financials', mcap: '$24.2B', pe: 10.8, div: '5.2%', esg: 91 },
  { name: 'Dangote Cement Plc', country: 'Nigeria', exchange: 'NGX', sector: 'Materials', mcap: '$14.8B', pe: 14.1, div: '4.6%', esg: 82 },
  { name: 'MTN Group', country: 'South Africa', exchange: 'JSE', sector: 'Telecom', mcap: '$12.5B', pe: 11.2, div: '4.9%', esg: 86 },
  { name: 'Standard Bank Group', country: 'South Africa', exchange: 'JSE', sector: 'Financials', mcap: '$18.9B', pe: 8.9, div: '6.8%', esg: 89 },
  { name: 'Safaricom Plc', country: 'Kenya', exchange: 'NSE', sector: 'Telecom', mcap: '$6.2B', pe: 13.5, div: '5.8%', esg: 94 },
  { name: 'Attijariwafa Bank', country: 'Morocco', exchange: 'CSE', sector: 'Financials', mcap: '$11.6B', pe: 12.3, div: '3.9%', esg: 85 },
  { name: 'Commercial Int. Bank (CIB)', country: 'Egypt', exchange: 'EGX', sector: 'Financials', mcap: '$7.4B', pe: 7.8, div: '4.2%', esg: 84 },
  { name: 'Capitec Bank Holdings', country: 'South Africa', exchange: 'JSE', sector: 'Financials', mcap: '$15.3B', pe: 22.1, div: '2.4%', esg: 90 },
  { name: 'Maroc Telecom', country: 'Morocco', exchange: 'CSE', sector: 'Telecom', mcap: '$8.9B', pe: 15.0, div: '6.1%', esg: 80 },
  { name: 'Vodacom Group', country: 'South Africa', exchange: 'JSE', sector: 'Telecom', mcap: '$11.8B', pe: 12.4, div: '6.5%', esg: 87 },
  { name: 'Airtel Africa Plc', country: 'Nigeria', exchange: 'NGX', sector: 'Telecom', mcap: '$8.1B', pe: 10.6, div: '3.8%', esg: 83 },
  { name: 'Gold Fields Ltd', country: 'South Africa', exchange: 'JSE', sector: 'Materials', mcap: '$13.2B', pe: 16.2, div: '3.2%', esg: 81 },
  { name: 'MTN Nigeria Communications', country: 'Nigeria', exchange: 'NGX', sector: 'Telecom', mcap: '$5.8B', pe: 11.9, div: '7.1%', esg: 85 },
  { name: 'Sanlam Ltd', country: 'South Africa', exchange: 'JSE', sector: 'Financials', mcap: '$9.4B', pe: 11.7, div: '4.8%', esg: 92 },
  { name: 'Anglo American Platinum', country: 'South Africa', exchange: 'JSE', sector: 'Materials', mcap: '$10.5B', pe: 18.0, div: '4.0%', esg: 86 },
  { name: 'Equity Group Holdings', country: 'Kenya', exchange: 'NSE', sector: 'Financials', mcap: '$1.9B', pe: 5.4, div: '8.4%', esg: 93 },
  { name: 'Banque Centrale Populaire', country: 'Morocco', exchange: 'CSE', sector: 'Financials', mcap: '$5.6B', pe: 11.1, div: '4.5%', esg: 79 },
  { name: 'Sasol Ltd', country: 'South Africa', exchange: 'JSE', sector: 'Energy', mcap: '$7.2B', pe: 6.8, div: '7.4%', esg: 74 },
  { name: 'Absa Group Ltd', country: 'South Africa', exchange: 'JSE', sector: 'Financials', mcap: '$8.8B', pe: 7.9, div: '7.8%', esg: 88 },
  { name: 'KCB Group', country: 'Kenya', exchange: 'NSE', sector: 'Financials', mcap: '$1.4B', pe: 4.8, div: '9.2%', esg: 87 },
  { name: 'Eastern Company', country: 'Egypt', exchange: 'EGX', sector: 'Consumer Goods', mcap: '$2.1B', pe: 8.5, div: '11.0%', esg: 72 },
  { name: 'LafargeHolcim Maroc', country: 'Morocco', exchange: 'CSE', sector: 'Materials', mcap: '$3.7B', pe: 16.4, div: '4.1%', esg: 78 },
  { name: 'BUA Cement Plc', country: 'Nigeria', exchange: 'NGX', sector: 'Materials', mcap: '$4.9B', pe: 19.8, div: '3.1%', esg: 76 },
  { name: 'Nedbank Group', country: 'South Africa', exchange: 'JSE', sector: 'Financials', mcap: '$6.5B', pe: 7.6, div: '8.1%', esg: 91 },
  { name: 'Shoprite Holdings', country: 'South Africa', exchange: 'JSE', sector: 'Retail', mcap: '$8.2B', pe: 18.5, div: '3.4%', esg: 89 },
  { name: 'Guaranty Trust Holding (GTCO)', country: 'Nigeria', exchange: 'NGX', sector: 'Financials', mcap: '$2.8B', pe: 4.1, div: '9.8%', esg: 86 },
  { name: 'Sonatel', country: 'Senegal', exchange: 'BRVM', sector: 'Telecom', mcap: '$3.4B', pe: 9.3, div: '8.9%', esg: 84 },
  { name: 'MCB Group Ltd', country: 'Mauritius', exchange: 'SEM', sector: 'Financials', mcap: '$2.2B', pe: 6.9, div: '5.5%', esg: 90 },
  { name: 'Fawry Banking & Payment', country: 'Egypt', exchange: 'EGX', sector: 'Technology', mcap: '$1.3B', pe: 28.4, div: '0.0%', esg: 81 },
  { name: 'Zenith Bank Plc', country: 'Nigeria', exchange: 'NGX', sector: 'Financials', mcap: '$2.4B', pe: 3.8, div: '10.5%', esg: 85 },
  { name: 'Sibanye Stillwater', country: 'South Africa', exchange: 'JSE', sector: 'Materials', mcap: '$4.1B', pe: 14.2, div: '3.5%', esg: 79 },
  { name: 'Bidcorp', country: 'South Africa', exchange: 'JSE', sector: 'Consumer Services', mcap: '$7.8B', pe: 17.6, div: '2.9%', esg: 87 },
  { name: 'East African Breweries', country: 'Kenya', exchange: 'NSE', sector: 'Consumer Goods', mcap: '$1.1B', pe: 12.0, div: '6.4%', esg: 88 },
  { name: 'Talaat Moustafa Group', country: 'Egypt', exchange: 'EGX', sector: 'Real Estate', mcap: '$3.1B', pe: 11.5, div: '2.8%', esg: 75 },
  { name: 'Bank of Africa BMCE', country: 'Morocco', exchange: 'CSE', sector: 'Financials', mcap: '$4.2B', pe: 10.9, div: '4.2%', esg: 82 },
  { name: 'Seplat Energy Plc', country: 'Nigeria', exchange: 'NGX', sector: 'Energy', mcap: '$2.6B', pe: 7.1, div: '6.2%', esg: 80 },
  { name: 'Discovery Ltd', country: 'South Africa', exchange: 'JSE', sector: 'Financials', mcap: '$5.4B', pe: 13.8, div: '2.1%', esg: 93 },
  { name: 'Remgro Ltd', country: 'South Africa', exchange: 'JSE', sector: 'Financials', mcap: '$4.6B', pe: 11.0, div: '3.7%', esg: 86 },
  { name: 'Ecobank Transnational (ETI)', country: 'Togo', exchange: 'BRVM', sector: 'Financials', mcap: '$1.8B', pe: 4.5, div: '7.9%', esg: 83 }
];

const generateTop100 = (): Company[] => {
  const list: Company[] = [];
  let currentScore = 98.6;
  let seed = 4481;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const signalsList: ('STRONG_BUY' | 'BUY' | 'ACCUMULATE' | 'HOLD' | 'REDUCE')[] = [
    'STRONG_BUY', 'BUY', 'ACCUMULATE', 'BUY', 'HOLD', 'STRONG_BUY', 'BUY', 'ACCUMULATE', 'HOLD', 'REDUCE'
  ];

  for (let i = 0; i < baseCompanies.length; i++) {
    const rawTrend = (random() * 5.4 - 1.8).toFixed(2);
    const isPos = parseFloat(rawTrend) >= 0;
    const volNum = (random() * 45 + 5).toFixed(1);
    
    list.push({
      rank: i + 1,
      name: baseCompanies[i].name,
      country: baseCompanies[i].country,
      exchange: baseCompanies[i].exchange,
      sector: baseCompanies[i].sector,
      score: parseFloat(currentScore.toFixed(1)),
      marketCap: baseCompanies[i].mcap,
      peRatio: baseCompanies[i].pe,
      dividendYield: baseCompanies[i].div,
      esgScore: baseCompanies[i].esg,
      trend: isPos ? `+${rawTrend}%` : `${rawTrend}%`,
      isPositive: isPos,
      volume24h: `$${volNum}M`,
      aiSignal: signalsList[i % signalsList.length]
    });
    currentScore -= random() * 0.4 + 0.08;
  }

  const sectors = ['Financials', 'Telecom', 'Materials', 'Consumer Goods', 'Technology', 'Energy', 'Real Estate', 'Healthcare', 'Industrials'];
  const regions = [
    { c: 'South Africa', e: 'JSE' },
    { c: 'Nigeria', e: 'NGX' },
    { c: 'Kenya', e: 'NSE' },
    { c: 'Egypt', e: 'EGX' },
    { c: 'Morocco', e: 'CSE' },
    { c: 'Mauritius', e: 'SEM' },
    { c: 'Ivory Coast', e: 'BRVM' },
    { c: 'Ghana', e: 'GSE' },
    { c: 'Botswana', e: 'BSE' },
    { c: 'Namibia', e: 'NSX' },
  ];

  const prefixes = ['Pan-African', 'Continental', 'Apex', 'Crown', 'Summit', 'Pioneer', 'Atlas', 'Equatorial', 'Savannah', 'Alpha', 'Nexus', 'Helios', 'Sahara', 'Zambezi', 'Nile', 'Kilimanjaro'];
  const suffixes = ['Holdings', 'Bank', 'Corp', 'Resources', 'Industries', 'Enterprises', 'Capital', 'Ventures', 'Trust', 'Energy', 'Telecom', 'Logistics'];

  for (let i = baseCompanies.length; i < 100; i++) {
    const region = regions[Math.floor(random() * regions.length)];
    const sector = sectors[Math.floor(random() * sectors.length)];
    const name = `${prefixes[Math.floor(random() * prefixes.length)]} ${suffixes[Math.floor(random() * suffixes.length)]} ${random() > 0.5 ? 'Plc' : 'Ltd'}`;
    const rawTrend = (random() * 6.2 - 2.8).toFixed(2);
    const isPos = parseFloat(rawTrend) >= 0;
    const mcapNum = (random() * 3.5 + 0.4).toFixed(1);
    const peNum = parseFloat((random() * 18 + 4.5).toFixed(1));
    const divNum = (random() * 7 + 1.2).toFixed(1);
    const esgNum = Math.floor(random() * 25 + 68);
    const volNum = (random() * 18 + 1.5).toFixed(1);

    list.push({
      rank: i + 1,
      name: name,
      country: region.c,
      exchange: region.e,
      sector: sector,
      score: parseFloat(currentScore.toFixed(1)),
      marketCap: `$${mcapNum}B`,
      peRatio: peNum,
      dividendYield: `${divNum}%`,
      esgScore: esgNum,
      trend: isPos ? `+${rawTrend}%` : `${rawTrend}%`,
      isPositive: isPos,
      volume24h: `$${volNum}M`,
      aiSignal: signalsList[Math.floor(random() * signalsList.length)]
    });
    currentScore -= random() * 0.35 + 0.05;
  }
  return list;
};

const topCompanies = generateTop100();

const predictiveSignals = [
  { 
    id: 'sig-1', 
    type: 'STRONG_BUY', 
    asset: 'Safaricom Plc (NSE: SCOM)', 
    confidence: '92%', 
    horizon: '1-3 Months',
    reason: 'M-PESA cross-border remittance corridor volume expanded +28.4% YoY. AI earnings surprise model projects 140 bps EBITDA margin expansion.', 
    time: '2m ago',
    currentPrice: 'KES 16.20',
    targetPrice: 'KES 21.50',
    stopLoss: 'KES 14.80',
    upside: '+32.7%',
    catalyst: 'Q3 FY26 Financials Release & Ethiopia ARPU inflection'
  },
  { 
    id: 'sig-2', 
    type: 'BUY', 
    asset: 'Standard Bank Group (JSE: SBK)', 
    confidence: '88%', 
    horizon: '2-4 Weeks',
    reason: 'Corporate investment banking syndicated pipeline in Sub-Saharan energy infrastructure up 3.2x. Net interest margin supported by SARB yield curve steepening.', 
    time: '8m ago',
    currentPrice: 'ZAR 208.50',
    targetPrice: 'ZAR 245.00',
    stopLoss: 'ZAR 194.00',
    upside: '+17.5%',
    catalyst: 'Capital return dividend announcement & share repurchase mandate'
  },
  { 
    id: 'sig-3', 
    type: 'ACCUMULATE', 
    asset: 'Dangote Cement Plc (NGX: DANGCEM)', 
    confidence: '84%', 
    horizon: '3-6 Months',
    reason: 'Sub-Saharan clinker export substitution reaching critical density. Local currency price realization offsetting raw material FX translation friction.', 
    time: '18m ago',
    currentPrice: 'NGN 680.00',
    targetPrice: 'NGN 820.00',
    stopLoss: 'NGN 620.00',
    upside: '+20.5%',
    catalyst: 'Pan-African capacity commissioning in West & Central Africa'
  },
  { 
    id: 'sig-4', 
    type: 'HOLD', 
    asset: 'MTN Group Ltd (JSE: MTN)', 
    confidence: '71%', 
    horizon: '1-2 Months',
    reason: 'Macro FX translation volatility across Nigerian and Ghanaian subsidiaries moderating, though fintech standalone carve-out valuation re-rating remains pending.', 
    time: '45m ago',
    currentPrice: 'ZAR 104.20',
    targetPrice: 'ZAR 116.00',
    stopLoss: 'ZAR 96.50',
    upside: '+11.3%',
    catalyst: 'Fintech minority strategic equity partner closing'
  },
  { 
    id: 'sig-5', 
    type: 'REDUCE', 
    asset: 'Guaranty Trust Holding (NGX: GTCO)', 
    confidence: '79%', 
    horizon: '2-3 Weeks',
    reason: 'Institutional asset rotation scanner indicates capital re-allocation from banking sector into primary industrial materials and sovereign infrastructure debt.', 
    time: '1h ago',
    currentPrice: 'NGN 42.10',
    targetPrice: 'NGN 35.80',
    stopLoss: 'NGN 44.50',
    upside: '-14.9%',
    catalyst: 'CBN cash reserve ratio liquidity compliance cycle'
  }
];

export function AQEI() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'top100' | 'signals' | 'advisor' | 'news'>('dashboard');
  const [selectedBourse, setSelectedBourse] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortColumn, setSortColumn] = useState<string>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterText, setFilterText] = useState<string>('');
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  const [signalFilter, setSignalFilter] = useState<string>('ALL');
  const [liveTelemetryTick, setLiveTelemetryTick] = useState(0);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTelemetryTick(t => t + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const boursesList = ['ALL', 'JSE', 'NGX', 'NSE', 'EGX', 'CSE', 'BRVM', 'SEM'];
  const sectorsList = ['ALL', 'Financials', 'Telecom', 'Materials', 'Technology', 'Energy', 'Consumer Goods', 'Retail'];

  const filteredAndSortedCompanies = useMemo(() => {
    let result = topCompanies;

    if (selectedBourse !== 'ALL') {
      result = result.filter(c => c.exchange === selectedBourse);
    }

    if (selectedSector !== 'ALL') {
      result = result.filter(c => c.sector === selectedSector);
    }

    if (filterText.trim()) {
      const lower = filterText.toLowerCase();
      result = result.filter(
        c => c.name.toLowerCase().includes(lower) || 
             c.country.toLowerCase().includes(lower) ||
             c.sector.toLowerCase().includes(lower) ||
             c.exchange.toLowerCase().includes(lower)
      );
    }

    return [...result].sort((a, b) => {
      let valA: any = a[sortColumn as keyof Company];
      let valB: any = b[sortColumn as keyof Company];

      if (sortColumn === 'trend') {
        valA = parseFloat((valA as string).replace('%', ''));
        valB = parseFloat((valB as string).replace('%', ''));
      } else if (sortColumn === 'marketCap') {
        valA = parseFloat((valA as string).replace('$', '').replace('B', ''));
        valB = parseFloat((valB as string).replace('$', '').replace('B', ''));
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filterText, selectedBourse, selectedSector, sortColumn, sortDirection]);

  const filteredSignals = useMemo(() => {
    if (signalFilter === 'ALL') return predictiveSignals;
    return predictiveSignals.filter(s => s.type === signalFilter);
  }, [signalFilter]);

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      
      {/* 1. TOP EXECUTIVE HEADER - STRETCHED & BORDERLESS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">AQEI Quantitative Intelligence</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
                  Live Engine v4.8
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Institutional algorithmic intelligence, NLP earnings synthesis & predictive alpha across 38+ African stock exchanges.
              </p>
            </div>
          </div>
        </div>

        {/* Live Telemetry Matrix */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400 font-medium">Bourses Connected:</span>
            <span className="font-bold text-white font-mono">38 Exchanges</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/60 text-xs">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-zinc-400 font-medium">Latency:</span>
            <span className="font-bold text-white font-mono">4.2ms FIX</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/60 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span className="text-zinc-400 font-medium">Confidence:</span>
            <span className="font-bold text-emerald-400 font-mono">94.8%</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE WITH COLLAPSIBLE LEFT SUB-MENU */}
      <div className="w-full flex-1 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT SUB-MENU - COLLAPSIBLE */}
        <AnimatePresence initial={false} mode="wait">
          {isSubMenuOpen ? (
            <motion.aside
              key="aqei-left-submenu"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full lg:w-64 shrink-0 overflow-hidden"
            >
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-3 space-y-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                      AQEI Navigation
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSubMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Hide Sub-Menu"
                    aria-label="Hide Sub-Menu"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: 'dashboard', label: 'Quant Matrix', icon: BarChart2, description: 'Live Pan-African Indices' },
                    { id: 'top100', label: 'Top 100 AI Index', icon: TrendingUp, description: 'Composite Score Ranks' },
                    { id: 'signals', label: 'Alpha Signals', icon: Zap, description: 'Predictive Signals' },
                    { id: 'advisor', label: 'Institutional Copilot', icon: MessageSquare, description: 'Natural Language Quant' },
                    { id: 'news', label: 'Financial Wire', icon: Newspaper, description: 'Direct Exchange Feeds' },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-white text-black shadow-lg shadow-white/10'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-bold uppercase tracking-wider truncate ${isActive ? 'text-black font-extrabold' : 'text-zinc-200'}`}>
                            {tab.label}
                          </div>
                          <div className={`text-[10px] truncate ${isActive ? 'text-zinc-700' : 'text-zinc-500'}`}>
                            {tab.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-2.5 border-t border-white/5 px-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                      Rebalance: 14h 22m
                    </span>
                    <span className="text-emerald-400 font-bold">Online</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.div
              key="aqei-left-submenu-toggle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="shrink-0"
            >
              <button
                onClick={() => setIsSubMenuOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all shadow-xl cursor-pointer group"
                title="Show Sub-Menu"
              >
                <PanelLeftOpen className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
                <span>Show Sub-Menu</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. MAIN WORKSPACE VIEWPORTS */}
        <div className="flex-1 min-w-0 w-full min-h-[600px]">
        
        {/* =========================================================================
            TAB 1: QUANT MATRIX DASHBOARD (STRETCHED, FLUID, BORDERLESS)
            ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 w-full">
            
            {/* Live Pan-African Market Indices - Fluid Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">Pan-African Bourse Index Grid</h2>
                </div>
                <span className="text-xs text-zinc-400 font-mono">Direct API Feeds: JSE • NGX • NSE • EGX • CSE • BRVM</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {[
                  { name: 'JSE Top 40', country: 'South Africa', val: '76,210.40', change: '+1.54%', pos: true, code: 'ZAR' },
                  { name: 'NGX All-Share', country: 'Nigeria', val: '104,820.10', change: '+2.38%', pos: true, code: 'NGN' },
                  { name: 'NSE 20 Share', country: 'Kenya', val: '1,788.60', change: '+0.82%', pos: true, code: 'KES' },
                  { name: 'EGX 30 Index', country: 'Egypt', val: '29,140.00', change: '+3.45%', pos: true, code: 'EGP' },
                  { name: 'BRVM Composite', country: 'UEMOA', val: '224.80', change: '+0.71%', pos: true, code: 'XOF' },
                  { name: 'AQX Pan-Africa 100', country: 'Continental', val: '4,120.50', change: '+2.65%', pos: true, code: 'USD' },
                ].map((idx, i) => (
                  <div 
                    key={i}
                    className="p-4 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900/80 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white tracking-tight">{idx.name}</p>
                        <p className="text-[10px] text-zinc-400">{idx.country}</p>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
                        {idx.code}
                      </span>
                    </div>

                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="text-base font-bold font-mono text-white tracking-tight">{idx.val}</p>
                      </div>
                      <span className={`text-xs font-bold font-mono flex items-center ${idx.pos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {idx.pos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {idx.change}
                      </span>
                    </div>

                    <div className="w-full bg-white/5 h-1 rounded-full mt-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${idx.pos ? 'bg-emerald-400' : 'bg-rose-400'}`}
                        style={{ width: `${65 + (i * 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Core Quantitative AI Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-neutral-900/50 flex flex-col justify-between hover:bg-neutral-900/70 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      Active
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Liquidity & Arbitrage Engine</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Continuous cross-listing spread scanner across dual-listed shares (e.g. Airtel Africa NGX/LSE, Seplat).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">NGX / LSE Spread:</span>
                    <span className="text-emerald-400 font-mono font-bold">0.42% Arbitrage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">JSE Order Imbalance:</span>
                    <span className="text-white font-mono font-bold">+ZAR 480M Inflow</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/50 flex flex-col justify-between hover:bg-neutral-900/70 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">
                      NLP v5
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">NLP Earnings Sentiment</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Deep semantic parsing of central bank transcripts, SENS/NSE regulatory filings, and executive earnings calls.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Disclosures Scanned:</span>
                    <span className="text-white font-mono font-bold">148 Filings (24h)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Bullish Conviction:</span>
                    <span className="text-emerald-400 font-mono font-bold">78.4% Net Pos</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/50 flex flex-col justify-between hover:bg-neutral-900/70 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">
                      Macro
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Macro FX & AfCFTA Corridor</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Multivariate sovereign yield spreads, foreign currency reserves tracking, and regional intra-African trade models.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">USD/ZAR Volatility:</span>
                    <span className="text-white font-mono font-bold">11.8% (Compressed)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">AfCFTA Flow Growth:</span>
                    <span className="text-emerald-400 font-mono font-bold">+18.2% YoY</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/50 flex flex-col justify-between hover:bg-neutral-900/70 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-white flex items-center justify-center font-bold">
                      <Scale className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      ESG 94/100
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">ESG & Governance Radar</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Carbon transition intensity, executive board composition, and regulatory compliance scoring across bourses.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Leader Rank:</span>
                    <span className="text-white font-mono font-bold">Safaricom (ESG 94)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Risk Outliers:</span>
                    <span className="text-zinc-400 font-mono font-bold">0 Flagged Today</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Sector Capital Flows & Real-time Alpha Feed - 2 Column Stretched */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sector Capital Allocation */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Sector Capital Inflows & Outflows</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Real-time institutional liquidity distribution across African equity sectors.</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">+ZAR 1.42B Net Daily Flow</span>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { sector: 'Financials & Banking', flow: '+$640M', pct: '+3.8%', weight: '38%', pos: true },
                    { sector: 'Telecommunications & Fintech', flow: '+$420M', pct: '+2.9%', weight: '24%', pos: true },
                    { sector: 'Materials, Gold & Critical Minerals', flow: '+$280M', pct: '+1.4%', weight: '18%', pos: true },
                    { sector: 'Energy & Transition Infrastructure', flow: '+$140M', pct: '+2.1%', weight: '10%', pos: true },
                    { sector: 'Consumer Goods & Retail', flow: '-$60M', pct: '-0.8%', weight: '7%', pos: false },
                    { sector: 'Real Estate & Logistics', flow: '+$20M', pct: '+0.4%', weight: '3%', pos: true }
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{s.sector}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">({s.weight} index weight)</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-zinc-400">{s.flow}</span>
                          <span className={`font-bold ${s.pos ? 'text-emerald-400' : 'text-rose-400'}`}>{s.pct}</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${s.pos ? 'bg-white' : 'bg-rose-400'}`}
                          style={{ width: s.weight }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Conviction Alpha Alerts */}
              <div className="p-6 rounded-2xl bg-neutral-900/50 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Live Alpha Stream</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="space-y-3">
                    {predictiveSignals.slice(0, 3).map((sig) => (
                      <div 
                        key={sig.id}
                        onClick={() => setActiveTab('signals')}
                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${
                            sig.type === 'STRONG_BUY' || sig.type === 'BUY'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-white/10 text-white'
                          }`}>
                            {sig.type}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">{sig.time}</span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">{sig.asset}</p>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400 font-mono">{sig.currentPrice} → {sig.targetPrice}</span>
                          <span className="text-emerald-400 font-bold font-mono">{sig.upside}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('signals')}
                  className="w-full py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span>Open Signal Matrix</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: TOP 100 PAN-AFRICAN AI INDEX (STRETCHED, HIGH DATA DENSITY)
            ========================================================================= */}
        {activeTab === 'top100' && (
          <div className="space-y-5 w-full">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-900/50">
              
              {/* Bourse Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-1 shrink-0">Bourse:</span>
                {boursesList.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBourse(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors shrink-0 cursor-pointer ${
                      selectedBourse === b 
                        ? 'bg-white text-black' 
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Sector Filter & Search */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-3 py-2 bg-neutral-800 text-white rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
                >
                  {sectorsList.map((s) => (
                    <option key={s} value={s}>{s === 'ALL' ? 'All Sectors' : s}</option>
                  ))}
                </select>

                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Search 100 companies..."
                    className="w-full pl-9 pr-4 py-2 bg-neutral-800 text-white rounded-xl text-xs placeholder:text-zinc-500 focus:outline-none focus:bg-neutral-700 transition-colors"
                  />
                </div>
              </div>

            </div>

            {/* Stretched Borderless Data Table */}
            <div className="w-full overflow-x-auto rounded-2xl bg-neutral-900/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] uppercase tracking-widest text-zinc-400 bg-white/[0.02]">
                    <th className="p-4 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('rank')}>
                      Rank {sortColumn === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                      Company & Country {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('exchange')}>
                      Exchange {sortColumn === 'exchange' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('sector')}>
                      Sector {sortColumn === 'sector' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('marketCap')}>
                      Market Cap {sortColumn === 'marketCap' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('peRatio')}>
                      P/E {sortColumn === 'peRatio' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('score')}>
                      AI Quant Score {sortColumn === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('trend')}>
                      24h Delta {sortColumn === 'trend' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 font-bold text-center">AI Rating</th>
                    <th className="p-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredAndSortedCompanies.map((c) => {
                    const isExpanded = expandedCompany === c.rank;
                    return (
                      <React.Fragment key={c.rank}>
                        <tr 
                          onClick={() => setExpandedCompany(isExpanded ? null : c.rank)}
                          className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        >
                          <td className="p-4 font-mono text-zinc-400 font-bold">#{c.rank}</td>
                          <td className="p-4">
                            <div className="font-bold text-white">{c.name}</div>
                            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{c.country}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono font-bold text-[10px]">
                              {c.exchange}
                            </span>
                          </td>
                          <td className="p-4 text-zinc-300">{c.sector}</td>
                          <td className="p-4 font-mono text-white font-bold">{c.marketCap}</td>
                          <td className="p-4 font-mono text-zinc-300">{c.peRatio}x</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-white rounded-full"
                                  style={{ width: `${c.score}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-white">{c.score}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`font-mono font-bold flex items-center gap-0.5 ${c.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {c.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {c.trend}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              c.aiSignal === 'STRONG_BUY' || c.aiSignal === 'BUY'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : c.aiSignal === 'ACCUMULATE'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-white/10 text-zinc-300'
                            }`}>
                              {c.aiSignal}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button className="p-1.5 rounded-lg text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Company Deep-Dive Row */}
                        {isExpanded && (
                          <tr className="bg-white/[0.02]">
                            <td colSpan={10} className="p-6 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-900/60">
                                <div>
                                  <p className="text-[10px] font-mono uppercase text-zinc-400">Dividend Yield</p>
                                  <p className="text-base font-mono font-bold text-white mt-0.5">{c.dividendYield}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-mono uppercase text-zinc-400">ESG Sustainability Rating</p>
                                  <p className="text-base font-mono font-bold text-emerald-400 mt-0.5">{c.esgScore} / 100</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-mono uppercase text-zinc-400">24h Institutional Volume</p>
                                  <p className="text-base font-mono font-bold text-white mt-0.5">{c.volume24h}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-mono uppercase text-zinc-400">Exchange Settlement</p>
                                  <p className="text-base font-mono font-bold text-white mt-0.5">T+2 DvP Cleared</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: PREDICTIVE ALPHA SIGNALS (STRETCHED, HIGH IMPACT, BORDERLESS)
            ========================================================================= */}
        {activeTab === 'signals' && (
          <div className="space-y-6 w-full">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Algorithmic Trade Recommendations</h3>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {['ALL', 'STRONG_BUY', 'BUY', 'ACCUMULATE', 'HOLD', 'REDUCE'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSignalFilter(t)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-colors shrink-0 cursor-pointer ${
                      signalFilter === t 
                        ? 'bg-white text-black' 
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Predictive Signals Cards - Stretched full-width */}
            <div className="grid grid-cols-1 gap-4">
              {filteredSignals.map((signal) => (
                <div 
                  key={signal.id}
                  className="p-6 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900/70 transition-all duration-200 flex flex-col lg:flex-row items-start gap-6"
                >
                  <div className={`px-5 py-3 rounded-xl font-bold font-mono text-sm uppercase tracking-widest shrink-0 ${
                    signal.type === 'STRONG_BUY' || signal.type === 'BUY'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : signal.type === 'ACCUMULATE'
                      ? 'bg-blue-500/10 text-blue-400'
                      : signal.type === 'REDUCE'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-white/10 text-white'
                  }`}>
                    {signal.type}
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">{signal.asset}</h4>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                          Horizon: {signal.horizon} • Catalyst: {signal.catalyst}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-400 font-mono px-3 py-1 rounded-lg bg-white/5 self-start sm:self-auto">
                        {signal.time}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {signal.reason}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-white/[0.02]">
                        <p className="text-[10px] font-mono uppercase text-zinc-400">AI Confidence</p>
                        <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">{signal.confidence}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02]">
                        <p className="text-[10px] font-mono uppercase text-zinc-400">Current Price</p>
                        <p className="text-sm font-mono font-bold text-white mt-0.5">{signal.currentPrice}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02]">
                        <p className="text-[10px] font-mono uppercase text-zinc-400">Target Target</p>
                        <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">{signal.targetPrice}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02]">
                        <p className="text-[10px] font-mono uppercase text-zinc-400">Stop Loss</p>
                        <p className="text-sm font-mono font-bold text-rose-400 mt-0.5">{signal.stopLoss}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.02] col-span-2 sm:col-span-1">
                        <p className="text-[10px] font-mono uppercase text-zinc-400">Projected Upside</p>
                        <p className="text-sm font-mono font-bold text-white mt-0.5">{signal.upside}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: INSTITUTIONAL COPILOT (STRETCHED & EMBEDDED)
            ========================================================================= */}
        {activeTab === 'advisor' && (
          <div className="w-full h-full">
            <AQEICopilot />
          </div>
        )}

        {/* =========================================================================
            TAB 5: REAL-TIME FINANCIAL NEWS WIRE
            ========================================================================= */}
        {activeTab === 'news' && (
          <div className="w-full h-full">
            <News />
          </div>
        )}

        </div>
      </div>

    </div>
  );
}
