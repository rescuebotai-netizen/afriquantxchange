import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRightLeft, ShieldCheck, Zap, Clock, RefreshCw, 
  CheckCircle2, AlertCircle, TrendingUp, Layers, Lock,
  ChevronRight, Landmark, ArrowUpRight, ArrowDownRight, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { africanExchangeService, OvexRfqQuote, AltcoinLiveStats } from '../services/africanExchangeService';
import { BiometricAuthModal } from './BiometricAuthModal';

const SUPPORTED_MARKETS = [
  { id: 'btczar', name: 'Bitcoin / ZAR', symbol: 'BTCZAR', base: 'BTC', quote: 'ZAR', min: 5000 },
  { id: 'usdtzar', name: 'Tether USD / ZAR', symbol: 'USDTZAR', base: 'USDT', quote: 'ZAR', min: 1000 },
  { id: 'ethzar', name: 'Ethereum / ZAR', symbol: 'ETHZAR', base: 'ETH', quote: 'ZAR', min: 2000 },
  { id: 'solzar', name: 'Solana / ZAR', symbol: 'SOLZAR', base: 'SOL', quote: 'ZAR', min: 1000 }
];

export function OvexRfqTrading() {
  const [selectedMarket, setSelectedMarket] = useState('btczar');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('250000');
  const [prefunded, setPrefunded] = useState(1);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quote, setQuote] = useState<OvexRfqQuote | null>(null);
  const [quoteCountdown, setQuoteCountdown] = useState(0);
  const [executing, setExecuting] = useState(false);
  const [executionReceipt, setExecutionReceipt] = useState<any>(null);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  
  // AltcoinTrader live data
  const [altStats, setAltStats] = useState<Record<string, AltcoinLiveStats>>({});
  const [orderbook, setOrderbook] = useState<any>(null);
  const [otcHistory, setOtcHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'rfq' | 'orderbook' | 'history'>('rfq');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial market stats & OTC history
  const fetchMarketData = async () => {
    const [stats, history, ob] = await Promise.all([
      africanExchangeService.getAltcoinLiveStats(),
      africanExchangeService.getOtcTrades(),
      africanExchangeService.getAltcoinOrderbook(selectedMarket)
    ]);
    if (stats) setAltStats(stats);
    if (history?.trades) setOtcHistory(history.trades);
    if (ob) setOrderbook(ob);
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 8000);
    return () => clearInterval(interval);
  }, [selectedMarket]);

  // Request RFQ Quote
  const handleRequestQuote = async () => {
    setLoadingQuote(true);
    setExecutionReceipt(null);
    if (timerRef.current) clearInterval(timerRef.current);

    const result = await africanExchangeService.getOvexQuote({
      market: selectedMarket,
      from_amount: parseFloat(amount) || 50000,
      side,
      prefunded
    });

    setLoadingQuote(false);
    if (result && result.success) {
      setQuote(result);
      setQuoteCountdown(15);
      
      timerRef.current = setInterval(() => {
        setQuoteCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Accept & Execute OTC Quote with Hardware Biometric Signing
  const handleAcceptQuote = () => {
    if (!quote || quoteCountdown === 0) return;
    setIsBioModalOpen(true);
  };

  const executeConfirmedQuote = async () => {
    if (!quote) return;
    setExecuting(true);
    const res = await africanExchangeService.acceptOvexQuote(quote.quote_token);
    setExecuting(false);
    if (res.success) {
      setExecutionReceipt(res);
      setQuote(null);
      if (timerRef.current) clearInterval(timerRef.current);
      // Refresh OTC trades
      const updated = await africanExchangeService.getOtcTrades();
      if (updated?.trades) setOtcHistory(updated.trades);
    }
  };

  const currentPairStat = altStats[selectedMarket.toUpperCase()];

  return (
    <div id="ovex-rfq-terminal" className="bg-black border border-[#FFFFFF]/30 rounded-2xl p-6 text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FFFFFF]/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/10 border border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF]">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">OVEX Prime & AltcoinTrader Institutional Mesh</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#FFFFFF]/10 border border-[#FFFFFF]/40 text-[#FFFFFF] text-[10px] font-mono uppercase tracking-wider">
                Deep OTC & RFQ
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Guaranteed institutional liquidity, zero-slippage RFQ execution, and CARF-compliant clearing.
            </p>
          </div>
        </div>

        {/* Live Ticker Pills from AltcoinTrader */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {SUPPORTED_MARKETS.map(m => {
            const stat = altStats[m.symbol];
            const isSelected = selectedMarket === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { setSelectedMarket(m.id); setQuote(null); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 shrink-0 border ${
                  isSelected 
                    ? 'bg-[#FFFFFF] text-black font-bold border-[#FFFFFF]' 
                    : 'bg-black/60 text-zinc-300 border-white/10 hover:border-[#FFFFFF]/40'
                }`}
              >
                <span>{m.base}/ZAR</span>
                {stat && (
                  <span className={isSelected ? 'text-black' : 'text-[#FFFFFF]'}>
                    R {parseFloat(stat.Price).toLocaleString('en-ZA', { maximumFractionDigits: 2 })}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('rfq')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'rfq'
              ? 'bg-[#FFFFFF] text-black font-extrabold'
              : 'bg-black text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <Zap className="w-4 h-4" />
          Institutional RFQ (Guaranteed Quote)
        </button>
        <button
          onClick={() => setActiveTab('orderbook')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'orderbook'
              ? 'bg-[#FFFFFF] text-black font-extrabold'
              : 'bg-black text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          AltcoinTrader Orderbook Depth
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#FFFFFF] text-black font-extrabold'
              : 'bg-black text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <Clock className="w-4 h-4" />
          OTC Settlements History
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'rfq' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* RFQ Parameters Configurator */}
          <div className="lg:col-span-7 space-y-4 bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Configure Institutional OTC Request
            </h3>

            {/* Side Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setSide('buy'); setQuote(null); }}
                className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                  side === 'buy'
                    ? 'bg-[#FFFFFF] text-black border-[#FFFFFF] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'bg-black text-zinc-400 border-white/10 hover:border-white/20'
                }`}
              >
                Buy {SUPPORTED_MARKETS.find(m => m.id === selectedMarket)?.base} (ZAR In)
              </button>
              <button
                onClick={() => { setSide('sell'); setQuote(null); }}
                className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                  side === 'sell'
                    ? 'bg-[#FFFFFF] text-black border-[#FFFFFF] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'bg-black text-zinc-400 border-white/10 hover:border-white/20'
                }`}
              >
                Sell {SUPPORTED_MARKETS.find(m => m.id === selectedMarket)?.base} (ZAR Out)
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                <span>Notional Amount ({side === 'buy' ? 'ZAR' : SUPPORTED_MARKETS.find(m => m.id === selectedMarket)?.base})</span>
                <span className="text-[#FFFFFF] font-mono">Min: R 5,000 | Max: R 50,000,000+</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setQuote(null); }}
                  placeholder="250000"
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-[#FFFFFF] transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FFFFFF]">
                  {side === 'buy' ? 'ZAR' : SUPPORTED_MARKETS.find(m => m.id === selectedMarket)?.base}
                </span>
              </div>
              {/* Quick Amount Pills */}
              <div className="flex gap-2 mt-2">
                {['50000', '250000', '1000000', '5000000'].map(val => (
                  <button
                    key={val}
                    onClick={() => { setAmount(val); setQuote(null); }}
                    className="px-2.5 py-1 rounded-lg bg-black border border-white/10 text-zinc-300 hover:border-[#FFFFFF]/50 text-[11px] font-mono transition-colors"
                  >
                    R {(parseInt(val) / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Prefunded & Execution Option */}
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FFFFFF]" />
                <span className="text-zinc-300">Prefunded Settlement Account</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefunded === 1}
                  onChange={(e) => setPrefunded(e.target.checked ? 1 : 0)}
                  className="accent-[#FFFFFF] w-4 h-4"
                />
                <span className="text-[#FFFFFF] font-mono font-bold">Enabled (T+0 Instant)</span>
              </label>
            </div>

            {/* Request Quote Button */}
            <button
              onClick={handleRequestQuote}
              disabled={loadingQuote}
              className="w-full py-3.5 bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 text-black font-extrabold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              {loadingQuote ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Requesting Guaranteed OTC Quote from OVEX...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Get Guaranteed 15s RFQ Price Quote
                </>
              )}
            </button>
          </div>

          {/* Guaranteed Quote & Lock-in Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white/[0.02] border border-white/10 rounded-xl p-5 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FFFFFF]" />
                  Live Quote Terminal
                </h3>
                {quote && quoteCountdown > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-[#FFFFFF]/20 border border-[#FFFFFF] text-[#FFFFFF] text-xs font-mono font-bold animate-pulse">
                    Locks in: {quoteCountdown}s
                  </span>
                )}
              </div>

              {quote ? (
                <div className="space-y-4">
                  <div className="p-4 bg-black border border-[#FFFFFF]/40 rounded-xl space-y-2">
                    <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                      Guaranteed Rate Lock
                    </div>
                    <div className="text-xl font-mono font-bold text-[#FFFFFF]">
                      {quote.rate_display}
                    </div>
                    <div className="text-xs text-zinc-300 flex justify-between pt-2 border-t border-white/10">
                      <span>Receiving:</span>
                      <span className="text-white font-mono font-bold">
                        {quote.to_amount} {side === 'buy' ? SUPPORTED_MARKETS.find(m => m.id === selectedMarket)?.base : 'ZAR'}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 flex justify-between">
                      <span>OTC Prime Fee (0.15%):</span>
                      <span className="text-zinc-300 font-mono">R {quote.fee_amount}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-400 space-y-1 bg-black/40 p-3 rounded-lg border border-white/5 font-mono">
                    <div className="flex justify-between">
                      <span>Quote Token:</span>
                      <span className="text-[#FFFFFF] truncate max-w-[160px]">{quote.quote_token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clearing:</span>
                      <span className="text-white">{quote.settlement_type}</span>
                    </div>
                  </div>

                  {quoteCountdown > 0 ? (
                    <button
                      onClick={handleAcceptQuote}
                      disabled={executing}
                      className="w-full py-3.5 bg-gradient-to-r from-[#FFFFFF] to-amber-400 text-black font-extrabold rounded-xl text-sm transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2"
                    >
                      {executing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Executing & Settling...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Accept & Execute OTC Block (Lock Rate)
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-center text-xs text-red-300">
                      Quote expired. Request a new quote to lock in latest price.
                    </div>
                  )}
                </div>
              ) : executionReceipt ? (
                <div className="p-4 bg-black border border-[#FFFFFF] rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#FFFFFF]" />
                    Trade Settled Instantly
                  </div>
                  <p className="text-xs text-zinc-300">{executionReceipt.message}</p>
                  <div className="text-[11px] font-mono bg-white/[0.03] p-2 rounded text-zinc-400 space-y-1">
                    <div>Trade ID: <span className="text-white">{executionReceipt.trade_id}</span></div>
                    <div>Receipt: <span className="text-[#FFFFFF]">{executionReceipt.execution_receipt?.clearing_status}</span></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-500">
                    <Zap className="w-6 h-6 text-[#FFFFFF]" />
                  </div>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Click <span className="text-[#FFFFFF] font-semibold">"Get Guaranteed 15s RFQ Price Quote"</span> to stream institutional prices direct from OVEX liquidity mesh.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-ping" />
                OVEX OTC API v2 Active
              </span>
              <span className="font-mono text-[#FFFFFF]">Zero Slippage Lock</span>
            </div>
          </div>
        </div>
      )}

      {/* Orderbook Depth View */}
      {activeTab === 'orderbook' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>AltcoinTrader v3 Live Orderbook: <strong className="text-white">{selectedMarket.toUpperCase()}</strong></span>
            {orderbook?.spread && <span>Spread: <strong className="text-[#FFFFFF] font-mono">{orderbook.spread}</strong></span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bids (Buy Orders) */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex justify-between border-b border-white/10 pb-2">
                <span>Bid Price (ZAR)</span>
                <span>Volume</span>
                <span>Total (ZAR)</span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                {orderbook?.bids?.map((b: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-zinc-300 hover:bg-white/5 py-1 px-1 rounded transition-colors">
                    <span className="text-[#FFFFFF] font-bold">R {parseFloat(b.price).toLocaleString()}</span>
                    <span>{b.volume}</span>
                    <span className="text-zinc-400">R {parseFloat(b.total).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asks (Sell Orders) */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex justify-between border-b border-white/10 pb-2">
                <span>Ask Price (ZAR)</span>
                <span>Volume</span>
                <span>Total (ZAR)</span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                {orderbook?.asks?.map((a: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-zinc-300 hover:bg-white/5 py-1 px-1 rounded transition-colors">
                    <span className="text-white font-bold">R {parseFloat(a.price).toLocaleString()}</span>
                    <span>{a.volume}</span>
                    <span className="text-zinc-400">R {parseFloat(a.total).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTC Settlements History */}
      {activeTab === 'history' && (
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>OVEX Institutional Broker OTC Settlement Logs</span>
            <span className="font-mono text-[#FFFFFF]">Total Settled: {otcHistory.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-zinc-400 border-b border-white/10 pb-2 font-mono uppercase">
                  <th className="py-2">Trade ID</th>
                  <th className="py-2">Market</th>
                  <th className="py-2">Side</th>
                  <th className="py-2">Execution Rate</th>
                  <th className="py-2">Volume</th>
                  <th className="py-2">Total Value</th>
                  <th className="py-2">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {otcHistory.map((trade: any) => (
                  <tr key={trade.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 text-[#FFFFFF] font-bold">{trade.id}</td>
                    <td className="py-2.5 text-white font-bold">{trade.market}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        trade.side === 'buy' ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-white/10 text-white'
                      }`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="py-2.5 text-zinc-300">R {trade.price}</td>
                    <td className="py-2.5 text-zinc-300">{trade.volume}</td>
                    <td className="py-2.5 text-white font-bold">{trade.total}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[10px]">
                        {trade.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Biometric Security Hardware Enclave Signing */}
      <BiometricAuthModal
        isOpen={isBioModalOpen}
        actionTitle="Authorize Institutional RFQ Order"
        actionDescription={`Hardware verification required to sign and lock OTC execution of ${quote?.market?.toUpperCase() || selectedMarket.toUpperCase()}.`}
        amount={quote ? quote.from_amount : amount}
        currency={quote?.side === 'buy' ? 'ZAR' : selectedMarket.replace('zar', '').toUpperCase()}
        onSuccess={async () => {
          setIsBioModalOpen(false);
          await executeConfirmedQuote();
        }}
        onCancel={() => setIsBioModalOpen(false)}
      />
    </div>
  );
}
