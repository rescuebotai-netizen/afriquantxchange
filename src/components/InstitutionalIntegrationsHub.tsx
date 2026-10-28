import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity, ArrowRightLeft, CheckCircle2, ChevronRight, Cpu, 
  ExternalLink, FileSpreadsheet, FileText, Globe, Key, Layers, 
  Lock, RefreshCw, Send, ShieldAlert, ShieldCheck, Sparkles, 
  TrendingUp, Wallet, Zap, Server, MessageSquare, Bell, Cloud, 
  Sliders, Play, Eye, Copy, Check, Download, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  InstitutionalIntegrationsService, 
  MarketVenueFeed, 
  CorrelationMatrixData 
} from '../services/institutionalIntegrationsService';

export function InstitutionalIntegrationsHub({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [activePillar, setActivePillar] = useState<'market' | 'alerts' | 'custody' | 'oms' | 'compliance' | 'membership'>('market');
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pillar 1: Market Feeds & Charting
  const [venues, setVenues] = useState<MarketVenueFeed[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>('JSE');
  const [correlationData, setCorrelationData] = useState<CorrelationMatrixData | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '1D'>('5m');
  const [chartIndicators, setChartIndicators] = useState<{ vwap: boolean; twap: boolean; bollinger: boolean; ema: boolean }>({
    vwap: true,
    twap: true,
    bollinger: false,
    ema: true
  });
  const [pineScriptCode, setPineScriptCode] = useState(`//@version=5
indicator("AQEI Momentum & Microstructure Alpha", overlay=true)
vwapVal = ta.vwap(close)
plot(vwapVal, "Institutional VWAP", color=color.purple, linewidth=2)
twapVal = ta.sma(close, 20)
plot(twapVal, "Execution TWAP", color=color.aqua, linewidth=1)
alertcondition(close > vwapVal, "AQEI_BULLISH_CONVERGENCE", "Price above VWAP collar")`);
  const [pineScriptStatus, setPineScriptStatus] = useState<string>('COMPILED_AND_ACTIVE');

  // Pillar 2: Alert Dispatch
  const [alertForm, setAlertForm] = useState({
    channel: 'telegram' as 'telegram' | 'discord' | 'slack' | 'twilio_sms' | 'twilio_whatsapp',
    alertType: 'AQEI_ALPHA_SIGNAL' as 'AQEI_ALPHA_SIGNAL' | 'LIQUIDATION_WARNING' | 'FIX_EXECUTION' | 'AUDIT_DIGEST',
    title: 'High-Conviction Alpha: Safaricom (NSE:SCOM) Convergence',
    message: 'AQEI Predictive Model detected +8.4% upside probability over 48h. Institutional depth surge on NSE order book.',
    priority: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    targetWebhookUrl: ''
  });
  const [dispatchResult, setDispatchResult] = useState<any>(null);
  const [dispatching, setDispatching] = useState(false);

  // Pillar 3: Custody & Sovereign Clearing
  const [settleForm, setSettleForm] = useState({
    provider: 'Fireblocks MPC' as 'Fireblocks MPC' | 'Copper ClearLoop' | 'BitGo Trust',
    rail: 'Strate CSD (South Africa)' as any,
    asset: 'ZAR' as any,
    amount: '15,000,000',
    counterparty: 'Standard Bank Securities Nominees',
    type: 'dvp_settlement' as any
  });
  const [settleResult, setSettleResult] = useState<any>(null);
  const [settling, setSettling] = useState(false);

  // Pillar 4: Direct Brokerage & FIX OMS / EMS
  const [omsForm, setOmsForm] = useState({
    symbol: 'JSE:SBK',
    side: 'BUY' as 'BUY' | 'SELL',
    quantity: 12500,
    algoType: 'TWAP' as 'TWAP' | 'VWAP' | 'Iceberg' | 'POV',
    urgency: 'NORMAL' as 'LOW' | 'NORMAL' | 'HIGH',
    maxSlippageBps: 15
  });
  const [omsResult, setOmsResult] = useState<any>(null);
  const [routingOrder, setRoutingOrder] = useState(false);

  // Pillar 5: Compliance & Cloud Sync
  const [screenForm, setScreenForm] = useState({
    entityName: 'Apex African Capital Partners Ltd',
    jurisdiction: 'South Africa / Mauritius',
    walletAddress: '0x71C63B7281D9c9a0998B4c6198F03Eb2601949b2',
    screeningEngine: 'All Integrated' as any
  });
  const [screenResult, setScreenResult] = useState<any>(null);
  const [screening, setScreening] = useState(false);

  const [cloudForm, setCloudForm] = useState({
    destination: 'google_drive' as 'google_drive' | 'onedrive' | 'aws_s3' | 'cloudflare_r2',
    documentTitle: 'AQEI-Q3-Institutional-Execution-and-Settlement-Audit',
    documentType: 'pdf' as any
  });
  const [cloudSyncResult, setCloudSyncResult] = useState<any>(null);
  const [cloudSyncing, setCloudSyncing] = useState(false);

  // Pillar 6: Membership & Entitlements
  const [licenseInput, setLicenseInput] = useState('WHOP-ENT-PRIME-2026-X948');
  const [membershipData, setMembershipData] = useState<any>(null);
  const [verifyingLicense, setVerifyingLicense] = useState(false);

  // Canvas ref for real-time chart
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch initial telemetry
  const refreshAll = async () => {
    setLoading(true);
    try {
      const [status, feeds] = await Promise.all([
        InstitutionalIntegrationsService.getStatus(),
        InstitutionalIntegrationsService.getMarketFeeds()
      ]);
      setTelemetry(status);
      setVenues(feeds.venues);
      setCorrelationData(feeds.correlationMatrix);
    } catch (e) {
      console.error('Error refreshing integrations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Draw interactive candlestick chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(1, '#05070c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 60; x < width; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }
    for (let y = 30; y < height - 30; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Mock candle data based on current venue
    const candleCount = 28;
    const candleWidth = (width - 60) / candleCount;
    let basePrice = selectedVenue === 'JSE' ? 3120 : selectedVenue === 'NGX' ? 650 : 16.85;
    const candles: any[] = [];
    let current = basePrice;

    for (let i = 0; i < candleCount; i++) {
      const delta = (Math.sin(i * 0.45) * 1.8 + (Math.random() - 0.48) * 2.2);
      const open = current;
      const close = current + delta;
      const high = Math.max(open, close) + Math.random() * 1.5;
      const low = Math.min(open, close) - Math.random() * 1.5;
      const volume = Math.floor(20000 + Math.random() * 80000);
      candles.push({ open, close, high, low, volume });
      current = close;
    }

    const minPrice = Math.min(...candles.map(c => c.low)) - 1;
    const maxPrice = Math.max(...candles.map(c => c.high)) + 1;
    const priceRange = maxPrice - minPrice || 1;

    const getY = (price: number) => {
      const usableHeight = height - 70;
      return usableHeight - ((price - minPrice) / priceRange) * usableHeight + 20;
    };

    // Draw volume bars at the bottom
    const maxVol = Math.max(...candles.map(c => c.volume));
    candles.forEach((c, i) => {
      const x = 30 + i * candleWidth;
      const vHeight = (c.volume / maxVol) * 35;
      ctx.fillStyle = c.close >= c.open ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(x + 2, height - 35 - vHeight, candleWidth - 4, vHeight);
    });

    // Draw Candlesticks
    candles.forEach((c, i) => {
      const x = 30 + i * candleWidth;
      const isUp = c.close >= c.open;
      const yOpen = getY(c.open);
      const yClose = getY(c.close);
      const yHigh = getY(c.high);
      const yLow = getY(c.low);

      // Wick
      ctx.strokeStyle = isUp ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, yHigh);
      ctx.lineTo(x + candleWidth / 2, yLow);
      ctx.stroke();

      // Body
      ctx.fillStyle = isUp ? '#22c55e' : '#ef4444';
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);
      ctx.fillRect(x + 2, bodyTop, candleWidth - 4, bodyHeight);
    });

    // Draw VWAP line if enabled
    if (chartIndicators.vwap) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = 30 + i * candleWidth + candleWidth / 2;
        const vwapVal = (c.open + c.close + c.high + c.low) / 4;
        const y = getY(vwapVal);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw TWAP line if enabled
    if (chartIndicators.twap) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = 30 + i * candleWidth + candleWidth / 2;
        const twapVal = (c.open + c.close) / 2;
        const y = getY(twapVal);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw EMA 20 if enabled
    if (chartIndicators.ema) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = 30 + i * candleWidth + candleWidth / 2;
        const emaVal = c.close * 0.998;
        const y = getY(emaVal);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Price axis labels on right side
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    for (let p = minPrice; p <= maxPrice; p += priceRange / 4) {
      ctx.fillText(p.toFixed(2), width - 8, getY(p) + 3);
    }
  }, [selectedVenue, chartTimeframe, chartIndicators]);

  // Handle alert dispatch test
  const handleDispatchAlert = async () => {
    setDispatching(true);
    setDispatchResult(null);
    try {
      const res = await InstitutionalIntegrationsService.dispatchAlert(alertForm);
      setDispatchResult(res);
      refreshAll();
    } catch (e) {
      console.error(e);
    } finally {
      setDispatching(false);
    }
  };

  // Handle custody settlement execution
  const handleSettle = async () => {
    setSettling(true);
    setSettleResult(null);
    try {
      const res = await InstitutionalIntegrationsService.executeCustodySettlement(settleForm);
      setSettleResult(res);
      refreshAll();
    } catch (e) {
      console.error(e);
    } finally {
      setSettling(false);
    }
  };

  // Handle OMS order routing
  const handleRouteOrder = async () => {
    setRoutingOrder(true);
    setOmsResult(null);
    try {
      const res = await InstitutionalIntegrationsService.executeOmsOrder(omsForm);
      setOmsResult(res);
      refreshAll();
    } catch (e) {
      console.error(e);
    } finally {
      setRoutingOrder(false);
    }
  };

  // Handle compliance check
  const handleScreenCompliance = async () => {
    setScreening(true);
    setScreenResult(null);
    try {
      const res = await InstitutionalIntegrationsService.screenCompliance(screenForm);
      setScreenResult(res);
      refreshAll();
    } catch (e) {
      console.error(e);
    } finally {
      setScreening(false);
    }
  };

  // Handle cloud sync
  const handleCloudSync = async () => {
    setCloudSyncing(true);
    setCloudSyncResult(null);
    try {
      const res = await InstitutionalIntegrationsService.syncReportToCloud(cloudForm);
      setCloudSyncResult(res);
      refreshAll();
    } catch (e) {
      console.error(e);
    } finally {
      setCloudSyncing(false);
    }
  };

  // Handle membership license verify
  const handleVerifyLicense = async () => {
    setVerifyingLicense(true);
    try {
      const res = await InstitutionalIntegrationsService.verifyMembership({ licenseKey: licenseInput });
      setMembershipData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingLicense(false);
    }
  };

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentVenueData = venues.find(v => v.code === selectedVenue) || venues[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Institutional Header & Status Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Institutional Integrations Hub
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs">
                  6/6 PROTOCOLS ACTIVE
                </Badge>
              </h1>
              <p className="text-xs text-zinc-400">
                FIX 4.4 Engine • TradingView Telemetry • Telegram/Discord Webhooks • Fireblocks MPC • Pan-African Clearing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs text-zinc-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Uptime: <strong className="text-white">{telemetry?.uptime || '99.99%'}</strong>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs text-zinc-300 font-mono">
            Throughput: <strong className="text-cyan-400">18,450 msgs/s</strong>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshAll} 
            disabled={loading} 
            className="border-white/10 hover:bg-white/5 text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* 6 Pillars Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <button
          onClick={() => setActivePillar('market')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activePillar === 'market' 
              ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
              : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-1.5 text-blue-400" />
          <span className="text-xs font-semibold">1. Market Feeds</span>
          <span className="text-[10px] text-zinc-500">TradingView & L2/L3</span>
        </button>

        <button
          onClick={() => setActivePillar('alerts')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activePillar === 'alerts' 
              ? 'bg-purple-600/15 border-purple-500 text-white shadow-lg shadow-purple-500/10' 
              : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bell className="w-5 h-5 mb-1.5 text-purple-400" />
          <span className="text-xs font-semibold">2. Multi-Alerts</span>
          <span className="text-[10px] text-zinc-500">Telegram / Discord</span>
        </button>

        <button
          onClick={() => setActivePillar('custody')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activePillar === 'custody' 
              ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' 
              : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wallet className="w-5 h-5 mb-1.5 text-emerald-400" />
          <span className="text-xs font-semibold">3. Custody & Rails</span>
          <span className="text-[10px] text-zinc-500">Fireblocks & M-Pesa</span>
        </button>

        <button
          onClick={() => setActivePillar('oms')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activePillar === 'oms' 
              ? 'bg-amber-600/15 border-amber-500 text-white shadow-lg shadow-amber-500/10' 
              : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cpu className="w-5 h-5 mb-1.5 text-amber-400" />
          <span className="text-xs font-semibold">4. Brokerage & OMS</span>
          <span className="text-[10px] text-zinc-500">FIX 4.4 & SOR Algo</span>
        </button>

        <button
          onClick={() => setActivePillar('compliance')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activePillar === 'compliance' 
              ? 'bg-cyan-600/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10' 
              : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-1.5 text-cyan-400" />
          <span className="text-xs font-semibold">5. Compliance & Sync</span>
          <span className="text-[10px] text-zinc-500">KYT & Cloud Vault</span>
        </button>

        <button
          onClick={() => setActivePillar('membership')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
            activePillar === 'membership' 
              ? 'bg-orange-600/15 border-orange-500 text-white shadow-lg shadow-orange-500/10' 
              : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Key className="w-5 h-5 mb-1.5 text-orange-400" />
          <span className="text-xs font-semibold">6. Membership</span>
          <span className="text-[10px] text-zinc-500">Whop v5 & Stripe</span>
        </button>
      </div>

      {/* PILLAR 1: MARKET DATA FEEDS & TRADINGVIEW CHARTING */}
      {activePillar === 'market' && (
        <div className="space-y-6">
          {/* Regional Venue Gateways Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {venues.map(v => (
              <div
                key={v.code}
                onClick={() => setSelectedVenue(v.code)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedVenue === v.code
                    ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-zinc-900/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{v.code}</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {v.latencyMs}ms
                  </Badge>
                </div>
                <div className="text-xs text-zinc-400 truncate">{v.name}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <span className="text-xs font-mono text-zinc-300">{v.activeTicker}</span>
                  <span className={`text-xs font-mono font-semibold ${v.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {v.changePct >= 0 ? '+' : ''}{v.changePct}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive TradingView & Depth Viewport */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-zinc-900/50 border-white/10 overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <span>{currentVenueData?.activeTicker || 'JSE:NPN'}</span>
                      <span className="text-xs font-normal text-zinc-400">({currentVenueData?.assetName})</span>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                        TradingView Canvas Engine
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Sub-second tick stream • {currentVenueData?.currency} {currentVenueData?.last?.toLocaleString()} • Vol: {currentVenueData?.volume}
                    </CardDescription>
                  </div>

                  {/* Timeframe & Indicator Controls */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['1m', '5m', '15m', '1h', '1D'] as const).map(tf => (
                      <button
                        key={tf}
                        onClick={() => setChartTimeframe(tf)}
                        className={`px-2 py-1 text-xs rounded font-mono ${
                          chartTimeframe === tf 
                            ? 'bg-blue-600 text-white font-semibold' 
                            : 'bg-black/40 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                    <div className="h-4 w-px bg-white/10 mx-1" />
                    <button
                      onClick={() => setChartIndicators(prev => ({ ...prev, vwap: !prev.vwap }))}
                      className={`px-2 py-1 text-xs rounded font-mono border ${
                        chartIndicators.vwap 
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300' 
                          : 'border-white/10 text-zinc-500'
                      }`}
                    >
                      VWAP
                    </button>
                    <button
                      onClick={() => setChartIndicators(prev => ({ ...prev, twap: !prev.twap }))}
                      className={`px-2 py-1 text-xs rounded font-mono border ${
                        chartIndicators.twap 
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' 
                          : 'border-white/10 text-zinc-500'
                      }`}
                    >
                      TWAP
                    </button>
                    <button
                      onClick={() => setChartIndicators(prev => ({ ...prev, ema: !prev.ema }))}
                      className={`px-2 py-1 text-xs rounded font-mono border ${
                        chartIndicators.ema 
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300' 
                          : 'border-white/10 text-zinc-500'
                      }`}
                    >
                      EMA
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                <canvas 
                  ref={canvasRef} 
                  width={720} 
                  height={340} 
                  className="w-full h-[340px] block"
                />
                <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-0.5 bg-purple-500 inline-block" /> VWAP: {(currentVenueData?.last * 0.9992).toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> TWAP: {(currentVenueData?.last * 0.9985).toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> EMA(20): {(currentVenueData?.last * 0.9978).toFixed(2)}
                    </span>
                  </div>
                  <span className="font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE FIX TICK: 0.00% Packet Loss
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Sub-Second Order Book Depth (L2/L3) */}
            <Card className="bg-zinc-900/50 border-white/10 flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    L2/L3 Order Book Depth
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-mono text-zinc-400 border-white/10">
                    Spread: {((currentVenueData?.ask || 1) - (currentVenueData?.bid || 1)).toFixed(2)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-3 flex-1">
                {/* Asks (Sell Depth) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-mono mb-1">
                    <span>Ask Price</span>
                    <span>Size</span>
                    <span>Total</span>
                  </div>
                  {currentVenueData?.depthL2?.filter(d => d.side === 'ask').map((lvl, idx) => (
                    <div key={`ask-${idx}`} className="relative flex justify-between text-xs font-mono py-0.5 px-1 rounded overflow-hidden">
                      <div 
                        className="absolute right-0 top-0 bottom-0 bg-rose-500/15" 
                        style={{ width: `${Math.min(100, (lvl.size / 6400) * 100)}%` }} 
                      />
                      <span className="relative z-10 text-rose-400 font-semibold">{lvl.price.toFixed(2)}</span>
                      <span className="relative z-10 text-zinc-300">{lvl.size.toLocaleString()}</span>
                      <span className="relative z-10 text-zinc-400">{lvl.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="py-1 px-3 bg-zinc-800/60 rounded flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">MID MARKET</span>
                  <span className="text-white font-bold">{(((currentVenueData?.bid || 0) + (currentVenueData?.ask || 0)) / 2).toFixed(2)}</span>
                  <span className="text-emerald-400 text-[10px]">CONNECTED</span>
                </div>

                {/* Bids (Buy Depth) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-mono mb-1">
                    <span>Bid Price</span>
                    <span>Size</span>
                    <span>Total</span>
                  </div>
                  {currentVenueData?.depthL2?.filter(d => d.side === 'bid').map((lvl, idx) => (
                    <div key={`bid-${idx}`} className="relative flex justify-between text-xs font-mono py-0.5 px-1 rounded overflow-hidden">
                      <div 
                        className="absolute right-0 top-0 bottom-0 bg-emerald-500/15" 
                        style={{ width: `${Math.min(100, (lvl.size / 6400) * 100)}%` }} 
                      />
                      <span className="relative z-10 text-emerald-400 font-semibold">{lvl.price.toFixed(2)}</span>
                      <span className="relative z-10 text-zinc-300">{lvl.size.toLocaleString()}</span>
                      <span className="relative z-10 text-zinc-400">{lvl.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Pine Script Studio & Multi-Asset Correlation Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custom Pine Script Studio */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-400" />
                      Custom Pine Script IDE & Algorithm Hooks
                    </CardTitle>
                    <CardDescription>Compile proprietary indicators and order book alpha models</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-purple-400 bg-purple-500/10 border-purple-500/30 text-[10px] font-mono">
                    {pineScriptStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <textarea
                  value={pineScriptCode}
                  onChange={e => setPineScriptCode(e.target.value)}
                  className="w-full h-40 bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500 leading-relaxed"
                  spellCheck={false}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    Built-in functions: <code className="text-purple-300">ta.vwap()</code>, <code className="text-purple-300">ta.rsi()</code>, <code className="text-purple-300">ta.twap()</code>
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setPineScriptStatus('COMPILING...');
                      setTimeout(() => setPineScriptStatus('COMPILED_AND_ACTIVE'), 600);
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs"
                  >
                    <Play className="w-3.5 h-3.5 mr-1" /> Compile & Plot Overlay
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Asset Correlation Heatmap */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Pan-African Multi-Asset Correlation Matrix
                </CardTitle>
                <CardDescription>Rolling 30-day Pearson correlation across African venues and FX rates</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 overflow-x-auto">
                {correlationData && (
                  <table className="w-full text-center text-xs font-mono">
                    <thead>
                      <tr>
                        <th className="p-1.5 text-left text-zinc-500">Asset</th>
                        {correlationData.assets.map(a => (
                          <th key={a} className="p-1.5 text-zinc-400 text-[10px]">{a.split(':')[1] || a}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {correlationData.assets.map((asset, rowIdx) => (
                        <tr key={asset} className="border-t border-white/5">
                          <td className="p-1.5 text-left text-zinc-300 font-semibold">{asset.split(':')[1] || asset}</td>
                          {correlationData.matrix[rowIdx].map((val, colIdx) => {
                            let cellBg = 'rgba(255, 255, 255, 0.05)';
                            let textCol = '#94a3b8';
                            if (val > 0.5) {
                              cellBg = 'rgba(34, 197, 94, 0.25)';
                              textCol = '#4ade80';
                            } else if (val > 0.2) {
                              cellBg = 'rgba(34, 197, 94, 0.12)';
                              textCol = '#86efac';
                            } else if (val < -0.4) {
                              cellBg = 'rgba(239, 68, 68, 0.25)';
                              textCol = '#f87171';
                            } else if (val < -0.1) {
                              cellBg = 'rgba(239, 68, 68, 0.12)';
                              textCol = '#fca5a5';
                            }
                            return (
                              <td 
                                key={`${rowIdx}-${colIdx}`} 
                                className="p-1.5 rounded"
                                style={{ backgroundColor: cellBg, color: textCol }}
                              >
                                {val.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* PILLAR 2: MULTI-CHANNEL ALERTING & SIGNAL DISPATCH */}
      {activePillar === 'alerts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Telegram Channel */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-sky-400" /> Telegram Bot API
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    ONLINE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Bot: <span className="text-white font-mono">@AQEITerminalBot</span></div>
                <div>Target Chat: <span className="text-zinc-300 font-mono">-1002491829</span></div>
                <div className="text-[11px] text-zinc-500">Instant trade fills & high-conviction alpha signals.</div>
              </CardContent>
            </Card>

            {/* Discord Webhook */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Discord Webhook
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    CONNECTED
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Channel: <span className="text-white font-mono">#alpha-signals</span></div>
                <div>Format: <span className="text-zinc-300">Rich Embed Cards</span></div>
                <div className="text-[11px] text-zinc-500">Desk alerts & order execution telemetry.</div>
              </CardContent>
            </Card>

            {/* Slack Enterprise */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" /> Slack Enterprise
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    SYNCED
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Workspace: <span className="text-white">AQX-Enterprise</span></div>
                <div>Channel: <span className="text-zinc-300 font-mono">#trading-desk-ops</span></div>
                <div className="text-[11px] text-zinc-500">VaR breaches & institutional audit reports.</div>
              </CardContent>
            </Card>

            {/* Twilio SMS / WhatsApp */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-rose-400" /> Twilio WhatsApp / SMS
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    READY
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Number: <span className="text-white font-mono">+1 (555) 019-8234</span></div>
                <div>Priority: <span className="text-zinc-300">High-Slippage & Margin</span></div>
                <div className="text-[11px] text-zinc-500">Multi-sig settlement OTPs & priority margin warnings.</div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Dispatch Test Bench */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Send className="w-5 h-5 text-purple-400" />
                  Dispatch Test Bench (Live Gateway Trigger)
                </CardTitle>
                <CardDescription>
                  Route an instant signal or alert payload through configured webhook dispatchers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Destination Gateway</Label>
                    <select
                      value={alertForm.channel}
                      onChange={e => setAlertForm({ ...alertForm, channel: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="telegram">Telegram Bot API</option>
                      <option value="discord">Discord Webhook</option>
                      <option value="slack">Slack Enterprise Grid</option>
                      <option value="twilio_whatsapp">Twilio WhatsApp Business</option>
                      <option value="twilio_sms">Twilio Priority SMS</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Alert Classification</Label>
                    <select
                      value={alertForm.alertType}
                      onChange={e => setAlertForm({ ...alertForm, alertType: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="AQEI_ALPHA_SIGNAL">AQEI Alpha Signal</option>
                      <option value="LIQUIDATION_WARNING">Liquidation / VaR Warning</option>
                      <option value="FIX_EXECUTION">FIX 4.4 Trade Fill</option>
                      <option value="AUDIT_DIGEST">Scheduled Daily Audit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Alert Title / Subject</Label>
                  <Input
                    value={alertForm.title}
                    onChange={e => setAlertForm({ ...alertForm, title: e.target.value })}
                    className="bg-black/50 border-white/10 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Signal Message Payload</Label>
                  <textarea
                    value={alertForm.message}
                    onChange={e => setAlertForm({ ...alertForm, message: e.target.value })}
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Optional Custom Webhook URL (Discord/Slack)</Label>
                  <Input
                    placeholder="https://discord.com/api/webhooks/... or https://hooks.slack.com/..."
                    value={alertForm.targetWebhookUrl}
                    onChange={e => setAlertForm({ ...alertForm, targetWebhookUrl: e.target.value })}
                    className="bg-black/50 border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <Button
                  onClick={handleDispatchAlert}
                  disabled={dispatching}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                >
                  <Send className={`w-4 h-4 mr-2 ${dispatching ? 'animate-pulse' : ''}`} />
                  {dispatching ? 'Dispatching via Gateway...' : 'Dispatch Signal Now'}
                </Button>
              </CardContent>
            </Card>

            {/* Live Dispatch Receipt & Audit Trail */}
            <Card className="bg-zinc-900/50 border-white/10 flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Dispatch Verification & Proof
                </CardTitle>
                <CardDescription>Zero-friction delivery telemetry with cryptographic SHA-256 receipt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {dispatchResult ? (
                  <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Delivered (HTTP 200 OK)
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                        {dispatchResult.latencyMs} ms Latency
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                      <div>Dispatch ID: <strong className="text-white font-mono">{dispatchResult.dispatchId}</strong></div>
                      <div>Channel: <strong className="text-white capitalize">{dispatchResult.channel}</strong></div>
                      <div>Type: <strong className="text-zinc-200">{dispatchResult.alertType}</strong></div>
                      <div>Proof: <strong className="text-zinc-400 font-mono text-[10px]">{dispatchResult.deliveryProof}</strong></div>
                    </div>
                    <p className="text-xs text-zinc-400 border-t border-white/10 pt-2">
                      Payload successfully serialized and pushed to remote channel socket.
                    </p>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-black/30 border border-dashed border-white/10 text-center text-zinc-500 space-y-2">
                    <Send className="w-8 h-8 mx-auto text-zinc-600" />
                    <p className="text-xs">No dispatch triggered yet this session.</p>
                    <p className="text-[11px] text-zinc-600">Click "Dispatch Signal Now" to send an institutional test payload.</p>
                  </div>
                )}

                {/* Recent Dispatches Ledger */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-300">Live Telemetry Queue</div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(telemetry?.auditLogs || []).filter((l: any) => l.category.includes('Alert')).slice(0, 4).map((log: any) => (
                      <div key={log.id} className="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="text-white font-mono text-[11px]">{log.id}</span>
                          <span className="text-zinc-400 text-[11px] ml-2 truncate">{log.payloadSummary}</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {log.latencyMs}ms
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* PILLAR 3: INSTITUTIONAL CUSTODY & SOVEREIGN CLEARING */}
      {activePillar === 'custody' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fireblocks MPC */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Fireblocks MPC Vault
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    QUORUM 3/4
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Type: <span className="text-white">Multi-Party Computation (MPC-CMP)</span></div>
                <div>Status: <span className="text-zinc-200">Warm/Cold Tiered Security</span></div>
                <div className="text-[11px] text-zinc-500">Programmatic API settlement for institutional digital collateral.</div>
              </CardContent>
            </Card>

            {/* Strate & NIBSS Sovereign Rails */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" /> Strate & NIBSS Clearing
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    RTGS / DvP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Venues: <span className="text-white">JSE (ZAR) & NGX (NGN) CSD</span></div>
                <div>Mode: <span className="text-zinc-200">Delivery vs Payment (DvP T+0)</span></div>
                <div className="text-[11px] text-zinc-500">Direct sovereign central securities depository matching.</div>
              </CardContent>
            </Card>

            {/* Pan-African Sovereign Rails */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-amber-400" /> M-Pesa & Paystack Rails
                  </CardTitle>
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    INSTANT FIAT
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Rail: <span className="text-white">Daraja 2.0 (KES) & Paystack (NGN)</span></div>
                <div>Coverage: <span className="text-zinc-200">KES, NGN, ZAR, EGP, USD</span></div>
                <div className="text-[11px] text-zinc-500">Frictionless deposits and automated treasury sweeps.</div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Settlement & DvP Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
                  Programmatic Settlement & Clearing Engine
                </CardTitle>
                <CardDescription>
                  Trigger institutional DvP clearing, treasury rebalancing, or MPC collateral movement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Custody Provider</Label>
                    <select
                      value={settleForm.provider}
                      onChange={e => setSettleForm({ ...settleForm, provider: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Fireblocks MPC">Fireblocks MPC Vault</option>
                      <option value="Copper ClearLoop">Copper ClearLoop</option>
                      <option value="BitGo Trust">BitGo Qualified Custody</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Clearing Rail</Label>
                    <select
                      value={settleForm.rail}
                      onChange={e => setSettleForm({ ...settleForm, rail: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Strate CSD (South Africa)">Strate CSD (South Africa - ZAR)</option>
                      <option value="NIBSS (Nigeria)">NIBSS (Nigeria - NGN)</option>
                      <option value="M-Pesa Daraja (Kenya)">M-Pesa Daraja 2.0 (Kenya - KES)</option>
                      <option value="Paystack Instant">Paystack Commercial Rail</option>
                      <option value="Flutterwave">Flutterwave Multi-Sovereign</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Asset / Currency</Label>
                    <select
                      value={settleForm.asset}
                      onChange={e => setSettleForm({ ...settleForm, asset: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="ZAR">ZAR (South African Rand)</option>
                      <option value="NGN">NGN (Nigerian Naira)</option>
                      <option value="KES">KES (Kenyan Shilling)</option>
                      <option value="EGP">EGP (Egyptian Pound)</option>
                      <option value="USDC">USDC (Institutional Settlement)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Settlement Amount</Label>
                    <Input
                      value={settleForm.amount}
                      onChange={e => setSettleForm({ ...settleForm, amount: e.target.value })}
                      className="bg-black/50 border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Counterparty Institution</Label>
                  <Input
                    value={settleForm.counterparty}
                    onChange={e => setSettleForm({ ...settleForm, counterparty: e.target.value })}
                    className="bg-black/50 border-white/10 text-white text-xs"
                  />
                </div>

                <Button
                  onClick={handleSettle}
                  disabled={settling}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                >
                  <ShieldCheck className={`w-4 h-4 mr-2 ${settling ? 'animate-spin' : ''}`} />
                  {settling ? 'Executing DvP Match via CSD...' : 'Execute Settlement & Clear Funds'}
                </Button>
              </CardContent>
            </Card>

            {/* Settlement Verification Ticket */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  CSD Settlement Verification Ticket
                </CardTitle>
                <CardDescription>Immutable custody receipt and cryptographic quorum proof</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settleResult ? (
                  <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold text-sm">
                        STATUS: {settleResult.state}
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                        CSD MATCHED
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                      <div>Settlement ID: <strong className="text-white font-mono">{settleResult.settlementId}</strong></div>
                      <div>Rail: <strong className="text-white">{settleResult.rail}</strong></div>
                      <div>Amount: <strong className="text-emerald-300 font-mono">{settleResult.amount} {settleResult.asset}</strong></div>
                      <div>CSD Proof: <strong className="text-zinc-400 font-mono text-[10px]">{settleResult.csdMatchingProof}</strong></div>
                    </div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/5 text-[11px] text-zinc-300 space-y-1">
                      <div>Quorum: <span className="text-emerald-400">{settleResult.mpcSignatureQuorum}</span></div>
                      <div>Counterparty: {settleResult.counterparty}</div>
                      <div>Cleared Timestamp: <span className="font-mono text-zinc-400">{settleResult.clearedAt}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-black/30 border border-dashed border-white/10 text-center text-zinc-500 space-y-2">
                    <Wallet className="w-8 h-8 mx-auto text-zinc-600" />
                    <p className="text-xs">No active settlement transaction in progress.</p>
                    <p className="text-[11px] text-zinc-600">Select parameters and click "Execute Settlement" to initiate.</p>
                  </div>
                )}

                {/* Non-Custodial Connectors */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="text-xs font-semibold text-zinc-300">Non-Custodial Web3 Connectors</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs border-white/10 text-zinc-300 hover:text-white">
                      <Zap className="w-3.5 h-3.5 mr-1 text-cyan-400" /> WalletConnect v2
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-white/10 text-zinc-300 hover:text-white">
                      <Key className="w-3.5 h-3.5 mr-1 text-purple-400" /> Turnkey Embedded MPC
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-white/10 text-zinc-300 hover:text-white">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Coinbase SDK
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* PILLAR 4: DIRECT BROKERAGE & OMS / EMS EXECUTION */}
      {activePillar === 'oms' && (
        <div className="space-y-6">
          {/* QuickFIX Engine Telemetry Banner */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  QuickFIX/J Engine Session: LOGGED_ON
                  <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    FIX 4.4 / 5.0 SP2
                  </Badge>
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  SenderCompID: AQX_TERMINAL_01 • TargetCompID: PRIME_BROKER_JSE • Heartbeat: 30s
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
              <div>Inbound Seq: <span className="text-amber-400 font-bold">48,921</span></div>
              <div className="text-zinc-600">|</div>
              <div>Outbound Seq: <span className="text-amber-400 font-bold">48,922</span></div>
            </div>
          </div>

          {/* FIX Tag Inspector & SOR Order Dispatch */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Play className="w-5 h-5 text-amber-400" />
                  Smart Order Router (SOR) Algorithmic Dispatch
                </CardTitle>
                <CardDescription>
                  One-click execution into regional prime brokers with sub-millisecond SOR child order slicing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Symbol / ISIN</Label>
                    <select
                      value={omsForm.symbol}
                      onChange={e => setOmsForm({ ...omsForm, symbol: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                    >
                      <option value="JSE:SBK">JSE:SBK (Standard Bank Group)</option>
                      <option value="JSE:NPN">JSE:NPN (Naspers Ltd)</option>
                      <option value="NGX:DANGCEM">NGX:DANGCEM (Dangote Cement)</option>
                      <option value="NSE:SCOM">NSE:SCOM (Safaricom Kenya)</option>
                      <option value="EGX:COMI">EGX:COMI (Commercial Intl Bank)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Order Side</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setOmsForm({ ...omsForm, side: 'BUY' })}
                        className={`text-xs ${omsForm.side === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-black/40 text-zinc-400'}`}
                      >
                        BUY (Side=1)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setOmsForm({ ...omsForm, side: 'SELL' })}
                        className={`text-xs ${omsForm.side === 'SELL' ? 'bg-rose-600 text-white' : 'bg-black/40 text-zinc-400'}`}
                      >
                        SELL (Side=2)
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Quantity (Shares)</Label>
                    <Input
                      type="number"
                      value={omsForm.quantity}
                      onChange={e => setOmsForm({ ...omsForm, quantity: Number(e.target.value) })}
                      className="bg-black/50 border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Algorithmic Strategy</Label>
                    <select
                      value={omsForm.algoType}
                      onChange={e => setOmsForm({ ...omsForm, algoType: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="TWAP">TWAP (Time-Weighted Slices)</option>
                      <option value="VWAP">VWAP (Volume Benchmark)</option>
                      <option value="Iceberg">Iceberg (Hidden Depth Slice)</option>
                      <option value="POV">POV (Percentage of Volume)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Execution Urgency</Label>
                    <select
                      value={omsForm.urgency}
                      onChange={e => setOmsForm({ ...omsForm, urgency: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="LOW">Passive / Low Slippage</option>
                      <option value="NORMAL">Normal Market Pace</option>
                      <option value="HIGH">Aggressive Immediate Fill</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Max Slippage Collar (bps)</Label>
                    <Input
                      type="number"
                      value={omsForm.maxSlippageBps}
                      onChange={e => setOmsForm({ ...omsForm, maxSlippageBps: Number(e.target.value) })}
                      className="bg-black/50 border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleRouteOrder}
                  disabled={routingOrder}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold"
                >
                  <Cpu className={`w-4 h-4 mr-2 ${routingOrder ? 'animate-spin' : ''}`} />
                  {routingOrder ? 'Routing via FIX SOR Gateways...' : 'Execute Parent Order via SOR'}
                </Button>
              </CardContent>
            </Card>

            {/* Execution Report & Child Slices */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  Execution Report (Tag 35=8) & Fill Slices
                </CardTitle>
                <CardDescription>Sub-millisecond venue routing and price improvement telemetry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {omsResult ? (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-xs font-mono">
                          ClOrdID: {omsResult.clOrdId}
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                          {omsResult.status} ({omsResult.executionLatencyMs}ms)
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        <div>Avg Fill: <strong className="text-white">{omsResult.avgFillPrice}</strong></div>
                        <div>VWAP: <strong className="text-zinc-300">{omsResult.benchmarkVwap}</strong></div>
                        <div>Price Imp: <strong className="text-emerald-400">+{omsResult.slippageSavedBps} bps</strong></div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-zinc-300">SOR Venue Slices:</div>
                      {omsResult.slices.map((slice: any, idx: number) => (
                        <div key={idx} className="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="text-white font-semibold">{slice.venue}</span>
                            <span className="text-zinc-400 ml-2">({slice.shares.toLocaleString()} shares)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-300">@{slice.fillPrice.toFixed(2)}</span>
                            <Badge variant="outline" className="text-[9px] border-white/10 text-cyan-400">
                              {slice.latencyMs}ms
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded bg-black/50 border border-white/5 text-[11px] font-mono text-zinc-400 space-y-0.5">
                      <div className="text-zinc-500 uppercase text-[9px] mb-1">FIX Tags Verified</div>
                      <div>Tag 35=8 | Tag 39=2 (Filled) | Tag 55={omsResult.symbol} | Tag 54={omsResult.side === 'BUY' ? '1' : '2'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-black/30 border border-dashed border-white/10 text-center text-zinc-500 space-y-2">
                    <Cpu className="w-8 h-8 mx-auto text-zinc-600" />
                    <p className="text-xs">No active execution dispatch.</p>
                    <p className="text-[11px] text-zinc-600">Select symbol and algo strategy to trigger execution.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* PILLAR 5: AUTOMATED ACCOUNTING, TAX & COMPLIANCE */}
      {activePillar === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tax & Portfolio Accounting */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Tax & Ledger Connectors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Sync: <span className="text-white">CoinTracker, QuickBooks, Xero, Sage</span></div>
                <div>Standards: <span className="text-zinc-200">IFRS / GAAP / SARS / FIRS / KRA</span></div>
                <div className="text-[11px] text-zinc-500">Instant journal entry exports and capital gain schedules.</div>
              </CardContent>
            </Card>

            {/* KYC / AML & Sanctions */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> KYC / AML & KYT Engines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Providers: <span className="text-white">Sumsub, Persona, Chainalysis KYT</span></div>
                <div>Checks: <span className="text-zinc-200">Sanctions, PEP, Wallet Taint Risk</span></div>
                <div className="text-[11px] text-zinc-500">Real-time risk scoring cleared in seconds.</div>
              </CardContent>
            </Card>

            {/* Cloud Storage Data Room */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-400" /> Cloud Storage Sync
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400">
                <div>Destinations: <span className="text-white">Google Drive, OneDrive, AWS S3</span></div>
                <div>Integrity: <span className="text-zinc-200">SHA-256 Tamper-Proof Stamp</span></div>
                <div className="text-[11px] text-zinc-500">1-click auto-archiving of generated audit reports.</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live KYC / AML & Sanctions Screener */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  Instant Sanctions & Chainalysis KYT Screener
                </CardTitle>
                <CardDescription>
                  Verify entities, counterparties, and settlement wallets against international watchlists
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Entity or Counterparty Name</Label>
                  <Input
                    value={screenForm.entityName}
                    onChange={e => setScreenForm({ ...screenForm, entityName: e.target.value })}
                    className="bg-black/50 border-white/10 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Operating Jurisdiction</Label>
                    <Input
                      value={screenForm.jurisdiction}
                      onChange={e => setScreenForm({ ...screenForm, jurisdiction: e.target.value })}
                      className="bg-black/50 border-white/10 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Screening Engine</Label>
                    <select
                      value={screenForm.screeningEngine}
                      onChange={e => setScreenForm({ ...screenForm, screeningEngine: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="All Integrated">Sumsub + Chainalysis Combined</option>
                      <option value="Chainalysis KYT">Chainalysis KYT Only</option>
                      <option value="Sumsub FastTrack">Sumsub FastTrack</option>
                      <option value="Persona Identity">Persona Identity</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Settlement Wallet / Account ID (Optional)</Label>
                  <Input
                    value={screenForm.walletAddress}
                    onChange={e => setScreenForm({ ...screenForm, walletAddress: e.target.value })}
                    className="bg-black/50 border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <Button
                  onClick={handleScreenCompliance}
                  disabled={screening}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                >
                  <ShieldCheck className={`w-4 h-4 mr-2 ${screening ? 'animate-spin' : ''}`} />
                  {screening ? 'Screening against OFAC & KYT...' : 'Run Sanctions & AML Screening'}
                </Button>

                {screenResult && (
                  <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold">STATUS: {screenResult.overallStatus}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                        Risk Score: {screenResult.kytRiskScore}/100 (LOW)
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-zinc-300">
                      <div>PEP Exposure: <strong className="text-emerald-400">{screenResult.pepExposure}</strong></div>
                      <div>Sanctions Matches: <strong className="text-emerald-400">{screenResult.sanctionsMatches}</strong></div>
                      <div>Cert Hash: <strong className="text-zinc-400 font-mono text-[10px]">{screenResult.certificateHash}</strong></div>
                      <div>Compliance: <strong className="text-white text-[10px]">{screenResult.fiatAmlStatus}</strong></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cloud Storage Auto-Sync Console */}
            <Card className="bg-zinc-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-400" />
                  Cloud Storage Data Room Sync
                </CardTitle>
                <CardDescription>
                  1-click archiving of generated financial intelligence reports to Google Drive or AWS S3
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Document Title</Label>
                  <Input
                    value={cloudForm.documentTitle}
                    onChange={e => setCloudForm({ ...cloudForm, documentTitle: e.target.value })}
                    className="bg-black/50 border-white/10 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Cloud Destination</Label>
                    <select
                      value={cloudForm.destination}
                      onChange={e => setCloudForm({ ...cloudForm, destination: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="google_drive">Google Drive Enterprise</option>
                      <option value="onedrive">Microsoft OneDrive Vault</option>
                      <option value="aws_s3">AWS S3 Immutable Bucket</option>
                      <option value="cloudflare_r2">Cloudflare R2 Data Room</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-300">Format</Label>
                    <select
                      value={cloudForm.documentType}
                      onChange={e => setCloudForm({ ...cloudForm, documentType: e.target.value as any })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="pdf">PDF (Audited Vector)</option>
                      <option value="xlsx">Excel (XLSX Ledger)</option>
                      <option value="csv">CSV (Raw Telemetry)</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleCloudSync}
                  disabled={cloudSyncing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                >
                  <Cloud className={`w-4 h-4 mr-2 ${cloudSyncing ? 'animate-spin' : ''}`} />
                  {cloudSyncing ? 'Synchronizing to Cloud Data Room...' : 'Archive Report to Cloud Data Room'}
                </Button>

                {cloudSyncResult && (
                  <div className="p-3.5 rounded-xl bg-black/60 border border-blue-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold">ARCHIVE CONFIRMED</span>
                      <Badge className="bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                        ID: {cloudSyncResult.archiveId}
                      </Badge>
                    </div>
                    <div className="text-zinc-300">
                      Destination: <strong className="text-white">{cloudSyncResult.destination}</strong>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono break-all">
                      URI: {cloudSyncResult.storageUri}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono border-t border-white/5 pt-1">
                      SHA-256 Checksum: {cloudSyncResult.sha256Checksum}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* PILLAR 6: MEMBERSHIP & ENTITLEMENTS (WHOP V5 & STRIPE) */}
      {activePillar === 'membership' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Whop v5 License Key Management */}
            <Card className="lg:col-span-2 bg-zinc-900/50 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Key className="w-5 h-5 text-orange-400" />
                      Whop API v5 & Stripe Entitlement Engine
                    </CardTitle>
                    <CardDescription>
                      Dynamic tier verification, license key provisioning, and instant tool unlock
                    </CardDescription>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40 text-xs font-mono">
                    API v5 ACTIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">Whop License Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={licenseInput}
                      onChange={e => setLicenseInput(e.target.value)}
                      placeholder="WHOP-..."
                      className="bg-black/50 border-white/10 text-white font-mono text-xs flex-1"
                    />
                    <Button 
                      onClick={handleVerifyLicense} 
                      disabled={verifyingLicense}
                      className="bg-orange-600 hover:bg-orange-500 text-white text-xs"
                    >
                      {verifyingLicense ? 'Verifying...' : 'Verify Entitlements'}
                    </Button>
                  </div>
                </div>

                {/* Tier Features & Capabilities unlocked */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Active Entitlements: {membershipData?.membershipTier || 'Institutional Prime Tier'}
                    </span>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
                      75% Fee Discount Applied
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    {[
                      'Sub-second L2/L3 order book depth',
                      'Direct FIX 4.4 / 5.0 execution gateway',
                      'Automated Smart Order Router (TWAP/VWAP/Iceberg)',
                      'Telegram, Discord & Slack instant signal dispatch',
                      'One-click Google Drive & S3 cloud sync',
                      'Chainalysis KYT & Sumsub real-time screening',
                      'Pan-African multi-sovereign clearing (ZAR, NGN, KES, EGP)'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-white/5 pt-3">
                  <span>Billing Provider: <strong className="text-white">Whop v5 + Stripe Merchant</strong></span>
                  <span>License Expiry: <strong className="text-zinc-200 font-mono">Dec 31, 2027</strong></span>
                </div>
              </CardContent>
            </Card>

            {/* Tier Comparison & Upgrade Flow */}
            <Card className="bg-gradient-to-br from-orange-950/30 via-zinc-900/60 to-black border-orange-500/20 flex flex-col justify-between">
              <CardHeader>
                <Badge className="w-fit bg-orange-500 text-black font-bold text-[10px] mb-1">
                  CURRENT TIER
                </Badge>
                <CardTitle className="text-white text-lg">Institutional Prime</CardTitle>
                <CardDescription className="text-zinc-400">
                  Full API access, dark pool liquidity routing, and dedicated FIX engine session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold text-white font-mono">
                  $2,499 <span className="text-xs text-zinc-500 font-normal">/ month</span>
                </div>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>0.00% execution markup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Unlimited multi-channel alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Direct phone/WhatsApp priority desk</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  onClick={() => alert('Whop Checkout Portal initialized: Your tier is already verified as Prime.')}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs"
                >
                  Manage Subscription in Whop
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
