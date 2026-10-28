import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface InitialLoaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

const LOADING_STEPS = [
  "CONNECTING TO AFRIQUANTX LIQUIDITY NODES...",
  "AUTHENTICATING SECURE INSTITUTIONAL KEYWAYS...",
  "SYNCING MULTI-EXCHANGE ORDER BOOK ENGINE...",
  "INITIALIZING REAL-TIME FINANCIAL INTELLIGENCE...",
  "PLATFORM READY"
];

export function InitialLoader({ onLoaded, minDurationMs = 1800 }: InitialLoaderProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, minDurationMs / LOADING_STEPS.length);

    const timer = setTimeout(() => {
      if (onLoaded) {
        onLoaded();
      }
    }, minDurationMs);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [onLoaded, minDurationMs]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none"
    >
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Center content block */}
      <div className="relative z-10 flex flex-col items-center max-w-sm text-center">
        {/* Brand Logo & Name */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <img 
            src="/logo.svg" 
            alt="AfriQuantX Logo" 
            className="w-12 h-12 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
          />
          <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
            AfriQuantX
          </span>
        </motion.div>

        {/* Matrix Loader Element requested by user */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="my-6 py-2 px-6 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center justify-center"
        >
          <div className="loader" />
        </motion.div>

        {/* Dynamic Status Text */}
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25 }}
          className="mt-4"
        >
          <p className="text-[11px] font-mono tracking-widest text-zinc-400 font-medium uppercase min-h-[20px]">
            {LOADING_STEPS[stepIndex]}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: minDurationMs / 1000, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400 rounded-full"
          />
        </div>

        {/* Institutional tagline */}
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-8">
          Institutional Multi-Exchange Network
        </p>
      </div>
    </motion.div>
  );
}
