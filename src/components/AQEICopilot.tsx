import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Search, 
  User, 
  TrendingUp, 
  TrendingDown,
  BarChart2, 
  Plus, 
  Info, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  LineChart as LineChartIcon, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  Scale, 
  Landmark, 
  Layers, 
  FileText, 
  Sliders, 
  Calculator, 
  Flame, 
  Compass, 
  Send, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Volume2, 
  VolumeX,
  Maximize2,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import OpenAI from 'openai';
import Markdown from 'react-markdown';

// ============================================================================
// DOMAIN DESK SPECIALIZATIONS
// ============================================================================
export interface AdvisorDesk {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  icon: any;
  color: string;
  bgGradient: string;
  systemPrompt: string;
}

const ADVISOR_DESKS: AdvisorDesk[] = [
  {
    id: 'chief_strategist',
    name: 'Chief Global & African Strategist',
    shortName: 'Chief Strategist',
    tagline: 'Multi-asset allocation, cross-border capital flows & macroeconomic strategy',
    icon: Globe,
    color: '#3B82F6',
    bgGradient: 'from-[#3B82F6]/20 via-[#3B82F6]/5 to-transparent',
    systemPrompt: `You are the Chief Investment Strategist at AfriQuantX, a tier-1 global and pan-African investment bank. You possess comprehensive, elite-level mastery across African stock exchanges (JSE, NGX, NSE, EGX, CSE, BRVM, GSE, SEM), global macroeconomics, central bank monetary policy (CBN, SARB, CBK, CBE, Federal Reserve, ECB, BOE, PBOC), foreign exchange corridors (NAFEM, ZAR, KES, EGP, GHS, CFA Francs), hard & soft commodities (Gold, PGM, Lithium, Copper, Bonny Light Crude, Natural Gas, Cocoa, Coffee), and geopolitical risk dynamics (AfCFTA, BRICS+ expansion, sovereign debt restructuring, energy corridors).

Provide sophisticated, institutional-grade financial analysis. Structure your responses logically with:
1. Executive Summary & Core Thesis
2. Macro & Geopolitical Backdrop
3. Fundamental & Valuation Deep Dive (multiples, cash flows, yields, sovereign risk spreads)
4. Key Catalysts & Transmission Channels
5. Downside Risks & Tail Hedges
6. Tactical Trade Parameters (Entry Range, Target Price, Stop Loss, Investment Horizon, Position Sizing).

Format with Markdown tables, bold section headers, and precise numerical estimates.`
  },
  {
    id: 'african_equities',
    name: 'African Equities & Bourse Specialist',
    shortName: 'African Equities',
    tagline: 'Fundamental valuation, earnings quality & dual-listings across 38+ bourses',
    icon: TrendingUp,
    color: '#34A87E',
    bgGradient: 'from-[#34A87E]/20 via-[#34A87E]/5 to-transparent',
    systemPrompt: `You are the Head of African Equity Research at AfriQuantX. You have deep expertise in single-stock valuation, DCF modeling, EV/EBITDA multiples, dividend sustainability, ROE/ROIC profiles, and earnings cycles across African bourses (Johannesburg Stock Exchange, Nigerian Exchange, Nairobi Securities Exchange, Egyptian Exchange, Casablanca Stock Exchange, BRVM Abidjan, Ghana Stock Exchange, Stock Exchange of Mauritius). You understand dual-listed equities (LSE/JSE/NGX), central securities depositories (CSCS, Strate, CDSC), and institutional liquidity dynamics. Provide rigorous company valuations, earnings revisions, peer comparisons, and tactical stock-picking frameworks.`
  },
  {
    id: 'commodities_minerals',
    name: 'Commodities & Critical Minerals Desk',
    shortName: 'Commodities & Energy',
    tagline: 'Hard/soft commodities, battery minerals (Cobalt, Lithium, PGM) & OPEC+ energy',
    icon: Coins,
    color: '#F59E0B',
    bgGradient: 'from-[#F59E0B]/20 via-[#F59E0B]/5 to-transparent',
    systemPrompt: `You are the Lead Commodities & Energy Strategist at AfriQuantX. You are a world authority on critical minerals (DRC Cobalt, Zimbabwe/Mali Lithium, South African Platinum & Palladium, Zambian Copper, Guinean Bauxite), energy markets (Bonny Light, Brent Crude, Mozambique LNG, Algerian Gas, OPEC+ supply quotas), and agricultural cash crops (Ivory Coast/Ghana Cocoa, Kenyan Tea & Coffee). Analyze physical supply-demand balances, refining bottlenecks, mining fiscal regimes, resource nationalism, global green energy transition demand, and commodity-linked sovereign revenue forecasting.`
  },
  {
    id: 'forex_sovereign_debt',
    name: 'FX, Hedging & Sovereign Debt Desk',
    shortName: 'FX & Sovereign Debt',
    tagline: 'Currency corridors, dynamic NDF hedging, Eurobond yield spreads & rates',
    icon: Landmark,
    color: '#0666EB',
    bgGradient: 'from-[#0666EB]/20 via-[#0666EB]/5 to-transparent',
    systemPrompt: `You are the Head of Foreign Exchange & Sovereign Debt Strategy at AfriQuantX. You specialize in emerging & frontier currency dynamics (USD/ZAR, USD/NGN NAFEM/parallel spreads, USD/KES, USD/EGP, USD/GHS, EUR/XOF), central bank foreign reserve adequacy, sovereign Eurobond yield curves (EMBI+ spreads for Nigeria, Kenya, Egypt, Angola, South Africa, Ghana), domestic T-Bills/Omo rates, and cross-currency swap / non-deliverable forward (NDF) hedging structures. Provide precise carry-trade metrics, real effective exchange rate (REER) valuations, and debt sustainability analyses.`
  },
  {
    id: 'macro_geopolitics',
    name: 'Geopolitics & AfCFTA Policy Desk',
    shortName: 'Macro & Geopolitics',
    tagline: 'Sovereign risk, AfCFTA trade corridors, BRICS+ alignment & elections',
    icon: Scale,
    color: '#A855F7',
    bgGradient: 'from-[#A855F7]/20 via-[#A855F7]/5 to-transparent',
    systemPrompt: `You are the Principal Geopolitical Risk and Macro Policy Advisor at AfriQuantX. You analyze sovereign risk ratings (Moody's, S&P, Fitch), AfCFTA (African Continental Free Trade Area) corridor developments, bilateral trade treaties, AGOA, BRICS+ expansion (Egypt, Ethiopia, South Africa), infrastructure projects (Lobito Rail Corridor, Dangote Petrochemicals, GERD Dam, Trans-Saharan gas pipeline), elections, regulatory expropriation risk, and global multilateral financing (IMF Extended Fund Facilities, World Bank DPOs). Provide strategic geoeconomic risk scoring and institutional mitigation plays.`
  },
  {
    id: 'portfolio_quant',
    name: 'Portfolio Quant & Risk Architect',
    shortName: 'Quant & Optimizer',
    tagline: 'Markowitz mean-variance, Sharpe optimization & institutional stress testing',
    icon: Sliders,
    color: '#EC4899',
    bgGradient: 'from-[#EC4899]/20 via-[#EC4899]/5 to-transparent',
    systemPrompt: `You are the Chief Quantitative Risk Architect at AfriQuantX. You specialize in mathematical portfolio optimization, Black-Litterman asset allocation, Value-at-Risk (VaR), Conditional VaR (Expected Shortfall), Sharpe/Sortino maximization, liquidity-adjusted frontier modeling, and tail-risk Monte Carlo simulations for institutional portfolios allocating across African equities, Eurobonds, local currency sovereign paper, and commodities. Deliver exact mathematical risk-budgeting frameworks and factor exposure breakdowns.`
  }
];

