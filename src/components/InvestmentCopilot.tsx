import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Briefcase, PieChart, Zap, CheckCircle2, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { generateInvestmentCopilot } from '../services/geminiService';

export function InvestmentCopilot() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [riskProfile, setRiskProfile] = useState('Moderate-Aggressive');

  const fetchData = async () => {
    setLoading(true);
    const result = await generateInvestmentCopilot(riskProfile);
    if (result) {
      setData(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [riskProfile]);

  return (
    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 inset-x-0 h-1 bg-[#FFFFFF]" />
      
      <div className="p-6 border-b border-white/10 bg-white/[0.01] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-white/10">
            <Target className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight text-xl">AI Investment Copilot</h2>
            <p className="text-sm text-zinc-400 mt-1">Personalized recommendations and portfolio optimization.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={riskProfile}
            onChange={(e) => setRiskProfile(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate</option>
            <option value="Moderate-Aggressive">Moderate-Aggressive</option>
            <option value="Aggressive">Aggressive</option>
          </select>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            Generate Thesis
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-zinc-400 text-sm">Analyzing portfolio and market conditions...</p>
          </div>
        ) : data ? (
          <>
            {/* "What should I invest in?" Prompt */}
            <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                "What should I invest in this month?"
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed relative z-10 mb-4">
                {data.recommendation}
              </p>
              <div className="flex gap-3 relative z-10">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/10 flex items-center gap-2">
                  View Recommendations <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Portfolio Optimization */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-400" />
                Portfolio Optimization Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Current Allocation</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex">
                    {data.currentAllocation?.map((alloc: any, idx: number) => (
                      <div key={idx} className={`h-full ${alloc.color}`} style={{ width: `${alloc.percentage}%` }} title={alloc.sector} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {data.currentAllocation?.map((a: any) => `${a.sector} (${a.percentage}%)`).join(', ')}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-indigo-500/30 flex flex-col gap-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/5" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">AI Optimized Allocation</span>
                    <span className="text-xs font-bold text-[#00C896] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {data.expectedYield} Expected Yield</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex relative z-10">
                    {data.optimizedAllocation?.map((alloc: any, idx: number) => (
                      <div key={idx} className={`h-full ${alloc.color}`} style={{ width: `${alloc.percentage}%` }} title={alloc.sector} />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 relative z-10">
                    {data.optimizedAllocation?.map((a: any) => `${a.sector} (${a.percentage}%)`).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Auto-Generated Investment Thesis */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-zinc-400" />
                Auto-Generated Investment Thesis
              </h3>
              <div className="space-y-4">
                {data.theses?.map((thesis: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl bg-black/20 border border-white/10 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-bold text-md group-hover:text-indigo-400 transition-colors">{thesis.title}</h4>
                      <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                        {thesis.confidence} Conviction
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#00C896]" /> AI Validated
                      </span>
                      <span className="text-xs text-zinc-500">{thesis.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <AlertTriangle className="w-8 h-8 text-[#FF3B3B]" />
            <p className="text-zinc-400 text-sm">Failed to load investment recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
