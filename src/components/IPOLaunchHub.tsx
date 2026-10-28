import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, TrendingUp, ShieldCheck, DollarSign, Building2, 
  Users, BarChart3, Clock, CheckCircle2, AlertCircle, FileText, 
  Download, Filter, RefreshCw, ChevronRight, Lock, Award, Sparkles, 
  Layers, Landmark, Globe, ArrowUpRight, Check, Send,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { BiometricAuthModal } from './BiometricAuthModal';

export interface IPODeal {
  id: string;
  ticker: string;
  name: string;
  exchange: 'JSE' | 'NGX' | 'NSE Kenya' | 'BRVM' | 'EGX' | 'Dual (JSE/LSE)';
  sector: string;
  valuation: string;
  targetRaise: string;
  targetRaiseNum: number;
  priceRange: { min: number; max: number; currency: string };
  status: 'active_bookbuild' | 'allotment_pending' | 'listed' | 'upcoming_roadshow';
  closingTime: string;
  totalBidsValue: number;
  totalBidsCount: number;
  oversubscriptionRatio: number;
  anchorInvestors: string[];
  leadUnderwriters: string[];
  tranches: {
    name: string;
    targetPercent: number;
    allocatedValue: number;
    subscribedValue: number;
    coverage: number;
  }[];
  description: string;
}

const MOCK_IPOS: IPODeal[] = [
  {
    id: 'ipo-afq-mesh',
    ticker: 'AFQM',
    name: 'AfriQuantX Liquidity Mesh Ltd',
    exchange: 'Dual (JSE/LSE)',
    sector: 'Financial Market Infrastructure & FinTech',
    valuation: 'ZAR 4.80 Billion',
    targetRaise: 'ZAR 950 Million',
    targetRaiseNum: 950000000,
    priceRange: { min: 16.50, max: 20.00, currency: 'ZAR' },
    status: 'active_bookbuild',
    closingTime: '2d 14h 22m',
    totalBidsValue: 4275000000,
    totalBidsCount: 418,
    oversubscriptionRatio: 4.5,
    anchorInvestors: ['Public Investment Corporation (PIC)', 'Africa50 Infrastructure Fund', 'Temasek Africa', 'ADIA Sovereign Trust'],
    leadUnderwriters: ['AfriQuantX Investment Banking', 'Standard Bank CIB', 'Rand Merchant Bank'],
    tranches: [
      { name: 'Institutional Anchor Tranche', targetPercent: 45, allocatedValue: 427500000, subscribedValue: 2137500000, coverage: 5.0 },
      { name: 'Qualified Institutional Buyers (QIB)', targetPercent: 30, allocatedValue: 285000000, subscribedValue: 1425000000, coverage: 5.0 },
      { name: 'Retail Public Tranche', targetPercent: 15, allocatedValue: 142500000, subscribedValue: 513000000, coverage: 3.6 },
      { name: 'Employee & Strategic Partner Trust', targetPercent: 10, allocatedValue: 95000000, subscribedValue: 199500000, coverage: 2.1 }
    ],
    description: 'Pioneering unified cross-border liquidity mesh connecting 14 African stock exchanges with sub-millisecond atomic settlement.'
  },
  {
    id: 'ipo-kalahari-green',
    ticker: 'KGHY',
    name: 'Kalahari Green Hydrogen & Lithium',
    exchange: 'JSE',
    sector: 'Clean Energy & Strategic Minerals',
    valuation: 'ZAR 6.20 Billion',
    targetRaise: 'ZAR 1.40 Billion',
    targetRaiseNum: 1400000000,
    priceRange: { min: 24.00, max: 28.50, currency: 'ZAR' },
    status: 'active_bookbuild',
    closingTime: '4d 08h 15m',
    totalBidsValue: 4480000000,
    totalBidsCount: 312,
    oversubscriptionRatio: 3.2,
    anchorInvestors: ['Industrial Development Corp (IDC)', 'EIB Global', 'Green Climate Fund'],
    leadUnderwriters: ['AfriQuantX Global Markets', 'Nedbank CIB', 'Absa Capital'],
    tranches: [
      { name: 'Institutional Anchor Tranche', targetPercent: 50, allocatedValue: 700000000, subscribedValue: 2520000000, coverage: 3.6 },
      { name: 'Qualified Institutional Buyers (QIB)', targetPercent: 25, allocatedValue: 350000000, subscribedValue: 1190000000, coverage: 3.4 },
      { name: 'Retail Public Tranche', targetPercent: 15, allocatedValue: 210000000, subscribedValue: 567000000, coverage: 2.7 },
      { name: 'Community Empowerment Trust', targetPercent: 10, allocatedValue: 140000000, subscribedValue: 203000000, coverage: 1.45 }
    ],
    description: 'Gigawatt-scale green ammonia production and lithium refining for the global EV battery and export corridor.'
  },
  {
    id: 'ipo-sahara-telecom',
    ticker: 'SHTL',
    name: 'Sahara Telecom Fiber Mesh NG',
    exchange: 'NGX',
    sector: 'Telecommunications & Cloud Interconnect',
    valuation: 'NGN 180 Billion',
    targetRaise: 'NGN 45 Billion',
    targetRaiseNum: 45000000000,
    priceRange: { min: 110.00, max: 135.00, currency: 'NGN' },
    status: 'allotment_pending',
    closingTime: 'Closed (Allotment Live)',
    totalBidsValue: 171000000000,
    totalBidsCount: 890,
    oversubscriptionRatio: 3.8,
    anchorInvestors: ['Nigeria Sovereign Investment Authority (NSIA)', 'AFC', 'FBN Holdings'],
    leadUnderwriters: ['AfriQuantX Advisory', 'Chapel Hill Denham'],
    tranches: [
      { name: 'Institutional Anchor Tranche', targetPercent: 40, allocatedValue: 18000000000, subscribedValue: 79200000000, coverage: 4.4 },
      { name: 'Qualified Institutional Buyers (QIB)', targetPercent: 35, allocatedValue: 15750000000, subscribedValue: 63000000000, coverage: 4.0 },
      { name: 'Retail Public Tranche', targetPercent: 25, allocatedValue: 11250000000, subscribedValue: 28800000000, coverage: 2.56 }
    ],
    description: 'Subsea cable landing station operator and terrestrial dark fiber network connecting West African data centers.'
  }
];