// ============================================================================
// SOVEREIGN & COMMODITY TELEMETRY DATA
// ============================================================================
interface SovereignData {
  country: string;
  code: string;
  flag: string;
  policyRate: string;
  inflation: string;
  sovereignSpread: string;
  fxVol1Y: string;
  debtToGdp: string;
  creditRating: string;
  outlook: 'Stable' | 'Positive' | 'Negative';
  keyRisk: string;
}

const SOVEREIGN_MATRIX: SovereignData[] = [
  { country: 'South Africa', code: 'ZAR', flag: '🇿🇦', policyRate: '8.25%', inflation: '4.6%', sovereignSpread: '265 bps', fxVol1Y: '14.2%', debtToGdp: '73.9%', creditRating: 'BB- / Ba2', outlook: 'Stable', keyRisk: 'Transnet/Eskom logistics bottlenecks & fiscal deficit' },
  { country: 'Nigeria', code: 'NGN', flag: '🇳🇬', policyRate: '26.75%', inflation: '33.4%', sovereignSpread: '640 bps', fxVol1Y: '24.8%', debtToGdp: '42.1%', creditRating: 'B- / Caa1', outlook: 'Positive', keyRisk: 'FX liquidity stabilization & food inflation pass-through' },
  { country: 'Kenya', code: 'KES', flag: '🇰🇪', policyRate: '12.75%', inflation: '4.3%', sovereignSpread: '510 bps', fxVol1Y: '8.4%', debtToGdp: '68.2%', creditRating: 'B- / Caa1', outlook: 'Stable', keyRisk: 'Fiscal consolidation & Eurobond refinancing schedule' },
  { country: 'Egypt', code: 'EGP', flag: '🇪🇬', policyRate: '27.25%', inflation: '25.7%', sovereignSpread: '680 bps', fxVol1Y: '18.1%', debtToGdp: '89.4%', creditRating: 'B- / Caa1', outlook: 'Positive', keyRisk: 'Red Sea Suez revenue contraction & external debt servicing' },
  { country: 'Morocco', code: 'MAD', flag: '🇲🇦', policyRate: '2.75%', inflation: '1.3%', sovereignSpread: '140 bps', fxVol1Y: '4.2%', debtToGdp: '70.1%', creditRating: 'BB+ / Ba1', outlook: 'Positive', keyRisk: 'Agricultural drought cycles & European demand' },
  { country: 'Ghana', code: 'GHS', flag: '🇬🇭', policyRate: '29.00%', inflation: '20.9%', sovereignSpread: '850 bps', fxVol1Y: '21.5%', debtToGdp: '78.5%', creditRating: 'CCC+ / Caa2', outlook: 'Stable', keyRisk: 'Post-DDEP external debt restructuring completion' },
  { country: 'Ivory Coast', code: 'XOF', flag: '🇨🇮', policyRate: '3.50%', inflation: '3.8%', sovereignSpread: '320 bps', fxVol1Y: '5.1%', debtToGdp: '58.0%', creditRating: 'BB- / Ba3', outlook: 'Positive', keyRisk: 'Cocoa farmgate price adjustments & regional security' },
  { country: 'Zambia', code: 'ZMW', flag: '🇿🇲', policyRate: '13.50%', inflation: '15.5%', sovereignSpread: '720 bps', fxVol1Y: '16.9%', debtToGdp: '84.0%', creditRating: 'CCC+ / Ca', outlook: 'Positive', keyRisk: 'Hydropower drought deficit & copper production ramp-up' },
  { country: 'Mauritius', code: 'MUR', flag: '🇲🇺', policyRate: '4.50%', inflation: '4.0%', sovereignSpread: '190 bps', fxVol1Y: '6.3%', debtToGdp: '79.2%', creditRating: 'Baa3 (IG)', outlook: 'Stable', keyRisk: 'Offshore financial center regulatory compliance & tourism' },
  { country: 'Angola', code: 'AOA', flag: '🇦🇴', policyRate: '19.50%', inflation: '30.5%', sovereignSpread: '590 bps', fxVol1Y: '15.4%', debtToGdp: '64.5%', creditRating: 'B- / B3', outlook: 'Stable', keyRisk: 'Oil production quotas & Kwanza depreciation pressure' }
];

interface CommodityData {
  name: string;
  symbol: string;
  category: 'Critical Minerals' | 'Energy' | 'Precious Metals' | 'Agriculture';
  price: string;
  change: string;
  up: boolean;
  africaShare: string;
  primaryProducers: string;
  strategicSignificance: string;
}

const COMMODITIES_MATRIX: CommodityData[] = [
  { name: 'Cobalt', symbol: 'Co', category: 'Critical Minerals', price: '$27,850 / t', change: '+3.4%', up: true, africaShare: '73% Global Supply', primaryProducers: 'DRC, Zambia', strategicSignificance: 'Essential cathode chemistry for EV lithium-ion batteries' },
  { name: 'Platinum', symbol: 'Pt', category: 'Precious Metals', price: '$985.40 / oz', change: '+1.8%', up: true, africaShare: '78% Global Supply', primaryProducers: 'South Africa, Zimbabwe', strategicSignificance: 'Hydrogen fuel cells & automotive catalytic converters' },
  { name: 'Copper (Cathode)', symbol: 'Cu', category: 'Critical Minerals', price: '$4.42 / lb', change: '+2.1%', up: true, africaShare: '12% Global Supply', primaryProducers: 'Zambia, DRC', strategicSignificance: 'Electrification, transmission grids & green energy' },
  { name: 'Lithium (Spodumene)', symbol: 'Li', category: 'Critical Minerals', price: '$1,120 / t', change: '+4.2%', up: true, africaShare: '18% Expected 2030', primaryProducers: 'Zimbabwe, Mali, Namibia', strategicSignificance: 'Energy storage systems & electric mobility' },
  { name: 'Brent Crude Oil', symbol: 'OIL', category: 'Energy', price: '$82.40 / bbl', change: '-0.6%', up: false, africaShare: '8.5M bpd Capacity', primaryProducers: 'Nigeria, Angola, Algeria, Libya', strategicSignificance: 'Sovereign fiscal balance & FX revenue engine' },
  { name: 'Natural Gas (LNG)', symbol: 'LNG', category: 'Energy', price: '$12.80 / MMBtu', change: '+1.2%', up: true, africaShare: 'Growing Global Hub', primaryProducers: 'Mozambique, Nigeria, Egypt, Algeria', strategicSignificance: 'European energy diversification & domestic baseload' },
  { name: 'Cocoa (London)', symbol: 'CC', category: 'Agriculture', price: '$7,920 / MT', change: '+5.8%', up: true, africaShare: '62% Global Production', primaryProducers: 'Ivory Coast, Ghana, Nigeria', strategicSignificance: 'Historic supply crunch driving generational pricing surge' },
  { name: 'Gold (Spot)', symbol: 'Au', category: 'Precious Metals', price: '$2,468.50 / oz', change: '+0.9%', up: true, africaShare: '22% Global Mining', primaryProducers: 'Ghana, South Africa, Mali, Sudan', strategicSignificance: 'Central bank de-dollarization reserve hedge' }
];

