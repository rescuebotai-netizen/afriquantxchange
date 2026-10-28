import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, TrendingUp, DollarSign, Layers, PieChart, 
  BarChart3, FileSpreadsheet, Download, RefreshCw, CheckCircle2, 
  ShieldCheck, ArrowUpRight, Sparkles, Building2, Landmark, Briefcase,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

export function ValuationWorkbench({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'dcf' | 'lbo' | 'comps' | 'syndicate'>('dcf');
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);

  // DCF Model Inputs
  const [baseRevenue, setBaseRevenue] = useState<number>(1200); // Millions ZAR
  const [revenueGrowth, setRevenueGrowth] = useState<number>(18.5); // %
  const [ebitdaMargin, setEbitdaMargin] = useState<number>(28.0); // %
  const [taxRate, setTaxRate] = useState<number>(27.0); // % SA corporate tax
  const [wacc, setWacc] = useState<number>(11.5); // %
  const [terminalGrowth, setTerminalGrowth] = useState<number>(3.0); // %
  const [sharesOutstanding, setSharesOutstanding] = useState<number>(250); // Millions shares
  const [netDebt, setNetDebt] = useState<number>(320); // Millions ZAR

  // Calculate 5-year DCF Free Cash Flows
  const fcfYears = [1, 2, 3, 4, 5].map(year => {
    const rev = baseRevenue * Math.pow(1 + revenueGrowth / 100, year);
    const ebitda = rev * (ebitdaMargin / 100);
    const ebit = ebitda * 0.85; // D&A 15%
    const nopat = ebit * (1 - taxRate / 100);
    const fcf = nopat * 0.90; // Working capital & Capex netting
    const discountFactor = Math.pow(1 + wacc / 100, year);
    const pvFcf = fcf / discountFactor;
    return { year, rev, ebitda, fcf, pvFcf };
  });

  const cumulativePvFcf = fcfYears.reduce((acc, curr) => acc + curr.pvFcf, 0);
  const terminalYearFcf = fcfYears[4].fcf * (1 + terminalGrowth / 100);
  const terminalValue = (wacc - terminalGrowth) > 0 
    ? terminalYearFcf / ((wacc - terminalGrowth) / 100)
    : 0;
  const pvTerminalValue = terminalValue / Math.pow(1 + wacc / 100, 5);
  const enterpriseValue = cumulativePvFcf + pvTerminalValue;
  const equityValue = enterpriseValue - netDebt;
  const impliedSharePrice = equityValue / sharesOutstanding;

  // LBO Model Inputs
  const [lboEntryMultiple, setLboEntryMultiple] = useState<number>(7.5);
  const [lboExitMultiple, setLboExitMultiple] = useState<number>(9.0);
  const [lboDebtPercent, setLboDebtPercent] = useState<number>(65); // 65% Debt / 35% Sponsor Equity
  const [lboHoldPeriod, setLboHoldPeriod] = useState<number>(5);

  const lboEntryEv = (baseRevenue * (ebitdaMargin / 100)) * lboEntryMultiple;
  const lboSponsorEquity = lboEntryEv * ((100 - lboDebtPercent) / 100);
  const lboExitEv = fcfYears[4].ebitda * lboExitMultiple;
  const lboExitDebtRemaining = lboEntryEv * (lboDebtPercent / 100) * 0.40; // 60% debt paid down
  const lboExitEquity = lboExitEv - lboExitDebtRemaining;
  const lboMoic = lboSponsorEquity > 0 ? (lboExitEquity / lboSponsorEquity) : 0;
  const lboIrr = lboMoic > 0 ? (Math.pow(lboMoic, 1 / lboHoldPeriod) - 1) * 100 : 0;

  // Syndicate Waterfall (Gross Spread 3.25%)
  const [dealSizeMillions, setDealSizeMillions] = useState<number>(950);
  const [grossSpreadPct, setGrossSpreadPct] = useState<number>(3.25);
  const totalFees = dealSizeMillions * (grossSpreadPct / 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFFFF]/10 border border-[#FFFFFF]/30 rounded-full text-xs font-mono text-[#FFFFFF]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Investment Banking & Corporate Finance Advisory</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
            Deal Structuring & Valuation Workbench
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Interactive DCF valuation, LBO returns sensitivity heatmap, African trading comparables, and underwriting syndicate waterfall economics.
          </p>
        </div>

        {/* Global Implied Target KPI */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 text-center min-w-[140px]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Implied Share Price</span>
            <span className="text-lg font-mono font-black text-[#FFFFFF]">ZAR {impliedSharePrice.toFixed(2)}</span>
          </div>
          <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 text-center min-w-[130px]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Enterprise Value</span>
            <span className="text-lg font-mono font-black text-white">ZAR {(enterpriseValue / 1000).toFixed(2)}B</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout with Collapsible Left Sub-Menu */}
      <div className="w-full flex-1 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT SUB-MENU - COLLAPSIBLE */}
        <AnimatePresence initial={false} mode="wait">
          {isSubMenuOpen ? (
            <motion.aside
              key="valuation-left-submenu"
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
                      Valuation Models
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
                    { id: 'dcf', label: 'DCF & Sensitivity', icon: Calculator, desc: 'Discounted Cash Flow' },
                    { id: 'lbo', label: 'LBO Returns & IRR', icon: TrendingUp, desc: 'Leveraged Buyout' },
                    { id: 'comps', label: 'African Peer Comps', icon: BarChart3, desc: 'Multiples & EV/EBITDA' },
                    { id: 'syndicate', label: 'Syndicate Waterfall', icon: Landmark, desc: 'Spread & Praecipium' },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id as any)}
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
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Dynamic Engine Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.div
              key="valuation-left-submenu-toggle"
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
                <span>Show Models</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WORKSPACE VIEWPORTS CONTAINER */}
        <div className="flex-1 min-w-0 w-full">
          {/* Tab 1: DCF Valuation */}
          {activeSubTab === 'dcf' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Parameter Sliders */}
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#FFFFFF]" /> Core Financial Drivers
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Base Revenue (FY0)</span>
                  <span className="text-white font-bold">ZAR {baseRevenue}M</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={baseRevenue}
                  onChange={(e) => setBaseRevenue(parseFloat(e.target.value))}
                  className="w-full accent-[#FFFFFF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Revenue CAGR (% p.a.)</span>
                  <span className="text-[#FFFFFF] font-bold">{revenueGrowth}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="0.5"
                  value={revenueGrowth}
                  onChange={(e) => setRevenueGrowth(parseFloat(e.target.value))}
                  className="w-full accent-[#FFFFFF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>EBITDA Margin (%)</span>
                  <span className="text-white font-bold">{ebitdaMargin}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={ebitdaMargin}
                  onChange={(e) => setEbitdaMargin(parseFloat(e.target.value))}
                  className="w-full accent-[#FFFFFF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Discount Rate (WACC %)</span>
                  <span className="text-[#FFFFFF] font-bold">{wacc}%</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="16.0"
                  step="0.25"
                  value={wacc}
                  onChange={(e) => setWacc(parseFloat(e.target.value))}
                  className="w-full accent-[#FFFFFF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Terminal Growth Rate (% g)</span>
                  <span className="text-white font-bold">{terminalGrowth}%</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.5"
                  step="0.25"
                  value={terminalGrowth}
                  onChange={(e) => setTerminalGrowth(parseFloat(e.target.value))}
                  className="w-full accent-[#FFFFFF]"
                />
              </div>
            </div>

            {/* Bridge Summary */}
            <div className="bg-black border border-white/10 rounded-xl p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>PV of 5-Yr Cash Flows:</span>
                <span className="text-white font-bold">ZAR {cumulativePvFcf.toFixed(1)}M</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>PV of Terminal Value:</span>
                <span className="text-white font-bold">ZAR {pvTerminalValue.toFixed(1)}M</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Net Debt Deduction:</span>
                <span className="text-rose-400 font-bold">- ZAR {netDebt}M</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm">
                <span className="text-[#FFFFFF] font-bold">Implied Target Price:</span>
                <span className="text-[#FFFFFF] font-black">ZAR {impliedSharePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right 2 Cols: 5-Year Cash Flow Schedule & 2D Sensitivity Matrix */}
          <div className="lg:col-span-2 space-y-6">
            {/* 5-Year Unlevered Free Cash Flow Schedule */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#FFFFFF]" /> 5-Year Pro-Forma Unlevered FCF Forecast
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Line Item (ZAR M)</th>
                      {fcfYears.map(f => (
                        <th key={f.year} className="py-2.5 px-3 text-right">FY+{f.year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">Revenue</td>
                      {fcfYears.map(f => (
                        <td key={f.year} className="py-2.5 px-3 text-right text-zinc-300">R {f.rev.toFixed(0)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">EBITDA ({ebitdaMargin}%)</td>
                      {fcfYears.map(f => (
                        <td key={f.year} className="py-2.5 px-3 text-right text-[#FFFFFF]">R {f.ebitda.toFixed(0)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-white">Unlevered FCF</td>
                      {fcfYears.map(f => (
                        <td key={f.year} className="py-2.5 px-3 text-right text-emerald-400 font-bold">R {f.fcf.toFixed(0)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-zinc-400">PV of FCF (WACC {wacc}%)</td>
                      {fcfYears.map(f => (
                        <td key={f.year} className="py-2.5 px-3 text-right text-white">R {f.pvFcf.toFixed(0)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2D Sensitivity Matrix: WACC vs. Terminal Growth */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#FFFFFF]" /> Valuation Sensitivity Matrix (Implied Share Price)
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">WACC vs. Terminal Growth</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500 text-[10px]">
                      <th className="py-2 px-3 text-left">WACC \ g</th>
                      {[2.0, 2.5, 3.0, 3.5, 4.0].map(g => (
                        <th key={g} className="py-2 px-3">{g.toFixed(1)}%</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[10.0, 11.0, 11.5, 12.5, 13.5].map(w => (
                      <tr key={w}>
                        <td className="py-2.5 px-3 text-left font-bold text-zinc-400">{w.toFixed(1)}%</td>
                        {[2.0, 2.5, 3.0, 3.5, 4.0].map(g => {
                          const isCurrent = Math.abs(w - wacc) < 0.2 && Math.abs(g - terminalGrowth) < 0.2;
                          // Recalculate price for cell
                          const tv = (fcfYears[4].fcf * (1 + g / 100)) / ((w - g) / 100);
                          const pvTv = tv / Math.pow(1 + w / 100, 5);
                          const ev = cumulativePvFcf + pvTv;
                          const sp = (ev - netDebt) / sharesOutstanding;
                          return (
                            <td 
                              key={g} 
                              className={`py-2.5 px-3 font-bold transition-all ${
                                isCurrent 
                                  ? 'bg-[#FFFFFF] text-black font-black rounded-lg shadow-lg' 
                                  : 'text-zinc-200 hover:bg-white/5'
                              }`}
                            >
                              R {sp > 0 ? sp.toFixed(2) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: LBO Returns & IRR Matrix */}
      {activeSubTab === 'lbo' && (
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FFFFFF]" />
                Leveraged Buyout (LBO) Returns Engine
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Institutional sponsor returns simulator calculating MoIC (Multiple on Invested Capital) and 5-year IRR.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Sponsor Equity Check</span>
              <div className="text-lg font-mono font-bold text-white mt-1">
                ZAR {lboSponsorEquity.toFixed(0)}M ({(100 - lboDebtPercent)}%)
              </div>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Exit Equity Value</span>
              <div className="text-lg font-mono font-bold text-white mt-1">
                ZAR {lboExitEquity.toFixed(0)}M
              </div>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">5-Yr Sponsor MoIC</span>
              <div className="text-lg font-mono font-bold text-[#FFFFFF] mt-1">
                {lboMoic.toFixed(2)}x Return
              </div>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Projected Net IRR</span>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                {lboIrr.toFixed(1)}% p.a.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Trading Comps Benchmarking */}
      {activeSubTab === 'comps' && (
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#FFFFFF]" />
            Pan-African Peer Trading Multiples (Comps)
          </h3>
          <p className="text-xs text-zinc-400">
            Real-time market valuation multiples across JSE, NGX, and international emerging market comps.
          </p>

          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black border-b border-white/10 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Company & Ticker</th>
                  <th className="p-3">Exchange</th>
                  <th className="p-3">Market Cap (USD)</th>
                  <th className="p-3">EV / EBITDA</th>
                  <th className="p-3">P / E Ratio</th>
                  <th className="p-3">P / Book</th>
                  <th className="p-3 text-right">Dividend Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-neutral-950">
                {[
                  { name: 'Standard Bank Group (SBK)', ex: 'JSE', cap: '$17.8B', evEbitda: '6.4x', pe: '7.8x', pb: '1.2x', div: '8.4%' },
                  { name: 'Naspers Ltd (NPN)', ex: 'JSE', cap: '$42.1B', evEbitda: '14.2x', pe: '18.5x', pb: '2.1x', div: '1.8%' },
                  { name: 'Dangote Cement (DANGCEM)', ex: 'NGX', cap: '$8.5B', evEbitda: '8.1x', pe: '11.4x', pb: '3.4x', div: '6.5%' },
                  { name: 'Safaricom PLC (SCOM)', ex: 'NSE Kenya', cap: '$4.2B', evEbitda: '5.9x', pe: '12.8x', pb: '2.8x', div: '7.2%' },
                  { name: 'AfriQuantX Peer Average', ex: 'Consensus', cap: '$18.1B', evEbitda: '8.6x', pe: '12.6x', pb: '2.4x', div: '6.0%' }
                ].map((peer, idx) => (
                  <tr key={idx} className={idx === 4 ? 'bg-[#FFFFFF]/10 font-bold' : ''}>
                    <td className="p-3 text-white font-bold">{peer.name}</td>
                    <td className="p-3 text-zinc-400">{peer.ex}</td>
                    <td className="p-3 text-zinc-200">{peer.cap}</td>
                    <td className="p-3 text-[#FFFFFF]">{peer.evEbitda}</td>
                    <td className="p-3 text-white">{peer.pe}</td>
                    <td className="p-3 text-zinc-300">{peer.pb}</td>
                    <td className="p-3 text-right text-emerald-400">{peer.div}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Syndicate Underwriting Waterfall */}
      {activeSubTab === 'syndicate' && (
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#FFFFFF]" />
              Syndicate Underwriting Fee Waterfall
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Automated allocation of gross underwriting spread between Lead Left, Joint Global Coordinators, and Praecipium selling concessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Gross Deal Size</span>
              <div className="text-lg font-mono font-bold text-white mt-1">
                ZAR {dealSizeMillions} Million
              </div>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Gross Underwriting Spread</span>
              <div className="text-lg font-mono font-bold text-[#FFFFFF] mt-1">
                {grossSpreadPct}% (ZAR {totalFees.toFixed(2)}M)
              </div>
            </div>
            <div className="bg-black p-4 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Lead Left Praecipium</span>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                20% Fee Skim (ZAR {(totalFees * 0.20).toFixed(2)}M)
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
