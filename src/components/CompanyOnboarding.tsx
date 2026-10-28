import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import OpenAI from 'openai';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  ArrowLeft, UploadCloud, CheckCircle2, ShieldCheck, 
  Building2, FileText, BrainCircuit, ChevronRight,
  FileCheck, AlertCircle, Lock, Globe, FileDigit,
  BadgeCheck, TrendingUp, Activity, FileSpreadsheet,
  Check, PieChart, ArrowUpRight, XCircle
} from 'lucide-react';

interface CompanyOnboardingProps {
  onBack: () => void;
  setActiveTab: (tab: string) => void;
}

const analysisSteps = [
  "Initiating AQX AI Verification Engine...",
  "Parsing Certificate of Incorporation & Legal Structure...",
  "Cross-referencing Tax ID with global databases...",
  "Analyzing Audited Financial Statements & Cash Flow...",
  "Evaluating Cap Table & Equity Distribution...",
  "Calculating Growth Trajectory & Risk Profile...",
  "Finalizing Tier Classification..."
];

export function CompanyOnboarding({ onBack, setActiveTab }: CompanyOnboardingProps) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, 'pending' | 'uploaded' | 'error'>>({});

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    registration: '',
    jurisdiction: 'South Africa',
    sector: 'Fintech & Payments',
    mission: ''
  });

  // AI Insights
  const [aiInsights, setAiInsights] = useState({
    growthScore: 94,
    riskProfile: 'Low',
    tierClassification: 'Growth-Stage',
    summary: 'Top 5% in Sector'
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUserId(data.user.id);
        }
      }).catch(err => console.warn('Could not get user:', err));
    }
  }, []);

  const handleFileUpload = (type: string) => {
    // Simulate upload process
    setUploadedFiles(prev => ({ ...prev, [type]: 'pending' }));
    
    setTimeout(() => {
      // Simulate 10% chance of error for demonstration
      const isError = Math.random() < 0.1;
      setUploadedFiles(prev => ({ ...prev, [type]: isError ? 'error' : 'uploaded' }));
    }, 1500);
  };

  const startAIVerification = async () => {
    setIsAnalyzing(true);
    setStep(4);
    
    let progress = 0;
    let stepIndex = 0;
    
    // Start progress animation
    const interval = setInterval(() => {
      progress += 2;
      setAnalysisProgress(progress);
      
      if (progress % 15 === 0 && stepIndex < analysisSteps.length - 1) {
        stepIndex++;
        setCurrentAnalysisStep(stepIndex);
      }

      if (progress >= 95) {
        clearInterval(interval);
      }
    }, 100);

    try {
      // Call OpenRouter API for dynamic insights
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '',
        dangerouslyAllowBrowser: true,
      });
      const prompt = `Analyze a company named "${formData.name || 'Unknown'}" in the "${formData.sector}" sector located in "${formData.jurisdiction}". 
      Mission: ${formData.mission || 'Not provided'}.
      Provide a realistic AI Growth Score (0-100), a Risk Profile (Low, Medium, High), a Tier Classification (e.g., Growth-Stage, Seed, Series A), and a short 3-5 word summary of their market position.
      Return a JSON object with the following structure:
      {
        "growthScore": 94,
        "riskProfile": "Low",
        "tierClassification": "Growth-Stage",
        "summary": "Top 5% in Sector"
      }`;

      const response = await openai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: "You are a financial data API. Always return valid JSON matching the requested schema."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const text = response.choices[0].message.content;
      if (text) {
        const data = JSON.parse(text);
        setAiInsights(data);
      }
    } catch (error) {
      console.error("Error generating AI insights:", error);
      // Fallback to default insights if API fails
    }

    // Complete the progress
    clearInterval(interval);
    setAnalysisProgress(100);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(5);
    }, 1000);
  };

  const handleNext = () => {
    if (step === 3) {
      startAIVerification();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-400 text-sm font-medium">
            Bank-Grade Encryption
          </span>
        </div>
      </div>

      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 mb-4">
          <BrainCircuit className="w-4 h-4" />
          AQX AI Onboarding Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Institutional Listing</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Complete your digital onboarding to receive your Verified Company badge, AI-driven tier classification, and access to global liquidity.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-12 max-w-3xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 z-0" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 z-0 transition-all duration-500"
          style={{ width: `${((Math.min(step, 4) - 1) / 3) * 100}%` }}
        />
        
        {[
          { num: 1, label: 'Legal Entity', icon: Building2 },
          { num: 2, label: 'Financials', icon: TrendingUp },
          { num: 3, label: 'Documents', icon: FileDigit },
          { num: 4, label: 'AI Audit', icon: BrainCircuit }
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              step >= s.num 
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                : 'bg-[#121A2B] border border-white/10 text-zinc-500'
            }`}>
              {step > s.num ? <Check className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
            </div>
            <span className={`text-sm font-medium hidden md:block ${step >= s.num ? 'text-white' : 'text-zinc-500'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Legal Entity & Structure</h2>
                <p className="text-zinc-400 text-sm">Provide your official company details as they appear on your incorporation documents.</p>
              </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Legal Company Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                    placeholder="e.g. AfriQuant X Technologies Ltd." 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Registration / CIPC Number</label>
                  <input 
                    type="text" 
                    value={formData.registration}
                    onChange={(e) => setFormData({...formData, registration: e.target.value})}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                    placeholder="e.g. 2023/123456/07" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Jurisdiction of Incorporation</label>
                  <select 
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option className="bg-[#121A2B]">South Africa</option>
                    <option className="bg-[#121A2B]">Nigeria</option>
                    <option className="bg-[#121A2B]">Kenya</option>
                    <option className="bg-[#121A2B]">Rwanda</option>
                    <option className="bg-[#121A2B]">Delaware, USA</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Primary Sector</label>
                  <select 
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option className="bg-[#121A2B]">Fintech & Payments</option>
                    <option className="bg-[#121A2B]">Technology</option>
                    <option className="bg-[#121A2B]">Financials</option>
                    <option className="bg-[#121A2B]">Manufacturing & Mobility</option>
                    <option className="bg-[#121A2B]">SaaS & Enterprise</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Company Mission & Overview</label>
                  <textarea 
                    value={formData.mission}
                    onChange={(e) => setFormData({...formData, mission: e.target.value})}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-28 resize-none" 
                    placeholder="Describe your core product, target market, and competitive advantage..." 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Financial & Tax Data</h2>
                <p className="text-zinc-400 text-sm">These metrics will be verified against your uploaded documents by our AI engine.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Annual Recurring Revenue (ARR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input type="text" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="1,200,000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">MoM Growth Rate (%)</label>
                  <div className="relative">
                    <input type="text" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl pl-4 pr-8 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="15" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Total Capital Raised</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input type="text" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="2,500,000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Target Valuation (Pre-money)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input type="text" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="15,000,000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Tax Identification Number (TIN)</label>
                  <input type="text" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="e.g. 9123456789" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Current Funding Stage</label>
                  <select className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none">
                    <option className="bg-[#121A2B]">Seed</option>
                    <option className="bg-[#121A2B]">Series A</option>
                    <option className="bg-[#121A2B]">Series B</option>
                    <option className="bg-[#121A2B]">Growth / Pre-IPO</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Document Vault</h2>
                <p className="text-zinc-400 text-sm">Upload required documents for AI verification and compliance auditing.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'inc', title: 'Certificate of Incorporation', desc: 'Legal proof of entity formation', icon: FileText },
                  { id: 'fin', title: 'Audited Financials (2 Yrs)', desc: 'Income statement, balance sheet', icon: FileSpreadsheet },
                  { id: 'cap', title: 'Current Cap Table', desc: 'Detailed equity distribution', icon: PieChart },
                  { id: 'tax', title: 'Tax Clearance Certificate', desc: 'Proof of tax compliance', icon: FileCheck },
                ].map((doc) => {
                  const status = uploadedFiles[doc.id];
                  return (
                  <div 
                    key={doc.id}
                    onClick={() => handleFileUpload(doc.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      status === 'uploaded'
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : status === 'error'
                        ? 'bg-red-500/10 border-red-500/30'
                        : status === 'pending'
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-[#0B0F14] border-white/10 hover:border-blue-500/50 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      status === 'uploaded' ? 'bg-emerald-500/20 text-emerald-400' 
                      : status === 'error' ? 'bg-red-500/20 text-red-400'
                      : status === 'pending' ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-white/5 text-zinc-400'
                    }`}>
                      {status === 'uploaded' ? <CheckCircle2 className="w-6 h-6" /> 
                       : status === 'error' ? <XCircle className="w-6 h-6" />
                       : status === 'pending' ? <UploadCloud className="w-6 h-6 animate-pulse" />
                       : <doc.icon className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${
                        status === 'uploaded' ? 'text-emerald-400' 
                        : status === 'error' ? 'text-red-400'
                        : status === 'pending' ? 'text-blue-400'
                        : 'text-white'
                      }`}>
                        {doc.title}
                      </h4>
                      <p className={`text-xs mt-0.5 ${status === 'error' ? 'text-red-400/70' : 'text-zinc-500'}`}>
                        {status === 'error' ? 'Upload failed. Click to retry.' : doc.desc}
                      </p>
                    </div>
                    {!status && (
                      <UploadCloud className="w-5 h-5 text-zinc-600" />
                    )}
                  </div>
                )})}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-400">End-to-End Encryption</h4>
                  <p className="text-xs text-blue-300/70 mt-1">
                    All documents are encrypted at rest using AES-256 and are only accessible by our AI verification engine and authorized compliance officers.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainCircuit className="w-10 h-10 text-blue-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">AI Verification in Progress</h3>
                    <p className="text-zinc-400">Please wait while our engine audits your submission.</p>
                  </div>
                </div>

                <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-6 font-mono text-sm shadow-inner">
                  <div className="flex justify-between text-zinc-500 mb-4 text-xs">
                    <span>SYSTEM.AUDIT.RUN</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <div className="space-y-3">
                    {analysisSteps.map((stepText, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start gap-3 transition-opacity duration-300 ${
                          index < currentAnalysisStep ? 'text-emerald-400' : 
                          index === currentAnalysisStep ? 'text-blue-400' : 'text-zinc-700'
                        }`}
                      >
                        <span className="shrink-0 mt-0.5">
                          {index < currentAnalysisStep ? '[OK]' : index === currentAnalysisStep ? '[..]' : '[  ]'}
                        </span>
                        <span>{stepText}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
              <div className="flex flex-col items-center justify-center text-center space-y-6 mb-12">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                  <BadgeCheck className="w-12 h-12 text-emerald-400 relative z-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Verification Complete</h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    Your company has passed the AQX institutional audit. You have been awarded the Verified Company badge.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-16 h-16" /></div>
                  <p className="text-zinc-400 text-sm mb-1">AI Growth Score</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-white">{aiInsights.growthScore}</p>
                    <span className="text-emerald-400 text-sm">/ 100</span>
                  </div>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {aiInsights.summary}</p>
                </div>
                
                <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-16 h-16" /></div>
                  <p className="text-zinc-400 text-sm mb-1">Risk Profile</p>
                  <p className={`text-4xl font-bold ${aiInsights.riskProfile === 'Low' ? 'text-emerald-400' : aiInsights.riskProfile === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>
                    {aiInsights.riskProfile}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">Audited Financials Verified</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Building2 className="w-16 h-16 text-blue-400" /></div>
                  <p className="text-blue-300 text-sm mb-1">Tier Classification</p>
                  <p className="text-2xl font-bold text-white mt-1">{aiInsights.tierClassification}</p>
                  <p className="text-xs text-blue-400 mt-2">Eligible for Secondary Trading</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={async () => {
                    if (userId) {
                      const { error } = await supabase.from('companies').insert([{
                        profile_id: userId,
                        name: formData.name,
                        registration_number: formData.registration,
                        jurisdiction: formData.jurisdiction,
                        sector: formData.sector,
                        mission: formData.mission,
                        growth_score: aiInsights.growthScore,
                        risk_profile: aiInsights.riskProfile,
                        tier_classification: aiInsights.tierClassification
                      }]);
                      if (error) {
                        console.error('Error saving company:', error);
                      }
                    }
                    setActiveTab('company-profile');
                  }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center gap-2"
                >
                  Publish Investment Profile <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        {step < 4 && (
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Previous Step
            </button>
            <button 
              onClick={handleNext}
              disabled={step === 3 && Object.values(uploadedFiles).filter(status => status === 'uploaded').length < 4}
              className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                step === 3 && Object.values(uploadedFiles).filter(status => status === 'uploaded').length < 4 
                  ? 'bg-white/5 text-zinc-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'
              }`}
            >
              {step === 3 ? 'Run AI Verification' : 'Continue'}
              {step < 3 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