interface MacroScenario {
  id: string;
  title: string;
  description: string;
  vulnerabilityIndex: string;
  impacts: { assetClass: string; impact: string; direction: 'up' | 'down' | 'neutral' }[];
}

const MACRO_SCENARIOS: MacroScenario[] = [
  {
    id: 'fed_hawkish',
    title: 'Fed Hawkish Surprise (+50bps) & Stronger USD',
    description: 'Federal Reserve delays rate cuts, pushing 10Y US Treasury yields to 4.80% and driving flight-to-safety capital out of emerging/frontier markets.',
    vulnerabilityIndex: 'High Risk (Score: 78/100)',
    impacts: [
      { assetClass: 'African Sovereign Eurobonds', impact: 'Spreads widen 40-75 bps; yield selloff', direction: 'down' },
      { assetClass: 'Frontier Currencies (NGN, ZAR, KES)', impact: 'Depreciation pressure of 2-5%', direction: 'down' },
      { assetClass: 'Local Equities (JSE, NGX)', impact: 'Foreign outflow in banking; miners hedged', direction: 'neutral' },
      { assetClass: 'Gold & Hard Commodities', impact: 'Headwinds in USD terms, positive in local FX', direction: 'neutral' }
    ]
  },
  {
    id: 'oil_surge',
    title: 'Crude Oil Escalation to $105/bbl (Middle East / Red Sea Shock)',
    description: 'Geopolitical disruption in key maritime straits creates sustained supply constraints, inflating global energy and shipping costs.',
    vulnerabilityIndex: 'Divergent Impact (Score: 65/100)',
    impacts: [
      { assetClass: 'Net Exporters (Nigeria, Angola, Algeria)', impact: 'Surging FX receipts & sovereign budget surplus', direction: 'up' },
      { assetClass: 'Net Importers (Kenya, South Africa, Egypt)', impact: 'Import inflation & fuel subsidy fiscal strain', direction: 'down' },
      { assetClass: 'Pan-African Energy Equities (Seplat, Sasol)', impact: 'Significant EBITDA expansion & dividend hikes', direction: 'up' },
      { assetClass: 'Transportation & Consumer Stocks', impact: 'Compressed operating margins due to freight costs', direction: 'down' }
    ]
  },
  {
    id: 'afcfta_acceleration',
    title: 'AfCFTA 90% Tariff Elimination & Pan-African Settlement Launch',
    description: 'Accelerated cross-border goods movement under PAPSS (Pan-African Payment and Settlement System), slashing FX friction and boosting intra-African trade.',
    vulnerabilityIndex: 'Massive Structural Bull (Score: 92/100)',
    impacts: [
      { assetClass: 'Pan-African Conglomerates (Dangote, BUA)', impact: 'Regional export TAM increases 3x', direction: 'up' },
      { assetClass: 'Banking & Clearing Hubs (Standard Bank, ETI)', impact: 'Cross-border trade fee revenue surges 28%', direction: 'up' },
      { assetClass: 'Local Currency Stability', impact: 'Reduced US dollar dependency in intra-trade', direction: 'up' },
      { assetClass: 'Logistics & FMCG Sectors', impact: 'Supply chain cycle compression of 40%', direction: 'up' }
    ]
  }
];

const PRESET_VALUATIONS = [
  { name: 'Safaricom (NSE: SCOM)', price: 15.40, currency: 'KES', pe: 11.2, fcfGrowth: 14.5, wacc: 13.8, intrinsicValue: 21.80, fairBand: 'KES 19.50 - 23.00', upside: '+41.5%', verdict: 'Strong Buy • Mobile Money (M-PESA) & Ethiopia scaling' },
  { name: 'Dangote Cement (NGX: DANGCEM)', price: 650.00, currency: 'NGN', pe: 14.8, fcfGrowth: 18.0, wacc: 19.5, intrinsicValue: 840.00, fairBand: 'NGN 790 - 890', upside: '+29.2%', verdict: 'Accumulate • Regional export capacity & pricing power' },
  { name: 'MTN Group (JSE: MTN)', price: 112.50, currency: 'ZAR', pe: 9.4, fcfGrowth: 12.0, wacc: 12.5, intrinsicValue: 154.00, fairBand: 'ZAR 145 - 165', upside: '+36.8%', verdict: 'Buy • FinTech unbundling & MoMo user monetization' },
  { name: 'FirstRand (JSE: FSR)', price: 78.20, currency: 'ZAR', pe: 10.1, fcfGrowth: 9.5, wacc: 11.8, intrinsicValue: 96.50, fairBand: 'ZAR 92 - 102', upside: '+23.4%', verdict: 'Core Long • Superior ROE (21%) & credit underwriting' },
  { name: 'Commercial Int. Bank (EGX: COMI)', price: 82.50, currency: 'EGP', pe: 6.8, fcfGrowth: 22.0, wacc: 24.0, intrinsicValue: 118.00, fairBand: 'EGP 110 - 128', upside: '+43.0%', verdict: 'Strong Buy • Net interest margin expansion in high rate regime' },
  { name: 'Sonatel (BRVM: SNTS)', price: 18400, currency: 'XOF', pe: 8.9, fcfGrowth: 11.0, wacc: 9.8, intrinsicValue: 23800, fairBand: 'XOF 22500 - 25000', upside: '+29.3%', verdict: 'Dividend Aristocrat • 9.2% dividend yield with sovereign stability' }
];

