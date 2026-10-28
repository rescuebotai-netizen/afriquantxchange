import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, AlertCircle, Key, RefreshCw, Server, 
  ExternalLink, ShieldCheck, Clock, Zap, Code2, ChevronDown, ChevronUp 
} from 'lucide-react';

interface WhopVerificationResult {
  valid: boolean;
  configured: boolean;
  keySource: 'environment' | 'user_input' | 'none';
  maskedKey?: string;
  statusCode?: number;
  latencyMs?: number;
  message: string;
  details?: {
    accountType?: string;
    id?: string;
    email?: string;
    username?: string;
    name?: string;
    companyId?: string;
    raw?: any;
  };
  timestamp: string;
}

export function WhopIntegrationCard() {
  const [loading, setLoading] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [isEnvConfigured, setIsEnvConfigured] = useState<boolean | null>(null);
  const [verificationResult, setVerificationResult] = useState<WhopVerificationResult | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/whop/status');
      const json = await res.json();
      if (json.success) {
        setIsEnvConfigured(json.isEnvConfigured);
      }
    } catch (err) {
      console.error('Failed to check Whop status:', err);
    }
  };

  const handleVerifyActiveKey = async () => {
    setLoading(true);
    setVerificationResult(null);
    try {
      const res = await fetch('/api/whop/verify');
      const json = await res.json();
      if (json.data) {
        setVerificationResult(json.data);
      } else {
        setVerificationResult({
          valid: false,
          configured: false,
          keySource: 'none',
          message: json.error || 'Verification request returned no response data.',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setVerificationResult({
        valid: false,
        configured: false,
        keySource: 'none',
        message: err.message || 'Network error attempting to verify Whop API Key.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestCustomKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKey.trim()) return;

    setLoading(true);
    setVerificationResult(null);
    try {
      const res = await fetch('/api/whop/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: customKey.trim() }),
      });
      const json = await res.json();
      if (json.data) {
        setVerificationResult(json.data);
      }
    } catch (err: any) {
      setVerificationResult({
        valid: false,
        configured: false,
        keySource: 'user_input',
        message: err.message || 'Failed to submit test key.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/60 border-white/10 overflow-hidden shadow-2xl">
      <CardHeader className="border-b border-white/5 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-white text-lg font-bold flex items-center gap-2 uppercase tracking-wide">
                Whop API Integration
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Validate and verify Whop API credentials for digital products, memberships, and user licensing.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEnvConfigured === true ? (
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 gap-1.5 py-1 px-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Configured in .env
              </Badge>
            ) : isEnvConfigured === false ? (
              <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10 gap-1.5 py-1 px-3">
                <AlertCircle className="w-3.5 h-3.5" />
                WHOP_API_KEY Not Set
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Verification Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Key Verification */}
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-zinc-400" />
                  Active Server Integration
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">WHOP_API_KEY</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tests the environment key injected on the server via <code className="text-white bg-white/5 px-1 py-0.5 rounded font-mono">process.env.WHOP_API_KEY</code>.
              </p>
            </div>

            <Button
              onClick={handleVerifyActiveKey}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Key...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-black" />
                  Verify Server WHOP_API_KEY
                </>
              )}
            </Button>
          </div>

          {/* Test Custom Key Form */}
          <form onSubmit={handleTestCustomKey} className="bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  Test Custom Key
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">LIVE SIMULATION</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                Directly test any Whop API key against <code className="text-white bg-white/5 px-1 py-0.5 rounded font-mono">https://api.whop.com/v5</code>.
              </p>
              <Input
                type="password"
                placeholder="Enter Whop API Key (e.g., whop_...)"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="bg-black/60 border-white/10 text-white placeholder:text-zinc-600 font-mono text-xs py-2"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !customKey.trim()}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Test Submitted Key
            </Button>
          </form>
        </div>

        {/* Results Panel */}
        {verificationResult && (
          <div className={`rounded-2xl border p-5 transition-all space-y-4 ${
            verificationResult.valid 
              ? 'bg-emerald-500/5 border-emerald-500/20' 
              : 'bg-rose-500/5 border-rose-500/20'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {verificationResult.valid ? (
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${
                    verificationResult.valid ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {verificationResult.valid ? 'Integration Status: Valid & Active' : 'Integration Status: Verification Failed'}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-0.5">{verificationResult.message}</p>
                </div>
              </div>

              {verificationResult.statusCode && (
                <Badge variant="outline" className={`font-mono text-xs py-1 px-2.5 ${
                  verificationResult.valid ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                }`}>
                  HTTP {verificationResult.statusCode}
                </Badge>
              )}
            </div>

            {/* Performance Metrics & Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 font-mono text-xs">
              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
                <span className="text-[9px] text-zinc-500 block uppercase font-sans font-bold">Latency</span>
                <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  {verificationResult.latencyMs !== undefined ? `${verificationResult.latencyMs} ms` : 'N/A'}
                </span>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
                <span className="text-[9px] text-zinc-500 block uppercase font-sans font-bold">Key Source</span>
                <span className="text-white font-bold uppercase text-[11px] mt-0.5">
                  {verificationResult.keySource}
                </span>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
                <span className="text-[9px] text-zinc-500 block uppercase font-sans font-bold">Masked Key</span>
                <span className="text-zinc-300 font-bold text-[10px] mt-0.5 block truncate">
                  {verificationResult.maskedKey || 'N/A'}
                </span>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
                <span className="text-[9px] text-zinc-500 block uppercase font-sans font-bold">Account Scope</span>
                <span className="text-white font-bold text-[11px] mt-0.5">
                  {verificationResult.details?.accountType || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Details from Whop API if available */}
            {verificationResult.details && (
              <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 space-y-2 text-xs font-mono">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-sans border-b border-white/5 pb-1 mb-2">
                  Whop Entity Metadata
                </div>
                {verificationResult.details.id && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Whop ID:</span>
                    <span className="text-white font-bold">{verificationResult.details.id}</span>
                  </div>
                )}
                {verificationResult.details.name && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Name / Organization:</span>
                    <span className="text-white font-bold">{verificationResult.details.name}</span>
                  </div>
                )}
                {verificationResult.details.email && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Email:</span>
                    <span className="text-white font-bold">{verificationResult.details.email}</span>
                  </div>
                )}
                {verificationResult.details.username && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Username:</span>
                    <span className="text-white font-bold">{verificationResult.details.username}</span>
                  </div>
                )}
              </div>
            )}

            {/* Raw JSON Accordion */}
            {verificationResult.details?.raw && (
              <div>
                <button
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white font-mono uppercase tracking-wider transition-colors mt-2"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  {showRawJson ? 'Hide Raw Response' : 'View Raw Whop API Response JSON'}
                  {showRawJson ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showRawJson && (
                  <pre className="mt-2 p-3 bg-black border border-white/10 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-48">
                    {JSON.stringify(verificationResult.details.raw, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* Documentation / Guide */}
        <div className="bg-neutral-950 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">How to get a Whop API Key</h5>
            <p className="text-xs text-zinc-400 max-w-xl">
              Log into your <strong className="text-white">Whop Developer Dashboard</strong> under Company Settings &gt; Developer &gt; API Keys to generate a Bot or User access token.
            </p>
          </div>
          <a
            href="https://whop.com/developer"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            Developer Portal
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
