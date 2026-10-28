import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, ShieldCheck, ArrowUpRight, ArrowDownRight, RefreshCw, DollarSign, Loader2, AlertTriangle, TrendingUp, Key, CheckCircle2, Zap, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { generateWalletYield } from '../services/geminiService';
import { WhopCardFundModal } from './WhopCardFundModal';
import { PocketWalletWidget } from './PocketWalletWidget';
import { OvexWalletHub } from './OvexWalletHub';

export function GlobalWallet() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [whopEntitlements, setWhopEntitlements] = useState<any>(null);
  const [showWhopFundModal, setShowWhopFundModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await generateWalletYield();
      if (result) {
        setData(result);
      }
      
      try {
        const whopRes = await fetch('/api/whop/entitlements');
        const whopJson = await whopRes.json();
        if (whopJson.success) {
          setWhopEntitlements(whopJson.data);
        }
      } catch (err) {
        console.warn('Whop API sync failed:', err);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 inset-x-0 h-1 bg-[#0066FF]" />
      
      <div className="p-6 border-b border-white/10 bg-white/[0.01] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/20 flex items-center justify-center border border-white/10">
            <Wallet className="w-6 h-6 text-[#0066FF]" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight text-xl">Global Wallet & Yield</h2>
            <p className="text-sm text-zinc-400 mt-1">Multi-currency balances and automated yield generation.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowWhopFundModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black rounded-xl text-sm font-extrabold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            Fund Card (Whop API)
          </button>
          <button className="px-4 py-2 bg-[#0066FF] hover:bg-[#0066FF]/80 text-white rounded-xl text-sm font-bold transition-colors shadow-[0_0_15px_rgba(0,102,255,0.3)] flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Deposit / Withdraw
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
            <p className="text-zinc-400 text-sm">Loading wallet balances and yield opportunities...</p>
          </div>
        ) : data ? (
          <>
            {/* Total Balance Overview & Pocket Wallet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/20 relative overflow-hidden space-y-4 h-full flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <h3 className="text-sm font-bold text-[#0066FF] uppercase tracking-wider relative z-10">
                      Total Balance (USD Equivalent)
                    </h3>
                    {whopEntitlements && (
                      <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-mono text-orange-400">
                        <Key className="w-3.5 h-3.5" />
                        Whop Infrastructure: <span className="font-bold text-white">{whopEntitlements.tierName || 'Connected'}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-end gap-4 relative z-10 mt-4">
                    <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{data.totalBalance}</span>
                    <span className={`font-bold flex items-center gap-1 mb-2 ${data.totalChange?.startsWith('-') ? 'text-[#FF3B3B]' : 'text-[#00C896]'}`}>
                      {data.totalChange?.startsWith('-') ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />} {data.totalChange} (24h)
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span>Interactive Pocket Vault</span>
                  <span className="text-sky-400 font-mono font-bold">Hover cards to expand balance</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center py-2 bg-white/[0.01] border border-white/10 rounded-2xl">
                <PocketWalletWidget balance={data.totalBalance} />
              </div>
            </div>

            {/* Whop Pass Benefits Banner if available */}
            {whopEntitlements?.hasVipPass && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-black border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">Whop VIP Member Privileges Active</h4>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      {whopEntitlements.feeDiscountPercent}% Trading Fee Discount • +{whopEntitlements.yieldBonusApy}% APY Yield Bonus
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Whop ID Verified
                </span>
              </div>
            )}

            {/* Multi-Currency Balances */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zinc-400" />
                Multi-Currency Balances
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.balances?.map((bal: any, idx: number) => {
                  const isUSD = bal.currency === 'USD';
                  const isNGN = bal.currency === 'NGN';
                  const icon = isUSD ? <DollarSign className="w-5 h-5 text-[#00C896]" /> : <span className={`text-lg font-bold ${isNGN ? 'text-[#00C896]' : 'text-[#0066FF]'}`}>{bal.symbol || bal.currency[0]}</span>;
                  const bgClass = isUSD ? 'bg-[#00C896]/10' : isNGN ? 'bg-[#00C896]/10' : 'bg-[#0066FF]/10';
                  const borderClass = isUSD ? 'border-[#00C896]/20' : isNGN ? 'border-[#00C896]/20' : 'border-[#0066FF]/20';
                  const solidBgClass = isUSD ? 'bg-[#00C896]' : isNGN ? 'bg-[#00C896]' : 'bg-[#0066FF]';

                  return (
                    <div key={idx} className={`p-5 rounded-2xl bg-white/5 border ${borderClass} hover:bg-white/10 transition-colors relative overflow-hidden group`}>
                      <div className={`absolute top-0 left-0 w-1 h-full ${solidBgClass}`} />
                      <div className="flex justify-between items-start mb-4 pl-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}>
                            {icon}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg">{bal.currency}</h4>
                            <p className="text-xs text-zinc-400">Available Balance</p>
                          </div>
                        </div>
                      </div>
                      <div className="pl-3">
                        <div className="text-2xl font-bold text-white mb-1">{bal.balance}</div>
                        <div className="text-xs font-bold text-[#00C896] flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Earning {bal.yield}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Automated Yield Generation */}
            <div className="p-6 rounded-2xl bg-black/20 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00C896]" />
                Automated Yield Generation (Idle Cash)
              </h3>
              <div className="space-y-4">
                {data.yieldOpportunities?.map((opp: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-white">{opp.name}</div>
                      <div className="text-xs text-zinc-400 mt-1">{opp.risk}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#00C896]">{opp.apy} APY</div>
                      <div className="text-xs text-zinc-500 mt-1">{opp.allocated} Allocated</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OVEX Prime & CARF Regulatory Compliance Hub */}
            <OvexWalletHub />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <AlertTriangle className="w-8 h-8 text-[#FF3B3B]" />
            <p className="text-zinc-400 text-sm">Failed to load wallet data.</p>
          </div>
        )}
      </div>

      <WhopCardFundModal
        isOpen={showWhopFundModal}
        onClose={() => setShowWhopFundModal(false)}
        onSuccess={(fundedData) => {
          if (data && fundedData.netAddedUsd) {
            const currentNum = parseFloat(data.totalBalance.replace(/[^0-9.]/g, '')) || 0;
            const newTotal = (currentNum + fundedData.netAddedUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            setData((prev: any) => ({
              ...prev,
              totalBalance: newTotal,
            }));
          }
        }}
      />
    </div>
  );
}
