import React, { useState, useRef, useEffect } from 'react';
import { 
  BrainCircuit, Send, Sparkles, TrendingUp, AlertTriangle, Info, Bot, User,
  Search, BarChart2, Building2, FolderKanban, Cpu, Shield, FileText, Globe, 
  Clock, MessageSquare, Plus, Settings, ChevronRight, FileSearch, LineChart, 
  PieChart, Activity, Zap, Database, Users, Lock, Download, Share2, Terminal,
  Paperclip, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { StockScreener } from './StockScreener';
import { CompanyProfiles } from './CompanyProfiles';
import { DueDiligence } from './DueDiligence';
import { AutonomousAgents } from './AutonomousAgents';
import { MarketIntelligence } from './MarketIntelligence';
import { InvestmentCopilot } from './InvestmentCopilot';
import { TradingEngine } from './TradingEngine';
import { GlobalWallet } from './GlobalWallet';
import { generateFinancialAnalysis } from '../services/geminiService';

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    content: 'Welcome to AfriQuantX Institutional Advisory & Wealth Intelligence. I am your senior quantitative advisor, equipped with deep real-time models across African Stock Markets (JSE, NGX, NSE Kenya), Commodities, Forex corridors (PAPSS & SARB allowances), and global macroeconomic/geopolitical risk frameworks. How may I assist your portfolio strategy today?',
    timestamp: '10:00 AM',
    citations: ['AfriQuantX Multi-Asset Telemetry Engine']
  }
];

const suggestions = [
  "Analyze JSE Top 40 vs NGX 30 multi-asset valuation spreads",
  "Evaluate Zambian Copperbelt & SA Platinum group commodities outlook",
  "Assess PAPSS intra-African currency settlement vs USD liquidity constraints",
  "Model AfCFTA supply chain expansion impact on Kenyan & Egyptian banking sectors",
  "Simulate SARB & CBN monetary policy divergence on corporate bond yields"
];

const spaces = [
  { id: 'research', name: 'Investment Research', icon: Search, count: 12 },
  { id: 'screener', name: 'Stock Screener', icon: BarChart2, count: 5 },
  { id: 'profiles', name: 'Company Profiles', icon: Building2, count: 28 },
  { id: 'dataroom', name: 'Due Diligence', icon: FolderKanban, count: 3 },
  { id: 'agents', name: 'Autonomous Agents', icon: Cpu, count: 4 },
  { id: 'copilot', name: 'AI Investment Copilot', icon: Zap, count: 2 },
  { id: 'trading', name: 'Trading Engine', icon: Activity, count: 0 },
  { id: 'wallet', name: 'Global Wallet', icon: Database, count: 3 },
];

