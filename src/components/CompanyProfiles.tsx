import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, AlertTriangle, FileText, Activity, Users, Globe, Database, Shield, Search, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { generateCompanyProfile } from '../services/geminiService';

interface ProfileData {
  overview: string;
  financialHealth: string;
  riskAnalysis: string;
  recentDevelopments: string[];
}

export function CompanyProfiles() {
  const [companyName, setCompanyName] = useState('Naspers');
  const [searchInput, setSearchInput] = useState('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async (name: string) => {
    setIsLoading(true);
    const data = await generateCompanyProfile(name);
    setProfile(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile(companyName);
  }, [companyName]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCompanyName(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 inset-x-0 h-1 bg-[#0066FF]" />
      
      <div className="p-6 border-b border-white/10 bg-white/[0.01] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/20 flex items-center justify-center border border-white/10">
            <Building2 className="w-6 h-6 text-[#0066FF]" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight text-xl">{companyName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Company Profile</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search company..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#0066FF]/50"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
          <button className="px-4 py-2 bg-[#0066FF] hover:bg-[#0066FF]/80 text-white rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(0,102,255,0.3)] whitespace-nowrap">
            Add to Watchlist
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#0066FF]" />
            <p>Generating comprehensive profile for {companyName}...</p>
          </div>
        ) : profile ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00C896]" />
                  Financial Health
                </span>
                <p className="text-sm text-white mt-1 leading-relaxed">{profile.financialHealth}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0066FF]" />
                  Market Position
                </span>
                <p className="text-sm text-white mt-1 leading-relaxed">{profile.overview}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FF3B3B]" />
                  Risk Analysis
                </span>
                <p className="text-sm text-white mt-1 leading-relaxed">{profile.riskAnalysis}</p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="p-6 rounded-2xl bg-[#0066FF]/5 border border-white/10 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                <Database className="w-4 h-4 text-[#0066FF]" />
                AI Deep-Dive Summary
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed relative z-10">
                {profile.overview}
              </p>
              <div className="mt-4 flex gap-2 relative z-10">
                <span className="px-2 py-1 rounded-md bg-black/30 border border-white/5 text-[10px] text-zinc-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Source: AI Generated Analysis
                </span>
              </div>
            </div>

            {/* Recent Filings & Transcripts */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-400" />
                Recent Developments
              </h3>
              <div className="space-y-2">
                {profile.recentDevelopments.map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] group-hover:bg-[#0066FF]/20 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-[#0066FF] transition-colors">{doc}</div>
                        <div className="text-xs text-zinc-500">Recent</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
            <p>Failed to load profile. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
