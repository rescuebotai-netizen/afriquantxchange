import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, ShieldCheck, CheckCircle2, AlertCircle, ScanFace, Lock, RefreshCw, X, KeyRound, Cpu } from 'lucide-react';
import { BiometricService, BiometricVerificationResult } from '../services/biometricService';

interface BiometricAuthModalProps {
  isOpen: boolean;
  actionTitle?: string;
  actionDescription?: string;
  amount?: string | number;
  currency?: string;
  onSuccess: (result: BiometricVerificationResult) => void;
  onCancel: () => void;
}

export function BiometricAuthModal({
  isOpen,
  actionTitle = 'Authorize Financial Operation',
  actionDescription = 'Verify your biometric identity using Face ID / Touch ID or FIDO2 Passkey to sign this transaction.',
  amount,
  currency = 'ZAR',
  onSuccess,
  onCancel
}: BiometricAuthModalProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<BiometricVerificationResult | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'biometric' | 'passkey'>('biometric');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage(null);
      setResultData(null);
      // Auto-start biometric challenge for seamless UX
      const timer = setTimeout(() => {
        handleScan();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleScan = async () => {
    setStatus('scanning');
    setErrorMessage(null);

    try {
      const res = await BiometricService.authenticate(actionTitle);
      if (res.success) {
        setStatus('success');
        setResultData(res);
        setTimeout(() => {
          onSuccess(res);
        }, 1100);
      } else {
        setStatus('failed');
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setStatus('failed');
      setErrorMessage(err.message || 'Biometric hardware challenge failed');
    }
  };

  const handleRegisterPasskey = async () => {
    try {
      setStatus('scanning');
      await BiometricService.registerCredential('Alex Investor', 'alex.investor@afriquantx.com');
      await handleScan();
    } catch (e: any) {
      setErrorMessage('Passkey enrollment failed: ' + e.message);
      setStatus('failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white text-center overflow-hidden"
      >
        {/* Subtle Gold Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FFFFFF]/10 blur-[60px] rounded-full pointer-events-none" />

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4 pt-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-[#FFFFFF] uppercase tracking-widest mb-3">
            <Lock className="w-3 h-3 text-[#FFFFFF]" />
            WebAuthn FIDO2 Level-3 Vault
          </div>
          <h3 className="text-lg md:text-xl font-black tracking-tight text-white uppercase">{actionTitle}</h3>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-sm mx-auto leading-relaxed">{actionDescription}</p>

          {/* Amount Badge if provided */}
          {amount && (
            <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono uppercase">Signing Amount</span>
              <span className="text-base font-mono font-extrabold text-[#FFFFFF]">
                {currency} {typeof amount === 'number' ? amount.toLocaleString() : amount}
              </span>
            </div>
          )}
        </div>

        {/* Biometric Sensor Scanner Visual */}
        <div className="my-6 flex justify-center relative z-10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Animated Ring */}
            {status === 'scanning' && (
              <div className="absolute inset-0 rounded-full border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] animate-spin" />
            )}
            {status === 'success' && (
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 bg-emerald-500/10 animate-pulse" />
            )}
            {status === 'failed' && (
              <div className="absolute inset-0 rounded-full border-2 border-rose-500 bg-rose-500/10" />
            )}

            <button
              onClick={handleScan}
              disabled={status === 'scanning' || status === 'success'}
              className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer ${
                status === 'scanning' ? 'bg-[#FFFFFF]/10 text-[#FFFFFF] border border-[#FFFFFF]/40 shadow-[0_0_25px_rgba(212,175,55,0.2)]' :
                status === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400 scale-105 shadow-[0_0_25px_rgba(16,185,129,0.3)]' :
                status === 'failed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500 hover:bg-rose-500/30' :
                'bg-white/5 text-zinc-400 border border-white/10 hover:border-[#FFFFFF]/50 hover:text-white'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              ) : status === 'failed' ? (
                <AlertCircle className="w-12 h-12 text-rose-400" />
              ) : status === 'scanning' ? (
                <ScanFace className="w-12 h-12 text-[#FFFFFF] animate-pulse" />
              ) : (
                <Fingerprint className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* Status Message */}
        <div className="min-h-[48px] flex flex-col items-center justify-center relative z-10">
          {status === 'scanning' && (
            <div className="text-xs font-mono text-[#FFFFFF] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Verifying Touch ID / Face ID sensor...
            </div>
          )}
          {status === 'success' && (
            <div className="space-y-1">
              <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Cryptographic Assertion Signed
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                Method: {resultData?.methodUsed} • Enclave Verified
              </p>
            </div>
          )}
          {status === 'failed' && (
            <p className="text-xs text-rose-400 font-mono">{errorMessage || 'Verification Failed. Tap sensor to retry.'}</p>
          )}
          {status === 'idle' && (
            <p className="text-xs text-zinc-400 font-mono">Tap sensor to authenticate with device biometrics</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2 relative z-10">
          {status === 'failed' && (
            <button
              onClick={handleScan}
              className="w-full py-3 bg-[#FFFFFF] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#E4E4E7] transition-colors"
            >
              Retry Biometric Scan
            </button>
          )}

          {status !== 'success' && (
            <button
              onClick={handleRegisterPasskey}
              className="w-full py-2 bg-white/5 border border-white/10 hover:border-white/20 text-zinc-300 font-mono text-[11px] uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#FFFFFF]" />
              Enroll / Sync Hardware Passkey
            </button>
          )}

          <button
            onClick={onCancel}
            className="w-full py-2.5 text-zinc-400 hover:text-white font-medium text-xs transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
          <Cpu className="w-3 h-3 text-emerald-400" />
          <span>FIDO2 / WebAuthn Platform Authenticator</span>
        </div>
      </motion.div>
    </div>
  );
}