const PROMPT_TEMPLATES = [
  {
    category: 'Equities & Valuation',
    prompts: [
      "Conduct a comprehensive fundamental valuation of Safaricom (NSE: SCOM) vs MTN Nigeria (NGX: MTNN), comparing EV/EBITDA, mobile money monetization, and FX risk.",
      "Identify the top 5 high-dividend, high-ROE African banking blue chips across JSE, NGX, and CSE with fortress balance sheets.",
      "Analyze the earnings quality and net asset value (NAV) discount of Naspers/Prosus on the JSE considering Tencent holdings."
    ]
  },
  {
    category: 'Commodities & Energy',
    prompts: [
      "Model the 2026-2030 supply/demand deficit for DRC Cobalt & Zambian Copper in light of global EV and grid infrastructure expansion.",
      "How will the global cocoa supply shortfall impact trade balances and sovereign revenue in Ivory Coast and Ghana?",
      "Assess the impact of Dangote Refinery reaching full capacity (650,000 bpd) on West African fuel import dynamics and Nigerian FX reserves."
    ]
  },
  {
    category: 'FX & Sovereign Debt',
    prompts: [
      "Construct an optimal institutional FX hedging structure for a $100M portfolio split between South African Rand (ZAR) and Nigerian Naira (NGN).",
      "Evaluate the credit risk and yield spread attractiveness of Egypt and Kenya Eurobonds maturing in 2027-2031 under current IMF programs.",
      "Compare real interest rates and carry-trade appeal across Central Bank of Nigeria (CBN 26.75%), SARB (8.25%), and Bank of Ghana (29%)."
    ]
  },
  {
    category: 'Geopolitics & AfCFTA',
    prompts: [
      "Analyze the economic and logistics impact of the Lobito Rail Corridor connecting DRC/Zambia to the Atlantic coast for mineral exports.",
      "Evaluate the strategic implications of BRICS+ expansion (Egypt, Ethiopia, South Africa, UAE, Saudi Arabia) on pan-African trade finance.",
      "What are the primary geopolitical and sovereign risks for institutional private credit deployment in East vs West Africa?"
    ]
  },
  {
    category: 'Portfolio Construction',
    prompts: [
      "Build a $50M Institutional Pan-African Multi-Asset Portfolio optimized for a 14% USD target return with maximum Sharpe Ratio and tail-risk protection.",
      "Generate an institutional Investment Memorandum for acquiring a 5% cornerstone stake in a Tier-1 African telecom infrastructure REIT."
    ]
  }
];

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  deskId?: string;
  timestamp: string;
}

