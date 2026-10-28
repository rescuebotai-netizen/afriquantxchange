import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowDownToLine, ArrowUpFromLine, ShieldCheck, 
  FileCheck2, AlertTriangle, CheckCircle2, Copy, ExternalLink, 
  RefreshCw, Landmark, Globe, Layers, Key, Zap, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  africanExchangeService, DepositAddressResponse, 
  PendingCarfItem, CarfTransferType 
} from '../services/africanExchangeService';
import { BiometricAuthModal } from './BiometricAuthModal';

export function OvexWalletHub() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'carf' | 'offshore' | 'fees'>('deposit');
  
  // Biometric Auth Modal State
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [pendingBioAction, setPendingBioAction] = useState<(() => Promise<void>) | null>(null);
  const [bioTitle, setBioTitle] = useState('Authorize Instant Withdrawal');
  const [bioDescription, setBioDescription] = useState('Authenticate using your hardware Face ID / Touch ID sensor or Passkey.');
  const [bioAmount, setBioAmount] = useState<string | number | undefined>(undefined);
  const [bioCurrency, setBioCurrency] = useState('ZAR');
  
  // Deposit State
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [depositData, setDepositData] = useState<DepositAddressResponse | null>(null);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [copied, setCopied] = useState(false);
  const [depositsHistory, setDepositsHistory] = useState<any[]>([]);

  // Withdraw State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBeneficiary, setWithdrawBeneficiary] = useState('1');
  const [withdrawCurrency, setWithdrawCurrency] = useState('ZAR');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawResult, setWithdrawResult] = useState<any>(null);
  const [withdrawsHistory, setWithdrawsHistory] = useState<any[]>([]);

  // CARF Compliance State
  const [pendingCarf, setPendingCarf] = useState<PendingCarfItem[]>([]);
  const [carfTypes, setCarfTypes] = useState<CarfTransferType[]>([]);
  const [declaringCarf, setDeclaringCarf] = useState(false);
  const [selectedPendingItem, setSelectedPendingItem] = useState<PendingCarfItem | null>(null);
  const [selectedCarfType, setSelectedCarfType] = useState('SELF_TRANSFER');
  const [carfSuccessMsg, setCarfSuccessMsg] = useState<string | null>(null);

  // Offshore SARB & Fees
  const [offshoreData, setOffshoreData] = useState<any>(null);
  const [feesData, setFeesData] = useState<any>({ deposit: {}, withdraw: {} });

  // Fetch Deposit Address
  const loadDepositAddress = async (curr: string) => {
    setLoadingDeposit(true);
    const [addr, history] = await Promise.all([
      africanExchangeService.getDepositAddress(curr),
      africanExchangeService.getDepositsHistory(curr)
    ]);
    setDepositData(addr);
    if (history?.deposits) setDepositsHistory(history.deposits);
    setLoadingDeposit(false);
  };

  // Fetch CARF Data
  const loadCarfData = async () => {
    const [pending, types] = await Promise.all([
      africanExchangeService.getPendingCarf(),
      africanExchangeService.getCarfTransferTypes()
    ]);
    setPendingCarf(pending);
    setCarfTypes(types);
  };

  // Initial Load
  useEffect(() => {
    loadDepositAddress(selectedCurrency);
    loadCarfData();
    africanExchangeService.getWithdrawsHistory().then(res => {
      if (res?.withdraws) setWithdrawsHistory(res.withdraws);
    });
    africanExchangeService.getOffshoreTransactions().then(res => {
      if (res) setOffshoreData(res);
    });
    africanExchangeService.getFees().then(res => {
      setFeesData(res);
    });
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeclareCarfSingle = async () => {
    if (!selectedPendingItem) return;
    setBioTitle('Authorize CARF Declaration');
    setBioDescription(`Confirm identity to sign and transmit OECD CARF declaration for ${selectedPendingItem.currency.toUpperCase()} deposit.`);
    setBioAmount(selectedPendingItem.amount);
    setBioCurrency(selectedPendingItem.currency.toUpperCase());
    setPendingBioAction(() => async () => {
      setDeclaringCarf(true);
      const res = await africanExchangeService.declareCarf(selectedPendingItem.id, selectedCarfType);
      setDeclaringCarf(false);
      if (res.success) {
        setCarfSuccessMsg(res.message);
        setSelectedPendingItem(null);
        loadCarfData();
        setTimeout(() => setCarfSuccessMsg(null), 5000);
      }
    });
    setIsBioModalOpen(true);
  };

  const handleDeclareCarfAll = async () => {
    setBioTitle('Batch Sign CARF Declarations');
    setBioDescription('Hardware verification required to sign and submit bulk CARF declarations across all pending deposits.');
    setBioAmount(pendingCarf.length);
    setBioCurrency('ITEMS');
    setPendingBioAction(() => async () => {
      setDeclaringCarf(true);
      const res = await africanExchangeService.declareCarfAll('SELF_TRANSFER');
      setDeclaringCarf(false);
      if (res.success) {
        setCarfSuccessMsg(res.message);
        loadCarfData();
        setTimeout(() => setCarfSuccessMsg(null), 5000);
      }
    });
    setIsBioModalOpen(true);
  };

  const handleCreateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;

    setBioTitle('Authorize Real-Time Withdrawal');
    setBioDescription(`Hardware biometric sign-off required to dispatch ${withdrawCurrency} ${withdrawAmount} to verified beneficiary.`);
    setBioAmount(withdrawAmount);
    setBioCurrency(withdrawCurrency);
    setPendingBioAction(() => async () => {
      setWithdrawing(true);
      const res = await africanExchangeService.createWithdrawal(
        parseFloat(withdrawAmount),
        withdrawBeneficiary,
        withdrawCurrency
      );
      setWithdrawing(false);
      if (res.success) {
        setWithdrawResult(res);
        setWithdrawAmount('');
        const updated = await africanExchangeService.getWithdrawsHistory(withdrawCurrency);
        if (updated?.withdraws) setWithdrawsHistory(updated.withdraws);
      }
    });
    setIsBioModalOpen(true);
  };

  return (
    <div id="ovex-wallet-mesh" className="bg-black border border-[#FFFFFF]/30 rounded-2xl p-6 text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FFFFFF]/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/10 border border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF]">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">OVEX Prime Custody & CARF Compliance Mesh</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#FFFFFF]/10 border border-[#FFFFFF]/40 text-[#FFFFFF] text-[10px] font-mono uppercase">
                Tier 3 Institutional
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Multi-chain custody addresses, OECD CARF tax declaration workflows, and SARB foreign allowance management.
            </p>
          </div>
        </div>

        {pendingCarf.length > 0 && (
          <button
            onClick={() => setActiveTab('carf')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#FFFFFF] text-xs font-mono font-bold flex items-center gap-2 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 text-[#FFFFFF]" />
            {pendingCarf.length} Pending CARF Declarations
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'deposit'
              ? 'bg-[#FFFFFF] text-black font-extrabold'
              : 'bg-black text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4" />
          Deposit & Custody Address
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'withdraw'
              ? 'bg-[#FFFFFF] text-black font-extrabold'
              : 'bg-black text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <ArrowUpFromLine className="w-4 h-4" />
          Instant Withdrawal (RTC EFT)
        </button>
        <button
          onClick={() => setActiveTab('carf')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'carf'
              ? 'bg-[#FFFFFF] text-black font-extrabold'
              : 'bg-black text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          CARF Regulatory Declarations
          {pendingCarf.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#FFFFFF] ml-1 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('offshore')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'offshore'
              ? 'bg-[#FFFFFF] text-black font-extrabold'
              : 'bg-black text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <Globe className="w-4 h-4" />
          SARB Offshore Allowances
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'fees'
              ? 'bg-[#FFFFFF] text-black font-extrabold'
              : 'bg-black text-zinc-400 hover:text-white border border-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          Fee Schedule & Limits
        </button>
      </div>

      {/* Tab: Deposit Address */}
      {activeTab === 'deposit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4 bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              Generate Multi-Chain Deposit Address
            </h3>

            {/* Currency Selector */}
            <div>
              <label className="text-xs text-zinc-400 mb-2 block">Select Asset / Network</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'btc', label: 'Bitcoin (BTC)' },
                  { id: 'bch', label: 'Bitcoin Cash (BCH)' },
                  { id: 'eth', label: 'Ethereum (ETH)' },
                  { id: 'usdt', label: 'Tether (USDT-TRC20)' },
                  { id: 'usdc', label: 'USD Coin (USDC)' },
                  { id: 'zar', label: 'ZAR (Instant EFT)' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCurrency(c.id); loadDepositAddress(c.id); }}
                    className={`p-2.5 rounded-xl text-xs font-mono transition-all border text-center ${
                      selectedCurrency === c.id
                        ? 'bg-[#FFFFFF] text-black font-bold border-[#FFFFFF]'
                        : 'bg-black text-zinc-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Address Display Box */}
            {loadingDeposit ? (
              <div className="py-10 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin text-[#FFFFFF]" />
                Generating dedicated institutional escrow address from OVEX...
              </div>
            ) : depositData ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-black border border-[#FFFFFF]/40 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs text-zinc-400">
                    <span>Network: <strong className="text-white font-mono">{depositData.network}</strong></span>
                    <span className="text-[#FFFFFF] font-mono">Confirmations: {depositData.confirmations_required}</span>
                  </div>

                  <div className="p-3 bg-white/[0.03] rounded-lg border border-white/10 flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-white break-all">{depositData.address}</span>
                    <button
                      onClick={() => handleCopy(depositData.address)}
                      className="p-2 rounded-lg bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FFFFFF] shrink-0 transition-colors"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {depositData.memo && (
                    <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Required Memo/Tag: <strong className="text-[#FFFFFF]">{depositData.memo}</strong></span>
                      <button onClick={() => handleCopy(depositData.memo!)} className="text-[#FFFFFF] text-[11px] underline">Copy</button>
                    </div>
                  )}

                  <div className="text-[11px] text-zinc-400 flex justify-between">
                    <span>Minimum Deposit:</span>
                    <span className="text-white font-mono font-bold">{depositData.min_deposit}</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 bg-black/40 p-3 rounded-lg border border-white/5 space-y-1">
                  <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Guaranteed 1:1 Institutional Custody
                  </p>
                  <p className="text-[11px]">
                    All incoming deposits are automatically checked against SARB and OECD CARF compliance filters for seamless reconciliation.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Deposit History */}
          <div className="lg:col-span-6 space-y-4 bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Recent Deposit Transactions</span>
              <span className="text-xs font-mono text-[#FFFFFF]">{depositsHistory.length} Recorded</span>
            </h3>

            <div className="space-y-2">
              {depositsHistory.map((dep) => (
                <div key={dep.id} className="p-3.5 bg-black border border-white/10 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#FFFFFF]">{dep.amount} {dep.currency}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                      {dep.state} ({dep.confirmations}/{dep.required_confirmations} conf)
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                    <span className="truncate max-w-[220px]">TX: {dep.txid}</span>
                    <span>{dep.created_at}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-white/5">
                    <span className="text-zinc-500">CARF Tax Declaration:</span>
                    <span className={dep.carf_declared ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
                      {dep.carf_declared ? `Declared (${dep.carf_transfer_type})` : 'Declaration Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Instant Withdrawal */}
      {activeTab === 'withdraw' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4 bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4" />
              Institutional Instant Withdrawal
            </h3>

            <form onSubmit={handleCreateWithdrawal} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Currency</label>
                <select
                  value={withdrawCurrency}
                  onChange={(e) => setWithdrawCurrency(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#FFFFFF]"
                >
                  <option value="ZAR">South African Rand (ZAR Instant RTC EFT)</option>
                  <option value="USD">US Dollar (SWIFT Wire)</option>
                  <option value="BTC">Bitcoin (BTC Native)</option>
                  <option value="USDT">Tether USD (TRC-20)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Whitelisted Beneficiary</label>
                <select
                  value={withdrawBeneficiary}
                  onChange={(e) => setWithdrawBeneficiary(e.target.value)}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#FFFFFF]"
                >
                  <option value="1">Investec Corporate Treasury (Acc: ...9941)</option>
                  <option value="2">Standard Bank Prime Escrow (Acc: ...8820)</option>
                  <option value="3">Cold Storage Multisig Vault (bc1q...3m8w)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Withdrawal Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="100000"
                    className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-[#FFFFFF]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#FFFFFF]">
                    {withdrawCurrency}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-black/60 border border-white/10 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Network / Clearing Fee:</span>
                  <span className="text-[#FFFFFF] font-mono font-bold">R 0.00 (Zero Fee)</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Clearing Speed:</span>
                  <span className="text-white font-mono">Under 15 minutes (RTC EFT)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={withdrawing || !withdrawAmount}
                className="w-full py-3.5 bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 text-black font-extrabold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
              >
                {withdrawing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Authorizing Instant Clearing with SARB mesh...
                  </>
                ) : (
                  <>
                    <ArrowUpFromLine className="w-4 h-4" />
                    Confirm & Dispatch Instant Withdrawal
                  </>
                )}
              </button>
            </form>

            {withdrawResult && (
              <div className="p-4 bg-black border border-emerald-500/40 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  {withdrawResult.message}
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  Withdrawal ID: <span className="text-white">{withdrawResult.withdrawal_id}</span>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-4 bg-white/[0.02] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Withdrawal Audit Trail</span>
              <span className="text-xs font-mono text-[#FFFFFF]">{withdrawsHistory.length} Completed</span>
            </h3>

            <div className="space-y-2">
              {withdrawsHistory.map((w) => (
                <div key={w.id} className="p-3.5 bg-black border border-white/10 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="font-mono font-bold text-white">{w.amount} {w.currency}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                      {w.state}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex justify-between font-mono">
                    <span>Beneficiary: {w.beneficiary}</span>
                    <span>Fee: {w.fee}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">{w.created_at}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: CARF Regulatory Compliance */}
      {activeTab === 'carf' && (
        <div className="space-y-6">
          <div className="p-5 bg-gradient-to-r from-black via-white/[0.02] to-black border border-[#FFFFFF]/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FFFFFF]" />
                <h3 className="text-base font-bold text-white">OECD & SARS Crypto-Asset Reporting Framework (CARF)</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                In compliance with South African Revenue Service (SARS) and international OECD standards, all incoming crypto deposits must be categorized by transfer type to maintain institutional tax clearance.
              </p>
            </div>
            {pendingCarf.length > 0 && (
              <button
                onClick={handleDeclareCarfAll}
                disabled={declaringCarf}
                className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Declare All as Self-Transfer
              </button>
            )}
          </div>

          {carfSuccessMsg && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {carfSuccessMsg}
            </div>
          )}

          {/* Pending CARF Declarations */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center justify-between">
              <span>Pending CARF Regulatory Declarations</span>
              <span className="font-mono">{pendingCarf.length} Pending</span>
            </h4>

            {pendingCarf.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span>All deposits have been fully declared and registered under CARF tax compliance guidelines.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingCarf.map((item) => (
                  <div key={item.id} className="p-4 bg-black border border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{item.amount} {item.currency}</span>
                        <span className="text-[#FFFFFF] font-mono">(≈ R {item.zar_value.toLocaleString()})</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[#FFFFFF] text-[10px] font-mono">
                          {item.compliance_deadline}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        From: {item.sender_address} • Received: {item.received_at}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPendingItem(item)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#FFFFFF] hover:text-black text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-2"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      File Declaration
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal / Dialog for single declaration */}
          {selectedPendingItem && (
            <div className="p-5 bg-black border border-[#FFFFFF] rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#FFFFFF]" />
                Declare Transfer Origin for Deposit #{selectedPendingItem.id} ({selectedPendingItem.amount} {selectedPendingItem.currency})
              </h4>

              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Select CARF Regulatory Transfer Category</label>
                <div className="space-y-2">
                  {carfTypes.map((t) => (
                    <label
                      key={t.id}
                      onClick={() => setSelectedCarfType(t.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedCarfType === t.id
                          ? 'bg-[#FFFFFF]/10 border-[#FFFFFF] text-white'
                          : 'bg-black border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="carf_type"
                          checked={selectedCarfType === t.id}
                          onChange={() => setSelectedCarfType(t.id)}
                          className="accent-[#FFFFFF]"
                        />
                        <span className="text-xs font-semibold">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#FFFFFF]">{t.code}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setSelectedPendingItem(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-zinc-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeclareCarfSingle}
                  disabled={declaringCarf}
                  className="px-5 py-2 rounded-xl bg-[#FFFFFF] text-black text-xs font-extrabold flex items-center gap-2"
                >
                  {declaringCarf ? 'Submitting to SARS/CARF...' : 'Submit Official Declaration'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: SARB Offshore Allowances */}
      {activeTab === 'offshore' && offshoreData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
              <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
                Single Discretionary Allowance (SDA)
              </div>
              <div className="text-2xl font-bold font-mono text-[#FFFFFF]">
                {offshoreData.sarb_allowances?.sda_remaining} <span className="text-xs text-zinc-400 font-normal">Remaining</span>
              </div>
              <div className="text-xs text-zinc-400 flex justify-between pt-2 border-t border-white/10 font-mono">
                <span>Annual Cap: {offshoreData.sarb_allowances?.sda_limit}</span>
                <span>Utilized: {offshoreData.sarb_allowances?.sda_utilized}</span>
              </div>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
              <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
                Foreign Investment Allowance (FIA)
              </div>
              <div className="text-2xl font-bold font-mono text-[#FFFFFF]">
                {offshoreData.sarb_allowances?.fia_remaining} <span className="text-xs text-zinc-400 font-normal">Remaining</span>
              </div>
              <div className="text-xs text-zinc-400 flex justify-between pt-2 border-t border-white/10 font-mono">
                <span>Annual Cap: {offshoreData.sarb_allowances?.fia_limit}</span>
                <span>Utilized: {offshoreData.sarb_allowances?.fia_utilized}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Offshore Arbitrage & Capital Export History
            </h4>
            <div className="space-y-2">
              {offshoreData.transactions?.map((tx: any) => (
                <div key={tx.id} className="p-3 bg-black border border-white/10 rounded-xl flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-[#FFFFFF] font-bold">{tx.type}</span>
                    <span className="text-zinc-400 ml-2">({tx.amount} @ {tx.fx_rate})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500">{tx.date}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px]">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Fees Schedule */}
      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Deposit Fee Schedule</h4>
            <div className="divide-y divide-white/5 text-xs font-mono">
              {Object.entries(feesData.deposit || {}).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between text-zinc-300">
                  <span>{key.replace('_', ' ')}</span>
                  <span className="text-white font-bold">{val as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider">Withdrawal Fee Schedule</h4>
            <div className="divide-y divide-white/5 text-xs font-mono">
              {Object.entries(feesData.withdraw || {}).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between text-zinc-300">
                  <span>{key.replace('_', ' ')}</span>
                  <span className="text-white font-bold">{val as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hardware Biometric Security Gate Modal */}
      <BiometricAuthModal
        isOpen={isBioModalOpen}
        actionTitle={bioTitle}
        actionDescription={bioDescription}
        amount={bioAmount}
        currency={bioCurrency}
        onSuccess={async (res) => {
          setIsBioModalOpen(false);
          if (pendingBioAction) {
            await pendingBioAction();
            setPendingBioAction(null);
          }
        }}
        onCancel={() => {
          setIsBioModalOpen(false);
          setPendingBioAction(null);
        }}
      />
    </div>
  );
}