export function IPOLaunchHub({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [ipos, setIpos] = useState<IPODeal[]>(MOCK_IPOS);
  const [selectedIpo, setSelectedIpo] = useState<IPODeal>(MOCK_IPOS[0]);
  const [activeTab, setActiveInternalTab] = useState<'bookbuild' | 'allotment' | 'vdr' | 'pipeline'>('bookbuild');
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);

  // Interactive Bid Placement State
  const [bidPrice, setBidPrice] = useState<number>(selectedIpo.priceRange.max);
  const [bidShares, setBidShares] = useState<number>(10000);
  const [selectedTranche, setSelectedTranche] = useState<string>('Qualified Institutional Buyers (QIB)');
  const [bidType, setBidType] = useState<'limit' | 'market_strike'>('limit');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [bidReceipt, setBidReceipt] = useState<any>(null);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

  // Live Demand Curve Simulation State
  const [priceSteps, setPriceSteps] = useState<{ price: number; demandShares: number; coverage: number }[]>([]);

  useEffect(() => {
    // Generate 7 price step points across the price range
    const { min, max } = selectedIpo.priceRange;
    const step = (max - min) / 6;
    const steps = [];
    for (let i = 0; i <= 6; i++) {
      const p = parseFloat((min + step * i).toFixed(2));
      // Demand decreases as price increases (downward sloping demand curve)
      const baseShares = (selectedIpo.targetRaiseNum / selectedIpo.priceRange.max);
      const elasticity = 1 + (6 - i) * 0.45;
      const demand = Math.round(baseShares * elasticity);
      const cov = parseFloat((demand / baseShares).toFixed(2));
      steps.push({ price: p, demandShares: demand, coverage: cov });
    }
    setPriceSteps(steps);
    setBidPrice(selectedIpo.priceRange.max);
  }, [selectedIpo]);

  const totalBidValue = bidPrice * bidShares;

  const handlePlaceBid = () => {
    setIsBioModalOpen(true);
  };

  const executeConfirmedBid = () => {
    setIsSubmittingBid(true);
    setTimeout(() => {
      setIsSubmittingBid(false);
      const receipt = {
        bidId: `AQX-IPO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        deal: selectedIpo.name,
        ticker: selectedIpo.ticker,
        tranche: selectedTranche,
        shares: bidShares,
        pricePerShare: `${selectedIpo.priceRange.currency} ${bidPrice.toFixed(2)}`,
        totalValue: `${selectedIpo.priceRange.currency} ${(totalBidValue).toLocaleString()}`,
        timestamp: new Date().toLocaleTimeString(),
        clearingNode: 'Strate / DvP Escrow Node #409',
        status: 'CONFIRMED_IN_BOOK'
      };
      setBidReceipt(receipt);

      // Dynamically update bookbuild metrics
      setIpos(prev => prev.map(deal => {
        if (deal.id === selectedIpo.id) {
          const newTotal = deal.totalBidsValue + totalBidValue;
          return {
            ...deal,
            totalBidsValue: newTotal,
            totalBidsCount: deal.totalBidsCount + 1,
            oversubscriptionRatio: parseFloat((newTotal / deal.targetRaiseNum).toFixed(2))
          };
        }
        return deal;
      }));
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFFFFF]/5 blur-[90px] pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFFFF]/10 border border-[#FFFFFF]/30 rounded-full text-xs font-mono text-[#FFFFFF]">
            <Rocket className="w-3.5 h-3.5" />
            <span>Primary Capital Markets & IPO Bookbuilding</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            Pan-African IPO Launch Engine
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Real-time institutional syndication, price discovery curves, tranche allotment algorithms, and atomic DvP settlement across JSE, NGX, NSE Kenya & BRVM.
          </p>
        </div>

        {/* Global IPO KPI Block */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 text-center min-w-[120px]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Active Bookbuilds</span>
            <span className="text-lg font-mono font-black text-[#FFFFFF]">3 Live</span>
          </div>
          <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 text-center min-w-[130px]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Pipeline Capital</span>
            <span className="text-lg font-mono font-black text-white">ZAR 12.4B</span>
          </div>
        </div>
      </div>

      {/* Primary Deal Selector Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ipos.map((deal) => {
          const isSelected = selectedIpo.id === deal.id;
          return (
            <div
              key={deal.id}
              onClick={() => { setSelectedIpo(deal); setBidReceipt(null); }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected 
                  ? 'bg-neutral-950 border-[#FFFFFF] shadow-[0_0_30px_rgba(212,175,55,0.15)]' 
                  : 'bg-black border-white/10 hover:border-white/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFFFFF]/10 blur-[30px]" />
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                    {deal.exchange}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-[#FFFFFF] transition-colors">
                    {deal.name}
                  </h3>
                  <span className="text-xs font-mono text-[#FFFFFF]">{deal.ticker}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    deal.status === 'active_bookbuild' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    deal.status === 'allotment_pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-white/5 text-zinc-400'
                  }`}>
                    {deal.status.replace('_', ' ')}
                  </span>
                  <div className="text-xs font-mono text-zinc-400 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {deal.closingTime}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Oversubscription */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500">Target Raise</span>
                  <span className="text-white font-bold">{deal.targetRaise}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500">Total Bids in Book</span>
                  <span className="text-[#FFFFFF] font-extrabold">{deal.oversubscriptionRatio}x ({((deal.totalBidsValue)/1000000000).toFixed(2)}B)</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FFFFFF] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (deal.oversubscriptionRatio / 5) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workspace Layout with Collapsible Left Sub-Menu */}
      <div className="w-full flex-1 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT SUB-MENU - COLLAPSIBLE */}
        <AnimatePresence initial={false} mode="wait">
          {isSubMenuOpen ? (
            <motion.aside
              key="ipo-left-submenu"
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
                      IPO Modules
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
                    { id: 'bookbuild', label: 'Bookbuilding & Bids', icon: Layers, desc: 'Live Demand & Placement' },
                    { id: 'allotment', label: 'Algorithmic Allotment', icon: Award, desc: 'Pro-Rata & DvP Settlement' },
                    { id: 'vdr', label: 'Virtual Data Room', icon: FileText, desc: 'Audited Prospectus & NDA' },
                    { id: 'pipeline', label: 'Syndicate Underwriting', icon: Landmark, desc: 'Bookrunner Commitments' },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveInternalTab(tab.id as any)}
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
                            {tab.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-2.5 border-t border-white/5 px-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Central Book Synchronized
                    </span>
                  </div>
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.div
              key="ipo-left-submenu-toggle"
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
                <span>Show Modules</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WORKSPACE VIEWPORTS CONTAINER */}
        <div className="flex-1 min-w-0 w-full">
          {/* Tab 1: Live Bookbuilding & Bid Placement */}
          {activeTab === 'bookbuild' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Demand Discovery Curve & Tranche Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Discovery Curve Table */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#FFFFFF]" />
                    Interactive Price Discovery & Demand Curve
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Live institutional order sensitivity across bookbuild price brackets
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Guidance Range</span>
                  <div className="text-sm font-mono font-bold text-[#FFFFFF]">
                    {selectedIpo.priceRange.currency} {selectedIpo.priceRange.min.toFixed(2)} - {selectedIpo.priceRange.max.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Demand Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Price Bracket</th>
                      <th className="py-2.5 px-3">Implied Market Cap</th>
                      <th className="py-2.5 px-3">Cumulative Demand</th>
                      <th className="py-2.5 px-3">Tranche Coverage</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {priceSteps.map((step, idx) => {
                      const isSelectedPrice = bidPrice === step.price;
                      return (
                        <tr 
                          key={idx}
                          className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                            isSelectedPrice ? 'bg-[#FFFFFF]/10' : ''
                          }`}
                          onClick={() => setBidPrice(step.price)}
                        >
                          <td className="py-3 px-3 font-bold text-white">
                            {selectedIpo.priceRange.currency} {step.price.toFixed(2)}
                            {step.price === selectedIpo.priceRange.max && (
                              <span className="ml-2 text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                Strike Top
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-zinc-300">
                            {selectedIpo.priceRange.currency} {((selectedIpo.targetRaiseNum * (step.price / selectedIpo.priceRange.min)) / 1000000000).toFixed(2)}B
                          </td>
                          <td className="py-3 px-3 text-white font-mono">
                            {step.demandShares.toLocaleString()} Shares
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#FFFFFF]">{step.coverage}x</span>
                              <div className="w-16 bg-white/10 h-1 rounded-full overflow-hidden">
                                <div 
                                  className="bg-[#FFFFFF] h-full"
                                  style={{ width: `${Math.min(100, (step.coverage / 5) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setBidPrice(step.price)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                                isSelectedPrice 
                                  ? 'bg-[#FFFFFF] text-black font-black' 
                                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {isSelectedPrice ? 'Selected' : 'Bid at Price'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tranche Allocation & Anchor Investors Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#FFFFFF]" /> Tranche Distribution
                </h4>
                <div className="space-y-3">
                  {selectedIpo.tranches.map((tranche, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white font-medium">{tranche.name}</span>
                        <span className="text-[#FFFFFF] font-mono font-bold">{tranche.coverage}x ({tranche.targetPercent}%)</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#FFFFFF] h-full rounded-full"
                          style={{ width: `${Math.min(100, (tranche.coverage / 5) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Confirmed Anchor Investors
                </h4>
                <ul className="space-y-2">
                  {selectedIpo.anchorInvestors.map((anchor, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-zinc-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{anchor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Col: Interactive Institutional Bid Ticket */}
          <div className="space-y-6">
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFFFFF]/10 blur-[40px] pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#FFFFFF]" />
                  Institutional Bid Entry
                </h3>
                <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-zinc-400">
                  {selectedIpo.ticker}
                </span>
              </div>

              {/* Order Form */}
              <div className="space-y-4">
                {/* Tranche Selector */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Select Tranche</label>
                  <select
                    value={selectedTranche}
                    onChange={(e) => setSelectedTranche(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#FFFFFF] focus:outline-none"
                  >
                    {selectedIpo.tranches.map((t, idx) => (
                      <option key={idx} value={t.name}>{t.name} ({t.targetPercent}%)</option>
                    ))}
                  </select>
                </div>

                {/* Price Mode */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setBidType('limit'); setBidPrice(selectedIpo.priceRange.max); }}
                    className={`py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                      bidType === 'limit' ? 'bg-[#FFFFFF] text-black font-bold' : 'bg-black border border-white/10 text-zinc-400'
                    }`}
                  >
                    Limit Price
                  </button>
                  <button
                    onClick={() => { setBidType('market_strike'); setBidPrice(selectedIpo.priceRange.max); }}
                    className={`py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                      bidType === 'market_strike' ? 'bg-[#FFFFFF] text-black font-bold' : 'bg-black border border-white/10 text-zinc-400'
                    }`}
                  >
                    Strike Cut-Off
                  </button>
                </div>

                {/* Bid Price Input */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    <span>Bid Price ({selectedIpo.priceRange.currency})</span>
                    <span>Range: {selectedIpo.priceRange.min} - {selectedIpo.priceRange.max}</span>
                  </div>
                  <input
                    type="number"
                    step="0.10"
                    min={selectedIpo.priceRange.min}
                    max={selectedIpo.priceRange.max}
                    value={bidPrice}
                    onChange={(e) => setBidPrice(parseFloat(e.target.value) || selectedIpo.priceRange.min)}
                    disabled={bidType === 'market_strike'}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-white focus:border-[#FFFFFF] focus:outline-none"
                  />
                </div>

                {/* Number of Shares */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    <span>Number of Shares</span>
                    <span>Min: 1,000</span>
                  </div>
                  <input
                    type="number"
                    step="1000"
                    min="1000"
                    value={bidShares}
                    onChange={(e) => setBidShares(parseInt(e.target.value) || 1000)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-white focus:border-[#FFFFFF] focus:outline-none"
                  />
                </div>

                {/* Total Bid Commitment Summary */}
                <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Total Commitment:</span>
                    <span className="text-white font-bold">{selectedIpo.priceRange.currency} {totalBidValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Escrow Account:</span>
                    <span className="text-emerald-400 font-bold">Strate Custody Verified</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Authentication:</span>
                    <span className="text-[#FFFFFF]">FIDO2 / WebAuthn Biometric</span>
                  </div>
                </div>

                {/* Submit Bid Button */}
                <button
                  onClick={handlePlaceBid}
                  disabled={isSubmittingBid}
                  className="w-full py-3.5 bg-[#FFFFFF] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-[#E4E4E7] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign & Submit Institutional Bid</span>
                </button>
              </div>

              {/* Receipt Notification */}
              {bidReceipt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono uppercase">
                    <CheckCircle2 className="w-4 h-4" /> Bid Booked Successfully
                  </div>
                  <div className="text-[11px] font-mono text-zinc-300">
                    ID: <span className="text-white">{bidReceipt.bidId}</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-300">
                    Committed: <span className="text-[#FFFFFF] font-bold">{bidReceipt.totalValue}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Algorithmic Allotment & DvP Engine */}
      {activeTab === 'allotment' && (
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FFFFFF]" />
                Algorithmic Share Allotment Engine & DvP Settlement
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Simulates pro-rata, anchor-guaranteed, and retail clawback allotment allocations with atomic CSD clearing.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert("Simulation recalculated with pro-rata algorithm.")}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#FFFFFF] text-white text-xs font-mono uppercase rounded-xl transition-all"
              >
                Recalculate Allocation
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Total Issue Size</span>
              <div className="text-base font-mono font-bold text-white mt-1">
                {(selectedIpo.targetRaiseNum / selectedIpo.priceRange.max).toLocaleString()} Shares
              </div>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Cut-Off Strike Price</span>
              <div className="text-base font-mono font-bold text-[#FFFFFF] mt-1">
                {selectedIpo.priceRange.currency} {selectedIpo.priceRange.max.toFixed(2)}
              </div>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Allotment Ratio</span>
              <div className="text-base font-mono font-bold text-emerald-400 mt-1">
                {(100 / selectedIpo.oversubscriptionRatio).toFixed(1)}% Pro-Rata
              </div>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Clearing Cycle</span>
              <div className="text-base font-mono font-bold text-white mt-1">
                T+2 Atomic DvP
              </div>
            </div>
          </div>

          {/* Allotment Preview Table */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black border-b border-white/10 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Subscriber Category</th>
                  <th className="p-3">Total Bid Value</th>
                  <th className="p-3">Target Quota</th>
                  <th className="p-3">Allotted Shares</th>
                  <th className="p-3">Refund / Escrow Netting</th>
                  <th className="p-3 text-right">CSD Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-neutral-950">
                {selectedIpo.tranches.map((tranche, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold text-white">{tranche.name}</td>
                    <td className="p-3 text-zinc-300">{selectedIpo.priceRange.currency} {(tranche.subscribedValue).toLocaleString()}</td>
                    <td className="p-3 text-[#FFFFFF]">{tranche.targetPercent}%</td>
                    <td className="p-3 text-white font-bold">{Math.round(tranche.allocatedValue / selectedIpo.priceRange.max).toLocaleString()}</td>
                    <td className="p-3 text-zinc-400">{selectedIpo.priceRange.currency} {(tranche.subscribedValue - tranche.allocatedValue).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                        DvP Match Ready
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Virtual Data Room & Prospectus */}
      {activeTab === 'vdr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FFFFFF]" />
              Regulatory Prospectus & Financial VDR
            </h3>
            <p className="text-xs text-zinc-400">
              SEC Form S-1 / JSE SENS pre-listing statement and audited 3-year historical IFRS financials.
            </p>

            <div className="space-y-3">
              {[
                { title: 'Full Pre-Listing Statement & JSE SENS Announcement', size: '14.2 MB', pages: '184 Pages', date: 'August 2026' },
                { title: '3-Year Audited Financial Statements (PwC / Deloitte)', size: '8.7 MB', pages: '92 Pages', date: 'FY2023 - FY2025' },
                { title: 'Independent Competent Persons Valuation Report', size: '22.1 MB', pages: '140 Pages', date: 'July 2026' },
                { title: 'Board Governance, ESG & AfCFTA Trade Impact Assessment', size: '5.4 MB', pages: '48 Pages', date: 'June 2026' }
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-black border border-white/10 rounded-xl hover:border-[#FFFFFF]/50 transition-all">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#FFFFFF]" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                      <span className="text-[10px] font-mono text-zinc-500">{doc.size} • {doc.pages} • {doc.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading verified copy of ${doc.title}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-lg text-xs font-mono"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Cryptographic VDR Access Audit
            </h3>
            <p className="text-xs text-zinc-400">
              Every document view is digitally watermarked with your session ID.
            </p>
            <div className="bg-black p-3.5 rounded-xl border border-white/10 space-y-2 text-[11px] font-mono">
              <div className="text-zinc-400">Watermark: <span className="text-white">Alex Investor (alex.investor@afriquantx.com)</span></div>
              <div className="text-zinc-400">IP Node: <span className="text-white">102.182.44.12 (Johannesburg)</span></div>
              <div className="text-zinc-400">Digital Seal: <span className="text-[#FFFFFF]">SHA256-VDR-788092B</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Syndicate Underwriting Console */}
      {activeTab === 'pipeline' && (
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#FFFFFF]" />
              Syndicate Underwriting Structure & Economics
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Consortium fee waterfall (3.25% Gross Spread) and risk underwriting allocations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedIpo.leadUnderwriters.map((bank, idx) => (
              <div key={idx} className="bg-black border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#FFFFFF] uppercase">{idx === 0 ? 'Lead Left Global Coordinator' : 'Joint Bookrunner'}</span>
                  <Award className="w-4 h-4 text-[#FFFFFF]" />
                </div>
                <h4 className="text-sm font-bold text-white">{bank}</h4>
                <div className="text-xs font-mono text-zinc-400">
                  Underwriting Quota: <span className="text-white font-bold">{idx === 0 ? '50% (ZAR 475M)' : '25% (ZAR 237.5M)'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Hardware Biometric Security Gate Modal */}
      <BiometricAuthModal
        isOpen={isBioModalOpen}
        actionTitle="Authorize IPO Bid Commitment"
        actionDescription={`Hardware verification required to sign and submit institutional subscription of ${bidShares.toLocaleString()} shares of ${selectedIpo.ticker} to the central book.`}
        amount={totalBidValue}
        currency={selectedIpo.priceRange.currency}
        onSuccess={() => {
          setIsBioModalOpen(false);
          executeConfirmedBid();
        }}
        onCancel={() => setIsBioModalOpen(false)}
      />
    </div>
  );
}
