import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Lock, Cpu, CpuIcon, Activity, Sparkles, Wallet, Globe, ArrowRight,
  TrendingUp, CheckCircle2, FileCheck, Layers, Eye, RefreshCw, Key, Landmark, 
  DollarSign, PieChart, ShieldAlert, Zap, Server, ChevronRight, Fingerprint, UserCheck, 
  Send, Award, CreditCard, Network, Database, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar 
} from 'recharts';

// --- 1. GLASSMORPHISM FLOATING 3D HERO DASHBOARD WIDGET ---
export function GlassmorphismHeroDashboard() {
  const [activeTab, setActiveTab] = useState<'balance' | 'yield' | 'ai'>('balance');

  const chartData = [
    { month: 'Jan', value: 12400, yield: 4.2 },
    { month: 'Feb', value: 18900, yield: 6.8 },
    { month: 'Mar', value: 24500, yield: 9.1 },
    { month: 'Apr', value: 38200, yield: 12.4 },
    { month: 'May', value: 52100, yield: 15.8 },
    { month: 'Jun', value: 68400, yield: 19.2 },
    { month: 'Jul', value: 89600, yield: 24.5 },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8 p-1">
      {/* Subtle Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-emerald-500/20 rounded-[32px] blur-2xl opacity-60 pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="relative bg-zinc-950/90 text-white rounded-[28px] border border-white/10 shadow-2xl p-6 md:p-8 backdrop-blur-xl overflow-hidden space-y-6">
        
        {/* Top Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">AFRIQUANTX TREASURY VAULT</div>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                <span>$89,600.00 USD</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +24.5% YTD
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('balance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'balance' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('yield')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'yield' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Yield APY
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'ai' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              AI Signals
            </button>
          </div>
        </div>

        {/* Live Area Chart Display */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                formatter={(val: any) => [`$${val.toLocaleString()}`, 'Portfolio Valuation']}
              />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 3D Floating Sub-Widgets Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          {/* Card 1: Multi-Currency */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>MULTI-CURRENCY</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">USD / NGN / ZAR</div>
            <div className="text-xs text-emerald-400 font-mono">Sub-410ms Instant FX Clearance</div>
          </motion.div>

          {/* Card 2: AI Risk Score */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>AQEI NEURAL SCORE</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">98.4 / 100 Safe</div>
            <div className="text-xs text-zinc-400 font-mono">Continuous VaR Stress Test</div>
          </motion.div>

          {/* Card 3: Security & Custody */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>CUSTODY VAULT</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">HSM FIPS 140-2</div>
            <div className="text-xs text-blue-400 font-mono">$250K FDIC/NDIC Segregated</div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

// --- 2. AI & MACHINE LEARNING WORKFLOW & DECISION TREE ---
export function AIDecisionTreeFlow() {
  const [selectedStep, setSelectedStep] = useState<number>(2);

  const steps = [
    {
      step: 1,
      title: 'Data Ingestion',
      icon: Database,
      tagline: '1.2M Datapoints/Sec',
      desc: 'Real-time telemetry stream ingesting central bank rates, satellite shipping logs, and regional order book depth.'
    },
    {
      step: 2,
      title: 'Neural Risk Scoring',
      icon: Cpu,
      tagline: 'AQEI DeepMind v4.2',
      desc: 'Multi-layer neural network evaluating macroeconomic volatility, credit spread risks, and liquidity concentration.'
    },
    {
      step: 3,
      title: 'Smart Order Router',
      icon: Network,
      tagline: 'Sub-2.4ms Latency',
      desc: 'Algorithmic routing picking optimal liquidity venues across JSE, NGX, NSE, and private SPV dark pools.'
    },
    {
      step: 4,
      title: 'Instant Execution',
      icon: Zap,
      tagline: 'Zero Slippage Guarantee',
      desc: 'Cryptographic execution with atomic settlement finality across multi-currency bank clearing accounts.'
    }
  ];

  return (
    <div className="py-12 px-6 bg-zinc-950 text-white rounded-[32px] border border-zinc-800 my-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AQEI NEURAL DECISION ARCHITECTURE</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Automated Algorithmic Execution Pipeline
        </h3>
        <p className="text-zinc-400 text-sm">
          Click through each node to inspect how the AI neural engine processes live market telemetry into instant trade finality.
        </p>
      </div>

      {/* Process Flow Interactive Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((item) => {
          const Icon = item.icon;
          const isActive = selectedStep === item.step;

          return (
            <motion.div
              key={item.step}
              onClick={() => setSelectedStep(item.step)}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                isActive 
                  ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
              )}
              
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">0{item.step}</span>
                <div className={`p-2 rounded-xl ${isActive ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <h4 className="font-bold text-base text-white">{item.title}</h4>
              <p className="font-mono text-xs text-blue-300">{item.tagline}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// --- 3. BANK-GRADE SECURITY & COMPLIANCE VAULT GRAPHIC ---
export function SecurityVaultCard() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="w-full p-8 sm:p-10 rounded-2xl bg-zinc-950 border border-zinc-800 text-white space-y-8 relative overflow-hidden">
      {/* Background Security Wave Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
        <div className="space-y-2 max-w-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Multi-Layer Cryptographic Vault Protection
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            SOC2 Type II • ISO 27001 • FIPS 140-2 Level 3 Hardware Security Modules
          </p>
        </div>

        <button
          onClick={() => setUnlocked(!unlocked)}
          className={`px-6 py-3 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-2 border shrink-0 ${
            unlocked 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10' 
              : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700 shadow-lg shadow-blue-600/20'
          }`}
        >
          {unlocked ? <Lock className="w-4 h-4 text-emerald-400" /> : <Key className="w-4 h-4" />}
          <span>{unlocked ? 'VAULT ACTIVE & VERIFIED' : 'TEST BIOMETRIC AUTH'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <Fingerprint className="w-6 h-6 text-blue-400" />
            <span className="text-[11px] font-mono text-zinc-500">LAYER 1</span>
          </div>
          <div className="font-bold text-base text-white">Biometric Multi-Sig</div>
          <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed">WebAuthn, Hardware Passkeys & Corporate Threshold Signatures.</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <Lock className="w-6 h-6 text-emerald-400" />
            <span className="text-[11px] font-mono text-zinc-500">LAYER 2</span>
          </div>
          <div className="font-bold text-base text-white">AES-256 HSM Encryption</div>
          <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed">Data at rest and in transit encrypted with isolated keys.</div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <FileCheck className="w-6 h-6 text-cyan-400" />
            <span className="text-[11px] font-mono text-zinc-500">LAYER 3</span>
          </div>
          <div className="font-bold text-base text-white">Zero-Knowledge Audits</div>
          <div className="text-xs sm:text-sm text-zinc-400 leading-relaxed">Real-time proof of reserve verified by Big 4 accounting standards.</div>
        </div>
      </div>
    </div>
  );
}

// --- 4. CUSTOMER JOURNEY & FINTECH PROCESS FLOW ---
export function CustomerJourneyFlow() {
  const steps = [
    { num: '01', label: 'Instant Sign Up', desc: 'Corporate & Individual Onboarding' },
    { num: '02', label: 'Verify Identity', desc: 'Automated KYC & AML Screen' },
    { num: '03', label: 'Fund Wallet', desc: 'Local Fiat ACH, Wire or USD' },
    { num: '04', label: 'AI Risk Allocation', desc: 'Automated Portfolio Tuning' },
    { num: '05', label: 'Grow Wealth', desc: 'Compound Returns & Payouts' },
  ];

  return (
    <div className="w-full py-12 px-6 sm:px-10 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">Your Seamless Wealth Journey</h3>
        <p className="text-xs sm:text-sm font-mono text-gray-600">From setup to institutional execution in under 3 minutes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {steps.map((s, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm text-center space-y-2 relative hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-full bg-black text-white font-mono text-xs font-bold flex items-center justify-center mx-auto mb-2">
              {s.num}
            </div>
            <div className="font-bold text-sm text-black">{s.label}</div>
            <div className="text-xs text-gray-500 leading-tight">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 5. PAN-AFRICAN & GLOBAL CLEARING MESH (STRETCHED WORLD-CLASS MOTION GRAPHICS) ---
export function GlobalPaymentMesh() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('lagos');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    { 
      id: 'london', 
      city: 'London', 
      country: 'United Kingdom',
      hub: 'LSE & Euroclear Bridge', 
      rate: 'USD/GBP 0.7842', 
      change: '+0.12%',
      latency: '24ms', 
      volume: '$14.2B / 24h',
      status: 'Primary Sovereign Desk', 
      x: 48, 
      y: 28,
      connections: ['lagos', 'newyork', 'dubai', 'johannesburg']
    },
    { 
      id: 'newyork', 
      city: 'New York', 
      country: 'United States',
      hub: 'NYSE / NASDAQ DMA', 
      rate: 'USD Core Index 104.2', 
      change: '+0.05%',
      latency: '38ms', 
      volume: '$28.6B / 24h',
      status: 'Primary Liquidity Pool', 
      x: 22, 
      y: 36,
      connections: ['london', 'lagos', 'johannesburg']
    },
    { 
      id: 'lagos', 
      city: 'Lagos', 
      country: 'Nigeria',
      hub: 'NGX & CSCS Vault', 
      rate: 'USD/NGN 1,482.10', 
      change: '-0.34%',
      latency: '1.8ms FIX', 
      volume: '$8.4B / 24h',
      status: 'Central Clearing Engine', 
      x: 50, 
      y: 56,
      connections: ['london', 'newyork', 'johannesburg', 'nairobi', 'dubai']
    },
    { 
      id: 'johannesburg', 
      city: 'Johannesburg', 
      country: 'South Africa',
      hub: 'JSE & Strate Gateway', 
      rate: 'USD/ZAR 18.264', 
      change: '+0.48%',
      latency: '2.4ms FIX', 
      volume: '$6.9B / 24h',
      status: 'Dual-Listing Engine', 
      x: 56, 
      y: 78,
      connections: ['lagos', 'nairobi', 'london', 'newyork']
    },
    { 
      id: 'nairobi', 
      city: 'Nairobi', 
      country: 'Kenya',
      hub: 'NSE & CDSC Node', 
      rate: 'USD/KES 129.40', 
      change: '+0.18%',
      latency: '3.1ms FIX', 
      volume: '$2.8B / 24h',
      status: 'East Africa Corridor', 
      x: 62, 
      y: 62,
      connections: ['lagos', 'johannesburg', 'dubai']
    },
    { 
      id: 'dubai', 
      city: 'Dubai (DIFC)', 
      country: 'United Arab Emirates',
      hub: 'GCC Capital Gateway', 
      rate: 'USD/AED 3.6725', 
      change: '0.00%',
      latency: '18ms', 
      volume: '$9.7B / 24h',
      status: 'Sovereign Wealth Bridge', 
      x: 68, 
      y: 42,
      connections: ['london', 'lagos', 'nairobi']
    }
  ];

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[2];

  // Dynamic simulated packet flows
  const recentFlows = [
    { from: 'Lagos', to: 'London', amount: '$4,250,000 USD', type: 'Eurobond Sovereign Block', speed: 'T+0 Instant' },
    { from: 'New York', to: 'Johannesburg', amount: '$12,800,000 USD', type: 'Dual-Listed JSE Equity', speed: '410μs FIX' },
    { from: 'Dubai', to: 'Lagos', amount: '$8,500,000 USD', type: 'Private Infrastructure Debt', speed: 'Settled' },
    { from: 'London', to: 'Nairobi', amount: '$1,900,000 USD', type: 'SME Yield Vault Sweep', speed: 'T+0 Instant' },
  ];

  return (
    <div className="w-full rounded-[32px] bg-[#07090E] border border-white/[0.1] text-white overflow-hidden shadow-2xl relative">
      
      {/* Background World Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,102,235,0.18),rgba(255,255,255,0))]" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#D9A94E]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-[#34A87E]/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Matrix Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-10">
        
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-xs font-mono font-semibold text-[#D9A94E]">
              <span className="w-2 h-2 rounded-full bg-[#34A87E] animate-ping" />
              <span className="tracking-widest uppercase">REAL-TIME MULTI-ASSET SETTLEMENT MESH</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F4F1E8] tracking-tight">
              Pan-African &amp; Global Liquidity Corridors
            </h3>
            <p className="text-sm sm:text-base text-[#F4F1E8]/60 max-w-2xl">
              Sub-millisecond FIX 4.4 routing clearing dual-listed shares, sovereign bonds, and institutional foreign exchange across 14 member bourses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#34A87E]" />
              <span className="text-[#F4F1E8]/60">Aggregate 24h Mesh Volume:</span>
              <span className="text-[#F4F1E8] font-bold">$70.6B USD</span>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-3">
              <Activity className="w-3.5 h-3.5 text-[#0666EB]" />
              <span className="text-[#F4F1E8]/60">Clearing Latency:</span>
              <span className="text-[#34A87E] font-bold">&lt; 410μs</span>
            </div>
          </div>
        </div>

        {/* Central Interactive Motion Graphic Mesh Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Visualizer Stage: High-tech Geodesic SVG Map with Animated Pulse Arcs */}
          <div className="lg:col-span-8 rounded-3xl bg-[#0B0E14] border border-white/[0.08] p-6 sm:p-8 relative min-h-[380px] sm:min-h-[460px] flex flex-col justify-between overflow-hidden">
            
            {/* SVG Connecting Curves & Beacons */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0666EB" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#D9A94E" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#34A87E" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D9A94E" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#34A87E" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Base Interconnect Curves */}
                {nodes.map(n1 => 
                  n1.connections.map(cId => {
                    const n2 = nodes.find(n => n.id === cId);
                    if (!n2) return null;
                    const isConnectedToSelected = n1.id === selectedNodeId || n2.id === selectedNodeId;
                    
                    return (
                      <g key={`${n1.id}-${n2.id}`}>
                        <line
                          x1={`${n1.x}%`}
                          y1={`${n1.y}%`}
                          x2={`${n2.x}%`}
                          y2={`${n2.y}%`}
                          stroke={isConnectedToSelected ? "url(#activeGradient)" : "url(#meshGradient)"}
                          strokeWidth={isConnectedToSelected ? "1.5" : "0.75"}
                          strokeDasharray={isConnectedToSelected ? "2 2" : "1 3"}
                          className={isConnectedToSelected ? "animate-pulse" : "opacity-40"}
                        />
                      </g>
                    );
                  })
                )}
              </svg>
            </div>

            {/* Interactive Node Markers */}
            <div className="relative w-full h-full min-h-[300px] z-10">
              {nodes.map(node => {
                const isSelected = node.id === selectedNodeId;
                const isHovered = hoveredNode === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-all duration-300 z-20"
                  >
                    {/* Pulsing Ripple */}
                    <span className={`absolute -inset-3 rounded-full transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[#D9A94E]/25 animate-ping' 
                        : isHovered 
                        ? 'bg-[#0666EB]/20 animate-pulse' 
                        : 'opacity-0'
                    }`} />

                    {/* Node Core Orb */}
                    <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                      isSelected 
                        ? 'w-7 h-7 bg-[#D9A94E] text-[#0D0F13] shadow-[0_0_24px_rgba(217,169,78,0.8)] scale-110' 
                        : isHovered 
                        ? 'w-6 h-6 bg-[#0666EB] text-white shadow-[0_0_16px_rgba(6,102,235,0.6)]' 
                        : 'w-4 h-4 bg-white/20 hover:bg-white/40 text-white/80 border border-white/30'
                    }`}>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Floating City Label */}
                    <div className={`mt-2 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold whitespace-nowrap transition-all duration-300 shadow-md ${
                      isSelected 
                        ? 'bg-[#0D0F13] text-[#D9A94E] border border-[#D9A94E]/40' 
                        : 'bg-black/70 text-white/90 border border-white/10 group-hover:border-white/30'
                    }`}>
                      <span>{node.city}</span>
                      <span className="text-[9px] text-[#34A87E] ml-1.5 hidden sm:inline">{node.latency}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom In-Stage Live Stream Ticker */}
            <div className="relative z-10 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#34A87E]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero Counterparty Risk • Atomic Delivery vs Payment (DvP)</span>
              </div>

              <div className="text-[#F4F1E8]/50 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#0666EB]" />
                <span>ISO 20022 Financial Messaging Compliant</span>
              </div>
            </div>

          </div>

          {/* Right Column: Deep Node Inspector & Liquidity Metrics */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            
            <div className="p-6 rounded-3xl bg-[#0B0E14] border border-white/[0.08] space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#F4F1E8]/50">
                    SELECTED LIQUIDITY HUB
                  </span>
                  <h4 className="text-2xl font-extrabold text-[#F4F1E8] tracking-tight">
                    {activeNode.city}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#34A87E]/10 border border-[#34A87E]/20 text-[#34A87E] text-[11px] font-mono font-bold">
                  {activeNode.status}
                </span>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F4F1E8]/60">Integration Engine:</span>
                  <span className="text-[#F4F1E8] font-bold">{activeNode.hub}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F4F1E8]/60">Live Benchmark FX:</span>
                  <span className="text-[#D9A94E] font-bold">{activeNode.rate}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F4F1E8]/60">Clearing Latency:</span>
                  <span className="text-[#34A87E] font-bold">{activeNode.latency}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F4F1E8]/60">24h Corridor Volume:</span>
                  <span className="text-[#F4F1E8] font-bold">{activeNode.volume}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#F4F1E8]/50 mb-2">
                  DIRECT ACTIVE ROUTING CORRIDORS
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.connections.map(cId => {
                    const target = nodes.find(n => n.id === cId);
                    return (
                      <span key={cId} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#F4F1E8]/80">
                        → {target?.city}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Streaming Clearing Transactions Stream */}
            <div className="p-6 rounded-3xl bg-[#0B0E14] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#F4F1E8]/50">
                <span>RECENT MESH SETTLEMENTS</span>
                <span className="text-[#34A87E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A87E] animate-pulse" />
                  Live T+0
                </span>
              </div>

              <div className="space-y-2">
                {recentFlows.map((flow, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/[0.04] last:border-0">
                    <div>
                      <span className="text-[#F4F1E8] font-bold">{flow.from}</span>
                      <span className="text-[#F4F1E8]/40 mx-1.5">→</span>
                      <span className="text-[#F4F1E8] font-bold">{flow.to}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#D9A94E] font-bold">{flow.amount}</div>
                      <div className="text-[10px] text-[#34A87E]">{flow.speed}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Multi-Node Quick Selector Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/[0.08]">
          {nodes.map(n => {
            const isSelected = n.id === selectedNodeId;
            return (
              <button
                key={n.id}
                onClick={() => setSelectedNodeId(n.id)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 ${
                  isSelected 
                    ? 'bg-[#141720] border border-[#D9A94E]/50 shadow-md' 
                    : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="text-xs font-bold text-[#F4F1E8] flex items-center justify-between">
                  <span>{n.city}</span>
                  <span className="text-[10px] font-mono text-[#34A87E]">{n.latency}</span>
                </div>
                <div className="text-[11px] font-mono text-[#D9A94E] mt-1 truncate">{n.rate}</div>
                <div className="text-[9px] font-mono text-[#F4F1E8]/40 mt-0.5 truncate">{n.hub}</div>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
}

