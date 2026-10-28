import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Globe, ShieldCheck, Key, CheckCircle2, RefreshCw, 
  ArrowRight, X, Zap, DollarSign, Building2, AlertCircle, Receipt
} from 'lucide-react';

export interface WhopCardFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (fundedData: any) => void;
  defaultCardNumber?: string;
  defaultCardName?: string;
}

const REGION_BANKS = {
  Africa: [
    { country: 'Nigeria', currency: 'NGN', symbol: '₦', rateToUsd: 0.00067, sampleBanks: ['GTBank', 'Zenith Bank', 'Access Bank', 'FirstBank'], cardBrands: ['Verve', 'Visa', 'Mastercard'] },
    { country: 'South Africa', currency: 'ZAR', symbol: 'R', rateToUsd: 0.054, sampleBanks: ['Standard Bank', 'Capitec', 'FNB', 'Absa'], cardBrands: ['Visa', 'Mastercard'] },
    { country: 'Kenya', currency: 'KES', symbol: 'KSh', rateToUsd: 0.0078, sampleBanks: ['KCB Bank', 'Equity Bank', 'Co-operative Bank'], cardBrands: ['Visa', 'Mastercard'] },
    { country: 'Egypt', currency: 'EGP', symbol: 'E£', rateToUsd: 0.021, sampleBanks: ['National Bank of Egypt', 'CIB', 'Banque Misr'], cardBrands: ['Meeza', 'Visa', 'Mastercard'] },
  ],
  America: [
    { country: 'United States', currency: 'USD', symbol: '$', rateToUsd: 1.0, sampleBanks: ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citi'], cardBrands: ['Visa', 'Mastercard', 'Amex'] },
    { country: 'Canada', currency: 'CAD', symbol: 'CA$', rateToUsd: 0.74, sampleBanks: ['RBC', 'TD Bank', 'Scotiabank', 'BMO'], cardBrands: ['Visa', 'Mastercard'] },
    { country: 'Brazil', currency: 'BRL', symbol: 'R$', rateToUsd: 0.18, sampleBanks: ['Itaú Unibanco', 'Bradesco', 'Banco do Brasil'], cardBrands: ['Elo', 'Visa', 'Mastercard'] },
  ],
  Asia: [
    { country: 'Japan', currency: 'JPY', symbol: '¥', rateToUsd: 0.0065, sampleBanks: ['MUFG Bank', 'Sumitomo Mitsui', 'Mizuho'], cardBrands: ['JCB', 'Visa', 'Mastercard'] },
    { country: 'India', currency: 'INR', symbol: '₹', rateToUsd: 0.012, sampleBanks: ['HDFC Bank', 'ICICI Bank', 'State Bank of India'], cardBrands: ['RuPay', 'Visa', 'Mastercard'] },
    { country: 'Singapore', currency: 'SGD', symbol: 'S$', rateToUsd: 0.75, sampleBanks: ['DBS Bank', 'OCBC', 'UOB'], cardBrands: ['Visa', 'Mastercard'] },
  ],
  Europe: [
    { country: 'United Kingdom', currency: 'GBP', symbol: '£', rateToUsd: 1.28, sampleBanks: ['Barclays', 'HSBC', 'Lloyds Bank', 'Revolut'], cardBrands: ['Visa', 'Mastercard'] },
    { country: 'Germany (Eurozone)', currency: 'EUR', symbol: '€', rateToUsd: 1.08, sampleBanks: ['Deutsche Bank', 'Commerzbank', 'N26'], cardBrands: ['Visa', 'Mastercard'] },
    { country: 'Switzerland', currency: 'CHF', symbol: 'CHF', rateToUsd: 1.15, sampleBanks: ['UBS', 'Credit Suisse'], cardBrands: ['Visa', 'Mastercard'] },
  ],
};

export function WhopCardFundModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCardNumber = '4532 •••• •••• 8891',
  defaultCardName = 'INVESTOR NAME',
}: WhopCardFundModalProps) {
  const [region, setRegion] = useState<'Africa' | 'America' | 'Asia' | 'Europe'>('Africa');
  const [selectedCountry, setSelectedCountry] = useState(REGION_BANKS['Africa'][0]);
  const [amount, setAmount] = useState<string>('500');
  
  // Card input states
  const [cardNumber, setCardNumber] = useState(defaultCardNumber);
  const [cardHolder, setCardHolder] = useState(defaultCardName);
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('842');
  const [cardBrand, setCardBrand] = useState('Visa');

  // Whop credentials & state
  const [customApiKey, setCustomApiKey] = useState('');
  const [whopEntitlements, setWhopEntitlements] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptResult, setReceiptResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Reset country when region changes
    const countries = REGION_BANKS[region];
    if (countries && countries.length > 0) {
      setSelectedCountry(countries[0]);
    }
  }, [region]);

  useEffect(() => {
    // Detect Whop status on load
    fetch('/api/whop/entitlements')
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setWhopEntitlements(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const numAmount = parseFloat(amount) || 0;
  const targetUsd = Number((numAmount * selectedCountry.rateToUsd).toFixed(2));
  const hasVipPass = whopEntitlements?.hasVipPass ?? true;
  const feeDiscount = hasVipPass ? 50 : 0;
  const baseFee = targetUsd * 0.015;
  const finalFee = Number((baseFee * (1 - feeDiscount / 100)).toFixed(2));
  const netAddedUsd = Number((targetUsd - finalFee).toFixed(2));

  const handleFund = async () => {
    if (numAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setReceiptResult(null);

    try {
      const res = await fetch('/api/whop/fund-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          currency: selectedCountry.currency,
          region,
          bankCountry: selectedCountry.country,
          cardDetails: {
            cardNumberMasked: cardNumber,
            cardHolderName: cardHolder,
            expiry,
            cardBrand,
          },
          apiKey: customApiKey || undefined,
        }),
      });

      const json = await res.json();
      if (json.success || json.transactionId) {
        setReceiptResult(json);
        if (onSuccess) onSuccess(json);
      } else {
        setErrorMessage(json.error || 'Failed to authorize funding via Whop Infrastructure');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error connecting to Whop Payment Gateway');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-neutral-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8 text-white"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-mono font-bold uppercase rounded-full">
                  Whop API v5 Gateway
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded-full">
                  Real-Time Settlement
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Fund Card & Wallet via Whop</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {receiptResult ? (
          /* Receipt View */
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-white">Card Successfully Funded!</h4>
              <p className="text-xs text-zinc-400">
                Instant settlement authorized via Whop Infrastructure for {receiptResult.bankCountry} ({receiptResult.settlementRegion}).
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-zinc-500 uppercase text-[10px]">Whop Transaction ID</span>
                <span className="text-emerald-400 font-bold">{receiptResult.transactionId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Whop Charge Ref</span>
                <span className="text-white">{receiptResult.whopChargeId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Funding Amount</span>
                <span className="text-white font-bold">{receiptResult.fundedAmount} {receiptResult.fundedCurrency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">USD Target Equivalent</span>
                <span className="text-white">${receiptResult.targetUsdEquivalent?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>Whop VIP Discount ({receiptResult.feeDiscountAppliedPercent}%)</span>
                <span>-${(receiptResult.targetUsdEquivalent * 0.015 * 0.5).toFixed(2)} Fee Saved</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-2 text-sm font-bold">
                <span className="text-white">Net Added to Card Wallet</span>
                <span className="text-emerald-400">${receiptResult.netAddedUsd?.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Done & Return to Wallet
            </button>
          </div>
        ) : (
          /* Input Form View */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Region Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                1. Select Local Bank Jurisdiction & Region
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Africa', 'America', 'Asia', 'Europe'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      region === r
                        ? 'bg-orange-500/20 border-orange-500/50 text-white shadow-lg'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Country & Bank Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400">Bank Country</label>
                <select
                  value={selectedCountry.country}
                  onChange={(e) => {
                    const found = REGION_BANKS[region].find(c => c.country === e.target.value);
                    if (found) setSelectedCountry(found);
                  }}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-orange-500/50"
                >
                  {REGION_BANKS[region].map((c) => (
                    <option key={c.country} value={c.country} className="bg-neutral-950">
                      {c.country} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400">Supported Local Cards</label>
                <div className="flex items-center gap-1.5 pt-2">
                  {selectedCountry.cardBrands.map((b) => (
                    <span key={b} className="px-2 py-1 bg-white/5 border border-white/10 text-zinc-300 font-mono text-[10px] rounded-md">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Amount Input & FX Calculation */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>2. Deposit Amount ({selectedCountry.currency})</span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  Rate: 1 {selectedCountry.currency} = ${selectedCountry.rateToUsd} USD
                </span>
              </label>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">
                    {selectedCountry.symbol}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="500"
                    className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-lg font-bold text-white outline-none focus:border-orange-500/50 font-mono"
                  />
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-zinc-500 uppercase block">USD Net Balance</span>
                  <span className="text-lg font-bold text-emerald-400">${netAddedUsd.toFixed(2)}</span>
                </div>
              </div>

              {hasVipPass && (
                <div className="flex items-center gap-2 text-xs text-orange-400 font-mono pt-1">
                  <Key className="w-3.5 h-3.5" />
                  Whop VIP Pass Active: 50% Gateway Fee Discount Applied
                </div>
              )}
            </div>

            {/* Card Information Form */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                3. Debit / Credit Card Information
              </label>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 9021 4532 8891"
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="ALEX THOMPSON"
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500/50 uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-black border border-white/10 rounded-xl px-2 py-2 text-white text-center outline-none focus:border-orange-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-black border border-white/10 rounded-xl px-2 py-2 text-white text-center outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Whop Key Option */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Key className="w-3 h-3 text-orange-400" />
                Whop API Key Override (Optional)
              </label>
              <input
                type="password"
                placeholder="whop_xxxxxxxxxxxxxxxxx (Leave empty to use active key)"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 outline-none focus:border-orange-500/50"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handleFund}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authorizing Whop Real-Time Settlement...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  Fund Card Now ({selectedCountry.symbol}{amount} {selectedCountry.currency})
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