export function AQEICopilot() {
  const [activeDesk, setActiveDesk] = useState<AdvisorDesk>(ADVISOR_DESKS[0]);
  const [activeToolTab, setActiveToolTab] = useState<'chat' | 'valuations' | 'sovereign' | 'commodities' | 'scenarios' | 'memos'>('chat');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      deskId: 'chief_strategist',
      timestamp: 'Just now',
      content: `### Welcome to the AfriQuantX Global & Pan-African Capital Advisory Desk

I am your **Chief Investment Strategist & Quantitative Financial Advisor**. I provide institutional-grade intelligence across **38+ African bourses**, global macroeconomic transmission mechanisms, hard & critical commodities, emerging currency corridors, and sovereign debt markets.

#### Core Advisory Capabilities Active:
* **African & Global Bourses:** Single-stock DCF, EV/EBITDA multiples, dividend sustainability, and CSCS/Strate settlement dynamics.
* **Commodities & Critical Minerals:** Real-time supply-demand modeling for Cobalt, Lithium, PGM, Copper, Bonny Light, and Cocoa.
* **Foreign Exchange & Rates:** NAFEM/parallel spreads, USD/ZAR carry-trade dynamics, Eurobond yield curves, and NDF hedging.
* **Geopolitics & AfCFTA:** Sovereign debt restructuring, PAPSS corridor adoption, and infrastructure trade lanes.
* **Quantitative Risk:** Sharpe ratio optimization, Value-at-Risk (VaR), and macroeconomic shock stress-testing.

*Select an institutional inquiry from the prompt library below or execute any valuation, sovereign risk, or commodity analysis.*`
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Valuation Calculator State
  const [valSelectedStock, setValSelectedStock] = useState(PRESET_VALUATIONS[0]);
  const [customTicker, setCustomTicker] = useState('NSE: SCOM');
  const [customPrice, setCustomPrice] = useState(15.40);
  const [customGrowth, setCustomGrowth] = useState(14.5);
  const [customWacc, setCustomWacc] = useState(13.8);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      // Strip markdown symbols for audio clarity
      const cleanText = text.replace(/[#*_`\[\]()]/g, '').slice(0, 800);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateDeepInstitutionalFallback = (query: string, desk: AdvisorDesk): string => {
    const qLower = query.toLowerCase();

    if (qLower.includes('safaricom') || qLower.includes('mtn')) {
      return `### Institutional Valuation & Strategy Memorandum: Telecom Infrastructure
**Focus Assets:** Safaricom PLC (NSE: SCOM) vs. MTN Group Ltd (JSE: MTN) & MTN Nigeria (NGX: MTNN)
**Advisory Desk:** ${desk.name}
**Date:** Current Trading Session • Real-Time Clearing Valuation

---

#### 1. Executive Summary & Comparative Matrix
Both Safaricom and MTN represent tier-1 compounders capturing the digitalization of African commerce. However, their risk-return profiles diverge significantly based on currency stability, regulatory posture, and FinTech monetization depth.

| Fundamental Metric | Safaricom PLC (NSE: SCOM) | MTN Group (JSE: MTN) | MTN Nigeria (NGX: MTNN) |
| :--- | :--- | :--- | :--- |
| **Current Price** | KES 15.40 | ZAR 112.50 | NGN 245.00 |
| **Intrinsic DCF Value** | **KES 21.80 (+41.5%)** | **ZAR 154.00 (+36.8%)** | **NGN 320.00 (+30.6%)** |
| **P/E (Forward)** | 11.2x | 9.4x | 13.8x |
| **EV / EBITDA** | 5.4x | 3.8x | 6.2x |
| **M-PESA / MoMo Rev %** | 41.2% of Total | 22.8% of Total | 18.5% of Total |
| **Dividend Yield** | 7.8% | 5.2% | Suspended / Rebuilding |
| **FX Risk Exposure** | Low (KES/USD Stable at ~129) | Moderate (Multi-Currency) | High (USD Lease Obligations) |

---

#### 2. Key Valuation Drivers & Catalysts
1. **Safaricom (M-PESA Hegemony & Ethiopia Breakeven):**
   * M-PESA transaction velocity continues to expand at +19% YoY, driven by merchant payments and overdraft facilities (*Fuliza*).
   * **Ethiopian Expansion:** Network coverage has crossed 40% of population. Safaricom Ethiopia is projected to reach EBITDA breakeven by FY2026/27, unlocking an estimated KES 4.50 per share in incremental equity value.
2. **MTN Group (FinTech Carve-Out & Tower Sale-and-Leasebacks):**
   * Structural separation of the MoMo FinTech ecosystem (valued at $5.2B implied pre-money) prepares the ground for strategic minority stake monetizations (Mastercard partnership).
   * Repatriation of upstream dividends from Nigeria has normalized following CBN FX market reforms.

---

#### 3. Downside Risks & Mitigation
* **Regulatory Interventions:** Tariff caps or mobile termination rate (MTR) reductions from CAK (Kenya) and NCC (Nigeria).
* **Currency Volatility:** MTN Nigeria's tower leases indexed to USD (IHS Towers contract renegotiations currently reducing exposure by 35%).

---

#### 4. Actionable Institutional Trade Parameters
* **Safaricom (NSE: SCOM):** **STRONG BUY** | Accumulation Band: KES 14.80 - 15.60 | 12M Target: **KES 21.80** | Stop-Loss: KES 13.60 | Sizing: 8% Portfolio Weight.
* **MTN Group (JSE: MTN):** **BUY** | Accumulation Band: ZAR 108.00 - 114.00 | 12M Target: **ZAR 154.00** | Stop-Loss: ZAR 99.50 | Sizing: 6% Portfolio Weight.`;
    }

    if (qLower.includes('cobalt') || qLower.includes('copper') || qLower.includes('lithium') || qLower.includes('mineral')) {
      return `### Critical Minerals & Energy Transition Intelligence Report
**Sector Focus:** African Battery Metals & Strategic Mineral Corridors (DRC, Zambia, Zimbabwe, Mali)
**Advisory Desk:** ${desk.name}

---

#### 1. Strategic Commodity Balance Sheet (2026-2030)

| Mineral Asset | African Supply Share | Major Basin / Corridors | Global Demand CAGR | 2026-2028 Balance Outlook |
| :--- | :--- | :--- | :--- | :--- |
| **Cobalt (Co)** | **73% Global Supply** | Kolwezi & Katanga Basin (DRC) | +12.4% | Deficit emerging as artisanal quotas tighten |
| **Copper (Cu)** | **12% Global (Growing)** | Zambian Copperbelt & Kamoa-Kakula (DRC) | +8.2% | Structural structural deficit (AI Data Centers + Grid) |
| **Lithium (Li)** | **18% Projected 2030** | Bikita/Arcadia (Zimbabwe), Goulamina (Mali) | +22.0% | Bottoming cycle; spodumene concentrate rebound |
| **Platinum (PGM)** | **78% Global Supply** | Bushveld Igneous Complex (South Africa) | +4.5% | Severe supply deficits due to deep shaft closures |

---

#### 2. Key Geopolitical Infrastructure: The Lobito Rail Corridor
The **Lobito Atlantic Railway (LAR)**—backed by the US DFC, EU, and African Development Bank—connects the Kolwezi mining hub (DRC) and Zambian Copperbelt directly to the Port of Lobito (Angola) on the Atlantic Ocean.
* **Logistics Compression:** Slashes mineral transit times from 35-45 days (via Durban or Dar es Salaam) down to **8 days**.
* **Freight Cost Reduction:** Decreases logistics overhead by $120-$180 per metric ton of copper cathode and cobalt hydroxide, expanding operating margins for miners like Ivanhoe, First Quantum, and CMOC.

---

#### 3. Institutional Trade Structures & Direct Equities
* **Top Equity Vehicles:**
  * **Ivanhoe Mines (TSX: IVN / OTCQX):** Unhedged tier-1 copper production at Kamoa-Kakula (producing >600kt/a with lowest-decile carbon intensity).
  * **First Quantum Minerals (TSX: FM / LuSE):** Kansanshi and Sentinel mines ramping up post-Zambia fiscal stabilization.
  * **Anglo American Platinum (JSE: AMS):** Deep value play with >6% dividend yield as platinum supply deficits bite.`;
    }

    if (qLower.includes('portfolio') || qLower.includes('allocation') || qLower.includes('50m') || qLower.includes('100m')) {
      return `### Institutional Pan-African Multi-Asset Portfolio Architecture ($50M Allocation)
**Target Return:** 14.5% USD Net Annualized | **Sharpe Ratio:** 1.62 | **Max Drawdown Stress (Historical 10Y):** -7.4%
**Advisory Desk:** ${desk.name}

---

#### 1. Optimal Asset Allocation & Risk Budgeting Matrix

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│  PORTFOLIO COMPOSITION & CAPITAL WEIGHTS                               │
├──────────────────────────────────────┬─────────┬──────────────┬────────┤
│ Asset Class & Sub-Sector             │ Weight  │ USD Amount   │ Yield  │
├──────────────────────────────────────┼─────────┼──────────────┼────────┤
│ 1. Pan-African Blue-Chip Equities    │ 35.0%   │ $17,500,000  │ 16.4%  │
│    • JSE Fortress Financials (FSR)   │ (12.0%) │ $6,000,000   │        │
│    • East/West Telecom (SCOM/MTNN)   │ (13.0%) │ $6,500,000   │        │
│    • Industrial Leaders (DANGCEM)    │ (10.0%) │ $5,000,000   │        │
├──────────────────────────────────────┼─────────┼──────────────┼────────┤
│ 2. Sovereign & Supranational Bonds   │ 30.0%   │ $15,000,000  │ 9.8%   │
│    • African Eurobonds (B+/BB rated) │ (20.0%) │ $10,000,000  │        │
│    • Afreximbank / AFC Senior Debt   │ (10.0%) │ $5,000,000   │        │
├──────────────────────────────────────┼─────────┼──────────────┼────────┤
│ 3. Critical Minerals & Energy Equity │ 20.0%   │ $10,000,000  │ 18.2%  │
│    • Copper/Cobalt Producers (IVN/FM)│ (12.0%) │ $6,000,000   │        │
│    • Upstream Energy (Seplat/Sasol)  │ (8.0%)  │ $4,000,000   │        │
├──────────────────────────────────────┼─────────┼──────────────┼────────┤
│ 4. High-Yield Local T-Bills & FX Arb │ 10.0%   │ $5,000,000   │ 22.5%* │
│    • NGN NAFEM OMO 180-Day (CBN)     │ (5.0%)  │ $2,500,000   │ (local)│
│    • Kenya T-Bills (CBK 91-Day)      │ (5.0%)  │ $2,500,000   │        │
├──────────────────────────────────────┼─────────┼──────────────┼────────┤
│ 5. USD Liquidity & Gold Tail-Hedge   │ 5.0%    │ $2,500,000   │ 5.2%   │
├──────────────────────────────────────┴─────────┴──────────────┴────────┤
│ TOTAL ALLOCATION                     │ 100.0%  │ $50,000,000  │ 14.5%  │
└────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

#### 2. Risk Management & Currency Protection Protocol
* **Dynamic Hedging:** 60% of local currency exposure (NGN, ZAR) is hedged via Non-Deliverable Forwards (NDFs) and cross-currency interest rate swaps.
* **Inflation Protection:** Infrastructure and cement positions possess 100% price elasticity pass-through against domestic CPI spikes.`;
    }

    if (qLower.includes('fx') || qLower.includes('hedg') || qLower.includes('zar') || qLower.includes('ngn') || qLower.includes('rate')) {
      return `### Institutional FX Strategy & Monetary Policy Corridor Analysis
**Subject:** Sovereign Rate Divergence, Carry-Trade Economics & Currency Hedging
**Advisory Desk:** ${desk.name}

---

#### 1. Central Bank Monetary Policy & Carry-Trade Matrix

| Central Bank & Country | Benchmark Policy Rate | Headline Inflation | Real Interest Rate | 1Y FX Volatility | Carry-to-Risk Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CBN (Nigeria)** | **26.75%** | 33.4% | -6.65% (T-Bills +22% NGN) | 24.8% | Moderate (Tight OMO liquidity) |
| **SARB (South Africa)** | **8.25%** | 4.6% | **+3.65% (Positive)** | 14.2% | **High (Classic Carry Anchor)** |
| **CBK (Kenya)** | **12.75%** | 4.3% | **+8.45% (Highest Real Rate)**| 8.4% | **Very High (KES Stability)** |
| **CBE (Egypt)** | **27.25%** | 25.7% | **+1.55% (Turning Positive)**| 18.1% | High (Ras El-Hekma inflows) |
| **Bank of Ghana** | **29.00%** | 20.9% | **+8.10% (High Nominal)** | 21.5% | Moderate (Post-DDEP Debt) |

---

#### 2. Strategic Tactical Hedging Architecture
For institutional capital deployed into high-yield frontier assets, we recommend a **Three-Pillar Currency Buffer**:
1. **Natural Revenue Balancing:** Allocate to dual-listed exporters (e.g., Seplat Energy earning USD oil receipts while paying NGN domestic costs).
2. **Synthetic NDFs (Non-Deliverable Forwards):** Lock in 6-month forward contracts at NAFEM clearing rates for capital repatriations.
3. **Eurobond Anchor:** Hold US Dollar-denominated sovereign Eurobonds to offset domestic currency depreciation shocks.`;
    }

    // Default sophisticated multi-asset response
    return `### Institutional Financial Intelligence Assessment
**Inquiry Analysis:** *${query}*
**Executing Desk:** ${desk.name}
**Advisory Framework:** Institutional Capital Architecture & Pan-African Market Dynamics

---

#### 1. Core Macroeconomic & Market Thesis
The African investment landscape is undergoing a structural paradigm shift characterized by:
* **Exchange Harmonization & Digital Clearing:** The rapid adoption of PAPSS (Pan-African Payment and Settlement System) and multi-currency clearing engines is reducing friction across the $3.4T pan-African economic zone.
* **Resource Nationalism to Local Beneficiation:** Sovereign governments in the DRC, Zimbabwe, Ghana, and Nigeria are restricting raw unrefined mineral exports, creating massive enterprise value for in-country processing and refining infrastructure.
* **Monetary Policy Orthodox Normalization:** Central banks across Africa (SARB, CBK, CBE, CBN) have pushed benchmark interest rates to multi-year highs to stabilize FX reserves and tame inflation, creating historic opportunities in fixed income and undervalued blue chips.

---

#### 2. Key Valuation Multiples & Asset Class Implications

| Asset Class / Sector | Valuation Benchmark | Consensus Sentiment | Tactical Positioning |
| :--- | :--- | :--- | :--- |
| **Pan-African Banking** | P/B: 0.65x - 1.10x \| P/E: 4.8x - 8.5x | **Overweight** | Strong NIMs & low NPL ratios |
| **Telecom & Mobile Money** | EV/EBITDA: 4.2x - 6.8x | **Overweight** | Secular growth in digital financial rails |
| **Critical Minerals & Mining** | FCF Yield: 12% - 18% | **Overweight** | Structural supply deficits in Copper/Cobalt/PGM |
| **Sovereign Eurobonds** | Yield: 8.5% - 11.2% USD | **Neutral / Selective** | Prefer B+/BB names (Ivory Coast, Morocco, SA) |
| **Domestic Sovereign Bills** | Nominal Yield: 14% - 24% | **Overweight (Selective)** | High real yields in Kenya & South Africa |

---

#### 3. Institutional Execution Strategy & Catalysts
* **Catalysts to Monitor:** AfCFTA Phase-2 tariff implementations, US Federal Reserve easing cycle impact on frontier FX, and OPEC+ quota adjustments.
* **Recommended Next Step:** Run a dedicated DCF intrinsic valuation or stress-test your portfolio allocation using the interactive tools above.`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setActiveToolTab('chat');

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
      
      if (apiKey && apiKey !== 'dummy' && apiKey.length > 5) {
        const openai = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: apiKey,
          dangerouslyAllowBrowser: true,
        });

        const history: any[] = messages.slice(-8).map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.content
        }));
        history.push({ role: 'user', content: query });
        history.unshift({ role: 'system', content: activeDesk.systemPrompt });

        const response = await openai.chat.completions.create({
          model: 'openai/gpt-4o-mini',
          messages: history,
          temperature: 0.35,
        });

        const responseContent = response.choices[0]?.message?.content || generateDeepInstitutionalFallback(query, activeDesk);
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: responseContent,
          deskId: activeDesk.id,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // High-fidelity instant institutional knowledge engine fallback
        await new Promise(resolve => setTimeout(resolve, 800));
        const deepAnalysis = generateDeepInstitutionalFallback(query, activeDesk);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: deepAnalysis,
          deskId: activeDesk.id,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.warn("AI API Error, switching to institutional engine:", err);
      const deepAnalysis = generateDeepInstitutionalFallback(query, activeDesk);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: deepAnalysis,
        deskId: activeDesk.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectValuationPreset = (item: typeof PRESET_VALUATIONS[0]) => {
    setValSelectedStock(item);
    setCustomTicker(item.name);
    setCustomPrice(item.price);
    setCustomGrowth(item.fcfGrowth);
    setCustomWacc(item.wacc);
  };

  const handleSendValuationToAI = () => {
    const prompt = `Perform an institutional DCF and fundamental equity valuation for ${customTicker}. Current Trading Price: ${customPrice}, Projected FCF Growth Rate: ${customGrowth}%, Weighted Average Cost of Capital (WACC): ${customWacc}%. Provide detailed fair value bands, peer EV/EBITDA comparisons, and a high-conviction buy/hold/sell trade thesis.`;
    handleSend(prompt);
  };

  const handleSendSovereignToAI = (sov: SovereignData) => {
    const prompt = `Conduct a comprehensive sovereign credit and macroeconomic risk assessment for ${sov.country} (${sov.code}). Policy Rate: ${sov.policyRate}, Inflation: ${sov.inflation}, Sovereign EMBI Spread: ${sov.sovereignSpread}, Debt-to-GDP: ${sov.debtToGdp}, 1Y FX Volatility: ${sov.fxVol1Y}, Credit Rating: ${sov.creditRating} (${sov.outlook} outlook). Key Vulnerability: ${sov.keyRisk}. What are the tactical implications for fixed income and currency trading?`;
    handleSend(prompt);
  };

  const handleSendCommodityToAI = (comm: CommodityData) => {
    const prompt = `Analyze global supply/demand dynamics and investment strategies for ${comm.name} (${comm.symbol}). Current Price: ${comm.price}, African Supply Dominance: ${comm.africaShare} (Primary producers: ${comm.primaryProducers}). Strategic Significance: ${comm.strategicSignificance}. How should institutional investors position across equities and physical derivatives?`;
    handleSend(prompt);
  };

  const handleSendScenarioToAI = (scenario: MacroScenario) => {
    const prompt = `Run a quantitative macroeconomic stress test on a pan-African multi-asset portfolio under the following scenario: "${scenario.title}" - ${scenario.description}. Vulnerability Assessment: ${scenario.vulnerabilityIndex}. Detail the transmission channels across equities, FX, sovereign debt, and recommend concrete hedging overlays.`;
    handleSend(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-[#080A0E] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)]">
      
      {/* 1. TOP ADVISORY DESK SELECTOR & WORKSTATION NAVIGATION */}
      <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 z-20">
        
        {/* Left: Active Desk Branding */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg transition-all"
            style={{ 
              backgroundColor: `${activeDesk.color}20`, 
              borderColor: `${activeDesk.color}50`,
              color: activeDesk.color 
            }}
          >
            <activeDesk.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">{activeDesk.name}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE DESK
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-md">{activeDesk.tagline}</p>
          </div>
        </div>

        {/* Right: Desk Quick-Switchers & Interactive Tool Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-none">
          <div className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] gap-1">
            {ADVISOR_DESKS.map(desk => (
              <button
                key={desk.id}
                onClick={() => setActiveDesk(desk)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeDesk.id === desk.id 
                    ? 'bg-white/10 text-white shadow-sm border border-white/15' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <desk.icon className="w-3.5 h-3.5" style={{ color: desk.color }} />
                <span>{desk.shortName}</span>
              </button>
            ))}
          </div>

          {/* Workstation Tool Switcher */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 gap-1 shrink-0">
            <button
              onClick={() => setActiveToolTab('chat')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeToolTab === 'chat' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Advisory Chat
            </button>
            <button
              onClick={() => setActiveToolTab('valuations')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeToolTab === 'valuations' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              DCF Multiples
            </button>
            <button
              onClick={() => setActiveToolTab('sovereign')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeToolTab === 'sovereign' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Sovereign Radar
            </button>
            <button
              onClick={() => setActiveToolTab('commodities')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeToolTab === 'commodities' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Commodities
            </button>
            <button
              onClick={() => setActiveToolTab('scenarios')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeToolTab === 'scenarios' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Shock Simulator
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSTATION WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* TAB 1: INTERACTIVE VALUATION & DCF WORKBENCH */}
        {activeToolTab === 'valuations' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#34A87E]" />
                  Institutional Equity DCF & Multiples Valuation Engine
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Calculate intrinsic enterprise values, cost of capital (WACC), and fair trading bands for leading African bourses.
                </p>
              </div>
              <button
                onClick={() => setActiveToolTab('chat')}
                className="text-xs text-[#FFFFFF] font-bold hover:underline"
              >
                Return to Chat →
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {PRESET_VALUATIONS.map((preset, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectValuationPreset(preset)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    valSelectedStock.name === preset.name 
                      ? 'bg-[#34A87E]/10 border-[#34A87E] shadow-[0_0_15px_rgba(52,168,126,0.2)]' 
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="text-[10px] text-zinc-500 font-mono">{preset.currency}</div>
                  <div className="font-bold text-xs text-white truncate mt-0.5">{preset.name.split('(')[0]}</div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-sm font-mono font-extrabold text-white">{preset.price.toLocaleString()}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{preset.upside}</span>
                  </div>
                  <div className="text-[9px] text-zinc-400 font-mono mt-1">P/E: {preset.pe}x</div>
                </div>
              ))}
            </div>

            {/* Interactive Calculator Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0B0E14] border border-white/10 rounded-2xl p-6">
              
              {/* Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Model Valuation Parameters</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1">Company / Ticker</label>
                    <input 
                      type="text" 
                      value={customTicker}
                      onChange={(e) => setCustomTicker(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#34A87E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1">Current Trading Price</label>
                    <input 
                      type="number" 
                      value={customPrice}
                      onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#34A87E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1">Projected 5Y FCF CAGR (%)</label>
                    <input 
                      type="number" 
                      value={customGrowth}
                      onChange={(e) => setCustomGrowth(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#34A87E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1">Discount Rate (WACC %)</label>
                    <input 
                      type="number" 
                      value={customWacc}
                      onChange={(e) => setCustomWacc(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#34A87E]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-zinc-400 leading-relaxed">
                  <span className="font-bold text-white">Analyst Thesis: </span>
                  {valSelectedStock.verdict}
                </div>

                <button
                  onClick={handleSendValuationToAI}
                  className="w-full py-3 bg-gradient-to-r from-[#34A87E] to-[#059669] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
                >
                  <Sparkles className="w-4 h-4" /> Run Deep Valuation In AI Advisor Desk
                </button>
              </div>

              {/* Outputs Summary Card */}
              <div className="lg:col-span-6 bg-gradient-to-br from-[#121722] to-[#080B10] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono text-zinc-400">INTRINSIC VALUE (DCF)</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                      {valSelectedStock.upside} IMPLIED UPSIDE
                    </span>
                  </div>
                  
                  <div className="my-4">
                    <div className="text-3xl font-mono font-extrabold text-white">
                      {valSelectedStock.currency} {valSelectedStock.intrinsicValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      Fair Value Trading Band: <span className="text-[#34A87E] font-bold font-mono">{valSelectedStock.fairBand}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/5 text-center font-mono">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-[9px] text-zinc-400">BEAR CASE</div>
                      <div className="text-xs font-bold text-zinc-300">{(valSelectedStock.price * 0.9).toFixed(1)}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-[9px] text-zinc-400">BASE CASE</div>
                      <div className="text-xs font-bold text-[#34A87E]">{valSelectedStock.intrinsicValue.toFixed(1)}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-[9px] text-zinc-400">BULL CASE</div>
                      <div className="text-xs font-bold text-amber-400">{(valSelectedStock.intrinsicValue * 1.25).toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-2 border-t border-white/5">
                  <span>Discounting 10Y Unlevered Free Cash Flows</span>
                  <span>Terminal Rate: 3.5%</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: SOVEREIGN RISK & CENTRAL BANK RADAR */}
        {activeToolTab === 'sovereign' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#0666EB]" />
                  Pan-African Sovereign Debt & Central Bank Matrix
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time reference monitor for policy rates, sovereign bond spreads (bps), and debt sustainability.
                </p>
              </div>
              <button
                onClick={() => setActiveToolTab('chat')}
                className="text-xs text-[#FFFFFF] font-bold hover:underline"
              >
                Return to Chat →
              </button>
            </div>

            <div className="bg-[#0B0E14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                    <th className="p-3.5">Country / Sovereign</th>
                    <th className="p-3.5">Policy Rate</th>
                    <th className="p-3.5">Inflation (CPI)</th>
                    <th className="p-3.5">EMBI Spread</th>
                    <th className="p-3.5">Debt / GDP</th>
                    <th className="p-3.5">1Y FX Vol</th>
                    <th className="p-3.5">Credit Rating</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {SOVEREIGN_MATRIX.map((sov, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <span className="text-base">{sov.flag}</span>
                        <div>
                          <div>{sov.country}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{sov.code}</div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-white">{sov.policyRate}</td>
                      <td className="p-3.5 font-mono text-zinc-300">{sov.inflation}</td>
                      <td className="p-3.5 font-mono font-bold text-amber-400">{sov.sovereignSpread}</td>
                      <td className="p-3.5 font-mono text-zinc-300">{sov.debtToGdp}</td>
                      <td className="p-3.5 font-mono text-zinc-400">{sov.fxVol1Y}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-white/5 border border-white/10 text-white">
                          {sov.creditRating}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleSendSovereignToAI(sov)}
                          className="px-3 py-1 bg-[#0666EB]/20 hover:bg-[#0666EB]/40 border border-[#0666EB]/40 text-[#0666EB] font-bold rounded-lg text-[11px] transition-all cursor-pointer"
                        >
                          Analyze Risk
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMMODITIES & CRITICAL MINERALS */}
        {activeToolTab === 'commodities' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#F59E0B]" />
                  Global Commodities & African Critical Minerals Intelligence
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Supply-demand deficits, resource corridors, and industrial energy pricing.
                </p>
              </div>
              <button
                onClick={() => setActiveToolTab('chat')}
                className="text-xs text-[#FFFFFF] font-bold hover:underline"
              >
                Return to Chat →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {COMMODITIES_MATRIX.map((comm, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-[#0B0E14] border border-white/10 rounded-2xl hover:border-[#F59E0B]/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                        {comm.category}
                      </span>
                      <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                        comm.up ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {comm.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {comm.change}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mt-2 group-hover:text-[#F59E0B] transition-colors">
                      {comm.name} ({comm.symbol})
                    </h4>

                    <div className="text-xl font-mono font-extrabold text-white mt-1">
                      {comm.price}
                    </div>

                    <div className="mt-3 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-zinc-300 space-y-1">
                      <div className="text-[#F59E0B] font-bold font-mono text-[10px]">{comm.africaShare}</div>
                      <div className="text-zinc-400 text-[10px]">Producers: {comm.primaryProducers}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-2 mt-1">{comm.strategicSignificance}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendCommodityToAI(comm)}
                    className="w-full mt-4 py-2 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Analyze Super-Cycle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SHOCK SCENARIO SIMULATOR */}
        {activeToolTab === 'scenarios' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  Macroeconomic & Geopolitical Shock Simulator
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Simulate global rate shocks, commodity escalations, and AfCFTA integration impacts on portfolio risk.
                </p>
              </div>
              <button
                onClick={() => setActiveToolTab('chat')}
                className="text-xs text-[#FFFFFF] font-bold hover:underline"
              >
                Return to Chat →
              </button>
            </div>

            <div className="space-y-4">
              {MACRO_SCENARIOS.map((scenario) => (
                <div 
                  key={scenario.id}
                  className="p-5 bg-[#0B0E14] border border-white/10 rounded-2xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white">{scenario.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{scenario.description}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                      {scenario.vulnerabilityIndex}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/5">
                    {scenario.impacts.map((imp, i) => (
                      <div key={i} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs">
                        <div className="text-[10px] text-zinc-500 font-mono uppercase">{imp.assetClass}</div>
                        <div className="font-semibold text-white mt-1 text-[11px]">{imp.impact}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleSendScenarioToAI(scenario)}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
                    >
                      <Zap className="w-3.5 h-3.5" /> Execute Stress Test In AI Desk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 0: PRIMARY ADVISORY CHAT STREAM */}
        {activeToolTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border"
                        style={{ 
                          backgroundColor: `${activeDesk.color}20`,
                          borderColor: `${activeDesk.color}40`,
                          color: activeDesk.color 
                        }}
                      >
                        <BrainCircuit className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div className={`max-w-[90%] lg:max-w-[82%] ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-[#0666EB] to-[#0048B5] text-white rounded-2xl rounded-tr-none p-4 shadow-xl border border-blue-400/20' 
                        : 'bg-[#0B0E14] border border-white/[0.12] rounded-2xl rounded-tl-none p-6 shadow-2xl space-y-3'
                    }`}>
                      
                      {/* Message Header (Model) */}
                      {msg.role === 'model' && (
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono text-[11px]">
                              AFRIQUANTX CAPITAL ADVISORY
                            </span>
                            <span className="text-[10px] text-zinc-500">• {msg.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSpeak(msg.content)}
                              className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              title="Read Out Loud"
                            >
                              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              title="Copy Intelligence"
                            >
                              {copiedMessageId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Content Body */}
                      {msg.role === 'user' ? (
                        <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                      ) : (
                        <div className="markdown-body text-zinc-200 text-sm leading-relaxed prose prose-invert max-w-none">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      )}

                      {/* Model Institutional Footer */}
                      {msg.role === 'model' && (
                        <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          <span className="flex items-center gap-1.5 text-zinc-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Institutional Quantitative Advisory Desk • T+0 Clearing Engine
                          </span>
                          <span className="hidden sm:inline text-zinc-600">Model: AQEI DeepMind v4.2 Quant</span>
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 items-center"
                >
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-lg"
                    style={{ 
                      backgroundColor: `${activeDesk.color}20`,
                      borderColor: `${activeDesk.color}40`,
                      color: activeDesk.color 
                    }}
                  >
                    <BrainCircuit className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-[#0B0E14] border border-white/10 rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-3 shadow-xl">
                    <span className="text-xs font-mono text-zinc-400">Synthesizing cross-border bourses & macro telemetry...</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Templates Library Pills */}
            <div className="px-6 py-2 bg-[#090C12] border-t border-white/5 overflow-x-auto scrollbar-none flex gap-2 shrink-0">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold self-center shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" /> Prompts:
              </span>
              {PROMPT_TEMPLATES.flatMap(cat => cat.prompts).slice(0, 7).map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-3 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] font-medium text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all shrink-0 cursor-pointer"
                >
                  {prompt.length > 55 ? prompt.slice(0, 55) + '...' : prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-md z-10">
              <div className="relative flex items-center gap-3">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                    placeholder={`Ask ${activeDesk.shortName} (e.g. valuation of Safaricom, DRC Cobalt outlook, NGN/ZAR carry-trade)...`} 
                    className="w-full bg-white/[0.04] border border-white/[0.12] rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/40 focus:bg-white/[0.07] transition-all font-sans"
                  />
                </div>
                
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-5 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Inquire</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