export function AIAdvisor({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSpace, setActiveSpace] = useState('research');
  const [activeAgents, setActiveAgents] = useState(['Research Agent', 'Data Analyst']);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: []
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Call Gemini API
      const aiResponseData = await generateFinancialAnalysis(newUserMsg.content);

      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: aiResponseData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: aiResponseData.citations || []
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: "I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: []
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: `Uploaded document: **${file.name}** for analysis.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: []
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    // Simulate AI analysis of the document
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: `I have analyzed **${file.name}**. Here is the summary and key flagged information:\n\n**Summary:** The document outlines the Q3 financial performance and strategic initiatives. Revenue grew by 15% quarter-over-quarter, driven by enterprise sales.\n\n**Key Information Flagged:**\n- ⚠️ **Legal:** Clause 4.2 contains a non-standard indemnity provision that increases liability.\n- ✅ **Financials:** Cash runway extended to 24 months.\n- ℹ️ **Market:** New competitor entry noted in the APAC region.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: []
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2500);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderActiveSpace = () => {
    switch (activeSpace) {
      case 'screener':
        return <StockScreener />;
      case 'profiles':
        return <CompanyProfiles />;
      case 'dataroom':
        return <DueDiligence />;
      case 'agents':
        return <AutonomousAgents />;
      case 'copilot':
        return <InvestmentCopilot />;
      case 'trading':
        return <TradingEngine />;
      case 'wallet':
        return <GlobalWallet />;
      case 'research':
      default:
        return (
          <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl p-6 overflow-y-auto backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Research Dashboard</h2>
                <p className="text-zinc-400 text-sm mt-1">Overview of market signals and company intelligence.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors">
                  Export Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Company Profile Builder Snippet */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
              >
                <h3 className="text-white font-bold mb-6 flex items-center gap-3 tracking-tight relative z-10 text-lg">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  Company Intelligence
                </h3>
                <div className="space-y-4 relative z-10">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search company or ticker..." 
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Naspers', 'Standard Bank', 'Dangote Cement', 'Safaricom', 'MTN Group'].map(company => (
                      <span key={company} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 cursor-pointer hover:bg-white/10 hover:text-white transition-colors">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Market Data */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
              >
                <h3 className="text-white font-bold mb-6 flex items-center gap-3 tracking-tight relative z-10 text-lg">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <LineChart className="w-5 h-5 text-emerald-400" />
                  </div>
                  Market Signals
                </h3>
                <div className="space-y-3 relative z-10">
                  {[
                    { label: 'Tech Sector Sentiment', value: 'Bullish', trend: '+12%', color: 'text-emerald-400' },
                    { label: 'Fintech Volatility', value: 'High', trend: 'Watch', color: 'text-amber-400' },
                    { label: 'Technology Growth', value: 'Steady', trend: '+5%', color: 'text-blue-400' }
                  ].map((signal, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors flex justify-between items-center">
                      <span className="text-sm font-medium text-zinc-300">{signal.label}</span>
                      <div className="text-right">
                        <div className={cn("text-sm font-bold", signal.color)}>{signal.value}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{signal.trend}</div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => setActiveSpace('screener')}
                    className="w-full py-3 mt-4 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    View Full Screener
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar - Spaces & Workflows */}
      <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0">
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-4 backdrop-blur-xl shadow-2xl flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-white/10">
              <Terminal className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold tracking-tight">NXG Terminal</h2>
              <p className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Online
              </p>
            </div>
          </div>

          <div className="space-y-1 flex-1">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">Workspaces</p>
            {spaces.map((space) => (
              <button
                key={space.id}
                onClick={() => setActiveSpace(space.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  activeSpace === space.id 
                    ? "bg-white/10 text-white shadow-sm border border-white/10" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <space.icon className={cn("w-4 h-4", activeSpace === space.id ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-400")} />
                  <span className="text-sm font-medium">{space.name}</span>
                </div>
                <span className="text-xs font-medium bg-black/30 px-2 py-0.5 rounded-md border border-white/5">
                  {space.count}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200 border border-transparent">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderActiveSpace()}
      </div>

      {/* Persistent AI Chat Panel */}
      <div className="w-full lg:w-[400px] flex flex-col bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden relative backdrop-blur-xl shadow-2xl shrink-0">
        <div className="absolute top-0 inset-x-0 h-1 bg-blue-500" />
        
        {/* Chat Header */}
        <div className="p-5 border-b border-white/10 bg-white/[0.01] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold tracking-tight text-md flex items-center gap-2">
                Copilot
                <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-[9px] text-blue-400 uppercase tracking-wider font-bold">
                  Active
                </span>
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-zinc-400">Context:</span>
                <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-300 capitalize">
                  {activeSpace === 'dataroom' ? 'Due Diligence' : activeSpace}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                key={msg.id}
                className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-black' 
                    : 'bg-blue-500/30 text-blue-300 border border-blue-500/30 backdrop-blur-md'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-black rounded-tr-sm font-medium' 
                      : 'bg-white/5 text-zinc-200 border border-white/10 rounded-tl-sm backdrop-blur-md'
                  }`}>
                    {/* Render basic markdown-like formatting */}
                    <div dangerouslySetInnerHTML={{ 
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>') 
                    }} />
                    
                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                        {msg.citations.map((citation, idx) => (
                          <div key={idx} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/30 border border-white/5 text-[10px] text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 cursor-pointer transition-colors">
                            <FileText className="w-2.5 h-2.5" />
                            {citation}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1.5 px-1 font-medium tracking-wide">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-3 max-w-[90%]"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/30 text-blue-300 border border-blue-500/30 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm backdrop-blur-md flex flex-col gap-2 shadow-lg min-w-[150px]">
                  <div className="flex items-center gap-2 text-[11px] text-blue-400 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Analyzing...
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-white/[0.01] relative z-10">
          {activeSpace === 'dataroom' && (
            <div className="mb-3">
               <span className="text-[10px] text-emerald-400 font-medium px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5 w-fit">
                 <Info className="w-3 h-3" />
                 Due Diligence Mode: Upload documents for instant AI analysis
               </span>
            </div>
          )}
          <form onSubmit={handleSend} className="relative flex items-center group">
            
            <div className="absolute left-3 flex items-center gap-1.5 z-20">
              <label className="p-1.5 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer">
                <Paperclip className="w-4 h-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                />
              </label>
              <div className="w-px h-4 bg-white/10" />
            </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeSpace === 'dataroom' ? "Ask a question or upload a document..." : "Ask your financial copilot..."}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-300 relative z-10 backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 p-2 bg-blue-500 hover:bg-blue-400 disabled:bg-white/5 disabled:text-zinc-500 text-white rounded-lg transition-all duration-300 relative z-20 disabled:border disabled:border-white/10 shadow-[0_0_10px_rgba(59,130,246,0.3)] disabled:shadow-none"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
